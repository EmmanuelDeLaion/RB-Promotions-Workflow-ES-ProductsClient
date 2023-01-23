import { Promo } from "../model/Promo/Promo";
import { PromoViewModel } from "../model/Promo/PromoViewModel";
import { PromoRepository } from "../data/PromoRepository";
import { TypeRepository } from "../data/TypeRepository";
import { Type } from "../model/Common";
import { ConfigurationRepository } from "../data";
import { PromoEvidence } from "../model/Promo/PromoEvidence";
import { EvidenceRepository } from "../data/EvidenceRepository";

export class PromoService { 

  private static async GetPromo(itemId?: number): Promise<Promo> {
    return itemId ? await PromoRepository.GetById(itemId)
                  : await PromoRepository.GetNewPromo();
  }

  public static async GetViewModel(itemId?: number): Promise<PromoViewModel> {
    return (await this.GetPromo(itemId)).GetViewModel();
  }

  public static async Save(entity: Promo): Promise<void> {
    return await (await this.GetPromo(entity.ItemId)).Save(entity);
  }

  public static async Submit(entity: Promo): Promise<void> {
    return await (await this.GetPromo(entity.ItemId)).Submit(entity);
  }

  public static async Approve(entity: Promo, comments: string): Promise<void> {
    return await (await this.GetPromo(entity.ItemId)).Approve(comments);
  }

  public static async Reject(entity: Promo, comments: string): Promise<void> {
    return await (await this.GetPromo(entity.ItemId)).Reject(comments);
  }

  public static async GetTypesByCategory(categoryId: number): Promise<Type[]> {
    return await TypeRepository.GetByCategory(categoryId);
  }

  public static async UpdateEvidence(promoID: string, evidence: PromoEvidence[]): Promise<void> {
    return await EvidenceRepository.UpdateEvidence(promoID, evidence);
  }
}