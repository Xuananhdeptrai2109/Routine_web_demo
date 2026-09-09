-- Routine Web - Safe database update
-- Run this script in MySQL Workbench after selecting the routine_db database.
-- This script only creates missing tables. It does not drop or alter existing data.

USE `routine_db`;

-- Stores the products held during the 5-minute payment window.
CREATE TABLE IF NOT EXISTS `stock_reservations` (
  `id` VARCHAR(191) NOT NULL,
  `order_id` VARCHAR(191) NOT NULL,
  `items` JSON NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `stock_reservations_order_id_key` (`order_id`),
  KEY `stock_reservations_expires_at_idx` (`expires_at`),
  CONSTRAINT `stock_reservations_order_id_fkey`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Stores the homepage hero/banner configuration.
CREATE TABLE IF NOT EXISTS `store_settings` (
  `setting_key` VARCHAR(191) NOT NULL,
  `setting_value` LONGTEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Insert the default hero configuration only when it does not exist.
INSERT INTO `store_settings` (`setting_key`, `setting_value`, `description`)
SELECT
  'home_hero_banners',
  '{"banners":[{"id":"hb-1","url":"/images/hero/hero-banner-1.svg","title":"Style That Fits You - Look 1","isPrimary":true},{"id":"hb-2","url":"/images/hero/hero-banner-2.svg","title":"Urban Chic - Look 2","isPrimary":false},{"id":"hb-3","url":"/images/hero/hero-banner-3.svg","title":"Daily Essentials - Look 3","isPrimary":false}],"slideInterval":2500,"title":"STYLE THAT FITS YOU","subtitle":"Khám phá phong cách phù hợp với bạn.\\nThời trang không chỉ là mặc gì. Đó là cách bạn thể hiện chính mình.","exploreLink":"/category/new-arrivals","outfitLink":"/smart-outfit"}',
  'Cấu hình Hero Banner toàn màn hình & Slide Trang chủ'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `store_settings` WHERE `setting_key` = 'home_hero_banners'
);

-- Verification queries.
SELECT `id`, `order_id`, `expires_at`, `created_at`
FROM `stock_reservations`
ORDER BY `created_at` DESC
LIMIT 10;

SELECT `setting_key`, `updated_at`
FROM `store_settings`   
WHERE `setting_key` = 'home_hero_banners';