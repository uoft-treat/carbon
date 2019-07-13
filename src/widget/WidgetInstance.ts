import {Widget} from "./Widget";

export class WidgetInstance {
    get vm(): any {
        return this._vm;
    }

    set vm(value: any) {
        this._vm = value;
    }

    private _vm: any;

    public inputs: any;

    public outputs: any;

    public widget: Widget;

}