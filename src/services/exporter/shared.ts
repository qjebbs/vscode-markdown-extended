import * as vscode from 'vscode';
import * as path from 'path';
import { markdown } from '../../extension';
import { mdConfig } from '../common/mdConfig';
import { pluginStyles } from '../common/styles';
import { MarkdownDocument } from '../common/markdownDocument';

export function renderHTML(document: MarkdownDocument): string
export function renderHTML(document: vscode.TextDocument): string
// export function renderHTML(content: string): string
export function renderHTML(para) {
    let content = "";
    let doc: MarkdownDocument = undefined;
    // if (typeof para === "string")
    // content = markdown.render(para);
    if (para instanceof MarkdownDocument)
        doc = para;
    else if (para.getText)
        doc = new MarkdownDocument(para);
    content = removeVsUri(markdown.render(doc.content), doc.document.uri);
    return `<article class="markdown-body vscode-body">
    ${content.trim()}
</article>`;
}

function removeVsUri(content: string, uri: vscode.Uri): string {
    let root = vscode.workspace.getWorkspaceFolder(uri);
    let p = (root && root.uri) ? '/' + root.uri.fsPath + '/' : "";
    let vsUri = "vscode-resource:" + encodeURI(p.replace(/[\\/]+/g, '/'));
    // FIXME: vscode has a bug encoding shared path, which cannot be replaced
    // nor can vscode display images if workspace is in a shared folder.
    // FIXME: can special chr exists in uri that need escape when use regex?
    return content.replace(new RegExp(vsUri, "gm"), "");
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