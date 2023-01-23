import { sp } from "@pnp/sp/presets/all";
import { Approvers } from "../model/Common/Approvers/Approvers";
import { ApproverItem } from "../model/Common/Approvers/ApproverItem";
import { ApproverKeys } from "../model/Common/Approvers/ApproverKeys";
import { LookupValue } from "../infrastructure";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class ApproversRepository {
    private static LIST_NAME: string = strings.LIST_Approvers; //Aprobadores
    private static _instance : Approvers;

    public static async GetInstance(): Promise<Approvers> {

        if(ApproversRepository._instance == null)
            ApproversRepository._instance = await ApproversRepository.GetApprovers();

        return ApproversRepository._instance;
    }

    private static GetApprovers(): Promise<Approvers> {

        const entity = ApproversRepository.GetValues().then((items) => {
                let approvers = new Approvers();
                approvers.Phase1Approver1 = ApproversRepository.GetApproverValue(items, ApproverKeys.Phase1Approver1);
                approvers.Phase2Approver1 = ApproversRepository.GetApproverValue(items, ApproverKeys.Phase2Approver1);
                approvers.Phase2Approver2 = ApproversRepository.GetApproverValue(items, ApproverKeys.Phase2Approver2);
                return approvers;
            });

        return entity;
    }

    private static GetApproverValue(items: ApproverItem[], role: ApproverKeys): LookupValue
    {
        let appoverItem = items.filter(x => x.Role.toLowerCase() === role.toLowerCase())[0];

        if(appoverItem == null)
        {
            console.log("Approver item for role '%s' not found.", role);
            return null;
        }

        if(appoverItem.User == null)
            console.log("Approver value for key '%s' is empty.", role);

        return appoverItem.User;
    }

    private static async GetValues():Promise<ApproverItem[]>
    {
        const collection = sp.web.lists.getByTitle(ApproversRepository.LIST_NAME)
            .items.select(
                "ID",
                "Role",
                "User/ID",
                "User/Title"
            )
            .expand("User")
            .get().then((items) => {
                return items.map((item) => {
                    return ApproversRepository.BuildEntity(item);
                });
            });

        return collection;
    }

    private static BuildEntity(item: any): ApproverItem {

        let entity = new ApproverItem();

        entity.ItemId = item.ID;
        entity.Role = item.Role;
        entity.User = item.User ? { ItemId: item.User.ID, Value: item.User.Title } : null;

        return entity;
    }
}

