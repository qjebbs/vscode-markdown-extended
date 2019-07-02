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
    let nb = Buffer.alloc(0);
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
    // https://zh.wikipedia.org/wiki/%E4%B8%AD%E6%97%A5%E9%9F%A9%E7%AC%A6%E5%8F%B7%E5%92%8C%E6%A0%87%E7%82%B9
    // https://zh.wikipedia.org/wiki/%E5%85%A8%E5%BD%A2%E5%92%8C%E5%8D%8A%E5%BD%A2
    // https://ja.wikipedia.org/wiki/%E5%B9%B3%E4%BB%AE%E5%90%8D
    const CJKVReg = /[\u2190-\u2193\u2502\u25A0\u25CB\u3000-\u303F\u309B\u309C\u30A1-\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C3\u30C4\u30C6\u30C8\u30CA-\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA-\u30ED\u30EF\u30F3\u30FC\u3131-\u3164\u3400-\u4DB5\u4E00-\u9FEA\uF900-\uFA6D\uFA70-\uFAD9\uFF01-\uFF60\uFFE0-\uFFE6\u{17000}-\u{187EC}\u{18800}-\u{18AF2}\u{1B170}-\u{1B2FB}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{3041}-\u{309F}]+/ug;
    return text.length * 2 - text.replace(CJKVReg, '').length;

}


/**
 * cssFileToDataUri embeds files referred by url(), with data uri, while fileToDataUri not
 * @param cssFileName path of the css file
 */
export function cssFileToDataUri(cssFileName: string): string {
    let URL_REG = /url\(([^()]+)\)/ig;
    if (!fs.existsSync(cssFileName))
        return "";
    let css = fs.readFileSync(cssFileName).toString();
    css = css.replace(URL_REG, (substr, ...args: any[]) => {
        let filePath = args[0] as string;
        if (
            filePath.substr(1, 5).toLowerCase() == "data:" ||
            filePath.substr(0, 5).toLowerCase() == "data:"
        ) return substr;
        if (!path.isAbsolute(filePath))
            filePath = path.resolve(path.dirname(cssFileName), filePath)
        try {
            return `url("${fileToDataUri(filePath)}")`;
        } catch (error) {
            console.log(error);
            return substr;
        }
    });
    return `data:text/css;base64,${Buffer.from(css).toString("base64")}`;
}

export function fileToDataUri(fileName: string): string {
    if (!fs.existsSync(fileName))
        return null;
    let schema = getDataUriSchema(fileName);
    let buf = fs.readFileSync(fileName);
    return `${schema}${buf.toString("base64")}`
}

export function getDataUriSchema(fileName: string): string {
    let ext = path.extname(fileName).toLowerCase();
    let mimeType = null;
    switch (ext) {
        case ".js":
            mimeType = "text/javascript"
            break;
        case ".css":
            mimeType = "text/css"
            break;
        case ".woff":
            mimeType = "font/woff"
            break;
        case ".woff2":
            mimeType = "font/woff2"
            break;
        case ".otf":
            mimeType = "font/otf"
            break;
        case ".ttf":
            mimeType = "font/ttf"
        case ".sfnt":
            mimeType = "font/sfnt"
            break;
        case ".jpe":
        case ".jpeg":
        case ".jpg":
            mimeType = "image/jpeg"
            break;
        case ".svg":
            mimeType = "image/svg+xml"
            break;
        case ".gif":
            mimeType = "image/gif"
            break;
        case ".ico":
            mimeType = "image/x-icon"
            break;
        case ".bmp":
            mimeType = "image/bmp"
            break;
        default:
            throw (`Unsupported mimeType for "${ext}" file.`);
    }
    return `data:${mimeType};base64,`
}
