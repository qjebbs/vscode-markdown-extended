import * as path from 'path';
import * as fs from 'fs';

/**
 * cssFileToDataUri embeds files referred by url(), with data uri, while fileToDataUri not
 * @param cssFileName path of the css file
 */
export function cssFileToDataUri(cssFileName: string): string {
    let URL_REG = /url\(([^()'"]+?)\)|url\(['"](.+?)['"]\)/ig;
    if (!fs.existsSync(cssFileName))
        return "";
    let css = fs.readFileSync(cssFileName).toString();
    css = css.replace(URL_REG, (substr, ...args: any[]) => {
        let filePath: string = args[0] || args[1];
        if (filePath.substr(0, 5).toLocaleLowerCase() == "data:") {
            return substr;
        }
        if (!path.isAbsolute(filePath))
            filePath = path.resolve(path.dirname(cssFileName), filePath)
        try {
            return `url("${fileToDataUri(filePath)}")`;
        } catch (error) {
            console.log(error);
            return substr;
        }
    });
    return `data:text/css;base64,${Buffer.from(css).toString("base64")}`;
}

/**
 * fileToDataUri encodes a file as data uri
 * @param fileName path of the file
 */
export function fileToDataUri(fileName: string): string {
    if (!fs.existsSync(fileName))
        return null;
    let schema = getDataUriSchema(fileName);
    let buf = fs.readFileSync(fileName);
    return `${schema}${buf.toString("base64")}`
}

/**
 * getDataUriSchema returns a uri schema according to the extension of the file.
 * e.g.: "data:text/css;base64,"
 * @param fileName path of the file
 */
export function getDataUriSchema(fileName: string): string {
    let ext = path.extname(fileName).toLowerCase();
    let mimeType = null;
    switch (ext) {
        case ".js":
            mimeType = "text/javascript"
            break;
        case ".css":
            mimeType = "text/css"
            break;
        case ".woff":
            mimeType = "font/woff"
            break;
        case ".woff2":
            mimeType = "font/woff2"
            break;
        case ".otf":
            mimeType = "font/otf"
            break;
        case ".ttf":
            mimeType = "font/ttf"
        case ".sfnt":
            mimeType = "font/sfnt"
            break;
        case ".jpe":
        case ".jpeg":
        case ".jpg":
            mimeType = "image/jpeg"
            break;
        case ".png":
            mimeType = "image/png"
            break;
        case ".svg":
            mimeType = "image/svg+xml"
            break;
        case ".gif":
            mimeType = "image/gif"
            break;
        case ".icon":
        case ".ico":
            mimeType = "image/x-icon"
            break;
        case ".bmp":
            mimeType = "image/bmp"
            break;
        default:
            throw (`Unsupported mimeType for "${ext}" file.`);
    }
    return `data:${mimeType};base64,`
}
