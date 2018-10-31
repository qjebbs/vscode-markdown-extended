import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export interface Contributor {
    extension: vscode.Extension<any>,
    type: ContributorType,
    catagory: ContributorCatagory,
    styles: string[],
    scripts: string[],
}

export enum ContributorType {
    unknown,
    official,
    thirdParty,
}

export enum ContributorCatagory {
    none,
    theme,
    feature,
}

export const contributors = vscode.extensions.all
    .map(e => getContributor(e))
    .filter(c => c.catagory !== ContributorCatagory.none);


function getContributor(ext: vscode.Extension<any>): Contributor {
    let info = <Contributor>{
        extension: ext,
        type: getType(ext),
        catagory: ContributorCatagory.none,
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
        info.catagory = isTheme ? ContributorCatagory.theme : ContributorCatagory.feature;
    } else {
        info.catagory = ContributorCatagory.none;
    }

    files = ext.packageJSON.contributes["markdown.previewScripts"];
    if (files && files.length) {
        files.forEach(file => {
            file = path.join(ext.extensionPath, file);
            if (!fs.existsSync(file)) return;
            info.scripts.push(file);
        });
        if (info.scripts.length && info.catagory === ContributorCatagory.none)
            info.catagory = ContributorCatagory.feature;
    }
    return info;
}

function getType(ext: vscode.Extension<any>): ContributorType {
    if (!ext || !ext.packageJSON || !ext.packageJSON.contributes) return ContributorType.unknown;
    if (ext.packageJSON.publisher) {
        if (ext.packageJSON.publisher == "vscode") {
            return ContributorType.official;
        } else {
            return ContributorType.thirdParty;
        }
    } else {
        return ContributorType.unknown;
    }
}