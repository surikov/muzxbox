let uiLinkFilterToSpeaker = 'uiLinkFilterToSpeaker';
let uiLinkFilterToFilter = 'uiLinkFilterToFilter';
class CommandDispatcher {
	player: MZXBX_Player;
	renderer: UIRenderer;
	audioContext: AudioContext;
	tapSizeRatio: number = 1;
	clipboardData: Zvoog_Project | null = null;
	//onAir = false;
	//neeToStart = false;
	playPosition = 0;
	restartOnInitError = false;
	playCallback: (start: number, position: number, end: number) => void = (start: number, pos: number, end: number) => {
		this.playPosition = pos - 0.25;
		//this.renderer.timeselectbar.positionTimeMark.x 
		this.reDrawPlayPosition();

		//console.log('play state', start, position, end);
	};

	_mixerDataMathUtility: MixerDataMathUtility;
	listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any) = null;
	exe: CommandExe = new CommandExe();
	//undoQueue: UndoRedoCommand[] = [];
	//redoQueue: UndoRedoCommand[] = [];
	//undoQueue: Zvoog_UICommand[] = [];
	//redoQueue: Zvoog_UICommand[] = [];
	undoQueue: string[] = [];
	redoQueue: string[] = [];
	filterPluginDialog = new FilterPluginDialog();
	pointPluginDialog = new PointPluginDialog();
	samplerPluginDialog = new SamplerPluginDialog();
	actionPluginDialog = new ActionPluginDialog();
	sequencerPluginDialog = new SequencerPluginDialog();
	cfg(): MixerDataMathUtility {
		return this._mixerDataMathUtility;
	}
	promptPluginInfoDebug() {
		console.log('promptPluginInfoDebug');
		var input = document.createElement('input');
		input.type = 'file';
		input.onchange = (evnt) => {
			var file = (evnt as any).target.files[0];
			console.log(file);
			var reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = (readerEvent) => {
				var content = (readerEvent as any).target.result;
				console.log(content);
				let inf = JSON.parse(content);
				console.log(inf);
				MZXBX_currentPlugins().push(inf);
				console.log(MZXBX_currentPlugins());
				menuItemsData = null;
				globalCommandDispatcher.renderer.menu.rerenderMenuContent(null);
				globalCommandDispatcher.resetProject();
			}
		}

		input.click();
	}
	/*spliseUndo(cnt:number): void {
		console.log('from',this.undoQueue.length);
		this.undoQueue.splice(0, 11);
		console.log('to',this.undoQueue.length);
	}*/
	undo(): string[] {
		//undo(): Zvoog_UICommand[] {
		return this.undoQueue;
	}
	redo(): string[] {
		//redo(): Zvoog_UICommand[] {
		return this.redoQueue;
	}
	clearUndo() {
		this.undoQueue = [];
	}
	clearRedo() {
		this.redoQueue = [];
	}
	setVisibleTimeMark() {
		this.renderer.timeselectbar.positionTimeMark.css = 'positionTimeMarkShow';
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.positionTimeSVGGroup, this.renderer.timeselectbar.positionTimeAnchor, LevelModes.normal);
	}
	setHiddenTimeMark() {
		this.renderer.timeselectbar.positionTimeMark.css = 'positionTimeMarkHide';
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.positionTimeSVGGroup, this.renderer.timeselectbar.positionTimeAnchor, LevelModes.normal);
	}
	reDrawPlayPosition() {

		let ww = this.renderer.timeselectbar.positionMarkWidth();
		let xx = this.cfg().leftPad + this.playPosition * this.cfg().widthDurationRatio - ww;
		this.renderer.timeselectbar.positionTimeAnchor.translation = { x: xx, y: 0 };
		this.renderer.timeselectbar.positionTimeMark.w = ww;
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.positionTimeSVGGroup, this.renderer.timeselectbar.positionTimeAnchor, LevelModes.normal);
		//console.log('reDrawPlayPosition', ww, xx, this.playPosition);
	}
	/*addUndoRedo(cc: UndoRedoCommand) {
		cc.redo();
		this.undoQueue.push(cc);
		this.redoQueue.length = 0;
		this.resetProject();
	}
	redoFromQueue(cnt: number) {
		for (let ii = 0; ii < cnt; ii++) {
			let cmd = this.redoQueue.shift();
			if (cmd) {
				cmd.redo();
				this.renderer.tiler.setCurrentPointPosition(cmd.parameters.position);
				this.undoQueue.push(cmd);
			}
		}
		this.resetProject();
	}
	undoFromQueue(cnt: number) {
		for (let ii = 0; ii < cnt; ii++) {
			let cmd = this.undoQueue.pop();
			if (cmd) {
				cmd.undo();
				this.renderer.tiler.setCurrentPointPosition(cmd.parameters.position);
				this.redoQueue.unshift(cmd);
			}
		}
		this.resetProject();
	}*/
	copySelectionToClipboard() {
		//console.log('copySelectionToClipboard');
		this.clipboardData = null;
		let st = this.cfg().data.selectedPart.startMeasure;
		let en = this.cfg().data.selectedPart.endMeasure;
		if (0 <= st && st <= en) {
			let txt = JSON.stringify(this.cfg().data);
			this.clipboardData = JSON.parse(txt);
			if (this.clipboardData) {
				this.adjustContentByMeter(this.clipboardData);
				this.clipboardData.timeline.splice(0, st);
				this.clipboardData.timeline.splice(en - st + 1);
				for (let ii = 0; ii < this.clipboardData.tracks.length; ii++) {
					this.clipboardData.tracks[ii].measures.splice(0, st);
					this.clipboardData.tracks[ii].measures.splice(en - st + 1);
				}
				for (let ii = 0; ii < this.clipboardData.percussions.length; ii++) {
					this.clipboardData.percussions[ii].measures.splice(0, st);
					this.clipboardData.percussions[ii].measures.splice(en - st + 1);
				}
				for (let ii = 0; ii < this.clipboardData.filters.length; ii++) {
					this.clipboardData.filters[ii].automation.splice(0, st);
					this.clipboardData.filters[ii].automation.splice(en - st + 1);
				}
				this.clipboardData.comments.splice(0, st);
				this.clipboardData.comments.splice(en - st + 1);
			}
		}
		//console.log(this.clipboard);
		globalCommandDispatcher.renderer.menu.rerenderMenuContent(null);
		globalCommandDispatcher.resetProject();
	}
	initAudioFromUI() {
		//console.log('initAudioFromUI');
		var AudioContext = window.AudioContext;// || window.webkitAudioContext;
		this.audioContext = new AudioContext();
		this.player = createSchedulePlayer(this.playCallback);
		globalCommandDispatcher.setupAndStartPlay();
	}
	registerWorkProject(data: Zvoog_Project) {
		//console.log('registerWorkProject', data)
		this._mixerDataMathUtility = new MixerDataMathUtility(data);
		//this.adjustTimelineContent();
	}
	registerUI(renderer: UIRenderer) {
		this.renderer = renderer;
	}
	hideRightMenu() {
		globalCommandDispatcher.cfg().data.list = false;
		this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
		this.renderer.menu.resetAllAnchors();
	}
	showRightMenu() {
		let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
		let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
		this.cfg().data.list = true;
		this.renderer.menu.resizeMenu(vw, vh);
		this.renderer.menu.resetAllAnchors();
	};
	findCurrentFilter(id: string): null | Zvoog_FilterTarget {
		for (let ff = 0; ff < this.cfg().data.filters.length; ff++) {
			if (this.cfg().data.filters[ff].id == id) {
				return this.cfg().data.filters[ff];
			}
		}
		return null;
	}
	renderCurrentOutputs(id: string, result: string[], outputs: string[]) {
		//console.log('renderCurrentOutputs', id, outputs);
		for (let oo = 0; oo < outputs.length; oo++) {
			let cid = outputs[oo];
			if (cid) {
				if (cid != id) {
					let filter = this.findCurrentFilter(cid);
					if (filter) {
						if (filter.state == 1) {//passthrough
							//console.log('passthrough', filter);
							this.renderCurrentOutputs(id, result, filter.outputs);
						} else {
							if (result.indexOf(cid) < 0) {
								//console.log('add', cid);
								result.push(cid);
							}
						}
					}
				}
			} else {
				if (result.indexOf('') < 0) {
					//console.log('add speaker');
					result.push('');
				}
			}
		}
	}
	renderCurrentProjectForOutput(): MZXBX_Schedule {
		//globalCommandDispatcher.adjustTimeline();
		let forOutput: MZXBX_Schedule = {
			series: []
			, channels: []
			, filters: []
		};
		let prj: Zvoog_Project = this.cfg().data;

		let soloOnly = false;
		for (let ss = 0; ss < prj.percussions.length; ss++) {
			if (prj.percussions[ss].sampler.state == 2) {
				soloOnly = true;
				break;
			}
		}
		for (let tt = 0; tt < prj.tracks.length; tt++) {
			if (prj.tracks[tt].performer.state == 2) {
				soloOnly = true;
				break;
			}
		}
		for (let ss = 0; ss < prj.percussions.length; ss++) {
			let sampler = prj.percussions[ss];
			let mchannel: MZXBX_Channel = {
				id: sampler.sampler.id
				, outputs: []//sampler.sampler.outputs
				, performer: {
					//id: sampler.sampler.id
					kind: sampler.sampler.kind
					, properties: sampler.sampler.data
					, description: 'sampler ' + sampler.title
				}
			};
			if (
				(soloOnly && sampler.sampler.state != 2)
				|| ((!soloOnly) && sampler.sampler.state == 1)
			) {
				//mchannel.outputs = [];
			} else {
				this.renderCurrentOutputs(sampler.sampler.id, mchannel.outputs, sampler.sampler.outputs);
			}
			forOutput.channels.push(mchannel);
		}

		for (let tt = 0; tt < prj.tracks.length; tt++) {
			let track = prj.tracks[tt];
			let mchannel: MZXBX_Channel = {
				id: track.performer.id
				, outputs: []//track.performer.outputs
				, performer: {
					//id: track.performer.id
					kind: track.performer.kind
					, properties: track.performer.data
					, description: 'track ' + track.title
				}
			};
			if (
				(soloOnly && track.performer.state != 2)
				|| ((!soloOnly) && track.performer.state == 1)
			) {
				//mchannel.outputs = [];
			} else {
				this.renderCurrentOutputs(track.performer.id, mchannel.outputs, track.performer.outputs);
			}
			forOutput.channels.push(mchannel);
		}

		for (let ff = 0; ff < prj.filters.length; ff++) {
			let filter = prj.filters[ff];
			let outFilter: MZXBX_Filter = {
				id: filter.id
				, kind: filter.kind
				, properties: filter.data
				, outputs: []//filter.outputs
				, description: 'filter ' + filter.title
			}
			if (filter.state == 1) {
				//outFilter.outputs = [];
			} else {
				this.renderCurrentOutputs(filter.id, outFilter.outputs, filter.outputs);
			}
			forOutput.filters.push(outFilter);
		}
		//let cuStart = 0;
		for (let mm = 0; mm < prj.timeline.length; mm++) {
			let measure: Zvoog_SongMeasure = prj.timeline[mm];
			let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
			let singleSet: MZXBX_Set = {
				duration: cuDuration
				, tempo: measure.tempo
				, items: []
				, states: []
			};
			forOutput.series.push(singleSet);
			for (let ff = 0; ff < prj.filters.length; ff++) {
				let filter = prj.filters[ff];
				let auto = filter.automation[mm];
				if (auto) {
					for (let aa = 0; aa < auto.changes.length; aa++) {
						let change = auto.changes[aa];
						let start = MMUtil().set(change.skip).duration(measure.tempo);
						let filterChange: MZXBX_FilterState = { skip: start, filterId: filter.id, data: change.stateBlob };
						singleSet.states.push(filterChange);
					}
				}
			}
			for (let ss = 0; ss < prj.percussions.length; ss++) {
				let channel = forOutput.channels[ss];
				let sampler = prj.percussions[ss];
				let percBar = sampler.measures[mm];
				if (percBar) {
					for (let ski = 0; ski < percBar.skips.length; ski++) {
						let askip = percBar.skips[ski];
						let start = MMUtil().set(askip).duration(measure.tempo);
						let it: MZXBX_PlayItem = { skip: start, channelId: channel.id, pitches: [], slides: [] };
						singleSet.items.push(it);
					}
				}
			}
			for (let ss = 0; ss < prj.tracks.length; ss++) {
				let channel = forOutput.channels[ss + prj.percussions.length];
				let track = prj.tracks[ss];
				let trackBar = track.measures[mm];
				if (trackBar) {
					for (let ch = 0; ch < trackBar.chords.length; ch++) {
						let chord = trackBar.chords[ch];
						//for (let ski = 0; ski < trackBar.skips.length; ski++) {
						//let askip = trackBar.skips[ski];
						let start = MMUtil().set(chord.skip).duration(measure.tempo);
						let it: MZXBX_PlayItem = { skip: start, channelId: channel.id, pitches: chord.pitches, slides: [] };
						singleSet.items.push(it);
						for (let kk = 0; kk < chord.slides.length; kk++) {
							let one = chord.slides[kk];
							it.slides.push({ duration: MMUtil().set(one.duration).duration(measure.tempo), delta: one.delta });
						}
						//}
						if (it.pitches.length < 1) {
							console.log('empty', it);
						}
					}
				}
			}
		}
		//console.log('renderCurrentProjectForOutput', forOutput);
		return forOutput;
	}
	reConnectPluginsIfPlay() {
		//console.log('reConnectPluginsIfPlay', this.player.playState());
		if (this.player.playState().play) {
			let schedule = this.renderCurrentProjectForOutput();
			//console.log('schedule', schedule);
			this.player.reconnectAllPlugins(schedule);
		}
	}
	reStartPlayIfPlay() {
		if (this.player.playState().play) {
			console.log('reStartPlayIfPlay');
			this.stopPlay();
			this.setupAndStartPlay();
		}
	}
	/*toggleStartStop() {
		//console.log('toggleStartStop', this.onAir);
		if (this.player.playState().play) {
			this.stopPlay();
		} else {
			this.setupAndStartPlay();
		}
	}*/
	stopPlay() {
		/*if (this.onAir) {
			this.onAir = false;
			this.player.cancel();
		}*/

		this.player.cancel();
		this.renderer.menu.rerenderMenuContent(null);
		this.setHiddenTimeMark();
		this.resetProject();
		//console.log('stopPlay done', this.player.playState());
	}
	setupAndStartPlay() {
		console.log('setupAndStartPlay');
		//this.onAir = true;
		let schedule = this.renderCurrentProjectForOutput();
		let from = 0;
		let to = 0;
		if (globalCommandDispatcher.cfg().data.selectedPart.startMeasure > -1) {
			for (let nn = 0; nn <= globalCommandDispatcher.cfg().data.selectedPart.endMeasure; nn++) {
				to = to + schedule.series[nn].duration;
				if (nn < globalCommandDispatcher.cfg().data.selectedPart.startMeasure) {
					from = to;
				}
			}
		} else {
			for (let nn = 0; nn < schedule.series.length; nn++) {
				to = to + schedule.series[nn].duration;
			}
		}
		//let me = this;
		let result = this.player.startSetupPlugins(this.audioContext, schedule);
		//console.log('after setupPlugins',schedule);
		//me.neeToStart = true;
		if (this.playPosition < from) {
			this.playPosition = from;
		}
		if (this.playPosition >= to) {
			this.playPosition = to;
		}


		if (result != null) {
			//this.onAir = false;
			//this.neeToStart = false;
			//this.renderer.warning.setIcon('S');
			this.renderer.warning.showWarning('Start playing', result, 'Loading...', null);
		} else {
			//this.renderer.menu.rerenderMenuContent()
		}

		this.startPlayLoop(from, this.playPosition, to);

	}
	startPlayLoop(from: number, position: number, to: number) {
		console.log('startPlayLoop', from, position, to);
		let msg: string = this.player.startLoopTicks(from, position, to);
		if (msg) {
			//console.log('msg', msg, this.renderer.warning.noWarning);
			let me = this;
			this.restartOnInitError = true;
			this.renderer.warning.showWarning('Start playing', 'Loading...', '' + msg//,null);
				, () => {
					console.log('cancel wait start loop');
					me.restartOnInitError = false;
					me.player.cancel();
				});
			let waitid = setTimeout(() => {
				if (!me.renderer.warning.noWarning) {
					if (me.restartOnInitError) {
						console.log('me.restartOnInitError', me.restartOnInitError, waitid);
						me.startPlayLoop(from, position, to);
					}
				}
			}, 1000);
			//console.log('waitid', waitid);
		} else {
			//console.log('empty msg');
			this.renderer.warning.hideWarning();
			this.setVisibleTimeMark();
			this.renderer.menu.rerenderMenuContent(null);
			this.resetProject();
		}
	}
	setThemeLocale(loc: string, ratio: number) {
		console.log("setThemeLocale", loc, ratio);
		//console.log("setThemeLocale", loc, ratio);
		setLocaleID(loc, ratio);
		if (loc == 'zh') {
			startLoadCSSfile('theme/font2big.css');
		} else {
			if (loc == 'ru') {
				startLoadCSSfile('theme/font3cyr.css');
			} else {
				startLoadCSSfile('theme/font1small.css');
			}
		}
		this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
		this.resetProject();
	}
	setThemeColor(idx: string) {//cssPath: string) {
		let cssPath: string = 'theme/colordarkred.css';
		if (idx == 'green1') {
			cssPath = 'theme/colordarkgreen.css';
		}
		if (idx == 'red1') {
			cssPath = 'theme/colordarkred.css';
		}
		if (idx == 'neon1') {
			cssPath = 'theme/colorneon.css';
		}
		if (idx == 'light1') {
			cssPath = 'theme/colorlight.css';
		}
		if (idx == 'light2') {
			cssPath = 'theme/colorwhite.css';
		}
		if (idx == 'blue1') {
			cssPath = 'theme/colordarkblue.css';
		}
		if (idx == 'light3') {
			cssPath = 'theme/colorbirch.css';
		}

		//console.log("cssPath " + cssPath);
		startLoadCSSfile(cssPath);
		this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
		saveRawText2localStorage('uicolortheme', idx);
	}
	resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) {
		this.renderer.tiler.resetAnchor(parentSVGGroup, anchor, layerMode);
	};
	changeTapSize(ratio: number) {
		console.log('changeTapSize', ratio, this);
		this.tapSizeRatio = ratio;
		this.renderer.tiler.setupTapSize(ratio);
		this.renderer.onReSizeView();
		this.renderer.tiler.resetModel();
	}
	newEmptyProject() {
		//this.registerWorkProject(createNewEmptyProjectData());
		globalCommandDispatcher.exe.commitProjectChanges([], () => {
			this.registerWorkProject(createNewEmptyProjectData());
			globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
		});
		this.resetProject();
	}
	tryFullScreen() {
		//var elem = document.getElementById('fsbodyroot') as any;
		var elem = document.documentElement as any;
		console.log('root', elem);
		/* When the openFullscreen() function is executed, open the video in fullscreen.
		Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */

		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) { /* Safari */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE11 */
			elem.msRequestFullscreen();
		}

	}


	resetProject() {
		try {
			/*
						if (this.cfg().data.tracks)
							if (this.cfg().data.tracks[0])
								this.renderer.menu.layerCurrentTitle.text = this.cfg().data.tracks[0].title;
			*/
			//this.adjustTimeline();
			this.setPlayPositionFromSelectedPart();
			this.renderer.fillWholeUI();

			//this.setupSelectionBackground(this.cfg().data.selectedPart);
		} catch (xx) {
			console.log('resetProject', xx);
			console.log('data', this.cfg().data);
		}
	}
	//moveTrackTop(trackNum: number) {
	//console.log('moveTrackTop', trackNum);
	/*
	let it = this.cfg().data.tracks[trackNum];
	this.cfg().data.tracks.splice(trackNum, 1);
	this.cfg().data.tracks.unshift(it);
*/

	//let par: ParameterMoveTrackTop = { trackPrePosition: trackNum, position: this.renderer.tiler.getCurrentPointPosition() };
	//let cmd = new CmdMoveTrackTop(par);
	//this.addUndoRedo(new CmdMoveTrackTop(par));
	///////////////////////////////this.exe.addUndoCommandFromUI(ExeMoveTrack, { from: trackNum, to: 0 });
	//cmd.redo();
	/*
	this.renderer.menu.layerCurrentTitle.text = LO(localMenuTracksFolder);
	if (this.cfg().data.tracks)
		if (this.cfg().data.tracks[0])
			this.renderer.menu.layerCurrentTitle.text = this.cfg().data.tracks[0].title;
			*/
	//this.resetProject();
	//}
	/*moveDrumTop(drumNum: number) {
		console.log('moveDrumTop', drumNum);
		let it = this.cfg().data.percussions[drumNum];
		this.cfg().data.percussions.splice(drumNum, 1);
		this.cfg().data.percussions.unshift(it);
	}*/
	/*moveAutomationTop(filterNum: number) {
		console.log('moveAutomationTop', filterNum);
	}
	setTrackSoloState(state: number) {
		console.log('setTrackSoloState', state);
	}
	setDrumSoloState(state: number) {
		console.log('setDrumSoloState', state);
	}*/
	//promptActionPluginDialog(actionPlugin: MZXBX_PluginRegistrationInformation) {
	//console.log('promptProjectPluginGUI', url);
	//pluginDialogPrompt.openActionPluginDialogFrame(actionPlugin);
	//}
	//promptPluginSequencerDialog(track: Zvoog_MusicTrack, performerPlugin: MZXBX_PluginRegistrationInformation) {
	//pluginDialogPrompt.openPluginPointDialogFrame(label, url, rawdata, callback, btnLabel, btnAction, titleAction);
	//}
	//promptPluginSamplerDialog(drum: Zvoog_PercussionTrack, samplerPlugin: MZXBX_PluginRegistrationInformation) {
	//pluginDialogPrompt.openPluginPointDialogFrame(label, url, rawdata, callback, btnLabel, btnAction, titleAction);
	//}
	//promptPluginFilterDialog(order: number, raw: string, filter: Zvoog_FilterTarget, filterPlugin: MZXBX_PluginRegistrationInformation) {
	//pluginDialogPrompt.openFilterPluginDialogFrame(order, raw, filter, filterPlugin);//label, url, rawdata, callback, btnLabel, btnAction, titleAction);

	//}
	/*promptPluginDialogTitle(){
		pluginDialogPrompt.promptPluginDialogTitle();
	}*/
	/*
	promptPluginPointDialog(label: string, url: string, rawdata: string, callback: (obj: Zvoog_Project) => void
		, btnLabel: string, btnAction: () => void
		, titleAction: (newTitle: string) => void
	) {
		pluginDialogPrompt.openPluginPointDialogFrame(label, url, rawdata, callback, btnLabel, btnAction, titleAction);
	}
	*/
	/*
	promptStepPluginGUI(label: string, url: string, rawdata: string, callback: (obj: any) => boolean) {
		//console.log('promptPointPluginGUI', url);
		pluginDialogPrompt.openStepDialogFrame(label, url, rawdata, callback);
	}
	promptFilterPluginDialog(label: string, url: string, rawdata: string, callback: (obj: any) => boolean) {
		//console.log('promptPointPluginGUI', url);
		pluginDialogPrompt.openFilterPluginDialogFrame(label, url, rawdata, callback);
	}
	promptSamplerPluginDialog(label: string, url: string, rawdata: string, callback: (obj: any) => boolean) {
		//console.log('promptPointPluginGUI', url);
		pluginDialogPrompt.openSamplerPluginDialogFrame(label, url, rawdata, callback);
	}
	promptPerformerPluginDialog(label: string, url: string, rawdata: string, callback: (obj: any) => boolean) {
		//console.log('promptPointPluginGUI', url);
		pluginDialogPrompt.openPerformerPluginDialogFrame(label, url, rawdata, callback);
	}
	*/
	findPluginRegistrationByKind(kind: String): null | MZXBX_PluginRegistrationInformation {
		let list: MZXBX_PluginRegistrationInformation[] = MZXBX_currentPlugins();
		for (let ii = 0; ii < list.length; ii++) {
			if (list[ii].kind == kind) {
				return list[ii];
			}
		}
		//console.log('findPluginRegistrationByKind wrong', kind);
		return null;
	}
	/*cancelPluginGUI() {
		//console.log('cancelPluginGUI');
		pluginDialogPrompt.closeDialogFrame();

	}*/
	timeSelectChange(idx: number) {
		if (this.player.playState().play) {
			this.playFromTimeSelection(idx);
		} else {
			this.expandTimeLineSelection(idx);
		}
	}
	playFromTimeSelection(idx: number) {
		this.stopPlay();
		console.log('last position', this.playPosition);
		this.playPosition = 0;
		this.cfg().data.selectedPart.startMeasure = -1;
		this.cfg().data.selectedPart.endMeasure = -1;
		console.log('selection', this.cfg().data.selectedPart);
		for (let mm = 0; mm < idx; mm++) {
			let measure: Zvoog_SongMeasure = this.cfg().data.timeline[mm];
			let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
			this.playPosition = this.playPosition + cuDuration;
		}
		console.log('position now', this.playPosition);
		this.renderer.timeselectbar.updateTimeSelectionBar();
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup
			, this.renderer.timeselectbar.selectionAnchor
			, LevelModes.top);
		this.reDrawPlayPosition();
		this.setupAndStartPlay();
	}
	setupSelectionBackground22(selectedPart: Zvoog_Selection) {
		/*
				#tileLevelSVG {
					width: 100%;
					user-select: none;
					touch-action: manipulation;
					background-size: cover;
					stroke-linecap: round;
					margin: 0px;
					padding: 0px;
					background: var(--back-color);*/
		/*let tileLevelSVG = document.getElementById('tileLevelSVG');
		if (selectedPart.startMeasure < 0) {
			tileLevelSVG?.style.setProperty('background', 'var(--unselectedbg-color)');
		} else {
			tileLevelSVG?.style.setProperty('background', 'var(--selectedbgground-color)');
		}*/
	}
	expandTimeLineSelection(idx: number) {
		//console.log('expandTimeLineSelection');
		if (this.cfg().data) {
			if (idx >= 0 && idx < this.cfg().data.timeline.length) {
				let curPro = this.cfg().data;
				if (curPro.selectedPart.startMeasure > -1 || curPro.selectedPart.endMeasure > -1) {
					let curProjectSelection: Zvoog_Selection = curPro.selectedPart;
					if (curProjectSelection.startMeasure == curProjectSelection.endMeasure) {
						if (curProjectSelection.startMeasure == idx) {
							curPro.selectedPart = {
								startMeasure: -1
								, endMeasure: -1
							};
						} else {
							if (curProjectSelection.startMeasure > idx) {
								curProjectSelection.endMeasure = curProjectSelection.startMeasure;
								curProjectSelection.startMeasure = idx;
							} else {
								curProjectSelection.endMeasure = idx;
							}
						}
					} else {
						curProjectSelection.startMeasure = idx;
						curProjectSelection.endMeasure = idx;
					}
				} else {
					curPro.selectedPart = {
						startMeasure: idx
						, endMeasure: idx
					};
				}
				//this.setupSelectionBackground(curPro.selectedPart);
			}
		} else {
			console.log('no project data');
		}
		this.setPlayPositionFromSelectedPart();
		//this.renderer.timeselectbar.updateTimeSelectionBar();
		/*this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup
			, this.renderer.timeselectbar.selectionAnchor
			, LevelModes.top);*/
		this.reDrawPlayPosition();
		this.resetProject();
	}
	downloadBlob(blob: Blob, name: string) {
		let a = document.createElement('a');
		const url = URL.createObjectURL(blob);
		a.href = url;
		a.download = name;
		a.click();
		URL.revokeObjectURL(url);
	}
	/*copySelectedBars() {

	}*/
	exportCanvasAsFile(canvas: HTMLCanvasElement, fileName: string): void {
		canvas.toBlob((blobresult: Blob) => {
			globalCommandDispatcher.downloadBlob(blobresult, fileName);
		});
	}
	hideMenuByStyle() {
		this.renderer.menu.menuPanelBackground.style.visibility = 'hidden';
		this.renderer.menu.menuPanelContent.style.visibility = 'hidden';
		this.renderer.menu.menuPanelInteraction.style.visibility = 'hidden';
		this.renderer.menu.menuPanelButtons.style.visibility = 'hidden';
	}
	showMenuByStyle() {
		this.renderer.menu.menuPanelBackground.style.visibility = 'visible';
		this.renderer.menu.menuPanelContent.style.visibility = 'visible';
		this.renderer.menu.menuPanelInteraction.style.visibility = 'visible';
		this.renderer.menu.menuPanelButtons.style.visibility = 'visible';
	}
	makeTileSVGsquareCanvas(canvasSize: number, onDoneCanvas: (canvas: HTMLCanvasElement, buffer: ArrayBuffer) => void): void {
		console.log('makeTileSVGsquareCanvas', canvasSize);
		this.hideMenuByStyle();
		let tileLevelSVG: HTMLElement = document.getElementById('tileLevelSVG') as HTMLElement;
		let xml: string = encodeURIComponent(tileLevelSVG.outerHTML);
		let replaceText = '%3C!--%20css%20--%3E';//<!-- css -->;
		//xml = xml.replace(replaceText, wholeCSSstring);

		let csscolors = colordarkred;
		let idx = readRawTextFromlocalStorage('uicolortheme');
		if (idx == 'green1') {
			csscolors = colordarkgreen;
		}
		if (idx == 'red1') {
			csscolors = colordarkred;
		}
		if (idx == 'neon1') {
			csscolors = colorneon;
		}
		if (idx == 'light1') {
			csscolors = colorlight;
		}
		if (idx == 'light2') {
			csscolors = colorwhite;
		}
		if (idx == 'blue1') {
			csscolors = colordarkblue;
		}
		if (idx == 'light3') {
			csscolors = colorbirch;
		}

		let wholeCSSstring = encodeURIComponent('<style>')
			+ encodeURIComponent(styleText)
			+ encodeURIComponent(' ' + csscolors)
			+ encodeURIComponent('</style>')
			;
		//console.log(wholeCSSstring);
		xml = xml.replace(replaceText, wholeCSSstring);

		var url: string = 'data:image/svg+xml;utf8,' + xml;
		let ratio = window.innerWidth / window.innerHeight;
		let canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.height = canvasSize;
		canvas.width = canvasSize;
		let context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
		let svgImg: HTMLImageElement = new Image(window.innerWidth, window.innerHeight);
		svgImg.onload = () => {
			if (ratio > 1) {
				context.drawImage(svgImg, -0.5 * (canvasSize * ratio - canvasSize), 0, canvasSize * ratio, canvasSize);
			} else {
				context.drawImage(svgImg, 0, -0.5 * (canvasSize / ratio - canvasSize), canvasSize, canvasSize / ratio);
			}
			var imageData: ImageData = context.getImageData(0, 0, canvasSize, canvasSize);
			var buffer: ArrayBuffer = imageData.data.buffer;
			onDoneCanvas(canvas, buffer);
			this.showMenuByStyle();
		};
		svgImg.src = url;
		//this.showMenuByStyle();
	}
	copySelectedBars() {
		console.log('copySelectedBars');
		//https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg
		globalCommandDispatcher.makeTileSVGsquareCanvas(300, (canvas: HTMLCanvasElement, buffer: ArrayBuffer) => {
			globalCommandDispatcher.exportCanvasAsFile(canvas, 'testCanvasSVG.png');
		});
	}
	copySelectedBars222() {
		console.log('copySelectedBars');
		let tileLevelSVG: HTMLElement = document.getElementById('tileLevelSVG') as HTMLElement;
		let xml: string = encodeURIComponent(tileLevelSVG.outerHTML);

		let replaceText = '%3C!--%20css%20--%3E';//<!-- css -->;
		//xml=xml.replace(replaceText,'%3C!--%20donestyle%20--%3E');
		//xml = xml.replace(replaceText, wholeCSSstring);
		var url: string = 'data:image/svg+xml;utf8,' + xml;
		//console.log(url);
		let ww = window.innerWidth;
		let hh = window.innerHeight;
		//svgImg.src = image_data_url;
		//svgImg.src = 'http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg';
		//let svg = xml;
		//let blob = new Blob([xml], { type: 'image/svg+xml' });
		//let url = URL.createObjectURL(blob);
		//let url='data:image/svg+xml;base64,'+xml;
		console.log(url);
		/*
				var xml2 = new XMLSerializer().serializeToString(tileLevelSVG);
		console.log('xml2',xml2);
				// make it base64
				var svg64 = btoa(xml2);
				console.log(svg64);
				var b64Start = 'data:image/svg+xml;base64,';
				// prepend a "header"
		var image64 = b64Start + svg64;
		*/


		let canvas: HTMLCanvasElement = document.createElement('canvas');
		canvas.height = hh;
		canvas.width = ww;
		let context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
		let svgImg: HTMLImageElement = new Image(ww, hh);
		console.log('image onload');

		context.beginPath();
		context.rect(10, 20, 150, 100);
		context.fill();

		svgImg.onload = () => {
			console.log('image onload');
			context.drawImage(svgImg, 0, 0, ww, hh);
			canvas.toBlob((blobresult: Blob) => {
				console.log('canvas toBlob');
				globalCommandDispatcher.downloadBlob(blobresult, 'canvasImage.png');
			});
		};
		console.log('image start');
		svgImg.src = url;
		//svgImg.src = image64;
		//svgImg.src = 'http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg';

		console.log('image done');
	}
	moveAsideSelectedBars() {
		console.log('move aside');
	}
	readThemeColors(): {
		background: string// #101;
		, main: string//#9cf;
		, drag: string//#03f;
		, line: string//#ffc;
		, click: string// #c39;
	} {
		return {
			background: window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
			, main: window.getComputedStyle(document.documentElement).getPropertyValue('--main-color')
			, drag: window.getComputedStyle(document.documentElement).getPropertyValue('--drag-color')
			, line: window.getComputedStyle(document.documentElement).getPropertyValue('--line-color')
			, click: window.getComputedStyle(document.documentElement).getPropertyValue('--click-color')
		};
	}

	calculateRealTrackFarOrder(): number[] {
		let realOrder: number[] = this.cfg().data.farorder.map((it) => it);
		let trcnt = this.cfg().data.tracks.length;
		for (let ii = 0; ii < trcnt; ii++) {
			if (realOrder.indexOf(ii) < 0) {
				realOrder.push(ii);
			}
		}
		return realOrder.filter((it) => it >= 0 && it < trcnt);
	}


	promptTempoForSelectedBars() {
		let startMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
		let endMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
		let count = endMeasure - startMeasure + 1;
		if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
			count = globalCommandDispatcher.cfg().data.timeline.length - 1;
		}
		if (startMeasure > -1 && count > 0) {
			let oldTempo = Math.round(globalCommandDispatcher.cfg().data.timeline[startMeasure].tempo);
			let txt = prompt('Tempo', '' + oldTempo);
			if (txt) {
				let newTempo = parseInt(txt);
				if (newTempo > 20 && newTempo < 400) {
					globalCommandDispatcher.exe.commitProjectChanges([], () => {
						globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
						for (let ii = 0; ii < count; ii++) {
							globalCommandDispatcher.cfg().data.timeline[startMeasure + ii].tempo = newTempo;
							//console.log(ii, globalCommandDispatcher.cfg().data.timeline[ii]);
						}
						globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
					});
					globalCommandDispatcher.resetProject();
					//console.log(globalCommandDispatcher.cfg().data);
				}
			}
		}
	}

	setPlayPositionFromSelectedPart() {
		//console.log('setPlayPositionFromSelectedPart');
		if (this.cfg().data.selectedPart.startMeasure >= 0) {
			this.playPosition = 0;
			for (let mm = 0; mm < this.cfg().data.selectedPart.startMeasure; mm++) {
				let measure: Zvoog_SongMeasure = this.cfg().data.timeline[mm];
				let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
				this.playPosition = this.playPosition + cuDuration;
			}
			//console.log('playPosition', this.playPosition);
		}
	}
	rollTracksClick(left: number, top: number) {

		let zz = this.renderer.tiler.getCurrentPointPosition().z;
		if (zz < 64) {
			let centerPitch = (globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - top) - 3.5 - 12;
			let upper = Math.round(centerPitch + zz / 3);
			let lower = Math.round(centerPitch - zz / 3);
			let barStart = 0;
			let areaTrack: number[] = [];
			for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
				let bar = this.cfg().data.timeline[ii];
				let barWidth = MMUtil().set(bar.metre).duration(bar.tempo) * this.cfg().widthDurationRatio;
				if (barStart + barWidth > left) {
					let clickBarNo = ii;
					let leftSelect = left - 0.5 * zz - barStart;
					let rightSelect = left + 0.5 * zz - barStart;
					for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
						let track = globalCommandDispatcher.cfg().data.tracks[tt];
						let measure = track.measures[clickBarNo];
						for (let cc = 0; cc < measure.chords.length; cc++) {
							let chord = measure.chords[cc];
							let skipStart = MMUtil().set(chord.skip).duration(bar.tempo) * this.cfg().widthDurationRatio;
							let chordWidth = 0;
							for (let ss = 0; ss < chord.slides.length; ss++) {
								chordWidth = chordWidth + MMUtil().set(chord.slides[ss].duration).duration(bar.tempo) * this.cfg().widthDurationRatio;
							}
							if (skipStart <= rightSelect && skipStart + chordWidth >= leftSelect) {
								for (let pp = 0; pp < chord.pitches.length; pp++) {
									let pitch = chord.pitches[pp];
									if (pitch <= upper && pitch >= lower) {
										//console.log(pitch, track.title, tt);
										if (areaTrack.indexOf(tt) < 0) {
											areaTrack.push(tt);
										}
									}
								}
							}
						}
					}
					break;
				} else {
					barStart = barStart + barWidth;
				}
			}
			//console.log('area', areaTrack);
			let farorder = this.calculateRealTrackFarOrder();
			let pairs: { far: number, track: number }[] = [];
			let mostDistantIdx = farorder.length - 1;
			for (let ii = 0; ii < farorder.length; ii++) {
				let trackIdx = farorder[ii];
				if (areaTrack.indexOf(trackIdx) > -1) {
					pairs.push({ far: ii, track: farorder[ii] });
				}
			}
			if (pairs.length > 0) {
				if (pairs[pairs.length - 1].far > 0) {
					mostDistantIdx = pairs[pairs.length - 1].far;
				}
			}
			globalCommandDispatcher.exe.commitProjectChanges(['farorder'], () => {
				let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
				let nn = farorder.splice(mostDistantIdx, 1)[0];
				farorder.splice(0, 0, nn);
				globalCommandDispatcher.cfg().data.farorder = farorder;
			});
		}
	}
	adjustTimelineEmptyEnd(project: Zvoog_Project) {
		if (project.timeline.length > 1) {
			if (!(project.timeline[project.timeline.length - 1])) {
				project.timeline.length = project.timeline.length - 1;
			}
		}
	}
	adjustTimeLineLength(project: Zvoog_Project) {
		console.log('adjustTimeLineLength');
		this.adjustTimelineEmptyEnd(project);
		this.adjustTimelineEmptyEnd(project);
		this.adjustTimelineEmptyEnd(project);

		for (let tt = 0; tt < project.timeline.length; tt++) {
			for (let nn = 0; nn < project.tracks.length; nn++) {
				let track = project.tracks[nn];
				if (!(track.measures[tt])) {
					track.measures[tt] = { chords: [] };
				}
			}
			for (let nn = 0; nn < project.percussions.length; nn++) {
				let percu = project.percussions[nn];
				if (!(percu.measures[tt])) {
					percu.measures[tt] = { skips: [] };
				}
			}
			for (let nn = 0; nn < project.filters.length; nn++) {
				let filter = project.filters[nn];
				if (!(filter.automation[tt])) {
					filter.automation[tt] = { changes: [] };
				}
			}
			if (!(project.comments[tt])) {
				project.comments[tt] = { points: [] };
			}
		}
		for (let nn = 0; nn < project.tracks.length; nn++) {
			project.tracks[nn].measures.length = project.timeline.length;
		}
		for (let nn = 0; nn < project.percussions.length; nn++) {
			project.percussions[nn].measures.length = project.timeline.length;
		}
		for (let nn = 0; nn < project.filters.length; nn++) {
			project.filters[nn].automation.length = project.timeline.length;
		}
		project.comments.length = project.timeline.length;
	}
	adjustRemoveEmptyChords(project: Zvoog_Project) {
		for (let nn = 0; nn < project.tracks.length; nn++) {
			let track = project.tracks[nn];
			for (let mm = 0; mm < track.measures.length; mm++) {
				let trackMeasure = track.measures[mm];
				for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
					let chord = trackMeasure.chords[cc];
					if (chord.pitches.length) {
						//
					} else {
						trackMeasure.chords.splice(cc, 1);
						cc--;
					}
				}

			}
		}
	}
	adjustAppendBar(project: Zvoog_Project) {
		project.timeline.push({
			tempo: project.timeline[project.timeline.length - 1].tempo
			, metre: {
				count: project.timeline[project.timeline.length - 1].metre.count
				, part: project.timeline[project.timeline.length - 1].metre.part
			}
		});
		this.adjustTimeLineLength(project);
	}
	slidesEquals(a1: Zvoog_Slide[], a2: Zvoog_Slide[]): boolean {
		if (a1.length == a2.length) {
			for (let ii = 0; ii < a1.length; ii++) {
				if (Math.abs(a1[ii].delta - a2[ii].delta) < 0.005
					//&& MMUtil().set(a1[ii].duration).equals(a2[ii].duration)
				) {
					//
				} else {
					return false;
				}
			}
			return true;
		}
		return false;
	}
	adjustMergeChordByTime(trackBar: Zvoog_TrackMeasure) {
		//if(this.cfg().data.tracks[0].measures.length>33) console.log('1',JSON.stringify(this.cfg().data.tracks[0].measures[33].chords[0]));
		let mergedChords: Zvoog_Chord[] = [];
		for (let kk = 0; kk < trackBar.chords.length; kk++) {
			let checkChord: Zvoog_Chord = trackBar.chords[kk];
			let xsts = false;
			for (let mm = 0; mm < mergedChords.length; mm++) {
				let existedChord: Zvoog_Chord = mergedChords[mm];
				if (MMUtil().set(existedChord.skip).equals(checkChord.skip) && this.slidesEquals(existedChord.slides, checkChord.slides)) {
					xsts = true;
					//console.log(kk, mm, checkChord.skip, checkChord.pitches.length, '->', existedChord.skip, existedChord.pitches.length);
					let pitchcount = checkChord.pitches.length;
					for (let pp = 0; pp < pitchcount; pp++) {
						let pitch = checkChord.pitches[pp];
						if (existedChord.pitches.indexOf(pitch) == -1) {
							existedChord.pitches.push(pitch);
							checkChord.pitches.splice(pp, 1);
							pp--;
							pitchcount--;
						}
					}
					break;
				}
			}
			if (!xsts) {
				mergedChords.push(checkChord);
			}
		}
		//if(this.cfg().data.tracks[0].measures.length>33) console.log('2',JSON.stringify(this.cfg().data.tracks[0].measures[33].chords[0]));
	}
	/*adjustTracksChords(project: Zvoog_Project) {
		for (let nn = 0; nn < project.tracks.length; nn++) {
			for (let ii = 0; ii < project.timeline.length; ii++) {
				let barMetre = MMUtil().set(project.timeline[ii].metre);
				let trackBar = project.tracks[nn].measures[ii];
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					let chord = trackBar.chords[kk];
					if (barMetre.less(chord.skip)) {
						if (ii >= project.timeline.length) {
							//
						}
						chord.skip = MMUtil().set(chord.skip).minus(barMetre).simplyfy().metre();
						if (!(project.tracks[nn].measures[ii + 1].chords)) {
							project.tracks[nn].measures[ii + 1].chords = [];
						}
						project.tracks[nn].measures[ii + 1].chords.push(chord);
						trackBar.chords.splice(kk, 1);
						kk--;
					} else {
						if (chord.skip.count < 0) {
							if (ii > 0) {
								let preMetre = MMUtil().set(project.timeline[ii - 1].metre);
								chord.skip = preMetre.plus(chord.skip).simplyfy().metre();
								project.tracks[nn].measures[ii - 1].chords.push(chord);
							}
							trackBar.chords.splice(kk, 1);
							kk--;
						}
					}
				}
			}
		}
		for (let nn = 0; nn < project.tracks.length; nn++) {
			for (let ii = 0; ii < project.timeline.length; ii++) {
				let trackBar = project.tracks[nn].measures[ii];
				this.adjustMergeChordByTime(trackBar);
			}
		}
	}*/
	/*adjustSamplerSkips(project: Zvoog_Project) {
		for (let ii = 0; ii < project.timeline.length; ii++) {
			let barMetre = MMUtil().set(project.timeline[ii].metre);
			for (let nn = 0; nn < project.percussions.length; nn++) {
				let percuBar = project.percussions[nn].measures[ii];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					if (barMetre.less(percuBar.skips[kk])) {
						if (ii >= project.timeline.length) {
							this.adjustAppendBar(project);
							project.percussions[nn].measures.push({ skips: [] });
						}
						percuBar.skips[kk] = MMUtil().set(percuBar.skips[kk]).minus(barMetre).simplyfy();
						project.percussions[nn].measures[ii + 1].skips.push(percuBar.skips[kk]);

						percuBar.skips.splice(kk, 1);
						kk--;
					} else {
						if (percuBar.skips[kk].count < 0) {
							if (ii > 0) {
								let preMetre = MMUtil().set(project.timeline[ii - 1].metre);
								percuBar.skips[kk] = preMetre.plus(percuBar.skips[kk]).simplyfy();
								project.percussions[nn].measures[ii - 1].skips.push(percuBar.skips[kk]);
							}
							percuBar.skips.splice(kk, 1);
							kk--;
						}
					}
				}
			}
		}
	}*/
	/*adjustAutoPoints(project: Zvoog_Project) {
		for (let ii = 0; ii < project.timeline.length; ii++) {
			let barMetre = MMUtil().set(project.timeline[ii].metre);
			for (let nn = 0; nn < project.filters.length; nn++) {
				let autoBar = project.filters[nn].automation[ii];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					if (barMetre.less(autoBar.changes[kk].skip)) {
						if (ii >= project.timeline.length) {
							this.adjustAppendBar(project);
							project.filters[nn].automation.push({ changes: [] });
						}
						autoBar.changes[kk].skip = MMUtil().set(autoBar.changes[kk].skip).minus(barMetre).simplyfy().metre();
						project.percussions[nn].measures[ii + 1].skips.push(autoBar.changes[kk].skip);
						autoBar.changes.splice(kk, 1);
						kk--;
					} else {
						if (autoBar.changes[kk].skip.count < 0) {
							if (ii > 0) {
								let preMetre = MMUtil().set(project.timeline[ii - 1].metre);
								autoBar.changes[kk].skip = preMetre.plus(autoBar.changes[kk].skip).simplyfy().metre();
								project.percussions[nn].measures[ii - 1].skips.push(autoBar.changes[kk].skip);
							}
							autoBar.changes.splice(kk, 1);
							kk--;
						}
					}
				}
			}
		}
	}*/
	/*adjustLyricsPoints(project: Zvoog_Project) {
		for (let ii = 0; ii < project.timeline.length; ii++) {
			let barMetre = MMUtil().set(project.timeline[ii].metre);
			let txtBar = project.comments[ii];
			for (let kk = 0; kk < txtBar.points.length; kk++) {
				if (barMetre.less(txtBar.points[kk].skip)) {
					if (ii >= project.timeline.length) {
						this.adjustAppendBar(project);
						project.comments.push({ points: [] });
					}
					txtBar.points[kk].skip = MMUtil().set(txtBar.points[kk].skip).minus(barMetre).simplyfy().metre();
					project.comments[ii + 1].points.push(txtBar.points[kk]);

					txtBar.points.splice(kk, 1);
					kk--;
				} else {
					if (txtBar.points[kk].skip.count < 0) {
						if (ii > 0) {
							let preMetre = MMUtil().set(project.timeline[ii - 1].metre);
							txtBar.points[kk].skip = preMetre.plus(txtBar.points[kk].skip).simplyfy().metre();
							project.comments[ii - 1].points.push(txtBar.points[kk]);
						}
						txtBar.points.splice(kk, 1);
						kk--;
					}
				}
			}

		}
	}*/
	adjustContentByMeter(currentProject: Zvoog_Project) {
		for (let ii = 0; ii < currentProject.timeline.length; ii++) {
			let barMetre = MMUtil().set(currentProject.timeline[ii].metre);
			for (let nn = 0; nn < currentProject.tracks.length; nn++) {
				if (!(currentProject.tracks[nn].measures[ii])) currentProject.tracks[nn].measures[ii] = { chords: [] };
				let trackBar = currentProject.tracks[nn].measures[ii];
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					let chord = trackBar.chords[kk];
					if (barMetre.less(chord.skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							chord.skip = MMUtil().set(chord.skip).minus(barMetre).simplyfy();
							trackBar.chords.splice(kk, 1);
							kk--;
							currentProject.tracks[nn].measures[ii + 1].chords.push(chord);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(chord.skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			for (let nn = 0; nn < currentProject.percussions.length; nn++) {
				if (!(currentProject.percussions[nn].measures[ii])) currentProject.percussions[nn].measures[ii] = { skips: [] };
				let percuBar = currentProject.percussions[nn].measures[ii];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					let skip = percuBar.skips[kk];
					if (barMetre.less(skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							let newSkip = MMUtil().set(skip).minus(barMetre).simplyfy();
							percuBar.skips.splice(kk, 1);
							kk--;
							currentProject.percussions[nn].measures[ii + 1].skips.push(newSkip);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			for (let nn = 0; nn < currentProject.filters.length; nn++) {
				if (!(currentProject.filters[nn].automation[ii])) currentProject.filters[nn].automation[ii] = { changes: [] };
				let autoBar = currentProject.filters[nn].automation[ii];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					let change = autoBar.changes[kk];
					if (barMetre.less(change.skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							change.skip = MMUtil().set(change.skip).minus(barMetre).simplyfy();
							autoBar.changes.splice(kk, 1);
							kk--;
							currentProject.filters[nn].automation[ii + 1].changes.push(change);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(change.skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			if (!(currentProject.comments[ii])) currentProject.comments[ii] = { points: [] };
			let textBar = currentProject.comments[ii];
			for (let kk = 0; kk < textBar.points.length; kk++) {
				let point = textBar.points[kk];
				if (barMetre.less(point.skip)) {
					if (ii + 1 < currentProject.timeline.length) {
						point.skip = MMUtil().set(point.skip).minus(barMetre).simplyfy();
						textBar.points.splice(kk, 1);
						kk--;
						console.log();
						currentProject.comments[ii + 1].points.push(point);
					} else {
						currentProject.timeline[ii].metre = MMUtil().set(point.skip).plus({ count: 1, part: 8 }).metre();
					}
				}
			}
		}
	}
	adjustTimelineContent(project: Zvoog_Project) {
		//console.log('adjustTimelineContent');
		this.adjustTimeLineLength(project);
		this.adjustContentByMeter(project);

		//this.adjustTracksChords(project);
		this.adjustRemoveEmptyChords(project);
		//this.adjustSamplerSkips(project);
		//this.adjustAutoPoints(project);
		//this.adjustLyricsPoints(project);

		this.adjustTimeLineLength(project);
	}
}
let globalCommandDispatcher = new CommandDispatcher();
//let pluginDialogPrompt = new PluginDialogPrompt();



/*
let n120 = 120 / 60;
			let A3 = 33;
			let testingschedule: MZXBX_Schedule = {
				series: [
					{
						duration: n120, tempo: 120, items: [
							{
								skip: 0 * n120, channelId: 'anymidi1', pitches: [A3 - 0]
								, slides: [
									{ duration: 4 / 16 * n120, delta: -5 }
									, { duration: 4 / 16 * n120, delta: 0 }
									, { duration: 4 / 16 * n120, delta: 12 }
									, { duration: 4 / 16 * n120, delta: 0 }
								]
							}
							//, { skip: 1 / 4 * n120, channelId: 'anymidi1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
							//, { skip: 2 / 4 * n120, channelId: 'anymidi1', pitches: [A3 - 0], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
							//, { skip: 3 / 4 * n120, channelId: 'anymidi1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
							/*
														{ skip: 0 / 8 * n120, channelId: 'drumKick1', pitches: [0], slides: [] }
														, { skip: 1 / 8 * n120, channelId: 'drumKick1', pitches: [0], slides: [] }
														, { skip: 2 / 8 * n120, channelId: 'drumKick1', pitches: [0], slides: [] }
														, { skip: 3 / 8 * n120, channelId: 'drumKick1', pitches: [0], slides: [] }
							
														, { skip: 4 / 8 * n120, channelId: 'drumSnare1', pitches: [0], slides: [] }
														, { skip: 5 / 8 * n120, channelId: 'drumSnare1', pitches: [0], slides: [] }
														, { skip: 6 / 8 * n120, channelId: 'drumSnare1', pitches: [0], slides: [] }
														, { skip: 7 / 8 * n120, channelId: 'drumSnare1', pitches: [0], slides: [] }
														, {
															skip: 0 * n120, channelId: 'anymidi1', pitches: [A3 - 0 - 4], slides: [
																{ duration: 2 / 16 * n120, delta: 4 }
																, { duration: 2 / 16 * n120, delta: 0 }]
														}*
													], states: [
														/*{ skip: 0 / 8 * n120, filterId: 'volTest1', data: '99%' }
														, { skip: 1 / 8 * n120, filterId: 'volTest1', data: '88%' }
														, { skip: 3 / 8 * n120, filterId: 'volTest1', data: '77%' }
														, { skip: 4 / 8 * n120, filterId: 'volTest1', data: '66%' }
														, { skip: 5 / 8 * n120, filterId: 'volTest1', data: '55%' }
														, { skip: 6 / 8 * n120, filterId: 'volTest1', data: '44%' }
														, { skip: 7 / 8 * n120, filterId: 'volTest1', data: '33%' }
							*
													]
												}
												, {
													duration: n120, tempo: 120, items: [
														{ skip: 0 * n120, channelId: 'anymidi1', pitches: [A3 - 0], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
														, { skip: 1 / 4 * n120, channelId: 'anymidi1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
														, { skip: 2 / 4 * n120, channelId: 'anymidi1', pitches: [A3 - 0], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
														, { skip: 5 / 8 * n120, channelId: 'anymidi1', pitches: [A3 - 5], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
														, { skip: 6 / 8 * n120, channelId: 'anymidi1', pitches: [A3 - 4], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
														, { skip: 7 / 8 * n120, channelId: 'anymidi1', pitches: [A3 - 2], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
													], states: [
														/*{ skip: 0 / 8 * n120, filterId: 'volTest1', data: '22%' }
														, { skip: 1 / 8 * n120, filterId: 'volTest1', data: '11%' }
														, { skip: 3 / 8 * n120, filterId: 'volTest1', data: '1%' }
														, { skip: 4 / 8 * n120, filterId: 'volTest1', data: '22%' }
														, { skip: 5 / 8 * n120, filterId: 'volTest1', data: '33%' }
														, { skip: 6 / 8 * n120, filterId: 'volTest1', data: '66%' }
														, { skip: 7 / 8 * n120, filterId: 'volTest1', data: '99%' }*
													]
												}
												, { duration: n120, tempo: 120, items: [], states: [] }
												, { duration: n120, tempo: 120, items: [], states: [] }
											]
											, channels: [{
												id: 'anymidi2'
												, outputs: ['volTest1']
												, performer: {
													//id: 'test1'
													kind: 'beep1'
													, properties: 'Nope'
												}
											}, {
												id: 'drumKick1'
												, outputs: ['volTest1']
												, performer: {
													//id: 'perfKick1'
													kind: 'zdrum1'
													, properties: '35'
												}
											}, {
												id: 'drumSnare1'
												, outputs: ['volTest1']
												, performer: {
													//id: 'perfSnare1'
													kind: 'zdrum1'
													, properties: '38'
												}
											}, {
												id: 'anymidi1'
												, outputs: ['volTest1']
												, performer: {
													//id: 'instest'
													kind: 'zinstr1'
													, properties: '19'
												}
											}
							
							
											]
											, filters: [
												{
													id: 'volTest1'
													, kind: 'zvolume1'
													, properties: '66%'
													, outputs: ['']
												}
											]
										};
										//
*/