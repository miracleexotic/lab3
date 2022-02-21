package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team06/backend/entity"
)

// +-------------+
// |  Employee   |
// +-------------+
// GET : /managesalary/employees
// List all Employees managed by manager
func ListEmployeesByManageSalary(c *gin.Context) {
	username, _ := c.Get("username")

	var manager entity.Employee
	entity.DB().Model(&entity.Employee{}).Preload("UserLogin").Joins("UserLogin").Where("`UserLogin__username` = ?", username).First(&manager)

	var employees []entity.Employee
	if err := entity.DB().Model(&entity.Employee{}).
		Preload("UserLogin.UserRole").Preload("UserDetail.Gender").Preload("Position").
		Preload("EmployeeManageWorkTime.Manager.UserDetail").Preload("EmployeeManageWorkTime.Day").Preload("EmployeeManageWorkTime.Month").Preload("EmployeeManageWorkTime.StartWorkTime").Preload("EmployeeManageWorkTime.EndWorkTime").
		Find(&employees, entity.DB().Where("superior_id = ?", manager.ID)).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": employees})
}

// +-------------------+
// |  ManageWorkTime   |
// +-------------------+
// GET : /managesalary/manageworktime -> คล้ายว่าไม่ได้ใช้
// List all ManageWorkTime
func ListManageWorkTimeByManageSalary(c *gin.Context) {
	var manageWorkTime []entity.ManageWorkTime
	if err := entity.DB().Model(&entity.ManageWorkTime{}).
		Preload("Manager").Preload("Employee").Preload("Day").Preload("Month").Preload("StartWorkTime").Preload("EndWorkTime").
		Find(&manageWorkTime).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": manageWorkTime})
}

// GET : /managesalary/manageworktime/:id
// Get ManageWorkTime by employee.id
func GetManageWorkTimeByManageSalary(c *gin.Context) {
	var manageWorkTime []entity.ManageWorkTime
	id := c.Param("id")
	if err := entity.DB().Model(&entity.ManageWorkTime{}).
		Preload("Manager.UserLogin.UserRole").Preload("Manager.UserDetail.Gender").Preload("Manager.Position").
		Preload("Employee.UserLogin.UserRole").Preload("Employee.UserDetail.Gender").Preload("Employee.Position").
		Preload("Day").Preload("Month").Preload("StartWorkTime").Preload("EndWorkTime").
		Joins("Employee").
		Find(&manageWorkTime, entity.DB().Where("`Employee__id` = ?", id)).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": manageWorkTime})
}

// +---------------+
// |  Assessment   |
// +---------------+
// GET : /managesalary/assessments
// List all Assessments
func ListAssessmentsByManageSalary(c *gin.Context) {
	var assessments []entity.Assessment
	if err := entity.DB().Model(&entity.Assessment{}).Find(&assessments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": assessments})
}

// +----------------+
// |  BonusStatus   |
// +----------------+
// GET : /managesalary/bonusstatus
// List all BonusStatus
func ListBonusStatusByManageSalary(c *gin.Context) {
	var bonusStatus []entity.BonusStatus
	if err := entity.DB().Model(&entity.BonusStatus{}).Find(&bonusStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bonusStatus})
}

// +-----------------+
// |  ManageSalary   |
// +-----------------+
// GET : /managesalaries
// List all ManageSalary
func ListManageSalaryByManageSalary(c *gin.Context) {
	var employee_manageSalaries []entity.Employee
	if err := entity.DB().Model(&entity.Employee{}).
		Preload("UserDetail").Preload("Position").
		Preload("ManageSalarys.Manager.UserDetail").Preload("ManageSalarys.Manager.Position").
		Preload("ManageSalarys.Assessment").Preload("ManageSalarys.BonusStatus").
		Preload("ManageSalarys.ManageWorkTime.Manager.UserDetail").Preload("ManageSalarys.ManageWorkTime.Day").Preload("ManageSalarys.ManageWorkTime.Month").Preload("ManageSalarys.ManageWorkTime.StartWorkTime").Preload("ManageSalarys.ManageWorkTime.EndWorkTime").
		Preload("EmployeeManageWorkTime.Manager.UserDetail").Preload("EmployeeManageWorkTime.Day").Preload("EmployeeManageWorkTime.Month").Preload("ManageSalarys.ManageWorkTime.StartWorkTime").Preload("ManageSalarys.ManageWorkTime.EndWorkTime").
		Find(&employee_manageSalaries).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": employee_manageSalaries})
}

// GET : /managesalary/:id
// Get ManageSalary by id
func GetManageSalaryByManageSalary(c *gin.Context) {
	var manageSalaries entity.ManageSalary
	id := c.Param("id")
	if err := entity.DB().Model(&entity.ManageSalary{}).
		Preload("Assessment").Preload("BonusStatus").
		Preload("ManageWorkTime.Employee.UserDetail").
		Find(&manageSalaries, entity.DB().Where("`id` = ?", id)).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": manageSalaries})
}

// GET : /managesalary/employee/:id
// Get ManageSalary by employee.id
func GetManageSalaryWithEmployeeIDByManageSalary(c *gin.Context) {
	var manageSalaries []entity.ManageSalary
	id := c.Param("id")
	if err := entity.DB().Model(&entity.ManageSalary{}).
		Preload("Manager").Preload("ManageWorkTime").Preload("Assessment").Preload("BonusStatus").
		Joins("ManageWorkTime").
		Find(&manageSalaries, entity.DB().Where("`ManageWorkTime__employee_id` = ?", id)).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": manageSalaries})
}

