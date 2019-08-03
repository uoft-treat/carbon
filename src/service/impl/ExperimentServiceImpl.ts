import {ExperimentService}                              from "../ExperimentService";
import {inject, injectable}                             from "inversify";
import {Configuration}                                  from "../../configuration/Configuration";
import {WebRequestAgent}                                from "../../agent/WebRequestAgent";
import {ExperimentDefinition, ExperimentDefinitionNode} from "../../type/ExperimentDefinition";
import {XmlParser}                                      from "../../parser/XmlParser";


@injectable()
export class ExperimentServiceImpl implements ExperimentService {

    private configuration: Configuration;
    private webRequestAgent: WebRequestAgent;

    constructor(
        @inject("Configuration") configuration: Configuration,
        @inject("WebRequestAgent") webRequestAgent: WebRequestAgent
    ) {
        this.configuration = configuration;
        this.webRequestAgent = webRequestAgent;
    }

    private recursivelyReadCanvasNodes(root: any, canvasNode: ExperimentDefinitionNode): void {
        for (const nodeType in root) {
            if (nodeType === "_attributes") {
                canvasNode.attributes = {...root[nodeType]};
            } else if (Array.isArray(root[nodeType])) {
                for (const node of root[nodeType]) {
                    let child: ExperimentDefinitionNode = {type: nodeType.toLowerCase(), attributes: {}, children: []};
                    this.recursivelyReadCanvasNodes(node, child);
                    canvasNode.children.push(child);
                }
            } else {
                let child: ExperimentDefinitionNode = {type: nodeType.toLowerCase(), attributes: {}, children: []};
                this.recursivelyReadCanvasNodes(root[nodeType], child);
                canvasNode.children.push(child);
            }
        }
    }

    /**
     * Convert strings to experiment definition.
     */
    async getExperimentDefinitionFromXml(script: string, xml: string): Promise<ExperimentDefinition> {

        const parsedData = await XmlParser.parseXmlFromString(xml);

        let definition: ExperimentDefinition = {
            name: parsedData["Experiment"]["_attributes"]["name"],
            uuid: parsedData["Experiment"]["_attributes"]["uuid"],
            script: script,
            canvasNodes: []
        };

        const canvas = parsedData["Experiment"]["Canvas"];

        for (const nodeType in canvas) {
            if (Array.isArray(canvas[nodeType])) {
                for (const root of canvas[nodeType]) {
                    let canvasNode: ExperimentDefinitionNode = {
                        type: nodeType.toLowerCase(),
                        attributes: {},
                        children: []
                    };
                    this.recursivelyReadCanvasNodes(root, canvasNode);
                    definition.canvasNodes.push(canvasNode);
                }
            } else {
                let canvasNode: ExperimentDefinitionNode = {type: nodeType.toLowerCase(), attributes: {}, children: []};
                this.recursivelyReadCanvasNodes(canvas[nodeType], canvasNode);
                definition.canvasNodes.push(canvasNode);
            }
        }

        return definition;
    }

    private recursivelyGetDependents(node: ExperimentDefinitionNode, dependents: string[]): void {
        if (node.type === "widget") {
            if (dependents.indexOf(node.attributes.uuid) < 0) {
                dependents.push(node.attributes.uuid);
            }
        }
        for (const child of node.children) {
            this.recursivelyGetDependents(child, dependents);
        }
    }

    /**
     * Given an experiment definition, get a unique list of dependent widget UUIDs.
     * @param definition
     */
    getDependentWidgetsByDefinition(definition: ExperimentDefinition): string[] {
        let dependents: string[] = [];
        for (const child of definition.canvasNodes) {
            this.recursivelyGetDependents(child, dependents);
        }
        return dependents;
    }

}
