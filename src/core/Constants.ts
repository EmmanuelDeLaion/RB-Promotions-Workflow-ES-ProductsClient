import { IDatePickerStrings } from "office-ui-fabric-react";
import * as strings from 'PromoFormWebPartWebPartStrings';


export namespace Constants {
    export class StatusTexts{
        public static NewPromo = strings.NewPromotion; //Nueva promoción
        public static DraftPromo = strings.Draft; //Borrador
        public static Approval = strings.InApprovalProcess; //Aprobación
        public static Approved = strings.Approved; //Aprobada
        public static Rejected = strings.Rejected; //Rechazada
    }

    export class Messages {
        public static NotAllowedAction = strings.ActionNotAllowed;
        public static RequiredField:string = strings.FieldRequired;
    }

    export class Groups {
        public static ReadOnlyBaseGroupName = "RB - Solo consulta";
        public static KAMsBaseGroupName = "RB - KAMs";
    }

    export class Miscellaneous{
        public static DayPickerStrings: IDatePickerStrings = {
            months: [
              strings.January,
              strings.February,
              strings.March,
              strings.April,
              strings.May,
              strings.June,
              strings.July,
              strings.August,
              strings.September,
              strings.Octuber,
              strings.November,
              strings.December
            ],

            shortMonths: [
              strings.Jan,
              strings.Feb,
              strings.Mar,
              strings.Apr,
              strings.May,
              strings.Jun,
              strings.Jul,
              strings.Aug,
              strings.Sep,
              strings.Oct,
              strings.Nov,
              strings.Dec
            ],

            days: [
              strings.Sunday,
              strings.Monday,
              strings.Tuesday,
              strings.Wednesday,
              strings.Thursday,
              strings.Friday,
              strings.Saturday
            ],

            shortDays: [
              strings.DS,
              strings.DM,
              strings.DT,
              strings.DW,
              strings.DT,
              strings.DF,
              strings.DS
            ],

            goToToday: strings.GoToToday,
            prevMonthAriaLabel: strings.GoToThePreviousMonth,
            nextMonthAriaLabel: strings.GoToTheNextMonth,
            prevYearAriaLabel: strings.GoToThePreviousYear,
            nextYearAriaLabel: strings.GoToTheNextYear,
            closeButtonAriaLabel: 'Cerrar',

            isRequiredErrorMessage: strings.FieldRequired,

            invalidInputErrorMessage: strings.InvalidDateFormat
        };

        public static ClearSelectionText = strings.DeleteSelection;
    }
}
