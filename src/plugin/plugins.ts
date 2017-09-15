import * as markdowIt from 'markdown-it';

interface markdowItPlugin {
    plugin: Function,
    options?: any
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
    { plugin: require('markdown-it-table-of-contents'), options: { slugify: slugify, includeLevel: [1, 2, 3] } },
    // { plugin: require('markdown-it-headinganchor'), options: { slugify: slugify } },
]

function slugify(s: string) {
    // Unicode-friendly
    var spaceRegex = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;
    return encodeURIComponent(s.replace(spaceRegex, '-').toLowerCase());
}