import { watch } from "node:fs";
import { connect, type NatsConnection } from "nats";

export const connectionPromise: Promise<NatsConnection> = connect({
  servers: process.env.NATS_URL,
});

watch(import.meta.filename, () => {
  console.log(
    `File changed, exiting process because ${import.meta.filename} does not support HMR.`,
  );
  process.exit(0);
});
