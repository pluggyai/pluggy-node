"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApi = void 0;
const got_1 = require("got");
const jwt = require("jsonwebtoken");
class BaseApi {
    constructor(params) {
        this.showUrls = false;
        const { clientId, clientSecret, baseUrl = 'https://api.pluggy.ai', showUrls = false } = params;
        this.baseUrl = baseUrl;
        this.showUrls = showUrls;
        if (clientSecret && clientId) {
            this.clientId = clientId;
            this.clientSecret = clientSecret;
        }
        else {
            throw new Error('Missing authorization for API communication');
        }
    }
    getApiKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.apiKey && !this.isJwtExpired(this.apiKey)) {
                return this.apiKey;
            }
            const response = yield got_1.default.post(`${this.baseUrl}/auth`, {
                json: {
                    clientId: this.clientId,
                    clientSecret: this.clientSecret,
                    nonExpiring: false,
                },
                responseType: 'json',
            });
            this.apiKey = response.body.apiKey;
            return this.apiKey;
        });
    }
    createGetRequest(endpoint, params, transformCb) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = yield this.getApiKey();
            const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`;
            if (this.showUrls) {
                console.log(url);
            }
            try {
                const { statusCode, body } = yield got_1.default(url, {
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    responseType: 'json',
                });
                if (statusCode !== 200) {
                    return Promise.reject(body);
                }
                try {
                    let obj = transformCb ? transformCb(body) : body;
                    return Promise.resolve(obj);
                }
                catch (error) {
                    console.error(`[Pluggy SDK] JSON parsing failed: ${error.message || ''}`, error);
                    console.warn(`[Pluggy SDK] Are you sure you are using the latest version of "pluggy-sdk"?`);
                }
            }
            catch (error) {
                console.error(`[Pluggy SDK] HTTP request failed: ${error.message || ''}`, error);
                return Promise.reject(error);
            }
        });
    }
    createPostRequest(endpoint, params, body, transformCb) {
        return this.createMutationRequest('post', endpoint, params, body, transformCb);
    }
    createPutRequest(endpoint, params, body, transformCb) {
        return this.createMutationRequest('put', endpoint, params, body, transformCb);
    }
    createPatchRequest(endpoint, params, body, transformCb) {
        return this.createMutationRequest('patch', endpoint, params, body, transformCb);
    }
    createDeleteRequest(endpoint, params, body, transformCb) {
        return this.createMutationRequest('delete', endpoint, params, body, transformCb);
    }
    createMutationRequest(method, endpoint, params, body, transformCb) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = yield this.getApiKey();
            const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`;
            if (this.showUrls) {
                console.log(url);
            }
            if (body) {
                Object.keys(body).forEach(key => (body[key] === undefined ? delete body[key] : {}));
            }
            try {
                const { statusCode, body: responseBody } = yield got_1.default(url, {
                    method,
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: body,
                    responseType: 'json',
                });
                if (statusCode !== 200) {
                    return Promise.reject(body);
                }
                try {
                    let obj = transformCb ? transformCb(responseBody) : responseBody;
                    return Promise.resolve(obj);
                }
                catch (error) {
                    console.error(`[Pluggy SDK] JSON parsing failed: ${error.message || ''}`, error);
                    console.warn(`[Pluggy SDK] Are you sure you are using the latest version of "pluggy-sdk"?`);
                }
            }
            catch (error) {
                console.error(`[Pluggy SDK] HTTP request failed: ${error.message || ''}`, error);
                return Promise.reject(error);
            }
        });
    }
    mapToQueryString(params) {
        if (!params) {
            return '';
        }
        const query = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null)
            .map(key => key + '=' + params[key])
            .join('&');
        return `?${query}`;
    }
    isJwtExpired(token) {
        const decoded = jwt.decode(token, { complete: true });
        return decoded.payload.exp <= Math.floor(Date.now() / 1000);
    }
}
exports.BaseApi = BaseApi;
