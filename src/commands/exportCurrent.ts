import { Command } from './common';
import * as vscode from 'vscode';
import { exportFormats, exportFile, testMarkdown } from '../services/exporter/exportFile';
import { calculateExportPath } from '../services/common/tools';

export class CommandExportCurrent extends Command {
    async execute() {
        if(!testMarkdown()) return;
        let document = vscode.window.activeTextEditor.document;
        let format = await vscode.window.showQuickPick(exportFormats());
        let fileName = calculateExportPath(document.fileName, format);
        exportFile(
            document,
            format,
            fileName,
            () => vscode.window.showInformationMessage("Export finish.")
        );
    }
    constructor() {
        super("markdownExtended.export");
    }
}