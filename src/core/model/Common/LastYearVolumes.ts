import { Entity } from "../../infrastructure";

export class LastYearVolumes extends Entity {
    public Volumes: number[] = [];

    public GetDailyVolume(year: number,month: number): number {
        return this.Volumes[month]/(new Date(year, month, 0).getDate());
    }

    public GetAverageVolumeL3Months(referenceMonth: number): number {

        let volume = 0;

        for(let i = 1; i < 4; i++)
        {
            var index = referenceMonth >= i ? referenceMonth - i : referenceMonth - i + 12;

            volume += this.Volumes[index];
        }

        return volume/3;
    }
}