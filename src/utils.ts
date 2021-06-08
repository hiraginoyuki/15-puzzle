export const chooseRandomIndex = <T>(array: T[], randomizer = () => Math.random()): number => Math.floor(randomizer() * array.length);
export const chooseRandom      = <T>(array: T[], randomizer = () => Math.random()): T      => array[chooseRandomIndex(array, randomizer)];

export const flip = <T>(e: T, i: number, a: T[]) => a[a.length - 1 - i];

export function range(end: number): number[];
export function range(start: number, end: number): number[];
export function range(start: number, end: number, step: number): number[];
export function range(...args: number[]): number[] {
  switch (args.length) {
    case 1:
      return range(0, args[0], 1);
    case 2:
      return range(args[0], args[1], 1);
    default:
      const [start, end, step] = args;
      return [...Array(Math.ceil((end - start) / step))].map((v: number, i: number) => start + i * step);
  }
}
