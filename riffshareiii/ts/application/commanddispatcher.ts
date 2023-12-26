declare function newMIDIparser(arrayBuffer: ArrayBuffer): any;
class CommandDispatcher {
    renderer: UIRenderer;
    audioContext: AudioContext;
    tapSizeRatio: number = 1;
    listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any) = null;
    initAudioFromUI() {
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
    toggleLeftMenu() {
        //console.log('toggleLeftMenu');
        this.renderer.leftBar.leftHide=!this.renderer.leftBar.leftHide;
        let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
        let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
        this.renderer.leftBar.reShowLeftPanel(vw, vh);
        //this.renderer.leftBar.resetAllAnchors();
    }

    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) {
        this.renderer.tiler.resetAnchor(parentSVGGroup, anchor, layerMode);
    };
    changeTapSize(ratio: number) {
        console.log('changeTapSize', ratio, this);
        this.tapSizeRatio = ratio;
        this.renderer.tiler.setupTapSize(ratio);
        this.renderer.onReSizeView();
        this.renderer.tiler.resetModel();
    }
    resetProject(data: MZXBX_Project) {
        console.log('resetProject', data);
        this.renderer.fillWholeUI(data);
    }
    promptImportFromMIDI() {
        console.log('promptImportFromMIDI');
        let me = this;
        let filesinput: HTMLElement | null = document.getElementById('file_midi_input');
        if (filesinput) {
            if (!(this.listener)) {
                this.listener = function (this: HTMLElement, ievent: HTMLElementEventMap['change']) {
                    //console.log('change',ievent);
                    var file = (ievent as any).target.files[0];
                    //console.log('file',file);
                    let title: string = file.name;
                    let comment: string = '' + file.size / 1000 + 'kb, ' + file.lastModifiedDate;
                    var fileReader = new FileReader();

                    fileReader.onload = function (progressEvent: any) {
                        //console.log('progressEvent', progressEvent);
                        if (progressEvent != null) {
                            var arrayBuffer = progressEvent.target.result;
                            //console.log('arrayBuffer',arrayBuffer);
                            var midiParser = newMIDIparser(arrayBuffer);
                            let result: MZXBX_Project = midiParser.convertProject(title, comment);
                            //console.log('result',result);
                            me.resetProject(result);
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                };
                filesinput.addEventListener('change', this.listener, false);
            }
            filesinput.click();
            //console.log('setup', filesinput);
        }
    }
}
let commandDispatcher = new CommandDispatcher();