/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class OwnedEventEmitter<T> extends EventEmitter {
    readonly owner: T;
    constructor(owner: T, options?: ConstructorParameters<typeof EventEmitter>[0]);
}
