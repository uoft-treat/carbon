import {WebRequestAgent} from "../WebRequestAgent";
import {injectable}      from "inversify";
import axios             from 'axios';

@injectable()
export class WebRequestAgentImpl implements WebRequestAgent {

    async getObject(url: string): Promise<any> {
        return await axios.get(url);
    }

}