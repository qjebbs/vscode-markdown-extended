import { CommandConfig, Commands } from './commands';
import { editTables } from '../services/table/editTables';
import { editType, targetType } from '../services/table/editTable';


const cmds: CommandConfig[] = [
    {
        commandId: "markdownExtended.addRowAbove",
        worker: editTables,
        args: [editType.add, targetType.row, true]
    },
    {
        commandId: "markdownExtended.addRowBelow",
        worker: editTables,
        args: [editType.add, targetType.row, false]
    },
    {
        commandId: "markdownExtended.DeleteRow",
        worker: editTables,
        args: [editType.delete, targetType.row]
    },
    {
        commandId: "markdownExtended.addColumnLeft",
        worker: editTables,
        args: [editType.add, targetType.column, true]
    },
    {
        commandId: "markdownExtended.addColumnRight",
        worker: editTables,
        args: [editType.add, targetType.column, false]
    },
    {
        commandId: "markdownExtended.DeleteColumn",
        worker: editTables,
        args: [editType.delete, targetType.column]
    },
    {
        commandId: "markdownExtended.MoveColumnLeft",
        worker: editTables,
        args: [editType.move, targetType.column, true]
    },
    {
        commandId: "markdownExtended.MoveColumnRight",
        worker: editTables,
        args: [editType.move, targetType.column, false]
    },
]

export var commandTableEdits = new Commands(cmds);
