import * as vscode from 'vscode';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import * as pdf from 'html-pdf';
import { renderHTML } from './shared';
import { MarkdownDocument } from '../common/markdownDocument';
import { MarkdownExporter, exportFormat } from './interfaces';

class PhantomExporter implements MarkdownExporter {
    async Export(document: MarkdownDocument, format: exportFormat, fileName: string) {
        let html = renderHTML(document, true, format);
        mkdirsSync(path.dirname(fileName));
        return new Promise((resolve, reject) => {
            pdf.create(html, document.meta.phantomConfig)
                .toFile(
                    fileName,
                    (err: Error, res: pdf.FileInfo) => {
                        if (err) reject(err); else resolve(res);
                    }
                );
        });

    }
    FormatAvailable(format: exportFormat) {
        return [
            exportFormat.PDF,
            exportFormat.JPG,
            exportFormat.PNG
        ].indexOf(format) > -1;
    }
}
export const phantomExporter = new PhantomExporter();