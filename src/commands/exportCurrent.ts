import { pickExporter, pickFormat } from "../services/exporter/exporters";

import { Command } from './command';
import * as vscode from 'vscode';
import { calculateExportPath } from '../services/common/tools';
import { testMarkdown } from '../services/exporter/shared';
import { MarkdownDocument } from '../services/common/markdownDocument';
import { exportFormat } from "../services/exporter/interfaces";

export class CommandExportCurrent extends Command {
    async execute() {
        if (!testMarkdown()) return;
        let editor = vscode.window.activeTextEditor;
        if (!editor) editor = vscode.window.visibleTextEditors[0];
        if (!editor || !editor.document) {
            vscode.window.showInformationMessage("No document found.");
            return;
        }
        let document = editor.document;
        let doc = new MarkdownDocument(document);
        let format = await pickFormat();
        let exporter = await pickExporter(format);
        if (!exporter) return;
        let fileName = calculateExportPath(document.fileName, format);
        return vscode.window.withProgress(<vscode.ProgressOptions>{
            location: vscode.ProgressLocation.Notification,
            title: `MarkdownExtended: Exporting to ${format}...`
        }, progress => exporter.Export(doc, format, fileName, progress));
    }
    constructor() {
        super("markdownExtended.export");
    }
}

