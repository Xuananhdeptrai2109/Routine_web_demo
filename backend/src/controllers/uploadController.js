const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mediaService = require('../services/mediaService');
const { sendSuccess, sendError } = require('../utils/response');

// Sử dụng memoryStorage để lưu file vào Buffer trong RAM, tương thích 100% với môi trường Serverless / Vercel
const storage = multer.memoryStorage();

// Cho phép tải lên bất kỳ định dạng ảnh nào
function fileFilter(req, file, cb) {
  const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/svg+xml',
  ]);
  if (!allowedMimeTypes.has(file.mimetype)) {
    const error = new Error('Chỉ chấp nhận file ảnh JPEG, PNG, WEBP, AVIF, SVG hoặc GIF');
    error.statusCode = 400;
    return cb(error);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Hỗ trợ file lên tới 50MB
  },
  fileFilter,
});

/**
 * Xử lý sau khi upload thành công: Lưu trực tiếp vào Database MySQL (bảng media_files)
 */
async function handleUploadSuccess(req, res, next) {
  try {
    if (!req.file) {
      return sendError(res, 'Vui lòng chọn file hình ảnh cần tải lên', 400);
    }

    const extensions = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/avif': '.avif',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
    };
    const ext = extensions[req.file.mimetype] || path.extname(req.file.originalname) || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `img-${uniqueSuffix}${ext}`;

    // 1. Lưu file vào Database MySQL
    const saved = await mediaService.saveMediaFile({
      filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
    });

    // 2. Lưu phụ bản trên đĩa nếu môi trường local cho phép
    try {
      const uploadDir = path.resolve(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
    } catch (diskErr) {
      // Bỏ qua trên Vercel / Read-Only filesystem
    }

    return sendSuccess(
      res,
      {
        url: saved.url,
        id: saved.id,
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      'Tải hình ảnh lên thành công',
      201
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadSingle: upload.single('image'),
  handleUploadSuccess,
};
