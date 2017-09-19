import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let conf = vscode.workspace.getConfiguration('markdownExtended');

class ConfigReader {
    private _phantomPath: string;

    private _read<T>(key: string): T {
        return conf.get<T>(key);
    }

    watch(): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(() => {
            conf = vscode.workspace.getConfiguration('markdownExtended');
            this._phantomPath = "";
        })
    }

    get phantomPath(): string {
        return this._phantomPath || (() => {
            let phantomPath = this._read<string>('phantomPath');
            if (!phantomPath) return "";
            if (!fs.existsSync(phantomPath)) {
                vscode.window.showWarningMessage("Invalid phantom binary path.");
                return "";
            }
            this._phantomPath = phantomPath;
            return phantomPath;
        })();
    }

}

export const config = new ConfigReader();