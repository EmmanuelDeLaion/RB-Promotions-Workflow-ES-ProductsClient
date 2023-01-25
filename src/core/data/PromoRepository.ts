import { IItemAddResult, sp } from "@pnp/sp/presets/all";
import {concat } from "lodash";
import * as strings from "PromoFormWebPartWebPartStrings";
import { ClientRepository, ConfigurationRepository } from ".";
import { Client, WorkflowLog } from "../model/Common";
import { Approvers } from "../model/Common/Approvers/Approvers";
import { PromoItem, PromoWorkflowState } from "../model/Promo";
import { Promo } from "../model/Promo/Promo";
import { PromoEvidence } from "../model/Promo/PromoEvidence";
import { ApproversRepository } from "./ApproversRepository";
import { EvidenceRepository } from "./EvidenceRepository";
import { PromoItemRepository } from "./PromoItemRepository";
import { WorkflowLogRepository } from "./WorkflowLogRepository";

export class PromoRepository {
    public static LIST_NAME: string = strings.LIST_Promotions; //Promociones

    public static async GetById(id: number): Promise<Promo> {
      const item = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME)
        .items.getById(id).select(
          "ID",
          "Title",
          "PromoName",
          "ActivityObjective",
          "ClientId",
          "StatusId",
          "SYS_WorkflowStages",
          "SYS_CurrentStageNumber",
          "Approvals"
        ).get();


      const client = item.ClientId ? await ClientRepository.GetById(item.ClientId) : null;
      const items = await PromoItemRepository.GetByPromo(item.ID, item.ClientId, client.Name);
      const workflowLog = await WorkflowLogRepository.GetByPromo(item.ID);
      const evidence = await EvidenceRepository.GetByPromoID(item.Title);

      return PromoRepository.BuildEntity(item, items, client, workflowLog, evidence);
    }



    public static async SaveOrUpdate(entity: Promo, sU: number = 0): Promise<void> {

      const pendingApprovers = entity.GetPendingApproverIDs();
      let aprobadores: any;

      if (sU == 0) {
        const approvers = await ApproversRepository.GetInstance();
        const kamUserId = entity.Client.Channel.HeadOfChannel.ItemId;
        const approverUserId = approvers.Phase1Approver1.ItemId;
        const kamUser = entity.Client.Channel.HeadOfChannel.Value;
        const approverUser = approvers.Phase1Approver1.Value;

        if (kamUser != approverUser)
          aprobadores = concat(kamUserId + "-" + kamUser + ": " + `${strings.Pending}| ` + approverUserId + "-" + approverUser + ": " + `${strings.Pending}|`).toString();
        else
          aprobadores = concat(kamUserId + "-" + kamUser + ": " + `${strings.Pending}|`).toString();

        if (entity.GetTotalEstimatedInvestment() > entity.Config.ApprovalAmountLimit) {
          const approver1Id = approvers.Phase2Approver1.ItemId;
          const approver2Id = approvers.Phase2Approver2.ItemId;
          const approver1 = approvers.Phase2Approver1.Value;
          const approver2 = approvers.Phase2Approver2.Value;

          if (approver1 != approver2)
            aprobadores = concat(aprobadores + " " + approver1Id + "-" + approver1 + `: ${strings.Pending}| ` + approver2Id + "-" + approver2 + `: ${strings.Pending}|`).toString();
          else
            aprobadores = concat(aprobadores + " " + approver1Id + "-" + approver1 + `: ${strings.Pending}| `).toString();
        }
      }
      const data = {
        PromoName: entity.Name,
        ActivityObjective: entity.ActivityObjective,
        ClientId: entity.Client ? entity.Client.ItemId : null,
        TotalEstimatedROI: entity.GetROI(),
        StartDate: entity.GetFromDate(),
        EndDate: entity.GetToDate(),
        Status: entity.GetStatusText(),
        StatusId: entity.GetStatusId(),
        SYS_WorkflowStages: entity.WorkflowStages ? JSON.stringify(entity.WorkflowStages) : null,
        SYS_CurrentStageNumber: entity.CurrentStageNumber,
        PendingApproversId: { results: pendingApprovers ? entity.GetPendingApproverIDs() : [] },
        TotalEstimatedInvestment: entity.GetTotalEstimatedInvestment(),
        Approvals: aprobadores
      };

      if(!entity.ItemId) {
        const iar: IItemAddResult = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.add(data);

        //TODO: Obtener prefijo de país desde configuración
        entity.ItemId = iar.data.ID;
        entity.PromoID = entity.Config.CountryCode + iar.data.ID;

        await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(iar.data.ID).update({
          Title: entity.PromoID,
          PromoLink: entity.PromoID
        });
      }
      else
        await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(entity.ItemId).update(data);

      await PromoItemRepository.SaveOrUpdateItems(entity.ItemId, entity.PromoID, entity.Items, entity.ItemsToDelete);
    }



    public static async GetNewPromo() : Promise<Promo>{
      let configuration = await ConfigurationRepository.GetInstance();
      return new Promo(configuration);
    }

    private static async BuildEntity(item: any, items: PromoItem[], client: Client, workflowLog: WorkflowLog[], evidence: PromoEvidence[]): Promise<Promo> {

      let entity = await PromoRepository.GetNewPromo();

      entity.ItemId = item.ID;
      entity.Name = item.PromoName;
      entity.PromoID = item.Title;
      entity.ActivityObjective = item.ActivityObjective;
      entity.Client = client;
      entity.CurrentStageNumber = item.SYS_CurrentStageNumber;
      entity.WorkflowLog = workflowLog;
      entity.Evidence = evidence;

      items.map((promoItem) => {
        promoItem.GetBaseGMSum = entity.GetBaseGMSum.bind(entity);
      });

      entity.Items = items;

      if(item.SYS_WorkflowStages) {
        const data: any[] = JSON.parse(item.SYS_WorkflowStages);
        entity.WorkflowStages = [];

        data.map((stage) => {
          entity.WorkflowStages.push(new PromoWorkflowState(stage.ApproverIDs, stage.CompletedBy));
        });
      }

      entity.ChangeState(parseInt(item.StatusId));

      return entity;
    }
}
