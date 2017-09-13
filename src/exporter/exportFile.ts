import * as vscode from 'vscode';
import * as fs from 'fs';
import { markdown } from '../extension';
import { pluginStyles } from '../common/styles';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';

export function exportFile(document: vscode.TextDocument, fileName: string) {
    mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, renderHTML(document) + "\n" + renderStyle(), "utf-8");
}

export function renderHTML(document: vscode.TextDocument): string {
    let content = markdown.render(document.getText());
    return `<article class="markdown-body vscode-body">
    ${content}
</article>`;
}

export function renderStyle(): string {
    return `<style>\n${pluginStyles}\n</style>`;
}