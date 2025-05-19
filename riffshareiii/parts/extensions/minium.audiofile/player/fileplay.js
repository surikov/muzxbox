"use strict";
class AudioFileParametersUrility {
    parse(parameters) {
        let result = { ratio: 0, volume: 100, url: '' };
        try {
            let split = parameters.split(',');
            result.ratio = parseInt(split[0]);
            result.volume = parseInt(split[1]);
            result.url = split[2];
        }
        catch (xx) {
            console.log(xx);
        }
        if (result.ratio >= -100 && result.ratio <= 100) {
        }
        else {
            result.ratio = 0;
        }
        if (result.volume >= 0 && result.ratio <= 100) {
        }
        else {
            result.volume = 100;
        }
        result.url = (result.url) ? result.url : '';
        return result;
    }
    dump(ratio, volume, url) {
        return '' + ratio + ',' + volume + ',' + url;
    }
}
console.log('Audio File v1.0');
class AudiFileSamplerTrackImplementation {
    constructor() {
        this.freqRatio = 0;
        this.fileURL = '';
        this.volumeLevel = 0;
        this.ratio = 0;
        this.path = '';
    }
    launch(context, parameters) {
        console.log('audiofile lauch');
        if (this.audioContext) {
        }
        else {
            this.audioContext = context;
            this.outputNode = this.audioContext.createGain();
        }
        let parsed = new AudioFileParametersUrility().parse(parameters);
        this.ratio = parsed.ratio;
        this.volumeLevel = parsed.volume;
        this.path = parsed.url;
        this.startLoadFile();
    }
    strum(when, pitches, tempo, slides) {
    }
    cancel() {
    }
    ;
    busy() {
        return 'testing';
    }
    output() {
        return this.outputNode;
    }
    startLoadFile() {
        let loadedFile = window[this.path];
        console.log('loadedFile', loadedFile);
    }
}
function newAudiFileSamplerTrack() {
    console.log('audiofile newAudiFileSamplerTrack');
    return new AudiFileSamplerTrackImplementation();
}
//# sourceMappingURL=fileplay.js.map