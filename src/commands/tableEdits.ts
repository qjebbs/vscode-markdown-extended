import { Command } from './command';
import * as vscode from 'vscode';
import { toggleFormat } from '../services/helpers/toggleFormat';
import { CommandConfig, Commands } from './commands';
import { tablesOf } from '../services/table/documentTables';
import { editTextDocument } from '../services/common/tools';
import { splitColumns } from '../services/table/mdTableParse';

enum editType {
    addRow,
    addColumn,
    deleteRow,
    deleteColumn
}

const cmds: CommandConfig[] = [
    {
        commandId: "markdownExtended.addRowAbove",
        worker: editTable,
        args: [editType.addRow, true]
    },
    {
        commandId: "markdownExtended.addRowBelow",
        worker: editTable,
        args: [editType.addRow, false]
    },
    {
        commandId: "markdownExtended.DeleteRow",
        worker: editTable,
        args: [editType.deleteRow]
    },
    {
        commandId: "markdownExtended.addColumnLeft",
        worker: editTable,
        args: [editType.addColumn, true]
    },
    {
        commandId: "markdownExtended.addColumnRight",
        worker: editTable,
        args: [editType.addColumn, false]
    },
    {
        commandId: "markdownExtended.DeleteColumn",
        worker: editTable,
        args: [editType.deleteColumn]
    },
]

export var commandTableEdits = new Commands(cmds);

function editTable(t: editType, before: boolean) {
    let editor = vscode.window.activeTextEditor;
    let document = editor.document;

    let tables = tablesOf(document);
    if (!tables || !tables.length) return;

    let selection = editor.selection;
    let selectionStartLine = document.lineAt(editor.selection.start.line).range;

    let table = tables.reduce((p, c) => {
        if (p) return p;
        if (c.range.intersection(selectionStartLine))
            return c;
    }, undefined);

    if (!table) return;

    let intersection = table.range.intersection(selection);
    let rowStart = intersection.start.line - table.range.start.line - 2;
    let rowCount = intersection.end.line - intersection.start.line + 1;
    if (!before && t == editType.addRow) rowStart += rowCount;

    let pos = 0;
    let cells = splitColumns(document.getText(selectionStartLine)).map((c, i, ar) => {
        let start = new vscode.Position(editor.selection.start.line, pos);
        let end = new vscode.Position(editor.selection.start.line, pos + c.length);
        pos += c.length + 1; //cell.length + '|'.length
        if ((i == 0 || i == ar.length - 1) && !c.trim()) return undefined;
        return new vscode.Range(start, end);
    }).filter(r => r !== undefined);

    let colStart = -1;
    let colCount = 0;

    cells.map((c, i, ar) => {
        if (c.intersection(selection)) {
            if (colStart < 0) colStart = i;
            colCount++;
        }
    });

    if (!before && t == editType.addColumn) colStart += colCount;

    switch (t) {
        case editType.addRow:
            table.table.addRow(rowStart, rowCount);
            break;
        case editType.deleteRow:
            table.table.deleteRow(rowStart, rowCount);
            break;
        case editType.addColumn:
            table.table.addColumn(colStart, colCount);
            break;
        case editType.deleteColumn:
            table.table.deleteColumn(colStart, colCount);
            break;
        default:
            break;
    }
    editTextDocument(
        editor.document,
        [{
            range: table.range,
            replace: table.table.stringify()
        }]
    );
}