import * as vscode from 'vscode';
import * as fs from 'fs';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import { renderHTML } from './shared';
import { MarkdownDocument } from '../common/markdownDocument';

export function htmlExport(document: MarkdownDocument, fileName: string) {
    let inject = `/* injected by phantomExport */
    body{
        padding: 0 26px;
    }
    .vscode-body {
        padding: 0 !important;
    }`
    mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, renderHTML(document, true, inject), "utf-8");
}