# Change Log

## v1.1.4

Add `markdown-it-bracketed-spans` and update dependencies, **@zeedif**, [#160](https://github.com/qjebbs/vscode-markdown-extended/pull/160)

## v1.1.3

Fix: Get chromium revision for puppeteer downloading

## v1.1.2

- Improvement: Tables formatting preserves table indentation and handle code spans, **@rbolsius**, [#139](https://github.com/qjebbs/vscode-markdown-extended/pull/139)
- Fix: Remove workaround introduced for [#98](https://github.com/qjebbs/vscode-markdown-extended/issues/98)
- Update dependencies

## v1.1.1

- Apply python markdown spec for admonitions, [#123](https://github.com/qjebbs/vscode-markdown-extended/pull/123)
- Fix [#125](https://github.com/qjebbs/vscode-markdown-extended/pull/125)

## v1.1.0

- Add snippets ([#116](https://github.com/qjebbs/vscode-markdown-extended/pull/116)), thanks to [heartacker ](https://github.com/heartacker)
- Fix admonitions ([#122](https://github.com/qjebbs/vscode-markdown-extended/pull/122)), thanks to [Juan Cruz](https://github.com/IJuanI)
- Remove default key bindings. [#111](https://github.com/qjebbs/vscode-markdown-extended/pull/111)[#112](https://github.com/qjebbs/vscode-markdown-extended/pull/112)[#118](https://github.com/qjebbs/vscode-markdown-extended/pull/118), please consider:

    - Switch to use command palette
    - Switch to use snippets
    - Setup key bindings on your own


## v1.0.19

- Add workaround for markdown export crashing. [#98](https://github.com/qjebbs/vscode-markdown-extended/issues/98)

## v1.0.18

- Improvement: Top margin inside admonition

## v1.0.17

- Fix: Export files not in workspace

## v1.0.16

- Improvement: Add ability to disable integrated plugin. [#72](https://github.com/qjebbs/vscode-markdown-extended/issues/72)

## v1.0.15

Fix: Cannot embed img not in workspace folder, [#71](https://github.com/qjebbs/vscode-markdown-extended/issues/71)

## v1.0.14

- Improvement: Chane `Move Columns` key bindings to `ctrl+shift+t ctrl+shift+left/right`, [#68](https://github.com/qjebbs/vscode-markdown-extended/issues/68)

## v1.0.13

- Improvement: Chane `Move Columns` key bindings to `ctrl+shift+left/right`, [#57](https://github.com/qjebbs/vscode-markdown-extended/issues/57), [#59](https://github.com/qjebbs/vscode-markdown-extended/issues/57)

## v1.0.12

- Improvement: No 'open preview first' prompt
- Fix: Update package markdown-it-attrs, [#58](https://github.com/qjebbs/vscode-markdown-extended/issues/58)
- Code optimization. 

## v1.0.11

- Add support for `markdown-it-html5-embed`, [#49](https://github.com/qjebbs/vscode-markdown-extended/issues/49)
- Fix: Rowspan of `markdown-it-multimd-table` doesn't work, [#50](https://github.com/qjebbs/vscode-markdown-extended/issues/50)
- Improved CJK table format.
- Admonition style optimize

## v1.0.10

- Fix: Format with Japanese Hiragana characters [#51](https://github.com/qjebbs/vscode-markdown-extended/issues/51). Thanks to [TadaoYamaoka](https://github.com/TadaoYamaoka).
- Update dependencies.
- Code optimization. 

## v1.0.9

- Fix: Embeds files referred by url() in css, fix [#48](https://github.com/qjebbs/vscode-markdown-extended/issues/48).

## v1.0.8

- Add plugin markdown-it-emoji, solve [#39](https://github.com/qjebbs/vscode-markdown-extended/issues/39).
- Add plugin markdown-it-multimd-table, solve [#42](https://github.com/qjebbs/vscode-markdown-extended/issues/42).
- Add capability to format format multimd table

## v1.0.7

- Fix: Cannot embed images if folder or path has special character, solve [#40](https://github.com/qjebbs/vscode-markdown-extended/issues/40).

## v1.0.6

- Add plugin markdown-it-mark
- Add command `Toggle Mark`

## v1.0.5

- Fix: Cannot export workspace, solve [#34](https://github.com/qjebbs/vscode-markdown-extended/issues/34).

## v1.0.4

- Fix: Wrong column width when format table with Fullwidth Comma & CJK Comma. Thanks to [FourLeafTec](https://github.com/qjebbs/vscode-markdown-extended/pull/31)
- Fix: Update package `markdown-it-kbd`, solve [#32](https://github.com/qjebbs/vscode-markdown-extended/issues/32).

## v1.0.3

- Improvement: Copy stripped HTML, solve [#27](https://github.com/qjebbs/vscode-markdown-extended/issues/27).

## v1.0.2

- Improvement: Many optimizations to export feature
- Improvement: Keep blank lines when doing toggleBlockQuote, fix [#24](https://github.com/qjebbs/vscode-markdown-extended/issues/24).

## v1.0.1 (v1.0.0)

- New Feature: export with contribute scripts embedded, solve [#23](https://github.com/qjebbs/vscode-markdown-extended/issues/23).

Export files with content which requires extra scripts (e.g. mermaid), now works as expected.

## v0.9.6

- Improvement: Improve format table with CJK characters, solve [#22](https://github.com/qjebbs/vscode-markdown-extended/issues/22)

## v0.9.5

- Fix: Correct title spelling of markdown

## v0.9.4

- Fix: export non-workfolder file, solve [#19](https://github.com/qjebbs/vscode-markdown-extended/issues/19)

## v0.9.3

- Improvement: Add export report.
- Improvement: Message & titles optimize.
- Improvement: Code optimize.

## v0.9.2

- Improvement: configurable toc level, solve [#18](https://github.com/qjebbs/vscode-markdown-extended/issues/18)

## v0.9.1

- Improvement: new admonition implement, support nesting and more qualifiers.
- Improvement: better padding and align of table fomatting
- Fix: paste as table problem if "-" in the second row
- Improvement: update exportWorkspace command title

## v0.8.1

- Fix: Wait for external resources before export to pdf/png/jpg, resolve [#14](https://github.com/qjebbs/vscode-markdown-extended/issues/14)

## v0.8.0

- New Feature: markdown-it-admonition support

## v0.7.1

- New Feature: Workspace export support
- New Setting: Customize puppeteer executable

## v0.6.1

- Fix: copy html issue.

## v0.6.0

- Improvement: Switch to puppeteer as PDF/PNG/JPG exporter
- Improvement: Remove some helper menus

## v0.5.6

- Fix: Active document detect in export command, fix [#10](https://github.com/qjebbs/vscode-markdown-extended/issues/10)

## v0.5.5

- Improvement: add `markdown-it-deflist`, resolve [#9](https://github.com/qjebbs/vscode-markdown-extended/issues/9)
- Improvement: add styles for `<kbd>`.

## v0.5.4

- Improvement: Export html as self contained file.

## v0.5.3

- Fix: Small bug fixes.

## v0.5.2

- Improvement: Keep selections after table editing.
- Improvement: Optimize selection after toggle format.

> With these two improvements, you can smoothly toggling format and editing tables.

## v0.5.1

- New Feature: Add move table columns commands.

## v0.5.0

- New Feature: Add many format and table editing helpers.
- Small improvements
- Some Fixes and Code Optimization.

## v0.4.4

- Improvement: Many export optimizations.

## v0.4.3

- Fix: Wrong anchor element.
- Improvement: Precisely customize phantom pdf border.
- Improvement: Set default border of phantom pdf to 1cm.

## v0.4.2

- Fix: Parsing meta data
- Fix: Resources not fully processed

## v0.4.1

- Fix: Run phantomjs with no meta config
- Improvement: Async error catch optimize

## v0.4.0

- New Feature: Exporters & Exporter Configurations support, [#8](https://github.com/qjebbs/vscode-markdown-extended/issues/8).
- Fix: missing resources in exported filed, [#7](https://github.com/qjebbs/vscode-markdown-extended/issues/7).

## v0.3.0

- New Feature: Writing anchor links consistent to heading texts.
- Fix: TOC anchor.
- Fix: Read config for unsaved file.

## v0.2.2

- Fix: User styles config logic.

## v0.2.1

- Improvement: Support user styles (`markdown.styles`) when export.

## v0.2.0

- New Feature: Paste as Markdown Table.
- New Feature: Formate Table.
- Fix: Copy HTML failed if content contains non-English characters.

## v0.1.4

- Catch command errors to panel
- Prompt open preview before copy or export, avoiding undefinded render
- Validate phantomPath
- Fix read previewStyles of undefined, solve [#2](https://github.com/qjebbs/vscode-markdown-extended/issues/2)

## v0.1.3

- Add plugin markdown-it-container

## v0.1.2

- Configurable phantom path

## v0.1.1

- New Feature: Export to PNG / JPEG

## v0.1.0

- New Feature: Export to PDF

## v0.0.3

- Improvement: Copy HTML of selection if there was.
- Fix: replace `markdown-it-toc` with `markdown-it-table-of-contents`, since the former breaks the header anchor.

## v0.0.2

- Fix extension loading problem

## v0.0.1

- Initial release