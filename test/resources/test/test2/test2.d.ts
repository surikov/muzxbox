type BalsRow = {
    balls: number[];
    key: string;
};
declare let cellCount: number;
declare let ballCount: number;
declare let dataRows2: BalsRow[];
type CellLevel = {
    ball: number;
    volume: number;
    exists: boolean;
};
declare function t2(nn: number): string;
declare function levelCountEmpty(data: BalsRow[], fromRow: number, ball: number, step: number): number;
declare function rowCountEmpty(data: BalsRow[], fromRow: number, step: number): CellLevel[];
declare function ballExistsInRow(ball: number, row: BalsRow): boolean;
declare function dumpLevels(row0: number, data: BalsRow[], len: number, stepsize: number, firstlong: string[], lastshort: string[]): void;
declare function dumpLevelsCounts(counts: number[]): void;
declare function start2(): void;
