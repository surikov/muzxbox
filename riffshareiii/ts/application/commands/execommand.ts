type CommandParameters = {
	position: {
		x: number;
		y: number;
		z: number;
	};
};
abstract class UndoRedoCommand {
	parameters: CommandParameters;
	abstract redo(): void;
	abstract undo(): void;
	constructor(pars: CommandParameters) {
		this.parameters = pars;
	}
}
type ParameterDeleteTrack = CommandParameters & {
	trackPosition: number;
	trackData: Zvoog_MusicTrack;
};
class CmdDeleteTrack extends UndoRedoCommand {
	redo(): void {
		let pp: ParameterDeleteTrack = this.parameters as ParameterDeleteTrack;
		globalCommandDispatcher.cfg().data.tracks.splice(pp.trackPosition, 1);
	}
	undo(): void {
		let pp: ParameterDeleteTrack = this.parameters as ParameterDeleteTrack;
		globalCommandDispatcher.cfg().data.tracks.splice(pp.trackPosition, 0, pp.trackData);
	}
}
type ParameterMoveTrackUp = CommandParameters & {
	trackPrePosition: number;
};
class CmdMoveTrackUp extends UndoRedoCommand {
	redo(): void {
		let pp: ParameterMoveTrackUp = this.parameters as ParameterMoveTrackUp;
		let track: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(pp.trackPrePosition, 1)[0];
		globalCommandDispatcher.cfg().data.tracks.splice(pp.trackPrePosition, 0, track);
	}
	undo(): void {
		let pp: ParameterMoveTrackUp = this.parameters as ParameterMoveTrackUp;
		let clone: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(0, 1)[0];
		globalCommandDispatcher.cfg().data.tracks.splice(pp.trackPrePosition, 0, clone);
	}
}
