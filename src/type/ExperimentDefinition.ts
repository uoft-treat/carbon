export type ExperimentDefinitionNode = {
    type: string,
    attributes: {[key: string]: string};
    children: ExperimentDefinitionNode[];
}

export type ExperimentDefinition = {
    uuid: string,
    name: string,
    script: string,
    canvasNodes: ExperimentDefinitionNode[],
}
