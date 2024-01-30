declare function newMIDIparser(arrayBuffer: ArrayBuffer): any;
declare function newGPparser(arrayBuffer: ArrayBuffer): any;
class CommandDispatcher {
	renderer: UIRenderer;
	audioContext: AudioContext;
	tapSizeRatio: number = 1;
	workData: MZXBX_Project;
	listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any) = null;
	initAudioFromUI() {
		console.log('initAudioFromUI');
		var AudioContext = window.AudioContext;// || window.webkitAudioContext;
		this.audioContext = new AudioContext();
	}
	registerWorkProject(data: MZXBX_Project) {
		this.workData = data;
	}
	registerUI(renderer: UIRenderer) {
		this.renderer = renderer;
	}
	showRightMenu() {
		let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
		let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
		this.renderer.menu.showState = !this.renderer.menu.showState;
		this.renderer.menu.resizeMenu(vw, vh);
		this.renderer.menu.resetAllAnchors();
	};
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
			startLoadCSSfile('theme/font1small.css');
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
	moveTrackTop(trackNum: number) {
		//console.log('moveTrackTop', trackNum);
		let it = this.workData.tracks[trackNum];
		this.workData.tracks.splice(trackNum, 1);
		this.workData.tracks.unshift(it);
		commandDispatcher.resetProject();
	}
	moveDrumTop(drumNum: number) {
		//console.log('moveDrumTop', drumNum);
		//console.log('moveTrackTop', trackNum);
		let it = this.workData.percussions[drumNum];
		this.workData.percussions.splice(drumNum, 1);
		this.workData.percussions.unshift(it);
		commandDispatcher.resetProject();
	}
	setTrackSoloState(state: number) {
		console.log('setTrackSoloState', state);
	}
	setDrumSoloState(state: number) {
		console.log('setDrumSoloState', state);
	}
	promptImportFromMIDI() {
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
	promptTestImport() {
		console.log('promptTestImport');
		let me = this;
		let filesinput: HTMLElement | null = document.getElementById('file_test_input');
		if (filesinput) {
			if (!(this.listener)) {
				this.listener = function (this: HTMLElement, ievent: HTMLElementEventMap['change']) {
					var file = (ievent as any).target.files[0];
					var fileReader = new FileReader();
					fileReader.onload = function (progressEvent: any) {
						if (progressEvent != null) {
							var arrayBuffer = progressEvent.target.result;
							var pp = newGPparser(arrayBuffer);
							let result: MZXBX_Project = pp.convertProject();
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
	}
}
let commandDispatcher = new CommandDispatcher();