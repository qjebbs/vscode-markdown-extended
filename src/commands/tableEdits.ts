import { CommandConfig, Commands } from './commands';
import { editTables } from '../services/table/editTables';
import { editType } from '../services/table/editTable';


const cmds: CommandConfig[] = [
    {
        commandId: "markdownExtended.addRowAbove",
        worker: editTables,
        args: [editType.addRow, true]
    },
    {
        commandId: "markdownExtended.addRowBelow",
        worker: editTables,
        args: [editType.addRow, false]
    },
    {
        commandId: "markdownExtended.DeleteRow",
        worker: editTables,
        args: [editType.deleteRow]
    },
    {
        commandId: "markdownExtended.addColumnLeft",
        worker: editTables,
        args: [editType.addColumn, true]
    },
    {
        commandId: "markdownExtended.addColumnRight",
        worker: editTables,
        args: [editType.addColumn, false]
    },
    {
        commandId: "markdownExtended.DeleteColumn",
        worker: editTables,
        args: [editType.deleteColumn]
    },
]

export var commandTableEdits = new Commands(cmds);
