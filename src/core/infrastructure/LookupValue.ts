import { Entity } from "./Entity";

export class LookupValue extends Entity {    
    public Value: string;

    public constructor(init?:Partial<LookupValue>) {
        super();
        (<any>Object).assign(this, init);
    }
}