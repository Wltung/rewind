CREATE TABLE polaroids (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL COMMENT 'Đường dẫn file ảnh',
    caption TEXT COMMENT 'Dòng chữ ghi chú mặt trước',
    secret_message TEXT COMMENT 'Lời nhắn bí mật mặt sau',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);