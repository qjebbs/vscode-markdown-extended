import { Command } from './command';
import * as vscode from 'vscode';
import * as clip from 'clipboardy';
import { convertToMarkdownTable } from '../services/table/convertTable';
import { editTextDocument, RangeReplace } from '../services/common/tools';
import { tablesOf } from '../services/table/documentTables';
export class CommandFormateTable extends Command {
    execute() {
        let editor = vscode.window.activeTextEditor;
        let selection = editor.selection;
        let tables = tablesOf(editor.document);
        let edits: RangeReplace[] = [];
        tables.map(t => {
            if (t.range.intersection(selection))
                edits.push({ range: t.range, replace: t.table.stringify() });
        });
        editTextDocument(
            editor.document,
            edits
        );
    }
    constructor() {
        super("markdownExtended.formateTable");
    }
}