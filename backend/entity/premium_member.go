package entity

import (
	"time"

	"gorm.io/gorm"
	"github.com/asaskevich/govalidator"
	
)

type PremiumMember struct {
	gorm.Model

	MemberID *uint
	Member   Member `gorm:"references:ID" valid:"-"`

	MemberClassID *uint
	MemberClass   MemberClass `gorm:"references:ID" valid:"-"`

	PremiumMemberPeriodID *uint
	PremiumMemberPeriod   PremiumMemberPeriod `gorm:"references:ID" valid:"-"`

	PremiumMemberID string    `valid:"matches(^[P]\\d{7}$)"`
	CreateAt        time.Time `valid:"present~CreateAt must be present"`
	Point           int `valid:"customPositiveNumber2~Point must be positive number"`
}

type MemberClass struct {
	gorm.Model
	
	Name   string
	Detail string

	PremiumMember []PremiumMember `gorm:"foreignKey:MemberClassID"`
}

type PremiumMemberPeriod struct {
	gorm.Model
	Period   string
	
	PremiumMember []PremiumMember `gorm:"foreignKey:PremiumMemberPeriodID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("customPositiveNumber2", func(i interface{}, context interface{}) bool {
		return i.(int) >= 0
	})

	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, o interface{}) bool {
		t := i.(time.Time)
		// ปัจจุบัน บวกลบไม่เกิน 12 ชั่วโมง
		return t.After(time.Now().Add(time.Hour*-12)) && t.Before(time.Now().Add(time.Hour*12))
	})
}