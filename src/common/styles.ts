import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export var pluginStyles: string = readStyles().join("\n");

function readStyles(): string[] {
    let styles: string[] = [];
    vscode.extensions.all.map(
        (ext) => {
            if (!ext || !ext.packageJSON || !ext.packageJSON.contributes) return;
            let files: string[] = ext.packageJSON.contributes["markdown.previewStyles"];
            if (!files) return;
            files.map(f => {
                let fn = path.join(ext.extensionPath, f);
                if (!fs.existsSync(fn)) return;
                styles.push(`/* ${path.basename(f)} */\n` + fs.readFileSync(fn));
            });
        }, ""
    );
    return styles;
}