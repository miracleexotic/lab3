package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestProductstockPass(t *testing.T) {
	g := NewGomegaWithT(t)
	// ข้อมูลถูกต้องหมดทุก field
	productstock := Productstock{
		Amount_remain:   20,
		Update_datetime: time.Now(),
		Detail:          "Snack for kid",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(productstock)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestDetailNotnull(t *testing.T) {
	g := NewGomegaWithT(t)

	productstock := Productstock{
		Amount_remain:   20,
		Update_datetime: time.Now(),
		Detail:          "", //ว่าง
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(productstock)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Detail cannot be blank"))

}

func TestAmontnotbeZeroorNegative(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []int32{
		0,
		-2,
	}
	for _, fixture := range fixtures {
		productstock := Productstock{
			Amount_remain:   fixture, //ค่าลบ และ ค่าศูนย์
			Update_datetime: time.Now(),
			Detail:          "Snack for kid",
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(productstock)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		if err.Error() == "Amont remain cannot be zero" {
			g.Expect(err.Error()).To(Equal("Amont remain cannot be zero"))
		} else if err.Error() == "Amont remain cannot be negative" {
			g.Expect(err.Error()).To(Equal("Amont remain cannot be negative"))
		}
	}
}

func TestProductstockUpdatTimeMustNotBeInThePast(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []time.Time{
		time.Now().AddDate(0, 0, -2), // ผิด, ย้อนหลัง 2 วัน
		time.Now().AddDate(0, 0, 2),  // ผิด, อนาคต 2 วัน
	}
	for _, fixture := range fixtures {
		productstock := Productstock{
			Amount_remain:   20,
			Update_datetime: fixture,
			Detail:          "Snack for kid",
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(productstock)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Update_datetime must not be present"))

	}
}
