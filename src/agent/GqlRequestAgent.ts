export interface GqlRequestAgent {

    mutate(url: string, mutation: string, variables?: any): Promise<any>;

    query(url: string, query: string, variables?: any): Promise<any>;

}
