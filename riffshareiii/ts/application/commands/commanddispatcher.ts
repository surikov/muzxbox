let uiLinkFilterToSpeaker = 'uiLinkFilterToSpeaker';
let uiLinkFilterToFilter = 'uiLinkFilterToFilter';
class CommandDispatcher {
	player: MZXBX_Player;
	renderer: UIRenderer;
	audioContext: AudioContext;
	tapSizeRatio: number = 1;
	onAir = false;
	_mixerDataMathUtility: MixerDataMathUtility;
	listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any) = null;
	exe: CommandExe = new CommandExe();
	//undoQueue: UndoRedoCommand[] = [];
	//redoQueue: UndoRedoCommand[] = [];
	cfg(): MixerDataMathUtility {
		return this._mixerDataMathUtility;
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
		console.log('initAudioFromUI');
		var AudioContext = window.AudioContext;// || window.webkitAudioContext;
		this.audioContext = new AudioContext();
		this.player = createSchedulePlayer();
	}
	registerWorkProject(data: Zvoog_Project) {
		this._mixerDataMathUtility = new MixerDataMathUtility(data);
	}
	registerUI(renderer: UIRenderer) {
		this.renderer = renderer;
	}
	showRightMenu() {
		let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
		let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
		this.cfg().data.list = true;
		this.renderer.menu.resizeMenu(vw, vh);
		this.renderer.menu.resetAllAnchors();
	};
	renderCurrentProjectForOutput(): MZXBX_Schedule {
		let forOutput: MZXBX_Schedule = {
			series: []
			, channels: []
			, filters: []
		};
		let prj: Zvoog_Project = this.cfg().data;
		for (let ff = 0; ff < prj.filters.length; ff++) {
			let filter = prj.filters[ff];
			forOutput.filters.push({
				id: filter.id
				, kind: filter.kind
				, properties: filter.dataBlob
				, outputs: filter.outputs
			});
		}
		return forOutput;
	}
	toggleStartStop() {
		console.log('toggleStartStop');
		if (this.onAir) {
			this.onAir = !this.onAir;
			this.player.cancel();
		} else {
			this.onAir = !this.onAir;
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
														}*/
						], states: [
							/*{ skip: 0 / 8 * n120, filterId: 'volTest1', data: '99%' }
							, { skip: 1 / 8 * n120, filterId: 'volTest1', data: '88%' }
							, { skip: 3 / 8 * n120, filterId: 'volTest1', data: '77%' }
							, { skip: 4 / 8 * n120, filterId: 'volTest1', data: '66%' }
							, { skip: 5 / 8 * n120, filterId: 'volTest1', data: '55%' }
							, { skip: 6 / 8 * n120, filterId: 'volTest1', data: '44%' }
							, { skip: 7 / 8 * n120, filterId: 'volTest1', data: '33%' }
*/
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
							, { skip: 7 / 8 * n120, filterId: 'volTest1', data: '99%' }*/
						]
					}
					, { duration: n120, tempo: 120, items: [], states: [] }
					, { duration: n120, tempo: 120, items: [], states: [] }
				]
				, channels: [{
					id: 'anymidi2'
					, outputs: ['volTest1']
					, performer: {
						id: 'test1'
						, kind: 'beep1'
						, properties: 'Nope'
					}
				}, {
					id: 'drumKick1'
					, outputs: ['volTest1']
					, performer: {
						id: 'perfKick1'
						, kind: 'zdrum1'
						, properties: '35'
					}
				}, {
					id: 'drumSnare1'
					, outputs: ['volTest1']
					, performer: {
						id: 'perfSnare1'
						, kind: 'zdrum1'
						, properties: '38'
					}
				}, {
					id: 'anymidi1'
					, outputs: ['volTest1']
					, performer: {
						id: 'instest'
						, kind: 'zinstr1'
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
			let me = this;
			me.player.setupPlugins(me.audioContext, testingschedule, () => {

				let msg: string = me.player.startLoop(0, 0, n120 * 2);
				if (msg) {
					this.onAir = false;
					console.log('toggleStartStop cancel', msg);
					alert('Wait for ' + msg);
				} else {
					console.log('toggleStartStop setupPlugins done');
				}
			});
		}
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
	setThemeColor(cssPath: string) {
		console.log("cssPath " + cssPath);
		startLoadCSSfile(cssPath);
		this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
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
			this.renderer.fillWholeUI();
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
	promptProjectPluginGUI(label: string, url: string, callback: (obj: Zvoog_Project) => void) {
		console.log('promptProjectPluginGUI', url);
		pluginDialogPrompt.openActionDialogFrame(label, url, callback);
	}
	promptPointPluginGUI(label: string, url: string, callback: (obj: any) => boolean) {
		console.log('promptPointPluginGUI', url);
		pluginDialogPrompt.openPointDialogFrame(label, url, 'data for testing', callback);
	}
	cancelPluginGUI() {
		console.log('cancelPluginGUI');
		pluginDialogPrompt.closeDialogFrame();
	}
	expandTimeLineSelection(idx: number) {
		console.log('select bar', idx);
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
			}
		}
		this.renderer.timeselectbar.updateTimeSelectionBar();
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup
			, this.renderer.timeselectbar.selectionAnchor
			, LevelModes.top);
	}
	doUIaction() {

	}
}
let globalCommandDispatcher = new CommandDispatcher();
let pluginDialogPrompt = new PluginDialogPrompt();
