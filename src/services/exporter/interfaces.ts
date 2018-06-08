import * as vscode from 'vscode';
import { MarkdownDocument } from '../common/markdownDocument';

export enum exportFormat {
    PDF = "pdf",
    HTML = "html",
    JPG = "jpg",
    PNG = "png",
}

export enum exporterType {
    HTML,
    Phantom,
    Puppeteer,
}

export interface FormatQuickPickItem extends vscode.QuickPickItem {
    format: exportFormat;
}

export interface ExporterQuickPickItem extends vscode.QuickPickItem {
    exporter: MarkdownExporter;
}

export interface MarkdownExporter {
    Export: (document: MarkdownDocument, format: exportFormat, fileName: string) => Promise<any>;
    FormatAvailable: (format: exportFormat) => boolean;
}