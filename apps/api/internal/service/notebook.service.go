package service

import (
	"rewind/api/internal/model"
	"rewind/api/internal/repository"
)

type NotebookService interface {
	GetNotebook() (*model.Notebook, error)
	UpdateNotebook(notebook *model.Notebook) error
}

type notebookService struct {
	repo repository.NotebookRepository
}

func NewNotebookService(repo repository.NotebookRepository) NotebookService {
	return &notebookService{repo: repo}
}

func (s *notebookService) GetNotebook() (*model.Notebook, error) {
	return s.repo.GetNotebook()
}

func (s *notebookService) UpdateNotebook(notebook *model.Notebook) error {
	return s.repo.UpdateNotebook(notebook)
}
