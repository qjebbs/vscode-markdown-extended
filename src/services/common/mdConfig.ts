import { ConfigReader } from "./configReader";
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { context } from "../../extension";

class MDConfig extends ConfigReader {
    constructor() {
        super('markdown');
    }

    private _styles: string[] = [];
    private _URLStyles: string[] = [];

    onChange() {
        this._styles = [];
        this._URLStyles = [];
    }
    styles(uri: vscode.Uri): string[] {
        if (!this._styles.length && !this._URLStyles.length) this.calcStyles(uri);
        return this._styles
    }
    URLStyles(uri: vscode.Uri): string[] {
        if (!this._styles.length && !this._URLStyles.length) this.calcStyles(uri);
        return this._URLStyles
    }
    private calcStyles(uri: vscode.Uri) {
        const ISURL = /^http.+/i;
        let stylePathes = this.read<string[]>('styles', uri, (root, value) => {
            return value.map(v => {
                if (ISURL.test(v)) return v;
                return path.join(root.fsPath, v);
            })
        });
        if (!stylePathes || !stylePathes.length) return "";
        stylePathes.map(stl => {
            let style = "";
            if (ISURL.test(stl)) {
                this._URLStyles.push(`<link rel="stylesheet" href="${stl}">`);
            } else {
                if (fs.existsSync(stl)) {
                    style = `/* ${path.basename(stl)} */\n${fs.readFileSync(stl)}`;
                } else {
                    style = `/* cannot found ${stl} */`;
                }
                this._styles.push(style);
            }
        });
    }
}

export const mdConfig = new MDConfig();