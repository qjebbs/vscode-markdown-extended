import * as vscode from 'vscode';
import { MarkdownDocument } from '../common/markdownDocument';

export enum exportFormate {
    PDF = "pdf",
    HTML = "html",
    JPG = "jpg",
    PNG = "png",
}

export enum exporterType {
    HTML,
    Phantom,
}

export interface ExporterQuickPickItem extends vscode.QuickPickItem {
    type: exporterType;
}

export interface MarkdownExporter {
    Export: (document: MarkdownDocument, formate: exportFormate, fileName: string) => Promise<any>;
}