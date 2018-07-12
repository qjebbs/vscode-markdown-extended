import * as vscode from 'vscode';
import * as fs from 'fs';
import { mkdirsSync } from '../common/tools';
import * as path from 'path';
import { renderHTML } from './shared';
import { MarkdownExporter, exportFormat, Progress, ExportItem } from './interfaces';
import { setTimeout } from 'timers';

class HtmlExporter implements MarkdownExporter {
    async Export(items: ExportItem[], progress: Progress) {
        let count = items.length;
        return items.reduce((p, c, i) => {
            return p
                .then(
                    () => {
                        if (progress) progress.report({
                            message: `${path.basename(c.fileName)} (${i + 1}/${count})`,
                            increment: ~~(1 / count
                                * 100)
                        });
                    }
                )
                .then(
                    () => this.exportFile(c)
                );
        }, Promise.resolve(null));
    }
    private async exportFile(item: ExportItem) {

        let document = await vscode.workspace.openTextDocument(item.uri);
        let html = renderHTML(document, true, item.format);
        mkdirsSync(path.dirname(item.fileName));
        return new Promise((resolve, reject) => {
            try {
                fs.writeFileSync(item.fileName, html, "utf-8");
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