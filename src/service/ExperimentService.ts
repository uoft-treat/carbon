import {ExperimentDefinition} from "../type/ExperimentDefinition";

export interface ExperimentService {

    getExperimentDefinitionFromXml(script: string, xml: string): Promise<ExperimentDefinition>;

    getDependentWidgetsByDefinition(definition: ExperimentDefinition): string[];

}
