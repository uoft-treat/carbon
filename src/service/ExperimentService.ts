import {ExperimentDefinition} from "../type/ExperimentDefinition";

export interface ExperimentService {

    getExperimentDefinition(name: String): Promise<ExperimentDefinition>;

    getDependentWidgetsByDefinition(definition: ExperimentDefinition): string[];

}
