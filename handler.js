const dotenv = require("dotenv");
const redis = require("redis");
dotenv.config({ path: "config.env" });

const opentelemetry = require("@opentelemetry/api");
const axios = require("axios");

module.exports.jungtestredisuse = async (event, context, callback) => {
  try {
    const tracer = opentelemetry.trace.getTracer("jungtest01");

    const span = tracer.startSpan("HTTP Request to Google");

    const response = await axios.get("https://www.google.com");

    if (response.status === 200) {
      const responseBody = response.data;

      span.end();

      return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
      };
    } else {
      span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });

      return {
        statusCode: response.status,
        body: "HTTP Request Failed",
      };
    }
  } catch (error) {
    console.error("Error:", error);

    // If there's an error, end the span with an error status
    span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });

    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
