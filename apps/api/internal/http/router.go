package http

import (
	"rewind/api/internal/config"
	"rewind/api/internal/db"
	"rewind/api/internal/http/handler"
	"rewind/api/internal/http/middleware"
	"rewind/api/internal/repository"
	"rewind/api/internal/service"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine) {
	// --- CẤU HÌNH CORS NÀY VÀO ĐẦU ---
	configCORS := cors.DefaultConfig()

	rawOrigins := strings.Split(config.Cfg.AllowedOrigins, ",")
	var origins []string
	for _, o := range rawOrigins {
		// Dọn dẹp dấu cách thừa để tránh lỗi panic như lúc nãy
		origins = append(origins, strings.TrimSpace(o))
	}

	configCORS.AllowOrigins = origins
	configCORS.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	configCORS.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie"}
	configCORS.AllowCredentials = true

	r.Use(cors.New(configCORS))
	// -------------------------------------------

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

	configHandler := handler.NewConfigHandler(db.DB)

	polaroidRepo := repository.NewPolaroidRepository(db.DB)
	polaroidService := service.NewPolaroidService(polaroidRepo)
	polaroidHandler := handler.NewPolaroidHandler(polaroidService)

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

	configs := api.Group("/configs")
	configs.Use(middleware.RequireAuth())
	{
		configs.GET("/:key", configHandler.GetConfig)
		configs.POST("/:key", configHandler.SetConfig)
	}

	polaroids := api.Group("/polaroids")
	polaroids.Use(middleware.RequireAuth())
	{
		polaroids.GET("/random", polaroidHandler.GetRandomPolaroid)
		polaroids.POST("/upload", polaroidHandler.UploadPolaroid)
	}
}
