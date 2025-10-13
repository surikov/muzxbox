let uiLinkFilterToSpeaker = 'uiLinkFilterToSpeaker';
let uiLinkFilterToFilter = 'uiLinkFilterToFilter';
class CommandDispatcher {
	player: MZXBX_Player;
	renderer: UIRenderer;
	audioContext: AudioContext;
	tapSizeRatio: number = 1;
	//onAir = false;
	//neeToStart = false;
	playPosition = 0;
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
	initAudioFromUI() {
		//console.log('initAudioFromUI');
		var AudioContext = window.AudioContext;// || window.webkitAudioContext;
		this.audioContext = new AudioContext();
		this.player = createSchedulePlayer(this.playCallback);
	}
	registerWorkProject(data: Zvoog_Project) {
		console.log('registerWorkProject', data.menuPerformers)
		this._mixerDataMathUtility = new MixerDataMathUtility(data);
		this.adjustTimelineContent();
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
			this.stopPlay();
			this.setupAndStartPlay();
		}
	}
	toggleStartStop() {
		//console.log('toggleStartStop', this.onAir);
		if (this.player.playState().play) {
			this.stopPlay();
		} else {
			this.setupAndStartPlay();
		}
	}
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
		//console.log('setupAndStartPlay');
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
			this.renderer.warning.showWarning('Start playing', result, 'Loading...', null);
		} else {
			//this.renderer.menu.rerenderMenuContent()
		}

		this.startPlayLoop(from, this.playPosition, to);

	}
	startPlayLoop(from: number, position: number, to: number) {
		console.log('startPlayLoop', from, position, to);
		//console.log('startPlayLoop', from, position, to);
		//if (this.neeToStart) {
		//let me = this;
		//let n120 = 120 / 60;
		let msg: string = this.player.startLoopTicks(from, position, to);
		if (msg) {
			//me.onAir = false;
			console.log('startPlayLoop', msg, this.renderer.warning.noWarning);
			//console.log('startPlayLoop', msg, this.renderer.warning.noWarning);
			/*if (this.renderer.warning.noWarning) {
				//
			} else {
				let me = this;
				let id = setTimeout(() => {
					me.startPlayLoop(from, position, to);
				}, 1000);
				console.log('setTimeout',id);
			}*/

			this.renderer.warning.showWarning('Start playing', 'Loading...', '' + msg//,null);
				, () => {
					console.log('cancel wait start loop');
				});

			let me = this;
			let id = setTimeout(() => {
				if (!me.renderer.warning.noWarning) {
					me.startPlayLoop(from, position, to);
				}

			}, 1000);

			//console.log('wait',id);
		} else {
			//console.log('startPlayLoop done', from, position, to, me.player.playState());
			//me.neeToStart = false;
			this.renderer.warning.hideWarning();
			this.setVisibleTimeMark();
			this.renderer.menu.rerenderMenuContent(null);
			this.resetProject();
			//console.log('startPlayLoop done', from, position, to, me.player.playState());
		}
		//}
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
			globalCommandDispatcher.adjustTimelineContent();
		});
		this.resetProject();
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
	makeTileSVGsquareCanvas(canvasSize: number, onDoneCanvas: (canvas: HTMLCanvasElement) => void): void {
		console.log('makeTileSVGsquareCanvas', canvasSize);
		this.hideMenuByStyle();
		let tileLevelSVG: HTMLElement = document.getElementById('tileLevelSVG') as HTMLElement;
		let xml: string = encodeURIComponent(tileLevelSVG.outerHTML);
		let replaceText = '%3C!--%20css%20--%3E';//<!-- css -->;
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
			onDoneCanvas(canvas);
		};
		svgImg.src = url;
		this.showMenuByStyle();
	}
	copySelectedBars() {
		console.log('copySelectedBars');
		//https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg
		globalCommandDispatcher.makeTileSVGsquareCanvas(300, (canvas: HTMLCanvasElement) => {
			globalCommandDispatcher.exportCanvasAsFile(canvas, 'testCanvasSVG.png');
		});
	}
	copySelectedBars222() {
		console.log('copySelectedBars');
		let tileLevelSVG: HTMLElement = document.getElementById('tileLevelSVG') as HTMLElement;
		let xml: string = encodeURIComponent(tileLevelSVG.outerHTML);

		let replaceText = '%3C!--%20css%20--%3E';//<!-- css -->;
		//xml=xml.replace(replaceText,'%3C!--%20donestyle%20--%3E');
		xml = xml.replace(replaceText, wholeCSSstring);
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
	mergeSelectedBars() {
		let startMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
		let endMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
		if (startMeasure > -1 && endMeasure >= startMeasure) {
			globalCommandDispatcher.exe.commitProjectChanges([], () => {
				globalCommandDispatcher.adjustTimelineContent();
				let newDuration = MMUtil().set(globalCommandDispatcher.cfg().data.timeline[startMeasure].metre);
				for (let ii = startMeasure + 1; ii <= endMeasure; ii++) {
					//console.log('check', ii, newDuration);
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
						let trackBar = globalCommandDispatcher.cfg().data.tracks[nn].measures[ii];
						let trackPreBar = globalCommandDispatcher.cfg().data.tracks[nn].measures[ii - 1];
						for (let kk = 0; kk < trackBar.chords.length; kk++) {
							//console.log('setup chord', kk, newDuration, JSON.stringify(trackBar.chords[kk].skip));
							trackBar.chords[kk].skip = newDuration.plus(trackBar.chords[kk].skip).metre();
							trackPreBar.chords.push(trackBar.chords[kk]);
							//console.log('result', JSON.stringify(trackBar.chords[kk].skip));
						}
						trackBar.chords = [];
					}
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
						let percuBar = globalCommandDispatcher.cfg().data.percussions[nn].measures[ii];
						let percuPreBar = globalCommandDispatcher.cfg().data.percussions[nn].measures[ii - 1];
						for (let kk = 0; kk < percuBar.skips.length; kk++) {
							percuBar.skips[kk] = newDuration.plus(percuBar.skips[kk]).metre();
							percuPreBar.skips.push(percuBar.skips[kk]);
						}
						percuBar.skips = [];
					}
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
						let autoBar = globalCommandDispatcher.cfg().data.filters[nn].automation[ii];
						let autoPreBar = globalCommandDispatcher.cfg().data.filters[nn].automation[ii - 1];
						for (let kk = 0; kk < autoBar.changes.length; kk++) {
							autoBar.changes[kk].skip = newDuration.plus(autoBar.changes[kk].skip).metre();
							autoPreBar.changes.push(autoBar.changes[kk]);
						}
						autoBar.changes = [];
					}
					let txtBar = globalCommandDispatcher.cfg().data.comments[ii];
					let txtPreBar = globalCommandDispatcher.cfg().data.comments[ii - 1];
					for (let kk = 0; kk < txtBar.points.length; kk++) {
						txtBar.points[kk].skip = newDuration.plus(txtBar.points[kk].skip).metre();
						txtPreBar.points.push(txtBar.points[kk]);
					}
					txtBar.points = [];
					newDuration = newDuration.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre);
				}
				//globalCommandDispatcher.cfg().data.timeline.splice(startMeasure + 1, endMeasure - startMeasure);
				globalCommandDispatcher.cfg().data.timeline[startMeasure].metre = newDuration.metre();
				//console.log(startMeasure, globalCommandDispatcher.cfg().data.timeline[startMeasure].metre);
				globalCommandDispatcher.adjustTimelineContent();
				globalCommandDispatcher.cfg().data.selectedPart.endMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;

			});
			globalCommandDispatcher.resetProject();
			//console.log(globalCommandDispatcher.cfg().data);
		}
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

	dropSelectedBars() {
		let startMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
		let endMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
		let count = endMeasure - startMeasure + 1;
		if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
			count = globalCommandDispatcher.cfg().data.timeline.length - 1;
		}
		if (startMeasure > -1 && count > 0) {
			console.log('start delete', startMeasure, endMeasure, globalCommandDispatcher.cfg().data.timeline.length);
			globalCommandDispatcher.exe.commitProjectChanges([], () => {
				globalCommandDispatcher.adjustTimelineContent();
				for (let ii = 0; ii < count; ii++) {
					globalCommandDispatcher.cfg().data.timeline.splice(startMeasure, 1);
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
						let track = globalCommandDispatcher.cfg().data.tracks[nn];
						track.measures.splice(startMeasure, 1);
					}
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
						let percu = globalCommandDispatcher.cfg().data.percussions[nn];
						percu.measures.splice(startMeasure, 1);
					}
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
						let filter = globalCommandDispatcher.cfg().data.filters[nn];
						filter.automation.splice(startMeasure, 1);
					}
					globalCommandDispatcher.cfg().data.comments.splice(startMeasure, 1);
				}
				globalCommandDispatcher.adjustTimelineContent();
				globalCommandDispatcher.cfg().data.selectedPart.startMeasure = -1;
				globalCommandDispatcher.cfg().data.selectedPart.endMeasure = -1;

			});
			globalCommandDispatcher.resetProject();
			console.log('end delete', startMeasure, endMeasure, globalCommandDispatcher.cfg().data.timeline.length);
		}


	}
	/*
		align16forSelection() {
			console.log('align16forSelection');
			let startMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
			let endMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
			let count = endMeasure - startMeasure + 1;
			if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
				count = globalCommandDispatcher.cfg().data.timeline.length - 1;
			}
			if (startMeasure > -1 && count > 0) {
				globalCommandDispatcher.exe.commitProjectChanges([], () => {
					globalCommandDispatcher.adjustTimelineContent();
					for (let ii = 0; ii < count; ii++) {
						for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
							let trackMeasure = globalCommandDispatcher.cfg().data.tracks[nn].measures[startMeasure + ii];
							for (let ch = 0; ch < trackMeasure.chords.length; ch++) {
								trackMeasure.chords[ch].skip = MMUtil().set(trackMeasure.chords[ch].skip).strip(16).metre();
							}
						}
						for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
							let percuBar = globalCommandDispatcher.cfg().data.percussions[nn].measures[startMeasure + ii];
							for (let ch = 0; ch < percuBar.skips.length; ch++) {
								let adjusted = MMUtil().set(percuBar.skips[ch]).strip(16).metre();
								percuBar.skips[ch].count = adjusted.count;
								percuBar.skips[ch].part = adjusted.part;
							}
						}
						for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
							let autoBar = globalCommandDispatcher.cfg().data.filters[nn].automation[startMeasure + ii];
							for (let ch = 0; ch < autoBar.changes.length; ch++) {
								let adjusted = MMUtil().set(autoBar.changes[ch].skip).strip(16).metre();
								autoBar.changes[ch].skip.count = adjusted.count;
								autoBar.changes[ch].skip.part = adjusted.part;
							}
						}
						let txtBar = globalCommandDispatcher.cfg().data.comments[startMeasure + ii];
						for (let ch = 0; ch < txtBar.points.length; ch++) {
							let adjusted = MMUtil().set(txtBar.points[ch].skip).strip(16).metre();
							//console.log(txtBar.points[ch].text,JSON.stringify(txtBar.points[ch].skip),JSON.stringify(adjusted));
							txtBar.points[ch].skip.count = adjusted.count;
							txtBar.points[ch].skip.part = adjusted.part;
						}
					}
					globalCommandDispatcher.adjustTimelineContent();
				});
				globalCommandDispatcher.resetProject();
			}
		}*/
	insertAfterSelectedBars() {
		let startMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
		let endMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
		let count = endMeasure - startMeasure + 1;
		if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
			count = globalCommandDispatcher.cfg().data.timeline.length - 1;
		}
		if (startMeasure > -1 && count > 0) {
			globalCommandDispatcher.exe.commitProjectChanges([], () => {
				globalCommandDispatcher.adjustTimelineContent();
				for (let ii = 0; ii < count; ii++) {
					let fromBar = globalCommandDispatcher.cfg().data.timeline[startMeasure + ii];
					globalCommandDispatcher.cfg().data.timeline.splice(startMeasure + count + ii, 0, {
						tempo: fromBar.tempo
						, metre: { count: fromBar.metre.count, part: fromBar.metre.part }
					});
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
						let track = globalCommandDispatcher.cfg().data.tracks[nn];
						track.measures.splice(startMeasure + count + ii, 0, { chords: [] });
					}
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
						let percu = globalCommandDispatcher.cfg().data.percussions[nn];
						percu.measures.splice(startMeasure + count + ii, 0, { skips: [] });
					}
					for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
						let filter = globalCommandDispatcher.cfg().data.filters[nn];
						filter.automation.splice(startMeasure + count + ii, 0, { changes: [] });
					}
					globalCommandDispatcher.cfg().data.comments.splice(startMeasure + count + ii, 0, { points: [] });
				}
				globalCommandDispatcher.adjustTimelineContent();
				globalCommandDispatcher.cfg().data.selectedPart.endMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure + count * 2 - 1;

			});
			globalCommandDispatcher.resetProject();
		}
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
						globalCommandDispatcher.adjustTimelineContent();
						for (let ii = 0; ii < count; ii++) {
							globalCommandDispatcher.cfg().data.timeline[startMeasure + ii].tempo = newTempo;
							//console.log(ii, globalCommandDispatcher.cfg().data.timeline[ii]);
						}
						globalCommandDispatcher.adjustTimelineContent();
					});
					globalCommandDispatcher.resetProject();
					//console.log(globalCommandDispatcher.cfg().data);
				}
			}
		}
	}
	promptMeterForSelectedBars() {
		let startMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
		let endMeasure: number = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
		let count = endMeasure - startMeasure + 1;
		if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
			count = globalCommandDispatcher.cfg().data.timeline.length - 1;
		}
		if (startMeasure > -1 && count > 0) {
			let oldMeter = '' + globalCommandDispatcher.cfg().data.timeline[startMeasure].metre.count + '/' + globalCommandDispatcher.cfg().data.timeline[startMeasure].metre.part;
			let txt = prompt('Metre', '' + oldMeter);

			if (txt) {
				let newpart = parseInt(txt.split('/')[1]);
				let newcount = parseInt(txt.split('/')[0]);
				if (newpart == 1 || newpart == 2 || newpart == 4 || newpart == 8 || newpart == 16 || newpart == 32) {
					let newMeter = MMUtil().set({ count: newcount, part: newpart });
					globalCommandDispatcher.exe.commitProjectChanges([], () => {
						globalCommandDispatcher.adjustTimelineContent();
						for (let ii = 0; ii < count; ii++) {
							let bar = globalCommandDispatcher.cfg().data.timeline[startMeasure + ii];
							//console.log(startMeasure + ii,bar.metre , newMeter);

							if (newMeter.less(bar.metre)) {
								globalCommandDispatcher.cfg().data.timeline.splice(startMeasure + ii + 1, 0
									, {
										tempo: bar.tempo
										, metre: MMUtil().set(bar.metre).minus(newMeter).metre()
									});
								for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
									let track = globalCommandDispatcher.cfg().data.tracks[nn];
									track.measures.splice(startMeasure + ii + 1, 0, { chords: [] });
								}
								for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
									let percu = globalCommandDispatcher.cfg().data.percussions[nn];
									percu.measures.splice(startMeasure + ii + 1, 0, { skips: [] });
								}
								for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
									let filter = globalCommandDispatcher.cfg().data.filters[nn];
									filter.automation.splice(startMeasure + ii + 1, 0, { changes: [] });
								}
								globalCommandDispatcher.cfg().data.comments.splice(startMeasure + ii + 1, 0, { points: [] });
								ii++;
								globalCommandDispatcher.cfg().data.selectedPart.endMeasure++;
							}
							//console.log(ii, globalCommandDispatcher.cfg().data.timeline[ii]);
							bar.metre = newMeter.metre();
						}
						globalCommandDispatcher.adjustTimelineContent();
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
	adjustTimeLineLength() {
		console.log('adjustTimeLineLength');
		if (this.cfg().data.timeline.length > 1) {
			if (!(this.cfg().data.timeline[this.cfg().data.timeline.length - 1])) {
				this.cfg().data.timeline.length = this.cfg().data.timeline.length - 1;
			}
		}
		if (this.cfg().data.timeline.length > 1) {
			if (!(this.cfg().data.timeline[this.cfg().data.timeline.length - 1])) {
				this.cfg().data.timeline.length = this.cfg().data.timeline.length - 1;
			}
		}
		if (this.cfg().data.timeline.length > 1) {
			if (!(this.cfg().data.timeline[this.cfg().data.timeline.length - 1])) {
				this.cfg().data.timeline.length = this.cfg().data.timeline.length - 1;
			}
		}
		for (let tt = 0; tt < this.cfg().data.timeline.length; tt++) {
			for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
				let track = this.cfg().data.tracks[nn];
				if (!(track.measures[tt])) {
					track.measures[tt] = { chords: [] };
				}
			}
			for (let nn = 0; nn < this.cfg().data.percussions.length; nn++) {
				let percu = this.cfg().data.percussions[nn];
				if (!(percu.measures[tt])) {
					percu.measures[tt] = { skips: [] };
				}
			}
			for (let nn = 0; nn < this.cfg().data.filters.length; nn++) {
				let filter = this.cfg().data.filters[nn];
				if (!(filter.automation[tt])) {
					filter.automation[tt] = { changes: [] };
				}
			}
			if (!(this.cfg().data.comments[tt])) {
				this.cfg().data.comments[tt] = { points: [] };
			}
		}
		for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
			this.cfg().data.tracks[nn].measures.length = this.cfg().data.timeline.length;
		}
		for (let nn = 0; nn < this.cfg().data.percussions.length; nn++) {
			this.cfg().data.percussions[nn].measures.length = this.cfg().data.timeline.length;
		}
		for (let nn = 0; nn < this.cfg().data.filters.length; nn++) {
			this.cfg().data.filters[nn].automation.length = this.cfg().data.timeline.length;
		}
		this.cfg().data.comments.length = this.cfg().data.timeline.length;
	}
	adjustRemoveEmptyChords() {
		for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
			let track = this.cfg().data.tracks[nn];
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
	appendBar() {
		this.cfg().data.timeline.push({
			tempo: this.cfg().data.timeline[this.cfg().data.timeline.length - 1].tempo
			, metre: {
				count: this.cfg().data.timeline[this.cfg().data.timeline.length - 1].metre.count
				, part: this.cfg().data.timeline[this.cfg().data.timeline.length - 1].metre.part
			}
		});
		this.adjustTimeLineLength();
	}
	adjustMergeChordByTime(trackBar: Zvoog_TrackMeasure) {
		let merged: Zvoog_Chord[] = [];
		for (let kk = 0; kk < trackBar.chords.length; kk++) {
			let checkChord: Zvoog_Chord = trackBar.chords[kk];
			let xsts = false;
			for (let mm = 0; mm < merged.length; mm++) {
				let existedChord: Zvoog_Chord = merged[mm];
				if (MMUtil().set(existedChord.skip).equals(checkChord.skip)) {
					xsts = true;
					//console.log(kk, mm, checkChord.skip, checkChord.pitches.length, '->', existedChord.skip, existedChord.pitches.length);
					let pitchcount = checkChord.pitches.length;
					for (let pp = 0; pp < pitchcount; pp++) {
						let pitch = checkChord.pitches[pp];
						existedChord.pitches.push(pitch);
					}
					break;
				}
			}
			if (!xsts) {
				merged.push(checkChord);
			}
		}
		//trackBar.chords = merged;
	}
	adjustTracksChords() {
		//console.log('adjustTracksChords');
		for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
			//console.log('track',nn,this.cfg().data.tracks[nn]);
			for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
				let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
				let trackBar = this.cfg().data.tracks[nn].measures[ii];
				//console.log('--metre',ii,barMetre);
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					let chord = trackBar.chords[kk];
					//console.log('----chord',kk,chord);
					if (barMetre.less(chord.skip)) {
						//console.log('------less');
						if (ii >= this.cfg().data.timeline.length) {
							//this.appendBar();
						}
						chord.skip = MMUtil().set(chord.skip).minus(barMetre).simplyfy().metre();
						this.cfg().data.tracks[nn].measures[ii + 1].chords.push(chord);
						trackBar.chords.splice(kk, 1);
						kk--;
					} else {
						if (chord.skip.count < 0) {
							if (ii > 0) {
								let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
								chord.skip = preMetre.plus(chord.skip).simplyfy().metre();
								this.cfg().data.tracks[nn].measures[ii - 1].chords.push(chord);
							}
							trackBar.chords.splice(kk, 1);
							kk--;
						}
					}
				}
			}
		}
		for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
			for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
				let trackBar = this.cfg().data.tracks[nn].measures[ii];
				this.adjustMergeChordByTime(trackBar);
			}
		}
	}
	adjustSamplerSkips() {
		for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
			let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
			for (let nn = 0; nn < this.cfg().data.percussions.length; nn++) {
				let percuBar = this.cfg().data.percussions[nn].measures[ii];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					if (barMetre.less(percuBar.skips[kk])) {
						if (ii >= this.cfg().data.timeline.length) {
							this.appendBar();
							this.cfg().data.percussions[nn].measures.push({ skips: [] });
						}
						percuBar.skips[kk] = MMUtil().set(percuBar.skips[kk]).minus(barMetre).simplyfy();
						this.cfg().data.percussions[nn].measures[ii + 1].skips.push(percuBar.skips[kk]);

						percuBar.skips.splice(kk, 1);
						kk--;
					} else {
						if (percuBar.skips[kk].count < 0) {
							if (ii > 0) {
								let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
								percuBar.skips[kk] = preMetre.plus(percuBar.skips[kk]).simplyfy();
								this.cfg().data.percussions[nn].measures[ii - 1].skips.push(percuBar.skips[kk]);
							}
							percuBar.skips.splice(kk, 1);
							kk--;
						}
					}
				}
			}
		}
	}
	adjustAutoPoints() {
		for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
			let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
			for (let nn = 0; nn < this.cfg().data.filters.length; nn++) {
				let autoBar = this.cfg().data.filters[nn].automation[ii];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					if (barMetre.less(autoBar.changes[kk].skip)) {
						if (ii >= this.cfg().data.timeline.length) {
							this.appendBar();
							this.cfg().data.filters[nn].automation.push({ changes: [] });
						}
						autoBar.changes[kk].skip = MMUtil().set(autoBar.changes[kk].skip).minus(barMetre).simplyfy().metre();
						this.cfg().data.percussions[nn].measures[ii + 1].skips.push(autoBar.changes[kk].skip);
						autoBar.changes.splice(kk, 1);
						kk--;
					} else {
						if (autoBar.changes[kk].skip.count < 0) {
							if (ii > 0) {
								let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
								autoBar.changes[kk].skip = preMetre.plus(autoBar.changes[kk].skip).simplyfy().metre();
								this.cfg().data.percussions[nn].measures[ii - 1].skips.push(autoBar.changes[kk].skip);
							}
							autoBar.changes.splice(kk, 1);
							kk--;
						}
					}
				}
			}
		}
	}
	adjustLyricsPoints() {
		for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
			let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
			let txtBar = this.cfg().data.comments[ii];
			for (let kk = 0; kk < txtBar.points.length; kk++) {
				if (barMetre.less(txtBar.points[kk].skip)) {
					if (ii >= this.cfg().data.timeline.length) {
						this.appendBar();
						this.cfg().data.comments.push({ points: [] });
					}
					txtBar.points[kk].skip = MMUtil().set(txtBar.points[kk].skip).minus(barMetre).simplyfy().metre();
					this.cfg().data.comments[ii + 1].points.push(txtBar.points[kk]);

					txtBar.points.splice(kk, 1);
					kk--;
				} else {
					if (txtBar.points[kk].skip.count < 0) {
						if (ii > 0) {
							let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
							txtBar.points[kk].skip = preMetre.plus(txtBar.points[kk].skip).simplyfy().metre();
							this.cfg().data.comments[ii - 1].points.push(txtBar.points[kk]);
						}
						txtBar.points.splice(kk, 1);
						kk--;
					}
				}
			}

		}
	}
	adjustTimelineContent() {
		//console.log('adjustTimelineContent');
		this.adjustTimeLineLength();
		this.adjustRemoveEmptyChords();
		this.adjustTracksChords();
		this.adjustSamplerSkips();
		this.adjustAutoPoints();
		this.adjustLyricsPoints();
		this.adjustTimeLineLength();
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