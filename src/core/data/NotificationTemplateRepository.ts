import { sp } from "@pnp/sp/presets/all";
import { NotificationTemplate, NotificationTemplateId } from "../model/Common";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class NotificationTemplateRepository {
    private static LIST_NAME: string = strings.LIST_NotificationTemplates; //NotificationTemplates

    public static async GetByNotificationTemplateId(notificationTemplateId: NotificationTemplateId) : Promise<NotificationTemplate>
    {
        const retVal = sp.web.lists.getByTitle(NotificationTemplateRepository.LIST_NAME)
            .getItemsByCAMLQuery({
                ViewXml: '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + notificationTemplateId + '</Value></Eq></Where></Query></View>',
            }).then((items) => {
                return items.map((item) => {
                    return NotificationTemplateRepository.BuildEntity(item);
                })[0];
            });

        return retVal;
    }

    private static BuildEntity(item: any): NotificationTemplate {

        let entity = new NotificationTemplate();

        entity.ItemId = item.ID;
        entity.Subject = item.Subject;
        entity.Body = item.Body;

        return entity;
    }
}

