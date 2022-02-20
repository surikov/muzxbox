console.log('MuzXBox v1.01');


//let tileLevel: TileLevel;
//let testProject: MuzXBoxProject;




let midiDrumPitchShift = 23;

class MuzXBox {
	zrenderer: ZRender;
	zInputDeviceHandler: ZInputDeviceHandler;
	//muzLoader: MuzLoader;



	menuButton: TileRectangle = {

		x: 0
		, y: 0
		, w: 10
		, h: 10
		, rx: 3
		, ry: 3
		, css: 'debug'
		//, action: this.openMenu
		, action: this.testFS
		, id: 'menuButtonTest1'
	};
	constructor() {
		console.log('start');
	}
	initAll() {
		console.log('initAll');
		let me = this;
		this.zrenderer = new ZRender();
		this.zInputDeviceHandler = new ZInputDeviceHandler();
		//this.muzLoader = new MuzLoader();

		this.zrenderer.bindLayers();
		this.zrenderer.initUI();
		this.createUI();
	}
	createUI() {
		//let testProject = this.muzLoader.createTestProject();
		//this.zrenderer.resetSong(testProject,this.menuButton,this.testChooser);
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


	testChooser(xx: number, yy) {
		console.log('testChooser', xx, yy);
	}
	openMenu() {
		//console.log('openMenu');
		(document.getElementById('menuContentDiv') as any).style.visibility = 'visible';
		(document.getElementById('menuDiv1') as any).style.width = '100%';
	}
	closeMenu() {
		//console.log('closeMenu');
		(document.getElementById('menuDiv1') as any).style.width = '0%';
	}
	testFSmidi() {
		let test: ZvoogStore = new MIDIFileImporter();
		//var me=this;
		test.readSongData("any", function (result: ZvoogSchedule | null): void {
			//console.log('testFS result', result);
			if (result) {
				var me:MuzXBox = window['MZXB'] as MuzXBox;
				console.log(me);
				if (me) {
					me.zrenderer.drawSchedule(result,me.menuButton);
				}
			}
		});
	}
	testFSmxml() {
		let test: ZvoogStore = new MusicXMLFileImporter();
		//var me=this;
		test.readSongData("any", function (result: ZvoogSchedule | null): void {
			//console.log('testFS result', result);
			if (result) {
				var me:MuzXBox = window['MZXB'] as MuzXBox;
				//console.log(me);
				if (me) {
					console.log(result);
					me.zrenderer.drawSchedule(result,me.menuButton);
				}
			}
		});
	}
	testFS() {
		var me:MuzXBox = window['MZXB'] as MuzXBox;
		if (me) {
			me.testFSmidi();
		}
	}
}
window['MZXB'] = new MuzXBox();
