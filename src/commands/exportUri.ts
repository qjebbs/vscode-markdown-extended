import * as vscode from 'vscode';
import { pickExporter, pickFormat } from "../services/exporter/exporters";
import { testMarkdown } from '../services/exporter/shared';
import { exportOption } from "../services/exporter/interfaces";
import { MarkdownExport } from "../services/exporter/export";
import { showExportReport } from "../services/common/tools";

export async function exportUri(uri: vscode.Uri) {

    if (!testMarkdown()) return;
    let format = await pickFormat();
    if (!format) return;
    let exporter = await pickExporter(format);
    if (!exporter) return;

    return vscode.window.withProgress(
        <vscode.ProgressOptions>{
            location: vscode.ProgressLocation.Notification,
            title: `Markdown Export`
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