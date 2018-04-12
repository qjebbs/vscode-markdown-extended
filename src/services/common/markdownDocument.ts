import * as vscode from 'vscode';
import { MetaData } from './meta';

export class MarkdownDocument {
    private _document: vscode.TextDocument;
    private _meta: MetaData;
    private _content: string;
    constructor(document: vscode.TextDocument) {
        this._document = document;
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

        for (let i = 0; i < this.document.lineCount; i++) {
            let line = this.document.lineAt(i).text;
            if (i == 0 && line == "---") startLine = 0;
            if (i != 0 && line == "---") {
                endLine = i;
                break;
            }
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
        this._content = this.document.getText(
            this.document.lineAt(endLine + 1).range.union(
                this.document.lineAt(this.document.lineCount - 1).range
            )
        );
    }
}