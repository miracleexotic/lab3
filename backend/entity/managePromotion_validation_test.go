package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestManagePromotionCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	ManagePromotion := ManagePromotion{

		PromotionCode:  "A1500",
		MinPrice:       10,
		Discount:       10,
		Createdatetime: time.Now(),
	}

	ok, err := govalidator.ValidateStruct(ManagePromotion)

	g.Expect(ok).To(BeTrue())

	g.Expect(err).To(BeNil())

}

func TestPromotionCodeIncorect(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		//ตัวหนังสือผิด เลขถูก
		"B1500",
		//ตัวหนังสือถูก เลขน้อยกว่า 4
		"A50",
		//ตัวหนังสือผิด เลขน้อยกว่า4
		"C500",
		//ตัวหนังสือถูก เลขมากกว่า 4
		"A15000",
		//ตัวหนังสือมากกว่า 1 เลขถูก
		"AA1500",
		//ตัวหนังสือมากกว่า 1 เลขมากกว่า 4
		"AA15000",
	}

	for _, fixture := range fixtures {
		Promotioncode := ManagePromotion{
			PromotionCode:  fixture,
			MinPrice:       10,
			Discount:       10,
			Createdatetime: time.Now(),
		}
		ok, err := govalidator.ValidateStruct(Promotioncode)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`PromotionCode: %s does not validate as matches(^[A]\d{4}$)`, fixture)))
	}
}
func TestMinPriceCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []float64{
		0,
		-5,
		-4,
		-2,
	}

	for _, fixture := range fixtures {

		MinPrice := ManagePromotion{
			PromotionCode:  "A1500",
			MinPrice:       fixture,
			Discount:       10,
			Createdatetime: time.Now(),
		}
		ok, err := govalidator.ValidateStruct(MinPrice)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		if err.Error() == "MinPrice must not be zero" {
			g.Expect(err.Error()).To(Equal("MinPrice must not be zero"))
		} else if err.Error() == "MinPrice must not be negative" {
			g.Expect(err.Error()).To(Equal("MinPrice must not be negative"))
		}
	}
}
func TestDiscountCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []float64{
		0,
		-5,
		-4,
		-2,
	}

	for _, fixture := range fixtures {

		Discount := ManagePromotion{
			PromotionCode:  "A1500",
			MinPrice:       10,
			Discount:       fixture,
			Createdatetime: time.Now(),
		}
		ok, err := govalidator.ValidateStruct(Discount)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		if err.Error() == "Discount must not be zero" {
			g.Expect(err.Error()).To(Equal("Discount must not be zero"))
		} else if err.Error() == "Discount must not be negative" {
			g.Expect(err.Error()).To(Equal("Discount must not be negative"))
		}
	}
}

func TestCreateDateTimeNotPast(t *testing.T) {
	g := NewGomegaWithT(t)

	Createdatetime := ManagePromotion{
		PromotionCode:  "A1500",
		MinPrice:       10,
		Discount:       10,
		Createdatetime: time.Now().AddDate(0, 0, -1),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(Createdatetime)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Createdatetime must not be in the past"))
}
