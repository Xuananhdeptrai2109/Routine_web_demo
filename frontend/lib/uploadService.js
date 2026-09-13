// Upload service để tải ảnh lên server, lưu trực tiếp vào Database MySQL (bảng media_files)
const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
const API_BASE = RAW_API_BASE.endsWith('/api/v1') ? RAW_API_BASE : `${RAW_API_BASE}/api/v1`;

/**
 * Tự động nén và tối ưu hóa hình ảnh ngay trên trình duyệt trước khi gửi lên:
 * - Khắc phục triệt để lỗi 413 Payload Too Large (Vercel giới hạn cứng 4.5MB).
 * - Giảm kích thước ảnh từ 5MB-20MB xuống dưới 800KB mà vẫn sắc nét chuẩn 2K (1920px).
 * - Giúp upload nhanh tức thì và tăng tốc độ tải trang web.
 */
async function compressImageForUpload(file) {
  // Không nén file SVG hoặc GIF động (để giữ nguyên chuyển động)
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // Nếu file đã rất nhỏ (< 800KB) và là webp hoặc jpeg thì không cần nén
  if (file.size < 800 * 1024 && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
    return file;
  }

  if (typeof window === 'undefined') return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDimension = 1920; // Chuẩn Full HD / 2K cho banner & hero

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);

        // Sử dụng format webp (nén tốt nhất, hỗ trợ cả ảnh trong suốt) hoặc jpeg
        const format = 'image/webp';
        const quality = 0.85;

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              return resolve(file);
            }
            const cleanName = file.name.replace(/\.[^.]+$/, '') + '.webp';
            const compressedFile = new File([blob], cleanName, {
              type: format,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          format,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file) {
  if (!file) throw new Error("Chưa chọn file hình ảnh");

  // Tự động nén ảnh nếu file nặng, tránh lỗi 413 Payload Too Large của Vercel
  const fileToUpload = await compressImageForUpload(file);

  const formData = new FormData();
  formData.append('image', fileToUpload);

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
    if (res.status === 413) {
      throw new Error('Dung lượng ảnh vượt quá giới hạn cho phép của máy chủ (4.5MB). Vui lòng chọn ảnh nhẹ hơn.');
    }
    const errorMsg = json?.message || `Lỗi tải ảnh (${res.status})`;
    throw new Error(errorMsg);
  }

  return json?.data?.url || json?.url;
}

export default uploadImageFile;
