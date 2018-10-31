import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { contributors, ContributorType, ContributorCatagory, Contributor } from './contributors';

export namespace MDContributes {
    export function officialStyles() {
        // console.log("contributors:", contributors.length);
        return getFiles(
            contributors,
            c => (c.type === ContributorType.official),
            true
        ).map(file => readContributeFile(file, true)).join("\n").trim();
    }
    export function thirdPartyStyles() {
        return getFiles(
            contributors,
            c => (c.catagory === ContributorCatagory.theme),
            true
        ).map(file => readContributeFile(file, true)).join("\n").trim();
    }
    export function featureStyles() {
        return getFiles(
            contributors,
            c => (c.catagory === ContributorCatagory.feature),
            true
        ).map(file => readContributeFile(file, true)).join("\n").trim();
    }
    export function thirdPartyScripts() {
        return getFiles(
            contributors,
            c => (c.type === ContributorType.thirdParty),
            false
        ).map(file => readContributeFile(file, false)).join("\n").trim();
    }
    function getFiles(
        contributors: Contributor[],
        callbackFn: ((contributor: Contributor) => boolean),
        isStyle: boolean
    ): string[] {
        let files: string[] = [];
        contributors.filter(c => callbackFn(c))
            .forEach(c => files.push(...(isStyle ? c.styles : c.scripts)))
        return files;
    }
}

export function readContributeFile(file: string, isStyle: boolean): string {
    if (!fs.existsSync(file)) return "";
    let buf = fs.readFileSync(file);
    if (!buf || !buf.length) return "";
    return createContributeItem(buf, isStyle, path.basename(file))
}

export function createContributeItem(content: string | Buffer, isStyle: boolean, comment: string): string {
    if (!content) return "";
    let b64 = content instanceof Buffer ?
        content.toString("base64") :
        new Buffer(content).toString("base64");
    let cmt = comment ? `<!-- ${comment} -->\n` : "";
    if (isStyle) {
        return cmt + `<link rel="stylesheet" type="text/css" href="data:text/css;base64,${b64}"/>`
    } else {
        return cmt + `<script type="text/javascript" src="data:text/javascript;base64,${b64}"/></script>`
    }
}