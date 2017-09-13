import { Command } from './common';
import * as vscode from 'vscode';
import { exportFile } from '../exporter/exportFile';
import { calculateExportPath } from '../common/tools';

export class CommandExportCurrent extends Command {
    execute() {
        let document = vscode.window.activeTextEditor.document;
        exportFile(document, calculateExportPath(document.fileName));
        vscode.window.showInformationMessage("Export finish.");
    }
    constructor() {
        super("markdownExtended.export");
    }
}