import { Command } from './common';
import * as vscode from 'vscode';
import { exportFormats, exportFile } from '../exporter/exportFile';
import { calculateExportPath } from '../common/tools';

export class CommandExportCurrent extends Command {
    async execute() {
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