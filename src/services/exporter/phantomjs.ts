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
    mkdirsSync(path.dirname(fileName));
    let html = renderHTML(document, true);
    pdf.create(html, document.meta.phantomConfig).toFile(fileName, callback);
}