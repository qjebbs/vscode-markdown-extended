import { MarkdownIt, Token } from 'markdown-it';
import { MarkdownItEnv, HtmlExporterEnv } from '../services/common/interfaces';
import * as path from 'path';
import * as fs from 'fs';

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
            removeVsUri(t, env.vsUri);
            if (env.embedImage) embedImage(t, env.workspaceFolder);
        }
        if (t.children) enumTokens(t.children, env);
    });
}
function removeVsUri(token: Token, vsUri: string) {
    let index = 0;
    let src = "";
    for (let i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i][0] == "src") {
            index = i;
            src = token.attrs[i][1];
        }
    }
    token.attrs[index][1] = decodeURIComponent(src.replace(vsUri, ""));
}
function embedImage(token: Token, basePath: string) {
    let index = 0;
    let src = "";
    for (let i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i][0] == "src") {
            index = i;
            src = token.attrs[i][1];
        }
    }
    token.attrs[index][1] = image2Base64(src, basePath);
}
function image2Base64(src: string, basePath: string): string {
    let file = path.join(basePath, src);
    if (!fs.existsSync(file)) return src;
    let ext = path.extname(src).toLowerCase();
    let scheme = "";
    switch (ext) {
        case ".gif":
            scheme = "image/gif";
            break;
        case ".png":
            scheme = "image/png";
            break;
        case ".jpg":
        case ".jpeg":
            scheme = "image/jpeg";
            break;
        case ".icon":
        case ".ico":
            scheme = "image/x-icon";
            break;
        default:
            scheme = "";
            break;
    }
    if (!scheme) return src;
    let b64 = fs.readFileSync(file).toString('base64');
    return `data:${scheme};base64,${b64}`;
}
