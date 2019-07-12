import * as xmlJs from 'xml-js';

export class XmlParser {

    static parseXmlFromString(xml: string): Promise<any> {
        return new Promise(resolve => {
            resolve(JSON.parse(xmlJs.xml2json(xml, {compact: true})));
        })
    }

}