import {inject, injectable} from "inversify";
import {Widget}             from "./Widget";
import {GqlRequestAgent}    from "../agent/GqlRequestAgent";
import {Configuration}      from "../configuration/Configuration";

/**
 * A singleton instance used to manage all widgets loaded within the engine.
 */
@injectable()
export class WidgetPool {

    private widgets: { [key: string]: Widget } = {};
    private gqlRequestAgent: GqlRequestAgent;
    private configuration: Configuration;

    constructor(
        @inject("GqlRequestAgent") gqlRequestAgent: GqlRequestAgent,
        @inject("Configuration") configuration: Configuration
    ) {
        this.gqlRequestAgent = gqlRequestAgent;
        this.configuration = configuration;
    }

    injectWidget(uuid: string, widget: Widget) {
        this.widgets[uuid] = widget;
    }

    /**
     * Get a widget by UUID from pool.
     * @param uuid
     */
    async getWidget(uuid: string): Promise<Widget> {
        if (this.widgets[uuid]) {
            return this.widgets[uuid];
        } else {
            // Load the widget
            let result = await this.gqlRequestAgent.query(
                this.configuration.apiGatewayUrl,
                `
                    query($uuid: String) {
                      widgets(uuid: $uuid) {
                        uuid
                        name
                        scriptSource
                        templateSource
                        styleSource
                      }
                    }
                `
                , {uuid});
            let widgetData = result.widgets[0];
            this.widgets[uuid] = new Widget(widgetData.uuid, widgetData.name, widgetData.scriptSource, widgetData.templateSource, widgetData.styleSource);
            return this.widgets[uuid];
        }
    }


}
