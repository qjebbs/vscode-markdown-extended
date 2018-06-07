import { pickExporter } from "../services/exporter/exporters";

import { Command } from './command';
import * as vscode from 'vscode';
import { calculateExportPath } from '../services/common/tools';
import { testMarkdown } from '../services/exporter/shared';
import { MarkdownDocument } from '../services/common/markdownDocument';
import { exportFormate } from "../services/exporter/interfaces";

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
        let exporter = await pickExporter();
        if (!exporter) return;
        let formate = exportFormate.PDF;
        let fileName = calculateExportPath(document.fileName, formate);
        exporter.Export(doc, formate, fileName).then(
            () => vscode.window.showInformationMessage("Export finish.")
        );
    }
    constructor() {
        super("markdownExtended.export");
    }
}

