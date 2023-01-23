import { Entity, LookupValue } from "../../infrastructure";

export class Product extends Entity {
    public SKUNumber: string;
    public SKUDescription: string;
    public BusinessUnit: LookupValue;
    public Category: LookupValue;
    public Brand: LookupValue;
    //public Clientes: LookupValue;

    public constructor(init?:Partial<Product>) {
        super();
        (<any>Object).assign(this, init);
    }
}