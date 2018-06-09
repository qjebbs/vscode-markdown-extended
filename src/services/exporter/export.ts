import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exportOption, ExportItem } from "./interfaces";
import { calculateExportPath, isSubPath } from "../common/tools";
import { MarkdownDocument } from '../common/markdownDocument';

export function MarkdownExport(uri: vscode.Uri, option: exportOption);
export function MarkdownExport(uris: vscode.Uri[], option: exportOption);
export async function MarkdownExport(arg: vscode.Uri | vscode.Uri[], option: exportOption) {
    if (!arg) return exportDocument(await getFileList(), option);
    return exportDocument(await getFileList(arg), option);
}

async function exportDocument(uris: vscode.Uri[], option: exportOption) {
    let confs = uris.map(uri => <ExportItem>{
        uri: uri,
        format: option.format,
        fileName: calculateExportPath(uri, option.format)
    });
    return option.exporter.Export(confs, option.progress);
}

async function getFileList(arg?: vscode.Uri | vscode.Uri[]): Promise<vscode.Uri[]> {
    let _files: vscode.Uri[] = [];

    if (!vscode.workspace.workspaceFolders) { return []; }

    if (!arg) {
        for (let folder of vscode.workspace.workspaceFolders) {
            _files.push(...await getFileList(folder.uri));
        }
    } else if (arg instanceof Array) {
        for (let u of arg.filter(p => p instanceof vscode.Uri)) {
            _files.push(...await getFileList(u));
        }
    } else if (arg instanceof vscode.Uri) {
        if (fs.statSync(arg.fsPath).isDirectory()) {
            let folder = vscode.workspace.getWorkspaceFolder(arg);
            let relPath = path.relative(folder.uri.fsPath, arg.fsPath);
            if (relPath) relPath += '/';
            let files = await vscode.workspace.findFiles(`${relPath}**/*.md`, "");
            _files.push(...files.filter(file => isSubPath(file.fsPath, folder.uri.fsPath)));
        } else {
            _files.push(arg);
        }
    }
    return _files;
}