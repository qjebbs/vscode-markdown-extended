import * as vscode from 'vscode';

export interface SelectionOffset {
    orignal: vscode.Selection;
    offset: offset;
}

interface offset {
    line: number;
    charachter: number;
}

export function applyOffset(editor: vscode.TextEditor, offsets: SelectionOffset[]) {
    if (!editor || !offsets || !offsets.length) return;
    let selections = offsets.map(s => {
        if (!s || !s.orignal) return undefined;
        return new vscode.Selection(
            s.orignal.start.translate(s.offset.line, s.offset.charachter),
            s.orignal.end.translate(s.offset.line, s.offset.charachter)
        )
    });
    editor.selections = selections;
}