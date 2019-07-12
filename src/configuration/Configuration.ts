import {injectable} from "inversify";

@injectable()
export class Configuration {

    get experimentRegistryUrl(): string {
        return this._experimentRegistryUrl;
    }

    set experimentRegistryUrl(value: string) {
        this._experimentRegistryUrl = value;
    }


    private _experimentRegistryUrl: string = "http://localhost:3000";


}