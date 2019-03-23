import { MarkdownIt } from 'markdown-it';
import * as container from 'markdown-it-multimd-table';

export function MarkdownItMultiMdTable(md: MarkdownIt) {
    md.use(container, { enableMultilineRows: true });
}