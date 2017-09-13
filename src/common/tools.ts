import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function calculateExportPath(source: string): string {
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

    return path.join(exportDir, path.basename(source, ".md") + ".html");
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