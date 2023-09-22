const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const {
  RedisInstrumentation,
} = require("@opentelemetry/instrumentation-redis");

registerInstrumentations({
  instrumentations: [new RedisInstrumentation()],
});
const redis = require("redis");

// Register the Redis instrumentation

module.exports.jungtestredisuse = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log("Before createClient !");

  const client = redis.createClient({
    url: process.env.REDIS_LOGIN,
  });

  console.log("After createClient !");

  client.on("error", (err) => console.log("Redis Server Error", err));

  await client.connect();

  console.log("After client.on !");

  const data = await client.get("66699930228");

  // Rest of your Lambda function code
  const reponse = {
    statusCode: 200,
    body: JSON.stringify(data),
  };
  return reponse;
};
