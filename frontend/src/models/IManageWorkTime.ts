import { EmployeesInterface } from "./IUser";

export interface DayInterface {
    ID: number,
    DayNumber: string
}

export interface WeeklyInterface {
    ID: number,
    WeekAt: string
}

export interface MonthInterface {
    ID: number,
    MonthOfYear: string
}

export interface StartWorkTimeInterface {
    ID: number,
    TimeStart: string
}

export interface EndWorkTimeInterface {
    ID: number,
    TimeEnd: string
}
export interface ManageWorkTimeInterface {
    ID: number,
    Comment: string,
    WorkingDate: string,
    TimeTotal: number,

    ManagerID: number,
    Manager: EmployeesInterface,

    EmployeeID: number,
    Employee: EmployeesInterface,

    DayID: number,
    Day: DayInterface,

    MonthID: number,
    Month: MonthInterface,
    
    StartWorkTimeID: number,
    StartWorkTime: StartWorkTimeInterface,

    EndWorkTimeID: number,
    EndWorkTime: EndWorkTimeInterface
}