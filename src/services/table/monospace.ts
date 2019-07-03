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
    // Extra
    "\u25CB",
]
const CJKVReg = new RegExp('[' + ranges.join('') + ']', "ug");

/**
 * Calculate the Monospace Length of a string, takes CJK character as length of 2
 * @param text text to calculate
 */
export function MonoSpaceLength(text: string): number {
    return text.length * 2 - text.replace(CJKVReg, '').length;
}

// console.log(
//     unicodeRangeHelper(
//         // Arrows
//         "\u25CB\u2190-\u2199",
//     )
// );
// function unicodeRangeHelper(...inputs) {
//     let range=inputs.join();
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