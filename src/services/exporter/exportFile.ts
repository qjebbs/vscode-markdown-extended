import * as vscode from 'vscode';
import * as fs from 'fs';
import { pluginStyles } from '../common/styles';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import * as pdf from 'html-pdf';
import { config } from '../common/config';
import { markdown } from '../../extension';

export function exportFormats(): string[] {
    let formats = [
        "HTML",
    ]
    if (config.phantomPath && fs.existsSync(config.phantomPath)) formats.push(
        "PDF",
        "JPEG",
        "PNG"
    )
    return formats;
}

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
    let option: any = {};
    const imgWidth = 980;
    switch (format) {
        case "PDF":
            option = {
                // height: "29.665cm",
                // width: "20.988cm",
                format: "A4",
                // border: {
                //     top: "1cm",
                //     right: "1cm",
                //     bottom: "1cm",
                //     left: "1cm"
                // },
                type: "pdf"
            }
            break;
        case "JPEG":
        case "PNG":
            option = {
                type: format.toLowerCase()
            }
            mdBody = `<body style="width:${imgWidth}px">${mdBody}</body>`
            break;
    }
    option.phantomPath = config.phantomPath;
    pdf.create(mdBody + "\n" + renderStyle(), option).toFile(fileName, callback);
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

export function testMarkdown(): boolean {
    if (!markdown) {
        vscode.window.showInformationMessage(
            "You must open markdown preview before you can copy or export.",
            "Open Preview"
        ).then(
            result => {
                if (result == "Open Preview")
                    vscode.commands.executeCommand("markdown.showPreviewToSide")
            }
        );
        return false;
    }
    return true;
}