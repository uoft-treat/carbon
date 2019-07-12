import container    from "./inversify.config";
import {Experiment} from "./experiment/Experiment";

const experiment = container.get<Experiment>("Experiment");


(async() => {
    await experiment.mount();
})();
