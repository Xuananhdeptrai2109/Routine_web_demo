/**
 * fashionThesaurus.js
 * Từ điển đồng nghĩa & Bộ chuẩn hóa ngôn ngữ tự nhiên cho thời trang Routine
 * Giải quyết bài toán "Bất đồng bộ từ vựng" (khách gõ: lớn, bự, áo phông, quần bò, màu ghi...)
 */

const FIT_SYNONYMS = {
  oversize: [
    'lớn', 'lon', 'bự', 'bu', 'to', 'rộng', 'rong', 'thùng thình', 'thung thinh',
    'rộng rãi', 'rong rai', 'ngoại cỡ', 'ngoai co', 'dáng rộng', 'dang rong',
    'form rộng', 'form rong', 'form to', 'dáng to', 'oversize', 'oversized',
    'loose', 'baggy', 'dáng lớn', 'dang lon'
  ],
  'slim-fit': [
    'ôm', 'om', 'bó', 'bo', 'vừa sát', 'vua sat', 'ôm body', 'om body',
    'gọn', 'gon', 'bó sát', 'bo sat', 'ôm sát', 'om sat', 'slim', 'slimfit',
    'slim-fit', 'dáng ôm', 'dang om'
  ],
  regular: [
    'vừa', 'vua', 'vừa vặn', 'vua van', 'bình thường', 'binh thuong',
    'vừa người', 'vua nguoi', 'tiêu chuẩn', 'tieu chuan', 'regular', 'classic'
  ],
};

const CATEGORY_SYNONYMS = {
  'ao-thun': [
    'áo phông', 'ao phong', 'áo thun', 'ao thun', 't-shirt', 'tshirt', 'tee',
    'áo cộc tay', 'ao coc tay', 'cộc tay', 'phông'
  ],
  'ao-somi': [
    'áo sơ mi', 'ao so mi', 'sơ mi', 'so mi', 'sơ-mi', 'shirt', 'áo tay dài', 'áo công sở'
  ],
  'ao-polo': [
    'áo polo', 'ao polo', 'polo', 'áo có cổ', 'ao co co', 'cổ bẻ'
  ],
  'ao-khoac': [
    'áo khoác', 'ao khoac', 'jacket', 'blazer', 'cardigan', 'bomber', 'áo gió',
    'ao gio', 'khoác nhẹ', 'vest', 'áo vest'
  ],
  'quan-jeans': [
    'quần bò', 'quan bo', 'quần jean', 'quan jean', 'quần jeans', 'quan jeans',
    'bò giấy', 'denim', 'bò'
  ],
  'quan-tay': [
    'quần tây', 'quan tay', 'quần âu', 'quan au', 'trousers', 'quần vải', 'quan vai'
  ],
  'quan-short': [
    'quần đùi', 'quan dui', 'quần sooc', 'quan sooc', 'quần short', 'quan short',
    'shorts', 'short', 'bermuda'
  ],
  'quan-kaki': [
    'quần kaki', 'quan kaki', 'kaki', 'khaki', 'chinos', 'quần chinos'
  ],
};

const COLOR_SYNONYMS = {
  'xám': ['ghi', 'màu tro', 'mau tro', 'xám', 'xam', 'grey', 'gray', 'xám tiêu'],
  'be': ['màu kem', 'mau kem', 'màu da', 'mau da', 'cát', 'beige', 'nâu nhạt', 'màu be'],
  'đen': ['đen', 'den', 'black', 'đen tuyền', 'den tuyen', 'tối màu', 'toi mau'],
  'trắng': ['trắng', 'trang', 'white', 'trắng sứ', 'trắng tinh', 'sáng màu', 'sang mau'],
  'xanh navy': ['navy', 'xanh đen', 'xanh den', 'xanh than', 'màu than', 'xanh đậm'],
  'xanh dương': ['xanh dương', 'xanh duong', 'xanh biển', 'xanh lam', 'blue', 'da trời'],
  'rêu': ['xanh rêu', 'xanh reu', 'rêu', 'olive', 'rêu đậm'],
  'nâu': ['nâu', 'nau', 'brown', 'nâu đất', 'nau dat', 'chocolate'],
};

