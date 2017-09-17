import * as vscode from 'vscode';
import * as fs from 'fs';
import { markdown } from '../extension';
import { pluginStyles } from '../common/styles';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import * as pdf from 'html-pdf';

export const exportFormats = [
    "HTML",
    "PDF"
]

export function exportHTML(document: vscode.TextDocument, fileName: string) {
    mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, renderHTML(document) + "\n" + renderStyle(), "utf-8");
}

export function exportPDF(document: vscode.TextDocument, fileName: string, callback: Function) {
    mkdirsSync(path.dirname(fileName));
    pdf.create(renderHTML(document) + "\n" + renderStyle(), { format: 'Letter' })
        .toFile(fileName, callback);
}

export function renderHTML(document: vscode.TextDocument): string
export function renderHTML(content: string): string
export function renderHTML(para) {
    let content = "";
    if (typeof para === "string")
        content = markdown.render(para);
    else if (para.getText)
        content = markdown.render(para.getText());
    return `<article class="markdown-body vscode-body">
    ${content.trim()}
</article>`;
}

export function renderStyle(): string {
    return `<style>\n${pluginStyles}\n</style>`;
}