class CommandExe {
	lockUndoRedo = false;
	setCurPosition(xyz: TileZoom) {
		globalCommandDispatcher.cfg().data.position = { x: xyz.x, y: xyz.y, z: xyz.z };
	}
	commitProjectChanges(path: (string | number)[], proAction: () => void) {
		let state = new StateDiff(path);
		proAction();
		this.addUndoCommandActiions(state.diffChangedCommands());
		this.cutLongUndo();
	}
	addUndoCommandActiions(cmd: Zvoog_UICommand) {
		//console.log(cmd);
		globalCommandDispatcher.clearRedo();
		globalCommandDispatcher.undo().push(cmd);
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
		//console.log('undo', cmd);
		globalCommandDispatcher.stopPlay();
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
		//console.log('redo', cmd);
		globalCommandDispatcher.stopPlay();
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
	cutLongUndo() {
		/*
		let unCnt = 0;
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.undo.length; ii++) {
			let one = globalCommandDispatcher.cfg().data.undo[ii];
			unCnt = unCnt + one.actions.length;
		}
		let reCnt = 0;
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.redo.length; ii++) {
			let one = globalCommandDispatcher.cfg().data.redo[ii];
			reCnt = reCnt + one.actions.length;
		}*/
		//console.log('undo', unCnt, 'redo', reCnt);

		/*if (unCnt > 4210) {
			console.log('cut undo queue');
			//let cmd = globalCommandDispatcher.cfg().data.undo.shift();
			globalCommandDispatcher.cfg().data.undo.splice(0,unCnt-3210);
		}*/
		//console.log('undo len ', globalCommandDispatcher.cfg().data.undo.length);
		let actionCount = 0;
		for (let ii = 0; ii < globalCommandDispatcher.undo().length; ii++) {
			let one = globalCommandDispatcher.undo()[ii];
			actionCount = actionCount + one.actions.length;
			if (actionCount > 43210) {
				console.log('cut undo ', ii, 'from', globalCommandDispatcher.undo().length);
				globalCommandDispatcher.undo().splice(0, ii);
				globalCommandDispatcher.clearRedo();
				break;
			}
		}
	}
	undo(cnt: number) {
		if (this.lockUndoRedo) {
			console.log('lockUndoRedo');
		} else {
			this.lockUndoRedo = true;
			for (let ii = 0; ii < cnt; ii++) {
				if (globalCommandDispatcher.undo().length) {
					let cmd = globalCommandDispatcher.undo().pop();
					if (cmd) {
						//this.executeCommand(cmd.kind, cmd.params, true);
						this.unAction(cmd);
						globalCommandDispatcher.redo().unshift(cmd);
						if (cmd.position) {
							this.setCurPosition(cmd.position);
						}
					}
				}
			}

			this.lockUndoRedo = false;
			this.cutLongUndo();
		}
		globalCommandDispatcher.resetProject();
	}
	redo(cnt: number) {
		if (this.lockUndoRedo) {
			console.log('lockUndoRedo');
		} else {
			this.lockUndoRedo = true;
			for (let ii = 0; ii < cnt; ii++) {
				if (globalCommandDispatcher.redo().length) {
					let cmd = globalCommandDispatcher.redo().shift();
					if (cmd) {
						//this.executeCommand(cmd.kind, cmd.params, false);
						this.reAction(cmd);
						globalCommandDispatcher.undo().push(cmd);
						if (cmd.position) {
							this.setCurPosition(cmd.position);
						}
					}
				}
			}

			this.lockUndoRedo = false;
			this.cutLongUndo();
		}
		globalCommandDispatcher.resetProject();
	}
}
