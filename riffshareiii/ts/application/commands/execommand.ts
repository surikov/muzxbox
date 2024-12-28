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
//
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
//
type ParameterMoveTrackTop = CommandParameters & {
	trackPrePosition: number;
};
class CmdMoveTrackTop extends UndoRedoCommand {
	redo(): void {
		let pp: ParameterMoveTrackTop = this.parameters as ParameterMoveTrackTop;
		let track: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(pp.trackPrePosition, 1)[0];
		console.log('track', track);
		globalCommandDispatcher.cfg().data.tracks.splice(0, 0, track);
	}
	undo(): void {
		let pp: ParameterMoveTrackTop = this.parameters as ParameterMoveTrackTop;
		let clone: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(0, 1)[0];
		globalCommandDispatcher.cfg().data.tracks.splice(pp.trackPrePosition, 0, clone);
	}
}
class CommandExe {
	executeCommand(cmd: string) {
		let parts=cmd.split(',');
		switch (parts[0]) {
			case 'MoveTrack':
				let from = parseInt(parts[1]);
				let to = parseInt(parts[2]);
				let track: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(from, 1)[0];
				globalCommandDispatcher.cfg().data.tracks.splice(to, 0, track);
				break;
			default:
				console.log('unknown ', cmd);
		}
		globalCommandDispatcher.resetProject();
	}
}
