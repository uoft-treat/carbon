import {inject, injectable} from "inversify";
import {ExperimentService}  from "../service/ExperimentService";

@injectable()
export class Experiment {

    private experimentService: ExperimentService;

    private _uuid: String;


    constructor(
        @inject("ExperimentService") experimentService: ExperimentService
    ) {
        this.experimentService = experimentService;
    }

    async mount() {
        const def = await this.experimentService.getExperimentDefinition("my-experiment");
        console.log(this.experimentService.getDependentWidgetsByDefinition(def));
    }


    get uuid(): String {
        return this._uuid;
    }

    set uuid(value: String) {
        this._uuid = value;
    }



}
