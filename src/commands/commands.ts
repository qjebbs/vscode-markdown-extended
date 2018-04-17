import { commands, Disposable } from 'vscode';
import { showMessagePanel } from '../services/common/tools';

export interface CommandConfig {
    commandId: string;
    worker: (...args) => any,
    args: any[],
}

export class Commands extends Disposable {

    private _disposables: Disposable[] = [];

    constructor(protected cmds: CommandConfig[]) {
        super(() => this.dispose());
        this._disposables.push(
            ...cmds.map(
                cmd => commands.registerCommand(
                    cmd.commandId, this.makeExecutor(cmd.worker, ...cmd.args)
                )
            )
        );
    }

    dispose() {
        this._disposables && this._disposables.length && this._disposables.map(d => d.dispose());
    }

    private makeExecutor(func: (...args) => any, ...args: any[]): () => any {
        return () => {
            try {
                let pm = func(...args);
                if (pm instanceof Promise) {
                    pm.catch(error => showMessagePanel(error))
                }
            } catch (error) {
                showMessagePanel(error);
            }
        }
    }
}

