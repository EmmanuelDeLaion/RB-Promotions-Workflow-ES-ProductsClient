import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'PromoListViewLinkFieldCustomizerStrings';
import PromoListViewLink, { IPromoListViewLinkProps } from './components/PromoListViewLink';
import { CommonHelper } from '../../core/common';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IPromoListViewLinkFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'PromoListViewLinkFieldCustomizer';

export default class PromoListViewLinkFieldCustomizer
  extends BaseFieldCustomizer<IPromoListViewLinkFieldCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    return super.onInit().then(_ => { 
      CommonHelper.ensurePnPJs(this.context);
    });
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    const promoListViewLink: React.ReactElement<{}> =
      React.createElement(PromoListViewLink, { 
        context: this.context,
        itemId: event.listItem.getValueByName("ID"),
        title: event.listItem.getValueByName("Title") } as IPromoListViewLinkProps);

    ReactDOM.render(promoListViewLink, event.domElement);
  }

  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }
}
