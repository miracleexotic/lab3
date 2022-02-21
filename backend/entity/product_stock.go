package entity

import (
	"time"
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Productstock struct {
	gorm.Model
	Amount_remain   int32 `valid:"required~Amont remain cannot be zero,notnegative~Amont remain cannot be negative"`
	Update_datetime time.Time `valid:"notpast~Update_datetime must not be present"`
	Detail          string `valid:"required~Detail cannot be blank"`

	ProductID *uint	`gorm:"uniqueIndex"`

	Product   Product	`gorm:"references:ID" valid:"-"`

	ShelfstoreID *uint
	Shelfstore   Shelfstore	`gorm:"references:ID" valid:"-"`

	EmployeeID *uint
	Employee   Employee		`gorm:"references:ID" valid:"-"`

}

type Shelfstore struct {
	gorm.Model
	Zone string


	Productstock []Productstock	`gorm:"foreignkey:ShelfstoreID"`

}

type Product struct {
	gorm.Model
	Name  string
	Price float32


	Productstock []Productstock	`gorm:"foreignkey:ProductID"`

	TypeproductID *uint
	Typeproduct   Typeproduct	`gorm:"references:ID" valid:"-"`

}

type Typeproduct struct {
	gorm.Model
	Name string

	
	Product []Product	`gorm:"foreignkey:TypeproductID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("notpast", func(i interface{}, o interface{}) bool {
		t := i.(time.Time)
		// ปัจจุบัน บวกลบไม่เกิน 12 ชั่วโมง
		return t.After(time.Now().Add(time.Hour*-12)) && t.Before(time.Now().Add(time.Hour*12))
	})

	govalidator.CustomTypeTagMap.Set("notnegative", func(i interface{}, o interface{}) bool {
		a := i.(int32)
		return a >= 1
	})
}