import { Command } from './common';
import * as vscode from 'vscode';
import { exportHTML, exportPDF, exportFormats } from '../exporter/exportFile';
import { calculateExportPath } from '../common/tools';

export class CommandExportCurrent extends Command {
    async execute() {
        let document = vscode.window.activeTextEditor.document;
        let format = await vscode.window.showQuickPick(exportFormats);
        switch (format) {
            case "HTML":
                exportHTML(document, calculateExportPath(document.fileName, format));
                finishMsg();
                break;
            case "PDF":
                exportPDF(document, calculateExportPath(document.fileName, format), finishMsg)
                break;
        }
        function finishMsg() {
            vscode.window.showInformationMessage("Export finish.");
        }

    }
    constructor() {
        super("markdownExtended.export");
    }
}