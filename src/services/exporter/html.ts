import * as fs from 'fs';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import { renderHTML } from './shared';
import { MarkdownDocument } from '../common/markdownDocument';
import { MarkdownExporter, exportFormat, Progress } from './interfaces';

class HtmlExporter implements MarkdownExporter {
    async Export(document: MarkdownDocument, format: exportFormat, fileName: string, progress: Progress) {
        progress.report({
            message: `MarkdownExtended: Exporting ${path.basename(fileName)}...`,
        });
        let html = renderHTML(document, true, format);
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
    FormatAvailable(format: exportFormat) {
        return exportFormat.HTML == format;
    }
}
export const htmlExporter = new HtmlExporter();