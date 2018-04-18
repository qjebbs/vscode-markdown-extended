export interface MarkdownItEnv {
    htmlExporter?: HtmlExporterEnv,
}

export interface HtmlExporterEnv {
    workspaceFolder: string,
    vsUri: string,
    embedImage: boolean,
}