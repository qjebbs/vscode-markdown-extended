import * as vscode from 'vscode';
import { MetaData } from './meta';

export class MarkdownDocument {
    private _document: vscode.TextDocument;
    private _meta: MetaData;
    private _content: string;
    constructor(document: vscode.TextDocument, overrideContent?: string) {
        this._document = document;
        this._content = overrideContent;
        this.load();
    }
    get meta() {
        return this._meta;
    }
    get document() {
        return this._document;
    }
    get content() {
        return this._content;
    }
    private load() {
        let meta = "";
        let startLine = -1;
        let endLine = -1;

        if (this.document.lineAt(0).text == "---") {
            startLine = 0;
            for (let i = 1; i < this.document.lineCount; i++) {
                if (this.document.lineAt(i).text == "---") {
                    endLine = i;
                    break;
                }
            }
            if (endLine < 0) startLine = -1;
        }

        if (startLine == 0 && endLine > 0)
            meta = this.document.getText(
                this.document.lineAt(1).range.union(
                    this.document.lineAt(endLine - 1).range
                )
            );
        else
            meta = "";
        this._meta = new MetaData(meta, this.document.uri);
        if (!this._content) this._content = this.document.getText(
            this.document.lineAt(endLine + 1).range.union(
                this.document.lineAt(this.document.lineCount - 1).range
            )
        );
    }
}