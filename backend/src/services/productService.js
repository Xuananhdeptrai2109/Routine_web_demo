const prisma = require('../config/prisma');
const { processImageArray } = require('../utils/fileStorage');
const stockReservationService = require('./stockReservationService');

function mapPrismaProduct(p) {
  if (!p) return null;
  const styles = Array.isArray(p.styles)
    ? p.styles
    : typeof p.styles === 'string'
    ? JSON.parse(p.styles || '[]')
    : [];
  const images = Array.isArray(p.images)
    ? p.images
    : typeof p.images === 'string'
    ? JSON.parse(p.images || '[]')
    : ['/images/products/product-01.jpg'];
  const sizes = Array.isArray(p.sizes)
    ? p.sizes
    : typeof p.sizes === 'string'
    ? JSON.parse(p.sizes || '[]')
    : ['S', 'M', 'L', 'XL'];
  const colors = Array.isArray(p.colors)
    ? p.colors
    : typeof p.colors === 'string'
    ? JSON.parse(p.colors || '[]')
    : ['Đen', 'Trắng'];

  const variants = Array.isArray(p.variants) && p.variants.length > 0
    ? p.variants
    : (sizes.length > 0 && colors.length > 0)
    ? sizes.flatMap((sz) =>
        colors.map((col) => ({
          id: `${p.id}-${String(col).toLowerCase()}-${String(sz).toLowerCase()}`,
          colorId: String(col).toLowerCase(),
          colorName: col,
          sizeId: String(sz).toLowerCase(),
          sizeName: sz,
          sku: `${(p.name || 'PRD').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()}-${String(col).slice(0, 2).toUpperCase()}-${sz}`,
          price: Number(p.price) || 0,
          stockQuantity: 25,
          status: 'ACTIVE',
        }))
      )
    : [];

  return {
    ...p,
    id: p.id,
    name: p.name,
    slug: p.slug || p.id,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : Number(p.price),
    category: p.categorySlug || p.categoryId || (p.category && p.category.slug) || 'tops',
    categoryId: p.categoryId || p.categorySlug || 'tops',
    gender: p.gender || 'unisex',
    style: styles,
    styleIds: styles,
    styles,
    images: images.length > 0 ? images : ['/images/products/product-01.jpg'],
    sizes,
    colors,
    variants,
    badge: p.badge || null,
    rating: p.rating ? Number(p.rating) : 5.0,
    reviewCount: p.reviewCount ? Number(p.reviewCount) : 0,
    stockQuantity: p.stockQuantity !== undefined ? Number(p.stockQuantity) : 100,
    heldQuantity: stockReservationService.getHeldQuantity(p.id),
    availableStock: Math.max(
      0,
      (p.stockQuantity !== undefined ? Number(p.stockQuantity) : 100) -
        stockReservationService.getHeldQuantity(p.id)
    ),
    description: p.description || '',
    materials: p.materials || '',
    care: p.care || '',
  };
}

async function getAllSourceProducts() {
  try {
    const list = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return list.map(mapPrismaProduct);
  } catch (err) {
    console.error('[productService] DB query failed:', err.message);
    return [];
  }
}

/**
 * Lấy danh sách sản phẩm với bộ lọc nâng cao, tìm kiếm, sắp xếp và phân trang
 */
