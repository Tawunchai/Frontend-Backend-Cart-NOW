package entity

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
    gorm.Model
    FirstName string
    LastName  string
    Email     string
    Password  string
    BirthDay  time.Time
    Profile   string `gorm:"type:longtext"`

    GenderID  uint
    Gender    Gender `gorm:"foreignKey:GenderID"`
    
    Carts     []Cart `gorm:"foreignKey:UserID"`
}
