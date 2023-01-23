import { sp } from "@pnp/sp/presets/all";
import { Type } from "../model/Common";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class TypeRepository {
    private static LIST_NAME: string = strings.LIST_Types; //Tipos

    public static GetById(id: number): Promise<Type> {
        const entity = sp.web.lists.getByTitle(TypeRepository.LIST_NAME)
          .items.getById(id).select("ID", "Title").get().then((item) => {
            return TypeRepository.BuildEntity(item);
          });

        return entity;
    }

    public static async GetByCategory(categoryId: number):Promise<Type[]>
    {
        const collection = sp.web.lists.getByTitle(TypeRepository.LIST_NAME)
            .items.select("ID", "Title").filter(`CategoryId eq ${categoryId}`).getAll().then((items) => {
                return items.map((item) => {
                    return TypeRepository.BuildEntity(item);
                });
            });

        return collection;
    }

    private static BuildEntity(item: any): Type {
        let entity = new Type();

        entity.ItemId = item.ID;
        entity.Name = item.Title;

        return entity;
    }
}
