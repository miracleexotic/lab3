package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type PaymentMethod struct {
	gorm.Model
	MethodName string

	Orders []PurchaseOrder `gorm:"foreignKey:PaymentMethodID"`
}

type PurchaseOrder struct {
	gorm.Model

	MemberID *uint
	Member   Member `gorm:"references:ID" valid:"-"`

	PromotionID *uint
	Promotion   ManagePromotion `gorm:"references:ID" valid:"-"`

	PaymentMethodID *uint
	PaymentMethod   PaymentMethod `gorm:"references:ID" valid:"-"`

	DeliveryAddress string    `valid:"required~DeliveryAddress cannot be blank, minstringlength(10)~DeliveryAddress must not be less than 10 characters"`
	OrderTime       time.Time `valid:"present~OrderTime must be present"`
	OrderDiscount   float64
	OrderTotalPrice float64

	OrderItems []PurchaseOrderItem `gorm:"foreignKey:OrderID; constraint:OnDelete:CASCADE" valid:"-"`
}

type PurchaseOrderItem struct {
	gorm.Model

	OrderID *uint
	Order   PurchaseOrder `gorm:"references:ID" valid:"-"`

	ProductstockID *uint
	Productstock   Productstock `gorm:"references:ID" valid:"-"`

	OrderAmount uint `valid:"required~OrderAmount must not be zero"`
	ItemPrice   float64
}

func init() {
	govalidator.CustomTypeTagMap.Set("present", func(i interface{}, o interface{}) bool {
		t := i.(time.Time)
		// ปัจจุบัน บวกลบไม่เกิน 12 ชั่วโมง
		return t.After(time.Now().Add(time.Hour*-12)) && t.Before(time.Now().Add(time.Hour*12))
	})
}
