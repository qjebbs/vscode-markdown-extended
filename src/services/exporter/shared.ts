import * as vscode from 'vscode';
import { markdown } from '../../extension';
import { mdConfig } from '../common/mdConfig';
import { pluginStyles } from '../common/styles';
import { MarkdownDocument } from '../common/markdownDocument';

export function renderHTML(document: MarkdownDocument): string
export function renderHTML(document: vscode.TextDocument): string
export function renderHTML(content: string): string
export function renderHTML(para) {
    let content = "";
    if (typeof para === "string")
        content = markdown.render(para);
    if (para instanceof MarkdownDocument)
        content = markdown.render(para.content);
    else if (para.getText)
        content = markdown.render(new MarkdownDocument(para).content);
    return `<article class="markdown-body vscode-body">
    ${content.trim()}
</article>`;
}

export function renderStyle(uri: vscode.Uri): string {
    let styles = mdConfig.styles(uri);
    return `${styles.linked.join('\n')}
<style>
${styles.embedded.join('\n')}
${pluginStyles}
</style>`;
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