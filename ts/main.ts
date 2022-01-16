console.log('MuzXBox v1.01');
let debugAnchor0: TileAnchor;
let debugAnchor1: TileAnchor;
let debugAnchor4: TileAnchor;
let debugAnchor16: TileAnchor;
let debugAnchor64: TileAnchor;
let debugAnchor256: TileAnchor;

let measuresTimelineAnchor1: TileAnchor;
let measuresTimelineAnchor4: TileAnchor;
let measuresTimelineAnchor16: TileAnchor;
let measuresTimelineAnchor64: TileAnchor;
let measuresTimelineAnchor256: TileAnchor;

let contentMain1: TileAnchor;
let contentMain4: TileAnchor;
let contentMain16: TileAnchor;
let contentMain64: TileAnchor;
let contentMain256: TileAnchor;

let contentSecond1: TileAnchor;
let contentSecond4: TileAnchor;
let contentSecond16: TileAnchor;
let contentSecond64: TileAnchor;
let contentSecond256: TileAnchor;

let contentOther1: TileAnchor;
let contentOther4: TileAnchor;
let contentOther16: TileAnchor;
let contentOther64: TileAnchor;
let contentOther256: TileAnchor;

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
		let measureOtherVoicesLayerGroup: SVGElement = (document.getElementById('measureOtherVoicesLayerGroup') as any) as SVGElement;
		let measureSecondVoicesLayerGroup: SVGElement = (document.getElementById('measureSecondVoicesLayerGroup') as any) as SVGElement;
		let measureMainVoiceLayerGroup: SVGElement = (document.getElementById('measureMainVoiceLayerGroup') as any) as SVGElement;

		let bottomTimelineLayerGroup: SVGElement = (document.getElementById('bottomTimelineLayerGroup') as any) as SVGElement;
		let debugLayerGroup: SVGElement = (document.getElementById('debugLayerGroup') as any) as SVGElement;

		let testProject = this.muzLoader.createTestProject();


		//console.log(testProject);
		debugAnchor0 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomMax + 1, content: [] };
		debugAnchor1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		debugAnchor4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		debugAnchor16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		debugAnchor64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		debugAnchor256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
		layers.push({
			g: debugLayerGroup, anchors: [
				debugAnchor1, debugAnchor4, debugAnchor16, debugAnchor64, debugAnchor256, debugAnchor0
			]
		});

		measuresTimelineAnchor1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		measuresTimelineAnchor4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		measuresTimelineAnchor16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		measuresTimelineAnchor64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		measuresTimelineAnchor256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
		layers.push({
			g: bottomTimelineLayerGroup, stickBottom: 0, anchors: [
				measuresTimelineAnchor1, measuresTimelineAnchor4, measuresTimelineAnchor16, measuresTimelineAnchor64, measuresTimelineAnchor256
			]
		});

		contentMain1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		contentMain4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		contentMain16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		contentMain64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		contentMain256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
		layers.push({
			g: measureMainVoiceLayerGroup, anchors: [
				contentMain1, contentMain4, contentMain16, contentMain64, contentMain256
			]
		});

		contentSecond1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		contentSecond4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		contentSecond16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		contentSecond64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		contentSecond256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
		layers.push({
			g: measureSecondVoicesLayerGroup, anchors: [
				contentSecond1, contentSecond4, contentSecond16, contentSecond64, contentSecond256
			]
		});

		contentOther1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		contentOther4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		contentOther16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		contentOther64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		contentOther256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
		layers.push({
			g: measureOtherVoicesLayerGroup, anchors: [
				contentOther1, contentOther4, contentOther16, contentOther64, contentOther256
			]
		});

		//debugAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomMax + 1, content: [] };
		//menuAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
		//let measureTimeLineGroup:TileLayerStickBottom={ g: bottomTimelineLayerGroup, stickBottom:0,anchors: [measuresTimelineAnchor1, measuresTimelineAnchor4, measuresTimelineAnchor16, measuresTimelineAnchor64, measuresTimelineAnchor256] };


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
			, measuresTimelineAnchor1, measuresTimelineAnchor4, measuresTimelineAnchor16, measuresTimelineAnchor64, measuresTimelineAnchor256
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


		var time = 0;
		for (var i = 0; i < song.measures.length; i++) {
			var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);

			//debugAnchor0.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			contentMain1.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });

			let singlemeasuresTimelineAnchor1: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresTimelineAnchor1.showZoom, hideZoom: measuresTimelineAnchor1.hideZoom, content: []
			};
			singlemeasuresTimelineAnchor1.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize1', text: ('1-' + (i + 1)) });
			measuresTimelineAnchor1.content.push(singlemeasuresTimelineAnchor1);

			let singlemeasuresTimelineAnchor4: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresTimelineAnchor4.showZoom, hideZoom: measuresTimelineAnchor4.hideZoom, content: []
			};
			singlemeasuresTimelineAnchor4.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize4', text: ('4-' + (i + 1)) });
			measuresTimelineAnchor4.content.push(singlemeasuresTimelineAnchor4);

			let singlemeasuresTimelineAnchor16: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresTimelineAnchor16.showZoom, hideZoom: measuresTimelineAnchor16.hideZoom, content: []
			};
			singlemeasuresTimelineAnchor16.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize16', text: ('16-' + (i + 1)) });
			measuresTimelineAnchor16.content.push(singlemeasuresTimelineAnchor16);

			let singlemeasuresTimelineAnchor64: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresTimelineAnchor64.showZoom, hideZoom: measuresTimelineAnchor64.hideZoom, content: []
			};
			if (i % 5 == 0) singlemeasuresTimelineAnchor64.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize64', text: ('64-' + (i + 1)) });
			measuresTimelineAnchor64.content.push(singlemeasuresTimelineAnchor64);

			let singlemeasuresTimelineAnchor256: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: measuresTimelineAnchor256.showZoom, hideZoom: measuresTimelineAnchor256.hideZoom, content: []
			};
			if (i % 10 == 0) singlemeasuresTimelineAnchor256.content.push({ x: time * ratioDuration, y: 0, css: 'barNumber textSize256', text: ('256-' + (i + 1)) });
			measuresTimelineAnchor256.content.push(singlemeasuresTimelineAnchor256);

			let singleMasuresContentAnchor1: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: contentMain1.showZoom, hideZoom: contentMain1.hideZoom, content: []
			};
			let singleMasuresContentAnchor4: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: contentMain4.showZoom, hideZoom: contentMain4.hideZoom, content: []
			};
			let singleMasuresContentAnchor16: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: contentMain16.showZoom, hideZoom: contentMain16.hideZoom, content: []
			};
			let singleMasuresContentAnchor64: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: contentMain64.showZoom, hideZoom: contentMain64.hideZoom, content: []
			};
			let singleMasuresContentAnchor256: TileAnchor = {
				xx: time * ratioDuration, yy: 0, ww: ratioDuration * measureDuration, hh: 128 * ratioThickness
				, showZoom: contentMain256.showZoom, hideZoom: contentMain256.hideZoom, content: []
			};

			contentMain1.content.push(singleMasuresContentAnchor1);
			contentMain4.content.push(singleMasuresContentAnchor4);
			contentMain16.content.push(singleMasuresContentAnchor16);
			contentMain64.content.push(singleMasuresContentAnchor64);
			contentMain256.content.push(singleMasuresContentAnchor256);

			var prePitch: ZvoogPitch;
			for (var tt = 0; tt < song.tracks.length; tt++) {
				var track = song.tracks[tt];
				for (var vv = 0; vv < track.voices.length; vv++) {
					var voice = track.voices[vv];
					var measure = voice.measureChords[i];
					for (var cc = 0; cc < measure.chords.length; cc++) {
						var chord = measure.chords[cc];
						for (var ee = 0; ee < chord.envelopes.length; ee++) {
							var envelope = chord.envelopes[ee];
							for (var pp = 0; pp < envelope.pitches.length; pp++) {
								var pitch = envelope.pitches[pp];
								var pitchStart = meter2seconds(song.measures[i].tempo, chord.when);
								var pitchDuration = meter2seconds(song.measures[i].tempo, pitch.duration);
								var line: TileLine = {
									x1: (time + pitchStart) * ratioDuration+0.5 * ratioThickness
									, x2: (time + pitchStart + pitchDuration ) * ratioDuration- 0.999 * ratioThickness
									, y1: (128 - pitch.pitch) * ratioThickness
									, y2: (128 - pitch.pitch) * ratioThickness
									, css: 'mainLine'
								};
								//console.log(line);
								debugAnchor0.content.push(line);
							}
						}
					}
				}
			}
			time = time + measureDuration;
		}
		debugAnchor0.content.push(this.menuButton);
		tileLevel.translateZ = 32;

		console.log(tileLevel.model);
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
