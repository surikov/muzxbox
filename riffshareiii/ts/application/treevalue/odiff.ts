interface DifferenceCreate {
    type: "+";
    path: (string | number)[];
    newValue: any;
}

interface DifferenceRemove {
    type: "-";
    path: (string | number)[];
    oldValue: any;
}

interface DifferenceChange {
    type: "=";
    path: (string | number)[];
    newValue: any;
    oldValue: any;
}

type RawDifference = DifferenceCreate | DifferenceRemove | DifferenceChange;

class ODiff {
    base: any;
    constructor(obj: any) {
        this.base = obj;
    }
    createDiffCommands(changed: any): RawDifference[] {
        let cmds: RawDifference[] = [];
        this.calculateDiff([], cmds, this.base, changed);
        return cmds;
    }
    calculateDiff(nodePath: (string | number)[], commands: RawDifference[], old: any, changed: any): void {
        if (Array.isArray(old)) {
            this.calculateArray(nodePath, commands, old, changed);
        } else {
            this.calculateNonArray(nodePath, commands, old, changed);
        }
    }
    calculateNonArray(nodePath: (string | number)[], commands: RawDifference[], old: any, changed: any): void {
        for (let prop in old) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(prop);
            if (typeof old[prop] === "object" || Array.isArray(old[prop])) {
                this.calculateDiff(currentPath, commands, old[prop], changed[prop]);
            } else {
                if (old[prop] !== changed[prop]) {
                    commands.push({ path: currentPath, type: "=", newValue: changed[prop], oldValue: old[prop] });
                }
            }
        }
    }
    calculateArray(nodePath: (string | number)[], commands: RawDifference[], old: any[], changed: any[]): void {
        for (let ii = 0; ii < old.length && ii < changed.length; ii++) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(ii);
            this.calculateDiff(currentPath, commands, old[ii], changed[ii]);
        }
        for (let ii = old.length; ii < changed.length; ii++) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(ii);
            commands.push({ path: currentPath, type: "+", newValue: changed[ii] });
        }
        for (let ii = changed.length; ii < old.length; ii++) {
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(ii);
            commands.push({ path: currentPath, type: "-", oldValue: old[ii] });
        }
    }
}
/*
class MicroDiff {
    base: any;
    constructor(obj: any) {
        this.base = obj;
    }
    calculateCommands(changed: any): RawDifference[] {
        return this.calculateDiff([], this.base, changed);
    }
    calculateDiff(nodePath: (string | number)[], old: any, changed: any): RawDifference[] {
        let diffs: RawDifference[] = [];
        for (let key in old) {
            let oldValue = old[key];
            let folder: number | string;
            if (Array.isArray(old)) {
                folder = parseInt(key);
            } else {
                folder = key;
            }
            let currentPath: (string | number)[] = nodePath.slice(0);
            currentPath.push(folder);
            if (!(key in changed)) {
                let newDiff: DifferenceRemove = { path: currentPath, type: "-", oldValue: oldValue };
                diffs.push(newDiff);
            } else {
                let newValue = changed[key];
                let arrayOrObject = false;
                if (typeof oldValue === "object"
                    && typeof newValue === "object"
                    && Array.isArray(oldValue) === Array.isArray(newValue)
                ) {
                    arrayOrObject = true;
                }
                let rawTypeValue = false;
                if (oldValue.constructor?.name === 'String'
                    || oldValue.constructor?.name === 'Number'
                    || oldValue.constructor?.name === 'Boolean'
                ) {
                    rawTypeValue = true;
                }
                if (
                    oldValue
                    && newValue
                    && arrayOrObject
                    && (!rawTypeValue)
                ) {
                    let children = this.calculateDiff(currentPath, oldValue, newValue);
      
                    diffs.push.apply(diffs, children);
                } else {
                    let bothSameType = false;
                    if (isNaN(oldValue)) {
                        if (oldValue + "" === newValue + "") {
                            bothSameType = true;
                        }
                    } else {
                        if (0 + oldValue === 0 + newValue) {
                            bothSameType = true;
                        }
                    }
                    if (
                        oldValue !== newValue
                        // treat NaN values as equivalent
                        && !(Number.isNaN(newValue) && Number.isNaN(newValue))
                        && !arrayOrObject
                        && !bothSameType
                    ) {
                        let newDiff: DifferenceChange = { path: currentPath, type: "=", newValue: newValue, oldValue: oldValue };
                        diffs.push(newDiff);
                    }
                }
            }
        }
        for (const key in changed) {
            if (!(key in old)) {
                let folder: number | string;
                if (Array.isArray(changed)) {
                    folder = parseInt(key);
                } else {
                    folder = key;
                }
                let currentPath: (string | number)[] = nodePath.slice(0);
                currentPath.push(folder);
                let newDiff: DifferenceCreate = { path: currentPath, type: "+", newValue: changed[key] };
 
                diffs.push(newDiff);
            }
        }
        return diffs;
    }
}
*/