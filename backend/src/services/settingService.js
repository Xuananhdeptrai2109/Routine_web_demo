const prisma = require('../config/prisma');

const DEFAULT_HERO_CONFIG = {
  banners: [
    { id: 'hb-1', url: '/images/hero/hero-banner-1.svg', title: 'Style That Fits You - Look 1', isPrimary: true },
    { id: 'hb-2', url: '/images/hero/hero-banner-2.svg', title: 'Urban Chic - Look 2', isPrimary: false },
    { id: 'hb-3', url: '/images/hero/hero-banner-3.svg', title: 'Daily Essentials - Look 3', isPrimary: false },
  ],
  slideInterval: 2500,
  title: 'STYLE THAT FITS YOU',
  subtitle: 'Khám phá phong cách phù hợp với bạn.\nThời trang không chỉ là mặc gì. Đó là cách bạn thể hiện chính mình.',
  exploreLink: '/category/new-arrivals',
  outfitLink: '/smart-outfit',
};

async function ensureStoreSettingsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS store_settings (
      setting_key VARCHAR(191) NOT NULL PRIMARY KEY,
      setting_value LONGTEXT NOT NULL,
      description VARCHAR(255) NULL,
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
}

/**
 * Lấy cấu hình Hero Banners trang chủ (Unified full banner)
 */
async function getHeroBanners() {
  try {
    await ensureStoreSettingsTable();
    const rows = await prisma.$queryRawUnsafe(
      'SELECT setting_value FROM store_settings WHERE setting_key = "home_hero_banners" LIMIT 1;'
    );
    if (rows && rows.length > 0 && rows[0].setting_value) {
      const parsed = JSON.parse(rows[0].setting_value);
      const bannerList = Array.isArray(parsed.banners) && parsed.banners.length > 0
        ? parsed.banners
        : (Array.isArray(parsed.rightImages) && parsed.rightImages.length > 0
          ? parsed.rightImages
          : DEFAULT_HERO_CONFIG.banners);

      return {
        ...DEFAULT_HERO_CONFIG,
        ...parsed,
        banners: bannerList,
        slideInterval: Number(parsed.slideInterval) || 2500,
      };
    }
  } catch (err) {
    console.warn('[settingService] getHeroBanners warning:', err.message);
  }
  return DEFAULT_HERO_CONFIG;
}

/**
 * Cập nhật cấu hình Hero Banners trang chủ (Admin)
 */
async function updateHeroBanners(payload) {
  await ensureStoreSettingsTable();
  const current = await getHeroBanners();

  const nextBanners = Array.isArray(payload.banners)
    ? payload.banners
    : (Array.isArray(payload.images) ? payload.images : current.banners);

  const nextConfig = {
    ...current,
    ...payload,
    banners: nextBanners,
    slideInterval: Math.max(1000, Math.min(10000, Number(payload.slideInterval) || 2500)),
    title: payload.title !== undefined ? String(payload.title).trim() : current.title,
    subtitle: payload.subtitle !== undefined ? String(payload.subtitle).trim() : current.subtitle,
    exploreLink: payload.exploreLink !== undefined ? String(payload.exploreLink).trim() : current.exploreLink,
    outfitLink: payload.outfitLink !== undefined ? String(payload.outfitLink).trim() : current.outfitLink,
  };

  const jsonStr = JSON.stringify(nextConfig);

  await prisma.$executeRawUnsafe(
    `INSERT INTO store_settings (setting_key, setting_value, description, updated_at)
     VALUES ("home_hero_banners", ?, "Cấu hình Hero Banner toàn màn hình & Slide Trang chủ", NOW())
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW();`,
    jsonStr
  );

  return nextConfig;
}

module.exports = {
  getHeroBanners,
  updateHeroBanners,
};
