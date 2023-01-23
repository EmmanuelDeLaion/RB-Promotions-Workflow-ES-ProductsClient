import { Entity, LookupValue } from "../../infrastructure";

export class ClientProduct extends Entity {
    public SKUNumber: string;
    public SKUDescription: string;
    public Product: LookupValue;
    public BusinessUnit: LookupValue;
    public Category: LookupValue;
    public Brand: LookupValue;
    public ClientId: number;
    public SKUProductId: number;
    public Price: number;
    public COGS: number;
    public Client: LookupValue;

    public constructor(init?:Partial<ClientProduct>) {
        super();
        (<any>Object).assign(this, init);
    }
}