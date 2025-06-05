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
	undoQueue: Zvoog_UICommand[] = [];
	redoQueue: Zvoog_UICommand[] = [];
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
	undo(): Zvoog_UICommand[] {
		return this.undoQueue;
	}
	redo(): Zvoog_UICommand[] {
		return this.redoQueue;
	}
	clearUndo() {
		this.undoQueue = [];
	}
	clearRedo() {
		this.redoQueue = [];
	}
	reDrawPlayPosition() {
		let ww = this.renderer.timeselectbar.positionMarkWidth();
		let xx = this.cfg().leftPad + this.playPosition * this.cfg().widthDurationRatio - ww;
		this.renderer.timeselectbar.positionTimeAnchor.translation = { x: xx, y: 0 };
		this.renderer.timeselectbar.positionTimeMark.w = ww;
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.positionTimeSVGGroup
			, this.renderer.timeselectbar.positionTimeAnchor, LevelModes.normal);
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
		this._mixerDataMathUtility = new MixerDataMathUtility(data);

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
		//console.log('after setupPlugins');
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
		//if (this.neeToStart) {
		//let me = this;
		//let n120 = 120 / 60;
		let msg: string = this.player.startLoopTicks(from, position, to);
		if (msg) {
			//me.onAir = false;
			console.log('startPlayLoop', msg, this.renderer.warning.noWarning);
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

			this.renderer.menu.rerenderMenuContent(null);
			this.resetProject();
			//console.log('startPlayLoop done', from, position, to, me.player.playState());
		}
		//}
	}
	setThemeLocale(loc: string, ratio: number) {
		console.log("setThemeLocale " + loc);
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
	}
	setThemeColor(idx: string) {//cssPath: string) {
		let cssPath: string = 'theme/colordarkblue.css';
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

		//console.log("cssPath " + cssPath);
		startLoadCSSfile(cssPath);
		this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
		saveText2localStorage('uicolortheme', idx);
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
	resetProject() {
		try {
			/*
						if (this.cfg().data.tracks)
							if (this.cfg().data.tracks[0])
								this.renderer.menu.layerCurrentTitle.text = this.cfg().data.tracks[0].title;
			*/
			//this.adjustTimeline();
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
		if (this.cfg().data.selectedPart.startMeasure >= 0) {
			this.playPosition = 0;
			for (let mm = 0; mm < this.cfg().data.selectedPart.startMeasure; mm++) {
				let measure: Zvoog_SongMeasure = this.cfg().data.timeline[mm];
				let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
				this.playPosition = this.playPosition + cuDuration;
			}
		}
		this.renderer.timeselectbar.updateTimeSelectionBar();
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup
			, this.renderer.timeselectbar.selectionAnchor
			, LevelModes.top);
		this.reDrawPlayPosition();

	}
	adjustTimelineChords() {
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
				//this.cfg().data.comments[tt][tt] = { changes: [] };
				this.cfg().data.comments[tt] = { points: [] };
			}
		}
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