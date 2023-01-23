import { sp } from "@pnp/sp/presets/all";
import { Product } from "../model/Common";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class ProductRepository {
    private static LIST_NAME: string = strings.LIST_Products; //Productos

    public static GetById(id: number): Promise<Product> {
        const entity = sp.web.lists.getByTitle(ProductRepository.LIST_NAME)
          .items.getById(id).select(
              "ID",
              "Title",
              "SKUDescription",
              "BusinessUnit/ID",
              "BusinessUnit/Title",
              "Brand/ID",
              "Brand/Title",
              "ProductCategory/ID",
              "ProductCategory/Title").expand("BusinessUnit", "Brand", "ProductCategory" ).get().then((item) => {
            return ProductRepository.BuildEntity(item);
          });

        return entity;
    }

    public static async GetAll():Promise<Product[]>
    {
        const collection = sp.web.lists.getByTitle(ProductRepository.LIST_NAME)
            .items.select(
                "ID",
                "Title",
                "SKUDescription",
                "BusinessUnit/ID",
                "BusinessUnit/Title",
                "Brand/ID",
                "Brand/Title",
                "ProductCategory/ID",
                "ProductCategory/Title").expand("BusinessUnit", "Brand", "ProductCategory" ).getAll().then((items) => {
                let result: Product[] = [];
                items.map((item) => {
                    if(item.BusinessUnit && item.BusinessUnit.ID && item.BusinessUnit.Title &&
                       item.Brand && item.Brand.ID && item.Brand.Title &&
                       item.ProductCategory && item.ProductCategory.ID && item.ProductCategory.Title)
                        result.push(ProductRepository.BuildEntity(item));
                });
                return result;
            });

        return collection;
    }

    private static BuildEntity(item: any): Product {
        let entity = new Product();

        entity.ItemId = item.ID;
        entity.SKUNumber = item.Title;
        entity.SKUDescription = item.SKUDescription;
        entity.BusinessUnit = item.BusinessUnit ? { ItemId: item.BusinessUnit.ID, Value: item.BusinessUnit.Title } : null;
        entity.Brand = item.Brand ? { ItemId: item.Brand.ID, Value: item.Brand.Title } : null;
        entity.Category = item.ProductCategory ? { ItemId: item.ProductCategory.ID, Value: item.ProductCategory.Title } : null;


        return entity;
    }
}
