// Upload service để tải ảnh lên server, lưu trực tiếp vào Database MySQL (bảng media_files)
const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
const API_BASE = RAW_API_BASE.endsWith('/api/v1') ? RAW_API_BASE : `${RAW_API_BASE}/api/v1`;

export async function uploadImageFile(file) {
  if (!file) throw new Error("Chưa chọn file hình ảnh");

  const formData = new FormData();
  formData.append('image', file);

  let token = null;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('routine_token') || localStorage.getItem('token');
    if (stored) {
      try {
        const parts = stored.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const notExpired = !payload.exp || payload.exp * 1000 > Date.now();
          if (notExpired) {
            token = stored;
          }
        }
      } catch (e) {
        token = stored;
      }
    }
  }

  if (!token) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
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
    const errorMsg = json?.message || `Lỗi tải ảnh (${res.status})`;
    throw new Error(errorMsg);
  }

  return json?.data?.url || json?.url;
}

export default uploadImageFile;
