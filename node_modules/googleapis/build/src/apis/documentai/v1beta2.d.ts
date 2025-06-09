import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace documentai_v1beta2 {
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
     * Cloud Document AI API
     *
     * Service to parse structured information from unstructured or semi-structured documents using state-of-the-art Google AI such as natural language, computer vision, translation, and AutoML.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const documentai = google.documentai('v1beta2');
     * ```
     */
    export class Documentai {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Metadata of the auto-labeling documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3AutoLabelDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * The list of individual auto-labeling statuses of the dataset documents.
         */
        individualAutoLabelStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3AutoLabelDocumentsMetadataIndividualAutoLabelStatus[];
        /**
         * Total number of the auto-labeling documents.
         */
        totalDocumentCount?: number | null;
    }
    /**
     * The status of individual documents in the auto-labeling process.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3AutoLabelDocumentsMetadataIndividualAutoLabelStatus {
        /**
         * The document id of the auto-labeled document. This will replace the gcs_uri.
         */
        documentId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentId;
        /**
         * The status of the document auto-labeling.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * The response proto of AutoLabelDocuments method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3AutoLabelDocumentsResponse {
    }
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchDeleteDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * Total number of documents that failed to be deleted in storage.
         */
        errorDocumentCount?: number | null;
        /**
         * The list of response details of each document.
         */
        individualBatchDeleteStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3BatchDeleteDocumentsMetadataIndividualBatchDeleteStatus[];
        /**
         * Total number of documents deleting from dataset.
         */
        totalDocumentCount?: number | null;
    }
    /**
     * The status of each individual document in the batch delete process.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchDeleteDocumentsMetadataIndividualBatchDeleteStatus {
        /**
         * The document id of the document.
         */
        documentId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentId;
        /**
         * The status of deleting the document in storage.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response of the delete documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchDeleteDocumentsResponse {
    }
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchMoveDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * The destination dataset split type.
         */
        destDatasetType?: string | null;
        /**
         * The destination dataset split type.
         */
        destSplitType?: string | null;
        /**
         * The list of response details of each document.
         */
        individualBatchMoveStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3BatchMoveDocumentsMetadataIndividualBatchMoveStatus[];
    }
    /**
     * The status of each individual document in the batch move process.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchMoveDocumentsMetadataIndividualBatchMoveStatus {
        /**
         * The document id of the document.
         */
        documentId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentId;
        /**
         * The status of moving the document.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response of the batch move documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchMoveDocumentsResponse {
    }
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchUpdateDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * The list of response details of each document.
         */
        individualBatchUpdateStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3BatchUpdateDocumentsMetadataIndividualBatchUpdateStatus[];
    }
    /**
     * The status of each individual document in the batch update process.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchUpdateDocumentsMetadataIndividualBatchUpdateStatus {
        /**
         * The document id of the document.
         */
        documentId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentId;
        /**
         * The status of updating the document in storage.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response of the batch update documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3BatchUpdateDocumentsResponse {
    }
    /**
     * The common metadata for long running operations.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata {
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * A related resource to this operation.
         */
        resource?: string | null;
        /**
         * The state of the operation.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * The long-running operation metadata for the CreateLabelerPool method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3CreateLabelerPoolOperationMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for DeleteLabelerPool.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DeleteLabelerPoolOperationMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for the DeleteProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DeleteProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for the DeleteProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DeleteProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for the DeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DeployProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the DeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DeployProcessorVersionResponse {
    }
    /**
     * The long-running operation metadata for the DisableProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DisableProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the DisableProcessor method. Intentionally empty proto for adding fields in future.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DisableProcessorResponse {
    }
    /**
     * Document Identifier.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DocumentId {
        /**
         * A document id within user-managed Cloud Storage.
         */
        gcsManagedDocId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentIdGCSManagedDocumentId;
        /**
         * Points to a specific revision of the document if set.
         */
        revisionRef?: Schema$GoogleCloudDocumentaiUiv1beta3RevisionRef;
        /**
         * A document id within unmanaged dataset.
         */
        unmanagedDocId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentIdUnmanagedDocumentId;
    }
    /**
     * Identifies a document uniquely within the scope of a dataset in the user-managed Cloud Storage option.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DocumentIdGCSManagedDocumentId {
        /**
         * Id of the document (indexed) managed by Content Warehouse.
         */
        cwDocId?: string | null;
        /**
         * Required. The Cloud Storage URI where the actual document is stored.
         */
        gcsUri?: string | null;
    }
    /**
     * Identifies a document uniquely within the scope of a dataset in unmanaged option.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3DocumentIdUnmanagedDocumentId {
        /**
         * Required. The id of the document.
         */
        docId?: string | null;
    }
    /**
     * The long-running operation metadata for the EnableProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3EnableProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the EnableProcessor method. Intentionally empty proto for adding fields in future.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3EnableProcessorResponse {
    }
    /**
     * Metadata of the EvaluateProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3EvaluateProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response of the EvaluateProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3EvaluateProcessorVersionResponse {
        /**
         * The resource name of the created evaluation.
         */
        evaluation?: string | null;
    }
    /**
     * Metadata of the batch export documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ExportDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * The list of response details of each document.
         */
        individualExportStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3ExportDocumentsMetadataIndividualExportStatus[];
        /**
         * The list of statistics for each dataset split type.
         */
        splitExportStats?: Schema$GoogleCloudDocumentaiUiv1beta3ExportDocumentsMetadataSplitExportStat[];
    }
    /**
     * The status of each individual document in the export process.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ExportDocumentsMetadataIndividualExportStatus {
        /**
         * The path to source docproto of the document.
         */
        documentId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentId;
        /**
         * The output_gcs_destination of the exported document if it was successful, otherwise empty.
         */
        outputGcsDestination?: string | null;
        /**
         * The status of the exporting of the document.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * The statistic representing a dataset split type for this export.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ExportDocumentsMetadataSplitExportStat {
        /**
         * The dataset split type.
         */
        splitType?: string | null;
        /**
         * Total number of documents with the given dataset split type to be exported.
         */
        totalDocumentCount?: number | null;
    }
    /**
     * The response proto of ExportDocuments method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ExportDocumentsResponse {
    }
    /**
     * Metadata message associated with the ExportProcessorVersion operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ExportProcessorVersionMetadata {
        /**
         * The common metadata about the operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response message associated with the ExportProcessorVersion operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ExportProcessorVersionResponse {
        /**
         * The Cloud Storage URI containing the output artifacts.
         */
        gcsUri?: string | null;
    }
    /**
     * Metadata of the import document operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ImportDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * Validation statuses of the batch documents import config.
         */
        importConfigValidationResults?: Schema$GoogleCloudDocumentaiUiv1beta3ImportDocumentsMetadataImportConfigValidationResult[];
        /**
         * The list of response details of each document.
         */
        individualImportStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3ImportDocumentsMetadataIndividualImportStatus[];
        /**
         * Total number of the documents that are qualified for importing.
         */
        totalDocumentCount?: number | null;
    }
    /**
     * The validation status of each import config. Status is set to an error if there are no documents to import in the `import_config`, or `OK` if the operation will try to proceed with at least one document.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ImportDocumentsMetadataImportConfigValidationResult {
        /**
         * The source Cloud Storage URI specified in the import config.
         */
        inputGcsSource?: string | null;
        /**
         * The validation status of import config.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * The status of each individual document in the import process.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ImportDocumentsMetadataIndividualImportStatus {
        /**
         * The source Cloud Storage URI of the document.
         */
        inputGcsSource?: string | null;
        /**
         * The document id of imported document if it was successful, otherwise empty.
         */
        outputDocumentId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentId;
        /**
         * The output_gcs_destination of the processed document if it was successful, otherwise empty.
         */
        outputGcsDestination?: string | null;
        /**
         * The status of the importing of the document.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response of the import document operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ImportDocumentsResponse {
    }
    /**
     * The long-running operation metadata for the ImportProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ImportProcessorVersionMetadata {
        /**
         * The basic metadata for the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The response message for the ImportProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ImportProcessorVersionResponse {
        /**
         * The destination processor version name.
         */
        processorVersion?: string | null;
    }
    /**
     * The metadata proto of `ResyncDataset` method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ResyncDatasetMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * The list of dataset resync statuses. Not checked when ResyncDatasetRequest.dataset_documents is specified.
         */
        datasetResyncStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3ResyncDatasetMetadataDatasetResyncStatus[];
        /**
         * The list of document resync statuses. The same document could have multiple `individual_document_resync_statuses` if it has multiple inconsistencies.
         */
        individualDocumentResyncStatuses?: Schema$GoogleCloudDocumentaiUiv1beta3ResyncDatasetMetadataIndividualDocumentResyncStatus[];
    }
    /**
     * Resync status against inconsistency types on the dataset level.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ResyncDatasetMetadataDatasetResyncStatus {
        /**
         * The type of the inconsistency of the dataset.
         */
        datasetInconsistencyType?: string | null;
        /**
         * The status of resyncing the dataset with regards to the detected inconsistency. Empty if ResyncDatasetRequest.validate_only is `true`.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Resync status for each document per inconsistency type.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ResyncDatasetMetadataIndividualDocumentResyncStatus {
        /**
         * The document identifier.
         */
        documentId?: Schema$GoogleCloudDocumentaiUiv1beta3DocumentId;
        /**
         * The type of document inconsistency.
         */
        documentInconsistencyType?: string | null;
        /**
         * The status of resyncing the document with regards to the detected inconsistency. Empty if ResyncDatasetRequest.validate_only is `true`.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * The response proto of ResyncDataset method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3ResyncDatasetResponse {
    }
    /**
     * The revision reference specifies which revision on the document to read.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3RevisionRef {
        /**
         * Reads the revision generated by the processor version. The format takes the full resource name of processor version. `projects/{project\}/locations/{location\}/processors/{processor\}/processorVersions/{processorVersion\}`
         */
        latestProcessorVersion?: string | null;
        /**
         * Reads the revision by the predefined case.
         */
        revisionCase?: string | null;
        /**
         * Reads the revision given by the id.
         */
        revisionId?: string | null;
    }
    /**
     * Metadata of the sample documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3SampleDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response of the sample documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3SampleDocumentsResponse {
        /**
         * The status of sampling documents in test split.
         */
        sampleTestStatus?: Schema$GoogleRpcStatus;
        /**
         * The status of sampling documents in training split.
         */
        sampleTrainingStatus?: Schema$GoogleRpcStatus;
        /**
         * The result of the sampling process.
         */
        selectedDocuments?: Schema$GoogleCloudDocumentaiUiv1beta3SampleDocumentsResponseSelectedDocument[];
    }
    export interface Schema$GoogleCloudDocumentaiUiv1beta3SampleDocumentsResponseSelectedDocument {
        /**
         * An internal identifier for document.
         */
        documentId?: string | null;
    }
    /**
     * The long-running operation metadata for the SetDefaultProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3SetDefaultProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the SetDefaultProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3SetDefaultProcessorVersionResponse {
    }
    /**
     * The metadata that represents a processor version being created.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3TrainProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
        /**
         * The test dataset validation information.
         */
        testDatasetValidation?: Schema$GoogleCloudDocumentaiUiv1beta3TrainProcessorVersionMetadataDatasetValidation;
        /**
         * The training dataset validation information.
         */
        trainingDatasetValidation?: Schema$GoogleCloudDocumentaiUiv1beta3TrainProcessorVersionMetadataDatasetValidation;
    }
    /**
     * The dataset validation information. This includes any and all errors with documents and the dataset.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3TrainProcessorVersionMetadataDatasetValidation {
        /**
         * The total number of dataset errors.
         */
        datasetErrorCount?: number | null;
        /**
         * Error information for the dataset as a whole. A maximum of 10 dataset errors will be returned. A single dataset error is terminal for training.
         */
        datasetErrors?: Schema$GoogleRpcStatus[];
        /**
         * The total number of document errors.
         */
        documentErrorCount?: number | null;
        /**
         * Error information pertaining to specific documents. A maximum of 10 document errors will be returned. Any document with errors will not be used throughout training.
         */
        documentErrors?: Schema$GoogleRpcStatus[];
    }
    /**
     * The response for TrainProcessorVersion.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3TrainProcessorVersionResponse {
        /**
         * The resource name of the processor version produced by training.
         */
        processorVersion?: string | null;
    }
    /**
     * The long-running operation metadata for the UndeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3UndeployProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the UndeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3UndeployProcessorVersionResponse {
    }
    export interface Schema$GoogleCloudDocumentaiUiv1beta3UpdateDatasetOperationMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for updating the human review configuration.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3UpdateHumanReviewConfigMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for UpdateLabelerPool.
     */
    export interface Schema$GoogleCloudDocumentaiUiv1beta3UpdateLabelerPoolOperationMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiUiv1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for BatchProcessDocuments.
     */
    export interface Schema$GoogleCloudDocumentaiV1BatchProcessMetadata {
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * The list of response details of each document.
         */
        individualProcessStatuses?: Schema$GoogleCloudDocumentaiV1BatchProcessMetadataIndividualProcessStatus[];
        /**
         * The state of the current batch processing.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing. For example, the error message if the operation is failed.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * The status of a each individual document in the batch process.
     */
    export interface Schema$GoogleCloudDocumentaiV1BatchProcessMetadataIndividualProcessStatus {
        /**
         * The status of human review on the processed document.
         */
        humanReviewStatus?: Schema$GoogleCloudDocumentaiV1HumanReviewStatus;
        /**
         * The source of the document, same as the input_gcs_source field in the request when the batch process started.
         */
        inputGcsSource?: string | null;
        /**
         * The Cloud Storage output destination (in the request as DocumentOutputConfig.GcsOutputConfig.gcs_uri) of the processed document if it was successful, otherwise empty.
         */
        outputGcsDestination?: string | null;
        /**
         * The status processing the document.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response message for BatchProcessDocuments.
     */
    export interface Schema$GoogleCloudDocumentaiV1BatchProcessResponse {
    }
    /**
     * Encodes the detailed information of a barcode.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1Barcode {
        /**
         * Format of a barcode. The supported formats are: - `CODE_128`: Code 128 type. - `CODE_39`: Code 39 type. - `CODE_93`: Code 93 type. - `CODABAR`: Codabar type. - `DATA_MATRIX`: 2D Data Matrix type. - `ITF`: ITF type. - `EAN_13`: EAN-13 type. - `EAN_8`: EAN-8 type. - `QR_CODE`: 2D QR code type. - `UPC_A`: UPC-A type. - `UPC_E`: UPC-E type. - `PDF417`: PDF417 type. - `AZTEC`: 2D Aztec code type. - `DATABAR`: GS1 DataBar code type.
         */
        format?: string | null;
        /**
         * Raw value encoded in the barcode. For example: `'MEBKM:TITLE:Google;URL:https://www.google.com;;'`.
         */
        rawValue?: string | null;
        /**
         * Value format describes the format of the value that a barcode encodes. The supported formats are: - `CONTACT_INFO`: Contact information. - `EMAIL`: Email address. - `ISBN`: ISBN identifier. - `PHONE`: Phone number. - `PRODUCT`: Product. - `SMS`: SMS message. - `TEXT`: Text string. - `URL`: URL address. - `WIFI`: Wifi information. - `GEO`: Geo-localization. - `CALENDAR_EVENT`: Calendar event. - `DRIVER_LICENSE`: Driver's license.
         */
        valueFormat?: string | null;
    }
    /**
     * Response to an batch document processing request. This is returned in the LRO Operation after the operation is complete.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1BatchProcessDocumentsResponse {
        /**
         * Responses for each individual document.
         */
        responses?: Schema$GoogleCloudDocumentaiV1beta1ProcessDocumentResponse[];
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$GoogleCloudDocumentaiV1beta1NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$GoogleCloudDocumentaiV1beta1Vertex[];
    }
    /**
     * Document represents the canonical document resource in Document AI. It is an interchange format that provides insights into documents and allows for collaboration between users and Document AI to iterate and optimize for quality.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1Document {
        /**
         * Document chunked based on chunking config.
         */
        chunkedDocument?: Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocument;
        /**
         * Optional. Inline document content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64.
         */
        content?: string | null;
        /**
         * Parsed layout of the document.
         */
        documentLayout?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayout;
        /**
         * A list of entities detected on Document.text. For document shards, entities in this list may cross shard boundaries.
         */
        entities?: Schema$GoogleCloudDocumentaiV1beta1DocumentEntity[];
        /**
         * Placeholder. Relationship among Document.entities.
         */
        entityRelations?: Schema$GoogleCloudDocumentaiV1beta1DocumentEntityRelation[];
        /**
         * Any error that occurred while processing this document.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * An IANA published [media type (MIME type)](https://www.iana.org/assignments/media-types/media-types.xhtml).
         */
        mimeType?: string | null;
        /**
         * Visual page layout for the Document.
         */
        pages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPage[];
        /**
         * Placeholder. Revision history of this document.
         */
        revisions?: Schema$GoogleCloudDocumentaiV1beta1DocumentRevision[];
        /**
         * Information about the sharding if this document is sharded part of a larger document. If the document is not sharded, this message is not specified.
         */
        shardInfo?: Schema$GoogleCloudDocumentaiV1beta1DocumentShardInfo;
        /**
         * Optional. UTF-8 encoded text in reading order from the document.
         */
        text?: string | null;
        /**
         * Placeholder. A list of text corrections made to Document.text. This is usually used for annotating corrections to OCR mistakes. Text changes for a given revision may not overlap with each other.
         */
        textChanges?: Schema$GoogleCloudDocumentaiV1beta1DocumentTextChange[];
        /**
         * Styles for the Document.text.
         */
        textStyles?: Schema$GoogleCloudDocumentaiV1beta1DocumentStyle[];
        /**
         * Optional. Currently supports Google Cloud Storage URI of the form `gs://bucket_name/object_name`. Object versioning is not supported. For more information, refer to [Google Cloud Storage Request URIs](https://cloud.google.com/storage/docs/reference-uris).
         */
        uri?: string | null;
    }
    /**
     * Represents the chunks that the document is divided into.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocument {
        /**
         * List of chunks.
         */
        chunks?: Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunk[];
    }
    /**
     * Represents a chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunk {
        /**
         * ID of the chunk.
         */
        chunkId?: string | null;
        /**
         * Text content of the chunk.
         */
        content?: string | null;
        /**
         * Page footers associated with the chunk.
         */
        pageFooters?: Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageFooter[];
        /**
         * Page headers associated with the chunk.
         */
        pageHeaders?: Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageHeader[];
        /**
         * Page span of the chunk.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Unused.
         */
        sourceBlockIds?: string[] | null;
    }
    /**
     * Represents the page footer associated with the chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageFooter {
        /**
         * Page span of the footer.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Footer in text format.
         */
        text?: string | null;
    }
    /**
     * Represents the page header associated with the chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageHeader {
        /**
         * Page span of the header.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Header in text format.
         */
        text?: string | null;
    }
    /**
     * Represents where the chunk starts and ends in the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentChunkedDocumentChunkChunkPageSpan {
        /**
         * Page where chunk ends in the document.
         */
        pageEnd?: number | null;
        /**
         * Page where chunk starts in the document.
         */
        pageStart?: number | null;
    }
    /**
     * Represents the parsed layout of a document as a collection of blocks that the document is divided into.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayout {
        /**
         * List of blocks in the document.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlock[];
    }
    /**
     * Represents a block. A block could be one of the various types (text, table, list) supported.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlock {
        /**
         * ID of the block.
         */
        blockId?: string | null;
        /**
         * Block consisting of list content/structure.
         */
        listBlock?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutListBlock;
        /**
         * Page span of the block.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutPageSpan;
        /**
         * Block consisting of table content/structure.
         */
        tableBlock?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableBlock;
        /**
         * Block consisting of text content.
         */
        textBlock?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTextBlock;
    }
    /**
     * Represents a list type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutListBlock {
        /**
         * List entries that constitute a list block.
         */
        listEntries?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutListEntry[];
        /**
         * Type of the list_entries (if exist). Available options are `ordered` and `unordered`.
         */
        type?: string | null;
    }
    /**
     * Represents an entry in the list.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutListEntry {
        /**
         * A list entry is a list of blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlock[];
    }
    /**
     * Represents where the block starts and ends in the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutPageSpan {
        /**
         * Page where block ends in the document.
         */
        pageEnd?: number | null;
        /**
         * Page where block starts in the document.
         */
        pageStart?: number | null;
    }
    /**
     * Represents a table type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableBlock {
        /**
         * Body rows containing main table content.
         */
        bodyRows?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow[];
        /**
         * Table caption/title.
         */
        caption?: string | null;
        /**
         * Header rows at the top of the table.
         */
        headerRows?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow[];
    }
    /**
     * Represents a cell in a table row.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableCell {
        /**
         * A table cell is a list of blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlock[];
        /**
         * How many columns this cell spans.
         */
        colSpan?: number | null;
        /**
         * How many rows this cell spans.
         */
        rowSpan?: number | null;
    }
    /**
     * Represents a row in a table.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow {
        /**
         * A table row is a list of table cells.
         */
        cells?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTableCell[];
    }
    /**
     * Represents a text type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlockLayoutTextBlock {
        /**
         * A text block could further have child blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta1DocumentDocumentLayoutDocumentLayoutBlock[];
        /**
         * Text content stored in the block.
         */
        text?: string | null;
        /**
         * Type of the text in the block. Available options are: `paragraph`, `subtitle`, `heading-1`, `heading-2`, `heading-3`, `heading-4`, `heading-5`, `header`, `footer`.
         */
        type?: string | null;
    }
    /**
     * An entity that could be a phrase in the text or a property that belongs to the document. It is a known entity type, such as a person, an organization, or location.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentEntity {
        /**
         * Optional. Confidence of detected Schema entity. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Optional. Canonical id. This will be a unique value in the entity list for this document.
         */
        id?: string | null;
        /**
         * Optional. Deprecated. Use `id` field instead.
         */
        mentionId?: string | null;
        /**
         * Optional. Text value of the entity e.g. `1600 Amphitheatre Pkwy`.
         */
        mentionText?: string | null;
        /**
         * Optional. Normalized entity value. Absent if the extracted value could not be converted or the type (e.g. address) is not supported for certain parsers. This field is also only populated for certain supported document types.
         */
        normalizedValue?: Schema$GoogleCloudDocumentaiV1beta1DocumentEntityNormalizedValue;
        /**
         * Optional. Represents the provenance of this entity wrt. the location on the page where it was found.
         */
        pageAnchor?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageAnchor;
        /**
         * Optional. Entities can be nested to form a hierarchical data structure representing the content in the document.
         */
        properties?: Schema$GoogleCloudDocumentaiV1beta1DocumentEntity[];
        /**
         * Optional. The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
        /**
         * Optional. Whether the entity will be redacted for de-identification purposes.
         */
        redacted?: boolean | null;
        /**
         * Optional. Provenance of the entity. Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta1DocumentTextAnchor;
        /**
         * Required. Entity type from a schema e.g. `Address`.
         */
        type?: string | null;
    }
    /**
     * Parsed and normalized entity value.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentEntityNormalizedValue {
        /**
         * Postal address. See also: https://github.com/googleapis/googleapis/blob/master/google/type/postal_address.proto
         */
        addressValue?: Schema$GoogleTypePostalAddress;
        /**
         * Boolean value. Can be used for entities with binary values, or for checkboxes.
         */
        booleanValue?: boolean | null;
        /**
         * DateTime value. Includes date, time, and timezone. See also: https://github.com/googleapis/googleapis/blob/master/google/type/datetime.proto
         */
        datetimeValue?: Schema$GoogleTypeDateTime;
        /**
         * Date value. Includes year, month, day. See also: https://github.com/googleapis/googleapis/blob/master/google/type/date.proto
         */
        dateValue?: Schema$GoogleTypeDate;
        /**
         * Float value.
         */
        floatValue?: number | null;
        /**
         * Integer value.
         */
        integerValue?: number | null;
        /**
         * Money value. See also: https://github.com/googleapis/googleapis/blob/master/google/type/money.proto
         */
        moneyValue?: Schema$GoogleTypeMoney;
        /**
         * Optional. An optional field to store a normalized string. For some entity types, one of respective `structured_value` fields may also be populated. Also not all the types of `structured_value` will be normalized. For example, some processors may not generate `float` or `integer` normalized text by default. Below are sample formats mapped to structured values. - Money/Currency type (`money_value`) is in the ISO 4217 text format. - Date type (`date_value`) is in the ISO 8601 text format. - Datetime type (`datetime_value`) is in the ISO 8601 text format.
         */
        text?: string | null;
    }
    /**
     * Relationship between Entities.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentEntityRelation {
        /**
         * Object entity id.
         */
        objectId?: string | null;
        /**
         * Relationship description.
         */
        relation?: string | null;
        /**
         * Subject entity id.
         */
        subjectId?: string | null;
    }
    /**
     * A page in a Document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPage {
        /**
         * A list of visually detected text blocks on the page. A block has a set of lines (collected into paragraphs) that have a common line-spacing and orientation.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageBlock[];
        /**
         * A list of detected barcodes.
         */
        detectedBarcodes?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedBarcode[];
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Physical dimension of the page.
         */
        dimension?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDimension;
        /**
         * A list of visually detected form fields on the page.
         */
        formFields?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageFormField[];
        /**
         * Rendered image for this page. This image is preprocessed to remove any skew, rotation, and distortions such that the annotation bounding boxes can be upright and axis-aligned.
         */
        image?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageImage;
        /**
         * Image quality scores.
         */
        imageQualityScores?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageImageQualityScores;
        /**
         * Layout for the page.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * A list of visually detected text lines on the page. A collection of tokens that a human would perceive as a line.
         */
        lines?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLine[];
        /**
         * 1-based index for current Page in a parent Document. Useful when a page is taken out of a Document for individual processing.
         */
        pageNumber?: number | null;
        /**
         * A list of visually detected text paragraphs on the page. A collection of lines that a human would perceive as a paragraph.
         */
        paragraphs?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageParagraph[];
        /**
         * The history of this page.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
        /**
         * A list of visually detected symbols on the page.
         */
        symbols?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageSymbol[];
        /**
         * A list of visually detected tables on the page.
         */
        tables?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageTable[];
        /**
         * A list of visually detected tokens on the page.
         */
        tokens?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageToken[];
        /**
         * Transformation matrices that were applied to the original document image to produce Page.image.
         */
        transforms?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageMatrix[];
        /**
         * A list of detected non-text visual elements e.g. checkbox, signature etc. on the page.
         */
        visualElements?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageVisualElement[];
    }
    /**
     * Referencing the visual context of the entity in the Document.pages. Page anchors can be cross-page, consist of multiple bounding polygons and optionally reference specific layout element types.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageAnchor {
        /**
         * One or more references to visual page elements
         */
        pageRefs?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageAnchorPageRef[];
    }
    /**
     * Represents a weak reference to a page element within a document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageAnchorPageRef {
        /**
         * Optional. Identifies the bounding polygon of a layout element on the page. If `layout_type` is set, the bounding polygon must be exactly the same to the layout element it's referring to.
         */
        boundingPoly?: Schema$GoogleCloudDocumentaiV1beta1BoundingPoly;
        /**
         * Optional. Confidence of detected page element, if applicable. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Optional. Deprecated. Use PageRef.bounding_poly instead.
         */
        layoutId?: string | null;
        /**
         * Optional. The type of the layout element that is being referenced if any.
         */
        layoutType?: string | null;
        /**
         * Required. Index into the Document.pages element, for example using `Document.pages` to locate the related page element. This field is skipped when its value is the default `0`. See https://developers.google.com/protocol-buffers/docs/proto3#json.
         */
        page?: string | null;
    }
    /**
     * A block has a set of lines (collected into paragraphs) that have a common line-spacing and orientation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageBlock {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Layout for Block.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
    }
    /**
     * A detected barcode.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedBarcode {
        /**
         * Detailed barcode information of the DetectedBarcode.
         */
        barcode?: Schema$GoogleCloudDocumentaiV1beta1Barcode;
        /**
         * Layout for DetectedBarcode.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage {
        /**
         * Confidence of detected language. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * The [BCP-47 language code](https://www.unicode.org/reports/tr35/#Unicode_locale_identifier), such as `en-US` or `sr-Latn`.
         */
        languageCode?: string | null;
    }
    /**
     * Dimension for the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageDimension {
        /**
         * Page height.
         */
        height?: number | null;
        /**
         * Dimension unit.
         */
        unit?: string | null;
        /**
         * Page width.
         */
        width?: number | null;
    }
    /**
     * A form field detected on the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageFormField {
        /**
         * Created for Labeling UI to export key text. If corrections were made to the text identified by the `field_name.text_anchor`, this field will contain the correction.
         */
        correctedKeyText?: string | null;
        /**
         * Created for Labeling UI to export value text. If corrections were made to the text identified by the `field_value.text_anchor`, this field will contain the correction.
         */
        correctedValueText?: string | null;
        /**
         * Layout for the FormField name. e.g. `Address`, `Email`, `Grand total`, `Phone number`, etc.
         */
        fieldName?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * Layout for the FormField value.
         */
        fieldValue?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * A list of detected languages for name together with confidence.
         */
        nameDetectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
        /**
         * A list of detected languages for value together with confidence.
         */
        valueDetectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * If the value is non-textual, this field represents the type. Current valid values are: - blank (this indicates the `field_value` is normal text) - `unfilled_checkbox` - `filled_checkbox`
         */
        valueType?: string | null;
    }
    /**
     * Rendered image contents for this page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageImage {
        /**
         * Raw byte content of the image.
         */
        content?: string | null;
        /**
         * Height of the image in pixels.
         */
        height?: number | null;
        /**
         * Encoding [media type (MIME type)](https://www.iana.org/assignments/media-types/media-types.xhtml) for the image.
         */
        mimeType?: string | null;
        /**
         * Width of the image in pixels.
         */
        width?: number | null;
    }
    /**
     * Image quality scores for the page image.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageImageQualityScores {
        /**
         * A list of detected defects.
         */
        detectedDefects?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageImageQualityScoresDetectedDefect[];
        /**
         * The overall quality score. Range `[0, 1]` where `1` is perfect quality.
         */
        qualityScore?: number | null;
    }
    /**
     * Image Quality Defects
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageImageQualityScoresDetectedDefect {
        /**
         * Confidence of detected defect. Range `[0, 1]` where `1` indicates strong confidence that the defect exists.
         */
        confidence?: number | null;
        /**
         * Name of the defect type. Supported values are: - `quality/defect_blurry` - `quality/defect_noisy` - `quality/defect_dark` - `quality/defect_faint` - `quality/defect_text_too_small` - `quality/defect_document_cutoff` - `quality/defect_text_cutoff` - `quality/defect_glare`
         */
        type?: string | null;
    }
    /**
     * Visual element describing a layout unit on a page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout {
        /**
         * The bounding polygon for the Layout.
         */
        boundingPoly?: Schema$GoogleCloudDocumentaiV1beta1BoundingPoly;
        /**
         * Confidence of the current Layout within context of the object this layout is for. e.g. confidence can be for a single token, a table, a visual element, etc. depending on context. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Detected orientation for the Layout.
         */
        orientation?: string | null;
        /**
         * Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta1DocumentTextAnchor;
    }
    /**
     * A collection of tokens that a human would perceive as a line. Does not cross column boundaries, can be horizontal, vertical, etc.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageLine {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Layout for Line.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
    }
    /**
     * Representation for transformation matrix, intended to be compatible and used with OpenCV format for image manipulation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageMatrix {
        /**
         * Number of columns in the matrix.
         */
        cols?: number | null;
        /**
         * The matrix data.
         */
        data?: string | null;
        /**
         * Number of rows in the matrix.
         */
        rows?: number | null;
        /**
         * This encodes information about what data type the matrix uses. For example, 0 (CV_8U) is an unsigned 8-bit image. For the full list of OpenCV primitive data types, please refer to https://docs.opencv.org/4.3.0/d1/d1b/group__core__hal__interface.html
         */
        type?: number | null;
    }
    /**
     * A collection of lines that a human would perceive as a paragraph.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageParagraph {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Layout for Paragraph.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
    }
    /**
     * A detected symbol.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageSymbol {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Layout for Symbol.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
    }
    /**
     * A table representation similar to HTML table structure.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageTable {
        /**
         * Body rows of the table.
         */
        bodyRows?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageTableTableRow[];
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Header rows of the table.
         */
        headerRows?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageTableTableRow[];
        /**
         * Layout for Table.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * The history of this table.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
    }
    /**
     * A cell representation inside the table.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageTableTableCell {
        /**
         * How many columns this cell spans.
         */
        colSpan?: number | null;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Layout for TableCell.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * How many rows this cell spans.
         */
        rowSpan?: number | null;
    }
    /**
     * A row of table cells.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageTableTableRow {
        /**
         * Cells that make up this row.
         */
        cells?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageTableTableCell[];
    }
    /**
     * A detected token.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageToken {
        /**
         * Detected break at the end of a Token.
         */
        detectedBreak?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageTokenDetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Layout for Token.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance;
        /**
         * Text style attributes.
         */
        styleInfo?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageTokenStyleInfo;
    }
    /**
     * Detected break at the end of a Token.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageTokenDetectedBreak {
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Font and other text style attributes.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageTokenStyleInfo {
        /**
         * Color of the background.
         */
        backgroundColor?: Schema$GoogleTypeColor;
        /**
         * Whether the text is bold (equivalent to font_weight is at least `700`).
         */
        bold?: boolean | null;
        /**
         * Font size in points (`1` point is `¹⁄₇₂` inches).
         */
        fontSize?: number | null;
        /**
         * Name or style of the font.
         */
        fontType?: string | null;
        /**
         * TrueType weight on a scale `100` (thin) to `1000` (ultra-heavy). Normal is `400`, bold is `700`.
         */
        fontWeight?: number | null;
        /**
         * Whether the text is handwritten.
         */
        handwritten?: boolean | null;
        /**
         * Whether the text is italic.
         */
        italic?: boolean | null;
        /**
         * Letter spacing in points.
         */
        letterSpacing?: number | null;
        /**
         * Font size in pixels, equal to _unrounded font_size_ * _resolution_ ÷ `72.0`.
         */
        pixelFontSize?: number | null;
        /**
         * Whether the text is in small caps. This feature is not supported yet.
         */
        smallcaps?: boolean | null;
        /**
         * Whether the text is strikethrough. This feature is not supported yet.
         */
        strikeout?: boolean | null;
        /**
         * Whether the text is a subscript. This feature is not supported yet.
         */
        subscript?: boolean | null;
        /**
         * Whether the text is a superscript. This feature is not supported yet.
         */
        superscript?: boolean | null;
        /**
         * Color of the text.
         */
        textColor?: Schema$GoogleTypeColor;
        /**
         * Whether the text is underlined.
         */
        underlined?: boolean | null;
    }
    /**
     * Detected non-text visual elements e.g. checkbox, signature etc. on the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentPageVisualElement {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageDetectedLanguage[];
        /**
         * Layout for VisualElement.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta1DocumentPageLayout;
        /**
         * Type of the VisualElement.
         */
        type?: string | null;
    }
    /**
     * Structure to identify provenance relationships between annotations in different revisions.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance {
        /**
         * The Id of this operation. Needs to be unique within the scope of the revision.
         */
        id?: number | null;
        /**
         * References to the original elements that are replaced.
         */
        parents?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenanceParent[];
        /**
         * The index of the revision that produced this element.
         */
        revision?: number | null;
        /**
         * The type of provenance operation.
         */
        type?: string | null;
    }
    /**
     * The parent element the current element is based on. Used for referencing/aligning, removal and replacement operations.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentProvenanceParent {
        /**
         * The id of the parent provenance.
         */
        id?: number | null;
        /**
         * The index of the parent item in the corresponding item list (eg. list of entities, properties within entities, etc.) in the parent revision.
         */
        index?: number | null;
        /**
         * The index of the index into current revision's parent_ids list.
         */
        revision?: number | null;
    }
    /**
     * Contains past or forward revisions of this document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentRevision {
        /**
         * If the change was made by a person specify the name or id of that person.
         */
        agent?: string | null;
        /**
         * The time that the revision was created, internally generated by doc proto storage at the time of create.
         */
        createTime?: string | null;
        /**
         * Human Review information of this revision.
         */
        humanReview?: Schema$GoogleCloudDocumentaiV1beta1DocumentRevisionHumanReview;
        /**
         * Id of the revision, internally generated by doc proto storage. Unique within the context of the document.
         */
        id?: string | null;
        /**
         * The revisions that this revision is based on. This can include one or more parent (when documents are merged.) This field represents the index into the `revisions` field.
         */
        parent?: number[] | null;
        /**
         * The revisions that this revision is based on. Must include all the ids that have anything to do with this revision - eg. there are `provenance.parent.revision` fields that index into this field.
         */
        parentIds?: string[] | null;
        /**
         * If the annotation was made by processor identify the processor by its resource name.
         */
        processor?: string | null;
    }
    /**
     * Human Review information of the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentRevisionHumanReview {
        /**
         * Human review state. e.g. `requested`, `succeeded`, `rejected`.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing. For example, the rejection reason when the state is `rejected`.
         */
        stateMessage?: string | null;
    }
    /**
     * For a large document, sharding may be performed to produce several document shards. Each document shard contains this field to detail which shard it is.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentShardInfo {
        /**
         * Total number of shards.
         */
        shardCount?: string | null;
        /**
         * The 0-based index of this shard.
         */
        shardIndex?: string | null;
        /**
         * The index of the first character in Document.text in the overall document global text.
         */
        textOffset?: string | null;
    }
    /**
     * Annotation for common text style attributes. This adheres to CSS conventions as much as possible.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentStyle {
        /**
         * Text background color.
         */
        backgroundColor?: Schema$GoogleTypeColor;
        /**
         * Text color.
         */
        color?: Schema$GoogleTypeColor;
        /**
         * Font family such as `Arial`, `Times New Roman`. https://www.w3schools.com/cssref/pr_font_font-family.asp
         */
        fontFamily?: string | null;
        /**
         * Font size.
         */
        fontSize?: Schema$GoogleCloudDocumentaiV1beta1DocumentStyleFontSize;
        /**
         * [Font weight](https://www.w3schools.com/cssref/pr_font_weight.asp). Possible values are `normal`, `bold`, `bolder`, and `lighter`.
         */
        fontWeight?: string | null;
        /**
         * Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta1DocumentTextAnchor;
        /**
         * [Text decoration](https://www.w3schools.com/cssref/pr_text_text-decoration.asp). Follows CSS standard.
         */
        textDecoration?: string | null;
        /**
         * [Text style](https://www.w3schools.com/cssref/pr_font_font-style.asp). Possible values are `normal`, `italic`, and `oblique`.
         */
        textStyle?: string | null;
    }
    /**
     * Font size with unit.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentStyleFontSize {
        /**
         * Font size for the text.
         */
        size?: number | null;
        /**
         * Unit for the font size. Follows CSS naming (such as `in`, `px`, and `pt`).
         */
        unit?: string | null;
    }
    /**
     * Text reference indexing into the Document.text.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentTextAnchor {
        /**
         * Contains the content of the text span so that users do not have to look it up in the text_segments. It is always populated for formFields.
         */
        content?: string | null;
        /**
         * The text segments from the Document.text.
         */
        textSegments?: Schema$GoogleCloudDocumentaiV1beta1DocumentTextAnchorTextSegment[];
    }
    /**
     * A text segment in the Document.text. The indices may be out of bounds which indicate that the text extends into another document shard for large sharded documents. See ShardInfo.text_offset
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentTextAnchorTextSegment {
        /**
         * TextSegment half open end UTF-8 char index in the Document.text.
         */
        endIndex?: string | null;
        /**
         * TextSegment start UTF-8 char index in the Document.text.
         */
        startIndex?: string | null;
    }
    /**
     * This message is used for text changes aka. OCR corrections.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1DocumentTextChange {
        /**
         * The text that replaces the text identified in the `text_anchor`.
         */
        changedText?: string | null;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta1DocumentProvenance[];
        /**
         * Provenance of the correction. Text anchor indexing into the Document.text. There can only be a single `TextAnchor.text_segments` element. If the start and end index of the text segment are the same, the text change is inserted before that index.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta1DocumentTextAnchor;
    }
    /**
     * The Google Cloud Storage location where the output file will be written to.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1GcsDestination {
        uri?: string | null;
    }
    /**
     * The Google Cloud Storage location where the input file will be read from.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1GcsSource {
        uri?: string | null;
    }
    /**
     * The desired input location and metadata.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1InputConfig {
        /**
         * The Google Cloud Storage location to read the input from. This must be a single file.
         */
        gcsSource?: Schema$GoogleCloudDocumentaiV1beta1GcsSource;
        /**
         * Required. Mimetype of the input. Current supported mimetypes are application/pdf, image/tiff, and image/gif. In addition, application/json type is supported for requests with ProcessDocumentRequest.automl_params field set. The JSON file needs to be in Document format.
         */
        mimeType?: string | null;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate (starts from the top of the image).
         */
        y?: number | null;
    }
    /**
     * Contains metadata for the BatchProcessDocuments operation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1OperationMetadata {
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * The state of the current batch processing.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * The desired output location and metadata.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1OutputConfig {
        /**
         * The Google Cloud Storage location to write the output to.
         */
        gcsDestination?: Schema$GoogleCloudDocumentaiV1beta1GcsDestination;
        /**
         * The max number of pages to include into each output Document shard JSON on Google Cloud Storage. The valid range is [1, 100]. If not specified, the default value is 20. For example, for one pdf file with 100 pages, 100 parsed pages will be produced. If `pages_per_shard` = 20, then 5 Document shard JSON files each containing 20 parsed pages will be written under the prefix OutputConfig.gcs_destination.uri and suffix pages-x-to-y.json where x and y are 1-indexed page numbers. Example GCS outputs with 157 pages and pages_per_shard = 50: pages-001-to-050.json pages-051-to-100.json pages-101-to-150.json pages-151-to-157.json
         */
        pagesPerShard?: number | null;
    }
    /**
     * Response to a single document processing request.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1ProcessDocumentResponse {
        /**
         * Information about the input file. This is the same as the corresponding input config in the request.
         */
        inputConfig?: Schema$GoogleCloudDocumentaiV1beta1InputConfig;
        /**
         * The output location of the parsed responses. The responses are written to this location as JSON-serialized `Document` objects.
         */
        outputConfig?: Schema$GoogleCloudDocumentaiV1beta1OutputConfig;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta1Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate (starts from the top of the image).
         */
        y?: number | null;
    }
    /**
     * Parameters to control AutoML model prediction behavior.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2AutoMlParams {
        /**
         * Resource name of the AutoML model. Format: `projects/{project-id\}/locations/{location-id\}/models/{model-id\}`.
         */
        model?: string | null;
    }
    /**
     * Encodes the detailed information of a barcode.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2Barcode {
        /**
         * Format of a barcode. The supported formats are: - `CODE_128`: Code 128 type. - `CODE_39`: Code 39 type. - `CODE_93`: Code 93 type. - `CODABAR`: Codabar type. - `DATA_MATRIX`: 2D Data Matrix type. - `ITF`: ITF type. - `EAN_13`: EAN-13 type. - `EAN_8`: EAN-8 type. - `QR_CODE`: 2D QR code type. - `UPC_A`: UPC-A type. - `UPC_E`: UPC-E type. - `PDF417`: PDF417 type. - `AZTEC`: 2D Aztec code type. - `DATABAR`: GS1 DataBar code type.
         */
        format?: string | null;
        /**
         * Raw value encoded in the barcode. For example: `'MEBKM:TITLE:Google;URL:https://www.google.com;;'`.
         */
        rawValue?: string | null;
        /**
         * Value format describes the format of the value that a barcode encodes. The supported formats are: - `CONTACT_INFO`: Contact information. - `EMAIL`: Email address. - `ISBN`: ISBN identifier. - `PHONE`: Phone number. - `PRODUCT`: Product. - `SMS`: SMS message. - `TEXT`: Text string. - `URL`: URL address. - `WIFI`: Wifi information. - `GEO`: Geo-localization. - `CALENDAR_EVENT`: Calendar event. - `DRIVER_LICENSE`: Driver's license.
         */
        valueFormat?: string | null;
    }
    /**
     * Request to batch process documents as an asynchronous operation. The output is written to Cloud Storage as JSON in the [Document] format.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2BatchProcessDocumentsRequest {
        /**
         * Required. Individual requests for each document.
         */
        requests?: Schema$GoogleCloudDocumentaiV1beta2ProcessDocumentRequest[];
    }
    /**
     * Response to an batch document processing request. This is returned in the LRO Operation after the operation is complete.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2BatchProcessDocumentsResponse {
        /**
         * Responses for each individual document.
         */
        responses?: Schema$GoogleCloudDocumentaiV1beta2ProcessDocumentResponse[];
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$GoogleCloudDocumentaiV1beta2NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$GoogleCloudDocumentaiV1beta2Vertex[];
    }
    /**
     * Document represents the canonical document resource in Document AI. It is an interchange format that provides insights into documents and allows for collaboration between users and Document AI to iterate and optimize for quality.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2Document {
        /**
         * Document chunked based on chunking config.
         */
        chunkedDocument?: Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocument;
        /**
         * Optional. Inline document content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64.
         */
        content?: string | null;
        /**
         * Parsed layout of the document.
         */
        documentLayout?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayout;
        /**
         * A list of entities detected on Document.text. For document shards, entities in this list may cross shard boundaries.
         */
        entities?: Schema$GoogleCloudDocumentaiV1beta2DocumentEntity[];
        /**
         * Placeholder. Relationship among Document.entities.
         */
        entityRelations?: Schema$GoogleCloudDocumentaiV1beta2DocumentEntityRelation[];
        /**
         * Any error that occurred while processing this document.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * Labels for this document.
         */
        labels?: Schema$GoogleCloudDocumentaiV1beta2DocumentLabel[];
        /**
         * An IANA published [media type (MIME type)](https://www.iana.org/assignments/media-types/media-types.xhtml).
         */
        mimeType?: string | null;
        /**
         * Visual page layout for the Document.
         */
        pages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPage[];
        /**
         * Placeholder. Revision history of this document.
         */
        revisions?: Schema$GoogleCloudDocumentaiV1beta2DocumentRevision[];
        /**
         * Information about the sharding if this document is sharded part of a larger document. If the document is not sharded, this message is not specified.
         */
        shardInfo?: Schema$GoogleCloudDocumentaiV1beta2DocumentShardInfo;
        /**
         * Optional. UTF-8 encoded text in reading order from the document.
         */
        text?: string | null;
        /**
         * Placeholder. A list of text corrections made to Document.text. This is usually used for annotating corrections to OCR mistakes. Text changes for a given revision may not overlap with each other.
         */
        textChanges?: Schema$GoogleCloudDocumentaiV1beta2DocumentTextChange[];
        /**
         * Styles for the Document.text.
         */
        textStyles?: Schema$GoogleCloudDocumentaiV1beta2DocumentStyle[];
        /**
         * Optional. Currently supports Google Cloud Storage URI of the form `gs://bucket_name/object_name`. Object versioning is not supported. For more information, refer to [Google Cloud Storage Request URIs](https://cloud.google.com/storage/docs/reference-uris).
         */
        uri?: string | null;
    }
    /**
     * Represents the chunks that the document is divided into.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocument {
        /**
         * List of chunks.
         */
        chunks?: Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunk[];
    }
    /**
     * Represents a chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunk {
        /**
         * ID of the chunk.
         */
        chunkId?: string | null;
        /**
         * Text content of the chunk.
         */
        content?: string | null;
        /**
         * Page footers associated with the chunk.
         */
        pageFooters?: Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageFooter[];
        /**
         * Page headers associated with the chunk.
         */
        pageHeaders?: Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageHeader[];
        /**
         * Page span of the chunk.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Unused.
         */
        sourceBlockIds?: string[] | null;
    }
    /**
     * Represents the page footer associated with the chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageFooter {
        /**
         * Page span of the footer.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Footer in text format.
         */
        text?: string | null;
    }
    /**
     * Represents the page header associated with the chunk.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageHeader {
        /**
         * Page span of the header.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageSpan;
        /**
         * Header in text format.
         */
        text?: string | null;
    }
    /**
     * Represents where the chunk starts and ends in the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentChunkedDocumentChunkChunkPageSpan {
        /**
         * Page where chunk ends in the document.
         */
        pageEnd?: number | null;
        /**
         * Page where chunk starts in the document.
         */
        pageStart?: number | null;
    }
    /**
     * Represents the parsed layout of a document as a collection of blocks that the document is divided into.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayout {
        /**
         * List of blocks in the document.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlock[];
    }
    /**
     * Represents a block. A block could be one of the various types (text, table, list) supported.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlock {
        /**
         * ID of the block.
         */
        blockId?: string | null;
        /**
         * Block consisting of list content/structure.
         */
        listBlock?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutListBlock;
        /**
         * Page span of the block.
         */
        pageSpan?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutPageSpan;
        /**
         * Block consisting of table content/structure.
         */
        tableBlock?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTableBlock;
        /**
         * Block consisting of text content.
         */
        textBlock?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTextBlock;
    }
    /**
     * Represents a list type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutListBlock {
        /**
         * List entries that constitute a list block.
         */
        listEntries?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutListEntry[];
        /**
         * Type of the list_entries (if exist). Available options are `ordered` and `unordered`.
         */
        type?: string | null;
    }
    /**
     * Represents an entry in the list.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutListEntry {
        /**
         * A list entry is a list of blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlock[];
    }
    /**
     * Represents where the block starts and ends in the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutPageSpan {
        /**
         * Page where block ends in the document.
         */
        pageEnd?: number | null;
        /**
         * Page where block starts in the document.
         */
        pageStart?: number | null;
    }
    /**
     * Represents a table type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTableBlock {
        /**
         * Body rows containing main table content.
         */
        bodyRows?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow[];
        /**
         * Table caption/title.
         */
        caption?: string | null;
        /**
         * Header rows at the top of the table.
         */
        headerRows?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow[];
    }
    /**
     * Represents a cell in a table row.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTableCell {
        /**
         * A table cell is a list of blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlock[];
        /**
         * How many columns this cell spans.
         */
        colSpan?: number | null;
        /**
         * How many rows this cell spans.
         */
        rowSpan?: number | null;
    }
    /**
     * Represents a row in a table.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTableRow {
        /**
         * A table row is a list of table cells.
         */
        cells?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTableCell[];
    }
    /**
     * Represents a text type block.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlockLayoutTextBlock {
        /**
         * A text block could further have child blocks. Repeated blocks support further hierarchies and nested blocks.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta2DocumentDocumentLayoutDocumentLayoutBlock[];
        /**
         * Text content stored in the block.
         */
        text?: string | null;
        /**
         * Type of the text in the block. Available options are: `paragraph`, `subtitle`, `heading-1`, `heading-2`, `heading-3`, `heading-4`, `heading-5`, `header`, `footer`.
         */
        type?: string | null;
    }
    /**
     * An entity that could be a phrase in the text or a property that belongs to the document. It is a known entity type, such as a person, an organization, or location.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentEntity {
        /**
         * Optional. Confidence of detected Schema entity. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Optional. Canonical id. This will be a unique value in the entity list for this document.
         */
        id?: string | null;
        /**
         * Optional. Deprecated. Use `id` field instead.
         */
        mentionId?: string | null;
        /**
         * Optional. Text value of the entity e.g. `1600 Amphitheatre Pkwy`.
         */
        mentionText?: string | null;
        /**
         * Optional. Normalized entity value. Absent if the extracted value could not be converted or the type (e.g. address) is not supported for certain parsers. This field is also only populated for certain supported document types.
         */
        normalizedValue?: Schema$GoogleCloudDocumentaiV1beta2DocumentEntityNormalizedValue;
        /**
         * Optional. Represents the provenance of this entity wrt. the location on the page where it was found.
         */
        pageAnchor?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageAnchor;
        /**
         * Optional. Entities can be nested to form a hierarchical data structure representing the content in the document.
         */
        properties?: Schema$GoogleCloudDocumentaiV1beta2DocumentEntity[];
        /**
         * Optional. The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
        /**
         * Optional. Whether the entity will be redacted for de-identification purposes.
         */
        redacted?: boolean | null;
        /**
         * Optional. Provenance of the entity. Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta2DocumentTextAnchor;
        /**
         * Required. Entity type from a schema e.g. `Address`.
         */
        type?: string | null;
    }
    /**
     * Parsed and normalized entity value.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentEntityNormalizedValue {
        /**
         * Postal address. See also: https://github.com/googleapis/googleapis/blob/master/google/type/postal_address.proto
         */
        addressValue?: Schema$GoogleTypePostalAddress;
        /**
         * Boolean value. Can be used for entities with binary values, or for checkboxes.
         */
        booleanValue?: boolean | null;
        /**
         * DateTime value. Includes date, time, and timezone. See also: https://github.com/googleapis/googleapis/blob/master/google/type/datetime.proto
         */
        datetimeValue?: Schema$GoogleTypeDateTime;
        /**
         * Date value. Includes year, month, day. See also: https://github.com/googleapis/googleapis/blob/master/google/type/date.proto
         */
        dateValue?: Schema$GoogleTypeDate;
        /**
         * Float value.
         */
        floatValue?: number | null;
        /**
         * Integer value.
         */
        integerValue?: number | null;
        /**
         * Money value. See also: https://github.com/googleapis/googleapis/blob/master/google/type/money.proto
         */
        moneyValue?: Schema$GoogleTypeMoney;
        /**
         * Optional. An optional field to store a normalized string. For some entity types, one of respective `structured_value` fields may also be populated. Also not all the types of `structured_value` will be normalized. For example, some processors may not generate `float` or `integer` normalized text by default. Below are sample formats mapped to structured values. - Money/Currency type (`money_value`) is in the ISO 4217 text format. - Date type (`date_value`) is in the ISO 8601 text format. - Datetime type (`datetime_value`) is in the ISO 8601 text format.
         */
        text?: string | null;
    }
    /**
     * Relationship between Entities.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentEntityRelation {
        /**
         * Object entity id.
         */
        objectId?: string | null;
        /**
         * Relationship description.
         */
        relation?: string | null;
        /**
         * Subject entity id.
         */
        subjectId?: string | null;
    }
    /**
     * Label attaches schema information and/or other metadata to segments within a Document. Multiple Labels on a single field can denote either different labels, different instances of the same label created at different times, or some combination of both.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentLabel {
        /**
         * Label is generated AutoML model. This field stores the full resource name of the AutoML model. Format: `projects/{project-id\}/locations/{location-id\}/models/{model-id\}`
         */
        automlModel?: string | null;
        /**
         * Confidence score between 0 and 1 for label assignment.
         */
        confidence?: number | null;
        /**
         * Name of the label. When the label is generated from AutoML Text Classification model, this field represents the name of the category.
         */
        name?: string | null;
    }
    /**
     * A page in a Document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPage {
        /**
         * A list of visually detected text blocks on the page. A block has a set of lines (collected into paragraphs) that have a common line-spacing and orientation.
         */
        blocks?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageBlock[];
        /**
         * A list of detected barcodes.
         */
        detectedBarcodes?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedBarcode[];
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Physical dimension of the page.
         */
        dimension?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDimension;
        /**
         * A list of visually detected form fields on the page.
         */
        formFields?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageFormField[];
        /**
         * Rendered image for this page. This image is preprocessed to remove any skew, rotation, and distortions such that the annotation bounding boxes can be upright and axis-aligned.
         */
        image?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageImage;
        /**
         * Image quality scores.
         */
        imageQualityScores?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageImageQualityScores;
        /**
         * Layout for the page.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * A list of visually detected text lines on the page. A collection of tokens that a human would perceive as a line.
         */
        lines?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLine[];
        /**
         * 1-based index for current Page in a parent Document. Useful when a page is taken out of a Document for individual processing.
         */
        pageNumber?: number | null;
        /**
         * A list of visually detected text paragraphs on the page. A collection of lines that a human would perceive as a paragraph.
         */
        paragraphs?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageParagraph[];
        /**
         * The history of this page.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
        /**
         * A list of visually detected symbols on the page.
         */
        symbols?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageSymbol[];
        /**
         * A list of visually detected tables on the page.
         */
        tables?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageTable[];
        /**
         * A list of visually detected tokens on the page.
         */
        tokens?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageToken[];
        /**
         * Transformation matrices that were applied to the original document image to produce Page.image.
         */
        transforms?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageMatrix[];
        /**
         * A list of detected non-text visual elements e.g. checkbox, signature etc. on the page.
         */
        visualElements?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageVisualElement[];
    }
    /**
     * Referencing the visual context of the entity in the Document.pages. Page anchors can be cross-page, consist of multiple bounding polygons and optionally reference specific layout element types.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageAnchor {
        /**
         * One or more references to visual page elements
         */
        pageRefs?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageAnchorPageRef[];
    }
    /**
     * Represents a weak reference to a page element within a document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageAnchorPageRef {
        /**
         * Optional. Identifies the bounding polygon of a layout element on the page. If `layout_type` is set, the bounding polygon must be exactly the same to the layout element it's referring to.
         */
        boundingPoly?: Schema$GoogleCloudDocumentaiV1beta2BoundingPoly;
        /**
         * Optional. Confidence of detected page element, if applicable. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Optional. Deprecated. Use PageRef.bounding_poly instead.
         */
        layoutId?: string | null;
        /**
         * Optional. The type of the layout element that is being referenced if any.
         */
        layoutType?: string | null;
        /**
         * Required. Index into the Document.pages element, for example using `Document.pages` to locate the related page element. This field is skipped when its value is the default `0`. See https://developers.google.com/protocol-buffers/docs/proto3#json.
         */
        page?: string | null;
    }
    /**
     * A block has a set of lines (collected into paragraphs) that have a common line-spacing and orientation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageBlock {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Layout for Block.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
    }
    /**
     * A detected barcode.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedBarcode {
        /**
         * Detailed barcode information of the DetectedBarcode.
         */
        barcode?: Schema$GoogleCloudDocumentaiV1beta2Barcode;
        /**
         * Layout for DetectedBarcode.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage {
        /**
         * Confidence of detected language. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * The [BCP-47 language code](https://www.unicode.org/reports/tr35/#Unicode_locale_identifier), such as `en-US` or `sr-Latn`.
         */
        languageCode?: string | null;
    }
    /**
     * Dimension for the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageDimension {
        /**
         * Page height.
         */
        height?: number | null;
        /**
         * Dimension unit.
         */
        unit?: string | null;
        /**
         * Page width.
         */
        width?: number | null;
    }
    /**
     * A form field detected on the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageFormField {
        /**
         * Created for Labeling UI to export key text. If corrections were made to the text identified by the `field_name.text_anchor`, this field will contain the correction.
         */
        correctedKeyText?: string | null;
        /**
         * Created for Labeling UI to export value text. If corrections were made to the text identified by the `field_value.text_anchor`, this field will contain the correction.
         */
        correctedValueText?: string | null;
        /**
         * Layout for the FormField name. e.g. `Address`, `Email`, `Grand total`, `Phone number`, etc.
         */
        fieldName?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * Layout for the FormField value.
         */
        fieldValue?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * A list of detected languages for name together with confidence.
         */
        nameDetectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
        /**
         * A list of detected languages for value together with confidence.
         */
        valueDetectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * If the value is non-textual, this field represents the type. Current valid values are: - blank (this indicates the `field_value` is normal text) - `unfilled_checkbox` - `filled_checkbox`
         */
        valueType?: string | null;
    }
    /**
     * Rendered image contents for this page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageImage {
        /**
         * Raw byte content of the image.
         */
        content?: string | null;
        /**
         * Height of the image in pixels.
         */
        height?: number | null;
        /**
         * Encoding [media type (MIME type)](https://www.iana.org/assignments/media-types/media-types.xhtml) for the image.
         */
        mimeType?: string | null;
        /**
         * Width of the image in pixels.
         */
        width?: number | null;
    }
    /**
     * Image quality scores for the page image.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageImageQualityScores {
        /**
         * A list of detected defects.
         */
        detectedDefects?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageImageQualityScoresDetectedDefect[];
        /**
         * The overall quality score. Range `[0, 1]` where `1` is perfect quality.
         */
        qualityScore?: number | null;
    }
    /**
     * Image Quality Defects
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageImageQualityScoresDetectedDefect {
        /**
         * Confidence of detected defect. Range `[0, 1]` where `1` indicates strong confidence that the defect exists.
         */
        confidence?: number | null;
        /**
         * Name of the defect type. Supported values are: - `quality/defect_blurry` - `quality/defect_noisy` - `quality/defect_dark` - `quality/defect_faint` - `quality/defect_text_too_small` - `quality/defect_document_cutoff` - `quality/defect_text_cutoff` - `quality/defect_glare`
         */
        type?: string | null;
    }
    /**
     * Visual element describing a layout unit on a page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout {
        /**
         * The bounding polygon for the Layout.
         */
        boundingPoly?: Schema$GoogleCloudDocumentaiV1beta2BoundingPoly;
        /**
         * Confidence of the current Layout within context of the object this layout is for. e.g. confidence can be for a single token, a table, a visual element, etc. depending on context. Range `[0, 1]`.
         */
        confidence?: number | null;
        /**
         * Detected orientation for the Layout.
         */
        orientation?: string | null;
        /**
         * Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta2DocumentTextAnchor;
    }
    /**
     * A collection of tokens that a human would perceive as a line. Does not cross column boundaries, can be horizontal, vertical, etc.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageLine {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Layout for Line.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
    }
    /**
     * Representation for transformation matrix, intended to be compatible and used with OpenCV format for image manipulation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageMatrix {
        /**
         * Number of columns in the matrix.
         */
        cols?: number | null;
        /**
         * The matrix data.
         */
        data?: string | null;
        /**
         * Number of rows in the matrix.
         */
        rows?: number | null;
        /**
         * This encodes information about what data type the matrix uses. For example, 0 (CV_8U) is an unsigned 8-bit image. For the full list of OpenCV primitive data types, please refer to https://docs.opencv.org/4.3.0/d1/d1b/group__core__hal__interface.html
         */
        type?: number | null;
    }
    /**
     * A collection of lines that a human would perceive as a paragraph.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageParagraph {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Layout for Paragraph.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
    }
    /**
     * A detected symbol.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageSymbol {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Layout for Symbol.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
    }
    /**
     * A table representation similar to HTML table structure.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageTable {
        /**
         * Body rows of the table.
         */
        bodyRows?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageTableTableRow[];
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Header rows of the table.
         */
        headerRows?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageTableTableRow[];
        /**
         * Layout for Table.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * The history of this table.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
    }
    /**
     * A cell representation inside the table.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageTableTableCell {
        /**
         * How many columns this cell spans.
         */
        colSpan?: number | null;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Layout for TableCell.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * How many rows this cell spans.
         */
        rowSpan?: number | null;
    }
    /**
     * A row of table cells.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageTableTableRow {
        /**
         * Cells that make up this row.
         */
        cells?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageTableTableCell[];
    }
    /**
     * A detected token.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageToken {
        /**
         * Detected break at the end of a Token.
         */
        detectedBreak?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageTokenDetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Layout for Token.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance;
        /**
         * Text style attributes.
         */
        styleInfo?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageTokenStyleInfo;
    }
    /**
     * Detected break at the end of a Token.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageTokenDetectedBreak {
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Font and other text style attributes.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageTokenStyleInfo {
        /**
         * Color of the background.
         */
        backgroundColor?: Schema$GoogleTypeColor;
        /**
         * Whether the text is bold (equivalent to font_weight is at least `700`).
         */
        bold?: boolean | null;
        /**
         * Font size in points (`1` point is `¹⁄₇₂` inches).
         */
        fontSize?: number | null;
        /**
         * Name or style of the font.
         */
        fontType?: string | null;
        /**
         * TrueType weight on a scale `100` (thin) to `1000` (ultra-heavy). Normal is `400`, bold is `700`.
         */
        fontWeight?: number | null;
        /**
         * Whether the text is handwritten.
         */
        handwritten?: boolean | null;
        /**
         * Whether the text is italic.
         */
        italic?: boolean | null;
        /**
         * Letter spacing in points.
         */
        letterSpacing?: number | null;
        /**
         * Font size in pixels, equal to _unrounded font_size_ * _resolution_ ÷ `72.0`.
         */
        pixelFontSize?: number | null;
        /**
         * Whether the text is in small caps. This feature is not supported yet.
         */
        smallcaps?: boolean | null;
        /**
         * Whether the text is strikethrough. This feature is not supported yet.
         */
        strikeout?: boolean | null;
        /**
         * Whether the text is a subscript. This feature is not supported yet.
         */
        subscript?: boolean | null;
        /**
         * Whether the text is a superscript. This feature is not supported yet.
         */
        superscript?: boolean | null;
        /**
         * Color of the text.
         */
        textColor?: Schema$GoogleTypeColor;
        /**
         * Whether the text is underlined.
         */
        underlined?: boolean | null;
    }
    /**
     * Detected non-text visual elements e.g. checkbox, signature etc. on the page.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentPageVisualElement {
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageDetectedLanguage[];
        /**
         * Layout for VisualElement.
         */
        layout?: Schema$GoogleCloudDocumentaiV1beta2DocumentPageLayout;
        /**
         * Type of the VisualElement.
         */
        type?: string | null;
    }
    /**
     * Structure to identify provenance relationships between annotations in different revisions.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance {
        /**
         * The Id of this operation. Needs to be unique within the scope of the revision.
         */
        id?: number | null;
        /**
         * References to the original elements that are replaced.
         */
        parents?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenanceParent[];
        /**
         * The index of the revision that produced this element.
         */
        revision?: number | null;
        /**
         * The type of provenance operation.
         */
        type?: string | null;
    }
    /**
     * The parent element the current element is based on. Used for referencing/aligning, removal and replacement operations.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentProvenanceParent {
        /**
         * The id of the parent provenance.
         */
        id?: number | null;
        /**
         * The index of the parent item in the corresponding item list (eg. list of entities, properties within entities, etc.) in the parent revision.
         */
        index?: number | null;
        /**
         * The index of the index into current revision's parent_ids list.
         */
        revision?: number | null;
    }
    /**
     * Contains past or forward revisions of this document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentRevision {
        /**
         * If the change was made by a person specify the name or id of that person.
         */
        agent?: string | null;
        /**
         * The time that the revision was created, internally generated by doc proto storage at the time of create.
         */
        createTime?: string | null;
        /**
         * Human Review information of this revision.
         */
        humanReview?: Schema$GoogleCloudDocumentaiV1beta2DocumentRevisionHumanReview;
        /**
         * Id of the revision, internally generated by doc proto storage. Unique within the context of the document.
         */
        id?: string | null;
        /**
         * The revisions that this revision is based on. This can include one or more parent (when documents are merged.) This field represents the index into the `revisions` field.
         */
        parent?: number[] | null;
        /**
         * The revisions that this revision is based on. Must include all the ids that have anything to do with this revision - eg. there are `provenance.parent.revision` fields that index into this field.
         */
        parentIds?: string[] | null;
        /**
         * If the annotation was made by processor identify the processor by its resource name.
         */
        processor?: string | null;
    }
    /**
     * Human Review information of the document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentRevisionHumanReview {
        /**
         * Human review state. e.g. `requested`, `succeeded`, `rejected`.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing. For example, the rejection reason when the state is `rejected`.
         */
        stateMessage?: string | null;
    }
    /**
     * For a large document, sharding may be performed to produce several document shards. Each document shard contains this field to detail which shard it is.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentShardInfo {
        /**
         * Total number of shards.
         */
        shardCount?: string | null;
        /**
         * The 0-based index of this shard.
         */
        shardIndex?: string | null;
        /**
         * The index of the first character in Document.text in the overall document global text.
         */
        textOffset?: string | null;
    }
    /**
     * Annotation for common text style attributes. This adheres to CSS conventions as much as possible.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentStyle {
        /**
         * Text background color.
         */
        backgroundColor?: Schema$GoogleTypeColor;
        /**
         * Text color.
         */
        color?: Schema$GoogleTypeColor;
        /**
         * Font family such as `Arial`, `Times New Roman`. https://www.w3schools.com/cssref/pr_font_font-family.asp
         */
        fontFamily?: string | null;
        /**
         * Font size.
         */
        fontSize?: Schema$GoogleCloudDocumentaiV1beta2DocumentStyleFontSize;
        /**
         * [Font weight](https://www.w3schools.com/cssref/pr_font_weight.asp). Possible values are `normal`, `bold`, `bolder`, and `lighter`.
         */
        fontWeight?: string | null;
        /**
         * Text anchor indexing into the Document.text.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta2DocumentTextAnchor;
        /**
         * [Text decoration](https://www.w3schools.com/cssref/pr_text_text-decoration.asp). Follows CSS standard.
         */
        textDecoration?: string | null;
        /**
         * [Text style](https://www.w3schools.com/cssref/pr_font_font-style.asp). Possible values are `normal`, `italic`, and `oblique`.
         */
        textStyle?: string | null;
    }
    /**
     * Font size with unit.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentStyleFontSize {
        /**
         * Font size for the text.
         */
        size?: number | null;
        /**
         * Unit for the font size. Follows CSS naming (such as `in`, `px`, and `pt`).
         */
        unit?: string | null;
    }
    /**
     * Text reference indexing into the Document.text.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentTextAnchor {
        /**
         * Contains the content of the text span so that users do not have to look it up in the text_segments. It is always populated for formFields.
         */
        content?: string | null;
        /**
         * The text segments from the Document.text.
         */
        textSegments?: Schema$GoogleCloudDocumentaiV1beta2DocumentTextAnchorTextSegment[];
    }
    /**
     * A text segment in the Document.text. The indices may be out of bounds which indicate that the text extends into another document shard for large sharded documents. See ShardInfo.text_offset
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentTextAnchorTextSegment {
        /**
         * TextSegment half open end UTF-8 char index in the Document.text.
         */
        endIndex?: string | null;
        /**
         * TextSegment start UTF-8 char index in the Document.text.
         */
        startIndex?: string | null;
    }
    /**
     * This message is used for text changes aka. OCR corrections.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2DocumentTextChange {
        /**
         * The text that replaces the text identified in the `text_anchor`.
         */
        changedText?: string | null;
        /**
         * The history of this annotation.
         */
        provenance?: Schema$GoogleCloudDocumentaiV1beta2DocumentProvenance[];
        /**
         * Provenance of the correction. Text anchor indexing into the Document.text. There can only be a single `TextAnchor.text_segments` element. If the start and end index of the text segment are the same, the text change is inserted before that index.
         */
        textAnchor?: Schema$GoogleCloudDocumentaiV1beta2DocumentTextAnchor;
    }
    /**
     * Parameters to control entity extraction behavior.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2EntityExtractionParams {
        /**
         * Whether to enable entity extraction.
         */
        enabled?: boolean | null;
        /**
         * Model version of the entity extraction. Default is "builtin/stable". Specify "builtin/latest" for the latest model.
         */
        modelVersion?: string | null;
    }
    /**
     * Parameters to control form extraction behavior.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2FormExtractionParams {
        /**
         * Whether to enable form extraction.
         */
        enabled?: boolean | null;
        /**
         * Reserved for future use.
         */
        keyValuePairHints?: Schema$GoogleCloudDocumentaiV1beta2KeyValuePairHint[];
        /**
         * Model version of the form extraction system. Default is "builtin/stable". Specify "builtin/latest" for the latest model. For custom form models, specify: "custom/{model_name\}". Model name format is "bucket_name/path/to/modeldir" corresponding to "gs://bucket_name/path/to/modeldir" where annotated examples are stored.
         */
        modelVersion?: string | null;
    }
    /**
     * The Google Cloud Storage location where the output file will be written to.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2GcsDestination {
        uri?: string | null;
    }
    /**
     * The Google Cloud Storage location where the input file will be read from.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2GcsSource {
        uri?: string | null;
    }
    /**
     * The desired input location and metadata.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2InputConfig {
        /**
         * Content in bytes, represented as a stream of bytes. Note: As with all `bytes` fields, proto buffer messages use a pure binary representation, whereas JSON representations use base64. This field only works for synchronous ProcessDocument method.
         */
        contents?: string | null;
        /**
         * The Google Cloud Storage location to read the input from. This must be a single file.
         */
        gcsSource?: Schema$GoogleCloudDocumentaiV1beta2GcsSource;
        /**
         * Required. Mimetype of the input. Current supported mimetypes are application/pdf, image/tiff, and image/gif. In addition, application/json type is supported for requests with ProcessDocumentRequest.automl_params field set. The JSON file needs to be in Document format.
         */
        mimeType?: string | null;
    }
    /**
     * Reserved for future use.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2KeyValuePairHint {
        /**
         * The key text for the hint.
         */
        key?: string | null;
        /**
         * Type of the value. This is case-insensitive, and could be one of: ADDRESS, LOCATION, ORGANIZATION, PERSON, PHONE_NUMBER, ID, NUMBER, EMAIL, PRICE, TERMS, DATE, NAME. Types not in this list will be ignored.
         */
        valueTypes?: string[] | null;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate (starts from the top of the image).
         */
        y?: number | null;
    }
    /**
     * Parameters to control Optical Character Recognition (OCR) behavior.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2OcrParams {
        /**
         * List of languages to use for OCR. In most cases, an empty value yields the best results since it enables automatic language detection. For languages based on the Latin alphabet, setting `language_hints` is not needed. In rare cases, when the language of the text in the image is known, setting a hint will help get better results (although it will be a significant hindrance if the hint is wrong). Document processing returns an error if one or more of the specified languages is not one of the supported languages.
         */
        languageHints?: string[] | null;
    }
    /**
     * Contains metadata for the BatchProcessDocuments operation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2OperationMetadata {
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * The state of the current batch processing.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * The desired output location and metadata.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2OutputConfig {
        /**
         * The Google Cloud Storage location to write the output to.
         */
        gcsDestination?: Schema$GoogleCloudDocumentaiV1beta2GcsDestination;
        /**
         * The max number of pages to include into each output Document shard JSON on Google Cloud Storage. The valid range is [1, 100]. If not specified, the default value is 20. For example, for one pdf file with 100 pages, 100 parsed pages will be produced. If `pages_per_shard` = 20, then 5 Document shard JSON files each containing 20 parsed pages will be written under the prefix OutputConfig.gcs_destination.uri and suffix pages-x-to-y.json where x and y are 1-indexed page numbers. Example GCS outputs with 157 pages and pages_per_shard = 50: pages-001-to-050.json pages-051-to-100.json pages-101-to-150.json pages-151-to-157.json
         */
        pagesPerShard?: number | null;
    }
    /**
     * Request to process one document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2ProcessDocumentRequest {
        /**
         * Controls AutoML model prediction behavior. AutoMlParams cannot be used together with other Params.
         */
        automlParams?: Schema$GoogleCloudDocumentaiV1beta2AutoMlParams;
        /**
         * Specifies a known document type for deeper structure detection. Valid values are currently "general" and "invoice". If not provided, "general"\ is used as default. If any other value is given, the request is rejected.
         */
        documentType?: string | null;
        /**
         * Controls entity extraction behavior. If not specified, the system will decide reasonable defaults.
         */
        entityExtractionParams?: Schema$GoogleCloudDocumentaiV1beta2EntityExtractionParams;
        /**
         * Controls form extraction behavior. If not specified, the system will decide reasonable defaults.
         */
        formExtractionParams?: Schema$GoogleCloudDocumentaiV1beta2FormExtractionParams;
        /**
         * Required. Information about the input file.
         */
        inputConfig?: Schema$GoogleCloudDocumentaiV1beta2InputConfig;
        /**
         * Controls OCR behavior. If not specified, the system will decide reasonable defaults.
         */
        ocrParams?: Schema$GoogleCloudDocumentaiV1beta2OcrParams;
        /**
         * The desired output location. This field is only needed in BatchProcessDocumentsRequest.
         */
        outputConfig?: Schema$GoogleCloudDocumentaiV1beta2OutputConfig;
        /**
         * Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no location is specified, a region will be chosen automatically. This field is only populated when used in ProcessDocument method.
         */
        parent?: string | null;
        /**
         * Controls table extraction behavior. If not specified, the system will decide reasonable defaults.
         */
        tableExtractionParams?: Schema$GoogleCloudDocumentaiV1beta2TableExtractionParams;
    }
    /**
     * Response to a single document processing request.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2ProcessDocumentResponse {
        /**
         * Information about the input file. This is the same as the corresponding input config in the request.
         */
        inputConfig?: Schema$GoogleCloudDocumentaiV1beta2InputConfig;
        /**
         * The output location of the parsed responses. The responses are written to this location as JSON-serialized `Document` objects.
         */
        outputConfig?: Schema$GoogleCloudDocumentaiV1beta2OutputConfig;
    }
    /**
     * A hint for a table bounding box on the page for table parsing.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2TableBoundHint {
        /**
         * Bounding box hint for a table on this page. The coordinates must be normalized to [0,1] and the bounding box must be an axis-aligned rectangle.
         */
        boundingBox?: Schema$GoogleCloudDocumentaiV1beta2BoundingPoly;
        /**
         * Optional. Page number for multi-paged inputs this hint applies to. If not provided, this hint will apply to all pages by default. This value is 1-based.
         */
        pageNumber?: number | null;
    }
    /**
     * Parameters to control table extraction behavior.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2TableExtractionParams {
        /**
         * Whether to enable table extraction.
         */
        enabled?: boolean | null;
        /**
         * Optional. Reserved for future use.
         */
        headerHints?: string[] | null;
        /**
         * Model version of the table extraction system. Default is "builtin/stable". Specify "builtin/latest" for the latest model.
         */
        modelVersion?: string | null;
        /**
         * Optional. Table bounding box hints that can be provided to complex cases which our algorithm cannot locate the table(s) in.
         */
        tableBoundHints?: Schema$GoogleCloudDocumentaiV1beta2TableBoundHint[];
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta2Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate (starts from the top of the image).
         */
        y?: number | null;
    }
    export interface Schema$GoogleCloudDocumentaiV1beta3BatchDeleteDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
        /**
         * Total number of documents that failed to be deleted in storage.
         */
        errorDocumentCount?: number | null;
        /**
         * The list of response details of each document.
         */
        individualBatchDeleteStatuses?: Schema$GoogleCloudDocumentaiV1beta3BatchDeleteDocumentsMetadataIndividualBatchDeleteStatus[];
        /**
         * Total number of documents deleting from dataset.
         */
        totalDocumentCount?: number | null;
    }
    /**
     * The status of each individual document in the batch delete process.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3BatchDeleteDocumentsMetadataIndividualBatchDeleteStatus {
        /**
         * The document id of the document.
         */
        documentId?: Schema$GoogleCloudDocumentaiV1beta3DocumentId;
        /**
         * The status of deleting the document in storage.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response of the delete documents operation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3BatchDeleteDocumentsResponse {
    }
    /**
     * The long-running operation metadata for BatchProcessDocuments.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3BatchProcessMetadata {
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * The list of response details of each document.
         */
        individualProcessStatuses?: Schema$GoogleCloudDocumentaiV1beta3BatchProcessMetadataIndividualProcessStatus[];
        /**
         * The state of the current batch processing.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing. For example, the error message if the operation is failed.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * The status of a each individual document in the batch process.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3BatchProcessMetadataIndividualProcessStatus {
        /**
         * The name of the operation triggered by the processed document. If the human review process isn't triggered, this field will be empty. It has the same response type and metadata as the long-running operation returned by the ReviewDocument method.
         */
        humanReviewOperation?: string | null;
        /**
         * The status of human review on the processed document.
         */
        humanReviewStatus?: Schema$GoogleCloudDocumentaiV1beta3HumanReviewStatus;
        /**
         * The source of the document, same as the input_gcs_source field in the request when the batch process started.
         */
        inputGcsSource?: string | null;
        /**
         * The Cloud Storage output destination (in the request as DocumentOutputConfig.GcsOutputConfig.gcs_uri) of the processed document if it was successful, otherwise empty.
         */
        outputGcsDestination?: string | null;
        /**
         * The status processing the document.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response message for BatchProcessDocuments.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3BatchProcessResponse {
    }
    /**
     * The common metadata for long running operations.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata {
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * A related resource to this operation.
         */
        resource?: string | null;
        /**
         * The state of the operation.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * A singleton resource under a Processor which configures a collection of documents.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3Dataset {
        /**
         * Optional. Deprecated. Warehouse-based dataset configuration is not supported.
         */
        documentWarehouseConfig?: Schema$GoogleCloudDocumentaiV1beta3DatasetDocumentWarehouseConfig;
        /**
         * Optional. User-managed Cloud Storage dataset configuration. Use this configuration if the dataset documents are stored under a user-managed Cloud Storage location.
         */
        gcsManagedConfig?: Schema$GoogleCloudDocumentaiV1beta3DatasetGCSManagedConfig;
        /**
         * Dataset resource name. Format: `projects/{project\}/locations/{location\}/processors/{processor\}/dataset`
         */
        name?: string | null;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Output only. Reserved for future use.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Optional. A lightweight indexing source with low latency and high reliability, but lacking advanced features like CMEK and content-based search.
         */
        spannerIndexingConfig?: Schema$GoogleCloudDocumentaiV1beta3DatasetSpannerIndexingConfig;
        /**
         * Required. State of the dataset. Ignored when updating dataset.
         */
        state?: string | null;
        /**
         * Optional. Unmanaged dataset configuration. Use this configuration if the dataset documents are managed by the document service internally (not user-managed).
         */
        unmanagedDatasetConfig?: Schema$GoogleCloudDocumentaiV1beta3DatasetUnmanagedDatasetConfig;
    }
    /**
     * Configuration specific to the Document AI Warehouse-based implementation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DatasetDocumentWarehouseConfig {
        /**
         * Output only. The collection in Document AI Warehouse associated with the dataset.
         */
        collection?: string | null;
        /**
         * Output only. The schema in Document AI Warehouse associated with the dataset.
         */
        schema?: string | null;
    }
    /**
     * Configuration specific to the Cloud Storage-based implementation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DatasetGCSManagedConfig {
        /**
         * Required. The Cloud Storage URI (a directory) where the documents belonging to the dataset must be stored.
         */
        gcsPrefix?: Schema$GoogleCloudDocumentaiV1beta3GcsPrefix;
    }
    /**
     * Configuration specific to spanner-based indexing.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DatasetSpannerIndexingConfig {
    }
    /**
     * Configuration specific to an unmanaged dataset.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DatasetUnmanagedDatasetConfig {
    }
    /**
     * The long-running operation metadata for the DeleteProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DeleteProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for the DeleteProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DeleteProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for the DeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DeployProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the DeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DeployProcessorVersionResponse {
    }
    /**
     * The long-running operation metadata for the DisableProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DisableProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the DisableProcessor method. Intentionally empty proto for adding fields in future.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DisableProcessorResponse {
    }
    /**
     * Document Identifier.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DocumentId {
        /**
         * A document id within user-managed Cloud Storage.
         */
        gcsManagedDocId?: Schema$GoogleCloudDocumentaiV1beta3DocumentIdGCSManagedDocumentId;
        /**
         * Points to a specific revision of the document if set.
         */
        revisionRef?: Schema$GoogleCloudDocumentaiV1beta3RevisionRef;
        /**
         * A document id within unmanaged dataset.
         */
        unmanagedDocId?: Schema$GoogleCloudDocumentaiV1beta3DocumentIdUnmanagedDocumentId;
    }
    /**
     * Identifies a document uniquely within the scope of a dataset in the user-managed Cloud Storage option.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DocumentIdGCSManagedDocumentId {
        /**
         * Id of the document (indexed) managed by Content Warehouse.
         */
        cwDocId?: string | null;
        /**
         * Required. The Cloud Storage URI where the actual document is stored.
         */
        gcsUri?: string | null;
    }
    /**
     * Identifies a document uniquely within the scope of a dataset in unmanaged option.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3DocumentIdUnmanagedDocumentId {
        /**
         * Required. The id of the document.
         */
        docId?: string | null;
    }
    /**
     * The long-running operation metadata for the EnableProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3EnableProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the EnableProcessor method. Intentionally empty proto for adding fields in future.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3EnableProcessorResponse {
    }
    /**
     * Metadata of the EvaluateProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3EvaluateProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * Response of the EvaluateProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3EvaluateProcessorVersionResponse {
        /**
         * The resource name of the created evaluation.
         */
        evaluation?: string | null;
    }
    /**
     * Specifies all documents on Cloud Storage with a common prefix.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3GcsPrefix {
        /**
         * The URI prefix.
         */
        gcsUriPrefix?: string | null;
    }
    /**
     * The status of human review on a processed document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3HumanReviewStatus {
        /**
         * The name of the operation triggered by the processed document. This field is populated only when the state is `HUMAN_REVIEW_IN_PROGRESS`. It has the same response type and metadata as the long-running operation returned by ReviewDocument.
         */
        humanReviewOperation?: string | null;
        /**
         * The state of human review on the processing request.
         */
        state?: string | null;
        /**
         * A message providing more details about the human review state.
         */
        stateMessage?: string | null;
    }
    /**
     * Metadata of the import document operation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ImportDocumentsMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
        /**
         * Validation statuses of the batch documents import config.
         */
        importConfigValidationResults?: Schema$GoogleCloudDocumentaiV1beta3ImportDocumentsMetadataImportConfigValidationResult[];
        /**
         * The list of response details of each document.
         */
        individualImportStatuses?: Schema$GoogleCloudDocumentaiV1beta3ImportDocumentsMetadataIndividualImportStatus[];
        /**
         * Total number of the documents that are qualified for importing.
         */
        totalDocumentCount?: number | null;
    }
    /**
     * The validation status of each import config. Status is set to an error if there are no documents to import in the `import_config`, or `OK` if the operation will try to proceed with at least one document.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ImportDocumentsMetadataImportConfigValidationResult {
        /**
         * The source Cloud Storage URI specified in the import config.
         */
        inputGcsSource?: string | null;
        /**
         * The validation status of import config.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * The status of each individual document in the import process.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ImportDocumentsMetadataIndividualImportStatus {
        /**
         * The source Cloud Storage URI of the document.
         */
        inputGcsSource?: string | null;
        /**
         * The document id of imported document if it was successful, otherwise empty.
         */
        outputDocumentId?: Schema$GoogleCloudDocumentaiV1beta3DocumentId;
        /**
         * The status of the importing of the document.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Response of the import document operation.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ImportDocumentsResponse {
    }
    /**
     * The long-running operation metadata for the ImportProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ImportProcessorVersionMetadata {
        /**
         * The basic metadata for the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * The response message for the ImportProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ImportProcessorVersionResponse {
        /**
         * The destination processor version name.
         */
        processorVersion?: string | null;
    }
    /**
     * The long-running operation metadata for the ReviewDocument method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ReviewDocumentOperationMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * The Crowd Compute question ID.
         */
        questionId?: string | null;
        /**
         * Used only when Operation.done is false.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing. For example, the error message if the operation is failed.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * Response message for the ReviewDocument method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3ReviewDocumentResponse {
        /**
         * The Cloud Storage uri for the human reviewed document if the review is succeeded.
         */
        gcsDestination?: string | null;
        /**
         * The reason why the review is rejected by reviewer.
         */
        rejectionReason?: string | null;
        /**
         * The state of the review operation.
         */
        state?: string | null;
    }
    /**
     * The revision reference specifies which revision on the document to read.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3RevisionRef {
        /**
         * Reads the revision generated by the processor version. The format takes the full resource name of processor version. `projects/{project\}/locations/{location\}/processors/{processor\}/processorVersions/{processorVersion\}`
         */
        latestProcessorVersion?: string | null;
        /**
         * Reads the revision by the predefined case.
         */
        revisionCase?: string | null;
        /**
         * Reads the revision given by the id.
         */
        revisionId?: string | null;
    }
    /**
     * The long-running operation metadata for the SetDefaultProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3SetDefaultProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the SetDefaultProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3SetDefaultProcessorVersionResponse {
    }
    /**
     * The metadata that represents a processor version being created.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3TrainProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
        /**
         * The test dataset validation information.
         */
        testDatasetValidation?: Schema$GoogleCloudDocumentaiV1beta3TrainProcessorVersionMetadataDatasetValidation;
        /**
         * The training dataset validation information.
         */
        trainingDatasetValidation?: Schema$GoogleCloudDocumentaiV1beta3TrainProcessorVersionMetadataDatasetValidation;
    }
    /**
     * The dataset validation information. This includes any and all errors with documents and the dataset.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3TrainProcessorVersionMetadataDatasetValidation {
        /**
         * The total number of dataset errors.
         */
        datasetErrorCount?: number | null;
        /**
         * Error information for the dataset as a whole. A maximum of 10 dataset errors will be returned. A single dataset error is terminal for training.
         */
        datasetErrors?: Schema$GoogleRpcStatus[];
        /**
         * The total number of document errors.
         */
        documentErrorCount?: number | null;
        /**
         * Error information pertaining to specific documents. A maximum of 10 document errors will be returned. Any document with errors will not be used throughout training.
         */
        documentErrors?: Schema$GoogleRpcStatus[];
    }
    /**
     * The response for TrainProcessorVersion.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3TrainProcessorVersionResponse {
        /**
         * The resource name of the processor version produced by training.
         */
        processorVersion?: string | null;
    }
    /**
     * The long-running operation metadata for the UndeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3UndeployProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * Response message for the UndeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1beta3UndeployProcessorVersionResponse {
    }
    export interface Schema$GoogleCloudDocumentaiV1beta3UpdateDatasetOperationMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1beta3CommonOperationMetadata;
    }
    /**
     * The common metadata for long running operations.
     */
    export interface Schema$GoogleCloudDocumentaiV1CommonOperationMetadata {
        /**
         * The creation time of the operation.
         */
        createTime?: string | null;
        /**
         * A related resource to this operation.
         */
        resource?: string | null;
        /**
         * The state of the operation.
         */
        state?: string | null;
        /**
         * A message providing more details about the current state of processing.
         */
        stateMessage?: string | null;
        /**
         * The last update time of the operation.
         */
        updateTime?: string | null;
    }
    /**
     * The long-running operation metadata for the DeleteProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiV1DeleteProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for the DeleteProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1DeleteProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * The long-running operation metadata for the DeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1DeployProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * Response message for the DeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1DeployProcessorVersionResponse {
    }
    /**
     * The long-running operation metadata for the DisableProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiV1DisableProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * Response message for the DisableProcessor method. Intentionally empty proto for adding fields in future.
     */
    export interface Schema$GoogleCloudDocumentaiV1DisableProcessorResponse {
    }
    /**
     * The long-running operation metadata for the EnableProcessor method.
     */
    export interface Schema$GoogleCloudDocumentaiV1EnableProcessorMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * Response message for the EnableProcessor method. Intentionally empty proto for adding fields in future.
     */
    export interface Schema$GoogleCloudDocumentaiV1EnableProcessorResponse {
    }
    /**
     * Metadata of the EvaluateProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1EvaluateProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * Response of the EvaluateProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1EvaluateProcessorVersionResponse {
        /**
         * The resource name of the created evaluation.
         */
        evaluation?: string | null;
    }
    /**
     * The status of human review on a processed document.
     */
    export interface Schema$GoogleCloudDocumentaiV1HumanReviewStatus {
        /**
         * The name of the operation triggered by the processed document. This field is populated only when the state is `HUMAN_REVIEW_IN_PROGRESS`. It has the same response type and metadata as the long-running operation returned by ReviewDocument.
         */
        humanReviewOperation?: string | null;
        /**
         * The state of human review on the processing request.
         */
        state?: string | null;
        /**
         * A message providing more details about the human review state.
         */
        stateMessage?: string | null;
    }
    /**
     * The long-running operation metadata for the ReviewDocument method.
     */
    export interface Schema$GoogleCloudDocumentaiV1ReviewDocumentOperationMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
        /**
         * The Crowd Compute question ID.
         */
        questionId?: string | null;
    }
    /**
     * Response message for the ReviewDocument method.
     */
    export interface Schema$GoogleCloudDocumentaiV1ReviewDocumentResponse {
        /**
         * The Cloud Storage uri for the human reviewed document if the review is succeeded.
         */
        gcsDestination?: string | null;
        /**
         * The reason why the review is rejected by reviewer.
         */
        rejectionReason?: string | null;
        /**
         * The state of the review operation.
         */
        state?: string | null;
    }
    /**
     * The long-running operation metadata for the SetDefaultProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1SetDefaultProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * Response message for the SetDefaultProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1SetDefaultProcessorVersionResponse {
    }
    /**
     * The metadata that represents a processor version being created.
     */
    export interface Schema$GoogleCloudDocumentaiV1TrainProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
        /**
         * The test dataset validation information.
         */
        testDatasetValidation?: Schema$GoogleCloudDocumentaiV1TrainProcessorVersionMetadataDatasetValidation;
        /**
         * The training dataset validation information.
         */
        trainingDatasetValidation?: Schema$GoogleCloudDocumentaiV1TrainProcessorVersionMetadataDatasetValidation;
    }
    /**
     * The dataset validation information. This includes any and all errors with documents and the dataset.
     */
    export interface Schema$GoogleCloudDocumentaiV1TrainProcessorVersionMetadataDatasetValidation {
        /**
         * The total number of dataset errors.
         */
        datasetErrorCount?: number | null;
        /**
         * Error information for the dataset as a whole. A maximum of 10 dataset errors will be returned. A single dataset error is terminal for training.
         */
        datasetErrors?: Schema$GoogleRpcStatus[];
        /**
         * The total number of document errors.
         */
        documentErrorCount?: number | null;
        /**
         * Error information pertaining to specific documents. A maximum of 10 document errors will be returned. Any document with errors will not be used throughout training.
         */
        documentErrors?: Schema$GoogleRpcStatus[];
    }
    /**
     * The response for TrainProcessorVersion.
     */
    export interface Schema$GoogleCloudDocumentaiV1TrainProcessorVersionResponse {
        /**
         * The resource name of the processor version produced by training.
         */
        processorVersion?: string | null;
    }
    /**
     * The long-running operation metadata for the UndeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1UndeployProcessorVersionMetadata {
        /**
         * The basic metadata of the long-running operation.
         */
        commonMetadata?: Schema$GoogleCloudDocumentaiV1CommonOperationMetadata;
    }
    /**
     * Response message for the UndeployProcessorVersion method.
     */
    export interface Schema$GoogleCloudDocumentaiV1UndeployProcessorVersionResponse {
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$GoogleLongrunningOperation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
         */
        done?: boolean | null;
        /**
         * The error result of the operation in case of failure or cancellation.
         */
        error?: Schema$GoogleRpcStatus;
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
         * The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
     */
    export interface Schema$GoogleRpcStatus {
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
     * Represents a color in the RGBA color space. This representation is designed for simplicity of conversion to and from color representations in various languages over compactness. For example, the fields of this representation can be trivially provided to the constructor of `java.awt.Color` in Java; it can also be trivially provided to UIColor's `+colorWithRed:green:blue:alpha` method in iOS; and, with just a little work, it can be easily formatted into a CSS `rgba()` string in JavaScript. This reference page doesn't have information about the absolute color space that should be used to interpret the RGB value—for example, sRGB, Adobe RGB, DCI-P3, and BT.2020. By default, applications should assume the sRGB color space. When color equality needs to be decided, implementations, unless documented otherwise, treat two colors as equal if all their red, green, blue, and alpha values each differ by at most `1e-5`. Example (Java): import com.google.type.Color; // ... public static java.awt.Color fromProto(Color protocolor) { float alpha = protocolor.hasAlpha() ? protocolor.getAlpha().getValue() : 1.0; return new java.awt.Color( protocolor.getRed(), protocolor.getGreen(), protocolor.getBlue(), alpha); \} public static Color toProto(java.awt.Color color) { float red = (float) color.getRed(); float green = (float) color.getGreen(); float blue = (float) color.getBlue(); float denominator = 255.0; Color.Builder resultBuilder = Color .newBuilder() .setRed(red / denominator) .setGreen(green / denominator) .setBlue(blue / denominator); int alpha = color.getAlpha(); if (alpha != 255) { result.setAlpha( FloatValue .newBuilder() .setValue(((float) alpha) / denominator) .build()); \} return resultBuilder.build(); \} // ... Example (iOS / Obj-C): // ... static UIColor* fromProto(Color* protocolor) { float red = [protocolor red]; float green = [protocolor green]; float blue = [protocolor blue]; FloatValue* alpha_wrapper = [protocolor alpha]; float alpha = 1.0; if (alpha_wrapper != nil) { alpha = [alpha_wrapper value]; \} return [UIColor colorWithRed:red green:green blue:blue alpha:alpha]; \} static Color* toProto(UIColor* color) { CGFloat red, green, blue, alpha; if (![color getRed:&red green:&green blue:&blue alpha:&alpha]) { return nil; \} Color* result = [[Color alloc] init]; [result setRed:red]; [result setGreen:green]; [result setBlue:blue]; if (alpha <= 0.9999) { [result setAlpha:floatWrapperWithValue(alpha)]; \} [result autorelease]; return result; \} // ... Example (JavaScript): // ... var protoToCssColor = function(rgb_color) { var redFrac = rgb_color.red || 0.0; var greenFrac = rgb_color.green || 0.0; var blueFrac = rgb_color.blue || 0.0; var red = Math.floor(redFrac * 255); var green = Math.floor(greenFrac * 255); var blue = Math.floor(blueFrac * 255); if (!('alpha' in rgb_color)) { return rgbToCssColor(red, green, blue); \} var alphaFrac = rgb_color.alpha.value || 0.0; var rgbParams = [red, green, blue].join(','); return ['rgba(', rgbParams, ',', alphaFrac, ')'].join(''); \}; var rgbToCssColor = function(red, green, blue) { var rgbNumber = new Number((red << 16) | (green << 8) | blue); var hexString = rgbNumber.toString(16); var missingZeros = 6 - hexString.length; var resultBuilder = ['#']; for (var i = 0; i < missingZeros; i++) { resultBuilder.push('0'); \} resultBuilder.push(hexString); return resultBuilder.join(''); \}; // ...
     */
    export interface Schema$GoogleTypeColor {
        /**
         * The fraction of this color that should be applied to the pixel. That is, the final pixel color is defined by the equation: `pixel color = alpha * (this color) + (1.0 - alpha) * (background color)` This means that a value of 1.0 corresponds to a solid color, whereas a value of 0.0 corresponds to a completely transparent color. This uses a wrapper message rather than a simple float scalar so that it is possible to distinguish between a default value and the value being unset. If omitted, this color object is rendered as a solid color (as if the alpha value had been explicitly given a value of 1.0).
         */
        alpha?: number | null;
        /**
         * The amount of blue in the color as a value in the interval [0, 1].
         */
        blue?: number | null;
        /**
         * The amount of green in the color as a value in the interval [0, 1].
         */
        green?: number | null;
        /**
         * The amount of red in the color as a value in the interval [0, 1].
         */
        red?: number | null;
    }
    /**
     * Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp
     */
    export interface Schema$GoogleTypeDate {
        /**
         * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.
         */
        day?: number | null;
        /**
         * Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.
         */
        month?: number | null;
        /**
         * Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.
         */
        year?: number | null;
    }
    /**
     * Represents civil time (or occasionally physical time). This type can represent a civil time in one of a few possible ways: * When utc_offset is set and time_zone is unset: a civil time on a calendar day with a particular offset from UTC. * When time_zone is set and utc_offset is unset: a civil time on a calendar day in a particular time zone. * When neither time_zone nor utc_offset is set: a civil time on a calendar day in local time. The date is relative to the Proleptic Gregorian Calendar. If year, month, or day are 0, the DateTime is considered not to have a specific year, month, or day respectively. This type may also be used to represent a physical time if all the date and time fields are set and either case of the `time_offset` oneof is set. Consider using `Timestamp` message for physical time instead. If your use case also would like to store the user's timezone, that can be done in another field. This type is more flexible than some applications may want. Make sure to document and validate your application's limitations.
     */
    export interface Schema$GoogleTypeDateTime {
        /**
         * Optional. Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a datetime without a day.
         */
        day?: number | null;
        /**
         * Optional. Hours of day in 24 hour format. Should be from 0 to 23, defaults to 0 (midnight). An API may choose to allow the value "24:00:00" for scenarios like business closing time.
         */
        hours?: number | null;
        /**
         * Optional. Minutes of hour of day. Must be from 0 to 59, defaults to 0.
         */
        minutes?: number | null;
        /**
         * Optional. Month of year. Must be from 1 to 12, or 0 if specifying a datetime without a month.
         */
        month?: number | null;
        /**
         * Optional. Fractions of seconds in nanoseconds. Must be from 0 to 999,999,999, defaults to 0.
         */
        nanos?: number | null;
        /**
         * Optional. Seconds of minutes of the time. Must normally be from 0 to 59, defaults to 0. An API may allow the value 60 if it allows leap-seconds.
         */
        seconds?: number | null;
        /**
         * Time zone.
         */
        timeZone?: Schema$GoogleTypeTimeZone;
        /**
         * UTC offset. Must be whole seconds, between -18 hours and +18 hours. For example, a UTC offset of -4:00 would be represented as { seconds: -14400 \}.
         */
        utcOffset?: string | null;
        /**
         * Optional. Year of date. Must be from 1 to 9999, or 0 if specifying a datetime without a year.
         */
        year?: number | null;
    }
    /**
     * Represents an amount of money with its currency type.
     */
    export interface Schema$GoogleTypeMoney {
        /**
         * The three-letter currency code defined in ISO 4217.
         */
        currencyCode?: string | null;
        /**
         * Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.
         */
        nanos?: number | null;
        /**
         * The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.
         */
        units?: string | null;
    }
    /**
     * Represents a postal address, e.g. for postal delivery or payments addresses. Given a postal address, a postal service can deliver items to a premise, P.O. Box or similar. It is not intended to model geographical locations (roads, towns, mountains). In typical usage an address would be created via user input or from importing existing data, depending on the type of process. Advice on address input / editing: - Use an internationalization-ready address widget such as https://github.com/google/libaddressinput) - Users should not be presented with UI elements for input or editing of fields outside countries where that field is used. For more guidance on how to use this schema, please see: https://support.google.com/business/answer/6397478
     */
    export interface Schema$GoogleTypePostalAddress {
        /**
         * Unstructured address lines describing the lower levels of an address. Because values in address_lines do not have type information and may sometimes contain multiple values in a single field (e.g. "Austin, TX"), it is important that the line order is clear. The order of address lines should be "envelope order" for the country/region of the address. In places where this can vary (e.g. Japan), address_language is used to make it explicit (e.g. "ja" for large-to-small ordering and "ja-Latn" or "en" for small-to-large). This way, the most specific line of an address can be selected based on the language. The minimum permitted structural representation of an address consists of a region_code with all remaining information placed in the address_lines. It would be possible to format such an address very approximately without geocoding, but no semantic reasoning could be made about any of the address components until it was at least partially resolved. Creating an address only containing a region_code and address_lines, and then geocoding is the recommended way to handle completely unstructured addresses (as opposed to guessing which parts of the address should be localities or administrative areas).
         */
        addressLines?: string[] | null;
        /**
         * Optional. Highest administrative subdivision which is used for postal addresses of a country or region. For example, this can be a state, a province, an oblast, or a prefecture. Specifically, for Spain this is the province and not the autonomous community (e.g. "Barcelona" and not "Catalonia"). Many countries don't use an administrative area in postal addresses. E.g. in Switzerland this should be left unpopulated.
         */
        administrativeArea?: string | null;
        /**
         * Optional. BCP-47 language code of the contents of this address (if known). This is often the UI language of the input form or is expected to match one of the languages used in the address' country/region, or their transliterated equivalents. This can affect formatting in certain countries, but is not critical to the correctness of the data and will never affect any validation or other non-formatting related operations. If this value is not known, it should be omitted (rather than specifying a possibly incorrect default). Examples: "zh-Hant", "ja", "ja-Latn", "en".
         */
        languageCode?: string | null;
        /**
         * Optional. Generally refers to the city/town portion of the address. Examples: US city, IT comune, UK post town. In regions of the world where localities are not well defined or do not fit into this structure well, leave locality empty and use address_lines.
         */
        locality?: string | null;
        /**
         * Optional. The name of the organization at the address.
         */
        organization?: string | null;
        /**
         * Optional. Postal code of the address. Not all countries use or require postal codes to be present, but where they are used, they may trigger additional validation with other parts of the address (e.g. state/zip validation in the U.S.A.).
         */
        postalCode?: string | null;
        /**
         * Optional. The recipient at the address. This field may, under certain circumstances, contain multiline information. For example, it might contain "care of" information.
         */
        recipients?: string[] | null;
        /**
         * Required. CLDR region code of the country/region of the address. This is never inferred and it is up to the user to ensure the value is correct. See https://cldr.unicode.org/ and https://www.unicode.org/cldr/charts/30/supplemental/territory_information.html for details. Example: "CH" for Switzerland.
         */
        regionCode?: string | null;
        /**
         * The schema revision of the `PostalAddress`. This must be set to 0, which is the latest revision. All new revisions **must** be backward compatible with old revisions.
         */
        revision?: number | null;
        /**
         * Optional. Additional, country-specific, sorting code. This is not used in most regions. Where it is used, the value is either a string like "CEDEX", optionally followed by a number (e.g. "CEDEX 7"), or just a number alone, representing the "sector code" (Jamaica), "delivery area indicator" (Malawi) or "post office indicator" (e.g. Côte d'Ivoire).
         */
        sortingCode?: string | null;
        /**
         * Optional. Sublocality of the address. For example, this can be neighborhoods, boroughs, districts.
         */
        sublocality?: string | null;
    }
    /**
     * Represents a time zone from the [IANA Time Zone Database](https://www.iana.org/time-zones).
     */
    export interface Schema$GoogleTypeTimeZone {
        /**
         * IANA Time Zone Database time zone, e.g. "America/New_York".
         */
        id?: string | null;
        /**
         * Optional. IANA Time Zone Database version number, e.g. "2019a".
         */
        version?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        documents: Resource$Projects$Documents;
        locations: Resource$Projects$Locations;
        operations: Resource$Projects$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Documents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * LRO endpoint to batch process many documents. The output is written to Cloud Storage as JSON in the [Document] format.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchProcess(params: Params$Resource$Projects$Documents$Batchprocess, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchProcess(params?: Params$Resource$Projects$Documents$Batchprocess, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        batchProcess(params: Params$Resource$Projects$Documents$Batchprocess, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchProcess(params: Params$Resource$Projects$Documents$Batchprocess, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        batchProcess(params: Params$Resource$Projects$Documents$Batchprocess, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        batchProcess(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Processes a single document.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        process(params: Params$Resource$Projects$Documents$Process, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        process(params?: Params$Resource$Projects$Documents$Process, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDocumentaiV1beta2Document>>;
        process(params: Params$Resource$Projects$Documents$Process, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        process(params: Params$Resource$Projects$Documents$Process, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>, callback: BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>): void;
        process(params: Params$Resource$Projects$Documents$Process, callback: BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>): void;
        process(callback: BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>): void;
    }
    export interface Params$Resource$Projects$Documents$Batchprocess extends StandardParameters {
        /**
         * Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no location is specified, a region will be chosen automatically.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDocumentaiV1beta2BatchProcessDocumentsRequest;
    }
    export interface Params$Resource$Projects$Documents$Process extends StandardParameters {
        /**
         * Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no location is specified, a region will be chosen automatically. This field is only populated when used in ProcessDocument method.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDocumentaiV1beta2ProcessDocumentRequest;
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        documents: Resource$Projects$Locations$Documents;
        operations: Resource$Projects$Locations$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Documents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * LRO endpoint to batch process many documents. The output is written to Cloud Storage as JSON in the [Document] format.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchProcess(params: Params$Resource$Projects$Locations$Documents$Batchprocess, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchProcess(params?: Params$Resource$Projects$Locations$Documents$Batchprocess, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        batchProcess(params: Params$Resource$Projects$Locations$Documents$Batchprocess, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchProcess(params: Params$Resource$Projects$Locations$Documents$Batchprocess, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        batchProcess(params: Params$Resource$Projects$Locations$Documents$Batchprocess, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        batchProcess(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Processes a single document.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        process(params: Params$Resource$Projects$Locations$Documents$Process, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        process(params?: Params$Resource$Projects$Locations$Documents$Process, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDocumentaiV1beta2Document>>;
        process(params: Params$Resource$Projects$Locations$Documents$Process, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        process(params: Params$Resource$Projects$Locations$Documents$Process, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>, callback: BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>): void;
        process(params: Params$Resource$Projects$Locations$Documents$Process, callback: BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>): void;
        process(callback: BodyResponseCallback<Schema$GoogleCloudDocumentaiV1beta2Document>): void;
    }
    export interface Params$Resource$Projects$Locations$Documents$Batchprocess extends StandardParameters {
        /**
         * Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no location is specified, a region will be chosen automatically.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDocumentaiV1beta2BatchProcessDocumentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Documents$Process extends StandardParameters {
        /**
         * Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no location is specified, a region will be chosen automatically. This field is only populated when used in ProcessDocument method.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDocumentaiV1beta2ProcessDocumentRequest;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export {};
}
