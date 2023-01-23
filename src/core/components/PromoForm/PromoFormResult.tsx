import * as React from 'react';
import { DialogContent } from 'office-ui-fabric-react';
import styles from './PromoForm.module.scss';

export interface IPromoFormResultResultProps {
  title:string;
  message: string;
  isSuccess: boolean;
  close: () => void;
  successMessageTimeout?: number;
}

export class PromoFormResult extends React.Component<IPromoFormResultResultProps, {}>{

  constructor(props: IPromoFormResultResultProps) {
    super(props);
  }

  public render(): React.ReactElement<IPromoFormResultResultProps> {
    var containerClass: string = this.props.isSuccess ? styles.successMessageContainer : styles.errorMessageContainer; 
    var fontClass: string = this.props.isSuccess ? "ms-fontColor-neutralPrimary" : "ms-fontColor-red";

    return (
      <DialogContent title={this.props.title} showCloseButton={true} onDismiss={this.props.close} className={styles.promoForm}>
        <div className={containerClass}>
          <span style={{ fontStyle: 'italic' }} className={["ms-font-xl", fontClass].join(" ")} >
            {this.props.message}
          </span>
        </div>
      </DialogContent>      
    );
  }

  public componentDidMount(){
    this.timeoutClose();
  }

  private timeoutClose():void{
    var timeoutSec = this.props.successMessageTimeout || 5;
    if(this.props.isSuccess){
      setTimeout(this.props.close, timeoutSec*1000);
    }
  }
}