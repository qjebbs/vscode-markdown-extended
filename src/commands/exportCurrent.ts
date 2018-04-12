import { Command } from './common';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { calculateExportPath } from '../services/common/tools';
import { testMarkdown } from '../services/exporter/shared';
import { phantomExport } from '../services/exporter/phantomjs';
import { MarkdownDocument } from '../services/common/markdownDocument';
import { htmlExport } from '../services/exporter/html';
import { config } from '../services/common/config';

export class CommandExportCurrent extends Command {
    async execute() {
        if (!testMarkdown()) return;
        let document = vscode.window.activeTextEditor.document;
        let doc = new MarkdownDocument(document);
        let format = await vscode.window.showQuickPick(
            exporters(),
            <vscode.QuickPickOptions>{ placeHolder: "Select an exporter" }
        );
        let fileName = "";
        switch (format) {
            case "HTML Exporter":
                fileName = calculateExportPath(document.fileName, "htm");
                htmlExport(doc, fileName);
                vscode.window.showInformationMessage("Export finish.");
                break;
            case "Phantom Exporter":
                fileName = calculateExportPath(document.fileName, doc.meta.phantomConfig.type);
                phantomExport(
                    doc,
                    fileName,
                    () => vscode.window.showInformationMessage("Export finish.")
                );
                break;
            default:
                break;
        }
    }
    constructor() {
        super("markdownExtended.export");
    }
}

function exporters(): string[] {
    let exporters = [
        "HTML Exporter",
    ];
    if (config.phantomPath && fs.existsSync(config.phantomPath)) exporters.push("Phantom Exporter")
    return exporters;
}