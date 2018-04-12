import * as vscode from 'vscode';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import * as pdf from 'html-pdf';
import { renderHTML, renderStyle } from './shared';
import { MarkdownDocument } from '../common/markdownDocument';

export function phantomExport(
    document: MarkdownDocument,
    fileName: string,
    callback: (err: Error, res: pdf.FileInfo) => void
) {
    mkdirsSync(path.dirname(fileName));
    let mdBody = renderHTML(document);
    pdf.create(mdBody + "\n" + renderStyle(document.document.uri), document.meta.phantomConfig).toFile(fileName, callback);
}