import * as Rx from "rxjs";
import { connection } from "./etcd_connection.ts";

export const get = (key: string): Promise<string | null> => {
  return connection.get(key).string();
};

export const set = (key: string, value: string): Promise<unknown> => {
  return connection.put(key).value(value).exec();
};

export interface WatchEvent {
  event: string;
  data: string;
}

export const watch = (key: string): Rx.Observable<WatchEvent> => {
  return new Rx.Observable((subscriber) => {
    connection
      .watch()
      .key(key)
      .create()
      .then((watcher) => {
        watcher.on("put", (res) => {
          subscriber.next({ event: "put", data: res.value.toString() });
        });
        watcher.on("error", (err) => subscriber.error(err));
        watcher.on("disconnected", () =>
          subscriber.error(new Error("Watcher disconnected")),
        );
        watcher.on("end", () => subscriber.complete());
      });
  });
};
