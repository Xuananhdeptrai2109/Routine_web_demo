const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Controller trò chuyện đa lượt với Trợ lý Thời trang AI Stylist
 * POST /api/v1/ai/chat
 */
async function chat(req, res, next) {
  try {
    const { message, history, currentProductId, userPreferences } = req.body;
    if (!message || !message.trim()) {
      return sendError(res, 'Vui lòng nhập nội dung câu hỏi cho AI Stylist', 400);
    }

    const result = await aiService.chatWithStylist({
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
      currentProductId: currentProductId || null,
      userPreferences: userPreferences || null,
    });

    return sendSuccess(
      res,
      result,
      'Phản hồi từ AI Stylist thành công',
      200
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Controller tư vấn trang phục thông minh (AI Fashion Stylist) - Endpoint cũ
 */
async function getOutfitRecommendation(req, res, next) {
  try {
    const { occasion, style, budget, gender, message, goal } = req.body;

    const recommendation = await aiService.generateOutfitRecommendation({
      occasion,
      style,
      budget,
      gender,
      userMessage: message || goal,
    });

    return sendSuccess(
      res,
      recommendation,
      'Gợi ý trang phục từ AI Stylist thành công',
      200
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Controller xử lý tương thích ngược cho route /suggest
 */
async function getRoutineSuggestions(req, res, next) {
  try {
    const { goal, occasion, style, budget } = req.body;

    const result = await aiService.generateOutfitRecommendation({
      occasion,
      style,
      budget,
      userMessage: goal,
    });

    return sendSuccess(
      res,
      result,
      'Gợi ý từ AI thành công',
      200
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chat,
  getOutfitRecommendation,
  getRoutineSuggestions,
};
