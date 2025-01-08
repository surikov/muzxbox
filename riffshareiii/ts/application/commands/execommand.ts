/*
const ExeMoveTrack = 'ExeMoveTrack';

const ExeMovePerformerIcon = 'ExeMovePerformerIcon';
const ExeConnectPerformer = 'ExeConnectPerformer';
const ExeDisonnectPerformer = 'ExeDisonnectPerformer';

const ExeMoveSamplerIcon = 'ExeMoveSamplerIcon';
const ExeConnectSampler = 'ExeConnectSampler';
const ExeDisonnectSampler = 'ExeDisonnectSampler';

const ExeMoveFilterIcon = 'ExeMoveFilterIcon';
const ExeConnectFilter = 'ExeConnectFilter';
const ExeDisonnectFilter = 'ExeDisonnectFilter';
*/
class CommandExe {
	/*executeCommand(kind: string, pars: any, undo: boolean) {
		switch (kind) {
			case ExeMoveTrack: {
				if (undo) {
					let track: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(pars.to, 1)[0];
					globalCommandDispatcher.cfg().data.tracks.splice(pars.from, 0, track);
				} else {
					let track: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(pars.from, 1)[0];
					globalCommandDispatcher.cfg().data.tracks.splice(pars.to, 0, track);
				}
			}
				break;
			////////////////////////////////////////////////
			case ExeMovePerformerIcon: {
				let iconPosition = globalCommandDispatcher.cfg().data.tracks[pars.track].performer.iconPosition;
				if (undo) {
					iconPosition.x = pars.from.x;
					iconPosition.y = pars.from.y;
				} else {
					iconPosition.x = pars.to.x;
					iconPosition.y = pars.to.y;
				}
			}
				break;
			case ExeConnectPerformer: {
				let performer = globalCommandDispatcher.cfg().data.tracks[pars.track].performer;
				if (undo) {
					let nn = performer.outputs.indexOf(pars.id);
					if (nn > -1) {
						performer.outputs.splice(nn, 1);
					}
				} else {
					performer.outputs.push(pars.id);
				}
			}
				break;
			case ExeDisonnectPerformer: {
				let performer = globalCommandDispatcher.cfg().data.tracks[pars.track].performer;
				if (undo) {
					performer.outputs.push(pars.id);
				} else {
					let nn = performer.outputs.indexOf(pars.id);
					if (nn > -1) {
						performer.outputs.splice(nn, 1);
					}
				}
			}
				break;
			//////////////////////////////////////////////
			case ExeMoveSamplerIcon: {
				let iconPosition = globalCommandDispatcher.cfg().data.percussions[pars.drum].sampler.iconPosition;
				if (undo) {
					iconPosition.x = pars.from.x;
					iconPosition.y = pars.from.y;
				} else {
					iconPosition.x = pars.to.x;
					iconPosition.y = pars.to.y;
				}
			}
				break;
			case ExeConnectSampler: {
				let sampler = globalCommandDispatcher.cfg().data.percussions[pars.drum].sampler;
				if (undo) {
					let nn = sampler.outputs.indexOf(pars.id);
					if (nn > -1) {
						sampler.outputs.splice(nn, 1);
					}
				} else {
					sampler.outputs.push(pars.id);
				}
			}
				break;
			case ExeDisonnectSampler: {
				let sampler = globalCommandDispatcher.cfg().data.percussions[pars.drum].sampler;
				if (undo) {
					sampler.outputs.push(pars.id);
				} else {
					let nn = sampler.outputs.indexOf(pars.id);
					if (nn > -1) {
						sampler.outputs.splice(nn, 1);
					}
				}
			}
				break;
			/////////////////////////////////////////////////////////
			case ExeMoveFilterIcon: {
				//console.log('ExeMoveFilterIcon', pars, globalCommandDispatcher.cfg().data.filters);
				//console.log('t',);
				let filter = globalCommandDispatcher.cfg().findFilterTarget(pars.filter);
				//console.log('found', filter);
				if (filter) {
					let iconPosition = filter.iconPosition;
					if (undo) {
						iconPosition.x = pars.from.x;
						iconPosition.y = pars.from.y;
					} else {
						iconPosition.x = pars.to.x;
						iconPosition.y = pars.to.y;
					}
				}
			}
				break;
			case ExeConnectFilter: {
				let filter = globalCommandDispatcher.cfg().findFilterTarget(pars.filter);
				if (filter) {
					if (undo) {
						let nn = filter.outputs.indexOf(pars.id);
						if (nn > -1) {
							filter.outputs.splice(nn, 1);
						}
					} else {
						filter.outputs.push(pars.id);
					}
				}
			}
				break;
			case ExeDisonnectFilter: {
				let filter = globalCommandDispatcher.cfg().findFilterTarget(pars.filter);
				if (filter) {
					if (undo) {
						filter.outputs.push(pars.id);
					} else {
						let nn = filter.outputs.indexOf(pars.id);
						if (nn > -1) {
							filter.outputs.splice(nn, 1);
						}
					}
				}
			}
				break;
			////////////////////////////////////////////////////////
			default:
				console.log('unknown command', kind, pars);
		}
	}*/
	/*cloneCurPosition() {
		return {
			x: globalCommandDispatcher.cfg().data.position.x
			, y: globalCommandDispatcher.cfg().data.position.y
			, z: globalCommandDispatcher.cfg().data.position.z
		};
	}*/
	/*setCurPosition(xyz: TileZoom) {
		globalCommandDispatcher.cfg().data.position = { x: xyz.x, y: xyz.y, z: xyz.z };
	}*/
	commitProjectChanges(path: (string | number)[], proAction: () => void) {
		let state = new StateDiff(path);
		proAction();
		this.addUndoCommandActiions(state.diffChangedCommands());
	}
	addUndoCommandActiions(cmd: Zvoog_UICommand) {//kind: string, pars: any) {
		console.log(cmd);
		//this.executeCommand(kind, pars, false);
		//cmd.position.x=globalCommandDispatcher.cfg().data.position.x;
		//cmd.position.y=globalCommandDispatcher.cfg().data.position.y;
		//cmd.position.z=globalCommandDispatcher.cfg().data.position.z;
		globalCommandDispatcher.cfg().data.redo.length = 0;
		globalCommandDispatcher.cfg().data.undo.push(cmd);
		//globalCommandDispatcher.cfg().data.undo.push({
		//	kind: kind, params: pars, position: this.cloneCurPosition()
		//});
		globalCommandDispatcher.resetProject();
	}
	undo(cnt: number) {
		/*for (let ii = 0; ii < cnt; ii++) {
			if (globalCommandDispatcher.cfg().data.undo.length) {
				let cmd = globalCommandDispatcher.cfg().data.undo.pop();
				if (cmd) {
					this.executeCommand(cmd.kind, cmd.params, true);
					globalCommandDispatcher.cfg().data.redo.unshift(cmd);
					if (cmd.position) {
						this.setCurPosition(cmd.position);
					}
				}
			}
		}
		globalCommandDispatcher.resetProject();*/
	}
	redo(cnt: number) {
		/*for (let ii = 0; ii < cnt; ii++) {
			if (globalCommandDispatcher.cfg().data.redo.length) {
				let cmd = globalCommandDispatcher.cfg().data.redo.shift();
				if (cmd) {
					this.executeCommand(cmd.kind, cmd.params, false);
					globalCommandDispatcher.cfg().data.undo.push(cmd);
					if (cmd.position) {
						this.setCurPosition(cmd.position);
					}
				}
			}
		}
		globalCommandDispatcher.resetProject();*/
	}
}
