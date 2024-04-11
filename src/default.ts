import { ethereum } from "@graphprotocol/graph-ts";

export function handleDefault(event: Default): void {}

export class Default extends ethereum.Event {
}
