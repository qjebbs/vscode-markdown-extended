import * as fs from 'fs';
import * as vscode from 'vscode';
import { config } from '../common/config';
import { ExporterQuickPickItem, exporterType, MarkdownExporter } from './interfaces';
import { PhantomExporter } from './phantomjs';
import { HtmlExporter } from './html';
import { PuppeteerExporter } from './puppeteer';

export async function pickExporter(): Promise<MarkdownExporter> {
    let pick = await vscode.window.showQuickPick<ExporterQuickPickItem>(
        exporters(),
        <vscode.QuickPickOptions>{ placeHolder: "Select an exporter" }
    );
    if (!pick) return undefined;
    switch (pick.type) {
        case exporterType.HTML:
            return new HtmlExporter();
        case exporterType.Puppeteer:
            return new PuppeteerExporter();
        case exporterType.Phantom:
            return new PhantomExporter();
        default:
            return undefined;
    }
}

export function exporters(): ExporterQuickPickItem[] {
    let items: ExporterQuickPickItem[] = [<ExporterQuickPickItem>{
        label: "HTML Exporter",
        description: "export to html.",
        type: exporterType.HTML,
    },
    <ExporterQuickPickItem>{
        label: "Puppeteer Exporter",
        description: "export to pdf/png/jpg.",
        type: exporterType.Puppeteer,
    }];
    let phantomExporter = <ExporterQuickPickItem>{
        label: "Phantom Exporter",
        description: "export to pdf/png/jpg.",
        detail: "see plugin readme to learn how to config the exporter.",
        type: exporterType.Phantom,
    };
    if (config.phantomPath && fs.existsSync(config.phantomPath))
        items.push(phantomExporter);
    return items;
}