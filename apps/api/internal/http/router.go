package http

import (
	"rewind/api/internal/db"
	"rewind/api/internal/http/handler"
	"rewind/api/internal/http/middleware"
	"rewind/api/internal/repository"
	"rewind/api/internal/service"

	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine) {
	r.Static("/music", "./uploads/music")
	r.Static("/images", "./uploads/images")

	// Khởi tạo các lớp cho Memories (Lưu ý lấy db.DB đã connect)
	memoryRepo := repository.NewMemoryRepo(db.DB)
	memoryService := service.NewMemoryService(memoryRepo)
	memoryHandler := handler.NewMemoryHandler(memoryService)

	// Khởi tạo Dependency Injection cho Song
	songRepo := repository.NewSongRepository(db.DB)
	songService := service.NewSongService(songRepo)
	songHandler := handler.NewSongHandler(songService)

	api := r.Group("/api")

	// Route kiểm tra sức khỏe hệ thống
	api.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong", "status": "Rewind API is running!"})
	})

	// API Xác thực (Auth)
	auth := api.Group("/auth")
	{
		auth.POST("/login", handler.Login)
		auth.GET("/check", handler.CheckAuth)
		auth.POST("/logout", handler.Logout)
	}

	// Kho kỷ niệm (Memories)
	memories := api.Group("/memories")
	memories.Use(middleware.RequireAuth())
	{
		// Dùng method của instance h thay vì gọi function trực tiếp
		memories.GET("", memoryHandler.GetAllMemories)
		memories.GET("/random", memoryHandler.GetRandomMemory)
		memories.POST("/upload", memoryHandler.UploadMemory)
	}

	songs := api.Group("/songs")
	songs.Use(middleware.RequireAuth())
	{
		songs.GET("", songHandler.GetPlaylist)
		songs.POST("/upload", songHandler.UploadSong)
		songs.GET("/nct-lyrics", songHandler.FetchNCTLyrics)
	}

	// Các API Auth sẽ được thêm vào sau
}
