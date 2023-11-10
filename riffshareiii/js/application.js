"use strict";
class TreeValue {
    constructor(name, value, children) {
        this.name = name;
        this.value = value;
        this.content = children;
    }
    clone() {
        var r = new TreeValue('', '', []);
        r.name = this.name;
        r.value = this.value;
        r.content = [];
        for (var i = 0; i < this.content.length; i++) {
            r.content.push(this.content[i].clone());
        }
        return r;
    }
    first(name) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return this.content[i];
            }
        }
        let tv = new TreeValue(name, '', []);
        this.content.push(tv);
        return tv;
    }
    exists(name) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return true;
            }
        }
        return false;
    }
    every(name) {
        let r = [];
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                r.push(this.content[i]);
            }
        }
        return r;
    }
    seek(name, subname, subvalue) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                var t = this.content[i].first(subname);
                if (t.value == subvalue) {
                    return this.content[i];
                }
            }
        }
        return new TreeValue('', '', []);
    }
    readDocChildren(node) {
        let children = [];
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                let c = node.children[i];
                let t = '';
                if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
                    t = ('' + c.childNodes[0].nodeValue).trim();
                }
                children.push(new TreeValue(c.localName, t, this.readDocChildren(c)));
            }
        }
        if (node.attributes) {
            for (let i = 0; i < node.attributes.length; i++) {
                let a = node.attributes[i];
                children.push(new TreeValue(a.localName, a.value, []));
            }
        }
        return children;
    }
    fillFromDocument(document) {
        var tt = this.readDocChildren(document);
        if (tt.length > 0) {
            this.name = tt[0].name;
            this.value = tt[0].value;
            this.content = tt[0].content;
        }
    }
    fillFromXMLstring(xml) {
        var windowDOMParser = new window.DOMParser();
        var dom = windowDOMParser.parseFromString(xml, "text/xml");
        this.readDocChildren(dom.childNodes);
    }
    ;
    readObjectChildren(oo) {
        if (oo) {
            let keys = Object.keys(oo);
            for (let ii = 0; ii < keys.length; ii++) {
                let key = keys[ii];
                let value = oo[keys[ii]];
                if (Array.isArray(value)) {
                    for (let nn = 0; nn < value.length; nn++) {
                        let subValue = value[nn];
                        let tv = new TreeValue(key, '', []);
                        if (Array.isArray(subValue)) {
                            tv.readObjectChildren(subValue);
                        }
                        else {
                            if (typeof value === 'object') {
                                tv.readObjectChildren(subValue);
                            }
                            else {
                                tv.value = '' + subValue;
                            }
                        }
                        this.content.push(tv);
                    }
                }
                else {
                    if (typeof value === 'object') {
                        let tv = new TreeValue(key, '', []);
                        tv.readObjectChildren(value);
                        this.content.push(tv);
                    }
                    else {
                        this.content.push(new TreeValue(key, '' + value, []));
                    }
                }
            }
        }
    }
    fillFromJSONstring(json) {
        let oo = JSON.parse(json);
        this.readObjectChildren(oo);
    }
    dump(pad, symbol) {
        console.log(pad, this.name, ':', this.value);
        for (var i = 0; i < this.content.length; i++) {
            this.content[i].dump(pad + symbol, symbol);
        }
    }
    ;
}
console.log('startup v1.02');
function startApplication() {
    console.log('startApplication v1.6.01');
    let commands = new CommandDispatcher();
    let ui = new UIRenderer(commands);
    ui.createUI();
    ui.fillUI(testBigMixerData);
    testNumMathUtil();
}
function startLoadCSSfile(cssurl) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssurl;
    link.media = 'all';
    head.appendChild(link);
}
class CommandDispatcher {
    registerUI(renderer) {
        this.renderer = renderer;
    }
    showRightMenu() {
        let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
        let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
        this.renderer.menu.showState = !this.renderer.menu.showState;
        this.renderer.menu.resizeMenu(vw, vh);
        this.renderer.menu.resetAllAnchors();
    }
    ;
    resetAnchor(parentSVGGroup, anchor, layerMode) {
        this.renderer.tiler.resetAnchor(parentSVGGroup, anchor, layerMode);
    }
    ;
    changeTapSIze(ratio) {
        console.log('changeTapSIze', ratio, this);
        this.renderer.tiler.setupTapSize(ratio);
        this.renderer.onReSizeView();
        this.renderer.tiler.resetModel();
    }
    promptImportFromMIDI() {
        console.log('promptImportFromMIDI');
        let filesinput = document.getElementById('file_midi_input');
        if (filesinput) {
            console.log('choose');
            let listener = function (ievent) {
                var file = ievent.target.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (progressEvent) {
                    if (progressEvent != null) {
                        var arrayBuffer = progressEvent.target.result;
                        var midiParser = new MidiParser(arrayBuffer);
                        let testSchedule = midiParser.dump();
                        console.log('MZXBX_Schedule', testSchedule);
                    }
                };
                fileReader.readAsArrayBuffer(file);
            };
            filesinput.addEventListener('change', listener, false);
            filesinput.click();
        }
    }
}
let drumNames = [];
drumNames[35] = "Bass Drum 2";
drumNames[36] = "Bass Drum 1";
drumNames[37] = "Side Stick/Rimshot";
drumNames[38] = "Snare Drum 1";
drumNames[39] = "Hand Clap";
drumNames[40] = "Snare Drum 2";
drumNames[41] = "Low Tom 2";
drumNames[42] = "Closed Hi-hat";
drumNames[43] = "Low Tom 1";
drumNames[44] = "Pedal Hi-hat";
drumNames[45] = "Mid Tom 2";
drumNames[46] = "Open Hi-hat";
drumNames[47] = "Mid Tom 1";
drumNames[48] = "High Tom 2";
drumNames[49] = "Crash Cymbal 1";
drumNames[50] = "High Tom 1";
drumNames[51] = "Ride Cymbal 1";
drumNames[52] = "Chinese Cymbal";
drumNames[53] = "Ride Bell";
drumNames[54] = "Tambourine";
drumNames[55] = "Splash Cymbal";
drumNames[56] = "Cowbell";
drumNames[57] = "Crash Cymbal 2";
drumNames[58] = "Vibra Slap";
drumNames[59] = "Ride Cymbal 2";
drumNames[60] = "High Bongo";
drumNames[61] = "Low Bongo";
drumNames[62] = "Mute High Conga";
drumNames[63] = "Open High Conga";
drumNames[64] = "Low Conga";
drumNames[65] = "High Timbale";
drumNames[66] = "Low Timbale";
drumNames[67] = "High Agogo";
drumNames[68] = "Low Agogo";
drumNames[69] = "Cabasa";
drumNames[70] = "Maracas";
drumNames[71] = "Short Whistle";
drumNames[72] = "Long Whistle";
drumNames[73] = "Short Guiro";
drumNames[74] = "Long Guiro";
drumNames[75] = "Claves";
drumNames[76] = "High Wood Block";
drumNames[77] = "Low Wood Block";
drumNames[78] = "Mute Cuica";
drumNames[79] = "Open Cuica";
drumNames[80] = "Mute Triangle";
drumNames[81] = "Open Triangle";
let insNames = [];
insNames[0] = "Acoustic Grand Piano: Piano";
insNames[1] = "Bright Acoustic Piano: Piano";
insNames[2] = "Electric Grand Piano: Piano";
insNames[3] = "Honky-tonk Piano: Piano";
insNames[4] = "Electric Piano 1: Piano";
insNames[5] = "Electric Piano 2: Piano";
insNames[6] = "Harpsichord: Piano";
insNames[7] = "Clavinet: Piano";
insNames[8] = "Celesta: Chromatic Percussion";
insNames[9] = "Glockenspiel: Chromatic Percussion";
insNames[10] = "Music Box: Chromatic Percussion";
insNames[11] = "Vibraphone: Chromatic Percussion";
insNames[12] = "Marimba: Chromatic Percussion";
insNames[13] = "Xylophone: Chromatic Percussion";
insNames[14] = "Tubular Bells: Chromatic Percussion";
insNames[15] = "Dulcimer: Chromatic Percussion";
insNames[16] = "Drawbar Organ: Organ";
insNames[17] = "Percussive Organ: Organ";
insNames[18] = "Rock Organ: Organ";
insNames[19] = "Church Organ: Organ";
insNames[20] = "Reed Organ: Organ";
insNames[21] = "Accordion: Organ";
insNames[22] = "Harmonica: Organ";
insNames[23] = "Tango Accordion: Organ";
insNames[24] = "Acoustic Guitar (nylon): Guitar";
insNames[25] = "Acoustic Guitar (steel): Guitar";
insNames[26] = "Electric Guitar (jazz): Guitar";
insNames[27] = "Electric Guitar (clean): Guitar";
insNames[28] = "Electric Guitar (muted): Guitar";
insNames[29] = "Overdriven Guitar: Guitar";
insNames[30] = "Distortion Guitar: Guitar";
insNames[31] = "Guitar Harmonics: Guitar";
insNames[32] = "Acoustic Bass: Bass";
insNames[33] = "Electric Bass (finger): Bass";
insNames[34] = "Electric Bass (pick): Bass";
insNames[35] = "Fretless Bass: Bass";
insNames[36] = "Slap Bass 1: Bass";
insNames[37] = "Slap Bass 2: Bass";
insNames[38] = "Synth Bass 1: Bass";
insNames[39] = "Synth Bass 2: Bass";
insNames[40] = "Violin: Strings";
insNames[41] = "Viola: Strings";
insNames[42] = "Cello: Strings";
insNames[43] = "Contrabass: Strings";
insNames[44] = "Tremolo Strings: Strings";
insNames[45] = "Pizzicato Strings: Strings";
insNames[46] = "Orchestral Harp: Strings";
insNames[47] = "Timpani: Strings";
insNames[48] = "String Ensemble 1: Ensemble";
insNames[49] = "String Ensemble 2: Ensemble";
insNames[50] = "Synth Strings 1: Ensemble";
insNames[51] = "Synth Strings 2: Ensemble";
insNames[52] = "Choir Aahs: Ensemble";
insNames[53] = "Voice Oohs: Ensemble";
insNames[54] = "Synth Choir: Ensemble";
insNames[55] = "Orchestra Hit: Ensemble";
insNames[56] = "Trumpet: Brass";
insNames[57] = "Trombone: Brass";
insNames[58] = "Tuba: Brass";
insNames[59] = "Muted Trumpet: Brass";
insNames[60] = "French Horn: Brass";
insNames[61] = "Brass Section: Brass";
insNames[62] = "Synth Brass 1: Brass";
insNames[63] = "Synth Brass 2: Brass";
insNames[64] = "Soprano Sax: Reed";
insNames[65] = "Alto Sax: Reed";
insNames[66] = "Tenor Sax: Reed";
insNames[67] = "Baritone Sax: Reed";
insNames[68] = "Oboe: Reed";
insNames[69] = "English Horn: Reed";
insNames[70] = "Bassoon: Reed";
insNames[71] = "Clarinet: Reed";
insNames[72] = "Piccolo: Pipe";
insNames[73] = "Flute: Pipe";
insNames[74] = "Recorder: Pipe";
insNames[75] = "Pan Flute: Pipe";
insNames[76] = "Blown bottle: Pipe";
insNames[77] = "Shakuhachi: Pipe";
insNames[78] = "Whistle: Pipe";
insNames[79] = "Ocarina: Pipe";
insNames[80] = "Lead 1 (square): Synth Lead";
insNames[81] = "Lead 2 (sawtooth): Synth Lead";
insNames[82] = "Lead 3 (calliope): Synth Lead";
insNames[83] = "Lead 4 (chiff): Synth Lead";
insNames[84] = "Lead 5 (charang): Synth Lead";
insNames[85] = "Lead 6 (voice): Synth Lead";
insNames[86] = "Lead 7 (fifths): Synth Lead";
insNames[87] = "Lead 8 (bass + lead): Synth Lead";
insNames[88] = "Pad 1 (new age): Synth Pad";
insNames[89] = "Pad 2 (warm): Synth Pad";
insNames[90] = "Pad 3 (polysynth): Synth Pad";
insNames[91] = "Pad 4 (choir): Synth Pad";
insNames[92] = "Pad 5 (bowed): Synth Pad";
insNames[93] = "Pad 6 (metallic): Synth Pad";
insNames[94] = "Pad 7 (halo): Synth Pad";
insNames[95] = "Pad 8 (sweep): Synth Pad";
insNames[96] = "FX 1 (rain): Synth Effects";
insNames[97] = "FX 2 (soundtrack): Synth Effects";
insNames[98] = "FX 3 (crystal): Synth Effects";
insNames[99] = "FX 4 (atmosphere): Synth Effects";
insNames[100] = "FX 5 (brightness): Synth Effects";
insNames[101] = "FX 6 (goblins): Synth Effects";
insNames[102] = "FX 7 (echoes): Synth Effects";
insNames[103] = "FX 8 (sci-fi): Synth Effects";
insNames[104] = "Sitar: Ethnic";
insNames[105] = "Banjo: Ethnic";
insNames[106] = "Shamisen: Ethnic";
insNames[107] = "Koto: Ethnic";
insNames[108] = "Kalimba: Ethnic";
insNames[109] = "Bagpipe: Ethnic";
insNames[110] = "Fiddle: Ethnic";
insNames[111] = "Shanai: Ethnic";
insNames[112] = "Tinkle Bell: Percussive";
insNames[113] = "Agogo: Percussive";
insNames[114] = "Steel Drums: Percussive";
insNames[115] = "Woodblock: Percussive";
insNames[116] = "Taiko Drum: Percussive";
insNames[117] = "Melodic Tom: Percussive";
insNames[118] = "Synth Drum: Percussive";
insNames[119] = "Reverse Cymbal: Percussive";
insNames[120] = "Guitar Fret Noise: Sound effects";
insNames[121] = "Breath Noise: Sound effects";
insNames[122] = "Seashore: Sound effects";
insNames[123] = "Bird Tweet: Sound effects";
insNames[124] = "Telephone Ring: Sound effects";
insNames[125] = "Helicopter: Sound effects";
insNames[126] = "Applause: Sound effects";
insNames[127] = "Gunshot: Sound effects";
let instrumentNamesArray = [];
let drumNamesArray = [];
function findrumTitles(nn) {
    let name = drumTitles()[nn];
    if (name) {
        return '' + name;
    }
    else {
        return 'MIDI' + nn;
    }
}
function drumTitles() {
    if (drumNamesArray.length == 0) {
        var drumNames = [];
        drumNames[35] = "Bass Drum 2";
        drumNames[36] = "Bass Drum 1";
        drumNames[37] = "Side Stick/Rimshot";
        drumNames[38] = "Snare Drum 1";
        drumNames[39] = "Hand Clap";
        drumNames[40] = "Snare Drum 2";
        drumNames[41] = "Low Tom 2";
        drumNames[42] = "Closed Hi-hat";
        drumNames[43] = "Low Tom 1";
        drumNames[44] = "Pedal Hi-hat";
        drumNames[45] = "Mid Tom 2";
        drumNames[46] = "Open Hi-hat";
        drumNames[47] = "Mid Tom 1";
        drumNames[48] = "High Tom 2";
        drumNames[49] = "Crash Cymbal 1";
        drumNames[50] = "High Tom 1";
        drumNames[51] = "Ride Cymbal 1";
        drumNames[52] = "Chinese Cymbal";
        drumNames[53] = "Ride Bell";
        drumNames[54] = "Tambourine";
        drumNames[55] = "Splash Cymbal";
        drumNames[56] = "Cowbell";
        drumNames[57] = "Crash Cymbal 2";
        drumNames[58] = "Vibra Slap";
        drumNames[59] = "Ride Cymbal 2";
        drumNames[60] = "High Bongo";
        drumNames[61] = "Low Bongo";
        drumNames[62] = "Mute High Conga";
        drumNames[63] = "Open High Conga";
        drumNames[64] = "Low Conga";
        drumNames[65] = "High Timbale";
        drumNames[66] = "Low Timbale";
        drumNames[67] = "High Agogo";
        drumNames[68] = "Low Agogo";
        drumNames[69] = "Cabasa";
        drumNames[70] = "Maracas";
        drumNames[71] = "Short Whistle";
        drumNames[72] = "Long Whistle";
        drumNames[73] = "Short Guiro";
        drumNames[74] = "Long Guiro";
        drumNames[75] = "Claves";
        drumNames[76] = "High Wood Block";
        drumNames[77] = "Low Wood Block";
        drumNames[78] = "Mute Cuica";
        drumNames[79] = "Open Cuica";
        drumNames[80] = "Mute Triangle";
        drumNames[81] = "Open Triangle";
        drumNamesArray = drumNames;
    }
    return drumNamesArray;
}
;
function instrumentTitles() {
    if (instrumentNamesArray.length == 0) {
        var insNames = [];
        insNames[0] = "Acoustic Grand Piano: Piano";
        insNames[1] = "Bright Acoustic Piano: Piano";
        insNames[2] = "Electric Grand Piano: Piano";
        insNames[3] = "Honky-tonk Piano: Piano";
        insNames[4] = "Electric Piano 1: Piano";
        insNames[5] = "Electric Piano 2: Piano";
        insNames[6] = "Harpsichord: Piano";
        insNames[7] = "Clavinet: Piano";
        insNames[8] = "Celesta: Chromatic Percussion";
        insNames[9] = "Glockenspiel: Chromatic Percussion";
        insNames[10] = "Music Box: Chromatic Percussion";
        insNames[11] = "Vibraphone: Chromatic Percussion";
        insNames[12] = "Marimba: Chromatic Percussion";
        insNames[13] = "Xylophone: Chromatic Percussion";
        insNames[14] = "Tubular Bells: Chromatic Percussion";
        insNames[15] = "Dulcimer: Chromatic Percussion";
        insNames[16] = "Drawbar Organ: Organ";
        insNames[17] = "Percussive Organ: Organ";
        insNames[18] = "Rock Organ: Organ";
        insNames[19] = "Church Organ: Organ";
        insNames[20] = "Reed Organ: Organ";
        insNames[21] = "Accordion: Organ";
        insNames[22] = "Harmonica: Organ";
        insNames[23] = "Tango Accordion: Organ";
        insNames[24] = "Acoustic Guitar (nylon): Guitar";
        insNames[25] = "Acoustic Guitar (steel): Guitar";
        insNames[26] = "Electric Guitar (jazz): Guitar";
        insNames[27] = "Electric Guitar (clean): Guitar";
        insNames[28] = "Electric Guitar (muted): Guitar";
        insNames[29] = "Overdriven Guitar: Guitar";
        insNames[30] = "Distortion Guitar: Guitar";
        insNames[31] = "Guitar Harmonics: Guitar";
        insNames[32] = "Acoustic Bass: Bass";
        insNames[33] = "Electric Bass (finger): Bass";
        insNames[34] = "Electric Bass (pick): Bass";
        insNames[35] = "Fretless Bass: Bass";
        insNames[36] = "Slap Bass 1: Bass";
        insNames[37] = "Slap Bass 2: Bass";
        insNames[38] = "Synth Bass 1: Bass";
        insNames[39] = "Synth Bass 2: Bass";
        insNames[40] = "Violin: Strings";
        insNames[41] = "Viola: Strings";
        insNames[42] = "Cello: Strings";
        insNames[43] = "Contrabass: Strings";
        insNames[44] = "Tremolo Strings: Strings";
        insNames[45] = "Pizzicato Strings: Strings";
        insNames[46] = "Orchestral Harp: Strings";
        insNames[47] = "Timpani: Strings";
        insNames[48] = "String Ensemble 1: Ensemble";
        insNames[49] = "String Ensemble 2: Ensemble";
        insNames[50] = "Synth Strings 1: Ensemble";
        insNames[51] = "Synth Strings 2: Ensemble";
        insNames[52] = "Choir Aahs: Ensemble";
        insNames[53] = "Voice Oohs: Ensemble";
        insNames[54] = "Synth Choir: Ensemble";
        insNames[55] = "Orchestra Hit: Ensemble";
        insNames[56] = "Trumpet: Brass";
        insNames[57] = "Trombone: Brass";
        insNames[58] = "Tuba: Brass";
        insNames[59] = "Muted Trumpet: Brass";
        insNames[60] = "French Horn: Brass";
        insNames[61] = "Brass Section: Brass";
        insNames[62] = "Synth Brass 1: Brass";
        insNames[63] = "Synth Brass 2: Brass";
        insNames[64] = "Soprano Sax: Reed";
        insNames[65] = "Alto Sax: Reed";
        insNames[66] = "Tenor Sax: Reed";
        insNames[67] = "Baritone Sax: Reed";
        insNames[68] = "Oboe: Reed";
        insNames[69] = "English Horn: Reed";
        insNames[70] = "Bassoon: Reed";
        insNames[71] = "Clarinet: Reed";
        insNames[72] = "Piccolo: Pipe";
        insNames[73] = "Flute: Pipe";
        insNames[74] = "Recorder: Pipe";
        insNames[75] = "Pan Flute: Pipe";
        insNames[76] = "Blown bottle: Pipe";
        insNames[77] = "Shakuhachi: Pipe";
        insNames[78] = "Whistle: Pipe";
        insNames[79] = "Ocarina: Pipe";
        insNames[80] = "Lead 1 (square): Synth Lead";
        insNames[81] = "Lead 2 (sawtooth): Synth Lead";
        insNames[82] = "Lead 3 (calliope): Synth Lead";
        insNames[83] = "Lead 4 (chiff): Synth Lead";
        insNames[84] = "Lead 5 (charang): Synth Lead";
        insNames[85] = "Lead 6 (voice): Synth Lead";
        insNames[86] = "Lead 7 (fifths): Synth Lead";
        insNames[87] = "Lead 8 (bass + lead): Synth Lead";
        insNames[88] = "Pad 1 (new age): Synth Pad";
        insNames[89] = "Pad 2 (warm): Synth Pad";
        insNames[90] = "Pad 3 (polysynth): Synth Pad";
        insNames[91] = "Pad 4 (choir): Synth Pad";
        insNames[92] = "Pad 5 (bowed): Synth Pad";
        insNames[93] = "Pad 6 (metallic): Synth Pad";
        insNames[94] = "Pad 7 (halo): Synth Pad";
        insNames[95] = "Pad 8 (sweep): Synth Pad";
        insNames[96] = "FX 1 (rain): Synth Effects";
        insNames[97] = "FX 2 (soundtrack): Synth Effects";
        insNames[98] = "FX 3 (crystal): Synth Effects";
        insNames[99] = "FX 4 (atmosphere): Synth Effects";
        insNames[100] = "FX 5 (brightness): Synth Effects";
        insNames[101] = "FX 6 (goblins): Synth Effects";
        insNames[102] = "FX 7 (echoes): Synth Effects";
        insNames[103] = "FX 8 (sci-fi): Synth Effects";
        insNames[104] = "Sitar: Ethnic";
        insNames[105] = "Banjo: Ethnic";
        insNames[106] = "Shamisen: Ethnic";
        insNames[107] = "Koto: Ethnic";
        insNames[108] = "Kalimba: Ethnic";
        insNames[109] = "Bagpipe: Ethnic";
        insNames[110] = "Fiddle: Ethnic";
        insNames[111] = "Shanai: Ethnic";
        insNames[112] = "Tinkle Bell: Percussive";
        insNames[113] = "Agogo: Percussive";
        insNames[114] = "Steel Drums: Percussive";
        insNames[115] = "Woodblock: Percussive";
        insNames[116] = "Taiko Drum: Percussive";
        insNames[117] = "Melodic Tom: Percussive";
        insNames[118] = "Synth Drum: Percussive";
        insNames[119] = "Reverse Cymbal: Percussive";
        insNames[120] = "Guitar Fret Noise: Sound effects";
        insNames[121] = "Breath Noise: Sound effects";
        insNames[122] = "Seashore: Sound effects";
        insNames[123] = "Bird Tweet: Sound effects";
        insNames[124] = "Telephone Ring: Sound effects";
        insNames[125] = "Helicopter: Sound effects";
        insNames[126] = "Applause: Sound effects";
        insNames[127] = "Gunshot: Sound effects";
        instrumentNamesArray = insNames;
    }
    return instrumentNamesArray;
}
;
class DataViewStream {
    constructor(dv) {
        this.position = 0;
        this.buffer = dv;
    }
    readUint8() {
        var n = this.buffer.getUint8(this.position);
        this.position++;
        return n;
    }
    readUint16() {
        var v = this.buffer.getUint16(this.position);
        this.position = this.position + 2;
        return v;
    }
    readVarInt() {
        var v = 0;
        var i = 0;
        var b;
        while (i < 4) {
            b = this.readUint8();
            if (b & 0x80) {
                v = v + (b & 0x7f);
                v = v << 7;
            }
            else {
                return v + b;
            }
            i++;
        }
        throw new Error('readVarInt ' + i);
    }
    readBytes(length) {
        var bytes = [];
        for (var i = 0; i < length; i++) {
            bytes.push(this.readUint8());
        }
        return bytes;
    }
    offset() {
        return this.buffer.byteOffset + this.position;
    }
    end() {
        return this.position == this.buffer.byteLength;
    }
}
class MIDIFileHeader {
    constructor(buffer) {
        this.HEADER_LENGTH = 14;
        this.tempoBPM = 120;
        this.changes = [];
        this.meters = [];
        this.lyrics = [];
        this.signs = [];
        this.meterCount = 4;
        this.meterDivision = 4;
        this.keyFlatSharp = 0;
        this.keyMajMin = 0;
        this.lastNonZeroQuarter = 0;
        this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
        this.format = this.datas.getUint16(8);
        this.trackCount = this.datas.getUint16(10);
    }
    getCalculatedTickResolution(tempo) {
        this.lastNonZeroQuarter = tempo;
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    get0TickResolution() {
        var tempo = 0;
        if (this.lastNonZeroQuarter) {
            tempo = this.lastNonZeroQuarter;
        }
        else {
            tempo = 60000000 / this.tempoBPM;
        }
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    getTicksPerBeat() {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord;
    }
    getTicksPerFrame() {
        const divisionWord = this.datas.getUint16(12);
        return divisionWord & 0x00ff;
    }
    getSMPTEFrames() {
        const divisionWord = this.datas.getUint16(12);
        let smpteFrames;
        smpteFrames = divisionWord & 0x7f00;
        if (smpteFrames == 29) {
            return 29.97;
        }
        else {
            return smpteFrames;
        }
    }
}
class LastKeyVal {
    constructor() {
        this.data = [];
    }
    take(keyName) {
        for (let ii = 0; ii < this.data.length; ii++) {
            if (this.data[ii].name == keyName) {
                return this.data[ii];
            }
        }
        let newit = { name: keyName, value: -1 };
        this.data.push(newit);
        return newit;
    }
}
class MIDIFileTrack {
    constructor(buffer, start) {
        this.HDR_LENGTH = 8;
        this.chords = [];
        this.datas = new DataView(buffer, start, this.HDR_LENGTH);
        this.trackLength = this.datas.getUint32(4);
        this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
        this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
        this.trackevents = [];
        this.trackVolumePoints = [];
        this.programChannel = [];
    }
}
function utf8ArrayToString(aBytes) {
    var sView = "";
    for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
        nPart = aBytes[nIdx];
        sView += String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen ?
            (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ?
                (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ?
                    (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                    : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ?
                        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                        : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ?
                            (nPart - 192 << 6) + aBytes[++nIdx] - 128
                            :
                                nPart);
    }
    return sView;
}
class MidiParser {
    constructor(arrayBuffer) {
        this.instrumentNamesArray = [];
        this.drumNamesArray = [];
        this.EVENT_META = 0xff;
        this.EVENT_SYSEX = 0xf0;
        this.EVENT_DIVSYSEX = 0xf7;
        this.EVENT_MIDI = 0x8;
        this.EVENT_META_SEQUENCE_NUMBER = 0x00;
        this.EVENT_META_TEXT = 0x01;
        this.EVENT_META_COPYRIGHT_NOTICE = 0x02;
        this.EVENT_META_TRACK_NAME = 0x03;
        this.EVENT_META_INSTRUMENT_NAME = 0x04;
        this.EVENT_META_LYRICS = 0x05;
        this.EVENT_META_MARKER = 0x06;
        this.EVENT_META_CUE_POINT = 0x07;
        this.EVENT_META_MIDI_CHANNEL_PREFIX = 0x20;
        this.EVENT_META_END_OF_TRACK = 0x2f;
        this.EVENT_META_SET_TEMPO = 0x51;
        this.EVENT_META_SMTPE_OFFSET = 0x54;
        this.EVENT_META_TIME_SIGNATURE = 0x58;
        this.EVENT_META_KEY_SIGNATURE = 0x59;
        this.EVENT_META_SEQUENCER_SPECIFIC = 0x7f;
        this.EVENT_MIDI_NOTE_OFF = 0x8;
        this.EVENT_MIDI_NOTE_ON = 0x9;
        this.EVENT_MIDI_NOTE_AFTERTOUCH = 0xa;
        this.EVENT_MIDI_CONTROLLER = 0xb;
        this.EVENT_MIDI_PROGRAM_CHANGE = 0xc;
        this.EVENT_MIDI_CHANNEL_AFTERTOUCH = 0xd;
        this.EVENT_MIDI_PITCH_BEND = 0xe;
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        this.controller_coarseVolume = 0x07;
        this.controller_coarseDataEntrySlider = 0x06;
        this.controller_fineDataEntrySlider = 0x26;
        this.controller_coarseRPN = 0x65;
        this.controller_fineRPN = 0x64;
        this.header = new MIDIFileHeader(arrayBuffer);
        this.parseTracks(arrayBuffer);
    }
    parseTracks(arrayBuffer) {
        var curIndex = this.header.HEADER_LENGTH;
        var trackCount = this.header.trackCount;
        this.parsedTracks = [];
        for (var i = 0; i < trackCount; i++) {
            var track = new MIDIFileTrack(arrayBuffer, curIndex);
            this.parsedTracks.push(track);
            curIndex = curIndex + track.trackLength + 8;
        }
        for (var i = 0; i < this.parsedTracks.length; i++) {
            this.parseTrackEvents(this.parsedTracks[i]);
        }
        this.parseNotes();
        this.simplifyAllPaths();
    }
    toText(arr) {
        let txt = '?';
        try {
            let win1251decoder = new TextDecoder("windows-1251");
            let bytes = new Uint8Array(arr);
            txt = win1251decoder.decode(bytes);
        }
        catch (xx) {
            console.log(xx);
            var rr = '';
            for (var ii = 0; ii < arr.length; ii++) {
                rr = rr + String.fromCharCode(arr[ii]);
            }
            txt = rr;
        }
        return txt;
    }
    findChordBefore(when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            var chord = track.chords[track.chords.length - i - 1];
            if (chord.when < when && chord.channel == channel) {
                return chord;
            }
        }
        return null;
    }
    findOpenedNoteBefore(firstPitch, when, track, channel) {
        var before = when;
        var chord = this.findChordBefore(before, track, channel);
        while (chord) {
            for (var i = 0; i < chord.notes.length; i++) {
                var note = chord.notes[i];
                if (!(note.closed)) {
                    if (firstPitch == note.points[0].pitch) {
                        return { chord: chord, note: note };
                    }
                }
            }
            before = chord.when;
            chord = this.findChordBefore(before, track, channel);
        }
        return null;
    }
    takeChord(when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            if (track.chords[i].when == when && track.chords[i].channel == channel) {
                return track.chords[i];
            }
        }
        var ch = {
            when: when,
            channel: channel,
            notes: []
        };
        track.chords.push(ch);
        return ch;
    }
    takeOpenedNote(first, when, track, channel) {
        var chord = this.takeChord(when, track, channel);
        for (var i = 0; i < chord.notes.length; i++) {
            if (!(chord.notes[i].closed)) {
                if (chord.notes[i].points[0].pitch == first) {
                    return chord.notes[i];
                }
            }
        }
        var pi = { closed: false, points: [] };
        pi.points.push({ pointDuration: -1, pitch: first });
        chord.notes.push(pi);
        return pi;
    }
    distanceToPoint(line, point) {
        var m = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
        var b = line.p1.y - (m * line.p1.x);
        var d = [];
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
        d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
        d.sort(function (a, b) {
            return (a - b);
        });
        return d[0];
    }
    ;
    douglasPeucker(points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }
        var returnPoints = [];
        var line = { p1: points[0], p2: points[points.length - 1] };
        var maxDistance = 0;
        var maxDistanceIndex = 0;
        var p;
        for (var i = 1; i <= points.length - 2; i++) {
            var distance = this.distanceToPoint(line, points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }
        if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
        }
        else {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = [points[0]];
        }
        return returnPoints;
    }
    ;
    simplifyPath(points, tolerance) {
        var arr = this.douglasPeucker(points, tolerance);
        arr.push(points[points.length - 1]);
        return arr;
    }
    simplifyAllPaths() {
        for (var t = 0; t < this.parsedTracks.length; t++) {
            var track = this.parsedTracks[t];
            for (var ch = 0; ch < track.chords.length; ch++) {
                var chord = track.chords[ch];
                for (var n = 0; n < chord.notes.length; n++) {
                    var note = chord.notes[n];
                    if (note.points.length > 5) {
                        var xx = 0;
                        var pnts = [];
                        for (var p = 0; p < note.points.length; p++) {
                            note.points[p].pointDuration = Math.max(note.points[p].pointDuration, 0);
                            pnts.push({ x: xx, y: note.points[p].pitch });
                            xx = xx + note.points[p].pointDuration;
                        }
                        pnts.push({ x: xx, y: note.points[note.points.length - 1].pitch });
                        var lessPoints = this.simplifyPath(pnts, 1.5);
                        note.points = [];
                        for (var p = 0; p < lessPoints.length - 1; p++) {
                            var xypoint = lessPoints[p];
                            var xyduration = lessPoints[p + 1].x - xypoint.x;
                            note.points.push({ pointDuration: xyduration, pitch: xypoint.y });
                        }
                    }
                    else {
                        if (note.points.length == 1) {
                            if (note.points[0].pointDuration > 4321) {
                                note.points[0].pointDuration = 1234;
                            }
                        }
                    }
                }
            }
        }
    }
    dumpResolutionChanges() {
        this.header.changes = [];
        let tickResolution = this.header.get0TickResolution();
        this.header.changes.push({ track: -1, ms: -1, resolution: tickResolution, bpm: 120 });
        for (var t = 0; t < this.parsedTracks.length; t++) {
            var track = this.parsedTracks[t];
            let playTimeTicks = 0;
            for (var e = 0; e < track.trackevents.length; e++) {
                var evnt = track.trackevents[e];
                let curDelta = 0.0;
                if (evnt.delta)
                    curDelta = evnt.delta;
                playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
                if (evnt.basetype === this.EVENT_META) {
                    if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
                        if (evnt.tempo) {
                            tickResolution = this.header.getCalculatedTickResolution(evnt.tempo);
                            this.header.changes.push({ track: t, ms: playTimeTicks, resolution: tickResolution, bpm: (evnt.tempoBPM) ? evnt.tempoBPM : 120 });
                        }
                    }
                }
            }
        }
        this.header.changes.sort((a, b) => { return a.ms - b.ms; });
    }
    lastResolution(ms) {
        for (var i = this.header.changes.length - 1; i >= 0; i--) {
            if (this.header.changes[i].ms <= ms) {
                return this.header.changes[i].resolution;
            }
        }
        return 0;
    }
    parseTicks2time(track) {
        let tickResolution = this.lastResolution(0);
        let playTimeTicks = 0;
        for (let e = 0; e < track.trackevents.length; e++) {
            let evnt = track.trackevents[e];
            let curDelta = 0.0;
            if (evnt.delta)
                curDelta = evnt.delta;
            let searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            tickResolution = this.lastResolution(searchPlayTimeTicks);
            evnt.preTimeMs = playTimeTicks;
            playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            evnt.playTimeMs = playTimeTicks;
            evnt.deltaTimeMs = curDelta * tickResolution / 1000.0;
        }
    }
    parseNotes() {
        this.dumpResolutionChanges();
        var expectedPitchBendRangeMessageNumber = 1;
        var expectedPitchBendRangeChannel = null;
        var pitchBendRange = Array(16).fill(2);
        for (let t = 0; t < this.parsedTracks.length; t++) {
            var singleParsedTrack = this.parsedTracks[t];
            this.parseTicks2time(singleParsedTrack);
            for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
                var expectedPitchBendRangeMessageNumberOld = expectedPitchBendRangeMessageNumber;
                var evnt = singleParsedTrack.trackevents[e];
                if (evnt.basetype == this.EVENT_MIDI) {
                    evnt.param1 = evnt.param1 ? evnt.param1 : 0;
                    if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                        if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                            var pitch = evnt.param1 ? evnt.param1 : 0;
                            var when = 0;
                            if (evnt.playTimeMs)
                                when = evnt.playTimeMs;
                            let trno = this.takeOpenedNote(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                            trno.volume = evnt.param2;
                            trno.openEvent = evnt;
                        }
                    }
                    else {
                        if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
                            if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                var pitch = evnt.param1 ? evnt.param1 : 0;
                                var when = 0;
                                if (evnt.playTimeMs)
                                    when = evnt.playTimeMs;
                                var chpi = this.findOpenedNoteBefore(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                if (chpi) {
                                    var duration = 0;
                                    for (var i = 0; i < chpi.note.points.length - 1; i++) {
                                        duration = duration + chpi.note.points[i].pointDuration;
                                    }
                                    chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
                                    chpi.note.closed = true;
                                    chpi.note.closeEvent = evnt;
                                }
                            }
                        }
                        else {
                            if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
                                if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                    singleParsedTrack.programChannel.push({
                                        program: evnt.param1 ? evnt.param1 : 0,
                                        channel: evnt.midiChannel ? evnt.midiChannel : 0
                                    });
                                }
                            }
                            else {
                                if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
                                    var when = evnt.playTimeMs ? evnt.playTimeMs : 0;
                                    var chord = this.findChordBefore(when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                    if (chord) {
                                        for (var i = 0; i < chord.notes.length; i++) {
                                            var note = chord.notes[i];
                                            if (!(note.closed)) {
                                                var duration = 0;
                                                for (var k = 0; k < note.points.length - 1; k++) {
                                                    duration = duration + note.points[k].pointDuration;
                                                }
                                                note.points[note.points.length - 1].pointDuration = when - chord.when - duration;
                                                let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                                var firstpitch = note.points[0].pitch + pitchBendRange[idx];
                                                var point = {
                                                    pointDuration: -1,
                                                    pitch: firstpitch
                                                };
                                                note.points.push(point);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (evnt.subtype == this.EVENT_MIDI_CONTROLLER) {
                                        if (evnt.param1 == this.controller_coarseVolume) {
                                            var v = evnt.param2 ? evnt.param2 / 127 : 0;
                                            let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
                                            singleParsedTrack.trackVolumePoints.push(point);
                                        }
                                        else {
                                            if ((expectedPitchBendRangeMessageNumber == 1 && evnt.param1 == this.controller_coarseRPN && evnt.param2 == 0x00) ||
                                                (expectedPitchBendRangeMessageNumber == 2 && evnt.param1 == this.controller_fineRPN && evnt.param2 == 0x00) ||
                                                (expectedPitchBendRangeMessageNumber == 3 && evnt.param1 == this.controller_coarseDataEntrySlider) ||
                                                (expectedPitchBendRangeMessageNumber == 4 && evnt.param1 == this.controller_fineDataEntrySlider)) {
                                                if (expectedPitchBendRangeMessageNumber > 1 && evnt.midiChannel != expectedPitchBendRangeChannel) {
                                                    console.log('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
                                                }
                                                expectedPitchBendRangeChannel = evnt.midiChannel;
                                                let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                                if (expectedPitchBendRangeMessageNumber == 3) {
                                                    pitchBendRange[idx] = evnt.param2;
                                                    console.log('pitchBendRange', pitchBendRange);
                                                }
                                                if (expectedPitchBendRangeMessageNumber == 4) {
                                                    let pp = evnt.param2 ? evnt.param2 : 0;
                                                    pitchBendRange[idx] = pitchBendRange[idx] + pp / 100;
                                                    console.log('pitchBendRange', pitchBendRange);
                                                }
                                                expectedPitchBendRangeMessageNumber++;
                                                if (expectedPitchBendRangeMessageNumber == 5) {
                                                    expectedPitchBendRangeMessageNumber = 1;
                                                }
                                            }
                                            else {
                                                console.log('controller', evnt.playTimeMs, 'ms, channel', evnt.midiChannel, ':', evnt.param1, evnt.param2);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (evnt.subtype == this.EVENT_META_TEXT) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
                        singleParsedTrack.title = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
                        singleParsedTrack.instrument = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {
                        var majSharpCircleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
                        var majFlatCircleOfFifths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
                        var minSharpCircleOfFifths = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#'];
                        var minFlatCircleOfFifths = ['Am', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];
                        var key = evnt.key ? evnt.key : 0;
                        if (key > 127)
                            key = key - 256;
                        this.header.keyFlatSharp = key;
                        this.header.keyMajMin = evnt.scale ? evnt.scale : 0;
                        var signature = 'C';
                        if (this.header.keyFlatSharp >= 0) {
                            if (this.header.keyMajMin < 1) {
                                signature = majSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                            else {
                                signature = minSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                        }
                        else {
                            if (this.header.keyMajMin < 1) {
                                signature = majFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                            else {
                                signature = minFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                        }
                        this.header.signs.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
                    }
                    if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
                        this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
                    }
                    if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
                        this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
                        var dvsn = evnt.param2 ? evnt.param2 : 2;
                        if (dvsn == 1)
                            this.header.meterDivision = 2;
                        else if (dvsn == 2)
                            this.header.meterDivision = 4;
                        else if (dvsn == 3)
                            this.header.meterDivision = 8;
                        else if (dvsn == 4)
                            this.header.meterDivision = 16;
                        else if (dvsn == 5)
                            this.header.meterDivision = 32;
                        this.header.meters.push({
                            track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0,
                            count: this.header.meterCount, division: this.header.meterDivision
                        });
                    }
                }
                if (expectedPitchBendRangeMessageNumberOld == expectedPitchBendRangeMessageNumber) {
                    if (expectedPitchBendRangeMessageNumberOld >= 2 && expectedPitchBendRangeMessageNumberOld <= 3) {
                        throw Error('Pitch-bend RANGE (SENSITIVITY) messages ended prematurely. MIDI file might be corrupt.');
                    }
                    if (expectedPitchBendRangeMessageNumberOld == 4) {
                        expectedPitchBendRangeMessageNumber = 1;
                    }
                }
            }
        }
    }
    nextEvent(stream) {
        var index = stream.offset();
        var delta = stream.readVarInt();
        var eventTypeByte = stream.readUint8();
        var event = { offset: index, delta: delta, eventTypeByte: eventTypeByte, playTimeMs: 0 };
        if (0xf0 === (eventTypeByte & 0xf0)) {
            if (eventTypeByte === this.EVENT_META) {
                event.basetype = this.EVENT_META;
                event.subtype = stream.readUint8();
                event.length = stream.readVarInt();
                switch (event.subtype) {
                    case this.EVENT_META_SEQUENCE_NUMBER:
                        event.msb = stream.readUint8();
                        event.lsb = stream.readUint8();
                        console.log('EVENT_META_SEQUENCE_NUMBER', event);
                        return event;
                    case this.EVENT_META_TEXT:
                    case this.EVENT_META_COPYRIGHT_NOTICE:
                    case this.EVENT_META_TRACK_NAME:
                    case this.EVENT_META_INSTRUMENT_NAME:
                    case this.EVENT_META_LYRICS:
                    case this.EVENT_META_MARKER:
                    case this.EVENT_META_CUE_POINT:
                        event.data = stream.readBytes(event.length);
                        event.text = this.toText(event.data ? event.data : []);
                        return event;
                    case this.EVENT_META_MIDI_CHANNEL_PREFIX:
                        event.prefix = stream.readUint8();
                        return event;
                    case this.EVENT_META_END_OF_TRACK:
                        return event;
                    case this.EVENT_META_SET_TEMPO:
                        event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
                        event.tempoBPM = 60000000 / event.tempo;
                        return event;
                    case this.EVENT_META_SMTPE_OFFSET:
                        event.hour = stream.readUint8();
                        event.minutes = stream.readUint8();
                        event.seconds = stream.readUint8();
                        event.frames = stream.readUint8();
                        event.subframes = stream.readUint8();
                        return event;
                    case this.EVENT_META_KEY_SIGNATURE:
                        event.key = stream.readUint8();
                        event.scale = stream.readUint8();
                        return event;
                    case this.EVENT_META_TIME_SIGNATURE:
                        event.data = stream.readBytes(event.length);
                        event.param1 = event.data[0];
                        event.param2 = event.data[1];
                        event.param3 = event.data[2];
                        event.param4 = event.data[3];
                        return event;
                    case this.EVENT_META_SEQUENCER_SPECIFIC:
                        event.data = stream.readBytes(event.length);
                        return event;
                    default:
                        event.data = stream.readBytes(event.length);
                        return event;
                }
            }
            else {
                if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
                    event.basetype = eventTypeByte;
                    event.length = stream.readVarInt();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
                else {
                    event.basetype = eventTypeByte;
                    event.badsubtype = stream.readVarInt();
                    event.length = stream.readUint8();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
            }
        }
        else {
            if (0 === (eventTypeByte & 0x80)) {
                if (!this.midiEventType) {
                    throw new Error('no pre event' + stream.offset());
                }
                this.midiEventParam1 = eventTypeByte;
            }
            else {
                this.midiEventType = eventTypeByte >> 4;
                this.midiEventChannel = eventTypeByte & 0x0f;
                this.midiEventParam1 = stream.readUint8();
            }
            event.basetype = this.EVENT_MIDI;
            event.subtype = this.midiEventType;
            event.midiChannel = this.midiEventChannel;
            event.param1 = this.midiEventParam1;
            switch (this.midiEventType) {
                case this.EVENT_MIDI_NOTE_OFF:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_NOTE_ON:
                    event.param2 = stream.readUint8();
                    if (!event.param2) {
                        event.subtype = this.EVENT_MIDI_NOTE_OFF;
                        event.param2 = -1;
                    }
                    return event;
                case this.EVENT_MIDI_NOTE_AFTERTOUCH:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_CONTROLLER:
                    event.param2 = stream.readUint8();
                    if (event.param1 == 7) {
                    }
                    return event;
                case this.EVENT_MIDI_PROGRAM_CHANGE:
                    return event;
                case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
                    return event;
                case this.EVENT_MIDI_PITCH_BEND:
                    event.param2 = stream.readUint8();
                    return event;
                default:
                    console.log('unknown note', event);
                    return event;
            }
        }
    }
    parseTrackEvents(track) {
        var stream = new DataViewStream(track.trackContent);
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        while (!stream.end()) {
            var e = this.nextEvent(stream);
            track.trackevents.push(e);
        }
    }
    findOrCreateTrack(parsedtrack, trackNum, channelNum, trackChannel) {
        for (let i = 0; i < trackChannel.length; i++) {
            if (trackChannel[i].trackNum == trackNum && trackChannel[i].channelNum == channelNum) {
                return trackChannel[i];
            }
        }
        let it = {
            trackNum: trackNum, channelNum: channelNum, track: {
                order: 0,
                title: parsedtrack.title,
                channelNum: channelNum,
                trackVolumes: [],
                program: -1,
                songchords: []
            }
        };
        for (let vv = 0; vv < parsedtrack.trackVolumePoints.length; vv++) {
            if (parsedtrack.trackVolumePoints[vv].channel == it.track.channelNum) {
                it.track.trackVolumes.push(parsedtrack.trackVolumePoints[vv]);
            }
        }
        trackChannel.push(it);
        return it;
    }
    dump() {
        console.log('MidiParser', this);
        let midiSongData = {
            parser: '1.01',
            duration: 0,
            bpm: this.header.tempoBPM,
            changes: this.header.changes,
            lyrics: this.header.lyrics,
            key: this.header.keyFlatSharp,
            mode: this.header.keyMajMin,
            meter: { count: this.header.meterCount, division: this.header.meterDivision },
            meters: this.header.meters,
            signs: this.header.signs,
            miditracks: [],
            speedMode: 0,
            lineMode: 0
        };
        let tracksChannels = [];
        for (let i = 0; i < this.parsedTracks.length; i++) {
            let parsedtrack = this.parsedTracks[i];
            for (let k = 0; k < parsedtrack.programChannel.length; k++) {
                this.findOrCreateTrack(parsedtrack, i, parsedtrack.programChannel[k].channel, tracksChannels);
            }
        }
        var maxWhen = 0;
        for (var i = 0; i < this.parsedTracks.length; i++) {
            var miditrack = this.parsedTracks[i];
            for (var ch = 0; ch < miditrack.chords.length; ch++) {
                var midichord = miditrack.chords[ch];
                var newchord = { when: midichord.when, notes: [], channel: midichord.channel };
                if (maxWhen < midichord.when) {
                    maxWhen = midichord.when;
                }
                for (var n = 0; n < midichord.notes.length; n++) {
                    var midinote = midichord.notes[n];
                    var newnote = { points: [] };
                    newchord.notes.push(newnote);
                    for (var v = 0; v < midinote.points.length; v++) {
                        var midipoint = midinote.points[v];
                        var newpoint = { pitch: midipoint.pitch, durationms: midipoint.pointDuration };
                        newpoint.midipoint = midinote;
                        newnote.points.push(newpoint);
                    }
                    newnote.points[newnote.points.length - 1].durationms = newnote.points[newnote.points.length - 1].durationms + 66;
                }
                let chanTrack = this.findOrCreateTrack(miditrack, i, newchord.channel, tracksChannels);
                chanTrack.track.songchords.push(newchord);
            }
        }
        for (let tt = 0; tt < tracksChannels.length; tt++) {
            let trackChan = tracksChannels[tt];
            if (trackChan.track.songchords.length > 0) {
                midiSongData.miditracks.push(tracksChannels[tt].track);
                if (midiSongData.duration < maxWhen) {
                    midiSongData.duration = 54321 + maxWhen;
                }
                for (let i = 0; i < this.parsedTracks.length; i++) {
                    let miditrack = this.parsedTracks[i];
                    for (let kk = 0; kk < miditrack.programChannel.length; kk++) {
                        if (miditrack.programChannel[kk].channel == trackChan.channelNum) {
                            trackChan.track.program = miditrack.programChannel[kk].program;
                        }
                    }
                }
            }
        }
        console.log('MIDISongData', midiSongData);
        let schedule = {
            series: [],
            channels: [],
            filters: []
        };
        let volumeCashe = new LastKeyVal();
        for (let mt = 0; mt < midiSongData.miditracks.length; mt++) {
            let miditrack = midiSongData.miditracks[mt];
            let midinum = 1 + Math.round(miditrack.program);
            for (let ch = 0; ch < miditrack.songchords.length; ch++) {
                let chord = miditrack.songchords[ch];
                for (let nn = 0; nn < chord.notes.length; nn++) {
                    let note = chord.notes[nn];
                    let timeIndex = Math.floor(chord.when / 1000.0);
                    let channelId = 'voice' + mt;
                    let tID = 'voice' + mt + 'subVolume';
                    if (miditrack.channelNum == 9) {
                        channelId = 'drum' + mt + '.' + note.points[0].pitch;
                        tID = 'drum' + mt + '.' + note.points[0].pitch + 'subVolume';
                    }
                    let timeSkip = chord.when / 1000 - timeIndex;
                    if (timeSkip < 0)
                        timeSkip = 0;
                    let item = {
                        skip: timeSkip,
                        channelId: channelId,
                        pitch: note.points[0].pitch,
                        slides: []
                    };
                    item.slides.push({ duration: note.points[0].durationms / 1000, delta: 0 });
                    if (miditrack.channelNum == 9) {
                    }
                    else {
                        if (note.points.length > 1) {
                            for (let pp = 0; pp < note.points.length - 1; pp++) {
                                item.slides.push({
                                    duration: note.points[pp].durationms / 1000,
                                    delta: note.points[pp + 1].pitch - item.pitch
                                });
                            }
                            item.slides.push({
                                duration: note.points[note.points.length - 1].durationms / 1000,
                                delta: note.points[note.points.length - 1].pitch - item.pitch
                            });
                        }
                    }
                    if (note.points[0].midipoint) {
                        if (note.points[0].midipoint.volume) {
                            let volVal = Math.round(100 * note.points[0].midipoint.volume / 127);
                            let lastVol = volumeCashe.take(tID);
                            if (lastVol.value == volVal) {
                            }
                            else {
                                lastVol.value = volVal;
                                let newVol = '' + volVal + '%';
                                for (let ii = 0; ii <= timeIndex; ii++) {
                                    if (!(schedule.series[ii])) {
                                        schedule.series[ii] = { duration: 1, items: [], states: [] };
                                    }
                                }
                                schedule.series[timeIndex].states.push({
                                    skip: item.skip,
                                    filterId: tID,
                                    data: newVol
                                });
                            }
                        }
                    }
                    for (let ii = 0; ii <= timeIndex; ii++) {
                        if (!(schedule.series[ii])) {
                            schedule.series[ii] = { duration: 1, items: [], states: [] };
                        }
                    }
                    schedule.series[timeIndex].items.push(item);
                    let exsts = false;
                    for (let ch = 0; ch < schedule.channels.length; ch++) {
                        if (schedule.channels[ch].id == channelId) {
                            exsts = true;
                            break;
                        }
                    }
                    if (!exsts) {
                        if (miditrack.channelNum == 9) {
                            let drumNum = note.points[0].pitch;
                            let performerKind = 'drums_performer_1_test';
                            if (drumNum < 35 || drumNum > 81) {
                                performerKind = 'emptySilent';
                            }
                            let volumeID = 'drum' + mt + '.' + drumNum + 'volume';
                            let tID = 'drum' + mt + '.' + drumNum + 'subVolume';
                            let comment = miditrack.title + ' [' + drumNum + ': ' + drumNames[drumNum] + ': drums]';
                            schedule.channels.push({
                                id: channelId, comment: comment, filters: [
                                    { id: volumeID, kind: 'volume_filter_1_test', properties: '100%' },
                                    { id: tID, kind: 'volume_filter_1_test', properties: '100%' }
                                ],
                                performer: { id: 'drum' + mt + '.' + drumNum + 'performer', kind: performerKind, properties: '' + drumNum }
                            });
                            for (let vv = 0; vv < miditrack.trackVolumes.length; vv++) {
                                let setIndex = Math.floor(miditrack.trackVolumes[vv].ms / 1000.0);
                                for (let ii = 0; ii <= setIndex; ii++) {
                                    if (!(schedule.series[ii])) {
                                        schedule.series[ii] = { duration: 1, items: [], states: [] };
                                    }
                                }
                                schedule.series[setIndex].states.push({
                                    skip: (Math.round(miditrack.trackVolumes[vv].ms) % 1000.0) / 1000.0,
                                    filterId: volumeID,
                                    data: '' + Math.round(100 * miditrack.trackVolumes[vv].value) + '%'
                                });
                            }
                        }
                        else {
                            let performerKind = 'waf_performer_1_test';
                            if (midinum < 1 || midinum > 128) {
                                performerKind = 'emptySilent';
                            }
                            let volumeID = 'voice' + mt + 'volume';
                            let tID = 'voice' + mt + 'subVolume';
                            let comment = miditrack.title + ' [' + midinum + ': ' + insNames[midinum - 1] + ']';
                            schedule.channels.push({
                                id: channelId, comment: comment, filters: [
                                    { id: volumeID, kind: 'volume_filter_1_test', properties: '100%' },
                                    { id: tID, kind: 'volume_filter_1_test', properties: '100%' }
                                ],
                                performer: { id: 'voice' + mt + 'performer', kind: performerKind, properties: '' + midinum }
                            });
                            for (let vv = 0; vv < miditrack.trackVolumes.length; vv++) {
                                let setIndex = Math.floor(miditrack.trackVolumes[vv].ms / 1000.0);
                                for (let ii = 0; ii <= setIndex; ii++) {
                                    if (!(schedule.series[ii])) {
                                        schedule.series[ii] = { duration: 1, items: [], states: [] };
                                    }
                                }
                                schedule.series[setIndex].states.push({
                                    skip: (Math.round(miditrack.trackVolumes[vv].ms) % 1000.0) / 1000.0,
                                    filterId: volumeID,
                                    data: '' + Math.round(100 * miditrack.trackVolumes[vv].value) + '%'
                                });
                            }
                        }
                    }
                }
            }
        }
        return schedule;
    }
}
let zoomPrefixLevelsCSS = [
    { prefix: '025', zoom: 0.25 },
    { prefix: '05', zoom: 0.5 },
    { prefix: '1', zoom: 1 },
    { prefix: '2', zoom: 2 },
    { prefix: '4', zoom: 4 },
    { prefix: '8', zoom: 8 },
    { prefix: '16', zoom: 16 },
    { prefix: '32', zoom: 32 },
    { prefix: '64', zoom: 64 },
    { prefix: '128', zoom: 128 },
    { prefix: '256', zoom: 256 }
];
class UIRenderer {
    constructor(commands) {
        this.commands = commands;
        this.commands.registerUI(this);
    }
    changeTapSIze(ratio) {
        console.log('changeTapSIze', ratio, this);
        this.tiler.setupTapSize(ratio);
        this.onReSizeView();
        this.tiler.resetModel();
    }
    createUI() {
        this.tiler = createTileLevel();
        this.tileLevelSVG = document.getElementById("tileLevelSVG");
        let layers = [];
        this.debug = new DebugLayerUI();
        this.debug.setupUI();
        this.toolbar = new UIToolbar(this.commands);
        this.menu = new RightMenuPanel(this.commands);
        this.mixer = new MixerUI();
        let me = this;
        layers = layers.concat(this.debug.allLayers(), this.toolbar.createToolbar(), this.menu.createMenu(), this.mixer.buildMixerLayers());
        this.tiler.initRun(this.tileLevelSVG, false, 1, 1, 0.25, 4, 256 - 1, layers);
        console.log('tap size', this.tiler.tapPxSize());
        this.tiler.setAfterZoomCallback(() => {
            if (this.menu) {
                this.menu.lastZ = this.tiler.getCurrentPointPosition().z;
            }
        });
        this.tiler.setAfterResizeCallback(() => {
            this.onReSizeView();
        });
    }
    fillUI(data) {
        let mixm = new MixerDataMath(data);
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(mixm.wholeWidth(), mixm.wholeHeight());
        this.mixer.fillMixeUI(data);
        this.debug.resetDebugView(data);
        this.toolbar.resizeToolbar(vw, vh);
        this.menu.fillMenuItems();
        this.menu.resizeMenu(vw, vh);
        this.tiler.resetModel();
    }
    onReSizeView() {
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.toolbar.resizeToolbar(vw, vh);
        this.tiler.resetAnchor(this.toolbar.toolBarGroup, this.toolbar.toolBarAnchor, LevelModes.overlay);
        this.menu.resizeMenu(vw, vh);
        this.menu.resetAllAnchors();
    }
    deleteUI() {
    }
}
let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
let localMenuItemSettings = 'localMenuItemSettings';
let localeDictionary = [
    {
        id: localNameLocal, data: [
            { locale: 'en', text: 'English' },
            { locale: 'ru', text: 'Русский' },
            { locale: 'zh', text: '汉语口语' }
        ]
    }, {
        id: localMenuItemSettings, data: [
            { locale: 'en', text: 'Settings' },
            { locale: 'ru', text: 'Настройки' },
            { locale: 'zh', text: '设置' }
        ]
    }
];
function setLocaleID(loname) {
    labelLocaleDictionary = loname;
}
function LO(id) {
    for (let ii = 0; ii < localeDictionary.length; ii++) {
        let row = localeDictionary[ii];
        if (id == row.id) {
            for (let kk = 0; kk < row.data.length; kk++) {
                if (row.data[kk].locale == labelLocaleDictionary) {
                    return row.data[kk].text;
                }
            }
            return labelLocaleDictionary + '?' + id;
        }
    }
    return labelLocaleDictionary + ':' + id;
}
class UIToolbar {
    constructor(commands) {
        this.commands = commands;
    }
    createToolbar() {
        this.playPauseButton = new ToolBarButton([icon_play, icon_pause], 0, 0, (nn) => {
            console.log('playPauseButton', nn);
            this.commands.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
        this.menuButton = new ToolBarButton([icon_openmenu], 0, 1, (nn) => {
            console.log('menuButton', nn);
            this.commands.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            this.commands.showRightMenu();
        });
        this.headButton = new ToolBarButton([icon_openleft, icon_closeleft], 0, -1, (nn) => {
            console.log('headButton', nn);
            this.commands.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
        this.toolBarGroup = document.getElementById("toolBarPanelGroup");
        this.toolBarRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'toolBarPanel' };
        this.toolBarShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.toolBarShadow,
                this.toolBarRectangle,
                this.playPauseButton.iconLabelButton.anchor,
                this.menuButton.iconLabelButton.anchor,
                this.headButton.iconLabelButton.anchor
            ]
        };
        this.toolBarLayer = {
            g: this.toolBarGroup, anchors: [
                this.toolBarAnchor
            ], mode: LevelModes.overlay
        };
        return [this.toolBarLayer];
    }
    resizeToolbar(viewWIdth, viewHeight) {
        let shn = 0.05;
        this.toolBarShadow.x = -shn;
        this.toolBarShadow.y = viewHeight - 1 - shn;
        this.toolBarShadow.w = viewWIdth + shn + shn;
        this.toolBarShadow.h = 1 + shn + shn;
        this.toolBarRectangle.x = -1;
        this.toolBarRectangle.y = viewHeight - 1;
        this.toolBarRectangle.w = viewWIdth + 2;
        this.toolBarRectangle.h = 2;
        this.toolBarAnchor.xx = 0;
        this.toolBarAnchor.yy = 0;
        this.toolBarAnchor.ww = viewWIdth;
        this.toolBarAnchor.hh = viewHeight;
        this.playPauseButton.resize(viewWIdth, viewHeight);
        this.menuButton.resize(viewWIdth, viewHeight);
        this.headButton.resize(viewWIdth, viewHeight);
    }
}
class ToolBarButton {
    constructor(labels, stick, position, action) {
        this.iconLabelButton = new IconLabelButton(labels, 'toolBarButtonCircle', 'toolBarButtonLabel', action);
        this.stick = stick;
        this.position = position;
    }
    resize(viewWIdth, viewHeight) {
        let x0 = viewWIdth / 2 - 0.5 + this.position;
        if (this.stick > 0) {
            x0 = viewWIdth - 1 - this.position;
        }
        else {
            if (this.stick < 0) {
                x0 = 0 + this.position;
            }
        }
        this.iconLabelButton.resize(x0, viewHeight - 1, 1);
    }
}
class RightMenuPanel {
    constructor(commands) {
        this.showState = false;
        this.lastWidth = 0;
        this.lastHeight = 0;
        this.items = [];
        this.scrollY = 0;
        this.shiftX = 0;
        this.lastZ = 1;
        this.itemsWidth = 0;
        this.commands = commands;
    }
    resetAllAnchors() {
        this.commands.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
        this.commands.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
        this.commands.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
        this.commands.resetAnchor(this.menuPanelButtons, this.buttonsAnchor, LevelModes.overlay);
    }
    createMenu() {
        this.menuPanelBackground = document.getElementById("menuPanelBackground");
        this.menuPanelContent = document.getElementById("menuPanelContent");
        this.menuPanelInteraction = document.getElementById("menuPanelInteraction");
        this.menuPanelButtons = document.getElementById("menuPanelButtons");
        this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };
        this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'transparentScroll', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };
        this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.menuCloseButton = new IconLabelButton([icon_moveright], 'menuButtonCircle', 'menuButtonLabel', (nn) => {
            console.log('menuCloseButton', nn);
            this.showState = false;
            this.resizeMenu(this.lastWidth, this.lastHeight);
            this.resetAllAnchors();
        });
        this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn) => {
            console.log('up', nn);
            this.scrollY = 0;
            this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        });
        this.backgroundAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.listingShadow,
                this.backgroundRectangle
            ], id: 'rightMenuBackgroundAnchor'
        };
        this.contentAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [], id: 'rightMenuContentAnchor'
        };
        this.interAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.dragHandler
            ], id: 'rightMenuInteractionAnchor'
        };
        this.buttonsAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.menuCloseButton.anchor, this.menuUpButton.anchor
            ]
        };
        this.bgLayer = { g: this.menuPanelBackground, anchors: [this.backgroundAnchor], mode: LevelModes.overlay };
        this.contentLayer = { g: this.menuPanelContent, anchors: [this.contentAnchor], mode: LevelModes.overlay };
        this.interLayer = { g: this.menuPanelInteraction, anchors: [this.interAnchor], mode: LevelModes.overlay };
        this.buttonsLayer = { g: this.menuPanelButtons, anchors: [this.buttonsAnchor], mode: LevelModes.overlay };
        return [this.bgLayer,
            this.interLayer,
            this.contentLayer,
            this.buttonsLayer
        ];
    }
    scrollListing(dx, dy) {
        let yy = this.scrollY + dy / this.lastZ;
        let itemsH = 0;
        for (let ii = 0; ii < this.items.length - 1; ii++) {
            itemsH = itemsH + this.items[ii].calculateHeight();
        }
        if (yy < -itemsH) {
            yy = -itemsH;
        }
        if (yy > 0) {
            yy = 0;
        }
        this.scrollY = yy;
        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        this.commands.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
    }
    randomString(nn) {
        let words = ['red', 'green', 'blue', 'purple', 'black', 'white', 'yellow', 'grey', 'orange', 'cyan', 'magenta', 'silver', 'olive'];
        let ss = words[Math.floor(Math.random() * (words.length - 1))];
        ss = ss[0].toUpperCase() + ss.substring(1);
        for (let ii = 1; ii < nn; ii++) {
            ss = ss + ' ' + words[Math.floor(Math.random() * (words.length - 1))];
        }
        return ss;
    }
    fillMenuItems() {
        this.items = [];
        this.fillMenuItemChildren(0, testMenuData);
    }
    setFocus(it, infos) {
        for (let ii = 0; ii < infos.length; ii++) {
            infos[ii].focused = false;
        }
        it.focused = true;
    }
    setOpenState(state, it, infos) {
        for (let ii = 0; ii < infos.length; ii++) {
            infos[ii].opened = false;
            infos[ii].focused = false;
        }
        it.focused = true;
        it.opened = state;
    }
    fillMenuItemChildren(pad, infos) {
        let me = this;
        for (let ii = 0; ii < infos.length; ii++) {
            let it = infos[ii];
            let focused = (it.focused) ? true : false;
            let opened = (it.opened) ? true : false;
            let children = it.children;
            if (children) {
                if (opened) {
                    this.items.push(new RightMenuItem(it).initOpenedFolderItem(pad, focused, it.text, () => {
                        console.log("close " + ii);
                        me.setOpenState(false, it, infos);
                        me.rerenderContent(null);
                    }));
                    this.fillMenuItemChildren(pad + 0.5, children);
                }
                else {
                    let si = new RightMenuItem(it);
                    let order = this.items.length;
                    this.items.push(si.initClosedFolderItem(pad, focused, it.text, () => {
                        console.log("open " + ii);
                        me.setOpenState(true, it, infos);
                        me.rerenderContent(si);
                    }));
                }
            }
            else {
                switch (it.sid) {
                    case commandThemeSizeSmall: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(1, 'theme/sizesmall.css');
                        }));
                        break;
                    }
                    case commandThemeSizeBig: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(1.5, 'theme/sizebig.css');
                        }));
                        break;
                    }
                    case commandThemeSizeHuge: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(4, 'theme/sizehuge.css');
                        }));
                        break;
                    }
                    case commandThemeColorRed: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor('theme/colordarkred.css');
                        }));
                        break;
                    }
                    case commandThemeColorGreen: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor('theme/colordarkgreen.css');
                        }));
                        break;
                    }
                    case commandThemeColorBlue: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor('theme/colordarkblue.css');
                        }));
                        break;
                    }
                    case commandLocaleRU: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('ru');
                        }));
                        break;
                    }
                    case commandLocaleEN: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('en');
                        }));
                        break;
                    }
                    case commandLocaleZH: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('zh');
                        }));
                        break;
                    }
                    case commandImportFromMIDI: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            console.log('import');
                            me.commands.promptImportFromMIDI();
                        }));
                        break;
                    }
                    default: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            console.log("tap " + ii);
                            me.setFocus(it, infos);
                        }));
                        break;
                    }
                }
            }
        }
    }
    setThemeLocale(loc) {
        console.log("setThemeLocale " + loc);
        setLocaleID(loc);
        if (loc == 'zh') {
            startLoadCSSfile('theme/font2.css');
        }
        else {
            startLoadCSSfile('theme/font1.css');
        }
        this.resizeMenu(this.lastWidth, this.lastHeight);
        this.resetAllAnchors();
    }
    setThemeColor(cssPath) {
        console.log("cssPath " + cssPath);
        startLoadCSSfile(cssPath);
        this.resizeMenu(this.lastWidth, this.lastHeight);
        this.resetAllAnchors();
    }
    setThemeSize(ratio, cssPath) {
        console.log("cssPath " + cssPath);
        startLoadCSSfile(cssPath);
        this.commands.changeTapSIze(ratio);
    }
    rerenderContent(folder) {
        this.contentAnchor.content = [];
        this.fillMenuItems();
        let position = 0;
        for (let ii = 0; ii < this.items.length; ii++) {
            if (folder) {
                if (folder.info == this.items[ii].info) {
                    if (-position > this.scrollY) {
                        this.scrollY = -position + 0.5;
                        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
                    }
                }
            }
            let tile = this.items[ii].buildTile(position, this.itemsWidth);
            this.contentAnchor.content.push(tile);
            position = position + this.items[ii].calculateHeight();
        }
        this.commands.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
    }
    resizeMenu(viewWidth, viewHeight) {
        this.lastWidth = viewWidth;
        this.lastHeight = viewHeight;
        this.itemsWidth = viewWidth - 1;
        if (this.itemsWidth > 9)
            this.itemsWidth = 9;
        if (this.itemsWidth < 2) {
            this.itemsWidth = 2;
        }
        this.shiftX = viewWidth - this.itemsWidth;
        if (!this.showState) {
            this.shiftX = viewWidth + 1;
        }
        else {
        }
        let shn = 0.05;
        this.listingShadow.x = this.shiftX - shn;
        this.listingShadow.y = -shn;
        this.listingShadow.w = this.itemsWidth + shn + shn;
        this.listingShadow.h = viewHeight + shn + shn;
        this.backgroundRectangle.x = this.shiftX;
        this.backgroundRectangle.y = 0;
        this.backgroundRectangle.w = this.itemsWidth;
        this.backgroundRectangle.h = viewHeight;
        this.backgroundAnchor.xx = 0;
        this.backgroundAnchor.yy = 0;
        this.backgroundAnchor.ww = viewWidth;
        this.backgroundAnchor.hh = viewHeight;
        this.dragHandler.x = this.shiftX;
        this.dragHandler.y = 0;
        this.dragHandler.w = this.itemsWidth;
        this.dragHandler.h = viewHeight;
        this.interAnchor.xx = 0;
        this.interAnchor.yy = 0;
        this.interAnchor.ww = viewWidth;
        this.interAnchor.hh = viewHeight;
        this.buttonsAnchor.xx = 0;
        this.buttonsAnchor.yy = 0;
        this.buttonsAnchor.ww = viewWidth;
        this.buttonsAnchor.hh = viewHeight;
        this.contentAnchor.xx = 0;
        this.contentAnchor.yy = 0;
        this.contentAnchor.ww = viewWidth;
        this.contentAnchor.hh = viewHeight;
        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        this.menuCloseButton.resize(this.shiftX + this.itemsWidth - 1, viewHeight - 1, 1);
        this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);
        this.rerenderContent(null);
    }
}
class RightMenuItem {
    constructor(info) {
        this.label = '';
        this.kindAction = 1;
        this.kindDraggable = 2;
        this.kindPreview = 3;
        this.kindClosedFolder = 4;
        this.kindOpenedFolder = 5;
        this.kind = this.kindAction;
        this.pad = 0;
        this.focused = false;
        this.info = info;
        if (this.info.sid) {
        }
        else {
            this.info.sid = 'random' + Math.random();
        }
    }
    initActionItem(pad, focused, label, tap) {
        this.pad = pad;
        this.focused = focused;
        this.kind = this.kindAction;
        this.label = label;
        this.action = tap;
        return this;
    }
    initDraggableItem(pad, focused, tap) {
        this.kind = this.kindDraggable;
        this.focused = focused;
        this.pad = pad;
        this.action = tap;
        return this;
    }
    initOpenedFolderItem(pad, focused, label, tap) {
        this.pad = pad;
        this.label = label;
        this.focused = focused;
        this.kind = this.kindOpenedFolder;
        this.action = tap;
        return this;
    }
    initClosedFolderItem(pad, focused, label, tap) {
        this.pad = pad;
        this.label = label;
        this.focused = focused;
        this.kind = this.kindClosedFolder;
        this.action = tap;
        return this;
    }
    initPreviewItem(pad, focused, tap) {
        this.focused = focused;
        this.pad = pad;
        this.kind = this.kindPreview;
        this.action = tap;
        return this;
    }
    calculateHeight() {
        if (this.kind == this.kindPreview) {
            return 2;
        }
        else {
            return 1;
        }
    }
    buildTile(itemTop, itemWidth) {
        this.top = itemTop;
        let anchor = { xx: 0, yy: itemTop, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [] };
        if (this.focused) {
            anchor.content.push({ x: itemWidth - 0.1, y: itemTop + 0.02, w: 0.1, h: this.calculateHeight() - 0.02, css: 'rightMenuFocusedDelimiter' });
        }
        anchor.content.push({ x: 0, y: itemTop + this.calculateHeight(), w: itemWidth, h: 0.02, css: 'rightMenuDelimiterLine' });
        let spot = { x: this.pad, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
        if (this.kind == this.kindAction) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindDraggable) {
            spot.draggable = true;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindOpenedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_movedown, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindClosedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_moveright, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindPreview) {
            spot.draggable = true;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
            anchor.content.push({ x: itemWidth - 1 + 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemSubActionBG' });
            anchor.content.push({ x: itemWidth - 0.5, y: itemTop + 0.7, text: icon_play, css: 'rightMenuButtonLabel' });
            anchor.content.push({ x: itemWidth - 1, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' });
            anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55, text: this.label, css: 'rightMenuSubLabel' });
            anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55 + 0.55, text: this.label, css: 'rightMenuSubLabel' });
        }
        anchor.content.push(spot);
        return anchor;
    }
}
let commandThemeSizeSmall = 'commandThemeSizeSmall';
let commandThemeSizeBig = 'commandThemeSizeBig';
let commandThemeSizeHuge = 'commandThemeSizeHuge';
let commandThemeColorRed = 'commandThemeColorRed';
let commandThemeColorGreen = 'commandThemeColorGreen';
let commandThemeColorBlue = 'commandThemeColorBlue';
let commandLocaleEN = 'commandLocaleEN';
let commandLocaleRU = 'commandLocaleRU';
let commandLocaleZH = 'commandLocaleZH';
let commandImportFromMIDI = 'commandImportFromMIDI';
let testMenuData = [
    { text: 'test import', sid: commandImportFromMIDI },
    { text: 'One' },
    {
        text: 'Two', children: [{ text: 'One' },
            { text: 'Two' },
            { text: 'Orange', focused: true },
            { text: 'Blue' },
            { text: 'Green' },
            {
                text: 'Brown', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    {
                        text: 'Blue', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            {
                                text: 'Brown', children: [{ text: 'One' },
                                    { text: 'Two' },
                                    {
                                        text: 'Orange', children: [{ text: 'One' },
                                            { text: 'Two' },
                                            { text: 'Orange' },
                                            { text: 'Blue' },
                                            { text: 'Green' },
                                            {
                                                text: 'Brown', children: [{ text: 'One' },
                                                    { text: 'Two' },
                                                    { text: 'Orange' },
                                                    { text: 'Blue' },
                                                    { text: 'Green' },
                                                    { text: 'Brown' },
                                                    { text: 'eleven' }]
                                            },
                                            {
                                                text: 'eleven', children: [{ text: 'One' },
                                                    { text: 'Two' },
                                                    { text: 'Orange' },
                                                    { text: 'Blue' },
                                                    { text: 'Green' },
                                                    { text: 'Brown' },
                                                    { text: 'eleven' }]
                                            }]
                                    },
                                    { text: 'Blue' },
                                    { text: 'Green' },
                                    { text: 'Brown' },
                                    { text: 'eleven' }]
                            },
                            {
                                text: 'eleven', children: [{ text: 'One' },
                                    { text: 'Two' },
                                    { text: 'Orange' },
                                    { text: 'Blue' },
                                    { text: 'Green' },
                                    { text: 'Brown' },
                                    { text: 'eleven' }]
                            }]
                    },
                    { text: 'Green' },
                    { text: 'Brown' },
                    { text: 'eleven' }]
            },
            {
                text: 'eleven', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    { text: 'Blue' },
                    { text: 'Green' },
                    { text: 'Brown' },
                    { text: 'eleven' }]
            }]
    },
    { text: 'Orange' },
    { text: 'Blue' },
    {
        text: 'Green', focused: true, children: [{ text: 'One' },
            { text: 'Two' },
            { text: 'Orange' },
            { text: 'Blue' },
            { text: 'Green' },
            { text: 'Brown' },
            { text: 'eleven' }]
    },
    {
        text: 'Brown', children: [{ text: 'One' },
            { text: 'Two' },
            {
                text: 'Orange', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    { text: 'Blue' },
                    { text: 'Green' },
                    {
                        text: 'Brown', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    },
                    {
                        text: 'eleven', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    }]
            },
            {
                text: 'Blue', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    { text: 'Blue' },
                    { text: 'Green' },
                    {
                        text: 'Brown', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    },
                    {
                        text: 'eleven', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    }]
            },
            { text: 'Green' },
            { text: 'Brown' },
            { text: 'eleven' }]
    },
    { text: 'eleven' },
    {
        text: localMenuItemSettings, children: [
            {
                text: 'Size', children: [
                    { text: 'Small', sid: commandThemeSizeSmall },
                    { text: 'Big', sid: commandThemeSizeBig },
                    { text: 'Huge', sid: commandThemeSizeHuge }
                ]
            },
            {
                text: 'Locale', children: [{ text: 'Russian', sid: commandLocaleRU },
                    { text: 'English', sid: commandLocaleEN },
                    { text: '中文界面语言', sid: commandLocaleZH }]
            },
            {
                text: 'Colors', children: [
                    { text: 'Red', sid: commandThemeColorRed },
                    { text: 'Green', sid: commandThemeColorGreen },
                    { text: 'Blue', sid: commandThemeColorBlue }
                ]
            }
        ]
    }
];
class BarOctave {
    constructor(left, top, width, height, anchor, prefix, minZoom, maxZoom, data) {
        let mixm = new MixerDataMath(data);
        let oRectangle = { x: left, y: top, w: width, h: height, rx: 1, ry: 1, css: 'mixFieldBg' + prefix };
        let oAnchor = { xx: left, yy: top, ww: width, hh: height, showZoom: minZoom, hideZoom: maxZoom, content: [oRectangle] };
        anchor.content.push(oAnchor);
    }
}
class OctaveContent {
    constructor(aa, top, toAnchor, data) {
    }
    resetMainPitchedTrackUI(pitchedTrackData) {
    }
    resetOtherPitchedTrackUI(pitchedTrackData) {
    }
}
class MixerBar {
    constructor(prefix, left, top, ww, hh, minZoom, maxZoom, toAnchor, data) {
        this.prefix = '';
        this.prefix = prefix;
        this.barRectangle = { x: left, y: top, w: ww, h: hh, rx: 1, ry: 1, css: 'mixFieldBg' + this.prefix };
        this.barAnchor = { xx: left, yy: top, ww: ww, hh: hh, showZoom: minZoom, hideZoom: maxZoom, content: [this.barRectangle] };
        toAnchor.content.push(this.barAnchor);
        this.octaves = [];
        for (let oo = 0; oo < 10; oo++) {
            this.octaves.push(new BarOctave(left, oo * 12 * data.notePathHeight, ww, 12 * data.notePathHeight, this.barAnchor, prefix, minZoom, maxZoom, data));
        }
    }
}
class MixerUI {
    constructor() {
        this.svgs = [];
        this.zoomLayers = [];
        this.zoomAnchors = [];
        this.levels = [];
    }
    fillMixeUI(data) {
        let mixm = new MixerDataMath(data);
        let ww = mixm.wholeWidth();
        let hh = mixm.wholeHeight();
        for (let ii = 0; ii < this.zoomAnchors.length; ii++) {
            this.zoomAnchors[ii].ww = ww;
            this.zoomAnchors[ii].hh = hh;
            this.levels[ii].buildLevel(ww, hh);
            this.levels[ii].fillBars(data, hh);
        }
    }
    buildMixerLayers() {
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.svgs.push(document.getElementById("tracksLayerZoom" + zoomPrefixLevelsCSS[ii].prefix));
            this.zoomAnchors.push({ showZoom: zoomPrefixLevelsCSS[ii].zoom, hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom, xx: 0, yy: 0, ww: 1, hh: 1, content: [] });
            this.zoomLayers.push({ g: this.svgs[ii], anchors: [this.zoomAnchors[ii]], mode: LevelModes.normal });
            this.levels.push(new MixerZoomLevel(zoomPrefixLevelsCSS[ii].prefix, zoomPrefixLevelsCSS[ii].zoom, zoomPrefixLevelsCSS[ii + 1].zoom, this.zoomAnchors[ii]));
        }
        return this.zoomLayers;
    }
}
class MixerZoomLevel {
    constructor(prefix, minZoom, maxZoom, anchor) {
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.anchor = anchor;
        this.prefix = prefix;
        this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'mixFieldBg' + this.prefix };
        this.anchor.content = [this.bg];
        this.bars = [];
    }
    buildLevel(ww, hh) {
        this.bg.w = ww;
        this.bg.h = hh;
    }
    fillBars(data, hh) {
        let left = 0;
        let width = 0;
        for (let ii = 0; ii < data.timeline.length; ii++) {
            let timebar = data.timeline[ii];
            width = new MusicMetreMath(timebar.metre).width(timebar.tempo, data.widthDurationRatio);
            this.bars.push(new MixerBar(this.prefix, left, 0, width, hh, this.minZoom, this.maxZoom, this.anchor, data));
            left = left + width;
        }
    }
}
class IconLabelButton {
    constructor(labels, cssBG, cssLabel, action) {
        this.left = 0;
        this.top = 0;
        this.selection = 0;
        this.labels = labels;
        this.action = action;
        this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: cssBG };
        this.spot = {
            x: 0, y: 0, w: 1, h: 1, css: 'transparentSpot', activation: (x, y) => {
                this.selection++;
                if (this.selection > this.labels.length - 1) {
                    this.selection = 0;
                }
                this.label.text = this.labels[this.selection];
                this.action(this.selection);
            }
        };
        this.label = { x: 0, y: 0, text: this.labels[this.selection], css: cssLabel };
        this.anchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.bg,
                this.label,
                this.spot
            ]
        };
    }
    resize(left, top, size) {
        this.bg.x = left + 0.1;
        this.bg.y = top + 0.1;
        this.bg.w = 0.8 * size;
        this.bg.h = 0.8 * size;
        this.bg.rx = 0.4 * size;
        this.bg.ry = 0.4 * size;
        this.label.x = left + 0.5;
        this.label.y = top + 1 - 0.31;
        this.spot.x = left;
        this.spot.y = top;
    }
}
let icon_play = '&#xf3aa;';
let icon_pause = '&#xf3a7;';
let icon_openmenu = '&#xf19c;';
let icon_closemenu = '&#xf1ea;';
let icon_closedbranch = '&#xf2f6;';
let icon_openedbranch = '&#xf2f2;';
let icon_openleft = '&#xf244;';
let icon_closeleft = '&#xf243;';
let icon_moveup = '&#xf2fc;';
let icon_movedown = '&#xf2f9;';
let icon_moveleft = '&#xf2fa;';
let icon_moveright = '&#xf2fb;';
class DebugLayerUI {
    allLayers() {
        return [this.debugLayer];
    }
    setupUI() {
        this.debugRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 10, ry: 10, css: 'debug' };
        this.debugGroup = document.getElementById("debugLayer");
        this.debugAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [] };
        this.debugLayer = {
            g: this.debugGroup, anchors: [
                this.debugAnchor
            ], mode: LevelModes.normal
        };
    }
    resetDebugView(data) {
        let mixm = new MixerDataMath(data);
        let ww = mixm.wholeWidth();
        let hh = mixm.wholeHeight();
        this.debugRectangle.w = ww;
        this.debugRectangle.h = hh;
        this.debugAnchor.ww = ww;
        this.debugAnchor.hh = hh;
    }
    deleteDebbugView() {
    }
}
let testBigMixerData = {
    title: 'test data for debug',
    timeline: [
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 7, part: 8 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 2, part: 2 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 5, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 3, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 7, part: 8 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 2, part: 2 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 5, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 3, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
    ],
    notePathHeight: 0.25,
    widthDurationRatio: 50,
    pitchedTracks: [
        { title: 'Test track 1' },
        { title: 'Test track 2' },
        { title: 'Test track 3' },
        { title: 'Test track 4' },
        { title: 'Test track 5' },
        { title: 'Test track 6' },
        { title: 'Test track 7' },
        { title: 'Test track 8' },
        { title: 'Test track 9' },
        { title: 'Test track 10' },
        { title: 'Test track 11' },
        { title: 'Test track 12' },
        { title: 'Test track 13' },
        { title: 'Test track 14' },
        { title: 'Test track 15' },
        { title: 'Test track 16' }
    ]
};
let testEmptyMixerData = {
    title: 'small data for debug',
    timeline: [
        { tempo: 120, metre: { count: 4, part: 4 } }
    ],
    notePathHeight: 0.25,
    widthDurationRatio: 50,
    pitchedTracks: [
        { title: 'A track1' },
        { title: 'Second track' }
    ]
};
class MusicMetreMath {
    constructor(from) {
        this.count = from.count;
        this.part = from.part;
    }
    metre() {
        return {
            count: this.count,
            part: this.part
        };
    }
    simplyfy() {
        let cc = this.count;
        let pp = this.part;
        if (cc > 0 && pp > 0) {
            while (cc % 2 == 0 && pp % 2 == 0) {
                cc = cc / 2;
                pp = pp / 2;
            }
        }
        return new MusicMetreMath({ count: cc, part: pp });
    }
    strip(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.round(cc / rr);
        pp = toPart;
        return new MusicMetreMath({
            count: cc,
            part: pp
        });
    }
    equals(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe == countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    less(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe < countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    more(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe > countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    plus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = {
            count: countMe + countTo,
            part: metre.part * this.part
        };
        return new MusicMetreMath(rr).simplyfy();
    }
    minus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe - countTo, part: metre.part * this.part };
        return new MusicMetreMath(rr).simplyfy();
    }
    duration(tempo) {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * this.count) / this.part;
        return meterSeconds;
    }
    width(tempo, ratio) {
        return this.duration(tempo) * ratio;
    }
}
class MixerDataMath {
    constructor(data) {
        this.data = data;
    }
    wholeWidth() {
        let ww = 0;
        for (let ii = 0; ii < this.data.timeline.length; ii++) {
            ww = ww + new MusicMetreMath(this.data.timeline[ii].metre).width(this.data.timeline[ii].tempo, this.data.widthDurationRatio);
        }
        return ww;
    }
    wholeHeight() {
        return this.data.notePathHeight * 10 * 12;
    }
}
let biChar32 = [];
biChar32[0] = '0';
biChar32[1] = '1';
biChar32[2] = '2';
biChar32[3] = '3';
biChar32[4] = '4';
biChar32[5] = '5';
biChar32[6] = '6';
biChar32[7] = '7';
biChar32[8] = '8';
biChar32[9] = '9';
biChar32[10] = 'a';
biChar32[11] = 'b';
biChar32[12] = 'c';
biChar32[13] = 'd';
biChar32[14] = 'e';
biChar32[15] = 'f';
biChar32[16] = 'g';
biChar32[17] = 'h';
biChar32[18] = 'i';
biChar32[19] = 'j';
biChar32[20] = 'k';
biChar32[21] = 'l';
biChar32[22] = 'm';
biChar32[23] = 'n';
biChar32[24] = '0';
biChar32[25] = 'p';
biChar32[26] = 'q';
biChar32[27] = 'r';
biChar32[28] = 's';
biChar32[29] = 't';
biChar32[30] = 'u';
biChar32[31] = 'v';
function testNumMathUtil() {
}
console.log('Tile Level API');
var LevelModes;
(function (LevelModes) {
    LevelModes[LevelModes["normal"] = 0] = "normal";
    LevelModes[LevelModes["left"] = 1] = "left";
    LevelModes[LevelModes["right"] = 2] = "right";
    LevelModes[LevelModes["top"] = 3] = "top";
    LevelModes[LevelModes["bottom"] = 4] = "bottom";
    LevelModes[LevelModes["overlay"] = 5] = "overlay";
})(LevelModes || (LevelModes = {}));
;
function TAnchor(xx, yy, ww, hh, showZoom, hideZoom, id, translation) {
    return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [], id: id };
}
function TText(x, y, css, text) {
    return { x: x, y: y, text: text, css: css, };
}
//# sourceMappingURL=application.js.map