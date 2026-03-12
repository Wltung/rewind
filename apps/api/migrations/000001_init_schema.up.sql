-- Bảng 1: Cấu hình chung và Auth
CREATE TABLE IF NOT EXISTS site_configs (
    `key` VARCHAR(50) NOT NULL,
    `value` TEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng 2: Kho lưu trữ ảnh kỷ yếu và Polaroid
CREATE TABLE IF NOT EXISTS memories (
    `id` BIGINT AUTO_INCREMENT,
    `image_url` VARCHAR(500) NOT NULL COMMENT 'Đường dẫn file ảnh',
    `caption` TEXT COMMENT 'Câu chuyện, lời tựa cho bức ảnh',
    `memory_date` DATE COMMENT 'Ngày diễn ra kỷ niệm',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;