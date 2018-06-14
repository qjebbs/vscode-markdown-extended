import { MDTable, TableAlign } from "./mdTable";
export function stringifyMDTable(table: MDTable, compact?: boolean, padding?: number): string {
    padding = padding || 1;
    let rows = table.data.map(row => stringifyRow(row, table.columnWidths, table.aligns, compact, padding));
    let header = rows.shift();
    let Sep = stringifyHeaderSeperator(table, compact, padding);
    return header + '\n'
        + Sep + '\n'
        + rows.join('\n');
}

function stringifyHeaderSeperator(table: MDTable, compact: boolean, padding: number): string {
    let colCount = table.data[0].length;
    return [...Array(colCount).keys()].reduce(
        (p, i) => p + formatHeaderCell(table.aligns[i], table.columnWidths[i], compact, padding) + "|"
        , "|"
    );
}
function stringifyRow(row: string[], columnWidths: number[], aligns: TableAlign[], compact: boolean, padding: number): string {
    return row.reduce((p, c, i) => {
        return p + (compact ? c : formatCell(c, columnWidths[i], aligns[i], padding)) + "|";
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
            leftPadding += ~~((width - cell.length) / 2);
            rightPadding += ~~((width - cell.length) / 2);
            if (leftPadding + rightPadding != width - cell.length + padding * 2) rightPadding += 1;
            break;
        case TableAlign.left:
            rightPadding += (width - cell.length);
            break;
        case TableAlign.right:
            leftPadding += (width - cell.length);
            break;
        case TableAlign.auto:
        default:
            rightPadding += (width - cell.length);
            break;
    }
    return addPadding(cell.trim(), leftPadding, rightPadding);
}

function addPadding(cell: string, left: number, right: number): string {
    const SPACE = " ";
    return SPACE.repeat(left) + cell.trim() + SPACE.repeat(right);
}