package main

import (
	"github.com/gin-gonic/gin"
	"github.com/sut64/team06/backend/controller"
	"github.com/sut64/team06/backend/entity"
	"github.com/sut64/team06/backend/middlewares"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// ManageSalary Routes
			protected.GET("/managesalary/employees", controller.ListEmployeesByManageSalary)
			protected.GET("/managesalary/manageworktime", controller.ListManageWorkTimeByManageSalary)
			protected.GET("/managesalary/manageworktime/:id", controller.GetManageWorkTimeByManageSalary)
			protected.GET("/managesalary/assessments", controller.ListAssessmentsByManageSalary)
			protected.GET("/managesalary/bonusstatus", controller.ListBonusStatusByManageSalary)
			protected.GET("/managesalaries", controller.ListManageSalaryByManageSalary)
			protected.GET("/managesalary/:id", controller.GetManageSalaryByManageSalary)
			protected.GET("/managesalary/employee/:id", controller.GetManageSalaryWithEmployeeIDByManageSalary)
			protected.POST("/managesalary", controller.CreateManageSalaryByManageSalary)
			protected.DELETE("/managesalary/:id", controller.DelManageSalaryByManageSalary)
			protected.PATCH("/managesalary/:id", controller.UpdateManageSalaryByManageSalary)

			// ManageWorkSchedule Routes
			protected.POST("/manage/create", controller.CreateMangeWorkTime)
			protected.GET("/manage/day/all", controller.GetAllDay)
			protected.GET("/manage/month/all", controller.GetAllMonth)
			protected.GET("/manage/work/starttime", controller.GetStartWorkTime)
			protected.GET("/manage/work/endtime", controller.GetEndWorkTime)
			protected.GET("/manage/employee/all", controller.GetAllEmployee)
			protected.GET("/manage/detail/all", controller.GetAllDetail)
			protected.GET("/manage/pos/all", controller.GetAllPosition)
			protected.GET("/manage/all", controller.GetAllManageWorkTime)
			protected.DELETE("/manage/:id", controller.DeleteManageWorkTime)

			// ProductStock Routes
			protected.GET("/productstock", controller.ListProductstock)
			protected.GET("/typeproduct", controller.ListTypeproduct)
			protected.GET("/product", controller.ListProduct)
			protected.GET("/shelfstore", controller.ListShelfstore)
			protected.POST("/productstock", controller.CreateProductstock)
			protected.POST("/product", controller.CreateProduct)

			// ManagePromotion Routes
			protected.GET("/listpromotion", controller.ListPromotion)
			protected.GET("/getnamepromotion", controller.GetNamePromotion)
			protected.GET("/getpromotionperiod", controller.GetPromotionperiod)
			protected.GET("/getpromotiontype", controller.GetPromotionType)
			protected.POST("/createpromotion", controller.CreateManagePromotion)

			// PremiumMember Routes
			protected.GET("/premium_member_period", controller.ListPremiumMemberPeriod)
			protected.GET("/member_class", controller.ListMemberClass)
			protected.GET("/premium_members", controller.ListPremiumMember)
			protected.GET("/premium_member/:id", controller.GetPremiumMember)
			protected.POST("/premium_members", controller.CreatePremiumMember)
			protected.PATCH("/premium_member", controller.UpdatePremiumMember)

			// PurchaseOrder Routes
			protected.GET("/payment-methods", controller.ListPaymentMethod)
			protected.GET("/order-history/:id", controller.ListPurchaseOrder)
			protected.POST("/purchase-order", controller.CreatePurchaseOrder)
		}
	}

	r.POST("/login", controller.Login)

	// Run the server
	r.Run()
}
