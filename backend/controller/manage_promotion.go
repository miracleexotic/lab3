package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team06/backend/entity"
)

// POST /users
func CreateManagePromotion(c *gin.Context) {

	//var user entity.Employee
	var managepromotion entity.ManagePromotion
	var namepromotion entity.NamePromotion
	var promotionperiod entity.PromotionPeriod
	var promotiontype entity.PromotionType

	if err := c.ShouldBindJSON(&managepromotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา namePromotion ด้วย id
	if tx := entity.DB().Where("id = ?", managepromotion.NamePromotionID).First(&namepromotion); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name promotion not found"})
		return
	}

	// 10: ค้นหา promotionperiod ด้วย id
	if tx := entity.DB().Where("id = ?", managepromotion.PromotionPeriodID).First(&promotionperiod); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "promotion period not found"})
		return
	}

	// 11: ค้นหา promotiontype ด้วย id
	if tx := entity.DB().Where("id = ?", managepromotion.PromotionTypeID).First(&promotiontype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "promotion type not found"})
		return
	}

	promotion := entity.ManagePromotion{

		NamePromotion:   namepromotion,
		PromotionPeriod: promotionperiod,
		PromotionType:   promotiontype,
		Createdatetime:  managepromotion.Createdatetime,
		MinPrice:        managepromotion.MinPrice,
		Discount:        managepromotion.Discount,
		PromotionCode:   managepromotion.PromotionCode,
	}
	//ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//บันทึก
	if err := entity.DB().Create(&promotion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": promotion})
}

// GET /promotion
func ListPromotion(c *gin.Context) {
	var managepromotion []entity.ManagePromotion
	if err := entity.DB().Preload("NamePromotion").Preload("PromotionPeriod").Preload("PromotionType").Raw("SELECT * FROM manage_promotions").Find(&managepromotion).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": managepromotion})
}

// GET /getnamepromotion
func GetNamePromotion(c *gin.Context) {
	var name []entity.NamePromotion
	if err := entity.DB().Raw("SELECT * FROM name_promotions").Scan(&name).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": name})
}

// GET /getpromotionperiod
func GetPromotionperiod(c *gin.Context) {
	var promotionperiod []entity.PromotionPeriod
	if err := entity.DB().Raw("SELECT * FROM promotion_periods").Scan(&promotionperiod).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": promotionperiod})
}

// GET /getpromotiontype
func GetPromotionType(c *gin.Context) {
	var promotiontype []entity.PromotionType
	if err := entity.DB().Raw("SELECT * FROM promotion_types").Scan(&promotiontype).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": promotiontype})
}
