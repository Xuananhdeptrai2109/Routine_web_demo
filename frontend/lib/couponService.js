import { fetchApi } from "./api";

/**
 * Lấy toàn bộ mã giảm giá cho Admin (bao gồm cả mã đã tắt)
 */
export async function fetchAdminCoupons({ status, search } = {}) {
  const queryParams = new URLSearchParams();
  if (status && status !== "ALL") queryParams.append("status", status);
  if (search && search.trim()) queryParams.append("search", search.trim());

  const qs = queryParams.toString();
  const endpoint = `/coupons/admin/all${qs ? `?${qs}` : ""}`;
  return await fetchApi(endpoint);
}

/**
 * Lấy danh sách mã giảm giá đang kích hoạt (Storefront)
 */
export async function fetchActiveCoupons() {
  return await fetchApi("/coupons");
}

/**
 * Tạo mã giảm giá mới (Admin)
 */
export async function createCoupon(couponData) {
  return await fetchApi("/coupons", {
    method: "POST",
    body: JSON.stringify(couponData),
  });
}

/**
 * Cập nhật mã giảm giá (Admin)
 */
export async function updateCoupon(code, couponData) {
  return await fetchApi(`/coupons/${encodeURIComponent(code)}`, {
    method: "PUT",
    body: JSON.stringify(couponData),
  });
}

/**
 * Xóa mã giảm giá (Admin)
 */
export async function deleteCoupon(code) {
  return await fetchApi(`/coupons/${encodeURIComponent(code)}`, {
    method: "DELETE",
  });
}
