import * as markdowIt from 'markdown-it';
import { validate, render } from './markdownItContainer';
import { slugify } from './markdownItTOC';

interface markdowItPlugin {
    plugin: Function,
    params?: any[],
}

export var plugins: markdowItPlugin[] = [
    { plugin: require('markdown-it-footnote') },
    { plugin: require('markdown-it-abbr') },
    { plugin: require('markdown-it-sup') },
    { plugin: require('markdown-it-sub') },
    { plugin: require('markdown-it-checkbox') },
    { plugin: require('markdown-it-attrs') },
    { plugin: require('markdown-it-kbd') },
    { plugin: require('markdown-it-underline') },
    { plugin: require('markdown-it-table-of-contents'), params: [{ slugify: slugify, includeLevel: [1, 2, 3] }] },
    { plugin: require('markdown-it-container'), params: ["container", { validate: validate, render: render }] },
]