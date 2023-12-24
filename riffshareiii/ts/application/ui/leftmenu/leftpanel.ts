class LeftBar {
    selectionBarLayer: TileLayerDefinition;
    leftLayerZoom: SVGElement;
    leftBarAnchor: TileAnchor;
    backgrounds: TileRectangle[] = [];
    zoomAnchors: TileAnchor[] = [];
    projectTitles: TileText[] = [];
    leftHide: boolean = true;
    constructor() {

    }
    reShowLeftPanel(viewWidth: number, viewHeight: number) {
        console.log(this.leftHide, viewWidth, viewHeight,this.leftBarAnchor);
        if (this.leftHide) {
            this.leftBarAnchor.translation = { x: 0, y: -this.leftBarAnchor.hh };
        } else {
            this.leftBarAnchor.translation = { x:0, y: 0 };
        }
    }

    createLeftPanel(): TileLayerDefinition[] {
        this.leftLayerZoom = (document.getElementById("leftLayerZoom") as any) as SVGElement;
        //this.backgroundRectangle = { x: 0, y: 0, w: 25, h: 5, css: 'debug' };
        this.leftBarAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1
            , showZoom: zoomPrefixLevelsCSS[0].minZoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
            , content: [

            ]
            ,id:'leftBarAnchor'
        };
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let bg = { x: 0, y: 0, w: 5 * zoomPrefixLevelsCSS[zz].minZoom, h: 55, css: 'leftPanelBG', id: 'hdbg' + (zz + Math.random()) };
            this.backgrounds.push(bg);
            let protitle: TileText = {
                x: 0, y: 22, text: 'jdfnvsn dyd y dtyj dtyjftyjr vf'
                , css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix
            };
            this.projectTitles.push(protitle);
            let anchor = {
                xx: 0, yy: 0, ww: 1, hh: 1
                , showZoom: zoomPrefixLevelsCSS[zz].minZoom
                , hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
                , content: [bg, protitle]
                , id: 'head' + (zz + Math.random())
            };
            this.zoomAnchors.push(anchor);
            this.leftBarAnchor.content.push(anchor);
        }
        this.selectionBarLayer = {
            g: this.leftLayerZoom, anchors: [
                this.leftBarAnchor
            ], mode: LevelModes.left
        };
        return [this.selectionBarLayer];
    }
    resizeHeaders(mixerH: number, viewWidth: number, viewHeight: number, tz: number) {

        let rh = viewHeight * zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom - 1;
        let ry = -(rh - mixerH) / 2;
        //this.backgroundRectangle = { x: 0, y: ry, w: 15, h: rh, css: 'debug' };
        //this.backgroundRectangle.y = ry;
        //this.backgroundRectangle.h = rh;
        this.leftBarAnchor.yy = ry;
        this.leftBarAnchor.hh = rh;
        for (let ii = 0; ii < this.zoomAnchors.length; ii++) {
            this.zoomAnchors[ii].yy = ry;
            this.zoomAnchors[ii].hh = rh;
            this.backgrounds[ii].y = ry;
            this.backgrounds[ii].h = rh;
        }
        //console.log(this.backgroundRectangle);
        //console.log(this.leftBarAnchor);
        //console.log('resizeHeaders', viewWidth, viewHeight, tz, mixerH,rh,ry,this.leftBarAnchor);
        this.reShowLeftPanel(viewWidth, viewHeight);
    }
    fillTrackHeaders(data: MZXBX_Project) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        for (let ii = 0; ii < this.projectTitles.length; ii++) {
            this.projectTitles[ii].y = mixm.gridTop();
            this.projectTitles[ii].text = data.title;
        }
    }
}
