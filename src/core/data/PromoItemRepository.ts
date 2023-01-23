import { sp } from "@pnp/sp/presets/all";
import { Category, ClientProduct, Product, Type } from "../model/Common";
import { LastYearVolumes } from "../model/Common/LastYearVolumes";
import { PromoItem } from "../model/Promo";
import { CategoryRepository } from "./CategoryRepository";
import { ClientProductRepository } from "./ClientProductRepository";
import { LastYearVolumesRepository } from "./LastYearVolumesRepository";
import { ProductRepository } from "./ProductRepository";
import * as strings from 'PromoFormWebPartWebPartStrings';



export class PromoItemRepository {
  private static LIST_NAME: string = strings.LIST_PromoItems; //Promo items

  public static async GetByPromo(promoId: number, clientId?: number): Promise<PromoItem[]> {
    console.log(promoId);

    const items = await sp.web.lists.getByTitle(PromoItemRepository.LIST_NAME)
      .items.select(
        "ID",
        "Title",
        "ShortDescription",
        "CategoryId",
        "Investment",
        "Type/ID",
        "Type/Title",
        "CappedActivity",
        "BusinessUnit/ID",
        "BusinessUnit/Title",
        "Brand/ID",
        "Brand/Title",
        "ProductCategory/ID",
        "ProductCategory/Title",
        "StartDate",
        "EndDate",
        "DiscountPerPiece",
        "NetPrice",
        "COGS",
        "Redemption",
        "BaseVolume",
        "EstimatedIncrementalVolume",
        "AdditionalInvestment",
        "SKUProductId",
      ).expand("Type", "BusinessUnit", "Brand", "ProductCategory",).filter(`PromoId eq ${promoId}`).get();

    //TODO: revisar y mejorar este query
    const collection = items.map(async (item) => {
      const category = item.CategoryId ? await CategoryRepository.GetById(item.CategoryId) : null;
      const clientproduct = item.SKUProductId ? await ClientProductRepository.GetById(item.SKUProductId) : null;
      const volumesLY = clientId && item.ProductId ? await LastYearVolumesRepository.GetByClientAndProduct(clientId, item.ProductId) : null;
      return PromoItemRepository.BuildEntity(item, category, clientproduct, volumesLY);
    });
    return Promise.all(collection);
  }


  public static async DeletePromoItemsByPromoID(promoItemsToDelete: any, promoItemId: number): Promise<void> {
    let list = sp.web.lists.getByTitle(PromoItemRepository.LIST_NAME);
    let batch = sp.web.createBatch();
    promoItemsToDelete.map((element: any) => {
      list.items.getById(element).inBatch(batch).delete();
    });
    await batch.execute();
  }


  public static async SaveOrUpdateItems(promoItemId: number, promoID: string, items: PromoItem[], itemsToDelete: number[]): Promise<void> {
    this.DeletePromoItemsByPromoID(itemsToDelete, promoItemId);

    let list = sp.web.lists.getByTitle(PromoItemRepository.LIST_NAME);
    const entityTypeFullName = await list.getListItemEntityTypeFullName();
    let batch = sp.web.createBatch();

    items.map((entity, index) => {
      const number = index + 1;
      // console.log(entity.Product.ItemId);
      const data = {
        PromoId: promoItemId,
        Title: promoID + "." + number,
        ShortDescription: entity.ShortDescription,
        CategoryId: entity.Category ? entity.Category.ItemId : null,
        Investment: entity.Investment,
        TypeId: entity.Type ? entity.Type.ItemId : null,
        CappedActivity: entity.CappedActivity,
        BusinessUnitId: entity.BusinessUnit ? entity.BusinessUnit.ItemId : null,
        BrandId: entity.Brand ? entity.Brand.ItemId : null,
        ProductCategoryId: entity.ProductCategory ? entity.ProductCategory.ItemId : null,
        SKUProductId: entity.ClientProduct ? entity.ClientProduct.ItemId : null,
        //Product: entity.GetSKUNumberString(),
        StartDate: entity.StartDate,
        EndDate: entity.EndDate,
        DiscountPerPiece: entity.DiscountPerPiece,
        NetPrice: entity.NetPrice,
        COGS: entity.COGS,
        DiscountPercentage: entity.GetDiscountPercentage(),
        GMPercentageNR: entity.GetGMPercentageNR(),
        GMPercentageNRWithPromo: entity.GetGMPercentageNRWithPromo(),
        GMBaseUnit: entity.GetGMBaseUnit(),
        GMPromoUnit: entity.GetGMPromoUnit(),
        Redemption: entity.Redemption,
        BaseVolume: entity.BaseVolume,
        EstimatedROI: entity.GetROI(),
        EstimatedIncrementalVolume: entity.EstimatedIncrementalVolume,
        AdditionalInvestment: entity.AdditionalInvestment,
        TotalEstimatedVolume: entity.GetTotalEstimatedVolume(),
        EstimatedInvestment: entity.GetEstimatedInvestment(),
        //ClientId: entity.Client ? entity.Client.ItemId : null,
        //ProductSKU: entity.GetSKUNumberString(),
      };
      if (entity.ItemId)
        list.items.getById(entity.ItemId).inBatch(batch).update(data, "*", entityTypeFullName);
      else
        list.items.inBatch(batch).add(data, entityTypeFullName);
    });

    await batch.execute();
  }



  private static BuildEntity(item: any, category?: Category, clientproduct?: ClientProduct, lyVolumes?: LastYearVolumes): PromoItem {
    let entity = new PromoItem();

    entity.ItemId = item.ID;
    entity.AdditionalID = item.Title;
    entity.ShortDescription = item.ShortDescription;
    entity.Category = category;
    entity.Investment = item.Investment;
    entity.Type = item.Type ? { ItemId: item.Type.ID, Name: item.Type.Title } : null;
    entity.CappedActivity = item.CappedActivity;
    entity.BusinessUnit = item.BusinessUnit ? { ItemId: item.BusinessUnit.ID, Value: item.BusinessUnit.Title } : null;
    entity.Brand = item.Brand ? { ItemId: item.Brand.ID, Value: item.Brand.Title } : null;
    entity.ProductCategory = item.ProductCategory ? { ItemId: item.ProductCategory.ID, Value: item.ProductCategory.Title } : null;
    entity.ClientProduct = clientproduct;
    //entity.Product = item.Product ? { ItemId: item.Product.ID, Value: item.Product.Title } : null,
    //entity.Product = product;
    entity.StartDate = item.StartDate ? new Date(item.StartDate) : null;
    entity.EndDate = item.EndDate ? new Date(item.EndDate) : null;
    entity.DiscountPerPiece = item.DiscountPerPiece;
    entity.NetPrice = item.NetPrice;
    entity.COGS = item.COGS;
    entity.Redemption = item.Redemption;
    entity.BaseVolume = item.BaseVolume;
    entity.EstimatedIncrementalVolume = item.EstimatedIncrementalVolume;
    entity.AdditionalInvestment = item.AdditionalInvestment;
    entity.LastYearVolumes = lyVolumes;
    //entity.Client = item.Client ? {ItemId: item.Client.ID, Value: item.Client.Title} : null;

    return entity;
  }
}
