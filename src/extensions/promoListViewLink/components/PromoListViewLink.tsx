import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './PromoListViewLink.module.scss';
import { PromoFormDialog } from '../../../core/components/PromoForm';
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPromoListViewLinkProps {
  itemId: number;
  title: string;
  context: ExtensionContext | WebPartContext;
}

const LOG_SOURCE: string = 'PromoListViewLink';

export default class PromoListViewLink extends React.Component<IPromoListViewLinkProps, {}> {
  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: PromoListViewLink mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: PromoListViewLink unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.cell}>
        <a className="ms-Link" onClick={() => this.openPromoFormDialog()}><span className={styles.link}>{this.props.title}</span></a>
      </div>
    );
  }

  private openPromoFormDialog(): void{
    var dialog: PromoFormDialog = new PromoFormDialog(this.props.itemId);
    dialog.context = this.props.context;
    dialog.show();
  }
}
