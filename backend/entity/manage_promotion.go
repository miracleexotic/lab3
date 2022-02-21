package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type PromotionType struct {
	gorm.Model

	Type string

	ManagePromotions []ManagePromotion `gorm:"foreignKey:PromotionTypeID"`
}
type NamePromotion struct {
	gorm.Model

	Name   string
	Detail string

	ManagePromotions []ManagePromotion `gorm:"foreignKey:NamePromotionID"`
}
type PromotionPeriod struct {
	gorm.Model

	StartDate time.Time
	EndDate   time.Time

	ManagePromotions []ManagePromotion `gorm:"foreignKey:PromotionPeriodID"`
}
type ManagePromotion struct {
	gorm.Model

	EmployeeID *uint
	Employee   Employee `gorm:"references:ID"`

	PromotionPeriodID *uint
	PromotionPeriod   PromotionPeriod `gorm:"references:ID"`

	NamePromotionID *uint
	NamePromotion   NamePromotion `gorm:"references:ID"`

	PromotionTypeID *uint
	PromotionType   PromotionType `gorm:"references:ID"`

	PromotionCode string  `valid:"required~,matches(^[A]\\d{4}$)"`
	MinPrice      float64 `valid:"required~MinPrice must not be zero, MinPrice~MinPrice must not be negative"`

	Discount       float64   `valid:"required~Discount must not be zero, Discount~Discount must not be negative"`
	Createdatetime time.Time `valid:"notpast~Createdatetime must not be in the past"`

	Orders []PurchaseOrder `gorm:"foreignKey:PromotionID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("notpast", func(i interface{}, o interface{}) bool {
		t := i.(time.Time)
		// ย้อนหลังไม่เกิน 1 วัน
		return t.After(time.Now().AddDate(0, 0, -1))
	})

	govalidator.CustomTypeTagMap.Set("MinPrice", func(i interface{}, o interface{}) bool {
		a := i.(float64)
		return a >= 1
	})
	govalidator.CustomTypeTagMap.Set("Discount", func(i interface{}, o interface{}) bool {
		a := i.(float64)
		return a >= 1
	})
}
