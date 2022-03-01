console.log('MuzXBox v1.01');

let midiDrumPitchShift = 23;

class MuzXBox {
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
	}
	initAll() {
		console.log('initAll');
		//let me = this;
		this.zrenderer = new ZRender();
		this.zInputDeviceHandler = new ZInputDeviceHandler(this);
		this.zMainMenu = new ZMainMenu(this);
		this.zrenderer.bindLayers();
		this.zrenderer.initUI();
		this.createUI();
	}
	createUI() {
		var emptySchedule: ZvoogSchedule = {
			title: 'Empty project', tracks: []
			, filters: []
			, measures: []
			, harmony: {
				tone: ''
				, mode: ''
				, progression: []
			}
		};
		this.zrenderer.drawSchedule(emptySchedule, this.menuButton);
	}
	/*openMenu() {
		(document.getElementById('menuContentDiv') as any).style.visibility = 'visible';
		(document.getElementById('menuDiv1') as any).style.width = '100%';
	}
	closeMenu() {
		(document.getElementById('menuDiv1') as any).style.width = '0%';
	}*/
	testFSmidi() {
		let test: ZvoogStore = new MIDIFileImporter();
		test.readSongData("any", function (result: ZvoogSchedule | null): void {
			if (result) {
				var me: MuzXBox = window['MZXB'] as MuzXBox;
				console.log(me);
				if (me) {
					me.zrenderer.drawSchedule(result, me.menuButton);
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
					me.zrenderer.drawSchedule(result, me.menuButton);
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
