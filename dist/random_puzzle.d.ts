import { Puzzle } from './puzzle';
declare type Args = [] | [number] | [number, number] | [string] | [string, number] | [string, number, number];
export declare class RandomPuzzle extends Puzzle {
    seed: string;
    constructor(pieces: number[], width: number, seed: string);
    clone(): RandomPuzzle;
    protected static _parseArgs(args: Args): readonly [string, number, number];
    static generate(): RandomPuzzle;
    static generate(size: number): RandomPuzzle;
    static generate(width: number, height: number): RandomPuzzle;
    static generate(seed: string): RandomPuzzle;
    static generate(seed: string, size: number): RandomPuzzle;
    static generate(seed: string, width: number, height: number): RandomPuzzle;
}
export {};
