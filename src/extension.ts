'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandExportCurrent } from './commands/exportCurrent';
import * as markdowIt from 'markdown-it';
import { plugins } from './plugin/plugins';
import { CommandCopy, CommandCopyWithStyles } from './commands/copy';
import { config } from './services/common/config';
import { CommandPasteTable } from './commands/pasteTable';
import { CommandFormateTable } from './commands/formateTable';
import { mdConfig } from './services/common/mdConfig';
import { CommandToggleTest } from './commands/helpers';

export var markdown: markdowIt.MarkdownIt;
export var context: vscode.ExtensionContext;
export var outputPanel = vscode.window.createOutputChannel("MDExtended");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(ctx: vscode.ExtensionContext) {
    context = ctx;
    ctx.subscriptions.push(
        outputPanel,
        config,
        mdConfig,
        new CommandExportCurrent(),
        new CommandCopy(),
        new CommandCopyWithStyles(),
        new CommandPasteTable(),
        new CommandFormateTable(),
        new CommandToggleTest(),
    );
    return {
        extendMarkdownIt(md: markdowIt.MarkdownIt) {
            plugins.map(p => {
                md.use(p.plugin, ...(p.params || []));
            });
            markdown = md;
            return md;
        }
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}