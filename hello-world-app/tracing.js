const opentelemetry = require("@opentelemetry/sdk-node");
const {
  BasicTracerProvider,
  ConsoleSpanExporter,
  BatchSpanProcessor
} = require("@opentelemetry/tracing");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

const PORT = process.env.PORT || "8080";
const APP = PORT == '8080' ? "A" : "B";

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `hello-world-${APP}`,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: `development`,
    [SemanticResourceAttributes.SERVICE_VERSION]: `0.1`,
  }),
});

const exporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
  headers: {},
})

// export spans to console (useful for debugging)
provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start().then(() => {
  console.log("Tracing initialized");
}).catch((error) => console.log("Error initializing tracing", error));