import * as fs from 'fs';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import { renderHTML } from './shared';
import { MarkdownDocument } from '../common/markdownDocument';
import { MarkdownExporter, exportFormate } from './interfaces';

export class HtmlExporter implements MarkdownExporter {
    async Export(document: MarkdownDocument, formate: exportFormate, fileName: string) {
        let html = renderHTML(document, true, formate);
        mkdirsSync(path.dirname(fileName));
        return new Promise((resolve, reject) => {
            try {
                fs.writeFileSync(fileName, html, "utf-8");
                resolve("ok");
            } catch (error) {
                reject(error);
            }
        });

    }
}