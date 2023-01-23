import { Entity, LookupValue } from "../../infrastructure";

export class Category extends Entity {
    public Name: string;
    public Identifier: string;

    public constructor(init?:Partial<Category>) {
        super();
        (<any>Object).assign(this, init);
    }
}