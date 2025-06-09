import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace storage_v1beta2 {
    export interface Options extends GlobalOptions {
        version: 'v1beta2';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | GoogleAuth;
        /**
         * Data format for the response.
         */
        alt?: string;
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
         * An opaque string that represents a user for quota purposes. Must not exceed 40 characters.
         */
        quotaUser?: string;
        /**
         * Deprecated. Please use quotaUser instead.
         */
        userIp?: string;
    }
    /**
     * Cloud Storage JSON API
     *
     * Lets you store and retrieve potentially-large, immutable data objects.
     *
     * @example
     * const {google} = require('googleapis');
     * const storage = google.storage('v1beta2');
     *
     * @namespace storage
     * @type {Function}
     * @version v1beta2
     * @variation v1beta2
     * @param {object=} options Options for Storage
     */
    export class Storage {
        context: APIRequestContext;
        bucketAccessControls: Resource$Bucketaccesscontrols;
        buckets: Resource$Buckets;
        channels: Resource$Channels;
        defaultObjectAccessControls: Resource$Defaultobjectaccesscontrols;
        objectAccessControls: Resource$Objectaccesscontrols;
        objects: Resource$Objects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A bucket.
     */
    export interface Schema$Bucket {
        /**
         * Access controls on the bucket.
         */
        acl?: Schema$BucketAccessControl[];
        /**
         * The bucket&#39;s Cross-Origin Resource Sharing (CORS) configuration.
         */
        cors?: Array<{
            maxAgeSeconds?: number;
            method?: string[];
            origin?: string[];
            responseHeader?: string[];
        }> | null;
        /**
         * Default access controls to apply to new objects when no ACL is provided.
         */
        defaultObjectAcl?: Schema$ObjectAccessControl[];
        /**
         * HTTP 1.1 Entity tag for the bucket.
         */
        etag?: string | null;
        /**
         * The ID of the bucket.
         */
        id?: string | null;
        /**
         * The kind of item this is. For buckets, this is always storage#bucket.
         */
        kind?: string | null;
        /**
         * The bucket&#39;s lifecycle configuration. See object lifecycle management for more information.
         */
        lifecycle?: {
            rule?: Array<{
                action?: {
                    type?: string;
                };
                condition?: {
                    age?: number;
                    createdBefore?: string;
                    isLive?: boolean;
                    numNewerVersions?: number;
                };
            }>;
        } | null;
        /**
         * The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Typical values are US and EU. Defaults to US. See the developer&#39;s guide for the authoritative list.
         */
        location?: string | null;
        /**
         * The bucket&#39;s logging configuration, which defines the destination bucket and optional name prefix for the current bucket&#39;s logs.
         */
        logging?: {
            logBucket?: string;
            logObjectPrefix?: string;
        } | null;
        /**
         * The metadata generation of this bucket.
         */
        metageneration?: string | null;
        /**
         * The name of the bucket.
         */
        name?: string | null;
        /**
         * The owner of the bucket. This is always the project team&#39;s owner group.
         */
        owner?: {
            entity?: string;
            entityId?: string;
        } | null;
        /**
         * The URI of this bucket.
         */
        selfLink?: string | null;
        /**
         * The bucket&#39;s storage class. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. Typical values are STANDARD and DURABLE_REDUCED_AVAILABILITY. Defaults to STANDARD. See the developer&#39;s guide for the authoritative list.
         */
        storageClass?: string | null;
        /**
         * Creation time of the bucket in RFC 3339 format.
         */
        timeCreated?: string | null;
        /**
         * The bucket&#39;s versioning configuration.
         */
        versioning?: {
            enabled?: boolean;
        } | null;
        /**
         * The bucket&#39;s website configuration.
         */
        website?: {
            mainPageSuffix?: string;
            notFoundPage?: string;
        } | null;
    }
    /**
     * An access-control entry.
     */
    export interface Schema$BucketAccessControl {
        /**
         * The name of the bucket.
         */
        bucket?: string | null;
        /**
         * The domain associated with the entity, if any.
         */
        domain?: string | null;
        /**
         * The email address associated with the entity, if any.
         */
        email?: string | null;
        /**
         * The entity holding the permission, in one of the following forms:  - user-userId  - user-email  - group-groupId  - group-email  - domain-domain  - allUsers  - allAuthenticatedUsers Examples:  - The user liz@example.com would be user-liz@example.com.  - The group example@googlegroups.com would be group-example@googlegroups.com.  - To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.
         */
        entity?: string | null;
        /**
         * The ID for the entity, if any.
         */
        entityId?: string | null;
        /**
         * HTTP 1.1 Entity tag for the access-control entry.
         */
        etag?: string | null;
        /**
         * The ID of the access-control entry.
         */
        id?: string | null;
        /**
         * The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl.
         */
        kind?: string | null;
        /**
         * The access permission for the entity. Can be READER, WRITER, or OWNER.
         */
        role?: string | null;
        /**
         * The link to this access-control entry.
         */
        selfLink?: string | null;
    }
    /**
     * An access-control list.
     */
    export interface Schema$BucketAccessControls {
        /**
         * The list of items.
         */
        items?: Schema$BucketAccessControl[];
        /**
         * The kind of item this is. For lists of bucket access control entries, this is always storage#bucketAccessControls.
         */
        kind?: string | null;
    }
    /**
     * A list of buckets.
     */
    export interface Schema$Buckets {
        /**
         * The list of items.
         */
        items?: Schema$Bucket[];
        /**
         * The kind of item this is. For lists of buckets, this is always storage#buckets.
         */
        kind?: string | null;
        /**
         * The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * An notification channel used to watch for resource changes.
     */
    export interface Schema$Channel {
        /**
         * The address where notifications are delivered for this channel.
         */
        address?: string | null;
        /**
         * Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional.
         */
        expiration?: string | null;
        /**
         * A UUID or similar unique string that identifies this channel.
         */
        id?: string | null;
        /**
         * Identifies this as a notification channel used to watch for changes to a resource, which is &quot;api#channel&quot;.
         */
        kind?: string | null;
        /**
         * Additional parameters controlling delivery channel behavior. Optional.
         */
        params?: {
            [key: string]: string;
        } | null;
        /**
         * A Boolean value to indicate whether payload is wanted. Optional.
         */
        payload?: boolean | null;
        /**
         * An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.
         */
        resourceId?: string | null;
        /**
         * A version-specific identifier for the watched resource.
         */
        resourceUri?: string | null;
        /**
         * An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.
         */
        token?: string | null;
        /**
         * The type of delivery mechanism used for this channel.
         */
        type?: string | null;
    }
    /**
     * A Compose request.
     */
    export interface Schema$ComposeRequest {
        /**
         * Properties of the resulting object
         */
        destination?: Schema$Object;
        /**
         * The kind of item this is.
         */
        kind?: string | null;
        /**
         * The list of source objects that will be concatenated into a single object.
         */
        sourceObjects?: Array<{
            generation?: string;
            name?: string;
            objectPreconditions?: {
                ifGenerationMatch?: string;
            };
        }> | null;
    }
    /**
     * An object.
     */
    export interface Schema$Object {
        /**
         * Access controls on the object.
         */
        acl?: Schema$ObjectAccessControl[];
        /**
         * The bucket containing this object.
         */
        bucket?: string | null;
        /**
         * Cache-Control directive for the object data.
         */
        cacheControl?: string | null;
        /**
         * Number of underlying components that make up this object. Components are accumulated by compose operations and are limited to a count of 32.
         */
        componentCount?: number | null;
        /**
         * Content-Disposition of the object data.
         */
        contentDisposition?: string | null;
        /**
         * Content-Encoding of the object data.
         */
        contentEncoding?: string | null;
        /**
         * Content-Language of the object data.
         */
        contentLanguage?: string | null;
        /**
         * Content-Type of the object data.
         */
        contentType?: string | null;
        /**
         * CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64.
         */
        crc32c?: string | null;
        /**
         * HTTP 1.1 Entity tag for the object.
         */
        etag?: string | null;
        /**
         * The content generation of this object. Used for object versioning.
         */
        generation?: string | null;
        /**
         * The ID of the object.
         */
        id?: string | null;
        /**
         * The kind of item this is. For objects, this is always storage#object.
         */
        kind?: string | null;
        /**
         * MD5 hash of the data; encoded using base64.
         */
        md5Hash?: string | null;
        /**
         * Media download link.
         */
        mediaLink?: string | null;
        /**
         * User-provided metadata, in key/value pairs.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * The generation of the metadata for this object at this generation. Used for metadata versioning. Has no meaning outside of the context of this generation.
         */
        metageneration?: string | null;
        /**
         * The name of this object. Required if not specified by URL parameter.
         */
        name?: string | null;
        /**
         * The owner of the object. This will always be the uploader of the object.
         */
        owner?: {
            entity?: string;
            entityId?: string;
        } | null;
        /**
         * The link to this object.
         */
        selfLink?: string | null;
        /**
         * Content-Length of the data in bytes.
         */
        size?: string | null;
        /**
         * Storage class of the object.
         */
        storageClass?: string | null;
        /**
         * Deletion time of the object in RFC 3339 format. Will be returned if and only if this version of the object has been deleted.
         */
        timeDeleted?: string | null;
        /**
         * Modification time of the object metadata in RFC 3339 format.
         */
        updated?: string | null;
    }
    /**
     * An access-control entry.
     */
    export interface Schema$ObjectAccessControl {
        /**
         * The name of the bucket.
         */
        bucket?: string | null;
        /**
         * The domain associated with the entity, if any.
         */
        domain?: string | null;
        /**
         * The email address associated with the entity, if any.
         */
        email?: string | null;
        /**
         * The entity holding the permission, in one of the following forms:  - user-userId  - user-email  - group-groupId  - group-email  - domain-domain  - allUsers  - allAuthenticatedUsers Examples:  - The user liz@example.com would be user-liz@example.com.  - The group example@googlegroups.com would be group-example@googlegroups.com.  - To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.
         */
        entity?: string | null;
        /**
         * The ID for the entity, if any.
         */
        entityId?: string | null;
        /**
         * HTTP 1.1 Entity tag for the access-control entry.
         */
        etag?: string | null;
        /**
         * The content generation of the object.
         */
        generation?: string | null;
        /**
         * The ID of the access-control entry.
         */
        id?: string | null;
        /**
         * The kind of item this is. For object access control entries, this is always storage#objectAccessControl.
         */
        kind?: string | null;
        /**
         * The name of the object.
         */
        object?: string | null;
        /**
         * The access permission for the entity. Can be READER or OWNER.
         */
        role?: string | null;
        /**
         * The link to this access-control entry.
         */
        selfLink?: string | null;
    }
    /**
     * An access-control list.
     */
    export interface Schema$ObjectAccessControls {
        /**
         * The list of items.
         */
        items?: any[] | null;
        /**
         * The kind of item this is. For lists of object access control entries, this is always storage#objectAccessControls.
         */
        kind?: string | null;
    }
    /**
     * A list of objects.
     */
    export interface Schema$Objects {
        /**
         * The list of items.
         */
        items?: Schema$Object[];
        /**
         * The kind of item this is. For lists of objects, this is always storage#objects.
         */
        kind?: string | null;
        /**
         * The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of prefixes of objects matching-but-not-listed up to and including the requested delimiter.
         */
        prefixes?: string[] | null;
    }
    export class Resource$Bucketaccesscontrols {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * storage.bucketAccessControls.delete
         * @desc Permanently deletes the ACL entry for the specified entity on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.bucketAccessControls.delete({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *   });
         *   console.log(res.data);
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.bucketAccessControls.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Bucketaccesscontrols$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Bucketaccesscontrols$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Bucketaccesscontrols$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Bucketaccesscontrols$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Bucketaccesscontrols$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * storage.bucketAccessControls.get
         * @desc Returns the ACL entry for the specified entity on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.bucketAccessControls.get({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.bucketAccessControls.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Bucketaccesscontrols$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Bucketaccesscontrols$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BucketAccessControl>>;
        get(params: Params$Resource$Bucketaccesscontrols$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Bucketaccesscontrols$Get, options: MethodOptions | BodyResponseCallback<Schema$BucketAccessControl>, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        get(params: Params$Resource$Bucketaccesscontrols$Get, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        get(callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        /**
         * storage.bucketAccessControls.insert
         * @desc Creates a new ACL entry on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.bucketAccessControls.insert({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.bucketAccessControls.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {().BucketAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Bucketaccesscontrols$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Bucketaccesscontrols$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BucketAccessControl>>;
        insert(params: Params$Resource$Bucketaccesscontrols$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Bucketaccesscontrols$Insert, options: MethodOptions | BodyResponseCallback<Schema$BucketAccessControl>, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        insert(params: Params$Resource$Bucketaccesscontrols$Insert, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        insert(callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        /**
         * storage.bucketAccessControls.list
         * @desc Retrieves ACL entries on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.bucketAccessControls.list({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.bucketAccessControls.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Bucketaccesscontrols$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bucketaccesscontrols$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BucketAccessControls>>;
        list(params: Params$Resource$Bucketaccesscontrols$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bucketaccesscontrols$List, options: MethodOptions | BodyResponseCallback<Schema$BucketAccessControls>, callback: BodyResponseCallback<Schema$BucketAccessControls>): void;
        list(params: Params$Resource$Bucketaccesscontrols$List, callback: BodyResponseCallback<Schema$BucketAccessControls>): void;
        list(callback: BodyResponseCallback<Schema$BucketAccessControls>): void;
        /**
         * storage.bucketAccessControls.patch
         * @desc Updates an ACL entry on the specified bucket. This method supports patch semantics.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.bucketAccessControls.patch({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.bucketAccessControls.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {().BucketAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Bucketaccesscontrols$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Bucketaccesscontrols$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BucketAccessControl>>;
        patch(params: Params$Resource$Bucketaccesscontrols$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Bucketaccesscontrols$Patch, options: MethodOptions | BodyResponseCallback<Schema$BucketAccessControl>, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        patch(params: Params$Resource$Bucketaccesscontrols$Patch, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        patch(callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        /**
         * storage.bucketAccessControls.update
         * @desc Updates an ACL entry on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.bucketAccessControls.update({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.bucketAccessControls.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {().BucketAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        update(params: Params$Resource$Bucketaccesscontrols$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Bucketaccesscontrols$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BucketAccessControl>>;
        update(params: Params$Resource$Bucketaccesscontrols$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Bucketaccesscontrols$Update, options: MethodOptions | BodyResponseCallback<Schema$BucketAccessControl>, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        update(params: Params$Resource$Bucketaccesscontrols$Update, callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
        update(callback: BodyResponseCallback<Schema$BucketAccessControl>): void;
    }
    export interface Params$Resource$Bucketaccesscontrols$Delete extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
    }
    export interface Params$Resource$Bucketaccesscontrols$Get extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
    }
    export interface Params$Resource$Bucketaccesscontrols$Insert extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BucketAccessControl;
    }
    export interface Params$Resource$Bucketaccesscontrols$List extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
    }
    export interface Params$Resource$Bucketaccesscontrols$Patch extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BucketAccessControl;
    }
    export interface Params$Resource$Bucketaccesscontrols$Update extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BucketAccessControl;
    }
    export class Resource$Buckets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * storage.buckets.delete
         * @desc Permanently deletes an empty bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.buckets.delete({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *   });
         *   console.log(res.data);
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.buckets.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Buckets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Buckets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Buckets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Buckets$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Buckets$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * storage.buckets.get
         * @desc Returns metadata for the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_only',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.buckets.get({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl.
         *     projection: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "cors": [],
         *   //   "defaultObjectAcl": [],
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "lifecycle": {},
         *   //   "location": "my_location",
         *   //   "logging": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeCreated": "my_timeCreated",
         *   //   "versioning": {},
         *   //   "website": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.buckets.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Buckets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Buckets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Bucket>>;
        get(params: Params$Resource$Buckets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Buckets$Get, options: MethodOptions | BodyResponseCallback<Schema$Bucket>, callback: BodyResponseCallback<Schema$Bucket>): void;
        get(params: Params$Resource$Buckets$Get, callback: BodyResponseCallback<Schema$Bucket>): void;
        get(callback: BodyResponseCallback<Schema$Bucket>): void;
        /**
         * storage.buckets.insert
         * @desc Creates a new bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.buckets.insert({
         *     // A valid API project identifier.
         *     project: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl, unless the bucket resource specifies acl or defaultObjectAcl properties, when it defaults to full.
         *     projection: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "acl": [],
         *       //   "cors": [],
         *       //   "defaultObjectAcl": [],
         *       //   "etag": "my_etag",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "lifecycle": {},
         *       //   "location": "my_location",
         *       //   "logging": {},
         *       //   "metageneration": "my_metageneration",
         *       //   "name": "my_name",
         *       //   "owner": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "storageClass": "my_storageClass",
         *       //   "timeCreated": "my_timeCreated",
         *       //   "versioning": {},
         *       //   "website": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "cors": [],
         *   //   "defaultObjectAcl": [],
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "lifecycle": {},
         *   //   "location": "my_location",
         *   //   "logging": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeCreated": "my_timeCreated",
         *   //   "versioning": {},
         *   //   "website": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.buckets.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.project A valid API project identifier.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl, unless the bucket resource specifies acl or defaultObjectAcl properties, when it defaults to full.
         * @param {().Bucket} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Buckets$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Buckets$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Bucket>>;
        insert(params: Params$Resource$Buckets$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Buckets$Insert, options: MethodOptions | BodyResponseCallback<Schema$Bucket>, callback: BodyResponseCallback<Schema$Bucket>): void;
        insert(params: Params$Resource$Buckets$Insert, callback: BodyResponseCallback<Schema$Bucket>): void;
        insert(callback: BodyResponseCallback<Schema$Bucket>): void;
        /**
         * storage.buckets.list
         * @desc Retrieves a list of buckets for a given project.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_only',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.buckets.list({
         *     // Maximum number of buckets to return.
         *     maxResults: 'placeholder-value',
         *     // A previously-returned page token representing part of the larger set of results to view.
         *     pageToken: 'placeholder-value',
         *     // A valid API project identifier.
         *     project: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl.
         *     projection: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.buckets.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.maxResults Maximum number of buckets to return.
         * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
         * @param {string} params.project A valid API project identifier.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Buckets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buckets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Buckets>>;
        list(params: Params$Resource$Buckets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buckets$List, options: MethodOptions | BodyResponseCallback<Schema$Buckets>, callback: BodyResponseCallback<Schema$Buckets>): void;
        list(params: Params$Resource$Buckets$List, callback: BodyResponseCallback<Schema$Buckets>): void;
        list(callback: BodyResponseCallback<Schema$Buckets>): void;
        /**
         * storage.buckets.patch
         * @desc Updates a bucket. This method supports patch semantics.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.buckets.patch({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Set of properties to return. Defaults to full.
         *     projection: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "acl": [],
         *       //   "cors": [],
         *       //   "defaultObjectAcl": [],
         *       //   "etag": "my_etag",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "lifecycle": {},
         *       //   "location": "my_location",
         *       //   "logging": {},
         *       //   "metageneration": "my_metageneration",
         *       //   "name": "my_name",
         *       //   "owner": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "storageClass": "my_storageClass",
         *       //   "timeCreated": "my_timeCreated",
         *       //   "versioning": {},
         *       //   "website": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "cors": [],
         *   //   "defaultObjectAcl": [],
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "lifecycle": {},
         *   //   "location": "my_location",
         *   //   "logging": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeCreated": "my_timeCreated",
         *   //   "versioning": {},
         *   //   "website": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.buckets.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         * @param {string=} params.projection Set of properties to return. Defaults to full.
         * @param {().Bucket} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Buckets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Buckets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Bucket>>;
        patch(params: Params$Resource$Buckets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Buckets$Patch, options: MethodOptions | BodyResponseCallback<Schema$Bucket>, callback: BodyResponseCallback<Schema$Bucket>): void;
        patch(params: Params$Resource$Buckets$Patch, callback: BodyResponseCallback<Schema$Bucket>): void;
        patch(callback: BodyResponseCallback<Schema$Bucket>): void;
        /**
         * storage.buckets.update
         * @desc Updates a bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.buckets.update({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Set of properties to return. Defaults to full.
         *     projection: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "acl": [],
         *       //   "cors": [],
         *       //   "defaultObjectAcl": [],
         *       //   "etag": "my_etag",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "lifecycle": {},
         *       //   "location": "my_location",
         *       //   "logging": {},
         *       //   "metageneration": "my_metageneration",
         *       //   "name": "my_name",
         *       //   "owner": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "storageClass": "my_storageClass",
         *       //   "timeCreated": "my_timeCreated",
         *       //   "versioning": {},
         *       //   "website": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "cors": [],
         *   //   "defaultObjectAcl": [],
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "lifecycle": {},
         *   //   "location": "my_location",
         *   //   "logging": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeCreated": "my_timeCreated",
         *   //   "versioning": {},
         *   //   "website": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.buckets.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         * @param {string=} params.projection Set of properties to return. Defaults to full.
         * @param {().Bucket} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        update(params: Params$Resource$Buckets$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Buckets$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Bucket>>;
        update(params: Params$Resource$Buckets$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Buckets$Update, options: MethodOptions | BodyResponseCallback<Schema$Bucket>, callback: BodyResponseCallback<Schema$Bucket>): void;
        update(params: Params$Resource$Buckets$Update, callback: BodyResponseCallback<Schema$Bucket>): void;
        update(callback: BodyResponseCallback<Schema$Bucket>): void;
    }
    export interface Params$Resource$Buckets$Delete extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
    }
    export interface Params$Resource$Buckets$Get extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Set of properties to return. Defaults to noAcl.
         */
        projection?: string;
    }
    export interface Params$Resource$Buckets$Insert extends StandardParameters {
        /**
         * A valid API project identifier.
         */
        project?: string;
        /**
         * Set of properties to return. Defaults to noAcl, unless the bucket resource specifies acl or defaultObjectAcl properties, when it defaults to full.
         */
        projection?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Bucket;
    }
    export interface Params$Resource$Buckets$List extends StandardParameters {
        /**
         * Maximum number of buckets to return.
         */
        maxResults?: number;
        /**
         * A previously-returned page token representing part of the larger set of results to view.
         */
        pageToken?: string;
        /**
         * A valid API project identifier.
         */
        project?: string;
        /**
         * Set of properties to return. Defaults to noAcl.
         */
        projection?: string;
    }
    export interface Params$Resource$Buckets$Patch extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Set of properties to return. Defaults to full.
         */
        projection?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Bucket;
    }
    export interface Params$Resource$Buckets$Update extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Set of properties to return. Defaults to full.
         */
        projection?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Bucket;
    }
    export class Resource$Channels {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * storage.channels.stop
         * @desc Stop watching resources through this channel
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_only',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.channels.stop({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "address": "my_address",
         *       //   "expiration": "my_expiration",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "params": {},
         *       //   "payload": false,
         *       //   "resourceId": "my_resourceId",
         *       //   "resourceUri": "my_resourceUri",
         *       //   "token": "my_token",
         *       //   "type": "my_type"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.channels.stop
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {().Channel} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        stop(params: Params$Resource$Channels$Stop, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stop(params?: Params$Resource$Channels$Stop, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        stop(params: Params$Resource$Channels$Stop, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stop(params: Params$Resource$Channels$Stop, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        stop(params: Params$Resource$Channels$Stop, callback: BodyResponseCallback<void>): void;
        stop(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Channels$Stop extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$Channel;
    }
    export class Resource$Defaultobjectaccesscontrols {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * storage.defaultObjectAccessControls.delete
         * @desc Permanently deletes the default object ACL entry for the specified entity on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.defaultObjectAccessControls.delete({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *   });
         *   console.log(res.data);
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.defaultObjectAccessControls.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Defaultobjectaccesscontrols$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Defaultobjectaccesscontrols$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Defaultobjectaccesscontrols$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Defaultobjectaccesscontrols$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Defaultobjectaccesscontrols$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * storage.defaultObjectAccessControls.get
         * @desc Returns the default object ACL entry for the specified entity on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.defaultObjectAccessControls.get({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.defaultObjectAccessControls.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Defaultobjectaccesscontrols$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Defaultobjectaccesscontrols$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        get(params: Params$Resource$Defaultobjectaccesscontrols$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Defaultobjectaccesscontrols$Get, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        get(params: Params$Resource$Defaultobjectaccesscontrols$Get, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        get(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        /**
         * storage.defaultObjectAccessControls.insert
         * @desc Creates a new default object ACL entry on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.defaultObjectAccessControls.insert({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "object": "my_object",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.defaultObjectAccessControls.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {().ObjectAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Defaultobjectaccesscontrols$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Defaultobjectaccesscontrols$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        insert(params: Params$Resource$Defaultobjectaccesscontrols$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Defaultobjectaccesscontrols$Insert, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        insert(params: Params$Resource$Defaultobjectaccesscontrols$Insert, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        insert(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        /**
         * storage.defaultObjectAccessControls.list
         * @desc Retrieves default object ACL entries on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.defaultObjectAccessControls.list({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // If present, only return default ACL listing if the bucket's current metageneration matches this value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // If present, only return default ACL listing if the bucket's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.defaultObjectAccessControls.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string=} params.ifMetagenerationMatch If present, only return default ACL listing if the bucket's current metageneration matches this value.
         * @param {string=} params.ifMetagenerationNotMatch If present, only return default ACL listing if the bucket's current metageneration does not match the given value.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Defaultobjectaccesscontrols$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Defaultobjectaccesscontrols$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControls>>;
        list(params: Params$Resource$Defaultobjectaccesscontrols$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Defaultobjectaccesscontrols$List, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControls>, callback: BodyResponseCallback<Schema$ObjectAccessControls>): void;
        list(params: Params$Resource$Defaultobjectaccesscontrols$List, callback: BodyResponseCallback<Schema$ObjectAccessControls>): void;
        list(callback: BodyResponseCallback<Schema$ObjectAccessControls>): void;
        /**
         * storage.defaultObjectAccessControls.patch
         * @desc Updates a default object ACL entry on the specified bucket. This method supports patch semantics.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.defaultObjectAccessControls.patch({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "object": "my_object",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.defaultObjectAccessControls.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {().ObjectAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Defaultobjectaccesscontrols$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Defaultobjectaccesscontrols$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        patch(params: Params$Resource$Defaultobjectaccesscontrols$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Defaultobjectaccesscontrols$Patch, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        patch(params: Params$Resource$Defaultobjectaccesscontrols$Patch, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        patch(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        /**
         * storage.defaultObjectAccessControls.update
         * @desc Updates a default object ACL entry on the specified bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.defaultObjectAccessControls.update({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "object": "my_object",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.defaultObjectAccessControls.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {().ObjectAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        update(params: Params$Resource$Defaultobjectaccesscontrols$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Defaultobjectaccesscontrols$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        update(params: Params$Resource$Defaultobjectaccesscontrols$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Defaultobjectaccesscontrols$Update, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        update(params: Params$Resource$Defaultobjectaccesscontrols$Update, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        update(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
    }
    export interface Params$Resource$Defaultobjectaccesscontrols$Delete extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
    }
    export interface Params$Resource$Defaultobjectaccesscontrols$Get extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
    }
    export interface Params$Resource$Defaultobjectaccesscontrols$Insert extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ObjectAccessControl;
    }
    export interface Params$Resource$Defaultobjectaccesscontrols$List extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * If present, only return default ACL listing if the bucket's current metageneration matches this value.
         */
        ifMetagenerationMatch?: string;
        /**
         * If present, only return default ACL listing if the bucket's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
    }
    export interface Params$Resource$Defaultobjectaccesscontrols$Patch extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ObjectAccessControl;
    }
    export interface Params$Resource$Defaultobjectaccesscontrols$Update extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ObjectAccessControl;
    }
    export class Resource$Objectaccesscontrols {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * storage.objectAccessControls.delete
         * @desc Permanently deletes the ACL entry for the specified entity on the specified object.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objectAccessControls.delete({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *   });
         *   console.log(res.data);
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objectAccessControls.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string} params.object Name of the object.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Objectaccesscontrols$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Objectaccesscontrols$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Objectaccesscontrols$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Objectaccesscontrols$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Objectaccesscontrols$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * storage.objectAccessControls.get
         * @desc Returns the ACL entry for the specified entity on the specified object.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objectAccessControls.get({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objectAccessControls.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string} params.object Name of the object.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Objectaccesscontrols$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Objectaccesscontrols$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        get(params: Params$Resource$Objectaccesscontrols$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Objectaccesscontrols$Get, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        get(params: Params$Resource$Objectaccesscontrols$Get, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        get(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        /**
         * storage.objectAccessControls.insert
         * @desc Creates a new ACL entry on the specified object.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objectAccessControls.insert({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "object": "my_object",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objectAccessControls.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string} params.object Name of the object.
         * @param {().ObjectAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Objectaccesscontrols$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Objectaccesscontrols$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        insert(params: Params$Resource$Objectaccesscontrols$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Objectaccesscontrols$Insert, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        insert(params: Params$Resource$Objectaccesscontrols$Insert, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        insert(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        /**
         * storage.objectAccessControls.list
         * @desc Retrieves ACL entries on the specified object.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objectAccessControls.list({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objectAccessControls.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string} params.object Name of the object.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Objectaccesscontrols$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Objectaccesscontrols$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControls>>;
        list(params: Params$Resource$Objectaccesscontrols$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Objectaccesscontrols$List, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControls>, callback: BodyResponseCallback<Schema$ObjectAccessControls>): void;
        list(params: Params$Resource$Objectaccesscontrols$List, callback: BodyResponseCallback<Schema$ObjectAccessControls>): void;
        list(callback: BodyResponseCallback<Schema$ObjectAccessControls>): void;
        /**
         * storage.objectAccessControls.patch
         * @desc Updates an ACL entry on the specified object. This method supports patch semantics.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objectAccessControls.patch({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "object": "my_object",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objectAccessControls.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string} params.object Name of the object.
         * @param {().ObjectAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Objectaccesscontrols$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Objectaccesscontrols$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        patch(params: Params$Resource$Objectaccesscontrols$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Objectaccesscontrols$Patch, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        patch(params: Params$Resource$Objectaccesscontrols$Patch, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        patch(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        /**
         * storage.objectAccessControls.update
         * @desc Updates an ACL entry on the specified object.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objectAccessControls.update({
         *     // Name of a bucket.
         *     bucket: 'placeholder-value',
         *     // The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         *     entity: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "bucket": "my_bucket",
         *       //   "domain": "my_domain",
         *       //   "email": "my_email",
         *       //   "entity": "my_entity",
         *       //   "entityId": "my_entityId",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "object": "my_object",
         *       //   "role": "my_role",
         *       //   "selfLink": "my_selfLink"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bucket": "my_bucket",
         *   //   "domain": "my_domain",
         *   //   "email": "my_email",
         *   //   "entity": "my_entity",
         *   //   "entityId": "my_entityId",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "object": "my_object",
         *   //   "role": "my_role",
         *   //   "selfLink": "my_selfLink"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objectAccessControls.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of a bucket.
         * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string} params.object Name of the object.
         * @param {().ObjectAccessControl} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        update(params: Params$Resource$Objectaccesscontrols$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Objectaccesscontrols$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ObjectAccessControl>>;
        update(params: Params$Resource$Objectaccesscontrols$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Objectaccesscontrols$Update, options: MethodOptions | BodyResponseCallback<Schema$ObjectAccessControl>, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        update(params: Params$Resource$Objectaccesscontrols$Update, callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
        update(callback: BodyResponseCallback<Schema$ObjectAccessControl>): void;
    }
    export interface Params$Resource$Objectaccesscontrols$Delete extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Name of the object.
         */
        object?: string;
    }
    export interface Params$Resource$Objectaccesscontrols$Get extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Name of the object.
         */
        object?: string;
    }
    export interface Params$Resource$Objectaccesscontrols$Insert extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Name of the object.
         */
        object?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ObjectAccessControl;
    }
    export interface Params$Resource$Objectaccesscontrols$List extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Name of the object.
         */
        object?: string;
    }
    export interface Params$Resource$Objectaccesscontrols$Patch extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Name of the object.
         */
        object?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ObjectAccessControl;
    }
    export interface Params$Resource$Objectaccesscontrols$Update extends StandardParameters {
        /**
         * Name of a bucket.
         */
        bucket?: string;
        /**
         * The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
         */
        entity?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Name of the object.
         */
        object?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ObjectAccessControl;
    }
    export class Resource$Objects {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * storage.objects.compose
         * @desc Concatenates a list of existing objects into a new object in the same bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.compose({
         *     // Name of the bucket containing the source objects. The destination object is stored in this bucket.
         *     destinationBucket: 'placeholder-value',
         *     // Name of the new object.
         *     destinationObject: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation matches the given value.
         *     ifGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "destination": {},
         *       //   "kind": "my_kind",
         *       //   "sourceObjects": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "bucket": "my_bucket",
         *   //   "cacheControl": "my_cacheControl",
         *   //   "componentCount": 0,
         *   //   "contentDisposition": "my_contentDisposition",
         *   //   "contentEncoding": "my_contentEncoding",
         *   //   "contentLanguage": "my_contentLanguage",
         *   //   "contentType": "my_contentType",
         *   //   "crc32c": "my_crc32c",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "md5Hash": "my_md5Hash",
         *   //   "mediaLink": "my_mediaLink",
         *   //   "metadata": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "size": "my_size",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeDeleted": "my_timeDeleted",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.compose
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.destinationBucket Name of the bucket containing the source objects. The destination object is stored in this bucket.
         * @param {string} params.destinationObject Name of the new object.
         * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
         * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
         * @param {().ComposeRequest} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        compose(params: Params$Resource$Objects$Compose, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        compose(params?: Params$Resource$Objects$Compose, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Object>>;
        compose(params: Params$Resource$Objects$Compose, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        compose(params: Params$Resource$Objects$Compose, options: MethodOptions | BodyResponseCallback<Schema$Object>, callback: BodyResponseCallback<Schema$Object>): void;
        compose(params: Params$Resource$Objects$Compose, callback: BodyResponseCallback<Schema$Object>): void;
        compose(callback: BodyResponseCallback<Schema$Object>): void;
        /**
         * storage.objects.copy
         * @desc Copies an object to a destination in the same location. Optionally overrides metadata.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.copy({
         *     // Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
         *     destinationBucket: 'placeholder-value',
         *     // Name of the new object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
         *     destinationObject: 'placeholder-value',
         *     // Makes the operation conditional on whether the destination object's current generation matches the given value.
         *     ifGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the destination object's current generation does not match the given value.
         *     ifGenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the destination object's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the destination object's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the source object's generation matches the given value.
         *     ifSourceGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the source object's generation does not match the given value.
         *     ifSourceGenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the source object's current metageneration matches the given value.
         *     ifSourceMetagenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the source object's current metageneration does not match the given value.
         *     ifSourceMetagenerationNotMatch: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
         *     projection: 'placeholder-value',
         *     // Name of the bucket in which to find the source object.
         *     sourceBucket: 'placeholder-value',
         *     // If present, selects a specific revision of the source object (as opposed to the latest version, the default).
         *     sourceGeneration: 'placeholder-value',
         *     // Name of the source object.
         *     sourceObject: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "acl": [],
         *       //   "bucket": "my_bucket",
         *       //   "cacheControl": "my_cacheControl",
         *       //   "componentCount": 0,
         *       //   "contentDisposition": "my_contentDisposition",
         *       //   "contentEncoding": "my_contentEncoding",
         *       //   "contentLanguage": "my_contentLanguage",
         *       //   "contentType": "my_contentType",
         *       //   "crc32c": "my_crc32c",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "md5Hash": "my_md5Hash",
         *       //   "mediaLink": "my_mediaLink",
         *       //   "metadata": {},
         *       //   "metageneration": "my_metageneration",
         *       //   "name": "my_name",
         *       //   "owner": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "size": "my_size",
         *       //   "storageClass": "my_storageClass",
         *       //   "timeDeleted": "my_timeDeleted",
         *       //   "updated": "my_updated"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "bucket": "my_bucket",
         *   //   "cacheControl": "my_cacheControl",
         *   //   "componentCount": 0,
         *   //   "contentDisposition": "my_contentDisposition",
         *   //   "contentEncoding": "my_contentEncoding",
         *   //   "contentLanguage": "my_contentLanguage",
         *   //   "contentType": "my_contentType",
         *   //   "crc32c": "my_crc32c",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "md5Hash": "my_md5Hash",
         *   //   "mediaLink": "my_mediaLink",
         *   //   "metadata": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "size": "my_size",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeDeleted": "my_timeDeleted",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.copy
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.destinationBucket Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
         * @param {string} params.destinationObject Name of the new object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
         * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the destination object's current generation matches the given value.
         * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the destination object's current generation does not match the given value.
         * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the destination object's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the destination object's current metageneration does not match the given value.
         * @param {string=} params.ifSourceGenerationMatch Makes the operation conditional on whether the source object's generation matches the given value.
         * @param {string=} params.ifSourceGenerationNotMatch Makes the operation conditional on whether the source object's generation does not match the given value.
         * @param {string=} params.ifSourceMetagenerationMatch Makes the operation conditional on whether the source object's current metageneration matches the given value.
         * @param {string=} params.ifSourceMetagenerationNotMatch Makes the operation conditional on whether the source object's current metageneration does not match the given value.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
         * @param {string} params.sourceBucket Name of the bucket in which to find the source object.
         * @param {string=} params.sourceGeneration If present, selects a specific revision of the source object (as opposed to the latest version, the default).
         * @param {string} params.sourceObject Name of the source object.
         * @param {().Object} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        copy(params: Params$Resource$Objects$Copy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        copy(params?: Params$Resource$Objects$Copy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Object>>;
        copy(params: Params$Resource$Objects$Copy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        copy(params: Params$Resource$Objects$Copy, options: MethodOptions | BodyResponseCallback<Schema$Object>, callback: BodyResponseCallback<Schema$Object>): void;
        copy(params: Params$Resource$Objects$Copy, callback: BodyResponseCallback<Schema$Object>): void;
        copy(callback: BodyResponseCallback<Schema$Object>): void;
        /**
         * storage.objects.delete
         * @desc Deletes data blobs and associated metadata. Deletions are permanent if versioning is not enabled for the bucket, or if the generation parameter is used.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.delete({
         *     // Name of the bucket in which the object resides.
         *     bucket: 'placeholder-value',
         *     // If present, permanently deletes a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation matches the given value.
         *     ifGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation does not match the given value.
         *     ifGenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *   });
         *   console.log(res.data);
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of the bucket in which the object resides.
         * @param {string=} params.generation If present, permanently deletes a specific revision of this object (as opposed to the latest version, the default).
         * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
         * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
         * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
         * @param {string} params.object Name of the object.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Objects$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Objects$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Objects$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Objects$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Objects$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * storage.objects.get
         * @desc Retrieves objects or their associated metadata.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_only',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.get({
         *     // Name of the bucket in which the object resides.
         *     bucket: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's generation matches the given value.
         *     ifGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's generation does not match the given value.
         *     ifGenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl.
         *     projection: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "bucket": "my_bucket",
         *   //   "cacheControl": "my_cacheControl",
         *   //   "componentCount": 0,
         *   //   "contentDisposition": "my_contentDisposition",
         *   //   "contentEncoding": "my_contentEncoding",
         *   //   "contentLanguage": "my_contentLanguage",
         *   //   "contentType": "my_contentType",
         *   //   "crc32c": "my_crc32c",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "md5Hash": "my_md5Hash",
         *   //   "mediaLink": "my_mediaLink",
         *   //   "metadata": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "size": "my_size",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeDeleted": "my_timeDeleted",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of the bucket in which the object resides.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's generation matches the given value.
         * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's generation does not match the given value.
         * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
         * @param {string} params.object Name of the object.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Objects$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Objects$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Object>>;
        get(params: Params$Resource$Objects$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Objects$Get, options: MethodOptions | BodyResponseCallback<Schema$Object>, callback: BodyResponseCallback<Schema$Object>): void;
        get(params: Params$Resource$Objects$Get, callback: BodyResponseCallback<Schema$Object>): void;
        get(callback: BodyResponseCallback<Schema$Object>): void;
        /**
         * storage.objects.insert
         * @desc Stores new data blobs and associated metadata.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.insert({
         *     // Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
         *     bucket: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation matches the given value.
         *     ifGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation does not match the given value.
         *     ifGenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Name of the object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
         *     name: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
         *     projection: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "acl": [],
         *       //   "bucket": "my_bucket",
         *       //   "cacheControl": "my_cacheControl",
         *       //   "componentCount": 0,
         *       //   "contentDisposition": "my_contentDisposition",
         *       //   "contentEncoding": "my_contentEncoding",
         *       //   "contentLanguage": "my_contentLanguage",
         *       //   "contentType": "my_contentType",
         *       //   "crc32c": "my_crc32c",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "md5Hash": "my_md5Hash",
         *       //   "mediaLink": "my_mediaLink",
         *       //   "metadata": {},
         *       //   "metageneration": "my_metageneration",
         *       //   "name": "my_name",
         *       //   "owner": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "size": "my_size",
         *       //   "storageClass": "my_storageClass",
         *       //   "timeDeleted": "my_timeDeleted",
         *       //   "updated": "my_updated"
         *       // }
         *     },
         *     media: {
         *       mimeType: 'placeholder-value',
         *       body: 'placeholder-value',
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "bucket": "my_bucket",
         *   //   "cacheControl": "my_cacheControl",
         *   //   "componentCount": 0,
         *   //   "contentDisposition": "my_contentDisposition",
         *   //   "contentEncoding": "my_contentEncoding",
         *   //   "contentLanguage": "my_contentLanguage",
         *   //   "contentType": "my_contentType",
         *   //   "crc32c": "my_crc32c",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "md5Hash": "my_md5Hash",
         *   //   "mediaLink": "my_mediaLink",
         *   //   "metadata": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "size": "my_size",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeDeleted": "my_timeDeleted",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.insert
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
         * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
         * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
         * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
         * @param {string=} params.name Name of the object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
         * @param  {object} params.requestBody Media resource metadata
         * @param {object} params.media Media object
         * @param {string} params.media.mimeType Media mime-type
         * @param {string|object} params.media.body Media body contents
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        insert(params: Params$Resource$Objects$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Objects$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Object>>;
        insert(params: Params$Resource$Objects$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Objects$Insert, options: MethodOptions | BodyResponseCallback<Schema$Object>, callback: BodyResponseCallback<Schema$Object>): void;
        insert(params: Params$Resource$Objects$Insert, callback: BodyResponseCallback<Schema$Object>): void;
        insert(callback: BodyResponseCallback<Schema$Object>): void;
        /**
         * storage.objects.list
         * @desc Retrieves a list of objects matching the criteria.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_only',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.list({
         *     // Name of the bucket in which to look for objects.
         *     bucket: 'placeholder-value',
         *     // Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
         *     delimiter: 'placeholder-value',
         *     // Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
         *     maxResults: 'placeholder-value',
         *     // A previously-returned page token representing part of the larger set of results to view.
         *     pageToken: 'placeholder-value',
         *     // Filter results to objects whose names begin with this prefix.
         *     prefix: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl.
         *     projection: 'placeholder-value',
         *     // If true, lists all versions of a file as distinct results.
         *     versions: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "prefixes": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of the bucket in which to look for objects.
         * @param {string=} params.delimiter Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
         * @param {integer=} params.maxResults Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
         * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
         * @param {string=} params.prefix Filter results to objects whose names begin with this prefix.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
         * @param {boolean=} params.versions If true, lists all versions of a file as distinct results.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Objects$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Objects$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Objects>>;
        list(params: Params$Resource$Objects$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Objects$List, options: MethodOptions | BodyResponseCallback<Schema$Objects>, callback: BodyResponseCallback<Schema$Objects>): void;
        list(params: Params$Resource$Objects$List, callback: BodyResponseCallback<Schema$Objects>): void;
        list(callback: BodyResponseCallback<Schema$Objects>): void;
        /**
         * storage.objects.patch
         * @desc Updates a data blob's associated metadata. This method supports patch semantics.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.patch({
         *     // Name of the bucket in which the object resides.
         *     bucket: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation matches the given value.
         *     ifGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation does not match the given value.
         *     ifGenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *     // Set of properties to return. Defaults to full.
         *     projection: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "acl": [],
         *       //   "bucket": "my_bucket",
         *       //   "cacheControl": "my_cacheControl",
         *       //   "componentCount": 0,
         *       //   "contentDisposition": "my_contentDisposition",
         *       //   "contentEncoding": "my_contentEncoding",
         *       //   "contentLanguage": "my_contentLanguage",
         *       //   "contentType": "my_contentType",
         *       //   "crc32c": "my_crc32c",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "md5Hash": "my_md5Hash",
         *       //   "mediaLink": "my_mediaLink",
         *       //   "metadata": {},
         *       //   "metageneration": "my_metageneration",
         *       //   "name": "my_name",
         *       //   "owner": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "size": "my_size",
         *       //   "storageClass": "my_storageClass",
         *       //   "timeDeleted": "my_timeDeleted",
         *       //   "updated": "my_updated"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "bucket": "my_bucket",
         *   //   "cacheControl": "my_cacheControl",
         *   //   "componentCount": 0,
         *   //   "contentDisposition": "my_contentDisposition",
         *   //   "contentEncoding": "my_contentEncoding",
         *   //   "contentLanguage": "my_contentLanguage",
         *   //   "contentType": "my_contentType",
         *   //   "crc32c": "my_crc32c",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "md5Hash": "my_md5Hash",
         *   //   "mediaLink": "my_mediaLink",
         *   //   "metadata": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "size": "my_size",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeDeleted": "my_timeDeleted",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of the bucket in which the object resides.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
         * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
         * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
         * @param {string} params.object Name of the object.
         * @param {string=} params.projection Set of properties to return. Defaults to full.
         * @param {().Object} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Objects$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Objects$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Object>>;
        patch(params: Params$Resource$Objects$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Objects$Patch, options: MethodOptions | BodyResponseCallback<Schema$Object>, callback: BodyResponseCallback<Schema$Object>): void;
        patch(params: Params$Resource$Objects$Patch, callback: BodyResponseCallback<Schema$Object>): void;
        patch(callback: BodyResponseCallback<Schema$Object>): void;
        /**
         * storage.objects.update
         * @desc Updates a data blob's associated metadata.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.update({
         *     // Name of the bucket in which the object resides.
         *     bucket: 'placeholder-value',
         *     // If present, selects a specific revision of this object (as opposed to the latest version, the default).
         *     generation: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation matches the given value.
         *     ifGenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current generation does not match the given value.
         *     ifGenerationNotMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration matches the given value.
         *     ifMetagenerationMatch: 'placeholder-value',
         *     // Makes the operation conditional on whether the object's current metageneration does not match the given value.
         *     ifMetagenerationNotMatch: 'placeholder-value',
         *     // Name of the object.
         *     object: 'placeholder-value',
         *     // Set of properties to return. Defaults to full.
         *     projection: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "acl": [],
         *       //   "bucket": "my_bucket",
         *       //   "cacheControl": "my_cacheControl",
         *       //   "componentCount": 0,
         *       //   "contentDisposition": "my_contentDisposition",
         *       //   "contentEncoding": "my_contentEncoding",
         *       //   "contentLanguage": "my_contentLanguage",
         *       //   "contentType": "my_contentType",
         *       //   "crc32c": "my_crc32c",
         *       //   "etag": "my_etag",
         *       //   "generation": "my_generation",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "md5Hash": "my_md5Hash",
         *       //   "mediaLink": "my_mediaLink",
         *       //   "metadata": {},
         *       //   "metageneration": "my_metageneration",
         *       //   "name": "my_name",
         *       //   "owner": {},
         *       //   "selfLink": "my_selfLink",
         *       //   "size": "my_size",
         *       //   "storageClass": "my_storageClass",
         *       //   "timeDeleted": "my_timeDeleted",
         *       //   "updated": "my_updated"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "acl": [],
         *   //   "bucket": "my_bucket",
         *   //   "cacheControl": "my_cacheControl",
         *   //   "componentCount": 0,
         *   //   "contentDisposition": "my_contentDisposition",
         *   //   "contentEncoding": "my_contentEncoding",
         *   //   "contentLanguage": "my_contentLanguage",
         *   //   "contentType": "my_contentType",
         *   //   "crc32c": "my_crc32c",
         *   //   "etag": "my_etag",
         *   //   "generation": "my_generation",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "md5Hash": "my_md5Hash",
         *   //   "mediaLink": "my_mediaLink",
         *   //   "metadata": {},
         *   //   "metageneration": "my_metageneration",
         *   //   "name": "my_name",
         *   //   "owner": {},
         *   //   "selfLink": "my_selfLink",
         *   //   "size": "my_size",
         *   //   "storageClass": "my_storageClass",
         *   //   "timeDeleted": "my_timeDeleted",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of the bucket in which the object resides.
         * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
         * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
         * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
         * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
         * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
         * @param {string} params.object Name of the object.
         * @param {string=} params.projection Set of properties to return. Defaults to full.
         * @param {().Object} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        update(params: Params$Resource$Objects$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Objects$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Object>>;
        update(params: Params$Resource$Objects$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Objects$Update, options: MethodOptions | BodyResponseCallback<Schema$Object>, callback: BodyResponseCallback<Schema$Object>): void;
        update(params: Params$Resource$Objects$Update, callback: BodyResponseCallback<Schema$Object>): void;
        update(callback: BodyResponseCallback<Schema$Object>): void;
        /**
         * storage.objects.watchAll
         * @desc Watch for changes on all objects in a bucket.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/storage.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const storage = google.storage('v1beta2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/devstorage.full_control',
         *       'https://www.googleapis.com/auth/devstorage.read_only',
         *       'https://www.googleapis.com/auth/devstorage.read_write',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await storage.objects.watchAll({
         *     // Name of the bucket in which to look for objects.
         *     bucket: 'placeholder-value',
         *     // Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
         *     delimiter: 'placeholder-value',
         *     // Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
         *     maxResults: 'placeholder-value',
         *     // A previously-returned page token representing part of the larger set of results to view.
         *     pageToken: 'placeholder-value',
         *     // Filter results to objects whose names begin with this prefix.
         *     prefix: 'placeholder-value',
         *     // Set of properties to return. Defaults to noAcl.
         *     projection: 'placeholder-value',
         *     // If true, lists all versions of a file as distinct results.
         *     versions: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "address": "my_address",
         *       //   "expiration": "my_expiration",
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "params": {},
         *       //   "payload": false,
         *       //   "resourceId": "my_resourceId",
         *       //   "resourceUri": "my_resourceUri",
         *       //   "token": "my_token",
         *       //   "type": "my_type"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "address": "my_address",
         *   //   "expiration": "my_expiration",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "params": {},
         *   //   "payload": false,
         *   //   "resourceId": "my_resourceId",
         *   //   "resourceUri": "my_resourceUri",
         *   //   "token": "my_token",
         *   //   "type": "my_type"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias storage.objects.watchAll
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.bucket Name of the bucket in which to look for objects.
         * @param {string=} params.delimiter Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
         * @param {integer=} params.maxResults Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
         * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
         * @param {string=} params.prefix Filter results to objects whose names begin with this prefix.
         * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
         * @param {boolean=} params.versions If true, lists all versions of a file as distinct results.
         * @param {().Channel} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        watchAll(params: Params$Resource$Objects$Watchall, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        watchAll(params?: Params$Resource$Objects$Watchall, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Channel>>;
        watchAll(params: Params$Resource$Objects$Watchall, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        watchAll(params: Params$Resource$Objects$Watchall, options: MethodOptions | BodyResponseCallback<Schema$Channel>, callback: BodyResponseCallback<Schema$Channel>): void;
        watchAll(params: Params$Resource$Objects$Watchall, callback: BodyResponseCallback<Schema$Channel>): void;
        watchAll(callback: BodyResponseCallback<Schema$Channel>): void;
    }
    export interface Params$Resource$Objects$Compose extends StandardParameters {
        /**
         * Name of the bucket containing the source objects. The destination object is stored in this bucket.
         */
        destinationBucket?: string;
        /**
         * Name of the new object.
         */
        destinationObject?: string;
        /**
         * Makes the operation conditional on whether the object's current generation matches the given value.
         */
        ifGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ComposeRequest;
    }
    export interface Params$Resource$Objects$Copy extends StandardParameters {
        /**
         * Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
         */
        destinationBucket?: string;
        /**
         * Name of the new object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
         */
        destinationObject?: string;
        /**
         * Makes the operation conditional on whether the destination object's current generation matches the given value.
         */
        ifGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the destination object's current generation does not match the given value.
         */
        ifGenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the destination object's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the destination object's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the source object's generation matches the given value.
         */
        ifSourceGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the source object's generation does not match the given value.
         */
        ifSourceGenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the source object's current metageneration matches the given value.
         */
        ifSourceMetagenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the source object's current metageneration does not match the given value.
         */
        ifSourceMetagenerationNotMatch?: string;
        /**
         * Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
         */
        projection?: string;
        /**
         * Name of the bucket in which to find the source object.
         */
        sourceBucket?: string;
        /**
         * If present, selects a specific revision of the source object (as opposed to the latest version, the default).
         */
        sourceGeneration?: string;
        /**
         * Name of the source object.
         */
        sourceObject?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Object;
    }
    export interface Params$Resource$Objects$Delete extends StandardParameters {
        /**
         * Name of the bucket in which the object resides.
         */
        bucket?: string;
        /**
         * If present, permanently deletes a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Makes the operation conditional on whether the object's current generation matches the given value.
         */
        ifGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current generation does not match the given value.
         */
        ifGenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Name of the object.
         */
        object?: string;
    }
    export interface Params$Resource$Objects$Get extends StandardParameters {
        /**
         * Name of the bucket in which the object resides.
         */
        bucket?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Makes the operation conditional on whether the object's generation matches the given value.
         */
        ifGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's generation does not match the given value.
         */
        ifGenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Name of the object.
         */
        object?: string;
        /**
         * Set of properties to return. Defaults to noAcl.
         */
        projection?: string;
    }
    export interface Params$Resource$Objects$Insert extends StandardParameters {
        /**
         * Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
         */
        bucket?: string;
        /**
         * Makes the operation conditional on whether the object's current generation matches the given value.
         */
        ifGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current generation does not match the given value.
         */
        ifGenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Name of the object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
         */
        name?: string;
        /**
         * Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
         */
        projection?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Object;
        /**
         * Media metadata
         */
        media?: {
            /**
             * Media mime-type
             */
            mimeType?: string;
            /**
             * Media body contents
             */
            body?: any;
        };
    }
    export interface Params$Resource$Objects$List extends StandardParameters {
        /**
         * Name of the bucket in which to look for objects.
         */
        bucket?: string;
        /**
         * Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
         */
        delimiter?: string;
        /**
         * Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
         */
        maxResults?: number;
        /**
         * A previously-returned page token representing part of the larger set of results to view.
         */
        pageToken?: string;
        /**
         * Filter results to objects whose names begin with this prefix.
         */
        prefix?: string;
        /**
         * Set of properties to return. Defaults to noAcl.
         */
        projection?: string;
        /**
         * If true, lists all versions of a file as distinct results.
         */
        versions?: boolean;
    }
    export interface Params$Resource$Objects$Patch extends StandardParameters {
        /**
         * Name of the bucket in which the object resides.
         */
        bucket?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Makes the operation conditional on whether the object's current generation matches the given value.
         */
        ifGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current generation does not match the given value.
         */
        ifGenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Name of the object.
         */
        object?: string;
        /**
         * Set of properties to return. Defaults to full.
         */
        projection?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Object;
    }
    export interface Params$Resource$Objects$Update extends StandardParameters {
        /**
         * Name of the bucket in which the object resides.
         */
        bucket?: string;
        /**
         * If present, selects a specific revision of this object (as opposed to the latest version, the default).
         */
        generation?: string;
        /**
         * Makes the operation conditional on whether the object's current generation matches the given value.
         */
        ifGenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current generation does not match the given value.
         */
        ifGenerationNotMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration matches the given value.
         */
        ifMetagenerationMatch?: string;
        /**
         * Makes the operation conditional on whether the object's current metageneration does not match the given value.
         */
        ifMetagenerationNotMatch?: string;
        /**
         * Name of the object.
         */
        object?: string;
        /**
         * Set of properties to return. Defaults to full.
         */
        projection?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Object;
    }
    export interface Params$Resource$Objects$Watchall extends StandardParameters {
        /**
         * Name of the bucket in which to look for objects.
         */
        bucket?: string;
        /**
         * Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
         */
        delimiter?: string;
        /**
         * Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
         */
        maxResults?: number;
        /**
         * A previously-returned page token representing part of the larger set of results to view.
         */
        pageToken?: string;
        /**
         * Filter results to objects whose names begin with this prefix.
         */
        prefix?: string;
        /**
         * Set of properties to return. Defaults to noAcl.
         */
        projection?: string;
        /**
         * If true, lists all versions of a file as distinct results.
         */
        versions?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Channel;
    }
    export {};
}
