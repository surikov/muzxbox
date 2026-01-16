"use strict";
const notifyNewContext = [];
function onContextInit(cb) {
    notifyNewContext.push(cb);
}
function initializeContext(ctx) {
    notifyNewContext.forEach((cb) => cb(ctx));
}
const notifyCloseContext = [];
function onContextClose(cb) {
    notifyCloseContext.push(cb);
}
function closeContext(ctx) {
    notifyCloseContext.forEach((cb) => cb(ctx));
}
const version = "re";
class Tone {
    constructor() {
        this.debug = false;
        this._wasDisposed = false;
    }
    static getDefaults() {
        return {};
    }
    log(...args) {
        if (this.debug ||
            (theWindow && this.toString() === theWindow.TONE_DEBUG_CLASS)) {
            console.log(this, ...args);
        }
    }
    dispose() {
        this._wasDisposed = true;
        return this;
    }
    get disposed() {
        return this._wasDisposed;
    }
    toString() {
        return this.name;
    }
}
Tone.version = version;
class Tone22 extends Tone {
    constructor() {
        super(...arguments);
        this.name = "Tone22";
    }
}
;
class TimeBaseClass extends Tone {
    constructor(context, value, units) {
        super();
        this.defaultUnits = "s";
        this._val = value;
        this._units = units;
        this.context = context;
        this._expressions = this._getExpressions();
    }
    _getExpressions() {
        return {
            hz: {
                method: (value) => {
                    return this._frequencyToUnits(parseFloat(value));
                },
                regexp: /^(\d+(?:\.\d+)?)hz$/i,
            },
            i: {
                method: (value) => {
                    return this._ticksToUnits(parseInt(value, 10));
                },
                regexp: /^(\d+)i$/i,
            },
            m: {
                method: (value) => {
                    return this._beatsToUnits(parseInt(value, 10) * this._getTimeSignature());
                },
                regexp: /^(\d+)m$/i,
            },
            n: {
                method: (value, dot) => {
                    const numericValue = parseInt(value, 10);
                    const scalar = dot === "." ? 1.5 : 1;
                    if (numericValue === 1) {
                        return (this._beatsToUnits(this._getTimeSignature()) *
                            scalar);
                    }
                    else {
                        return (this._beatsToUnits(4 / numericValue) *
                            scalar);
                    }
                },
                regexp: /^(\d+)n(\.?)$/i,
            },
            number: {
                method: (value) => {
                    return this._expressions[this.defaultUnits].method.call(this, value);
                },
                regexp: /^(\d+(?:\.\d+)?)$/,
            },
            s: {
                method: (value) => {
                    return this._secondsToUnits(parseFloat(value));
                },
                regexp: /^(\d+(?:\.\d+)?)s$/,
            },
            samples: {
                method: (value) => {
                    return (parseInt(value, 10) /
                        this.context.sampleRate);
                },
                regexp: /^(\d+)samples$/,
            },
            t: {
                method: (value) => {
                    const numericValue = parseInt(value, 10);
                    return this._beatsToUnits(8 / (Math.floor(numericValue) * 3));
                },
                regexp: /^(\d+)t$/i,
            },
            tr: {
                method: (m, q, s) => {
                    let total = 0;
                    if (m && m !== "0") {
                        total += this._beatsToUnits(this._getTimeSignature() * parseFloat(m));
                    }
                    if (q && q !== "0") {
                        total += this._beatsToUnits(parseFloat(q));
                    }
                    if (s && s !== "0") {
                        total += this._beatsToUnits(parseFloat(s) / 4);
                    }
                    return total;
                },
                regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?$/,
            },
        };
    }
    valueOf() {
        if (this._val instanceof TimeBaseClass) {
            this.fromType(this._val);
        }
        if (isUndef(this._val)) {
            return this._noArg();
        }
        else if (isString(this._val) && isUndef(this._units)) {
            for (const units in this._expressions) {
                if (this._expressions[units].regexp.test(this._val.trim())) {
                    this._units = units;
                    break;
                }
            }
        }
        else if (isObject(this._val)) {
            let total = 0;
            for (const typeName in this._val) {
                if (isDefined(this._val[typeName])) {
                    const quantity = this._val[typeName];
                    const time = new this.constructor(this.context, typeName).valueOf() *
                        quantity;
                    total += time;
                }
            }
            return total;
        }
        if (isDefined(this._units)) {
            const expr = this._expressions[this._units];
            const matching = this._val.toString().trim().match(expr.regexp);
            if (matching) {
                return expr.method.apply(this, matching.slice(1));
            }
            else {
                return expr.method.call(this, this._val);
            }
        }
        else if (isString(this._val)) {
            return parseFloat(this._val);
        }
        else {
            return this._val;
        }
    }
    _frequencyToUnits(freq) {
        return (1 / freq);
    }
    _beatsToUnits(beats) {
        return ((60 / this._getBpm()) * beats);
    }
    _secondsToUnits(seconds) {
        return seconds;
    }
    _ticksToUnits(ticks) {
        return ((ticks * this._beatsToUnits(1)) / this._getPPQ());
    }
    _noArg() {
        return this._now();
    }
    _getBpm() {
        return this.context.transport.bpm.value;
    }
    _getTimeSignature() {
        return this.context.transport.timeSignature;
    }
    _getPPQ() {
        return this.context.transport.PPQ;
    }
    fromType(type) {
        this._units = undefined;
        switch (this.defaultUnits) {
            case "s":
                this._val = type.toSeconds();
                break;
            case "i":
                this._val = type.toTicks();
                break;
            case "hz":
                this._val = type.toFrequency();
                break;
            case "midi":
                this._val = type.toMidi();
                break;
        }
        return this;
    }
    toFrequency() {
        return 1 / this.toSeconds();
    }
    toSamples() {
        return this.toSeconds() * this.context.sampleRate;
    }
    toMilliseconds() {
        return this.toSeconds() * 1000;
    }
}
class TimeClass extends TimeBaseClass {
    constructor() {
        super(...arguments);
        this.name = "TimeClass";
    }
    _getExpressions() {
        return Object.assign(super._getExpressions(), {
            now: {
                method: (capture) => {
                    return (this._now() +
                        new this.constructor(this.context, capture).valueOf());
                },
                regexp: /^\+(.+)/,
            },
            quantize: {
                method: (capture) => {
                    const quantTo = new TimeClass(this.context, capture).valueOf();
                    return this._secondsToUnits(this.context.transport.nextSubdivision(quantTo));
                },
                regexp: /^@(.+)/,
            },
        });
    }
    quantize(subdiv, percent = 1) {
        const subdivision = new this.constructor(this.context, subdiv).valueOf();
        const value = this.valueOf();
        const multiple = Math.round(value / subdivision);
        const ideal = multiple * subdivision;
        const diff = ideal - value;
        return (value + diff * percent);
    }
    toNotation() {
        const time = this.toSeconds();
        const testNotations = ["1m"];
        for (let power = 1; power < 9; power++) {
            const subdiv = Math.pow(2, power);
            testNotations.push((subdiv + "n."));
            testNotations.push((subdiv + "n"));
            testNotations.push((subdiv + "t"));
        }
        testNotations.push("0");
        let closest = testNotations[0];
        let closestSeconds = new TimeClass(this.context, testNotations[0]).toSeconds();
        testNotations.forEach((notation) => {
            const notationSeconds = new TimeClass(this.context, notation).toSeconds();
            if (Math.abs(notationSeconds - time) <
                Math.abs(closestSeconds - time)) {
                closest = notation;
                closestSeconds = notationSeconds;
            }
        });
        return closest;
    }
    toBarsBeatsSixteenths() {
        const quarterTime = this._beatsToUnits(1);
        let quarters = this.valueOf() / quarterTime;
        quarters = parseFloat(quarters.toFixed(4));
        const measures = Math.floor(quarters / this._getTimeSignature());
        let sixteenths = (quarters % 1) * 4;
        quarters = Math.floor(quarters) % this._getTimeSignature();
        const sixteenthString = sixteenths.toString();
        if (sixteenthString.length > 3) {
            sixteenths = parseFloat(parseFloat(sixteenthString).toFixed(3));
        }
        const progress = [measures, quarters, sixteenths];
        return progress.join(":");
    }
    toTicks() {
        const quarterTime = this._beatsToUnits(1);
        const quarters = this.valueOf() / quarterTime;
        return quarters * this._getPPQ();
    }
    toSeconds() {
        return this.valueOf();
    }
    toMidi() {
        return ftom(this.toFrequency());
    }
    _now() {
        return this.context.now();
    }
}
function Time(value, units) {
    return new TimeClass(getContext(), value, units);
}
class FrequencyClass extends TimeClass {
    constructor() {
        super(...arguments);
        this.name = "Frequency";
        this.defaultUnits = "hz";
    }
    static get A4() {
        return getA4();
    }
    static set A4(freq) {
        setA4(freq);
    }
    _getExpressions() {
        return Object.assign({}, super._getExpressions(), {
            midi: {
                regexp: /^(\d+(?:\.\d+)?midi)/,
                method(value) {
                    if (this.defaultUnits === "midi") {
                        return value;
                    }
                    else {
                        return FrequencyClass.mtof(value);
                    }
                },
            },
            note: {
                regexp: /^([a-g]{1}(?:b|#|##|x|bb|###|#x|x#|bbb)?)(-?[0-9]+)/i,
                method(pitch, octave) {
                    const index = noteToScaleIndex[pitch.toLowerCase()];
                    const noteNumber = index + (parseInt(octave, 10) + 1) * 12;
                    if (this.defaultUnits === "midi") {
                        return noteNumber;
                    }
                    else {
                        return FrequencyClass.mtof(noteNumber);
                    }
                },
            },
            tr: {
                regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
                method(m, q, s) {
                    let total = 1;
                    if (m && m !== "0") {
                        total *= this._beatsToUnits(this._getTimeSignature() * parseFloat(m));
                    }
                    if (q && q !== "0") {
                        total *= this._beatsToUnits(parseFloat(q));
                    }
                    if (s && s !== "0") {
                        total *= this._beatsToUnits(parseFloat(s) / 4);
                    }
                    return total;
                },
            },
        });
    }
    transpose(interval) {
        return new FrequencyClass(this.context, this.valueOf() * intervalToFrequencyRatio(interval));
    }
    harmonize(intervals) {
        return intervals.map((interval) => {
            return this.transpose(interval);
        });
    }
    toMidi() {
        return ftom(this.valueOf());
    }
    toNote() {
        const freq = this.toFrequency();
        const log = Math.log2(freq / FrequencyClass.A4);
        let noteNumber = Math.round(12 * log) + 57;
        const octave = Math.floor(noteNumber / 12);
        if (octave < 0) {
            noteNumber += -12 * octave;
        }
        const noteName = scaleIndexToNote[noteNumber % 12];
        return (noteName + octave.toString());
    }
    toSeconds() {
        return 1 / super.toSeconds();
    }
    toTicks() {
        const quarterTime = this._beatsToUnits(1);
        const quarters = this.valueOf() / quarterTime;
        return Math.floor(quarters * this._getPPQ());
    }
    _noArg() {
        return 0;
    }
    _frequencyToUnits(freq) {
        return freq;
    }
    _ticksToUnits(ticks) {
        return (1 / ((ticks * 60) / (this._getBpm() * this._getPPQ())));
    }
    _beatsToUnits(beats) {
        return (1 / super._beatsToUnits(beats));
    }
    _secondsToUnits(seconds) {
        return (1 / seconds);
    }
    static mtof(midi) {
        return mtof(midi);
    }
    static ftom(frequency) {
        return ftom(frequency);
    }
}
const noteToScaleIndex = {
    cbbb: -3,
    cbb: -2,
    cb: -1,
    c: 0,
    "c#": 1,
    cx: 2,
    "c##": 2,
    "c###": 3,
    "cx#": 3,
    "c#x": 3,
    dbbb: -1,
    dbb: 0,
    db: 1,
    d: 2,
    "d#": 3,
    dx: 4,
    "d##": 4,
    "d###": 5,
    "dx#": 5,
    "d#x": 5,
    ebbb: 1,
    ebb: 2,
    eb: 3,
    e: 4,
    "e#": 5,
    ex: 6,
    "e##": 6,
    "e###": 7,
    "ex#": 7,
    "e#x": 7,
    fbbb: 2,
    fbb: 3,
    fb: 4,
    f: 5,
    "f#": 6,
    fx: 7,
    "f##": 7,
    "f###": 8,
    "fx#": 8,
    "f#x": 8,
    gbbb: 4,
    gbb: 5,
    gb: 6,
    g: 7,
    "g#": 8,
    gx: 9,
    "g##": 9,
    "g###": 10,
    "gx#": 10,
    "g#x": 10,
    abbb: 6,
    abb: 7,
    ab: 8,
    a: 9,
    "a#": 10,
    ax: 11,
    "a##": 11,
    "a###": 12,
    "ax#": 12,
    "a#x": 12,
    bbbb: 8,
    bbb: 9,
    bb: 10,
    b: 11,
    "b#": 12,
    bx: 13,
    "b##": 13,
    "b###": 14,
    "bx#": 14,
    "b#x": 14,
};
const scaleIndexToNote = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];
function Frequency(value, units) {
    return new FrequencyClass(getContext(), value, units);
}
class Emitter extends Tone {
    constructor() {
        super(...arguments);
        this.name = "Emitter";
    }
    on(event, callback) {
        const events = event.split(/\W+/);
        events.forEach((eventName) => {
            if (isUndef(this._events)) {
                this._events = {};
            }
            if (!this._events.hasOwnProperty(eventName)) {
                this._events[eventName] = [];
            }
            this._events[eventName].push(callback);
        });
        return this;
    }
    once(event, callback) {
        const boundCallback = (...args) => {
            callback(...args);
            this.off(event, boundCallback);
        };
        this.on(event, boundCallback);
        return this;
    }
    off(event, callback) {
        const events = event.split(/\W+/);
        events.forEach((eventName) => {
            if (isUndef(this._events)) {
                this._events = {};
            }
            if (this._events.hasOwnProperty(eventName)) {
                if (isUndef(callback)) {
                    this._events[eventName] = [];
                }
                else {
                    const eventList = this._events[eventName];
                    for (let i = eventList.length - 1; i >= 0; i--) {
                        if (eventList[i] === callback) {
                            eventList.splice(i, 1);
                        }
                    }
                }
            }
        });
        return this;
    }
    emit(event, ...args) {
        if (this._events) {
            if (this._events.hasOwnProperty(event)) {
                const eventList = this._events[event].slice(0);
                for (let i = 0, len = eventList.length; i < len; i++) {
                    eventList[i].apply(this, args);
                }
            }
        }
        return this;
    }
    static mixin(constr) {
        ["on", "once", "off", "emit"].forEach((name) => {
            const property = Object.getOwnPropertyDescriptor(Emitter.prototype, name);
            Object.defineProperty(constr.prototype, name, property);
        });
    }
    dispose() {
        super.dispose();
        this._events = undefined;
        return this;
    }
}
class BaseContext extends Emitter {
    constructor() {
        super(...arguments);
        this.isOffline = false;
    }
    toJSON() {
        return {};
    }
}
class DummyContext extends BaseContext {
    constructor() {
        super(...arguments);
        this.lookAhead = 0;
        this.latencyHint = 0;
        this.isOffline = false;
    }
    createAnalyser() {
        return {};
    }
    createOscillator() {
        return {};
    }
    createBufferSource() {
        return {};
    }
    createBiquadFilter() {
        return {};
    }
    createBuffer(_numberOfChannels, _length, _sampleRate) {
        return {};
    }
    createChannelMerger(_numberOfInputs) {
        return {};
    }
    createChannelSplitter(_numberOfOutputs) {
        return {};
    }
    createConstantSource() {
        return {};
    }
    createConvolver() {
        return {};
    }
    createDelay(_maxDelayTime) {
        return {};
    }
    createDynamicsCompressor() {
        return {};
    }
    createGain() {
        return {};
    }
    createIIRFilter(_feedForward, _feedback) {
        return {};
    }
    createPanner() {
        return {};
    }
    createPeriodicWave(_real, _imag, _constraints) {
        return {};
    }
    createStereoPanner() {
        return {};
    }
    createWaveShaper() {
        return {};
    }
    createMediaStreamSource(_stream) {
        return {};
    }
    createMediaElementSource(_element) {
        return {};
    }
    createMediaStreamDestination() {
        return {};
    }
    decodeAudioData(_audioData) {
        return Promise.resolve({});
    }
    createAudioWorkletNode(_name, _options) {
        return {};
    }
    get rawContext() {
        return {};
    }
    async addAudioWorkletModule(_url) {
        return Promise.resolve();
    }
    resume() {
        return Promise.resolve();
    }
    setTimeout(_fn, _timeout) {
        return 0;
    }
    clearTimeout(_id) {
        return this;
    }
    setInterval(_fn, _interval) {
        return 0;
    }
    clearInterval(_id) {
        return this;
    }
    getConstant(_val) {
        return {};
    }
    get currentTime() {
        return 0;
    }
    get state() {
        return {};
    }
    get sampleRate() {
        return 0;
    }
    get listener() {
        return {};
    }
    get transport() {
        return {};
    }
    get draw() {
        return {};
    }
    set draw(_d) { }
    get destination() {
        return {};
    }
    set destination(_d) { }
    now() {
        return 0;
    }
    immediate() {
        return 0;
    }
}
class stdAudioContext {
    constructor(options) {
    }
}
class stdOfflineAudioContext {
    constructor(channels, length, sampleRate) {
    }
}
class stdAudioWorkletNode {
}
function createAudioContext(options) {
    return new stdAudioContext(options);
}
function createOfflineAudioContext(channels, length, sampleRate) {
    return new stdOfflineAudioContext(channels, length, sampleRate);
}
const theWindow = typeof self === "object" ? self : null;
const hasAudioContext = theWindow &&
    (theWindow.hasOwnProperty("AudioContext") ||
        theWindow.hasOwnProperty("webkitAudioContext"));
function createAudioWorkletNode(context, name, options) {
    assert(isDefined(stdAudioWorkletNode), "AudioWorkletNode only works in a secure context (https or localhost)");
    return new (context instanceof (theWindow === null || theWindow === void 0 ? void 0 : theWindow.BaseAudioContext)
        ? theWindow === null || theWindow === void 0 ? void 0 : theWindow.AudioWorkletNode
        : stdAudioWorkletNode)(context, name, options);
}
const dummyContext = new DummyContext();
let globalContext = dummyContext;
function getContext() {
    if (globalContext === dummyContext && hasAudioContext) {
        setContext(new Context());
    }
    return globalContext;
}
function setContext(context, disposeOld = false) {
    console.log('setContext', context, disposeOld);
    if (disposeOld) {
        globalContext.dispose();
    }
    if (isAudioContext(context)) {
        globalContext = new Context(context);
    }
    else if (isOfflineAudioContext(context)) {
        globalContext = new OfflineContext(context);
    }
    else {
        globalContext = context;
    }
}
function start() {
    return globalContext.resume();
}
if (theWindow && !theWindow.TONE_SILENCE_LOGGING) {
    let prefix = "v";
    if (version === "dev") {
        prefix = "";
    }
    const printString = ` * Tone.js ${prefix}${version} * `;
    console.log(`%c${printString}`, "background: #ff0; color: #fff");
}
class Context extends BaseContext {
    constructor() {
        var _a, _b;
        super();
        this.name = "Context";
        this._constants = new Map();
        this._timeouts = new Timeline();
        this._timeoutIds = 0;
        this._initialized = false;
        this._closeStarted = false;
        this.isOffline = false;
        this._workletPromises = new Set();
        const options = optionsFromArguments(Context.getDefaults(), arguments, [
            "context",
        ]);
        if (options.context) {
            this._context = options.context;
            this._latencyHint = ((_a = arguments[0]) === null || _a === void 0 ? void 0 : _a.latencyHint) || "";
        }
        else {
            this._context = createAudioContext(options.sampleRate
                ? {
                    latencyHint: options.latencyHint,
                    sampleRate: options.sampleRate,
                }
                : {
                    latencyHint: options.latencyHint,
                });
            this._latencyHint = options.latencyHint;
        }
        this._ticker = new Ticker(this.emit.bind(this, "tick"), options.clockSource, options.updateInterval, this._context.sampleRate);
        this.on("tick", this._timeoutLoop.bind(this));
        this._context.onstatechange = () => {
            this.emit("statechange", this.state);
        };
        this[((_b = arguments[0]) === null || _b === void 0 ? void 0 : _b.hasOwnProperty("updateInterval"))
            ? "_lookAhead"
            : "lookAhead"] = options.lookAhead;
    }
    static getDefaults() {
        return {
            clockSource: "worker",
            latencyHint: "interactive",
            lookAhead: 0.1,
            updateInterval: 0.05,
        };
    }
    initialize() {
        if (!this._initialized) {
            initializeContext(this);
            this._initialized = true;
        }
        return this;
    }
    createAnalyser() {
        return this._context.createAnalyser();
    }
    createOscillator() {
        return this._context.createOscillator();
    }
    createBufferSource() {
        return this._context.createBufferSource();
    }
    createBiquadFilter() {
        return this._context.createBiquadFilter();
    }
    createBuffer(numberOfChannels, length, sampleRate) {
        return this._context.createBuffer(numberOfChannels, length, sampleRate);
    }
    createChannelMerger(numberOfInputs) {
        return this._context.createChannelMerger(numberOfInputs);
    }
    createChannelSplitter(numberOfOutputs) {
        return this._context.createChannelSplitter(numberOfOutputs);
    }
    createConstantSource() {
        return this._context.createConstantSource();
    }
    createConvolver() {
        return this._context.createConvolver();
    }
    createDelay(maxDelayTime) {
        return this._context.createDelay(maxDelayTime);
    }
    createDynamicsCompressor() {
        return this._context.createDynamicsCompressor();
    }
    createGain() {
        return this._context.createGain();
    }
    createIIRFilter(feedForward, feedback) {
        return this._context.createIIRFilter(feedForward, feedback);
    }
    createPanner() {
        return this._context.createPanner();
    }
    createPeriodicWave(real, imag, constraints) {
        return this._context.createPeriodicWave(real, imag, constraints);
    }
    createStereoPanner() {
        return this._context.createStereoPanner();
    }
    createWaveShaper() {
        return this._context.createWaveShaper();
    }
    createMediaStreamSource(stream) {
        assert(isAudioContext(this._context), "Not available if OfflineAudioContext");
        const context = this._context;
        return context.createMediaStreamSource(stream);
    }
    createMediaElementSource(element) {
        assert(isAudioContext(this._context), "Not available if OfflineAudioContext");
        const context = this._context;
        return context.createMediaElementSource(element);
    }
    createMediaStreamDestination() {
        assert(isAudioContext(this._context), "Not available if OfflineAudioContext");
        const context = this._context;
        return context.createMediaStreamDestination();
    }
    decodeAudioData(audioData) {
        return this._context.decodeAudioData(audioData);
    }
    get currentTime() {
        return this._context.currentTime;
    }
    get state() {
        return this._context.state;
    }
    get sampleRate() {
        return this._context.sampleRate;
    }
    get listener() {
        this.initialize();
        return this._listener;
    }
    set listener(l) {
        assert(!this._initialized, "The listener cannot be set after initialization.");
        this._listener = l;
    }
    get transport() {
        this.initialize();
        return this._transport;
    }
    set transport(t) {
        assert(!this._initialized, "The transport cannot be set after initialization.");
        this._transport = t;
    }
    get draw() {
        this.initialize();
        return this._draw;
    }
    set draw(d) {
        assert(!this._initialized, "Draw cannot be set after initialization.");
        this._draw = d;
    }
    get destination() {
        this.initialize();
        return this._destination;
    }
    set destination(d) {
        assert(!this._initialized, "The destination cannot be set after initialization.");
        this._destination = d;
    }
    createAudioWorkletNode(name, options) {
        return createAudioWorkletNode(this.rawContext, name, options);
    }
    async addAudioWorkletModule(url) {
        assert(isDefined(this.rawContext.audioWorklet), "AudioWorkletNode is only available in a secure context (https or localhost)");
        const workletPromise = this.rawContext.audioWorklet.addModule(url);
        this._workletPromises.add(workletPromise);
        workletPromise.finally(() => this._workletPromises.delete(workletPromise));
        return workletPromise;
    }
    async workletsAreReady() {
        await Promise.all(this._workletPromises);
    }
    get updateInterval() {
        return this._ticker.updateInterval;
    }
    set updateInterval(interval) {
        this._ticker.updateInterval = interval;
    }
    get clockSource() {
        return this._ticker.type;
    }
    set clockSource(type) {
        this._ticker.type = type;
    }
    get lookAhead() {
        return this._lookAhead;
    }
    set lookAhead(time) {
        this._lookAhead = time;
        this.updateInterval = time ? time / 2 : 0.01;
    }
    get latencyHint() {
        return this._latencyHint;
    }
    get rawContext() {
        return this._context;
    }
    now() {
        return this._context.currentTime + this._lookAhead;
    }
    immediate() {
        return this._context.currentTime;
    }
    resume() {
        if (isAudioContext(this._context)) {
            return this._context.resume();
        }
        else {
            return Promise.resolve();
        }
    }
    async close() {
        if (isAudioContext(this._context) &&
            this.state !== "closed" &&
            !this._closeStarted) {
            this._closeStarted = true;
            await this._context.close();
        }
        if (this._initialized) {
            closeContext(this);
        }
    }
    getConstant(val) {
        if (this._constants.has(val)) {
            return this._constants.get(val);
        }
        else {
            const buffer = this._context.createBuffer(1, 128, this._context.sampleRate);
            const arr = buffer.getChannelData(0);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = val;
            }
            const constant = this._context.createBufferSource();
            constant.channelCount = 1;
            constant.channelCountMode = "explicit";
            constant.buffer = buffer;
            constant.loop = true;
            constant.start(0);
            this._constants.set(val, constant);
            return constant;
        }
    }
    dispose() {
        super.dispose();
        this._ticker.dispose();
        this._timeouts.dispose();
        Object.keys(this._constants).map((val) => this._constants[val].disconnect());
        this.close();
        return this;
    }
    _timeoutLoop() {
        const now = this.now();
        this._timeouts.forEachBefore(now, (event) => {
            try {
                event.callback();
            }
            finally {
                this._timeouts.remove(event);
            }
        });
    }
    setTimeout(fn, timeout) {
        this._timeoutIds++;
        const now = this.now();
        this._timeouts.add({
            callback: fn,
            id: this._timeoutIds,
            time: now + timeout,
        });
        return this._timeoutIds;
    }
    clearTimeout(id) {
        this._timeouts.forEach((event) => {
            if (event.id === id) {
                this._timeouts.remove(event);
            }
        });
        return this;
    }
    clearInterval(id) {
        return this.clearTimeout(id);
    }
    setInterval(fn, interval) {
        const id = ++this._timeoutIds;
        const intervalFn = () => {
            const now = this.now();
            this._timeouts.add({
                callback: () => {
                    fn();
                    intervalFn();
                },
                id,
                time: now + interval,
            });
        };
        intervalFn();
        return id;
    }
}
class OfflineContext extends Context {
    constructor() {
        super({
            clockSource: "offline",
            context: isOfflineAudioContext(arguments[0])
                ? arguments[0]
                : createOfflineAudioContext(arguments[0], arguments[1] * arguments[2], arguments[2]),
            lookAhead: 0,
            updateInterval: isOfflineAudioContext(arguments[0])
                ? 128 / arguments[0].sampleRate
                : 128 / arguments[2],
        });
        this.name = "OfflineContext";
        this._currentTime = 0;
        this.isOffline = true;
        this._duration = isOfflineAudioContext(arguments[0])
            ? arguments[0].length / arguments[0].sampleRate
            : arguments[1];
    }
    now() {
        return this._currentTime;
    }
    get currentTime() {
        return this._currentTime;
    }
    async _renderClock(asynchronous) {
        let index = 0;
        while (this._duration - this._currentTime >= 0) {
            this.emit("tick");
            this._currentTime += 128 / this.sampleRate;
            index++;
            const yieldEvery = Math.floor(this.sampleRate / 128);
            if (asynchronous && index % yieldEvery === 0) {
                await new Promise((done) => setTimeout(done, 1));
            }
        }
    }
    async render(asynchronous = true) {
        await this.workletsAreReady();
        await this._renderClock(asynchronous);
        const buffer = await this._context.startRendering();
        return new ToneAudioBuffer(buffer);
    }
    close() {
        return Promise.resolve();
    }
}
class ToneAudioBuffer extends Tone {
    constructor() {
        super();
        this.name = "ToneAudioBuffer";
        this.onload = noOp;
        const options = optionsFromArguments(ToneAudioBuffer.getDefaults(), arguments, ["url", "onload", "onerror"]);
        this.reverse = options.reverse;
        this.onload = options.onload;
        if (isString(options.url)) {
            this.load(options.url).catch(options.onerror);
        }
        else if (options.url) {
            this.set(options.url);
        }
    }
    static getDefaults() {
        return {
            onerror: noOp,
            onload: noOp,
            reverse: false,
        };
    }
    get sampleRate() {
        if (this._buffer) {
            return this._buffer.sampleRate;
        }
        else {
            return getContext().sampleRate;
        }
    }
    set(buffer) {
        if (buffer instanceof ToneAudioBuffer) {
            if (buffer.loaded) {
                this._buffer = buffer.get();
            }
            else {
                buffer.onload = () => {
                    this.set(buffer);
                    this.onload(this);
                };
            }
        }
        else {
            this._buffer = buffer;
        }
        if (this._reversed) {
            this._reverse();
        }
        return this;
    }
    get() {
        return this._buffer;
    }
    async load(url) {
        const doneLoading = ToneAudioBuffer.load(url).then((audioBuffer) => {
            this.set(audioBuffer);
            this.onload(this);
        });
        ToneAudioBuffer.downloads.push(doneLoading);
        try {
            await doneLoading;
        }
        finally {
            const index = ToneAudioBuffer.downloads.indexOf(doneLoading);
            ToneAudioBuffer.downloads.splice(index, 1);
        }
        return this;
    }
    dispose() {
        super.dispose();
        this._buffer = undefined;
        return this;
    }
    fromArray(array) {
        const isMultidimensional = isArray(array) && array[0].length > 0;
        const channels = isMultidimensional ? array.length : 1;
        const len = isMultidimensional
            ? array[0].length
            : array.length;
        const context = getContext();
        const buffer = context.createBuffer(channels, len, context.sampleRate);
        const multiChannelArray = !isMultidimensional && channels === 1
            ? [array]
            : array;
        for (let c = 0; c < channels; c++) {
            let converted = new Float32Array(multiChannelArray[c]);
            buffer.copyToChannel(converted, c);
        }
        this._buffer = buffer;
        return this;
    }
    toMono(chanNum) {
        if (isNumber(chanNum)) {
            this.fromArray(this.toArray(chanNum));
        }
        else {
            let outputArray = new Float32Array(this.length);
            const numChannels = this.numberOfChannels;
            for (let channel = 0; channel < numChannels; channel++) {
                const channelArray = this.toArray(channel);
                for (let i = 0; i < channelArray.length; i++) {
                    outputArray[i] += channelArray[i];
                }
            }
            outputArray = outputArray.map((sample) => sample / numChannels);
            this.fromArray(outputArray);
        }
        return this;
    }
    toArray(channel) {
        if (isNumber(channel)) {
            return this.getChannelData(channel);
        }
        else if (this.numberOfChannels === 1) {
            return this.toArray(0);
        }
        else {
            const ret = [];
            for (let c = 0; c < this.numberOfChannels; c++) {
                ret[c] = this.getChannelData(c);
            }
            return ret;
        }
    }
    getChannelData(channel) {
        if (this._buffer) {
            return this._buffer.getChannelData(channel);
        }
        else {
            return new Float32Array(0);
        }
    }
    slice(start, end = this.duration) {
        assert(this.loaded, "Buffer is not loaded");
        const startSamples = Math.floor(start * this.sampleRate);
        const endSamples = Math.floor(end * this.sampleRate);
        assert(startSamples < endSamples, "The start time must be less than the end time");
        const length = endSamples - startSamples;
        const retBuffer = getContext().createBuffer(this.numberOfChannels, length, this.sampleRate);
        for (let channel = 0; channel < this.numberOfChannels; channel++) {
            let farr = new Float32Array(this.getChannelData(channel).subarray(startSamples, endSamples));
            retBuffer.copyToChannel(farr, channel);
        }
        return new ToneAudioBuffer(retBuffer);
    }
    _reverse() {
        if (this.loaded) {
            for (let i = 0; i < this.numberOfChannels; i++) {
                this.getChannelData(i).reverse();
            }
        }
        return this;
    }
    get loaded() {
        return this.length > 0;
    }
    get duration() {
        if (this._buffer) {
            return this._buffer.duration;
        }
        else {
            return 0;
        }
    }
    get length() {
        if (this._buffer) {
            return this._buffer.length;
        }
        else {
            return 0;
        }
    }
    get numberOfChannels() {
        if (this._buffer) {
            return this._buffer.numberOfChannels;
        }
        else {
            return 0;
        }
    }
    get reverse() {
        return this._reversed;
    }
    set reverse(rev) {
        if (this._reversed !== rev) {
            this._reversed = rev;
            this._reverse();
        }
    }
    static fromArray(array) {
        return new ToneAudioBuffer().fromArray(array);
    }
    static async fromUrl(url) {
        const buffer = new ToneAudioBuffer();
        return await buffer.load(url);
    }
    static async load(url) {
        const baseUrl = ToneAudioBuffer.baseUrl === "" ||
            ToneAudioBuffer.baseUrl.endsWith("/")
            ? ToneAudioBuffer.baseUrl
            : ToneAudioBuffer.baseUrl + "/";
        const response = await fetch(baseUrl + url);
        if (!response.ok) {
            throw new Error(`could not load url: ${url}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await getContext().decodeAudioData(arrayBuffer);
        return audioBuffer;
    }
    static supportsType(url) {
        const extensions = url.split(".");
        const extension = extensions[extensions.length - 1];
        const response = document
            .createElement("audio")
            .canPlayType("audio/" + extension);
        return response !== "";
    }
    static async loaded() {
        await Promise.resolve();
        while (ToneAudioBuffer.downloads.length) {
            await ToneAudioBuffer.downloads[0];
        }
    }
}
ToneAudioBuffer.baseUrl = "";
ToneAudioBuffer.downloads = [];
function equalPowerScale(percent) {
    const piFactor = 0.5 * Math.PI;
    return Math.sin(percent * piFactor);
}
function dbToGain(db) {
    return Math.pow(10, db / 20);
}
function gainToDb(gain) {
    return 20 * (Math.log(gain) / Math.LN10);
}
function intervalToFrequencyRatio(interval) {
    return Math.pow(2, interval / 12);
}
let A4 = 440;
function getA4() {
    return A4;
}
function setA4(freq) {
    A4 = freq;
}
function ftom(frequency) {
    return Math.round(ftomf(frequency));
}
function ftomf(frequency) {
    return 69 + 12 * Math.log2(frequency / A4);
}
function mtof(midi) {
    return A4 * Math.pow(2, (midi - 69) / 12);
}
function isUndef(arg) {
    return arg === undefined;
}
function isDefined(arg) {
    return arg !== undefined;
}
function isFunction(arg) {
    return typeof arg === "function";
}
function isNumber(arg) {
    return typeof arg === "number";
}
function isObject(arg) {
    return (Object.prototype.toString.call(arg) === "[object Object]" &&
        arg.constructor === Object);
}
function isBoolean(arg) {
    return typeof arg === "boolean";
}
function isArray(arg) {
    return Array.isArray(arg);
}
function isString(arg) {
    return typeof arg === "string";
}
function isNote(arg) {
    return isString(arg) && /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i.test(arg);
}
class ToneWithContext extends Tone {
    constructor() {
        super();
        const options = optionsFromArguments(ToneWithContext.getDefaults(), arguments, ["context"]);
        if (this.defaultContext) {
            this.context = this.defaultContext;
        }
        else {
            this.context = options.context;
        }
    }
    static getDefaults() {
        return {
            context: getContext(),
        };
    }
    now() {
        return this.context.currentTime + this.context.lookAhead;
    }
    immediate() {
        return this.context.currentTime;
    }
    get sampleTime() {
        return 1 / this.context.sampleRate;
    }
    get blockTime() {
        return 128 / this.context.sampleRate;
    }
    toSeconds(time) {
        assertUsedScheduleTime(time);
        return new TimeClass(this.context, time).toSeconds();
    }
    toFrequency(freq) {
        return new FrequencyClass(this.context, freq).toFrequency();
    }
    toTicks(time) {
        return new TransportTimeClass(this.context, time).toTicks();
    }
    _getPartialProperties(props) {
        const options = this.get();
        Object.keys(options).forEach((name) => {
            if (isUndef(props[name])) {
                delete options[name];
            }
        });
        return options;
    }
    get() {
        const defaults = getDefaultsFromInstance(this);
        Object.keys(defaults).forEach((attribute) => {
            if (Reflect.has(this, attribute)) {
                const member = this[attribute];
                if (isDefined(member) &&
                    isDefined(member.value) &&
                    isDefined(member.setValueAtTime)) {
                    defaults[attribute] = member.value;
                }
                else if (member instanceof ToneWithContext) {
                    defaults[attribute] = member._getPartialProperties(defaults[attribute]);
                }
                else if (isArray(member) ||
                    isNumber(member) ||
                    isString(member) ||
                    isBoolean(member)) {
                    defaults[attribute] = member;
                }
                else {
                    delete defaults[attribute];
                }
            }
        });
        return defaults;
    }
    set(props) {
        Object.keys(props).forEach((attribute) => {
            if (Reflect.has(this, attribute) && isDefined(this[attribute])) {
                if (this[attribute] &&
                    isDefined(this[attribute].value) &&
                    isDefined(this[attribute].setValueAtTime)) {
                    if (this[attribute].value !== props[attribute]) {
                        this[attribute].value = props[attribute];
                    }
                }
                else if (this[attribute] instanceof ToneWithContext) {
                    this[attribute].set(props[attribute]);
                }
                else {
                    this[attribute] = props[attribute];
                }
            }
        });
        return this;
    }
}
class ToneAudioNode extends ToneWithContext {
    constructor() {
        super(...arguments);
        this._internalChannels = [];
    }
    get numberOfInputs() {
        if (isDefined(this.input)) {
            if (isAudioParam(this.input) || this.input instanceof Param) {
                return 1;
            }
            else {
                return this.input.numberOfInputs;
            }
        }
        else {
            return 0;
        }
    }
    get numberOfOutputs() {
        if (isDefined(this.baseOutputNode)) {
            return this.baseOutputNode.numberOfOutputs;
        }
        else {
            return 0;
        }
    }
    _isAudioNode(node) {
        return (isDefined(node) &&
            (node instanceof ToneAudioNode || isAudioNode(node)));
    }
    _getInternalNodes() {
        const nodeList = this._internalChannels.slice(0);
        if (this._isAudioNode(this.input)) {
            nodeList.push(this.input);
        }
        if (this._isAudioNode(this.baseOutputNode)) {
            if (this.input !== this.baseOutputNode) {
                nodeList.push(this.baseOutputNode);
            }
        }
        return nodeList;
    }
    _setChannelProperties(options) {
        const nodeList = this._getInternalNodes();
        nodeList.forEach((node) => {
            node.channelCount = options.channelCount;
            node.channelCountMode = options.channelCountMode;
            node.channelInterpretation = options.channelInterpretation;
        });
    }
    _getChannelProperties() {
        const nodeList = this._getInternalNodes();
        assert(nodeList.length > 0, "ToneAudioNode does not have any internal nodes");
        const node = nodeList[0];
        return {
            channelCount: node.channelCount,
            channelCountMode: node.channelCountMode,
            channelInterpretation: node.channelInterpretation,
        };
    }
    get channelCount() {
        return this._getChannelProperties().channelCount;
    }
    set channelCount(channelCount) {
        const props = this._getChannelProperties();
        this._setChannelProperties(Object.assign(props, { channelCount }));
    }
    get channelCountMode() {
        return this._getChannelProperties().channelCountMode;
    }
    set channelCountMode(channelCountMode) {
        const props = this._getChannelProperties();
        this._setChannelProperties(Object.assign(props, { channelCountMode }));
    }
    get channelInterpretation() {
        return this._getChannelProperties().channelInterpretation;
    }
    set channelInterpretation(channelInterpretation) {
        const props = this._getChannelProperties();
        this._setChannelProperties(Object.assign(props, { channelInterpretation }));
    }
    connect(destination, outputNum = 0, inputNum = 0) {
        connect(this, destination, outputNum, inputNum);
        return this;
    }
    toDestination() {
        this.connect(this.context.destination);
        return this;
    }
    toMaster() {
        console.error("toMaster() has been renamed toDestination()");
        return this.toDestination();
    }
    disconnect(destination, outputNum = 0, inputNum = 0) {
        disconnect(this, destination, outputNum, inputNum);
        return this;
    }
    chain(...nodes) {
        connectSeries(this, ...nodes);
        return this;
    }
    fan(...nodes) {
        nodes.forEach((node) => this.connect(node));
        return this;
    }
    dispose() {
        super.dispose();
        if (isDefined(this.input)) {
            if (this.input instanceof ToneAudioNode) {
                this.input.dispose();
            }
            else if (isAudioNode(this.input)) {
                this.input.disconnect();
            }
        }
        if (isDefined(this.baseOutputNode)) {
            if (this.baseOutputNode instanceof ToneAudioNode) {
                this.baseOutputNode.dispose();
            }
            else if (isAudioNode(this.baseOutputNode)) {
                this.baseOutputNode.disconnect();
            }
        }
        this._internalChannels = [];
        return this;
    }
}
function connectSeries(...nodes) {
    const first = nodes.shift();
    nodes.reduce((prev, current) => {
        if (prev instanceof ToneAudioNode) {
            prev.connect(current);
        }
        else if (isAudioNode(prev)) {
            connect(prev, current);
        }
        return current;
    }, first);
}
function connect(srcNode, dstNode, outputNumber = 0, inputNumber = 0) {
    assert(isDefined(srcNode), "Cannot connect from undefined node");
    assert(isDefined(dstNode), "Cannot connect to undefined node");
    if (dstNode instanceof ToneAudioNode || isAudioNode(dstNode)) {
        assert(dstNode.numberOfInputs > 0, "Cannot connect to node with no inputs");
    }
    assert(srcNode.numberOfOutputs > 0, "Cannot connect from node with no outputs");
    while (dstNode instanceof ToneAudioNode || dstNode instanceof Param) {
        if (isDefined(dstNode.input)) {
            dstNode = dstNode.input;
        }
    }
    while (srcNode instanceof ToneAudioNode) {
        if (isDefined(srcNode.baseOutputNode)) {
            srcNode = srcNode.baseOutputNode;
        }
    }
    if (isAudioParam(dstNode)) {
        console.log('connect node to param');
        srcNode.connect(dstNode, outputNumber);
    }
    else {
        console.log('connect node to node');
        srcNode.connect(dstNode, outputNumber, inputNumber);
    }
}
function disconnect(srcNode, dstNode, outputNumber = 0, inputNumber = 0) {
    if (isDefined(dstNode)) {
        while (dstNode instanceof ToneAudioNode) {
            dstNode = dstNode.input;
        }
    }
    while (!isAudioNode(srcNode)) {
        if (isDefined(srcNode.baseOutputNode)) {
            srcNode = srcNode.baseOutputNode;
        }
    }
    if (isAudioParam(dstNode)) {
        srcNode.disconnect(dstNode, outputNumber);
    }
    else if (isAudioNode(dstNode)) {
        srcNode.disconnect(dstNode, outputNumber, inputNumber);
    }
    else {
        srcNode.disconnect();
    }
}
function fanIn(...nodes) {
    const dstNode = nodes.pop();
    if (isDefined(dstNode)) {
        nodes.forEach((node) => connect(node, dstNode));
    }
}
class Volume extends ToneAudioNode {
    constructor() {
        const options = optionsFromArguments(Volume.getDefaults(), arguments, [
            "volume",
        ]);
        super(options);
        this.name = "Volume";
        this.input = this.baseOutputNode = new Gain({
            context: this.context,
            gain: options.volume,
            units: "decibels",
        });
        this.volume = this.baseOutputNode.gain;
        readOnly(this, "volume");
        this._unmutedVolume = options.volume;
        this.mute = options.mute;
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            mute: false,
            volume: 0,
        });
    }
    get mute() {
        return this.volume.value === -Infinity;
    }
    set mute(mute) {
        if (!this.mute && mute) {
            this._unmutedVolume = this.volume.value;
            this.volume.value = -Infinity;
        }
        else if (this.mute && !mute) {
            this.volume.value = this._unmutedVolume;
        }
    }
    dispose() {
        super.dispose();
        this.input.dispose();
        this.volume.dispose();
        return this;
    }
}
class OneShotSource extends ToneAudioNode {
    constructor(options) {
        super(options);
        this.onended = noOp;
        this._startTime = -1;
        this._stopTime = -1;
        this._timeout = -1;
        this.baseOutputNode = new Gain({
            context: this.context,
            gain: 0,
        });
        this._gainNode = this.baseOutputNode;
        this.getStateAtTime = function (time) {
            const computedTime = this.toSeconds(time);
            if (this._startTime !== -1 &&
                computedTime >= this._startTime &&
                (this._stopTime === -1 || computedTime <= this._stopTime)) {
                return "started";
            }
            else {
                return "stopped";
            }
        };
        this._fadeIn = options.fadeIn;
        this._fadeOut = options.fadeOut;
        this._curve = options.curve;
        this.onended = options.onended;
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            curve: "linear",
            fadeIn: 0,
            fadeOut: 0,
            onended: noOp,
        });
    }
    _startGain(time, gain = 1) {
        assert(this._startTime === -1, "Source cannot be started more than once");
        const fadeInTime = this.toSeconds(this._fadeIn);
        this._startTime = time + fadeInTime;
        this._startTime = Math.max(this._startTime, this.context.currentTime);
        if (fadeInTime > 0) {
            this._gainNode.gain.setValueAtTime(0, time);
            if (this._curve === "linear") {
                this._gainNode.gain.linearRampToValueAtTime(gain, time + fadeInTime);
            }
            else {
                this._gainNode.gain.exponentialApproachValueAtTime(gain, time, fadeInTime);
            }
        }
        else {
            this._gainNode.gain.setValueAtTime(gain, time);
        }
        return this;
    }
    stop(time) {
        this.log("stop", time);
        this._stopGain(this.toSeconds(time));
        return this;
    }
    _stopGain(time) {
        assert(this._startTime !== -1, "'start' must be called before 'stop'");
        this.cancelStop();
        const fadeOutTime = this.toSeconds(this._fadeOut);
        this._stopTime = this.toSeconds(time) + fadeOutTime;
        this._stopTime = Math.max(this._stopTime, this.now());
        if (fadeOutTime > 0) {
            if (this._curve === "linear") {
                this._gainNode.gain.linearRampTo(0, fadeOutTime, time);
            }
            else {
                this._gainNode.gain.targetRampTo(0, fadeOutTime, time);
            }
        }
        else {
            this._gainNode.gain.cancelAndHoldAtTime(time);
            this._gainNode.gain.setValueAtTime(0, time);
        }
        this.context.clearTimeout(this._timeout);
        this._timeout = this.context.setTimeout(() => {
            const additionalTail = this._curve === "exponential" ? fadeOutTime * 2 : 0;
            this._stopSource(this.now() + additionalTail);
            this._onended();
        }, this._stopTime - this.context.currentTime);
        return this;
    }
    _onended() {
        if (this.onended === noOp) {
            return;
        }
        this.onended(this);
        this.onended = noOp;
        if (!this.context.isOffline) {
            const disposeCallback = () => this.dispose();
            if (typeof requestIdleCallback !== "undefined") {
                requestIdleCallback(disposeCallback);
            }
            else {
                setTimeout(disposeCallback, 10);
            }
        }
    }
    get state() {
        return this.getStateAtTime(this.now());
    }
    cancelStop() {
        this.log("cancelStop");
        assert(this._startTime !== -1, "Source is not started");
        this._gainNode.gain.cancelScheduledValues(this._startTime + this.sampleTime);
        this.context.clearTimeout(this._timeout);
        this._stopTime = -1;
        return this;
    }
    dispose() {
        super.dispose();
        this._gainNode.dispose();
        this.onended = noOp;
        return this;
    }
}
class Param extends ToneWithContext {
    constructor() {
        const options = optionsFromArguments(Param.getDefaults(), arguments, [
            "param",
            "units",
            "convert",
        ]);
        super(options);
        this.name = "Param";
        this.overridden = false;
        this._minOutput = 1e-7;
        assert(isDefined(options.param) &&
            (isAudioParam(options.param) || options.param instanceof Param), "param must be an AudioParam");
        while (!isAudioParam(options.param)) {
            options.param = options.param._param;
        }
        this._swappable = isDefined(options.swappable)
            ? options.swappable
            : false;
        if (this._swappable) {
            this.input = this.context.createGain();
            this._param = options.param;
            this.input.connect(this._param);
        }
        else {
            this._param = this.input = options.param;
        }
        this._events = new Timeline(1000);
        this._initialValue = this._param.defaultValue;
        this.units = options.units;
        this.convert = options.convert;
        this._minValue = options.minValue;
        this._maxValue = options.maxValue;
        if (isDefined(options.value) &&
            options.value !== this._toType(this._initialValue)) {
            this.setValueAtTime(options.value, 0);
        }
    }
    static getDefaults() {
        return Object.assign(ToneWithContext.getDefaults(), {
            convert: true,
            units: "number",
        });
    }
    get value() {
        const now = this.now();
        return this.getValueAtTime(now);
    }
    set value(value) {
        this.cancelScheduledValues(this.now());
        this.setValueAtTime(value, this.now());
    }
    get minValue() {
        if (isDefined(this._minValue)) {
            return this._minValue;
        }
        else if (this.units === "time" ||
            this.units === "frequency" ||
            this.units === "normalRange" ||
            this.units === "positive" ||
            this.units === "transportTime" ||
            this.units === "ticks" ||
            this.units === "bpm" ||
            this.units === "hertz" ||
            this.units === "samples") {
            return 0;
        }
        else if (this.units === "audioRange") {
            return -1;
        }
        else if (this.units === "decibels") {
            return -Infinity;
        }
        else {
            return this._param.minValue;
        }
    }
    get maxValue() {
        if (isDefined(this._maxValue)) {
            return this._maxValue;
        }
        else if (this.units === "normalRange" ||
            this.units === "audioRange") {
            return 1;
        }
        else {
            return this._param.maxValue;
        }
    }
    _is(arg, type) {
        return this.units === type;
    }
    _assertRange(value) {
        if (isDefined(this.maxValue) && isDefined(this.minValue)) {
            assertRange(value, this._fromType(this.minValue), this._fromType(this.maxValue));
        }
        return value;
    }
    _fromType(val) {
        if (this.convert && !this.overridden) {
            if (this._is(val, "time")) {
                return this.toSeconds(val);
            }
            else if (this._is(val, "decibels")) {
                return dbToGain(val);
            }
            else if (this._is(val, "frequency")) {
                return this.toFrequency(val);
            }
            else {
                return val;
            }
        }
        else if (this.overridden) {
            return 0;
        }
        else {
            return val;
        }
    }
    _toType(val) {
        if (this.convert && this.units === "decibels") {
            return gainToDb(val);
        }
        else {
            return val;
        }
    }
    setValueAtTime(value, time) {
        const computedTime = this.toSeconds(time);
        const numericValue = this._fromType(value);
        assert(isFinite(numericValue) && isFinite(computedTime), `Invalid argument(s) to setValueAtTime: ${JSON.stringify(value)}, ${JSON.stringify(time)}`);
        this._assertRange(numericValue);
        this.log(this.units, "setValueAtTime", value, computedTime);
        this._events.add({
            time: computedTime,
            type: "setValueAtTime",
            value: numericValue,
        });
        this._param.setValueAtTime(numericValue, computedTime);
        return this;
    }
    getValueAtTime(time) {
        const computedTime = Math.max(this.toSeconds(time), 0);
        const after = this._events.getAfter(computedTime);
        const before = this._events.get(computedTime);
        let value = this._initialValue;
        if (before === null) {
            value = this._initialValue;
        }
        else if (before.type === "setTargetAtTime" &&
            (after === null || after.type === "setValueAtTime")) {
            const previous = this._events.getBefore(before.time);
            let previousVal;
            if (previous === null) {
                previousVal = this._initialValue;
            }
            else {
                previousVal = previous.value;
            }
            if (before.type === "setTargetAtTime") {
                value = this._exponentialApproach(before.time, previousVal, before.value, before.constant, computedTime);
            }
        }
        else if (after === null) {
            value = before.value;
        }
        else if (after.type === "linearRampToValueAtTime" ||
            after.type === "exponentialRampToValueAtTime") {
            let beforeValue = before.value;
            if (before.type === "setTargetAtTime") {
                const previous = this._events.getBefore(before.time);
                if (previous === null) {
                    beforeValue = this._initialValue;
                }
                else {
                    beforeValue = previous.value;
                }
            }
            if (after.type === "linearRampToValueAtTime") {
                value = this._linearInterpolate(before.time, beforeValue, after.time, after.value, computedTime);
            }
            else {
                value = this._exponentialInterpolate(before.time, beforeValue, after.time, after.value, computedTime);
            }
        }
        else {
            value = before.value;
        }
        return this._toType(value);
    }
    setRampPoint(time) {
        time = this.toSeconds(time);
        let currentVal = this.getValueAtTime(time);
        this.cancelAndHoldAtTime(time);
        if (this._fromType(currentVal) === 0) {
            currentVal = this._toType(this._minOutput);
        }
        this.setValueAtTime(currentVal, time);
        return this;
    }
    linearRampToValueAtTime(value, endTime) {
        const numericValue = this._fromType(value);
        const computedTime = this.toSeconds(endTime);
        assert(isFinite(numericValue) && isFinite(computedTime), `Invalid argument(s) to linearRampToValueAtTime: ${JSON.stringify(value)}, ${JSON.stringify(endTime)}`);
        this._assertRange(numericValue);
        this._events.add({
            time: computedTime,
            type: "linearRampToValueAtTime",
            value: numericValue,
        });
        this.log(this.units, "linearRampToValueAtTime", value, computedTime);
        this._param.linearRampToValueAtTime(numericValue, computedTime);
        return this;
    }
    exponentialRampToValueAtTime(value, endTime) {
        let numericValue = this._fromType(value);
        numericValue = EQ(numericValue, 0) ? this._minOutput : numericValue;
        this._assertRange(numericValue);
        const computedTime = this.toSeconds(endTime);
        assert(isFinite(numericValue) && isFinite(computedTime), `Invalid argument(s) to exponentialRampToValueAtTime: ${JSON.stringify(value)}, ${JSON.stringify(endTime)}`);
        this._events.add({
            time: computedTime,
            type: "exponentialRampToValueAtTime",
            value: numericValue,
        });
        this.log(this.units, "exponentialRampToValueAtTime", value, computedTime);
        this._param.exponentialRampToValueAtTime(numericValue, computedTime);
        return this;
    }
    exponentialRampTo(value, rampTime, startTime) {
        startTime = this.toSeconds(startTime);
        this.setRampPoint(startTime);
        this.exponentialRampToValueAtTime(value, startTime + this.toSeconds(rampTime));
        return this;
    }
    linearRampTo(value, rampTime, startTime) {
        startTime = this.toSeconds(startTime);
        this.setRampPoint(startTime);
        this.linearRampToValueAtTime(value, startTime + this.toSeconds(rampTime));
        return this;
    }
    targetRampTo(value, rampTime, startTime) {
        startTime = this.toSeconds(startTime);
        this.setRampPoint(startTime);
        this.exponentialApproachValueAtTime(value, startTime, rampTime);
        return this;
    }
    exponentialApproachValueAtTime(value, time, rampTime) {
        time = this.toSeconds(time);
        rampTime = this.toSeconds(rampTime);
        const timeConstant = Math.log(rampTime + 1) / Math.log(200);
        this.setTargetAtTime(value, time, timeConstant);
        this.cancelAndHoldAtTime(time + rampTime * 0.9);
        this.linearRampToValueAtTime(value, time + rampTime);
        return this;
    }
    setTargetAtTime(value, startTime, timeConstant) {
        const numericValue = this._fromType(value);
        assert(isFinite(timeConstant) && timeConstant > 0, "timeConstant must be a number greater than 0");
        const computedTime = this.toSeconds(startTime);
        this._assertRange(numericValue);
        assert(isFinite(numericValue) && isFinite(computedTime), `Invalid argument(s) to setTargetAtTime: ${JSON.stringify(value)}, ${JSON.stringify(startTime)}`);
        this._events.add({
            constant: timeConstant,
            time: computedTime,
            type: "setTargetAtTime",
            value: numericValue,
        });
        this.log(this.units, "setTargetAtTime", value, computedTime, timeConstant);
        this._param.setTargetAtTime(numericValue, computedTime, timeConstant);
        return this;
    }
    setValueCurveAtTime(values, startTime, duration, scaling = 1) {
        duration = this.toSeconds(duration);
        startTime = this.toSeconds(startTime);
        const startingValue = this._fromType(values[0]) * scaling;
        this.setValueAtTime(this._toType(startingValue), startTime);
        const segTime = duration / (values.length - 1);
        for (let i = 1; i < values.length; i++) {
            const numericValue = this._fromType(values[i]) * scaling;
            this.linearRampToValueAtTime(this._toType(numericValue), startTime + i * segTime);
        }
        return this;
    }
    cancelScheduledValues(time) {
        const computedTime = this.toSeconds(time);
        assert(isFinite(computedTime), `Invalid argument to cancelScheduledValues: ${JSON.stringify(time)}`);
        this._events.cancel(computedTime);
        this._param.cancelScheduledValues(computedTime);
        this.log(this.units, "cancelScheduledValues", computedTime);
        return this;
    }
    cancelAndHoldAtTime(time) {
        const computedTime = this.toSeconds(time);
        const valueAtTime = this._fromType(this.getValueAtTime(computedTime));
        assert(isFinite(computedTime), `Invalid argument to cancelAndHoldAtTime: ${JSON.stringify(time)}`);
        this.log(this.units, "cancelAndHoldAtTime", computedTime, "value=" + valueAtTime);
        const before = this._events.get(computedTime);
        const after = this._events.getAfter(computedTime);
        if (before && EQ(before.time, computedTime)) {
            if (after) {
                this._param.cancelScheduledValues(after.time);
                this._events.cancel(after.time);
            }
            else {
                this._param.cancelAndHoldAtTime(computedTime);
                this._events.cancel(computedTime + this.sampleTime);
            }
        }
        else if (after) {
            this._param.cancelScheduledValues(after.time);
            this._events.cancel(after.time);
            if (after.type === "linearRampToValueAtTime") {
                this.linearRampToValueAtTime(this._toType(valueAtTime), computedTime);
            }
            else if (after.type === "exponentialRampToValueAtTime") {
                this.exponentialRampToValueAtTime(this._toType(valueAtTime), computedTime);
            }
        }
        this._events.add({
            time: computedTime,
            type: "setValueAtTime",
            value: valueAtTime,
        });
        this._param.setValueAtTime(valueAtTime, computedTime);
        return this;
    }
    rampTo(value, rampTime = 0.1, startTime) {
        if (this.units === "frequency" ||
            this.units === "bpm" ||
            this.units === "decibels") {
            this.exponentialRampTo(value, rampTime, startTime);
        }
        else {
            this.linearRampTo(value, rampTime, startTime);
        }
        return this;
    }
    apply(param) {
        const now = this.context.currentTime;
        param.setValueAtTime(this.getValueAtTime(now), now);
        const previousEvent = this._events.get(now);
        if (previousEvent && previousEvent.type === "setTargetAtTime") {
            const nextEvent = this._events.getAfter(previousEvent.time);
            const endTime = nextEvent ? nextEvent.time : now + 2;
            const subdivisions = (endTime - now) / 10;
            for (let i = now; i < endTime; i += subdivisions) {
                param.linearRampToValueAtTime(this.getValueAtTime(i), i);
            }
        }
        this._events.forEachAfter(this.context.currentTime, (event) => {
            if (event.type === "cancelScheduledValues") {
                param.cancelScheduledValues(event.time);
            }
            else if (event.type === "setTargetAtTime") {
                param.setTargetAtTime(event.value, event.time, event.constant);
            }
            else {
                param[event.type](event.value, event.time);
            }
        });
        return this;
    }
    setParam(param) {
        assert(this._swappable, "The Param must be assigned as 'swappable' in the constructor");
        const input = this.input;
        input.disconnect(this._param);
        this.apply(param);
        this._param = param;
        input.connect(this._param);
        return this;
    }
    dispose() {
        super.dispose();
        this._events.dispose();
        return this;
    }
    get defaultValue() {
        return this._toType(this._param.defaultValue);
    }
    _exponentialApproach(t0, v0, v1, timeConstant, t) {
        return v1 + (v0 - v1) * Math.exp(-(t - t0) / timeConstant);
    }
    _linearInterpolate(t0, v0, t1, v1, t) {
        return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
    }
    _exponentialInterpolate(t0, v0, t1, v1, t) {
        return v0 * Math.pow(v1 / v0, (t - t0) / (t1 - t0));
    }
}
class AbstractParam {
}
class DestinationInstance extends ToneAudioNode {
    constructor() {
        const options = optionsFromArguments(DestinationInstance.getDefaults(), arguments);
        super(options);
        this.name = "Destination";
        this.input = new Volume({ context: this.context });
        this.baseOutputNode = new Gain({ context: this.context });
        this.volume = this.input.volume;
        connectSeries(this.input, this.baseOutputNode, this.context.rawContext.destination);
        this.mute = options.mute;
        this._internalChannels = [
            this.input,
            this.context.rawContext.destination,
            this.baseOutputNode,
        ];
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            mute: false,
            volume: 0,
        });
    }
    get mute() {
        return this.input.mute;
    }
    set mute(mute) {
        this.input.mute = mute;
    }
    chain(...args) {
        this.input.disconnect();
        args.unshift(this.input);
        args.push(this.baseOutputNode);
        connectSeries(...args);
        return this;
    }
    get maxChannelCount() {
        return this.context.rawContext.destination.maxChannelCount;
    }
    dispose() {
        super.dispose();
        this.volume.dispose();
        return this;
    }
}
onContextInit((context) => {
    console.log('destinatinon', context);
    context.destination = new DestinationInstance({ context });
});
onContextClose((context) => {
    context.destination.dispose();
});
class Effect extends ToneAudioNode {
    constructor(options) {
        super(options);
        this.name = "Effect";
        this._dryWet = new CrossFade({ context: this.context });
        this.wet = this._dryWet.fade;
        this.effectSend = new Gain({ context: this.context });
        this.effectReturn = new Gain({ context: this.context });
        this.input = new Gain({ context: this.context });
        this.baseOutputNode = this._dryWet;
        this.input.fan(this._dryWet.a, this.effectSend);
        this.effectReturn.connect(this._dryWet.b);
        this.wet.setValueAtTime(options.wet, 0);
        this._internalChannels = [this.effectReturn, this.effectSend];
        readOnly(this, "wet");
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            wet: 1,
        });
    }
    connectEffect(effect) {
        this._internalChannels.push(effect);
        this.effectSend.chain(effect, this.effectReturn);
        return this;
    }
    dispose() {
        super.dispose();
        this._dryWet.dispose();
        this.effectSend.dispose();
        this.effectReturn.dispose();
        this.wet.dispose();
        return this;
    }
}
class FeedbackEffect extends Effect {
    constructor(options) {
        super(options);
        this.name = "FeedbackEffect";
        this._feedbackGain = new Gain({
            context: this.context,
            gain: options.feedback,
            units: "normalRange",
        });
        this.feedback = this._feedbackGain.gain;
        readOnly(this, "feedback");
        this.effectReturn.chain(this._feedbackGain, this.effectSend);
    }
    static getDefaults() {
        return Object.assign(Effect.getDefaults(), {
            feedback: 0.125,
        });
    }
    dispose() {
        super.dispose();
        this._feedbackGain.dispose();
        this.feedback.dispose();
        return this;
    }
}
class Signal extends ToneAudioNode {
    constructor() {
        const options = optionsFromArguments(Signal.getDefaults(), arguments, [
            "value",
            "units",
        ]);
        super(options);
        this.name = "Signal";
        this.override = true;
        this.baseOutputNode = this._constantSource = new ToneConstantSource({
            context: this.context,
            convert: options.convert,
            offset: options.value,
            units: options.units,
            minValue: options.minValue,
            maxValue: options.maxValue,
        });
        this._constantSource.start(0);
        this.input = this._param = this._constantSource.offset;
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            convert: true,
            units: "number",
            value: 0,
        });
    }
    connect(destination, outputNum = 0, inputNum = 0) {
        connectSignal(this, destination, outputNum, inputNum);
        return this;
    }
    disconnect(destination, outputNum, inputNum) {
        disconnectSignal(this, destination, outputNum, inputNum);
        return this;
    }
    dispose() {
        super.dispose();
        this._param.dispose();
        this._constantSource.dispose();
        return this;
    }
    setValueAtTime(value, time) {
        this._param.setValueAtTime(value, time);
        return this;
    }
    getValueAtTime(time) {
        return this._param.getValueAtTime(time);
    }
    setRampPoint(time) {
        this._param.setRampPoint(time);
        return this;
    }
    linearRampToValueAtTime(value, time) {
        this._param.linearRampToValueAtTime(value, time);
        return this;
    }
    exponentialRampToValueAtTime(value, time) {
        this._param.exponentialRampToValueAtTime(value, time);
        return this;
    }
    exponentialRampTo(value, rampTime, startTime) {
        this._param.exponentialRampTo(value, rampTime, startTime);
        return this;
    }
    linearRampTo(value, rampTime, startTime) {
        this._param.linearRampTo(value, rampTime, startTime);
        return this;
    }
    targetRampTo(value, rampTime, startTime) {
        this._param.targetRampTo(value, rampTime, startTime);
        return this;
    }
    exponentialApproachValueAtTime(value, time, rampTime) {
        this._param.exponentialApproachValueAtTime(value, time, rampTime);
        return this;
    }
    setTargetAtTime(value, startTime, timeConstant) {
        this._param.setTargetAtTime(value, startTime, timeConstant);
        return this;
    }
    setValueCurveAtTime(values, startTime, duration, scaling) {
        this._param.setValueCurveAtTime(values, startTime, duration, scaling);
        return this;
    }
    cancelScheduledValues(time) {
        this._param.cancelScheduledValues(time);
        return this;
    }
    cancelAndHoldAtTime(time) {
        this._param.cancelAndHoldAtTime(time);
        return this;
    }
    rampTo(value, rampTime, startTime) {
        this._param.rampTo(value, rampTime, startTime);
        return this;
    }
    get value() {
        return this._param.value;
    }
    set value(value) {
        this._param.value = value;
    }
    get convert() {
        return this._param.convert;
    }
    set convert(convert) {
        this._param.convert = convert;
    }
    get units() {
        return this._param.units;
    }
    get overridden() {
        return this._param.overridden;
    }
    set overridden(overridden) {
        this._param.overridden = overridden;
    }
    get maxValue() {
        return this._param.maxValue;
    }
    get minValue() {
        return this._param.minValue;
    }
    apply(param) {
        this._param.apply(param);
        return this;
    }
}
const connectedSignals = new WeakMap();
function connectSignal(signal, destination, outputNum, inputNum) {
    var _a;
    if (destination instanceof Param ||
        isAudioParam(destination) ||
        (destination instanceof Signal && destination.override)) {
        const previousValue = destination.value;
        destination.cancelScheduledValues(0);
        destination.setValueAtTime(0, 0);
        if (destination instanceof Signal) {
            destination.overridden = true;
        }
        if (!connectedSignals.has(signal)) {
            connectedSignals.set(signal, []);
        }
        (_a = connectedSignals.get(signal)) === null || _a === void 0 ? void 0 : _a.push({
            destination,
            outputNum: outputNum || 0,
            inputNum: inputNum || 0,
            previousValue,
        });
    }
    connect(signal, destination, outputNum, inputNum);
}
function disconnectSignal(signal, destination, outputNum, inputNum) {
    if (destination instanceof Param ||
        isAudioParam(destination) ||
        (destination instanceof Signal && destination.override) ||
        destination === undefined) {
        if (connectedSignals.has(signal)) {
            let connections = connectedSignals.get(signal);
            if (destination) {
                connections = connections.filter((conn) => {
                    return (conn.destination === destination &&
                        (isUndef(outputNum) || conn.outputNum === outputNum) &&
                        (isUndef(inputNum) || conn.inputNum === inputNum));
                });
            }
            if (!connections.length) {
                throw new Error("Not connected to destination node");
            }
            connections.forEach((connection) => {
                if (connection.destination instanceof Signal) {
                    connection.destination.overridden = false;
                }
                connection.destination.setValueAtTime(connection.previousValue, 0);
            });
            connectedSignals.set(signal, connectedSignals
                .get(signal)
                .filter((conn) => !connections.includes(conn)));
        }
    }
    disconnect(signal, destination, outputNum, inputNum);
}
class SignalOperator extends ToneAudioNode {
    constructor() {
        super(optionsFromArguments(SignalOperator.getDefaults(), arguments, [
            "context",
        ]));
    }
    connect(destination, outputNum = 0, inputNum = 0) {
        connectSignal(this, destination, outputNum, inputNum);
        return this;
    }
}
class Pow extends SignalOperator {
    constructor() {
        const options = optionsFromArguments(Pow.getDefaults(), arguments, [
            "value",
        ]);
        super(options);
        this.name = "Pow";
        this._exponentScaler =
            this.input =
                this.baseOutputNode =
                    new WaveShaper({
                        context: this.context,
                        mapping: this._expFunc(options.value),
                        length: 8192,
                    });
        this._exponent = options.value;
    }
    static getDefaults() {
        return Object.assign(SignalOperator.getDefaults(), {
            value: 1,
        });
    }
    _expFunc(exponent) {
        return (val) => {
            return Math.pow(Math.abs(val), exponent);
        };
    }
    get value() {
        return this._exponent;
    }
    set value(exponent) {
        this._exponent = exponent;
        this._exponentScaler.setMap(this._expFunc(this._exponent));
    }
    dispose() {
        super.dispose();
        this._exponentScaler.dispose();
        return this;
    }
}
class TransportEvent {
    constructor(transport, opts) {
        this.id = TransportEvent._eventId++;
        this._remainderTime = 0;
        const options = Object.assign(TransportEvent.getDefaults(), opts);
        this.transport = transport;
        this.callback = options.callback;
        this._once = options.once;
        this.time = Math.floor(options.time);
        this._remainderTime = options.time - this.time;
    }
    static getDefaults() {
        return {
            callback: noOp,
            once: false,
            time: 0,
        };
    }
    get floatTime() {
        return this.time + this._remainderTime;
    }
    invoke(time) {
        if (this.callback) {
            const tickDuration = this.transport.bpm.getDurationOfTicks(1, time);
            this.callback(time + this._remainderTime * tickDuration);
            if (this._once) {
                this.transport.clear(this.id);
            }
        }
    }
    dispose() {
        this.callback = undefined;
        return this;
    }
}
TransportEvent._eventId = 0;
class TransportRepeatEvent extends TransportEvent {
    constructor(transport, opts) {
        super(transport, opts);
        this._currentId = -1;
        this._nextId = -1;
        this._nextTick = this.time;
        this._boundRestart = this._restart.bind(this);
        const options = Object.assign(TransportRepeatEvent.getDefaults(), opts);
        this.duration = options.duration;
        this._interval = options.interval;
        this._nextTick = options.time;
        this.transport.on("start", this._boundRestart);
        this.transport.on("loopStart", this._boundRestart);
        this.transport.on("ticks", this._boundRestart);
        this.context = this.transport.context;
        this._restart();
    }
    static getDefaults() {
        return Object.assign({}, TransportEvent.getDefaults(), {
            duration: Infinity,
            interval: 1,
            once: false,
        });
    }
    invoke(time) {
        this._createEvents();
        super.invoke(time);
    }
    _createEvent() {
        if (LT(this._nextTick, this.floatTime + this.duration)) {
            return this.transport.scheduleOnce(this.invoke.bind(this), new TicksClass(this.context, this._nextTick).toSeconds());
        }
        return -1;
    }
    _createEvents() {
        if (LT(this._nextTick + this._interval, this.floatTime + this.duration)) {
            this._nextTick += this._interval;
            this._currentId = this._nextId;
            this._nextId = this.transport.scheduleOnce(this.invoke.bind(this), new TicksClass(this.context, this._nextTick).toSeconds());
        }
    }
    _restart(time) {
        this.transport.clear(this._currentId);
        this.transport.clear(this._nextId);
        this._nextTick = this.floatTime;
        const ticks = this.transport.getTicksAtTime(time);
        if (GT(ticks, this.time)) {
            this._nextTick =
                this.floatTime +
                    Math.ceil((ticks - this.floatTime) / this._interval) *
                        this._interval;
        }
        this._currentId = this._createEvent();
        this._nextTick += this._interval;
        this._nextId = this._createEvent();
    }
    dispose() {
        super.dispose();
        this.transport.clear(this._currentId);
        this.transport.clear(this._nextId);
        this.transport.off("start", this._boundRestart);
        this.transport.off("loopStart", this._boundRestart);
        this.transport.off("ticks", this._boundRestart);
        return this;
    }
}
class IntervalTimeline extends Tone {
    constructor() {
        super(...arguments);
        this.name = "IntervalTimeline";
        this._root = null;
        this._length = 0;
    }
    add(event) {
        assert(isDefined(event.time), "Events must have a time property");
        assert(isDefined(event.duration), "Events must have a duration parameter");
        event.time = event.time.valueOf();
        let node = new IntervalNode(event.time, event.time + event.duration, event);
        if (this._root === null) {
            this._root = node;
        }
        else {
            this._root.insert(node);
        }
        this._length++;
        while (node !== null) {
            node.updateHeight();
            node.updateMax();
            this._rebalance(node);
            node = node.parent;
        }
        return this;
    }
    remove(event) {
        if (this._root !== null) {
            const results = [];
            this._root.search(event.time, results);
            for (const node of results) {
                if (node.event === event) {
                    this._removeNode(node);
                    this._length--;
                    break;
                }
            }
        }
        return this;
    }
    get length() {
        return this._length;
    }
    cancel(after) {
        this.forEachFrom(after, (event) => this.remove(event));
        return this;
    }
    _setRoot(node) {
        this._root = node;
        if (this._root !== null) {
            this._root.parent = null;
        }
    }
    _replaceNodeInParent(node, replacement) {
        if (node.parent !== null) {
            if (node.isLeftChild()) {
                node.parent.left = replacement;
            }
            else {
                node.parent.right = replacement;
            }
            this._rebalance(node.parent);
        }
        else {
            this._setRoot(replacement);
        }
    }
    _removeNode(node) {
        if (node.left === null && node.right === null) {
            this._replaceNodeInParent(node, null);
        }
        else if (node.right === null) {
            this._replaceNodeInParent(node, node.left);
        }
        else if (node.left === null) {
            this._replaceNodeInParent(node, node.right);
        }
        else {
            const balance = node.getBalance();
            let replacement;
            let temp = null;
            if (balance > 0) {
                if (node.left.right === null) {
                    replacement = node.left;
                    replacement.right = node.right;
                    temp = replacement;
                }
                else {
                    replacement = node.left.right;
                    while (replacement.right !== null) {
                        replacement = replacement.right;
                    }
                    if (replacement.parent) {
                        replacement.parent.right = replacement.left;
                        temp = replacement.parent;
                        replacement.left = node.left;
                        replacement.right = node.right;
                    }
                }
            }
            else if (node.right.left === null) {
                replacement = node.right;
                replacement.left = node.left;
                temp = replacement;
            }
            else {
                replacement = node.right.left;
                while (replacement.left !== null) {
                    replacement = replacement.left;
                }
                if (replacement.parent) {
                    replacement.parent.left = replacement.right;
                    temp = replacement.parent;
                    replacement.left = node.left;
                    replacement.right = node.right;
                }
            }
            if (node.parent !== null) {
                if (node.isLeftChild()) {
                    node.parent.left = replacement;
                }
                else {
                    node.parent.right = replacement;
                }
            }
            else {
                this._setRoot(replacement);
            }
            if (temp) {
                this._rebalance(temp);
            }
        }
        node.dispose();
    }
    _rotateLeft(node) {
        const parent = node.parent;
        const isLeftChild = node.isLeftChild();
        const pivotNode = node.right;
        if (pivotNode) {
            node.right = pivotNode.left;
            pivotNode.left = node;
        }
        if (parent !== null) {
            if (isLeftChild) {
                parent.left = pivotNode;
            }
            else {
                parent.right = pivotNode;
            }
        }
        else {
            this._setRoot(pivotNode);
        }
    }
    _rotateRight(node) {
        const parent = node.parent;
        const isLeftChild = node.isLeftChild();
        const pivotNode = node.left;
        if (pivotNode) {
            node.left = pivotNode.right;
            pivotNode.right = node;
        }
        if (parent !== null) {
            if (isLeftChild) {
                parent.left = pivotNode;
            }
            else {
                parent.right = pivotNode;
            }
        }
        else {
            this._setRoot(pivotNode);
        }
    }
    _rebalance(node) {
        const balance = node.getBalance();
        if (balance > 1 && node.left) {
            if (node.left.getBalance() < 0) {
                this._rotateLeft(node.left);
            }
            else {
                this._rotateRight(node);
            }
        }
        else if (balance < -1 && node.right) {
            if (node.right.getBalance() > 0) {
                this._rotateRight(node.right);
            }
            else {
                this._rotateLeft(node);
            }
        }
    }
    get(time) {
        if (this._root !== null) {
            const results = [];
            this._root.search(time, results);
            if (results.length > 0) {
                let max = results[0];
                for (let i = 1; i < results.length; i++) {
                    if (results[i].low > max.low) {
                        max = results[i];
                    }
                }
                return max.event;
            }
        }
        return null;
    }
    forEach(callback) {
        if (this._root !== null) {
            const allNodes = [];
            this._root.traverse((node) => allNodes.push(node));
            allNodes.forEach((node) => {
                if (node.event) {
                    callback(node.event);
                }
            });
        }
        return this;
    }
    forEachAtTime(time, callback) {
        if (this._root !== null) {
            const results = [];
            this._root.search(time, results);
            results.forEach((node) => {
                if (node.event) {
                    callback(node.event);
                }
            });
        }
        return this;
    }
    forEachFrom(time, callback) {
        if (this._root !== null) {
            const results = [];
            this._root.searchAfter(time, results);
            results.forEach((node) => {
                if (node.event) {
                    callback(node.event);
                }
            });
        }
        return this;
    }
    dispose() {
        super.dispose();
        if (this._root !== null) {
            this._root.traverse((node) => node.dispose());
        }
        this._root = null;
        return this;
    }
}
class IntervalNode {
    constructor(low, high, event) {
        this._left = null;
        this._right = null;
        this.parent = null;
        this.height = 0;
        this.event = event;
        this.low = low;
        this.high = high;
        this.max = this.high;
    }
    insert(node) {
        if (node.low <= this.low) {
            if (this.left === null) {
                this.left = node;
            }
            else {
                this.left.insert(node);
            }
        }
        else if (this.right === null) {
            this.right = node;
        }
        else {
            this.right.insert(node);
        }
    }
    search(point, results) {
        if (point > this.max) {
            return;
        }
        if (this.left !== null) {
            this.left.search(point, results);
        }
        if (this.low <= point && this.high > point) {
            results.push(this);
        }
        if (this.low > point) {
            return;
        }
        if (this.right !== null) {
            this.right.search(point, results);
        }
    }
    searchAfter(point, results) {
        if (this.low >= point) {
            results.push(this);
            if (this.left !== null) {
                this.left.searchAfter(point, results);
            }
        }
        if (this.right !== null) {
            this.right.searchAfter(point, results);
        }
    }
    traverse(callback) {
        callback(this);
        if (this.left !== null) {
            this.left.traverse(callback);
        }
        if (this.right !== null) {
            this.right.traverse(callback);
        }
    }
    updateHeight() {
        if (this.left !== null && this.right !== null) {
            this.height = Math.max(this.left.height, this.right.height) + 1;
        }
        else if (this.right !== null) {
            this.height = this.right.height + 1;
        }
        else if (this.left !== null) {
            this.height = this.left.height + 1;
        }
        else {
            this.height = 0;
        }
    }
    updateMax() {
        this.max = this.high;
        if (this.left !== null) {
            this.max = Math.max(this.max, this.left.max);
        }
        if (this.right !== null) {
            this.max = Math.max(this.max, this.right.max);
        }
    }
    getBalance() {
        let balance = 0;
        if (this.left !== null && this.right !== null) {
            balance = this.left.height - this.right.height;
        }
        else if (this.left !== null) {
            balance = this.left.height + 1;
        }
        else if (this.right !== null) {
            balance = -(this.right.height + 1);
        }
        return balance;
    }
    isLeftChild() {
        return this.parent !== null && this.parent.left === this;
    }
    get left() {
        return this._left;
    }
    set left(node) {
        this._left = node;
        if (node !== null) {
            node.parent = this;
        }
        this.updateHeight();
        this.updateMax();
    }
    get right() {
        return this._right;
    }
    set right(node) {
        this._right = node;
        if (node !== null) {
            node.parent = this;
        }
        this.updateHeight();
        this.updateMax();
    }
    dispose() {
        this.parent = null;
        this._left = null;
        this._right = null;
        this.event = null;
    }
}
class TickParam extends Param {
    constructor() {
        const options = optionsFromArguments(TickParam.getDefaults(), arguments, ["value"]);
        super(options);
        this.name = "TickParam";
        this._events = new Timeline(Infinity);
        this._multiplier = 1;
        this._multiplier = options.multiplier;
        this._events.cancel(0);
        this._events.add({
            ticks: 0,
            time: 0,
            type: "setValueAtTime",
            value: this._fromType(options.value),
        });
        this.setValueAtTime(options.value, 0);
    }
    static getDefaults() {
        return Object.assign(Param.getDefaults(), {
            multiplier: 1,
            units: "hertz",
            value: 1,
        });
    }
    setTargetAtTime(value, time, constant) {
        time = this.toSeconds(time);
        this.setRampPoint(time);
        const computedValue = this._fromType(value);
        const prevEvent = this._events.get(time);
        const segments = Math.round(Math.max(1 / constant, 1));
        for (let i = 0; i <= segments; i++) {
            const segTime = constant * i + time;
            const rampVal = this._exponentialApproach(prevEvent.time, prevEvent.value, computedValue, constant, segTime);
            this.linearRampToValueAtTime(this._toType(rampVal), segTime);
        }
        return this;
    }
    setValueAtTime(value, time) {
        const computedTime = this.toSeconds(time);
        super.setValueAtTime(value, time);
        const event = this._events.get(computedTime);
        const previousEvent = this._events.previousEvent(event);
        const ticksUntilTime = this._getTicksUntilEvent(previousEvent, computedTime);
        event.ticks = Math.max(ticksUntilTime, 0);
        return this;
    }
    linearRampToValueAtTime(value, time) {
        const computedTime = this.toSeconds(time);
        super.linearRampToValueAtTime(value, time);
        const event = this._events.get(computedTime);
        const previousEvent = this._events.previousEvent(event);
        const ticksUntilTime = this._getTicksUntilEvent(previousEvent, computedTime);
        event.ticks = Math.max(ticksUntilTime, 0);
        return this;
    }
    exponentialRampToValueAtTime(value, time) {
        time = this.toSeconds(time);
        const computedVal = this._fromType(value);
        const prevEvent = this._events.get(time);
        const segments = Math.round(Math.max((time - prevEvent.time) * 10, 1));
        const segmentDur = (time - prevEvent.time) / segments;
        for (let i = 0; i <= segments; i++) {
            const segTime = segmentDur * i + prevEvent.time;
            const rampVal = this._exponentialInterpolate(prevEvent.time, prevEvent.value, time, computedVal, segTime);
            this.linearRampToValueAtTime(this._toType(rampVal), segTime);
        }
        return this;
    }
    _getTicksUntilEvent(event, time) {
        if (event === null) {
            event = {
                ticks: 0,
                time: 0,
                type: "setValueAtTime",
                value: 0,
            };
        }
        else if (isUndef(event.ticks)) {
            const previousEvent = this._events.previousEvent(event);
            event.ticks = this._getTicksUntilEvent(previousEvent, event.time);
        }
        const val0 = this._fromType(this.getValueAtTime(event.time));
        let val1 = this._fromType(this.getValueAtTime(time));
        const onTheLineEvent = this._events.get(time);
        if (onTheLineEvent &&
            onTheLineEvent.time === time &&
            onTheLineEvent.type === "setValueAtTime") {
            val1 = this._fromType(this.getValueAtTime(time - this.sampleTime));
        }
        return 0.5 * (time - event.time) * (val0 + val1) + event.ticks;
    }
    getTicksAtTime(time) {
        const computedTime = this.toSeconds(time);
        const event = this._events.get(computedTime);
        return Math.max(this._getTicksUntilEvent(event, computedTime), 0);
    }
    getDurationOfTicks(ticks, time) {
        const computedTime = this.toSeconds(time);
        const currentTick = this.getTicksAtTime(time);
        return this.getTimeOfTick(currentTick + ticks) - computedTime;
    }
    getTimeOfTick(tick) {
        const before = this._events.get(tick, "ticks");
        const after = this._events.getAfter(tick, "ticks");
        if (before && before.ticks === tick) {
            return before.time;
        }
        else if (before &&
            after &&
            after.type === "linearRampToValueAtTime" &&
            before.value !== after.value) {
            const val0 = this._fromType(this.getValueAtTime(before.time));
            const val1 = this._fromType(this.getValueAtTime(after.time));
            const delta = (val1 - val0) / (after.time - before.time);
            const k = Math.sqrt(Math.pow(val0, 2) - 2 * delta * (before.ticks - tick));
            const sol1 = (-val0 + k) / delta;
            const sol2 = (-val0 - k) / delta;
            return (sol1 > 0 ? sol1 : sol2) + before.time;
        }
        else if (before) {
            if (before.value === 0) {
                return Infinity;
            }
            else {
                return before.time + (tick - before.ticks) / before.value;
            }
        }
        else {
            return tick / this._initialValue;
        }
    }
    ticksToTime(ticks, when) {
        return this.getDurationOfTicks(ticks, when);
    }
    timeToTicks(duration, when) {
        const computedTime = this.toSeconds(when);
        const computedDuration = this.toSeconds(duration);
        const startTicks = this.getTicksAtTime(computedTime);
        const endTicks = this.getTicksAtTime(computedTime + computedDuration);
        return endTicks - startTicks;
    }
    _fromType(val) {
        if (this.units === "bpm" && this.multiplier) {
            return 1 / (60 / val / this.multiplier);
        }
        else {
            return super._fromType(val);
        }
    }
    _toType(val) {
        if (this.units === "bpm" && this.multiplier) {
            return ((val / this.multiplier) * 60);
        }
        else {
            return super._toType(val);
        }
    }
    get multiplier() {
        return this._multiplier;
    }
    set multiplier(m) {
        const currentVal = this.value;
        this._multiplier = m;
        this.cancelScheduledValues(0);
        this.setValueAtTime(currentVal, 0);
    }
}
class TickSignal extends Signal {
    constructor() {
        const options = optionsFromArguments(TickSignal.getDefaults(), arguments, ["value"]);
        super(options);
        this.name = "TickSignal";
        this.input = this._param = new TickParam({
            context: this.context,
            convert: options.convert,
            multiplier: options.multiplier,
            param: this._constantSource.offset,
            units: options.units,
            value: options.value,
        });
    }
    static getDefaults() {
        return Object.assign(Signal.getDefaults(), {
            multiplier: 1,
            units: "hertz",
            value: 1,
        });
    }
    ticksToTime(ticks, when) {
        return this._param.ticksToTime(ticks, when);
    }
    timeToTicks(duration, when) {
        return this._param.timeToTicks(duration, when);
    }
    getTimeOfTick(tick) {
        return this._param.getTimeOfTick(tick);
    }
    getDurationOfTicks(ticks, time) {
        return this._param.getDurationOfTicks(ticks, time);
    }
    getTicksAtTime(time) {
        return this._param.getTicksAtTime(time);
    }
    get multiplier() {
        return this._param.multiplier;
    }
    set multiplier(m) {
        this._param.multiplier = m;
    }
    dispose() {
        super.dispose();
        this._param.dispose();
        return this;
    }
}
class TickSource extends ToneWithContext {
    constructor() {
        const options = optionsFromArguments(TickSource.getDefaults(), arguments, ["frequency"]);
        super(options);
        this.name = "TickSource";
        this._state = new StateTimeline();
        this._tickOffset = new Timeline();
        this._ticksAtTime = new Timeline();
        this._secondsAtTime = new Timeline();
        this.frequency = new TickSignal({
            context: this.context,
            units: options.units,
            value: options.frequency,
        });
        readOnly(this, "frequency");
        this._state.setStateAtTime("stopped", 0);
        this.setTicksAtTime(0, 0);
    }
    static getDefaults() {
        return Object.assign({
            frequency: 1,
            units: "hertz",
        }, ToneWithContext.getDefaults());
    }
    get state() {
        return this.getStateAtTime(this.now());
    }
    start(time, offset) {
        const computedTime = this.toSeconds(time);
        if (this._state.getValueAtTime(computedTime) !== "started") {
            this._state.setStateAtTime("started", computedTime);
            if (isDefined(offset)) {
                this.setTicksAtTime(offset, computedTime);
            }
            this._ticksAtTime.cancel(computedTime);
            this._secondsAtTime.cancel(computedTime);
        }
        return this;
    }
    stop(time) {
        const computedTime = this.toSeconds(time);
        if (this._state.getValueAtTime(computedTime) === "stopped") {
            const event = this._state.get(computedTime);
            if (event && event.time > 0) {
                this._tickOffset.cancel(event.time);
                this._state.cancel(event.time);
            }
        }
        this._state.cancel(computedTime);
        this._state.setStateAtTime("stopped", computedTime);
        this.setTicksAtTime(0, computedTime);
        this._ticksAtTime.cancel(computedTime);
        this._secondsAtTime.cancel(computedTime);
        return this;
    }
    pause(time) {
        const computedTime = this.toSeconds(time);
        if (this._state.getValueAtTime(computedTime) === "started") {
            this._state.setStateAtTime("paused", computedTime);
            this._ticksAtTime.cancel(computedTime);
            this._secondsAtTime.cancel(computedTime);
        }
        return this;
    }
    cancel(time) {
        time = this.toSeconds(time);
        this._state.cancel(time);
        this._tickOffset.cancel(time);
        this._ticksAtTime.cancel(time);
        this._secondsAtTime.cancel(time);
        return this;
    }
    getTicksAtTime(time) {
        const computedTime = this.toSeconds(time);
        const stopEvent = this._state.getLastState("stopped", computedTime);
        const memoizedEvent = this._ticksAtTime.get(computedTime);
        const tmpEvent = {
            state: "paused",
            time: computedTime,
        };
        this._state.add(tmpEvent);
        let lastState = memoizedEvent ? memoizedEvent : stopEvent;
        let elapsedTicks = memoizedEvent ? memoizedEvent.ticks : 0;
        let eventToMemoize = null;
        this._state.forEachBetween(lastState.time, computedTime + this.sampleTime, (e) => {
            let periodStartTime = lastState.time;
            const offsetEvent = this._tickOffset.get(e.time);
            if (offsetEvent && offsetEvent.time >= lastState.time) {
                elapsedTicks = offsetEvent.ticks;
                periodStartTime = offsetEvent.time;
            }
            if (lastState.state === "started" && e.state !== "started") {
                elapsedTicks +=
                    this.frequency.getTicksAtTime(e.time) -
                        this.frequency.getTicksAtTime(periodStartTime);
                if (e.time !== tmpEvent.time) {
                    eventToMemoize = {
                        state: e.state,
                        time: e.time,
                        ticks: elapsedTicks,
                    };
                }
            }
            lastState = e;
        });
        this._state.remove(tmpEvent);
        if (eventToMemoize) {
            this._ticksAtTime.add(eventToMemoize);
        }
        return elapsedTicks;
    }
    get ticks() {
        return this.getTicksAtTime(this.now());
    }
    set ticks(t) {
        this.setTicksAtTime(t, this.now());
    }
    get seconds() {
        return this.getSecondsAtTime(this.now());
    }
    set seconds(s) {
        const now = this.now();
        const ticks = this.frequency.timeToTicks(s, now);
        this.setTicksAtTime(ticks, now);
    }
    getSecondsAtTime(time) {
        time = this.toSeconds(time);
        const stopEvent = this._state.getLastState("stopped", time);
        const tmpEvent = { state: "paused", time };
        this._state.add(tmpEvent);
        const memoizedEvent = this._secondsAtTime.get(time);
        let lastState = memoizedEvent ? memoizedEvent : stopEvent;
        let elapsedSeconds = memoizedEvent ? memoizedEvent.seconds : 0;
        let eventToMemoize = null;
        this._state.forEachBetween(lastState.time, time + this.sampleTime, (e) => {
            let periodStartTime = lastState.time;
            const offsetEvent = this._tickOffset.get(e.time);
            if (offsetEvent && offsetEvent.time >= lastState.time) {
                elapsedSeconds = offsetEvent.seconds;
                periodStartTime = offsetEvent.time;
            }
            if (lastState.state === "started" && e.state !== "started") {
                elapsedSeconds += e.time - periodStartTime;
                if (e.time !== tmpEvent.time) {
                    eventToMemoize = {
                        state: e.state,
                        time: e.time,
                        seconds: elapsedSeconds,
                    };
                }
            }
            lastState = e;
        });
        this._state.remove(tmpEvent);
        if (eventToMemoize) {
            this._secondsAtTime.add(eventToMemoize);
        }
        return elapsedSeconds;
    }
    setTicksAtTime(ticks, time) {
        time = this.toSeconds(time);
        this._tickOffset.cancel(time);
        this._tickOffset.add({
            seconds: this.frequency.getDurationOfTicks(ticks, time),
            ticks,
            time,
        });
        this._ticksAtTime.cancel(time);
        this._secondsAtTime.cancel(time);
        return this;
    }
    getStateAtTime(time) {
        time = this.toSeconds(time);
        return this._state.getValueAtTime(time);
    }
    getTimeOfTick(tick, before = this.now()) {
        const offset = this._tickOffset.get(before);
        const event = this._state.get(before);
        const startTime = Math.max(offset.time, event.time);
        const absoluteTicks = this.frequency.getTicksAtTime(startTime) + tick - offset.ticks;
        return this.frequency.getTimeOfTick(absoluteTicks);
    }
    forEachTickBetween(startTime, endTime, callback) {
        let lastStateEvent = this._state.get(startTime);
        this._state.forEachBetween(startTime, endTime, (event) => {
            if (lastStateEvent &&
                lastStateEvent.state === "started" &&
                event.state !== "started") {
                this.forEachTickBetween(Math.max(lastStateEvent.time, startTime), event.time - this.sampleTime, callback);
            }
            lastStateEvent = event;
        });
        let error = null;
        if (lastStateEvent && lastStateEvent.state === "started") {
            const maxStartTime = Math.max(lastStateEvent.time, startTime);
            const startTicks = this.frequency.getTicksAtTime(maxStartTime);
            const ticksAtStart = this.frequency.getTicksAtTime(lastStateEvent.time);
            const diff = startTicks - ticksAtStart;
            let offset = Math.ceil(diff) - diff;
            offset = EQ(offset, 1) ? 0 : offset;
            let nextTickTime = this.frequency.getTimeOfTick(startTicks + offset);
            while (nextTickTime < endTime) {
                try {
                    callback(nextTickTime, Math.round(this.getTicksAtTime(nextTickTime)));
                }
                catch (e) {
                    error = e;
                    break;
                }
                nextTickTime += this.frequency.getDurationOfTicks(1, nextTickTime);
            }
        }
        if (error) {
            throw error;
        }
        return this;
    }
    dispose() {
        super.dispose();
        this._state.dispose();
        this._tickOffset.dispose();
        this._ticksAtTime.dispose();
        this._secondsAtTime.dispose();
        this.frequency.dispose();
        return this;
    }
}
class Timeline extends Tone {
    constructor() {
        super();
        this.name = "Timeline";
        this._timeline = [];
        const options = optionsFromArguments(Timeline.getDefaults(), arguments, ["memory"]);
        this.memory = options.memory;
        this.increasing = options.increasing;
    }
    static getDefaults() {
        return {
            memory: Infinity,
            increasing: false,
        };
    }
    get length() {
        return this._timeline.length;
    }
    add(event) {
        assert(Reflect.has(event, "time"), "Timeline: events must have a time attribute");
        event.time = event.time.valueOf();
        if (this.increasing && this.length) {
            const lastValue = this._timeline[this.length - 1];
            assert(GTE(event.time, lastValue.time), "The time must be greater than or equal to the last scheduled time");
            this._timeline.push(event);
        }
        else {
            const index = this._search(event.time);
            this._timeline.splice(index + 1, 0, event);
        }
        if (this.length > this.memory) {
            const diff = this.length - this.memory;
            this._timeline.splice(0, diff);
        }
        return this;
    }
    remove(event) {
        const index = this._timeline.indexOf(event);
        if (index !== -1) {
            this._timeline.splice(index, 1);
        }
        return this;
    }
    get(time, param = "time") {
        const index = this._search(time, param);
        if (index !== -1) {
            return this._timeline[index];
        }
        else {
            return null;
        }
    }
    peek() {
        return this._timeline[0];
    }
    shift() {
        return this._timeline.shift();
    }
    getAfter(time, param = "time") {
        const index = this._search(time, param);
        if (index + 1 < this._timeline.length) {
            return this._timeline[index + 1];
        }
        else {
            return null;
        }
    }
    getBefore(time) {
        const len = this._timeline.length;
        if (len > 0 && this._timeline[len - 1].time < time) {
            return this._timeline[len - 1];
        }
        const index = this._search(time);
        if (index - 1 >= 0) {
            return this._timeline[index - 1];
        }
        else {
            return null;
        }
    }
    cancel(after) {
        if (this._timeline.length > 1) {
            let index = this._search(after);
            if (index >= 0) {
                if (EQ(this._timeline[index].time, after)) {
                    for (let i = index; i >= 0; i--) {
                        if (EQ(this._timeline[i].time, after)) {
                            index = i;
                        }
                        else {
                            break;
                        }
                    }
                    this._timeline = this._timeline.slice(0, index);
                }
                else {
                    this._timeline = this._timeline.slice(0, index + 1);
                }
            }
            else {
                this._timeline = [];
            }
        }
        else if (this._timeline.length === 1) {
            if (GTE(this._timeline[0].time, after)) {
                this._timeline = [];
            }
        }
        return this;
    }
    cancelBefore(time) {
        const index = this._search(time);
        if (index >= 0) {
            this._timeline = this._timeline.slice(index + 1);
        }
        return this;
    }
    previousEvent(event) {
        const index = this._timeline.indexOf(event);
        if (index > 0) {
            return this._timeline[index - 1];
        }
        else {
            return null;
        }
    }
    _search(time, param = "time") {
        if (this._timeline.length === 0) {
            return -1;
        }
        let beginning = 0;
        const len = this._timeline.length;
        let end = len;
        if (len > 0 && this._timeline[len - 1][param] <= time) {
            return len - 1;
        }
        while (beginning < end) {
            let midPoint = Math.floor(beginning + (end - beginning) / 2);
            const event = this._timeline[midPoint];
            const nextEvent = this._timeline[midPoint + 1];
            if (EQ(event[param], time)) {
                for (let i = midPoint; i < this._timeline.length; i++) {
                    const testEvent = this._timeline[i];
                    if (EQ(testEvent[param], time)) {
                        midPoint = i;
                    }
                    else {
                        break;
                    }
                }
                return midPoint;
            }
            else if (LT(event[param], time) && GT(nextEvent[param], time)) {
                return midPoint;
            }
            else if (GT(event[param], time)) {
                end = midPoint;
            }
            else {
                beginning = midPoint + 1;
            }
        }
        return -1;
    }
    _iterate(callback, lowerBound = 0, upperBound = this._timeline.length - 1) {
        this._timeline.slice(lowerBound, upperBound + 1).forEach(callback);
    }
    forEach(callback) {
        this._iterate(callback);
        return this;
    }
    forEachBefore(time, callback) {
        const upperBound = this._search(time);
        if (upperBound !== -1) {
            this._iterate(callback, 0, upperBound);
        }
        return this;
    }
    forEachAfter(time, callback) {
        const lowerBound = this._search(time);
        this._iterate(callback, lowerBound + 1);
        return this;
    }
    forEachBetween(startTime, endTime, callback) {
        let lowerBound = this._search(startTime);
        let upperBound = this._search(endTime);
        if (lowerBound !== -1 && upperBound !== -1) {
            if (this._timeline[lowerBound].time !== startTime) {
                lowerBound += 1;
            }
            if (this._timeline[upperBound].time === endTime) {
                upperBound -= 1;
            }
            this._iterate(callback, lowerBound, upperBound);
        }
        else if (lowerBound === -1) {
            this._iterate(callback, 0, upperBound);
        }
        return this;
    }
    forEachFrom(time, callback) {
        let lowerBound = this._search(time);
        while (lowerBound >= 0 && this._timeline[lowerBound].time >= time) {
            lowerBound--;
        }
        this._iterate(callback, lowerBound + 1);
        return this;
    }
    forEachAtTime(time, callback) {
        const upperBound = this._search(time);
        if (upperBound !== -1 && EQ(this._timeline[upperBound].time, time)) {
            let lowerBound = upperBound;
            for (let i = upperBound; i >= 0; i--) {
                if (EQ(this._timeline[i].time, time)) {
                    lowerBound = i;
                }
                else {
                    break;
                }
            }
            this._iterate((event) => {
                callback(event);
            }, lowerBound, upperBound);
        }
        return this;
    }
    dispose() {
        super.dispose();
        this._timeline = [];
        return this;
    }
}
class StateTimeline extends Timeline {
    constructor(initial = "stopped") {
        super();
        this.name = "StateTimeline";
        this._initial = initial;
        this.setStateAtTime(this._initial, 0);
    }
    getValueAtTime(time) {
        const event = this.get(time);
        if (event !== null) {
            return event.state;
        }
        else {
            return this._initial;
        }
    }
    setStateAtTime(state, time, options) {
        assertRange(time, 0);
        this.add(Object.assign({}, options, {
            state,
            time,
        }));
        return this;
    }
    getLastState(state, time) {
        const index = this._search(time);
        for (let i = index; i >= 0; i--) {
            const event = this._timeline[i];
            if (event.state === state) {
                return event;
            }
        }
    }
    getNextState(state, time) {
        const index = this._search(time);
        if (index !== -1) {
            for (let i = index; i < this._timeline.length; i++) {
                const event = this._timeline[i];
                if (event.state === state) {
                    return event;
                }
            }
        }
    }
}
class Clock extends ToneWithContext {
    constructor() {
        const options = optionsFromArguments(Clock.getDefaults(), arguments, [
            "callback",
            "frequency",
        ]);
        super(options);
        this.name = "Clock";
        this.callback = noOp;
        this._lastUpdate = 0;
        this._state = new StateTimeline("stopped");
        this._boundLoop = this._loop.bind(this);
        this.callback = options.callback;
        this._tickSource = new TickSource({
            context: this.context,
            frequency: options.frequency,
            units: options.units,
        });
        this._lastUpdate = 0;
        this.frequency = this._tickSource.frequency;
        readOnly(this, "frequency");
        this._state.setStateAtTime("stopped", 0);
        this.context.on("tick", this._boundLoop);
    }
    static getDefaults() {
        return Object.assign(ToneWithContext.getDefaults(), {
            callback: noOp,
            frequency: 1,
            units: "hertz",
        });
    }
    get state() {
        return this._state.getValueAtTime(this.now());
    }
    start(time, offset) {
        assertContextRunning(this.context);
        const computedTime = this.toSeconds(time);
        this.log("start", computedTime);
        if (this._state.getValueAtTime(computedTime) !== "started") {
            this._state.setStateAtTime("started", computedTime);
            this._tickSource.start(computedTime, offset);
            if (computedTime < this._lastUpdate) {
                this.emit("start", computedTime, offset);
            }
        }
        return this;
    }
    stop(time) {
        const computedTime = this.toSeconds(time);
        this.log("stop", computedTime);
        this._state.cancel(computedTime);
        this._state.setStateAtTime("stopped", computedTime);
        this._tickSource.stop(computedTime);
        if (computedTime < this._lastUpdate) {
            this.emit("stop", computedTime);
        }
        return this;
    }
    pause(time) {
        const computedTime = this.toSeconds(time);
        if (this._state.getValueAtTime(computedTime) === "started") {
            this._state.setStateAtTime("paused", computedTime);
            this._tickSource.pause(computedTime);
            if (computedTime < this._lastUpdate) {
                this.emit("pause", computedTime);
            }
        }
        return this;
    }
    get ticks() {
        return Math.ceil(this.getTicksAtTime(this.now()));
    }
    set ticks(t) {
        this._tickSource.ticks = t;
    }
    get seconds() {
        return this._tickSource.seconds;
    }
    set seconds(s) {
        this._tickSource.seconds = s;
    }
    getSecondsAtTime(time) {
        return this._tickSource.getSecondsAtTime(time);
    }
    setTicksAtTime(ticks, time) {
        this._tickSource.setTicksAtTime(ticks, time);
        return this;
    }
    getTimeOfTick(tick, before = this.now()) {
        return this._tickSource.getTimeOfTick(tick, before);
    }
    getTicksAtTime(time) {
        return this._tickSource.getTicksAtTime(time);
    }
    nextTickTime(offset, when) {
        const computedTime = this.toSeconds(when);
        const currentTick = this.getTicksAtTime(computedTime);
        return this._tickSource.getTimeOfTick(currentTick + offset, computedTime);
    }
    _loop() {
        const startTime = this._lastUpdate;
        const endTime = this.now();
        this._lastUpdate = endTime;
        this.log("loop", startTime, endTime);
        if (startTime !== endTime) {
            this._state.forEachBetween(startTime, endTime, (e) => {
                switch (e.state) {
                    case "started":
                        const offset = this._tickSource.getTicksAtTime(e.time);
                        this.emit("start", e.time, offset);
                        break;
                    case "stopped":
                        if (e.time !== 0) {
                            this.emit("stop", e.time);
                        }
                        break;
                    case "paused":
                        this.emit("pause", e.time);
                        break;
                }
            });
            this._tickSource.forEachTickBetween(startTime, endTime, (time, ticks) => {
                this.callback(time, ticks);
            });
        }
    }
    getStateAtTime(time) {
        const computedTime = this.toSeconds(time);
        return this._state.getValueAtTime(computedTime);
    }
    dispose() {
        super.dispose();
        this.context.off("tick", this._boundLoop);
        this._tickSource.dispose();
        this._state.dispose();
        return this;
    }
}
Emitter.mixin(Clock);
function assert(statement, error) {
    if (!statement) {
        throw new Error(error);
    }
}
function assertRange(value, gte, lte = Infinity) {
    if (!(gte <= value && value <= lte)) {
        throw new RangeError(`Value must be within [${gte}, ${lte}], got: ${value}`);
    }
}
function assertContextRunning(context) {
    if (!context.isOffline && context.state !== "running") {
        warn('The AudioContext is "suspended". Invoke Tone.start() from a user action to start the audio.');
    }
}
let isInsideScheduledCallback = false;
let printedScheduledWarning = false;
function enterScheduledCallback(insideCallback) {
    isInsideScheduledCallback = insideCallback;
}
function assertUsedScheduleTime(time) {
    if (isUndef(time) &&
        isInsideScheduledCallback &&
        !printedScheduledWarning) {
        printedScheduledWarning = true;
        warn("Events scheduled inside of scheduled callbacks should use the passed in scheduling time. See https://github.com/Tonejs/Tone.js/wiki/Accurate-Timing");
    }
}
let defaultLogger = console;
function setLogger(logger) {
    defaultLogger = logger;
}
function log(...args) {
    defaultLogger.log(...args);
}
function warn(...args) {
    defaultLogger.warn(...args);
}
class TransportTimeClass extends TimeClass {
    constructor() {
        super(...arguments);
        this.name = "TransportTime";
    }
    _now() {
        return this.context.transport.seconds;
    }
}
function TransportTime(value, units) {
    return new TransportTimeClass(getContext(), value, units);
}
class TicksClass extends TransportTimeClass {
    constructor() {
        super(...arguments);
        this.name = "Ticks";
        this.defaultUnits = "i";
    }
    _now() {
        return this.context.transport.ticks;
    }
    _beatsToUnits(beats) {
        return this._getPPQ() * beats;
    }
    _secondsToUnits(seconds) {
        return Math.floor((seconds / (60 / this._getBpm())) * this._getPPQ());
    }
    _ticksToUnits(ticks) {
        return ticks;
    }
    toTicks() {
        return this.valueOf();
    }
    toSeconds() {
        return (this.valueOf() / this._getPPQ()) * (60 / this._getBpm());
    }
}
function Ticks(value, units) {
    return new TicksClass(getContext(), value, units);
}
class ListenerInstance extends ToneAudioNode {
    constructor() {
        super(...arguments);
        this.name = "Listener";
        this.positionX = new Param({
            context: this.context,
            param: this.context.rawContext.listener.positionX,
        });
        this.positionY = new Param({
            context: this.context,
            param: this.context.rawContext.listener.positionY,
        });
        this.positionZ = new Param({
            context: this.context,
            param: this.context.rawContext.listener.positionZ,
        });
        this.forwardX = new Param({
            context: this.context,
            param: this.context.rawContext.listener.forwardX,
        });
        this.forwardY = new Param({
            context: this.context,
            param: this.context.rawContext.listener.forwardY,
        });
        this.forwardZ = new Param({
            context: this.context,
            param: this.context.rawContext.listener.forwardZ,
        });
        this.upX = new Param({
            context: this.context,
            param: this.context.rawContext.listener.upX,
        });
        this.upY = new Param({
            context: this.context,
            param: this.context.rawContext.listener.upY,
        });
        this.upZ = new Param({
            context: this.context,
            param: this.context.rawContext.listener.upZ,
        });
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            forwardX: 0,
            forwardY: 0,
            forwardZ: -1,
            upX: 0,
            upY: 1,
            upZ: 0,
        });
    }
    dispose() {
        super.dispose();
        this.positionX.dispose();
        this.positionY.dispose();
        this.positionZ.dispose();
        this.forwardX.dispose();
        this.forwardY.dispose();
        this.forwardZ.dispose();
        this.upX.dispose();
        this.upY.dispose();
        this.upZ.dispose();
        return this;
    }
}
onContextInit((context) => {
    context.listener = new ListenerInstance({ context });
});
onContextClose((context) => {
    context.listener.dispose();
});
function noCopy(key, arg) {
    return (key === "value" ||
        isAudioParam(arg) ||
        isAudioNode(arg) ||
        isAudioBuffer(arg));
}
function deepMerge(target, ...sources) {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (noCopy(key, source[key])) {
                target[key] = source[key];
            }
            else if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                deepMerge(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return deepMerge(target, ...sources);
}
function deepEquals(arrayA, arrayB) {
    return (arrayA.length === arrayB.length &&
        arrayA.every((element, index) => arrayB[index] === element));
}
function optionsFromArguments(defaults, argsArray, keys = [], objKey) {
    const opts = {};
    const args = Array.from(argsArray);
    if (isObject(args[0]) && objKey && !Reflect.has(args[0], objKey)) {
        const partOfDefaults = Object.keys(args[0]).some((key) => Reflect.has(defaults, key));
        if (!partOfDefaults) {
            deepMerge(opts, { [objKey]: args[0] });
            keys.splice(keys.indexOf(objKey), 1);
            args.shift();
        }
    }
    if (args.length === 1 && isObject(args[0])) {
        deepMerge(opts, args[0]);
    }
    else {
        for (let i = 0; i < keys.length; i++) {
            if (isDefined(args[i])) {
                opts[keys[i]] = args[i];
            }
        }
    }
    return deepMerge(defaults, opts);
}
function getDefaultsFromInstance(instance) {
    return instance.constructor.getDefaults();
}
function defaultArg(given, fallback) {
    if (isUndef(given)) {
        return fallback;
    }
    else {
        return given;
    }
}
function omitFromObject(obj, omit) {
    omit.forEach((prop) => {
        if (Reflect.has(obj, prop)) {
            delete obj[prop];
        }
    });
    return obj;
}
const createIsAnyAudioParam = (audioParamStore, isNativeAudioParam) => {
    return (anything) => audioParamStore.has(anything) || isNativeAudioParam(anything);
};
const AUDIO_PARAM_STORE = new WeakMap();
const createIsNativeAudioParam = (window) => {
    return (anything) => {
        return window !== null && typeof window.AudioParam === 'function' && anything instanceof window.AudioParam;
    };
};
const isNativeAudioParam = createIsNativeAudioParam(window);
const isAnyAudioParam = createIsAnyAudioParam(AUDIO_PARAM_STORE, isNativeAudioParam);
;
function isAudioParam(arg) {
    return isAnyAudioParam(arg);
}
const createIsAnyAudioNode = (audioNodeStore, isNativeAudioNode) => {
    return (anything) => audioNodeStore.has(anything) || isNativeAudioNode(anything);
};
const AUDIO_NODE_STORE = new WeakMap();
const createIsNativeAudioNode = (window) => {
    return (anything) => {
        return window !== null && typeof window.AudioNode === 'function' && anything instanceof window.AudioNode;
    };
};
const isNativeAudioNode = createIsNativeAudioNode(window);
const isAnyAudioNode = createIsAnyAudioNode(AUDIO_NODE_STORE, isNativeAudioNode);
function isAudioNode(arg) {
    return isAnyAudioNode(arg);
}
const createIsAnyOfflineAudioContext = (contextStore, isNativeOfflineAudioContext) => {
    return (anything) => {
        const nativeContext = contextStore.get(anything);
        return isNativeOfflineAudioContext(nativeContext) || isNativeOfflineAudioContext(anything);
    };
};
const CONTEXT_STORE = new WeakMap();
const createIsNativeOfflineAudioContext = (nativeOfflineAudioContextConstructor) => {
    return (anything) => {
        return nativeOfflineAudioContextConstructor !== null && anything instanceof nativeOfflineAudioContextConstructor;
    };
};
const createNativeOfflineAudioContextConstructor = (window) => {
    if (window !== null && 'OfflineAudioContext' in window) {
        return window.OfflineAudioContext;
    }
    return null;
};
const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(window);
const isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(nativeOfflineAudioContextConstructor);
const isAnyOfflineAudioContext = createIsAnyOfflineAudioContext(CONTEXT_STORE, isNativeOfflineAudioContext);
function isOfflineAudioContext(arg) {
    return isAnyOfflineAudioContext(arg);
}
const createIsAnyAudioContext = (contextStore, isNativeAudioContext) => {
    return (anything) => {
        const nativeContext = contextStore.get(anything);
        return isNativeAudioContext(nativeContext) || isNativeAudioContext(anything);
    };
};
const createIsNativeAudioContext = (nativeAudioContextConstructor) => {
    return (anything) => {
        return nativeAudioContextConstructor !== null && anything instanceof nativeAudioContextConstructor;
    };
};
const createNativeAudioContextConstructor = (window) => {
    if (window !== null && 'AudioContext' in window) {
        return window.AudioContext;
    }
    return null;
};
const nativeAudioContextConstructor = createNativeAudioContextConstructor(window);
const isNativeAudioContext = createIsNativeAudioContext(nativeAudioContextConstructor);
const isAnyAudioContext = createIsAnyAudioContext(CONTEXT_STORE, isNativeAudioContext);
function isAudioContext(arg) {
    return isAnyAudioContext(arg);
}
function isAudioBuffer(arg) {
    return arg instanceof AudioBuffer;
}
class Ticker {
    constructor(callback, type, updateInterval, contextSampleRate) {
        this._callback = callback;
        this._type = type;
        this._minimumUpdateInterval = Math.max(128 / (contextSampleRate || 44100), 0.001);
        this.updateInterval = updateInterval;
        this._createClock();
    }
    _createWorker() {
        const blob = new Blob([
            `
			// the initial timeout time
			let timeoutTime =  ${(this._updateInterval * 1000).toFixed(1)};
			// onmessage callback
			self.onmessage = function(msg){
				timeoutTime = parseInt(msg.data);
			};
			// the tick function which posts a message
			// and schedules a new tick
			function tick(){
				setTimeout(tick, timeoutTime);
				self.postMessage('tick');
			}
			// call tick initially
			tick();
			`,
        ], { type: "text/javascript" });
        const blobUrl = URL.createObjectURL(blob);
        const worker = new Worker(blobUrl);
        worker.onmessage = this._callback.bind(this);
        this._worker = worker;
    }
    _createTimeout() {
        this._timeout = setTimeout(() => {
            this._createTimeout();
            this._callback();
        }, this._updateInterval * 1000);
    }
    _createClock() {
        if (this._type === "worker") {
            try {
                this._createWorker();
            }
            catch (e) {
                this._type = "timeout";
                this._createClock();
            }
        }
        else if (this._type === "timeout") {
            this._createTimeout();
        }
    }
    _disposeClock() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        if (this._worker) {
            this._worker.terminate();
            this._worker.onmessage = null;
        }
    }
    get updateInterval() {
        return this._updateInterval;
    }
    set updateInterval(interval) {
        var _a;
        this._updateInterval = Math.max(interval, this._minimumUpdateInterval);
        if (this._type === "worker") {
            (_a = this._worker) === null || _a === void 0 ? void 0 : _a.postMessage(this._updateInterval * 1000);
        }
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._disposeClock();
        this._type = type;
        this._createClock();
    }
    dispose() {
        this._disposeClock();
    }
}
const EPSILON = 1e-6;
function GT(a, b) {
    return a > b + EPSILON;
}
function GTE(a, b) {
    return GT(a, b) || EQ(a, b);
}
function LT(a, b) {
    return a + EPSILON < b;
}
function EQ(a, b) {
    return Math.abs(a - b) < EPSILON;
}
function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}
class TimelineValue extends Tone {
    constructor(initialValue) {
        super();
        this.name = "TimelineValue";
        this._timeline = new Timeline({
            memory: 10,
        });
        this._initialValue = initialValue;
    }
    set(value, time) {
        this._timeline.add({
            value,
            time,
        });
        return this;
    }
    get(time) {
        const event = this._timeline.get(time);
        if (event) {
            return event.value;
        }
        else {
            return this._initialValue;
        }
    }
}
class TransportInstance extends ToneWithContext {
    constructor() {
        const options = optionsFromArguments(TransportInstance.getDefaults(), arguments);
        super(options);
        this.name = "Transport";
        this._loop = new TimelineValue(false);
        this._loopStart = 0;
        this._loopEnd = 0;
        this._scheduledEvents = {};
        this._timeline = new Timeline();
        this._repeatedEvents = new IntervalTimeline();
        this._syncedSignals = [];
        this._swingAmount = 0;
        this._ppq = options.ppq;
        this._clock = new Clock({
            callback: this._processTick.bind(this),
            context: this.context,
            frequency: 0,
            units: "bpm",
        });
        this._bindClockEvents();
        this.bpm = this._clock.frequency;
        this._clock.frequency.multiplier = options.ppq;
        this.bpm.setValueAtTime(options.bpm, 0);
        readOnly(this, "bpm");
        this._timeSignature = options.timeSignature;
        this._swingTicks = options.ppq / 2;
    }
    static getDefaults() {
        return Object.assign(ToneWithContext.getDefaults(), {
            bpm: 120,
            loopEnd: "4m",
            loopStart: 0,
            ppq: 192,
            swing: 0,
            swingSubdivision: "8n",
            timeSignature: 4,
        });
    }
    _processTick(tickTime, ticks) {
        if (this._loop.get(tickTime)) {
            if (ticks >= this._loopEnd) {
                this.emit("loopEnd", tickTime);
                this._clock.setTicksAtTime(this._loopStart, tickTime);
                ticks = this._loopStart;
                this.emit("loopStart", tickTime, this._clock.getSecondsAtTime(tickTime));
                this.emit("loop", tickTime);
            }
        }
        if (this._swingAmount > 0 &&
            ticks % this._ppq !== 0 &&
            ticks % (this._swingTicks * 2) !== 0) {
            const progress = (ticks % (this._swingTicks * 2)) / (this._swingTicks * 2);
            const amount = Math.sin(progress * Math.PI) * this._swingAmount;
            tickTime +=
                new TicksClass(this.context, (this._swingTicks * 2) / 3).toSeconds() * amount;
        }
        enterScheduledCallback(true);
        this._timeline.forEachAtTime(ticks, (event) => event.invoke(tickTime));
        enterScheduledCallback(false);
    }
    schedule(callback, time) {
        const event = new TransportEvent(this, {
            callback,
            time: new TransportTimeClass(this.context, time).toTicks(),
        });
        return this._addEvent(event, this._timeline);
    }
    scheduleRepeat(callback, interval, startTime, duration = Infinity) {
        const event = new TransportRepeatEvent(this, {
            callback,
            duration: new TimeClass(this.context, duration).toTicks(),
            interval: new TimeClass(this.context, interval).toTicks(),
            time: new TransportTimeClass(this.context, startTime).toTicks(),
        });
        return this._addEvent(event, this._repeatedEvents);
    }
    scheduleOnce(callback, time) {
        const event = new TransportEvent(this, {
            callback,
            once: true,
            time: new TransportTimeClass(this.context, time).toTicks(),
        });
        return this._addEvent(event, this._timeline);
    }
    clear(eventId) {
        if (this._scheduledEvents.hasOwnProperty(eventId)) {
            const item = this._scheduledEvents[eventId.toString()];
            item.timeline.remove(item.event);
            item.event.dispose();
            delete this._scheduledEvents[eventId.toString()];
        }
        return this;
    }
    _addEvent(event, timeline) {
        this._scheduledEvents[event.id.toString()] = {
            event,
            timeline,
        };
        timeline.add(event);
        return event.id;
    }
    cancel(after = 0) {
        const computedAfter = this.toTicks(after);
        this._timeline.forEachFrom(computedAfter, (event) => this.clear(event.id));
        this._repeatedEvents.forEachFrom(computedAfter, (event) => this.clear(event.id));
        return this;
    }
    _bindClockEvents() {
        this._clock.on("start", (time, offset) => {
            offset = new TicksClass(this.context, offset).toSeconds();
            this.emit("start", time, offset);
        });
        this._clock.on("stop", (time) => {
            this.emit("stop", time);
        });
        this._clock.on("pause", (time) => {
            this.emit("pause", time);
        });
    }
    get state() {
        return this._clock.getStateAtTime(this.now());
    }
    start(time, offset) {
        this.context.resume();
        let offsetTicks;
        if (isDefined(offset)) {
            offsetTicks = this.toTicks(offset);
        }
        this._clock.start(time, offsetTicks);
        return this;
    }
    stop(time) {
        this._clock.stop(time);
        return this;
    }
    pause(time) {
        this._clock.pause(time);
        return this;
    }
    toggle(time) {
        time = this.toSeconds(time);
        if (this._clock.getStateAtTime(time) !== "started") {
            this.start(time);
        }
        else {
            this.stop(time);
        }
        return this;
    }
    get timeSignature() {
        return this._timeSignature;
    }
    set timeSignature(timeSig) {
        if (isArray(timeSig)) {
            timeSig = (timeSig[0] / timeSig[1]) * 4;
        }
        this._timeSignature = timeSig;
    }
    get loopStart() {
        return new TimeClass(this.context, this._loopStart, "i").toSeconds();
    }
    set loopStart(startPosition) {
        this._loopStart = this.toTicks(startPosition);
    }
    get loopEnd() {
        return new TimeClass(this.context, this._loopEnd, "i").toSeconds();
    }
    set loopEnd(endPosition) {
        this._loopEnd = this.toTicks(endPosition);
    }
    get loop() {
        return this._loop.get(this.now());
    }
    set loop(loop) {
        this._loop.set(loop, this.now());
    }
    setLoopPoints(startPosition, endPosition) {
        this.loopStart = startPosition;
        this.loopEnd = endPosition;
        return this;
    }
    get swing() {
        return this._swingAmount;
    }
    set swing(amount) {
        this._swingAmount = amount;
    }
    get swingSubdivision() {
        return new TicksClass(this.context, this._swingTicks).toNotation();
    }
    set swingSubdivision(subdivision) {
        this._swingTicks = this.toTicks(subdivision);
    }
    get position() {
        const now = this.now();
        const ticks = this._clock.getTicksAtTime(now);
        return new TicksClass(this.context, ticks).toBarsBeatsSixteenths();
    }
    set position(progress) {
        const ticks = this.toTicks(progress);
        this.ticks = ticks;
    }
    get seconds() {
        return this._clock.seconds;
    }
    set seconds(s) {
        const now = this.now();
        const ticks = this._clock.frequency.timeToTicks(s, now);
        this.ticks = ticks;
    }
    get progress() {
        if (this.loop) {
            const now = this.now();
            const ticks = this._clock.getTicksAtTime(now);
            return ((ticks - this._loopStart) / (this._loopEnd - this._loopStart));
        }
        else {
            return 0;
        }
    }
    get ticks() {
        return this._clock.ticks;
    }
    set ticks(t) {
        if (this._clock.ticks !== t) {
            const now = this.now();
            if (this.state === "started") {
                const ticks = this._clock.getTicksAtTime(now);
                const remainingTick = this._clock.frequency.getDurationOfTicks(Math.ceil(ticks) - ticks, now);
                const time = now + remainingTick;
                this.emit("stop", time);
                this._clock.setTicksAtTime(t, time);
                this.emit("start", time, this._clock.getSecondsAtTime(time));
            }
            else {
                this.emit("ticks", now);
                this._clock.setTicksAtTime(t, now);
            }
        }
    }
    getTicksAtTime(time) {
        return this._clock.getTicksAtTime(time);
    }
    getSecondsAtTime(time) {
        return this._clock.getSecondsAtTime(time);
    }
    get PPQ() {
        return this._clock.frequency.multiplier;
    }
    set PPQ(ppq) {
        this._clock.frequency.multiplier = ppq;
    }
    nextSubdivision(subdivision) {
        subdivision = this.toTicks(subdivision);
        if (this.state !== "started") {
            return 0;
        }
        else {
            const now = this.now();
            const transportPos = this.getTicksAtTime(now);
            const remainingTicks = subdivision - (transportPos % subdivision);
            return this._clock.nextTickTime(remainingTicks, now);
        }
    }
    syncSignal(signal, ratio) {
        const now = this.now();
        let source = this.bpm;
        let sourceValue = 1 / (60 / source.getValueAtTime(now) / this.PPQ);
        let nodes = [];
        if (signal.units === "time") {
            const scaleFactor = 1 / 64 / sourceValue;
            const scaleBefore = new Gain(scaleFactor);
            const reciprocal = new Pow(-1);
            const scaleAfter = new Gain(scaleFactor);
            source.chain(scaleBefore, reciprocal, scaleAfter);
            source = scaleAfter;
            sourceValue = 1 / sourceValue;
            nodes = [scaleBefore, reciprocal, scaleAfter];
        }
        if (!ratio) {
            if (signal.getValueAtTime(now) !== 0) {
                ratio = signal.getValueAtTime(now) / sourceValue;
            }
            else {
                ratio = 0;
            }
        }
        const ratioSignal = new Gain(ratio);
        source.connect(ratioSignal);
        ratioSignal.connect(signal._param);
        nodes.push(ratioSignal);
        this._syncedSignals.push({
            initial: signal.value,
            nodes: nodes,
            signal,
        });
        signal.value = 0;
        return this;
    }
    unsyncSignal(signal) {
        for (let i = this._syncedSignals.length - 1; i >= 0; i--) {
            const syncedSignal = this._syncedSignals[i];
            if (syncedSignal.signal === signal) {
                syncedSignal.nodes.forEach((node) => node.dispose());
                syncedSignal.signal.value = syncedSignal.initial;
                this._syncedSignals.splice(i, 1);
            }
        }
        return this;
    }
    dispose() {
        super.dispose();
        this._clock.dispose();
        writable(this, "bpm");
        this._timeline.dispose();
        this._repeatedEvents.dispose();
        return this;
    }
}
Emitter.mixin(TransportInstance);
onContextInit((context) => {
    context.transport = new TransportInstance({ context });
});
onContextClose((context) => {
    context.transport.dispose();
});
class ToneConstantSource extends OneShotSource {
    constructor() {
        var _a;
        const options = optionsFromArguments(ToneConstantSource.getDefaults(), arguments, ["offset"]);
        super(options);
        this.name = "ToneConstantSource";
        this._contextStarted = (state) => {
            if (state !== "running") {
                return;
            }
            this._source = this.context.createConstantSource();
            connect(this._source, this._gainNode);
            this.offset.setParam(this._source.offset);
            if (this.state === "started") {
                this._source.start(0);
            }
        };
        const isSuspended = !this.context.isOffline && this.context.state !== "running";
        if (!isSuspended) {
            this._source = this.context.createConstantSource();
            connect(this._source, this._gainNode);
        }
        else {
            this.context.on("statechange", this._contextStarted);
        }
        this.offset = new Param({
            context: this.context,
            convert: options.convert,
            param: isSuspended
                ?
                    this.context.createGain().gain
                : (_a = this._source) === null || _a === void 0 ? void 0 : _a.offset,
            swappable: isSuspended,
            units: options.units,
            value: options.offset,
            minValue: options.minValue,
            maxValue: options.maxValue,
        });
    }
    static getDefaults() {
        return Object.assign(OneShotSource.getDefaults(), {
            convert: true,
            offset: 1,
            units: "number",
        });
    }
    start(time) {
        var _a;
        const computedTime = this.toSeconds(time);
        this.log("start", computedTime);
        this._startGain(computedTime);
        (_a = this._source) === null || _a === void 0 ? void 0 : _a.start(computedTime);
        return this;
    }
    _stopSource(time) {
        var _a;
        if (this.state === "stopped") {
            return;
        }
        (_a = this._source) === null || _a === void 0 ? void 0 : _a.stop(time);
    }
    dispose() {
        var _a;
        super.dispose();
        if (this.state === "started") {
            this.stop();
        }
        (_a = this._source) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.offset.dispose();
        this.context.off("statechange", this._contextStarted);
        return this;
    }
}
function readOnly(target, property) {
    if (isArray(property)) {
        property.forEach((str) => readOnly(target, str));
    }
    else {
        Object.defineProperty(target, property, {
            enumerable: true,
            writable: false,
        });
    }
}
function writable(target, property) {
    if (isArray(property)) {
        property.forEach((str) => writable(target, str));
    }
    else {
        Object.defineProperty(target, property, {
            writable: true,
        });
    }
}
const noOp = () => {
};
class Gain extends ToneAudioNode {
    constructor() {
        const options = optionsFromArguments(Gain.getDefaults(), arguments, [
            "gain",
            "units",
        ]);
        super(options);
        this.name = "Gain";
        this._gainNode = this.context.createGain();
        this.input = this._gainNode;
        this.baseOutputNode = this._gainNode;
        this.gain = new Param({
            context: this.context,
            convert: options.convert,
            param: this._gainNode.gain,
            units: options.units,
            value: options.gain,
            minValue: options.minValue,
            maxValue: options.maxValue,
        });
        readOnly(this, "gain");
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            convert: true,
            gain: 1,
            units: "gain",
        });
    }
    dispose() {
        super.dispose();
        this._gainNode.disconnect();
        this.gain.dispose();
        return this;
    }
}
class DrawInstance extends ToneWithContext {
    constructor() {
        super(...arguments);
        this.name = "Draw";
        this.expiration = 0.25;
        this.anticipation = 0.008;
        this._events = new Timeline();
        this._boundDrawLoop = this._drawLoop.bind(this);
        this._animationFrame = -1;
    }
    schedule(callback, time) {
        this._events.add({
            callback,
            time: this.toSeconds(time),
        });
        if (this._events.length === 1) {
            this._animationFrame = requestAnimationFrame(this._boundDrawLoop);
        }
        return this;
    }
    cancel(after) {
        this._events.cancel(this.toSeconds(after));
        return this;
    }
    _drawLoop() {
        const now = this.context.currentTime;
        this._events.forEachBefore(now + this.anticipation, (event) => {
            if (now - event.time <= this.expiration) {
                event.callback();
            }
            this._events.remove(event);
        });
        if (this._events.length > 0) {
            this._animationFrame = requestAnimationFrame(this._boundDrawLoop);
        }
    }
    dispose() {
        super.dispose();
        this._events.dispose();
        cancelAnimationFrame(this._animationFrame);
        return this;
    }
}
onContextInit((context) => {
    context.draw = new DrawInstance({ context });
});
onContextClose((context) => {
    context.draw.dispose();
});
class CrossFade extends ToneAudioNode {
    constructor() {
        const options = optionsFromArguments(CrossFade.getDefaults(), arguments, ["fade"]);
        super(options);
        this.name = "CrossFade";
        this._panner = this.context.createStereoPanner();
        this._split = this.context.createChannelSplitter(2);
        this._g2a = new GainToAudio({ context: this.context });
        this.a = new Gain({
            context: this.context,
            gain: 0,
        });
        this.b = new Gain({
            context: this.context,
            gain: 0,
        });
        this.baseOutputNode = new Gain({ context: this.context });
        this._internalChannels = [this.a, this.b];
        this.fade = new Signal({
            context: this.context,
            units: "normalRange",
            value: options.fade,
        });
        readOnly(this, "fade");
        this.context.getConstant(1).connect(this._panner);
        this._panner.connect(this._split);
        this._panner.channelCount = 1;
        this._panner.channelCountMode = "explicit";
        connect(this._split, this.a.gain, 0);
        connect(this._split, this.b.gain, 1);
        this.fade.chain(this._g2a, this._panner.pan);
        this.a.connect(this.baseOutputNode);
        this.b.connect(this.baseOutputNode);
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            fade: 0.5,
        });
    }
    dispose() {
        super.dispose();
        this.a.dispose();
        this.b.dispose();
        this.baseOutputNode.dispose();
        this.fade.dispose();
        this._g2a.dispose();
        this._panner.disconnect();
        this._split.disconnect();
        return this;
    }
}
class Zero extends SignalOperator {
    constructor() {
        super(optionsFromArguments(Zero.getDefaults(), arguments));
        this.name = "Zero";
        this._gain = new Gain({ context: this.context });
        this.baseOutputNode = this._gain;
        this.input = undefined;
        connect(this.context.getConstant(0), this._gain);
    }
    dispose() {
        super.dispose();
        disconnect(this.context.getConstant(0), this._gain);
        return this;
    }
}
class AudioToGain extends SignalOperator {
    constructor() {
        super(...arguments);
        this.name = "AudioToGain";
        this._norm = new WaveShaper({
            context: this.context,
            mapping: (x) => (x + 1) / 2,
        });
        this.input = this._norm;
        this.baseOutputNode = this._norm;
    }
    dispose() {
        super.dispose();
        this._norm.dispose();
        return this;
    }
}
class Scale extends SignalOperator {
    constructor() {
        const options = optionsFromArguments(Scale.getDefaults(), arguments, [
            "min",
            "max",
        ]);
        super(options);
        this.name = "Scale";
        this._mult = this.input = new Multiply({
            context: this.context,
            value: options.max - options.min,
        });
        this._add = this.baseOutputNode = new Add({
            context: this.context,
            value: options.min,
        });
        this._min = options.min;
        this._max = options.max;
        this.input.connect(this.baseOutputNode);
    }
    static getDefaults() {
        return Object.assign(SignalOperator.getDefaults(), {
            max: 1,
            min: 0,
        });
    }
    get min() {
        return this._min;
    }
    set min(min) {
        this._min = min;
        this._setRange();
    }
    get max() {
        return this._max;
    }
    set max(max) {
        this._max = max;
        this._setRange();
    }
    _setRange() {
        this._add.value = this._min;
        this._mult.value = this._max - this._min;
    }
    dispose() {
        super.dispose();
        this._add.dispose();
        this._mult.dispose();
        return this;
    }
}
class Add extends Signal {
    constructor() {
        super(optionsFromArguments(Add.getDefaults(), arguments, ["value"]));
        this.override = false;
        this.name = "Add";
        this._sum = new Gain({ context: this.context });
        this.input = this._sum;
        this.baseOutputNode = this._sum;
        this.addend = this._param;
        connectSeries(this._constantSource, this._sum);
    }
    static getDefaults() {
        return Object.assign(Signal.getDefaults(), {
            value: 0,
        });
    }
    dispose() {
        super.dispose();
        this._sum.dispose();
        return this;
    }
}
class Multiply extends Signal {
    constructor() {
        const options = optionsFromArguments(Multiply.getDefaults(), arguments, ["value"]);
        super(options);
        this.name = "Multiply";
        this.override = false;
        this._mult =
            this.input =
                this.baseOutputNode =
                    new Gain({
                        context: this.context,
                        minValue: options.minValue,
                        maxValue: options.maxValue,
                    });
        this.factor = this._param = this._mult
            .gain;
        this.factor.setValueAtTime(options.value, 0);
    }
    static getDefaults() {
        return Object.assign(Signal.getDefaults(), {
            value: 0,
        });
    }
    dispose() {
        super.dispose();
        this._mult.dispose();
        return this;
    }
}
async function generateWaveform(instance, length) {
    const duration = length / instance.context.sampleRate;
    const context = new OfflineContext(1, duration, instance.context.sampleRate);
    const clone = new instance.constructor(Object.assign(instance.get(), {
        frequency: 2 / duration,
        detune: 0,
        context,
    })).toDestination();
    clone.start(0);
    const buffer = await context.render();
    return buffer.getChannelData(0);
}
class ToneOscillatorNode extends OneShotSource {
    constructor() {
        const options = optionsFromArguments(ToneOscillatorNode.getDefaults(), arguments, ["frequency", "type"]);
        super(options);
        this.name = "ToneOscillatorNode";
        this._oscillator = this.context.createOscillator();
        this._internalChannels = [this._oscillator];
        connect(this._oscillator, this._gainNode);
        this.type = options.type;
        this.frequency = new Param({
            context: this.context,
            param: this._oscillator.frequency,
            units: "frequency",
            value: options.frequency,
        });
        this.detune = new Param({
            context: this.context,
            param: this._oscillator.detune,
            units: "cents",
            value: options.detune,
        });
        readOnly(this, ["frequency", "detune"]);
    }
    static getDefaults() {
        return Object.assign(OneShotSource.getDefaults(), {
            detune: 0,
            frequency: 440,
            type: "sine",
        });
    }
    start(time) {
        const computedTime = this.toSeconds(time);
        this.log("start", computedTime);
        this._startGain(computedTime);
        this._oscillator.start(computedTime);
        return this;
    }
    _stopSource(time) {
        this._oscillator.stop(time);
    }
    setPeriodicWave(periodicWave) {
        this._oscillator.setPeriodicWave(periodicWave);
        return this;
    }
    get type() {
        return this._oscillator.type;
    }
    set type(type) {
        this._oscillator.type = type;
    }
    dispose() {
        super.dispose();
        if (this.state === "started") {
            this.stop();
        }
        this._oscillator.disconnect();
        this.frequency.dispose();
        this.detune.dispose();
        return this;
    }
}
class Source extends ToneAudioNode {
    constructor(options) {
        super(options);
        this.input = undefined;
        this._state = new StateTimeline("stopped");
        this._synced = false;
        this._scheduled = [];
        this._syncedStart = noOp;
        this._syncedStop = noOp;
        this._state.memory = 100;
        this._state.increasing = true;
        this._volume = this.baseOutputNode = new Volume({
            context: this.context,
            mute: options.mute,
            volume: options.volume,
        });
        this.volume = this._volume.volume;
        readOnly(this, "volume");
        this.onstop = options.onstop;
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            mute: false,
            onstop: noOp,
            volume: 0,
        });
    }
    get state() {
        if (this._synced) {
            if (this.context.transport.state === "started") {
                return this._state.getValueAtTime(this.context.transport.seconds);
            }
            else {
                return "stopped";
            }
        }
        else {
            return this._state.getValueAtTime(this.now());
        }
    }
    get mute() {
        return this._volume.mute;
    }
    set mute(mute) {
        this._volume.mute = mute;
    }
    _clampToCurrentTime(time) {
        if (this._synced) {
            return time;
        }
        else {
            return Math.max(time, this.context.currentTime);
        }
    }
    start(time, offset, duration) {
        let computedTime = isUndef(time) && this._synced
            ? this.context.transport.seconds
            : this.toSeconds(time);
        computedTime = this._clampToCurrentTime(computedTime);
        if (!this._synced &&
            this._state.getValueAtTime(computedTime) === "started") {
            assert(GT(computedTime, this._state.get(computedTime).time), "Start time must be strictly greater than previous start time");
            this._state.cancel(computedTime);
            this._state.setStateAtTime("started", computedTime);
            this.log("restart", computedTime);
            this.restart(computedTime, offset, duration);
        }
        else {
            this.log("start", computedTime);
            this._state.setStateAtTime("started", computedTime);
            if (this._synced) {
                const event = this._state.get(computedTime);
                if (event) {
                    event.offset = this.toSeconds(defaultArg(offset, 0));
                    event.duration = duration
                        ? this.toSeconds(duration)
                        : undefined;
                }
                const sched = this.context.transport.schedule((t) => {
                    this._start(t, offset, duration);
                }, computedTime);
                this._scheduled.push(sched);
                if (this.context.transport.state === "started" &&
                    this.context.transport.getSecondsAtTime(this.immediate()) >
                        computedTime) {
                    this._syncedStart(this.now(), this.context.transport.seconds);
                }
            }
            else {
                assertContextRunning(this.context);
                this._start(computedTime, offset, duration);
            }
        }
        return this;
    }
    stop(time) {
        let computedTime = isUndef(time) && this._synced
            ? this.context.transport.seconds
            : this.toSeconds(time);
        computedTime = this._clampToCurrentTime(computedTime);
        if (this._state.getValueAtTime(computedTime) === "started" ||
            isDefined(this._state.getNextState("started", computedTime))) {
            this.log("stop", computedTime);
            if (!this._synced) {
                this._stop(computedTime);
            }
            else {
                const sched = this.context.transport.schedule(this._stop.bind(this), computedTime);
                this._scheduled.push(sched);
            }
            this._state.cancel(computedTime);
            this._state.setStateAtTime("stopped", computedTime);
        }
        return this;
    }
    restart(time, offset, duration) {
        time = this.toSeconds(time);
        if (this._state.getValueAtTime(time) === "started") {
            this._state.cancel(time);
            this._restart(time, offset, duration);
        }
        return this;
    }
    sync() {
        if (!this._synced) {
            this._synced = true;
            this._syncedStart = (time, offset) => {
                if (GT(offset, 0)) {
                    const stateEvent = this._state.get(offset);
                    if (stateEvent &&
                        stateEvent.state === "started" &&
                        stateEvent.time !== offset) {
                        const startOffset = offset - this.toSeconds(stateEvent.time);
                        let duration;
                        if (stateEvent.duration) {
                            duration =
                                this.toSeconds(stateEvent.duration) -
                                    startOffset;
                        }
                        this._start(time, this.toSeconds(stateEvent.offset) + startOffset, duration);
                    }
                }
            };
            this._syncedStop = (time) => {
                const seconds = this.context.transport.getSecondsAtTime(Math.max(time - this.sampleTime, 0));
                if (this._state.getValueAtTime(seconds) === "started") {
                    this._stop(time);
                }
            };
            this.context.transport.on("start", this._syncedStart);
            this.context.transport.on("loopStart", this._syncedStart);
            this.context.transport.on("stop", this._syncedStop);
            this.context.transport.on("pause", this._syncedStop);
            this.context.transport.on("loopEnd", this._syncedStop);
        }
        return this;
    }
    unsync() {
        if (this._synced) {
            this.context.transport.off("stop", this._syncedStop);
            this.context.transport.off("pause", this._syncedStop);
            this.context.transport.off("loopEnd", this._syncedStop);
            this.context.transport.off("start", this._syncedStart);
            this.context.transport.off("loopStart", this._syncedStart);
        }
        this._synced = false;
        this._scheduled.forEach((id) => this.context.transport.clear(id));
        this._scheduled = [];
        this._state.cancel(0);
        this._stop(0);
        return this;
    }
    dispose() {
        super.dispose();
        this.onstop = noOp;
        this.unsync();
        this._volume.dispose();
        this._state.dispose();
        return this;
    }
}
class Oscillator extends Source {
    constructor() {
        const options = optionsFromArguments(Oscillator.getDefaults(), arguments, ["frequency", "type"]);
        super(options);
        this.name = "Oscillator";
        this._oscillator = null;
        this.frequency = new Signal({
            context: this.context,
            units: "frequency",
            value: options.frequency,
        });
        readOnly(this, "frequency");
        this.detune = new Signal({
            context: this.context,
            units: "cents",
            value: options.detune,
        });
        readOnly(this, "detune");
        this._partials = options.partials;
        this._partialCount = options.partialCount;
        this._type = options.type;
        if (options.partialCount && options.type !== "custom") {
            this._type = (this.baseType +
                options.partialCount.toString());
        }
        this.phase = options.phase;
    }
    static getDefaults() {
        return Object.assign(Source.getDefaults(), {
            detune: 0,
            frequency: 440,
            partialCount: 0,
            partials: [],
            phase: 0,
            type: "sine",
        });
    }
    _start(time) {
        const computedTime = this.toSeconds(time);
        const oscillator = new ToneOscillatorNode({
            context: this.context,
            onended: () => this.onstop(this),
        });
        this._oscillator = oscillator;
        if (this._wave) {
            this._oscillator.setPeriodicWave(this._wave);
        }
        else {
            this._oscillator.type = this._type;
        }
        this._oscillator.connect(this.baseOutputNode);
        this.frequency.connect(this._oscillator.frequency);
        this.detune.connect(this._oscillator.detune);
        this._oscillator.start(computedTime);
    }
    _stop(time) {
        const computedTime = this.toSeconds(time);
        if (this._oscillator) {
            this._oscillator.stop(computedTime);
        }
    }
    _restart(time) {
        const computedTime = this.toSeconds(time);
        this.log("restart", computedTime);
        if (this._oscillator) {
            this._oscillator.cancelStop();
        }
        this._state.cancel(computedTime);
        return this;
    }
    syncFrequency() {
        this.context.transport.syncSignal(this.frequency);
        return this;
    }
    unsyncFrequency() {
        this.context.transport.unsyncSignal(this.frequency);
        return this;
    }
    _getCachedPeriodicWave() {
        if (this._type === "custom") {
            const oscProps = Oscillator._periodicWaveCache.find((description) => {
                return (description.phase === this._phase &&
                    deepEquals(description.partials, this._partials));
            });
            return oscProps;
        }
        else {
            const oscProps = Oscillator._periodicWaveCache.find((description) => {
                return (description.type === this._type &&
                    description.phase === this._phase);
            });
            this._partialCount = oscProps
                ? oscProps.partialCount
                : this._partialCount;
            return oscProps;
        }
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
        const isBasicType = ["sine", "square", "sawtooth", "triangle"].indexOf(type) !== -1;
        if (this._phase === 0 && isBasicType) {
            this._wave = undefined;
            this._partialCount = 0;
            if (this._oscillator !== null) {
                this._oscillator.type = type;
            }
        }
        else {
            const cache = this._getCachedPeriodicWave();
            if (isDefined(cache)) {
                const { partials, wave } = cache;
                this._wave = wave;
                this._partials = partials;
                if (this._oscillator !== null) {
                    this._oscillator.setPeriodicWave(this._wave);
                }
            }
            else {
                const [real, imag] = this._getRealImaginary(type, this._phase);
                const periodicWave = this.context.createPeriodicWave(real, imag);
                this._wave = periodicWave;
                if (this._oscillator !== null) {
                    this._oscillator.setPeriodicWave(this._wave);
                }
                Oscillator._periodicWaveCache.push({
                    imag,
                    partialCount: this._partialCount,
                    partials: this._partials,
                    phase: this._phase,
                    real,
                    type: this._type,
                    wave: this._wave,
                });
                if (Oscillator._periodicWaveCache.length > 100) {
                    Oscillator._periodicWaveCache.shift();
                }
            }
        }
    }
    get baseType() {
        return this._type.replace(this.partialCount.toString(), "");
    }
    set baseType(baseType) {
        if (this.partialCount &&
            this._type !== "custom" &&
            baseType !== "custom") {
            this.type = (baseType + this.partialCount);
        }
        else {
            this.type = baseType;
        }
    }
    get partialCount() {
        return this._partialCount;
    }
    set partialCount(p) {
        assertRange(p, 0);
        let type = this._type;
        const partial = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(this._type);
        if (partial) {
            type = partial[1];
        }
        if (this._type !== "custom") {
            if (p === 0) {
                this.type = type;
            }
            else {
                this.type = (type + p.toString());
            }
        }
        else {
            const fullPartials = new Float32Array(p);
            this._partials.forEach((v, i) => (fullPartials[i] = v));
            this._partials = Array.from(fullPartials);
            this.type = this._type;
        }
    }
    _getRealImaginary(type, phase) {
        const fftSize = 4096;
        let periodicWaveSize = fftSize / 2;
        const real = new Float32Array(periodicWaveSize);
        const imag = new Float32Array(periodicWaveSize);
        let partialCount = 1;
        if (type === "custom") {
            partialCount = this._partials.length + 1;
            this._partialCount = this._partials.length;
            periodicWaveSize = partialCount;
            if (this._partials.length === 0) {
                return [real, imag];
            }
        }
        else {
            const partial = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(type);
            if (partial) {
                partialCount = parseInt(partial[2], 10) + 1;
                this._partialCount = parseInt(partial[2], 10);
                type = partial[1];
                partialCount = Math.max(partialCount, 2);
                periodicWaveSize = partialCount;
            }
            else {
                this._partialCount = 0;
            }
            this._partials = [];
        }
        for (let n = 1; n < periodicWaveSize; ++n) {
            const piFactor = 2 / (n * Math.PI);
            let b;
            switch (type) {
                case "sine":
                    b = n <= partialCount ? 1 : 0;
                    this._partials[n - 1] = b;
                    break;
                case "square":
                    b = n & 1 ? 2 * piFactor : 0;
                    this._partials[n - 1] = b;
                    break;
                case "sawtooth":
                    b = piFactor * (n & 1 ? 1 : -1);
                    this._partials[n - 1] = b;
                    break;
                case "triangle":
                    if (n & 1) {
                        b =
                            2 *
                                (piFactor * piFactor) *
                                (((n - 1) >> 1) & 1 ? -1 : 1);
                    }
                    else {
                        b = 0;
                    }
                    this._partials[n - 1] = b;
                    break;
                case "custom":
                    b = this._partials[n - 1];
                    break;
                default:
                    throw new TypeError("Oscillator: invalid type: " + type);
            }
            if (b !== 0) {
                real[n] = -b * Math.sin(phase * n);
                imag[n] = b * Math.cos(phase * n);
            }
            else {
                real[n] = 0;
                imag[n] = 0;
            }
        }
        return [real, imag];
    }
    _inverseFFT(real, imag, phase) {
        let sum = 0;
        const len = real.length;
        for (let i = 0; i < len; i++) {
            sum +=
                real[i] * Math.cos(i * phase) + imag[i] * Math.sin(i * phase);
        }
        return sum;
    }
    getInitialValue() {
        const [real, imag] = this._getRealImaginary(this._type, 0);
        let maxValue = 0;
        const twoPi = Math.PI * 2;
        const testPositions = 32;
        for (let i = 0; i < testPositions; i++) {
            maxValue = Math.max(this._inverseFFT(real, imag, (i / testPositions) * twoPi), maxValue);
        }
        return clamp(-this._inverseFFT(real, imag, this._phase) / maxValue, -1, 1);
    }
    get partials() {
        return this._partials.slice(0, this.partialCount);
    }
    set partials(partials) {
        this._partials = partials;
        this._partialCount = this._partials.length;
        if (partials.length) {
            this.type = "custom";
        }
    }
    get phase() {
        return this._phase * (180 / Math.PI);
    }
    set phase(phase) {
        this._phase = (phase * Math.PI) / 180;
        this.type = this._type;
    }
    async asArray(length = 1024) {
        return generateWaveform(this, length);
    }
    dispose() {
        super.dispose();
        if (this._oscillator !== null) {
            this._oscillator.dispose();
        }
        this._wave = undefined;
        this.frequency.dispose();
        this.detune.dispose();
        return this;
    }
}
Oscillator._periodicWaveCache = [];
class LFO extends ToneAudioNode {
    constructor() {
        const options = optionsFromArguments(LFO.getDefaults(), arguments, [
            "frequency",
            "min",
            "max",
        ]);
        super(options);
        this.name = "LFO";
        this._stoppedValue = 0;
        this._units = "number";
        this.convert = true;
        this._fromType = Param.prototype._fromType;
        this._toType = Param.prototype._toType;
        this._is = Param.prototype._is;
        this._clampValue = Param.prototype._clampValue;
        this._oscillator = new Oscillator(options);
        this.frequency = this._oscillator.frequency;
        this._amplitudeGain = new Gain({
            context: this.context,
            gain: options.amplitude,
            units: "normalRange",
        });
        this.amplitude = this._amplitudeGain.gain;
        this._stoppedSignal = new Signal({
            context: this.context,
            units: "audioRange",
            value: 0,
        });
        this._zeros = new Zero({ context: this.context });
        this._a2g = new AudioToGain({ context: this.context });
        this._scaler = this.baseOutputNode = new Scale({
            context: this.context,
            max: options.max,
            min: options.min,
        });
        this.units = options.units;
        this.min = options.min;
        this.max = options.max;
        this._oscillator.chain(this._amplitudeGain, this._a2g, this._scaler);
        this._zeros.connect(this._a2g);
        this._stoppedSignal.connect(this._a2g);
        readOnly(this, ["amplitude", "frequency"]);
        this.phase = options.phase;
    }
    static getDefaults() {
        return Object.assign(Oscillator.getDefaults(), {
            amplitude: 1,
            frequency: "4n",
            max: 1,
            min: 0,
            type: "sine",
            units: "number",
        });
    }
    start(time) {
        time = this.toSeconds(time);
        this._stoppedSignal.setValueAtTime(0, time);
        this._oscillator.start(time);
        return this;
    }
    stop(time) {
        time = this.toSeconds(time);
        this._stoppedSignal.setValueAtTime(this._stoppedValue, time);
        this._oscillator.stop(time);
        return this;
    }
    sync() {
        this._oscillator.sync();
        this._oscillator.syncFrequency();
        return this;
    }
    unsync() {
        this._oscillator.unsync();
        this._oscillator.unsyncFrequency();
        return this;
    }
    _setStoppedValue() {
        this._stoppedValue = this._oscillator.getInitialValue();
        this._stoppedSignal.value = this._stoppedValue;
    }
    get min() {
        return this._toType(this._scaler.min);
    }
    set min(min) {
        min = this._fromType(min);
        this._scaler.min = min;
    }
    get max() {
        return this._toType(this._scaler.max);
    }
    set max(max) {
        max = this._fromType(max);
        this._scaler.max = max;
    }
    get type() {
        return this._oscillator.type;
    }
    set type(type) {
        this._oscillator.type = type;
        this._setStoppedValue();
    }
    get partials() {
        return this._oscillator.partials;
    }
    set partials(partials) {
        this._oscillator.partials = partials;
        this._setStoppedValue();
    }
    get phase() {
        return this._oscillator.phase;
    }
    set phase(phase) {
        this._oscillator.phase = phase;
        this._setStoppedValue();
    }
    get units() {
        return this._units;
    }
    set units(val) {
        const currentMin = this.min;
        const currentMax = this.max;
        this._units = val;
        this.min = currentMin;
        this.max = currentMax;
    }
    get state() {
        return this._oscillator.state;
    }
    connect(node, outputNum, inputNum) {
        if (node instanceof Param || node instanceof Signal) {
            this.convert = node.convert;
            this.units = node.units;
        }
        connectSignal(this, node, outputNum, inputNum);
        return this;
    }
    dispose() {
        super.dispose();
        this._oscillator.dispose();
        this._stoppedSignal.dispose();
        this._zeros.dispose();
        this._scaler.dispose();
        this._a2g.dispose();
        this._amplitudeGain.dispose();
        this.amplitude.dispose();
        return this;
    }
}
class Delay extends ToneAudioNode {
    constructor() {
        const options = optionsFromArguments(Delay.getDefaults(), arguments, [
            "delayTime",
            "maxDelay",
        ]);
        super(options);
        this.name = "Delay";
        const maxDelayInSeconds = this.toSeconds(options.maxDelay);
        this._maxDelay = Math.max(maxDelayInSeconds, this.toSeconds(options.delayTime));
        this._delayNode =
            this.input =
                this.baseOutputNode =
                    this.context.createDelay(maxDelayInSeconds);
        this.delayTime = new Param({
            context: this.context,
            param: this._delayNode.delayTime,
            units: "time",
            value: options.delayTime,
            minValue: 0,
            maxValue: this.maxDelay,
        });
        readOnly(this, "delayTime");
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            delayTime: 0,
            maxDelay: 1,
        });
    }
    get maxDelay() {
        return this._maxDelay;
    }
    dispose() {
        super.dispose();
        this._delayNode.disconnect();
        this.delayTime.dispose();
        return this;
    }
}
class GainToAudio extends SignalOperator {
    constructor() {
        super(...arguments);
        this.name = "GainToAudio";
        this._norm = new WaveShaper({
            context: this.context,
            mapping: (x) => Math.abs(x) * 2 - 1,
        });
        this.input = this._norm;
        this.baseOutputNode = this._norm;
    }
    dispose() {
        super.dispose();
        this._norm.dispose();
        return this;
    }
}
class PitchShift extends FeedbackEffect {
    constructor() {
        const options = optionsFromArguments(PitchShift.getDefaults(), arguments, ["pitch"]);
        super(options);
        this.name = "PitchShift";
        this.__frequency = new Signal({ context: this.context });
        this._delayA = new Delay({
            maxDelay: 1,
            context: this.context,
        });
        this._lfoA = new LFO({
            context: this.context,
            min: 0,
            max: 0.1,
            type: "sawtooth",
        }).connect(this._delayA.delayTime);
        this._delayB = new Delay({
            maxDelay: 1,
            context: this.context,
        });
        this._lfoB = new LFO({
            context: this.context,
            min: 0,
            max: 0.1,
            type: "sawtooth",
            phase: 180,
        }).connect(this._delayB.delayTime);
        this._crossFade = new CrossFade({ context: this.context });
        this._crossFadeLFO = new LFO({
            context: this.context,
            min: 0,
            max: 1,
            type: "triangle",
            phase: 90,
        }).connect(this._crossFade.fade);
        this._feedbackDelay = new Delay({
            delayTime: options.delayTime,
            context: this.context,
        });
        this.delayTime = this._feedbackDelay.delayTime;
        readOnly(this, "delayTime");
        this._pitch = options.pitch;
        this._windowSize = options.windowSize;
        this._delayA.connect(this._crossFade.a);
        this._delayB.connect(this._crossFade.b);
        this.__frequency.fan(this._lfoA.frequency, this._lfoB.frequency, this._crossFadeLFO.frequency);
        this.effectSend.fan(this._delayA, this._delayB);
        this._crossFade.chain(this._feedbackDelay, this.effectReturn);
        const now = this.now();
        this._lfoA.start(now);
        this._lfoB.start(now);
        this._crossFadeLFO.start(now);
        this.windowSize = this._windowSize;
        console.log('PitchShift output', this.baseOutputNode);
        console.log('PitchShift input', this.input);
    }
    static getDefaults() {
        return Object.assign(FeedbackEffect.getDefaults(), {
            pitch: 0,
            windowSize: 0.1,
            delayTime: 0,
            feedback: 0,
        });
    }
    get pitch() {
        return this._pitch;
    }
    set pitch(interval) {
        this._pitch = interval;
        let factor = 0;
        if (interval < 0) {
            this._lfoA.min = 0;
            this._lfoA.max = this._windowSize;
            this._lfoB.min = 0;
            this._lfoB.max = this._windowSize;
            factor = intervalToFrequencyRatio(interval - 1) + 1;
        }
        else {
            this._lfoA.min = this._windowSize;
            this._lfoA.max = 0;
            this._lfoB.min = this._windowSize;
            this._lfoB.max = 0;
            factor = intervalToFrequencyRatio(interval) - 1;
        }
        this.__frequency.value = factor * (1.2 / this._windowSize);
    }
    get windowSize() {
        return this._windowSize;
    }
    set windowSize(size) {
        this._windowSize = this.toSeconds(size);
        this.pitch = this._pitch;
    }
    dispose() {
        super.dispose();
        this.__frequency.dispose();
        this._delayA.dispose();
        this._delayB.dispose();
        this._lfoA.dispose();
        this._lfoB.dispose();
        this._crossFade.dispose();
        this._crossFadeLFO.dispose();
        this._feedbackDelay.dispose();
        return this;
    }
}
function createShift1234() {
    return new PitchShift();
}
class WaveShaper extends SignalOperator {
    constructor() {
        const options = optionsFromArguments(WaveShaper.getDefaults(), arguments, ["mapping", "length"]);
        super(options);
        this.name = "WaveShaper";
        this._shaper = this.context.createWaveShaper();
        this.input = this._shaper;
        this.baseOutputNode = this._shaper;
        if (isArray(options.mapping) ||
            options.mapping instanceof Float32Array) {
            this.curve = Float32Array.from(options.mapping);
        }
        else if (isFunction(options.mapping)) {
            this.setMap(options.mapping, options.length);
        }
    }
    static getDefaults() {
        return Object.assign(Signal.getDefaults(), {
            length: 1024,
        });
    }
    setMap(mapping, length = 1024) {
        const array = new Float32Array(length);
        for (let i = 0, len = length; i < len; i++) {
            const normalized = (i / (len - 1)) * 2 - 1;
            array[i] = mapping(normalized, i);
        }
        this.curve = array;
        return this;
    }
    get curve() {
        return this._shaper.curve;
    }
    set curve(mapping) {
        if (mapping) {
            let farr = new Float32Array(mapping);
            this._shaper.curve = farr;
        }
        else {
            this._shaper.curve = null;
        }
    }
    get oversample() {
        return this._shaper.oversample;
    }
    set oversample(oversampling) {
        const isOverSampleType = ["none", "2x", "4x"].some((str) => str.includes(oversampling));
        assert(isOverSampleType, "oversampling must be either 'none', '2x', or '4x'");
        this._shaper.oversample = oversampling;
    }
    dispose() {
        super.dispose();
        this._shaper.disconnect();
        return this;
    }
}
console.log('PureWebAudioShift v1');
class Oscillator2 {
    constructor(ac) {
        this.audioContext = ac;
        this.detune = new Signal2(ac);
        this.output = ac.createGain();
    }
    start(when) {
        this._oscillator = new OscillatorNode(this.audioContext);
        this._oscillator.connect(this.output);
        this._oscillator.frequency.setValueAtTime(440, 0);
        this.detune.output.connect(this._oscillator.detune);
        this._oscillator.start(when);
    }
}
class Add2 {
    constructor(ac) {
        this._sum = ac.createGain();
        this.param = this.constsource.offset;
        this.input = this._sum;
        this.output = this._sum;
        this.constsource = ac.createConstantSource();
        this.constsource.connect(this._sum);
    }
}
class Multiply2 {
    constructor(ac) {
        this._mult = ac.createGain();
        this.input = this._mult;
        this.output = this._mult;
        this.constsource = ac.createConstantSource();
        this.factor = this.constsource.offset;
        this.constsource.connect(this._mult);
    }
}
class Scale2 {
    constructor(ac) {
        this.input = new Multiply2(ac);
        this.output = new Add2(ac);
        this.input.output.connect(this.output.input);
    }
}
class LFO2 {
    constructor(ac) {
        this._oscillator = new Oscillator2(ac);
        this.frequency = new Signal2(ac);
        this._amplitudeGain = new Gain2(ac);
        this._stoppedSignal = new Signal2(ac);
        this._a2g = new AudioToGain2(ac);
        this.output = this._scaler;
        this.amplitude = this._amplitudeGain.gain;
        this.frequency = this._oscillator.frequency;
    }
    connectToDelay(delay) {
    }
    connectToCrossFade(crossFade) {
    }
    start(when) {
    }
}
class Gain2 {
    constructor(ac) {
        this._gainNode = ac.createGain();
        this.gain = this._gainNode.gain;
        this.input = this._gainNode;
        this.output = this._gainNode;
    }
    connectToDelay(delay) {
    }
}
class Signal2 {
    constructor(ac) {
        this.value = 0;
        this._constantSource = ac.createConstantSource();
        this.output = this._constantSource;
        this._param = this._constantSource.offset;
        this.input = this._param;
    }
    connectToSignal(destination) {
        destination.input.cancelScheduledValues(0);
        destination.input.setValueAtTime(0, 0);
        this.output.connect(destination.input);
    }
}
class Delay2 {
    constructor(ac) {
        this._delayNode = ac.createDelay(1);
        this.delayTime = this._delayNode.delayTime;
        this.input = this._delayNode;
        this.output = this._delayNode;
    }
    connectToCrossFade(crossFade) {
    }
    connectToGain(gain) {
    }
}
class WaveShaper2 {
    constructor(ac) {
        this._shaper = ac.createWaveShaper();
    }
    setCurve(mapping) {
        if (mapping) {
            this._shaper.curve = mapping;
        }
    }
}
class AudioToGain2 {
    constructor(ac) {
        this._norm = new WaveShaper2(ac);
        let curveLen = 1024;
        const array = new Float32Array(curveLen);
        for (let i = 0; i < curveLen; i++) {
            const normalized = (i / (curveLen - 1)) * 2 - 1;
            array[i] = this.curveFn(normalized);
        }
        this._norm.setCurve(array);
    }
    curveFn(value, index) {
        return (value + 1) / 2;
    }
}
class GainToAudio2 {
    constructor(ac) {
        this._norm = new WaveShaper2(ac);
        let curveLen = 1024;
        const array = new Float32Array(curveLen);
        for (let i = 0; i < curveLen; i++) {
            const normalized = (i / (curveLen - 1)) * 2 - 1;
            array[i] = this.curveFn(normalized);
        }
        this._norm.setCurve(array);
    }
    curveFn(value, index) {
        return Math.abs(value) * 2 - 1;
    }
}
class CrossFade2 {
    constructor(ac) {
        this._panner = ac.createStereoPanner();
        this._split = ac.createChannelSplitter(2);
        this._g2a = new GainToAudio2(ac);
    }
    connectToDelay(delay) {
    }
    connectToGain(gain) {
    }
}
class Effect2 {
    constructor(ac) {
    }
}
class FeedbackEffect2 extends Effect2 {
    constructor(ac) {
        super(ac);
    }
}
class PitchShift2 extends FeedbackEffect2 {
    shiftFrom(node) {
        node.connect(this.inputNode);
    }
    shiftTo(node) {
        this.outputNode.connect(node);
    }
    connectToGain(gain) {
    }
    constructor(ac) {
        super(ac);
        this._frequency = new Signal2(ac);
        this._delayA = new Delay2(ac);
        this._lfoA = new LFO2(ac);
        this._delayB = new Delay2(ac);
        this._lfoB = new LFO2(ac);
        this._crossFade = new CrossFade2(ac);
        this._crossFadeLFO = new LFO2(ac);
        this._feedbackDelay = new Delay2(ac);
        this._lfoA.connectToDelay(this._delayA);
        this._lfoB.connectToDelay(this._delayB);
        this._crossFadeLFO.connectToCrossFade(this._crossFade);
        this._windowSampleSize = 0.1;
        this._delayA.connectToCrossFade(this._crossFade);
        this._delayB.connectToCrossFade(this._crossFade);
        this._frequency.connectToSignal(this._lfoA.frequency);
        this._frequency.connectToSignal(this._lfoB.frequency);
        this._frequency.connectToSignal(this._crossFadeLFO.frequency);
        this.effectSend.connectToDelay(this._delayA);
        this.effectSend.connectToDelay(this._delayB);
        this._crossFade.connectToDelay(this._feedbackDelay);
        this._feedbackDelay.connectToGain(this.effectReturn);
        let when = ac.currentTime + 0.1;
        this._lfoA.start(when);
        this._lfoB.start(when);
        this._crossFadeLFO.start(when);
    }
    setupPitch(interval) {
        let factor = 0;
        if (interval < 0) {
            this._lfoA.min = 0;
            this._lfoA.max = this._windowSampleSize;
            this._lfoB.min = 0;
            this._lfoB.max = this._windowSampleSize;
            factor = intervalToFrequencyRatio(interval - 1) + 1;
        }
        else {
            this._lfoA.min = this._windowSampleSize;
            this._lfoA.max = 0;
            this._lfoB.min = this._windowSampleSize;
            this._lfoB.max = 0;
            factor = intervalToFrequencyRatio(interval) - 1;
        }
        this._frequency.value = factor * (1.2 / this._windowSampleSize);
    }
    dispose() {
        return this;
    }
}
function createShift2(ac) {
    let sh = new PitchShift2(ac);
    console.log('created2', sh);
    return sh;
}
function createShift() {
    let sh = new PitchShift();
    console.log('created', sh);
    return sh;
}
let cuCo = null;
let o1 = null;
function doTest2() {
    console.log('doTest2');
    if (cuCo) {
    }
    else {
        cuCo = new AudioContext();
        o1 = new Oscillator2(cuCo);
        o1.output.connect(cuCo.destination);
    }
    if (cuCo) {
        if (o1) {
            o1.start(cuCo.currentTime + 0.1);
        }
    }
}
//# sourceMappingURL=purevashift.js.map