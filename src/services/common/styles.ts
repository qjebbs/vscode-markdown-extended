import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';


export namespace contributeStyles {
    let officialStyles: string[] = [];
    let thirdPartyStyles: string[] = [];
    let featuresStyles: string[] = [];

    export function official() {
        readStyles();
        return officialStyles.join("\n").trim();
    }
    export function thirdParty() {
        readStyles();
        return thirdPartyStyles.join("\n").trim();
    }
    export function features() {
        readStyles();
        return featuresStyles.join("\n").trim();
    }
    
    function readStyles() {
        if (officialStyles.length || thirdPartyStyles.length || features.length) return;
        officialStyles = [];
        thirdPartyStyles = [];
        featuresStyles = [];
        vscode.extensions.all.map(
            (ext) => {
                let t = pluginType(ext);
                if (t == MDContributorType.none) return;
                let files: string[] = ext.packageJSON.contributes["markdown.previewStyles"];
                files.map(f => {
                    let fn = path.join(ext.extensionPath, f);
                    if (!fs.existsSync(fn)) return;
                    let style = `/* ${path.basename(f)} */\n` + fs.readFileSync(fn);
                    if (t == MDContributorType.officialTheme)
                        officialStyles.push(style);
                    else if (t == MDContributorType.thirdPartyTheme)
                        thirdPartyStyles.push(style);
                    else
                        featuresStyles.push(style);
                });
            }, ""
        );
    }

    enum MDContributorType {
        none,
        officialTheme,
        officialFeature,
        thirdPartyTheme,
        thirdPartyFeature,
    }

    function pluginType(ext: vscode.Extension<any>): MDContributorType {
        if (!ext || !ext.packageJSON || !ext.packageJSON.contributes) return MDContributorType.none;
        let files: string[] = ext.packageJSON.contributes["markdown.previewStyles"];
        if (!files || !files.length) return MDContributorType.none;
        let isOfficial = ext.packageJSON.publisher && ext.packageJSON.publisher == "vscode";
        const isThemeReg = /.vscode-(body|light|dark|high-contrast)/i;
        let isTheme = files.reduce((p, c) => {
            return p || isThemeReg.test(fs.readFileSync(path.join(ext.extensionPath, c)).toString());
        }, false);
        if (isOfficial) {
            if (isTheme) return MDContributorType.officialTheme; else return MDContributorType.officialFeature;
        } else {
            if (isTheme) return MDContributorType.thirdPartyTheme; else return MDContributorType.thirdPartyFeature;
        }
    }
}
