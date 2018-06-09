import * as vscode from 'vscode';
import { MarkdownDocument } from '../common/markdownDocument';

export type Progress = vscode.Progress<{ message?: string; increment?: number }>;

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
    Export: (document: MarkdownDocument, format: exportFormat, fileName: string, progress: Progress) => Promise<any>;
    FormatAvailable: (format: exportFormat) => boolean;
}
export interface exportOption {
    exporter: MarkdownExporter,
    progress: Progress,
    format: exportFormat
}