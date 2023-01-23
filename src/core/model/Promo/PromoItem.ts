import { CommonHelper } from "../../common/CommonHelper";
import { Entity, LookupValue } from "../../infrastructure";
import { Category, CategoryType, ClientProduct, Product, Type } from "../Common";
import { LastYearVolumes } from "../Common/LastYearVolumes";

export class PromoItem extends Entity {
    public AdditionalID: string = "";
    public ShortDescription: string = "";
    public Category: Category;
    public Investment?: number;
    public Type: Type;
    public CappedActivity: boolean = false;
    public BusinessUnit: LookupValue;
    public Brand: LookupValue;
    public ProductCategory: LookupValue;
    public ClientProduct: ClientProduct;
    public Product: Product;
    //public SKUNumber: string;
    public StartDate: Date;
    public EndDate: Date;
    public DiscountPerPiece?: number = null;
    public NetPrice?: number = null;
    public COGS: number = null;
    public Redemption: number;    
    public BaseVolume: number;
    public EstimatedIncrementalVolume: number;
    public AdditionalInvestment: number;
    public Client: LookupValue;

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

    //TODO: Los métodos que retornan "true" se deben eliminar una vez que se confirme que todo funciona correctamente

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
/*         switch (this.GetCategoryType()) {
            case CategoryType.SpecialExhibitions:
            case CategoryType.Institutional: 
            case CategoryType.Unknown:           
                return false;
            default:
                return true;
        } */ 
        return true;
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
        //return this.GetCategoryType() != CategoryType.Institutional;
        return true;
    }

    public RequiresEstimatedNR(): boolean {
        //return this.GetCategoryType() != CategoryType.Institutional;
        return true;
    }

    public RequiresIncrementalEstimatedNR(): boolean {
        //return this.GetCategoryType() != CategoryType.Institutional;
        return true;
    }

    public RequiresBaseGM(): boolean {
        //return this.RequiresNetPrice();
        return true;
    }

    public RequiresEstimatedGMPromo(): boolean {
        //return this.RequiresTotalEstimatedVolume();
        return true;
    }

    public RequiresIncrementalGM(): boolean {
/*         switch (this.GetCategoryType()) {
            case CategoryType.SpecialExhibitions:
            case CategoryType.Institutional:
            case CategoryType.Visibility:
            case CategoryType.Performance:
            case CategoryType.Unknown:     
                return false;
            default:
                return true;
        } */
        return true;
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

    public GetEstimatedNR(): number {
        if(this.RequiresEstimatedNR()) {
            if(this.GetCategoryType() == CategoryType.ConsumerPromo)
                return (this.GetTotalEstimatedVolume() || 0) * (this.NetPrice || 0) - (this.GetEstimatedInvestment() || 0);
            else
                return (this.GetTotalEstimatedVolume() || 0) * ((this.NetPrice || 0) - (this.RequiresDiscountPerPiece() ? (this.DiscountPerPiece || 0) : 0));
        }            

        return null;
    }

    public GetIncrementalEstimatedNR(): number {
        if(this.RequiresIncrementalEstimatedNR()) {
            return (this.GetEstimatedNR() || 0) - (this.GetBaseNR() || 0);
        }            

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
        let investment: number = 0;

        switch (this.GetCategoryType()) {
            case CategoryType.Visibility:
            case CategoryType.Institutional:
            case CategoryType.Performance:
                const baseGMSum = this.GetBaseGMSum(this.GetCategoryType());
                investment = (baseGMSum > 0 ? (this.GetBaseGM() / baseGMSum) * (this.Investment || 0): 0);
                break;            
            case CategoryType.SpecialExhibitions:
                investment = this.Investment || 0;
                break;
            case CategoryType.ConsumerPromo:
                if(this.Type != null && this.Type.Name.toLowerCase() == "redemption")
                    investment = this.GetTotalEstimatedVolume() * (this.Redemption/100) * this.DiscountPerPiece;
                else    
                    investment = this.GetTotalEstimatedVolume() * this.DiscountPerPiece;
                break;
            default:
                investment = this.GetTotalEstimatedVolume() * this.DiscountPerPiece;
                break;
        }

        investment += this.AdditionalInvestment || 0;

        return investment;
    }

    public GetIncrementalGM(): number {
        if(this.RequiresIncrementalGM()) {
            return (this.GetEstimatedGMPromo() || 0) - (this.GetBaseGM() || 0);
        }

        return null;
    }

    public GetROI(): number {
        const value1 = (this.GetEstimatedGMPromo() || 0) - (this.GetBaseGM() || 0);
        //En la siguiente línea se excluye la inversión adicional MKT por estar ya incluída 
        //en la inversión estimada (lo cual fue un cambio)
        const value2 = (this.GetEstimatedInvestment() || 0);// + (this.AdditionalInvestment || 0);

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
        return this.Investment != null ? this.Investment.toString() : "";
    }

    public GetDiscountPerPieceAsString():string {
        return this.DiscountPerPiece != null ? this.DiscountPerPiece.toString() : "";
    }
        
    public GetNetPriceAsString():string {
        return this.NetPrice != null ? this.NetPrice.toFixed(2) : "0.00";
    }

    public GetDiscountPercentageAsString(): string {
        const discountPercentage = this.GetDiscountPercentage();
        return discountPercentage != null ? discountPercentage.toFixed(2) : "0.0";
    }

    public GetBEPNRAsString(): string {
        const value = this.GetBEPNR();
        return value != null ? value.toFixed(2) : "0.00";
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
        return value != null ? value.toFixed(2) : "0.00";
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
        return this.Redemption != null ? this.Redemption.toString() : "";
    }

    public GetBaseVolumeAsString(): string {
        return this.BaseVolume != null ? this.BaseVolume.toString() : "";
    }

    public GetEstimatedIncrementalVolumeAsString(): string {
        return this.EstimatedIncrementalVolume != null ? this.EstimatedIncrementalVolume.toString() : "";
    }

    public GetAdditionalInvestmentAsString(): string {
        return this.AdditionalInvestment != null ? this.AdditionalInvestment.toString() : "";
    }

    public GetTotalEstimatedVolumeAsString(): string {
        const value = this.GetTotalEstimatedVolume();
        return value != null ? value.toFixed(0) :  null;
    }

    public GetIncrementalVolumePercentageAsString(): string {
        const value = this.GetIncrementalVolumePercentage();
        return value != null ? value.toFixed(2) :  null;
    }

    public GetBaseNRAsString(): string {
        const value = this.GetBaseNR();
        return value != null ? value.toLocaleString() : null;
    }

    public GetEstimatedNRAsString(): string {
        const value = this.GetEstimatedNR();
        return value != null ? value.toLocaleString() : null;
    }

    public GetIncrementalEstimatedNRAsString(): string {
        const value = this.GetIncrementalEstimatedNR();
        return value != null ? value.toLocaleString() : null;
    }

    public GetBaseGMAsString(): string {
        const value = this.GetBaseGM();
        return value != null ? value.toLocaleString() :  null;
    }

    public GetEstimatedGMPromoAsString(): string {
        const value = this.GetEstimatedGMPromo();
        return value != null ? value.toLocaleString() :  null;
    }

    public GetIncrementalGMAsString(): string {
        const value = this.GetIncrementalGM();
        return value != null ? value.toLocaleString() :  null;
    }

    public GetEstimatedInvestmentAsString(): string {
        const value = this.GetEstimatedInvestment().toLocaleString();

        return value != null ? value.toLocaleString() : null;
    }

    public GetROIAsString(): string {
        const value = this.GetROI();
        return value != null ? value.toFixed(2) : "0.00";
    }    

    //#endregion

    public IsValid(): boolean {
        var invalidCount = 0;

        if (CommonHelper.IsNullOrEmpty(this.ShortDescription)) invalidCount++;
        if (this.Category == null) invalidCount++;
        if (this.RequiresInvestment() && !(this.Investment > 0)) invalidCount++;
        if (this.Type == null) invalidCount++;
        if (this.BusinessUnit == null) invalidCount++;
        if (this.Brand == null) invalidCount++;
        //if (this.Product == null) invalidCount++;
        if (this.ClientProduct == null) invalidCount++;
        if (this.ProductCategory == null) invalidCount++;
        //if (this.Client == null) invalidCount++;
        if (!CommonHelper.IsDate(this.StartDate)) invalidCount++;
        if (!CommonHelper.IsDate(this.EndDate)) invalidCount++;
        if (this.RequiresDiscountPerPiece() && !(this.DiscountPerPiece > 0)) invalidCount++;
        if (this.RequiresRedemption() && !(this.Redemption > 0)) invalidCount++;
        if (!(this.BaseVolume > 0)) invalidCount++;
        if (!(this.EstimatedIncrementalVolume > 0)) invalidCount++;

        return invalidCount == 0;
    }
}