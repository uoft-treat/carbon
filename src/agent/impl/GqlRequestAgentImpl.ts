import {GqlRequestAgent} from "../GqlRequestAgent";
import {injectable}      from "inversify";
import request           from "graphql-request";

@injectable()
export class GqlRequestAgentImpl implements GqlRequestAgent {

    async mutate(url: string, mutation: string, variables?: any): Promise<any> {
        return await request(url, mutation, variables);
    }

    async query(url: string, query: string, variables?: any): Promise<any> {
        return await request(url, query, variables);
    }

}
