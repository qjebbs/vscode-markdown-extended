import * as fs from 'fs';
import * as vscode from 'vscode';
import { config } from '../common/config';
import { ExporterQuickPickItem, exporterType, MarkdownExporter, exportFormat, FormatQuickPickItem } from './interfaces';
import { phantomExporter } from './phantomjs';
import { htmlExporter } from './html';
import { puppeteerExporter } from './puppeteer';

export async function pickFormat(): Promise<exportFormat> {
    let items = [
        <FormatQuickPickItem>{
            label: "Self-contained HTML",
            // description: "Export to self-contained HTML.",
            format:exportFormat.HTML,
        },
        <FormatQuickPickItem>{
            label: "PDF File",
            // description: "Export to PDF.",
            format:exportFormat.PDF,
        },
        <FormatQuickPickItem>{
            label: "PNG Image",
            // description: "Export to PNG image.",
            format:exportFormat.PNG,
        },
        <FormatQuickPickItem>{
            label: "JPG Image",
            // description: "Export to jpg image.",
            format:exportFormat.JPG,
        }
    ];
    let pick = await vscode.window.showQuickPick<FormatQuickPickItem>(
        items,
        <vscode.QuickPickOptions>{ placeHolder: `Select export format...` }
    );
    if (!pick) return undefined;
    return pick.format;
}

export async function pickExporter(format: exportFormat): Promise<MarkdownExporter> {
    let availableExporters = getAvailableExporters(format);
    if (availableExporters.length == 1) return availableExporters[0].exporter;
    let pick = await vscode.window.showQuickPick<ExporterQuickPickItem>(
        availableExporters,
        <vscode.QuickPickOptions>{ placeHolder: `Select an exporter to export ${format}...` }
    );
    if (!pick) return undefined;
    return pick.exporter;
}

function getAvailableExporters(format: exportFormat): ExporterQuickPickItem[] {
    let items: ExporterQuickPickItem[] = [];

    if (htmlExporter.FormatAvailable(format)) items.push(
        <ExporterQuickPickItem>{
            label: "HTML Exporter",
            description: "export to html.",
            exporter: htmlExporter,
        }
    );
    if (puppeteerExporter.FormatAvailable(format)) items.push(
        <ExporterQuickPickItem>{
            label: "Puppeteer Exporter",
            description: "export to pdf/png/jpg.",
            exporter: puppeteerExporter,
        }
    );
    if (phantomExporter.FormatAvailable(format) && config.phantomPath && fs.existsSync(config.phantomPath))
        items.push(
            <ExporterQuickPickItem>{
                label: "Phantom Exporter",
                description: "export to pdf/png/jpg.",
                detail: "see plugin readme to learn how to config the exporter.",
                exporter: phantomExporter,
            });
    return items;
}