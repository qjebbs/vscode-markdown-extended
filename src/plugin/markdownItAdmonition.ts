import { MarkdownIt, Token, Renderer } from 'markdown-it';

const
    _marker = 33 /* '!' */,
    _minMarkerLen = 3,
    _types = ["note", "hint", "attention", "caution", "danger", "error"];

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
        tokens[idx].attrPush(["class", "admonition " + token.info]);
    } else if (token.type === "admonition_title_open") {
        tokens[idx].attrPush(["class", "admonition-title"]);
    }
    return self.renderToken(tokens, idx, _options);
}

function admonition(state, startLine, endLine, silent) {
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
    let type = "", title = "";
    let paramsr: string[] = state.src.slice(pos, max).trim().split(' ');
    type = paramsr.shift().toLowerCase();
    title = paramsr.join(' ');
    if (_types.indexOf(type) < 0) type = "note";
    if (!title) title = type.substr(0, 1).toUpperCase() + type.substr(1, type.length - 1);

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
    token.info = type;
    token.map = [startLine, startLine + 1];

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