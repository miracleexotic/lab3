import { NamePromotionsInterface } from "./INamePromotion";
import { PromotionPeriodsInterface } from "./IPromotionPeriod";
import { PromotionTypesInterface } from "./IPromotionType";

export interface ManagePromotionsInterface {
    ID: number;

   NamePromotionID: number;
   NamePromotion: NamePromotionsInterface;

   PromotionPeriodID: number;
   PromotionPeriod: PromotionPeriodsInterface;

   PromotionTypeID: number;
   PromotionType: PromotionTypesInterface;

   MinPrice: number;
   Quantity: number;
   Discount: number; 
   
   PromotionCode: string;

   Createdatetime: Date;


}