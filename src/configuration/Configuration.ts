import {injectable} from "inversify";

@injectable()
export class Configuration {

    get apiGatewayUrl(): string {
        return this._apiGatewayUrl;
    }

    set apiGatewayUrl(value: string) {
        this._apiGatewayUrl = value;
    }

    get experimentRegistryUrl(): string {
        return this._experimentRegistryUrl;
    }

    set experimentRegistryUrl(value: string) {
        this._experimentRegistryUrl = value;
    }


    private _experimentRegistryUrl: string = "http://localhost:3000";

    private _apiGatewayUrl: string = "https://dev-gateway.treatproject.tk/graphql";


}