import { Contributors } from './contributors';
import { createContributeItem } from './tools';

export namespace Contributes {
    export namespace Styles {
        export function all() {
            return Contributors.getStyles()
                .join("\n").trim();
        }
        export function official() {
            return Contributors.getStyles(c => c.type === Contributors.Type.official)
                .join("\n").trim();
        }
        export function thirdParty() {
            return Contributors.getStyles(c => c.type !== Contributors.Type.official)
                .join("\n").trim();
        }
    }
    export namespace Scripts {
        export function all() {
            return Contributors.getScripts()
                .join("\n").trim();
        }
        export function official() {
            return Contributors.getScripts(c => c.type === Contributors.Type.official)
                .join("\n").trim();
        }
        export function thirdParty() {
            return Contributors.getScripts(c => c.type !== Contributors.Type.official)
                .join("\n").trim();
        }
    }
    export function createStyle(content: string | Buffer, comment: string): string {
        return createContributeItem(content, true, comment);
    }
    export function createScript(content: string | Buffer, comment: string): string {
        return createContributeItem(content, true, comment);
    }
}
