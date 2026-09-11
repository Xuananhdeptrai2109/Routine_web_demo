/**
 * Dịch vụ AI Fashion Stylist Thông minh Thế hệ Mới - Routine
 * Tích hợp Google Gemini AI + Chuẩn hóa Ngữ nghĩa Thời trang (Thesaurus) + Dynamic Outfit Pairing
 */

const prisma = require('../config/prisma');
const outfitService = require('./outfitService');
const { normalizeFashionQuery } = require('../utils/fashionThesaurus');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest'];

/**
 * Gọi Google Gemini REST API hỗ trợ chat đa lượt & generation config
 */
async function callGeminiApi({ contents, systemInstruction, model = 'gemini-flash-lite-latest', temperature = 0.7, responseMimeType = null }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const modelsToTry = [model, ...GEMINI_MODELS.filter((m) => m !== model)];

  for (const targetModel of modelsToTry) {
    const url = `${GEMINI_API_URL}/${targetModel}:generateContent?key=${apiKey}`;
    const body = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: 800,
        ...(responseMimeType ? { responseMimeType } : {}),
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(4000),
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`[aiService] Gemini API (${targetModel}) đạt giới hạn hạn mức (429) -> chuyển sang phân tích thông minh cục bộ.`);
          break; // Đã chạm giới hạn quota, dừng ngay để không làm chậm trải nghiệm người dùng
        }
        console.warn(`[aiService] Gemini API (${targetModel}) response not OK:`, response.status);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      console.warn(`[aiService] Gemini API (${targetModel}) tạm thời gián đoạn (${err.message}) -> chuyển sang phân tích thông minh cục bộ.`);
      break;
    }
  }

  return null;
}

/**
 * Phân tích chuỗi JSON an toàn từ kết quả của LLM
 */
