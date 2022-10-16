declare module "vue-application-insights" {
    import {
        ApplicationInsights,
        IConfiguration
    } from "@microsoft/applicationinsights-web";
    import { IConfig } from "@microsoft/applicationinsights-common";
    import VueRouter from "vue-router";
    import _Vue from "vue";

    export interface VueApplicationInsightsPluginOptions {
        id?: string;
        appInsightsConfig?: IConfiguration & IConfig;
        baseName?: string;
        router?: VueRouter;
    }
    export class VueApplicationInsightsPlugin {
        static install(
            Vue: typeof _Vue,
            options: VueApplicationInsightsPluginOptions
        ): void;
    }

    export default VueApplicationInsightsPlugin;

    module "vue/types/vue" {
        interface Vue {
            $appInsights: ApplicationInsights;
        }
    }
}
