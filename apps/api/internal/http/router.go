package http

import (
	"rewind/api/internal/http/handler" // Đổi tên module
	"rewind/api/internal/http/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine) {
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
		memories.GET("/", handler.GetAllMemories)
		memories.GET("/random", handler.GetRandomMemory)
	}

	// Các API Auth sẽ được thêm vào sau
}
