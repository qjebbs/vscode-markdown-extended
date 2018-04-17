# Markdown Extended Readme

Markdown Extended is a extension that extend syntaxes and abilities to VSCode built-in markdown function, including lots of editing helpers and a `what you see is what you get exporter`.

## Features

- Export to HTML / PDF / PNG / JPEG ([View Detail](#exporter-configurations))
- Copy HTML to clipboard
- Enhanced Anchor Link ([View Detail](#enhanced-anchor-link))
- Editing Helpers ([View Detail](#editing-helpers-and-keys))
- Extended Language Features ([View Detail](#extended-syntaxes))

## Requirements

To support extra export formats (with phantom exporter), like PDF/PNG/JPEG, you need to download phantom binary accordingly, and config User Settings:

    "markdownExtended.phantomPath": "path/to/phantomjs.exe"

Download phantom binaries here:

- [Linux 64bit](https://github.com/Medium/phantomjs/releases/download/v2.1.1/phantomjs-2.1.1-linux-x86_64.tar.bz2)
- [Linux 32bit](https://github.com/Medium/phantomjs/releases/download/v2.1.1/phantomjs-2.1.1-linux-i686.tar.bz2)
- [Mac OS](https://github.com/Medium/phantomjs/releases/download/v2.1.1/phantomjs-2.1.1-macosx.zip)
- [Windows](https://github.com/Medium/phantomjs/releases/download/v2.1.1/phantomjs-2.1.1-windows.zip)

## Demos

### Table Editing

![tableEdit](./images/tableEdit.gif)

![moveCols](./images/moveCols.gif)

### Paste as Markdown Table

Copy a table from Excel, Web and other applications which support the format of Comma-Separated Values (CSV), then run the command `Paste as Markdown Table`, you will get the markdown table.

![pasteTable](./images/pasteTable.gif)

### Export & Copy

![command](./images/command-demo.png)

## Editing Helpers and Keys

> Inspired by 
[joshbax.mdhelper](https://marketplace.visualstudio.com/items?itemName=joshbax.mdhelper),
but totally new implements.

| Command                       | Keyboard Shortcut          |
|-------------------------------|----------------------------|
| Format: Toggle Bold           | Ctrl+B                     |
| Format: Toggle Italics        | Ctrl+I                     |
| Format: Toggle Underline      | Ctrl+U                     |
| Format: Toggle Strikethrough  | Alt+S                      |
| Format: Toggle Code Inline    | Alt+`                      |
| Format: Toggle Code Block     | Alt+Shift+`                |
| Format: Toggle Block Quote    | Ctrl+Shift+Q               |
| Format: Toggle Superscript    | Ctrl+Shift+U               |
| Format: Toggle Subscript      | Ctrl+Shift+L               |
| Format: Toggle Unordered List | Ctrl+L, Ctrl+U             |
| Format: Toggle Ordered List   | Ctrl+L, Ctrl+O             |
| Table: Paste as Table         | Ctrl+Shift+T, Ctrl+Shift+P |
| Table: Format Table           | Ctrl+Shift+T, Ctrl+Shift+F |
| Table: Add Columns to Left    | Ctrl+Shift+T, Ctrl+Shift+L |
| Table: Add Columns to Right   | Ctrl+Shift+T, Ctrl+Shift+R |
| Table: Add Rows Above         | Ctrl+Shift+T, Ctrl+Shift+A |
| Table: Add Row Below          | Ctrl+Shift+T, Ctrl+Shift+B |
| Table: Delete Rows            | Ctrl+Shift+D, Ctrl+Shift+R |
| Table: Delete Columns         | Ctrl+Shift+D, Ctrl+Shift+C |
| Table: Move Columns Left      | alt+←                      |
| Table: Move Columns Right     | alt+→                      |

> Looking for `Move Rows Up / Down`?  
> You can use vscode built-in `Move Line Up / Down`, shortcuts are `alt+↑` and `alt+↓`

## Extended Syntaxes

- Enhanced Anchor Link
- [markdown-it-table-of-contents](https://www.npmjs.com/package/markdown-it-table-of-contents)
- [markdown-it-footnote](https://www.npmjs.com/package/markdown-it-footnote)
- [markdown-it-abbr](https://www.npmjs.com/package/markdown-it-abbr)
- [markdown-it-sup](https://www.npmjs.com/package/markdown-it-sup)
- [markdown-it-sub](https://www.npmjs.com/package/markdown-it-sub)
- [markdown-it-checkbox](https://www.npmjs.com/package/markdown-it-checkbox)
- [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)
- [markdown-it-kbd](https://www.npmjs.com/package/markdown-it-kbd)
- [markdown-it-underline](https://www.npmjs.com/package/markdown-it-underline)

> Post an issue on [GitHub][issues] if you want other plugins.

### Enhanced Anchor Link

Now, you're able to write anchor links consistent to heading texts.

```markdown
Go to 
[简体中文](#简体中文), 
[Español Título](#Español-Título).

## 简体中文

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Aenean euismod bibendum laoreet.

## Español Título

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Aenean euismod bibendum laoreet.
```

### markdown-it-table-of-contents

    [[TOC]]

![toc](./images/toc-demo.png)

### markdown-it-footnote

    Here is a footnote reference,[^1] and another.[^longnote]

    [^1]: Here is the footnote.
    [^longnote]: Here's one with multiple blocks.

<p data-line="6" class="code-line">Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup></p>

### markdown-it-abbr

    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
    The HTML specification
    is maintained by the W3C.

<p data-line="15" class="code-line">The <abbr title="Hyper Text Markup Language">HTML</abbr> specification
is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.</p>

### markdown-it-sup markdown-it-sub

    29^th^, H~2~O

<p data-line="20" class="code-line">29<sup>th</sup>, H<sub>2</sub>O</p>

### markdown-it-checkbox

    [ ] unchecked
    [x] checked

<p data-line="24" class="code-line"><input type="checkbox" id="checkbox71"><label for="checkbox71">unchecked</label>
<input type="checkbox" id="checkbox70" checked="true"><label for="checkbox70">checked</label></p>


### markdown-it-attrs

    item **bold red**{style="color:red"}

<p data-line="40" class="code-line">item <strong style="color:red">bold red</strong></p>

### markdown-it-kbd

    [[Ctrl+Esc]]

<p data-line="44" class="code-line"><kbd>Ctrl+Esc</kbd></p>

### markdown-it-underline

    _underline_

<p data-line="48" class="code-line"><u>underline</u></p>

### markdown-it-container

    ::::: container
    :::: row
    ::: col-xs-6 alert alert-success
    success text
    :::
    ::: col-xs-6 alert alert-warning
    warning text
    :::
    ::::
    :::::

![container-demo.png](./images/container-demo.png)

*(Rendered with style bootstrap, to see the same result, you need the follow config)*

```json
"markdown.styles": [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
]
```

## Exporter Configurations

This plugin provides what you see is what you get exporter. That means rendered HTML page is consistent to what you see in markdown preview, even it contains syntaxes and styles contributed by other plugins.

Plugin built-in 2 exporters. you can configure them by writing settings within the meta data of the markdown document.

### HTML Exporter Configuration

> (No configuration available for now)

### Phantom Exporter Configuration

```markdown
---
phantomjs:
    type: pdf   # jpeg, png, pdf
    format: A4
    orientation: portrait
    border: 2cm
---
contents goes here...
```

These settings tell the `Phantom Exporter` to export a pdf file with specified size, orientation, and borders.

> See [more available settings](https://github.com/marcbachmann/node-html-pdf#options)

## Known Issues & Feedback

Please post and view issues on [GitHub][issues]

**Enjoy!**

[issues]: https://github.com/qjebbs/vscode-markdown-extended/issues "Post issues"