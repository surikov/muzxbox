class CommandDispatcher {
    renderer: UIRenderer;
    audioContext:AudioContext;
    initAudioFromUI(){
        var AudioContext = window.AudioContext;// || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    }
    registerUI(renderer: UIRenderer) {
        this.renderer = renderer;
    }
    showRightMenu() {
        let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
        let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
        this.renderer.menu.showState = !this.renderer.menu.showState;
        this.renderer.menu.resizeMenu(vw, vh);
        this.renderer.menu.resetAllAnchors();
    };
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) {
        this.renderer.tiler.resetAnchor(parentSVGGroup, anchor, layerMode);
    };
    changeTapSIze(ratio: number) {
        console.log('changeTapSIze', ratio, this);
        this.renderer.tiler.setupTapSize(ratio);
        this.renderer.onReSizeView();
        this.renderer.tiler.resetModel();
    }
    promptImportFromMIDI() {
        console.log('promptImportFromMIDI');
        let filesinput: HTMLElement | null = document.getElementById('file_midi_input');
        if (filesinput) {
            console.log('choose');
            let listener: (this: HTMLElement, event: HTMLElementEventMap['change']) => any = function (this: HTMLElement, ievent: HTMLElementEventMap['change']) {
                var file = (ievent as any).target.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (progressEvent: any) {
                    if (progressEvent != null) {
                        var arrayBuffer = progressEvent.target.result;
                        //console.log(arrayBuffer);
                        //var midiParser = new MidiParser(arrayBuffer);
                        //let testSchedule = midiParser.dump();
                        //console.log('MZXBX_Schedule', testSchedule);
                    }
                };
                fileReader.readAsArrayBuffer(file);
            };
            filesinput.addEventListener('change', listener, false);
            filesinput.click();
        }
    }
}
let commandDispatcher=new CommandDispatcher();