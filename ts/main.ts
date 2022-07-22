console.log('MuzXBox v1.02.001');

let midiDrumPitchShift = 35;
let midiInstrumentPitchShift = 12;
let leftGridMargin = 20;
let rightGridMargin = 1;
let topContentMargin = 20;
let drumGridPadding = 5;
let bottomGridMargin = 110;
//let ocataveStart=2;
let octaveCount = 8;
let bigGroupMeasure = 16;
let us: ZUserSetting;

let startSlecetionMeasureIdx = -1;
let endSlecetionMeasureIdx = -1;

class MuzXBox {
	currentSchedule: ZvoogSchedule;
	zrenderer: ZRender;
	zInputDeviceHandler: ZInputDeviceHandler;
	zMainMenu: ZMainMenu;
	zTicker: ZvoogTicker;
	/*
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
		};*/
	constructor() {
		//console.log('start');
		us = new ZUserSetting();
	}
	initAll() {
		//console.log('initAll');
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

		this.zTicker = new ZvoogTicker();
	}
	createUI() {
		var emptySchedule: ZvoogSchedule = {
			title: 'Empty project'
			, tracks: [
				{
					title: "First", filters: [], percussions: [], instruments: [
						{
							filters: []
							, title: 'Single'
							, instrumentSetting: { instrumentPlugin: null, parameters: [], kind: 'none', initial: '' }
							, measureChords: [{
								chords: [
									{
										when: { count: 1, division: 4 }, variation: 0
										, envelopes: [{
											pitches: [{ duration: { count: 5, division: 8 }, pitch: 24 }
												, { duration: { count: 1, division: 8 }, pitch: 36 }]
										}]
									}
								]
							}
								, { chords: [] }
								, { chords: [] }
							]
						}
						, {
							filters: []
							, title: 'Another'
							, instrumentSetting: { instrumentPlugin: null, parameters: [], kind: 'wafinstrument', initial: '33' }
							, measureChords: [
								{
									chords: [
										{ when: { count: 0, division: 8 }, variation: 0, envelopes: [{ pitches: [
											{ duration: { count: 1, division: 4 }, pitch: 22 }
											,{ duration: { count: 0, division: 8 }, pitch: 34 }
										] }] }
										//, { when: { count: 1, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 }] }] }
										, { when: { count: 2, division: 8 }, variation: 0, envelopes: [{ pitches: [
											{ duration: { count: 1, division: 8 }, pitch: 22 }
											,{ duration: { count: 1, division: 8 }, pitch: 46 }
											,{ duration: { count: 0, division: 8 }, pitch: 34 }
										] }] }
										//, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 },{ duration: { count: 0, division: 16 }, pitch: 22 }] }] }
										//, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 }] }] }
										, { when: { count: 4, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 4 }, pitch: 22 }] }] }
										//, { when: { count: 5, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 }] }] }
									]
								}
								, {
									chords: [{ when: { count: 0, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 5 }] }] }
										, { when: { count: 1, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
										, { when: { count: 2, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 5 }] }] }
										, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
										, { when: { count: 4, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 29 }] }] }
										, { when: { count: 5, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
										, { when: { count: 6, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 5 }] }] }
										, { when: { count: 7, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
									]
								}
								, {
									chords: [
										{ when: { count: 0, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
										, { when: { count: 1, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
										, { when: { count: 2, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
										, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
										, { when: { count: 4, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
										, { when: { count: 5, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
										, { when: { count: 6, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
										, { when: { count: 7, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
									]
								}
							]
						}
					]
				}
				, {
					title: "Second", filters: [], percussions: [], instruments: [
						{
							filters: []
							, title: 'Another'
							, instrumentSetting: { instrumentPlugin: null, parameters: [], kind: 'none', initial: '' }
							, measureChords: [
								{ chords: [] }
								, { chords: [] }
								, {
									chords: [{
										when: { count: 1, division: 8 }, variation: 0, envelopes: [
											{ pitches: [{ duration: { count: 14, division: 16 }, pitch: 70 }] }
											, { pitches: [{ duration: { count: 14, division: 16 }, pitch: 77 }] }
										]
									}]
								}
							]
						}
					]
				}
			]
			, filters: [
				{
					filterPlugin: null
					, parameters: [{
						points: [
							{ skipMeasures: 0, skipSteps: { count: 0, division: 2 }, velocity: 99 }
							,{ skipMeasures: 1, skipSteps: { count: 1, division: 2 }, velocity: 22 }
							,{ skipMeasures: 0, skipSteps: { count: 1, division: 32 }, velocity: 72 }
						]
						, caption: 'test gain'
					}]
					, kind: 'gain'
					, initial: ''
				}
				/*, {
					filterPlugin: null
					, parameters: [{
						points: [
							{ skipMeasures: 0, skipSteps: { count: 1, division: 4 }, velocity: 88 }
							, { skipMeasures: 2, skipSteps: { count: 2, division: 4 }, velocity: 88 }
							, { skipMeasures: 0, skipSteps: { count: 1, division: 16 }, velocity: 22 }
							, { skipMeasures: 0, skipSteps: { count: 1, division: 16 }, velocity: 66 }
							, { skipMeasures: 1, skipSteps: { count: 1, division: 2 }, velocity: 44 }
						]
						, caption: 'another echo'
					}]
					, kind: 'echo'
					, initial: ''
				}*/
			]
			, measures: [
				{ meter: { count: 3, division: 4 }, tempo: 120, points: [] }
				, { meter: { count: 4, division: 4 }, tempo: 90, points: [] }
				, { meter: { count: 4, division: 4 }, tempo: 150, points: [] }
			]
			, harmony: { tone: '', mode: '', progression: [] }
		};
		/*for (let i = 0; i < 100; i++) {
			emptySchedule.measures.push({ meter: { count: 3, division: 4 }, tempo: 120, points: [] });
			for (let tt = 0; tt < emptySchedule.tracks.length; tt++) {
				for (let ii = 0; ii < emptySchedule.tracks[tt].instruments.length; ii++) {
					emptySchedule.tracks[tt].instruments[ii].measureChords.push({ chords: [] });
				}
				for (let pp = 0; pp < emptySchedule.tracks[tt].percussions.length; pp++) {
					emptySchedule.tracks[tt].percussions[pp].measureBunches.push({ bunches: [] });
				}
			}
		}*/
		this.currentSchedule = emptySchedule;
		this.zrenderer.drawSchedule(emptySchedule);//, this.menuButton);
		this.zMainMenu.fillSongMenuFrom(this.currentSchedule);
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
		this.zMainMenu.fillSongMenuFrom(this.currentSchedule);
	}
	setLayoutNormal() {
		console.log('setLayoutNormal');
		this.changeCSS('resources/screen_normal.css', 0);
		this.zrenderer.tileLevel.setupTapSize(1);
		this.zrenderer.drawSchedule(this.currentSchedule);
		this.zMainMenu.fillSongMenuFrom(this.currentSchedule);
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
					me.zMainMenu.fillSongMenuFrom(result);
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
					//console.log(result);
					me.currentSchedule = result;
					me.zrenderer.drawSchedule(result);//, me.menuButton);
					me.zMainMenu.fillSongMenuFrom(result);
				}
			}
		});
	}
	/*testFS() {
		var me: MuzXBox = window['MZXB'] as MuzXBox;
		if (me) {
			me.testFSmidi();
		}
	}*/
}
window['MZXB'] = new MuzXBox();

