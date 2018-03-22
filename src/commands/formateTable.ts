import { Command } from './common';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { convertToMarkdownTable } from '../services/table/convertTable';
import { editTextDocument } from '../services/common/tools';
export class CommandFormateTable extends Command {
    execute() {
        let editor = vscode.window.activeTextEditor;
        let selection = editor.selection;
        let text = editor.document.getText(selection).trim();
        if (!text) {
            vscode.window.showInformationMessage("Please select the table area first.");
            return;
        }
        let tableText = convertToMarkdownTable(text);
        if (!tableText) {
            vscode.window.showInformationMessage("No valid table found.");
            return;
        }
        editTextDocument(
            editor.document,
            editor.selection,
            tableText
        );
    }
    constructor() {
        super("markdownExtended.formateTable");
    }
}