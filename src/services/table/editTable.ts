import * as vscode from 'vscode';
import { DocumentTable } from "./documentTables";
import { splitColumns } from './mdTableParse';
import { Edit, editTextDocument } from '../common/editTextDocument';

export enum editType {
    add,
    delete,
    move,
}

export enum targetType {
    row,
    column,
}

interface SelectedRange {
    range: vscode.Range, // effective rang extracted from selection
    start: number, // start of table column/row
    count: number, // count of table column/row
}

export function editTable(editor: vscode.TextEditor, table: DocumentTable, et: editType, tt: targetType, before: boolean) {
    editTextDocument(
        editor.document,
        [getTableEdit(editor, table, et, tt, before)]
    );
}

export function getTableEdit(editor: vscode.TextEditor, table: DocumentTable, et: editType, tt: targetType, before: boolean): Edit {
    let document = editor.document;
    let selection = editor.selection;
    let offsetLine = 0;
    let offsetCharachter = 0;

    let rng: SelectedRange = undefined;
    if (tt == targetType.row) {
        rng = getSelectedRow(table, selection, et == editType.add ? before : true);
        switch (et) {
            case editType.add:
                offsetLine = before ? rng.count : 0;
                offsetCharachter = 0;
                table.table.addRow(rng.start, rng.count);
                break;
            case editType.delete:
                offsetLine = 0;
                offsetCharachter = 0;
                table.table.deleteRow(rng.start, rng.count);
                break;
            case editType.move:
                offsetLine = before ? -rng.count : rng.count;
                offsetCharachter = 0;
                table.table.moveRow(rng.start, rng.count, before ? -1 : 1);
                break;
            default:
                break;
        }
    }
    else {
        rng = getSelectedColumn(table, selection, et == editType.add ? before : true, document);
        switch (et) {
            case editType.add:
                offsetLine = 0;
                offsetCharachter = before ? 4 * rng.count : 0;
                table.table.addColumn(rng.start, rng.count);
                break;
            case editType.delete:
                offsetLine = 0;
                offsetCharachter = 0;
                table.table.deleteColumn(rng.start, rng.count);
                break;
            case editType.move:
                offsetLine = 0;
                offsetCharachter = 0;
                let offsetCol = table.table.columnWidths[rng.start + (before ? -1 : rng.count)];
                if (offsetCol) {
                    offsetCharachter = before ? -table.table.columnWidths[rng.start - 1] - 3 : table.table.columnWidths[rng.start + rng.count] + 3;
                    table.table.moveColumn(rng.start, rng.count, before ? -1 : 1);
                }
                break;
            default:
                break;
        }
    }
    return <Edit>{
        range: table.range,
        replace: table.table.stringify(),
        selectionOffset: {
            orignal: rng.range,
            offset: {
                line: offsetLine,
                charachter: offsetCharachter,
            }
        }
    }
}

// if not insert, insertBefore should be always true
function getSelectedRow(table: DocumentTable, selection: vscode.Selection, insertBefore: boolean): SelectedRange {
    let rowStart = 0;
    let rowCount = 0;
    let tableBodyRange = new vscode.Range(
        new vscode.Position(table.range.start.line + 2, 0),
        table.range.end
    );
    let intersection = tableBodyRange.intersection(selection);
    if (intersection) {
        rowStart = intersection.start.line - tableBodyRange.start.line;
        rowCount = intersection.end.line - intersection.start.line + 1;
    } else {
        rowStart = 0;
        rowCount = 1;
    }
    if (!insertBefore) rowStart += rowCount;
    return {
        range: intersection,
        start: rowStart,
        count: rowCount,
    }
}

// if not insert, insertBefore should be always true
function getSelectedColumn(table: DocumentTable, selection: vscode.Selection, insertBefore: boolean, document: vscode.TextDocument): SelectedRange {
    let intersectSelection = selection.intersection(table.range);
    let selectionStartLine = document.lineAt(intersectSelection.start.line).range;
    let effectiveRange = intersectSelection.intersection(selectionStartLine);
    let selectionEndLine = document.lineAt(intersectSelection.end.line).range;
    let colStart = -1;
    let colCount = 0;
    let startLineCells = getRowCells(document, selectionStartLine);
    let endLineCells = getRowCells(document, selectionEndLine);
    let selectionStartPoint = new vscode.Range(intersectSelection.start, intersectSelection.start);
    let selectionEndPoint = new vscode.Range(intersectSelection.end, intersectSelection.end);

    startLineCells.map((c, i, ar) => {
        if (c.intersection(selection)) {
            if (colStart < 0) colStart = i;
            colCount++;
        }
    });

    // let colEnd = -1;
    // for (let i = 0; i < startLineCells.length; i++) {
    //     if (startLineCells[i].intersection(selectionStartPoint)) {
    //         colStart = i;
    //         break;
    //     }
    // }
    // for (let i = 0; i < endLineCells.length; i++) {
    //     if (endLineCells[i].intersection(selectionEndPoint)) {
    //         if (i > colStart) {
    //             colEnd = i;
    //         } else {
    //             colEnd = colStart;
    //             colStart = i;
    //         }
    //         break;
    //     }
    // }
    // colCount = colEnd - colStart + 1;

    if (!insertBefore) colStart += colCount;
    return {
        range: effectiveRange,
        start: colStart,
        count: colCount,
    }
}

function getRowCells(document: vscode.TextDocument, line: vscode.Range): vscode.Range[] {
    let pos = 0;
    return splitColumns(document.getText(line)).map((c, i, ar) => {
        let start = new vscode.Position(line.start.line, pos);
        let end = new vscode.Position(line.start.line, pos + c.length);
        pos += c.length + 1; //cell.length + '|'.length
        if ((i == 0 || i == ar.length - 1) && !c.trim()) return undefined;
        return new vscode.Range(start, end);
    }).filter(r => r !== undefined);
}