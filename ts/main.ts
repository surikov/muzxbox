console.log('MuzXBox v1.01');
let debugAnchor0: TileAnchor;
let debugAnchor1: TileAnchor;
let debugAnchor4: TileAnchor;
let debugAnchor16: TileAnchor;
let debugAnchor64: TileAnchor;
let debugAnchor256: TileAnchor;
let measuresAnchor1: TileAnchor;
let measuresAnchor4: TileAnchor;
let measuresAnchor16: TileAnchor;
let measuresAnchor64: TileAnchor;
let measuresAnchor256: TileAnchor;
//let menuAnchor: TileAnchor;
let tileLevel: TileLevel;
//let testProject: MuzXBoxProject;
let ratioDuration = 100;
let ratioThickness = 3;

let sizeRatio = 2;

class MuzXBox {
	zInputDeviceHandler: ZInputDeviceHandler;
	muzLoader: MuzLoader;
	zoomMin: number = 1;
	zoomNote: number = 4;
	zoomMeasure: number = 16;
	zoomSong: number = 64;
	zoomFar: number = 256;
	zoomMax: number = 10000;
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
	};
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
		let gridLayerGroup: SVGElement = (document.getElementById('gridLayerGroup') as any) as SVGElement;
		let otherContentLayerGroup: SVGElement = (document.getElementById('otherContentLayerGroup') as any) as SVGElement;
		let subContentLayerGroup: SVGElement = (document.getElementById('subContentLayerGroup') as any) as SVGElement;
		let activeContentLayerGroup: SVGElement = (document.getElementById('activeContentLayerGroup') as any) as SVGElement;
		let foregroundLayerGroup: SVGElement = (document.getElementById('foregroundLayerGroup') as any) as SVGElement;

		let testProject = this.muzLoader.createTestProject();


		//console.log(testProject);
		debugAnchor0 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomMax + 1, content: [] };
		debugAnchor1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		debugAnchor4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		debugAnchor16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		debugAnchor64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		debugAnchor256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };

		measuresAnchor1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		measuresAnchor4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		measuresAnchor16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		measuresAnchor64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		measuresAnchor256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
		//debugAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomMax + 1, content: [] };
		//menuAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
		layers.push({ g: foregroundLayerGroup, anchors: [debugAnchor1, debugAnchor4, debugAnchor16, debugAnchor64, debugAnchor256, debugAnchor0] });
		let measureGroup:TileLayerStickBottom={ g: gridLayerGroup, stickBottom:0,anchors: [measuresAnchor1, measuresAnchor4, measuresAnchor16, measuresAnchor64, measuresAnchor256] };
		layers.push(measureGroup);
		//layers.push({ g: foregroundLayerGroup, anchors: [debugAnchor4] });
		//layers.push({ g: foregroundLayerGroup, anchors: [debugAnchor16] });
		//layers.push({ g: foregroundLayerGroup, anchors: [debugAnchor64] });
		//layers.push({ g: foregroundLayerGroup, anchors: [debugAnchor256] });
		//layers.push({ g: backgroundLayerGroup, anchors: [menuAnchor] });
		tileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
			, 1000//50*time
			, 1000//testProject.tracks.length*11
			, this.zoomMin, this.zoomMin, this.zoomMax
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
		/*this.menuButton = {
			x: 0
			, y: 0
			, w: 10
			, h: 10
			, rx: 3
			, ry: 3
			, css: 'debug'
			//, action: this.openMenu
			, action: this.testFS
		};*/

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
		//let time = duration2seconds(testProject.tempo, duration384(testProject.duration));
		let time = meter2seconds(testProject.tempo, testProject.duration);
		debugAnchor1.content.push({ x: 0, y: 0, w: 50 * time, h: testProject.tracks.length * 11, rx: 0.1, ry: 0.1, css: 'debug' });
		//firstAnchor.content.push({ x: 1, y: 1, w: 1, h: 1, rx: 0.1, ry: 0.1, css: 'debug', action: () => { this.testChooser(20, 16); } });
		for (let tt = 0; tt < testProject.tracks.length; tt++) {
			let track: MuzXBoxTrack = testProject.tracks[tt];
			let curPoint: ZvoogMeter = { count: 0, division: 4 };
			//console.log(tt, track);
			for (let pp = 0; pp < track.patterns.length; pp++) {
				let pattern: MuzXBoxPattern = track.patterns[pp];
				curPoint = DUU(curPoint).plus(pattern.skip);
				let time = meter2seconds(testProject.tempo, curPoint);
				let sz = meter2seconds(testProject.tempo, pattern.duration);
				//console.log(curPoint, time, sz, duration384(curPoint), curPoint.count, curPoint.division);
				debugAnchor1.content.push({ x: 50 * time, y: tt * 11, w: 50 * sz, h: 11, rx: 0.1, ry: 0.1, css: 'debug', action: () => { this.testChooser(20, 16); } });
				curPoint = DUU(curPoint).plus(pattern.duration);

			}
		}
		debugAnchor1.content.push(this.menuButton);

		/*
		debugAnchor1.content.push({ x: 0 , y: 0 , w: 1 , h: 1 , rx: 0.5 , ry: 0.5 , css: 'debug' });
		debugAnchor1.content.push({ x:0, y: 0.25, css: 'textSize025 debug', text: 'test label 1/4' });
		debugAnchor1.content.push({ x:0, y: 0.5, css: 'textSize05 debug', text: 'test label 1/2' });
		debugAnchor1.content.push({ x:0, y: 1, css: 'textSize1 debug', text: 'test label 1' });
		debugAnchor1.content.push({ x:0, y: 2, css: 'textSize2 debug', text: 'test label 2' });
		
		debugAnchor4.content.push({ x: 0 , y: 0 , w: 4 , h: 4 , rx: 2 , ry: 2 , css: 'debug' });
		debugAnchor4.content.push({ x:0, y: 4, css: 'textSize4 debug', text: 'test label 4' });
		debugAnchor4.content.push({ x:0, y: 8, css: 'textSize8 debug', text: 'test label 8' });
		
		debugAnchor16.content.push({ x: 0 , y: 0 , w: 16 , h: 16 , rx: 8 , ry: 8 , css: 'debug' });
		debugAnchor16.content.push({ x:0, y: 16, css: 'textSize16 debug', text: 'test label 16' });
		debugAnchor16.content.push({ x:0, y: 32, css: 'textSize32 debug', text: 'test label 32' });
		
		debugAnchor64.content.push({ x: 0 , y: 0 , w: 64 , h: 64 , rx: 32 , ry: 32 , css: 'debug' });
		debugAnchor64.content.push({ x:0, y: 64, css: 'textSize64 debug', text: 'test label 64' });
		debugAnchor64.content.push({ x:0, y: 128, css: 'textSize128 debug', text: 'test label 128' });
		
		debugAnchor256.content.push({ x: 0 , y: 0 , w: 256 , h: 256 , rx: 128 , ry: 128 , css: 'debug' });
		debugAnchor256.content.push({ x:0, y: 256, css: 'textSize256 debug', text: 'test label 256' });
		*/

		tileLevel.innerWidth = 50 * time * tileLevel.tapSize;
		tileLevel.innerHeight = testProject.tracks.length * 11 * tileLevel.tapSize;
	}
	clearSingleAnchor(anchor: TileAnchor, songDuration: number) {
		anchor.content.length = 0;
		anchor.ww = ratioDuration * songDuration;
		anchor.hh = 128 * ratioThickness;
	}
	clearAnchorsContent(songDuration: number): void {
		var anchors: TileAnchor[] = [debugAnchor0, debugAnchor1, debugAnchor4, debugAnchor16, debugAnchor64, debugAnchor256
			, measuresAnchor1, measuresAnchor4, measuresAnchor16, measuresAnchor64, measuresAnchor256
		];
		for (var i = 0; i < anchors.length; i++) {
			this.clearSingleAnchor(anchors[i], songDuration);
		}
		tileLevel.innerWidth = ratioDuration * songDuration * tileLevel.tapSize;
		tileLevel.innerHeight = 128 * ratioThickness * tileLevel.tapSize;

	}
	drawSchedule(song: ZvoogSchedule) {
		console.log('drawSchedule', song);
		var songDuration = scheduleDuration(song);
		this.clearAnchorsContent(songDuration);
		//debugAnchor1.content.length = 0;

		debugAnchor1.content.push({ x: 0, y: 0, w: ratioDuration * songDuration, h: 128 * ratioThickness, rx: 0.1, ry: 0.1, css: 'debug' });
		var time = 0;
		for (var i = 0; i < song.measures.length; i++) {
			var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			//measuresAnchor256.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			let singleMeasuresAnchor1: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresAnchor1.showZoom, hideZoom: measuresAnchor1.hideZoom, content: []
			};
			singleMeasuresAnchor1.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMeasuresAnchor1.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize1', text: ('1-' + (i + 1)) });
			measuresAnchor1.content.push(singleMeasuresAnchor1);

			let singleMeasuresAnchor4: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresAnchor4.showZoom, hideZoom: measuresAnchor4.hideZoom, content: []
			};
			singleMeasuresAnchor4.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 15, ry: 15, css: 'debug' });
			singleMeasuresAnchor4.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize4', text: ('4-' + (i + 1)) });
			measuresAnchor4.content.push(singleMeasuresAnchor4);

			let singleMeasuresAnchor16: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresAnchor16.showZoom, hideZoom: measuresAnchor16.hideZoom, content: []
			};
			singleMeasuresAnchor16.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 20, ry: 20, css: 'debug' });
			singleMeasuresAnchor16.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize16', text: ('16-' + (i + 1)) });
			measuresAnchor16.content.push(singleMeasuresAnchor16);

			let singleMeasuresAnchor64: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresAnchor64.showZoom, hideZoom: measuresAnchor64.hideZoom, content: []
			};
			singleMeasuresAnchor64.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 30, ry: 30, css: 'debug' });
			if (i % 5 == 0)singleMeasuresAnchor64.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize64', text: ('64-' + (i + 1)) });
			measuresAnchor64.content.push(singleMeasuresAnchor64);

			let singleMeasuresAnchor256: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresAnchor256.showZoom, hideZoom: measuresAnchor256.hideZoom, content: []
			};
			singleMeasuresAnchor256.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 50, ry: 50, css: 'debug' });
			if (i % 10 == 0) singleMeasuresAnchor256.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize256', text: ('256-' + (i + 1)) });
			measuresAnchor256.content.push(singleMeasuresAnchor256);

			//measuresAnchor4.content.push({ x: time * ratioDuration, y: 128 * ratioThickness, css: 'barNumber textSize4', text: ('' + (i + 1)) });
			//measuresAnchor16.content.push({ x: time * ratioDuration, y: 128 * ratioThickness, css: 'barNumber textSize16', text: ('' + (i + 1)) });
			//measuresAnchor64.content.push({ x: time * ratioDuration, y: 128 * ratioThickness, css: 'barNumber textSize64', text: ('' + (i + 1)) });
			//measuresAnchor256.content.push({ x: time * ratioDuration, y: 128 * ratioThickness, css: 'barNumber textSize256', text: ('' + (i + 1)) });
			time = time + measureDuration;
			//console.log(time , measureDuration,song.measures[i].tempo, song.measures[i].meter);
		}
		debugAnchor0.content.push(this.menuButton);
		tileLevel.translateZ = 32;

		//console.log(tileLevel.translateZ);
		tileLevel.resetModel();

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
		//var me=this;
		test.readSongData("any", function (result: ZvoogSchedule | null): void {
			//console.log('testFS result', result);
			if (result) {
				var me = window['MZXB'];
				console.log(me);
				if (me) {
					me.drawSchedule(result);
				}
			}
		});
	}
}
window['MZXB'] = new MuzXBox();
