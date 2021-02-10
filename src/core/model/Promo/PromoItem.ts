import { CommonHelper } from "../../common/CommonHelper";
import { Entity, LookupValue } from "../../infrastructure";
import { Category, CategoryType, Product, Type } from "../Common";
import { LastYearVolumes } from "../Common/LastYearVolumes";

export class PromoItem extends Entity {
    public AdditionalID: string;
    public ShortDescription: string;
    public Category: Category;
    public Investment?: number;
    public Type: Type;
    public CappedActivity: boolean = false;
    public BusinessUnit: LookupValue;
    public Brand: LookupValue;
    public ProductCategory: LookupValue;
    public Product: Product;
    public StartDate: Date;
    public EndDate: Date;
    public DiscountPerPiece?: number = null;
    public NetPrice?: number = null;
    public COGS: number = null;
    public Redemption: number;    
    public BaseVolume: number;
    public EstimatedIncrementalVolume: number;
    public AdditionalInvestment: number;

    public LastYearVolumes: LastYearVolumes;
    public GetBaseGMSum?: (category: CategoryType) => number;

    public constructor(init?:Partial<PromoItem>) {
        super();
        (<any>Object).assign(this, init);
    }

    public GetCategoryType(): CategoryType {
        if(this.Category){
            switch (this.Category.Identifier)
            {
                case "{05BFEA39-DDD9-47D9-AAB4-2DAD6CAAABEB}":
                    return CategoryType.Performance;
                case "{5FF4CFF7-B36A-4CDC-99DA-A9A6DDFFC479}":
                    return CategoryType.ConsumerPromo;
                case "{2557D5A6-4DCA-4408-8CE5-84118914AA18}":
                    return CategoryType.Rollback;
                case "{786781CB-648F-433B-B719-6E0265058B5E}":
                    return CategoryType.SpecialExhibitions;
                case "{B4FF9158-9ED9-4FFB-9122-52D2D0AAC1F6}":
                    return CategoryType.Visibility;
                case "{B0C68395-D045-4786-928C-CF8620D6BB52}":
                    return CategoryType.Institutional;
                default:
                    return CategoryType.Unknown;
            }
        }

        return CategoryType.Unknown;
    }

    //#region Required fields

    public RequiresInvestment():boolean {
        switch (this.GetCategoryType()) {
            case CategoryType.Performance:
            case CategoryType.SpecialExhibitions:
            case CategoryType.Visibility:
            case CategoryType.Institutional:
                return true;
            default:
                return false;
        }        
    }

    public RequiresNetPrice():boolean {
        switch (this.GetCategoryType()) {
            case CategoryType.SpecialExhibitions:
            case CategoryType.Institutional: 
            case CategoryType.Unknown:           
                return false;
            default:
                return true;
        }
    }

    public RequiresDiscountPerPiece():boolean {
        switch (this.GetCategoryType()) {
            case CategoryType.ConsumerPromo:
            case CategoryType.Rollback:            
                return true;
            default:
                return false;
        }
    }

    public RequiresRedemption():boolean {
        return this.GetCategoryType() == CategoryType.ConsumerPromo && this.Type && this.Type.Name.toLowerCase() == "redemption";
    }

    public RequiresTotalEstimatedVolume(): boolean {
        switch (this.GetCategoryType()) {
            case CategoryType.SpecialExhibitions:
            case CategoryType.Institutional:    
            case CategoryType.Unknown:     
                return false;
            default:
                return true;
        }
    }

    public RequiresIncrementalVolumePercentage(): boolean {
        return this.RequiresTotalEstimatedVolume();
    }

    public RequiresBaseNR(): boolean {
        return this.RequiresNetPrice();
    }

    public RequiresBaseGM(): boolean {
        return this.RequiresNetPrice();
    }

    public RequiresEstimatedGMPromo(): boolean {
        return this.RequiresTotalEstimatedVolume();
    }

    //#endregion

    //#region Calculated values

    public GetDiscountPercentage(): number {
        if(this.RequiresDiscountPerPiece() && this.NetPrice > 0)
            return (this.DiscountPerPiece / this.NetPrice) * 100;

        return null;
    }

    public GetBEPNR(): number {
        if(this.GetCategoryType() == CategoryType.ConsumerPromo) {
            if(this.NetPrice > 0 && this.BaseVolume > 0)
                return (this.GetEstimatedInvestment() / this.NetPrice / this.BaseVolume) * 100;
        }
        else {
            if(this.NetPrice != null)
                return (this.NetPrice / (this.NetPrice - this.DiscountPerPiece || 0) - 1) * 100;
        }

        return null;
    }

