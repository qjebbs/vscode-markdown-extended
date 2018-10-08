import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { outputPanel } from '../../extension';
import { config } from './config';
import { ExportRport } from '../exporter/interfaces';

export function calculateExportPath(uri: vscode.Uri, format: string): string {
    let outDirName = config.exportOutDirName;
    let dir = "";
    let folder = vscode.workspace.getWorkspaceFolder(uri);
    let wkdir = folder ? folder.uri.fsPath : "";
    //if current document is in workspace, organize exports in 'out' directory.
    //if not, export beside the document.
    if (wkdir && isSubPath(uri.fsPath, wkdir)) dir = path.join(wkdir, outDirName);

    let exportDir = path.dirname(uri.fsPath);
    if (!path.isAbsolute(exportDir)) return "";
    if (dir && wkdir) {
        let temp = path.relative(wkdir, exportDir);
        exportDir = path.join(dir, temp);
    }

    return path.join(exportDir, path.basename(uri.fsPath, ".md") + `.${format.toLowerCase()}`);
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

export function mergeSettings(...args: any[]) {
    return args.reduce((p, c) => {
        return Object.assign(p, c);
    }, {});
}

export async function showExportReport(report: ExportRport) {
    let msg = `${report.files.length} file(s) exported in ${report.duration / 1000} seconds`;
    let viewReport = "View Report";
    let btn = await vscode.window.showInformationMessage(msg, viewReport);
    if (btn !== viewReport) return;
    let rpt = `${msg}:\n\n` + report.files.join('\n');
    showMessagePanel(rpt);
}

/**
 * Calculate the Monospace Length of a string, takes CJK character as length of 2
 * @param text text to calculate
 */
export function MonoSpaceLength(text: string): number {
    // https://zhuanlan.zhihu.com/p/33335629
    const CJKVReg = /[\u3006\u3007\u3021-\u3029\u3038-\u303A\u3400-\u4DB5\u4E00-\u9FEA\uF900-\uFA6D\uFA70-\uFAD9\u{17000}-\u{187EC}\u{18800}-\u{18AF2}\u{1B170}-\u{1B2FB}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}]+/ug;
    return text.length * 2 - text.replace(CJKVReg, '').length;

}