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
		//globalCommandDispatcher.undo().push(cmd);
		globalCommandDispatcher.undo().push(new LZUtil().compressToUTF16(JSON.stringify(cmd)));
		globalCommandDispatcher.resetProject();
	}
	parentFromPath(path: (string | number)[]) {
		let nodeparent = globalCommandDispatcher.cfg().data as any;
		for (let ii = 0; ii < path.length - 1; ii++) {
			nodeparent = nodeparent[path[ii]];
		}
		return nodeparent;
	}
	actionChangeNode(act: Zvoog_Action, value: any) {
		let nodeProp = act.path[act.path.length - 1];
		let nodeParent = this.parentFromPath(act.path);
		//let change = act as DifferenceChange;
		//nodeParent[nodeProp] = JSON.parse(JSON.stringify(change.oldValue));
		nodeParent[nodeProp] = JSON.parse(JSON.stringify(value));
	}
	actionDeleteNode(act: Zvoog_Action) {
		let nodeParent = this.parentFromPath(act.path);
		(nodeParent as any[]).pop();
	}
	actionAddNode(act: Zvoog_Action, node: string) {
		let nodeParent = this.parentFromPath(act.path);
		//let remove = act as DifferenceRemove;
		//let value = JSON.parse(JSON.stringify(remove.oldNode));
		//(nodeParent as any[]).push(value);
		(nodeParent as any[]).push(JSON.parse(JSON.stringify(node)));
	}
	unAction(cmd: Zvoog_UICommand) {
		for (let ii = 0; ii < cmd.actions.length; ii++) {
			let act: Zvoog_Action = cmd.actions[ii];
			if (act.kind == '-') {
				this.actionAddNode(act, (act as DifferenceRemove).oldNode);
			}
		}
		for (let ii = 0; ii < cmd.actions.length; ii++) {
			let act: Zvoog_Action = cmd.actions[ii];
			if (act.kind == '+') {
				this.actionDeleteNode(act);
			}
		}
		for (let ii = 0; ii < cmd.actions.length; ii++) {
			let act: Zvoog_Action = cmd.actions[ii];
			if (act.kind == '=') {
				this.actionChangeNode(act, (act as DifferenceChange).oldValue);
			}
		}
	}
	reAction(cmd: Zvoog_UICommand) {
		for (let ii = 0; ii < cmd.actions.length; ii++) {
			let act: Zvoog_Action = cmd.actions[ii];
			if (act.kind == '+') {
				this.actionAddNode(act, (act as DifferenceCreate).newNode);
			}
		}
		for (let ii = 0; ii < cmd.actions.length; ii++) {
			let act: Zvoog_Action = cmd.actions[ii];
			if (act.kind == '-') {
				this.actionDeleteNode(act);
			}
		}
		for (let ii = 0; ii < cmd.actions.length; ii++) {
			let act: Zvoog_Action = cmd.actions[ii];
			if (act.kind == '=') {
				this.actionChangeNode(act, (act as DifferenceChange).newValue);
			}
		}
	}


	/*
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
		console.log('redo', cmd);
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
						try {
							let change = act as DifferenceChange;
							let val = change.newValue;
							let txt = JSON.stringify(val);
							let oo = undefined;
							oo = JSON.parse(txt);
							parent[prop] = oo;
						} catch (xx) {
							console.log(xx);
						}

					}
				}
			}
		}
	}
*/
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
		//console.log('redo/undo len ', globalCommandDispatcher.redo().length, globalCommandDispatcher.undo().length);
		//let actionCount = 0;
		let size = 0;
		for (let ii = 0; ii < globalCommandDispatcher.undo().length; ii++) {
			//let one: Zvoog_UICommand = JSON.parse('' + new LZUtil().decompressFromUTF16(globalCommandDispatcher.undo()[ii]));
			//let one = globalCommandDispatcher.undo()[ii];
			//actionCount = actionCount + one.actions.length;
			size = size + globalCommandDispatcher.undo()[ii].length;
			//console.log(ii, size);
			if (size > 543210) {
				let drp = Math.ceil(ii / 2);
				//console.log('cut undo ', drp, 'for', size);
				globalCommandDispatcher.undo().splice(0, drp);
				//globalCommandDispatcher.spliseUndo(ii);
				//console.log('now undo', globalCommandDispatcher.undo().length);
				globalCommandDispatcher.clearRedo();
				break;
			}
		}
		//let calc = JSON.stringify(globalCommandDispatcher.undo());
		//console.log('undo len',calc.length/1000,'kb');
	}
	undo(cnt: number) {
		//console.log('undo', cnt, globalCommandDispatcher.undo(), globalCommandDispatcher.redo());
		if (this.lockUndoRedo) {
			console.log('lockUndoRedo');
		} else {
			globalCommandDispatcher.stopPlay();
			this.lockUndoRedo = true;
			for (let ii = 0; ii < cnt; ii++) {
				if (globalCommandDispatcher.undo().length) {
					//let cmd = globalCommandDispatcher.undo().pop();
					let cmd: Zvoog_UICommand = JSON.parse('' + new LZUtil().decompressFromUTF16(globalCommandDispatcher.undo().pop()));
					if (cmd) {
						//this.executeCommand(cmd.kind, cmd.params, true);
						this.unAction(cmd);
						let lz: string = new LZUtil().compressToUTF16(JSON.stringify(cmd));
						globalCommandDispatcher.redo().unshift(lz);
						if (cmd.position) {
							this.setCurPosition(cmd.position);
						}
					}
				}
			}

			this.lockUndoRedo = false;
			this.cutLongUndo();
			globalCommandDispatcher.resetProject();
		}

	}
	redo(cnt: number) {
		if (this.lockUndoRedo) {
			console.log('lockUndoRedo');
		} else {
			globalCommandDispatcher.stopPlay();
			this.lockUndoRedo = true;
			for (let ii = 0; ii < cnt; ii++) {
				if (globalCommandDispatcher.redo().length) {
					//let cmd = globalCommandDispatcher.redo().shift();
					let cmd: Zvoog_UICommand = JSON.parse('' + new LZUtil().decompressFromUTF16(globalCommandDispatcher.redo().shift()));
					if (cmd) {
						//this.executeCommand(cmd.kind, cmd.params, false);
						this.reAction(cmd);
						let lz: string = new LZUtil().compressToUTF16(JSON.stringify(cmd));
						globalCommandDispatcher.undo().push(lz);
						if (cmd.position) {
							this.setCurPosition(cmd.position);
						}
					}
				}
			}

			this.lockUndoRedo = false;
			this.cutLongUndo();
			globalCommandDispatcher.resetProject();
		}

	}
}
