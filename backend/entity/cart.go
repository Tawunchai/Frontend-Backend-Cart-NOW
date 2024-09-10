package entity

import (
	"time"

	"gorm.io/gorm"
)

type Cart struct {
    gorm.Model
    CreateTime time.Time  
    Price float64    
    State      string     

	UserID *uint
	User   User `gorm:"foreignKey:UserID"`

    CourseID *uint
	Course   Course `gorm:"foreignKey:CourseID"`
}


