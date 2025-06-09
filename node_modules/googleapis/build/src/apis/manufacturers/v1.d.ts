import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace manufacturers_v1 {
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
     * Manufacturer Center API
     *
     * Public API for managing Manufacturer Center related data.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const manufacturers = google.manufacturers('v1');
     * ```
     */
    export class Manufacturers {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Attributes of the product. For more information, see https://support.google.com/manufacturers/answer/6124116.
     */
    export interface Schema$Attributes {
        /**
         * The additional images of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#addlimage.
         */
        additionalImageLink?: Schema$Image[];
        /**
         * The target age group of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#agegroup.
         */
        ageGroup?: string | null;
        /**
         * The brand name of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#brand.
         */
        brand?: string | null;
        /**
         * The capacity of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#capacity.
         */
        capacity?: Schema$Capacity;
        /**
         * Optional. List of certifications claimed by this product.
         */
        certification?: Schema$GoogleShoppingManufacturersV1ProductCertification[];
        /**
         * The color of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#color.
         */
        color?: string | null;
        /**
         * The count of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#count.
         */
        count?: Schema$Count;
        /**
         * The description of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#description.
         */
        description?: string | null;
        /**
         * The disclosure date of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#disclosure.
         */
        disclosureDate?: string | null;
        /**
         * A list of excluded destinations such as "ClientExport", "ClientShoppingCatalog" or "PartnerShoppingCatalog". For more information, see https://support.google.com/manufacturers/answer/7443550
         */
        excludedDestination?: string[] | null;
        /**
         * The rich format description of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#featuredesc.
         */
        featureDescription?: Schema$FeatureDescription[];
        /**
         * The flavor of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#flavor.
         */
        flavor?: string | null;
        /**
         * The format of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#format.
         */
        format?: string | null;
        /**
         * The target gender of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#gender.
         */
        gender?: string | null;
        /**
         * Grocery Attributes. See more at https://support.google.com/manufacturers/answer/12098458#grocery.
         */
        grocery?: Schema$Grocery;
        /**
         * The Global Trade Item Number (GTIN) of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#gtin.
         */
        gtin?: string[] | null;
        /**
         * The image of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#image.
         */
        imageLink?: Schema$Image;
        /**
         * A list of included destinations such as "ClientExport", "ClientShoppingCatalog" or "PartnerShoppingCatalog". For more information, see https://support.google.com/manufacturers/answer/7443550
         */
        includedDestination?: string[] | null;
        /**
         * Optional. List of countries to show this product in. Countries provided in this attribute will override any of the countries configured at feed level. The values should be: the [CLDR territory code](http://www.unicode.org/repos/cldr/tags/latest/common/main/en.xml) of the countries in which this item will be shown.
         */
        intendedCountry?: string[] | null;
        /**
         * The item group id of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#itemgroupid.
         */
        itemGroupId?: string | null;
        /**
         * The material of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#material.
         */
        material?: string | null;
        /**
         * The Manufacturer Part Number (MPN) of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#mpn.
         */
        mpn?: string | null;
        /**
         * Nutrition Attributes. See more at https://support.google.com/manufacturers/answer/12098458#food-servings.
         */
        nutrition?: Schema$Nutrition;
        /**
         * The pattern of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#pattern.
         */
        pattern?: string | null;
        /**
         * The details of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#productdetail.
         */
        productDetail?: Schema$ProductDetail[];
        /**
         * The product highlights. For more information, see https://support.google.com/manufacturers/answer/10066942
         */
        productHighlight?: string[] | null;
        /**
         * The name of the group of products related to the product. For more information, see https://support.google.com/manufacturers/answer/6124116#productline.
         */
        productLine?: string | null;
        /**
         * The canonical name of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#productname.
         */
        productName?: string | null;
        /**
         * The URL of the detail page of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#productpage.
         */
        productPageUrl?: string | null;
        /**
         * The type or category of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#producttype.
         */
        productType?: string[] | null;
        /**
         * The release date of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#release.
         */
        releaseDate?: string | null;
        /**
         * Rich product content. For more information, see https://support.google.com/manufacturers/answer/9389865
         */
        richProductContent?: string[] | null;
        /**
         * The scent of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#scent.
         */
        scent?: string | null;
        /**
         * The size of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#size.
         */
        size?: string | null;
        /**
         * The size system of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#sizesystem.
         */
        sizeSystem?: string | null;
        /**
         * The size type of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#sizetype.
         */
        sizeType?: string[] | null;
        /**
         * The suggested retail price (MSRP) of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#price.
         */
        suggestedRetailPrice?: Schema$Price;
        /**
         * The target client id. Should only be used in the accounts of the data partners. For more information, see https://support.google.com/manufacturers/answer/10857344
         */
        targetClientId?: string | null;
        /**
         * The theme of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#theme.
         */
        theme?: string | null;
        /**
         * The title of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#title.
         */
        title?: string | null;
        /**
         * The videos of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#video.
         */
        videoLink?: string[] | null;
        /**
         * Virtual Model (3d) asset link.
         */
        virtualModelLink?: string | null;
    }
    /**
     * The capacity of a product. For more information, see https://support.google.com/manufacturers/answer/6124116#capacity.
     */
    export interface Schema$Capacity {
        /**
         * The unit of the capacity, i.e., MB, GB, or TB.
         */
        unit?: string | null;
        /**
         * The numeric value of the capacity.
         */
        value?: string | null;
    }
    /**
     * Description of a certification.
     */
    export interface Schema$Certification {
        /**
         * Required. Name of the certification body.
         */
        authority?: string | null;
        /**
         * Required. A unique code to identify the certification.
         */
        code?: string | null;
        /**
         * Optional. A URL link to the certification.
         */
        link?: string | null;
        /**
         * Optional. A URL link to the certification logo.
         */
        logo?: string | null;
        /**
         * Required. Name of the certification.
         */
        name?: string | null;
        /**
         * Optional. The expiration date (UTC).
         */
        validUntil?: string | null;
        /**
         * Optional. A custom value of the certification.
         */
        value?: string | null;
    }
    /**
     * The number of products in a single package. For more information, see https://support.google.com/manufacturers/answer/6124116#count.
     */
    export interface Schema$Count {
        /**
         * The unit in which these products are counted.
         */
        unit?: string | null;
        /**
         * The numeric value of the number of products in a package.
         */
        value?: string | null;
    }
    /**
     * The destination status.
     */
    export interface Schema$DestinationStatus {
        /**
         * Output only. List of country codes (ISO 3166-1 alpha-2) where the offer is approved.
         */
        approvedCountries?: string[] | null;
        /**
         * The name of the destination.
         */
        destination?: string | null;
        /**
         * Output only. List of country codes (ISO 3166-1 alpha-2) where the offer is disapproved.
         */
        disapprovedCountries?: string[] | null;
        /**
         * Output only. List of country codes (ISO 3166-1 alpha-2) where the offer is pending approval.
         */
        pendingCountries?: string[] | null;
        /**
         * The status of the destination.
         */
        status?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * A feature description of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#featuredesc.
     */
    export interface Schema$FeatureDescription {
        /**
         * A short description of the feature.
         */
        headline?: string | null;
        /**
         * An optional image describing the feature.
         */
        image?: Schema$Image;
        /**
         * A detailed description of the feature.
         */
        text?: string | null;
    }
    /**
     * Combination of float amount and unit.
     */
    export interface Schema$FloatUnit {
        /**
         * amount.
         */
        amount?: number | null;
        /**
         * unit.
         */
        unit?: string | null;
    }
    /**
     * Description of a certification.
     */
    export interface Schema$GoogleShoppingManufacturersV1ProductCertification {
        /**
         * Required. Name of the certification body.
         */
        authority?: string | null;
        /**
         * Required. A unique code to identify the certification.
         */
        code?: string | null;
        /**
         * Required. Name of the certification.
         */
        name?: string | null;
    }
    export interface Schema$Grocery {
        /**
         * Active ingredients.
         */
        activeIngredients?: string | null;
        /**
         * Alcohol by volume.
         */
        alcoholByVolume?: number | null;
        /**
         * Allergens.
         */
        allergens?: string | null;
        /**
         * Derived nutrition claim.
         */
        derivedNutritionClaim?: string[] | null;
        /**
         * Directions.
         */
        directions?: string | null;
        /**
         * Indications.
         */
        indications?: string | null;
        /**
         * Ingredients.
         */
        ingredients?: string | null;
        /**
         * Nutrition claim.
         */
        nutritionClaim?: string[] | null;
        /**
         * Storage instructions.
         */
        storageInstructions?: string | null;
    }
    /**
     * An image.
     */
    export interface Schema$Image {
        /**
         * The URL of the image. For crawled images, this is the provided URL. For uploaded images, this is a serving URL from Google if the image has been processed successfully.
         */
        imageUrl?: string | null;
        /**
         * The status of the image. @OutputOnly
         */
        status?: string | null;
        /**
         * The type of the image, i.e., crawled or uploaded. @OutputOnly
         */
        type?: string | null;
    }
    /**
     * Product issue.
     */
    export interface Schema$Issue {
        /**
         * Output only. List of country codes (ISO 3166-1 alpha-2) where issue applies to the manufacturer product.
         */
        applicableCountries?: string[] | null;
        /**
         * If present, the attribute that triggered the issue. For more information about attributes, see https://support.google.com/manufacturers/answer/6124116.
         */
        attribute?: string | null;
        /**
         * Longer description of the issue focused on how to resolve it.
         */
        description?: string | null;
        /**
         * The destination this issue applies to.
         */
        destination?: string | null;
        /**
         * What needs to happen to resolve the issue.
         */
        resolution?: string | null;
        /**
         * The severity of the issue.
         */
        severity?: string | null;
        /**
         * The timestamp when this issue appeared.
         */
        timestamp?: string | null;
        /**
         * Short title describing the nature of the issue.
         */
        title?: string | null;
        /**
         * The server-generated type of the issue, for example, “INCORRECT_TEXT_FORMATTING”, “IMAGE_NOT_SERVEABLE”, etc.
         */
        type?: string | null;
    }
    /**
     * Response for ListProductCertifications method.
     */
    export interface Schema$ListProductCertificationsResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The product certifications from the specified certification body.
         */
        productCertifications?: Schema$ProductCertification[];
    }
    export interface Schema$ListProductsResponse {
        /**
         * The token for the retrieval of the next page of product statuses.
         */
        nextPageToken?: string | null;
        /**
         * List of the products.
         */
        products?: Schema$Product[];
    }
    export interface Schema$Nutrition {
        /**
         * Added sugars.
         */
        addedSugars?: Schema$FloatUnit;
        /**
         * Added sugars daily percentage.
         */
        addedSugarsDailyPercentage?: number | null;
        /**
         * Calcium.
         */
        calcium?: Schema$FloatUnit;
        /**
         * Calcium daily percentage.
         */
        calciumDailyPercentage?: number | null;
        /**
         * Cholesterol.
         */
        cholesterol?: Schema$FloatUnit;
        /**
         * Cholesterol daily percentage.
         */
        cholesterolDailyPercentage?: number | null;
        /**
         * Dietary fiber.
         */
        dietaryFiber?: Schema$FloatUnit;
        /**
         * Dietary fiber daily percentage.
         */
        dietaryFiberDailyPercentage?: number | null;
        /**
         * Mandatory Nutrition Facts. Energy.
         */
        energy?: Schema$FloatUnit;
        /**
         * Energy from fat.
         */
        energyFromFat?: Schema$FloatUnit;
        /**
         * Folate daily percentage.
         */
        folateDailyPercentage?: number | null;
        /**
         * Folate folic acid.
         */
        folateFolicAcid?: Schema$FloatUnit;
        /**
         * Folate mcg DFE.
         */
        folateMcgDfe?: number | null;
        /**
         * Iron.
         */
        iron?: Schema$FloatUnit;
        /**
         * Iron daily percentage.
         */
        ironDailyPercentage?: number | null;
        /**
         * Monounsaturated fat.
         */
        monounsaturatedFat?: Schema$FloatUnit;
        /**
         * Nutrition fact measure.
         */
        nutritionFactMeasure?: string | null;
        /**
         * Polyols.
         */
        polyols?: Schema$FloatUnit;
        /**
         * Polyunsaturated fat.
         */
        polyunsaturatedFat?: Schema$FloatUnit;
        /**
         * Potassium.
         */
        potassium?: Schema$FloatUnit;
        /**
         * Potassium daily percentage.
         */
        potassiumDailyPercentage?: number | null;
        /**
         * Prepared size description.
         */
        preparedSizeDescription?: string | null;
        /**
         * Protein.
         */
        protein?: Schema$FloatUnit;
        /**
         * Protein daily percentage.
         */
        proteinDailyPercentage?: number | null;
        /**
         * Saturated fat.
         */
        saturatedFat?: Schema$FloatUnit;
        /**
         * Saturated fat daily percentage.
         */
        saturatedFatDailyPercentage?: number | null;
        /**
         * Food Serving Size. Serving size description.
         */
        servingSizeDescription?: string | null;
        /**
         * Serving size measure.
         */
        servingSizeMeasure?: Schema$FloatUnit;
        /**
         * Servings per container.
         */
        servingsPerContainer?: string | null;
        /**
         * Sodium.
         */
        sodium?: Schema$FloatUnit;
        /**
         * Sodium daily percentage.
         */
        sodiumDailyPercentage?: number | null;
        /**
         * Starch.
         */
        starch?: Schema$FloatUnit;
        /**
         * Total carbohydrate.
         */
        totalCarbohydrate?: Schema$FloatUnit;
        /**
         * Total carbohydrate daily percentage.
         */
        totalCarbohydrateDailyPercentage?: number | null;
        /**
         * Total fat.
         */
        totalFat?: Schema$FloatUnit;
        /**
         * Total fat daily percentage.
         */
        totalFatDailyPercentage?: number | null;
        /**
         * Total sugars.
         */
        totalSugars?: Schema$FloatUnit;
        /**
         * Total sugars daily percentage.
         */
        totalSugarsDailyPercentage?: number | null;
        /**
         * Trans fat.
         */
        transFat?: Schema$FloatUnit;
        /**
         * Trans fat daily percentage.
         */
        transFatDailyPercentage?: number | null;
        /**
         * Vitamin D.
         */
        vitaminD?: Schema$FloatUnit;
        /**
         * Vitamin D daily percentage.
         */
        vitaminDDailyPercentage?: number | null;
        /**
         * Voluntary nutrition fact.
         */
        voluntaryNutritionFact?: Schema$VoluntaryNutritionFact[];
    }
    /**
     * A price.
     */
    export interface Schema$Price {
        /**
         * The numeric value of the price.
         */
        amount?: string | null;
        /**
         * The currency in which the price is denoted.
         */
        currency?: string | null;
    }
    /**
     * Product data.
     */
    export interface Schema$Product {
        /**
         * Attributes of the product uploaded to the Manufacturer Center. Manually edited attributes are taken into account.
         */
        attributes?: Schema$Attributes;
        /**
         * The content language of the product as a two-letter ISO 639-1 language code (for example, en).
         */
        contentLanguage?: string | null;
        /**
         * The status of the destinations.
         */
        destinationStatuses?: Schema$DestinationStatus[];
        /**
         * Optional. The feed label for the product.
         */
        feedLabel?: string | null;
        /**
         * A server-generated list of issues associated with the product.
         */
        issues?: Schema$Issue[];
        /**
         * Name in the format `{target_country\}:{content_language\}:{product_id\}`. `target_country` - The target country of the product as a CLDR territory code (for example, US). `content_language` - The content language of the product as a two-letter ISO 639-1 language code (for example, en). `product_id` - The ID of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#id.
         */
        name?: string | null;
        /**
         * Parent ID in the format `accounts/{account_id\}`. `account_id` - The ID of the Manufacturer Center account.
         */
        parent?: string | null;
        /**
         * The ID of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#id.
         */
        productId?: string | null;
        /**
         * The target country of the product as a CLDR territory code (for example, US).
         */
        targetCountry?: string | null;
    }
    /**
     * Product certification data.
     */
    export interface Schema$ProductCertification {
        /**
         * Required. This is the product's brand name. The brand is used to help identify your product.
         */
        brand?: string | null;
        /**
         * Required. A list of certifications to link to the described product.
         */
        certification?: Schema$Certification[];
        /**
         * Optional. A 2-letter country code (ISO 3166-1 Alpha 2).
         */
        countryCode?: string[] | null;
        /**
         * Output only. The statuses of the destinations.
         */
        destinationStatuses?: Schema$DestinationStatus[];
        /**
         * Output only. A server-generated list of issues associated with the product.
         */
        issues?: Schema$Issue[];
        /**
         * Optional. These are the Manufacturer Part Numbers (MPN). MPNs are used to uniquely identify a specific product among all products from the same manufacturer
         */
        mpn?: string[] | null;
        /**
         * Required. The unique name identifier of a product certification Format: accounts/{account\}/languages/{language_code\}/productCertifications/{id\} Where `id` is a some unique identifier and `language_code` is a 2-letter ISO 639-1 code of a Shopping supported language according to https://support.google.com/merchants/answer/160637.
         */
        name?: string | null;
        /**
         * Optional. Another name for GTIN.
         */
        productCode?: string[] | null;
        /**
         * Optional. These are your own product categorization system in your product data.
         */
        productType?: string[] | null;
        /**
         * Required. This is to clearly identify the product you are certifying.
         */
        title?: string | null;
    }
    /**
     * A product detail of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#productdetail.
     */
    export interface Schema$ProductDetail {
        /**
         * The name of the attribute.
         */
        attributeName?: string | null;
        /**
         * The value of the attribute.
         */
        attributeValue?: string | null;
        /**
         * A short section name that can be reused between multiple product details.
         */
        sectionName?: string | null;
    }
    /**
     * Voluntary Nutrition Facts.
     */
    export interface Schema$VoluntaryNutritionFact {
        /**
         * Daily percentage.
         */
        dailyPercentage?: number | null;
        /**
         * Name.
         */
        name?: string | null;
        /**
         * Value.
         */
        value?: Schema$FloatUnit;
    }
    export class Resource$Accounts {
        context: APIRequestContext;
        languages: Resource$Accounts$Languages;
        products: Resource$Accounts$Products;
        constructor(context: APIRequestContext);
    }
    export class Resource$Accounts$Languages {
        context: APIRequestContext;
        productCertifications: Resource$Accounts$Languages$Productcertifications;
        constructor(context: APIRequestContext);
    }
    export class Resource$Accounts$Languages$Productcertifications {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a product certification by its name. This method can only be called by certification bodies.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Languages$Productcertifications$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Languages$Productcertifications$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Accounts$Languages$Productcertifications$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Languages$Productcertifications$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Accounts$Languages$Productcertifications$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a product certification by its name. This method can only be called by certification bodies.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Languages$Productcertifications$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Languages$Productcertifications$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductCertification>>;
        get(params: Params$Resource$Accounts$Languages$Productcertifications$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Languages$Productcertifications$Get, options: MethodOptions | BodyResponseCallback<Schema$ProductCertification>, callback: BodyResponseCallback<Schema$ProductCertification>): void;
        get(params: Params$Resource$Accounts$Languages$Productcertifications$Get, callback: BodyResponseCallback<Schema$ProductCertification>): void;
        get(callback: BodyResponseCallback<Schema$ProductCertification>): void;
        /**
         * Lists product certifications from a specified certification body. This method can only be called by certification bodies.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Languages$Productcertifications$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Languages$Productcertifications$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListProductCertificationsResponse>>;
        list(params: Params$Resource$Accounts$Languages$Productcertifications$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Languages$Productcertifications$List, options: MethodOptions | BodyResponseCallback<Schema$ListProductCertificationsResponse>, callback: BodyResponseCallback<Schema$ListProductCertificationsResponse>): void;
        list(params: Params$Resource$Accounts$Languages$Productcertifications$List, callback: BodyResponseCallback<Schema$ListProductCertificationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListProductCertificationsResponse>): void;
        /**
         * Updates (or creates if allow_missing = true) a product certification which links certifications with products. This method can only be called by certification bodies.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Accounts$Languages$Productcertifications$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Accounts$Languages$Productcertifications$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductCertification>>;
        patch(params: Params$Resource$Accounts$Languages$Productcertifications$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Accounts$Languages$Productcertifications$Patch, options: MethodOptions | BodyResponseCallback<Schema$ProductCertification>, callback: BodyResponseCallback<Schema$ProductCertification>): void;
        patch(params: Params$Resource$Accounts$Languages$Productcertifications$Patch, callback: BodyResponseCallback<Schema$ProductCertification>): void;
        patch(callback: BodyResponseCallback<Schema$ProductCertification>): void;
    }
    export interface Params$Resource$Accounts$Languages$Productcertifications$Delete extends StandardParameters {
        /**
         * Required. The name of the product certification to delete. Format: accounts/{account\}/languages/{language_code\}/productCertifications/{id\}
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Languages$Productcertifications$Get extends StandardParameters {
        /**
         * Required. The name of the product certification to get. Format: accounts/{account\}/languages/{language_code\}/productCertifications/{id\}
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Languages$Productcertifications$List extends StandardParameters {
        /**
         * Optional. The maximum number of product certifications to return. The service may return fewer than this value. If unspecified, at most 50 product certifications will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListProductCertifications` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListProductCertifications` must match the call that provided the page token. Required if requesting the second or higher page.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of product certifications. Format: accounts/{account\}/languages/{language_code\}
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Languages$Productcertifications$Patch extends StandardParameters {
        /**
         * Required. The unique name identifier of a product certification Format: accounts/{account\}/languages/{language_code\}/productCertifications/{id\} Where `id` is a some unique identifier and `language_code` is a 2-letter ISO 639-1 code of a Shopping supported language according to https://support.google.com/merchants/answer/160637.
         */
        name?: string;
        /**
         * Optional. The list of fields to update according to aip.dev/134. However, only full update is supported as of right now. Therefore, it can be either ignored or set to "*". Setting any other values will returns UNIMPLEMENTED error.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ProductCertification;
    }
    export class Resource$Accounts$Products {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes the product from a Manufacturer Center account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Products$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Products$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Accounts$Products$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Products$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Accounts$Products$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the product from a Manufacturer Center account, including product issues. A recently updated product takes around 15 minutes to process. Changes are only visible after it has been processed. While some issues may be available once the product has been processed, other issues may take days to appear.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Products$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Products$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Product>>;
        get(params: Params$Resource$Accounts$Products$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Products$Get, options: MethodOptions | BodyResponseCallback<Schema$Product>, callback: BodyResponseCallback<Schema$Product>): void;
        get(params: Params$Resource$Accounts$Products$Get, callback: BodyResponseCallback<Schema$Product>): void;
        get(callback: BodyResponseCallback<Schema$Product>): void;
        /**
         * Lists all the products in a Manufacturer Center account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Products$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Products$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListProductsResponse>>;
        list(params: Params$Resource$Accounts$Products$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Products$List, options: MethodOptions | BodyResponseCallback<Schema$ListProductsResponse>, callback: BodyResponseCallback<Schema$ListProductsResponse>): void;
        list(params: Params$Resource$Accounts$Products$List, callback: BodyResponseCallback<Schema$ListProductsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListProductsResponse>): void;
        /**
         * Inserts or updates the attributes of the product in a Manufacturer Center account. Creates a product with the provided attributes. If the product already exists, then all attributes are replaced with the new ones. The checks at upload time are minimal. All required attributes need to be present for a product to be valid. Issues may show up later after the API has accepted a new upload for a product and it is possible to overwrite an existing valid product with an invalid product. To detect this, you should retrieve the product and check it for issues once the new version is available. Uploaded attributes first need to be processed before they can be retrieved. Until then, new products will be unavailable, and retrieval of previously uploaded products will return the original state of the product.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Accounts$Products$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Accounts$Products$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        update(params: Params$Resource$Accounts$Products$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Accounts$Products$Update, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        update(params: Params$Resource$Accounts$Products$Update, callback: BodyResponseCallback<Schema$Empty>): void;
        update(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Accounts$Products$Delete extends StandardParameters {
        /**
         * Name in the format `{target_country\}:{content_language\}:{product_id\}`. `target_country` - The target country of the product as a CLDR territory code (for example, US). `content_language` - The content language of the product as a two-letter ISO 639-1 language code (for example, en). `product_id` - The ID of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#id.
         */
        name?: string;
        /**
         * Parent ID in the format `accounts/{account_id\}`. `account_id` - The ID of the Manufacturer Center account.
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Products$Get extends StandardParameters {
        /**
         * The information to be included in the response. Only sections listed here will be returned.
         */
        include?: string[];
        /**
         * Name in the format `{target_country\}:{content_language\}:{product_id\}`. `target_country` - The target country of the product as a CLDR territory code (for example, US). `content_language` - The content language of the product as a two-letter ISO 639-1 language code (for example, en). `product_id` - The ID of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#id.
         */
        name?: string;
        /**
         * Parent ID in the format `accounts/{account_id\}`. `account_id` - The ID of the Manufacturer Center account.
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Products$List extends StandardParameters {
        /**
         * The information to be included in the response. Only sections listed here will be returned.
         */
        include?: string[];
        /**
         * Maximum number of product statuses to return in the response, used for paging.
         */
        pageSize?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
        /**
         * Parent ID in the format `accounts/{account_id\}`. `account_id` - The ID of the Manufacturer Center account.
         */
        parent?: string;
    }
    export interface Params$Resource$Accounts$Products$Update extends StandardParameters {
        /**
         * Name in the format `{target_country\}:{content_language\}:{product_id\}`. `target_country` - The target country of the product as a CLDR territory code (for example, US). `content_language` - The content language of the product as a two-letter ISO 639-1 language code (for example, en). `product_id` - The ID of the product. For more information, see https://support.google.com/manufacturers/answer/6124116#id.
         */
        name?: string;
        /**
         * Parent ID in the format `accounts/{account_id\}`. `account_id` - The ID of the Manufacturer Center account.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Attributes;
    }
    export {};
}