// POST : /managesalary
// Create ManageSalary
func CreateManageSalaryByManageSalary(c *gin.Context) {
	username, _ := c.Get("username")

	var manager entity.Employee
	entity.DB().Model(&entity.Employee{}).Preload("UserLogin").Joins("UserLogin").Where("`UserLogin__username` = ?", username).First(&manager)

	var manageWorkTime entity.ManageWorkTime
	var assessment entity.Assessment
	var bonusStatus entity.BonusStatus
	var manageSalary entity.ManageSalary

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 10 จะถูก bind เข้าตัวแปร manageSalary
	if err := c.ShouldBindJSON(&manageSalary); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 11: ค้นหา ManageWorkTime ด้วย id
	if tx := entity.DB().Model(&entity.ManageWorkTime{}).Preload("Manager").Preload("Employee").Preload("Day").Preload("Month").Preload("StartWorkTime").Preload("EndWorkTime").Find(&manageWorkTime, entity.DB().Where("id = ?", manageSalary.ManageWorkTimeID)); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ManageWorkTime not found"})
		return
	}

	// 12: ค้นหา Assessment ด้วย id
	if tx := entity.DB().Model(&entity.Assessment{}).First(&assessment, entity.DB().Where("id = ?", manageSalary.AssessmentID)); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assessment not found"})
		return
	}

	// 13: ค้นหา BonusStatus ด้วย id
	if tx := entity.DB().Model(&entity.BonusStatus{}).First(&bonusStatus, entity.DB().Where("id = ?", manageSalary.BonusStatusID)); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "BonusStatus not found"})
		return
	}

	// 14: สร้าง ManageSalary
	ms := entity.ManageSalary{
		Manager:        manager,                  // โยงความสัมพันธ์กับ Entity Employee
		ManageWorkTime: manageWorkTime,           // โยงความสัมพันธ์กับ Entity ManageWorkTime
		Assessment:     assessment,               // โยงความสัมพันธ์กับ Entity Assessment
		BonusAmount:    manageSalary.BonusAmount, // ตั้งค่าฟิลด์ BonusAmount
		BonusDetail:    manageSalary.BonusDetail, // ตั้งค่าฟิลด์ BonusDetail
		BonusStatus:    bonusStatus,              // โยงความสัมพันธ์กับ Entity BonusStatus
		CreateAt:       manageSalary.CreateAt,    // ตั้งค่าฟิลด์ CreateAt
	}

	// ขั้นตอนการ validation entity ManageSalary -> BonusAmount, BonusDetail, CreateAt
	if _, err := govalidator.ValidateStruct(ms); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 15: บันทึก
	if err := entity.DB().Create(&ms).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ms})
}

// DELETE : /managesalary/:id
// Delete ManageSalary by id
func DelManageSalaryByManageSalary(c *gin.Context) {
	id := c.Param("id")

	var data entity.ManageSalary
	sql := "DELETE FROM manage_salaries WHERE id = ?"
	entity.DB().Model(&entity.ManageSalary{}).Raw(sql, id).Scan(&data)

	c.JSON(http.StatusOK, gin.H{"data": data})
}

// PATCH : /managesalary/:id
// Update ManageSalary by id
func UpdateManageSalaryByManageSalary(c *gin.Context) {
	username, _ := c.Get("username")
	id := c.Param("id")

	var manager entity.Employee
	entity.DB().Model(&entity.Employee{}).Preload("UserLogin").Joins("UserLogin").Where("`UserLogin__username` = ?", username).First(&manager)

	var manageWorkTime entity.ManageWorkTime
	var assessment entity.Assessment
	var bonusStatus entity.BonusStatus
	var manageSalary entity.ManageSalary

	if err := c.ShouldBindJSON(&manageSalary); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Model(&entity.ManageWorkTime{}).Preload("Manager").Preload("Employee").Preload("Day").Preload("Month").Preload("StartWorkTime").Preload("EndWorkTime").Find(&manageWorkTime, entity.DB().Where("id = ?", manageSalary.ManageWorkTimeID)); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ManageWorkTime not found"})
		return
	}

	if tx := entity.DB().Model(&entity.Assessment{}).First(&assessment, entity.DB().Where("id = ?", manageSalary.AssessmentID)); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assessment not found"})
		return
	}

	if tx := entity.DB().Model(&entity.BonusStatus{}).First(&bonusStatus, entity.DB().Where("id = ?", manageSalary.BonusStatusID)); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "BonusStatus not found"})
		return
	}

	var update_manageSalary entity.ManageSalary
	entity.DB().Model(&entity.ManageSalary{}).Find(&update_manageSalary, entity.DB().Where("`id` = ?", id))

	update_manageSalary.Manager = manager
	update_manageSalary.ManageWorkTime = manageWorkTime
	update_manageSalary.Assessment = assessment
	update_manageSalary.BonusAmount = manageSalary.BonusAmount
	update_manageSalary.BonusDetail = manageSalary.BonusDetail
	update_manageSalary.BonusStatus = bonusStatus
	update_manageSalary.CreateAt = manageSalary.CreateAt

	if _, err := govalidator.ValidateStruct(update_manageSalary); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Save(&update_manageSalary).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update_manageSalary})
}
