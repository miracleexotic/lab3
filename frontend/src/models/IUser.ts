export interface UserRolesInterface {
    ID: number;
    RoleName: string;
}

export interface UserDetailsInterface {
    ID: number;

    PrefixID: number;
    Prefix: PrefixesInterface;

    FirstName: string;
    LastName: string;
    PersonalID: string;
    PhoneNumber: string;
    Address: string;

    GenderID: number;
    Gender: GendersInterface;
}

export interface GendersInterface {
    ID: number;
    GenderName: string;
}

export interface PrefixesInterface {
    ID: number;
    PrefixName: string;
}

export interface MembersInterface {
    ID: number;
    
    UserDetailID: number;
    UserDetail: UserDetailsInterface;

    // Orders: PurchaseOrdersInterface[];
}

export interface EmployeesInterface {
    ID: number;

    UserDetailID: number;
    UserDetail: UserDetailsInterface;

    PositionID: number;
    Position: EmployeePositionsInterface;

    SuperiorID: number;
    Superior: EmployeesInterface;
}

export interface EmployeePositionsInterface {
    ID: number;
    PositionName: string;
    PositionNameTH: string;
    Salary: number;
}
