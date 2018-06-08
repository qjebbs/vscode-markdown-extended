import * as puppeteer from 'puppeteer';
import { MarkdownDocument } from '../common/markdownDocument';
import { mkdirsSync } from '../common/tools';
import { renderHTML } from './shared';
import * as path from 'path';
import { MarkdownExporter, exportFormat } from './interfaces';
import { format } from 'url';

class PuppeteerExporter implements MarkdownExporter {
    async Export(document: MarkdownDocument, format: exportFormat, fileName: string) {
        let html = renderHTML(document, true, format);
        let conf = document.meta.puppeteerConfig;
        mkdirsSync(path.dirname(fileName));

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        switch (format) {
            case exportFormat.PDF:
                conf = Object.assign(conf.pdf, { path: fileName });
                await page.pdf(conf);
                break;
            case exportFormat.JPG:
            case exportFormat.PNG:
                conf = Object.assign(conf.image, { path: fileName, type: format == exportFormat.JPG ? "jpeg" : "png" });
                if (format == exportFormat.PNG) conf.quality = undefined;
                await page.screenshot(conf);
                break;
            default:
                return Promise.reject("PuppeteerExporter does not support HTML export.");
        }
        await browser.close();
    }
    FormatAvailable(format: exportFormat) {
        return [
            exportFormat.PDF,
            exportFormat.JPG,
            exportFormat.PNG
        ].indexOf(format) > -1;
    }
}
export const puppeteerExporter = new PuppeteerExporter();