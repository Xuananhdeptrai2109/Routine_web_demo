-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: routine_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_user_id_fkey` (`user_id`),
  CONSTRAINT `addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES ('addr-001','usr-customer-001','Nguyễn Văn A','0123456789','123 Nguyễn Trãi','Phường Thanh Xuân Trung','Quận Thanh Xuân','Hà Nội',1,'2026-09-07 02:33:06.000','2026-09-07 02:33:06.000'),('addr-002','usr-customer-001','Nguyễn Văn A (Cơ quan)','0123456789','45 Lê Lợi','Phường Bến Nghé','Quận 1','Hồ Chí Minh',0,'2026-09-07 02:33:06.000','2026-09-07 02:33:06.000'),('addr-003','usr-customer-002','Trần Thị Bích Ngọc','0987654321','88 Cầu Giấy','Phường Dịch Vọng','Quận Cầu Giấy','Hà Nội',1,'2026-09-07 02:33:06.000','2026-09-07 02:33:06.000'),('addr-004','usr-customer-003','Lê Hoàng Long','0912345678','240 Hai Bà Trưng','Phường Tân Định','Quận 1','Hồ Chí Minh',1,'2026-09-07 02:33:06.000','2026-09-07 02:33:06.000'),('addr-005','usr-customer-004','Phạm Minh Trang','0933456789','56 Nguyễn Thị Minh Khai','Phường Đa Kao','Quận 1','Hồ Chí Minh',1,'2026-09-07 02:33:06.000','2026-09-07 02:33:06.000'),('addr-006','usr-customer-005','Vũ Đức Thắng','0944567890','15 Trần Phú','Phường Thạch Thang','Quận Hải Châu','Đà Nẵng',1,'2026-09-07 02:33:06.000','2026-09-07 02:33:06.000');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cart_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `line_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int NOT NULL,
  `original_price` int DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_cart_id_line_id_key` (`cart_id`,`line_id`),
  KEY `cart_items_product_id_fkey` (`product_id`),
  CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES ('3a868072-f5cc-4378-b098-6dd51dbaed3e','03b6b2ee-a26b-4b03-8c3a-7f96d78e9f24','p003','p003__L__Black','Classic White Shirt','tops','men',359000,699000,'/uploads/prod_p003_1_1788764847560.webp','L','Black',1,'2026-09-10 19:13:16.889','2026-09-11 05:02:01.035'),('f918d188-3a66-485a-8e92-4a208403ab54','a6157bae-d0b1-4eb6-97b3-ef1855ca45b0','p001','p001__L__Black','Essential Cotton T-Shirt','tops','unisex',299000,399000,'/images/products/product-01.jpg','L','Black',2,'2026-09-11 04:55:36.475','2026-09-11 04:55:36.475');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_session_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applied_coupon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_key` (`user_id`),
  UNIQUE KEY `carts_guest_session_id_key` (`guest_session_id`),
  CONSTRAINT `carts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES ('01a368fd-3698-4b1f-818a-1d6ad4242939','usr-customer-001',NULL,NULL,'2026-09-08 05:05:01.000','2026-09-10 21:04:08.089'),('03b6b2ee-a26b-4b03-8c3a-7f96d78e9f24','usr-admin-001',NULL,NULL,'2026-09-08 08:12:14.000','2026-09-11 05:02:01.040'),('129074d3-bfa2-496d-8575-a347adf8486b',NULL,'g_t1pcfrhrvt_mtse5r04',NULL,'2026-09-10 20:13:03.695','2026-09-10 20:13:03.695'),('3060e1a7-2308-41ef-89d8-4d8c4e3c777f',NULL,'g_mwpy579u98_mtsxtq6q',NULL,'2026-09-08 17:22:45.130','2026-09-08 17:22:45.130'),('99df4103-d79b-43bc-bfeb-205ae04d18b5','9b89e0d8-213d-407f-86af-a33c11d3b66a',NULL,NULL,'2026-09-10 11:12:18.201','2026-09-11 05:01:33.550'),('a6157bae-d0b1-4eb6-97b3-ef1855ca45b0',NULL,'test-session-123',NULL,'2026-09-11 04:55:36.426','2026-09-11 04:55:36.478'),('b47c1a37-b70c-4332-ae25-b66e4546d161',NULL,'test_guest_123',NULL,'2026-09-08 06:09:40.000','2026-09-08 06:09:40.000'),('bc7841b7-e35d-4fa0-a204-983516f27be6',NULL,'guest_verify_123',NULL,'2026-09-11 09:48:56.327','2026-09-11 09:48:56.327');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'standard',
  `parent_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('accessories','accessories','ACCESSORIES','Điểm nhấn nhỏ hoàn thiện outfit của bạn.','/uploads/img-1788801063358-232650361.webp','standard',NULL,'2026-09-07 02:33:06.000'),('ao','ao','ÁO','Tất cả các mẫu áo tối giản, dễ phối đồ.','/uploads/img-1788801077884-24959832.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('ao-khoac','ao-khoac','ÁO KHOÁC','Áo khoác nhẹ đến giữ ấm, hoàn thiện mọi outfit.','/uploads/img-1788801096387-542191114.webp','standard',NULL,'2026-09-07 02:33:06.000'),('bottoms','bottoms','BOTTOMS','Quần jeans, trousers và short với form dáng chuẩn tối giản.','/uploads/img-1788801105155-382164231.webp','standard',NULL,'2026-09-07 02:33:06.000'),('cat-accessories','cat-accessories','Accessories','','','standard','accessories','2026-09-07 02:33:06.000'),('cat-blazer','cat-blazer','Blazer','','','standard','outerwear','2026-09-07 02:33:06.000'),('cat-jacket','cat-jacket','Jacket','','','standard','outerwear','2026-09-07 02:33:06.000'),('cat-jeans','cat-jeans','Jeans','','','standard','bottoms','2026-09-07 02:33:06.000'),('cat-polo','cat-polo','Polo Shirt','','','standard','tops','2026-09-07 02:33:06.000'),('cat-shirt','cat-shirt','Shirt','','','standard','tops','2026-09-07 02:33:06.000'),('cat-shorts','cat-shorts','Shorts','','','standard','bottoms','2026-09-07 02:33:06.000'),('cat-sneakers','cat-sneakers','Sneakers','','','standard','accessories','2026-09-07 02:33:06.000'),('cat-trousers','cat-trousers','Trousers','','','standard','bottoms','2026-09-07 02:33:06.000'),('cat-tshirt','cat-tshirt','T-Shirt','','','standard','tops','2026-09-07 02:33:06.000'),('do-basic','do-basic','ĐỒ BASIC','Những món đồ nền tảng không thể thiếu trong tủ đồ.','/uploads/img-1788801133621-208878110.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('do-casual','do-casual','ĐỒ CASUAL','Thoải mái, dễ phối cho những ngày cuối tuần.','/images/categories/men.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('do-cong-so','do-cong-so','ĐỒ CÔNG SỞ','Thanh lịch, chỉn chu và vẫn thoải mái suốt ngày dài.','/uploads/img-1788801145458-960866053.webp','standard',NULL,'2026-09-07 02:33:06.000'),('men','men','MEN','Thời trang nam hiện đại, đơn giản và dễ phối cho mọi ngày.','/uploads/img-1788796070909-472120783.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('new-arrivals','new-arrivals','NEW ARRIVALS','Những thiết kế mới nhất vừa cập bến Routine, cập nhật hàng tuần.','/uploads/img-1788801171693-596065801.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('outerwear','outerwear','OUTERWEAR','Áo khoác giữ ấm và tôn dáng, phù hợp thời tiết chuyển mùa.','/uploads/img-1788801190623-766048033.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('phu-kien','phu-kien','PHỤ KIỆN','Điểm nhấn nhỏ hoàn thiện outfit của bạn.','/images/categories/accessories.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('quan','quan','QUẦN','Quần dài, quần short với form dáng chuẩn tối giản.','/images/categories/bottoms.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('tops','tops','TOPS','Áo thun, áo sơ mi và áo len được chọn lọc kỹ về chất liệu.','/uploads/img-1788801267898-831145848.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('unisex','unisex','UNISEX','Thiết kế phi giới tính, tối giản và linh hoạt cho mọi phong cách.','/uploads/img-1788801241048-579215365.webp','standard',NULL,'2026-09-07 02:33:06.000'),('vay','vay','VÁY','Váy tối giản, dễ mặc cho nhiều dịp khác nhau.','/images/categories/women.jpg','standard',NULL,'2026-09-07 02:33:06.000'),('women','women','WOMEN','Tối giản nhưng vẫn nữ tính, dễ dàng biến hóa từ ngày sang tối.','/uploads/img-1788801228942-959673364.jpg','standard',NULL,'2026-09-07 02:33:06.000');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` int NOT NULL,
  `max_discount` int DEFAULT NULL,
  `min_order_value` int NOT NULL DEFAULT '0',
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES ('FLASH50','fixed',50000,50000,400000,'Flash sale cuối tuần giảm 50K',1,'2026-09-07 02:33:06.000'),('FREESHIP','freeship',30000,30000,200000,'Miễn phí vận chuyển toàn quốc',1,'2026-09-07 02:33:06.000'),('ROUTINE10','percent',10,100000,300000,'Giảm 10% tối đa 100K cho đơn từ 300K',1,'2026-09-07 02:33:06.000'),('ROUTINE50K','fixed',50000,50000,500000,'Giảm trực tiếp 50K cho đơn từ 500K',1,'2026-09-07 02:33:06.000'),('SUMMER2026','percent',20,200000,600000,'Khuyến mãi mùa hè giảm 20% đơn từ 600K',1,'2026-09-07 02:33:06.000'),('WELCOME2026','percent',15,150000,400000,'Ưu đãi thành viên mới giảm 15%',1,'2026-09-07 02:33:06.000');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_fkey` (`order_id`),
  KEY `order_items_product_id_fkey` (`product_id`),
  CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES ('0e56b82b-1fc9-4e5a-964f-3cc369d8ec3b','ORD-2026-0017','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','L','Đen',299000,2,598000),('0feefabb-cf32-4367-84ee-6cc4de4b4b08','ORD-2026-0027','p015','Basic Hoodie','/uploads/img-1788788958479-491742161.jpg','XS','Black',449000,1,449000),('1321a62b-ed6f-4c02-8dc6-d78b87cc321b','ORD-2026-0026','p005','Straight Fit Jeans','/uploads/img-1788789096784-121126637.webp','33','Black',549000,2,1098000),('13cd465a-89a8-4de7-a0da-dab953abce79','ORD-2026-0019','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','M','Đen',299000,1,299000),('27935fa7-7008-47f5-9e80-7931314b8908','ORD-2026-0022','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','S','Black',359000,1,359000),('299a1ced-740c-4ada-b672-6d14b8d06916','ORD-2026-0021','p006','Tapered Trousers','/uploads/img-1788789509639-342621014.webp','S','Black',879000,1,879000),('2c674925-0b49-4187-8acc-8f1bb85e8b52','ORD-2026-0018','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','XL','Trắng',299000,1,299000),('2dacc1e1-5f21-40f6-ae94-b804c23d9928','ORD-2026-0010','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','S','Black',299000,1,299000),('303aa416-14df-4b4f-bd4c-8e7afc94fab7','ORD-2026-0029','p002','Oversized Basic Tee','/uploads/img-1788789435756-392598710.jpg','S','Black',329000,1,329000),('39844312-28b9-4cf3-b57f-3918b6c23855','ORD-2026-0008','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','L','Black',299000,2,598000),('465d673d-95f5-4c3f-babd-ab4a503b50e1','ORD-2026-0020','p009','Structured Blazer','/uploads/img-1788767099772-945379977.avif','L','Black',1099000,1,1099000),('484a72f2-1706-43fe-9537-7323a6a57642','ORD-2026-0014','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','M','Black',359000,1,359000),('60e053de-5ea6-43f9-9bf8-17bf3f8556f7','ORD-2026-0021','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','S','Black',359000,1,359000),('62319ff4-dd08-45bb-88d3-3eef24b5793d','ORD-2026-0007','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','L','Black',299000,2,598000),('69d7881e-a31a-4e08-a93d-dd8fcdff4b22','ORD-2026-0022','p019','Canvas Sneakers','/uploads/img-1788789297086-921796527.webp','38','White',649000,1,649000),('7142da3e-9529-447e-831a-4febf5e54c92','ORD-2026-0029','p017','Cargo Pants','/uploads/img-1788789669749-422416448.jpg','S','Black',529000,1,529000),('724de7fb-e988-4c9b-b29c-11731029f6a3','ORD-2026-0012','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','S','Black',359000,1,359000),('7a99688c-a2fa-4726-a022-e316150023e8','ORD-2026-0009','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','L','Black',299000,2,598000),('919409a9-e926-41b7-871f-4b23601a474e','ORD-2026-0013','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','S','Black',359000,1,359000),('9b06c1fd-da8a-4441-873e-1bd710f0aa44','ORD-2026-0029','p023','Bucket Hat','/uploads/img-1788790043902-928274212.jpg','one size','Black',179000,1,179000),('a0c4685e-bcf9-4d90-b969-d83b62c20d95','ORD-2026-0022','p006','Tapered Trousers','/uploads/img-1788789509639-342621014.webp','S','Black',879000,1,879000),('a0c75c2b-8eed-43dd-b39c-8bba9d042322','ORD-2026-0022','p022','Leather Belt','/uploads/img-1788789344907-557287861.jpg','one size','Black',299000,1,299000),('ae877634-7226-4ee4-8ad3-8c2255585648','ORD-2026-0015','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','L','Black',359000,1,359000),('b22be08a-f367-432b-944e-5f40890b47bc','ORD-2026-0021','p022','Leather Belt','/uploads/img-1788789344907-557287861.jpg','one size','Black',299000,1,299000),('b5092b2c-c44d-4fef-8fa8-26e017805f66','ORD-2026-0028','p001','Essential Cotton T-Shirt','/images/products/product-01.jpg','L','Black',299000,2,598000),('b9098245-58d4-4e43-b75c-e7b5ad2856bd','ORD-2026-0010','p002','Oversized Basic Tee','/uploads/img-1788789435756-392598710.jpg','S','Black',329000,1,329000),('c002d985-00af-4983-923e-c80280f05f98','ORD-2026-0016','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','L','Đen',299000,2,598000),('c3791271-2ac6-4406-84f3-ecbbfaf0bae9','ORD-2026-0011','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','S','Black',359000,1,359000),('cfdb5a88-46d1-4640-8630-eee8324d8f5f','ORD-2026-0029','p020','Chunky Sneakers','/uploads/img-1788789693643-744774052.jpg','38','White',899000,1,899000),('d6d20ac9-11a2-401d-af9b-ed278a35e739','ORD-2026-0021','p019','Canvas Sneakers','/uploads/img-1788789297086-921796527.webp','38','White',649000,1,649000),('ee5e046b-30ef-43c9-8052-18f20c243c16','ORD-2026-0025','p027','Silk Blend Blouse','/uploads/img-1788789037523-58527940.avif','L','Cream',349000,1,349000),('item-2026-0023-1','ORD-2026-0023','p001','Cotton Basic T-Shirt','/uploads/img-1788788886115-139226453.webp','M','Trắng',259000,1,259000),('item-2026-0023-2','ORD-2026-0023','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','L','Trắng',499000,1,499000),('item-2026-0024-1','ORD-2026-0024','p002','Slim Fit Denim Jeans','/uploads/img-1788789435756-392598710.jpg','31','Xanh đậm',599000,1,599000),('oi-1-1','ORD-2026-0001','p001','Essential Cotton T-Shirt','/uploads/img-1788788886115-139226453.webp','M','Black',299000,2,598000),('oi-2-1','ORD-2026-0002','p019','Canvas Sneakers','/uploads/img-1788789297086-921796527.webp','40','White',649000,1,649000),('oi-3-1','ORD-2026-0003','p005','Straight Fit Jeans','/uploads/img-1788789096784-121126637.webp','31','Blue',549000,1,549000),('oi-4-1','ORD-2026-0004','p003','Classic White Shirt','/uploads/prod_p003_1_1788764847560.webp','L','White',459000,1,459000),('oi-4-2','ORD-2026-0004','p028','Track Jacket','/uploads/img-1788789928154-820919560.jpg','L','Black',599000,1,599000),('oi-5-1','ORD-2026-0005','p002','Oversized Basic Tee','/uploads/img-1788789435756-392598710.jpg','XL','Beige',329000,1,329000),('oi-5-2','ORD-2026-0005','p004','Linen Blend Shirt','/uploads/img-1788789745799-962068753.jpg','XL','Beige',499000,1,499000),('oi-6-1','ORD-2026-0006','p026','High Waist Jeans','/uploads/img-1788789388728-43325308.jpg','M','Blue',499000,1,499000),('oi-6-2','ORD-2026-0006','p027','Silk Blend Blouse','/uploads/img-1788789037523-58527940.avif','M','Cream',549000,1,549000);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_session_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receiver_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_method` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'standard',
  `payment_method` enum('COD','CARD','VNPAY','MOMO') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COD',
  `payment_status` enum('UNPAID','PAID','REFUNDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID',
  `order_status` enum('PENDING','CONFIRMED','SHIPPING','DELIVERED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CONFIRMED',
  `subtotal` int NOT NULL,
  `shipping_fee` int NOT NULL DEFAULT '0',
  `discount` int NOT NULL DEFAULT '0',
  `total` int NOT NULL,
  `applied_coupon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `attribution_source` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ORGANIC',
  PRIMARY KEY (`id`),
  KEY `orders_user_id_fkey` (`user_id`),
  CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('ORD-2026-0001','usr-customer-001',NULL,'Nguyễn Văn A','0123456789','123 Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội','standard','COD','PAID','CONFIRMED',598000,30000,50000,578000,NULL,NULL,'2026-09-06 09:12:00.000','2026-09-07 02:33:06.000','ORGANIC'),('ORD-2026-0002','usr-customer-001',NULL,'Nguyễn Văn A','0123456789','123 Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội','express','MOMO','PAID','DELIVERED',649000,50000,0,699000,NULL,NULL,'2026-09-02 14:40:00.000','2026-09-07 02:33:06.000','ORGANIC'),('ORD-2026-0003','usr-customer-001',NULL,'Nguyễn Văn A','0123456789','45 Lê Lợi, Phường Bến Nghé, Quận 1, Hồ Chí Minh','standard','CARD','UNPAID','CANCELLED',549000,30000,0,579000,NULL,NULL,'2026-08-28 08:05:00.000','2026-09-07 02:33:06.000','ORGANIC'),('ORD-2026-0004','usr-customer-002',NULL,'Trần Thị Bích Ngọc','0987654321','88 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội','standard','VNPAY','PAID','DELIVERED',1048000,30000,100000,978000,NULL,NULL,'2026-08-22 11:20:00.000','2026-09-10 20:22:35.202','TIKTOK'),('ORD-2026-0005','usr-customer-003',NULL,'Lê Hoàng Long','0912345678','240 Hai Bà Trưng, Phường Tân Định, Quận 1, Hồ Chí Minh','standard','COD','PAID','SHIPPING',828000,30000,50000,808000,NULL,NULL,'2026-09-05 16:30:00.000','2026-09-10 20:22:35.206','FACEBOOK'),('ORD-2026-0006','usr-customer-004',NULL,'Phạm Minh Trang','0933456789','56 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, Hồ Chí Minh','standard','CARD','PAID','DELIVERED',1198000,0,150000,1048000,NULL,NULL,'2026-09-04 10:15:00.000','2026-09-10 20:22:35.211','INSTAGRAM'),('ORD-2026-0007',NULL,'guest_test-session-123','Trần Văn B','0911223344','456 Hai Bà Trưng','standard','COD','UNPAID','CANCELLED',598000,30000,0,628000,NULL,'','2026-09-07 10:38:09.000','2026-09-10 20:22:35.214','TIKTOK'),('ORD-2026-0008',NULL,'guest_test-session-123','Trần Văn B','0911223344','456 Hai Bà Trưng','standard','COD','UNPAID','CANCELLED',598000,30000,0,628000,NULL,'','2026-09-07 10:39:30.000','2026-09-10 20:22:35.218','FACEBOOK'),('ORD-2026-0009',NULL,'guest_test-session-123','Trần Văn B','0911223344','456 Hai Bà Trưng','standard','COD','UNPAID','CANCELLED',598000,30000,0,628000,NULL,'','2026-09-07 18:27:31.000','2026-09-10 20:22:35.221','INSTAGRAM'),('ORD-2026-0010','usr-customer-001','user_usr-customer-001','xuân anh','08435234554','hà nội','standard','VNPAY','UNPAID','CONFIRMED',628000,30000,0,658000,NULL,'','2026-09-07 18:38:21.000','2026-09-10 20:22:35.224','TIKTOK'),('ORD-2026-0011','usr-customer-001','user_usr-customer-001','xuân anh','08435234554','hà nội','standard','VNPAY','UNPAID','CONFIRMED',359000,30000,0,389000,NULL,'','2026-09-07 18:39:45.000','2026-09-10 20:22:35.228','FACEBOOK'),('ORD-2026-0012','usr-customer-001','user_usr-customer-001','xuân anh','08435234554','hà nội','standard','VNPAY','UNPAID','CONFIRMED',359000,30000,0,389000,NULL,'','2026-09-07 18:50:37.000','2026-09-10 20:22:35.231','INSTAGRAM'),('ORD-2026-0013','usr-customer-001','user_usr-customer-001','xuân anh','08435234554','hà nội','standard','VNPAY','PAID','CONFIRMED',359000,30000,0,389000,NULL,'[VNPay 15675065 - Bank: NCB]','2026-09-07 18:51:26.000','2026-09-07 18:56:00.000','ORGANIC'),('ORD-2026-0014','usr-admin-001',NULL,'Nguyen Van A','0987654321','123 Le Loi','standard','VNPAY','PAID','CONFIRMED',359000,30000,0,389000,NULL,'[VNPay 15675077 - Bank: NCB]','2026-09-07 19:35:47.000','2026-09-07 19:38:22.000','ORGANIC'),('ORD-2026-0015','usr-admin-001',NULL,'Nguyen Van A','0987654321','123 Le Loi','standard','VNPAY','UNPAID','PENDING',359000,30000,0,389000,NULL,'','2026-09-07 19:40:18.000','2026-09-07 19:40:18.000','ORGANIC'),('ORD-2026-0016','usr-customer-001',NULL,'Nguyễn Văn A','0123456789','123 Đường Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh','standard','COD','UNPAID','CONFIRMED',598000,30000,20000,608000,NULL,'Giao giờ hành chính, vui lòng gọi trước','2026-09-08 05:39:51.000','2026-09-10 20:22:35.235','TIKTOK'),('ORD-2026-0017','usr-customer-001',NULL,'Nguyễn Văn A','0123456789','123 Đường Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh','standard','COD','UNPAID','CONFIRMED',598000,30000,20000,608000,NULL,'Giao giờ hành chính, vui lòng gọi trước','2026-09-08 05:41:04.000','2026-09-10 20:22:35.239','FACEBOOK'),('ORD-2026-0018','usr-customer-001',NULL,'Nguyễn Văn A','0123456789','Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh','express','VNPAY','PAID','CONFIRMED',299000,50000,0,349000,NULL,'[VNPay 14589201 - Bank: NCB]','2026-09-08 05:41:05.000','2026-09-08 05:41:05.000','ORGANIC'),('ORD-2026-0019',NULL,'guest_test_guest_123','Nguyen Van A','0123456789','123 Le Loi','standard','COD','UNPAID','CONFIRMED',299000,30000,0,329000,NULL,'','2026-09-08 06:09:40.000','2026-09-08 06:09:40.000','ORGANIC'),('ORD-2026-0020','usr-customer-001',NULL,'xuân anh','08435234554','hà nội','standard','VNPAY','UNPAID','CANCELLED',1099000,30000,0,1129000,NULL,'[Tự động hủy] Đơn hàng quá hạn thanh toán 5 phút, kho đã giải phóng','2026-09-08 17:40:19.574','2026-09-10 09:38:55.311','ORGANIC'),('ORD-2026-0021','usr-admin-001',NULL,'adsf','0556585646','dfgdsf','standard','VNPAY','UNPAID','CANCELLED',2186000,30000,0,2216000,NULL,'[Tự động hủy] Đơn hàng quá hạn thanh toán 5 phút, kho đã giải phóng','2026-09-10 09:40:37.548','2026-09-10 09:45:38.596','ORGANIC'),('ORD-2026-0022','usr-admin-001',NULL,'adsf','0556585646','dfgdsf','standard','VNPAY','PAID','CONFIRMED',2186000,30000,0,2216000,NULL,'[VNPay 15677238 - Bank: NCB]','2026-09-10 09:43:55.346','2026-09-10 09:44:27.923','ORGANIC'),('ORD-2026-0023','9b89e0d8-213d-407f-86af-a33c11d3b66a',NULL,'Người Đẹp Đất Cảng','0987654329','45 Lê Hồng Phong, Phường Đông Khê, Quận Ngô Quyền, Hải Phòng','express','COD','UNPAID','CONFIRMED',758000,40000,0,798000,NULL,'Giao hàng giờ hành chính','2026-09-10 11:17:13.267','2026-09-10 20:22:35.242','TIKTOK'),('ORD-2026-0024','9b89e0d8-213d-407f-86af-a33c11d3b66a',NULL,'Người Đẹp Đất Cảng','0987654329','45 Lê Hồng Phong, Phường Đông Khê, Quận Ngô Quyền, Hải Phòng','standard','VNPAY','PAID','DELIVERED',599000,30000,50000,579000,NULL,'','2026-09-10 11:17:13.276','2026-09-10 20:22:35.246','TIKTOK'),('ORD-2026-0025','9b89e0d8-213d-407f-86af-a33c11d3b66a',NULL,'xuân anh','08435234554','hà nội','standard','COD','UNPAID','CANCELLED',349000,30000,0,379000,NULL,'[Tự động hủy] Đơn hàng quá hạn thanh toán 5 phút, kho đã giải phóng','2026-09-10 11:23:26.538','2026-09-10 20:22:35.249','INSTAGRAM'),('ORD-2026-0026','usr-customer-001',NULL,'xuân anh','08435234554','hà nội','standard','VNPAY','PAID','CONFIRMED',1098000,30000,0,1128000,NULL,'[VNPay 15677449 - Bank: NCB]','2026-09-10 20:08:13.569','2026-09-10 21:04:08.035','ORGANIC'),('ORD-2026-0027','9b89e0d8-213d-407f-86af-a33c11d3b66a',NULL,'xuân anh','08435234554','hà nội','standard','VNPAY','PAID','CONFIRMED',449000,30000,0,479000,NULL,'[VNPay 15677450 - Bank: NCB]','2026-09-10 20:15:13.304','2026-09-10 20:22:35.252','FACEBOOK'),('ORD-2026-0028',NULL,'guest_test-session-123','Trần Văn B','0911223344','456 Hai Bà Trưng','standard','COD','UNPAID','CANCELLED',598000,30000,0,628000,NULL,'','2026-09-11 04:55:36.401','2026-09-11 04:55:36.447','ORGANIC'),('ORD-2026-0029','9b89e0d8-213d-407f-86af-a33c11d3b66a',NULL,'xuân anh','08435234554','hà nội','express','VNPAY','PAID','CONFIRMED',1936000,50000,0,1986000,NULL,'[VNPay 15677682 - Bank: NCB]','2026-09-11 05:01:06.272','2026-09-11 05:01:33.459','FACEBOOK');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outfit_products`
--

DROP TABLE IF EXISTS `outfit_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outfit_products` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `outfit_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `outfit_products_outfit_id_product_id_key` (`outfit_id`,`product_id`),
  KEY `outfit_products_product_id_fkey` (`product_id`),
  CONSTRAINT `outfit_products_outfit_id_fkey` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `outfit_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outfit_products`
--

LOCK TABLES `outfit_products` WRITE;
/*!40000 ALTER TABLE `outfit_products` DISABLE KEYS */;
INSERT INTO `outfit_products` VALUES ('366e3210-fc5b-4b39-bdb2-cb084023867f','o001','p001'),('8e86bb91-6fcd-4562-970c-f70856d4a8d9','o001','p002'),('daf86418-0b60-426d-808a-9772bea43894','o002','p003'),('acc800d8-f4e9-4042-a090-2201ee40ee16','o002','p006'),('69f736ee-131c-4c75-8e4a-f55f983037f1','o002','p019'),('d9c234e7-c2d1-4f47-bfb4-c6febcdb984a','o002','p022'),('748ce741-5794-407d-b759-dd491ff4ffad','o003','p002'),('b54a0388-738d-4c66-8bbe-ceac1f9f34a4','o003','p017'),('970502fb-b9cb-4e0d-a516-f72c051f054d','o003','p020'),('b955073e-b7f5-4eaa-bfa1-7632b349e720','o003','p023'),('059f3160-7a2a-419f-a79d-c8ea80515513','o004','p009'),('dbd10578-afeb-4689-86b1-4d3938c746bf','o004','p016'),('b1aed4b6-1c19-43d5-a8cc-db7f85a29eb3','o004','p022'),('acba16d8-1d21-4f64-ab44-b42fcfabc4a6','o004','p027'),('93e8b65a-ce96-4ead-81be-b69a50d3057f','o005','p010'),('f6ef37de-9023-4d85-bae0-e5c0bf64e663','o005','p019'),('0436b251-62e4-459c-ae88-a06fc96a76bc','o005','p026'),('db593363-8fd9-4fdf-a4bc-4b8d31156745','o006','p008'),('0322c32b-e9ab-4ca8-8699-50f7b071ad5c','o006','p012'),('95679ee5-7141-428c-b3c1-171eef085504','o006','p021'),('8a496246-b0d2-46df-8457-61f3da6fae80','o007','p015'),('fc73b6c8-6c3b-4601-90dd-a8007334fd12','o007','p017'),('38875962-0d06-4f82-b23d-ebe58a8c563e','o007','p020'),('dba49671-cc34-4222-bc9b-ce7f65464be6','o008','p014'),('c12bbfd2-e65b-4640-9c89-6b0a7c123f1e','o008','p018'),('5a8d4716-2bae-4ff6-9b8b-f9866f97da31','o008','p020'),('12152b87-dbfd-44aa-99c4-d5193ed83ce9','o009','p010'),('ddef6aca-4e9e-4343-9a6c-feda228b27c1','o009','p013'),('0c1e5869-785f-4519-8f54-b2af7812559d','o009','p026');
/*!40000 ALTER TABLE `outfit_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outfits`
--

DROP TABLE IF EXISTS `outfits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outfits` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` json DEFAULT NULL,
  `occasion` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `style` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unisex',
  `season` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `outfits_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outfits`
--

LOCK TABLES `outfits` WRITE;
/*!40000 ALTER TABLE `outfits` DISABLE KEYS */;
INSERT INTO `outfits` VALUES ('o001','o001','Minimal Everyday Outfit 2026','Set đồ hàng ngày phong cách tối giản cập nhật mới nhất','/uploads/img-1788794488245-271288264.webp','[\"/uploads/img-1788794488245-271288264.webp\", \"/uploads/img-1788794493463-838985409.webp\", \"/uploads/img-1788794498958-786394519.webp\"]','everyday','minimal','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:21:41.000'),('o002','o002','Smart Casual','Set đồ vừa lịch sự vừa thoải mái, phù hợp đi làm hoặc gặp gỡ đối tác.','/uploads/img-1788794509055-167923952.webp','[\"/uploads/img-1788794509055-167923952.webp\", \"/uploads/img-1788794513632-800301931.webp\", \"/uploads/img-1788794524550-709000560.webp\"]','office','smart-casual','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:22:07.000'),('o003','o003','Weekend Street','Outfit cá tính cho ngày cuối tuần đi chơi cùng bạn bè.','/uploads/img-1788794534587-271098053.webp','[\"/uploads/img-1788794534587-271098053.webp\", \"/uploads/img-1788794538752-674821181.webp\", \"/uploads/img-1788794544811-647056615.webp\"]','weekend','streetstyle','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:22:27.000'),('o004','o004','Office Essential','Set đồ công sở thanh lịch, chỉn chu nhưng vẫn thoải mái cả ngày dài.','/uploads/img-1788794558645-955849527.webp','[\"/uploads/img-1788794558645-955849527.webp\", \"/uploads/img-1788794562549-275483262.webp\", \"/uploads/img-1788794567368-295152304.webp\"]','office','smart-casual','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:22:49.000'),('o005','o005','Denim on Denim','Phối denim hoài cổ, đơn giản nhưng vẫn nổi bật.','/uploads/img-1788794575595-102410566.webp','[\"/uploads/img-1788794575595-102410566.webp\", \"/uploads/img-1788794580131-305474296.webp\", \"/uploads/img-1788794584358-405726457.webp\"]','weekend','vintage','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:23:06.000'),('o006','o006','Date Night Soft','Set đồ nhẹ nhàng, nữ tính cho buổi hẹn hò buổi tối.','/uploads/img-1788794593364-72220115.webp','[\"/uploads/img-1788794593364-72220115.webp\", \"/uploads/img-1788794597180-540244222.webp\", \"/uploads/img-1788794602160-928889568.webp\"]','date','minimal','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:23:23.000'),('o007','o007','Travel Comfort','Thoải mái tối đa cho những chuyến đi dài, vẫn giữ được phong cách.','/uploads/img-1788794614292-916214532.webp','[\"/uploads/img-1788794614292-916214532.webp\", \"/uploads/img-1788794617265-963382238.webp\", \"/uploads/img-1788794621252-409243877.webp\"]','travel','sporty-chic','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:23:43.000'),('o008','o008','Party Statement','Outfit nổi bật, cá tính cho những buổi tiệc tối.','/uploads/img-1788794627591-345841381.webp','[\"/uploads/img-1788794627591-345841381.webp\", \"/uploads/img-1788794631360-249341018.webp\", \"/uploads/img-1788794636554-438465725.webp\"]','party','streetstyle','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:23:58.000'),('o009','o009','Basic Layers','Layer đơn giản với những món đồ basic dễ phối nhất.','/uploads/img-1788794643901-682456479.webp','[\"/uploads/img-1788794643901-682456479.webp\", \"/uploads/img-1788794647209-748503730.webp\", \"/uploads/img-1788794650671-546779109.webp\"]','everyday','basic','unisex','all-season',1,'2026-09-07 02:33:06.000','2026-09-07 15:24:12.000');
/*!40000 ALTER TABLE `outfits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` int NOT NULL,
  `original_price` int DEFAULT NULL,
  `gender` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unisex',
  `category_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `styles` json DEFAULT NULL,
  `badge` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` double DEFAULT '5',
  `review_count` int NOT NULL DEFAULT '0',
  `images` json DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `stock_quantity` int NOT NULL DEFAULT '100',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_trending` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_key` (`slug`),
  KEY `products_category_id_fkey` (`category_id`),
  CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('p001','essential-cotton-t-shirt','Essential Cotton T-Shirt','Áo thun cotton form regular, chất liệu mềm mại, thấm hút tốt, dễ phối cho mọi outfit hàng ngày.',299000,399000,'unisex','tops','tops','[\"basic\", \"minimal\"]','BEST SELLER',4.5,2,'[\"/uploads/img-1788788886115-139226453.webp\", \"/uploads/img-1788788890770-383894875.jpg\"]','[\"S\", \"M\", \"L\", \"XL\", \"XXL\", \"XS\"]','[\"Black\", \"White\"]',195,1,1,'2026-09-07 02:33:06.000','2026-09-11 09:46:41.090'),('p002','oversized-basic-tee','Oversized Basic Tee','Form oversized rộng rãi, vai rơi nhẹ, phù hợp phong cách streetstyle tối giản.',329000,329000,'unisex','tops','tops','[\"basic\", \"streetstyle\"]','NEW',4.5,76,'[\"/uploads/img-1788789435756-392598710.jpg\", \"/uploads/img-1788789439836-321913596.jpg\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\", \"White\"]',98,1,0,'2026-09-07 02:33:06.000','2026-09-11 05:01:33.425'),('p003','classic-white-shirt','Classic White Shirt','Áo sơ mi form slim fit, vải cotton pha, phù hợp đi làm lẫn dạo phố.',359000,699000,'men','tops','tops','[\"minimal\"]','BEST SELLER',5,3,'[\"/uploads/prod_p003_1_1788764847560.webp\", \"/uploads/prod_p003_2_1788764847565.webp\"]','[\"S\", \"M\", \"L\", \"XL\", \"XXL\"]','[\"Black\", \"White\", \"Navy\"]',96,1,1,'2026-09-07 02:33:06.000','2026-09-10 20:58:17.314'),('p004','linen-blend-shirt','Linen Blend Shirt','Áo sơ mi vải linen pha, thoáng mát, mang hơi hướng vintage nhẹ nhàng.',499000,499000,'men','tops','tops','[\"smart-casual\", \"vintage\"]',NULL,4.4,41,'[\"/uploads/img-1788789745799-962068753.jpg\", \"/uploads/img-1788789749677-678952506.jpg\", \"/uploads/img-1788789758654-125204621.webp\"]','[\"M\", \"L\", \"XL\", \"S\"]','[\"Beige\", \"Black\", \"Denim Blue\"]',4,0,0,'2026-09-07 02:33:06.000','2026-09-10 12:14:15.494'),('p005','straight-fit-jeans','Straight Fit Jeans','Quần jeans form straight fit basic, dễ phối, bền màu sau nhiều lần giặt.',549000,699000,'men','bottoms','bottoms','[\"basic\", \"streetstyle\"]','BEST SELLER',4.6,152,'[\"/uploads/img-1788789096784-121126637.webp\", \"/uploads/img-1788789100600-329729858.webp\"]','[\"29\", \"30\", \"31\", \"32\", \"33\", \"M\", \"L\", \"XL\"]','[\"Black\", \"Denim Blue\"]',92,1,1,'2026-09-07 02:33:06.000','2026-09-10 21:04:07.956'),('p006','tapered-trousers','Tapered Trousers','Quần âu ống côn nhẹ, phù hợp đi làm hoặc phối cùng áo sơ mi cho set đồ công sở.',879000,879000,'men','bottoms','bottoms','[\"smart-casual\", \"minimal\"]','NEW',4.5,63,'[\"/uploads/img-1788789509639-342621014.webp\", \"/uploads/img-1788789512837-782537079.webp\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\", \"khaki\", \"Beige\"]',8,1,0,'2026-09-07 02:33:06.000','2026-09-10 12:14:15.505'),('p007','wide-leg-midi-skirt','Wide Leg Midi Skirt','Chân váy midi ống rộng, tôn dáng, dễ mặc đi làm hoặc dạo phố.',429000,549000,'women','bottoms','bottoms','[\"minimal\", \"smart-casual\"]','SALE',4.6,58,'[\"/uploads/img-1788789197979-136891652.jpg\", \"/uploads/img-1788789202671-490759616.jpg\", \"/uploads/img-1788789206932-420321251.webp\"]','[\"S\", \"M\", \"L\", \"XS\", \"XL\"]','[\"Beige\", \"Olive\", \"Black\"]',0,1,0,'2026-09-07 02:33:06.000','2026-09-10 12:14:15.511'),('p008','slip-midi-dress','Slip Midi Dress','Váy hai dây form suông nhẹ nhàng, có thể mặc riêng hoặc phối layer cùng áo sơ mi.',599000,749000,'women','vay','vay','[\"minimal\", \"vintage\"]','BEST SELLER',4.7,87,'[\"/uploads/img-1788788917121-292761808.jpg\", \"/uploads/img-1788788921095-318472561.jpg\", \"/uploads/img-1788788924491-309843937.jpg\", \"/uploads/img-1788788927965-43032060.jpg\"]','[\"S\", \"M\", \"L\", \"XS\", \"XL\"]','[\"Brown\", \"Grey\", \"Cream\", \"Olive\"]',100,1,1,'2026-09-07 02:33:06.000','2026-09-07 13:49:05.000'),('p009','structured-blazer','Structured Blazer','Blazer form vai vuông nhẹ, hoàn thiện set đồ công sở tối giản.',1099000,1299000,'women','outerwear','outerwear','[\"smart-casual\", \"minimal\"]','NEW',4.8,44,'[\"/uploads/img-1788767099772-945379977.avif\", \"/uploads/img-1788767104503-521862429.png\", \"/uploads/img-1788767109140-85020230.jpg\", \"/uploads/img-1788767113177-516806969.jpg\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\", \"Beige\", \"Navy\", \"Grey\"]',100,1,1,'2026-09-07 02:33:06.000','2026-09-07 07:51:26.000'),('p010','oversized-denim-jacket','Oversized Denim Jacket','Áo khoác denim form oversized, phối được với hầu hết trang phục hàng ngày.',749000,849000,'unisex','outerwear','outerwear','[\"streetstyle\", \"vintage\"]','SALE',4.5,69,'[\"/uploads/img-1788789549278-699258825.jpg\", \"/uploads/img-1788789552761-709873296.jpg\", \"/uploads/img-1788789556701-410132817.jpg\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"blue\", \"Grey\", \"Denim Blue\", \"Beige\"]',100,1,1,'2026-09-07 02:33:06.000','2026-09-07 13:59:57.000'),('p011','lightweight-windbreaker','Lightweight Windbreaker','Áo khoác dù nhẹ, chống gió nhẹ, phù hợp mặc khi di chuyển hoặc tập luyện ngoài trời.',649000,799000,'unisex','outerwear','outerwear','[\"sporty-chic\", \"streetstyle\"]','SALE',4.4,37,'[\"/uploads/img-1788789782177-418893206.jpg\", \"/uploads/img-1788789786856-564475639.jpg\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\", \"green\", \"White\"]',100,0,0,'2026-09-07 02:33:06.000','2026-09-07 14:03:28.000'),('p012','knit-cardigan','Knit Cardigan','Áo len khoác dệt kim mềm mại, giữ ấm nhẹ cho những ngày chuyển mùa.',759000,999000,'women','outerwear','outerwear','[\"minimal\", \"vintage\"]',NULL,4.6,52,'[\"/uploads/img-1788789252248-511299441.jpg\", \"/uploads/img-1788789256330-57759274.jpg\", \"/uploads/img-1788789260321-361900665.jpg\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Brown\", \"Grey\", \"Black\"]',100,1,0,'2026-09-07 02:33:06.000','2026-09-07 13:54:43.000'),('p013','ribbed-tank-top','Ribbed Tank Top','Áo hai dây gân co giãn tốt, dễ mặc riêng hoặc layer bên trong.',199000,199000,'women','tops','tops','[\"basic\", \"minimal\"]','BEST SELLER',4.3,29,'[\"/uploads/img-1788789965193-549740602.avif\", \"/uploads/img-1788789968592-579535786.jpg\", \"/uploads/img-1788789972598-145203638.avif\"]','[\"S\", \"M\", \"L\"]','[\"Black\", \"White\", \"Beige\"]',100,1,0,'2026-09-07 02:33:06.000','2026-09-07 14:06:23.000'),('p014','cropped-hoodie','Cropped Hoodie','Hoodie form crop năng động, chất nỉ bông mềm, giữ ấm tốt.',699000,899000,'women','tops','tops','[\"sporty-chic\", \"streetstyle\"]','SALE',4.5,61,'[\"/uploads/img-1788789623591-735686824.webp\", \"/uploads/img-1788789627222-292952969.webp\", \"/uploads/img-1788789630421-851390265.jpg\"]','[\"S\", \"M\", \"L\", \"XL\", \"XS\"]','[\"Black\", \"White\", \"Brown\"]',100,1,1,'2026-09-07 02:33:06.000','2026-09-07 14:00:52.000'),('p015','basic-hoodie','Basic Hoodie','Hoodie basic form regular, chất liệu dày dặn, giữ ấm tốt cho mùa se lạnh.',449000,699000,'unisex','tops','tops','[\"basic\", \"streetstyle\"]','BEST SELLER',4.7,103,'[\"/uploads/img-1788788958479-491742161.jpg\", \"/uploads/img-1788788961701-600777499.webp\", \"/uploads/img-1788788964853-395460308.webp\"]','[\"S\", \"M\", \"L\", \"XL\", \"XS\", \"XXL\"]','[\"Black\", \"Brown\", \"Cream\"]',98,1,1,'2026-09-07 02:33:06.000','2026-09-10 20:15:35.811'),('p016','pleated-trousers','Pleated Trousers','Quần âu xếp ly nhẹ nhàng, tôn dáng, phù hợp môi trường công sở.',459000,399000,'women','bottoms','bottoms','[\"smart-casual\", \"minimal\"]',NULL,4.4,33,'[\"/uploads/img-1788789821524-671959918.avif\", \"/uploads/img-1788789825143-702651567.jpg\", \"/uploads/img-1788789828734-905302879.avif\"]','[\"S\", \"M\", \"L\"]','[\"Black\", \"Navy\", \"Brown\"]',100,0,0,'2026-09-07 02:33:06.000','2026-09-07 14:04:01.000'),('p017','cargo-pants','Cargo Pants','Quần cargo nhiều túi tiện dụng, form relax fit thoải mái vận động.',529000,649000,'unisex','bottoms','bottoms','[\"streetstyle\", \"sporty-chic\"]','SALE',4.5,78,'[\"/uploads/img-1788789669749-422416448.jpg\", \"/uploads/img-1788789673509-265161391.jpg\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\", \"khaki\", \"Beige\"]',98,0,0,'2026-09-07 02:33:06.000','2026-09-11 05:01:33.438'),('p018','mini-denim-skirt','Mini Denim Skirt','Chân váy denim ngắn form A-line, phong cách trẻ trung, cá tính.',349000,899000,'women','vay','vay','[\"streetstyle\", \"vintage\"]','LIMITED',4.2,25,'[\"/uploads/img-1788790011778-218786902.jpg\", \"/uploads/img-1788790015678-662629331.jpg\"]','[\"S\", \"M\", \"L\"]','[\"blue\", \"Navy\", \"Black\"]',100,1,1,'2026-09-07 02:33:06.000','2026-09-07 14:07:09.000'),('p019','canvas-sneakers','Canvas Sneakers','Giày sneaker canvas tối giản, dễ phối với hầu hết trang phục hàng ngày.',649000,649000,'unisex','phu-kien','phu-kien','[\"basic\", \"minimal\"]','BEST SELLER',4.6,112,'[\"/uploads/img-1788789297086-921796527.webp\", \"/uploads/img-1788789300606-986812508.jpg\", \"/uploads/img-1788789304015-106891638.jpg\"]','[\"39\"]','[\"White\", \"Black\", \"Beige\"]',0,1,0,'2026-09-07 02:33:06.000','2026-09-10 21:18:09.474'),('p020','chunky-sneakers','Chunky Sneakers','Giày sneaker đế dày phong cách thể thao, tăng chiều cao nhẹ.',899000,1099000,'unisex','phu-kien','phu-kien','[\"sporty-chic\", \"streetstyle\"]','SALE',4.5,66,'[\"/uploads/img-1788789693643-744774052.jpg\", \"/uploads/img-1788789698123-466651504.jpg\"]','[\"38\", \"39\", \"40\", \"41\", \"42\", \"43\"]','[\"White\", \"Black\"]',98,1,0,'2026-09-07 02:33:06.000','2026-09-11 05:01:33.449'),('p021','canvas-tote-bag','Canvas Tote Bag','Túi tote vải canvas bền chắc, sức chứa rộng rãi cho việc đi học, đi làm.',249000,249000,'unisex','phu-kien','phu-kien','[\"minimal\", \"basic\"]','LIMITED',4.4,40,'[\"/uploads/img-1788789865949-926211801.avif\", \"/uploads/img-1788789875038-438918052.webp\", \"/uploads/img-1788789878476-752425953.jpg\"]','[\"one size\", \"S\", \"L\"]','[\"Beige\", \"Black\", \"Olive\"]',100,1,0,'2026-09-07 02:33:06.000','2026-09-07 14:05:07.000'),('p022','leather-belt','Leather Belt','Thắt lưng da thật khóa kim loại tối giản, hoàn thiện set đồ công sở.',299000,499000,'men','phu-kien','phu-kien','[\"smart-casual\", \"minimal\"]',NULL,4.6,22,'[\"/uploads/img-1788789344907-557287861.jpg\", \"/uploads/img-1788789353620-512109767.jpg\"]','[\"one size\"]','[\"Black\", \"Brown\"]',98,1,1,'2026-09-07 02:33:06.000','2026-09-10 09:44:27.918'),('p023','bucket-hat','Bucket Hat','Mũ bucket form basic, phụ kiện điểm nhấn cho outfit streetstyle.',179000,229000,'unisex','phu-kien','phu-kien','[\"streetstyle\", \"sporty-chic\"]','BEST SELLER',4.3,31,'[\"/uploads/img-1788790043902-928274212.jpg\", \"/uploads/img-1788790046772-932424625.jpg\", \"/uploads/img-1788790050560-518360797.jpg\"]','[\"one size\", \"39\", \"40\", \"41\", \"42\"]','[\"Black\", \"Olive\", \"Brown\"]',98,0,0,'2026-09-07 02:33:06.000','2026-09-11 05:01:33.453'),('p024','wool-blend-coat','Wool Blend Coat','Áo khoác dạ pha len, form dáng thanh lịch, giữ ấm tốt cho mùa đông.',1399000,1799000,'unisex','outerwear','outerwear','[\"minimal\", \"smart-casual\"]','BEST SELLER',4.8,48,'[\"/uploads/img-1788788771961-835441756.jpg\", \"/uploads/img-1788788776688-972906877.avif\", \"/uploads/img-1788788781026-870633119.jpg\", \"/uploads/img-1788788787049-872026083.jpg\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"camel\", \"Black\", \"Brown\", \"Olive\", \"Grey\"]',100,1,1,'2026-09-07 02:33:06.000','2026-09-07 13:47:00.000'),('p025','relaxed-fit-polo','Relaxed Fit Polo','Áo polo form relaxed, chất liệu piqué thoáng mát, dễ phối đi làm hoặc đi chơi.',359000,359000,'men','tops','tops','[\"smart-casual\", \"basic\"]','NEW',4.5,57,'[\"/uploads/img-1788789720272-397873601.jpg\", \"/uploads/img-1788789724695-218007463.webp\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"White\", \"Black\"]',100,1,0,'2026-09-07 02:33:06.000','2026-09-07 14:02:13.000'),('p026','high-waist-jeans','High Waist Jeans','Quần jeans lưng cao tôn dáng, chất liệu co giãn nhẹ, dễ mặc cả ngày.',599000,799000,'women','bottoms','bottoms','[\"basic\", \"vintage\"]','SALE',4.6,84,'[\"/uploads/img-1788789388728-43325308.jpg\", \"/uploads/img-1788789392144-757107411.jpg\"]','[\"S\", \"M\", \"L\", \"XL\", \"XS\"]','[\"blue\", \"Grey\", \"Denim Blue\"]',100,0,0,'2026-09-07 02:33:06.000','2026-09-07 13:56:58.000'),('p027','silk-blend-blouse','Silk Blend Blouse','Áo blouse pha lụa mềm mại, rủ đẹp, phù hợp môi trường công sở.',349000,549000,'women','tops','tops','[\"smart-casual\", \"minimal\"]','NEW',4.7,39,'[\"/uploads/img-1788789037523-58527940.avif\", \"/uploads/img-1788789041214-199752730.avif\", \"/uploads/img-1788789044625-801079147.jpg\"]','[\"S\", \"M\", \"L\", \"XS\"]','[\"Cream\", \"Beige\", \"White\"]',100,1,1,'2026-09-07 02:33:06.000','2026-09-07 13:51:19.000'),('p028','track-jacket','Track Jacket','Áo khoác track jacket phong cách thể thao, chất liệu nhẹ, thoáng khí.',599000,599000,'unisex','outerwear','outerwear','[\"sporty-chic\", \"streetstyle\"]','LIMITED',4.4,45,'[\"/uploads/img-1788789928154-820919560.jpg\", \"/uploads/img-1788789932225-455919790.webp\", \"/uploads/img-1788789935936-564153101.webp\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\", \"Grey\", \"Olive\"]',100,0,0,'2026-09-07 02:33:06.000','2026-09-07 14:05:48.000');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `images` json DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_fkey` (`user_id`),
  KEY `reviews_product_id_fkey` (`product_id`),
  CONSTRAINT `reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES ('af55a816-f489-4b93-942b-ba756579d1f7','usr-customer-001','p003',5,'Sản phẩm rất đẹp và chất lượng tốt','[]','2026-09-10 10:53:26.541'),('d7035e9e-a6a2-48aa-8754-15f72910d802','usr-customer-001','p003',5,'ngon luôn','[]','2026-09-10 10:59:37.942'),('e6d6d129-09a0-4b2a-87ec-8fba97121afd','usr-customer-001','p003',5,'đẹp ấy chứ','[]','2026-09-10 10:59:24.945'),('rev_001','usr-customer-001','p001',5,'Chất vải cotton rất mềm mát, form regular fit chuẩn Routine mặc đi làm hay đi chơi đều đẹp!',NULL,'2026-09-01 17:30:00.000'),('rev_002','usr-customer-001','p001',4,'Áo đẹp, đóng gói cẩn thận, giao hàng nhanh. Mình 1m7 nặng 65kg mặc size L vừa vặn.',NULL,'2026-08-25 21:15:00.000'),('rev_003','usr-customer-001','p005',5,'Quần jeans đứng form, chất denim dày dặn vừa phải, co giãn nhẹ rất thoải mái.',NULL,'2026-08-20 16:00:00.000');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_reservations`
--

DROP TABLE IF EXISTS `stock_reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_reservations` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `items` json NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `stock_reservations_order_id_key` (`order_id`),
  KEY `stock_reservations_expires_at_idx` (`expires_at`),
  CONSTRAINT `stock_reservations_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_reservations`
--

LOCK TABLES `stock_reservations` WRITE;
/*!40000 ALTER TABLE `stock_reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_settings` (
  `setting_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
INSERT INTO `store_settings` VALUES ('home_hero_banners','{\"banners\":[{\"id\":\"img-mtsgrszk906\",\"url\":\"/uploads/img-1788859521860-824997563.png\",\"isPrimary\":true},{\"id\":\"img-mtsgrt3a933\",\"url\":\"/uploads/img-1788859521929-503038512.png\",\"isPrimary\":false},{\"id\":\"img-mtsgrt7g727\",\"url\":\"/uploads/img-1788859522062-384638452.png\",\"isPrimary\":false},{\"id\":\"img-mtsgrt9r652\",\"url\":\"/uploads/img-1788859522209-355500904.png\",\"isPrimary\":false}],\"slideInterval\":3000,\"title\":\"STYLE THAT FITS YOU\",\"subtitle\":\"Khám phá phong cách hợp với bạn: Thời trang tinh tế, định hình dấu ấn khác biệt của riêng bạn.\",\"exploreLink\":\"/category/new-arrivals\",\"outfitLink\":\"/smart-outfit\"}','Cấu hình Hero Banner toàn màn hình & Slide Trang chủ','2026-09-08 16:27:18.000');
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `styles`
--

DROP TABLE IF EXISTS `styles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `styles` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `styles_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `styles`
--

LOCK TABLES `styles` WRITE;
/*!40000 ALTER TABLE `styles` DISABLE KEYS */;
INSERT INTO `styles` VALUES ('basic','basic','Basic','Những món đồ nền tảng, dễ phối với mọi thứ khác.','/uploads/img-1789067804211-917767804.jpg','ACTIVE','2026-09-07 02:33:06.000','2026-09-11 02:16:45.000'),('minimal','minimal','Minimal','Phong cach toi gian, thanh lich, cap nhat tu Admin.','/uploads/img-1788801729030-465640924.webp','ACTIVE','2026-09-07 02:33:06.000','2026-09-08 00:22:09.000'),('smart-casual','smart-casual','Smart Casual','Lịch sự vừa đủ, vẫn thoải mái để di chuyển cả ngày.','/uploads/img-1788801738528-178510945.webp','ACTIVE','2026-09-07 02:33:06.000','2026-09-08 00:22:21.000'),('sporty-chic','sporty-chic','Sporty Chic','Năng động nhưng vẫn tinh tế, dễ mặc đi tập lẫn đi chơi.','/uploads/img-1788801751799-73294316.webp','ACTIVE','2026-09-07 02:33:06.000','2026-09-08 00:22:32.000'),('streetstyle','streetstyle','Streetstyle','Cá tính, phóng khoáng, cảm hứng từ đường phố.','/uploads/img-1788801764174-286617334.jpg','ACTIVE','2026-09-07 02:33:06.000','2026-09-08 00:22:45.000'),('vintage','vintage','Vintage','Hoài cổ, form dáng rộng rãi và chất liệu mộc mạc.','/uploads/img-1788801776674-747686135.webp','ACTIVE','2026-09-07 02:33:06.000','2026-09-08 00:22:57.000');
/*!40000 ALTER TABLE `styles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traffic_logs`
--

DROP TABLE IF EXISTS `traffic_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traffic_logs` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `campaign` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_session_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VIEW',
  `metadata` json DEFAULT NULL,
  `ip_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `traffic_logs_platform_idx` (`platform`),
  KEY `traffic_logs_guest_session_id_idx` (`guest_session_id`),
  KEY `traffic_logs_user_id_idx` (`user_id`),
  KEY `traffic_logs_product_id_idx` (`product_id`),
  KEY `traffic_logs_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traffic_logs`
--

LOCK TABLES `traffic_logs` WRITE;
/*!40000 ALTER TABLE `traffic_logs` DISABLE KEYS */;
INSERT INTO `traffic_logs` VALUES ('tl-mtvcxten-e9xjz','TIKTOK','tiktok_viral_look_01','p001','guest_test_tiktok_123',NULL,'VIEW','{\"referrer\": \"https://tiktok.com/@routine\"}','::1','2026-09-10 10:01:22.465'),('tl-mtvcxtf1-mwfek','FACEBOOK','fb_summer_sale','p002','guest_test_fb_456',NULL,'VIEW','{\"referrer\": \"https://facebook.com/ads\"}','::1','2026-09-10 10:01:22.478'),('tl-mtvcxtf9-udjrp','INSTAGRAM','ig_reels_outfit','p003','guest_test_ig_789',NULL,'VIEW','{\"referrer\": \"https://instagram.com/routine_vietnam\"}','::1','2026-09-10 10:01:22.487'),('tl-mtvd1svd-h1r1y','TIKTOK','tiktok_viral_look_01','p001','guest_test_tiktok_123',NULL,'VIEW','{\"referrer\": \"https://tiktok.com/@routine\"}','::1','2026-09-10 10:04:28.408'),('tl-mtvd1sw6-jqavb','FACEBOOK','fb_summer_sale','p002','guest_test_fb_456',NULL,'VIEW','{\"referrer\": \"https://facebook.com/ads\"}','::1','2026-09-10 10:04:28.423'),('tl-mtvd1swb-0jucz','INSTAGRAM','ig_reels_outfit','p003','guest_test_ig_789',NULL,'VIEW','{\"referrer\": \"https://instagram.com/routine_vietnam\"}','::1','2026-09-10 10:04:28.428'),('tl-mtvd7lxu-3bv4x','TIKTOK','tiktok_viral_look_01','p001','guest_test_tiktok_123',NULL,'VIEW','{\"referrer\": \"https://tiktok.com/@routine\"}','::1','2026-09-10 10:08:59.358'),('tl-mtvd7lyx-l5cvy','FACEBOOK','fb_summer_sale','p002','guest_test_fb_456',NULL,'VIEW','{\"referrer\": \"https://facebook.com/ads\"}','::1','2026-09-10 10:08:59.387'),('tl-mtvd7lzt-d69qt','INSTAGRAM','ig_reels_outfit','p003','guest_test_ig_789',NULL,'VIEW','{\"referrer\": \"https://instagram.com/routine_vietnam\"}','::1','2026-09-10 10:08:59.418'),('tl-mtvdhpil-23cxw','FACEBOOK','facebook_promo','p024','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p024?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 10:16:50.543'),('tl-mtvdhpin-yjnk7','FACEBOOK','facebook_promo','p024','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p024?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 10:16:50.544'),('tl-mtveei56-vug6g','FACEBOOK','facebook_promo','p009','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p009\", \"referrer\": \"\"}','::1','2026-09-10 10:42:20.635'),('tl-mtveei58-9cwl1','FACEBOOK','facebook_promo','p009','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p009\", \"referrer\": \"\"}','::1','2026-09-10 10:42:20.637'),('tl-mtvepiz1-f2j9m','FACEBOOK','facebook_promo','p009','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p009\", \"referrer\": \"\"}','::1','2026-09-10 10:50:54.927'),('tl-mtvepiz3-xl7fc','FACEBOOK','facebook_promo','p009','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p009\", \"referrer\": \"\"}','::1','2026-09-10 10:50:54.928'),('tl-mtveq4g0-615qy','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:51:22.753'),('tl-mtveq4g1-5a92v','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:51:22.754'),('tl-mtveqoog-4eux7','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:51:48.977'),('tl-mtveqoot-r88rn','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:51:48.990'),('tl-mtvf0be4-9178s','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:59:18.318'),('tl-mtvf0be9-43u12','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:59:18.326'),('tl-mtvf0ser-rxb67','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:59:40.373'),('tl-mtvf0seu-ruv4c','OTHER',NULL,'p003','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003\", \"referrer\": \"\"}','::1','2026-09-10 10:59:40.375'),('tl-mtvfv4n0-p6l06','OTHER',NULL,'p027','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p027\", \"referrer\": \"http://localhost:3000/orders\"}','::1','2026-09-10 11:23:15.901'),('tl-mtvfv4n3-vzg6o','OTHER',NULL,'p027','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p027\", \"referrer\": \"http://localhost:3000/orders\"}','::1','2026-09-10 11:23:15.904'),('tl-mtvwu5il-uutrm','OTHER',NULL,'p005','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p005\", \"referrer\": \"http://localhost:3000/register/style\"}','::1','2026-09-10 19:18:23.854'),('tl-mtvwu5ip-zyarf','OTHER',NULL,'p005','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p005\", \"referrer\": \"http://localhost:3000/register/style\"}','::1','2026-09-10 19:18:23.858'),('tl-mtvxq0cn-14a8f','OTHER',NULL,'p005','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p005\", \"referrer\": \"http://localhost:3000/wishlist\"}','::1','2026-09-10 19:43:10.152'),('tl-mtvxq0co-o3ijk','OTHER',NULL,'p005','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p005\", \"referrer\": \"http://localhost:3000/wishlist\"}','::1','2026-09-10 19:43:10.153'),('tl-mtvxq4ux-bdztw','OTHER',NULL,'p005','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p005\", \"referrer\": \"http://localhost:3000/wishlist\"}','::1','2026-09-10 19:43:15.994'),('tl-mtvxq4v2-i0lmd','OTHER',NULL,'p005','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p005\", \"referrer\": \"http://localhost:3000/wishlist\"}','::1','2026-09-10 19:43:16.000'),('tl-mtvxrqyd-byx6s','INSTAGRAM','instagram_promo','p003','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003?source=instagram&utm_source=instagram&utm_medium=social&utm_campaign=instagram_promo\", \"referrer\": \"\"}','::1','2026-09-10 19:44:31.287'),('tl-mtvxrqyi-jgrez','INSTAGRAM','instagram_promo','p003','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003?source=instagram&utm_source=instagram&utm_medium=social&utm_campaign=instagram_promo\", \"referrer\": \"\"}','::1','2026-09-10 19:44:31.292'),('tl-mtvxt7rs-huciv','INSTAGRAM','instagram_promo','p004','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p004\", \"referrer\": \"http://localhost:3000/admin\"}','::1','2026-09-10 19:45:39.737'),('tl-mtvxt7rz-4vhd9','INSTAGRAM','instagram_promo','p004','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p004\", \"referrer\": \"http://localhost:3000/admin\"}','::1','2026-09-10 19:45:39.744'),('tl-mtvys2uq-3ath2','FACEBOOK','facebook_promo','p015','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:12:46.323'),('tl-mtvys2v2-r2lwf','FACEBOOK','facebook_promo','p015','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:12:46.335'),('tl-mtvysdv6-ms15c','FACEBOOK','facebook_promo','p015','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:13:00.595'),('tl-mtvysdvj-ujbz2','FACEBOOK','facebook_promo','p015','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:13:00.608'),('tl-mtvysjjv-y7hbl','FACEBOOK','facebook_promo','p015','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:13:07.964'),('tl-mtvysjk2-yqt2w','FACEBOOK','facebook_promo','p015','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:13:07.972'),('tl-mtvyuqny-mbsl7','FACEBOOK','facebook_promo','p015','g_ldtc1afbh1_mts7jl43',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:14:50.496'),('tl-mtvyuqo5-wgvye','FACEBOOK','facebook_promo','p015','g_ldtc1afbh1_mts7jl43',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:14:50.502'),('tl-mtvyuy58-n1v7t','FACEBOOK','facebook_promo','p015','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:15:00.189'),('tl-mtvyuy5f-w8fsr','FACEBOOK','facebook_promo','p015','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p015?source=facebook&utm_source=facebook&utm_medium=social&utm_campaign=facebook_promo\", \"referrer\": \"\"}','::1','2026-09-10 20:15:00.196'),('tl-mtw0m4n0-q3xtp','INSTAGRAM','instagram_promo','p003','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003?source=instagram&utm_source=instagram&utm_medium=social&utm_campaign=instagram_promo\", \"referrer\": \"http://localhost:3000/product/p003?source=instagram&utm_source=instagram&utm_medium=social&utm_campaign=instagram_promo\"}','::1','2026-09-10 21:04:07.933'),('tl-mtw0m4nv-rean2','INSTAGRAM','instagram_promo','p003','g_c8ycbwevwu_mtse5qro',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p003?source=instagram&utm_source=instagram&utm_medium=social&utm_campaign=instagram_promo\", \"referrer\": \"http://localhost:3000/product/p003?source=instagram&utm_source=instagram&utm_medium=social&utm_campaign=instagram_promo\"}','::1','2026-09-10 21:04:07.964'),('tl-mtwhkmu5-bvttu','FACEBOOK','facebook_promo','p027','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p027\", \"referrer\": \"\"}','::1','2026-09-11 04:58:51.678'),('tl-mtwhkmu9-o8i7e','FACEBOOK','facebook_promo','p027','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p027\", \"referrer\": \"\"}','::1','2026-09-11 04:58:51.682'),('tl-mtwilarm-q47qc','FACEBOOK','facebook_promo','p025','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p025\", \"referrer\": \"http://localhost:3000/smart-outfit/ai-stylist\"}','::1','2026-09-11 05:27:22.307'),('tl-mtwilarq-1iund','FACEBOOK','facebook_promo','p025','g_t1pcfrhrvt_mtse5r04',NULL,'VIEW','{\"url\": \"http://localhost:3000/product/p025\", \"referrer\": \"http://localhost:3000/smart-outfit/ai-stylist\"}','::1','2026-09-11 05:27:22.311'),('tl-mtwrus41-ew3ln','TIKTOK','tiktok_viral_look_01','p001','guest_test_tiktok_123',NULL,'VIEW','{\"referrer\": \"https://tiktok.com/@routine\"}','::1','2026-09-11 09:46:41.234'),('tl-mtwrus4v-v6y4s','FACEBOOK','fb_summer_sale','p002','guest_test_fb_456',NULL,'VIEW','{\"referrer\": \"https://facebook.com/ads\"}','::1','2026-09-11 09:46:41.264'),('tl-mtwrus53-xf27f','INSTAGRAM','ig_reels_outfit','p003','guest_test_ig_789',NULL,'VIEW','{\"referrer\": \"https://instagram.com/routine_vietnam\"}','::1','2026-09-11 09:46:41.272');
/*!40000 ALTER TABLE `traffic_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('CUSTOMER','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `style_preference` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'minimal',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `source` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ORGANIC',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_number_key` (`phone_number`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('58030bd7-e50d-4f0f-a6ef-a4a134a2d1cb','hehehe','0192384753','hehehe@gmail.com','$2b$10$6l3FqqLmlRVhcjJksrOsUu6y3E23MS8CyvS7trRSh0RmB5Rie.2qa','CUSTOMER',NULL,'streetstyle','2026-09-08 09:57:36.400','2026-09-08 09:57:36.400','ORGANIC'),('9b89e0d8-213d-407f-86af-a33c11d3b66a','Người Đẹp Đất Cảng','0987654329','nguoidepdatcang05@gmail.com','$2b$10$zr2I2l4WtOowOhC03xOYDeFnbn3zpxpnJzIN53zagW5YI1EMWhTym','CUSTOMER',NULL,'minimal','2026-09-10 11:09:20.560','2026-09-10 20:22:35.198','TIKTOK'),('afc11fb3-6730-4ee6-9d44-d7228fa3ca8f','Test Flow User','0995004379','test_flow_1789038235502@gmail.com','$2b$10$ABBS6pLB5rF7c5YFL4tiO.eIGfJr3D3DHD4hkhKmhoLQkSpAjUoF6','CUSTOMER',NULL,'minimal','2026-09-10 11:03:55.675','2026-09-10 11:03:55.675','ORGANIC'),('usr-admin-001','Admin Quản Trị Routine','0999999999','admin@routine.vn','$2b$10$Y0VkouJ1ppenbNnD/4EP6.YzhwIKDhlrthJra0nc2Inq/QaqlEqJm','ADMIN','/images/avatars/admin.jpg','minimal','2026-08-01 00:00:00.000','2026-09-07 02:33:06.000','ORGANIC'),('usr-customer-001','Nguyễn Văn A','0123456789','nguyenvana@gmail.com','$2b$10$UdE7N7Sv.8WrAk0L1C1cH.mi2L7gwWp4hsJ62qJs8QAejoJczYguu','CUSTOMER','/images/avatars/user-01.jpg','minimal','2026-08-15 08:30:00.000','2026-09-08 05:34:12.000','ORGANIC'),('usr-customer-002','Trần Thị Bích Ngọc','0987654321','bichngoc.tran@gmail.com','$2b$10$FXAqPkqCCPJ.n6pdZIX5fu4V1MKQUFCePmUICIZxAomnkzn0/3n.C','CUSTOMER','/images/avatars/user-02.jpg','smart-casual','2026-08-20 10:15:00.000','2026-09-11 04:55:36.361','TIKTOK'),('usr-customer-003','Lê Hoàng Long','0912345678','hoanglong.le@gmail.com','$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K','CUSTOMER','/images/avatars/user-03.jpg','streetstyle','2026-08-25 14:20:00.000','2026-09-10 20:22:35.188','FACEBOOK'),('usr-customer-004','Phạm Minh Trang','0933456789','minhtrang.pham@gmail.com','$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K','CUSTOMER','/images/avatars/user-04.jpg','vintage','2026-09-01 09:45:00.000','2026-09-10 20:22:35.191','INSTAGRAM'),('usr-customer-005','Vũ Đức Thắng','0944567890','thang.vu@gmail.com','$2b$10$QLNj1ReazUsEZjQmKjVe6e6yGsJZLD348hqzX65tY8TVIdMksWW9K','CUSTOMER','/images/avatars/user-05.jpg','sporty-chic','2026-09-03 16:10:00.000','2026-09-10 20:22:35.195','TIKTOK');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `wishlist_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlist_items_wishlist_id_product_id_key` (`wishlist_id`,`product_id`),
  KEY `wishlist_items_product_id_fkey` (`product_id`),
  CONSTRAINT `wishlist_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wishlist_items_wishlist_id_fkey` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
INSERT INTO `wishlist_items` VALUES ('0bfa6452-c05f-4d51-a9a4-fdd7790c44b7','dd77ceb0-31d1-48bd-964a-9438ffe796ae','p005','2026-09-08 08:12:15.000'),('1a271923-dcc3-4a15-b97f-2e42cf3fa576','dd77ceb0-31d1-48bd-964a-9438ffe796ae','p002','2026-09-08 08:12:15.000'),('3adb76e0-f28d-44a6-a732-dcdd4a886bf8','dd77ceb0-31d1-48bd-964a-9438ffe796ae','p022','2026-09-08 08:12:15.000'),('5d7c4379-4b14-4ed9-9690-abd3440662e8','dd77ceb0-31d1-48bd-964a-9438ffe796ae','p009','2026-09-08 08:12:15.000'),('74778477-c512-4283-8279-c1d46bdfb5c3','dbb56697-87a5-460b-8012-9e0ac0ddf55e','p022','2026-09-10 11:20:44.116'),('c23ad2e2-96fc-42ab-b6ca-d492b1440062','dbb56697-87a5-460b-8012-9e0ac0ddf55e','p002','2026-09-10 11:20:44.095'),('d6d9a0ac-1c51-444b-a9de-c432939ac414','dbb56697-87a5-460b-8012-9e0ac0ddf55e','p009','2026-09-10 11:20:44.110');
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_session_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlists_user_id_key` (`user_id`),
  UNIQUE KEY `wishlists_guest_session_id_key` (`guest_session_id`),
  CONSTRAINT `wishlists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES ('0c266321-5ba6-4251-b039-f5866dfcae20',NULL,'g_c8ycbwevwu_mtse5qro','2026-09-08 09:15:48.566','2026-09-08 09:15:48.566'),('6520ca99-b260-408e-9b50-7d8826b87e50','58030bd7-e50d-4f0f-a6ef-a4a134a2d1cb',NULL,'2026-09-10 19:22:24.077','2026-09-10 19:22:24.077'),('69bdd9bc-9d12-4c34-8572-0fb838436be3',NULL,'g_ldtc1afbh1_mts7jl43','2026-09-10 18:52:50.855','2026-09-10 18:52:50.855'),('69bfb23d-8eca-4e38-ba91-fc8d78e22de3','usr-admin-001',NULL,'2026-09-08 08:12:14.000','2026-09-08 08:12:14.000'),('750b1459-85b8-4b53-8885-64f385ebbcee',NULL,'::1','2026-09-10 19:24:15.165','2026-09-10 19:24:15.165'),('dbb56697-87a5-460b-8012-9e0ac0ddf55e','9b89e0d8-213d-407f-86af-a33c11d3b66a',NULL,'2026-09-10 11:20:44.091','2026-09-10 11:20:44.091'),('dd77ceb0-31d1-48bd-964a-9438ffe796ae','usr-customer-001',NULL,'2026-09-08 05:05:01.000','2026-09-08 05:05:01.000'),('e7d7dae6-e449-4e42-87a9-4d67f1e38255',NULL,'g_mwpy579u98_mtsxtq6q','2026-09-08 17:22:45.128','2026-09-08 17:22:45.128');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'routine_db'
--

--
-- Dumping routines for database 'routine_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-11 16:51:14
