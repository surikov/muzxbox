"use strict";
class Writer {
    constructor(tracks, options = {}) {
        this.tracks = Utils.toArray(tracks);
        this.options = options;
    }
    buildData() {
        const data = [];
        data.push(new MHeader(this.tracks.length));
        this.tracks.forEach((track) => {
            data.push(track.buildData(this.options));
        });
        return data;
    }
    buildFile() {
        let build = [];
        this.buildData().forEach((d) => build = build.concat(d.type, d.size, d.data));
        return new Uint8Array(build);
    }
    base64() {
        if (typeof btoa === 'function') {
            let binary = '';
            const bytes = this.buildFile();
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
        return Buffer.from(this.buildFile()).toString('base64');
    }
    dataUri() {
        return 'data:audio/midi;base64,' + this.base64();
    }
    setOption(key, value) {
        this.options[key] = value;
        return this;
    }
    stdout() {
        return process.stdout.write(Buffer.from(this.buildFile()));
    }
}