function safeJsonParse(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  cleaned = cleaned.replace(/\/\/.*$/gm, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const target = jsonMatch ? jsonMatch[0] : cleaned;
  try {
    return JSON.parse(target);
  } catch (e1) {
    try {
      const fixed = target.replace(/([^\\])\n/g, '$1\\n');
      return JSON.parse(fixed);
    } catch (e2) {
      return null;
    }
  }
}

/**
 * Kiểm tra xem tin nhắn người dùng có phải là lời chào hỏi / nói chuyện thông thường không
 */
function isGreetingOrGeneralChat(text) {
  if (!text || typeof text !== 'string') return true;
  const lower = text.trim().toLowerCase();

  const pureGreetings = [
    'chào', 'chao', 'xin chào', 'xin chao', 'hello', 'hi', 'hey', 'alo', 'hế lô', 'he lo',
    'chào bạn', 'chao ban', 'chào em', 'chao em', 'chào shop', 'chao shop',
    'bạn là ai', 'ban la ai', 'em là ai', 'em la ai', 'routine ơi', 'routine oi',
    'tư vấn giúp tôi', 'tu van giup toi', 'giúp tôi với', 'giup toi voi',
    'bắt đầu', 'bat dau', 'help', 'hi bạn', 'hi ban', 'chào nhé', 'chào ad'
  ];

  if (pureGreetings.includes(lower)) return true;

  const fashionKeywords = [
    'áo', 'ao', 'quần', 'quan', 'váy', 'vay', 'đầm', 'dam', 'polo', 'jean', 'set', 'outfit',
    'phối', 'mặc', 'công sở', 'tiệc', 'hẹn hò', 'dạo phố', 'khoác', 'blazer', 'hoodie', 'short',
    'mua', 'tìm', 'chọn', 'size', 'màu', 'form', 'rộng', 'ôm', 'lớn', 'đổi', 'thay'
  ];

  const startsWithGreeting = pureGreetings.some((g) => lower.startsWith(g + ' ') || lower.startsWith(g + ','));
  const hasFashion = fashionKeywords.some((kw) => lower.includes(kw));

  if (startsWithGreeting && !hasFashion) return true;
  if (lower.includes('bạn là ai') || lower.includes('bạn có thể làm gì') || lower.includes('chức năng của bạn')) return true;

  return false;
}

/**
 * Phân tích và chuẩn hóa ý định người dùng (Intent Extraction)
 * Kết hợp Gemini AI (gemini-3.6-flash) với từ điển fashionThesaurus và ngữ cảnh đa lượt
 */
async function extractFashionIntent(userMessage, history = []) {
  const isGreeting = isGreetingOrGeneralChat(userMessage);

  // 1. Phân tích nền bằng từ điển chuẩn hóa tiếng Việt
  const ruleBased = normalizeFashionQuery(userMessage);

  // Thu thập các sản phẩm và outfit đã được gợi ý trong lịch sử
  const previousProducts = [];
  const previousOutfitIds = [];
  history.forEach((h) => {
    if (Array.isArray(h.products)) {
      previousProducts.push(...h.products);
    }
    if (h.outfitId) {
      previousOutfitIds.push(h.outfitId);
    }
  });

  const lower = userMessage.toLowerCase();
  let ruleRequestType = 'new_outfit';
  const ruleExcludeProducts = [];
  const ruleKeepProducts = [];

  if (isGreeting) {
    return {
      ...ruleBased,
      isAskingForOutfit: false,
      requestType: 'greeting',
      userIntentSummary: userMessage,
      gender: ruleBased.gender || 'men',
      excludeProductNames: [],
      keepProductNames: [],
      previousOutfitIds,
    };
  }

  if (lower.includes('đổi sang quần') || lower.includes('đổi quần') || lower.includes('thay quần')) {
    ruleRequestType = 'change_bottom';
    previousProducts.forEach((p) => {
      const pLower = p.toLowerCase();
      if (pLower.includes('jean') || pLower.includes('trouser') || pLower.includes('pant') || pLower.includes('skirt') || pLower.includes('quần')) {
        ruleExcludeProducts.push(p);
      } else {
        ruleKeepProducts.push(p);
      }
    });
  } else if (lower.includes('đổi sang áo') || lower.includes('đổi áo') || lower.includes('thay áo')) {
    ruleRequestType = 'change_top';
    previousProducts.forEach((p) => {
      const pLower = p.toLowerCase();
      if (pLower.includes('shirt') || pLower.includes('tee') || pLower.includes('polo') || pLower.includes('hoodie') || pLower.includes('áo')) {
        ruleExcludeProducts.push(p);
      } else {
        ruleKeepProducts.push(p);
      }
    });
  } else if (lower.includes('set khác') || lower.includes('mẫu khác') || lower.includes('bộ khác')) {
    ruleRequestType = 'new_outfit';
    ruleExcludeProducts.push(...previousProducts);
  }

  // 2. Nếu có GEMINI_API_KEY, gọi Gemini 3.6 Flash để trích xuất ngữ cảnh sâu hơn
  if (process.env.GEMINI_API_KEY) {
    const prompt = `Bạn là bộ phân tích ngữ nghĩa thời trang cho thương hiệu Routine.
Khách hàng vừa nhắn: "${userMessage}"
Lịch sử chat gần nhất:
${JSON.stringify(history.slice(-4))}

Các sản phẩm đã đề xuất trước đó: ${JSON.stringify(previousProducts)}

Nhiệm vụ: Phân tích ý định của khách thành JSON duy nhất (KHÔNG viết markdown block, CHỈ trả về chuỗi JSON):
{
  "isAskingForOutfit": boolean,
  "requestType": "greeting" | "new_outfit" | "change_bottom" | "change_top" | "refine_style",
  "category": "ao-thun" | "ao-somi" | "ao-polo" | "ao-khoac" | "quan-jeans" | "quan-tay" | "quan-short" | null,
  "fit": "oversize" | "slim-fit" | "regular" | null,
  "color": "đen" | "trắng" | "xám" | "be" | "xanh navy" | "xanh dương" | "rêu" | "nâu" | null,
  "occasion": "office" | "weekend" | "date" | "party" | "travel" | "everyday" | null,
  "gender": "men" | "women" | "unisex" | null,
  "style": "minimal" | "smart-casual" | "streetstyle" | "vintage" | "basic" | null,
  "budget": number | null,
  "excludeProductNames": string[],
  "keepProductNames": string[],
  "userIntentSummary": string
}

Lưu ý:
- "isAskingForOutfit": false nếu khách CHỈ chào hỏi ("xin chào", "hello"), hỏi vu vơ ("bạn là ai"), không yêu cầu tìm đồ cụ thể.
- Nếu khách yêu cầu đổi quần (ví dụ "đổi sang quần khác", "quần sáng màu hơn"): requestType là "change_bottom", đưa tên quần cũ vào excludeProductNames, và tên áo cũ vào keepProductNames.
- Nếu khách yêu cầu đổi áo (ví dụ "đổi sang áo polo", "tìm áo phông"): requestType là "change_top", đưa tên áo cũ vào excludeProductNames, và tên quần cũ vào keepProductNames.
- "lớn", "to", "bự", "rộng", "thùng thình" -> fit: "oversize"
- "ôm", "bó", "gọn" -> fit: "slim-fit"
- "áo phông", "tee" -> category: "ao-thun"
- "quần bò" -> category: "quan-jeans"
- "quần âu", "quần tây" -> category: "quan-tay"`;

    const aiRes = await callGeminiApi({
      contents: [{ parts: [{ text: prompt }] }],
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    if (aiRes) {
      const parsed = safeJsonParse(aiRes);
      if (parsed) {
        return {
          ...ruleBased,
          ...parsed,
          isAskingForOutfit: parsed.isAskingForOutfit !== undefined ? parsed.isAskingForOutfit : !isGreeting,
          requestType: parsed.requestType || ruleRequestType,
          fit: parsed.fit || ruleBased.fit || null,
          category: parsed.category || ruleBased.category || null,
          color: parsed.color || ruleBased.color || null,
          occasion: parsed.occasion || ruleBased.occasion || null,
          budget: parsed.budget || ruleBased.budget || null,
          gender: parsed.gender || ruleBased.gender || 'men',
          excludeProductNames: Array.isArray(parsed.excludeProductNames) ? parsed.excludeProductNames : ruleExcludeProducts,
          keepProductNames: Array.isArray(parsed.keepProductNames) ? parsed.keepProductNames : ruleKeepProducts,
          previousOutfitIds,
        };
      }
    }
  }

  return {
    ...ruleBased,
    isAskingForOutfit: !isGreeting,
    requestType: ruleRequestType,
    userIntentSummary: userMessage,
    gender: ruleBased.gender || 'men',
    excludeProductNames: ruleExcludeProducts,
    keepProductNames: ruleKeepProducts,
    previousOutfitIds,
  };
}

// Helper phân loại sản phẩm Routine chính xác theo DB
function isTop(p) {
  if (!p) return false;
  const slug = (p.categorySlug || p.categoryId || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return slug === 'tops' || slug.includes('top') || slug.includes('ao') || slug.includes('shirt') ||
    name.includes('shirt') || name.includes('tee') || name.includes('polo') || name.includes('hoodie') ||
    name.includes('blouse') || name.includes('tank') || name.includes('áo');
}

function isBottom(p) {
  if (!p) return false;
  const slug = (p.categorySlug || p.categoryId || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return slug === 'bottoms' || slug.includes('bottom') || slug.includes('quan') || slug.includes('pant') ||
    name.includes('pant') || name.includes('jean') || name.includes('trouser') || name.includes('skirt') ||
    name.includes('quần') || name.includes('short');
}

function isOuterwear(p) {
  if (!p) return false;
  const slug = (p.categorySlug || p.categoryId || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return slug === 'outerwear' || slug.includes('khoac') || name.includes('jacket') || name.includes('blazer') ||
    name.includes('cardigan') || name.includes('coat') || name.includes('windbreaker') || name.includes('khoác');
}

function isAccessory(p) {
  if (!p) return false;
  const slug = (p.categorySlug || p.categoryId || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return slug === 'phu-kien' || slug.includes('phu-kien') || name.includes('sneakers') || name.includes('belt') ||
    name.includes('bag') || name.includes('hat');
}

/**
 * Định dạng sản phẩm chuẩn hóa cho AI Stylist & InteractiveOutfitCard
 */
function formatProductForStylist(p, intent = {}) {
  if (!p) return null;
  let mainImg = '';
  if (Array.isArray(p.images) && p.images.length > 0) mainImg = p.images[0];
  else if (typeof p.images === 'string') {
    try {
      const parsed = JSON.parse(p.images);
      mainImg = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      mainImg = p.images;
    }
  } else if (p.image) {
    mainImg = p.image;
  }

  const pSizes = Array.isArray(p.sizes)
    ? p.sizes
    : (typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : ['M', 'L', 'XL']);
  const pColors = Array.isArray(p.colors)
    ? p.colors
    : (typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : ['Đen', 'Trắng']);

  const finalSizes = pSizes.length > 0 ? pSizes : ['S', 'M', 'L', 'XL'];
  const finalColors = pColors.length > 0 ? pColors : ['Đen', 'Trắng', 'Xám'];

  const selectedSize = intent.fit === 'oversize'
    ? (finalSizes.includes('L') ? 'L' : (finalSizes.includes('XL') ? 'XL' : finalSizes[0]))
    : (finalSizes.includes('M') ? 'M' : finalSizes[0]);

  const selectedColor = (intent.color && finalColors.find((c) => c.toLowerCase().includes(intent.color)))
    || finalColors[0]
    || 'Đen';

  return {
    id: p.id,
    productId: p.id,
    name: p.name,
    price: Number(p.price) || 0,
    originalPrice: Number(p.originalPrice || p.price) || 0,
    image: mainImg || '/images/placeholder.jpg',
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [mainImg || '/images/placeholder.jpg'],
    sizes: finalSizes,
    colors: finalColors,
    selectedSize,
    selectedColor,
  };
}

/**
 * Định dạng outfit bản ghi từ DB cho AI Stylist & InteractiveOutfitCard
 */
function formatOutfitForStylist(outfitRecord, intent = {}) {
  if (!outfitRecord) return null;
  const products = (outfitRecord.products || [])
    .map((op) => op.product || op)
    .filter(Boolean)
    .map((p) => formatProductForStylist(p, intent))
    .filter(Boolean);

  const total = products.reduce((sum, item) => sum + item.price, 0);

  let coverImg = outfitRecord.image || outfitRecord.coverImage;
  if (!coverImg && Array.isArray(outfitRecord.images) && outfitRecord.images.length > 0) {
    coverImg = outfitRecord.images[0];
  }
  if (!coverImg && products.length > 0) {
    coverImg = products[0].image;
  }

  return {
    id: outfitRecord.id || `outfit-${Date.now()}`,
    title: outfitRecord.title || outfitRecord.name || 'Bộ Phối Thời Trang Routine',
    name: outfitRecord.title || outfitRecord.name || 'Bộ Phối Thời Trang Routine',
    style: outfitRecord.style || intent.style || 'minimal',
    occasion: outfitRecord.occasion || intent.occasion || 'weekend',
    fit: intent.fit || 'regular',
    image: coverImg || '/images/placeholder.jpg',
    total,
    products,
  };
}

/**
 * Tìm Curated Outfit (bộ phối chuyên gia đã định nghĩa trong bảng outfits) có độ tương thích cao nhất
 */
async function findBestCuratedOutfit(intent, userMessage = '') {
  // Nếu khách đang yêu cầu đổi riêng áo hoặc đổi riêng quần -> Để Dynamic Assembly phối hợp chính xác
  if (intent.requestType === 'change_bottom' || intent.requestType === 'change_top') {
    return null;
  }

  try {
    const outfits = await prisma.outfit.findMany({
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    if (!outfits || outfits.length === 0) return null;

    const qLower = (userMessage || '').toLowerCase();
    const isExplicitPolo = qLower.includes('polo');

    let bestOutfit = null;
    let maxScore = -99;

    for (const o of outfits) {
      let sc = 0;
      const prods = (o.products || []).map((op) => op.product).filter(Boolean);
      const total = prods.reduce((s, p) => s + (Number(p.price) || 0), 0);

      // Tránh lặp lại outfit đã gợi ý trước đó trong cuộc trò chuyện
      if (intent.previousOutfitIds && intent.previousOutfitIds.includes(o.id)) {
        sc -= 40;
      }

      // Tránh outfit chứa sản phẩm khách muốn đổi / không thích
      if (intent.excludeProductNames && intent.excludeProductNames.length > 0) {
        const hasExcluded = prods.some((p) =>
          intent.excludeProductNames.some((ex) => (p.name || '').toLowerCase().includes(ex.toLowerCase()))
        );
        if (hasExcluded) sc -= 50;
      }

      // Nếu khách yêu cầu áo polo rõ ràng mà outfit không có polo -> giảm điểm để dynamic assembly xử lý
      if (isExplicitPolo) {
        const hasPolo = prods.some((p) => (p.name || '').toLowerCase().includes('polo'));
        if (hasPolo) sc += 20;
        else sc -= 30;
      }

      // Giới tính
      if (intent.gender && intent.gender !== 'unisex') {
        const oGender = o.gender || 'unisex';
        if (oGender === intent.gender || oGender === 'unisex') sc += 3;
        else sc -= 25;
      }

      // Dịp sử dụng
      if (intent.occasion && o.occasion === intent.occasion) {
        sc += 6;
      }

      // Phong cách
      if (intent.style && o.style === intent.style) {
        sc += 4;
      }

      // Ngân sách
      if (intent.budget) {
        if (total <= intent.budget) sc += 4;
        else sc -= 15;
      }

      // Khớp chi tiết theo từ khóa
      if (qLower.includes('phông') || qLower.includes('tee') || qLower.includes('thun')) {
        if (prods.some((p) => p.name.toLowerCase().includes('tee') || p.name.toLowerCase().includes('t-shirt'))) sc += 8;
      }
      if (qLower.includes('lớn') || qLower.includes('rộng') || qLower.includes('oversize')) {
        if (prods.some((p) => p.name.toLowerCase().includes('oversized'))) sc += 8;
      }
      if (qLower.includes('công sở') || qLower.includes('lịch sự') || qLower.includes('văn phòng')) {
        if (o.occasion === 'office') sc += 6;
        if (prods.some((p) => p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('blazer'))) sc += 6;
      }
      if (qLower.includes('quần tây') || qLower.includes('quần âu')) {
        if (prods.some((p) => p.name.toLowerCase().includes('trouser'))) sc += 8;
      }
      if (qLower.includes('hẹn hò') || qLower.includes('date')) {
        if (o.occasion === 'date') sc += 8;
      }
      if (qLower.includes('dạo phố') || qLower.includes('cuối tuần')) {
        if (o.occasion === 'weekend') sc += 6;
      }

      if (sc > maxScore) {
        maxScore = sc;
        bestOutfit = o;
      }
    }

    if (maxScore >= 9 && bestOutfit) {
      return formatOutfitForStylist(bestOutfit, intent);
    }
    return null;
  } catch (err) {
    console.error('[aiService] Lỗi tìm curated outfit:', err);
    return null;
  }
}

/**
 * Tự động tìm kiếm và ghép bộ phối đồ linh hoạt (Dynamic Outfit Assembly) từ Database MySQL
 */
async function assembleDynamicOutfit(intent, currentProduct = null, userMessage = '') {
  const gender = intent.gender || 'men';
  const targetColor = intent.color || null;
  const targetFit = intent.fit || null;
  const budget = intent.budget || 2000000;
  const qLower = (userMessage || '').toLowerCase();

  const excludes = (intent.excludeProductNames || []).map((n) => n.toLowerCase());
  const keeps = (intent.keepProductNames || []).map((n) => n.toLowerCase());

  // Lấy danh sách sản phẩm thực tế từ MySQL
  const allProducts = await prisma.product.findMany({
    where: {
      stockQuantity: { gt: 0 },
      ...(gender !== 'unisex' ? { gender: { in: [gender, 'unisex'] } } : {}),
    },
    take: 60,
    orderBy: { isFeatured: 'desc' },
  });

  if (allProducts.length === 0) {
    return null;
  }

  let chosenTop = null;
  let chosenBottom = null;
  let chosenOuterwear = null;
  let chosenAccessory = null;

  if (currentProduct) {
    if (isTop(currentProduct)) {
      chosenTop = currentProduct;
    } else if (isBottom(currentProduct)) {
      chosenBottom = currentProduct;
    } else if (isOuterwear(currentProduct)) {
      chosenOuterwear = currentProduct;
    }
  }

  const tops = allProducts.filter(isTop);
  const bottoms = allProducts.filter(isBottom);
  const outerwears = allProducts.filter(isOuterwear);
  const accessories = allProducts.filter(isAccessory);

  // Hàm chấm điểm sản phẩm Top
  function scoreTop(p) {
    let sc = 0;
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const pGender = p.gender || 'unisex';

    // Loại trừ sản phẩm khách không muốn lặp lại
    if (excludes.some((ex) => name.includes(ex) || ex.includes(name))) {
      return -1000;
    }

    // Ưu tiên giữ lại sản phẩm cũ nếu khách yêu cầu giữ
    if (keeps.some((k) => name.includes(k) || k.includes(name))) {
      sc += 500;
    }

    if (gender !== 'unisex') {
      if (pGender === gender) sc += 10;
      else if (pGender === 'unisex') sc += 5;
      else return -100;
    }

    if (qLower.includes('polo') && name.includes('polo')) sc += 35;
    if ((qLower.includes('phông') || qLower.includes('tee') || qLower.includes('thun') || intent.category === 'ao-thun') && (name.includes('tee') || name.includes('t-shirt'))) sc += 25;
    if ((qLower.includes('sơ mi') || qLower.includes('somi') || intent.category === 'ao-somi') && name.includes('shirt')) sc += 25;
    if ((qLower.includes('blouse') || intent.category === 'ao-blouse') && name.includes('blouse')) sc += 25;
    if (qLower.includes('hoodie') && name.includes('hoodie')) sc += 25;

    if (targetFit === 'oversize' || qLower.includes('lớn') || qLower.includes('rộng') || qLower.includes('bự')) {
      if (name.includes('oversized') || name.includes('relaxed') || desc.includes('oversize') || desc.includes('rộng')) sc += 20;
    } else if (targetFit === 'slim-fit' || qLower.includes('ôm') || qLower.includes('gọn')) {
      if (name.includes('slim') || desc.includes('ôm')) sc += 20;
    }

    if (intent.occasion === 'office' && (name.includes('shirt') || name.includes('polo'))) sc += 12;
    if (intent.occasion === 'weekend' && (name.includes('tee') || name.includes('hoodie') || name.includes('polo'))) sc += 8;

    if (targetColor) {
      const colorsStr = JSON.stringify(p.colors || []).toLowerCase();
      if (colorsStr.includes(targetColor) || name.includes(targetColor)) sc += 15;
    }

    if (p.isFeatured) sc += 2;
    return sc;
  }

  // Hàm chấm điểm sản phẩm Bottom
  function scoreBottom(p) {
    let sc = 0;
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const pGender = p.gender || 'unisex';

    // Loại trừ sản phẩm khách không muốn lặp lại
    if (excludes.some((ex) => name.includes(ex) || ex.includes(name))) {
      return -1000;
    }

    // Ưu tiên giữ lại sản phẩm cũ nếu khách yêu cầu giữ
    if (keeps.some((k) => name.includes(k) || k.includes(name))) {
      sc += 500;
    }

    if (gender !== 'unisex') {
      if (pGender === gender) sc += 10;
      else if (pGender === 'unisex') sc += 5;
      else return -100;
    }

    if ((qLower.includes('quần tây') || qLower.includes('quần âu') || qLower.includes('tây') || qLower.includes('âu') || intent.category === 'quan-tay') && name.includes('trouser')) sc += 35;
    if ((qLower.includes('jean') || qLower.includes('quần bò') || qLower.includes('bò') || intent.category === 'quan-jeans') && name.includes('jeans')) sc += 35;
    if (qLower.includes('cargo') && name.includes('cargo')) sc += 35;
    if ((qLower.includes('chân váy') || qLower.includes('skirt')) && name.includes('skirt')) sc += 35;

    if (intent.occasion === 'office' && name.includes('trouser')) sc += 15;
    if (intent.occasion === 'weekend' && (name.includes('jeans') || name.includes('cargo'))) sc += 12;

    // Yêu cầu đổi màu sáng hoặc màu tối
    if (qLower.includes('sáng') || targetColor === 'trắng' || targetColor === 'be') {
      if (name.includes('white') || name.includes('trắng') || name.includes('pleated') || name.includes('beige')) sc += 35;
    }
    if (qLower.includes('tối') || targetColor === 'đen' || targetColor === 'xanh navy') {
      if (name.includes('black') || name.includes('đen') || name.includes('dark')) sc += 35;
    }

    // Phối màu tương phản / bổ trợ với chosenTop nếu có
    if (chosenTop) {
      const topName = chosenTop.name.toLowerCase();
      if ((topName.includes('trắng') || topName.includes('white') || topName.includes('sáng')) && (name.includes('đen') || name.includes('black') || name.includes('tối'))) {
        sc += 8;
      }
    }

    if (p.isFeatured) sc += 2;
    return sc;
  }

  if (!chosenTop && tops.length > 0) {
    const scoredTops = tops
      .map((p) => ({ product: p, score: scoreTop(p) }))
      .sort((a, b) => b.score - a.score);
    chosenTop = scoredTops[0]?.product || tops[0];
  }

  if (!chosenBottom && bottoms.length > 0) {
    const scoredBottoms = bottoms
      .map((p) => ({ product: p, score: scoreBottom(p) }))
      .sort((a, b) => b.score - a.score);
    chosenBottom = scoredBottoms[0]?.product || bottoms[0];
  }

  // Tùy chọn thêm phụ kiện (Giày / Thắt lưng / Mũ) nếu ngân sách thoải mái
  const currentTotal = (Number(chosenTop?.price) || 0) + (Number(chosenBottom?.price) || 0);
  if (budget >= currentTotal + 300000 && accessories.length > 0) {
    if (intent.occasion === 'office') {
      chosenAccessory = accessories.find((a) => a.name.toLowerCase().includes('belt') || a.name.toLowerCase().includes('canvas sneakers')) || null;
    } else {
      chosenAccessory = accessories.find((a) => a.name.toLowerCase().includes('sneakers') || a.name.toLowerCase().includes('hat')) || null;
    }
  }

  const rawSelectedItems = [chosenTop, chosenBottom, chosenAccessory, chosenOuterwear].filter(Boolean);
  const selectedItems = rawSelectedItems.map((p) => formatProductForStylist(p, intent));
  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const outfitTitle = chosenTop && chosenBottom
    ? `Bộ Phối ${chosenTop.name.split(' - ')[0]} & ${chosenBottom.name.split(' - ')[0]}`
    : (chosenTop ? `Set Thời Trang ${chosenTop.name}` : 'Bộ Phối Thời Trang Routine');

  const outfitStyle = intent.style || (intent.fit === 'oversize' ? 'streetstyle' : (intent.occasion === 'office' ? 'smart-casual' : 'minimal'));

  return {
    id: `dyn-outfit-${Date.now().toString(36)}`,
    title: outfitTitle,
    name: outfitTitle,
    style: outfitStyle,
    occasion: intent.occasion || 'weekend',
    fit: intent.fit || 'regular',
    image: chosenTop?.images?.[0] || (Array.isArray(chosenTop?.images) ? chosenTop.images[0] : chosenTop?.image) || '/images/placeholder.jpg',
    total,
    products: selectedItems,
  };
}

/**
 * Trò chuyện với Trợ lý Thời trang AI Stylist (Multi-turn Chat)
 */
async function chatWithStylist({ message, history = [], currentProductId = null, userPreferences = null }) {
  // 1. Phân tích intent và chuẩn hóa từ vựng tiếng Việt với ngữ cảnh đa lượt
  const intent = await extractFashionIntent(message, history);

  // 2. Nếu khách chỉ chào hỏi hoặc hỏi chuyện chung (không yêu cầu tìm đồ cụ thể)
  if (!intent.isAskingForOutfit) {
    const greetingTemplates = [
      `Dạ Routine xin chào bạn! Mình là AI Stylist của Routine, rất vui được đồng hành cùng bạn trên hành trình định hình phong cách cá nhân. Hôm nay bạn đang muốn tìm kiếm trang phục cho dịp nào—đi làm công sở, dạo phố cuối tuần, hay một buổi hẹn hò đặc biệt? Hãy chia sẻ với mình nhé!`,
      `Xin chào bạn 👋! Mình là Trợ lý Thời trang Routine. Bạn đang cần tư vấn set đồ cho dịp nào, hay có món đồ nào (áo thun, sơ mi, polo, quần tây...) muốn phối cùng không? Mình sẵn sàng hỗ trợ bạn ngay!`,
      `Chào bạn! Rất vui được gặp bạn tại Routine. Hãy cho mình biết dịp bạn muốn diện đồ (công sở, dạo phố, đi tiệc) hoặc phong cách yêu thích, mình sẽ gợi ý set đồ chuẩn gu nhất cho bạn nhé!`
    ];
    const greetingAdvice = greetingTemplates[Math.floor(Math.random() * greetingTemplates.length)];

    return {
      message: greetingAdvice,
      intent,
      outfit: null,
      products: [],
      total: 0,
      followUps: [
        'Tư vấn set đồ công sở lịch sự nam',
        'Tìm áo phông dáng lớn màu xám dạo phố',
        'Outfit hẹn hò cuối tuần dưới 1 triệu',
        'Gợi ý áo polo kết hợp quần tây thanh lịch',
      ],
    };
  }

  // 3. Tra cứu sản phẩm hiện tại nếu khách đang xem trang chi tiết
  let currentProduct = null;
  if (currentProductId) {
    try {
      currentProduct = await prisma.product.findUnique({ where: { id: currentProductId } });
    } catch (e) {}
  }

  // 4. Ưu tiên Curated Outfits chuẩn nếu câu hỏi phù hợp và khách không xem SP lẻ
  let outfit = null;
  if (!currentProduct) {
    outfit = await findBestCuratedOutfit(intent, message);
  }

  // 5. Nếu không có curated outfit phù hợp hoặc khách cần đổi món / phối linh hoạt:
  if (!outfit) {
    outfit = await assembleDynamicOutfit(intent, currentProduct, message);
  }

  // Fallback an toàn nếu vẫn chưa có
  if (!outfit || outfit.products.length === 0) {
    const existing = await outfitService.getOutfits({ limit: 1 });
    const fallbackOutfit = existing.items?.[0];
    if (fallbackOutfit) {
      outfit = formatOutfitForStylist(fallbackOutfit, intent);
    }
  }

  // 6. Sinh lời khuyên từ Gemini AI với phong cách chuyên gia thời trang Routine
  let stylistAdvice = '';
  const fitNote = intent.fit === 'oversize' ? 'dáng lớn thoải mái (form rộng/oversize)' : (intent.fit === 'slim-fit' ? 'dáng ôm gọn gàng' : 'phom dáng tiêu chuẩn');
  const itemsText = outfit?.products?.map((p) => `"${p.name}" (${Number(p.price).toLocaleString('vi-VN')}đ)`).join(' kết hợp với ');

  if (process.env.GEMINI_API_KEY) {
    const systemPrompt = `Bạn là Chuyên viên Tạo mẫu Thời trang (Fashion Stylist) cao cấp của Routine - thương hiệu thời trang tối giản, hiện đại và trẻ trung.
Quy tắc trả lời:
- Luôn giữ giọng điệu thanh lịch, tinh tế, truyền cảm hứng và ân cần.
- Nếu khách hàng đề cập từ như "lớn", "to", "bự", "rộng", hãy khéo léo khen ngợi gu thời trang phóng khoáng và giải thích cách phối form rộng (oversize) sao cho tôn dáng mà không bị nuốt người.
- Nếu khách hàng vừa yêu cầu đổi món đồ (đổi quần, đổi áo, đổi màu), hãy xác nhận sự thay đổi này một cách tự nhiên và giải thích vì sao món đồ mới lại kết hợp ăn ý.
- Trình bày 2 đoạn ngắn:
  + Đoạn 1: Lời chào/phản hồi trực tiếp yêu cầu của khách.
  + Đoạn 2: Giải thích cách phối set đồ được chọn (phối màu, chất liệu, mẹo mặc đẹp).
- Độ dài khoảng 80-120 từ, súc tích, không lặp từ.`;

    const chatContents = [
      ...history.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text || h.message || '' }],
      })),
      {
        role: 'user',
        parts: [
          {
            text: `Khách hàng: "${message}".
Tiêu chí đã chuẩn hóa: Dáng mặc: ${fitNote}, Màu: ${intent.color || 'tự nhiên'}, Dịp: ${intent.occasion || 'tự do'}, Ngân sách: ${intent.budget ? intent.budget.toLocaleString('vi-VN') + 'đ' : 'linh hoạt'}.
Hệ thống đã chọn set: ${itemsText}. Tổng giá: ${outfit?.total?.toLocaleString('vi-VN')}đ.
Hãy viết lời tư vấn cho khách.`,
          },
        ],
      },
    ];

    const aiResponse = await callGeminiApi({
      contents: chatContents,
      systemInstruction: systemPrompt,
      temperature: 0.7,
    });

    if (aiResponse) {
      stylistAdvice = aiResponse.trim();
    }
  }

  // Fallback thông minh nếu Gemini API bận (429) hoặc tạm thời không khả dụng
  if (!stylistAdvice) {
    if (intent.requestType === 'change_bottom') {
      stylistAdvice = `Chào bạn! Mình đã đổi sang mẫu quần mới để kết hợp ăn ý cùng set đồ. Bộ trang phục với phom dáng ${fitNote} mang phong cách ${outfit?.style?.toUpperCase() || 'MINIMAL'} thanh lịch, rất thích hợp cho dịp ${intent.occasion || 'hàng ngày'}.`;
    } else if (intent.requestType === 'change_top') {
      stylistAdvice = `Chào bạn! Mình đã đổi sang mẫu áo mới theo mong muốn của bạn, giữ nguyên sự đồng điệu cho tổng thể set đồ. Phom dáng ${fitNote} trẻ trung, thoải mái cho dịp ${intent.occasion || 'hàng ngày'}.`;
    } else {
      stylistAdvice = `Chào bạn! Để đáp ứng mong muốn diện trang phục ${fitNote} của bạn, mình gợi ý set đồ ${itemsText}. Bộ trang phục mang phong cách ${outfit?.style?.toUpperCase() || 'MINIMAL'} thanh lịch, kết hợp màu sắc hài hòa và chất vải thoáng mát, rất thích hợp cho dịp ${intent.occasion || 'hàng ngày'}.`;
    }
  }

  // 7. Sinh 3 câu hỏi gợi ý tiếp theo thông minh dựa theo ngữ cảnh
  const followUps = [
    intent.requestType === 'change_bottom' ? 'Đổi sang áo khác để phối cùng quần này' : 'Đổi sang quần khác để phối',
    intent.fit === 'oversize' ? 'Có set nào dáng ôm gọn gàng hơn không?' : 'Gợi ý thêm áo form rộng dạo phố',
    intent.occasion === 'office' ? 'Tìm set dạo phố thoải mái cuối tuần' : 'Tư vấn set đồ công sở lịch sự',
    'Gợi ý set đồ ngân sách dưới 800k',
  ];

  return {
    message: stylistAdvice,
    intent,
    outfit,
    products: outfit?.products || [],
    total: outfit?.total || 0,
    followUps,
  };
}

/**
 * Alias tương thích ngược cho endpoint cũ
 */
async function generateOutfitRecommendation({ occasion, style, budget, gender, userMessage } = {}) {
  const result = await chatWithStylist({
    message: userMessage || `${occasion || 'hàng ngày'} ${style || 'tối giản'} ${budget || ''}`,
  });
  return result;
}

async function suggestRoutines(goal) {
  return generateOutfitRecommendation({ userMessage: goal });
}

module.exports = {
  callGeminiApi,
  extractFashionIntent,
  assembleDynamicOutfit,
  chatWithStylist,
  generateOutfitRecommendation,
  suggestRoutines,
};
