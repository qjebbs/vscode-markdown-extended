
import * as csv from 'papaparse';
import { MDTable } from './mdTable';

export function parse(source: string): MDTable {
    let table = csv.parse(source);
    if (table.errors.length) return undefined;
    //use "new MDTable(table.data)" to do the data regularization, then escape chr
    let data = escapeChars(new MDTable(table.data, 1));
    return new MDTable(data, 1);
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
function escapeChars(table: MDTable): string[][] {
    for (let i = 0; i < table.rowCount; i++) {
        for (let j = 0; j < table.columnCount; j++) {
            let text = table.data[i][j];
            if (/[\\|]/g.test(text))
                table.data[i][j] = text.replace(/([\\|])/g, "\\$1");
        }
    }
    return table.data;
}