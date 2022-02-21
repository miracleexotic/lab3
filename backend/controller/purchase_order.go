package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team06/backend/entity"
	"gorm.io/gorm"
)

// GET /payment-methods
func ListPaymentMethod(c *gin.Context) {
	var payment_method []entity.PaymentMethod
	if err := entity.DB().Raw("SELECT * FROM payment_methods").Scan(&payment_method).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": payment_method})
}

// GET /order-history/:id
func ListPurchaseOrder(c *gin.Context) {
	id := c.Param("id")
	var orders []entity.PurchaseOrder
	if err := entity.DB().Preload("PaymentMethod").Preload("Promotion").
		Preload("OrderItems").Preload("OrderItems.Productstock").Preload("OrderItems.Productstock.Product").
		Raw("SELECT * FROM purchase_orders WHERE member_id = ?", id).Find(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

// POST /purchase-order
func CreatePurchaseOrder(c *gin.Context) {
	var purchaseOrder entity.PurchaseOrder

	var member entity.Member
	var promotion entity.ManagePromotion
	var payment entity.PaymentMethod

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร purchaseOrder
	if err := c.ShouldBindJSON(&purchaseOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา member ด้วย id
	if tx := entity.DB().Where("id = ?", purchaseOrder.MemberID).First(&member); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "member not found"})
		return
	}

	// 10: ค้นหา promotion ด้วย id
	if tx := entity.DB().Where("id = ?", purchaseOrder.PromotionID).First(&promotion); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "promotion not found"})
		return
	}

	// 11: ค้นหา payment method ด้วย id
	if tx := entity.DB().Where("id = ?", purchaseOrder.PaymentMethodID).First(&payment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment method not found"})
		return
	}

	entity.DB().Transaction(func(tx *gorm.DB) error {
		// 12: สร้าง PurchaseOrder
		order := entity.PurchaseOrder{
			Member:          member,
			Promotion:       promotion,
			PaymentMethod:   payment,
			OrderTime:       purchaseOrder.OrderTime,
			DeliveryAddress: purchaseOrder.DeliveryAddress,
			OrderDiscount:   purchaseOrder.OrderDiscount,
			OrderTotalPrice: purchaseOrder.OrderTotalPrice,
		}

		// 13: บันทึก PurchaseOrder
		if err := tx.Create(&order).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return err
		}

		// Validation ของ PurchaseOrder
		if _, err := govalidator.ValidateStruct(order); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return err
		}

		var items []entity.PurchaseOrderItem
		for _, orderItem := range purchaseOrder.OrderItems {
			var product entity.Productstock
			// 14: ค้นหา product ด้วย id
			if tx1 := tx.Where("id = ?", orderItem.ProductstockID).First(&product); tx1.RowsAffected == 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "product stock not found"})
				return tx1.Error
			}

			// 15: สร้าง PurchaseOrderItem
			it := entity.PurchaseOrderItem{
				Order:        order,
				Productstock: product,
				OrderAmount:  orderItem.OrderAmount,
				ItemPrice:    orderItem.ItemPrice,
			}

			// Validation ของ PurchaseOrderItem
			if _, err := govalidator.ValidateStruct(it); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return err
			}

			items = append(items, it)
		}
		// 16: บันทึก PurchaseOrderItem
		if err := tx.Create(&items).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return err
		}

		// Data response when success
		var dataSubmitted entity.PurchaseOrder
		tx.Where("id = ?", order.ID).
			Preload("Member").
			Preload("Member.UserDetail").
			Preload("PaymentMethod").
			Preload("Promotion").
			Preload("OrderItems").
			Preload("OrderItems.Productstock").Find(&dataSubmitted)

		c.JSON(http.StatusOK, gin.H{"data": dataSubmitted})

		return nil
	})

}
