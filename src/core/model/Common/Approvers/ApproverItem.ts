import { Entity, LookupValue } from "../../../infrastructure";

export class ApproverItem extends Entity {
    public Role: string;
    public User: LookupValue;

    public constructor(init?:Partial<ApproverItem>) {
        super();
        (<any>Object).assign(this, init);
    }
}
