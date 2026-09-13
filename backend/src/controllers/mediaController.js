const path = require('path');
const fs = require('fs');
const mediaService = require('../services/mediaService');
const { sendError } = require('../utils/response');

const LOCAL_UPLOADS_DIR = path.resolve(__dirname, '../../public/uploads');

/**
 * Phục vụ file ảnh trực tiếp từ Database MySQL (hỗ trợ caching cao cấp)
 */
async function serveMedia(req, res, next) {
  try {
    const identifier = req.params.id || req.params.filename;
    if (!identifier) {
      return res.status(404).send('Không tìm thấy hình ảnh');
    }

    // 1. Kiểm tra trong cơ sở dữ liệu MySQL (media_files)
    const media = await mediaService.getMediaFile(identifier);
    if (media && media.data) {
      const etag = `W/"media-${media.id}-${media.size}"`;
      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }

      res.setHeader('Content-Type', media.mimetype || 'image/jpeg');
      res.setHeader('Content-Length', media.size || media.data.length);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('ETag', etag);

      return res.end(Buffer.isBuffer(media.data) ? media.data : Buffer.from(media.data));
    }

    // 2. Fallback: Nếu ảnh đã được lưu trên đĩa cứng trước đó (môi trường local)
    const localFile = path.join(LOCAL_UPLOADS_DIR, identifier);
    if (fs.existsSync(localFile)) {
      return res.sendFile(localFile, {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 3. Fallback: Ảnh placeholder mặc định nếu không tìm thấy
    const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#94a3b8">Hình ảnh không khả dụng</text>
    </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(404).send(placeholderSvg);
  } catch (err) {
    next(err);
  }
}

/**
 * Xóa media file
 */
async function deleteMedia(req, res, next) {
  try {
    const { id } = req.params;
    const success = await mediaService.deleteMediaFile(id);
    return res.json({ success, message: success ? 'Đã xóa file ảnh' : 'Không tìm thấy file ảnh cần xóa' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  serveMedia,
  deleteMedia,
};
