const prisma = require('../config/prisma');
const { processImageArray } = require('../utils/fileStorage');

function formatReview(r) {
  if (!r) return null;
  const images = Array.isArray(r.images)
    ? r.images
    : typeof r.images === 'string'
    ? JSON.parse(r.images || '[]')
    : [];

  let prodImg = '';
  if (r.product) {
    if (Array.isArray(r.product.images)) {
      prodImg = r.product.images[0] || '';
    } else if (typeof r.product.images === 'string') {
      try {
        const parsed = JSON.parse(r.product.images);
        prodImg = Array.isArray(parsed) ? parsed[0] : r.product.images;
      } catch {
        prodImg = r.product.images;
      }
    }
  }

  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.user?.fullName || 'Khách hàng Routine',
    userAvatar: r.user?.avatar || '/images/avatars/default.jpg',
    rating: r.rating,
    comment: r.comment || '',
    images,
    status: 'APPROVED',
    createdAt: r.createdAt,
    product: r.product
      ? {
          id: r.product.id,
          name: r.product.name,
          image: prodImg,
          price: r.product.price,
        }
      : null,
  };
}

async function recalculateProductRating(productId) {
  try {
    const dbReviews = await prisma.review.findMany({ where: { productId } });
    const total = dbReviews.length;
    if (total === 0) {
      await prisma.product.update({
        where: { id: productId },
        data: { rating: 5.0, reviewCount: 0 },
      });
      return;
    }
    const sum = dbReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / total).toFixed(1));
    await prisma.product.update({
      where: { id: productId },
      data: { rating: avg, reviewCount: total },
    });
  } catch (err) {
    console.warn('[reviewService] recalculateProductRating fallback:', err.message);
  }
}

async function getProductReviews(productId, { rating, page = 1, limit = 10 } = {}) {
  const where = { productId };
  if (rating) {
    const star = parseInt(rating, 10);
    if (!isNaN(star)) where.rating = star;
  }

  const allReviewsForProduct = await prisma.review.findMany({
    where: { productId },
  });

  const totalReviews = allReviewsForProduct.length;
  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let ratingSum = 0;

  allReviewsForProduct.forEach((r) => {
    if (ratingBreakdown[r.rating] !== undefined) {
      ratingBreakdown[r.rating]++;
    }
    ratingSum += r.rating;
  });

  const averageRating = totalReviews > 0 ? parseFloat((ratingSum / totalReviews).toFixed(1)) : 5.0;

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (currentPage - 1) * pageSize;

  const [filteredCount, records] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      include: { user: true, product: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(filteredCount / pageSize);
  const items = records.map(formatReview);

  return {
    items,
    summary: {
      averageRating,
      totalReviews,
      ratingBreakdown,
    },
    pagination: {
      total: filteredCount,
      page: currentPage,
      limit: pageSize,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
}

async function createReview(user, productId, reviewData) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const error = new Error(`Không tìm thấy sản phẩm với mã "${productId}"`);
    error.statusCode = 404;
    throw error;
  }

  const { rating, comment, images = [] } = reviewData;
  const star = parseInt(rating, 10);
  if (isNaN(star) || star < 1 || star > 5) {
    const error = new Error('Điểm đánh giá phải là số nguyên từ 1 đến 5 sao');
    error.statusCode = 400;
    throw error;
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
    const error = new Error('Nội dung đánh giá phải có tối thiểu 5 ký tự');
    error.statusCode = 400;
    throw error;
  }

  const finalImages = Array.isArray(images) ? processImageArray(images, `rev_${product.id}`) : [];

  const created = await prisma.review.create({
    data: {
      productId: product.id,
      userId: user.id || user.userId,
      rating: star,
      comment: comment.trim(),
      images: finalImages,
    },
    include: { user: true, product: true },
  });

  await recalculateProductRating(product.id);
  const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });

  return {
    review: formatReview(created),
    productStats: {
      productId: product.id,
      rating: updatedProduct.rating,
      reviewCount: updatedProduct.reviewCount,
    },
  };
}

async function deleteReview(reviewId) {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing) {
    const error = new Error(`Không tìm thấy đánh giá với mã "${reviewId}"`);
    error.statusCode = 404;
    throw error;
  }

  const deleted = await prisma.review.delete({
    where: { id: reviewId },
    include: { user: true, product: true },
  });

  await recalculateProductRating(existing.productId);
  return formatReview(deleted);
}

async function getAllReviewsForAdmin({ page = 1, limit = 10, rating, status = 'ALL', productId, search = '' } = {}) {
  const where = {};
  if (productId && productId.trim()) {
    where.productId = productId.trim();
  }
  if (rating) {
    const star = parseInt(rating, 10);
    if (!isNaN(star)) where.rating = star;
  }
  if (search && search.trim()) {
    const needle = search.trim();
    where.OR = [
      { comment: { contains: needle } },
      { user: { fullName: { contains: needle } } },
    ];
  }

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (currentPage - 1) * pageSize;

  const [total, records] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      include: { user: true, product: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const items = records.map(formatReview);

  return {
    items,
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

module.exports = {
  getProductReviews,
  createReview,
  deleteReview,
  getAllReviewsForAdmin,
  recalculateProductRating,
};
