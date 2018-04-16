import * as vscode from 'vscode';
import { DocumentTable } from "./documentTables";
import { splitColumns } from './mdTableParse';
import { RangeReplace, editTextDocument } from '../common/tools';

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
    start: number,
    count: number,
}

export function editTable(editor: vscode.TextEditor, table: DocumentTable, et: editType, tt: targetType, before: boolean) {
    editTextDocument(
        editor.document,
        [getTableEdit(editor, table, et, tt, before)]
    );
}

export function getTableEdit(editor: vscode.TextEditor, table: DocumentTable, et: editType, tt: targetType, before: boolean): RangeReplace {
    let document = editor.document;
    let selection = editor.selection;

    let rng: SelectedRange = undefined;
    if (tt == targetType.row) {
        rng = getSelectedRow(table, selection, et == editType.add ? before : true);
        switch (et) {
            case editType.add:
                table.table.addRow(rng.start, rng.count);
                break;
            case editType.delete:
                table.table.deleteRow(rng.start, rng.count);
                break;
            case editType.move:
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
                table.table.addColumn(rng.start, rng.count);
                break;
            case editType.delete:
                table.table.deleteColumn(rng.start, rng.count);
                break;
            case editType.move:
                table.table.moveColumn(rng.start, rng.count, before ? -1 : 1);
                break;
            default:
                break;
        }
    }
    return <RangeReplace>{
        range: table.range,
        replace: table.table.stringify(),
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
        start: rowStart,
        count: rowCount,
    }
}

// if not insert, insertBefore should be always true
function getSelectedColumn(table: DocumentTable, selection: vscode.Selection, insertBefore: boolean, document: vscode.TextDocument): SelectedRange {
    let intersectSelection = selection.intersection(table.range);
    let selectionStartLine = document.lineAt(intersectSelection.start.line).range;
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