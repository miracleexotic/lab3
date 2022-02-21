import { ManageWorkTimeInterface } from "./IManageWorkTime";
import { EmployeesInterface } from "./IUser";

export interface AssessmentInterface {
    ID: number
    Level: number
    Name: string
}

export interface BonusStatusInterface {
    ID: number
    Name: string
}

export interface ManageSalaryInterface {
    ID: number

    ManagerID: number
    Manager: EmployeesInterface
    
    ManageWorkTimeID: number
    ManageWorkTime: ManageWorkTimeInterface
    
    AssessmentID: number
    Assessment: AssessmentInterface
    
    BonusAmount: number
    BonusDetail: string
    
    BonusStatusID: number
    BonusStatus: BonusStatusInterface
    
    CreateAt: Date
}