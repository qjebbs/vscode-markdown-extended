
import * as csv from 'papaparse';
import { MDTable } from './mdTable';

export function parse(source: string): MDTable {
    let table = csv.parse(source);
    if (table.errors.length) return undefined;
    return new MDTable(table.data);
}

export function stringify(table: MDTable): string {
    let config = {
        quotes: false,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: "\t",
        header: true,
        newline: "\r\n"
    }
    return csv.unparse(table.data, config);
}