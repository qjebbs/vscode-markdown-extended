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
    let haveEndMarker: boolean = false;

    // scan marker length
    let mem = pos;
    pos = state.skipChars(pos, marker);
    let len = pos - mem;
    if (len < _minMarkerLen) return false;

    let markup: string = state.src.slice(mem, pos);
    let type = "", title = "";
    let paramStr: string = state.src.slice(pos, max).trim()
    let sepPos = paramStr.indexOf(' ');
    type = paramStr.substring(0, sepPos);
    title = paramStr.substring(sepPos + 1, paramStr.length);
    if (_types.indexOf(type) < 0) type = "note";

    // Since start is found, we can report success here in validation mode
    if (silent) return true;

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

        if (state.src.charCodeAt(pos) !== _marker) { continue; }

        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            // closing fence should be indented less than 4 spaces
            continue;
        }

        pos = state.skipChars(pos, marker);

        // closing code fence must be at least as long as the opening one
        if (pos - mem < len) { continue; }

        // make sure tail has spaces only
        pos = state.skipSpaces(pos);

        if (pos < max) { continue; }

        haveEndMarker = true;
        // found!
        break;
    }
    // // If a fence has heading spaces, they should be removed from its inner block
    // len = state.sCount[startLine];

    let oldParent = state.parentType;
    let oldLineMax = state.lineMax;
    state.parentType = "admonition";
    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = nextLine;

    let token = state.push('admonition', 'div', 0);
    token.info = type;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];

    token = state.push("admonition_open", "div", 1);
    token.markup = markup;
    token.block = true;
    token.info = type;
    token.map = [startLine, nextLine];

    // admonition title
    token = state.push("admonition_title_open", "p", 1);
    token.markup = markup + " " + type;
    token.map = [startLine, nextLine];

    token = state.push("inline", "", 0);
    token.content = title;
    token.map = [startLine, state.line - 1];
    token.children = [];

    token = state.push("admonition_title_close", "p", -1);
    token.markup = markup + " " + type;

    state.md.block.tokenize(state, startLine + 1, nextLine);

    token = state.push("admonition_close", "div", -1);
    token.markup = markup;
    token.block = true;

    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.line = nextLine + (haveEndMarker ? 1 : 0);
    return true;
}