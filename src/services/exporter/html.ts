import * as vscode from 'vscode';
import * as fs from 'fs';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import { renderHTML, renderStyle } from './shared';
import { MarkdownDocument } from '../common/markdownDocument';

export function htmlExport(document: MarkdownDocument, fileName: string) {
    mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, renderHTML(document) + "\n" + renderStyle(document.document.uri), "utf-8");
}

