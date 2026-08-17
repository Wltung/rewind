package repository

import (
	"errors"
	"rewind/api/internal/model"

	"gorm.io/gorm"
)

type NotebookRepository interface {
	GetNotebook() (*model.Notebook, error)
	UpdateNotebook(notebook *model.Notebook) error
}

type notebookRepository struct {
	db *gorm.DB
}

func NewNotebookRepository(db *gorm.DB) NotebookRepository {
	return &notebookRepository{db: db}
}

// GetNotebook luôn lấy dòng có ID = 1
func (r *notebookRepository) GetNotebook() (*model.Notebook, error) {
	var notebook model.Notebook

	// Tìm dòng có ID = 1
	err := r.db.First(&notebook, 1).Error

	// NẾU DATABASE TRỐNG (Không tìm thấy dòng ID = 1)
	if errors.Is(err, gorm.ErrRecordNotFound) {

		// 1. Tạo dữ liệu mặc định
		defaultNotebook := model.Notebook{
			ID:         1, // Ép ID = 1
			Title:      "Hello",
			BodyText:   "try\nagain!",
			FooterText: "- Let's song 🎧",
			IconName:   "favorite", // Thay bằng icon mặc định trong mảng của bạn
		}

		// 2. Lưu luôn vào Database
		if createErr := r.db.Create(&defaultNotebook).Error; createErr != nil {
			return nil, createErr // Nếu lỗi lúc tạo thì mới báo lỗi
		}

		// 3. Trả về cuốn sổ mặc định vừa tạo thành công
		return &defaultNotebook, nil
	}

	// Trả về dữ liệu nếu tìm thấy, hoặc trả về lỗi nếu là lỗi khác (mất kết nối DB...)
	return &notebook, err
}

// UpdateNotebook luôn ghi đè vào dòng có ID = 1 (Upsert)
func (r *notebookRepository) UpdateNotebook(notebook *model.Notebook) error {
	err := r.db.Model(&model.Notebook{}).Where("id = ?", 1).Updates(map[string]interface{}{
		"title":       notebook.Title,
		"body_text":   notebook.BodyText,
		"footer_text": notebook.FooterText,
		"icon_name":   notebook.IconName,
	}).Error

	return err
}
