import * as vscode from 'vscode';
import * as fs from 'fs';
import { markdown } from '../extension';
import { pluginStyles } from '../common/styles';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import * as pdf from 'html-pdf';

export const exportFormats = [
    "HTML",
    "PDF",
    "JPEG",
    "PNG"
]

export function exportFile(document: vscode.TextDocument, format: string, fileName: string, callback: Function) {
    switch (format) {
        case "HTML":
            exportHTML(document, fileName);
            callback();
            break;
        case "PDF":
        case "JPEG":
        case "PNG":
            exportPDF(document, fileName, format, callback)
            break;
    }
}

function exportHTML(document: vscode.TextDocument, fileName: string) {
    mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, renderHTML(document) + "\n" + renderStyle(), "utf-8");
}

function exportPDF(document: vscode.TextDocument, fileName: string, format: string, callback: Function) {
    mkdirsSync(path.dirname(fileName));
    let mdBody = renderHTML(document);
    let config = {};
    const imgWidth = 980;
    switch (format) {
        case "PDF":
            config = {
                height: "29.7cm",
                width: "21cm",
                border: {
                    top: "1cm",
                    right: "0.5cm",
                    bottom: "1cm",
                    left: "0.5cm"
                },
                type: "pdf"
            }
            break;
        case "JPEG":
        case "PNG":
            config = {
                type: format.toLowerCase()
            }
            mdBody = `<body style="width:${imgWidth}px">${mdBody}</body>`
            break;
    }
    pdf.create(mdBody + "\n" + renderStyle(), config).toFile(fileName, callback);
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