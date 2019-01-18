import { Command } from './command';
import { exportUri } from "./exportUri";

export class CommandExportWorkSpace extends Command {
    async execute(uri) {
       return exportUri(uri);
    }
    constructor() {
        super("markdownExtended.exportWorkspace");
    }
}
