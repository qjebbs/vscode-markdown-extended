import * as vscode from 'vscode';
import * as yaml from 'node-yaml';

export class MetaData {
    private _uri: vscode.Uri;
    private _meta: any;
    constructor(data: string, uri: vscode.Uri) {
        this._uri = uri;
        this._meta = yaml.parse(data) || {};
    }
    get puppeteerPDF() {
        if (!this._meta.puppeteer) return {};
        return this._meta.puppeteer.pdf || {};
    }
    get puppeteerImage() {
        if (!this._meta.puppeteer) return {};
        return this._meta.puppeteer.image || {};
    }
}