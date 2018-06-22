import { MarkdownIt, Token } from 'markdown-it';
import * as toc from 'markdown-it-table-of-contents';
import { slugify } from './shared';
import { config } from '../services/common/config';

export function MarkdownItTOC(md: MarkdownIt) {
    md.renderer.rules.tocAnchor = renderHtml;
    md.core.ruler.push("tocAnchor", tocAnchorWorker);
    md.use(toc, { slugify: slugify, includeLevel: config.tocLevels });
}

function renderHtml(tokens: Token[], idx: number) {
    // console.log("request anchor for:", idx, tokens[idx].content);
    let token = tokens[idx];
    if (token.type !== "tocAnchor") return tokens[idx].content;
    return `<a for="toc-anchor" id="${slugify(token.content)}"></a>`;
}

function tocAnchorWorker(state: any) {
    let tokens: Token[] = [];
    state.tokens.map((t, i, ts) => {
        if (t.type == "heading_open") {
            let anchor = new state.Token("tocAnchor", "a", 0);
            anchor.content = ts[i + 1].content;
            tokens.push(anchor);
        }
        tokens.push(t);
    });
    state.tokens = tokens;
}