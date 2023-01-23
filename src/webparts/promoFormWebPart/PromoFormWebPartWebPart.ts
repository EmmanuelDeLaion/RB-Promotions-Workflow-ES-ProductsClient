import { override } from '@microsoft/decorators';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PromoFormWebPartWebPartStrings';
import { IPromoFormLinkProps, PromoFormLink } from '../../core/components/PromoForm';
import { sp } from '@pnp/sp';
import { CommonHelper } from '../../core/common';

export interface IPromoFormWebPartWebPartProps {
  description: string;
}

export default class PromoFormWebPartWebPart extends BaseClientSideWebPart <IPromoFormWebPartWebPartProps> {

  @override
  protected onInit(): Promise<void> {
    return super.onInit().then(_ => { 
      CommonHelper.ensurePnPJs(this.context);
    });
  }

  public render(): void {
    const element: React.ReactElement<IPromoFormLinkProps> = React.createElement(
      PromoFormLink,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
