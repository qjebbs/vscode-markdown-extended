import { Command } from './command';
import * as vscode from 'vscode';
import { toggleFormat } from '../services/helpers/toggleFormat';
import { CommandConfig, Commands } from './commands';

const togglers: CommandConfig[] = [
    {
        commandId: "markdownExtended.toggleBold",
        worker: toggle,
        args: [
            /\*\*(\S.*?\S)\*\*/ig, false,
            /(.+)/ig, "**$1**",
            /\*\*(\S.*?\S)\*\*/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleItalics",
        worker: toggle,
        args: [
            /\*(\S.*?\S)\*(?!=\*)/ig, false,
            /(.+)/ig, "*$1*",
            /\*(\S.*?\S)\*(?!=\*)/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleUnderLine",
        worker: toggle,
        args: [
            /_(\S.*?\S)_/ig, false,
            /(.+)/ig, "_$1_",
            /_(\S.*?\S)_/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleSuperscript",
        worker: toggle,
        args: [
            /\^(\S.*?\S)\^/ig, false,
            /(.+)/ig, "^$1^",
            /\^(\S.*?\S)\^/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleSubscript",
        worker: toggle,
        args: [
            /~(\S.*?\S)~(?!=~)/ig, false,
            /(.+)/ig, "~$1~",
            /~(\S.*?\S)~(?!=~)/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleStrikethrough",
        worker: toggle,
        args: [
            /~~(\S.*?\S)~~/ig, false,
            /(.+)/ig, "~~$1~~",
            /~~(\S.*?\S)~~/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleCodeInline",
        worker: toggle,
        args: [
            /`(\S.*?\S)`/ig, false,
            /(.+)/ig, "`$1`",
            /`(\S.*?\S)`/ig, "$1"
        ]
    },
    {
        commandId: "markdownExtended.toggleCodeBlock",
        worker: toggle,
        args: [
            /^```\r?\n[\S\s]+\r?\n```\s*$/ig, true,
            /((?:\S|\s)+)/ig, "```\n$1\n```",
            /^```\r?\n([\S\s]+)\r?\n```\s*$/ig, "$1",
        ]
    },
    {
        commandId: "markdownExtended.toggleUList",
        worker: toggle,
        args: [
            /((^|\n)-\s+(.+)\s*(?=$|\n))+/ig, true,
            /(^|\n)\s*(.+?)\s*(?=$|\n)/ig, "$1- $2",
            /(^|\n)-\s+(.+)\s*(?=$|\n)/ig, "$1$2",
        ]
    },
    {
        commandId: "markdownExtended.toggleOList",
        worker: toggle,
        args: [
            /((^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n))+/ig, true,
            /(^|\n)\s*(.+?)\s*(?=$|\n)/ig, "$11. $2",
            /(^|\n)(?:\d+\.)\s+(.+)\s*(?=$|\n)/ig, "$1$2",
        ]
    },
    {
        commandId: "markdownExtended.toggleBlockQuote",
        worker: toggle,
        args: [
            /((^|\n)>\s+(.+)\s*(?=$|\n))+/ig, true,
            /(^|\n)\s*(.+?)\s*(?=$|\n)/ig, "$1> $2",
            /(^|\n)>\s+(.+)\s*(?=$|\n)/ig, "$1$2",
        ]
    },
]

export var commandToggles = new Commands(togglers);

function toggle(
    detect: RegExp,
    multiLine: boolean,
    on: RegExp, onReplace: string,
    off: RegExp, offReplace: string
) {
    toggleFormat(
        vscode.window.activeTextEditor,
        detect, on, onReplace, off, offReplace, multiLine
    );
}