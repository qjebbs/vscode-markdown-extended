import { MarkdownItTOC } from './markdownItTOC';
import { MarkdownItContainer } from './markdownItContainer';
import { MarkdownItAnchorLink } from './markdownItAnchorLink';
import { MarkdownItExportHelper } from './markdownItExportHelper';
import { MarkdownItAdmonition } from './markdownItAdmonition';
import { config } from '../services/common/config';

interface markdowItPlugin {
    plugin: Function,
    args: object[],
}

let myPlugins = {
    'markdown-it-toc': MarkdownItTOC,
    'markdown-it-container': MarkdownItContainer,
    'markdown-it-admonition': MarkdownItAdmonition,
    'markdown-it-anchor': MarkdownItAnchorLink,
    'markdown-it-helper': MarkdownItExportHelper,
}

export var plugins: markdowItPlugin[] = [
    $('markdown-it-toc'),
    $('markdown-it-anchor'), // MarkdownItAnchorLink requires MarkdownItTOC
    $('markdown-it-container'),
    $('markdown-it-admonition'),
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
    $('markdown-it-helper')
].filter(p => !!p);

function $(name: string, ...args: any[]): markdowItPlugin {
    for (let d of config.disabledPlugins) {
        if ('markdown-it-' + d == name) return undefined;
    }
    let plugin = myPlugins[name];
    if (!plugin) plugin = require(name);
    if (!plugin) return undefined;
    return {
        plugin: plugin,
        args: args,
    }
}