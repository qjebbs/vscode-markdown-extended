import { Command } from './common';
import * as vscode from 'vscode';
import * as clip from 'copy-paste';
import { renderHTML, renderStyle } from '../exporter/exportFile';

export class CommandCopy extends Command {
    execute() {
        clip.copy(renderMarkdown(false), () => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy");
    }
}

export class CommandCopyWithStyles extends Command {
    execute() {
        clip.copy(renderMarkdown(true), () => vscode.window.showInformationMessage("Copy success."));
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
    if (style) rendered += '\n' + renderStyle();
    return rendered
}