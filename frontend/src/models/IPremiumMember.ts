import { MembersInterface } from "./IUser";
import { MemberClassInterface } from "./IMemberClass";
import { PremiumMemberPeriodInterface } from "./IPremiumMemberPeriod"


export interface PremiumMemberInterface {
    ID : number;

    MemberID: number;
    Member: MembersInterface;

    MemberClassID: number;
    MemberClass: MemberClassInterface;

    PremiumMemberPeriodID: number;
    PreMiumMemberPeriod: PremiumMemberPeriodInterface;

    PremiumMemberID : string;
    Point : number;
    CreateAt: Date;
    
}