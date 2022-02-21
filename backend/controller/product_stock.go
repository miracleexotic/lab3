package controller

import (
	"net/http"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team06/backend/entity"
)
func CreateProductstock(c *gin.Context) {

	var productstock entity.Productstock
	var product entity.Product
	var shelfstore entity.Shelfstore
	var employee entity.Employee

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร watchVideo
	if err := c.ShouldBindJSON(&productstock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา product ด้วย id
	if tx := entity.DB().Where("id = ?",productstock.ProductID).First(&product); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}

	// 10: ค้นหา shelfstore ด้วย id
	if tx := entity.DB().Where("id = ?", productstock.ShelfstoreID).First(&shelfstore); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shelfstore not found"})
		return
	}

	// 11: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?",productstock.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	// 12: สร้าง 
	p := entity.Productstock{
		Amount_remain: productstock.Amount_remain,
		Detail: productstock.Detail,
		Product: product,
		Shelfstore: shelfstore,
		Employee: employee,
		Update_datetime: productstock.Update_datetime.Local(),
	}
	// validate
	if _,err := govalidator.ValidateStruct(p); err != nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&p).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": p})
}

// GET /productstock
func ListProductstock(c *gin.Context) {
	var productstock []entity.Productstock
	if err := entity.DB().Preload("Product").Preload("Product.Typeproduct").Preload("Shelfstore").
	Preload("Employee").
	Raw("SELECT * FROM productstocks").Find(&productstock).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": productstock})
}

func ListProduct(c *gin.Context) {
	var product []entity.Product
	if err := entity.DB().
	Preload("Typeproduct").
	Raw("SELECT * FROM products").
	Find(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

func CreateProduct(c *gin.Context) {

	var product entity.Product
	var typeproduct entity.Typeproduct

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา producttype ด้วย id
	if tx := entity.DB().Where("id = ?",product.TypeproductID).First(&typeproduct); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "producttype not found"})
		return
	}

	p := entity.Product{
		Name: product.Name,
		Price:product.Price,
		Typeproduct:typeproduct,
	}

	if err := entity.DB().Create(&p).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": p})
}

func ListShelfstore(c *gin.Context) {
	var shelfstore []entity.Shelfstore
	if err := entity.DB().
	Raw("SELECT * FROM shelfstores").Find(&shelfstore).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": shelfstore})
}

func ListTypeproduct(c *gin.Context) {
	var typeproduct []entity.Typeproduct
	if err := entity.DB().
	Raw("SELECT * FROM typeproducts").
	Find(&typeproduct).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": typeproduct})
}