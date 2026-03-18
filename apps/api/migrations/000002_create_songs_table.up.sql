CREATE TABLE songs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Tên bài hát',
    audio_url VARCHAR(500) NOT NULL COMMENT 'Đường dẫn tới file mp3',
    duration_label VARCHAR(50) COMMENT 'Nhãn độ dài, vd: 90 MIN',
    order_index INT DEFAULT 0 COMMENT 'Thứ tự phát trong playlist',
    lyrics JSON COMMENT 'Mảng JSON chứa thời gian và lời bài hát',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);