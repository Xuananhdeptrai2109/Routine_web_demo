-- ==============================================================================
-- ROUTINE FASHION E-COMMERCE & SMART STYLING DATABASE
-- FULL SEED DUMP FOR MYSQL WORKBENCH / MYSQL 8.0+
-- Generated: 2026-09-06T19:32:49.938Z
-- Database Name: routine_db
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `routine_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `routine_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- Table 1: `users`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `avatar` VARCHAR(500) DEFAULT NULL,
  `style_preference` VARCHAR(100) DEFAULT 'minimal',
  `status` ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_phone` (`phone_number`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: `addresses`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `receiver_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `ward` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_user_id` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 3: `colors`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `colors`;
CREATE TABLE `colors` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `hex_code` VARCHAR(20) NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 4: `sizes`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `sizes`;
CREATE TABLE `sizes` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `size_type` VARCHAR(50) NOT NULL DEFAULT 'CLOTHING',
  `sort_order` INT NOT NULL DEFAULT 1,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 5: `categories`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT 'standard',
  `parent_id` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 6: `styles`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `styles`;
CREATE TABLE `styles` (
  `id` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_styles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 7: `products`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `short_description` VARCHAR(500) DEFAULT NULL,
  `price` INT NOT NULL,
  `original_price` INT DEFAULT NULL,
  `gender` VARCHAR(20) NOT NULL DEFAULT 'unisex',
  `category_id` VARCHAR(50) DEFAULT NULL,
  `category_slug` VARCHAR(100) DEFAULT NULL,
  `styles` JSON DEFAULT NULL,
  `badge` VARCHAR(50) DEFAULT NULL,
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  `review_count` INT NOT NULL DEFAULT 0,
  `images` JSON DEFAULT NULL,
  `sizes` JSON DEFAULT NULL,
  `colors` JSON DEFAULT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 100,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_trending` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('ACTIVE', 'DRAFT', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `materials` TEXT DEFAULT NULL,
  `care` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_products_slug` (`slug`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_gender` (`gender`),
  KEY `idx_products_price` (`price`),
  KEY `idx_products_rating` (`rating`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 8: `product_variants`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `sku` VARCHAR(100) NOT NULL,
  `color` VARCHAR(50) DEFAULT NULL,
  `size` VARCHAR(50) DEFAULT NULL,
  `price` INT NOT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_variants_sku` (`sku`),
  KEY `idx_variants_product` (`product_id`),
  CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 9: `outfits`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `outfits`;
CREATE TABLE `outfits` (
  `id` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `occasion` VARCHAR(50) NOT NULL,
  `style` VARCHAR(50) NOT NULL,
  `gender` VARCHAR(20) NOT NULL DEFAULT 'unisex',
  `season` VARCHAR(50) DEFAULT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('ACTIVE', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_outfits_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 10: `outfit_products`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `outfit_products`;
CREATE TABLE `outfit_products` (
  `id` VARCHAR(50) NOT NULL,
  `outfit_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_outfit_product` (`outfit_id`, `product_id`),
  KEY `idx_op_product` (`product_id`),
  CONSTRAINT `fk_op_outfit` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_op_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 11: `orders`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `guest_session_id` VARCHAR(100) DEFAULT NULL,
  `receiver_name` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `shipping_method` VARCHAR(50) NOT NULL DEFAULT 'standard',
  `payment_method` ENUM('COD', 'CARD', 'VNPAY', 'MOMO') NOT NULL DEFAULT 'COD',
  `payment_status` ENUM('UNPAID', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
  `order_status` ENUM('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
  `subtotal` INT NOT NULL,
  `shipping_fee` INT NOT NULL DEFAULT 0,
  `discount` INT NOT NULL DEFAULT 0,
  `total` INT NOT NULL,
  `applied_coupon` VARCHAR(50) DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`order_status`),
  KEY `idx_orders_created_at` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 12: `order_items`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` VARCHAR(50) NOT NULL,
  `order_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `size` VARCHAR(50) DEFAULT NULL,
  `color` VARCHAR(50) DEFAULT NULL,
  `price` INT NOT NULL,
  `quantity` INT NOT NULL,
  `subtotal` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 13: `coupons`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `code` VARCHAR(50) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `value` INT NOT NULL,
  `max_discount` INT DEFAULT NULL,
  `min_order_value` INT NOT NULL DEFAULT 0,
  `description` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 14: `reviews`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(255) DEFAULT NULL,
  `user_avatar` VARCHAR(500) DEFAULT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `status` ENUM('APPROVED', 'HIDDEN', 'PENDING') NOT NULL DEFAULT 'APPROVED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_product` (`product_id`),
  KEY `idx_reviews_user` (`user_id`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 15: `newsletter_subscribers`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `newsletter_subscribers`;
CREATE TABLE `newsletter_subscribers` (
  `id` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `voucher_code` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 16: `store_settings`
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `store_settings`;
CREATE TABLE `store_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- INSERT FULL REAL SEED DATA (MATCHING FRONTEND & BACKEND)
-- ==============================================================================

-- 1. Users: Admin & 5 Real Customers
-- Admin password: Admin@123 | Customer password: 123456
INSERT INTO `users` (`id`, `full_name`, `phone_number`, `email`, `password_hash`, `role`, `avatar`, `style_preference`, `status`, `created_at`) VALUES
('usr-admin-001', 'Admin Quản Trị Routine', '0999999999', 'admin@routine.vn', '$2b$10$Y0VkouJ1ppenbNnD/4EP6.YzhwIKDhlrthJra0nc2Inq/QaqlEqJm', 'ADMIN', '/images/avatars/admin.jpg', 'minimal', 'ACTIVE', '2026-08-01 00:00:00'),
('usr-customer-001', 'Nguyễn Văn A', '0123456789', 'nguyenvana@gmail.com', '$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K', 'CUSTOMER', '/images/avatars/user-01.jpg', 'minimal', 'ACTIVE', '2026-08-15 08:30:00'),
('usr-customer-002', 'Trần Thị Bích Ngọc', '0987654321', 'bichngoc.tran@gmail.com', '$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K', 'CUSTOMER', '/images/avatars/user-02.jpg', 'smart-casual', 'ACTIVE', '2026-08-20 10:15:00'),
('usr-customer-003', 'Lê Hoàng Long', '0912345678', 'hoanglong.le@gmail.com', '$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K', 'CUSTOMER', '/images/avatars/user-03.jpg', 'streetstyle', 'ACTIVE', '2026-08-25 14:20:00'),
('usr-customer-004', 'Phạm Minh Trang', '0933456789', 'minhtrang.pham@gmail.com', '$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K', 'CUSTOMER', '/images/avatars/user-04.jpg', 'vintage', 'ACTIVE', '2026-09-01 09:45:00'),
('usr-customer-005', 'Vũ Đức Thắng', '0944567890', 'thang.vu@gmail.com', '$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K', 'CUSTOMER', '/images/avatars/user-05.jpg', 'sporty-chic', 'ACTIVE', '2026-09-03 16:10:00');

-- 2. Customer Addresses
INSERT INTO `addresses` (`id`, `user_id`, `receiver_name`, `phone`, `street`, `ward`, `district`, `city`, `is_default`) VALUES
('addr-001', 'usr-customer-001', 'Nguyễn Văn A', '0123456789', '123 Nguyễn Trãi', 'Phường Thanh Xuân Trung', 'Quận Thanh Xuân', 'Hà Nội', 1),
('addr-002', 'usr-customer-001', 'Nguyễn Văn A (Cơ quan)', '0123456789', '45 Lê Lợi', 'Phường Bến Nghé', 'Quận 1', 'Hồ Chí Minh', 0),
('addr-003', 'usr-customer-002', 'Trần Thị Bích Ngọc', '0987654321', '88 Cầu Giấy', 'Phường Dịch Vọng', 'Quận Cầu Giấy', 'Hà Nội', 1),
('addr-004', 'usr-customer-003', 'Lê Hoàng Long', '0912345678', '240 Hai Bà Trưng', 'Phường Tân Định', 'Quận 1', 'Hồ Chí Minh', 1),
('addr-005', 'usr-customer-004', 'Phạm Minh Trang', '0933456789', '56 Nguyễn Thị Minh Khai', 'Phường Đa Kao', 'Quận 1', 'Hồ Chí Minh', 1),
('addr-006', 'usr-customer-005', 'Vũ Đức Thắng', '0944567890', '15 Trần Phú', 'Phường Thạch Thang', 'Quận Hải Châu', 'Đà Nẵng', 1);

-- 3. Colors
INSERT INTO `colors` (`id`, `name`, `hex_code`, `status`) VALUES
('color-black', 'Black', '#111111', 'ACTIVE'),
('color-white', 'White', '#FFFFFF', 'ACTIVE'),
('color-grey', 'Grey', '#9a9a9a', 'ACTIVE'),
('color-navy', 'Navy', '#1f2a44', 'ACTIVE'),
('color-beige', 'Beige', '#e4d3b8', 'ACTIVE'),
('color-olive', 'Olive', '#6b6e3a', 'ACTIVE'),
('color-brown', 'Brown', '#6b4a34', 'ACTIVE'),
('color-cream', 'Cream', '#f1ead8', 'ACTIVE'),
('color-denim', 'Denim Blue', '#3e5c76', 'ACTIVE');

-- 4. Sizes
INSERT INTO `sizes` (`id`, `name`, `size_type`, `sort_order`, `status`) VALUES
('size-xs', 'XS', 'CLOTHING', 1, 'ACTIVE'),
('size-s', 'S', 'CLOTHING', 2, 'ACTIVE'),
('size-m', 'M', 'CLOTHING', 3, 'ACTIVE'),
('size-l', 'L', 'CLOTHING', 4, 'ACTIVE'),
('size-xl', 'XL', 'CLOTHING', 5, 'ACTIVE'),
('size-xxl', 'XXL', 'CLOTHING', 6, 'ACTIVE'),
('size-39', '39', 'SHOE', 7, 'ACTIVE'),
('size-40', '40', 'SHOE', 8, 'ACTIVE'),
('size-41', '41', 'SHOE', 9, 'ACTIVE'),
('size-42', '42', 'SHOE', 10, 'ACTIVE');

-- 5. Categories
INSERT INTO `categories` (`id`, `slug`, `name`, `description`, `image`, `type`, `parent_id`, `status`) VALUES
('new-arrivals', 'new-arrivals', 'NEW ARRIVALS', 'Những thiết kế mới nhất vừa cập bến Routine, cập nhật hàng tuần.', '/images/categories/new-arrivals.jpg', 'standard', NULL, 'ACTIVE'),
('men', 'men', 'MEN', 'Thời trang nam hiện đại, đơn giản và dễ phối cho mọi ngày.', '/images/categories/men.jpg', 'standard', NULL, 'ACTIVE'),
('women', 'women', 'WOMEN', 'Tối giản nhưng vẫn nữ tính, dễ dàng biến hóa từ ngày sang tối.', '/images/categories/women.jpg', 'standard', NULL, 'ACTIVE'),
('unisex', 'unisex', 'UNISEX', 'Thiết kế phi giới tính, tối giản và linh hoạt cho mọi phong cách.', '/images/categories/unisex.jpg', 'standard', NULL, 'ACTIVE'),
('tops', 'tops', 'TOPS', 'Áo thun, áo sơ mi và áo len được chọn lọc kỹ về chất liệu.', '/images/categories/tops.jpg', 'standard', NULL, 'ACTIVE'),
('bottoms', 'bottoms', 'BOTTOMS', 'Quần jeans, trousers và short với form dáng chuẩn tối giản.', '/images/categories/bottoms.jpg', 'standard', NULL, 'ACTIVE'),
('outerwear', 'outerwear', 'OUTERWEAR', 'Áo khoác giữ ấm và tôn dáng, phù hợp thời tiết chuyển mùa.', '/images/categories/outerwear.jpg', 'standard', NULL, 'ACTIVE'),
('accessories', 'accessories', 'ACCESSORIES', 'Điểm nhấn nhỏ hoàn thiện outfit của bạn.', '/images/categories/accessories.jpg', 'standard', NULL, 'ACTIVE'),
('ao', 'ao', 'ÁO', 'Tất cả các mẫu áo tối giản, dễ phối đồ.', '/images/categories/tops.jpg', 'standard', NULL, 'ACTIVE'),
('quan', 'quan', 'QUẦN', 'Quần dài, quần short với form dáng chuẩn tối giản.', '/images/categories/bottoms.jpg', 'standard', NULL, 'ACTIVE'),
('vay', 'vay', 'VÁY', 'Váy tối giản, dễ mặc cho nhiều dịp khác nhau.', '/images/categories/women.jpg', 'standard', NULL, 'ACTIVE'),
('ao-khoac', 'ao-khoac', 'ÁO KHOÁC', 'Áo khoác nhẹ đến giữ ấm, hoàn thiện mọi outfit.', '/images/categories/outerwear.jpg', 'standard', NULL, 'ACTIVE'),
('do-basic', 'do-basic', 'ĐỒ BASIC', 'Những món đồ nền tảng không thể thiếu trong tủ đồ.', '/images/categories/tops.jpg', 'standard', NULL, 'ACTIVE'),
('do-cong-so', 'do-cong-so', 'ĐỒ CÔNG SỞ', 'Thanh lịch, chỉn chu và vẫn thoải mái suốt ngày dài.', '/images/categories/outerwear.jpg', 'standard', NULL, 'ACTIVE'),
('do-casual', 'do-casual', 'ĐỒ CASUAL', 'Thoải mái, dễ phối cho những ngày cuối tuần.', '/images/categories/men.jpg', 'standard', NULL, 'ACTIVE'),
('phu-kien', 'phu-kien', 'PHỤ KIỆN', 'Điểm nhấn nhỏ hoàn thiện outfit của bạn.', '/images/categories/accessories.jpg', 'standard', NULL, 'ACTIVE'),
('cat-tshirt', 'cat-tshirt', 'T-Shirt', '', '', 'standard', 'tops', 'ACTIVE'),
('cat-polo', 'cat-polo', 'Polo Shirt', '', '', 'standard', 'tops', 'ACTIVE'),
('cat-shirt', 'cat-shirt', 'Shirt', '', '', 'standard', 'tops', 'ACTIVE'),
('cat-jeans', 'cat-jeans', 'Jeans', '', '', 'standard', 'bottoms', 'ACTIVE'),
('cat-trousers', 'cat-trousers', 'Trousers', '', '', 'standard', 'bottoms', 'ACTIVE'),
('cat-shorts', 'cat-shorts', 'Shorts', '', '', 'standard', 'bottoms', 'ACTIVE'),
('cat-jacket', 'cat-jacket', 'Jacket', '', '', 'standard', 'outerwear', 'ACTIVE'),
('cat-blazer', 'cat-blazer', 'Blazer', '', '', 'standard', 'outerwear', 'ACTIVE'),
('cat-sneakers', 'cat-sneakers', 'Sneakers', '', '', 'standard', 'accessories', 'ACTIVE'),
('cat-accessories', 'cat-accessories', 'Accessories', '', '', 'standard', 'accessories', 'ACTIVE');

-- 6. Styles
INSERT INTO `styles` (`id`, `slug`, `name`, `description`, `image`, `status`) VALUES
('minimal', 'minimal', 'Minimal', 'Tối giản, sạch sẽ, ít chi tiết thừa.', '/images/styles/minimal.jpg', 'ACTIVE'),
('smart-casual', 'smart-casual', 'Smart Casual', 'Lịch sự vừa đủ, vẫn thoải mái để di chuyển cả ngày.', '/images/styles/smart-casual.jpg', 'ACTIVE'),
('streetstyle', 'streetstyle', 'Streetstyle', 'Cá tính, phóng khoáng, cảm hứng từ đường phố.', '/images/styles/streetstyle.jpg', 'ACTIVE'),
('basic', 'basic', 'Basic', 'Những món đồ nền tảng, dễ phối với mọi thứ khác.', '/images/styles/basic.jpg', 'ACTIVE'),
('vintage', 'vintage', 'Vintage', 'Hoài cổ, form dáng rộng rãi và chất liệu mộc mạc.', '/images/styles/vintage.jpg', 'ACTIVE'),
('sporty-chic', 'sporty-chic', 'Sporty Chic', 'Năng động nhưng vẫn tinh tế, dễ mặc đi tập lẫn đi chơi.', '/images/styles/sporty-chic.jpg', 'ACTIVE');

-- 7. Products (Full 28 Products from Routine Catalog)
INSERT INTO `products` (`id`, `slug`, `name`, `description`, `short_description`, `price`, `original_price`, `gender`, `category_id`, `category_slug`, `styles`, `badge`, `rating`, `review_count`, `images`, `sizes`, `colors`, `stock_quantity`, `is_featured`, `is_trending`, `status`, `materials`, `care`) VALUES
('p001', 'essential-cotton-t-shirt', 'Essential Cotton T-Shirt', 'Áo thun cotton form regular, chất liệu mềm mại, thấm hút tốt, dễ phối cho mọi outfit hàng ngày.', 'Áo thun cotton cơ bản, dễ phối đồ.', 299000, 399000, 'unisex', 'tops', 'tops', '["basic","minimal"]', 'BEST SELLER', 4.7, 128, '["/images/products/product-01.jpg","/images/products/product-01-02.jpg"]', '["S","M","L","XL"]', '["Black","White","Grey"]', 100, 1, 1, 'ACTIVE', '100% Cotton combed, 220gsm.', 'Giặt máy ở 30°C, không dùng chất tẩy, phơi trong bóng râm.'),
('p002', 'oversized-basic-tee', 'Oversized Basic Tee', 'Form oversized rộng rãi, vai rơi nhẹ, phù hợp phong cách streetstyle tối giản.', 'Áo thun form rộng in họa tiết, chất streetstyle.', 329000, NULL, 'unisex', 'tops', 'tops', '["basic","streetstyle"]', 'NEW', 4.5, 76, '["/images/products/product-02.jpg","/images/products/product-02-02.jpg"]', '["S","M","L","XL"]', '["Black","Beige"]', 100, 1, 0, 'ACTIVE', '100% Cotton, 260gsm.', 'Giặt tay hoặc giặt máy chế độ nhẹ.'),
('p003', 'classic-white-shirt', 'Classic White Shirt', 'Áo sơ mi form slim fit, vải cotton pha, phù hợp đi làm lẫn dạo phố.', 'Áo thun sọc form ôm nhẹ, phong cách vintage.', 459000, 599000, 'men', 'tops', 'tops', '["smart-casual","minimal"]', 'BEST SELLER', 4.8, 94, '["/images/products/product-03.jpg","/images/products/product-03-02.jpg"]', '["S","M","L","XL"]', '["White","Light Blue"]', 100, 1, 1, 'ACTIVE', '80% Cotton, 20% Polyester.', 'Ủi ở nhiệt độ trung bình, treo bằng móc sau khi giặt.'),
('p004', 'linen-blend-shirt', 'Linen Blend Shirt', 'Áo sơ mi vải linen pha, thoáng mát, mang hơi hướng vintage nhẹ nhàng.', 'Áo ba lỗ gân co giãn, năng động.', 499000, NULL, 'men', 'tops', 'tops', '["smart-casual","vintage"]', NULL, 4.4, 41, '["/images/products/product-04.jpg"]', '["M","L","XL"]', '["Beige","White"]', 100, 0, 0, 'ACTIVE', '55% Linen, 45% Cotton.', 'Giặt tay nhẹ nhàng, hạn chế vắt mạnh.'),
('p005', 'straight-fit-jeans', 'Straight Fit Jeans', 'Quần jeans form straight fit basic, dễ phối, bền màu sau nhiều lần giặt.', 'Áo polo vải pique co dãn nhẹ, lịch sự.', 549000, 699000, 'men', 'bottoms', 'bottoms', '["basic","streetstyle"]', 'BEST SELLER', 4.6, 152, '["/images/products/product-05.jpg","/images/products/product-05-02.jpg"]', '["29","30","31","32","33"]', '["Blue","Black"]', 100, 1, 1, 'ACTIVE', '98% Cotton, 2% Spandex.', 'Lộn trái trước khi giặt để giữ màu.'),
('p006', 'tapered-trousers', 'Tapered Trousers', 'Quần âu ống côn nhẹ, phù hợp đi làm hoặc phối cùng áo sơ mi cho set đồ công sở.', 'Polo form ôm hiện đại.', 479000, NULL, 'men', 'bottoms', 'bottoms', '["smart-casual","minimal"]', 'NEW', 4.5, 63, '["/images/products/product-06.jpg"]', '["S","M","L","XL"]', '["Black","Grey","Khaki"]', 100, 1, 0, 'ACTIVE', '65% Polyester, 33% Viscose, 2% Spandex.', 'Giặt máy chế độ nhẹ, ủi hơi để giữ nếp.'),
('p007', 'wide-leg-midi-skirt', 'Wide Leg Midi Skirt', 'Chân váy midi ống rộng, tôn dáng, dễ mặc đi làm hoặc dạo phố.', 'Sơ mi Oxford cổ điển, dễ mặc đi làm.', 429000, 549000, 'women', 'bottoms', 'bottoms', '["minimal","smart-casual"]', NULL, 4.6, 58, '["/images/products/product-07.jpg"]', '["S","M","L"]', '["Black","Beige"]', 100, 1, 0, 'ACTIVE', 'Vải tuyết mưa cao cấp.', 'Giặt tay, không ngâm nước quá lâu.'),
('p008', 'slip-midi-dress', 'Slip Midi Dress', 'Váy hai dây form suông nhẹ nhàng, có thể mặc riêng hoặc phối layer cùng áo sơ mi.', 'Sơ mi linen thoáng mát cho mùa hè.', 599000, 749000, 'women', 'vay', 'vay', '["minimal","vintage"]', 'BEST SELLER', 4.7, 87, '["/images/products/product-08.jpg","/images/products/product-08-02.jpg"]', '["S","M","L"]', '["Black","Brown"]', 100, 1, 1, 'ACTIVE', '95% Viscose, 5% Elastane.', 'Giặt tay với nước lạnh, ủi mặt trái.'),
('p009', 'structured-blazer', 'Structured Blazer', 'Blazer form vai vuông nhẹ, hoàn thiện set đồ công sở tối giản.', 'Sơ mi caro chất flannel ấm áp.', 899000, 1099000, 'women', 'outerwear', 'outerwear', '["smart-casual","minimal"]', 'NEW', 4.8, 44, '["/images/products/product-09.jpg"]', '["S","M","L"]', '["Black","Beige"]', 100, 1, 1, 'ACTIVE', 'Vải tuyết mưa pha wool.', 'Giặt khô để giữ form dáng tốt nhất.'),
('p010', 'oversized-denim-jacket', 'Oversized Denim Jacket', 'Áo khoác denim form oversized, phối được với hầu hết trang phục hàng ngày.', 'Quần jeans ống đứng, dễ phối.', 749000, 649000, 'unisex', 'outerwear', 'outerwear', '["streetstyle","vintage"]', NULL, 4.5, 69, '["/images/products/product-10.jpg"]', '["S","M","L","XL"]', '["Blue","Black"]', 100, 1, 1, 'ACTIVE', '100% Cotton denim.', 'Lộn trái khi giặt, hạn chế giặt máy quá thường xuyên.'),
('p011', 'lightweight-windbreaker', 'Lightweight Windbreaker', 'Áo khoác dù nhẹ, chống gió nhẹ, phù hợp mặc khi di chuyển hoặc tập luyện ngoài trời.', 'Jeans ôm nhẹ, bo ống hiện đại.', 649000, 799000, 'unisex', 'outerwear', 'outerwear', '["sporty-chic","streetstyle"]', 'SALE', 4.4, 37, '["/images/products/product-11.jpg"]', '["S","M","L","XL"]', '["Black","Green"]', 100, 0, 0, 'ACTIVE', '100% Nylon.', 'Giặt máy chế độ nhẹ, không sấy nhiệt cao.'),
('p012', 'knit-cardigan', 'Knit Cardigan', 'Áo len khoác dệt kim mềm mại, giữ ấm nhẹ cho những ngày chuyển mùa.', 'Jeans lưng cao form mom, phong cách vintage.', 559000, 629000, 'women', 'outerwear', 'outerwear', '["minimal","vintage"]', NULL, 4.6, 52, '["/images/products/product-12.jpg"]', '["S","M","L"]', '["Cream","Brown"]', 100, 1, 0, 'ACTIVE', '70% Acrylic, 30% Wool.', 'Giặt tay nhẹ nhàng, gấp phẳng khi phơi.'),
('p013', 'ribbed-tank-top', 'Ribbed Tank Top', 'Áo hai dây gân co giãn tốt, dễ mặc riêng hoặc layer bên trong.', 'Quần âu form vừa, chỉn chu.', 199000, NULL, 'women', 'tops', 'tops', '["basic","minimal"]', 'NEW', 4.3, 29, '["/images/products/product-13.jpg"]', '["S","M","L"]', '["Black","White","Beige"]', 100, 1, 0, 'ACTIVE', '95% Cotton, 5% Spandex.', 'Giặt máy ở nhiệt độ thường.'),
('p014', 'cropped-hoodie', 'Cropped Hoodie', 'Hoodie form crop năng động, chất nỉ bông mềm, giữ ấm tốt.', 'Quần âu ống suông tối giản.', 399000, 499000, 'women', 'tops', 'tops', '["sporty-chic","streetstyle"]', 'SALE', 4.5, 61, '["/images/products/product-14.jpg"]', '["S","M","L"]', '["Grey","Black"]', 100, 1, 1, 'ACTIVE', '80% Cotton, 20% Polyester.', 'Giặt máy chế độ nhẹ, lộn trái khi giặt.'),
('p015', 'basic-hoodie', 'Basic Hoodie', 'Hoodie basic form regular, chất liệu dày dặn, giữ ấm tốt cho mùa se lạnh.', 'Quần ống rộng thanh lịch.', 449000, NULL, 'unisex', 'tops', 'tops', '["basic","streetstyle"]', 'BEST SELLER', 4.7, 103, '["/images/products/product-15.jpg","/images/products/product-15-02.jpg"]', '["S","M","L","XL"]', '["Black","Grey","Navy"]', 100, 1, 1, 'ACTIVE', '100% Cotton fleece.', 'Giặt máy chế độ thường, không sấy nhiệt cao.'),
('p016', 'pleated-trousers', 'Pleated Trousers', 'Quần âu xếp ly nhẹ nhàng, tôn dáng, phù hợp môi trường công sở.', 'Quần short chino basic mùa hè.', 459000, 399000, 'women', 'bottoms', 'bottoms', '["smart-casual","minimal"]', NULL, 4.4, 33, '["/images/products/product-16.jpg"]', '["S","M","L"]', '["Black","Beige"]', 100, 0, 0, 'ACTIVE', 'Vải tuyết mưa pha.', 'Ủi hơi nhẹ để giữ nếp ly.'),
('p017', 'cargo-pants', 'Cargo Pants', 'Quần cargo nhiều túi tiện dụng, form relax fit thoải mái vận động.', 'Quần short thể thao co giãn.', 529000, 649000, 'unisex', 'bottoms', 'bottoms', '["streetstyle","sporty-chic"]', 'SALE', 4.5, 78, '["/images/products/product-17.jpg"]', '["S","M","L","XL"]', '["Black","Khaki","Olive"]', 100, 0, 0, 'ACTIVE', '100% Cotton twill.', 'Giặt máy bình thường, không dùng chất tẩy.'),
('p018', 'mini-denim-skirt', 'Mini Denim Skirt', 'Chân váy denim ngắn form A-line, phong cách trẻ trung, cá tính.', 'Áo khoác bomber form chuẩn.', 349000, 899000, 'women', 'vay', 'vay', '["streetstyle","vintage"]', 'NEW', 4.2, 25, '["/images/products/product-18.jpg"]', '["S","M","L"]', '["Blue"]', 100, 1, 1, 'ACTIVE', '98% Cotton, 2% Spandex.', 'Giặt máy chế độ nhẹ.'),
('p019', 'canvas-sneakers', 'Canvas Sneakers', 'Giày sneaker canvas tối giản, dễ phối với hầu hết trang phục hàng ngày.', 'Áo khoác denim phong cách vintage.', 649000, NULL, 'unisex', 'phu-kien', 'phu-kien', '["basic","minimal"]', 'BEST SELLER', 4.6, 112, '["/images/products/product-19.jpg"]', '["38","39","40","41","42","43"]', '["White","Black"]', 100, 1, 0, 'ACTIVE', 'Vải canvas, đế cao su.', 'Lau sạch bằng khăn ẩm, tránh ngâm nước.'),
('p020', 'chunky-sneakers', 'Chunky Sneakers', 'Giày sneaker đế dày phong cách thể thao, tăng chiều cao nhẹ.', 'Blazer 1 hàng nút, form chuẩn công sở.', 899000, 1099000, 'unisex', 'phu-kien', 'phu-kien', '["sporty-chic","streetstyle"]', 'SALE', 4.5, 66, '["/images/products/product-20.jpg"]', '["38","39","40","41","42","43"]', '["White","Grey"]', 100, 1, 0, 'ACTIVE', 'Da tổng hợp, đế EVA.', 'Vệ sinh định kỳ bằng bàn chải mềm.'),
('p021', 'canvas-tote-bag', 'Canvas Tote Bag', 'Túi tote vải canvas bền chắc, sức chứa rộng rãi cho việc đi học, đi làm.', 'Blazer lửng hiện đại, tôn dáng.', 249000, NULL, 'unisex', 'phu-kien', 'phu-kien', '["minimal","basic"]', 'NEW', 4.4, 40, '["/images/products/product-21.jpg"]', '["One Size"]', '["Beige","Black"]', 100, 1, 0, 'ACTIVE', '100% Cotton canvas.', 'Giặt tay, không ngâm nước quá lâu.'),
('p022', 'leather-belt', 'Leather Belt', 'Thắt lưng da thật khóa kim loại tối giản, hoàn thiện set đồ công sở.', 'Giày sneakers da tối giản, dễ phối.', 299000, 999000, 'men', 'phu-kien', 'phu-kien', '["smart-casual","minimal"]', NULL, 4.6, 22, '["/images/products/product-22.jpg"]', '["One Size"]', '["Black","Brown"]', 100, 1, 1, 'ACTIVE', 'Da bò thật.', 'Lau khô, tránh tiếp xúc nước lâu.'),
('p023', 'bucket-hat', 'Bucket Hat', 'Mũ bucket form basic, phụ kiện điểm nhấn cho outfit streetstyle.', 'Sneakers đế chunky phong cách retro.', 179000, 229000, 'unisex', 'phu-kien', 'phu-kien', '["streetstyle","sporty-chic"]', 'SALE', 4.3, 31, '["/images/products/product-23.jpg"]', '["One Size"]', '["Black","Beige"]', 100, 0, 0, 'ACTIVE', '100% Cotton twill.', 'Giặt tay, không vắt mạnh.'),
('p024', 'wool-blend-coat', 'Wool Blend Coat', 'Áo khoác dạ pha len, form dáng thanh lịch, giữ ấm tốt cho mùa đông.', 'Sneakers dáng chạy nhẹ, êm chân.', 1299000, 1599000, 'women', 'outerwear', 'outerwear', '["minimal","smart-casual"]', 'BEST SELLER', 4.8, 48, '["/images/products/product-24.jpg"]', '["S","M","L"]', '["Camel","Black"]', 100, 1, 1, 'ACTIVE', '70% Wool, 30% Polyester.', 'Giặt khô chuyên nghiệp.'),
('p025', 'relaxed-fit-polo', 'Relaxed Fit Polo', 'Áo polo form relaxed, chất liệu piqué thoáng mát, dễ phối đi làm hoặc đi chơi.', 'Túi tote vải canvas tiện dụng.', 359000, NULL, 'men', 'tops', 'tops', '["smart-casual","basic"]', 'NEW', 4.5, 57, '["/images/products/product-25.jpg"]', '["S","M","L","XL"]', '["Navy","White","Black"]', 100, 1, 0, 'ACTIVE', '100% Cotton piqué.', 'Giặt máy chế độ thường.'),
('p026', 'high-waist-jeans', 'High Waist Jeans', 'Quần jeans lưng cao tôn dáng, chất liệu co giãn nhẹ, dễ mặc cả ngày.', 'Thắt lưng da thật, khóa kim loại.', 499000, 599000, 'women', 'bottoms', 'bottoms', '["basic","vintage"]', 'SALE', 4.6, 84, '["/images/products/product-26.jpg"]', '["S","M","L","XL"]', '["Blue","Black"]', 100, 0, 0, 'ACTIVE', '98% Cotton, 2% Spandex.', 'Lộn trái trước khi giặt.'),
('p027', 'silk-blend-blouse', 'Silk Blend Blouse', 'Áo blouse pha lụa mềm mại, rủ đẹp, phù hợp môi trường công sở.', 'Áo blouse pha lụa mềm mại, rủ đẹp, phù hợp môi trường công sở....', 549000, NULL, 'women', 'tops', 'tops', '["smart-casual","minimal"]', 'NEW', 4.7, 39, '["/images/products/product-27.jpg"]', '["S","M","L"]', '["Cream","Black"]', 100, 1, 1, 'ACTIVE', '70% Silk, 30% Polyester.', 'Giặt khô hoặc giặt tay nhẹ nhàng.'),
('p028', 'track-jacket', 'Track Jacket', 'Áo khoác track jacket phong cách thể thao, chất liệu nhẹ, thoáng khí.', 'Áo khoác track jacket phong cách thể thao, chất liệu nhẹ, thoáng khí....', 599000, NULL, 'unisex', 'outerwear', 'outerwear', '["sporty-chic","streetstyle"]', NULL, 4.4, 45, '["/images/products/product-28.jpg"]', '["S","M","L","XL"]', '["Black","Navy"]', 100, 0, 0, 'ACTIVE', '100% Polyester.', 'Giặt máy chế độ nhẹ, không sấy nhiệt cao.');

-- 8. Product Variants (Color & Size specific SKUs and stock)
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `color`, `size`, `price`, `stock_quantity`, `status`) VALUES
('var-p001-black-s', 'p001', 'ESS-P001-BLA-S', 'Black', 'S', 299000, 25, 'ACTIVE'),
('var-p001-black-m', 'p001', 'ESS-P001-BLA-M', 'Black', 'M', 299000, 25, 'ACTIVE'),
('var-p001-black-l', 'p001', 'ESS-P001-BLA-L', 'Black', 'L', 299000, 25, 'ACTIVE'),
('var-p001-black-xl', 'p001', 'ESS-P001-BLA-XL', 'Black', 'XL', 299000, 25, 'ACTIVE'),
('var-p001-white-s', 'p001', 'ESS-P001-WHI-S', 'White', 'S', 299000, 25, 'ACTIVE'),
('var-p001-white-m', 'p001', 'ESS-P001-WHI-M', 'White', 'M', 299000, 25, 'ACTIVE'),
('var-p001-white-l', 'p001', 'ESS-P001-WHI-L', 'White', 'L', 299000, 25, 'ACTIVE'),
('var-p001-white-xl', 'p001', 'ESS-P001-WHI-XL', 'White', 'XL', 299000, 25, 'ACTIVE'),
('var-p001-grey-s', 'p001', 'ESS-P001-GRE-S', 'Grey', 'S', 299000, 25, 'ACTIVE'),
('var-p001-grey-m', 'p001', 'ESS-P001-GRE-M', 'Grey', 'M', 299000, 25, 'ACTIVE'),
('var-p001-grey-l', 'p001', 'ESS-P001-GRE-L', 'Grey', 'L', 299000, 25, 'ACTIVE'),
('var-p001-grey-xl', 'p001', 'ESS-P001-GRE-XL', 'Grey', 'XL', 299000, 25, 'ACTIVE'),
('var-p002-black-s', 'p002', 'OVE-P002-BLA-S', 'Black', 'S', 329000, 25, 'ACTIVE'),
('var-p002-black-m', 'p002', 'OVE-P002-BLA-M', 'Black', 'M', 329000, 25, 'ACTIVE'),
('var-p002-black-l', 'p002', 'OVE-P002-BLA-L', 'Black', 'L', 329000, 25, 'ACTIVE'),
('var-p002-black-xl', 'p002', 'OVE-P002-BLA-XL', 'Black', 'XL', 329000, 25, 'ACTIVE'),
('var-p002-beige-s', 'p002', 'OVE-P002-BEI-S', 'Beige', 'S', 329000, 25, 'ACTIVE'),
('var-p002-beige-m', 'p002', 'OVE-P002-BEI-M', 'Beige', 'M', 329000, 25, 'ACTIVE'),
('var-p002-beige-l', 'p002', 'OVE-P002-BEI-L', 'Beige', 'L', 329000, 25, 'ACTIVE'),
('var-p002-beige-xl', 'p002', 'OVE-P002-BEI-XL', 'Beige', 'XL', 329000, 25, 'ACTIVE'),
('var-p003-white-s', 'p003', 'CLA-P003-WHI-S', 'White', 'S', 459000, 25, 'ACTIVE'),
('var-p003-white-m', 'p003', 'CLA-P003-WHI-M', 'White', 'M', 459000, 25, 'ACTIVE'),
('var-p003-white-l', 'p003', 'CLA-P003-WHI-L', 'White', 'L', 459000, 25, 'ACTIVE'),
('var-p003-white-xl', 'p003', 'CLA-P003-WHI-XL', 'White', 'XL', 459000, 25, 'ACTIVE'),
('var-p003-light-blue-s', 'p003', 'CLA-P003-LIG-S', 'Light Blue', 'S', 459000, 25, 'ACTIVE'),
('var-p003-light-blue-m', 'p003', 'CLA-P003-LIG-M', 'Light Blue', 'M', 459000, 25, 'ACTIVE'),
('var-p003-light-blue-l', 'p003', 'CLA-P003-LIG-L', 'Light Blue', 'L', 459000, 25, 'ACTIVE'),
('var-p003-light-blue-xl', 'p003', 'CLA-P003-LIG-XL', 'Light Blue', 'XL', 459000, 25, 'ACTIVE'),
('var-p004-beige-m', 'p004', 'LIN-P004-BEI-M', 'Beige', 'M', 499000, 25, 'ACTIVE'),
('var-p004-beige-l', 'p004', 'LIN-P004-BEI-L', 'Beige', 'L', 499000, 25, 'ACTIVE'),
('var-p004-beige-xl', 'p004', 'LIN-P004-BEI-XL', 'Beige', 'XL', 499000, 25, 'ACTIVE'),
('var-p004-white-m', 'p004', 'LIN-P004-WHI-M', 'White', 'M', 499000, 25, 'ACTIVE'),
('var-p004-white-l', 'p004', 'LIN-P004-WHI-L', 'White', 'L', 499000, 25, 'ACTIVE'),
('var-p004-white-xl', 'p004', 'LIN-P004-WHI-XL', 'White', 'XL', 499000, 25, 'ACTIVE'),
('var-p005-blue-29', 'p005', 'STR-P005-BLU-29', 'Blue', '29', 549000, 25, 'ACTIVE'),
('var-p005-blue-30', 'p005', 'STR-P005-BLU-30', 'Blue', '30', 549000, 25, 'ACTIVE'),
('var-p005-blue-31', 'p005', 'STR-P005-BLU-31', 'Blue', '31', 549000, 25, 'ACTIVE'),
('var-p005-blue-32', 'p005', 'STR-P005-BLU-32', 'Blue', '32', 549000, 25, 'ACTIVE'),
('var-p005-blue-33', 'p005', 'STR-P005-BLU-33', 'Blue', '33', 549000, 25, 'ACTIVE'),
('var-p005-black-29', 'p005', 'STR-P005-BLA-29', 'Black', '29', 549000, 25, 'ACTIVE'),
('var-p005-black-30', 'p005', 'STR-P005-BLA-30', 'Black', '30', 549000, 25, 'ACTIVE'),
('var-p005-black-31', 'p005', 'STR-P005-BLA-31', 'Black', '31', 549000, 25, 'ACTIVE'),
('var-p005-black-32', 'p005', 'STR-P005-BLA-32', 'Black', '32', 549000, 25, 'ACTIVE'),
('var-p005-black-33', 'p005', 'STR-P005-BLA-33', 'Black', '33', 549000, 25, 'ACTIVE'),
('var-p006-black-s', 'p006', 'TAP-P006-BLA-S', 'Black', 'S', 479000, 25, 'ACTIVE'),
('var-p006-black-m', 'p006', 'TAP-P006-BLA-M', 'Black', 'M', 479000, 25, 'ACTIVE'),
('var-p006-black-l', 'p006', 'TAP-P006-BLA-L', 'Black', 'L', 479000, 25, 'ACTIVE'),
('var-p006-black-xl', 'p006', 'TAP-P006-BLA-XL', 'Black', 'XL', 479000, 25, 'ACTIVE'),
('var-p006-grey-s', 'p006', 'TAP-P006-GRE-S', 'Grey', 'S', 479000, 25, 'ACTIVE'),
('var-p006-grey-m', 'p006', 'TAP-P006-GRE-M', 'Grey', 'M', 479000, 25, 'ACTIVE'),
('var-p006-grey-l', 'p006', 'TAP-P006-GRE-L', 'Grey', 'L', 479000, 25, 'ACTIVE'),
('var-p006-grey-xl', 'p006', 'TAP-P006-GRE-XL', 'Grey', 'XL', 479000, 25, 'ACTIVE'),
('var-p006-khaki-s', 'p006', 'TAP-P006-KHA-S', 'Khaki', 'S', 479000, 25, 'ACTIVE'),
('var-p006-khaki-m', 'p006', 'TAP-P006-KHA-M', 'Khaki', 'M', 479000, 25, 'ACTIVE'),
('var-p006-khaki-l', 'p006', 'TAP-P006-KHA-L', 'Khaki', 'L', 479000, 25, 'ACTIVE'),
('var-p006-khaki-xl', 'p006', 'TAP-P006-KHA-XL', 'Khaki', 'XL', 479000, 25, 'ACTIVE'),
('var-p007-black-s', 'p007', 'WID-P007-BLA-S', 'Black', 'S', 429000, 25, 'ACTIVE'),
('var-p007-black-m', 'p007', 'WID-P007-BLA-M', 'Black', 'M', 429000, 25, 'ACTIVE'),
('var-p007-black-l', 'p007', 'WID-P007-BLA-L', 'Black', 'L', 429000, 25, 'ACTIVE'),
('var-p007-beige-s', 'p007', 'WID-P007-BEI-S', 'Beige', 'S', 429000, 25, 'ACTIVE'),
('var-p007-beige-m', 'p007', 'WID-P007-BEI-M', 'Beige', 'M', 429000, 25, 'ACTIVE'),
('var-p007-beige-l', 'p007', 'WID-P007-BEI-L', 'Beige', 'L', 429000, 25, 'ACTIVE'),
('var-p008-black-s', 'p008', 'SLI-P008-BLA-S', 'Black', 'S', 599000, 25, 'ACTIVE'),
('var-p008-black-m', 'p008', 'SLI-P008-BLA-M', 'Black', 'M', 599000, 25, 'ACTIVE'),
('var-p008-black-l', 'p008', 'SLI-P008-BLA-L', 'Black', 'L', 599000, 25, 'ACTIVE'),
('var-p008-brown-s', 'p008', 'SLI-P008-BRO-S', 'Brown', 'S', 599000, 25, 'ACTIVE'),
('var-p008-brown-m', 'p008', 'SLI-P008-BRO-M', 'Brown', 'M', 599000, 25, 'ACTIVE'),
('var-p008-brown-l', 'p008', 'SLI-P008-BRO-L', 'Brown', 'L', 599000, 25, 'ACTIVE'),
('var-p009-black-s', 'p009', 'STR-P009-BLA-S', 'Black', 'S', 899000, 25, 'ACTIVE'),
('var-p009-black-m', 'p009', 'STR-P009-BLA-M', 'Black', 'M', 899000, 25, 'ACTIVE'),
('var-p009-black-l', 'p009', 'STR-P009-BLA-L', 'Black', 'L', 899000, 25, 'ACTIVE'),
('var-p009-beige-s', 'p009', 'STR-P009-BEI-S', 'Beige', 'S', 899000, 25, 'ACTIVE'),
('var-p009-beige-m', 'p009', 'STR-P009-BEI-M', 'Beige', 'M', 899000, 25, 'ACTIVE'),
('var-p009-beige-l', 'p009', 'STR-P009-BEI-L', 'Beige', 'L', 899000, 25, 'ACTIVE'),
('var-p010-blue-s', 'p010', 'OVE-P010-BLU-S', 'Blue', 'S', 749000, 25, 'ACTIVE'),
('var-p010-blue-m', 'p010', 'OVE-P010-BLU-M', 'Blue', 'M', 749000, 25, 'ACTIVE'),
('var-p010-blue-l', 'p010', 'OVE-P010-BLU-L', 'Blue', 'L', 749000, 25, 'ACTIVE'),
('var-p010-blue-xl', 'p010', 'OVE-P010-BLU-XL', 'Blue', 'XL', 749000, 25, 'ACTIVE'),
('var-p010-black-s', 'p010', 'OVE-P010-BLA-S', 'Black', 'S', 749000, 25, 'ACTIVE'),
('var-p010-black-m', 'p010', 'OVE-P010-BLA-M', 'Black', 'M', 749000, 25, 'ACTIVE'),
('var-p010-black-l', 'p010', 'OVE-P010-BLA-L', 'Black', 'L', 749000, 25, 'ACTIVE'),
('var-p010-black-xl', 'p010', 'OVE-P010-BLA-XL', 'Black', 'XL', 749000, 25, 'ACTIVE'),
('var-p011-black-s', 'p011', 'LIG-P011-BLA-S', 'Black', 'S', 649000, 25, 'ACTIVE'),
('var-p011-black-m', 'p011', 'LIG-P011-BLA-M', 'Black', 'M', 649000, 25, 'ACTIVE'),
('var-p011-black-l', 'p011', 'LIG-P011-BLA-L', 'Black', 'L', 649000, 25, 'ACTIVE'),
('var-p011-black-xl', 'p011', 'LIG-P011-BLA-XL', 'Black', 'XL', 649000, 25, 'ACTIVE'),
('var-p011-green-s', 'p011', 'LIG-P011-GRE-S', 'Green', 'S', 649000, 25, 'ACTIVE'),
('var-p011-green-m', 'p011', 'LIG-P011-GRE-M', 'Green', 'M', 649000, 25, 'ACTIVE'),
('var-p011-green-l', 'p011', 'LIG-P011-GRE-L', 'Green', 'L', 649000, 25, 'ACTIVE'),
('var-p011-green-xl', 'p011', 'LIG-P011-GRE-XL', 'Green', 'XL', 649000, 25, 'ACTIVE'),
('var-p012-cream-s', 'p012', 'KNI-P012-CRE-S', 'Cream', 'S', 559000, 25, 'ACTIVE'),
('var-p012-cream-m', 'p012', 'KNI-P012-CRE-M', 'Cream', 'M', 559000, 25, 'ACTIVE'),
('var-p012-cream-l', 'p012', 'KNI-P012-CRE-L', 'Cream', 'L', 559000, 25, 'ACTIVE'),
('var-p012-brown-s', 'p012', 'KNI-P012-BRO-S', 'Brown', 'S', 559000, 25, 'ACTIVE'),
('var-p012-brown-m', 'p012', 'KNI-P012-BRO-M', 'Brown', 'M', 559000, 25, 'ACTIVE'),
('var-p012-brown-l', 'p012', 'KNI-P012-BRO-L', 'Brown', 'L', 559000, 25, 'ACTIVE'),
('var-p013-black-s', 'p013', 'RIB-P013-BLA-S', 'Black', 'S', 199000, 25, 'ACTIVE'),
('var-p013-black-m', 'p013', 'RIB-P013-BLA-M', 'Black', 'M', 199000, 25, 'ACTIVE'),
('var-p013-black-l', 'p013', 'RIB-P013-BLA-L', 'Black', 'L', 199000, 25, 'ACTIVE'),
('var-p013-white-s', 'p013', 'RIB-P013-WHI-S', 'White', 'S', 199000, 25, 'ACTIVE'),
('var-p013-white-m', 'p013', 'RIB-P013-WHI-M', 'White', 'M', 199000, 25, 'ACTIVE'),
('var-p013-white-l', 'p013', 'RIB-P013-WHI-L', 'White', 'L', 199000, 25, 'ACTIVE'),
('var-p013-beige-s', 'p013', 'RIB-P013-BEI-S', 'Beige', 'S', 199000, 25, 'ACTIVE'),
('var-p013-beige-m', 'p013', 'RIB-P013-BEI-M', 'Beige', 'M', 199000, 25, 'ACTIVE'),
('var-p013-beige-l', 'p013', 'RIB-P013-BEI-L', 'Beige', 'L', 199000, 25, 'ACTIVE'),
('var-p014-grey-s', 'p014', 'CRO-P014-GRE-S', 'Grey', 'S', 399000, 25, 'ACTIVE'),
('var-p014-grey-m', 'p014', 'CRO-P014-GRE-M', 'Grey', 'M', 399000, 25, 'ACTIVE'),
('var-p014-grey-l', 'p014', 'CRO-P014-GRE-L', 'Grey', 'L', 399000, 25, 'ACTIVE'),
('var-p014-black-s', 'p014', 'CRO-P014-BLA-S', 'Black', 'S', 399000, 25, 'ACTIVE'),
('var-p014-black-m', 'p014', 'CRO-P014-BLA-M', 'Black', 'M', 399000, 25, 'ACTIVE'),
('var-p014-black-l', 'p014', 'CRO-P014-BLA-L', 'Black', 'L', 399000, 25, 'ACTIVE'),
('var-p015-black-s', 'p015', 'BAS-P015-BLA-S', 'Black', 'S', 449000, 25, 'ACTIVE'),
('var-p015-black-m', 'p015', 'BAS-P015-BLA-M', 'Black', 'M', 449000, 25, 'ACTIVE'),
('var-p015-black-l', 'p015', 'BAS-P015-BLA-L', 'Black', 'L', 449000, 25, 'ACTIVE'),
('var-p015-black-xl', 'p015', 'BAS-P015-BLA-XL', 'Black', 'XL', 449000, 25, 'ACTIVE'),
('var-p015-grey-s', 'p015', 'BAS-P015-GRE-S', 'Grey', 'S', 449000, 25, 'ACTIVE'),
('var-p015-grey-m', 'p015', 'BAS-P015-GRE-M', 'Grey', 'M', 449000, 25, 'ACTIVE'),
('var-p015-grey-l', 'p015', 'BAS-P015-GRE-L', 'Grey', 'L', 449000, 25, 'ACTIVE'),
('var-p015-grey-xl', 'p015', 'BAS-P015-GRE-XL', 'Grey', 'XL', 449000, 25, 'ACTIVE'),
('var-p015-navy-s', 'p015', 'BAS-P015-NAV-S', 'Navy', 'S', 449000, 25, 'ACTIVE'),
('var-p015-navy-m', 'p015', 'BAS-P015-NAV-M', 'Navy', 'M', 449000, 25, 'ACTIVE'),
('var-p015-navy-l', 'p015', 'BAS-P015-NAV-L', 'Navy', 'L', 449000, 25, 'ACTIVE'),
('var-p015-navy-xl', 'p015', 'BAS-P015-NAV-XL', 'Navy', 'XL', 449000, 25, 'ACTIVE'),
('var-p016-black-s', 'p016', 'PLE-P016-BLA-S', 'Black', 'S', 459000, 25, 'ACTIVE'),
('var-p016-black-m', 'p016', 'PLE-P016-BLA-M', 'Black', 'M', 459000, 25, 'ACTIVE'),
('var-p016-black-l', 'p016', 'PLE-P016-BLA-L', 'Black', 'L', 459000, 25, 'ACTIVE'),
('var-p016-beige-s', 'p016', 'PLE-P016-BEI-S', 'Beige', 'S', 459000, 25, 'ACTIVE'),
('var-p016-beige-m', 'p016', 'PLE-P016-BEI-M', 'Beige', 'M', 459000, 25, 'ACTIVE'),
('var-p016-beige-l', 'p016', 'PLE-P016-BEI-L', 'Beige', 'L', 459000, 25, 'ACTIVE'),
('var-p017-black-s', 'p017', 'CAR-P017-BLA-S', 'Black', 'S', 529000, 25, 'ACTIVE'),
('var-p017-black-m', 'p017', 'CAR-P017-BLA-M', 'Black', 'M', 529000, 25, 'ACTIVE'),
('var-p017-black-l', 'p017', 'CAR-P017-BLA-L', 'Black', 'L', 529000, 25, 'ACTIVE'),
('var-p017-black-xl', 'p017', 'CAR-P017-BLA-XL', 'Black', 'XL', 529000, 25, 'ACTIVE'),
('var-p017-khaki-s', 'p017', 'CAR-P017-KHA-S', 'Khaki', 'S', 529000, 25, 'ACTIVE'),
('var-p017-khaki-m', 'p017', 'CAR-P017-KHA-M', 'Khaki', 'M', 529000, 25, 'ACTIVE'),
('var-p017-khaki-l', 'p017', 'CAR-P017-KHA-L', 'Khaki', 'L', 529000, 25, 'ACTIVE'),
('var-p017-khaki-xl', 'p017', 'CAR-P017-KHA-XL', 'Khaki', 'XL', 529000, 25, 'ACTIVE'),
('var-p017-olive-s', 'p017', 'CAR-P017-OLI-S', 'Olive', 'S', 529000, 25, 'ACTIVE'),
('var-p017-olive-m', 'p017', 'CAR-P017-OLI-M', 'Olive', 'M', 529000, 25, 'ACTIVE'),
('var-p017-olive-l', 'p017', 'CAR-P017-OLI-L', 'Olive', 'L', 529000, 25, 'ACTIVE'),
('var-p017-olive-xl', 'p017', 'CAR-P017-OLI-XL', 'Olive', 'XL', 529000, 25, 'ACTIVE'),
('var-p018-blue-s', 'p018', 'MIN-P018-BLU-S', 'Blue', 'S', 349000, 25, 'ACTIVE'),
('var-p018-blue-m', 'p018', 'MIN-P018-BLU-M', 'Blue', 'M', 349000, 25, 'ACTIVE'),
('var-p018-blue-l', 'p018', 'MIN-P018-BLU-L', 'Blue', 'L', 349000, 25, 'ACTIVE'),
('var-p019-white-38', 'p019', 'CAN-P019-WHI-38', 'White', '38', 649000, 25, 'ACTIVE'),
('var-p019-white-39', 'p019', 'CAN-P019-WHI-39', 'White', '39', 649000, 25, 'ACTIVE'),
('var-p019-white-40', 'p019', 'CAN-P019-WHI-40', 'White', '40', 649000, 25, 'ACTIVE'),
('var-p019-white-41', 'p019', 'CAN-P019-WHI-41', 'White', '41', 649000, 25, 'ACTIVE'),
('var-p019-white-42', 'p019', 'CAN-P019-WHI-42', 'White', '42', 649000, 25, 'ACTIVE'),
('var-p019-white-43', 'p019', 'CAN-P019-WHI-43', 'White', '43', 649000, 25, 'ACTIVE'),
('var-p019-black-38', 'p019', 'CAN-P019-BLA-38', 'Black', '38', 649000, 25, 'ACTIVE'),
('var-p019-black-39', 'p019', 'CAN-P019-BLA-39', 'Black', '39', 649000, 25, 'ACTIVE'),
('var-p019-black-40', 'p019', 'CAN-P019-BLA-40', 'Black', '40', 649000, 25, 'ACTIVE'),
('var-p019-black-41', 'p019', 'CAN-P019-BLA-41', 'Black', '41', 649000, 25, 'ACTIVE'),
('var-p019-black-42', 'p019', 'CAN-P019-BLA-42', 'Black', '42', 649000, 25, 'ACTIVE'),
('var-p019-black-43', 'p019', 'CAN-P019-BLA-43', 'Black', '43', 649000, 25, 'ACTIVE'),
('var-p020-white-38', 'p020', 'CHU-P020-WHI-38', 'White', '38', 899000, 25, 'ACTIVE'),
('var-p020-white-39', 'p020', 'CHU-P020-WHI-39', 'White', '39', 899000, 25, 'ACTIVE'),
('var-p020-white-40', 'p020', 'CHU-P020-WHI-40', 'White', '40', 899000, 25, 'ACTIVE'),
('var-p020-white-41', 'p020', 'CHU-P020-WHI-41', 'White', '41', 899000, 25, 'ACTIVE'),
('var-p020-white-42', 'p020', 'CHU-P020-WHI-42', 'White', '42', 899000, 25, 'ACTIVE'),
('var-p020-white-43', 'p020', 'CHU-P020-WHI-43', 'White', '43', 899000, 25, 'ACTIVE'),
('var-p020-grey-38', 'p020', 'CHU-P020-GRE-38', 'Grey', '38', 899000, 25, 'ACTIVE'),
('var-p020-grey-39', 'p020', 'CHU-P020-GRE-39', 'Grey', '39', 899000, 25, 'ACTIVE'),
('var-p020-grey-40', 'p020', 'CHU-P020-GRE-40', 'Grey', '40', 899000, 25, 'ACTIVE'),
('var-p020-grey-41', 'p020', 'CHU-P020-GRE-41', 'Grey', '41', 899000, 25, 'ACTIVE'),
('var-p020-grey-42', 'p020', 'CHU-P020-GRE-42', 'Grey', '42', 899000, 25, 'ACTIVE'),
('var-p020-grey-43', 'p020', 'CHU-P020-GRE-43', 'Grey', '43', 899000, 25, 'ACTIVE'),
('var-p021-beige-one size', 'p021', 'CAN-P021-BEI-One Size', 'Beige', 'One Size', 249000, 25, 'ACTIVE'),
('var-p021-black-one size', 'p021', 'CAN-P021-BLA-One Size', 'Black', 'One Size', 249000, 25, 'ACTIVE'),
('var-p022-black-one size', 'p022', 'LEA-P022-BLA-One Size', 'Black', 'One Size', 299000, 25, 'ACTIVE'),
('var-p022-brown-one size', 'p022', 'LEA-P022-BRO-One Size', 'Brown', 'One Size', 299000, 25, 'ACTIVE'),
('var-p023-black-one size', 'p023', 'BUC-P023-BLA-One Size', 'Black', 'One Size', 179000, 25, 'ACTIVE'),
('var-p023-beige-one size', 'p023', 'BUC-P023-BEI-One Size', 'Beige', 'One Size', 179000, 25, 'ACTIVE'),
('var-p024-camel-s', 'p024', 'WOO-P024-CAM-S', 'Camel', 'S', 1299000, 25, 'ACTIVE'),
('var-p024-camel-m', 'p024', 'WOO-P024-CAM-M', 'Camel', 'M', 1299000, 25, 'ACTIVE'),
('var-p024-camel-l', 'p024', 'WOO-P024-CAM-L', 'Camel', 'L', 1299000, 25, 'ACTIVE'),
('var-p024-black-s', 'p024', 'WOO-P024-BLA-S', 'Black', 'S', 1299000, 25, 'ACTIVE'),
('var-p024-black-m', 'p024', 'WOO-P024-BLA-M', 'Black', 'M', 1299000, 25, 'ACTIVE'),
('var-p024-black-l', 'p024', 'WOO-P024-BLA-L', 'Black', 'L', 1299000, 25, 'ACTIVE'),
('var-p025-navy-s', 'p025', 'REL-P025-NAV-S', 'Navy', 'S', 359000, 25, 'ACTIVE'),
('var-p025-navy-m', 'p025', 'REL-P025-NAV-M', 'Navy', 'M', 359000, 25, 'ACTIVE'),
('var-p025-navy-l', 'p025', 'REL-P025-NAV-L', 'Navy', 'L', 359000, 25, 'ACTIVE'),
('var-p025-navy-xl', 'p025', 'REL-P025-NAV-XL', 'Navy', 'XL', 359000, 25, 'ACTIVE'),
('var-p025-white-s', 'p025', 'REL-P025-WHI-S', 'White', 'S', 359000, 25, 'ACTIVE'),
('var-p025-white-m', 'p025', 'REL-P025-WHI-M', 'White', 'M', 359000, 25, 'ACTIVE'),
('var-p025-white-l', 'p025', 'REL-P025-WHI-L', 'White', 'L', 359000, 25, 'ACTIVE'),
('var-p025-white-xl', 'p025', 'REL-P025-WHI-XL', 'White', 'XL', 359000, 25, 'ACTIVE'),
('var-p025-black-s', 'p025', 'REL-P025-BLA-S', 'Black', 'S', 359000, 25, 'ACTIVE'),
('var-p025-black-m', 'p025', 'REL-P025-BLA-M', 'Black', 'M', 359000, 25, 'ACTIVE'),
('var-p025-black-l', 'p025', 'REL-P025-BLA-L', 'Black', 'L', 359000, 25, 'ACTIVE'),
('var-p025-black-xl', 'p025', 'REL-P025-BLA-XL', 'Black', 'XL', 359000, 25, 'ACTIVE'),
('var-p026-blue-s', 'p026', 'HIG-P026-BLU-S', 'Blue', 'S', 499000, 25, 'ACTIVE'),
('var-p026-blue-m', 'p026', 'HIG-P026-BLU-M', 'Blue', 'M', 499000, 25, 'ACTIVE'),
('var-p026-blue-l', 'p026', 'HIG-P026-BLU-L', 'Blue', 'L', 499000, 25, 'ACTIVE'),
('var-p026-blue-xl', 'p026', 'HIG-P026-BLU-XL', 'Blue', 'XL', 499000, 25, 'ACTIVE'),
('var-p026-black-s', 'p026', 'HIG-P026-BLA-S', 'Black', 'S', 499000, 25, 'ACTIVE'),
('var-p026-black-m', 'p026', 'HIG-P026-BLA-M', 'Black', 'M', 499000, 25, 'ACTIVE'),
('var-p026-black-l', 'p026', 'HIG-P026-BLA-L', 'Black', 'L', 499000, 25, 'ACTIVE'),
('var-p026-black-xl', 'p026', 'HIG-P026-BLA-XL', 'Black', 'XL', 499000, 25, 'ACTIVE'),
('var-p027-cream-s', 'p027', 'SIL-P027-CRE-S', 'Cream', 'S', 549000, 25, 'ACTIVE'),
('var-p027-cream-m', 'p027', 'SIL-P027-CRE-M', 'Cream', 'M', 549000, 25, 'ACTIVE'),
('var-p027-cream-l', 'p027', 'SIL-P027-CRE-L', 'Cream', 'L', 549000, 25, 'ACTIVE'),
('var-p027-black-s', 'p027', 'SIL-P027-BLA-S', 'Black', 'S', 549000, 25, 'ACTIVE'),
('var-p027-black-m', 'p027', 'SIL-P027-BLA-M', 'Black', 'M', 549000, 25, 'ACTIVE'),
('var-p027-black-l', 'p027', 'SIL-P027-BLA-L', 'Black', 'L', 549000, 25, 'ACTIVE'),
('var-p028-black-s', 'p028', 'TRA-P028-BLA-S', 'Black', 'S', 599000, 25, 'ACTIVE'),
('var-p028-black-m', 'p028', 'TRA-P028-BLA-M', 'Black', 'M', 599000, 25, 'ACTIVE'),
('var-p028-black-l', 'p028', 'TRA-P028-BLA-L', 'Black', 'L', 599000, 25, 'ACTIVE'),
('var-p028-black-xl', 'p028', 'TRA-P028-BLA-XL', 'Black', 'XL', 599000, 25, 'ACTIVE'),
('var-p028-navy-s', 'p028', 'TRA-P028-NAV-S', 'Navy', 'S', 599000, 25, 'ACTIVE'),
('var-p028-navy-m', 'p028', 'TRA-P028-NAV-M', 'Navy', 'M', 599000, 25, 'ACTIVE'),
('var-p028-navy-l', 'p028', 'TRA-P028-NAV-L', 'Navy', 'L', 599000, 25, 'ACTIVE'),
('var-p028-navy-xl', 'p028', 'TRA-P028-NAV-XL', 'Navy', 'XL', 599000, 25, 'ACTIVE');

-- 9. Outfits (All 10 Smart Outfits from Frontend)
INSERT INTO `outfits` (`id`, `slug`, `title`, `description`, `image`, `occasion`, `style`, `gender`, `season`, `featured`, `status`) VALUES
('o001', 'o001', 'Minimal Everyday', 'Set đồ hàng ngày tối giản, dễ phối và thoải mái vận động.', '/images/outfits/outfit-01.jpg', 'everyday', 'minimal', 'unisex', 'all-season', 1, 'ACTIVE'),
('o002', 'o002', 'Smart Casual', 'Set đồ vừa lịch sự vừa thoải mái, phù hợp đi làm hoặc gặp gỡ đối tác.', '/images/outfits/outfit-02.jpg', 'office', 'smart-casual', 'unisex', 'all-season', 1, 'ACTIVE'),
('o003', 'o003', 'Weekend Street', 'Outfit cá tính cho ngày cuối tuần đi chơi cùng bạn bè.', '/images/outfits/outfit-03.jpg', 'weekend', 'streetstyle', 'unisex', 'all-season', 1, 'ACTIVE'),
('o004', 'o004', 'Office Essential', 'Set đồ công sở thanh lịch, chỉn chu nhưng vẫn thoải mái cả ngày dài.', '/images/outfits/outfit-04.jpg', 'office', 'smart-casual', 'unisex', 'all-season', 1, 'ACTIVE'),
('o005', 'o005', 'Denim on Denim', 'Phối denim hoài cổ, đơn giản nhưng vẫn nổi bật.', '/images/outfits/outfit-05.jpg', 'weekend', 'vintage', 'unisex', 'all-season', 1, 'ACTIVE'),
('o006', 'o006', 'Date Night Soft', 'Set đồ nhẹ nhàng, nữ tính cho buổi hẹn hò buổi tối.', '/images/outfits/outfit-06.jpg', 'date', 'minimal', 'unisex', 'all-season', 1, 'ACTIVE'),
('o007', 'o007', 'Travel Comfort', 'Thoải mái tối đa cho những chuyến đi dài, vẫn giữ được phong cách.', '/images/outfits/outfit-07.jpg', 'travel', 'sporty-chic', 'unisex', 'all-season', 1, 'ACTIVE'),
('o008', 'o008', 'Party Statement', 'Outfit nổi bật, cá tính cho những buổi tiệc tối.', '/images/outfits/outfit-08.jpg', 'party', 'streetstyle', 'unisex', 'all-season', 1, 'ACTIVE'),
('o009', 'o009', 'Basic Layers', 'Layer đơn giản với những món đồ basic dễ phối nhất.', '/images/outfits/outfit-09.jpg', 'everyday', 'basic', 'unisex', 'all-season', 1, 'ACTIVE'),
('o010', 'o010', 'Sporty Weekend', 'Set đồ năng động, phù hợp cả đi tập lẫn đi chơi.', '/images/outfits/outfit-10.jpg', 'weekend', 'sporty-chic', 'unisex', 'all-season', 1, 'ACTIVE');

-- 10. Outfit Product Mappings
INSERT INTO `outfit_products` (`id`, `outfit_id`, `product_id`) VALUES
('op-o001-p001', 'o001', 'p001'),
('op-o001-p005', 'o001', 'p005'),
('op-o001-p019', 'o001', 'p019'),
('op-o001-p021', 'o001', 'p021'),
('op-o002-p003', 'o002', 'p003'),
('op-o002-p006', 'o002', 'p006'),
('op-o002-p022', 'o002', 'p022'),
('op-o002-p019', 'o002', 'p019'),
('op-o003-p002', 'o003', 'p002'),
('op-o003-p017', 'o003', 'p017'),
('op-o003-p020', 'o003', 'p020'),
('op-o003-p023', 'o003', 'p023'),
('op-o004-p027', 'o004', 'p027'),
('op-o004-p016', 'o004', 'p016'),
('op-o004-p009', 'o004', 'p009'),
('op-o004-p022', 'o004', 'p022'),
('op-o005-p010', 'o005', 'p010'),
('op-o005-p026', 'o005', 'p026'),
('op-o005-p019', 'o005', 'p019'),
('op-o006-p008', 'o006', 'p008'),
('op-o006-p012', 'o006', 'p012'),
('op-o006-p021', 'o006', 'p021'),
('op-o007-p015', 'o007', 'p015'),
('op-o007-p017', 'o007', 'p017'),
('op-o007-p020', 'o007', 'p020'),
('op-o008-p014', 'o008', 'p014'),
('op-o008-p018', 'o008', 'p018'),
('op-o008-p020', 'o008', 'p020'),
('op-o009-p013', 'o009', 'p013'),
('op-o009-p026', 'o009', 'p026'),
('op-o009-p010', 'o009', 'p010'),
('op-o010-p028', 'o010', 'p028'),
('op-o010-p017', 'o010', 'p017'),
('op-o010-p020', 'o010', 'p020');

-- 11. Orders (Real Orders matching Frontend state)
INSERT INTO `orders` (`id`, `user_id`, `receiver_name`, `phone_number`, `shipping_address`, `shipping_method`, `payment_method`, `payment_status`, `order_status`, `subtotal`, `shipping_fee`, `discount`, `total`, `created_at`) VALUES
('ORD-2026-0001', 'usr-customer-001', 'Nguyễn Văn A', '0123456789', '123 Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội', 'standard', 'COD', 'PAID', 'CONFIRMED', 598000, 30000, 50000, 578000, '2026-09-06 09:12:00'),
('ORD-2026-0002', 'usr-customer-001', 'Nguyễn Văn A', '0123456789', '123 Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội', 'express', 'MOMO', 'PAID', 'DELIVERED', 649000, 50000, 0, 699000, '2026-09-02 14:40:00'),
('ORD-2026-0003', 'usr-customer-001', 'Nguyễn Văn A', '0123456789', '45 Lê Lợi, Phường Bến Nghé, Quận 1, Hồ Chí Minh', 'standard', 'CARD', 'UNPAID', 'CANCELLED', 549000, 30000, 0, 579000, '2026-08-28 08:05:00'),
('ORD-2026-0004', 'usr-customer-002', 'Trần Thị Bích Ngọc', '0987654321', '88 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội', 'standard', 'VNPAY', 'PAID', 'DELIVERED', 1048000, 30000, 100000, 978000, '2026-08-22 11:20:00'),
('ORD-2026-0005', 'usr-customer-003', 'Lê Hoàng Long', '0912345678', '240 Hai Bà Trưng, Phường Tân Định, Quận 1, Hồ Chí Minh', 'standard', 'COD', 'PAID', 'SHIPPING', 828000, 30000, 50000, 808000, '2026-09-05 16:30:00'),
('ORD-2026-0006', 'usr-customer-004', 'Phạm Minh Trang', '0933456789', '56 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, Hồ Chí Minh', 'standard', 'CARD', 'PAID', 'DELIVERED', 1198000, 0, 150000, 1048000, '2026-09-04 10:15:00');

-- 12. Order Items
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `name`, `image`, `size`, `color`, `price`, `quantity`, `subtotal`) VALUES
('oi-1-1', 'ORD-2026-0001', 'p001', 'Essential Cotton T-Shirt', '/images/products/product-01.jpg', 'M', 'Black', 299000, 2, 598000),
('oi-2-1', 'ORD-2026-0002', 'p019', 'Canvas Sneakers', '/images/products/product-19.jpg', '40', 'White', 649000, 1, 649000),
('oi-3-1', 'ORD-2026-0003', 'p005', 'Straight Fit Jeans', '/images/products/product-05.jpg', '31', 'Blue', 549000, 1, 549000),
('oi-4-1', 'ORD-2026-0004', 'p003', 'Classic White Shirt', '/images/products/product-03.jpg', 'L', 'White', 459000, 1, 459000),
('oi-4-2', 'ORD-2026-0004', 'p028', 'Track Jacket', '/images/products/product-28.jpg', 'L', 'Black', 599000, 1, 599000),
('oi-5-1', 'ORD-2026-0005', 'p002', 'Oversized Basic Tee', '/images/products/product-02.jpg', 'XL', 'Beige', 329000, 1, 329000),
('oi-5-2', 'ORD-2026-0005', 'p004', 'Linen Blend Shirt', '/images/products/product-04.jpg', 'XL', 'Beige', 499000, 1, 499000),
('oi-6-1', 'ORD-2026-0006', 'p026', 'High Waist Jeans', '/images/products/product-26.jpg', 'M', 'Blue', 499000, 1, 499000),
('oi-6-2', 'ORD-2026-0006', 'p027', 'Silk Blend Blouse', '/images/products/product-27.jpg', 'M', 'Cream', 549000, 1, 549000);

-- 13. Coupons (All Promotions)
INSERT INTO `coupons` (`code`, `type`, `value`, `max_discount`, `min_order_value`, `description`, `is_active`) VALUES
('ROUTINE10', 'percent', 10, 100000, 300000, 'Giảm 10% tối đa 100K cho đơn từ 300K', 1),
('ROUTINE50K', 'fixed', 50000, 50000, 500000, 'Giảm trực tiếp 50K cho đơn từ 500K', 1),
('FREESHIP', 'freeship', 30000, 30000, 200000, 'Miễn phí vận chuyển toàn quốc', 1),
('WELCOME2026', 'percent', 15, 150000, 400000, 'Ưu đãi thành viên mới giảm 15%', 1),
('SUMMER2026', 'percent', 20, 200000, 600000, 'Khuyến mãi mùa hè giảm 20% đơn từ 600K', 1),
('FLASH50', 'fixed', 50000, 50000, 400000, 'Flash sale cuối tuần giảm 50K', 1);


-- 14. Reviews (Authentic customer reviews with ratings)
INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `user_name`, `user_avatar`, `rating`, `comment`, `status`, `created_at`) VALUES
('rev_001', 'usr-customer-001', 'p001', 'Nguyễn Văn A', '/images/avatars/user-01.jpg', 5, 'Chất vải cotton rất mềm mát, form regular fit chuẩn Routine mặc đi làm hay đi chơi đều đẹp!', 'APPROVED', '2026-09-01 17:30:00'),
('rev_002', 'usr-customer-001', 'p001', 'Trần Thị B', '/images/avatars/user-02.jpg', 4, 'Áo đẹp, đóng gói cẩn thận, giao hàng nhanh. Mình 1m7 nặng 65kg mặc size L vừa vặn.', 'APPROVED', '2026-08-25 21:15:00'),
('rev_003', 'usr-customer-001', 'p005', 'Hoàng Minh C', '/images/avatars/user-03.jpg', 5, 'Quần jeans đứng form, chất denim dày dặn vừa phải, co giãn nhẹ rất thoải mái.', 'APPROVED', '2026-08-20 16:00:00');

-- 15. Newsletter Subscribers
INSERT INTO `newsletter_subscribers` (`id`, `email`, `voucher_code`, `created_at`) VALUES
('sub-001', 'nguyenvana@gmail.com', 'WELCOME2026', '2026-08-15 08:35:00'),
('sub-002', 'bichngoc.tran@gmail.com', 'WELCOME2026', '2026-08-20 10:20:00'),
('sub-003', 'hoanglong.le@gmail.com', 'WELCOME2026', '2026-08-25 14:25:00'),
('sub-004', 'minhtrang.pham@gmail.com', 'WELCOME2026', '2026-09-01 09:50:00'),
('sub-005', 'thang.vu@gmail.com', 'WELCOME2026', '2026-09-03 16:15:00');


-- 16. Store Settings (Routine Official Configuration)
INSERT INTO `store_settings` (`setting_key`, `setting_value`, `description`) VALUES
('store_name', 'ROUTINE Vietnam', 'Tên thương hiệu thời trang'),
('hotline', '1900 636 845', 'Tổng đài hỗ trợ và đặt hàng toàn quốc'),
('contact_email', 'cskh@routine.vn', 'Hòm thư điện tử chăm sóc khách hàng'),
('warehouse_address', 'Tầng 5, Tòa nhà Routine, 123 Nguyễn Trãi, Thanh Xuân, Hà Nội', 'Địa chỉ kho xuất hàng chính'),
('default_shipping_fee', '30000', 'Phí vận chuyển tiêu chuẩn toàn quốc (VND)'),
('free_shipping_threshold', '499000', 'Giá trị đơn tối thiểu để được miễn phí vận chuyển (VND)'),
('working_hours', '08:30 - 21:30 (Thứ 2 đến Chủ Nhật)', 'Thời gian làm việc hỗ trợ khách hàng'),
('home_hero_banners', '{\"banners\":[{\"id\":\"hb-1\",\"url\":\"/images/hero/hero-banner-1.svg\",\"title\":\"Style That Fits You - Look 1\",\"isPrimary\":true},{\"id\":\"hb-2\",\"url\":\"/images/hero/hero-banner-2.svg\",\"title\":\"Urban Chic - Look 2\",\"isPrimary\":false},{\"id\":\"hb-3\",\"url\":\"/images/hero/hero-banner-3.svg\",\"title\":\"Daily Essentials - Look 3\",\"isPrimary\":false}],\"slideInterval\":2500,\"title\":\"STYLE THAT FITS YOU\",\"subtitle\":\"Khám phá phong cách phù hợp với bạn.\\nThời trang không chỉ là mặc gì. Đó là cách bạn thể hiện chính mình.\",\"exploreLink\":\"/category/new-arrivals\",\"outfitLink\":\"/smart-outfit\"}', 'Cấu hình Hero Banner toàn màn hình & Slide Trang chủ');

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- END OF DATABASE SCRIPT
-- ==============================================================================
