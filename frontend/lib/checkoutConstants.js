// Shared constants for the Checkout → Payment → Order flow.
// Centralized so Cart, Checkout, Payment and Order Detail all agree
// on the same labels/fees/status order.

export const SHIPPING_METHODS = {
  standard: {
    id: "standard",
    label: "Standard Delivery",
    fee: 30000,
    eta: "3–5 business days"
  },
  express: {
    id: "express",
    label: "Express Delivery",
    fee: 50000,
    eta: "1–2 business days"
  }
};

export const DEFAULT_SHIPPING_METHOD = "standard";

export function getShippingFee(methodId) {
  return SHIPPING_METHODS[methodId]?.fee ?? SHIPPING_METHODS[DEFAULT_SHIPPING_METHOD].fee;
}

export const PAYMENT_METHODS = [
  { id: "cod", label: "COD", description: "Thanh toán khi nhận hàng" },
  { id: "card", label: "Credit / Debit Card", description: "Thanh toán bằng thẻ" },
  { id: "vnpay", label: "VNPay", description: "Chuyển tới cổng thanh toán VNPay" },
  { id: "momo", label: "MoMo", description: "Chuyển tới cổng thanh toán MoMo" }
];

export const PAYMENT_METHOD_LABELS = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  vnpay: "VNPay",
  momo: "MoMo"
};

// Canonical order status flow, in progression order. "cancelled" is a
// terminal state handled separately from the linear timeline.
export const ORDER_STATUS_FLOW = ["pending", "confirmed", "processing", "shipping", "delivered"];

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export const ORDER_FILTERS = [
  { label: "All", value: null },
  { label: "Processing", value: "processing" },
  { label: "Shipping", value: "shipping" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" }
];

export function getOrderStatusStepIndex(status) {
  return ORDER_STATUS_FLOW.indexOf(status);
}

export function canCancelOrder(status) {
  return ["pending", "confirmed", "processing"].includes(status);
}
