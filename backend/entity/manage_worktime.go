package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type ManageWorkTime struct {
	gorm.Model
	Comment     string    `valid:"stringlength(0|200)~Comment length must be between 0 - 200"`
	WorkingDate time.Time `valid:"present~WorkingDate must be present"`
	TimeTotal   uint      `valid:"customBetweenSixToNine~TimeTotal must be between 6 - 9 hr."`

	ManagerID *uint
	Manager   Employee `gorm:"references:ID" valid:"-"`

	EmployeeID *uint
	Employee   Employee `gorm:"references:ID" valid:"-"`

	DayID *uint
	Day   Day `gorm:"references:ID" valid:"-"`

	MonthID *uint
	Month   Month `gorm:"references:ID" valid:"-"`

	StartWorkTimeID *uint
	StartWorkTime   StartWorkTime `gorm:"references:ID" valid:"-"`

	EndWorkTimeID *uint
	EndWorkTime   EndWorkTime `gorm:"references:ID" valid:"-"`

	ManageSalary []ManageSalary `gorm:"foreignkey:ManageWorkTimeID"`
}
type Day struct {
	gorm.Model
	DayNumber uint

	ManageWorkTime []ManageWorkTime `gorm:"foreignKey:DayID"`
}

type Month struct {
	gorm.Model
	MonthOfYear string

	ManageWorkTime []ManageWorkTime `gorm:"foreignKey:MonthID"`
}

type StartWorkTime struct {
	gorm.Model
	TimeStart string

	ManageWorkTime []ManageWorkTime `gorm:"foreignKey:StartWorkTimeID"`
}

type EndWorkTime struct {
	gorm.Model
	TimeEnd string

	ManageWorkTime []ManageWorkTime `gorm:"foreignKey:EndWorkTimeID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("customBetweenSixToNine", func(i interface{}, context interface{}) bool {
		// เวลาทำงานไม่น้อยกว่า 6 และไม่เกิน 9 ชม
		return i.(uint) >= 6 && i.(uint) <= 9
	})

	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		// เป็นวันเวลาปัจจุบัน
		return t.After(time.Now()) && t.Before(time.Now())
	})
}
