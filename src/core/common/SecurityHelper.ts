import { sp } from "@pnp/sp/presets/all";
import { Constants } from "../Constants";
import { ConfigurationRepository } from "../data";
import { LookupValue } from "../infrastructure";
import { UserValue } from "../infrastructure/UserValue";

export class SecurityHelper {
    public static async GetCurrentUser():Promise<UserValue> {
        const spUser = await sp.web.currentUser.get();
        return { ItemId: spUser.Id, Value: spUser.Title, Email: spUser.Email };
    }

    public static async GetUserById(id: number):Promise<UserValue> {
        const spUser = await sp.web.getUserById(id).get();
        return { ItemId: spUser.Id, Value: spUser.Title, Email: spUser.Email };
    }

    public static async GetGroupByName(name: string): Promise<LookupValue> {
        const group = await sp.web.siteGroups.getByName(name)();

        if(group != null)
            return new LookupValue({ItemId: group.Id, Value: group.Title});

        return null;
    }

    public static async UserIsMemberOfGroup(userId: number, groupName: string) {        
        const groupUsers = await sp.web.siteGroups.getByName(groupName).users();

        let isMember = false;

        groupUsers.map((groupUser) => {
            if(userId == groupUser.Id){
                isMember = true;
                return;
            }
        });

        return isMember;
    }

    public static async SetPromoPermissions(itemId: number, readerIDs?: number[], contributorIDs?: number[]): Promise<void> {
        const date = new Date();
        const config = await ConfigurationRepository.GetInstance();
        const readOnlyGroup = await SecurityHelper.GetGroupByName(config.ReadOnlyGroupName);
        const ContributeGroup = await SecurityHelper.GetGroupByName(config.KAMsGroupName);

        if(readOnlyGroup != null) {
            if(readerIDs == null)
                readerIDs = [];

            readerIDs.push(readOnlyGroup.ItemId);
        }

        if(ContributeGroup != null) {
            if(contributorIDs == null)
            contributorIDs = [];

            contributorIDs.push(ContributeGroup.ItemId);
        }

        const data = {
            Title: "P" + itemId + "_" + date.toISOString(),
            PromoItemId: itemId,
            ReaderIDs: readerIDs ? readerIDs.join(",") : null,
            ContributorIDs: contributorIDs ? contributorIDs.join(",") : null
        };

        await sp.web.lists.getByTitle("SYS_PermissionChangeRequests").items.add(data);
    }
}