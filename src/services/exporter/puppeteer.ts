import * as puppeteer from 'puppeteer';
import { MarkdownDocument } from '../common/markdownDocument';
import { mkdirsSync } from '../common/tools';
import { renderHTML } from './shared';
import * as path from 'path';
import { MarkdownExporter, exportFormate } from './interfaces';

export class PuppeteerExporter implements MarkdownExporter {
    async Export(document: MarkdownDocument, formate: exportFormate, fileName: string) {
        let html = renderHTML(document, true, formate);
        let conf = Object.assign({ path: fileName }, document.meta.puppeteerConfig);
        mkdirsSync(path.dirname(fileName));

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf(conf);
        await browser.close();
    }
}