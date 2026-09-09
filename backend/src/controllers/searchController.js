const searchService = require('../services/searchService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Lấy gợi ý tìm kiếm (Autocomplete)
 */
async function getSuggestions(req, res, next) {
  try {
    const { q } = req.query;
    const result = await searchService.getSuggestions(q);
    return sendSuccess(res, result, 'Lấy gợi ý tìm kiếm thành công');
  } catch (error) {
    next(error);
  }
}

/**
 * Lấy danh sách từ khóa tìm kiếm hot
 */
async function getTrendingKeywords(req, res, next) {
  try {
    const result = await searchService.getTrendingKeywords();
    return sendSuccess(res, result, 'Lấy danh sách từ khóa thịnh hành thành công');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSuggestions,
  getTrendingKeywords,
};
