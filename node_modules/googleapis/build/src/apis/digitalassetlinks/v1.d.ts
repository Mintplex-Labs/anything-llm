import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace digitalassetlinks_v1 {
    export interface Options extends GlobalOptions {
        version: 'v1';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | BaseExternalAccountClient | GoogleAuth;
        /**
         * V1 error format.
         */
        '$.xgafv'?: string;
        /**
         * OAuth access token.
         */
        access_token?: string;
        /**
         * Data format for response.
         */
        alt?: string;
        /**
         * JSONP
         */
        callback?: string;
        /**
         * Selector specifying which fields to include in a partial response.
         */
        fields?: string;
        /**
         * API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
         */
        key?: string;
        /**
         * OAuth 2.0 token for the current user.
         */
        oauth_token?: string;
        /**
         * Returns response with indentations and line breaks.
         */
        prettyPrint?: boolean;
        /**
         * Available to use for quota purposes for server-side applications. Can be any arbitrary string assigned to a user, but should not exceed 40 characters.
         */
        quotaUser?: string;
        /**
         * Legacy upload protocol for media (e.g. "media", "multipart").
         */
        uploadType?: string;
        /**
         * Upload protocol for media (e.g. "raw", "multipart").
         */
        upload_protocol?: string;
    }
    /**
     * Digital Asset Links API
     *
     * Discovers relationships between online assets such as websites or mobile apps.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const digitalassetlinks = google.digitalassetlinks('v1');
     * ```
     */
    export class Digitalassetlinks {
        context: APIRequestContext;
        assetlinks: Resource$Assetlinks;
        statements: Resource$Statements;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Describes an android app asset.
     */
    export interface Schema$AndroidAppAsset {
        /**
         * Because there is no global enforcement of package name uniqueness, we also require a signing certificate, which in combination with the package name uniquely identifies an app. Some apps' signing keys are rotated, so they may be signed by different keys over time. We treat these as distinct assets, since we use (package name, cert) as the unique ID. This should not normally pose any problems as both versions of the app will make the same or similar statements. Other assets making statements about the app will have to be updated when a key is rotated, however. (Note that the syntaxes for publishing and querying for statements contain syntactic sugar to easily let you specify apps that are known by multiple certificates.) REQUIRED
         */
        certificate?: Schema$CertificateInfo;
        /**
         * Android App assets are naturally identified by their Java package name. For example, the Google Maps app uses the package name `com.google.android.apps.maps`. REQUIRED
         */
        packageName?: string | null;
    }
    /**
     * Uniquely identifies an asset. A digital asset is an identifiable and addressable online entity that typically provides some service or content. Examples of assets are websites, Android apps, Twitter feeds, and Plus Pages.
     */
    export interface Schema$Asset {
        /**
         * Set if this is an Android App asset.
         */
        androidApp?: Schema$AndroidAppAsset;
        /**
         * Set if this is a web asset.
         */
        web?: Schema$WebAsset;
    }
    /**
     * Message used to check for the existence of multiple digital asset links within a single RPC.
     */
    export interface Schema$BulkCheckRequest {
        /**
         * If specified, will be used in any given template statement that doesn’t specify a relation.
         */
        defaultRelation?: string | null;
        /**
         * If specified, will be used in any given template statement that doesn’t specify a source.
         */
        defaultSource?: Schema$Asset;
        /**
         * If specified, will be used in any given template statement that doesn’t specify a target.
         */
        defaultTarget?: Schema$Asset;
        /**
         * Same configuration as in CheckRequest; all statement checks will use the same configuration.
         */
        returnRelationExtensions?: boolean | null;
        /**
         * List of statements to check. For each statement, you can omit a field if the corresponding default_* field below was supplied. Minimum 1 statement; maximum 1,000 statements. Any additional statements will be ignored.
         */
        statements?: Schema$StatementTemplate[];
    }
    /**
     * Response for BulkCheck call. Results are sent in a list in the same order in which they were sent. Individual check errors are described in the appropriate check_results entry. If the entire call fails, the response will include a bulk_error_code field describing the error.
     */
    export interface Schema$BulkCheckResponse {
        /**
         * Error code for the entire request. Present only if the entire request failed. Individual check errors will not trigger the presence of this field.
         */
        bulkErrorCode?: string | null;
        /**
         * List of results for each check request. Results are returned in the same order in which they were sent in the request.
         */
        checkResults?: Schema$CheckResponse[];
    }
    /**
     * Describes an X509 certificate.
     */
    export interface Schema$CertificateInfo {
        /**
         * The uppercase SHA-265 fingerprint of the certificate. From the PEM certificate, it can be acquired like this: $ keytool -printcert -file $CERTFILE | grep SHA256: SHA256: 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83: \ 42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 or like this: $ openssl x509 -in $CERTFILE -noout -fingerprint -sha256 SHA256 Fingerprint=14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64: \ 16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 In this example, the contents of this field would be `14:6D:E9:83:C5:73: 06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF: 44:E5`. If these tools are not available to you, you can convert the PEM certificate into the DER format, compute the SHA-256 hash of that string and represent the result as a hexstring (that is, uppercase hexadecimal representations of each octet, separated by colons).
         */
        sha256Fingerprint?: string | null;
    }
    /**
     * Response message for the CheckAssetLinks call.
     */
    export interface Schema$CheckResponse {
        /**
         * Human-readable message containing information intended to help end users understand, reproduce and debug the result. The message will be in English and we are currently not planning to offer any translations. Please note that no guarantees are made about the contents or format of this string. Any aspect of it may be subject to change without notice. You should not attempt to programmatically parse this data. For programmatic access, use the error_code field below.
         */
        debugString?: string | null;
        /**
         * Error codes that describe the result of the Check operation.
         */
        errorCode?: string[] | null;
        /**
         * Set to true if the assets specified in the request are linked by the relation specified in the request.
         */
        linked?: boolean | null;
        /**
         * From serving time, how much longer the response should be considered valid barring further updates. REQUIRED
         */
        maxAge?: string | null;
        /**
         * Statements may specify relation level extensions/payloads to express more details when declaring permissions to grant from the source asset to the target asset. When requested, the API will return relation_extensions specified in any and all statements linking the requested source and target assets by the relation specified in the request.
         */
        relationExtensions?: Array<{
            [key: string]: any;
        }> | null;
    }
    /**
     * Response message for the List call.
     */
    export interface Schema$ListResponse {
        /**
         * Human-readable message containing information intended to help end users understand, reproduce and debug the result. The message will be in English and we are currently not planning to offer any translations. Please note that no guarantees are made about the contents or format of this string. Any aspect of it may be subject to change without notice. You should not attempt to programmatically parse this data. For programmatic access, use the error_code field below.
         */
        debugString?: string | null;
        /**
         * Error codes that describe the result of the List operation.
         */
        errorCode?: string[] | null;
        /**
         * From serving time, how much longer the response should be considered valid barring further updates. REQUIRED
         */
        maxAge?: string | null;
        /**
         * A list of all the matching statements that have been found.
         */
        statements?: Schema$Statement[];
    }
    /**
     * Describes a reliable statement that has been made about the relationship between a source asset and a target asset. Statements are always made by the source asset, either directly or by delegating to a statement list that is stored elsewhere. For more detailed definitions of statements and assets, please refer to our [API documentation landing page](/digital-asset-links/v1/getting-started).
     */
    export interface Schema$Statement {
        /**
         * The relation identifies the use of the statement as intended by the source asset's owner (that is, the person or entity who issued the statement). Every complete statement has a relation. We identify relations with strings of the format `/`, where `` must be one of a set of pre-defined purpose categories, and `` is a free-form lowercase alphanumeric string that describes the specific use case of the statement. Refer to [our API documentation](/digital-asset-links/v1/relation-strings) for the current list of supported relations. Example: `delegate_permission/common.handle_all_urls` REQUIRED
         */
        relation?: string | null;
        /**
         * Statements may specify relation level extensions/payloads to express more details when declaring permissions to grant from the source asset to the target asset. These relation extensions should be specified in the `relation_extensions` object, keyed by the relation type they're associated with. { relation: ["delegate_permission/common.handle_all_urls"], target: {...\}, relation_extensions: { "delegate_permission/common.handle_all_urls": { ...handle_all_urls specific payload specified here... \} \} \} When requested, and specified in the statement file, the API will return relation_extensions associated with the statement's relation type. i.e. the API will only return relation_extensions specified for "delegate_permission/common.handle_all_urls" if this statement object's relation type is "delegate_permission/common.handle_all_urls".
         */
        relationExtensions?: {
            [key: string]: any;
        } | null;
        /**
         * Every statement has a source asset. REQUIRED
         */
        source?: Schema$Asset;
        /**
         * Every statement has a target asset. REQUIRED
         */
        target?: Schema$Asset;
    }
    /**
     * A single statement to check in a bulk call using BulkCheck. See CheckRequest for details about each field.
     */
    export interface Schema$StatementTemplate {
        /**
         * The relationship being asserted between the source and target. If omitted, you must specify a BulkCheckRequest.default_relation value to use here.
         */
        relation?: string | null;
        /**
         * The source asset that is asserting the statement. If omitted, you must specify a BulkCheckRequest.default_source value to use here.
         */
        source?: Schema$Asset;
        /**
         * The target that the source is declaring the relationship with. If omitted, you must specify a BulkCheckRequest.default_target to use here.
         */
        target?: Schema$Asset;
    }
    /**
     * Describes a web asset.
     */
    export interface Schema$WebAsset {
        /**
         * Web assets are identified by a URL that contains only the scheme, hostname and port parts. The format is http[s]://[:] Hostnames must be fully qualified: they must end in a single period ("`.`"). Only the schemes "http" and "https" are currently allowed. Port numbers are given as a decimal number, and they must be omitted if the standard port numbers are used: 80 for http and 443 for https. We call this limited URL the "site". All URLs that share the same scheme, hostname and port are considered to be a part of the site and thus belong to the web asset. Example: the asset with the site `https://www.google.com` contains all these URLs: * `https://www.google.com/` * `https://www.google.com:443/` * `https://www.google.com/foo` * `https://www.google.com/foo?bar` * `https://www.google.com/foo#bar` * `https://user@password:www.google.com/` But it does not contain these URLs: * `http://www.google.com/` (wrong scheme) * `https://google.com/` (hostname does not match) * `https://www.google.com:444/` (port does not match) REQUIRED
         */
        site?: string | null;
    }
    export class Resource$Assetlinks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Send a bundle of statement checks in a single RPC to minimize latency and service load. Statements need not be all for the same source and/or target. We recommend using this method when you need to check more than one statement in a short period of time.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkCheck(params: Params$Resource$Assetlinks$Bulkcheck, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkCheck(params?: Params$Resource$Assetlinks$Bulkcheck, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkCheckResponse>>;
        bulkCheck(params: Params$Resource$Assetlinks$Bulkcheck, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkCheck(params: Params$Resource$Assetlinks$Bulkcheck, options: MethodOptions | BodyResponseCallback<Schema$BulkCheckResponse>, callback: BodyResponseCallback<Schema$BulkCheckResponse>): void;
        bulkCheck(params: Params$Resource$Assetlinks$Bulkcheck, callback: BodyResponseCallback<Schema$BulkCheckResponse>): void;
        bulkCheck(callback: BodyResponseCallback<Schema$BulkCheckResponse>): void;
        /**
         * Determines whether the specified (directional) relationship exists between the specified source and target assets. The relation describes the intent of the link between the two assets as claimed by the source asset. An example for such relationships is the delegation of privileges or permissions. This command is most often used by infrastructure systems to check preconditions for an action. For example, a client may want to know if it is OK to send a web URL to a particular mobile app instead. The client can check for the relevant asset link from the website to the mobile app to decide if the operation should be allowed. A note about security: if you specify a secure asset as the source, such as an HTTPS website or an Android app, the API will ensure that any statements used to generate the response have been made in a secure way by the owner of that asset. Conversely, if the source asset is an insecure HTTP website (that is, the URL starts with `http://` instead of `https://`), the API cannot verify its statements securely, and it is not possible to ensure that the website's statements have not been altered by a third party. For more information, see the [Digital Asset Links technical design specification](https://github.com/google/digitalassetlinks/blob/master/well-known/details.md).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        check(params: Params$Resource$Assetlinks$Check, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        check(params?: Params$Resource$Assetlinks$Check, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CheckResponse>>;
        check(params: Params$Resource$Assetlinks$Check, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        check(params: Params$Resource$Assetlinks$Check, options: MethodOptions | BodyResponseCallback<Schema$CheckResponse>, callback: BodyResponseCallback<Schema$CheckResponse>): void;
        check(params: Params$Resource$Assetlinks$Check, callback: BodyResponseCallback<Schema$CheckResponse>): void;
        check(callback: BodyResponseCallback<Schema$CheckResponse>): void;
    }
    export interface Params$Resource$Assetlinks$Bulkcheck extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkCheckRequest;
    }
    export interface Params$Resource$Assetlinks$Check extends StandardParameters {
        /**
         * Query string for the relation. We identify relations with strings of the format `/`, where `` must be one of a set of pre-defined purpose categories, and `` is a free-form lowercase alphanumeric string that describes the specific use case of the statement. Refer to [our API documentation](/digital-asset-links/v1/relation-strings) for the current list of supported relations. For a query to match an asset link, both the query's and the asset link's relation strings must match exactly. Example: A query with relation `delegate_permission/common.handle_all_urls` matches an asset link with relation `delegate_permission/common.handle_all_urls`.
         */
        relation?: string;
        /**
         * Whether to return relation_extensions payloads specified in the source Digital Asset Links statements linking the requested source and target assets by the requested relation type. If this is set to `false` (default), relation_extensions specified will not be returned, even if they are specified in the DAL statement file. If set to `true`, the API will propagate any and all relation_extensions, across statements, linking the source and target assets by the requested relation type, if specified in the DAL statement file.
         */
        returnRelationExtensions?: boolean;
        /**
         * The uppercase SHA-265 fingerprint of the certificate. From the PEM certificate, it can be acquired like this: $ keytool -printcert -file $CERTFILE | grep SHA256: SHA256: 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83: \ 42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 or like this: $ openssl x509 -in $CERTFILE -noout -fingerprint -sha256 SHA256 Fingerprint=14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64: \ 16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 In this example, the contents of this field would be `14:6D:E9:83:C5:73: 06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF: 44:E5`. If these tools are not available to you, you can convert the PEM certificate into the DER format, compute the SHA-256 hash of that string and represent the result as a hexstring (that is, uppercase hexadecimal representations of each octet, separated by colons).
         */
        'source.androidApp.certificate.sha256Fingerprint'?: string;
        /**
         * Android App assets are naturally identified by their Java package name. For example, the Google Maps app uses the package name `com.google.android.apps.maps`. REQUIRED
         */
        'source.androidApp.packageName'?: string;
        /**
         * Web assets are identified by a URL that contains only the scheme, hostname and port parts. The format is http[s]://[:] Hostnames must be fully qualified: they must end in a single period ("`.`"). Only the schemes "http" and "https" are currently allowed. Port numbers are given as a decimal number, and they must be omitted if the standard port numbers are used: 80 for http and 443 for https. We call this limited URL the "site". All URLs that share the same scheme, hostname and port are considered to be a part of the site and thus belong to the web asset. Example: the asset with the site `https://www.google.com` contains all these URLs: * `https://www.google.com/` * `https://www.google.com:443/` * `https://www.google.com/foo` * `https://www.google.com/foo?bar` * `https://www.google.com/foo#bar` * `https://user@password:www.google.com/` But it does not contain these URLs: * `http://www.google.com/` (wrong scheme) * `https://google.com/` (hostname does not match) * `https://www.google.com:444/` (port does not match) REQUIRED
         */
        'source.web.site'?: string;
        /**
         * The uppercase SHA-265 fingerprint of the certificate. From the PEM certificate, it can be acquired like this: $ keytool -printcert -file $CERTFILE | grep SHA256: SHA256: 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83: \ 42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 or like this: $ openssl x509 -in $CERTFILE -noout -fingerprint -sha256 SHA256 Fingerprint=14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64: \ 16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 In this example, the contents of this field would be `14:6D:E9:83:C5:73: 06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF: 44:E5`. If these tools are not available to you, you can convert the PEM certificate into the DER format, compute the SHA-256 hash of that string and represent the result as a hexstring (that is, uppercase hexadecimal representations of each octet, separated by colons).
         */
        'target.androidApp.certificate.sha256Fingerprint'?: string;
        /**
         * Android App assets are naturally identified by their Java package name. For example, the Google Maps app uses the package name `com.google.android.apps.maps`. REQUIRED
         */
        'target.androidApp.packageName'?: string;
        /**
         * Web assets are identified by a URL that contains only the scheme, hostname and port parts. The format is http[s]://[:] Hostnames must be fully qualified: they must end in a single period ("`.`"). Only the schemes "http" and "https" are currently allowed. Port numbers are given as a decimal number, and they must be omitted if the standard port numbers are used: 80 for http and 443 for https. We call this limited URL the "site". All URLs that share the same scheme, hostname and port are considered to be a part of the site and thus belong to the web asset. Example: the asset with the site `https://www.google.com` contains all these URLs: * `https://www.google.com/` * `https://www.google.com:443/` * `https://www.google.com/foo` * `https://www.google.com/foo?bar` * `https://www.google.com/foo#bar` * `https://user@password:www.google.com/` But it does not contain these URLs: * `http://www.google.com/` (wrong scheme) * `https://google.com/` (hostname does not match) * `https://www.google.com:444/` (port does not match) REQUIRED
         */
        'target.web.site'?: string;
    }
    export class Resource$Statements {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves a list of all statements from a given source that match the specified target and statement string. The API guarantees that all statements with secure source assets, such as HTTPS websites or Android apps, have been made in a secure way by the owner of those assets, as described in the [Digital Asset Links technical design specification](https://github.com/google/digitalassetlinks/blob/master/well-known/details.md). Specifically, you should consider that for insecure websites (that is, where the URL starts with `http://` instead of `https://`), this guarantee cannot be made. The `List` command is most useful in cases where the API client wants to know all the ways in which two assets are related, or enumerate all the relationships from a particular source asset. Example: a feature that helps users navigate to related items. When a mobile app is running on a device, the feature would make it easy to navigate to the corresponding web site or Google+ profile.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Statements$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Statements$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListResponse>>;
        list(params: Params$Resource$Statements$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Statements$List, options: MethodOptions | BodyResponseCallback<Schema$ListResponse>, callback: BodyResponseCallback<Schema$ListResponse>): void;
        list(params: Params$Resource$Statements$List, callback: BodyResponseCallback<Schema$ListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListResponse>): void;
    }
    export interface Params$Resource$Statements$List extends StandardParameters {
        /**
         * Use only associations that match the specified relation. See the [`Statement`](#Statement) message for a detailed definition of relation strings. For a query to match a statement, one of the following must be true: * both the query's and the statement's relation strings match exactly, or * the query's relation string is empty or missing. Example: A query with relation `delegate_permission/common.handle_all_urls` matches an asset link with relation `delegate_permission/common.handle_all_urls`.
         */
        relation?: string;
        /**
         * Whether to return any relation_extensions payloads specified in the source digital asset links statements. If this is set to `false` (default), relation_extensions specified will not be returned, even if they are specified in the DAL statement file. If set to `true`, the API will propagate relation_extensions associated with each statement's relation type, if specified in the DAL statement file.
         */
        returnRelationExtensions?: boolean;
        /**
         * The uppercase SHA-265 fingerprint of the certificate. From the PEM certificate, it can be acquired like this: $ keytool -printcert -file $CERTFILE | grep SHA256: SHA256: 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83: \ 42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 or like this: $ openssl x509 -in $CERTFILE -noout -fingerprint -sha256 SHA256 Fingerprint=14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64: \ 16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5 In this example, the contents of this field would be `14:6D:E9:83:C5:73: 06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF: 44:E5`. If these tools are not available to you, you can convert the PEM certificate into the DER format, compute the SHA-256 hash of that string and represent the result as a hexstring (that is, uppercase hexadecimal representations of each octet, separated by colons).
         */
        'source.androidApp.certificate.sha256Fingerprint'?: string;
        /**
         * Android App assets are naturally identified by their Java package name. For example, the Google Maps app uses the package name `com.google.android.apps.maps`. REQUIRED
         */
        'source.androidApp.packageName'?: string;
        /**
         * Web assets are identified by a URL that contains only the scheme, hostname and port parts. The format is http[s]://[:] Hostnames must be fully qualified: they must end in a single period ("`.`"). Only the schemes "http" and "https" are currently allowed. Port numbers are given as a decimal number, and they must be omitted if the standard port numbers are used: 80 for http and 443 for https. We call this limited URL the "site". All URLs that share the same scheme, hostname and port are considered to be a part of the site and thus belong to the web asset. Example: the asset with the site `https://www.google.com` contains all these URLs: * `https://www.google.com/` * `https://www.google.com:443/` * `https://www.google.com/foo` * `https://www.google.com/foo?bar` * `https://www.google.com/foo#bar` * `https://user@password:www.google.com/` But it does not contain these URLs: * `http://www.google.com/` (wrong scheme) * `https://google.com/` (hostname does not match) * `https://www.google.com:444/` (port does not match) REQUIRED
         */
        'source.web.site'?: string;
    }
    export {};
}
