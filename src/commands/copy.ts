import { Command } from './command';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { renderPage, testMarkdown, renderHTML } from '../services/exporter/shared';
import { MarkdownDocument } from '../services/common/markdownDocument';

export class CommandCopy extends Command {
    execute() {
        if (!testMarkdown()) return;
        clip.write(renderMarkdown(false))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy");
    }
}

export class CommandCopyWithStyles extends Command {
    execute() {
        if (!testMarkdown()) return;
        return clip.write(renderMarkdown(true))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copyWithStyle");
    }
}

function renderMarkdown(style: boolean): string {
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