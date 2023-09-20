const dotenv = require("dotenv");
const redis = require("redis");
dotenv.config({ path: "config.env" });
const AWS = require("aws-sdk");

const opentelemetry = require("@opentelemetry/api");
const tracer = opentelemetry.trace.getTracer("jog54314");
const axios = require("axios");

AWS.config.update({ region: "ap-southeast-1" });

module.exports.jungtestredisuse = async (event, context, callback) => {
  const span = tracer.startSpan("Start span");

  const lambda = new AWS.Lambda();
  const params = {
    FunctionName:
      "arn:aws:lambda:ap-southeast-1:516577126946:function:dvp-hp-dev-invokeGuestLogin",
    InvocationType: "RequestResponse", // Use 'RequestResponse' for a synchronous invocation
    Payload: JSON.stringify({ key: "value" }), // Input data for the target function
  };

  span.setAttribute("key01", params);
  span.end();

  try {
    const response = await lambda.invoke(params).promise();
    // Handle the response from the target Lambda function
    console.log("Response from target Lambda:", response.Payload);
  } catch (error) {
    console.error("Error invoking Lambda:", error);
  }

  return {
    statusCode: 200,
    body: "TEST",
  };
};
