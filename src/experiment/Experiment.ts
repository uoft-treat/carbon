import {inject, injectable} from "inversify";
import {ExperimentService}  from "../service/ExperimentService";
import {WidgetPool}         from "../widget/WidgetPool";
import * as uuid            from 'uuid/v4';

@injectable()
export class Experiment {

    private experimentService: ExperimentService;
    private widgetPool: WidgetPool;

    private _uuid: String;

    private _id: String;

    constructor(
        @inject("ExperimentService") experimentService: ExperimentService,
        @inject("WidgetPool") widgetPool: WidgetPool,
    ) {
        this.experimentService = experimentService;
        this.widgetPool = widgetPool;
        this._id = uuid();
    }

    async mount() {
        const def = await this.experimentService.getExperimentDefinition("my-experiment");
        let widgetUuids = this.experimentService.getDependentWidgetsByDefinition(def);

        for (const uuid of widgetUuids) {
            let widget = await this.widgetPool.getWidget(uuid);
        }
    }


    get uuid(): String {
        return this._uuid;
    }

    set uuid(value: String) {
        this._uuid = value;
    }

}
