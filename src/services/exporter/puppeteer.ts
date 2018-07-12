import * as puppeteer from 'puppeteer';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MarkdownDocument } from '../common/markdownDocument';
import { mkdirsSync, mergeSettings } from '../common/tools';
import { renderHTML } from './shared';
import { MarkdownExporter, exportFormat, Progress, ExportItem } from './interfaces';
import { config } from '../common/config';
import { context } from '../../extension';

class PuppeteerExporter implements MarkdownExporter {
    async Export(items: ExportItem[], progress: Progress) {
        let count = items.length;
        if (!this.checkPuppeteerBinary()) {
            let result = await vscode.window.showInformationMessage("Do you want to download exporter dependency Chromium?", "Yes", "No");
            if (result == "Yes") {
                await this.fetchBinary(progress);
            } else {
                vscode.window.showInformationMessage("Download cancelled. Try configure 'puppeteerExecutable' to use customize executable.");
                return;
            }
        }
        let exec = config.puppeteerExecutable;
        let opt = exec ? <puppeteer.LaunchOptions>{
            executablePath: exec
        } : undefined;
        const browser = await puppeteer.launch(opt);
        const page = await browser.newPage();

        return items.reduce((p, c, i) => {
            return p
                .then(
                    () => {
                        if (progress) progress.report({
                            message: `${path.basename(c.fileName)} (${i + 1}/${count})`,
                            increment: ~~(1 / count * 100)
                        });
                    }
                )
                .then(
                    () => this.exportFile(c, page)
                );
        }, Promise.resolve(null)).then(async () => await browser.close());

    }
    private async exportFile(item: ExportItem, page: puppeteer.Page) {
        let document = new MarkdownDocument(await vscode.workspace.openTextDocument(item.uri));
        let html = renderHTML(document, true, item.format);
        let ptConf: any = {};
        mkdirsSync(path.dirname(item.fileName));

        await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
        switch (item.format) {
            case exportFormat.PDF:
                ptConf = mergeSettings(
                    config.puppeteerDefaultSetting.pdf,
                    config.puppeteerUserSetting.pdf,
                    document.meta.puppeteerPDF
                );
                ptConf = Object.assign(ptConf, { path: item.fileName });
                await page.pdf(ptConf);
                break;
            case exportFormat.JPG:
            case exportFormat.PNG:
                ptConf = mergeSettings(
                    config.puppeteerDefaultSetting.image,
                    config.puppeteerUserSetting.image,
                    document.meta.puppeteerImage
                );
                ptConf = Object.assign(ptConf, { path: item.fileName, type: item.format == exportFormat.JPG ? "jpeg" : "png" });
                if (item.format == exportFormat.PNG) ptConf.quality = undefined;
                await page.screenshot(ptConf);
                break;
            default:
                return Promise.reject("PuppeteerExporter does not support HTML export.");
        }
    }
    FormatAvailable(format: exportFormat) {
        return [
            exportFormat.PDF,
            exportFormat.JPG,
            exportFormat.PNG
        ].indexOf(format) > -1;
    }

    private checkPuppeteerBinary() {
        return config.puppeteerExecutable || fs.existsSync(puppeteer.executablePath());
    }
    private async fetchBinary(progress: Progress) {
        let pt = require('puppeteer');
        let fetcher = pt.createBrowserFetcher();
        const revision = require(path.join(context.extensionPath, 'node_modules', 'puppeteer', 'package.json')).puppeteer.chromium_revision;
        const revisionInfo = fetcher.revisionInfo(revision);
        let lastPg = 0;
        progress.report({
            message: "Downloading Chromium...",
        });
        return fetcher.download(revisionInfo.revision, (downloadedBytes: number, totalBytes: number) => {
            let pg: number = ~~(downloadedBytes / totalBytes * 100);
            if (pg - lastPg) progress.report({
                message: `Downloading Chromium...(${pg}%)`,
                increment: pg - lastPg
            });
            lastPg = pg;
        });
    }
}
export const puppeteerExporter = new PuppeteerExporter();