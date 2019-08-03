import {inject, injectable}                             from "inversify";
import {ExperimentService}                              from "../service/ExperimentService";
import {WidgetPool}                                     from "../widget/WidgetPool";
import * as uuid                                        from 'uuid/v4';
import {DomMounter}                                     from "../dom/DomMounter";
import {ExperimentDefinition, ExperimentDefinitionNode} from "../type/ExperimentDefinition";
import {Section}                                        from "../dom/Section";
import {WidgetInstance}                                 from "../widget/WidgetInstance";
import * as Babel                                       from '@babel/standalone';
import {Widget}                                         from "../widget/Widget";
// import Vue                                              from '@uoft-treat/carbon-vue';

@injectable()
export class Experiment {

    get definition(): ExperimentDefinition {
        return this._definition;
    }

    set definition(value: ExperimentDefinition) {
        this._definition = value;
    }

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

    private _widgetData = {};

    private _uuid: String;

    private _id: String;

    private _definition: ExperimentDefinition;

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

    public injectWidgetToPool(uuid: string, widget: Widget) {
        this.widgetPool.injectWidget(uuid, widget);
    }

    private async mountDomByDefinition(sectionNode: Section, node: ExperimentDefinitionNode) {
        if (node.type === "section") {
            const newSection = new Section();
            sectionNode.appendChild(newSection);
            for (const child of node.children) {
                await this.mountDomByDefinition(newSection, child);
            }
        } else if (node.type === "widget") {
            await this.mountWidgetToSection(sectionNode, node.attributes.uuid, node.attributes.id);
        }
    }

    private async mountWidgetToSection(section: Section, uuid: string, id: string) {
        let widget = await this.widgetPool.getWidget(uuid);
        widget.mountStyleGlobally();
        const wrapperSection = new Section();
        wrapperSection.replaceInnerHtml(widget.templateSource);
        section.appendChild(wrapperSection);

        let scriptEval = eval(widget.getTransformedSource());

        let inputs = {...scriptEval.inputs};
        let outputs = {...scriptEval.outputs};

        this._widgetData[id] = {
            inputs,
            outputs,
        };

        const vm = new window.Vue({
            el: `#${wrapperSection.elementId}`,
            data: {
                ...scriptEval.data,
                inputs,
                outputs,
            },
            methods: {...scriptEval.methods},
        });

        console.log(scriptEval.methods);

        const widgetInstance = new WidgetInstance();
        widgetInstance.vm = vm;
        widgetInstance.inputs = inputs;
        widgetInstance.outputs = outputs;
        widgetInstance.widget = widget;
        widgetInstance.id = id;

        this._widgetInstances.push(widgetInstance);

    }

    async mount(selector: string) {

        if (!this._definition) {
            throw new Error("Experiment definition not loaded.");
        }

        let rootSection = this.domMounter.mountSectionById(selector);
        for (const child of this._definition.canvasNodes) {
            if (child.type === "section") {
                await this.mountDomByDefinition(rootSection, child);
            } else if (child.type === "widget") {
                await this.mountWidgetToSection(rootSection, child.attributes.uuid, child.attributes.name);
            }
        }

        // Mount the controller VM
        const script = Babel.transform(this._definition.script, {presets: ['es2015']}).code;

        let scriptEval = eval(script);

        let controllerSection = this.domMounter.mountSectionById(selector);
        const vm = new window.Vue({
            el: `#${controllerSection.elementId}`,
            data: {
                widgetData: this._widgetData,
            },
            mounted: scriptEval.onMount,
            watch: {
                widgetData: {
                    handler: scriptEval.onWidgetStateChange,
                    deep: true,
                }
            }
        });

    }

    getWidgetInstanceById(id: string): WidgetInstance | null {
        for (const instance of this.widgetInstances) {
            if (instance.id === id) {
                return instance;
            }
        }
        return null;
    }

    get uuid(): String {
        return this._uuid;
    }

    set uuid(value: String) {
        this._uuid = value;
    }

}
