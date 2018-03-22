import * as vscode from 'vscode';
import * as csv from './csv';
import * as mdTable from './mdTable';

export function convertToMarkdownTable(source: string): string {
    let table = csv.parse(source);
    if (!table) return undefined;
    return table.stringify();
}