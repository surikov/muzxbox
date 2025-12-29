declare type BalsRow = {
    balls: number[];
    key: string;
};
declare let cellCount: number;
declare let ballCount: number;
declare let data2: BalsRow[];
declare type CellLevel = {
    ball: number;
    volume: number;
    exists: boolean;
};
declare function t2(nn: number): string;
declare function levelCountEmpty(fromRow: number, ball: number, step: number): number;
declare function rowCountEmpty(fromRow: number, step: number): CellLevel[];
declare function ballExistsInRow(ball: number, row: BalsRow): boolean;
declare function dumpRows(firstRow: number, len: number): void;
declare function start2(): void;
