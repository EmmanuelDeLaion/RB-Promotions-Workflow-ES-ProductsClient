import { IFileAddResult, sp } from "@pnp/sp/presets/all";
import { PromoEvidence } from "../model/Promo/PromoEvidence";

export class EvidenceRepository {
    public static async UpdateEvidence(promoID: string, evidence: PromoEvidence[]): Promise<void> {
        await Promise.all(evidence.map(async (promoEvidence) => {
            const file = promoEvidence.File;
            const webData = await sp.web.select("ServerRelativeUrl")();
            const docLibUrl = webData.ServerRelativeUrl + "/Evidence/";
            const folderUrl = docLibUrl + promoID;

            if(promoEvidence.File) {
                let fileAddResult: IFileAddResult;

                let folderExists = await sp.web.getFolderByServerRelativeUrl(docLibUrl).folders.getByName(promoID)
                .select('Exists').get()
                .then((d) => d.Exists)
                .catch(() => false);

                if(!folderExists) {
                    await sp.web.getFolderByServerRelativeUrl(docLibUrl).folders.add(promoID);
                }
                
                if (promoEvidence.File.size <= 10485760) {
                    //small upload
                    fileAddResult = await sp.web.getFolderByServerRelativeUrl(folderUrl).files.add(file.name, file, true);
                } else {    
                    //large upload
                    fileAddResult = await sp.web.getFolderByServerRelativeUrl(folderUrl).files.addChunked(file.name, file, data => { }, true);
                }

                const item = await fileAddResult.file.getItem();
                await item.update({
                    EvidenceDescription: promoEvidence.Description,
                    EvidenceDate: promoEvidence.Date
                });
            }
            else if (promoEvidence.Deleted) {
                await sp.web.getFolderByServerRelativeUrl(folderUrl).files.getByName(promoEvidence.FileName).delete();
            }
        }));
    }

    public static async GetByPromoID(promoID: string): Promise<PromoEvidence[]> {
        let promoEvidence: PromoEvidence[] = [];
        const webData = await sp.web.select("ServerRelativeUrl")();
        const docLibUrl = webData.ServerRelativeUrl + "/Evidence/";
        const folderUrl = docLibUrl + promoID;

        let folderExists = await sp.web.getFolderByServerRelativeUrl(folderUrl)
        .select('Exists').get()
        .then((d) => d.Exists)
        .catch(() => false);

        if(folderExists) {
            const files = await sp.web.getFolderByServerRelativeUrl(folderUrl).files();

            Promise.all(files.map(async (file) => {
                const item: any = await sp.web.getFileByServerRelativePath(file.ServerRelativeUrl).getItem();

                let evidence = new PromoEvidence();
                
                evidence.FileName = file.Name;
                evidence.FileUrl = file.ServerRelativeUrl;
                evidence.Description = item.EvidenceDescription;
                evidence.Date = item.EvidenceDate ? new Date(item.EvidenceDate) : null;

                promoEvidence.push(evidence);
            }));
        }      

        return promoEvidence;
    }
}