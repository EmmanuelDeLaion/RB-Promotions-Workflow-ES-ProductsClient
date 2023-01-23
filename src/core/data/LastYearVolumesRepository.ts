import { sp } from "@pnp/sp/presets/all";
import { LastYearVolumes } from "../model/Common/LastYearVolumes";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class LastYearVolumesRepository {
    private static LIST_NAME: string = strings.LIST_LastYearVolumes; //Volúmenes del último año

    public static GetByClientAndProduct(clientId: number, productId: number): Promise<LastYearVolumes> {
        const result = sp.web.lists.getByTitle(LastYearVolumesRepository.LIST_NAME)
          .items.select(
                "ID",
                "Volume01",
                "Volume02",
                "Volume03",
                "Volume04",
                "Volume05",
                "Volume06",
                "Volume07",
                "Volume08",
                "Volume09",
                "Volume10",
                "Volume11",
                "Volume12",
            ).filter(`ClientId eq ${clientId} and ProductId eq ${productId}`).get().then((items) => {
                return items.length > 0 ? LastYearVolumesRepository.BuildEntity(items[0]) : null;
            });

        return result;
    }

    private static BuildEntity(item: any): LastYearVolumes {
        let entity = new LastYearVolumes();

        entity.ItemId = item.ID;
        entity.Volumes[0] = item.Volume01;
        entity.Volumes[1] = item.Volume02;
        entity.Volumes[2] = item.Volume03;
        entity.Volumes[3] = item.Volume04;
        entity.Volumes[4] = item.Volume05;
        entity.Volumes[5] = item.Volume06;
        entity.Volumes[6] = item.Volume07;
        entity.Volumes[7] = item.Volume08;
        entity.Volumes[8] = item.Volume09;
        entity.Volumes[9] = item.Volume10;
        entity.Volumes[10] = item.Volume11;
        entity.Volumes[11] = item.Volume12;

        return entity;
    }
}
