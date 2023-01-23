import { Entity } from "../../infrastructure";

export class NotificationTemplate extends Entity {    
    public Subject: string;
    public Body: string;
    
    public constructor(init?:Partial<NotificationTemplate>) {
        super();
        (<any>Object).assign(this, init);
    }
}