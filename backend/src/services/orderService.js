const prisma = require('../config/prisma');
const cartService = require('./cartService');
const stockReservationService = require('./stockReservationService');
const emailService = require('./emailService');

/**
 * Xây dựng timeline các mốc thời gian giao nhận
 */
function buildOrderTimeline(order) {
  const baseDate = new Date(order.createdAt || Date.now());

  const timeline = [
    {
      status: 'placed',
      title: 'Đã đặt hàng',
      description: 'Đơn hàng đã được tạo thành công trên hệ thống',
      time: order.createdAt,
      completed: true,
    },
    {
      status: 'confirmed',
      title: 'Đã xác nhận',
      description: 'Routine đã duyệt đơn và chuẩn bị hàng',
      time: new Date(baseDate.getTime() + 2 * 3600 * 1000).toISOString(),
      completed: ['confirmed', 'shipping', 'delivered'].includes(order.status),
    },
    {
      status: 'shipping',
      title: 'Đang vận chuyển',
      description: 'Đơn hàng đang trên đường giao đến bạn',
      time: new Date(baseDate.getTime() + 24 * 3600 * 1000).toISOString(),
      completed: ['shipping', 'delivered'].includes(order.status),
    },
    {
      status: 'delivered',
      title: 'Đã giao thành công',
      description: 'Khách hàng đã nhận hàng và hoàn tất',
      time: new Date(baseDate.getTime() + 48 * 3600 * 1000).toISOString(),
      completed: order.status === 'delivered',
    },
  ];

  if (order.status === 'cancelled') {
    return [
      timeline[0],
      {
        status: 'cancelled',
        title: 'Đã hủy đơn',
        description: 'Đơn hàng đã bị hủy theo yêu cầu của quý khách',
        time: order.updatedAt || order.createdAt,
        completed: true,
      },
    ];
  }

  return timeline;
}

async function formatOrder(o) {
  if (!o) return null;
  const items = (o.items || []).map((i) => ({
    id: i.id,
    orderId: i.orderId,
    productId: i.productId,
    name: i.name,
    image: i.image || '',
    size: i.size || '',
    color: i.color || '',
    price: i.price,
    quantity: i.quantity,
    subtotal: i.subtotal,
  }));

  const shippingAddrObj = {
    name: o.receiverName || '',
    phone: o.phoneNumber || '',
    address: o.shippingAddress || '',
  };

  const status = (o.orderStatus || 'CONFIRMED').toLowerCase();

  const formatted = {
    id: o.id,
    userId: o.userId,
    identityId: o.userId || o.guestSessionId,
    guestSessionId: o.guestSessionId,
    receiverName: o.receiverName,
    phoneNumber: o.phoneNumber,
    shippingAddress: shippingAddrObj,
    shippingMethod: o.shippingMethod || 'standard',
    paymentMethod: (o.paymentMethod || 'COD').toLowerCase(),
    paymentStatus: o.paymentStatus || 'UNPAID',
    orderStatus: o.orderStatus || 'CONFIRMED',
    status,
    subtotal: o.subtotal,
    shippingFee: o.shippingFee,
    shipping: o.shippingFee,
    discount: o.discount,
    total: o.total,
    note: o.note || '',
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    items,
    reservation: await stockReservationService.getReservation(o.id),
  };

  return {
    ...formatted,
    timeline: buildOrderTimeline(formatted),
  };
}

/**
 * Tạo đơn hàng mới trong MySQL
 */
