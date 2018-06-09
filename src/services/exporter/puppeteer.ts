import * as puppeteer from 'puppeteer';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MarkdownDocument } from '../common/markdownDocument';
import { mkdirsSync, mergeSettings } from '../common/tools';
import { renderHTML } from './shared';
import { MarkdownExporter, exportFormat, Progress } from './interfaces';
import { config } from '../common/config';
import { context } from '../../extension';

class PuppeteerExporter implements MarkdownExporter {
    async Export(document: MarkdownDocument, format: exportFormat, fileName: string, progress: Progress) {

        if (!this.checkPuppeteerBinary()) {
            let result = await vscode.window.showInformationMessage("Do you want to download exporter dependency Chromium?", "Yes", "No");
            if (result == "Yes") {
                await this.fetchBinary(progress);
            } else {
                vscode.window.showInformationMessage("Download cancelled. Try configure 'puppeteerExecutable' to use customize executable.");
                return;
            }
        }

        progress.report({
            message: `Exporting ${path.basename(fileName)}...`,
        });

        let html = renderHTML(document, true, format);
        let conf: any = {};
        mkdirsSync(path.dirname(fileName));

        let exec = config.puppeteerExecutable;
        let opt = exec ? <puppeteer.LaunchOptions>{
            executablePath: exec
        } : undefined;
        const browser = await puppeteer.launch(opt);
        const page = await browser.newPage();
        await page.setContent(html);
        switch (format) {
            case exportFormat.PDF:
                conf = mergeSettings(
                    config.puppeteerDefaultSetting.pdf,
                    config.puppeteerUserSetting.pdf,
                    document.meta.puppeteerPDF
                );
                conf = Object.assign(conf, { path: fileName });
                await page.pdf(conf);
                break;
            case exportFormat.JPG:
            case exportFormat.PNG:
                conf = mergeSettings(
                    config.puppeteerDefaultSetting.image,
                    config.puppeteerUserSetting.image,
                    document.meta.puppeteerImage
                );
                conf = Object.assign(conf, { path: fileName, type: format == exportFormat.JPG ? "jpeg" : "png" });
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
                increment: pg - lastPg
            });
            lastPg = pg;
        });
    }
}
export const puppeteerExporter = new PuppeteerExporter();