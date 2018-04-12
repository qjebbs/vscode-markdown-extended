import * as vscode from 'vscode';
import * as yaml from 'node-yaml';
import { config } from "./config";

export class MetaData {
    private _uri: vscode.Uri;
    private _meta: any;
    constructor(data: string, uri: vscode.Uri) {
        this._uri = uri;
        this._meta = yaml.parse(data);
    }
    get phantomConfig() {
        let conf = this._meta.phantomjs || {};
        let folder = vscode.workspace.getWorkspaceFolder(this._uri);
        if (folder && folder.uri) {
            conf.base = "file:///" + folder.uri.fsPath + "/";
        }
        if (!conf.type) conf.type = "pdf";
        conf.phantomPath = config.phantomPath;
        return conf;
    }
}