package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func GetAllCourses(c *gin.Context) {
	var courses []entity.Course

	db := config.DB() 
	results := db.
		Preload("Carts").
		Preload("Carts.User").
		Preload("Carts.User.Gender").
		Preload("Carts.Course").
		Find(&courses)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, courses)
}

func GetCourseByID(c *gin.Context) {
    id := c.Param("id")
    var course entity.Course

    if err := config.DB().Preload("Carts").Preload("Carts.User").Preload("Carts.User.Gender").Preload("Carts.Course").First(&course, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
        return
    }

    c.JSON(http.StatusOK, course)
}