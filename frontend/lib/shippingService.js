import { fetchApi } from "./api";

/**
 * Gọi API xác thực địa chỉ qua Google Maps Geocoding / OSM
 * và tính khoảng cách tới cửa hàng Routine gần nhất
 */
export async function checkAddressApi(addressData) {
  try {
    const res = await fetchApi("/shipping/check-address", {
      method: "POST",
      body: JSON.stringify(addressData),
    });

    if (res && res.success && res.data) {
      return res.data;
    }
    return {
      valid: false,
      message: res?.message || "Địa chỉ không tồn tại hoặc không thể định vị.",
    };
  } catch (err) {
    return {
      valid: false,
      message: err?.message || "Không thể kết nối đến dịch vụ bản đồ.",
    };
  }
}

/**
 * Tính toán biểu phí ship Standard & Express theo giá trị đơn hàng và khoảng cách
 */
export async function calculateShippingApi(subtotal, distanceKm, nearestStore) {
  try {
    const res = await fetchApi("/shipping/calculate", {
      method: "POST",
      body: JSON.stringify({ subtotal, distanceKm, nearestStore }),
    });

    if (res && res.success && res.data) {
      return res.data;
    }
    return null;
  } catch (err) {
    console.error("Failed to calculate shipping via API:", err);
    return null;
  }
}
