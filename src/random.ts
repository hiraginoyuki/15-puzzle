export const chooseIndex = <T>(array: T[], getRandom = () => Math.random()): number => Math.floor(getRandom() * array.length)
export const chooseItem  = <T>(array: T[], getRandom = () => Math.random()): T      => array[chooseIndex(array, getRandom)]
