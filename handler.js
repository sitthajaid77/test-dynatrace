const dotenv = require("dotenv");
const redis = require("redis");
dotenv.config({ path: "config.env" });

const opentelemetry = require("@opentelemetry/api");
const tracer = opentelemetry.trace.getTracer("jung-test-01");

const {
  RedisInstrumentation,
} = require("@opentelemetry/instrumentation-redis");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

registerInstrumentations({
  instrumentations: [new RedisInstrumentation()],
});

module.exports.jungtestredisuse = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const span = tracer.startSpan("do some work");
  console.log(span);
  span.setAttribute("foo", "bar");
  span.end();

  try {
    const client = redis.createClient({
      url: process.env.REDIS_LOGIN,
    });

    client.on("error", (err) => console.log("Redis Server Error", err));
    await client.connect();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Log span",
      }),
    };
  } catch (error) {
    console.log("error = " + err);
  }
};
