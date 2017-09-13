let pluginNames: string[] = [
    'markdown-it-footnote',
    'markdown-it-abbr',
    'markdown-it-sup',
    'markdown-it-sub',
    'markdown-it-checkbox',
    'markdown-it-attrs',
    'markdown-it-kbd',
    'markdown-it-underline',
    'markdown-it-toc',
]

export var plugins: any = pluginNames.map(config => require(config));

