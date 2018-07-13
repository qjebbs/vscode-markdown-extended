import { Command } from './command';
import { exportUri } from "./exportUri";

export class CommandExportWorkSpace extends Command {
    async execute(uri) {
        exportUri(uri);
    }
    constructor() {
        super("markdownExtended.exportWorkspace");
    }
}
