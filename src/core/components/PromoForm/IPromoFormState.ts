import { ActionConfirmationType } from "../../infrastructure";
import { Product } from "../../model/Common";
import { PromoViewModel } from "../../model/Promo/PromoViewModel";

export interface IPromoFormState {
    isLoading: boolean;
    hasValidationError: boolean;
    enableSubmit: boolean;
    formSubmitted: boolean;
    resultIsOK: boolean;
    viewModel?: PromoViewModel;
    errorMessage?: string; 
    selectedIndex: number;
    loadingTypes: boolean;
    filteredProducts: Product[];
    actionsComments?: string;

    mainModalOpen: boolean;
    hideDeleteProductDialog: boolean;
    hideSavingSpinnerConfirmationDialog: boolean;    
    hideModalConfirmationDialog: boolean;
    hideActionConfirmationDialog: boolean;
    hideDeleteEvidenceDialog: boolean;
    actionConfirmationDialogTitle?: string;
    actionConfirmationDialogType?: ActionConfirmationType;
    enableActionValidation: boolean;
    promotionTitle: string;
}