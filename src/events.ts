import { EventEmitter } from 'events'

export class OwnedEventEmitter<T> extends EventEmitter {
  constructor (public readonly owner: T, options?: ConstructorParameters<typeof EventEmitter>[0]) {
    super(options)
  }
}
