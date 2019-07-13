import * as Babel from '@babel/standalone';

export class Widget {

    get styleSource(): string {
        return this._styleSource;
    }
    get templateSource(): string {
        return this._templateSource;
    }
    get scriptSource(): string {
        return this._scriptSource;
    }
    get name(): string {
        return this._name;
    }
    get uuid(): string {
        return this._uuid;
    }

    private readonly _uuid: string;

    private readonly _name: string;

    private readonly _scriptSource: string;

    private readonly _templateSource: string;

    private readonly _styleSource: string;

    private _styleMounted: boolean = false;

    constructor(
        uuid: string,
        name: string,
        scriptSource: string,
        templateSource: string,
        styleSource: string
    ) {
        this._uuid = uuid;
        this._name = name;
        this._scriptSource = scriptSource;
        this._templateSource = templateSource;
        this._styleSource = styleSource;
    }

    getTransformedSource() {
        return Babel.transform(this.scriptSource, { presets: ['es2015'] }).code;
    }

    public mountStyleGlobally() {
        if(!this._styleMounted) {
            let styleEl = document.createElement("style");
            styleEl.innerHTML = this.styleSource;
            document.head.appendChild(styleEl);
        }
    }

}