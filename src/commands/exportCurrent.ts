import * as vscode from 'vscode';
import { Command } from './command';
import { exportUri } from './exportUri';

export class CommandExportCurrent extends Command {
    async execute() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) editor = vscode.window.visibleTextEditors[0];
        if (!editor || !editor.document) {
            vscode.window.showInformationMessage("No document found.");
            return;
        }
        exportUri(editor.document.uri);
    }
    constructor() {
        super("markdownExtended.export");
    }
}