async function getProducts({
  category,
  gender,
  style,
  badge,
  minPrice,
  maxPrice,
  q,
  sort,
  page = 1,
  limit = 20,
} = {}) {
  const source = await getAllSourceProducts();
  let list = [...source];

  // 1. Lọc theo từ khóa tìm kiếm (q)
  if (q && typeof q === 'string' && q.trim()) {
    const keyword = q.trim().toLowerCase();
    list = list.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(keyword);
      const matchDesc = p.description?.toLowerCase().includes(keyword);
      const matchCat = p.category?.toLowerCase().includes(keyword);
      const matchStyles = p.style?.some((s) => s.toLowerCase().includes(keyword));
      return matchName || matchDesc || matchCat || matchStyles;
    });
  }

  // 2. Lọc theo category / slug
  if (category) {
    const cat = category.toLowerCase().trim();
    if (cat === 'new-arrivals') {
      list = list.filter((p) => p.badge === 'NEW');
    } else if (['men', 'women', 'unisex'].includes(cat)) {
      list = list.filter((p) => p.gender === cat);
    } else {
      list = list.filter((p) => {
        const pCat = String(p.category || '').toLowerCase();
        const pCatId = String(p.categoryId || '').toLowerCase();
        const pRelSlug = p.category && typeof p.category === 'object' ? String(p.category.slug || '').toLowerCase() : '';
        return pCat === cat || pCatId === cat || pRelSlug === cat;
      });
    }
  }

  // 3. Lọc theo giới tính (gender)
  if (gender) {
    const g = gender.toLowerCase().trim();
    list = list.filter((p) => p.gender?.toLowerCase() === g);
  }

  // 4. Lọc theo phong cách (style)
  if (style) {
    const s = style.toLowerCase().trim();
    list = list.filter((p) => p.style?.some((item) => item.toLowerCase() === s));
  }

  // 5. Lọc theo huy hiệu (badge: NEW, BEST SELLER, SALE)
  if (badge) {
    const b = badge.toUpperCase().trim();
    list = list.filter((p) => p.badge?.toUpperCase() === b);
  }

  // 6. Lọc theo khoảng giá (minPrice, maxPrice)
  if (minPrice !== undefined && minPrice !== '') {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      list = list.filter((p) => p.price >= min);
    }
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      list = list.filter((p) => p.price <= max);
    }
  }

  // 7. Sắp xếp (sort)
  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      list.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
      break;
    case 'rating':
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'recommended':
    default:
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }

  // 8. Phân trang (pagination)
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 20);
  const total = list.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (currentPage - 1) * pageSize;
  const paginatedItems = list.slice(offset, offset + pageSize);

  return {
    items: paginatedItems,
    pagination: {
      total,
      page: currentPage,
      limit: pageSize,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
}

/**
 * Lấy chi tiết một sản phẩm theo ID hoặc Slug
 */
async function getProductById(id) {
  if (!id) return null;
  try {
    const found = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: { category: true },
    });
    if (found) return mapPrismaProduct(found);
  } catch (err) {
    console.error('[productService] getProductById failed:', err.message);
  }
  return null;
}

/**
 * Lấy danh sách sản phẩm nổi bật (Featured / Best Seller)
 */
async function getFeaturedProducts(limit = 8) {
  const count = parseInt(limit, 10) || 8;
  const source = await getAllSourceProducts();
  const bestSellers = source.filter((p) => p.badge === 'BEST SELLER');
  return bestSellers.slice(0, count);
}

/**
 * Lấy danh sách sản phẩm thịnh hành (Trending, hỗ trợ lọc gender)
 */
async function getTrendingProducts(genderOrLimit = 8, maybeLimit = 8) {
  let gender = null;
  let limit = 8;
  if (typeof genderOrLimit === 'string' && isNaN(Number(genderOrLimit))) {
    gender = genderOrLimit.toLowerCase().trim();
    limit = parseInt(maybeLimit, 10) || 8;
  } else {
    limit = parseInt(genderOrLimit, 10) || 8;
  }

  const source = await getAllSourceProducts();
  let list = source;
  if (gender) {
    list = list.filter((p) => p.gender === gender);
  }
  return list.slice(0, limit);
}

/**
 * Lấy danh sách sản phẩm liên quan
 */
async function getRelatedProducts(id, limit = 4) {
  const current = await getProductById(id);
  if (!current) return [];
  const source = await getAllSourceProducts();
  return source
    .filter((p) => p.id !== current.id && (p.category === current.category || p.gender === current.gender))
    .slice(0, limit);
}

/**
 * Tạo sản phẩm mới (Admin) - Lưu trực tiếp vào MySQL
 */
