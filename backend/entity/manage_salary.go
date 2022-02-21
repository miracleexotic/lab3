package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Assessment struct {
	gorm.Model
	Level uint
	Name  string

	ManageSalarys []ManageSalary `gorm:"foreignKey:AssessmentID"`
}

type BonusStatus struct {
	gorm.Model
	Name string

	ManageSalarys []ManageSalary `gorm:"foreignKey:BonusStatusID"`
}

type ManageSalary struct {
	gorm.Model

	ManagerID *uint
	Manager   Employee `gorm:"references:ID" valid:"-"`

	ManageWorkTimeID *uint
	ManageWorkTime   ManageWorkTime `gorm:"references:ID;constraint:OnDelete:CASCADE" valid:"-"`

	AssessmentID *uint
	Assessment   Assessment `gorm:"references:ID" valid:"-"`

	BonusAmount float64 `valid:"customPositiveNumber~BonusAmount must be positive number"`
	BonusDetail string  `valid:"stringlength(0|200)~BonusDetail length must be between 0 - 200"`

	BonusStatusID *uint
	BonusStatus   BonusStatus `gorm:"references:ID" valid:"-"`

	CreateAt time.Time `valid:"present~CreateAt must be present"`
}

// Custom validation
func init() {
	govalidator.CustomTypeTagMap.Set("customPositiveNumber", func(i interface{}, context interface{}) bool {
		return i.(float64) >= 0
	})

	govalidator.CustomTypeTagMap.Set("past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		// ปัจจุบัน บวกลบไม่เกิน 12 ชั่วโมง
		return t.After(time.Now().Add(time.Hour*-12)) && t.Before(time.Now().Add(time.Hour*12))
	})
}
