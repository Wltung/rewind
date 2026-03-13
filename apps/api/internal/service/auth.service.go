package service

import (
	"errors"

	"rewind/api/internal/auth"
	"rewind/api/internal/repository"
)

type AuthService interface {
	Login(password string) (string, error)
}

type authService struct {
	repo repository.AuthRepo
}

func NewAuthService(repo repository.AuthRepo) AuthService {
	return &authService{repo}
}

func (s *authService) Login(password string) (string, error) {
	// 1. Kéo chuỗi hash từ DB
	hash, err := s.repo.GetMasterPassword()
	if err != nil {
		return "", errors.New("Hệ thống chưa thiết lập mật khẩu")
	}

	// 2. Dùng hàm CheckPassword bạn đã viết sẵn cho gọn gàng
	if err := auth.CheckPassword(hash, password); err != nil {
		return "", errors.New("Mật khẩu không chính xác!")
	}

	// 3. Đúng mật khẩu thì tạo JWT bằng hàm GenerateToken
	tokenString, err := auth.GenerateToken()
	if err != nil {
		return "", errors.New("Không thể tạo phiên đăng nhập")
	}

	return tokenString, nil
}
