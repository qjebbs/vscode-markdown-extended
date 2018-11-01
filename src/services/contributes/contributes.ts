import { Contributors } from './contributors';
import { createContributeItem } from './tools';
import { mdConfig } from './mdConfig';
import * as vscode from 'vscode';

export namespace Contributes {
    export namespace Styles {
        /**
         * get all contribute styles, include official and thirdParty
         * Notice: all() does not include user setting styles
         */
        export function all() {
            return Contributors.getStyles()
                .join("\n").trim();
        }
        /**
         * get official contributed styles
         */
        export function official() {
            return Contributors.getStyles(c => c.type === Contributors.Type.official)
                .join("\n").trim();
        }
        /**
         * get third party contributed styles
         */
        export function thirdParty() {
            return Contributors.getStyles(c => c.type !== Contributors.Type.official)
                .join("\n").trim();
        }
        /**
         * get user setting styles for target document
         * @param uri uri of target document
         */
        export function user(uri: vscode.Uri) {
            let conf = mdConfig.styles(uri);
            return conf.embedded.concat(conf.linked)
                .join("\n").trim();
        }
    }
    export namespace Scripts {
        /**
         * get all contribute scripts, include official and thirdParty
         */
        export function all() {
            return Contributors.getScripts()
                .join("\n").trim();
        }
        /**
         * get official contributed scripts
         */
        export function official() {
            return Contributors.getScripts(c => c.type === Contributors.Type.official)
                .join("\n").trim();
        }
        /**
         * get third party contributed scripts
         */
        export function thirdParty() {
            return Contributors.getScripts(c => c.type !== Contributors.Type.official)
                .join("\n").trim();
        }
    }
    /**
     * create contribute style item by given content
     * @param content css styles content to create
     * @param comment comment to put beside the contribute item
     */
    export function createStyle(content: string | Buffer, comment: string): string {
        return createContributeItem(content, true, comment);
    }
    /**
     * create contribute script item by given content
     * @param content javascript content to create
     * @param comment comment to put beside the contribute item
     */
    export function createScript(content: string | Buffer, comment: string): string {
        return createContributeItem(content, true, comment);
    }
}
