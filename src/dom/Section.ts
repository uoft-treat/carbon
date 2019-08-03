import * as uuid from 'uuid/v4';

export class Section {

    private _id: string;

    private _root: HTMLElement;

    constructor() {
        this._id = uuid();
        this._root = document.createElement("div");
        this._root.setAttribute("id", this.elementId);
    }

    get elementId() {
        return "carbon-section-" + this._id;
    }

    public getRootDomNode() {
        return this._root;
    }

    public appendChild(child: Section) {
        this._root.appendChild(child.getRootDomNode());
    }

    public replaceInnerHtml(html: string) {
        this._root.innerHTML = html;
    }

}
