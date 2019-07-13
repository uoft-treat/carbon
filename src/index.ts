declare global {
    interface Window { Carbon: any; Vue: any; }
}

import container    from "./inversify.config";
import {Experiment} from "./experiment/Experiment";

window.Carbon = {

    createExperiment: () => container.get<Experiment>("Experiment")

};
