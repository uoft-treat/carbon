declare global {
    interface Window { Carbon: any; Vue: any; }
}

import container    from "./inversify.config";
import {Experiment} from "./experiment/Experiment";
import {ExperimentService} from "./service/ExperimentService";

window.Carbon = {
    createExperiment: () => container.get<Experiment>("Experiment"),
    experimentService: container.get<ExperimentService>("ExperimentService")
};
