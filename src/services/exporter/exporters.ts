import * as fs from 'fs';
import * as vscode from 'vscode';
import { config } from '../common/config';
import { ExporterQuickPickItem, exporterType, MarkdownExporter } from './interfaces';
import { PhantomExporter } from './phantomjs';
import { HtmlExporter } from './html';

export async function pickExporter(): Promise<MarkdownExporter> {
    let pick = await vscode.window.showQuickPick<ExporterQuickPickItem>(
        exporters(),
        <vscode.QuickPickOptions>{ placeHolder: "Select an exporter" }
    );
    switch (pick.type) {
        case exporterType.HTML:
            return new HtmlExporter();
        case exporterType.Phantom:
            return new PhantomExporter();
        default:
            return undefined;
    }
}

export function exporters(): ExporterQuickPickItem[] {
    let items: ExporterQuickPickItem[] = [];
    let htmlExporter = <ExporterQuickPickItem>{
        label: "HTML Exporter",
        description: "export to html.",
        type: exporterType.HTML,
    };
    let phantomExporter = <ExporterQuickPickItem>{
        label: "Phantom Exporter",
        description: "export to pdf/png/jpg.",
        detail: "see plugin readme to learn how to config the exporter.",
        type: exporterType.Phantom,
    };
    items.push(htmlExporter);
    if (config.phantomPath && fs.existsSync(config.phantomPath))
        items.push(phantomExporter);
    return items;
}