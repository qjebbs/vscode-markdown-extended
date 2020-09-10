import { MarkdownIt, Token } from '../@types/markdown-it';
import { MarkdownItEnv, HtmlExporterEnv } from '../services/common/interfaces';
import * as path from 'path';
import * as fs from 'fs';
import { fileToDataUri } from '../services/common/dataUri';

export function MarkdownItExportHelper(md: MarkdownIt) {
    md.core.ruler.push("exportHelper", exportHelperWorker);
}

function exportHelperWorker(state: any) {
    let env = (state.env as MarkdownItEnv).htmlExporter;
    if (!env) return;
    enumTokens(state.tokens, env);
}
function enumTokens(tokens: Token[], env: HtmlExporterEnv) {
    tokens.map(t => {
        if (t.type == "image") {
            removeVsUri(t, env);
            if (env.embedImage) embedImage(t, env);
        }
        if (t.children) enumTokens(t.children, env);
    });
}
function removeVsUri(token: Token, env: HtmlExporterEnv) {
    let index = 0;
    let src = "";
    for (let i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i][0] == "src") {
            index = i;
            src = token.attrs[i][1];
        }
    }
    token.attrs[index][1] = decodeURIComponent(src.replace(env.vsUri, ""));
}
function embedImage(token: Token, env: HtmlExporterEnv) {
    let index = 0;
    let src = "";
    for (let i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i][0] == "src") {
            index = i;
            src = token.attrs[i][1];
            break;
        }
    }
    token.attrs[index][1] = image2Base64(src, env);
}
function image2Base64(src: string, env: HtmlExporterEnv): string {
    let paths = [path.dirname(env.uri.fsPath)];
    if (env.workspaceFolder) paths.push(env.workspaceFolder.fsPath);
    let file = searchFile(src, paths);
    if (!file) return src;
    return fileToDataUri(file)
}

function searchFile(name: string, paths: string[]): string {
    if (path.isAbsolute(name)) return name;
    for (let p of paths) {
        let file = path.join(p, name);
        if (fs.existsSync(file))
            return file;
    }
    return undefined;
}