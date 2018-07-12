import { pickExporter, pickFormat } from "../services/exporter/exporters";

import { Command } from './command';
import * as vscode from 'vscode';
import { testMarkdown } from '../services/exporter/shared';
import { exportOption } from "../services/exporter/interfaces";
import { MarkdownExport } from "../services/exporter/export";
import { showExportReport } from "../services/common/tools";

export class CommandExportWorkSpace extends Command {
    async execute(uri) {
        if (!testMarkdown()) return;
        let format = await pickFormat();
        if (!format) return;
        let exporter = await pickExporter(format);
        if (!exporter) return;

        return vscode.window.withProgress(
            <vscode.ProgressOptions>{
                location: vscode.ProgressLocation.Notification,
                title: `Exporting`
            },
            progress => MarkdownExport(
                uri,
                <exportOption>{
                    exporter: exporter,
                    progress: progress,
                    format: format
                }
            )
        ).then(report => showExportReport(report));
    }
    constructor() {
        super("markdownExtended.exportWorkspace");
    }
}
