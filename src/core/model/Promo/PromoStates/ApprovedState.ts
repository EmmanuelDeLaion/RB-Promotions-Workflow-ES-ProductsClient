import { PromoStatus } from "..";
import { Constants } from "../../..";
import { 
    CategoryRepository, 
    ClientRepository,  
    ProductRepository, 
    TypeRepository 
} from "../../../data";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";

export class ApprovedState extends PromoState {
    public GetStatusId(): number {
        return PromoStatus.Approved;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Approved;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.ReadOnlyForm = true;
        viewModel.ShowEvidenceButton = true;

        return viewModel;
    }
}