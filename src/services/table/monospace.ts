// http://www.unicode.org/Public/10.0.0/ucd/Scripts.txt
// https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation
const ranges = [
    "\\p{Script=Han}",
    "\\p{Script=Katakana}",
    "\\p{Script=Hiragana}",
    "\\p{Script=Hangul}",
    "\\p{Script=Tangut}",
    "\\p{Script=Nushu}",
    // FULLWIDTH 
    "\uFF01-\uFF60", "\uFFE0-\uFFE6",
    // Arrows
    "\u2190-\u2199",
    // BOX DRAWINGS 
    "\u2500-\u25B6",
    // Punctuation
    "\u3000-\u303F", "\u309B\u309C",
    // Japanese Punctuation
    "\u3099-\u309C", "\u30A0", "\u30FB\u30FC",
    // Extra
    "\u25CB",
]
const CJKV_REG = new RegExp('[' + ranges.join('') + ']', "ug");
const HIGH_POINTS_REG = /[\u{10000}-\u{FFFFF}]/ug;

/**
 * Calculate the Monospace Length of a string, takes CJK character as length of 2
 * @param text text to calculate
 */
export function MonoSpaceLength(text: string): number {
    let highPointCount = (text.length - text.replace(HIGH_POINTS_REG, '').length) / 2;
    let characterCount = text.length - highPointCount;
    let halfWidthCount = text.replace(CJKV_REG, '').length;
    let fullWidthCount = characterCount - halfWidthCount;

    return fullWidthCount * 2 + halfWidthCount;
}

// console.log(
//     unicodeRangeHelper(
//         // Arrows
//         "\u25CB\u2190-\u2199",
//     )
// );
// function unicodeRangeHelper(...inputs) {
//     let range=inputs.join('');
//     let points = [];
//     for (let i = 0; i < range.length; i++) {
//         let current = range[i];
//         let code = current.charCodeAt(0);
//         let next1 = i < range.length - 1 ? range[i + 1] : "";
//         let next2 = i < range.length - 2 ? range[i + 2] : "";
//         if (next1 == '-' && next2) {
//             for (let c = code; c <= next2.charCodeAt(0); c++) {
//                 points.push(c);
//             }
//             i += 2;
//         } else {
//             points.push(code);
//             continue;
//         }
//     }
//     return String.fromCharCode(...points);
// }