import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog } from '@microsoft/sp-dialog';
import { PromoForm } from './PromoForm';
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export class PromoFormDialog extends BaseDialog {
    public title: string;
    public itemId?: number;
    public context: ExtensionContext | WebPartContext;

    constructor(itemId?: number) {
        super({isBlocking: true});
        this.itemId = itemId;
    }

    protected onAfterClose(): void {
        super.onAfterClose();
   
        // Clean up the element for the next dialog
        ReactDOM.unmountComponentAtNode(this.domElement);
    }

    protected render(): void {
        ReactDOM.render(
        <div>
            <PromoForm                 
                itemId={this.itemId}
                title={this.title} 
                close={ this.close }
                submit={ this.submit }
                context={this.context}                
            />
            </div>
            , this.domElement);
    }

    private submit(): void {
        this.close();      
    }
}