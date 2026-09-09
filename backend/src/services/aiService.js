/**
 * Dịch vụ AI Fashion Stylist - Routine
 * Tích hợp Google Gemini AI kết hợp thuật toán phối đồ thông minh
 * Tư vấn trang phục cá nhân hóa theo dịp, phong cách, ngân sách và vóc dáng.
 */

const outfitService = require('./outfitService');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const occasionMap = {
  'đi làm': 'office',
  office: 'office',
  'đi chơi': 'weekend',
  weekend: 'weekend',
  'hẹn hò': 'date',
  date: 'date',
  'du lịch': 'travel',
  travel: 'travel',
  'ở nhà': 'everyday',
  everyday: 'everyday',
  tiệc: 'party',
  party: 'party',
};

const styleMap = {
  minimal: 'minimal',
  'tối giản': 'minimal',
  basic: 'basic',
  'cơ bản': 'basic',
  'smart casual': 'smart-casual',
  'smart-casual': 'smart-casual',
  streetstyle: 'streetstyle',
  streetwear: 'streetstyle',
  vintage: 'vintage',
  'sporty chic': 'sporty-chic',
  'sporty-chic': 'sporty-chic',
  sporty: 'sporty-chic',
};

const budgetRanges = {
  '< 500k': [0, 500000],
  '500k – 1m': [500000, 1000000],
  '500k - 1m': [500000, 1000000],
  '1m – 2m': [1000000, 2000000],
  '1m - 2m': [1000000, 2000000],
  '> 2m': [2000000, Infinity],
};

/**
 * Gọi Google Gemini REST API
 */
async function generateGeminiContent(prompt, model = 'gemini-1.5-flash') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Thuật toán chọn Outfit phù hợp nhất với tiêu chí người dùng từ MySQL
 */
async function findBestMatchingOutfit({ occasion, style, budget }) {
  const occasionSlug = occasion ? occasionMap[occasion.toLowerCase().trim()] : null;
  const styleSlug = style ? styleMap[style.toLowerCase().trim()] : null;

  const res = await outfitService.getOutfits({ limit: 100 });
  const allOutfits = res.items || [];

  let candidates = allOutfits.filter(
    (o) => (!occasionSlug || o.occasion === occasionSlug) && (!styleSlug || o.style === styleSlug)
  );

  if (candidates.length === 0 && styleSlug) {
    candidates = allOutfits.filter((o) => o.style === styleSlug);
  }
  if (candidates.length === 0 && occasionSlug) {
    candidates = allOutfits.filter((o) => o.occasion === occasionSlug);
  }
  if (candidates.length === 0) {
    candidates = allOutfits;
  }

  // Nếu có lọc theo ngân sách
  if (budget) {
    const budgetKey = budget.toLowerCase().trim();
    const [min, max] = budgetRanges[budgetKey] || [0, Infinity];
    const inRange = candidates.find((item) => item.total >= min && item.total <= max);
    if (inRange) {
      return inRange;
    }
  }

  return candidates[0] || allOutfits[0];
}

/**
 * Tư vấn set đồ thời trang thông minh (AI Fashion Stylist)
 */
async function generateOutfitRecommendation({ occasion, style, budget, gender, userMessage } = {}) {
  const matched = await findBestMatchingOutfit({ occasion, style, budget });

  const outfitName = matched?.name || matched?.title || 'Bộ phối đồ Routine';
  const outfitStyle = matched?.style || 'minimal';
  const productsList = matched?.products || [];
  const outfitTotal = matched?.total || 0;

  let stylistAdvice = `Tôi gợi ý set đồ "${outfitName}" mang phong cách ${outfitStyle.toUpperCase()}. Bộ trang phục này được phối màu hài hòa, chất liệu cao cấp thoáng mát, rất thích hợp cho dịp ${occasion || 'hàng ngày'} của bạn.`;

  // Thử gọi Gemini AI để tạo lời khuyên chuyên nghiệp nếu có API key
  if (process.env.GEMINI_API_KEY) {
    try {
      const productNames = productsList.map((p) => p.name).join(', ');
      const prompt = `Bạn là chuyên gia tư vấn thời trang (Fashion Stylist) của thương hiệu thời trang Routine.
Khách hàng đang tìm outfit với tiêu chí:
- Dịp mặc: ${occasion || 'Tự do'}
- Phong cách mong muốn: ${style || 'Tối giản'}
- Ngân sách: ${budget || 'Không giới hạn'}
- Giới tính: ${gender || 'Unisex'}
${userMessage ? `- Ghi chú thêm từ khách hàng: "${userMessage}"` : ''}

Hệ thống đã chọn set đồ: "${outfitName}" gồm các món: ${productNames}. Tổng giá: ${outfitTotal.toLocaleString('vi-VN')}đ.
Hãy viết một đoạn nhận xét/lời khuyên phong cách ngắn gọn (2-3 câu, giọng điệu thanh lịch, tinh tế, truyền cảm hứng) giải thích vì sao set đồ này là lựa chọn hoàn hảo và mẹo nhỏ khi diện set này.`;

      const aiText = await generateGeminiContent(prompt);
      if (aiText && aiText.trim()) {
        stylistAdvice = aiText.trim();
      }
    } catch (err) {
      // Giữ advice mặc định nếu lỗi API
    }
  }

  return {
    message: stylistAdvice,
    outfit: {
      id: matched?.id,
      name: outfitName,
      title: outfitName,
      style: outfitStyle,
      occasion: matched?.occasion,
      image: matched?.image,
      description: matched?.description,
    },
    products: productsList,
    total: outfitTotal,
  };
}

/**
 * Alias tương thích ngược cho endpoint /suggest cũ
 */
async function suggestRoutines(goal) {
  return generateOutfitRecommendation({ userMessage: goal });
}

module.exports = {
  generateGeminiContent,
  findBestMatchingOutfit,
  generateOutfitRecommendation,
  suggestRoutines,
};
