console.log('MuzXBox v1.01');
let firstAnchor: TileAnchor;
let menuAnchor: TileAnchor;
let tileLevel: TileLevel;
//let testProject: MuzXBoxProject;

let sizeRatio = 2;

class MuzXBox {
	zInputDeviceHandler: ZInputDeviceHandler;
	muzLoader: MuzLoader;
	constructor() {
		console.log('start');
	}
	initAll() {
		console.log('initAll');
		let me = this;
		this.zInputDeviceHandler = new ZInputDeviceHandler();
		this.muzLoader = new MuzLoader();
		this.createUI();
	}
	createUI() {
		let layers: TileLayerDefinition[] = [];
		let backgroundLayerGroup: SVGElement = (document.getElementById('backgroundLayerGroup') as any) as SVGElement;
		let minZoom: number = 1;
		let maxZoom: number = 100;
		let testProject = this.muzLoader.createTestProject();


		console.log(testProject);
		firstAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
		menuAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
		layers.push({ g: backgroundLayerGroup, anchors: [firstAnchor] });
		layers.push({ g: backgroundLayerGroup, anchors: [menuAnchor] });
		tileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
			, 1000//50*time
			, 1000//testProject.tracks.length*11
			, minZoom, minZoom, maxZoom
			, layers);
		this.resetSong(testProject);


		/*
		let txt: TileText = { x: 1, y: 8, css: 'fontSize8' + ' fillColorContent', text: 'Text label' };
		firstAnchor.content.push(txt);
		let backRectangle: TileRectangle = {
			x: 0
			, y: 0
			, w: 1000
			, h: 1000
			, rx: 11
			, ry: 11
			, css: 'debug'
		};
		firstAnchor.content.push(backRectangle);
		*/
		let menuButton: TileRectangle = {
			x: 0
			, y: 0
			, w: 10
			, h: 10
			, rx: 3
			, ry: 3
			, css: 'debug'
			//, action: this.openMenu
			, action: this.testFS
		};
		firstAnchor.content.push(menuButton);
		/*
		menuAnchor.content.push({ x: 9, y: 10, w: 16, h: 11, rx: 1, ry: 1, css: 'debug', action: (x: number, y: number) => { console.log(x, y); }, dragY: true });
		menuAnchor.content.push({ x: 10, y: 11, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: () => { this.testChooser(10, 11); } });
		menuAnchor.content.push({ x: 10, y: 16, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: () => { this.testChooser(10, 16); } });
		menuAnchor.content.push({ x: 15, y: 11, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: () => { this.testChooser(15, 11); } });
		menuAnchor.content.push({ x: 15, y: 16, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: () => { this.testChooser(15, 16); } });
		menuAnchor.content.push({ x: 20, y: 11, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: () => { this.testChooser(20, 11); } });
		menuAnchor.content.push({ x: 20, y: 16, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: () => { this.testChooser(20, 16); } });
		*/
	}
	resetSong(testProject: MuzXBoxProject) {
		let time = duration2seconds(testProject.tempo, duration384(testProject.duration));
		firstAnchor.content.push({ x: 0, y: 0, w: 50 * time, h: testProject.tracks.length * 11, rx: 0.1, ry: 0.1, css: 'debug' });
		//firstAnchor.content.push({ x: 1, y: 1, w: 1, h: 1, rx: 0.1, ry: 0.1, css: 'debug', action: () => { this.testChooser(20, 16); } });
		for (let tt = 0; tt < testProject.tracks.length; tt++) {
			let track: MuzXBoxTrack = testProject.tracks[tt];
			let curPoint: ZvoogMeter = { count: 0, division: 4 };
			console.log(tt, track);
			for (let pp = 0; pp < track.patterns.length; pp++) {
				let pattern: MuzXBoxPattern = track.patterns[pp];
				curPoint = DUU(curPoint).plus(pattern.skip);
				let time = duration2seconds(testProject.tempo, duration384(curPoint));
				let sz = duration2seconds(testProject.tempo, duration384(pattern.duration));
				console.log(curPoint, time, sz, duration384(curPoint), curPoint.count, curPoint.division);
				firstAnchor.content.push({ x: 50 * time, y: tt * 11, w: 50 * sz, h: 11, rx: 0.1, ry: 0.1, css: 'debug', action: () => { this.testChooser(20, 16); } });
				curPoint = DUU(curPoint).plus(pattern.duration);

			}
		}
		tileLevel.innerWidth = 50 * time * tileLevel.tapSize;
		tileLevel.innerHeight = testProject.tracks.length * 11 * tileLevel.tapSize;
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
	testFS() {
		let test: ZvoogStore = new MIDIFileImporter();
		test.readSongData("none", function (result: ZvoogSchedule | null): void {
			console.log('result', result);
		});
	}
}
window['MuzXBox'] = new MuzXBox();
