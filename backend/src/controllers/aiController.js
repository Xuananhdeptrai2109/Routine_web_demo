const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Controller tư vấn trang phục thông minh (AI Fashion Stylist)
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
  getOutfitRecommendation,
  getRoutineSuggestions,
};
