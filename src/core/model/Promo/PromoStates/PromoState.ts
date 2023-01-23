import { Constants } from "../../..";
import { ApproversRepository } from "../../../data/ApproversRepository";
import { Promo } from "../Promo";
import { PromoViewModel } from "../PromoViewModel";
import { PromoWorkflowState } from "../PromoWorkflowState";

export abstract class PromoState {
    public Entity:Promo;

    public abstract GetStatusId():number;
    public abstract GetStatusText():string;
    public abstract GetViewModel():Promise<PromoViewModel>;

    public async Initialize(): Promise<void> {
        return;
    }

    public async Save(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Submit(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public async Approve(comments: string): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Reject(comments: string): Promise<void>
    {
        return;
        //throw new Error(Constants.Messages.NotAllowedAction);
    }

    public async InitializeWorkflowState(entity: Promo): Promise<void> {
        const approvers = await ApproversRepository.GetInstance();
        const kamUserId = entity.Client.Channel.HeadOfChannel.ItemId;
        const approverUserId = approvers.Phase1Approver1.ItemId;

        if(kamUserId != approverUserId)
            entity.WorkflowStages = [new PromoWorkflowState([kamUserId, approverUserId])];
        else
            entity.WorkflowStages = [new PromoWorkflowState([kamUserId])];

        if(entity.GetTotalEstimatedInvestment() > entity.Config.ApprovalAmountLimit) {
            const approver1 = approvers.Phase2Approver1.ItemId;
            const approver2 = approvers.Phase2Approver2.ItemId;

            if(approver1 !=  approver2)
                entity.WorkflowStages.push(new PromoWorkflowState([approver1, approver2]));
            else
            entity.WorkflowStages.push(new PromoWorkflowState([approver1]));
        }

        entity.CurrentStageNumber = 1;
    }

    public GetCurrentStage(): PromoWorkflowState {
        return this.Entity.CurrentStageNumber > 0 ? this.Entity.WorkflowStages[this.Entity.CurrentStageNumber - 1] : null;
    }
}
