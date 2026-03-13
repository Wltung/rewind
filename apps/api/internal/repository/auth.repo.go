package repository

import (
	"rewind/api/internal/model"

	"gorm.io/gorm"
)

type AuthRepo interface {
	GetMasterPassword() (string, error)
}

type authRepo struct {
	db *gorm.DB
}

func NewAuthRepo(db *gorm.DB) AuthRepo {
	return &authRepo{db}
}

func (r *authRepo) GetMasterPassword() (string, error) {
	var config model.SiteConfig
	err := r.db.Where("`key` = ?", "master_password").First(&config).Error
	return config.Value, err
}
