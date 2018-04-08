import { ConfigReader } from "./configReader";
import * as vscode from 'vscode';
import * as fs from 'fs';

class Config extends ConfigReader {
    constructor() {
        super('markdownExtended');
    }

    private _phantomPath: string;

    onChange() {
        this._phantomPath = "";
    }

    get phantomPath(): string {
        return this._phantomPath || (() => {
            let phantomPath = this.read<string>('phantomPath');
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

export const config = new Config();