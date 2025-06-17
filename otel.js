const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-http");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { resourceFromAttributes } = require("@opentelemetry/resources");
const { PeriodicExportingMetricReader, ConsoleMetricExporter } = require("@opentelemetry/sdk-metrics");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = require("@opentelemetry/semantic-conventions");

// Define the metric exporter and reader
const metricExporter = new OTLPMetricExporter({
  url: 'http://server.itslgit.com:4318/v1/metrics',
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 1000, // Export every second
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'lightyears-cdc-backend',
    [ATTR_SERVICE_VERSION]: '1.0',
  }),
    traceExporter: new OTLPTraceExporter({ url: 'http://server.itslgit.com:4318/v1/traces' }),
  // metricExporter: new OTLPMetricExporter({ url: 'http://server.itslgit.com:4318/v1/metrics' }),
  metricReader: metricReader,
  logExporter: new OTLPLogExporter({ url: 'http://server.itslgit.com:4318/v1/logs' }),
  instrumentations: [getNodeAutoInstrumentations()]
})
sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((err) => console.error('Error terminating tracing', err))
    .finally(() => process.exit(0));
});