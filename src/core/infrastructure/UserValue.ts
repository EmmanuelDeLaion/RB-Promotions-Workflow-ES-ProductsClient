import { Entity } from "./Entity";
import { LookupValue } from "./LookupValue";

export class UserValue extends LookupValue {    
    public Email: string;

    public constructor(init?:Partial<LookupValue>) {
        super();
        (<any>Object).assign(this, init);
    }
}