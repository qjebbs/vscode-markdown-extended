import * as vscode from 'vscode';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import * as pdf from 'html-pdf';
import { renderHTML } from './shared';
import { MarkdownDocument } from '../common/markdownDocument';

export function phantomExport(
    document: MarkdownDocument,
    fileName: string,
    callback: (err: Error, res: pdf.FileInfo) => void
) {
    let inject = "";
    switch (document.meta.phantomConfig.type) {
        case "pdf":
            inject = `/* injected by phantomExport */
                    body, .vscode-body {
                        max-width: 100% !important;
                        width: 1000px !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }`
            break;
        case "png":
        case "jpeg":
            inject = `/* injected by phantomExport */
                    body, .vscode-body {
                        width: 1000px !important;
                    }`
        default:
            break;
    }
    mkdirsSync(path.dirname(fileName));
    let html = renderHTML(document, true, inject);
    pdf.create(html, document.meta.phantomConfig).toFile(fileName, callback);
}