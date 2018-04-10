import * as markdowIt from 'markdown-it';

export function slugify(s: string) {
    // Unicode-friendly
    var spaceRegex = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;
    return encodeURIComponent(s.replace(spaceRegex, '-').toLowerCase());
}

export function tocAnchorPlugin(md: any) {
    md.renderer.rules.tocAnchor = renderHtml;
    md.core.ruler.push("tocAnchor", tocAnchorWorker);
}

function renderHtml(tokens: markdowIt.Token[], idx: number) {
    // console.log("request anchor for:", idx, tokens[idx].content);
    let token = tokens[idx];
    if (token.type !== "tocAnchor") return tokens[idx].content;
    return `<a for="toc-anchor" id="${slugify(token.content)}"/>`;
}

function tocAnchorWorker(state: any) {
    let tokens: markdowIt.Token[] = [];
    state.tokens.map((t, i, ts) => {
        if (t.type == "heading_open") {
            let anchor = new state.Token("tocAnchor", t.tag, t.nesting);
            anchor.content = ts[i + 1].content;
            tokens.push(anchor);
        }
        tokens.push(t);
    });
    state.tokens = tokens;
}