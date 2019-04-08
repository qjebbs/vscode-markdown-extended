import { MDTable, TableAlign } from "./mdTable";

export function parseMDTAble(source: string): MDTable {
    let lines = source.replace(/\r?\n/g, "\n").split("\n");
    if (lines.length < 2) return undefined; //should have at least two line
    let data = lines.map(line => getColumns(line));
    let headerRowCount = 0;
    let sepRowCells: string[];
    // find and extract header seprator row.
    for (let i = 0; i < lines.length; i++) {
        if (testSepRow(data[i])) {
            headerRowCount = i;
            sepRowCells = data.splice(i, 1)[0]
            break;
        }
    }
    if (!headerRowCount) return undefined;

    let table = new MDTable(data, headerRowCount);
    let aligns = parseAlins(sepRowCells);
    if (table.columnCount > aligns.length)
        aligns.push(...new Array(table.columnCount - aligns.length).fill(TableAlign.auto));
    table.aligns = aligns;
    let mergeFlags = lines.map(line => line.trim().endsWith('\\'));
    mergeFlags.splice(headerRowCount, 1);
    table.rowMergeFlags = mergeFlags;
    return table;
}

export function splitColumns(line: string): string[] {
    let cells: string[] = [];
    let start = 0;
    line = line.trim();
    for (let i = 0; i < line.length; i++) {
        let chr = line.substr(i, 1);
        if (chr == '\\') {
            i++;
            continue;
        } else if (chr == '|') {
            cells.push(line.substring(start, i));
            start = i + 1;
        }
    }
    // merged rows use '\' as end row seprator
    if (line.substr(line.length - 1, 1) == '\\') {
        cells.push(line.substring(start, line.length - 1));
        start = line.length;
    }
    cells.push(line.substring(start, line.length));
    return cells;
}

function getColumns(line: string): string[] {
    let cells = splitColumns(line);
    if (!cells[0].trim()) cells.shift();
    if (cells.length && !cells[cells.length - 1].trim()) cells.pop();
    return cells.map(c => c ? c.trim() : null);
}
function testSepRow(row: string[]): boolean {
    return row.reduce((p, c) => {
        if (!p) return false;
        return !!c && /^:?[-=]+:?$/i.test(c.trim());
    }, true);
}
function parseAlins(row: string[]): TableAlign[] {
    return row.map(c => {
        let str = c.trim();
        let left = str.substr(0, 1) == ":";
        let right = str.substr(str.length - 1, 1) == ":";
        if (left && right) return TableAlign.center;
        if (left) return TableAlign.left;
        if (right) return TableAlign.right;
        return TableAlign.auto;
    });
}