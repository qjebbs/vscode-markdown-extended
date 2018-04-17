import * as vscode from 'vscode';

export interface Edit {
    range: vscode.Range,
    replace: string,
    selectionOffset?: SelectionOffset,
}

export interface SelectionOffset {
    orignal: vscode.Selection;
    offset: offset;
}

interface offset {
    line: number;
    charachter: number;
}

export async function editTextDocument(document: vscode.TextDocument, edits: Edit[]) {
    let editor = await vscode.window.showTextDocument(document);
    editor.edit(e => {
        edits.map(edit => {
            if (!edit || !edit.range || !edit.replace) return;
            e.replace(edit.range, edit.replace);
        })
    }).then(() => {
        let offsets = edits.map(e => e.selectionOffset).filter(s => !!s);
        applyOffset(editor, offsets);
    });
}

function applyOffset(editor: vscode.TextEditor, offsets: SelectionOffset[]) {
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