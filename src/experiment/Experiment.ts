import {inject, injectable}       from "inversify";
import {ExperimentService}        from "../service/ExperimentService";
import {WidgetPool}               from "../widget/WidgetPool";
import * as uuid                  from 'uuid/v4';
import {DomMounter}               from "../dom/DomMounter";
import {ExperimentDefinitionNode} from "../type/ExperimentDefinition";
import {Section}                  from "../dom/Section";
import {WidgetInstance}           from "../widget/WidgetInstance";

@injectable()
export class Experiment {
    get widgetInstances(): WidgetInstance[] {
        return this._widgetInstances;
    }

    set widgetInstances(value: WidgetInstance[]) {
        this._widgetInstances = value;
    }

    private experimentService: ExperimentService;
    private widgetPool: WidgetPool;
    private domMounter: DomMounter;

    private _widgetInstances: WidgetInstance[] = [];

    private _uuid: String;

    private _id: String;

    constructor(
        @inject("ExperimentService") experimentService: ExperimentService,
        @inject("WidgetPool") widgetPool: WidgetPool,
        @inject("DomMounter") domMounter: DomMounter,
    ) {
        this.experimentService = experimentService;
        this.widgetPool = widgetPool;
        this.domMounter = domMounter;
        this._id = uuid();
    }


    private async mountDomByDefinition(sectionNode: Section, node: ExperimentDefinitionNode) {

        if (node.type === "section") {
            const newSection = new Section();
            sectionNode.appendChild(newSection);
            for (const child of node.children) {
                await this.mountDomByDefinition(newSection, child);
            }
        } else if (node.type === "widget") {
            await this.mountWidgetToSection(sectionNode, node.attributes.uuid);
        }

    }

    private async mountWidgetToSection(section: Section, uuid: string) {
        let widget = await this.widgetPool.getWidget(uuid);
        widget.mountStyleGlobally();
        const wrapperSection = new Section();
        wrapperSection.replaceInnerHtml(widget.templateSource);
        section.appendChild(wrapperSection);

        let scriptEval = eval(widget.getTransformedSource());

        let inputs = {...scriptEval.inputs};
        let outputs = {...scriptEval.outputs};

        const vm = new window.Vue({
            el: `#${wrapperSection.elementId}`,
            data: {
                ...scriptEval.data,
                inputs,
                outputs,
            },
            methods: {...scriptEval.methods},
        });

        const widgetInstance = new WidgetInstance();
        widgetInstance.vm = vm;
        widgetInstance.inputs = inputs;
        widgetInstance.outputs = outputs;
        widgetInstance.widget = widget;

        this._widgetInstances.push(widgetInstance);

    }

    async mount(selector: string) {
        const def = await this.experimentService.getExperimentDefinition("my-experiment");

        let rootSection = this.domMounter.mountSectionById(selector);
        for (const child of def.canvasNodes) {
            if (child.type === "section") {
                await this.mountDomByDefinition(rootSection, child);
            } else if (child.type === "widget") {
                await this.mountWidgetToSection(rootSection, child.attributes.uuid);
            }
        }

    }


    get uuid(): String {
        return this._uuid;
    }

    set uuid(value: String) {
        this._uuid = value;
    }

}
