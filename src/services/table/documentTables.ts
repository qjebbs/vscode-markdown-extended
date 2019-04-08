import * as vscode from 'vscode';
import { MDTable } from './mdTable';
import { parseMDTAble } from './mdTableParse';

export interface DocumentTable {
    range: vscode.Range,
    table: MDTable,
}

export function tablesOf(document: vscode.TextDocument): DocumentTable[] {
    let tables: DocumentTable[] = [];
    for (let i = 0; i < document.lineCount; i++) {
        let t = findTable(document, i);
        if (t) {
            tables.push(t);
            i = t.range.end.line;
        }
    }
    return tables;
}


function findTable(document: vscode.TextDocument, pos: number): DocumentTable {
    if (pos < 0 || pos > document.lineCount - 1) return undefined;
    let i = 0, flag = false, start = 0, end = 0;
    for (i = pos; i < document.lineCount; i++) {
        if (document.lineAt(i).text.indexOf('|') < 0) {
            if (flag) break;
        } else {
            if (!flag) {
                flag = true;
                start = i;
            }
        }
    }
    end = i - 1;
    if (!flag) return undefined;
    let rang = document.lineAt(start).range.union(
        document.lineAt(end).range
    );
    let table = parseMDTAble(document.getText(rang));
    if (table)
        return <DocumentTable>{ range: rang, table: table };
    else
        return undefined;
}
