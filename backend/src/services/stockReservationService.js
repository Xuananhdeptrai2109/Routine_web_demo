/**
 * Dịch vụ giữ hàng tồn kho trong database.
 * Reservation không trừ stockQuantity; nó chỉ làm giảm số lượng khả dụng
 * cho các phiên thanh toán khác cho đến khi expiresAt hết hạn.
 */

const prisma = require('../config/prisma');

async function getHeldQuantity(productId, excludeOrderId = null) {
  const reservations = await prisma.stockReservation.findMany({
    where: {
      expiresAt: { gt: new Date() },
      ...(excludeOrderId ? { orderId: { not: excludeOrderId } } : {}),
    },
    select: { items: true },
  });

  return reservations.reduce((total, reservation) => {
    const items = Array.isArray(reservation.items) ? reservation.items : [];
    return total + items.reduce((itemTotal, item) => {
      return itemTotal + (item.productId === productId ? Number(item.quantity) || 1 : 0);
    }, 0);
  }, 0);
}

async function reserveStock(orderId, items = [], durationMinutes = 5) {
  if (!orderId || !Array.isArray(items) || items.length === 0) return null;

  for (const item of items) {
    const qty = Number(item.quantity) || 1;
    let currentStock = 100;

    try {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stockQuantity: true },
      });
      if (product && product.stockQuantity !== undefined) {
        currentStock = Number(product.stockQuantity);
      }
    } catch (err) {
      console.warn(`[stockReservation] Không thể truy vấn sản phẩm ${item.productId}:`, err.message);
    }

    const heldStock = await getHeldQuantity(item.productId, orderId);
    const availableStock = Math.max(0, currentStock - heldStock);
    if (availableStock < qty) {
      const error = new Error(
        `Sản phẩm "${item.name || item.productId}" không đủ số lượng (chỉ còn ${availableStock} khả dụng do đang có khách hàng khác giữ chỗ).`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
  const reservationItems = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    quantity: Number(item.quantity) || 1,
  }));

  await prisma.stockReservation.upsert({
    where: { orderId },
    create: { orderId, items: reservationItems, expiresAt },
    update: { items: reservationItems, expiresAt },
  });

  return {
    orderId,
    isHeld: true,
    expiresAt: expiresAt.toISOString(),
    remainingSeconds: Math.round((expiresAt.getTime() - Date.now()) / 1000),
  };
}

async function commitStock(orderId) {
  const reservation = await prisma.stockReservation.findUnique({ where: { orderId } });
  let itemsToDeduct = reservation && Array.isArray(reservation.items) ? reservation.items : null;

  if (!itemsToDeduct) {
    const orderItems = await prisma.orderItem.findMany({ where: { orderId } });
    itemsToDeduct = orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  }

  for (const item of itemsToDeduct) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockQuantity: { decrement: Number(item.quantity) || 1 } },
    });
  }

  await prisma.stockReservation.deleteMany({ where: { orderId } });
  return true;
}

async function releaseStock(orderId) {
  const result = await prisma.stockReservation.deleteMany({ where: { orderId } });
  return result.count > 0;
}

async function getReservation(orderId) {
  const reservation = await prisma.stockReservation.findUnique({ where: { orderId } });
  if (!reservation || reservation.expiresAt <= new Date()) {
    return { orderId, isHeld: false, expiresAt: null, remainingSeconds: 0 };
  }

  return {
    orderId,
    isHeld: true,
    expiresAt: reservation.expiresAt.toISOString(),
    remainingSeconds: Math.max(0, Math.round((reservation.expiresAt.getTime() - Date.now()) / 1000)),
  };
}

async function cleanupExpiredReservations() {
  const expiredReservations = await prisma.stockReservation.findMany({
    where: { expiresAt: { lte: new Date() } },
    select: { orderId: true },
  });

  for (const { orderId } of expiredReservations) {
    await prisma.$transaction(async (transaction) => {
      const order = await transaction.order.findUnique({
        where: { id: orderId },
        select: { paymentStatus: true, orderStatus: true, note: true },
      });

      await transaction.stockReservation.deleteMany({ where: { orderId } });

      if (order && order.paymentStatus === 'UNPAID' && order.orderStatus !== 'CANCELLED') {
        const timeoutNote = '[Tự động hủy] Đơn hàng quá hạn thanh toán 5 phút, kho đã giải phóng';
        await transaction.order.update({
          where: { id: orderId },
          data: {
            orderStatus: 'CANCELLED',
            note: order.note ? `${order.note} | ${timeoutNote}` : timeoutNote,
          },
        });
      }
    });
  }
}

const cleanupInterval = setInterval(() => {
  cleanupExpiredReservations().catch((error) => {
    console.error('[stockReservation] Cleanup failed:', error.message);
  });
}, 15000);

if (cleanupInterval.unref) cleanupInterval.unref();

module.exports = {
  getHeldQuantity,
  reserveStock,
  commitStock,
  releaseStock,
  getReservation,
  cleanupExpiredReservations,
};