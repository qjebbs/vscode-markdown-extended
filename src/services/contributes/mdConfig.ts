import * as vscode from 'vscode';
import * as path from 'path';
import { readContributeFile } from "./tools";
import { ConfigReader } from '../common/configReader';

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
        const ISURL = /^\s*https?:\/\//i;
        let styles: MarkdownStyles = {
            embedded: [],
            linked: [],
        };
        let stylePathes = this.read<string[]>('styles', uri, (root, value) => {
            return value.map(v => {
                if (!ISURL.test(v) && !path.isAbsolute(v))
                    v = path.join(root.fsPath, v);
                return v;
            })
        });
        if (!stylePathes || !stylePathes.length) return styles;
        stylePathes.map(fileOrUrl => {
            if (ISURL.test(fileOrUrl)) {
                styles.linked.push(`<link rel="stylesheet" href="${fileOrUrl}">`);
            } else {
                let result = readContributeFile(fileOrUrl, true);
                if (result) styles.embedded.push(result);
            }
        });
        return styles;
    }
}

export const mdConfig = new MDConfig();