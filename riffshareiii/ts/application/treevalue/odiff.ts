
class StateDiff {
    pathDataCopy: any;
    basePath: (string | number)[];
    constructor(path: (string | number)[]) {
        this.basePath = path.slice(0);
        this.pathDataCopy = JSON.parse(JSON.stringify(this.findNodeByPath()));
    }
    findNodeByPath(): any {
        let parent = globalCommandDispatcher.cfg().data as any;
        for (let ii = 0; ii < this.basePath.length; ii++) {
            parent = parent[this.basePath[ii]];
        }
        return parent;
    }
    diffChangedCommands(): Zvoog_UICommand {
        let cmds: Zvoog_Action[] = [];
        let changed = this.findNodeByPath();
        this.addDiff(this.basePath, cmds, this.pathDataCopy, changed);
        let dc: Zvoog_UICommand = {
            actions: cmds
            , position: {
                x: globalCommandDispatcher.cfg().data.position.x
                , y: globalCommandDispatcher.cfg().data.position.y
                , z: globalCommandDispatcher.cfg().data.position.z
            }
        };
        return dc;
    }
    addDiff(nodePath: (string | number)[], commands: Zvoog_Action[], old: any, changed: any): void {
        if (Array.isArray(old)) {
            this.calculateArray(nodePath, commands, old, changed);
        } else {
            this.calculateNonArray(nodePath, commands, old, changed);
        }
    }
    calculateNonArray(nodePath: (string | number)[], commands: Zvoog_Action[], old: any, changed: any): void {
        for (let prop in old) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(prop);
            if (typeof old[prop] === "object" || Array.isArray(old[prop])) {
                this.addDiff(currentPath, commands, old[prop], changed[prop]);
            } else {
                if (old[prop] !== changed[prop]) {
                    commands.push({
                        path: currentPath
                        , type: "="
                        , newValue: changed[prop]
                        , oldValue: old[prop]
                    });
                }
            }
        }
    }
    calculateArray(nodePath: (string | number)[], commands: Zvoog_Action[], old: any[], changed: any[]): void {
        for (let ii = 0; ii < old.length && ii < changed.length; ii++) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(ii);
            this.addDiff(currentPath, commands, old[ii], changed[ii]);
        }
        for (let ii = old.length; ii < changed.length; ii++) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(ii);
            commands.push({
                path: currentPath
                , type: "+"
                , newNode: JSON.parse(JSON.stringify(changed[ii]))
            });
        }
        for (let ii = changed.length; ii < old.length; ii++) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(ii);
            commands.push({
                path: currentPath
                , type: "-"
                , oldNode: old[ii]
            });
        }
    }
}
