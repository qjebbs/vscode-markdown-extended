import { Command } from './common';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { convertToMarkdownTable, RangeEdit } from '../services/table/convertTable';

export class CommandPasteTable extends Command {
    execute() {
        let text = clip.readSync().trim();
        if (!text) return;
        let tableText = convertToMarkdownTable(text);
        if (!tableText) return;
        let editor = vscode.window.activeTextEditor;
        applyEdit(
            editor.document,
            <RangeEdit>{
                range: editor.selection,
                newText: tableText,
            }
        );
    }
    constructor() {
        super("markdownExtended.pasteAsTable");
    }
}

async function applyEdit(document: vscode.TextDocument, edit: RangeEdit) {
    let editor = await vscode.window.showTextDocument(document);
    editor.edit(e => {
        e.replace(edit.range, edit.newText);
    })
}