import { ConfigReader } from "./configReader";
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { context } from "../../extension";
import { readContributeFile } from "../contributes/tools";

interface MarkdownStyles {
    embedded: string[];
    linked: string[]
}

class MDConfig extends ConfigReader {
    constructor() {
        super('markdown');
    }

    onChange() { }
    styles(uri: vscode.Uri): MarkdownStyles {
        const ISURL = /^http.+/i;
        let styles: MarkdownStyles = {
            embedded: [],
            linked: [],
        };
        let stylePathes = this.read<string[]>('styles', uri, (root, value) => {
            return value.map(v => {
                if (ISURL.test(v)) return v;
                return path.join(root.fsPath, v);
            })
        });
        if (!stylePathes || !stylePathes.length) return styles;
        stylePathes.map(stl => {
            let style = "";
            if (ISURL.test(stl)) {
                styles.linked.push(`<link rel="stylesheet" href="${stl}">`);
            } else {
                let result = readContributeFile(stl, true);
                if (result) styles.embedded.push(result);
            }
        });
        return styles;
    }
}

export const mdConfig = new MDConfig();