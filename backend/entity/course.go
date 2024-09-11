package entity

import (
	"gorm.io/gorm"
)

type Course struct {
	gorm.Model
	Name    string
	Title  string
	Price    float64
	ProfilePicture   string `gorm:"type:longtext"`
	
	Carts []Cart `gorm:"foreignKey:CourseID"`
}
