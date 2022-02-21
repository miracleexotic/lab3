package entity

import "gorm.io/gorm"

type UserRole struct {
	gorm.Model
	RoleName   string
	RoleNameTH string

	UserLogins []UserLogin `gorm:"foreignKey:UserRoleID"`
}

type UserLogin struct {
	gorm.Model
	Username string `gorm:"uniqueIndex"`
	Password string

	UserRoleID *uint    `gorm:"NOT NULL"`
	UserRole   UserRole `gorm:"references:ID; NOT NULL"`
}

type Gender struct {
	gorm.Model
	GenderName string

	UserDetails []UserDetail `gorm:"foreignKey:GenderID"`
}

type UserPrefix struct {
	gorm.Model
	PrefixName string

	UserDetails []UserDetail `gorm:"foreignKey:PrefixID"`
}

type UserDetail struct {
	gorm.Model

	PrefixID *uint
	Prefix   UserPrefix `gorm:"references:ID"`

	FirstName   string
	LastName    string
	PersonalID  string `gorm:"uniqueIndex"`
	PhoneNumber string
	Address     string

	GenderID *uint
	Gender   Gender `gorm:"references:ID"`
}

type Member struct {
	gorm.Model

	UserLoginID *uint     `gorm:"uniqueIndex"`
	UserLogin   UserLogin `gorm:"references:ID; constraint:OnDelete:CASCADE"`

	UserDetailID *uint
	UserDetail   UserDetail `gorm:"references:ID"`

	Orders         []PurchaseOrder `gorm:"foreignKey:MemberID"`
	PremiumMember  []PremiumMember `gorm:"foreignKey:MemberID"`
}

type Employee struct {
	gorm.Model

	UserLoginID *uint     `gorm:"uniqueIndex"`
	UserLogin   UserLogin `gorm:"references:ID; constraint:OnDelete:CASCADE"`

	UserDetailID *uint
	UserDetail   UserDetail `gorm:"references:ID"`

	PositionID *uint
	Position   EmployeePosition `gorm:"references:ID"`

	SuperiorID *uint
	Superior   *Employee `gorm:"references:ID"`

	ManagePromotions []ManagePromotion `gorm:"foreignKey:EmployeeID"`
	Productstocks    []Productstock    `gorm:"foreignKey:EmployeeID"`

	ManageSalarys []*ManageSalary `gorm:"foreignkey:ManagerID"`

	EmployeeManageWorkTime []*ManageWorkTime `gorm:"foreignkey:EmployeeID"`
	ManagerManageWorkTime  []ManageWorkTime  `gorm:"foreignkey:ManagerID"`
}

type EmployeePosition struct {
	gorm.Model
	PositionName   string
	PositionNameTH string
	Salary         float64

	Employees []Employee `gorm:"foreignKey:PositionID"`
}