    public GetGMPercentageNR(): number {
        if(this.NetPrice > 0)
            return ((this.NetPrice - this.COGS) / this.NetPrice) * 100;

        return null;
    }

    public GetGMPercentageNRWithPromo(): number {
        //TODO: Agregar campo RequiresDiscountPerPiece
        if(this.RequiresDiscountPerPiece() && this.NetPrice > 0)
            return ((this.NetPrice - this.DiscountPerPiece - this.COGS) / this.NetPrice) * 100;

        return null;
    }

    public GetGMBaseUnit(): number {
        return this.NetPrice - this.COGS;
    }

    public GetGMPromoUnit(): number {
        return this.NetPrice - this.DiscountPerPiece - this.COGS;
    }

    public GetBEPGM(): number {
        const gmBaseUnit = this.GetGMBaseUnit();
        if(this.RequiresDiscountPerPiece()) {
            if(this.GetCategoryType() == CategoryType.ConsumerPromo) {
                if(gmBaseUnit > 0 && this.BaseVolume > 0)
                    return (this.GetEstimatedInvestment() / gmBaseUnit / this.BaseVolume) * 100;
            }
            else {
                const gmPromoUnit = this.GetGMPromoUnit();
                if(gmPromoUnit > 0)
                    return (gmBaseUnit / gmPromoUnit - 1) * 100;
            }
        }

        return null;
    }

    public GetLastYearVolume(): number {
        if(this.LastYearVolumes && CommonHelper.IsDate(this.StartDate) && CommonHelper.IsDate(this.EndDate) && this.EndDate >= this.StartDate) {            
            let currentDate = new Date(this.StartDate.getTime());
            let currentMonth = currentDate.getMonth();
            let dailyVolume = this.LastYearVolumes.GetDailyVolume(currentDate.getFullYear() - 1, currentMonth);
            let volume = 0;

            while(this.EndDate >= currentDate) {                
                volume += dailyVolume;
                currentDate.setDate(currentDate.getDate() + 1);

                let month = currentDate.getMonth();

                if(month != currentMonth) {
                    currentMonth = month;
                    dailyVolume = this.LastYearVolumes.GetDailyVolume(currentDate.getFullYear() - 1, currentMonth);
                }
            }

            return volume;
        }

        return null;
    }

    public GetAverageVolumeL3Months(): number {
        if(this.LastYearVolumes && CommonHelper.IsDate(this.StartDate)) 
            return this.LastYearVolumes.GetAverageVolumeL3Months(this.StartDate.getMonth());

        return null;
    }

    public GetTotalEstimatedVolume(): number {
        return this.RequiresTotalEstimatedVolume() ? (this.BaseVolume || 0) + (this.EstimatedIncrementalVolume || 0) : null;
    }

    public GetIncrementalVolumePercentage(): number {
        if(this.RequiresIncrementalVolumePercentage())
            return this.BaseVolume > 0 ? ((this.EstimatedIncrementalVolume || 0)/this.BaseVolume) * 100 : 0;

        return null;
    }

    public GetBaseNR(): number {
        if(this.RequiresBaseNR())
            return (this.BaseVolume || 0) * (this.NetPrice || 0);

        return null;
    }

    public GetBaseGM(): number {
        if(this.RequiresBaseGM())
            return (this.BaseVolume || 0) * (this.GetGMBaseUnit() || 0);

        return null;
    }

    public GetEstimatedGMPromo(): number {
        if(this.RequiresEstimatedGMPromo()) 
            return (this.GetTotalEstimatedVolume() || 0) * (this.GetGMBaseUnit() || 0);

        return null;
    }

    public GetEstimatedInvestment(): number {
        switch (this.GetCategoryType()) {
            case CategoryType.Visibility:
            case CategoryType.Performance:
                const baseGMSum = this.GetBaseGMSum(this.GetCategoryType());
                return baseGMSum > 0 ? (this.GetBaseGM() / baseGMSum) * (this.Investment || 0): 0;
            case CategoryType.Institutional:
            case CategoryType.SpecialExhibitions:
                return this.Investment || 0;
            case CategoryType.ConsumerPromo:
                if(this.Type != null && this.Type.Name.toLowerCase() == "redemption")
                    return this.BaseVolume * (this.Redemption/100) * this.DiscountPerPiece;
                else    
                    return this.GetTotalEstimatedVolume() * this.DiscountPerPiece;
            default:
                return this.GetTotalEstimatedVolume() * this.DiscountPerPiece;
        }
    }

