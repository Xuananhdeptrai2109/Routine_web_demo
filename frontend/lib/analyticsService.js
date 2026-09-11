import { fetchApi } from './api';

/**
 * Lấy toàn bộ số liệu thống kê thời gian thực từ Database cho Dashboard Admin
 */
export async function fetchAdminDashboard() {
  try {
    const data = await fetchApi('/analytics/admin/dashboard');
    return data;
  } catch (err) {
    console.error('[analyticsService] fetchAdminDashboard failed:', err.message);
    return null;
  }
}

/**
 * Lấy báo cáo tổng quan hệ sinh thái đa nền tảng (Dashboard Admin)
 */
export async function fetchEcosystemOverview() {
  try {
    const data = await fetchApi('/analytics/admin/overview');
    return data;
  } catch (err) {
    console.error('[analyticsService] fetchEcosystemOverview failed:', err.message);
    return null;
  }
}

/**
 * Lấy danh sách khách vãng lai (Guest Sessions)
 */
export async function fetchGuestVisitors(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.platform && params.platform !== 'ALL') query.set('platform', params.platform);
  if (params.search) query.set('search', params.search);

  try {
    const data = await fetchApi(`/analytics/admin/guests?${query.toString()}`);
    return data;
  } catch (err) {
    console.error('[analyticsService] fetchGuestVisitors failed:', err.message);
    return { items: [], pagination: { total: 0, totalPages: 0 } };
  }
}

/**
 * Lấy danh sách khách hàng thành viên có lọc theo nguồn tiếp cận
 */
export async function fetchAdminCustomers(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'ALL') query.set('status', params.status);
  if (params.source && params.source !== 'ALL') query.set('source', params.source);
  if (params.sortBy) query.set('sortBy', params.sortBy);

  try {
    const data = await fetchApi(`/admin/customers?${query.toString()}`);
    return data;
  } catch (err) {
    console.error('[analyticsService] fetchAdminCustomers failed:', err.message);
    return { items: [], pagination: { totalItems: 0, totalPages: 0 } };
  }
}

/**
 * Khóa / Mở khóa tài khoản khách hàng
 */
export async function updateCustomerStatus(id, status) {
  return await fetchApi(`/admin/customers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Tạo đường dẫn tiếp thị chuyên biệt cho sản phẩm trên mạng xã hội
 */
export function generateCampaignUrl({ productId, platform = 'tiktok', campaign = '' }) {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const p = platform.toLowerCase();
  const c = campaign ? encodeURIComponent(campaign.trim()) : `${p}_promo`;
  return `${origin}/product/${productId}?source=${p}&utm_source=${p}&utm_medium=social&utm_campaign=${c}`;
}
