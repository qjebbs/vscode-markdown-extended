import { MDTable, TableAlign } from "./mdTable";
const _ALIGN: boolean = true;
export function stringifyMDTable(table: MDTable): string {
    const ALIGN = true;
    let rows = table.data.map(row => stringifyRow(row, table.columnWidths));
    let header = rows.shift();
    let Sep = stringifyHeaderSeperator(table);
    return header + '\n'
        + Sep + '\n'
        + rows.join('\n');
}

function stringifyHeaderSeperator(table: MDTable): string {
    let colCount = table.data[0].length;
    let str = [...Array(colCount).keys()].reduce((p, i) => {
        let sepCell = "";
        let columnWidth = table.columnWidths[i];
        switch (table.aligns[i]) {
            case TableAlign.center:
                sepCell = ":" + "-".repeat(_ALIGN ? columnWidth : 0) + ":";
                break;
            case TableAlign.left:
                sepCell = ":" + "-".repeat((_ALIGN ? columnWidth : 0) + 1);
                break;
            case TableAlign.right:
                sepCell = "-".repeat((_ALIGN ? columnWidth : 0) + 1) + ":";
                break;
            case TableAlign.auto:
            default:
                sepCell = "-".repeat((_ALIGN ? columnWidth : 0) + 2);
                break;
        }
        return p + sepCell + "|";
    }, "|");
    return str.trim();
}
function stringifyRow(row: string[], columnWidths: number[]): string {
    const SPACE = " ";
    let str = row.reduce((p, c, i) => {
        return p + c + SPACE.repeat(_ALIGN ? columnWidths[i] - c.length : 0) + " | ";
    }, "| ");
    return str.trim();
}