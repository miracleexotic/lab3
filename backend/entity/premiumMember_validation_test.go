package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)
func TestPremiumMemberPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	mem := PremiumMember{
		PremiumMemberID: "P1234567",
		CreateAt: time.Now(),
		Point: 1,
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(mem)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}
func TestPremiumIDMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{

		//"",			 //null
		"P00000000",
		"M00000000", // M ตามด้วย A และ \d 6 ตัว
		"MP0000000", // pm ตามด้วย \d 7 ตัว
		"P0M000000", // B ตามด้วย \d 8 ตัว

		"MA000000",  // M ตามด้วย A และ \d 6 ตัว
		"M000000",   // M ตามด้วย \d 6 ตัว
		"M00000000", // M ตามด้วย \d 8 ตัว

		"PM0000000", // D ตามด้วย A และ \d 6 ตัว
		"000000",    // D ตามด้วย \d 6 ตัว
		"00000000",  // D ตามด้วย \d 8 ตัว
	}

	for _, fixture := range fixtures {
		pm := PremiumMember{
			PremiumMemberID: fixture, //ผิด
			CreateAt: time.Now(),
			Point:           1,
		}

		ok, err := govalidator.ValidateStruct(pm)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`PremiumMemberID: %s does not validate as matches(^[P]\d{7}$)`, fixture)))
		
	}
}

func TestPointMustBePositive(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []int{
		-100,
		-200,
	}

	// ข้อมูลถูกต้องหมดทุก field
	for _, fixture := range fixtures {
		pm := PremiumMember{
			Point:    fixture, // ผิด
			CreateAt: time.Now(),
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(pm)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Point must be positive number"))
	}
}

func TestCreateAtMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	test_data := time.Now().Add(-24 * time.Hour)

	// ข้อมูลถูกต้องหมดทุก field
	ca := PremiumMember{
		
		CreateAt:       test_data, // ผิด
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ca)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("CreateAt must be present"))
}
