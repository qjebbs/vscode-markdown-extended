import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { readContributeFile } from './tools';

export namespace Contributors {

    export interface Contributor {
        extension: vscode.Extension<any>,
        type: Type,
        styles: string[],
        scripts: string[],
    }
    export enum Type {
        unknown,
        official,
        thirdParty,
    }

    const all = vscode.extensions.all
        .map(e => getContributor(e))
        .filter(c => c && (c.styles.length + c.scripts.length));

    export function getStyles(filter?: ((contributor: Contributor) => boolean)): string[] {
        return getFiles(all, filter, true).map(file => readContributeFile(file, true));
    }
    export function getScripts(filter?: ((contributor: Contributor) => boolean)): string[] {
        return getFiles(all, filter, false).map(file => readContributeFile(file, false));
    }

    function getContributor(ext: vscode.Extension<any>): Contributor {
        if (!ext || !ext.packageJSON || !ext.packageJSON.contributes)
            return undefined;
        return <Contributor>{
            extension: ext,
            type: getContributorType(ext),
            styles: getContributeFiles(ext, "markdown.previewStyles"),
            scripts: getContributeFiles(ext, "markdown.previewScripts"),
        };
    }

    function getContributeFiles(ext: vscode.Extension<any>, name: string): string[] {
        let results: string[] = [];
        let files = ext.packageJSON.contributes[name];
        if (files && files.length) {
            files.forEach(file => {
                if (!path.isAbsolute(file))
                    file = path.join(ext.extensionPath, file);
                if (!fs.existsSync(file)) return;
                results.push(file);
            });
        }
        return results;
    }

    function getContributorType(ext: vscode.Extension<any>): Type {
        if (!ext || !ext.packageJSON || !ext.packageJSON.publisher) return Type.unknown;
        if (ext.packageJSON.publisher) {
            if (ext.packageJSON.publisher == "vscode") {
                return Type.official;
            } else {
                return Type.thirdParty;
            }
        } else {
            return Type.unknown;
        }
    }

    function getFiles(
        contributors: Contributor[],
        filter: ((contributor: Contributor) => boolean),
        isStyle: boolean
    ): string[] {
        let files: string[] = [];
        if (!filter) filter = () => true;
        contributors.filter(c => filter(c))
            .forEach(c => files.push(...(isStyle ? c.styles : c.scripts)))
        return files;
    }
}