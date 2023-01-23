import { Promo } from "..";
import { Constants } from "../../..";
import { CommonHelper } from "../../../common/CommonHelper";
import { SecurityHelper } from "../../../common/SecurityHelper";
import { 
    ClientRepository, 
    PromoRepository,
    CategoryRepository,
    ProductRepository,
} from "../../../data";
import { PromoStatus } from "../PromoStatus";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";
import { NotificacionsManager } from '../../../common/NotificacionsManager';
import { ClientProductRepository } from "../../../data/ClientProductRepository";

export class NewPromoState extends PromoState {
    public GetStatusId(): number {
        return PromoStatus.New;
    }
    
    public GetStatusText(): string {
        return Constants.StatusTexts.NewPromo;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.Clients = await ClientRepository.GetClients();
        viewModel.Categories = await CategoryRepository.GetAll();
        viewModel.ClientProducts = await ClientProductRepository.GetAll();
        //viewModel.Products = await ProductRepository.GetAll();
        
        viewModel.ShowSaveButton = true;
        viewModel.ShowSubmitButton = true;

        return viewModel;
    }

    public async Save(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Draft);

        await PromoRepository.SaveOrUpdate(entity);
        
        return entity.InitializeState();
    }

    public async Submit(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Approval);

        await this.InitializeWorkflowState(entity);
        await PromoRepository.SaveOrUpdate(entity);
        await entity.InitializeState();

        const user = await SecurityHelper.GetCurrentUser();

        return NotificacionsManager.SendWorkflowStartedNotification(entity, user.Email);
    }
}