export function validate(): boolean {
    return true;
}

export function render(tokens, idx): string {
    if (tokens[idx].nesting === 1) {
        // opening tag 
        let cls = escape(tokens[idx].info.trim());
        return `<div class="${cls}">\n`;
    } else {
        // closing tag 
        return '</div>\n';
    }
}

function escape(str: string): string {
    return str.replace(/"/g, '&quot;', )
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}