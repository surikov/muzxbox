
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
		//console.log('calculateNonArray', nodePath, old, changed);
		for (let prop in old) {
			if (prop == 'undo' || prop == 'redo') {
				//skip
			} else {
				let currentPath: (string | number)[] = nodePath.slice(0);
				currentPath.push(prop);
				if (typeof old[prop] === "object" || Array.isArray(old[prop])) {
					this.addDiff(currentPath, commands, old[prop], changed[prop]);
				} else {
					if (old[prop] !== changed[prop]) {
						commands.push({
							path: currentPath
							, kind: "="
							, newValue: changed[prop]
							, oldValue: old[prop]
						});
						//console.log(commands[commands.length-1]);
					}
				}
			}
		}
	}
	calculateArray(nodePath: (string | number)[], commands: Zvoog_Action[], old: any[], changed: any[]): void {
		//console.log('calculateArray', nodePath, old, changed);
		for (let idx = 0; idx < old.length && idx < changed.length; idx++) {
			let currentPath: (string | number)[] = nodePath.slice(0);
			currentPath.push(idx);
			//this.addDiff(currentPath, commands, old[idx], changed[idx]);
			if (typeof old[idx] === "object" || Array.isArray(old[idx])) {
				this.addDiff(currentPath, commands, old[idx], changed[idx]);
			} else {
				if (old[idx] !== changed[idx]) {
					commands.push({
						path: currentPath
						, kind: "="
						, newValue: changed[idx]
						, oldValue: old[idx]
					});
					//console.log(commands[commands.length-1]);
				}
			}
		}
		for (let idx = old.length; idx < changed.length; idx++) {
			let currentPath: (string | number)[] = nodePath.slice(0);
			currentPath.push(idx);
			commands.push({
				path: currentPath
				, kind: "+"
				, newNode: JSON.parse(JSON.stringify(changed[idx]))
			});
		}
		for (let idx = changed.length; idx < old.length; idx++) {
			let currentPath: (string | number)[] = nodePath.slice(0);
			currentPath.push(idx);
			commands.push({
				path: currentPath
				, kind: "-"
				, oldNode: old[idx]
			});
		}
	}
}
