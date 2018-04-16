import { parseMDTAble } from "./mdTableParse";
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
    static parse(source: string): MDTable {
        return parseMDTAble(source);
    }
    stringify(): string {
        return stringifyMDTable(this);
    }
    addRow(pos: number, count: number) {
        if (pos < 0) return;
        this._data.splice(pos + 1, 0, ...new Array(count).fill(
            new Array(this.columnCount).fill("")
        ));
        this._rowCount += count;
    }
    deleteRow(pos: number, count: number) {
        if (pos < 0) return;
        this._data.splice(pos + 1, count);
        this._rowCount -= count;
    }
    moveRow(start: number, count: number, offset: number) {
        if (start < 0 || count == 0 || offset == 0) return;
        this.moveArray(this._data, start, count, offset);
    }
    moveColumn(start: number, count: number, offset: number) {
        if (start < 0 || count == 0 || offset == 0) return;
        for (let i = 0; i < this._data.length; i++) {
            this.moveArray(this._data[i], start, count, offset);
        }
        this.moveArray(this._aligns, start, count, offset);
        this.moveArray(this._columnWidths, start, count, offset);
    }
    addColumn(pos: number, count: number) {
        if (pos < 0) return;
        for (let i = 0; i < this._data.length; i++) {
            this._data[i].splice(pos, 0, ...new Array(count).fill(""));
        }
        this._aligns.splice(pos, 0, ...new Array(count).fill(TableAlign.auto));
        this._columnWidths.splice(pos, 0, ...new Array(count).fill(1));
        this._columnCount += count;
    }
    deleteColumn(pos: number, count: number) {
        if (pos < 0) return;
        for (let i = 0; i < this._data.length; i++) {
            this._data[i].splice(pos, count)
        }
        this._aligns.splice(pos, count);
        this._columnWidths.splice(pos, count);
        this._columnCount -= count;
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
    private moveArray<T>(arr: T[], start: number, count: number, offset: number): T[] {
        let moving = arr.splice(start, count);
        arr.splice(start + offset, 0, ...moving);
        return arr;
    }
}


