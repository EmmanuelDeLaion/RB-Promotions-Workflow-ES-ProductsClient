import { Entity, LookupValue } from "../../infrastructure";
import { Channel } from "./Channel";

export class Client extends Entity {
    public Name: string;
    public Channel: Channel;
    public Subchannel: LookupValue;
    public KeyAccountManager: LookupValue;

    public constructor(init?:Partial<Client>) {
        super();
        (<any>Object).assign(this, init);
    }
}