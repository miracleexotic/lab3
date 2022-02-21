import { MembersInterface } from "./IUser";
import { ProductstocksInterface } from "./IProductstock";
import { ManagePromotionsInterface } from "./IManagePromotion";

export interface PaymentMethodsInterface {
    ID: number;
    MethodName: string;
}

export interface PurchaseOrdersInterface {
    ID: number;

    MemberID: number;
    Member: MembersInterface;

    PromotionID: number;
    Promotion: ManagePromotionsInterface;

    PaymentMethodID: number;
    PaymentMethod: PaymentMethodsInterface;

    OrderTime: Date;
    DeliveryAddress: string;
    OrderDiscount: number;
    OrderTotalPrice: number;

    OrderItems: PurchaseOrderItemsInterface[];
}

export interface PurchaseOrderItemsInterface {
    ID: number;

    OrderID: number;
    Order: PurchaseOrdersInterface;

    ProductstockID: number;
    Productstock: ProductstocksInterface;
    OrderAmount: number;
    ItemPrice: number;

    AmountPrice: number;
}