async function createOrder(identityId, orderInput) {
  const {
    items,
    shippingAddress,
    shippingMethod = 'standard',
    paymentMethod = 'cod',
    subtotal,
    shipping = 30000,
    discount = 0,
    total,
    note,
  } = orderInput;

  let orderItems = items;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    const currentCart = cartService.getCart(identityId);
    if (!currentCart.items || currentCart.items.length === 0) {
      const error = new Error('Giỏ hàng trống, không thể tạo đơn hàng');
      error.statusCode = 400;
      throw error;
    }
    orderItems = currentCart.items;
  }

  const receiverName = (shippingAddress && (shippingAddress.name || shippingAddress.fullName || shippingAddress.receiverName)) || 'Khách hàng';
  const phoneNumber = (shippingAddress && (shippingAddress.phone || shippingAddress.phoneNumber)) || '0123456789';
  const fullAddress =
    typeof shippingAddress === 'string'
      ? shippingAddress
      : (shippingAddress && (shippingAddress.address || shippingAddress.street || 'Địa chỉ nhận hàng'));

  const calculatedSubtotal =
    subtotal !== undefined
      ? Number(subtotal)
      : orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculatedShipping = shipping !== undefined ? Number(shipping) : (calculatedSubtotal >= 500000 ? 0 : 30000);
  const calculatedDiscount = discount !== undefined ? Number(discount) : 0;
  const calculatedTotal =
    total !== undefined
      ? Number(total)
      : Math.max(0, calculatedSubtotal + calculatedShipping - calculatedDiscount);

  // Sinh ID dạng ORD-YYYY-XXXX
  const year = new Date().getFullYear();
  const allOrders = await prisma.order.findMany({ select: { id: true } });
  const numbers = allOrders
    .map((o) => {
      const match = o.id.match(/ORD-(\d{4})-(\d+)/);
      return match && Number(match[1]) === year ? Number(match[2]) : 0;
    })
    .filter(Boolean);
  const nextNum = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
  const newOrderId = `ORD-${year}-${String(nextNum).padStart(4, '0')}`;

  const payMethodMap = {
    cod: 'COD',
    card: 'CARD',
    vnpay: 'VNPAY',
    momo: 'MOMO',
  };
  const finalPayMethod = payMethodMap[(paymentMethod || 'cod').toLowerCase()] || 'COD';

  const cleanUserId = identityId ? identityId.replace(/^user_/, '') : null;
  const isRealUser = cleanUserId && (cleanUserId.startsWith('usr-') || cleanUserId.length === 36);

  let validUserId = null;
  if (isRealUser) {
    try {
      const userExists = await prisma.user.findUnique({ where: { id: cleanUserId } });
      if (userExists) validUserId = cleanUserId;
    } catch (uErr) {
      // fallback
    }
  }

  const initialOrderStatus = finalPayMethod === 'VNPAY' ? 'PENDING' : 'CONFIRMED';

  const created = await prisma.order.create({
    data: {
      id: newOrderId,
      userId: validUserId,
      guestSessionId: !validUserId ? identityId : null,
      receiverName,
      phoneNumber,
      shippingAddress: fullAddress,
      shippingMethod,
      paymentMethod: finalPayMethod,
      paymentStatus: 'UNPAID',
      orderStatus: initialOrderStatus,
      subtotal: calculatedSubtotal,
      shippingFee: calculatedShipping,
      discount: calculatedDiscount,
      total: calculatedTotal,
      note: note || '',
      items: {
        create: orderItems.map((item) => ({
          productId: item.productId,
          name: item.name || 'Sản phẩm',
          image: item.image || '',
          size: item.size || 'M',
          color: item.color || 'Đen',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 1),
        })),
      },
    },
    include: { items: true },
  });

  // Tạo order trước để thỏa mãn khóa ngoại của stock_reservations.
  // Nếu không đủ hàng, xóa order vừa tạo để không lưu đơn mồ côi.
  try {
    await stockReservationService.reserveStock(newOrderId, orderItems, 5);
  } catch (reservationError) {
    await prisma.order.delete({ where: { id: newOrderId } }).catch(() => {});
    throw reservationError;
  }

  // Chỉ xóa giỏ hàng nếu đơn là COD
  // Đối với VNPay, giỏ hàng được bảo toàn cho tới khi thanh toán thành công
  if (finalPayMethod !== 'VNPAY') {
    try {
      cartService.clearCart(identityId);
    } catch (err) {
      // Không block nếu clear giỏ lỗi
    }

    // Tự động gửi Email Hóa đơn đơn hàng cho COD
    let customerEmail =
      orderInput.customerEmail ||
      orderInput.email ||
      (orderInput.contact && orderInput.contact.email) ||
      (shippingAddress && shippingAddress.email);

    if (!customerEmail && validUserId) {
      try {
        const u = await prisma.user.findUnique({ where: { id: validUserId }, select: { email: true } });
        if (u) customerEmail = u.email;
      } catch (e) {}
    }

    if (customerEmail) {
      setImmediate(async () => {
        try {
          await emailService.sendOrderInvoiceEmail({
            order: created,
            customerEmail,
            customerName: receiverName,
          });
        } catch (e) {
          console.error('[orderService] Lỗi gửi email hóa đơn COD:', e.message);
        }
      });
    }
  }

  return formatOrder(created);
}

/**
 * Lấy danh sách đơn hàng cho người dùng
 */
