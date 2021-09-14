import { Method } from 'got';
declare type QueryParameters = {
    [key: string]: number | number[] | string | string[] | boolean;
};
export declare type ClientParams = {
    /** Pluggy Client ID */
    clientId: string;
    /** Pluggy Client Secret */
    clientSecret: string;
    baseUrl?: string;
    showUrls?: boolean;
};
export declare class BaseApi {
    private apiKey;
    private clientId;
    private clientSecret;
    private baseUrl?;
    private showUrls;
    constructor(params: ClientParams);
    private getApiKey;
    protected createGetRequest<T, K>(endpoint: string, params?: QueryParameters, transformCb?: (response: K) => T): Promise<T>;
    protected createPostRequest<T, K>(endpoint: string, params?: QueryParameters, body?: Record<string, unknown>, transformCb?: (response: K) => T): Promise<T>;
    protected createPutRequest<T, K>(endpoint: string, params?: QueryParameters, body?: Record<string, unknown>, transformCb?: (response: K) => T): Promise<T>;
    protected createPatchRequest<T, K>(endpoint: string, params?: QueryParameters, body?: Record<string, unknown>, transformCb?: (response: K) => T): Promise<T>;
    protected createDeleteRequest<T, K>(endpoint: string, params?: QueryParameters, body?: Record<string, unknown>, transformCb?: (response: K) => T): Promise<T>;
    protected createMutationRequest<T, K>(method: Method, endpoint: string, params?: QueryParameters, body?: Record<string, unknown>, transformCb?: (response: K) => T): Promise<T>;
    protected mapToQueryString(params: QueryParameters): string;
    protected isJwtExpired(token: string): boolean;
}
export {};
