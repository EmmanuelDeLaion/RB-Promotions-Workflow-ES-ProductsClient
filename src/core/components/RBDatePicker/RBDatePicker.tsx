import * as React from 'react';
import { DatePicker, DayOfWeek, Label } from "office-ui-fabric-react";
import { Constants } from '../../Constants';
import { CommonHelper } from '../../common/CommonHelper';
import * as strings from 'PromoFormWebPartWebPartStrings';

interface IRBDatePickerProps {
    label: string;
    required: boolean;
    onSelectDate: (date: Date) => void;
    value: Date;
    errorMessage?: string;
    minDate?: Date;
    maxDate?: Date;
    isDisabled: boolean
}

export class RBDatePicker extends React.Component<IRBDatePickerProps, {}> {

    constructor(props: IRBDatePickerProps) {
        super(props);
    }

    public render(): React.ReactElement<IRBDatePickerProps> {
        return (
            <div className={CommonHelper.IsNullOrEmpty(this.props.errorMessage) ? "" : "datePickerError"}>
                <Label required={this.props.required}>{this.props.label}</Label>
                <DatePicker
                    firstDayOfWeek={DayOfWeek.Monday}
                    strings={Constants.Miscellaneous.DayPickerStrings}
                    placeholder={strings.SelectADate}
                    ariaLabel={strings.SelectADate}
                    value={this.props.value}
                    onSelectDate={this.onSelectDate.bind(this)}
                    formatDate={CommonHelper.formatDate}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    disabled={this.props.isDisabled}
                />
                <div hidden={CommonHelper.IsNullOrEmpty(this.props.errorMessage)} role="alert" className="errorMessage">{this.props.errorMessage}</div>
            </div>
        );
    }

    private onSelectDate(date: Date | null | undefined) {
        this.props.onSelectDate(date);
    }
}
