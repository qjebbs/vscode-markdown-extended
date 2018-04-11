import { MarkdownIt, Token } from 'markdown-it';
import { slugify } from './shared';

const anchorLinkReg = /\[.+?\]\(\s*#(\S+?)\s*\)/ig;

export function MarkdownItAnchorLink(md: MarkdownIt) {
    md.core.ruler.push("tocAnchor", anchorLinkWorker);
}

function anchorLinkWorker(state: any) {
    state.tokens.map(t => {
        if (
            t.type == "inline" &&
            t.children &&
            t.children.length &&
            anchorLinkReg.test(t.content)
        ) {
            let matches: RegExpMatchArray;
            let links: string[] = [];
            anchorLinkReg.lastIndex = 0;
            while (matches = anchorLinkReg.exec(t.content)) {
                links.push("#" + slugify(matches[1]));
            }
            let linkCount: number = t.children.reduce((p, c) => p += c.type == "link_open" ? 1 : 0, 0);
            if (linkCount !== links.length) {
                console.log("markdownExtended: Link count and link token count mismatch!");
            } else {
                t.children.map(t => {
                    if (t.type == "link_open")
                        t.attrs = [["href", links.shift()]];
                });
            }
        }
    });
}