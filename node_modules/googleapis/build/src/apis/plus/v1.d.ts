import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace plus_v1 {
    export interface Options extends GlobalOptions {
        version: 'v1';
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
     * Google+ API
     *
     * Builds on top of the Google+ platform.
     *
     * @example
     * const {google} = require('googleapis');
     * const plus = google.plus('v1');
     *
     * @namespace plus
     * @type {Function}
     * @version v1
     * @variation v1
     * @param {object=} options Options for Plus
     */
    export class Plus {
        context: APIRequestContext;
        activities: Resource$Activities;
        comments: Resource$Comments;
        people: Resource$People;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    export interface Schema$Acl {
        /**
         * Description of the access granted, suitable for display.
         */
        description?: string | null;
        /**
         * The list of access entries.
         */
        items?: Schema$PlusAclentryResource[];
        /**
         * Identifies this resource as a collection of access controls. Value: &quot;plus#acl&quot;.
         */
        kind?: string | null;
    }
    export interface Schema$Activity {
        /**
         * Identifies who has access to see this activity.
         */
        access?: Schema$Acl;
        /**
         * The person who performed this activity.
         */
        actor?: {
            clientSpecificActorInfo?: {
                youtubeActorInfo?: {
                    channelId?: string;
                };
            };
            displayName?: string;
            id?: string;
            image?: {
                url?: string;
            };
            name?: {
                familyName?: string;
                givenName?: string;
            };
            url?: string;
            verification?: {
                adHocVerified?: string;
            };
        } | null;
        /**
         * Street address where this activity occurred.
         */
        address?: string | null;
        /**
         * Additional content added by the person who shared this activity, applicable only when resharing an activity.
         */
        annotation?: string | null;
        /**
         * If this activity is a crosspost from another system, this property specifies the ID of the original activity.
         */
        crosspostSource?: string | null;
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * Latitude and longitude where this activity occurred. Format is latitude followed by longitude, space separated.
         */
        geocode?: string | null;
        /**
         * The ID of this activity.
         */
        id?: string | null;
        /**
         * Identifies this resource as an activity. Value: &quot;plus#activity&quot;.
         */
        kind?: string | null;
        /**
         * The location where this activity occurred.
         */
        location?: Schema$Place;
        /**
         * The object of this activity.
         */
        object?: {
            actor?: {
                clientSpecificActorInfo?: {
                    youtubeActorInfo?: {
                        channelId?: string;
                    };
                };
                displayName?: string;
                id?: string;
                image?: {
                    url?: string;
                };
                url?: string;
                verification?: {
                    adHocVerified?: string;
                };
            };
            attachments?: Array<{
                content?: string;
                displayName?: string;
                embed?: {
                    type?: string;
                    url?: string;
                };
                fullImage?: {
                    height?: number;
                    type?: string;
                    url?: string;
                    width?: number;
                };
                id?: string;
                image?: {
                    height?: number;
                    type?: string;
                    url?: string;
                    width?: number;
                };
                objectType?: string;
                thumbnails?: Array<{
                    description?: string;
                    image?: {
                        height?: number;
                        type?: string;
                        url?: string;
                        width?: number;
                    };
                    url?: string;
                }>;
                url?: string;
            }>;
            content?: string;
            id?: string;
            objectType?: string;
            originalContent?: string;
            plusoners?: {
                selfLink?: string;
                totalItems?: number;
            };
            replies?: {
                selfLink?: string;
                totalItems?: number;
            };
            resharers?: {
                selfLink?: string;
                totalItems?: number;
            };
            url?: string;
        } | null;
        /**
         * ID of the place where this activity occurred.
         */
        placeId?: string | null;
        /**
         * Name of the place where this activity occurred.
         */
        placeName?: string | null;
        /**
         * The service provider that initially published this activity.
         */
        provider?: {
            title?: string;
        } | null;
        /**
         * The time at which this activity was initially published. Formatted as an RFC 3339 timestamp.
         */
        published?: string | null;
        /**
         * Radius, in meters, of the region where this activity occurred, centered at the latitude and longitude identified in geocode.
         */
        radius?: string | null;
        /**
         * Title of this activity.
         */
        title?: string | null;
        /**
         * The time at which this activity was last updated. Formatted as an RFC 3339 timestamp.
         */
        updated?: string | null;
        /**
         * The link to this activity.
         */
        url?: string | null;
        /**
         * This activity&#39;s verb, which indicates the action that was performed. Possible values include, but are not limited to, the following values:   - &quot;post&quot; - Publish content to the stream.  - &quot;share&quot; - Reshare an activity.
         */
        verb?: string | null;
    }
    export interface Schema$ActivityFeed {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The ID of this collection of activities. Deprecated.
         */
        id?: string | null;
        /**
         * The activities in this page of results.
         */
        items?: Schema$Activity[];
        /**
         * Identifies this resource as a collection of activities. Value: &quot;plus#activityFeed&quot;.
         */
        kind?: string | null;
        /**
         * Link to the next page of activities.
         */
        nextLink?: string | null;
        /**
         * The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * Link to this activity resource.
         */
        selfLink?: string | null;
        /**
         * The title of this collection of activities, which is a truncated portion of the content.
         */
        title?: string | null;
        /**
         * The time at which this collection of activities was last updated. Formatted as an RFC 3339 timestamp.
         */
        updated?: string | null;
    }
    export interface Schema$Comment {
        /**
         * The person who posted this comment.
         */
        actor?: {
            clientSpecificActorInfo?: {
                youtubeActorInfo?: {
                    channelId?: string;
                };
            };
            displayName?: string;
            id?: string;
            image?: {
                url?: string;
            };
            url?: string;
            verification?: {
                adHocVerified?: string;
            };
        } | null;
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The ID of this comment.
         */
        id?: string | null;
        /**
         * The activity this comment replied to.
         */
        inReplyTo?: Array<{
            id?: string;
            url?: string;
        }> | null;
        /**
         * Identifies this resource as a comment. Value: &quot;plus#comment&quot;.
         */
        kind?: string | null;
        /**
         * The object of this comment.
         */
        object?: {
            content?: string;
            objectType?: string;
            originalContent?: string;
        } | null;
        /**
         * People who +1&#39;d this comment.
         */
        plusoners?: {
            totalItems?: number;
        } | null;
        /**
         * The time at which this comment was initially published. Formatted as an RFC 3339 timestamp.
         */
        published?: string | null;
        /**
         * Link to this comment resource.
         */
        selfLink?: string | null;
        /**
         * The time at which this comment was last updated. Formatted as an RFC 3339 timestamp.
         */
        updated?: string | null;
        /**
         * This comment&#39;s verb, indicating what action was performed. Possible values are:   - &quot;post&quot; - Publish content to the stream.
         */
        verb?: string | null;
    }
    export interface Schema$CommentFeed {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The ID of this collection of comments.
         */
        id?: string | null;
        /**
         * The comments in this page of results.
         */
        items?: Schema$Comment[];
        /**
         * Identifies this resource as a collection of comments. Value: &quot;plus#commentFeed&quot;.
         */
        kind?: string | null;
        /**
         * Link to the next page of activities.
         */
        nextLink?: string | null;
        /**
         * The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The title of this collection of comments.
         */
        title?: string | null;
        /**
         * The time at which this collection of comments was last updated. Formatted as an RFC 3339 timestamp.
         */
        updated?: string | null;
    }
    export interface Schema$PeopleFeed {
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The people in this page of results. Each item includes the id, displayName, image, and url for the person. To retrieve additional profile data, see the people.get method.
         */
        items?: Schema$Person[];
        /**
         * Identifies this resource as a collection of people. Value: &quot;plus#peopleFeed&quot;.
         */
        kind?: string | null;
        /**
         * The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * Link to this resource.
         */
        selfLink?: string | null;
        /**
         * The title of this collection of people.
         */
        title?: string | null;
        /**
         * The total number of people available in this list. The number of people in a response might be smaller due to paging. This might not be set for all collections.
         */
        totalItems?: number | null;
    }
    export interface Schema$Person {
        /**
         * A short biography for this person.
         */
        aboutMe?: string | null;
        /**
         * The age range of the person. Valid ranges are 17 or younger, 18 to 20, and 21 or older. Age is determined from the user&#39;s birthday using Western age reckoning.
         */
        ageRange?: {
            max?: number;
            min?: number;
        } | null;
        /**
         * The person&#39;s date of birth, represented as YYYY-MM-DD.
         */
        birthday?: string | null;
        /**
         * The &quot;bragging rights&quot; line of this person.
         */
        braggingRights?: string | null;
        /**
         * For followers who are visible, the number of people who have added this person or page to a circle.
         */
        circledByCount?: number | null;
        /**
         * The cover photo content.
         */
        cover?: {
            coverInfo?: {
                leftImageOffset?: number;
                topImageOffset?: number;
            };
            coverPhoto?: {
                height?: number;
                url?: string;
                width?: number;
            };
            layout?: string;
        } | null;
        /**
         * (this field is not currently used)
         */
        currentLocation?: string | null;
        /**
         * The name of this person, which is suitable for display.
         */
        displayName?: string | null;
        /**
         * The hosted domain name for the user&#39;s Google Apps account. For instance, example.com. The plus.profile.emails.read or email scope is needed to get this domain name.
         */
        domain?: string | null;
        /**
         * A list of email addresses that this person has, including their Google account email address, and the public verified email addresses on their Google+ profile. The plus.profile.emails.read scope is needed to retrieve these email addresses, or the email scope can be used to retrieve just the Google account email address.
         */
        emails?: Array<{
            type?: string;
            value?: string;
        }> | null;
        /**
         * ETag of this response for caching purposes.
         */
        etag?: string | null;
        /**
         * The person&#39;s gender. Possible values include, but are not limited to, the following values:   - &quot;male&quot; - Male gender.  - &quot;female&quot; - Female gender.  - &quot;other&quot; - Other.
         */
        gender?: string | null;
        /**
         * The ID of this person.
         */
        id?: string | null;
        /**
         * The representation of the person&#39;s profile photo.
         */
        image?: {
            isDefault?: boolean;
            url?: string;
        } | null;
        /**
         * Whether this user has signed up for Google+.
         */
        isPlusUser?: boolean | null;
        /**
         * Identifies this resource as a person. Value: &quot;plus#person&quot;.
         */
        kind?: string | null;
        /**
         * The user&#39;s preferred language for rendering.
         */
        language?: string | null;
        /**
         * An object representation of the individual components of a person&#39;s name.
         */
        name?: {
            familyName?: string;
            formatted?: string;
            givenName?: string;
            honorificPrefix?: string;
            honorificSuffix?: string;
            middleName?: string;
        } | null;
        /**
         * The nickname of this person.
         */
        nickname?: string | null;
        /**
         * Type of person within Google+. Possible values include, but are not limited to, the following values:   - &quot;person&quot; - represents an actual person.  - &quot;page&quot; - represents a page.
         */
        objectType?: string | null;
        /**
         * The occupation of this person.
         */
        occupation?: string | null;
        /**
         * A list of current or past organizations with which this person is associated.
         */
        organizations?: Array<{
            department?: string;
            description?: string;
            endDate?: string;
            location?: string;
            name?: string;
            primary?: boolean;
            startDate?: string;
            title?: string;
            type?: string;
        }> | null;
        /**
         * A list of places where this person has lived.
         */
        placesLived?: Array<{
            primary?: boolean;
            value?: string;
        }> | null;
        /**
         * If a Google+ Page, the number of people who have +1&#39;d this page.
         */
        plusOneCount?: number | null;
        /**
         * The person&#39;s relationship status. Possible values include, but are not limited to, the following values:   - &quot;single&quot; - Person is single.  - &quot;in_a_relationship&quot; - Person is in a relationship.  - &quot;engaged&quot; - Person is engaged.  - &quot;married&quot; - Person is married.  - &quot;its_complicated&quot; - The relationship is complicated.  - &quot;open_relationship&quot; - Person is in an open relationship.  - &quot;widowed&quot; - Person is widowed.  - &quot;in_domestic_partnership&quot; - Person is in a domestic partnership.  - &quot;in_civil_union&quot; - Person is in a civil union.
         */
        relationshipStatus?: string | null;
        /**
         * The person&#39;s skills.
         */
        skills?: string | null;
        /**
         * The brief description (tagline) of this person.
         */
        tagline?: string | null;
        /**
         * The URL of this person&#39;s profile.
         */
        url?: string | null;
        /**
         * A list of URLs for this person.
         */
        urls?: Array<{
            label?: string;
            type?: string;
            value?: string;
        }> | null;
        /**
         * Whether the person or Google+ Page has been verified.
         */
        verified?: boolean | null;
    }
    export interface Schema$Place {
        /**
         * The physical address of the place.
         */
        address?: {
            formatted?: string;
        } | null;
        /**
         * The display name of the place.
         */
        displayName?: string | null;
        /**
         * The id of the place.
         */
        id?: string | null;
        /**
         * Identifies this resource as a place. Value: &quot;plus#place&quot;.
         */
        kind?: string | null;
        /**
         * The position of the place.
         */
        position?: {
            latitude?: number;
            longitude?: number;
        } | null;
    }
    export interface Schema$PlusAclentryResource {
        /**
         * A descriptive name for this entry. Suitable for display.
         */
        displayName?: string | null;
        /**
         * The ID of the entry. For entries of type &quot;person&quot; or &quot;circle&quot;, this is the ID of the resource. For other types, this property is not set.
         */
        id?: string | null;
        /**
         * The type of entry describing to whom access is granted. Possible values are:   - &quot;person&quot; - Access to an individual.  - &quot;circle&quot; - Access to members of a circle.  - &quot;myCircles&quot; - Access to members of all the person&#39;s circles.  - &quot;extendedCircles&quot; - Access to members of all the person&#39;s circles, plus all of the people in their circles.  - &quot;domain&quot; - Access to members of the person&#39;s Google Apps domain.  - &quot;public&quot; - Access to anyone on the web.
         */
        type?: string | null;
    }
    export class Resource$Activities {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * plus.activities.get
         * @desc Shut down. See https://developers.google.com/+/api-shutdown for more details.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.activities.get({
         *     // The ID of the activity to get.
         *     activityId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "access": {},
         *   //   "actor": {},
         *   //   "address": "my_address",
         *   //   "annotation": "my_annotation",
         *   //   "crosspostSource": "my_crosspostSource",
         *   //   "etag": "my_etag",
         *   //   "geocode": "my_geocode",
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "location": {},
         *   //   "object": {},
         *   //   "placeId": "my_placeId",
         *   //   "placeName": "my_placeName",
         *   //   "provider": {},
         *   //   "published": "my_published",
         *   //   "radius": "my_radius",
         *   //   "title": "my_title",
         *   //   "updated": "my_updated",
         *   //   "url": "my_url",
         *   //   "verb": "my_verb"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.activities.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.activityId The ID of the activity to get.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Activities$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Activities$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Activity>>;
        get(params: Params$Resource$Activities$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Activities$Get, options: MethodOptions | BodyResponseCallback<Schema$Activity>, callback: BodyResponseCallback<Schema$Activity>): void;
        get(params: Params$Resource$Activities$Get, callback: BodyResponseCallback<Schema$Activity>): void;
        get(callback: BodyResponseCallback<Schema$Activity>): void;
        /**
         * plus.activities.list
         * @desc Shut down. See https://developers.google.com/+/api-shutdown for more details.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.activities.list({
         *     // The collection of activities to list.
         *     collection: 'placeholder-value',
         *     // The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         *     maxResults: 'placeholder-value',
         *     // The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         *     pageToken: 'placeholder-value',
         *     // The ID of the user to get activities for. The special value "me" can be used to indicate the authenticated user.
         *     userId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextLink": "my_nextLink",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "selfLink": "my_selfLink",
         *   //   "title": "my_title",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.activities.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.collection The collection of activities to list.
         * @param {integer=} params.maxResults The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         * @param {string} params.userId The ID of the user to get activities for. The special value "me" can be used to indicate the authenticated user.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Activities$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Activities$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ActivityFeed>>;
        list(params: Params$Resource$Activities$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Activities$List, options: MethodOptions | BodyResponseCallback<Schema$ActivityFeed>, callback: BodyResponseCallback<Schema$ActivityFeed>): void;
        list(params: Params$Resource$Activities$List, callback: BodyResponseCallback<Schema$ActivityFeed>): void;
        list(callback: BodyResponseCallback<Schema$ActivityFeed>): void;
        /**
         * plus.activities.search
         * @desc Shut down. See https://developers.google.com/+/api-shutdown for more details.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.activities.search({
         *     // Specify the preferred language to search with. See search language codes for available values.
         *     language: 'placeholder-value',
         *     // The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         *     maxResults: 'placeholder-value',
         *     // Specifies how to order search results.
         *     orderBy: 'placeholder-value',
         *     // The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
         *     pageToken: 'placeholder-value',
         *     // Full-text search query string.
         *     query: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextLink": "my_nextLink",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "selfLink": "my_selfLink",
         *   //   "title": "my_title",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.activities.search
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.language Specify the preferred language to search with. See search language codes for available values.
         * @param {integer=} params.maxResults The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         * @param {string=} params.orderBy Specifies how to order search results.
         * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
         * @param {string} params.query Full-text search query string.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        search(params: Params$Resource$Activities$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Activities$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ActivityFeed>>;
        search(params: Params$Resource$Activities$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Activities$Search, options: MethodOptions | BodyResponseCallback<Schema$ActivityFeed>, callback: BodyResponseCallback<Schema$ActivityFeed>): void;
        search(params: Params$Resource$Activities$Search, callback: BodyResponseCallback<Schema$ActivityFeed>): void;
        search(callback: BodyResponseCallback<Schema$ActivityFeed>): void;
    }
    export interface Params$Resource$Activities$Get extends StandardParameters {
        /**
         * The ID of the activity to get.
         */
        activityId?: string;
    }
    export interface Params$Resource$Activities$List extends StandardParameters {
        /**
         * The collection of activities to list.
         */
        collection?: string;
        /**
         * The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         */
        maxResults?: number;
        /**
         * The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
        /**
         * The ID of the user to get activities for. The special value "me" can be used to indicate the authenticated user.
         */
        userId?: string;
    }
    export interface Params$Resource$Activities$Search extends StandardParameters {
        /**
         * Specify the preferred language to search with. See search language codes for available values.
         */
        language?: string;
        /**
         * The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         */
        maxResults?: number;
        /**
         * Specifies how to order search results.
         */
        orderBy?: string;
        /**
         * The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
         */
        pageToken?: string;
        /**
         * Full-text search query string.
         */
        query?: string;
    }
    export class Resource$Comments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * plus.comments.get
         * @desc Shut down. See https://developers.google.com/+/api-shutdown for more details.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.comments.get({
         *     // The ID of the comment to get.
         *     commentId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "actor": {},
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "inReplyTo": [],
         *   //   "kind": "my_kind",
         *   //   "object": {},
         *   //   "plusoners": {},
         *   //   "published": "my_published",
         *   //   "selfLink": "my_selfLink",
         *   //   "updated": "my_updated",
         *   //   "verb": "my_verb"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.comments.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.commentId The ID of the comment to get.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Comments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Comments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Comment>>;
        get(params: Params$Resource$Comments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Comments$Get, options: MethodOptions | BodyResponseCallback<Schema$Comment>, callback: BodyResponseCallback<Schema$Comment>): void;
        get(params: Params$Resource$Comments$Get, callback: BodyResponseCallback<Schema$Comment>): void;
        get(callback: BodyResponseCallback<Schema$Comment>): void;
        /**
         * plus.comments.list
         * @desc Shut down. See https://developers.google.com/+/api-shutdown for more details.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.comments.list({
         *     // The ID of the activity to get comments for.
         *     activityId: 'placeholder-value',
         *     // The maximum number of comments to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         *     maxResults: 'placeholder-value',
         *     // The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         *     pageToken: 'placeholder-value',
         *     // The order in which to sort the list of comments.
         *     sortOrder: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "etag": "my_etag",
         *   //   "id": "my_id",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextLink": "my_nextLink",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "title": "my_title",
         *   //   "updated": "my_updated"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.comments.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.activityId The ID of the activity to get comments for.
         * @param {integer=} params.maxResults The maximum number of comments to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         * @param {string=} params.sortOrder The order in which to sort the list of comments.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Comments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Comments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CommentFeed>>;
        list(params: Params$Resource$Comments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Comments$List, options: MethodOptions | BodyResponseCallback<Schema$CommentFeed>, callback: BodyResponseCallback<Schema$CommentFeed>): void;
        list(params: Params$Resource$Comments$List, callback: BodyResponseCallback<Schema$CommentFeed>): void;
        list(callback: BodyResponseCallback<Schema$CommentFeed>): void;
    }
    export interface Params$Resource$Comments$Get extends StandardParameters {
        /**
         * The ID of the comment to get.
         */
        commentId?: string;
    }
    export interface Params$Resource$Comments$List extends StandardParameters {
        /**
         * The ID of the activity to get comments for.
         */
        activityId?: string;
        /**
         * The maximum number of comments to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         */
        maxResults?: number;
        /**
         * The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
        /**
         * The order in which to sort the list of comments.
         */
        sortOrder?: string;
    }
    export class Resource$People {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * plus.people.get
         * @desc Get a person's profile. If your app uses scope https://www.googleapis.com/auth/plus.login, this method is guaranteed to return ageRange and language.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *       'https://www.googleapis.com/auth/userinfo.email',
         *       'https://www.googleapis.com/auth/userinfo.profile',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.people.get({
         *     // The ID of the person to get the profile for. The special value "me" can be used to indicate the authenticated user.
         *     userId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "aboutMe": "my_aboutMe",
         *   //   "ageRange": {},
         *   //   "birthday": "my_birthday",
         *   //   "braggingRights": "my_braggingRights",
         *   //   "circledByCount": 0,
         *   //   "cover": {},
         *   //   "currentLocation": "my_currentLocation",
         *   //   "displayName": "my_displayName",
         *   //   "domain": "my_domain",
         *   //   "emails": [],
         *   //   "etag": "my_etag",
         *   //   "gender": "my_gender",
         *   //   "id": "my_id",
         *   //   "image": {},
         *   //   "isPlusUser": false,
         *   //   "kind": "my_kind",
         *   //   "language": "my_language",
         *   //   "name": {},
         *   //   "nickname": "my_nickname",
         *   //   "objectType": "my_objectType",
         *   //   "occupation": "my_occupation",
         *   //   "organizations": [],
         *   //   "placesLived": [],
         *   //   "plusOneCount": 0,
         *   //   "relationshipStatus": "my_relationshipStatus",
         *   //   "skills": "my_skills",
         *   //   "tagline": "my_tagline",
         *   //   "url": "my_url",
         *   //   "urls": [],
         *   //   "verified": false
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.people.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.userId The ID of the person to get the profile for. The special value "me" can be used to indicate the authenticated user.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$People$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$People$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Person>>;
        get(params: Params$Resource$People$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$People$Get, options: MethodOptions | BodyResponseCallback<Schema$Person>, callback: BodyResponseCallback<Schema$Person>): void;
        get(params: Params$Resource$People$Get, callback: BodyResponseCallback<Schema$Person>): void;
        get(callback: BodyResponseCallback<Schema$Person>): void;
        /**
         * plus.people.list
         * @desc List all of the people in the specified collection.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.people.list({
         *     // The collection of people to list.
         *     collection: 'placeholder-value',
         *     // The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         *     maxResults: 'placeholder-value',
         *     // The order to return people in.
         *     orderBy: 'placeholder-value',
         *     // The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         *     pageToken: 'placeholder-value',
         *     // Get the collection of people for the person identified. Use "me" to indicate the authenticated user.
         *     userId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "etag": "my_etag",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "selfLink": "my_selfLink",
         *   //   "title": "my_title",
         *   //   "totalItems": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.people.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.collection The collection of people to list.
         * @param {integer=} params.maxResults The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         * @param {string=} params.orderBy The order to return people in.
         * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         * @param {string} params.userId Get the collection of people for the person identified. Use "me" to indicate the authenticated user.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$People$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$People$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PeopleFeed>>;
        list(params: Params$Resource$People$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$People$List, options: MethodOptions | BodyResponseCallback<Schema$PeopleFeed>, callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        list(params: Params$Resource$People$List, callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        list(callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        /**
         * plus.people.listByActivity
         * @desc Shut down. See https://developers.google.com/+/api-shutdown for more details.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.people.listByActivity({
         *     // The ID of the activity to get the list of people for.
         *     activityId: 'placeholder-value',
         *     // The collection of people to list.
         *     collection: 'placeholder-value',
         *     // The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         *     maxResults: 'placeholder-value',
         *     // The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "etag": "my_etag",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "selfLink": "my_selfLink",
         *   //   "title": "my_title",
         *   //   "totalItems": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.people.listByActivity
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.activityId The ID of the activity to get the list of people for.
         * @param {string} params.collection The collection of people to list.
         * @param {integer=} params.maxResults The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        listByActivity(params: Params$Resource$People$Listbyactivity, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listByActivity(params?: Params$Resource$People$Listbyactivity, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PeopleFeed>>;
        listByActivity(params: Params$Resource$People$Listbyactivity, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listByActivity(params: Params$Resource$People$Listbyactivity, options: MethodOptions | BodyResponseCallback<Schema$PeopleFeed>, callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        listByActivity(params: Params$Resource$People$Listbyactivity, callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        listByActivity(callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        /**
         * plus.people.search
         * @desc Shut down. See https://developers.google.com/+/api-shutdown for more details.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/plus.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const plus = google.plus('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/plus.login',
         *       'https://www.googleapis.com/auth/plus.me',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await plus.people.search({
         *     // Specify the preferred language to search with. See search language codes for available values.
         *     language: 'placeholder-value',
         *     // The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         *     maxResults: 'placeholder-value',
         *     // The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
         *     pageToken: 'placeholder-value',
         *     // Specify a query string for full text search of public text in all profiles.
         *     query: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "etag": "my_etag",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "selfLink": "my_selfLink",
         *   //   "title": "my_title",
         *   //   "totalItems": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias plus.people.search
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.language Specify the preferred language to search with. See search language codes for available values.
         * @param {integer=} params.maxResults The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
         * @param {string} params.query Specify a query string for full text search of public text in all profiles.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        search(params: Params$Resource$People$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$People$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PeopleFeed>>;
        search(params: Params$Resource$People$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$People$Search, options: MethodOptions | BodyResponseCallback<Schema$PeopleFeed>, callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        search(params: Params$Resource$People$Search, callback: BodyResponseCallback<Schema$PeopleFeed>): void;
        search(callback: BodyResponseCallback<Schema$PeopleFeed>): void;
    }
    export interface Params$Resource$People$Get extends StandardParameters {
        /**
         * The ID of the person to get the profile for. The special value "me" can be used to indicate the authenticated user.
         */
        userId?: string;
    }
    export interface Params$Resource$People$List extends StandardParameters {
        /**
         * The collection of people to list.
         */
        collection?: string;
        /**
         * The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         */
        maxResults?: number;
        /**
         * The order to return people in.
         */
        orderBy?: string;
        /**
         * The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
        /**
         * Get the collection of people for the person identified. Use "me" to indicate the authenticated user.
         */
        userId?: string;
    }
    export interface Params$Resource$People$Listbyactivity extends StandardParameters {
        /**
         * The ID of the activity to get the list of people for.
         */
        activityId?: string;
        /**
         * The collection of people to list.
         */
        collection?: string;
        /**
         * The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         */
        maxResults?: number;
        /**
         * The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
         */
        pageToken?: string;
    }
    export interface Params$Resource$People$Search extends StandardParameters {
        /**
         * Specify the preferred language to search with. See search language codes for available values.
         */
        language?: string;
        /**
         * The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
         */
        maxResults?: number;
        /**
         * The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
         */
        pageToken?: string;
        /**
         * Specify a query string for full text search of public text in all profiles.
         */
        query?: string;
    }
    export {};
}
