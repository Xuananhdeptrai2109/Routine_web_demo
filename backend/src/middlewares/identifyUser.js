const jwt = require('jsonwebtoken');

/**
 * Middleware định danh người dùng (User hoặc Guest)
 * Giúp các module Cart và Wishlist phục vụ được cả khách vãng lai và thành viên đã đăng nhập
 */
function identifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const secret = process.env.JWT_SECRET;

    // 1. Kiểm tra JWT Token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        req.userId = decoded.userId;
        req.isAuth = true;
        req.identityId = decoded.userId;
        return next();
      } catch (err) {
        // Token không hợp lệ hoặc hết hạn: bỏ qua để chuyển sang định danh khách
      }
    }

    // 2. Kiểm tra Guest Session
    const sessionId =
      req.headers['x-session-id'] ||
      req.headers['x-guest-id'] ||
      req.query.sessionId ||
      req.cookies?.routine_session_id;

    if (sessionId) {
      req.identityId = `guest_${sessionId}`;
      req.sessionId = sessionId;
      req.isAuth = false;
      return next();
    }

    // 3. Khách mặc định nếu không gửi session id
    const fallbackId = req.ip || 'anonymous';
    req.identityId = `guest_${fallbackId}`;
    req.sessionId = fallbackId;
    req.isAuth = false;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = identifyUser;
