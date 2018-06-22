import { ConfigReader } from "./configReader";
import * as vscode from 'vscode';
import * as fs from 'fs';

class Config extends ConfigReader {
    constructor() {
        super('markdownExtended');
    }

    onChange() { }
    get tocLevels(): Number[] {
        let conf = this.read<Number[]>('tocLevels');
        if (!(conf instanceof Array)) conf = [];
        if (conf.length) conf = conf.filter(c => typeof c == "number");
        if (!conf.length) return [1, 2, 3];
        return conf;
    }
    get exportOutDirName(): string {
        return this.read<string>('exportOutDirName');
    }
    get puppeteerExecutable(): string {
        let exe = this.read<string>('puppeteerExecutable');
        return fs.existsSync(exe) ? exe : "";
    }
    get pdfFormat(): string {
        return this.read<string>('pdfFormat');
    }
    get pdfWidth(): string {
        return this.read<string>('pdfWidth');
    }
    get pdfHeight(): string {
        return this.read<string>('pdfHeight');
    }
    get pdfLandscape(): boolean {
        return this.read<boolean>('pdfLandscape');
    }
    get pdfMarginTop(): string {
        return this.read<string>('pdfMarginTop');
    }
    get pdfMarginRight(): string {
        return this.read<string>('pdfMarginRight');
    }
    get pdfMarginBottom(): string {
        return this.read<string>('pdfMarginBottom');
    }
    get pdfMarginLeft(): string {
        return this.read<string>('pdfMarginLeft');
    }
    get pdfDisplayHeaderFooter(): boolean {
        return this.read<boolean>('pdfDisplayHeaderFooter');
    }
    get pdfPageRanges(): string {
        return this.read<string>('pdfPageRanges');
    }
    get pdfHeaderTemplate(): string {
        return this.read<string>('pdfHeaderTemplate');
    }
    get pdfFooterTemplate(): string {
        return this.read<string>('pdfFooterTemplate');
    }
    get imageQuality(): number {
        return this.read<number>('imageQuality') || 100;
    }
    get imageOmitBackground(): boolean {
        return this.read<boolean>('imageOmitBackground');
    }

    get puppeteerDefaultSetting(): any {
        return {
            pdf: {
                printBackground: true,
            },
            image: {
                quality: 100,
                fullPage: true,
                omitBackground: false,
            }
        }
    }
    get puppeteerUserSetting(): any {
        return {
            pdf: {
                format: this.pdfFormat,
                width: this.pdfWidth,
                height: this.pdfHeight,
                landscape: this.pdfLandscape,
                margin: {
                    top: this.pdfMarginTop,
                    right: this.pdfMarginRight,
                    bottom: this.pdfMarginBottom,
                    left: this.pdfMarginLeft,
                },
                displayHeaderFooter: this.pdfDisplayHeaderFooter,
                pageRanges: this.pdfPageRanges,
                headerTemplate: this.pdfHeaderTemplate,
                footerTemplate: this.pdfFooterTemplate,
            },
            image: {
                quality: this.imageQuality,
                omitBackground: this.imageOmitBackground,
            }
        }
    }
}

export const config = new Config();