const OCCASION_SYNONYMS = {
  office: [
    'đi làm', 'di lam', 'công sở', 'cong so', 'văn phòng', 'van phong',
    'hội họp', 'hoi hop', 'phỏng vấn', 'phong van', 'đi dạy', 'di day', 'thanh lịch'
  ],
  weekend: [
    'đi chơi', 'di choi', 'dạo phố', 'dao pho', 'cà phê', 'ca phe',
    'cuối tuần', 'cuoi tuan', 'gặp bạn bè', 'gap ban be', 'trà chanh'
  ],
  date: [
    'hẹn hò', 'hen ho', 'đi ăn tối', 'di an toi', 'xem phim', 'lãng mạn', 'date'
  ],
  party: [
    'tiệc tùng', 'tiec tung', 'dự tiệc', 'du tiec', 'đám cưới', 'dam cuoi',
    'sinh nhật', 'sinh nhat', 'đi quẩy', 'di quay', 'sang trọng', 'party'
  ],
  travel: [
    'du lịch', 'du lich', 'đi biển', 'di bien', 'đi phượt', 'di phuot',
    'dã ngoại', 'da ngoai', 'nghỉ dưỡng', 'nghi duong', 'picnic'
  ],
  everyday: [
    'ở nhà', 'o nha', 'mặc nhà', 'mac nha', 'thường ngày', 'thuong ngay',
    'cơ bản', 'co ban', 'dạo quanh'
  ],
};

const GENDER_SYNONYMS = {
  men: ['nam', 'con trai', 'đàn ông', 'dan ong', 'phái mạnh', 'phai manh', 'cho nam', 'chàng'],
  women: ['nữ', 'nu', 'con gái', 'con gai', 'phụ nữ', 'phu nu', 'phái đẹp', 'cho nữ', 'nàng'],
  unisex: ['cả nam nữ', 'unisex', 'đôi', 'cặp đôi', 'cho cả hai'],
};

/**
 * Trích xuất các thuộc tính chuẩn hóa từ văn bản người dùng (Rule-based Fallback)
 */
function normalizeFashionQuery(text) {
  if (!text || typeof text !== 'string') return {};
  const lower = text.toLowerCase();

  const result = {
    categories: [],
  };

  // 1. Phân tích Form dáng
  for (const [canonical, list] of Object.entries(FIT_SYNONYMS)) {
    if (list.some((kw) => lower.includes(kw))) {
      result.fit = canonical;
      break;
    }
  }

  // 2. Phân tích Danh mục (hỗ trợ trích xuất nhiều danh mục như vừa polo vừa quần tây)
  for (const [canonical, list] of Object.entries(CATEGORY_SYNONYMS)) {
    if (list.some((kw) => lower.includes(kw))) {
      result.categories.push(canonical);
      if (!result.category) {
        result.category = canonical;
      }
    }
  }

  // 3. Phân tích Màu sắc
  for (const [canonical, list] of Object.entries(COLOR_SYNONYMS)) {
    if (list.some((kw) => lower.includes(kw))) {
      result.color = canonical;
      break;
    }
  }

  // 4. Phân tích Dịp sử dụng
  for (const [canonical, list] of Object.entries(OCCASION_SYNONYMS)) {
    if (list.some((kw) => lower.includes(kw))) {
      result.occasion = canonical;
      break;
    }
  }

  // 5. Phân tích Giới tính
  for (const [canonical, list] of Object.entries(GENDER_SYNONYMS)) {
    if (list.some((kw) => lower.includes(kw))) {
      result.gender = canonical;
      break;
    }
  }

  // 6. Phân tích Ngân sách bằng Regex
  // VD: "dưới 500k", "tầm 1 triệu", "< 1tr", "tối đa 800.000"
  const budgetMatch = lower.match(/(?:dưới|tam|tầm|khoảng|khoang|dưới|tối đa|toi da|<|duoi)\s*(\d+(?:[.,]\d+)?)\s*(k|tr|triệu|trieu|nghìn|nghin|đ|d)?/);
  if (budgetMatch) {
    const rawNum = parseFloat(budgetMatch[1].replace(',', '.'));
    const unit = budgetMatch[2];
    let budget = rawNum;
    if (unit === 'k' || unit === 'nghìn' || unit === 'nghin') {
      budget = rawNum * 1000;
    } else if (unit === 'tr' || unit === 'triệu' || unit === 'trieu') {
      budget = rawNum * 1000000;
    } else if (rawNum < 100) {
      budget = rawNum * 1000000; // VD "1.5" => 1.5 triệu
    } else if (rawNum < 10000) {
      budget = rawNum * 1000; // VD "500" => 500k
    }
    result.budget = Math.round(budget);
  }

  return result;
}

module.exports = {
  FIT_SYNONYMS,
  CATEGORY_SYNONYMS,
  COLOR_SYNONYMS,
  OCCASION_SYNONYMS,
  GENDER_SYNONYMS,
  normalizeFashionQuery,
};
