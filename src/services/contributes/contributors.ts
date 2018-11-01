import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { readContributeFile, createContributeItem } from './tools';

export namespace Contributors {

    export interface Contributor {
        extension: vscode.Extension<any>,
        type: Type,
        catagory: Catagory,
        styles: string[],
        scripts: string[],
    }
    export enum Type {
        unknown,
        official,
        thirdParty,
    }
    export enum Catagory {
        none,
        theme,
        feature,
    }

    const all = vscode.extensions.all
        .map(e => getContributor(e))
        .filter(c => c.catagory !== Contributors.Catagory.none);

    export function getStyles(filter?: ((contributor: Contributor) => boolean)): string[] {
        return getFiles(all, filter, true).map(file => readContributeFile(file, true));
    }
    export function getScripts(filter?: ((contributor: Contributor) => boolean)): string[] {
        return getFiles(all, filter, false).map(file => readContributeFile(file, false));
    }

    function getContributor(ext: vscode.Extension<any>): Contributor {
        let info = <Contributor>{
            extension: ext,
            type: getType(ext),
            catagory: Catagory.none,
            styles: [],
            scripts: [],
        };
        if (!ext || !ext.packageJSON || !ext.packageJSON.contributes) return info;

        const isThemeReg = /.vscode-(body|light|dark|high-contrast)/i;
        let files: string[] = ext.packageJSON.contributes["markdown.previewStyles"];
        if (files && files.length) {
            let isTheme = false;
            files.forEach(file => {
                file = path.join(ext.extensionPath, file);
                if (!fs.existsSync(file)) return;
                isTheme = isTheme || isThemeReg.test(fs.readFileSync(file).toString());
                info.styles.push(file);
            });
            info.catagory = isTheme ? Catagory.theme : Catagory.feature;
        } else {
            info.catagory = Catagory.none;
        }

        files = ext.packageJSON.contributes["markdown.previewScripts"];
        if (files && files.length) {
            files.forEach(file => {
                file = path.join(ext.extensionPath, file);
                if (!fs.existsSync(file)) return;
                info.scripts.push(file);
            });
            if (info.scripts.length && info.catagory === Catagory.none)
                info.catagory = Catagory.feature;
        }
        return info;
    }

    function getType(ext: vscode.Extension<any>): Type {
        if (!ext || !ext.packageJSON || !ext.packageJSON.contributes) return Type.unknown;
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