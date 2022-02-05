import { MapFunc } from './arrays'

export type Key = string | number | symbol

export function fromKeys<K extends Key, V> (keys: K[], callbackfn: MapFunc<K, V>) {
  return Object.assign({}, ...keys.map((key, index) => ({ [key]: callbackfn(key, index, keys) }))) as Record<K, V>
}
