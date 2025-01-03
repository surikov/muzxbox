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
                    /*children.map((item) => {
                        item.path.unshift(currentPath);
                        return item;
                    });*/
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
                let newDiff: DifferenceCreate={ path: currentPath, type: "+", newValue: changed[key] };
/*
                if (Array.isArray(changed)) {
                    newDiff = { path: [0 + key], type: "+", newValue: changed[key] };
                } else {
                    newDiff = { path: [key], type: "+", newValue: changed[key] };
                }*/
                diffs.push(newDiff);
            }
        }
        return diffs;
    }
}