async function createProduct(productData) {
  const {
    name,
    category = 'tops',
    gender = 'unisex',
    style = ['minimal'],
    price,
    originalPrice,
    colors = ['Trắng', 'Đen'],
    sizes = ['S', 'M', 'L', 'XL'],
    images = ['/images/products/product-01.jpg'],
    badge = 'NEW',
    description = '',
    stockQuantity = 100,
  } = productData;

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Tên sản phẩm không được để trống');
    error.statusCode = 400;
    throw error;
  }

  if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    const error = new Error('Giá sản phẩm phải là số dương lớn hơn 0');
    error.statusCode = 400;
    throw error;
  }

  const num = Date.now().toString().slice(-4);
  const newId = productData.id || `p${num}`;
  const slug = productData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${newId}`;

  try {
    const created = await prisma.product.create({
      data: {
        id: newId,
        slug,
        name: name.trim(),
        price: parseInt(price, 10),
        originalPrice: originalPrice ? parseInt(originalPrice, 10) : parseInt(price, 10),
        gender: gender.toLowerCase().trim(),
        categoryId: category ? category.toLowerCase().trim() : 'tops',
        categorySlug: category ? category.toLowerCase().trim() : 'tops',
        styles: Array.isArray(style) ? style : [style],
        badge,
        description,
        stockQuantity: parseInt(stockQuantity, 10) || 100,
        images: processImageArray(Array.isArray(images) && images.length > 0 ? images : ['/images/products/product-01.jpg'], newId).map((img) => (typeof img === 'string' ? img : img.url || '')).filter(Boolean),
        sizes: Array.isArray(sizes) ? sizes : [sizes],
        colors: Array.isArray(colors) ? colors : [colors],
        rating: 5.0,
        reviewCount: 0,
      },
    });
    return mapPrismaProduct(created);
  } catch (err) {
    console.error('[productService] DB create failed:', err.message);
    throw err;
  }
}

/**
 * Cập nhật thông tin sản phẩm (Admin) - Lưu trực tiếp vào MySQL
 */
async function updateProduct(id, updateData) {
  if (!id) {
    const error = new Error('Thiếu ID sản phẩm cần cập nhật');
    error.statusCode = 400;
    throw error;
  }

  try {
    const dataToUpdate = {};
    if (updateData.name !== undefined) dataToUpdate.name = String(updateData.name).trim();
    if (updateData.slug !== undefined) dataToUpdate.slug = String(updateData.slug).trim();
    if (updateData.price !== undefined) dataToUpdate.price = parseInt(updateData.price, 10);
    if (updateData.originalPrice !== undefined) dataToUpdate.originalPrice = parseInt(updateData.originalPrice, 10);
    if (updateData.gender !== undefined) dataToUpdate.gender = String(updateData.gender).toLowerCase().trim();
    const cat = updateData.category || updateData.categoryId;
    if (cat !== undefined) {
      const catStr = String(cat).toLowerCase().trim();
      dataToUpdate.categorySlug = catStr;
      try {
        const catRecord = await prisma.category.findFirst({
          where: { OR: [{ id: catStr }, { slug: catStr }] },
        });
        if (catRecord) {
          dataToUpdate.categoryId = catRecord.id;
          dataToUpdate.categorySlug = catRecord.slug;
        }
      } catch (e) {
        // ignore
      }
    }
    if (updateData.badge !== undefined) dataToUpdate.badge = updateData.badge;
    if (updateData.description !== undefined) dataToUpdate.description = String(updateData.description);
    if (updateData.stockQuantity !== undefined) dataToUpdate.stockQuantity = parseInt(updateData.stockQuantity, 10);
    if (updateData.isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(updateData.isFeatured);
    
    if (updateData.style !== undefined || updateData.styles !== undefined || updateData.styleIds !== undefined) {
      const st = updateData.styles || updateData.style || updateData.styleIds;
      dataToUpdate.styles = Array.isArray(st) ? st : [st].filter(Boolean);
    }
    if (updateData.images !== undefined) {
      const raw = Array.isArray(updateData.images) ? updateData.images : [updateData.images].filter(Boolean);
      const processed = processImageArray(raw, id);
      dataToUpdate.images = processed.map((img) => (typeof img === 'string' ? img : img.url || '')).filter(Boolean);
    }
    if (updateData.sizes !== undefined) {
      dataToUpdate.sizes = Array.isArray(updateData.sizes) ? updateData.sizes : [updateData.sizes].filter(Boolean);
    }
    if (updateData.colors !== undefined) {
      dataToUpdate.colors = Array.isArray(updateData.colors) ? updateData.colors : [updateData.colors].filter(Boolean);
    }
    if (updateData.variants && Array.isArray(updateData.variants) && updateData.variants.length > 0) {
      const derivedColors = Array.from(new Set(updateData.variants.map((v) => v.colorName || v.colorId).filter(Boolean)));
      const derivedSizes = Array.from(new Set(updateData.variants.map((v) => v.sizeName || v.sizeId).filter(Boolean)));
      if (derivedColors.length > 0 && !updateData.colors) dataToUpdate.colors = derivedColors;
      if (derivedSizes.length > 0 && !updateData.sizes) dataToUpdate.sizes = derivedSizes;
    }

    const updatedDb = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });
    return mapPrismaProduct(updatedDb);
  } catch (err) {
    console.error('[productService] Prisma update failed:', err);
    throw err;
  }

}

/**
 * Xóa sản phẩm (Admin) - Xóa trực tiếp khỏi MySQL
 */
async function deleteProduct(id) {
  if (!id) {
    const error = new Error('Thiếu ID sản phẩm cần xóa');
    error.statusCode = 400;
    throw error;
  }

  try {
    const deleted = await prisma.product.delete({ where: { id } });
    return mapPrismaProduct(deleted);
  } catch (err) {
    console.error('[productService] Prisma delete error:', err.message);
    throw err;
  }
}

/**
 * Nhân bản sản phẩm (Admin)
 */
async function duplicateProduct(id) {
  const source = await getProductById(id);
  if (!source) {
    const error = new Error(`Không tìm thấy sản phẩm với mã "${id}"`);
    error.statusCode = 404;
    throw error;
  }

  const newId = `p${Date.now().toString().slice(-4)}`;
  const cloned = {
    ...source,
    id: newId,
    name: `${source.name} (Bản sao)`,
    slug: `${source.slug || source.id}-copy-${newId}`,
    badge: 'NEW',
    rating: 5.0,
    reviewCount: 0,
  };

  return createProduct(cloned);
}

/**
 * Kiểm tra xem SKU đã tồn tại trong kho hay chưa
 */
async function checkSkuAvailability(sku, excludeProductId = null) {
  if (!sku || typeof sku !== 'string' || !sku.trim()) {
    const error = new Error('Vui lòng cung cấp mã SKU cần kiểm tra');
    error.statusCode = 400;
    throw error;
  }

  const needle = sku.trim().toLowerCase();
  const source = await getAllSourceProducts();
  const matchedProduct = source.find((p) => {
    if (excludeProductId && p.id.toLowerCase() === excludeProductId.toLowerCase()) {
      return false;
    }
    if (p.sku && p.sku.toLowerCase() === needle) return true;
    if (Array.isArray(p.variants)) {
      return p.variants.some((v) => v.sku && v.sku.toLowerCase() === needle);
    }
    return false;
  });

  return {
    sku: sku.trim(),
    isAvailable: !matchedProduct,
    takenByProductId: matchedProduct ? matchedProduct.id : null,
  };
}

/**
 * Xóa nhiều sản phẩm cùng lúc (Bulk Delete)
 */
async function bulkDeleteProducts(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    const error = new Error('Vui lòng cung cấp danh sách ID sản phẩm cần xóa');
    error.statusCode = 400;
    throw error;
  }

  try {
    const res = await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });
    return {
      success: true,
      deletedCount: res.count,
      deletedIds: ids,
    };
  } catch (err) {
    console.warn('[productService] Bulk delete prisma fallback:', err.message);
  }

  return {
    success: true,
    deletedCount: ids.length,
    deletedIds: ids,
  };
}

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getTrendingProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  checkSkuAvailability,
  bulkDeleteProducts,
};
