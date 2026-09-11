// Upload service để tải ảnh trực tiếp lên server, lưu file vật lý và trả về URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function uploadImageFile(file) {
  if (!file) throw new Error("Chưa chọn file hình ảnh");

  const formData = new FormData();
  formData.append('image', file);

  let token = null;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('routine_token') || localStorage.getItem('token');
    if (stored) token = stored;
  }

  if (!token) {
    throw new Error('Phiên đăng nhập Admin đã hết hạn. Vui lòng đăng nhập lại.');
  }

  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Lỗi tải ảnh (${res.status})`);
  }

  return json?.data?.url || json?.url;
}

export default uploadImageFile;
