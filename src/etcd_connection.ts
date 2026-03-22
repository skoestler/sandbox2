import { watch } from "node:fs";
import { Etcd3 } from "etcd3";

const { ETCD_HOSTS } = process.env;
if (!ETCD_HOSTS) throw new Error("ETCD_HOSTS is not set");

export const connection = new Etcd3({ hosts: ETCD_HOSTS });

watch(import.meta.filename, () => {
  console.log(
    `File changed, exiting process because ${import.meta.filename} does not support HMR.`,
  );
  process.exit(0);
});
