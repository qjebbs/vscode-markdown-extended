# Change Log

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