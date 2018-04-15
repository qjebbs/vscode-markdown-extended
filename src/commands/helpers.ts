import { Command } from './command';
import * as vscode from 'vscode';
import { toggleFormat } from '../services/helpers/toggleFormat';

export class CommandToggleTest extends Command {
    execute() {
        // toggleFormate(
        //     /\*\*(\S.*?\S)\*\*/ig,
        //     /(.+)/ig, "**$1**",
        //     /\*\*(\S.*?\S)\*\*/ig, "$1"
        // )
        toggle(
            /((^|\n)-\s+(.+)\s*(?=$|\n))+/ig,
            /(^|\n)\s*(.+?)\s*(?=$|\n)/ig, "$1- $2",
            /(^|\n)-\s+(.+)\s*(?=$|\n)/ig, "$1$2",
            true
        )
    }
    constructor() {
        super("markdownExtended.toggle");
    }
}

function toggle(
    detect: RegExp,
    on: RegExp, onReplace: string,
    off: RegExp, offReplace: string,
    multiLine: boolean
) {
    toggleFormat(
        vscode.window.activeTextEditor.document,
        vscode.window.activeTextEditor.selection,
        detect, on, onReplace, off, offReplace, multiLine
    );
}