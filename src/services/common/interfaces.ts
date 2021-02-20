import * as vscode from 'vscode';

export interface MarkdownItEnv {
    htmlExporter?: HtmlExporterEnv,
    containingImages: string[],
}

export interface HtmlExporterEnv {
    uri: vscode.Uri,
    workspaceFolder: vscode.Uri,
    vsUri: string,
    embedImage: boolean,
}