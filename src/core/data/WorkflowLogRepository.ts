import { sp } from "@pnp/sp/presets/all";
import { SecurityHelper } from "../common/SecurityHelper";
import { WorkflowLog } from "../model/Common/WorkflowLog";
import { Promo } from "../model/Promo/Promo";
import { PromoRepository } from "./PromoRepository";
import { ApproversRepository } from "./ApproversRepository";
import { concat } from "lodash";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class WorkflowLogRepository {
    private static LIST_NAME: string = strings.LIST_WorkflowLog;

    public static GetByPromo(promoId: number): Promise<WorkflowLog[]> {
        const collection = sp.web.lists.getByTitle(WorkflowLogRepository.LIST_NAME)
        .items.select(
            "ID",
            "DateAndTime",
            "User/ID",
            "User/Title",
            "Action",
            "Comments").expand("User").filter(`PromoId eq ${promoId}`).getAll().then((items) => {
            return items.map((item) => {
                return WorkflowLogRepository.BuildEntity(item);
            });
        });

        return collection;
    }

    public static async Save(promoItemId: number, promoID: string, action: string, comments: string, entity: Promo):Promise<void> {
        const date = new Date();
        const currentUser = await SecurityHelper.GetCurrentUser();

        const data = {
            Title: promoID + "_" + date.toISOString(),
            PromoId: promoItemId,
            DateAndTime: date,
            UserId: currentUser.ItemId,
            Action: action,
            Comments: comments
        };

        await sp.web.lists.getByTitle(WorkflowLogRepository.LIST_NAME).items.add(data);

        const apr = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME)
            .items.getById(entity.ItemId).select(
                "Approvals"
            ).get();

        let aprobadores = "";
        let encontrado: boolean = false;


        apr.Approvals.split("|").map((data) => {
            if (Number(data.split("-")[0]) == currentUser.ItemId && !encontrado) {
                console.log(data);
                console.log(data.replace(strings.Pending, action));
                if (data.replace(strings.Pending, action) !== data) {
                    aprobadores = concat(aprobadores + data.replace(strings.Pending, action) + "|").toString();
                    encontrado = true;
                }
                else
                    data != null || data != "" || data ? aprobadores = concat(aprobadores + data + "|").toString() : null
            }
            else
                data != null || data != "" || data ? aprobadores = concat(aprobadores + data + "|").toString() : null
        });


        if (aprobadores !== "") {
            await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(promoItemId).update({
                Approvals: aprobadores
            });
        }
    }

    private static BuildEntity(item: any): WorkflowLog {
        let entity = new WorkflowLog();

        entity.ItemId = item.ID;
        entity.DateAndTime = new Date(item.DateAndTime);
        entity.User = item.User ? { ItemId: item.User.ID, Value: item.User.Title } : null;
        entity.Action = item.Action;
        entity.Comments = item.Comments;

        return entity;
    }
}
