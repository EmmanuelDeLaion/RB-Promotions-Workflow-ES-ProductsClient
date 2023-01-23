import { Entity } from "../../infrastructure";

export class Type extends Entity {
    public Name: string;

    public constructor(init?:Partial<Type>) {
        super();
        (<any>Object).assign(this, init);
    }
}