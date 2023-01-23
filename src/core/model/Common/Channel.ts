import { Entity, LookupValue } from "../../infrastructure";

export class Channel extends Entity {
    public Name: string;
    public HeadOfChannel: LookupValue;
}