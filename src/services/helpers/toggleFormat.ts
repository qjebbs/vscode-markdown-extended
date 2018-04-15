import * as vscode from 'vscode';
import { editTextDocument } from '../common/tools';

export function toggleFormat(
    document: vscode.TextDocument,
    selection: vscode.Selection,
    detect: RegExp,
    on: RegExp, onReplace: string,
    off: RegExp, offReplace: string,
    multiLine: boolean
) {
    let isOn = false;
    let target = matchedInCursor(document, selection, detect);
    let newText = "";
    if (target)
        isOn = true;
    else
        if (multiLine)
            target = getLines(document, selection);
        else
            target = getWord(document, selection);
    if (isOn)
        newText = document.getText(target).replace(off, offReplace);
    else
        newText = document.getText(target).replace(on, onReplace);
    // console.log(document.getText(target));
    editTextDocument(document, target, newText);
}

function matchedInCursor(
    document: vscode.TextDocument,
    selection: vscode.Selection,
    rule: RegExp
): vscode.Selection {
    let lines = getLines(document, selection);
    let text = document.getText(lines);
    let newLinePos: number[] = [];
    for (let i = 0; i < text.length; i++) {
        if (text.substr(i, 1) == '\n') newLinePos.push(i);
    }
    rule.lastIndex = 0;
    let matches: RegExpMatchArray;
    while (matches = rule.exec(text)) {
        let start = convertPosition(
            new vscode.Position(selection.start.line, matches.index),
            newLinePos,
        );
        let end = convertPosition(
            new vscode.Position(selection.start.line, matches.index + matches[0].length),
            newLinePos,
        );
        let rng = new vscode.Selection(start, end);
        if (rng.intersection(selection)) return rng;
    }
    return undefined;
}

function convertPosition(pos: vscode.Position, newLinePos: number[]): vscode.Position {
    let line = 0;
    let linePos = 0;
    newLinePos.map((p, i) => {
        if (pos.character > p) {
            line = i + 1;
            linePos = p;
        }
    });
    return new vscode.Position(line + pos.line, pos.character - linePos);
}

function getWord(document: vscode.TextDocument, selection: vscode.Selection): vscode.Selection {
    let txtLine = document.lineAt(selection.active.line).text;
    let spacePreceding = txtLine.lastIndexOf(' ', selection.start.character - 1);
    let spaceFollowing = txtLine.indexOf(' ', selection.end.character);
    if (spaceFollowing == -1) {
        spaceFollowing = txtLine.length;
    }
    return new vscode.Selection(new vscode.Position(selection.active.line, spacePreceding + 1), new vscode.Position(selection.active.line, spaceFollowing));
}

function getLines(document: vscode.TextDocument, selection: vscode.Selection): vscode.Selection {
    let lines = document.lineAt(selection.start).range.union(
        document.lineAt(selection.end).range
    );
    return new vscode.Selection(lines.start, lines.end);
}