import { AwsClient, BaseExternalAccountClient, Compute, ExternalAccountClient, GoogleAuth, GoogleAuthOptions, IdentityPoolClient, Impersonated, JWT, OAuth2Client, ProjectIdCallback, UserRefreshClient } from 'google-auth-library';
export declare class AuthPlus extends GoogleAuth {
    JWT: typeof JWT;
    Compute: typeof Compute;
    OAuth2: typeof OAuth2Client;
    GoogleAuth: typeof GoogleAuth;
    AwsClient: typeof AwsClient;
    IdentityPoolClient: typeof IdentityPoolClient;
    ExternalAccountClient: typeof ExternalAccountClient;
    private _cachedAuth?;
    /**
     * Override getClient(), memoizing an instance of auth for
     * subsequent calls to getProjectId().
     */
    getClient(options?: GoogleAuthOptions): Promise<Compute | JWT | UserRefreshClient | BaseExternalAccountClient | Impersonated>;
    /**
     * Override getProjectId(), using the most recently configured
     * auth instance when fetching projectId.
     */
    getProjectId(): Promise<string>;
    getProjectId(callback: ProjectIdCallback): void;
}
