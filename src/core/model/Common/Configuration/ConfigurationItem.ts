import { Entity, LookupValue } from "../../../infrastructure";

export class ConfigurationItem extends Entity {
    public Key: string;
    public Value: string;

    public constructor(init?:Partial<ConfigurationItem>) {
        super();
        (<any>Object).assign(this, init);
    }
}
