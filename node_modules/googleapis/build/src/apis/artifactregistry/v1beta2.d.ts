import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace artifactregistry_v1beta2 {
    export interface Options extends GlobalOptions {
        version: 'v1beta2';
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
     * Artifact Registry API
     *
     * Store and manage build artifacts in a scalable and integrated service built on Google infrastructure.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const artifactregistry = google.artifactregistry('v1beta2');
     * ```
     */
    export class Artifactregistry {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A detailed representation of an Apt artifact. Information in the record is derived from the archive's control file. See https://www.debian.org/doc/debian-policy/ch-controlfields.html
     */
    export interface Schema$AptArtifact {
        /**
         * Output only. Operating system architecture of the artifact.
         */
        architecture?: string | null;
        /**
         * Output only. Repository component of the artifact.
         */
        component?: string | null;
        /**
         * Output only. Contents of the artifact's control metadata file.
         */
        controlFile?: string | null;
        /**
         * Output only. The Artifact Registry resource name of the artifact.
         */
        name?: string | null;
        /**
         * Output only. The Apt package name of the artifact.
         */
        packageName?: string | null;
        /**
         * Output only. An artifact is a binary or source package.
         */
        packageType?: string | null;
    }
    /**
     * Associates `members` with a `role`.
     */
    export interface Schema$Binding {
        /**
         * The condition that is associated with this binding. If the condition evaluates to `true`, then this binding applies to the current request. If the condition evaluates to `false`, then this binding does not apply to the current request. However, a different role binding might grant the same role to one or more of the members in this binding. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        condition?: Schema$Expr;
        /**
         * Specifies the identities requesting access for a Cloud Platform resource. `members` can have the following values: * `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account. * `allAuthenticatedUsers`: A special identifier that represents anyone who is authenticated with a Google account or a service account. * `user:{emailid\}`: An email address that represents a specific Google account. For example, `alice@example.com` . * `serviceAccount:{emailid\}`: An email address that represents a service account. For example, `my-other-app@appspot.gserviceaccount.com`. * `group:{emailid\}`: An email address that represents a Google group. For example, `admins@example.com`. * `deleted:user:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a user that has been recently deleted. For example, `alice@example.com?uid=123456789012345678901`. If the user is recovered, this value reverts to `user:{emailid\}` and the recovered user retains the role in the binding. * `deleted:serviceAccount:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a service account that has been recently deleted. For example, `my-other-app@appspot.gserviceaccount.com?uid=123456789012345678901`. If the service account is undeleted, this value reverts to `serviceAccount:{emailid\}` and the undeleted service account retains the role in the binding. * `deleted:group:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a Google group that has been recently deleted. For example, `admins@example.com?uid=123456789012345678901`. If the group is recovered, this value reverts to `group:{emailid\}` and the recovered group retains the role in the binding. * `domain:{domain\}`: The G Suite domain (primary) that represents all the users of that domain. For example, `google.com` or `example.com`.
         */
        members?: string[] | null;
        /**
         * Role that is assigned to `members`. For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
         */
        role?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \} The JSON representation for `Empty` is empty JSON object `{\}`.
     */
    export interface Schema$Empty {
    }
    /**
     * Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. Example (Comparison): title: "Summary size limit" description: "Determines if a summary is less than 100 chars" expression: "document.summary.size() < 100" Example (Equality): title: "Requestor is owner" description: "Determines if requestor is the document owner" expression: "document.owner == request.auth.claims.email" Example (Logic): title: "Public documents" description: "Determine whether the document should be publicly visible" expression: "document.type != 'private' && document.type != 'internal'" Example (Data Manipulation): title: "Notification string" description: "Create a notification string with a timestamp." expression: "'New message received at ' + string(document.create_time)" The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.
     */
    export interface Schema$Expr {
        /**
         * Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.
         */
        description?: string | null;
        /**
         * Textual representation of an expression in Common Expression Language syntax.
         */
        expression?: string | null;
        /**
         * Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file.
         */
        location?: string | null;
        /**
         * Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.
         */
        title?: string | null;
    }
    /**
     * Files store content that is potentially associated with Packages or Versions.
     */
    export interface Schema$File {
        /**
         * The time when the File was created.
         */
        createTime?: string | null;
        /**
         * The hashes of the file content.
         */
        hashes?: Schema$Hash[];
        /**
         * The name of the file, for example: "projects/p1/locations/us-central1/repositories/repo1/files/a%2Fb%2Fc.txt". If the file ID part contains slashes, they are escaped.
         */
        name?: string | null;
        /**
         * The name of the Package or Version that owns this file, if any.
         */
        owner?: string | null;
        /**
         * The size of the File in bytes.
         */
        sizeBytes?: string | null;
        /**
         * The time when the File was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A hash of file content.
     */
    export interface Schema$Hash {
        /**
         * The algorithm used to compute the hash value.
         */
        type?: string | null;
        /**
         * The hash value.
         */
        value?: string | null;
    }
    /**
     * Error information explaining why a package was not imported.
     */
    export interface Schema$ImportAptArtifactsErrorInfo {
        /**
         * The detailed error status.
         */
        error?: Schema$Status;
        /**
         * Google Cloud Storage location requested.
         */
        gcsSource?: Schema$ImportAptArtifactsGcsSource;
    }
    /**
     * Google Cloud Storage location where the artifacts currently reside.
     */
    export interface Schema$ImportAptArtifactsGcsSource {
        /**
         * Cloud Storage paths URI (e.g., gs://my_bucket//my_object).
         */
        uris?: string[] | null;
        /**
         * Supports URI wildcards for matching multiple objects from a single URI.
         */
        useWildcards?: boolean | null;
    }
    /**
     * The request to import new apt artifacts.
     */
    export interface Schema$ImportAptArtifactsRequest {
        /**
         * Google Cloud Storage location where input content is located.
         */
        gcsSource?: Schema$ImportAptArtifactsGcsSource;
    }
    /**
     * The response message from importing artifacts.
     */
    export interface Schema$ImportAptArtifactsResponse {
        /**
         * The Apt artifacts updated.
         */
        aptArtifacts?: Schema$AptArtifact[];
        /**
         * Detailed error info for packages that were not imported.
         */
        errors?: Schema$ImportAptArtifactsErrorInfo[];
    }
    /**
     * Error information explaining why a package was not imported.
     */
    export interface Schema$ImportYumArtifactsErrorInfo {
        /**
         * The detailed error status.
         */
        error?: Schema$Status;
        /**
         * Google Cloud Storage location requested.
         */
        gcsSource?: Schema$ImportYumArtifactsGcsSource;
    }
    /**
     * Google Cloud Storage location where the artifacts currently reside.
     */
    export interface Schema$ImportYumArtifactsGcsSource {
        /**
         * Cloud Storage paths URI (e.g., gs://my_bucket//my_object).
         */
        uris?: string[] | null;
        /**
         * Supports URI wildcards for matching multiple objects from a single URI.
         */
        useWildcards?: boolean | null;
    }
    /**
     * The request to import new yum artifacts.
     */
    export interface Schema$ImportYumArtifactsRequest {
        /**
         * Google Cloud Storage location where input content is located.
         */
        gcsSource?: Schema$ImportYumArtifactsGcsSource;
    }
    /**
     * The response message from importing artifacts.
     */
    export interface Schema$ImportYumArtifactsResponse {
        /**
         * Detailed error info for packages that were not imported.
         */
        errors?: Schema$ImportYumArtifactsErrorInfo[];
        /**
         * The yum artifacts updated.
         */
        yumArtifacts?: Schema$YumArtifact[];
    }
    /**
     * The response from listing files.
     */
    export interface Schema$ListFilesResponse {
        /**
         * The files returned.
         */
        files?: Schema$File[];
        /**
         * The token to retrieve the next page of files, or empty if there are no more files to return.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Locations.ListLocations.
     */
    export interface Schema$ListLocationsResponse {
        /**
         * A list of locations that matches the specified filter in the request.
         */
        locations?: Schema$Location[];
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Operations.ListOperations.
     */
    export interface Schema$ListOperationsResponse {
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
        /**
         * A list of operations that matches the specified filter in the request.
         */
        operations?: Schema$Operation[];
    }
    /**
     * The response from listing packages.
     */
    export interface Schema$ListPackagesResponse {
        /**
         * The token to retrieve the next page of packages, or empty if there are no more packages to return.
         */
        nextPageToken?: string | null;
        /**
         * The packages returned.
         */
        packages?: Schema$Package[];
    }
    /**
     * The response from listing repositories.
     */
    export interface Schema$ListRepositoriesResponse {
        /**
         * The token to retrieve the next page of repositories, or empty if there are no more repositories to return.
         */
        nextPageToken?: string | null;
        /**
         * The repositories returned.
         */
        repositories?: Schema$Repository[];
    }
    /**
     * The response from listing tags.
     */
    export interface Schema$ListTagsResponse {
        /**
         * The token to retrieve the next page of tags, or empty if there are no more tags to return.
         */
        nextPageToken?: string | null;
        /**
         * The tags returned.
         */
        tags?: Schema$Tag[];
    }
    /**
     * The response from listing versions.
     */
    export interface Schema$ListVersionsResponse {
        /**
         * The token to retrieve the next page of versions, or empty if there are no more versions to return.
         */
        nextPageToken?: string | null;
        /**
         * The versions returned.
         */
        versions?: Schema$Version[];
    }
    /**
     * A resource that represents Google Cloud Platform location.
     */
    export interface Schema$Location {
        /**
         * The friendly name for this location, typically a nearby city name. For example, "Tokyo".
         */
        displayName?: string | null;
        /**
         * Cross-service attributes for the location. For example {"cloud.googleapis.com/region": "us-east1"\}
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The canonical id for this location. For example: `"us-east1"`.
         */
        locationId?: string | null;
        /**
         * Service-specific metadata. For example the available capacity at the given location.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Resource name for the location, which may vary between implementations. For example: `"projects/example-project/locations/us-east1"`
         */
        name?: string | null;
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$Operation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
         */
        done?: boolean | null;
        /**
         * The error result of the operation in case of failure or cancellation.
         */
        error?: Schema$Status;
        /**
         * Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id\}`.
         */
        name?: string | null;
        /**
         * The normal response of the operation in case of success. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Packages are named collections of versions.
     */
    export interface Schema$Package {
        /**
         * The time when the package was created.
         */
        createTime?: string | null;
        /**
         * The display name of the package.
         */
        displayName?: string | null;
        /**
         * The name of the package, for example: "projects/p1/locations/us-central1/repositories/repo1/packages/pkg1". If the package ID part contains slashes, the slashes are escaped.
         */
        name?: string | null;
        /**
         * The time when the package was last updated. This includes publishing a new version of the package.
         */
        updateTime?: string | null;
    }
    /**
     * An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members` to a single `role`. Members can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role. For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). **JSON example:** { "bindings": [ { "role": "roles/resourcemanager.organizationAdmin", "members": [ "user:mike@example.com", "group:admins@example.com", "domain:google.com", "serviceAccount:my-project-id@appspot.gserviceaccount.com" ] \}, { "role": "roles/resourcemanager.organizationViewer", "members": [ "user:eve@example.com" ], "condition": { "title": "expirable access", "description": "Does not grant access after Sep 2020", "expression": "request.time < timestamp('2020-10-01T00:00:00.000Z')", \} \} ], "etag": "BwWWja0YfJA=", "version": 3 \} **YAML example:** bindings: - members: - user:mike@example.com - group:admins@example.com - domain:google.com - serviceAccount:my-project-id@appspot.gserviceaccount.com role: roles/resourcemanager.organizationAdmin - members: - user:eve@example.com role: roles/resourcemanager.organizationViewer condition: title: expirable access description: Does not grant access after Sep 2020 expression: request.time < timestamp('2020-10-01T00:00:00.000Z') - etag: BwWWja0YfJA= - version: 3 For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).
     */
    export interface Schema$Policy {
        /**
         * Associates a list of `members` to a `role`. Optionally, may specify a `condition` that determines how and when the `bindings` are applied. Each of the `bindings` must contain at least one member.
         */
        bindings?: Schema$Binding[];
        /**
         * `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. It is strongly suggested that systems make use of the `etag` in the read-modify-write cycle to perform policy updates in order to avoid race conditions: An `etag` is returned in the response to `getIamPolicy`, and systems are expected to put that etag in the request to `setIamPolicy` to ensure that their change will be applied to the same version of the policy. **Important:** If you use IAM Conditions, you must include the `etag` field whenever you call `setIamPolicy`. If you omit this field, then IAM allows you to overwrite a version `3` policy with a version `1` policy, and all of the conditions in the version `3` policy are lost.
         */
        etag?: string | null;
        /**
         * Specifies the format of the policy. Valid values are `0`, `1`, and `3`. Requests that specify an invalid value are rejected. Any operation that affects conditional role bindings must specify version `3`. This requirement applies to the following operations: * Getting a policy that includes a conditional role binding * Adding a conditional role binding to a policy * Changing a conditional role binding in a policy * Removing any role binding, with or without a condition, from a policy that includes conditions **Important:** If you use IAM Conditions, you must include the `etag` field whenever you call `setIamPolicy`. If you omit this field, then IAM allows you to overwrite a version `3` policy with a version `1` policy, and all of the conditions in the version `3` policy are lost. If a policy does not include any conditions, operations on that policy may specify any valid version or leave the field unset. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        version?: number | null;
    }
    /**
     * A Repository for storing artifacts with a specific format.
     */
    export interface Schema$Repository {
        /**
         * The time when the repository was created.
         */
        createTime?: string | null;
        /**
         * The user-provided description of the repository.
         */
        description?: string | null;
        /**
         * The format of packages that are stored in the repository.
         */
        format?: string | null;
        /**
         * The Cloud KMS resource name of the customer managed encryption key that’s used to encrypt the contents of the Repository. Has the form: `projects/my-project/locations/my-region/keyRings/my-kr/cryptoKeys/my-key`. This value may not be changed after the Repository has been created.
         */
        kmsKeyName?: string | null;
        /**
         * Labels with user-defined metadata. This field may contain up to 64 entries. Label keys and values may be no longer than 63 characters. Label keys must begin with a lowercase letter and may only contain lowercase letters, numeric characters, underscores, and dashes.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The name of the repository, for example: "projects/p1/locations/us-central1/repositories/repo1".
         */
        name?: string | null;
        /**
         * The time when the repository was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Request message for `SetIamPolicy` method.
     */
    export interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the `resource`. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Cloud Platform services (such as Projects) might reject them.
         */
        policy?: Schema$Policy;
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
     */
    export interface Schema$Status {
        /**
         * The status code, which should be an enum value of google.rpc.Code.
         */
        code?: number | null;
        /**
         * A list of messages that carry the error details. There is a common set of message types for APIs to use.
         */
        details?: Array<{
            [key: string]: any;
        }> | null;
        /**
         * A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
         */
        message?: string | null;
    }
    /**
     * Tags point to a version and represent an alternative name that can be used to access the version.
     */
    export interface Schema$Tag {
        /**
         * The name of the tag, for example: "projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/tags/tag1". If the package or tag ID parts contain slashes, the slashes are escaped.
         */
        name?: string | null;
        /**
         * The name of the version the tag refers to, for example: "projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/versions/sha256:5243811" If the package or version ID parts contain slashes, the slashes are escaped.
         */
        version?: string | null;
    }
    /**
     * Request message for `TestIamPermissions` method.
     */
    export interface Schema$TestIamPermissionsRequest {
        /**
         * The set of permissions to check for the `resource`. Permissions with wildcards (such as '*' or 'storage.*') are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
         */
        permissions?: string[] | null;
    }
    /**
     * Response message for `TestIamPermissions` method.
     */
    export interface Schema$TestIamPermissionsResponse {
        /**
         * A subset of `TestPermissionsRequest.permissions` that the caller is allowed.
         */
        permissions?: string[] | null;
    }
    /**
     * The response to upload an artifact.
     */
    export interface Schema$UploadAptArtifactMediaResponse {
        /**
         * Operation to be returned to the user.
         */
        operation?: Schema$Operation;
    }
    /**
     * The response of the completed artifact upload operation. This response is contained in the Operation and available to users.
     */
    export interface Schema$UploadAptArtifactResponse {
        /**
         * The Apt artifacts updated.
         */
        aptArtifacts?: Schema$AptArtifact[];
    }
    /**
     * The response to upload an artifact.
     */
    export interface Schema$UploadYumArtifactMediaResponse {
        /**
         * Operation to be returned to the user.
         */
        operation?: Schema$Operation;
    }
    /**
     * The response of the completed artifact upload operation. This response is contained in the Operation and available to users.
     */
    export interface Schema$UploadYumArtifactResponse {
        /**
         * The Apt artifacts updated.
         */
        yumArtifacts?: Schema$YumArtifact[];
    }
    /**
     * The body of a version resource. A version resource represents a collection of components, such as files and other data. This may correspond to a version in many package management schemes.
     */
    export interface Schema$Version {
        /**
         * The time when the version was created.
         */
        createTime?: string | null;
        /**
         * Optional. Description of the version, as specified in its metadata.
         */
        description?: string | null;
        /**
         * Output only. Repository-specific Metadata stored against this version. The fields returned are defined by the underlying repository-specific resource. Currently, the only resource in use is DockerImage
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * The name of the version, for example: "projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/versions/art1". If the package or version ID parts contain slashes, the slashes are escaped.
         */
        name?: string | null;
        /**
         * Output only. A list of related tags. Will contain up to 100 tags that reference this version.
         */
        relatedTags?: Schema$Tag[];
        /**
         * The time when the version was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A detailed representation of a Yum artifact.
     */
    export interface Schema$YumArtifact {
        /**
         * Output only. Operating system architecture of the artifact.
         */
        architecture?: string | null;
        /**
         * Output only. The Artifact Registry resource name of the artifact.
         */
        name?: string | null;
        /**
         * Output only. The yum package name of the artifact.
         */
        packageName?: string | null;
        /**
         * Output only. An artifact is a binary or source package.
         */
        packageType?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        operations: Resource$Projects$Locations$Operations;
        repositories: Resource$Projects$Locations$Repositories;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a location.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.get({
         *     // Resource name for the location.
         *     name: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "displayName": "my_displayName",
         *   //   "labels": {},
         *   //   "locationId": "my_locationId",
         *   //   "metadata": {},
         *   //   "name": "my_name"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Location>>;
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$Location>, callback: BodyResponseCallback<Schema$Location>): void;
        get(params: Params$Resource$Projects$Locations$Get, callback: BodyResponseCallback<Schema$Location>): void;
        get(callback: BodyResponseCallback<Schema$Location>): void;
        /**
         * Lists information about the supported locations for this service.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.list({
         *     // A filter to narrow down results to a preferred subset. The filtering language accepts strings like "displayName=tokyo", and is documented in more detail in [AIP-160](https://google.aip.dev/160).
         *     filter: 'placeholder-value',
         *     // The resource that owns the locations collection, if applicable.
         *     name: 'projects/my-project',
         *     // The maximum number of results to return. If not set, the service selects a default.
         *     pageSize: 'placeholder-value',
         *     // A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "locations": [],
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationsResponse>>;
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationsResponse>, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$List, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$List extends StandardParameters {
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like "displayName=tokyo", and is documented in more detail in [AIP-160](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * The resource that owns the locations collection, if applicable.
         */
        name?: string;
        /**
         * The maximum number of results to return. If not set, the service selects a default.
         */
        pageSize?: number;
        /**
         * A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.operations.get({
         *     // The name of the operation resource.
         *     name: 'projects/my-project/locations/my-location/operations/my-operation',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`. NOTE: the `name` binding allows API services to override the binding to use different resource name schemes, such as `users/x/operations`. To override the binding, API services can add a binding such as `"/v1/{name=users/x\}/operations"` to their service configuration. For backwards compatibility, the default name includes the operations collection id, however overriding users must ensure the name binding is the parent resource, without the operations collection id.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.operations.list({
         *     // The standard list filter.
         *     filter: 'placeholder-value',
         *     // The name of the operation's parent resource.
         *     name: 'projects/my-project/locations/my-location',
         *     // The standard list page size.
         *     pageSize: 'placeholder-value',
         *     // The standard list page token.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "operations": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Operations$List extends StandardParameters {
        /**
         * The standard list filter.
         */
        filter?: string;
        /**
         * The name of the operation's parent resource.
         */
        name?: string;
        /**
         * The standard list page size.
         */
        pageSize?: number;
        /**
         * The standard list page token.
         */
        pageToken?: string;
    }
    export class Resource$Projects$Locations$Repositories {
        context: APIRequestContext;
        aptArtifacts: Resource$Projects$Locations$Repositories$Aptartifacts;
        files: Resource$Projects$Locations$Repositories$Files;
        packages: Resource$Projects$Locations$Repositories$Packages;
        yumArtifacts: Resource$Projects$Locations$Repositories$Yumartifacts;
        constructor(context: APIRequestContext);
        /**
         * Creates a repository. The returned Operation will finish once the repository has been created. Its response will be the created Repository.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.repositories.create({
         *     // The name of the parent resource where the repository will be created.
         *     parent: 'projects/my-project/locations/my-location',
         *     // The repository id to use for this repository.
         *     repositoryId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "createTime": "my_createTime",
         *       //   "description": "my_description",
         *       //   "format": "my_format",
         *       //   "kmsKeyName": "my_kmsKeyName",
         *       //   "labels": {},
         *       //   "name": "my_name",
         *       //   "updateTime": "my_updateTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Repositories$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Repositories$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Repositories$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Repositories$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Repositories$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a repository and all of its contents. The returned Operation will finish once the repository has been deleted. It will not have any Operation metadata and will return a google.protobuf.Empty response.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.repositories.delete({
         *     // The name of the repository to delete.
         *     name: 'projects/my-project/locations/my-location/repositories/my-repositorie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Repositories$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Repositories$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Repositories$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a repository.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.repositories.get({
         *     // The name of the repository to retrieve.
         *     name: 'projects/my-project/locations/my-location/repositories/my-repositorie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "description": "my_description",
         *   //   "format": "my_format",
         *   //   "kmsKeyName": "my_kmsKeyName",
         *   //   "labels": {},
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Repositories$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Repositories$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Repository>>;
        get(params: Params$Resource$Projects$Locations$Repositories$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Get, options: MethodOptions | BodyResponseCallback<Schema$Repository>, callback: BodyResponseCallback<Schema$Repository>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Get, callback: BodyResponseCallback<Schema$Repository>): void;
        get(callback: BodyResponseCallback<Schema$Repository>): void;
        /**
         * Gets the IAM policy for a given resource.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.getIamPolicy({
         *       // Optional. The policy format version to be returned. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional bindings must specify version 3. Policies without any conditional bindings may specify any valid value or leave the field unset. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         *       'options.requestedPolicyVersion': 'placeholder-value',
         *       // REQUIRED: The resource for which the policy is being requested. See the operation documentation for the appropriate value for this field.
         *       resource:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Repositories$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists repositories.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.repositories.list({
         *     // The maximum number of repositories to return. Maximum page size is 10,000.
         *     pageSize: 'placeholder-value',
         *     // The next_page_token value returned from a previous list request, if any.
         *     pageToken: 'placeholder-value',
         *     // The name of the parent resource whose repositories will be listed.
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "repositories": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Repositories$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Repositories$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRepositoriesResponse>>;
        list(params: Params$Resource$Projects$Locations$Repositories$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$List, options: MethodOptions | BodyResponseCallback<Schema$ListRepositoriesResponse>, callback: BodyResponseCallback<Schema$ListRepositoriesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$List, callback: BodyResponseCallback<Schema$ListRepositoriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRepositoriesResponse>): void;
        /**
         * Updates a repository.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.repositories.patch({
         *     // The name of the repository, for example: "projects/p1/locations/us-central1/repositories/repo1".
         *     name: 'projects/my-project/locations/my-location/repositories/my-repositorie',
         *     // The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "createTime": "my_createTime",
         *       //   "description": "my_description",
         *       //   "format": "my_format",
         *       //   "kmsKeyName": "my_kmsKeyName",
         *       //   "labels": {},
         *       //   "name": "my_name",
         *       //   "updateTime": "my_updateTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "description": "my_description",
         *   //   "format": "my_format",
         *   //   "kmsKeyName": "my_kmsKeyName",
         *   //   "labels": {},
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Repositories$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Repositories$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Repository>>;
        patch(params: Params$Resource$Projects$Locations$Repositories$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Repositories$Patch, options: MethodOptions | BodyResponseCallback<Schema$Repository>, callback: BodyResponseCallback<Schema$Repository>): void;
        patch(params: Params$Resource$Projects$Locations$Repositories$Patch, callback: BodyResponseCallback<Schema$Repository>): void;
        patch(callback: BodyResponseCallback<Schema$Repository>): void;
        /**
         * Updates the IAM policy for a given resource.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.setIamPolicy({
         *       // REQUIRED: The resource for which the policy is being specified. See the operation documentation for the appropriate value for this field.
         *       resource:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "policy": {}
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Repositories$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Repositories$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Tests if the caller has a list of permissions on a resource.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.testIamPermissions({
         *       // REQUIRED: The resource for which the policy detail is being requested. See the operation documentation for the appropriate value for this field.
         *       resource:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "permissions": []
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "permissions": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        testIamPermissions(params: Params$Resource$Projects$Locations$Repositories$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Repositories$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Repositories$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Repositories$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Repositories$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Create extends StandardParameters {
        /**
         * The name of the parent resource where the repository will be created.
         */
        parent?: string;
        /**
         * The repository id to use for this repository.
         */
        repositoryId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Repository;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Delete extends StandardParameters {
        /**
         * The name of the repository to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Get extends StandardParameters {
        /**
         * The name of the repository to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Getiampolicy extends StandardParameters {
        /**
         * Optional. The policy format version to be returned. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional bindings must specify version 3. Policies without any conditional bindings may specify any valid value or leave the field unset. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        'options.requestedPolicyVersion'?: number;
        /**
         * REQUIRED: The resource for which the policy is being requested. See the operation documentation for the appropriate value for this field.
         */
        resource?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$List extends StandardParameters {
        /**
         * The maximum number of repositories to return. Maximum page size is 10,000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * The name of the parent resource whose repositories will be listed.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Patch extends StandardParameters {
        /**
         * The name of the repository, for example: "projects/p1/locations/us-central1/repositories/repo1".
         */
        name?: string;
        /**
         * The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Repository;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See the operation documentation for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See the operation documentation for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Repositories$Aptartifacts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Imports Apt artifacts. The returned Operation will complete once the resources are imported. Package, Version, and File resources are created based on the imported artifacts. Imported artifacts that conflict with existing resources are ignored.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.aptArtifacts.import({
         *       // The name of the parent resource where the artifacts will be imported.
         *       parent:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "gcsSource": {}
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Repositories$Aptartifacts$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Repositories$Aptartifacts$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Projects$Locations$Repositories$Aptartifacts$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Repositories$Aptartifacts$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Projects$Locations$Repositories$Aptartifacts$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Aptartifacts$Import extends StandardParameters {
        /**
         * The name of the parent resource where the artifacts will be imported.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ImportAptArtifactsRequest;
    }
    export class Resource$Projects$Locations$Repositories$Files {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a file.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.repositories.files.get({
         *     // The name of the file to retrieve.
         *     name: 'projects/my-project/locations/my-location/repositories/my-repositorie/files/.*',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "hashes": [],
         *   //   "name": "my_name",
         *   //   "owner": "my_owner",
         *   //   "sizeBytes": "my_sizeBytes",
         *   //   "updateTime": "my_updateTime"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Repositories$Files$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Repositories$Files$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$File>>;
        get(params: Params$Resource$Projects$Locations$Repositories$Files$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Files$Get, options: MethodOptions | BodyResponseCallback<Schema$File>, callback: BodyResponseCallback<Schema$File>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Files$Get, callback: BodyResponseCallback<Schema$File>): void;
        get(callback: BodyResponseCallback<Schema$File>): void;
        /**
         * Lists files.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await artifactregistry.projects.locations.repositories.files.list(
         *     {
         *       // An expression for filtering the results of the request. Filter rules are case insensitive. The fields eligible for filtering are: * `name` * `owner` An example of using a filter: * `name="projects/p1/locations/us-central1/repositories/repo1/files/a/b/x"` --\> Files with an ID starting with "a/b/". * `owner="projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/versions/1.0"` --\> Files owned by the version `1.0` in package `pkg1`.
         *       filter: 'placeholder-value',
         *       // The maximum number of files to return.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous list request, if any.
         *       pageToken: 'placeholder-value',
         *       // The name of the parent resource whose files will be listed.
         *       parent:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "files": [],
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Repositories$Files$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Repositories$Files$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilesResponse>>;
        list(params: Params$Resource$Projects$Locations$Repositories$Files$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Files$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilesResponse>, callback: BodyResponseCallback<Schema$ListFilesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Files$List, callback: BodyResponseCallback<Schema$ListFilesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Files$Get extends StandardParameters {
        /**
         * The name of the file to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Files$List extends StandardParameters {
        /**
         * An expression for filtering the results of the request. Filter rules are case insensitive. The fields eligible for filtering are: * `name` * `owner` An example of using a filter: * `name="projects/p1/locations/us-central1/repositories/repo1/files/a/b/x"` --\> Files with an ID starting with "a/b/". * `owner="projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/versions/1.0"` --\> Files owned by the version `1.0` in package `pkg1`.
         */
        filter?: string;
        /**
         * The maximum number of files to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * The name of the parent resource whose files will be listed.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Repositories$Packages {
        context: APIRequestContext;
        tags: Resource$Projects$Locations$Repositories$Packages$Tags;
        versions: Resource$Projects$Locations$Repositories$Packages$Versions;
        constructor(context: APIRequestContext);
        /**
         * Deletes a package and all of its versions and tags. The returned operation will complete once the package has been deleted.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.delete({
         *       // The name of the package to delete.
         *       name: 'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Repositories$Packages$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a package.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.get({
         *       // The name of the package to retrieve.
         *       name: 'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Repositories$Packages$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Package>>;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Get, options: MethodOptions | BodyResponseCallback<Schema$Package>, callback: BodyResponseCallback<Schema$Package>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Get, callback: BodyResponseCallback<Schema$Package>): void;
        get(callback: BodyResponseCallback<Schema$Package>): void;
        /**
         * Lists packages.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.list({
         *       // The maximum number of packages to return. Maximum page size is 10,000.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous list request, if any.
         *       pageToken: 'placeholder-value',
         *       // The name of the parent resource whose packages will be listed.
         *       parent:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "packages": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Repositories$Packages$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPackagesResponse>>;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$List, options: MethodOptions | BodyResponseCallback<Schema$ListPackagesResponse>, callback: BodyResponseCallback<Schema$ListPackagesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$List, callback: BodyResponseCallback<Schema$ListPackagesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPackagesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Delete extends StandardParameters {
        /**
         * The name of the package to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Get extends StandardParameters {
        /**
         * The name of the package to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$List extends StandardParameters {
        /**
         * The maximum number of packages to return. Maximum page size is 10,000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * The name of the parent resource whose packages will be listed.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Repositories$Packages$Tags {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a tag.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.tags.create(
         *       {
         *         // The name of the parent resource where the tag will be created.
         *         parent:
         *           'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package',
         *         // The tag id to use for this repository.
         *         tagId: 'placeholder-value',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "name": "my_name",
         *           //   "version": "my_version"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "version": "my_version"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Tag>>;
        create(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Create, options: MethodOptions | BodyResponseCallback<Schema$Tag>, callback: BodyResponseCallback<Schema$Tag>): void;
        create(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Create, callback: BodyResponseCallback<Schema$Tag>): void;
        create(callback: BodyResponseCallback<Schema$Tag>): void;
        /**
         * Deletes a tag.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.tags.delete(
         *       {
         *         // The name of the tag to delete.
         *         name: 'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package/tags/my-tag',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {}
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a tag.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.tags.get({
         *       // The name of the tag to retrieve.
         *       name: 'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package/tags/my-tag',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "version": "my_version"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Tag>>;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Get, options: MethodOptions | BodyResponseCallback<Schema$Tag>, callback: BodyResponseCallback<Schema$Tag>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Get, callback: BodyResponseCallback<Schema$Tag>): void;
        get(callback: BodyResponseCallback<Schema$Tag>): void;
        /**
         * Lists tags.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.tags.list({
         *       // An expression for filtering the results of the request. Filter rules are case insensitive. The fields eligible for filtering are: * `version` An example of using a filter: * `version="projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/versions/1.0"` --\> Tags that are applied to the version `1.0` in package `pkg1`.
         *       filter: 'placeholder-value',
         *       // The maximum number of tags to return. Maximum page size is 10,000.
         *       pageSize: 'placeholder-value',
         *       // The next_page_token value returned from a previous list request, if any.
         *       pageToken: 'placeholder-value',
         *       // The name of the parent resource whose tags will be listed.
         *       parent:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "tags": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Repositories$Packages$Tags$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTagsResponse>>;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$List, options: MethodOptions | BodyResponseCallback<Schema$ListTagsResponse>, callback: BodyResponseCallback<Schema$ListTagsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$List, callback: BodyResponseCallback<Schema$ListTagsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTagsResponse>): void;
        /**
         * Updates a tag.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.tags.patch({
         *       // The name of the tag, for example: "projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/tags/tag1". If the package or tag ID parts contain slashes, the slashes are escaped.
         *       name: 'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package/tags/my-tag',
         *       // The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "name": "my_name",
         *         //   "version": "my_version"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "version": "my_version"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Tag>>;
        patch(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Patch, options: MethodOptions | BodyResponseCallback<Schema$Tag>, callback: BodyResponseCallback<Schema$Tag>): void;
        patch(params: Params$Resource$Projects$Locations$Repositories$Packages$Tags$Patch, callback: BodyResponseCallback<Schema$Tag>): void;
        patch(callback: BodyResponseCallback<Schema$Tag>): void;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Tags$Create extends StandardParameters {
        /**
         * The name of the parent resource where the tag will be created.
         */
        parent?: string;
        /**
         * The tag id to use for this repository.
         */
        tagId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Tag;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Tags$Delete extends StandardParameters {
        /**
         * The name of the tag to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Tags$Get extends StandardParameters {
        /**
         * The name of the tag to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Tags$List extends StandardParameters {
        /**
         * An expression for filtering the results of the request. Filter rules are case insensitive. The fields eligible for filtering are: * `version` An example of using a filter: * `version="projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/versions/1.0"` --\> Tags that are applied to the version `1.0` in package `pkg1`.
         */
        filter?: string;
        /**
         * The maximum number of tags to return. Maximum page size is 10,000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * The name of the parent resource whose tags will be listed.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Tags$Patch extends StandardParameters {
        /**
         * The name of the tag, for example: "projects/p1/locations/us-central1/repositories/repo1/packages/pkg1/tags/tag1". If the package or tag ID parts contain slashes, the slashes are escaped.
         */
        name?: string;
        /**
         * The update mask applies to the resource. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Tag;
    }
    export class Resource$Projects$Locations$Repositories$Packages$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a version and all of its content. The returned operation will complete once the version has been deleted.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.versions.delete(
         *       {
         *         // By default, a version that is tagged may not be deleted. If force=true, the version and any tags pointing to the version are deleted.
         *         force: 'placeholder-value',
         *         // The name of the version to delete.
         *         name: 'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package/versions/my-version',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a version
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.versions.get(
         *       {
         *         // The name of the version to retrieve.
         *         name: 'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package/versions/my-version',
         *         // The view that should be returned in the response.
         *         view: 'placeholder-value',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "description": "my_description",
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "relatedTags": [],
         *   //   "updateTime": "my_updateTime"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Version>>;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$Version>, callback: BodyResponseCallback<Schema$Version>): void;
        get(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$Get, callback: BodyResponseCallback<Schema$Version>): void;
        get(callback: BodyResponseCallback<Schema$Version>): void;
        /**
         * Lists versions.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.packages.versions.list(
         *       {
         *         // Optional. Sorting field and order
         *         orderBy: 'placeholder-value',
         *         // The maximum number of versions to return. Maximum page size is 10,000.
         *         pageSize: 'placeholder-value',
         *         // The next_page_token value returned from a previous list request, if any.
         *         pageToken: 'placeholder-value',
         *         // The name of the parent resource whose versions will be listed.
         *         parent:
         *           'projects/my-project/locations/my-location/repositories/my-repositorie/packages/my-package',
         *         // The view that should be returned in the response.
         *         view: 'placeholder-value',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "versions": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Repositories$Packages$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$ListVersionsResponse>, callback: BodyResponseCallback<Schema$ListVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Repositories$Packages$Versions$List, callback: BodyResponseCallback<Schema$ListVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListVersionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Versions$Delete extends StandardParameters {
        /**
         * By default, a version that is tagged may not be deleted. If force=true, the version and any tags pointing to the version are deleted.
         */
        force?: boolean;
        /**
         * The name of the version to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Versions$Get extends StandardParameters {
        /**
         * The name of the version to retrieve.
         */
        name?: string;
        /**
         * The view that should be returned in the response.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Packages$Versions$List extends StandardParameters {
        /**
         * Optional. Sorting field and order
         */
        orderBy?: string;
        /**
         * The maximum number of versions to return. Maximum page size is 10,000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * The name of the parent resource whose versions will be listed.
         */
        parent?: string;
        /**
         * The view that should be returned in the response.
         */
        view?: string;
    }
    export class Resource$Projects$Locations$Repositories$Yumartifacts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Imports Yum (RPM) artifacts. The returned Operation will complete once the resources are imported. Package, Version, and File resources are created based on the imported artifacts. Imported artifacts that conflict with existing resources are ignored.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/artifactregistry.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const artifactregistry = google.artifactregistry('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await artifactregistry.projects.locations.repositories.yumArtifacts.import({
         *       // The name of the parent resource where the artifacts will be imported.
         *       parent:
         *         'projects/my-project/locations/my-location/repositories/my-repositorie',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "gcsSource": {}
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Repositories$Yumartifacts$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Repositories$Yumartifacts$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        import(params: Params$Resource$Projects$Locations$Repositories$Yumartifacts$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Repositories$Yumartifacts$Import, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        import(params: Params$Resource$Projects$Locations$Repositories$Yumartifacts$Import, callback: BodyResponseCallback<Schema$Operation>): void;
        import(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Repositories$Yumartifacts$Import extends StandardParameters {
        /**
         * The name of the parent resource where the artifacts will be imported.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ImportYumArtifactsRequest;
    }
    export {};
}
