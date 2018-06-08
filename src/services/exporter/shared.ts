import * as vscode from 'vscode';
import * as path from 'path';
import { markdown } from '../../extension';
import { mdConfig } from '../common/mdConfig';
import { MarkdownDocument } from '../common/markdownDocument';
import { template } from './template';
import { contributeStyles } from '../common/styles';
import { MarkdownItEnv } from '../common/interfaces';
import { exportFormate } from './interfaces';

export function renderHTML(document: MarkdownDocument, withStyle: boolean, formate: exportFormate): string
export function renderHTML(document: MarkdownDocument, withStyle: boolean, injectStyle?: string): string
export function renderHTML(document: vscode.TextDocument, withStyle: boolean, injectStyle?: string): string
export function renderHTML(document, withStyle: boolean, arg: any) {
    let injectStyle = arg.indexOf('}')>-1 ? arg : getInjectStyle(arg);
    let doc: MarkdownDocument = undefined;
    if (document instanceof MarkdownDocument)
        doc = document;
    else if (document.getText)
        doc = new MarkdownDocument(document);

    let title = path.basename(doc.document.uri.fsPath);
    let styles = withStyle ? getStyle(doc.document.uri, injectStyle) : "";
    let html = getHTML(doc);
    //should put both classes, because we cannot determine if a user style URL is a theme or not
    let mdClass = "vscode-body vscode-light";
    return eval(template);
}

function getHTML(doc: MarkdownDocument): string {
    let env: MarkdownItEnv = {
        htmlExporter: {
            workspaceFolder: getworkspaceFolder(doc.document.uri),
            vsUri: getVsUri(doc.document.uri),
            embedImage: true,
        }
    }
    let content = markdown.render(doc.content, env);
    return content.trim();
}
function getworkspaceFolder(uri): string {
    let root = vscode.workspace.getWorkspaceFolder(uri);
    return (root && root.uri) ? root.uri.fsPath : "";
}
function getVsUri(uri: vscode.Uri): string {
    let root = vscode.workspace.getWorkspaceFolder(uri);
    let p = (root && root.uri) ? '/' + root.uri.fsPath + '/' : "";
    // FIXME: vscode has a bug encoding shared path, which cannot be replaced
    // nor can vscode display images if workspace is in a shared folder.
    // FIXME: can special chr exists in uri that need escape when use regex?
    return "vscode-resource:" + encodeURI(p.replace(/[\\/]+/g, '/'));
}

function getStyle(uri: vscode.Uri, injectStyle?: string): string {
    let styles: string[] = [];

    let conf = mdConfig.styles(uri);
    let contributed = contributeStyles.thirdParty();
    if (!contributed) contributed = contributeStyles.official();
    let features = contributeStyles.features();
    let user = conf.embedded.join('\n').trim();

    if (injectStyle) styles.push(injectStyle);
    if (user) styles.push(`/* === user styles start === */\n${user}\n/* === user styles end === */`);
    if (contributed) styles.push(`/* === theming start === */\n${contributed}\n/* === theming end === */`);
    if (features) styles.push(`/* === features start === */\n${features}\n/* === features end === */`);

    return `${conf.linked.join('\n')}\n<style>\n${styles.join('\n').trim()}\n</style>`;
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

function getInjectStyle(formate: exportFormate): string {
    switch (formate) {
        case exportFormate.PDF:
            return `/* injected by phantomExport */
            body, .vscode-body {
                max-width: 100% !important;
                width: 1000px !important;
                margin: 0 !important;
                padding: 0 !important;
            }`;
        case exportFormate.JPG:
        case exportFormate.PNG:
            return `/* injected by phantomExport */
            body, .vscode-body {
                width: 1000px !important;
            }`;
        default:
            return "";
    }
}
