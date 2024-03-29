import { MarkdownIt, Token, Renderer } from "../@types/markdown-it";

const
    _marker = 33 /* '!' */,
    _minMarkerLen = 3,
    _types = [
        "note",  //rgba(68,138,255,.1) "\E3C9"
        "summary", "abstract", "tldr",  //rgba(0,176,255,.1) "\E8D2"
        "info", "todo",   //rgba(0,184,212,.1) "\E88E"
        "tip", "hint",   //rgba(0,191,165,.1) "\E80E"
        "success", "check", "done",  //rgba(0,200,83,.1) "\E876"
        "question", "help", "faq",  //rgba(100,221,23,.1) "\E887"
        "warning", "attention", "caution", //rgba(255,145,0,.1) "\E002""\E417"
        "failure", "fail", "missing",  //rgba(255,82,82,.1) "\E14C"
        "danger", "error", "bug", //rgba(255,23,68,.1) "\E3E7""\E14C""\E868"
        "example", "snippet", //rgba(101,31,255,.1) "\E242"
        "quote", "cite",   //rgba(158, 158, 158, .1) "\E244"
    ];

export function MarkdownItAdmonition(md: MarkdownIt) {
    md.block.ruler.after("fence", "admonition", admonition, {});
    md.renderer.rules["admonition_open"] = render;
    md.renderer.rules["admonition_title_open"] = render;
    md.renderer.rules["admonition_title_close"] = render;
    md.renderer.rules["admonition_close"] = render;
}

function render(tokens: Token[], idx: number, _options: any, env: any, self: Renderer) {
    var token = tokens[idx];
    if (token.type === "admonition_open") {
        tokens[idx].attrJoin("class", "admonition " + token.info);
    } else if (token.type === "admonition_title_open") {
        tokens[idx].attrJoin("class", "admonition-title");
    }
    return self.renderToken(tokens, idx, _options);
}

function admonition(state: any, startLine: number, endLine: number, silent: boolean) {
    // if it's indented more than 3 spaces, it should be a code block
    if (state.tShift[startLine] - state.blkIndent >= 4) return false;
    let pos: number = state.bMarks[startLine] + state.tShift[startLine];
    let max: number = state.eMarks[startLine];
    let marker: number = state.src.charCodeAt(pos);
    if (marker !== _marker) return false;

    // scan marker length
    let mem = pos;
    pos = state.skipChars(pos, marker);
    let len = pos - mem;
    if (len < _minMarkerLen) return false;

    let markup: string = state.src.slice(mem, pos);
    // https://python-markdown.github.io/extensions/admonition/
    let params: string = state.src.slice(pos, max).trim();
    let quoteIdx = params.indexOf('"');
    let type = "";
    let classes: string[] = [];
    let title = "";
    if (quoteIdx >= 0) {
        classes = params.substring(0, quoteIdx).trim()
            .split(" ")
            .map(s => s.trim())
            .filter(s => !!s);
        type = classes[0];
        title = params.substring(quoteIdx);
        if (_types.indexOf(type) < 0) {
            classes.unshift("note");
            type = "note";
        }
    } else {
        type = params.split(" ").shift().toLowerCase();
        if (_types.indexOf(type) < 0) {
            type = "note";
            title = params;
        } else {
            title = params.substring(type.length);
        }
        classes.push(type)
    }
    if (title.startsWith('"')) {
        if (title.length > 1 && title.endsWith('"')) {
            title = title.substring(1, title.length - 1);
        } else {
            title = title.substring(1);
        }
    }


    // Since start is found, we can report success here in validation mode
    if (silent) return true;

    let oldParent = state.parentType;
    let oldLineMax = state.lineMax;
    let oldIndent = state.blkIndent;

    state.blkIndent += 4;

    // search end of block
    let nextLine = startLine;
    for (; ;) {
        nextLine++;
        if (nextLine >= endLine) {
            // unclosed block should be autoclosed by end of document.
            // also block seems to be autoclosed by end of parent
            break;
        }
        pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];

        if (pos < max && state.sCount[nextLine] < state.blkIndent) {
            // non-empty line with negative indent should stop the list:
            // - !!!
            //  test
            break;
        }
    }

    state.parentType = "admonition";
    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = nextLine;

    let token = state.push("admonition_open", "div", 1);
    token.markup = markup;
    token.block = true;
    token.info = classes.join(' ');
    token.map = [startLine, startLine + 1];

    if (title != '') {
        // admonition title
        token = state.push("admonition_title_open", "p", 1);
        token.markup = markup + " " + type;
        token.map = [startLine, startLine + 1];

        token = state.push("inline", "", 0);
        token.content = title;
        token.map = [startLine, startLine + 1];
        token.children = [];

        token = state.push("admonition_title_close", "p", -1);
        token.markup = markup + " " + type;
    }

    // parse admonition body
    state.md.block.tokenize(state, startLine + 1, nextLine);

    token = state.push("admonition_close", "div", -1);
    token.markup = markup;
    token.map = [startLine, nextLine];
    token.block = true;

    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.line = nextLine;
    state.blkIndent = oldIndent;
    return true;
}