console.log('MuzXBox v1.02.001');

let midiDrumPitchShift = 35;
let midiInstrumentPitchShift = 24;
let leftGridMargin = 20;
let rightGridMargin = 1;
let topGridMargin = 10;
let bottomGridMargin = 30;
//let ocataveStart=2;
let octaveCount = 7;
let bigGroupMeasure = 16;
let us: ZUserSetting;

class MuzXBox {
	currentSchedule: ZvoogSchedule;
	zrenderer: ZRender;
	zInputDeviceHandler: ZInputDeviceHandler;
	zMainMenu: ZMainMenu;

	menuButton: TileRectangle = {
		x: 0
		, y: 0
		, w: 10
		, h: 10
		, rx: 3
		, ry: 3
		, css: 'debug'
		, action: this.testFS
		, id: 'menuButtonTest1'
	};
	constructor() {
		console.log('start');
		us = new ZUserSetting();
	}
	initAll() {
		console.log('initAll');
		//let me = this;

		this.zrenderer = new ZRender(this);
		this.zInputDeviceHandler = new ZInputDeviceHandler(this);
		this.zMainMenu = new ZMainMenu(this);
		//this.zMainMenu.menuRoot.items.push(this.itemImportMIDI);
		//this.zMainMenu.fillFrom(this.currentSchedule);
		this.zrenderer.bindLayers();
		this.zrenderer.initUI(this);
		this.createUI();

		us.selectMode('ru');
		//console.log(us.txt('testText'));
		us.selectMode('en');
		//console.log(us.txt('testText'));
		us.selectMode('wwwwwww');
		//console.log(us.txt('testText'));
		us.selectMode('en');

		this.zInputDeviceHandler.bindEvents();
	}
	createUI() {
		var emptySchedule: ZvoogSchedule = {
			title: 'Empty project'
			, tracks: [{
				title: "First", filters: [], voices: [
					{
						filters: []
						, title: 'Single'
						, performer: { performerPlugin: null, parameters: [], kind: 'none', initial: '' }
						, measureChords: [{
							chords: [{
								when: { count: 1, division: 4 }, variation: 0, envelopes: [{
									pitches: [{ duration: { count: 5, division: 8 }, pitch: 24 }, { duration: { count: 1, division: 8 }, pitch: 36 }]
								}]
							}]
						}
							, { chords: [] }
							, { chords: [] }
						]
					}
					, {
						filters: []
						, title: 'Another'
						, performer: { performerPlugin: null, parameters: [], kind: 'none', initial: '' }
						, measureChords: [
							{ chords: [] }
							, {
								chords: [{
									when: { count: 2, division: 4 }, variation: 0, envelopes: [{
										pitches: [{ duration: { count: 4, division: 8 }, pitch: 54 }]
									}]
								}]
							}
							, { chords: [] }
						]
					}
				]
			}
				, {
				title: "Second", filters: [], voices: [
					{
						filters: []
						, title: 'Another'
						, performer: { performerPlugin: null, parameters: [], kind: 'none', initial: '' }
						, measureChords: [
							{ chords: [] }
							, { chords: [] }
							, {
								chords: [{
									when: { count: 1, division: 16 }, variation: 0, envelopes: [{
										pitches: [{ duration: { count: 15, division: 16 }, pitch: 70 }]
									}]
								}]
							}
						]
					}
				]
			}
			]
			, filters: []
			, measures: [{ meter: { count: 3, division: 4 }, tempo: 120,points:[] }, { meter: { count: 4, division: 4 }, tempo: 90,points:[] }, { meter: { count: 4, division: 4 }, tempo: 180,points:[] }]
			, harmony: { tone: '', mode: '', progression: [] }
		};
		this.currentSchedule = emptySchedule;
		this.zrenderer.drawSchedule(emptySchedule);//, this.menuButton);
		this.zMainMenu.fillFrom(this.currentSchedule);
	}
	/*openMenu() {
		(document.getElementById('menuContentDiv') as any).style.visibility = 'visible';
		(document.getElementById('menuDiv1') as any).style.width = '100%';
	}
	closeMenu() {
		(document.getElementById('menuDiv1') as any).style.width = '0%';
	}*/
	changeCSS(cssHref: string, cssLinkIndex: number) {
		var oldLink = document.getElementsByTagName("link").item(cssLinkIndex);
		//console.log('oldLink',oldLink);
		if (oldLink) {
			var newLink = document.createElement("link");
			newLink.setAttribute("rel", "stylesheet");
			newLink.setAttribute("type", "text/css");
			newLink.setAttribute("href", cssHref);
			console.log('newLink', newLink);
			let headItem = document.getElementsByTagName("head").item(cssLinkIndex);
			console.log('headItem', oldLink);
			if (headItem) {
				//headItem.replaceChild(newLink, oldLink);
				headItem.appendChild(newLink);
			}
			//console.log('oldLink2',oldLink);
			//console.log('newLink2',newLink);
			//console.log('headItem2',oldLink);
			//oldLink.setAttribute("href", cssHref);
			//console.log('now oldLink',oldLink);
		}
	}
	setLayoutBig() {
		console.log('setLayoutBig');
		this.changeCSS('resources/screen_big.css', 0);
		this.zrenderer.tileLevel.setupTapSize(3);
		this.zrenderer.drawSchedule(this.currentSchedule);
		this.zMainMenu.fillFrom(this.currentSchedule);
	}
	setLayoutNormal() {
		console.log('setLayoutNormal');
		this.changeCSS('resources/screen_normal.css', 0);
		this.zrenderer.tileLevel.setupTapSize(1);
		this.zrenderer.drawSchedule(this.currentSchedule);
		this.zMainMenu.fillFrom(this.currentSchedule);
	}
	setGrid(meters: ZvoogMeter[]) {
		this.currentSchedule.rhythm = meters;
		this.zrenderer.gridRenderer.reSetGrid(this.zrenderer, meters, this.currentSchedule);
		this.zrenderer.timeLineRenderer.reSetGrid(this.zrenderer, meters, this.currentSchedule);
		this.zrenderer.tileLevel.allTilesOK = false;
		/*this.zrenderer.tileLevel.resetAnchor(this.zrenderer.gridRenderer.gridAnchor1, this.zrenderer.gridRenderer.gridLayerGroup);
		this.zrenderer.tileLevel.resetAnchor(this.zrenderer.gridRenderer.gridAnchor4, this.zrenderer.gridRenderer.gridLayerGroup);
		this.zrenderer.tileLevel.resetAnchor(this.zrenderer.gridRenderer.gridAnchor16, this.zrenderer.gridRenderer.gridLayerGroup);
		this.zrenderer.tileLevel.resetAnchor(this.zrenderer.gridRenderer.gridAnchor64, this.zrenderer.gridRenderer.gridLayerGroup);
		this.zrenderer.tileLevel.resetAnchor(this.zrenderer.gridRenderer.gridAnchor256, this.zrenderer.gridRenderer.gridLayerGroup);
		this.zrenderer.gridRenderer.drawGrid(this.zrenderer
			, this.currentSchedule
			, this.zrenderer.ratioDuration
			, this.zrenderer.ratioThickness
			, this.currentSchedule.rhythm);
		this.zrenderer.tileLevel.allTilesOK=false;
		console.log(this.zrenderer.gridRenderer.gridLayerGroup);*/
	}
	testFSmidi() {
		let test: ZvoogStore = new MIDIFileImporter();
		test.readSongData("any", function (result: ZvoogSchedule | null): void {
			if (result) {
				var me: MuzXBox = window['MZXB'] as MuzXBox;
				//console.log(me);
				if (me) {
					me.currentSchedule = result;
					me.zrenderer.drawSchedule(result);//, me.menuButton);
					me.zMainMenu.fillFrom(result);
				}
			}
		});
	}
	testFSmxml() {
		let test: ZvoogStore = new MusicXMLFileImporter();
		test.readSongData("any", function (result: ZvoogSchedule | null): void {
			if (result) {
				var me: MuzXBox = window['MZXB'] as MuzXBox;
				if (me) {
					console.log(result);
					me.currentSchedule = result;
					me.zrenderer.drawSchedule(result);//, me.menuButton);
				}
			}
		});
	}
	testFS() {
		var me: MuzXBox = window['MZXB'] as MuzXBox;
		if (me) {
			me.testFSmidi();
		}
	}
}
window['MZXB'] = new MuzXBox();

