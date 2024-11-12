export interface ApiResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

export class ApiSettings {
    accessToken: string;
    tokenType: string;
    scope: string;
    expiresAt: number;
    refreshToken: string;

    constructor(response: ApiResponse) {
        this.accessToken = response.access_token;
        this.tokenType = response.token_type;
        this.scope = response.scope;
        this.expiresAt = Date.now() + response.expires_in * 1000;
        this.refreshToken = response.refresh_token;
    }
}