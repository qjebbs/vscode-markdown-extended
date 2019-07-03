import { MDTable, TableAlign } from "./mdTable";
import { MonoSpaceLength } from "./monospace";
export function stringifyMDTable(table: MDTable, compact?: boolean, padding?: number): string {
    padding = padding || 1;
    let rows = table.data.map((row, i) => stringifyRow(row, table.columnWidths, table.aligns, table.rowMergeFlags[i], compact, padding));
    let Sep = stringifyHeaderSeperator(table, compact, padding);
    rows.splice(table.headerRowCount, 0, Sep);
    return rows.join('\n');
}

function stringifyHeaderSeperator(table: MDTable, compact: boolean, padding: number): string {
    let colCount = table.data[0].length;
    return [...Array(colCount).keys()].reduce(
        (p, i) => p + formatHeaderCell(table.aligns[i], table.columnWidths[i], compact, padding) + "|"
        , "|"
    );
}
function stringifyRow(row: string[], columnWidths: number[], aligns: TableAlign[], merged: boolean, compact: boolean, padding: number): string {
    return row.reduce((p, c, i) => {
        let splittor = (i == row.length - 1 && merged) ? '\\' : '|';
        if (c === null) return p + splittor;
        // current col width
        let width = columnWidths[i];
        let idx = i + 1;
        // try to add merged cells' width
        while (row[idx] === null) {
            width += columnWidths[idx] + padding * 2;
            idx++;
        }
        return p + (compact ? c : formatCell(c, width, aligns[i], padding)) + splittor;
    }, "|");
}
function formatHeaderCell(align: TableAlign, columnWidth: number, compact: boolean, padding: number) {
    switch (align) {
        case TableAlign.center:
            if (compact) return ":-:";
            return addPadding(":" + "-".repeat(columnWidth - 2) + ":", padding, padding);
        case TableAlign.left:
            if (compact) return ":-";
            return addPadding(":" + "-".repeat(columnWidth - 1), padding, padding);
        case TableAlign.right:
            if (compact) return "-:";
            return addPadding("-".repeat(columnWidth - 1) + ":", padding, padding);
        case TableAlign.auto:
        default:
            if (compact) return "-";
            return addPadding("-".repeat(columnWidth), padding, padding);
    }
}
function formatCell(cell: string, width: number, align: TableAlign, padding: number): string {
    let leftPadding = padding;
    let rightPadding = padding;
    switch (align) {
        case TableAlign.center:
            leftPadding += ~~((width - MonoSpaceLength(cell)) / 2);
            rightPadding += ~~((width - MonoSpaceLength(cell)) / 2);
            if (leftPadding + rightPadding != width - MonoSpaceLength(cell) + padding * 2) rightPadding += 1;
            break;
        case TableAlign.left:
            rightPadding += (width - MonoSpaceLength(cell));
            break;
        case TableAlign.right:
            leftPadding += (width - MonoSpaceLength(cell));
            break;
        case TableAlign.auto:
        default:
            rightPadding += (width - MonoSpaceLength(cell));
            break;
    }
    return addPadding(cell.trim(), leftPadding, rightPadding);
}

function addPadding(cell: string, left: number, right: number): string {
    const SPACE = " ";
    return SPACE.repeat(left) + cell.trim() + SPACE.repeat(right);
}