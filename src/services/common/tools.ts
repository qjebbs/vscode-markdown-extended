import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { outputPanel } from '../../extension';
import { SelectionOffset, applyOffset } from './selectionOffset';

export function calculateExportPath(source: string, format: string): string {
    let outDirName = ""; //config.exportOutDirName
    let dir = "";
    let wkdir = vscode.workspace.rootPath;
    //if current document is in workspace, organize exports in 'out' directory.
    //if not, export beside the document.
    if (wkdir && isSubPath(source, wkdir)) dir = path.join(wkdir, outDirName);

    let exportDir = path.dirname(source);
    if (!path.isAbsolute(exportDir)) return "";
    if (dir && wkdir) {
        let temp = path.relative(wkdir, exportDir);
        exportDir = path.join(dir, temp);
    }

    return path.join(exportDir, path.basename(source, ".md") + `.${format.toLowerCase()}`);
}

export function isSubPath(from: string, to: string): boolean {
    let rel = path.relative(to, from);
    return !(path.isAbsolute(rel) || rel.substr(0, 2) == "..")
}

export function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}

export function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

export function parseError(error: any): string {
    let nb = new Buffer("");
    if (typeof (error) === "string") {
        return error;
    } else if (error instanceof TypeError || error instanceof Error) {
        let err = error as TypeError;
        return err.message + '\n' + err.stack;
    } else if (error instanceof Array) {
        let arrs = error as any[];
        return arrs.reduce((p, err) => p + '\n\n' + err.message + '\n' + err.stack, "");
    } else {
        return error.toString();
    }
}

export function showMessagePanel(message: any) {
    outputPanel.clear();
    outputPanel.appendLine(parseError(message));
    outputPanel.show();
}

export interface RangeReplace {
    range: vscode.Range,
    replace: string,
    selectionOffset?: SelectionOffset,
}

export async function editTextDocument(document: vscode.TextDocument, edits: RangeReplace[]) {
    let editor = await vscode.window.showTextDocument(document);
    editor.edit(e => {
        edits.map(edit => {
            if (!edit || !edit.range || !edit.replace) return;
            e.replace(edit.range, edit.replace);
        })
    }).then(() => {
        let offsets = edits.map(e => e.selectionOffset).filter(s => !!s);
        applyOffset(editor, offsets);
    });
}