    public GetROI(): number {
        const value1 = (this.GetEstimatedGMPromo() || 0) - (this.GetBaseGM() || 0);
        const value2 = (this.GetEstimatedInvestment() || 0) + (this.AdditionalInvestment || 0);

        if(value2 > 0)
            return value1/value2;

        return null;
    }

    public IsEffective(): boolean {
        const roi = this.GetROI();
        return (roi != null && roi >=1);
    }

    //#endregion

    //#region Numbers as strings

    public GetInvestmentAsString():string {
        return this.Investment != null ? this.Investment.toString() : null;
    }

    public GetDiscountPerPieceAsString():string {
        return this.DiscountPerPiece != null ? this.DiscountPerPiece.toString() : null;
    }

    public GetNetPriceAsString():string {
        return this.NetPrice != null ? this.NetPrice.toFixed(2) : "0.0";
    }

    public GetDiscountPercentageAsString(): string {
        const discountPercentage = this.GetDiscountPercentage();
        return discountPercentage != null ? discountPercentage.toFixed(2) : "0.0";
    }

    public GetBEPNRAsString(): string {
        const value = this.GetBEPNR();
        return value != null ? value.toFixed(1) : "0.0";
    }

    public GetCOGSAsString():string {
        return this.COGS != null ? this.COGS.toFixed(2) : "-";
    }

    public GetGMPercentageNRAsString(): string {
        const gmPercentageNR = this.GetGMPercentageNR();
        return gmPercentageNR != null ? gmPercentageNR.toFixed(2) : "0.0";
    }

    public GetGMPercentageNRWithPromoAsString(): string {
        const gmPercentageNRWithPromo = this.GetGMPercentageNRWithPromo();
        return gmPercentageNRWithPromo != null ? gmPercentageNRWithPromo.toFixed(2) : "0.0";
    }

    public GetGMBaseUnitAsString(): string {
        const gmBaseUnit = this.GetGMBaseUnit();
        return gmBaseUnit != null ? gmBaseUnit.toFixed(2) : "0.0";
    }

    public GetGMPromoUnitAsString(): string {
        const gmPromoUnit = this.GetGMPromoUnit();
        return gmPromoUnit != null ? gmPromoUnit.toFixed(2) : "0.0";
    }

    public GetBEPGMAsString(): string {
        const value = this.GetBEPGM();
        return value != null ? value.toFixed(1) : "0.0";
    }

    public GetLastYearVolumeAsString(): string {
        const value = this.GetLastYearVolume();
        return value != null ? value.toFixed(0) :  null;
    }

    public GetAverageVolumeL3MonthsAsString(): string {
        const value = this.GetAverageVolumeL3Months();
        return value != null ? value.toFixed(0) :  null;
    }

    public GetRedemptionAsString(): string {
        return this.Redemption != null ? this.Redemption.toString() : null;
    }

    public GetBaseVolumeAsString(): string {
        return this.BaseVolume != null ? this.BaseVolume.toString() : null;
    }

    public GetEstimatedIncrementalVolumeAsString(): string {
        return this.EstimatedIncrementalVolume != null ? this.EstimatedIncrementalVolume.toString() : null;
    }

    public GetAdditionalInvestmentAsString(): string {
        return this.AdditionalInvestment != null ? this.AdditionalInvestment.toString() : null;
    }

    public GetTotalEstimatedVolumeAsString(): string {
        const value = this.GetTotalEstimatedVolume();
        return value != null ? value.toFixed(1) :  null;
    }

    public GetIncrementalVolumePercentageAsString(): string {
        const value = this.GetIncrementalVolumePercentage();
        return value != null ? value.toFixed(1) :  null;
    }

    public GetBaseNRAsString(): string {
        const value = this.GetBaseNR();
        return value != null ? value.toFixed(1) :  null;
    }

    public GetBaseGMAsString(): string {
        const value = this.GetBaseGM();
        return value != null ? value.toFixed(1) :  null;
    }

    public GetEstimatedGMPromoAsString(): string {
        const value = this.GetEstimatedGMPromo();
        return value != null ? value.toFixed(1) :  null;
    }

    public GetEstimatedInvestmentAsString(): string {
        const value = this.GetEstimatedInvestment();
        return value != null ? value.toFixed(0) : null;
    }

    public GetROIAsString(): string {
        const value = this.GetROI();
        return value != null ? value.toFixed(2) : "0.00";
    }    

    //#endregion
}