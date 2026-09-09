/**
 * Quản lý kho mã giảm giá (Coupons / Vouchers)
 */

const couponsMap = new Map([
  [
    'ROUTINE10',
    {
      code: 'ROUTINE10',
      type: 'percent',
      value: 10,
      maxDiscount: 100000,
      minOrderValue: 200000,
      description: 'Giảm 10% tối đa 100k cho đơn từ 200k',
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2026-12-31',
    },
  ],
  [
    'ROUTINE50K',
    {
      code: 'ROUTINE50K',
      type: 'fixed',
      value: 50000,
      minOrderValue: 300000,
      description: 'Giảm 50.000đ cho đơn từ 300k',
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2026-12-31',
    },
  ],
  [
    'FREESHIP',
    {
      code: 'FREESHIP',
      type: 'freeship',
      value: 30000,
      minOrderValue: 0,
      description: 'Miễn phí vận chuyển toàn quốc',
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2026-12-31',
    },
  ],
  [
    'WELCOME20',
    {
      code: 'WELCOME20',
      type: 'percent',
      value: 20,
      maxDiscount: 200000,
      minOrderValue: 500000,
      description: 'Giảm 20% tối đa 200k cho thành viên mới',
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2026-12-31',
    },
  ],
]);

/**
 * Lấy danh sách các mã giảm giá đang kích hoạt
 */
async function getActiveCoupons() {
  const now = new Date();
  const list = Array.from(couponsMap.values()).filter((c) => {
    if (!c.isActive) return false;
    if (c.endDate && new Date(c.endDate) < now) return false;
    return true;
  });
  return list;
}

/**
 * Kiểm tra mã giảm giá và tính toán số tiền giảm
 */
async function validateCoupon(code, subtotal = 0) {
  if (!code || typeof code !== 'string') {
    const error = new Error('Vui lòng cung cấp mã giảm giá');
    error.statusCode = 400;
    throw error;
  }

  const normalized = code.trim().toUpperCase();
  const coupon = couponsMap.get(normalized);

  if (!coupon || !coupon.isActive) {
    const error = new Error(`Mã giảm giá "${normalized}" không hợp lệ hoặc đã hết hiệu lực`);
    error.statusCode = 400;
    throw error;
  }

  const orderValue = Number(subtotal) || 0;

  if (orderValue < coupon.minOrderValue) {
    const error = new Error(
      `Đơn hàng chưa đạt giá trị tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã "${coupon.code}"`
    );
    error.statusCode = 400;
    throw error;
  }

  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.min(Math.round((orderValue * coupon.value) / 100), coupon.maxDiscount || Infinity);
  } else if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, orderValue);
  } else if (coupon.type === 'freeship') {
    discount = coupon.value || 30000;
  }

  return {
    valid: true,
    code: coupon.code,
    type: coupon.type,
    discountAmount: discount,
    description: coupon.description,
    coupon,
  };
}

/**
 * Tạo mã giảm giá mới (Admin)
 */
async function createCoupon(couponData) {
  const { code, type = 'percent', value, minOrderValue = 0, maxDiscount, description } = couponData;

  if (!code || typeof code !== 'string' || !code.trim()) {
    const error = new Error('Mã giảm giá không được để trống');
    error.statusCode = 400;
    throw error;
  }

  const normalized = code.trim().toUpperCase();
  if (couponsMap.has(normalized)) {
    const error = new Error(`Mã giảm giá "${normalized}" đã tồn tại`);
    error.statusCode = 409;
    throw error;
  }

  if (value === undefined || isNaN(Number(value)) || Number(value) <= 0) {
    const error = new Error('Giá trị giảm phải là số dương lớn hơn 0');
    error.statusCode = 400;
    throw error;
  }

  const newCoupon = {
    code: normalized,
    type: ['percent', 'fixed', 'freeship'].includes(type) ? type : 'percent',
    value: Number(value),
    minOrderValue: Number(minOrderValue) || 0,
    maxDiscount: maxDiscount ? Number(maxDiscount) : null,
    description: description || `Giảm giá theo mã ${normalized}`,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  couponsMap.set(normalized, newCoupon);
  return newCoupon;
}

/**
 * Cập nhật mã giảm giá (Admin)
 */
async function updateCoupon(code, updateData) {
  const normalized = (code || '').trim().toUpperCase();
  const coupon = couponsMap.get(normalized);

  if (!coupon) {
    const error = new Error(`Không tìm thấy mã giảm giá "${normalized}"`);
    error.statusCode = 404;
    throw error;
  }

  const updated = {
    ...coupon,
    ...updateData,
    code: coupon.code, // giữ nguyên mã
    value: updateData.value !== undefined ? Number(updateData.value) : coupon.value,
    minOrderValue:
      updateData.minOrderValue !== undefined ? Number(updateData.minOrderValue) : coupon.minOrderValue,
    updatedAt: new Date().toISOString(),
  };

  couponsMap.set(normalized, updated);
  return updated;
}

/**
 * Xóa/Vô hiệu hóa mã giảm giá (Admin)
 */
async function deleteCoupon(code) {
  const normalized = (code || '').trim().toUpperCase();
  const coupon = couponsMap.get(normalized);

  if (!coupon) {
    const error = new Error(`Không tìm thấy mã giảm giá "${normalized}"`);
    error.statusCode = 404;
    throw error;
  }

  couponsMap.delete(normalized);
  return {
    deleted: true,
    code: normalized,
    message: `Đã xóa mã giảm giá "${normalized}" thành công`,
  };
}

module.exports = {
  couponsMap,
  getActiveCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
