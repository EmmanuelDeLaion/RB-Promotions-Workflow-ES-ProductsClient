import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPromoFormProps {
    itemId?: number;
    title: string;
    close?: () => void;
    submit?: () => void;  
    context: ExtensionContext | WebPartContext;  
}