async function getOrders({ identityId, status, page = 1, limit = 10 } = {}) {
  const where = {};

  if (identityId) {
    const cleanId = identityId.replace(/^user_/, '');
    where.OR = [
      { userId: cleanId },
      { userId: identityId },
      { guestSessionId: identityId },
      { guestSessionId: cleanId },
      { guestSessionId: `user_${cleanId}` },
    ];
  }

  if (status) {
    where.orderStatus = { equals: status.toUpperCase().trim() };
  }

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (currentPage - 1) * pageSize;

  let [total, records] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Nếu identity chưa có đơn riêng, trả về các đơn mẫu trong DB để xem
  if (total === 0 && identityId) {
    const fallbackWhere = status ? { orderStatus: status.toUpperCase().trim() } : {};
    total = await prisma.order.count({ where: fallbackWhere });
    records = await prisma.order.findMany({
      where: fallbackWhere,
      skip,
      take: pageSize,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  const totalPages = Math.ceil(total / pageSize);
  const items = await Promise.all(records.map(formatOrder));

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

/**
 * Lấy chi tiết đơn hàng theo ID
 */
async function getOrderById(id) {
  if (!id) return null;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  return order ? formatOrder(order) : null;
}

/**
 * Hủy đơn hàng
 */
async function cancelOrder(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    const error = new Error(`Không tìm thấy đơn hàng với mã "${id}"`);
    error.statusCode = 404;
    throw error;
  }

  const currentStatus = order.orderStatus.toLowerCase();
  if (currentStatus === 'shipping' || currentStatus === 'delivered') {
    const error = new Error('Đơn hàng đang giao hoặc đã hoàn tất, không thể tự hủy');
    error.statusCode = 400;
    throw error;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { orderStatus: 'CANCELLED' },
    include: { items: true },
  });

  await stockReservationService.releaseStock(id);

  return formatOrder(updated);
}

/**
 * Mua lại đơn hàng cũ (thêm lại items vào giỏ)
 */
async function reorder(id, identityId) {
  const order = await getOrderById(id);
  if (!order) {
    const error = new Error(`Không tìm thấy đơn hàng với mã "${id}"`);
    error.statusCode = 404;
    throw error;
  }

  if (order.items && order.items.length > 0) {
    cartService.addBulkItems(
      identityId,
      order.items.map((i) => ({
        productId: i.productId,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        image: i.image,
        name: i.name,
        price: i.price,
      }))
    );
  }

  return cartService.getCart(identityId);
}

/**
 * Lấy toàn bộ đơn hàng của tất cả khách hàng (Admin)
 */
async function getAllOrdersForAdmin({ status, page = 1, limit = 20, search } = {}) {
  const where = {};

  if (status) {
    where.orderStatus = status.toUpperCase().trim();
  }

  if (search && search.trim()) {
    const needle = search.trim();
    where.OR = [
      { id: { contains: needle } },
      { receiverName: { contains: needle } },
      { phoneNumber: { contains: needle } },
    ];
  }

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (currentPage - 1) * pageSize;

  const [total, records] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const items = records.map(formatOrder);

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

/**
 * Cập nhật trạng thái đơn hàng (Admin)
 */
async function updateOrderStatus(id, newStatus) {
  if (!id) {
    const error = new Error('Thiếu mã đơn hàng');
    error.statusCode = 400;
    throw error;
  }

  const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
  const targetStatus = newStatus ? newStatus.toUpperCase().trim() : '';

  if (!validStatuses.includes(targetStatus)) {
    const error = new Error(
      `Trạng thái không hợp lệ. Các trạng thái được phép: ${validStatuses.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { orderStatus: targetStatus },
    include: { items: true },
  });

  return formatOrder(updated);
}

function getOrderHoldStatus(id) {
  return stockReservationService.getReservation(id);
}

/**
 * Gửi (hoặc gửi lại) hóa đơn đơn hàng qua Email
 */
async function sendOrderInvoice(orderId, targetEmail = null) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });

  if (!order) {
    const error = new Error(`Không tìm thấy đơn hàng với mã "${orderId}"`);
    error.statusCode = 404;
    throw error;
  }

  const recipient = targetEmail || (order.user && order.user.email);
  if (!recipient) {
    const error = new Error('Không tìm thấy địa chỉ email nhận hóa đơn');
    error.statusCode = 400;
    throw error;
  }

  const result = await emailService.sendOrderInvoiceEmail({
    order,
    customerEmail: recipient,
    customerName: order.receiverName || (order.user && order.user.fullName),
  });

  return {
    success: true,
    orderId,
    recipient,
    ...result,
  };
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  reorder,
  buildOrderTimeline,
  getAllOrdersForAdmin,
  updateOrderStatus,
  getOrderHoldStatus,
  sendOrderInvoice,
};
