import { Category, Client, ClientProduct, Product, Type } from "../Common";
import { Promo } from "./Promo";
import * as strings from 'PromoFormWebPartWebPartStrings';


export class PromoViewModel {
    public Entity: Promo;

    constructor(entity: Promo){
        this.Entity = entity;
        this.ReadOnlyForm = false;
    }

    public ReadOnlyForm: boolean;

    //#region Collections

    public Clients: Client[];
    public Categories: Category[];
    public Types: Type[];
    //public Products: Product[];
    public ClientProducts : ClientProduct[];

    //#endregion

    public GetPromotionTitle(): string {
        if(this.Entity != null && this.Entity.Name && this.Entity.Client != null)
            return this.Entity.Client.Name + " - " + this.Entity.Name;

        return strings.NewPromotion;
    }

    public ShowSaveButton: boolean;
    public ShowSubmitButton: boolean;
    public ShowApproveButton: boolean;
    public ShowRejectButton: boolean;
    public ShowEvidenceButton: boolean;
}
