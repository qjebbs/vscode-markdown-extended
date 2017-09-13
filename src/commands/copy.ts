import { Command } from './common';
import * as vscode from 'vscode';
import * as clip from 'copy-paste';
import { renderHTML, renderStyle } from '../exporter/exportFile';

export class CommandCopy extends Command {
    execute() {
        let document = vscode.window.activeTextEditor.document;
        clip.copy(renderHTML(document), () => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy");
    }
}

export class CommandCopyWithStyles extends Command {
    execute() {
        let document = vscode.window.activeTextEditor.document;
        clip.copy(renderHTML(document) + '\n' + renderStyle(), () => vscode.window.showInformationMessage("Copy success."));
    }
    constructor() {
        super("markdownExtended.copy.withStyle");
    }
}