import { OwnedEventEmitter } from './events';
export interface TapData {
    time: number;
    delta: number;
    x: number;
    y: number;
    index: number;
    piece: number;
    movedPieces: MovedPiece[];
}
export interface MovedPiece {
    index: number;
    id: number;
}
interface ToStringOptions {
    marginWidth?: number;
    marginHeight?: number;
    color?: number;
}
export declare class Puzzle extends Array<number> {
    readonly events: OwnedEventEmitter<Puzzle>;
    readonly width: number;
    readonly height: number;
    taps: TapData[];
    constructor(pieces: number[], width: number);
    protected _2d: number[][] | null;
    to2d(): number[][];
    clone(): Puzzle;
    readonly timeGenerated: number;
    get timeStarted(): number | null;
    get timeSolved(): number | null;
    protected _isSolvable: boolean | null;
    protected _isSolving: boolean | null;
    protected _isSolved: boolean | null;
    isSolvable(): boolean;
    isSolving(): boolean;
    isSolved(): boolean;
    checkSolvable(): boolean;
    checkSolving(): boolean;
    checkSolved(): boolean;
    toString({ marginWidth, marginHeight, color }?: ToStringOptions): string;
    set(x: number, y: number, piece: number): this;
    tap(x: number, y: number): TapData | null;
}
export {};
