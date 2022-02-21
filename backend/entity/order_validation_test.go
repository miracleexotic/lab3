package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestOrderCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องทุก field
	order := PurchaseOrder{
		DeliveryAddress: "9243 หอพักสุรนิเวศ 9 มหาวิทยาลัยเทคโนโลยีสุรนารี",
		OrderTime:       time.Now(),
	}
	orderItems := []PurchaseOrderItem{
		{
			Order:       order,
			OrderAmount: 4,
		},
	}

	// +-------------------------------+
	// | ทำ validate ของ PurchaseOrder |
	// +-------------------------------+

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(order)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())

	// +-----------------------------------+
	// | ทำ validate ของ PurchaseOrderItem |
	// +-----------------------------------+
	for _, item := range orderItems {
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(item)

		// ok ต้องเป็น true แปลว่าไม่มี error
		g.Expect(ok).To(BeTrue())

		// err เป็นค่า nil แปลว่าไม่มี error
		g.Expect(err).To(BeNil())
	}
}

func TestDeliveryAddressMustBeMoreThan10Char(t *testing.T) {
	g := NewGomegaWithT(t)

	order := PurchaseOrder{
		DeliveryAddress: "9243", // สตริงมีน้อยกว่า 10 ตัวอักษร
		OrderTime:       time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(order)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("DeliveryAddress must not be less than 10 characters"))

}

func TestDeliveryAddressCannotBeBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	order := PurchaseOrder{
		DeliveryAddress: "", // สตริงว่าง
		OrderTime:       time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(order)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("DeliveryAddress cannot be blank"))

}

func TestOrderTimeMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []time.Time{
		time.Now().AddDate(0, 0, -2), // ผิด, ย้อนหลัง 2 วัน
		time.Now().AddDate(0, 0, 4),  // ผิด, อนาคต 4 วัน
	}

	for _, fixture := range fixtures {
		order := PurchaseOrder{
			DeliveryAddress: "9243, Suranivet 9 Dormitory, SUT",
			OrderTime:       fixture,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(order)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("OrderTime must be present"))
	}
}

func TestOrderAmountMustNotBeZero(t *testing.T) {
	g := NewGomegaWithT(t)

	orderItem := PurchaseOrderItem{
		OrderAmount: 0,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(orderItem)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("OrderAmount must not be zero"))
}
