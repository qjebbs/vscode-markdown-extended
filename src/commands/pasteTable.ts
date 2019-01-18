import { Command } from './command';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { convertToMarkdownTable } from '../services/table/convertTable';
import { editTextDocument } from '../services/common/editTextDocument';
export class CommandPasteTable extends Command {
    execute() {
        let text = clip.readSync().trim();
        if (!text) return;
        let tableText = convertToMarkdownTable(text);
        if (!tableText) return;
        let editor = vscode.window.activeTextEditor;
        return editTextDocument(
            editor.document, [{
                range: editor.selection,
                replace: tableText
            }]
        );
    }
    constructor() {
        super("markdownExtended.pasteAsTable");
    }
}