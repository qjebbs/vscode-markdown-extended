import { stringifyMDTable } from "./mdTableStringify";

export enum TableAlign {
    auto,
    left,
    center,
    right,
}
export class MDTable {
    private _data: string[][];
    private _aligns: TableAlign[];
    private _columnWidths: number[];
    private _columnCount: number;
    private _rowCount: number;

    constructor(data: string[][]) {
        this.data = data;
    }
    public get data(): string[][] {
        return this._data;
    }
    public set data(data: string[][]) {
        this._data = data;
        this._rowCount = this._data.length;
        this.alignColumns();
        this._columnWidths = this.calcColumnWidths();
        this._aligns = data[0].map(() => TableAlign.auto);
    }
    public get columnCount(): number {
        return this._columnCount;
    }
    public get rowCount(): number {
        return this._rowCount;
    }
    public get aligns(): TableAlign[] {
        return this._aligns;
    }
    public set aligns(aligns: TableAlign[]) {
        if (this._data[0].length !== aligns.length)
            throw new Error("Align settings count and column count mismatch!");
        this._aligns = aligns;
    }
    public get columnWidths(): number[] {
        return this._columnWidths;
    }
    stringify(): string {
        return stringifyMDTable(this);
    }
    private calcColumnWidths(): number[] {
        return [...Array(this._data[0].length).keys()].map(
            i => {
                let ws = this._data.map(
                    row => i > row.length - 1 ? 0 : row[i].length
                );
                let mx = Math.max(...ws);
                return mx < 1 ? 1 : mx;
            }
        );
    }
    private alignColumns() {
        this._columnCount = Math.max(...this._data.map(row => row.length));
        this._data.map(row => {
            if (row.length < this._columnCount)
                row.push(...new Array(this._columnCount - row.length).fill(""));
        });
    }
}


