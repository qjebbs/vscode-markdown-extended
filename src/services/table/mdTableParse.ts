import { MDTable, TableAlign } from "./mdTable";

export function parseMDTAble(source: string): MDTable {
    let lines = source.replace(/\r?\n/g, "\n").split("\n");
    if (lines.length < 2) return undefined; //should have at least two line
    let header = lines.shift();
    let sepLine = lines.shift();
    lines.unshift(header);
    let sepRow = getColumns(sepLine);
    if (!testSepRow(sepRow)) return undefined;
    let data = lines.map(line => getColumns(line));
    let table = new MDTable(data);
    let aligns = parseAlins(sepRow);
    if (table.columnCount > aligns.length)
        aligns.push(...new Array(table.columnCount - aligns.length).fill(TableAlign.auto));
    table.aligns = aligns;
    return table;
}

export function splitColumns(line: string): string[] {
    let cells: string[] = [];
    let start = 0;
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
    cells.push(line.substring(start, line.length));
    return cells;
}

function getColumns(line: string): string[] {
    let cells = splitColumns(line).map(c => c.trim());
    if (!cells[0].trim()) cells.shift();
    if (cells.length && !cells[cells.length - 1].trim()) cells.pop();
    return cells;
}
function testSepRow(row: string[]): boolean {
    return row.reduce((p, c) => {
        if (!p) return false;
        return /:?-+:?/i.test(c);
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