const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendSuccess, sendError } = require('../utils/response');

// Thư mục lưu trữ ảnh tải lên
const uploadDir = path.resolve(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const extensions = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/avif': '.avif',
      'image/gif': '.gif',
    };
    const ext = extensions[file.mimetype] || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

// Cho phép tải lên bất kỳ định dạng ảnh nào (JPEG, PNG, WEBP, AVIF, HEIC, HEIF, GIF, SVG, BMP, TIFF, JFIF, RAW...)
function fileFilter(req, file, cb) {
  const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']);
  if (!allowedMimeTypes.has(file.mimetype)) {
    const error = new Error('Chỉ chấp nhận file ảnh JPEG, PNG, WEBP, AVIF hoặc GIF');
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
 * Xử lý sau khi upload thành công
 */
function handleUploadSuccess(req, res) {
  if (!req.file) {
    return sendError(res, 'Vui lòng chọn file hình ảnh cần tải lên', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const { syncUploadedFile } = require('../utils/fileStorage');
  syncUploadedFile(req.file.filename);

  return sendSuccess(
    res,
    {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
    'Tải hình ảnh lên thành công',
    201
  );
}

module.exports = {
  uploadSingle: upload.single('image'),
  handleUploadSuccess,
};
