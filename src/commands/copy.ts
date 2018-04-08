import { Command } from './common';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { renderHTML, renderStyle, testMarkdown } from '../services/exporter/exportFile';

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
        clip.write(renderMarkdown(true))
            .then(() => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy.withStyle");
    }
}

function renderMarkdown(style: boolean): string {
    let document = vscode.window.activeTextEditor.document;
    let selection = vscode.window.activeTextEditor.selection;
    let rendered = "";
    if (selection.isEmpty)
        rendered = renderHTML(document);
    else
        rendered = renderHTML(document.getText(selection));
    if (style) rendered += '\n' + renderStyle(document.uri);
    return rendered;
}