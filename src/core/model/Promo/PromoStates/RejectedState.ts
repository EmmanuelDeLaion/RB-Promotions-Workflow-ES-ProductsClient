import { Promo, PromoStatus } from "..";
import { Constants } from "../../..";
import { NotificacionsManager, SecurityHelper } from "../../../common";
import { 
    CategoryRepository, 
    ClientRepository,  
    ProductRepository,
    PromoRepository, 
    TypeRepository 
} from "../../../data";
import { ClientProductRepository } from "../../../data/ClientProductRepository";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";

export class RejectedState extends PromoState {    
    public GetStatusId(): number {
        return PromoStatus.Rejected;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Rejected;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.Clients = await ClientRepository.GetClients();
        viewModel.Categories = await CategoryRepository.GetAll();
        viewModel.ClientProducts = await ClientProductRepository.GetAll();
        
        if(this.Entity.Items.length > 0 && this.Entity.Items[0].Category)
            viewModel.Types = await TypeRepository.GetByCategory(this.Entity.Items[0].Category.ItemId);

        //viewModel.ReadOnlyForm = true;
        viewModel.ShowSaveButton = true;
        viewModel.ShowSubmitButton = true;
        return viewModel;
    } 

    public async Save(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Draft);

        return PromoRepository.SaveOrUpdate(entity);
    }

    public async Submit(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Approval);

        await this.InitializeWorkflowState(entity);
        await PromoRepository.SaveOrUpdate(entity);
        await  entity.InitializeState();

        const user = await SecurityHelper.GetCurrentUser();

        return NotificacionsManager.SendWorkflowStartedNotification(entity, user.Email);
    }

}