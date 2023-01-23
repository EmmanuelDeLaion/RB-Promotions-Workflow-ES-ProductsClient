import { CommonHelper } from "../../common/CommonHelper";
import { Entity, LookupValue } from "../../infrastructure";

export class WorkflowLog extends Entity {
    public DateAndTime: Date;
    public User: LookupValue;
    public Action: string;
    public Comments: string;

    public constructor(init?:Partial<WorkflowLog>) {
        super();
        (<any>Object).assign(this, init);
    }

    public DateAndTimeAsString() {
        return this.DateAndTime != null ? (CommonHelper.formatDate(this.DateAndTime) + " " + this.DateAndTime.toLocaleTimeString()) : "";
    }
}