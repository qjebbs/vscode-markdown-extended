import { Command } from './command';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { renderPage, renderHTML, ensureMarkdownEngine } from '../services/exporter/shared';
import { MarkdownDocument } from '../services/common/markdownDocument';

export class CommandCopy extends Command {
    async execute() {
        clip.write(await renderMarkdown(false))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy");
    }
}

export class CommandCopyWithStyles extends Command {
    async execute() {
        return clip.write(await renderMarkdown(true))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copyWithStyle");
    }
}

async function renderMarkdown(style: boolean): Promise<string> {
    await ensureMarkdownEngine();
    let document = vscode.window.activeTextEditor.document;
    let selection = vscode.window.activeTextEditor.selection;
    let rendered = "";
    let doc: MarkdownDocument;
    if (selection.isEmpty)
        doc = new MarkdownDocument(document);
    else
        doc = new MarkdownDocument(document, document.getText(selection));
    if (style)
        rendered = renderPage(doc);
    else
        rendered = renderHTML(doc);
    return rendered;
}