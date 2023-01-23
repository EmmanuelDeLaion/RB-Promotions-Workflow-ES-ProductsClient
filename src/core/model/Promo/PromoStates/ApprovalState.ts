import { PromoStatus } from "..";
import { Constants } from "../../..";
import { NotificacionsManager } from "../../../common/NotificacionsManager";
import { SecurityHelper } from "../../../common/SecurityHelper";
import { PromoRepository } from "../../../data";
import { WorkflowLogRepository } from "../../../data/WorkflowLogRepository";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";
import * as strings from 'PromoFormWebPartWebPartStrings';


export class ApprovalState extends PromoState {
    public async Initialize(): Promise<void> {
        const users = await this.GetCurrentStage().GetPendingUsers();

        await SecurityHelper.SetPromoPermissions(this.Entity.ItemId, [this.Entity.Client.KeyAccountManager.ItemId], this.GetCurrentStage().GetPendingUserIDs());

        await Promise.all(users.map(async (user) => {
            await NotificacionsManager.SendTaskAssignedNotification(this.Entity, user.Email, null, user.Value);
        }));
    }

    public GetStatusId(): number {
        return PromoStatus.Approval;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Approval;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.ReadOnlyForm = true;

        const currentUser = await SecurityHelper.GetCurrentUser();

        if(this.GetCurrentStage().UserCanApprove(currentUser.ItemId)){
            viewModel.ShowApproveButton = true;
            viewModel.ShowRejectButton = true;
        }

        return viewModel;
    }

    public async Approve(comments: string): Promise<void>
    {
        const stage = this.GetCurrentStage();
        const user = await SecurityHelper.GetCurrentUser();
        const kam = await SecurityHelper.GetUserById(this.Entity.Client.KeyAccountManager.ItemId);

        stage.AddToCompletBy(user.ItemId);

        if(stage.IsComplete()) {
            if(this.Entity.CurrentStageNumber == this.Entity.WorkflowStages.length) {
                this.Entity.ChangeState(PromoStatus.Approved);

                const to = kam.Email;

                NotificacionsManager.SendWorkflowApprovedNotification(this.Entity, to);
            }
            else {
                this.Entity.CurrentStageNumber++;
                const users = await this.GetCurrentStage().GetPendingUsers();

                await Promise.all(users.map(async (usr) => {
                    await NotificacionsManager.SendTaskAssignedNotification(this.Entity, usr.Email, null, usr.Value);
                }));
            }
        }

        let readerIDs = [this.Entity.Client.KeyAccountManager.ItemId];

        for(let i = 0; i < this.Entity.CurrentStageNumber; i++)
            readerIDs = readerIDs.concat(this.Entity.WorkflowStages[i].CompletedBy);

        await SecurityHelper.SetPromoPermissions(this.Entity.ItemId, readerIDs, this.GetCurrentStage().GetPendingUserIDs());
        await PromoRepository.SaveOrUpdate(this.Entity, 1);
        await WorkflowLogRepository.Save(this.Entity.ItemId, this.Entity.PromoID, strings.Approve, comments, this.Entity);

        return NotificacionsManager.SendTaskApprovedNotification(this.Entity, user.Value, kam.Email);
    }

    public async Reject(comments: string): Promise<void>
    {
        const stage = this.GetCurrentStage();
        const user = await SecurityHelper.GetCurrentUser();

        this.Entity.ChangeState(PromoStatus.Rejected);

        stage.AddToCompletBy(user.ItemId);

        await PromoRepository.SaveOrUpdate(this.Entity, 1);
        await WorkflowLogRepository.Save(this.Entity.ItemId, this.Entity.PromoID, strings.Reject, comments, this.Entity);

        let readerIDs = [this.Entity.Client.KeyAccountManager.ItemId];

        for(let i = 0; i < this.Entity.CurrentStageNumber; i++)
            readerIDs = readerIDs.concat(this.Entity.WorkflowStages[i].CompletedBy);

        readerIDs = readerIDs.concat(stage.GetPendingUserIDs());

        await SecurityHelper.SetPromoPermissions(this.Entity.ItemId, readerIDs);

        const to = (await SecurityHelper.GetUserById(this.Entity.Client.KeyAccountManager.ItemId)).Email;

        return NotificacionsManager.SendTaskRejectedNotification(this.Entity, comments, user.Value, to);
    }
}
