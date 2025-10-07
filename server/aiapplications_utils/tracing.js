const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  OTLPTraceExporter,
} = require("@google-cloud/opentelemetry-cloud-trace-exporter");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

// The trace exporter sends data to Google Cloud Trace.
const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  traceExporter,
  // Automatically instrument popular libraries
  instrumentations: [getNodeAutoInstrumentations()],
  // You can add a serviceName to identify this application in Cloud Trace
  serviceName: "anything-llm-backend",
});

sdk.start();

console.log("OpenTelemetry tracing initialized.");

// Graceful shutdown
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated."))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
