import { Command } from './command';
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
        let format = await vscode.window.showQuickPick<ExporterQuickPickItem>(
            exporters(),
            <vscode.QuickPickOptions>{ placeHolder: "Select an exporter" }
        );
        if (!format) return;
        let fileName = "";
        switch (format.type) {
            case exporterType.HTML:
                fileName = calculateExportPath(document.fileName, "htm");
                htmlExport(doc, fileName);
                vscode.window.showInformationMessage("Export finish.");
                break;
            case exporterType.Phantom:
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

enum exporterType {
    HTML,
    Phantom,
}

interface ExporterQuickPickItem extends vscode.QuickPickItem {
    type: exporterType;
}

function exporters(): ExporterQuickPickItem[] {
    let items: ExporterQuickPickItem[] = [];
    let htmlExporter = <ExporterQuickPickItem>{
        label: "HTML Exporter",
        description: "export to html.",
        type: exporterType.HTML,
    }
    let phantomExporter = <ExporterQuickPickItem>{
        label: "Phantom Exporter",
        description: "export to pdf/png/jpg.",
        detail: "see plugin readme to learn how to config the exporter.",
        type: exporterType.Phantom,
    }
    items.push(htmlExporter);
    if (config.phantomPath && fs.existsSync(config.phantomPath)) items.push(phantomExporter)
    return items;
}