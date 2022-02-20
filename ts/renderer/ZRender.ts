class ZRender {
    tileLevel: TileLevel;
    layers: TileLayerDefinition[] = [];
    zoomMin: number = 1;
    zoomNote: number = 4;
    zoomMeasure: number = 16;
    zoomSong: number = 64;
    zoomFar: number = 256;
    zoomMax: number = 10000;
    ratioDuration = 200;
    ratioThickness = 3;
    sizeRatio = 2;

    measureOtherVoicesLayerGroup: SVGElement;
    measureSecondVoicesLayerGroup: SVGElement;
    measureMainVoiceLayerGroup: SVGElement;
    bottomTimelineLayerGroup: SVGElement;
    debugLayerGroup: SVGElement;

    debugAnchor0: TileAnchor;
    debugAnchor1: TileAnchor;
    debugAnchor4: TileAnchor;
    debugAnchor16: TileAnchor;
    debugAnchor64: TileAnchor;
    debugAnchor256: TileAnchor;

    measuresTimelineAnchor1: TileAnchor;
    measuresTimelineAnchor4: TileAnchor;
    measuresTimelineAnchor16: TileAnchor;
    measuresTimelineAnchor64: TileAnchor;
    measuresTimelineAnchor256: TileAnchor;

    contentMain1: TileAnchor;
    contentMain4: TileAnchor;
    contentMain16: TileAnchor;
    contentMain64: TileAnchor;
    contentMain256: TileAnchor;

    contentSecond1: TileAnchor;
    contentSecond4: TileAnchor;
    contentSecond16: TileAnchor;
    contentSecond64: TileAnchor;
    contentSecond256: TileAnchor;

    contentOther1: TileAnchor;
    contentOther4: TileAnchor;
    contentOther16: TileAnchor;
    contentOther64: TileAnchor;
    contentOther256: TileAnchor;

    constructor() {
        this.bindLayers();
    }
    bindLayers() {
        this.measureOtherVoicesLayerGroup = (document.getElementById('measureOtherVoicesLayerGroup') as any) as SVGElement;
        this.measureSecondVoicesLayerGroup = (document.getElementById('measureSecondVoicesLayerGroup') as any) as SVGElement;
        this.measureMainVoiceLayerGroup = (document.getElementById('measureMainVoiceLayerGroup') as any) as SVGElement;
        this.bottomTimelineLayerGroup = (document.getElementById('bottomTimelineLayerGroup') as any) as SVGElement;
        this.debugLayerGroup = (document.getElementById('debugLayerGroup') as any) as SVGElement;
        this.tileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
            , 1000//50*time
            , 1000//testProject.tracks.length*11
            , this.zoomMin, this.zoomMin, this.zoomMax
            , this.layers);
    }
    initUI() {
        this.initDebugAnchors();
        this.initTimelineAnchors();
        this.initMainAnchors();
        this.initSecondAnchors();
        this.initOthersAnchors();

    }
    initDebugAnchors() {
        this.debugAnchor0 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomMax + 1, content: [] };
        this.debugAnchor1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
        this.debugAnchor4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
        this.debugAnchor16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
        this.debugAnchor64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
        this.debugAnchor256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
        this.layers.push({
            g: this.debugLayerGroup, anchors: [
                this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256, this.debugAnchor0
            ]
        });
    }
    initTimelineAnchors() {
        this.measuresTimelineAnchor1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
        this.measuresTimelineAnchor4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
        this.measuresTimelineAnchor16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
        this.measuresTimelineAnchor64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
        this.measuresTimelineAnchor256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
        this.layers.push({
            g: this.bottomTimelineLayerGroup, stickBottom: 0, anchors: [
                this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
            ]
        });
    }
    initMainAnchors() {
        this.contentMain1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
        this.contentMain4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
        this.contentMain16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
        this.contentMain64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
        this.contentMain256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
        this.layers.push({
            g: this.measureMainVoiceLayerGroup, anchors: [
                this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64, this.contentMain256
            ]
        });
    }
    initSecondAnchors() {
        this.contentSecond1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
        this.contentSecond4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
        this.contentSecond16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
        this.contentSecond64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
        this.contentSecond256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
        this.layers.push({
            g: this.measureSecondVoicesLayerGroup, anchors: [
                this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64, this.contentSecond256
            ]
        });
    }
    initOthersAnchors() {
        this.contentOther1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
        this.contentOther4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
        this.contentOther16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
        this.contentOther64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
        this.contentOther256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
        this.layers.push({
            g: this.measureOtherVoicesLayerGroup, anchors: [
                this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
            ]
        });
    }
    clearSingleAnchor(anchor: TileAnchor, songDuration: number) {
        anchor.content.length = 0;
        anchor.ww = this.ratioDuration * songDuration;
        anchor.hh = 128 * this.ratioThickness;
    }
    clearAnchorsContent(songDuration: number): void {
        var anchors: TileAnchor[] = [
            this.debugAnchor0, this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256
            , this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
            , this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64, this.contentMain256
            , this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64, this.contentSecond256
            , this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
        ];
        for (var i = 0; i < anchors.length; i++) {
            this.clearSingleAnchor(anchors[i], songDuration);
        }
        this.tileLevel.innerWidth = this.ratioDuration * songDuration * this.tileLevel.tapSize;
        this.tileLevel.innerHeight = 128 * this.ratioThickness * this.tileLevel.tapSize;

    }
    /*resetSong(testProject: MuzXBoxProject, menuButton: TileRectangle, onAction: (n1: number, n2: number) => void) {
        let time = meter2seconds(testProject.tempo, testProject.duration);
        this.debugAnchor1.content.push({ x: 0, y: 0, w: 50 * time, h: testProject.tracks.length * 11, rx: 0.1, ry: 0.1, css: 'debug' });
        for (let tt = 0; tt < testProject.tracks.length; tt++) {
            let track: MuzXBoxTrack = testProject.tracks[tt];
            let curPoint: ZvoogMeter = { count: 0, division: 4 };
            for (let pp = 0; pp < track.patterns.length; pp++) {
                let pattern: MuzXBoxPattern = track.patterns[pp];
                curPoint = DUU(curPoint).plus(pattern.skip);
                let time = meter2seconds(testProject.tempo, curPoint);
                let sz = meter2seconds(testProject.tempo, pattern.duration);
                this.debugAnchor1.content.push({
                    x: 50 * time, y: tt * 11, w: 50 * sz, h: 11, rx: 0.1, ry: 0.1, css: 'debug'
                    , action: () => {
                        //this.testChooser(20, 16); 
                        onAction(20, 16);
                    }
                });
                curPoint = DUU(curPoint).plus(pattern.duration);
            }
        }
        this.debugAnchor1.content.push(menuButton);
        this.tileLevel.innerWidth = 50 * time * this.tileLevel.tapSize;
        this.tileLevel.innerHeight = testProject.tracks.length * 11 * this.tileLevel.tapSize;
    }*/


    drawSchedule(song: ZvoogSchedule, menuButton: TileRectangle) {
        //console.log('drawSchedule', song);
        var songDuration = scheduleDuration(song);
        this.clearAnchorsContent(songDuration);
        //debugAnchor1.content.length = 0;


        var time = 0;
        for (var i = 0; i < song.measures.length; i++) {
            var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);

            //debugAnchor0.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });

            let singlemeasuresTimelineAnchor1: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.measuresTimelineAnchor1.showZoom, hideZoom: this.measuresTimelineAnchor1.hideZoom, content: []
            };
            singlemeasuresTimelineAnchor1.content.push({ x: time * this.ratioDuration, y: 0, css: 'barNumber textSize1', text: ('1-' + (i + 1)) });
            singlemeasuresTimelineAnchor1.content.push({ x: time * this.ratioDuration, y: -1, css: 'barNumber textSize1', text: '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division });
            this.measuresTimelineAnchor1.content.push(singlemeasuresTimelineAnchor1);

            let singlemeasuresTimelineAnchor4: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.measuresTimelineAnchor4.showZoom, hideZoom: this.measuresTimelineAnchor4.hideZoom, content: []
            };
            singlemeasuresTimelineAnchor4.content.push({ x: time * this.ratioDuration, y: 0, css: 'barNumber textSize4', text: ('4-' + (i + 1)) });
            singlemeasuresTimelineAnchor4.content.push({ x: time * this.ratioDuration, y: -4, css: 'barNumber textSize4', text: '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division });
            this.measuresTimelineAnchor4.content.push(singlemeasuresTimelineAnchor4);

            let singlemeasuresTimelineAnchor16: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.measuresTimelineAnchor16.showZoom, hideZoom: this.measuresTimelineAnchor16.hideZoom, content: []
            };
            singlemeasuresTimelineAnchor16.content.push({ x: time * this.ratioDuration, y: 0, css: 'barNumber textSize16', text: ('16-' + (i + 1)) });
            singlemeasuresTimelineAnchor16.content.push({ x: time * this.ratioDuration, y: -16, css: 'barNumber textSize16', text: '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division });
            this.measuresTimelineAnchor16.content.push(singlemeasuresTimelineAnchor16);

            let singlemeasuresTimelineAnchor64: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.measuresTimelineAnchor64.showZoom, hideZoom: this.measuresTimelineAnchor64.hideZoom, content: []
            };
            if (i % 4 == 0) singlemeasuresTimelineAnchor64.content.push({ x: time * this.ratioDuration, y: 0, css: 'barNumber textSize64', text: ('64-' + (i + 1)) });
            if (i % 4 == 0) singlemeasuresTimelineAnchor64.content.push({ x: time * this.ratioDuration, y: -64, css: 'barNumber textSize64', text: '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division });
            this.measuresTimelineAnchor64.content.push(singlemeasuresTimelineAnchor64);

            let singlemeasuresTimelineAnchor256: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.measuresTimelineAnchor256.showZoom, hideZoom: this.measuresTimelineAnchor256.hideZoom, content: []
            };
            if (i % 16 == 0) singlemeasuresTimelineAnchor256.content.push({ x: time * this.ratioDuration, y: 0, css: 'barNumber textSize256', text: ('256-' + (i + 1)) });
            this.measuresTimelineAnchor256.content.push(singlemeasuresTimelineAnchor256);

            let singleMasuresContentAnchor1: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentMain1.showZoom, hideZoom: this.contentMain1.hideZoom, content: []
            };
            let singleMasuresContentAnchor4: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentMain4.showZoom, hideZoom: this.contentMain4.hideZoom, content: []
            };
            let singleMasuresContentAnchor16: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentMain16.showZoom, hideZoom: this.contentMain16.hideZoom, content: []
            };
            let singleMasuresContentAnchor64: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentMain64.showZoom, hideZoom: this.contentMain64.hideZoom, content: []
            };
            let singleMasuresContentAnchor256: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentMain256.showZoom, hideZoom: this.contentMain256.hideZoom, content: []
            };

            this.contentMain1.content.push(singleMasuresContentAnchor1);
            this.contentMain4.content.push(singleMasuresContentAnchor4);
            this.contentMain16.content.push(singleMasuresContentAnchor16);
            this.contentMain64.content.push(singleMasuresContentAnchor64);
            this.contentMain256.content.push(singleMasuresContentAnchor256);

			/*singleMasuresContentAnchor1.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresContentAnchor4.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresContentAnchor16.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresContentAnchor64.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresContentAnchor256.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
*/
            let singleMasuresSecondAnchor1: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentSecond1.showZoom, hideZoom: this.contentSecond1.hideZoom, content: []
            };
            let singleMasuresSecondAnchor4: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentSecond4.showZoom, hideZoom: this.contentSecond4.hideZoom, content: []
            };
            let singleMasuresSecondAnchor16: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentSecond16.showZoom, hideZoom: this.contentSecond16.hideZoom, content: []
            };
            let singleMasuresSecondAnchor64: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentSecond64.showZoom, hideZoom: this.contentSecond64.hideZoom, content: []
            };
            let singleMasuresSecondAnchor256: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentSecond256.showZoom, hideZoom: this.contentSecond256.hideZoom, content: []
            };

            this.contentSecond1.content.push(singleMasuresSecondAnchor1);
            this.contentSecond4.content.push(singleMasuresSecondAnchor4);
            this.contentSecond16.content.push(singleMasuresSecondAnchor16);
            this.contentSecond64.content.push(singleMasuresSecondAnchor64);
            this.contentSecond256.content.push(singleMasuresSecondAnchor256);

			/*singleMasuresSecondAnchor1.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresSecondAnchor4.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresSecondAnchor16.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresSecondAnchor64.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresSecondAnchor256.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
*/
            let singleMasuresOtherAnchor1: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentOther1.showZoom, hideZoom: this.contentOther1.hideZoom, content: []
            };
            let singleMasuresOtherAnchor4: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentOther4.showZoom, hideZoom: this.contentOther4.hideZoom, content: []
            };
            let singleMasuresOtherAnchor16: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentOther16.showZoom, hideZoom: this.contentOther16.hideZoom, content: []
            };
            let singleMasuresOtherAnchor64: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentOther64.showZoom, hideZoom: this.contentOther64.hideZoom, content: []
            };
            let singleMasuresOtherAnchor256: TileAnchor = {
                xx: time * this.ratioDuration, yy: 0, ww: this.ratioDuration * measureDuration, hh: 128 * this.ratioThickness
                , showZoom: this.contentOther256.showZoom, hideZoom: this.contentOther256.hideZoom, content: []
            };

            this.contentOther1.content.push(singleMasuresOtherAnchor1);
            this.contentOther4.content.push(singleMasuresOtherAnchor4);
            this.contentOther16.content.push(singleMasuresOtherAnchor16);
            this.contentOther64.content.push(singleMasuresOtherAnchor64);
            this.contentOther256.content.push(singleMasuresOtherAnchor256);

			/*singleMasuresOtherAnchor1.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresOtherAnchor4.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresOtherAnchor16.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresOtherAnchor64.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
			singleMasuresOtherAnchor256.content.push({ x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 10, ry: 10, css: 'debug' });
*/

            //var prePitch: ZvoogPitch;
            for (var tt = 0; tt < song.tracks.length; tt++) {
                var track = song.tracks[tt];
                for (var vv = 0; vv < track.voices.length; vv++) {
                    var voice = track.voices[vv];
                    var measure = voice.measureChords[i];
                    for (var cc = 0; cc < measure.chords.length; cc++) {
                        var chord = measure.chords[cc];
                        for (var ee = 0; ee < chord.envelopes.length; ee++) {
                            var envelope = chord.envelopes[ee];
							/*if (envelope.pitches.length > 5) {
								console.log(i, voice.title, chord);
							}*/
                            var pitchWhen = meter2seconds(song.measures[i].tempo, chord.when);
                            for (var pp = 0; pp < envelope.pitches.length; pp++) {
                                var pitch = envelope.pitches[pp];
                                var slide = pitch.pitch;
                                if (pp + 1 < envelope.pitches.length) {
                                    slide = envelope.pitches[pp + 1].pitch;
                                }

                                var pitchDuration = meter2seconds(song.measures[i].tempo, pitch.duration);
                                var startShift = 0;
                                if (pp == 0) {
                                    startShift = 0.5 * this.ratioThickness;
                                }
                                var endShift = 0;
                                if (pp == envelope.pitches.length - 1) {
                                    endShift = -0.49 * this.ratioThickness;
                                }
                                var line: TileLine = {
                                    x1: (time + pitchWhen) * this.ratioDuration + startShift
                                    , x2: (time + pitchWhen + pitchDuration) * this.ratioDuration + endShift
                                    , y1: (128 - pitch.pitch) * this.ratioThickness
                                    , y2: (128 - slide) * this.ratioThickness
                                    , css: 'debug'
                                };
                                if (tt == 0) {
                                    if (vv == 0) {
                                        line.css = 'mainLine';
                                        singleMasuresContentAnchor1.content.push(cloneLine(line));
                                        singleMasuresContentAnchor4.content.push(cloneLine(line));
                                        singleMasuresContentAnchor16.content.push(cloneLine(line));
                                        singleMasuresContentAnchor64.content.push(cloneLine(line));
                                        singleMasuresContentAnchor256.content.push(cloneLine(line));
                                    } else {
                                        line.css = 'secondLine';
                                        singleMasuresSecondAnchor1.content.push(cloneLine(line));
                                        singleMasuresSecondAnchor4.content.push(cloneLine(line));
                                        singleMasuresSecondAnchor16.content.push(cloneLine(line));
                                        singleMasuresSecondAnchor64.content.push(cloneLine(line));
                                        singleMasuresSecondAnchor256.content.push(cloneLine(line));
                                    }
                                } else {
                                    line.css = 'otherLine';
                                    singleMasuresOtherAnchor1.content.push(cloneLine(line));
                                    singleMasuresOtherAnchor4.content.push(cloneLine(line));
                                    singleMasuresOtherAnchor16.content.push(cloneLine(line));
                                    singleMasuresOtherAnchor64.content.push(cloneLine(line));
                                    //singleMasuresOtherAnchor256.content.push(cloneLine(line));
                                }
                                pitchWhen = pitchWhen + pitchDuration;
                            }
                        }
                    }
                }
            }
            time = time + measureDuration;
        }
        this.debugAnchor0.content.push(menuButton);
        this.debugAnchor0.content.push({ x: 10, y: 10, css: 'textSize16', text: 'import' });


        var me = this;
        if (song.tracks.length > 0) { this.debugAnchor0.content.push({ x: 10, y: 30, css: 'textSize16', text: song.tracks[0].title }); }
        this.debugAnchor0.content.push({
            x: 0, y: 20, w: 10, h: 10, rx: 3, ry: 3, css: 'debug'
            , action: function () {
                //console.log('track');
                var tt = song.tracks.shift();
                if (tt) {
                    song.tracks.push(tt);
                    me.drawSchedule(song, menuButton)
                }
            }
        });
        if (song.tracks.length > 0) { this.debugAnchor0.content.push({ x: 10, y: 50, css: 'textSize16', text: song.tracks[0].voices[0].title }); }
        this.debugAnchor0.content.push({
            x: 0, y: 40, w: 10, h: 10, rx: 3, ry: 3, css: 'debug'
            , action: function () {
                //console.log('voice');
                if (song.tracks.length > 0) {
                    var vv = song.tracks[0].voices.shift();
                    if (vv) {
                        song.tracks[0].voices.push(vv);
                        me.drawSchedule(song, menuButton)
                    }
                }
            }
        });
        //tileLevel.translateZ = 32;

        //console.log(tileLevel.model);
        this.tileLevel.resetModel();

    }
}
