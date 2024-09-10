package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func CreateCart(c *gin.Context) {
	var cart entity.Cart

	if err := c.ShouldBindJSON(&cart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user entity.User
	var course entity.Course
	if err := config.DB().First(&user, cart.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	if err := config.DB().First(&course, cart.CourseID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found"})
		return
	}

	cart.CreateTime = time.Now()

	if err := config.DB().Create(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().
		Preload("User").
		Preload("User.Gender").
		Preload("Course").
		First(&cart, cart.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load related data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart created successfully",
		"cart":    cart,
	})
}

func DeleteCartByIdCourse(c *gin.Context) {
    courseID := c.Param("courseID")
    var cart entity.Cart

    // Find the cart item by course ID
    if err := config.DB().Where("course_id = ?", courseID).First(&cart).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
        return
    }

    // Hard delete the cart item
    if err := config.DB().Unscoped().Delete(&cart).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Cart item deleted successfully"})
}

func GetAllCart(c *gin.Context) {
	var carts []entity.Cart

	// Retrieve all cart items with related user and course data
	if err := config.DB().
		Preload("User").
		Preload("User.Gender").
		Preload("Course").
		Find(&carts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"carts": carts,
	})
}