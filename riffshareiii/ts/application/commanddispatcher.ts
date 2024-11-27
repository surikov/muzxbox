//declare function newMIDIparser(arrayBuffer: ArrayBuffer): any;
//declare function newGPparser(arrayBuffer: ArrayBuffer): any;
//declare function createSchedulePlayer(): MZXBX_Player;
class CommandDispatcher {
	player: MZXBX_Player;
	renderer: UIRenderer;
	audioContext: AudioContext;
	tapSizeRatio: number = 1;
	onAir = false;
	//currentLOadedProject: Zvoog_Project;
	_mixerDataMathUtility: MixerDataMathUtility;
	listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any) = null;
	cfg(): MixerDataMathUtility {
		return this._mixerDataMathUtility;
	}
	initAudioFromUI() {
		console.log('initAudioFromUI');
		var AudioContext = window.AudioContext;// || window.webkitAudioContext;
		this.audioContext = new AudioContext();
		this.player = createSchedulePlayer();
	}
	registerWorkProject(data: Zvoog_Project) {
		//this.currentLOadedProject = data;
		this._mixerDataMathUtility = new MixerDataMathUtility(data);
	}
	//globalCommandDispatcher.cfg().data: Zvoog_Project {
	//	return this.currentLOadedProject;
	//}
	registerUI(renderer: UIRenderer) {
		this.renderer = renderer;
	}
	showRightMenu() {
		let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
		let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
		//this.renderer.menu.showState = !this.renderer.menu.showState;
		this.cfg().data.list = true;
		this.renderer.menu.resizeMenu(vw, vh);
		this.renderer.menu.resetAllAnchors();

	};
	toggleStartStop() {
		console.log('toggleStartStop');

		if (this.onAir) {
			this.onAir = !this.onAir;
			this.player.cancel();
		} else {
			this.onAir = !this.onAir;
			let n120 = 120 / 60;
			let A3 = 33;
			let schedule: MZXBX_Schedule = {
				series: [
					{
						duration: n120, tempo: 120, items: [
							{ skip: 0 * n120, channelId: 'test1', pitches: [A3 - 0 - 4], slides: [{ duration: 2 / 16 * n120, delta: 4 }, { duration: 2 / 16 * n120, delta: 0 }] }
							, { skip: 1 / 4 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
							, { skip: 2 / 4 * n120, channelId: 'test1', pitches: [A3 - 0], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
							, { skip: 3 / 4 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
						], states: []
					}
					, {
						duration: n120, tempo: 120, items: [
							{ skip: 0 * n120, channelId: 'test1', pitches: [A3 - 0], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
							, { skip: 1 / 4 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
							, { skip: 2 / 4 * n120, channelId: 'test1', pitches: [A3 - 0], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
							, { skip: 5 / 8 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
							, { skip: 6 / 8 * n120, channelId: 'test1', pitches: [A3 - 4], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
							, { skip: 7 / 8 * n120, channelId: 'test1', pitches: [A3 - 2], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
						], states: []
					}
					, { duration: n120, tempo: 120, items: [], states: [] }
					, { duration: n120, tempo: 120, items: [], states: [] }
				]
				, channels: [{
					id: 'test1'
					, filters: []
					, performer: {
						id: 'test1'
						, kind: 'beep1'
						, properties: 'Nope'
					}
				}]
				, filters: []
			};
			let me = this;
			me.player.setupPlugins(me.audioContext, schedule, () => {
				console.log('toggleStartStop setupPlugins done');
				me.player.startLoop(0, 0, n120 * 2);
			});
		}
	}
	/*toggleLeftMenu() {
		//console.log('toggleLeftMenu');
		this.renderer.leftBar.leftHide=!this.renderer.leftBar.leftHide;
		let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
		let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
		this.renderer.leftBar.reShowLeftPanel(vw, vh);
		//this.renderer.leftBar.resetAllAnchors();
	}*/
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
		//this.renderer.menu.resetAllAnchors();
	}
	setThemeColor(cssPath: string) {
		console.log("cssPath " + cssPath);
		startLoadCSSfile(cssPath);
		this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
		//this.renderer.menu.resetAllAnchors();
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
	resetProject() {//data: MZXBX_Project) {
		//console.log('resetProject', data);
		//this.renderer.menu.readCurrentSongData(data);
		//this.registerWorkProject(data);
		this.renderer.fillWholeUI();//this.workData);
	}
	
	setTrackActive(trackNum: number) {
		for (let tt = 0; tt < this.cfg().data.tracks.length; tt++) {
			this.cfg().data.tracks[tt].active = false;
		}
		this.cfg().data.tracks[trackNum].active = true;
		this.renderer.menu.layerCurrentTitle.text = LO(localMenuTracksFolder);
		if (this.cfg().data.tracks)
			if (this.cfg().data.tracks[trackNum])
				this.renderer.menu.layerCurrentTitle.text = this.cfg().data.tracks[trackNum].title;
		this.resetProject();
		console.log('setTrackActive', trackNum, this.cfg().data.tracks);
	}
	moveTrackTop(trackNum: number) {
		console.log('moveTrackTop', trackNum);
		let it = this.cfg().data.tracks[trackNum];
		this.cfg().data.tracks.splice(trackNum, 1);
		this.cfg().data.tracks.unshift(it);
		this.upTracksLayer();
	}
	moveDrumTop(drumNum: number) {
		console.log('moveDrumTop', drumNum);
		//console.log('moveTrackTop', trackNum);
		let it = this.cfg().data.percussions[drumNum];
		this.cfg().data.percussions.splice(drumNum, 1);
		this.cfg().data.percussions.unshift(it);
		this.upDrumsLayer();
	}
	moveAutomationTop(filterNum: number) {
		console.log('moveAutomationTop', filterNum);
		this.upAutoLayer();
	}
	upTracksLayer() {
		console.log('upTracksLayer');
		//this.cfg().data.focus = 0;
		this.renderer.menu.layerCurrentTitle.text = LO(localMenuTracksFolder);
		if (this.cfg().data.tracks)
			if (this.cfg().data.tracks[0])
				this.renderer.menu.layerCurrentTitle.text = this.cfg().data.tracks[0].title;
		this.resetProject();
	}
	upDrumsLayer() {
		console.log('upDrumsLayer');
		//this.cfg().data.focus = 1;
		//this.renderer.menu.layerCurrentTitle.text = LO(localMenuPercussionFolder);
		this.resetProject();
	}
	upAutoLayer() {
		console.log('upAutoayer');
		//this.cfg().data.focus = 2;
		//this.renderer.menu.layerCurrentTitle.text = LO(localMenuAutomationFolder);
		this.resetProject();
	}
	upCommentsLayer() {
		console.log('upCommentsLayer');
		//this.cfg().data.focus = 3;
		//this.renderer.menu.layerCurrentTitle.text = LO(localMenuCommentsLayer);
		this.resetProject();
	}


	setTrackSoloState(state: number) {
		console.log('setTrackSoloState', state);
	}
	setDrumSoloState(state: number) {
		console.log('setDrumSoloState', state);
	}
	/*promptImportFromMIDI() {
		console.log('promptImportFromMIDI');
		let me = this;
		let filesinput: HTMLElement | null = document.getElementById('file_midi_input');
		if (filesinput) {
			if (!(this.listener)) {
				this.listener = function (this: HTMLElement, ievent: HTMLElementEventMap['change']) {
					//console.log('change',ievent);
					var file = (ievent as any).target.files[0];
					//console.log('file',file);
					let title: string = file.name;
					let dat = '' + file.lastModifiedDate;
					try {
						let last: Date = file.lastModifiedDate;
						dat = '' + last.getFullYear();
						if (last.getMonth() < 10) {
							dat = dat + '-' + last.getMonth();
						} else {
							dat = dat + '-0' + last.getMonth();
						}
						if (last.getDate() < 10) {
							dat = dat + '-' + last.getDate();
						} else {
							dat = dat + '-0' + last.getDate();
						}
					} catch (xx) {
						console.log(xx);
					}
					let comment: string = ', ' + file.size / 1000 + 'kb, ' + dat;
					var fileReader = new FileReader();

					fileReader.onload = function (progressEvent: any) {
						//console.log('progressEvent', progressEvent);
						if (progressEvent != null) {
							var arrayBuffer = progressEvent.target.result;
							//console.log('arrayBuffer',arrayBuffer);
							var midiParser = newMIDIparser(arrayBuffer);
							let result: MZXBX_Project = midiParser.convertProject(title, comment);
							//console.log('result',result);
							me.registerWorkProject(result);
							me.resetProject();
						}
					};
					fileReader.readAsArrayBuffer(file);
				};
				filesinput.addEventListener('change', this.listener, false);
			}
			filesinput.click();
			//console.log('setup', filesinput);
		}
	}
*/
	promptProjectPluginGUI(label: string, url: string, callback: (obj: any) => boolean) {
		console.log('promptProjectPluginGUI', url);

		let projectClone: string = JSON.stringify(this.cfg().data);
		pluginDialogPrompt.openDialogFrame(label, url, projectClone, callback);

		//let pluginFrame = document.getElementById("pluginFrame") as any;
		//if (pluginFrame) {

		//if (pluginFrame.contentWindow) {
		/*let tefunc = pluginWindow.testFunction;
		if (tefunc) {
			console.log('pluginFrame', tefunc('qqq123'));
		}*/
		//let pluginContent: Window = pluginFrame.contentWindow;
		//pluginFrame.src = url;
		//(document.getElementById("pluginDiv") as any).style.visibility = "visible";
		//console.log('pluginWindow', pluginWindow);
		/*
		pluginContent.postMessage({
			name: 'Testing messaging'
			, waitID: 'qqq123'
		}, '*');//web/test/plugin.html');
		*/
		//}
		//}
	}
	resendMessagePluginGUI() {
		pluginDialogPrompt.sendMessageToPlugin();
	}
	promptPointPluginGUI(label: string, url: string, callback: (obj: any) => boolean) {
		console.log('promptPointPluginGUI', url);
		pluginDialogPrompt.openDialogFrame(label, url, 'data for testing', callback);
	}
	cancelPluginGUI() {
		console.log('cancelPluginGUI');
		pluginDialogPrompt.closeDialogFrame();
	}
	/*promptTestImport() {
		console.log('promptTestImport');
		let me = this;
		let filesinput: HTMLElement | null = document.getElementById('file_gp35_input');
		if (filesinput) {
			if (!(this.listener)) {
				this.listener = function (this: HTMLElement, ievent: HTMLElementEventMap['change']) {
					var file = (ievent as any).target.files[0];
					var fileReader = new FileReader();
					let title: string = file.name;
					let dat = '' + file.lastModifiedDate;
					try {
						let last: Date = file.lastModifiedDate;
						dat = '' + last.getFullYear();
						if (last.getMonth() < 10) {
							dat = dat + '-' + last.getMonth();
						} else {
							dat = dat + '-0' + last.getMonth();
						}
						if (last.getDate() < 10) {
							dat = dat + '-' + last.getDate();
						} else {
							dat = dat + '-0' + last.getDate();
						}
					} catch (xx) {
						console.log(xx);
					}
					let comment: string = ', ' + file.size / 1000 + 'kb, ' + dat;
					fileReader.onload = function (progressEvent: any) {
						if (progressEvent != null) {
							var arrayBuffer = progressEvent.target.result;
							var pp = newGPparser(arrayBuffer);
							let result: MZXBX_Project = pp.convertProject(title, comment);
							me.registerWorkProject(result);
							me.resetProject();
						}
					};
					fileReader.readAsArrayBuffer(file);
				};
				filesinput.addEventListener('change', this.listener, false);
			}
			filesinput.click();
		}
	}*/
	expandTimeLineSelection(idx: number) {
		console.log('select bar', idx);
		if (this.cfg().data) {
			if (idx >= 0 && idx < this.cfg().data.timeline.length) {
				let curPro = this.cfg().data;
				if (curPro.selection) {
					let curProjectSelection: Zvoog_Selection = curPro.selection;
					if (curProjectSelection.startMeasure == curProjectSelection.endMeasure) {
						if (curProjectSelection.startMeasure == idx) {
							curPro.selection = undefined;
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
					curPro.selection = {
						startMeasure: idx
						, endMeasure: idx
					};
				}
			}
		}
		//console.log(this.workData.selection);
		this.renderer.timeselectbar.updateTimeSelectionBar();
		this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup
			, this.renderer.timeselectbar.selectionAnchor
			, LevelModes.top);
	}
}
let globalCommandDispatcher = new CommandDispatcher();
let pluginDialogPrompt = new PluginDialogPrompt();
