import {injectable} from "inversify";
import {Section}    from "./Section";

@injectable()
export class DomMounter {

    public mountSectionById(id: string): Section {
        let section = new Section();
        let domElement = document.getElementById(id);
        domElement.appendChild(section.getRootDomNode());
        return section;
    }

}

