import * as vscode from 'vscode';
import * as yaml from 'node-yaml';
import { config } from "./config";

export class MetaData {
    private _uri: vscode.Uri;
    private _meta: any;
    constructor(data: string, uri: vscode.Uri) {
        this._uri = uri;
        this._meta = yaml.parse(data) || {};
    }
    get phantomConfig() {
        let folder = vscode.workspace.getWorkspaceFolder(this._uri);

        let defultConf = {
            type: "pdf",
            border: "1cm",
        }
        let conf = getConfig(defultConf, this._meta.phantomjs);
        // confs that can not overrided by user
        conf.base = folder && folder.uri ? "file:///" + folder.uri.fsPath + "/" : "";
        conf.phantomPath = config.phantomPath;
        return conf;
    }
    get puppeteerConfig() {

        let defultConf = {
            format: "A4",
            printBackground: true
        }
        let conf = getConfig(defultConf, this._meta.puppeteer);
        return conf;
    }
}

function getConfig(defultConf, userConf) {
    return Object.assign(defultConf, userConf);
}