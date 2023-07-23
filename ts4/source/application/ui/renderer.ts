declare function createTileLevel(): TileLevelBase;
class UIRenderer {
    toolbar: UIToolbar;
    mixer: MixerUI;
    tileRenderer: TileLevelBase;
    tileLevelSVG: SVGElement;
    setupUI() {
        this.tileRenderer = createTileLevel();
        this.tileLevelSVG = (document.getElementById("tileLevelSVG") as any) as SVGElement;
        let layers: TileLayerDefinition[] = [];
        let debugGroup = (document.getElementById("debugLayer") as any) as SVGElement;
        //let debugRectangle: TileRectangle = { x: 0, y: 0, w: 1000, h: 1000, rx: 100, ry: 100, css: 'debug' };
        let debugAnchor: TileAnchor = { xx: 0, yy: 0, ww: 1000, hh: 1000, showZoom: 1, hideZoom: 16 + 1, content: [] };
        this.testAddRectangles(debugAnchor, 1024, 0, 1, 8, 1);


        let debugLayer: TileLayerDefinition = {
            g: debugGroup, anchors: [debugAnchor], mode: LevelModes.normal
        };
        layers.push(debugLayer);
        this.mixer = new MixerUI();
        this.tileRenderer.initRun(this.tileLevelSVG
            , true
            , this.constentWidth()
            , this.constentWidth()
            , 1, 4, 16
            , layers);
        //this.tileRenderer.setAfterZoomCallback(()=>{console.log(this.tileRenderer.getCurrentPointPosition())});
    }
    testAddRectangles(anchor: TileAnchor, count: number, start: number, size: number, stopZoom: number, showZoom: number) {

        for (let x = 0; x < count; x = x++) {
            for (let y = 0; y < count; y++) {
                let aa: TileAnchor = {
                    xx: start + x * size
                    , yy: start + y * size
                    , ww: size, hh: size, showZoom: showZoom, hideZoom: showZoom * 2, content: []
                };
                let rr: TileRectangle = {
                    x: start + x * size
                    , y: start + y * size
                    , w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug'
                };
                aa.content.push(rr);
                anchor.content.push(aa);
                if(showZoom*2<=stopZoom){
                    this.testAddRectangles(aa, count, 0, 1, 8, 1);

                }
            }
        }
    }
    resetUI() {
        this.mixer.resetMixeUI();
    }
    constentWidth() {
        return 1000;
    }
    constentHeight() {
        return 1000;
    }
}
