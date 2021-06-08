export function notDupe<T>(e: T, i: number, a: T[]) {
    return !a.filter((_, j) => j < i).includes(e);
}
