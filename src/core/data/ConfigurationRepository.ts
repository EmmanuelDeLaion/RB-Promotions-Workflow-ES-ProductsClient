import { sp } from "@pnp/sp/presets/all";
import { ConfigurationItem} from "../infrastructure/Configuration/ConfigurationItem";
import { ConfigurationKey} from "../infrastructure/Configuration/ConfigurationKey";
import { Configuration} from "../infrastructure/Configuration/Configuration";
import { CommonHelper } from "../common/CommonHelper";
import { Constants } from "../Constants";
import * as strings from 'PromoFormWebPartWebPartStrings';

export class ConfigurationRepository {
    private static LIST_NAME: string = strings.LIST_Configuration; //Configuración
    private static _instance : Configuration;

    public static async GetInstance(): Promise<Configuration> {

        if(ConfigurationRepository._instance == null)
            ConfigurationRepository._instance = await ConfigurationRepository.GetConfiguration();

        return ConfigurationRepository._instance;
    }

    private static GetConfiguration(): Promise<Configuration> {

        const entity = ConfigurationRepository.GetValues().then((items) => {
                let configuration = new Configuration();
                configuration.CountryCode = ConfigurationRepository.GetConfigurationValue(items, ConfigurationKey.CountryCode);
                configuration.CountryName = ConfigurationRepository.GetConfigurationValue(items, ConfigurationKey.CountryName);
                configuration.CurrencySymbol = ConfigurationRepository.GetConfigurationValue(items, ConfigurationKey.CurrencySymbol);
                configuration.ApprovalAmountLimit = ConfigurationRepository.GetNumberConfigurationValue(items, ConfigurationKey.ApprovalAmountLimit);
                configuration.KAMsGroupName = Constants.Groups.KAMsBaseGroupName + " - " + configuration.CountryCode;
                configuration.ReadOnlyGroupName = Constants.Groups.ReadOnlyBaseGroupName + " - " + configuration.CountryCode;

                return configuration;
            });

        return entity;
    }

    private static GetNumberConfigurationValue(items: ConfigurationItem[], key: ConfigurationKey): number
    {
        let value = ConfigurationRepository.GetConfigurationValue(items, key);

        return !CommonHelper.IsNullOrEmpty(value) ? parseInt(value) : -1;
    }

    private static GetConfigurationValue(items: ConfigurationItem[], key: ConfigurationKey): string
    {
        let configurationItem = items.filter(x => x.Key.toLowerCase() === key.toLowerCase())[0];

        if(configurationItem == null)
        {
            console.log("Configuration item for key '%s' not found.", key);
            return null;
        }

        if(CommonHelper.IsNullOrEmpty(configurationItem.Value))
            console.log("Configuration value for key '%s' is empty.", key);

        return configurationItem.Value;
    }

    private static async GetValues():Promise<ConfigurationItem[]>
    {
        const collection = sp.web.lists.getByTitle(ConfigurationRepository.LIST_NAME)
            .items.select(
                "ID",
                "Title",
                "Value",
            ).getAll().then((items) => {
                return items.map((item) => {
                    return ConfigurationRepository.BuildEntity(item);
                });
            });

        return collection;
    }

    private static BuildEntity(item: any): ConfigurationItem {

        let entity = new ConfigurationItem();

        entity.ItemId = item.ID;
        entity.Key = item.Title;
        entity.Value = item.Value;

        return entity;
    }
}

