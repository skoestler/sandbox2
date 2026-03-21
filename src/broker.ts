import * as Rx from "rxjs";
import {type Msg} from "nats";
import {connectionPromise} from "./nats_connection.ts";

export interface Message {
	data: string;
}

export const subscribe = (
	topic: string,
): [Rx.Observable<Message>, () => void] => {
	let cancelled = false;
	let unsub: (() => void) | null = null;
	const cancel = () => {
		cancelled = true;
		if (unsub) unsub();
	};

	const observable = Rx.from(connectionPromise).pipe(
		Rx.mergeMap((connection) => {
			if (cancelled) {
				return Rx.EMPTY;
			} else {
				const sub = connection.subscribe(topic);
				unsub = () => sub.unsubscribe();
				return Rx.from(sub);
			}
		}),
		Rx.map(convertMessage),
	);

	return [observable, cancel];
};

export const publish = async (topic: string, data: string): Promise<void> => {
	const connection = await connectionPromise;
	connection.publish(topic, data);
};

function convertMessage(message: Msg): Message {
	return {
		data: message.data.toString(),
	};
}
