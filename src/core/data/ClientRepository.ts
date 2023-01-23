import { sp } from "@pnp/sp/presets/all";
import { SecurityHelper } from "../common";
import { Client } from "../model/Common";
import { Channel } from "../model/Common/Channel";
import { ChannelRepository } from "./ChannelRepository";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class ClientRepository {
    private static LIST_NAME: string = strings.LIST_Customers; //Clientes

    public static async GetById(id:number):Promise<Client> {
        const client = sp.web.lists.getByTitle(ClientRepository.LIST_NAME)
            .items.getById(id).select(
                    "ID",
                    "Title",
                    "ChannelId",
                    "Subchannel/ID",
                    "Subchannel/Title",
                    "KeyAccountManager/ID",
                    "KeyAccountManager/Title").expand("Subchannel", "KeyAccountManager").get().then((item) => {
                if(item.ChannelId){
                    return ChannelRepository.GetById(item.ChannelId).then((channel) => {
                        return ClientRepository.BuildEntity(item, channel);
                    });
                }
                else
                    return ClientRepository.BuildEntity(item);
            });

        return client;
    }

    public static async GetClients():Promise<Client[]>
    {
        const user = await SecurityHelper.GetCurrentUser();
        const collection = sp.web.lists.getByTitle(ClientRepository.LIST_NAME)
            .items.select("ID", "Title", "KeyAccountManager/ID").expand("KeyAccountManager").filter(`KeyAccountManagerId eq ${user.ItemId}`).getAll().then((items) => {
                return items.map((item) => {
                    return ClientRepository.BuildEntity(item);
                });
            });

        return collection;
    }

    public static async UserIsKAM(kamUserId: number): Promise<boolean> {
        const collection = await sp.web.lists.getByTitle(ClientRepository.LIST_NAME)
            .items.select("KeyAccountManager/ID").expand("KeyAccountManager").filter(`KeyAccountManagerId eq ${kamUserId}`).get();

        return collection.length > 0;
    }

    private static BuildEntity(item: any, channel?:Channel): Client {
        let entity = new Client();

        entity.ItemId = item.ID;
        entity.Name = item.Title;
        entity.Channel = channel;
        entity.Subchannel = item.Subchannel ? {
            ItemId: item.Subchannel.ID,
            Value: item.Subchannel.Title
        } : null;
        entity.KeyAccountManager = item.KeyAccountManager ? {
            ItemId: item.KeyAccountManager.ID,
            Value: item.KeyAccountManager.Title
        } : null;

        return entity;
    }
}
