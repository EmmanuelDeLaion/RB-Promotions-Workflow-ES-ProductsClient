import { FieldDisplayMode, LookupValue } from "../../infrastructure";
import { Category, Client, Product, Type } from "../Common";
import { Promo } from "./Promo";

export class PromoViewModel {
    public Entity: Promo;

    constructor(entity: Promo){
        this.Entity = entity;
    }

    //#region Collections

    public Clients: Client[];
    public Categories: Category[];
    public Types: Type[];
    public BusinessUnits: LookupValue[];
    public Brands: LookupValue[];
    public ProductCategories: LookupValue[];
    public Products: Product[];

    //#endregion

    public GetPromotionTitle(): string {
        if(this.Entity != null && this.Entity.Name && this.Entity.Client != null)
            return this.Entity.Client.Name + " - " + this.Entity.Name;

        return "Nueva promoción";
    }
}