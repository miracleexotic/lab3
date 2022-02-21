import { EmployeesInterface } from "./IUser";
export interface ProductstocksInterface {
    ID : number,
    Amount_remain:number,
    Update_datetime : Date,
    Detail:string,
    ProductID :number,
    Product :ProductsInterface,
    ShelfstoreID:number,
    Shelfstore:ShelfstoresInterface,
    EmployeeID:number,
    Employee:EmployeesInterface
}

export interface ProductsInterface {
    ID : number,
    Name : string,
    Price : number,
    TypeproductID : number,
    Typeproduct: TypeproductsInterface,
}
export interface TypeproductsInterface {
    ID : number,
    Name : string,
}
export interface ShelfstoresInterface {
    ID: number,
    Zone:string,
}