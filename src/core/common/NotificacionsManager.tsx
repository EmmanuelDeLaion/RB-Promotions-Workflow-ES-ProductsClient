import { NotificationTemplateRepository } from "../data/NotificationTemplateRepository";
import { NotificationTemplateId } from "../model/Common";
import { Promo } from "../model/Promo";
import { CommonHelper } from "./CommonHelper";
import { IEmailProperties, sp } from "@pnp/sp/presets/all";

export class NotificacionsManager {

    public static SendWorkflowStartedNotification(entity: Promo, to: string, cc?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.WorkflowStarted, entity, to, cc);
    }

    public static SendTaskAssignedNotification(entity: Promo, to: string, cc?: string, approver?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.TaskAssigned, entity, to, cc, approver);        
    }

    public static SendTaskRejectedNotification(entity: Promo, comments: string, rejectedBy: string, to: string, cc?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.TaskRejected, entity, to, cc, rejectedBy);
    }

    public static SendTaskApprovedNotification(entity: Promo, approvedBy: string, to: string, cc?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.TaskApproved, entity, to, cc, approvedBy);
    }

    public static SendWorkflowApprovedNotification(entity: Promo, to: string, cc?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.WorkflowApproved, entity, to, cc);
    }

    private static async SendNotification(notificationTemplateId: NotificationTemplateId, entity: Promo, to: string, cc?: string, approver?: string) {
        var template = await NotificationTemplateRepository.GetByNotificationTemplateId(notificationTemplateId);
        
        //console.log(template.Subject);
        //console.log(template.Body);

        var replacements = await NotificacionsManager.GetReplacementCollection(notificationTemplateId, entity, to, cc, approver);

        //console.log(replacements);

        replacements.forEach((value: string, key: string) => 
            template.Subject = CommonHelper.replaceAll(template.Subject, key, value));

        replacements.forEach((value: string, key: string) => 
            template.Body = CommonHelper.replaceAll(template.Body, key, value));

        //console.log(to);
        //console.log(cc);
        //console.log(template.Subject);
        //console.log(template.Body);

        NotificacionsManager.SendEmail(
            to,
            cc,
            template.Subject,
            template.Body);
    }

    private static async GetReplacementCollection(notificationTemplateId: NotificationTemplateId, entity: Promo, to: string, cc?: string, approver?: string): Promise<Map<string, string>>
    {
        let retVal = new Map<string, string>();

        const webData = await sp.web.select("Url")();

        retVal.set("{{ACTIVITY_OBJECTIVE}}", entity.ActivityObjective);
        retVal.set("{{APPROVAL_AMOUNT_LIMIT}}", entity.Config.ApprovalAmountLimit.toString());
        retVal.set("{{NAME}}", entity.Name);
        retVal.set("{{PROMO_ID}}", entity.PromoID);        
        retVal.set("{{LINK_TO_PROMO}}", webData.Url + "?ItemId=" + entity.ItemId.toString());
        retVal.set("{{KAM}}", entity.Client.KeyAccountManager.Value);
        retVal.set("{{CLIENT_NAME}}", entity.Client.Name);
        retVal.set("{{ADDITIONAL_INVESTMENT}}", entity.GetTotalEstimatedInvestmentAsString());
        retVal.set("{{ROI}}", entity.GetROIAsString());
        retVal.set("{{PROMO_DATE}}", NotificacionsManager.GetFormattedPromoDate(entity));
        retVal.set("{{CURRENCY_SYMBOL}}", entity.Config.CurrencySymbol);

        /*Validar*/     
        if(!CommonHelper.IsNullOrEmpty(approver))
            retVal.set("{{TASK_APPROVER}}", approver);
        /* Fin Validar*/

        retVal.set("{{CC}}", cc);
        retVal.set("{{TO}}", to);

        return retVal;
    }

    public static GetFormattedPromoDate(entity: Promo): string
    {
        return `Desde ${entity.GetFromDate().toLocaleDateString()} hasta ${entity.GetToDate().toLocaleDateString()}`;
    }

    public static async SendEmail(to: string, cc: string, subject: string, body: string)
    {
        const emailProps: IEmailProperties = {
            To: to.split(";"),
            CC: !CommonHelper.IsNullOrEmpty(cc)? cc.split(";") : [],
            Subject: subject,
            Body: body,
            AdditionalHeaders: {
                "content-type": "text/html"
            }
        };

        await sp.utility.sendEmail(emailProps);
    }
}