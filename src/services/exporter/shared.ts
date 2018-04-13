import * as vscode from 'vscode';
import * as path from 'path';
import { markdown } from '../../extension';
import { mdConfig } from '../common/mdConfig';
import { MarkdownDocument } from '../common/markdownDocument';
import { template } from './template';
import { contributeStyles } from '../common/styles';

export function renderHTML(document: MarkdownDocument, withStyle: boolean, injectStyle?: string): string
export function renderHTML(document: vscode.TextDocument, withStyle: boolean, injectStyle?: string): string
export function renderHTML(document, withStyle: boolean, injectStyle?: string) {
    let doc: MarkdownDocument = undefined;
    if (document instanceof MarkdownDocument)
        doc = document;
    else if (document.getText)
        doc = new MarkdownDocument(document);

    let title = "";
    let styles = withStyle ? getStyle(doc.document.uri, injectStyle) : "";
    let html = getHTML(doc);
    let mdClass = contributeStyles.thirdParty() ? "vscode-body" : "vscode-light";
    return eval(template);
}

function getHTML(doc: MarkdownDocument): string {
    let content = removeVsUri(markdown.render(doc.content), doc.document.uri);
    return content.trim();
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

function getStyle(uri: vscode.Uri, injectStyle?: string): string {
    let conf = mdConfig.styles(uri);
    let inject = injectStyle ? injectStyle : "";
    let contribute = contributeStyles.thirdParty();
    if (!contribute) contribute = contributeStyles.official();
    let features = contributeStyles.features();
    return `${conf.linked.join('\n')}
<style>
${inject}
/* ========== user styles start ========== */
${conf.embedded.join('\n').trim()}
/* ========== user styles end ========== */
/* ========== theming start ========== */
${contribute}
/* ========== theming end ========== */
/* ========== features start ========== */
${features}
/* ========== features end ========== */
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