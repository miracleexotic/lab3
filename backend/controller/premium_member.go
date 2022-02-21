package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team06/backend/entity"
)

// GET /member_class
func ListMemberClass(c *gin.Context) {
	var member_class []entity.MemberClass
	if err := entity.DB().Raw("SELECT * FROM member_classes").Scan(&member_class).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": member_class})
}

func ListPremiumMemberPeriod(c *gin.Context) {
	var premium_member_period []entity.PremiumMemberPeriod
	if err := entity.DB().Raw("SELECT * FROM premium_member_periods").Scan(&premium_member_period).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": premium_member_period})
}

//POST /Premium Member
func CreatePremiumMember(c *gin.Context) {
	var premiumMember entity.PremiumMember
	var member entity.Member
	var memberClass entity.MemberClass
	var premiumMemberPeriod entity.PremiumMemberPeriod

	if err := c.ShouldBindJSON(&premiumMember); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// find member
	if tx := entity.DB().Where("id = ?", premiumMember.MemberID).First(&member); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Member not found"})
		return
	}

	// find memberClass
	if tx := entity.DB().Where("id = ?", premiumMember.MemberClassID).First(&memberClass); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Member class not found"})
		return
	}

	// find premiumMemberPeriod
	if tx := entity.DB().Where("id = ?", premiumMember.PremiumMemberPeriodID).First(&premiumMemberPeriod); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Period not found"})
		return
	}

	// create premiumMember
	pm := entity.PremiumMember{
		Member:              member,                        // reference with Entity Member
		MemberClass:         memberClass,                   // reference with Entity MemberClass
		PremiumMemberPeriod: premiumMemberPeriod,           // reference with Entity PremiumMemberPeriod
		PremiumMemberID:     premiumMember.PremiumMemberID, // set field PremiumMemberID
		CreateAt:            premiumMember.CreateAt,        // set field CreateAt
		Point:               premiumMember.Point,           // set field Point
	}

	// Validation
if _, err := govalidator.ValidateStruct(pm); err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	return
}

	// save
	if err := entity.DB().Create(&pm).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": pm})
}

// GET /premiumMember/:id
func GetPremiumMember(c *gin.Context) {
	var premiummember entity.PremiumMember
	id := c.Param("id")
	if err := entity.DB().Preload("Member").Preload("MemberClass").Preload("PremiumMemberPeriod").Raw("SELECT * FROM premium_members WHERE id = ?", id).Find(&premiummember).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": premiummember})
}

// GET /premium_members
func ListPremiumMember(c *gin.Context) {
	var premiummembers []entity.PremiumMember
	if err := entity.DB().Preload("Member").Preload("MemberClass").Preload("PremiumMemberPeriod").Raw("SELECT * FROM premium_members").Find(&premiummembers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": premiummembers})
}

// DELETE /premium_members/:id
func DeletePremiummember(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM premium_members WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Premium Member not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /premium_members
func UpdatePremiumMember(c *gin.Context) {
	var premiummember entity.PremiumMember
	if err := c.ShouldBindJSON(&premiummember); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", premiummember.ID).First(&premiummember); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Premium Member not found"})
		return
	}

	if err := entity.DB().Save(&premiummember).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": premiummember})
}
