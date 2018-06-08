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
        let conf = Object.assign({ path: fileName }, document.meta.puppeteerConfig);
        mkdirsSync(path.dirname(fileName));

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf(conf);
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