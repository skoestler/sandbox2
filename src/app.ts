import * as Rx from "rxjs";
import { publish, subscribe } from "./broker.ts";
import { watch } from "./cluster.ts";

setTimeout(() => {
  publish("test", "Hello, world!");
}, 3000);

watch("message").subscribe(console.log);

const [messageObservable, _unsub] = subscribe("test");
console.log("waiting...");
await Rx.lastValueFrom(messageObservable.pipe(Rx.tap(console.log)));
console.log("done.");
