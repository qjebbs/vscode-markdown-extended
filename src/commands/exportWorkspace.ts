import { pickExporter, pickFormat } from "../services/exporter/exporters";

import { Command } from './command';
import * as vscode from 'vscode';
import { testMarkdown } from '../services/exporter/shared';
import { exportOption } from "../services/exporter/interfaces";
import { MarkdownExport } from "../services/exporter/export";

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
                title: `Exporting to ${format}...`
            },
            progress => MarkdownExport(
                uri,
                <exportOption>{
                    exporter: exporter,
                    progress: progress,
                    format: format
                }
            )
        );
    }
    constructor() {
        super("markdownExtended.exportWorkspace");
    }
}
