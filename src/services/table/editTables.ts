import * as vscode from 'vscode';
import { tablesOf } from "./documentTables";
import { editType, getTableEdit } from './editTable';
import { editTextDocument } from '../common/tools';


export function editTables(t: editType, before: boolean) {
    let editor = vscode.window.activeTextEditor;
    let document = editor.document;
    let selection = editor.selection;

    let tables = tablesOf(document).filter(t => t.range.intersection(selection));
    if (!tables || !tables.length) return;

    editTextDocument(
        editor.document,
        tables.map(tb => getTableEdit(editor, tb, t, before))
    );
}
