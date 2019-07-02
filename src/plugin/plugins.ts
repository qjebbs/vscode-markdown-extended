import * as markdowIt from 'markdown-it';
import { MarkdownItTOC } from './markdownItTOC';
import { MarkdownItContainer } from './markdownItContainer';
import { MarkdownItAnchorLink } from './markdownItAnchorLink';
import { MarkdownItExportHelper } from './markdownItExportHelper';
import { MarkdownItAdmonition } from './markdownItAdmonition';

interface markdowItPlugin {
    plugin: Function,
    args: object[],
}

export var plugins: markdowItPlugin[] = [
    $(MarkdownItTOC),
    $(MarkdownItAnchorLink), // MarkdownItAnchorLink requires MarkdownItTOC
    $(MarkdownItContainer),
    $(MarkdownItAdmonition),
    $('markdown-it-footnote'),
    $('markdown-it-abbr'),
    $('markdown-it-sup'),
    $('markdown-it-sub'),
    $('markdown-it-checkbox'),
    $('markdown-it-attrs'),
    $('markdown-it-kbd'),
    $('markdown-it-underline'),
    $('markdown-it-mark'),
    $('markdown-it-deflist'),
    $('markdown-it-emoji'),
    $('markdown-it-multimd-table', { enableMultilineRows: true, enableRowspan: true }),
    $('markdown-it-html5-embed', { html5embed: { useImageSyntax: true, useLinkSyntax: true } }),
    $(MarkdownItExportHelper)
]

function $(plugin: string | Function, ...args: any[]): markdowItPlugin {
    return {
        plugin: plugin instanceof Function ? plugin : require(plugin),
        args: args,
    }
}