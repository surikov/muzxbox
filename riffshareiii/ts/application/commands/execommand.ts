class CommandExe {
	setCurPosition(xyz: TileZoom) {
		globalCommandDispatcher.cfg().data.position = { x: xyz.x, y: xyz.y, z: xyz.z };
	}
	commitProjectChanges(path: (string | number)[], proAction: () => void) {
		let state = new StateDiff(path);
		proAction();
		this.addUndoCommandActiions(state.diffChangedCommands());
	}
	addUndoCommandActiions(cmd: Zvoog_UICommand) {
		console.log(cmd);
		globalCommandDispatcher.cfg().data.redo.length = 0;
		globalCommandDispatcher.cfg().data.undo.push(cmd);
		globalCommandDispatcher.resetProject();
	}
	parentFromPath(path: (string | number)[]) {
		let parent = globalCommandDispatcher.cfg().data as any;
		for (let ii = 0; ii < path.length - 1; ii++) {
			parent = parent[path[ii]];
		}
		return parent;
	}
	unAction(cmd: Zvoog_UICommand) {
		for (let ii = cmd.actions.length - 1; ii >= 0; ii--) {
			let act = cmd.actions[ii];
			let parent = this.parentFromPath(act.path);
			let prop = act.path[act.path.length - 1];
			if (act.kind == '+') {
				let idx = prop as number;
				(parent as any[]).splice(idx, 1);
			} else {
				if (act.kind == '-') {
					let remove = act as DifferenceRemove;
					let value = JSON.parse(JSON.stringify(remove.oldNode));
					let idx = prop as number;
					(parent as any[]).splice(idx, 0, value);
				} else {
					if (act.kind == '=') {
						let change = act as DifferenceChange;
						parent[prop] = JSON.parse(JSON.stringify(change.oldValue));
					}
				}
			}
		}
	}
	reAction(cmd: Zvoog_UICommand) {
		for (let ii = 0; ii < cmd.actions.length; ii++) {
			let act = cmd.actions[ii];
			let parent = this.parentFromPath(act.path);
			let prop = act.path[act.path.length - 1];
			if (act.kind == '+') {
				let create = act as DifferenceCreate;
				let value = JSON.parse(JSON.stringify(create.newNode));
				let idx = prop as number;
				(parent as any[]).splice(idx, 0, value);
			} else {
				if (act.kind == '-') {
					let idx = prop as number;
					(parent as any[]).splice(idx, 1);
				} else {
					if (act.kind == '=') {
						let change = act as DifferenceChange;
						parent[prop] = JSON.parse(JSON.stringify(change.newValue));
					}
				}
			}
		}
	}
	undo(cnt: number) {
		for (let ii = 0; ii < cnt; ii++) {
			if (globalCommandDispatcher.cfg().data.undo.length) {
				let cmd = globalCommandDispatcher.cfg().data.undo.pop();
				if (cmd) {
					//this.executeCommand(cmd.kind, cmd.params, true);
					this.unAction(cmd);
					globalCommandDispatcher.cfg().data.redo.unshift(cmd);
					if (cmd.position) {
						this.setCurPosition(cmd.position);
					}
				}
			}
		}
		globalCommandDispatcher.resetProject();
	}
	redo(cnt: number) {
		for (let ii = 0; ii < cnt; ii++) {
			if (globalCommandDispatcher.cfg().data.redo.length) {
				let cmd = globalCommandDispatcher.cfg().data.redo.shift();
				if (cmd) {
					//this.executeCommand(cmd.kind, cmd.params, false);
					this.reAction(cmd);
					globalCommandDispatcher.cfg().data.undo.push(cmd);
					if (cmd.position) {
						this.setCurPosition(cmd.position);
					}
				}
			}
		}
		globalCommandDispatcher.resetProject();
	}
}
