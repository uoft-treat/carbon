export interface WebRequestAgent {

    getObject(url: string): Promise<any>;

}
