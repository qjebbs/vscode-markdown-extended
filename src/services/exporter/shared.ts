import * as vscode from 'vscode';
import * as path from 'path';
import { markdown } from '../../extension';
import { MarkdownDocument } from '../common/markdownDocument';
import { template } from './template';
import { Contributes } from '../contributes/contributes';
import { MarkdownItEnv } from '../common/interfaces';

export function renderPage(
    document: MarkdownDocument | vscode.TextDocument,
    injectStyle?: string
): string {
    let doc: MarkdownDocument = undefined;
    if (document instanceof MarkdownDocument)
        doc = document;
    else if (document.getText)
        doc = new MarkdownDocument(document);

    let title = doc.meta.raw.title || path.basename(doc.document.uri.fsPath);
    let styles = getStyles(doc.document.uri, injectStyle);
    let scripts = getSciprts();
    let html = renderHTML(doc);
    //should put both classes, because we cannot determine if a user style URL is a theme or not
    let mdClass = "markdown-body vscode-body vscode-light";
    return eval(template);
}

export function renderHTML(doc: MarkdownDocument): string {
    let env: MarkdownItEnv = {
        htmlExporter: {
            uri: doc.document.uri,
            workspaceFolder: getworkspaceFolder(doc.document.uri),
            vsUri: getVsUri(doc.document.uri),
            embedImage: true,
        },
    }
    let content = markdown.render(doc.content, env);
    return content.trim();
}
function getworkspaceFolder(uri): vscode.Uri {
    let root = vscode.workspace.getWorkspaceFolder(uri);
    return (root && root.uri) ? root.uri : undefined;
}
function getVsUri(uri: vscode.Uri): string {
    let root = vscode.workspace.getWorkspaceFolder(uri);
    let p = (root && root.uri) ? '/' + root.uri.fsPath + '/' : "";
    // FIXME: vscode has a bug encoding shared path, which cannot be replaced
    // nor can vscode display images if workspace is in a shared folder.
    // FIXME: can special chr exists in uri that need escape when use regex?
    return "vscode-resource:" + encodeURI(p.replace(/[\\/]+/g, '/'));
}

function getStyles(uri: vscode.Uri, injectStyle?: string): string {
    let styles: string[] = [];

    let official = Contributes.Styles.official();
    let thirdParty = Contributes.Styles.thirdParty();
    let user = Contributes.Styles.user(uri);

    if (injectStyle) {
        styles.push("");
        styles.push(Contributes.createStyle(injectStyle, "injected by exporter"));
    }
    if (official) {
        styles.push("");
        styles.push("<!-- official styles start -->");
        styles.push(official);
        styles.push("<!-- official styles end -->");
    }
    if (thirdParty) {
        styles.push("");
        styles.push("<!-- third party styles start -->");
        styles.push(thirdParty);
        styles.push("<!-- third party styles end -->");
    }
    if (user) {
        styles.push("");
        styles.push("<!-- user styles start -->");
        styles.push(user);
        styles.push("<!-- user styles end -->");
    }
    styles.push("");
    return styles.join('\n');
}
function getSciprts(): string {
    let scripts: string[] = [];

    // let official = Contributes.Scripts.official();
    let thirdParty = Contributes.Scripts.thirdParty();

    // if (official) {
    //     scripts.push("");
    //     scripts.push("<!-- official scripts start -->");
    //     scripts.push(official);
    //     scripts.push("<!-- official scripts end -->");
    // }
    if (thirdParty) {
        scripts.push("");
        scripts.push("<!-- third party scripts start -->");
        scripts.push(thirdParty);
        scripts.push("<!-- third party scripts end -->");
    }
    scripts.push("");
    return scripts.join('\n');
}

export async function ensureMarkdownEngine() {
    if (!markdown) {
        await vscode.commands.executeCommand('markdown.api.render', 'init markdown engine');
    }
}
