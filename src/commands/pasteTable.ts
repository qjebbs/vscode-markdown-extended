import { Command } from './common';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { convertToMarkdownTable } from '../services/table/convertTable';
import { editTextDocument } from '../services/common/tools';
export class CommandPasteTable extends Command {
    execute() {
        let text = clip.readSync().trim();
        if (!text) return;
        let tableText = convertToMarkdownTable(text);
        if (!tableText) return;
        let editor = vscode.window.activeTextEditor;
        editTextDocument(
            editor.document,
            editor.selection,
            tableText
        );
    }
    constructor() {
        super("markdownExtended.pasteAsTable");
    }
}