let synth: SynthDX7;
function initTester() {
	console.log('initTester');
	let audioContext = new window.AudioContext();
	synth = new SynthDX7(audioContext);
}
function testPlay() {
	console.log('testPlay');
	synth.test();
}
function testrate99Duration(r99: number) {
	/*
	var rate_scaling = 0;
	let qr = Math.min(63, rate_scaling + ((r99 * 41) >> 6)); // 5 -> 3; 49 -> 31; 99 -> 63
	let decayIncrement = Math.pow(2, qr / 4) / 2048;
	let duration = 0.16 / decayIncrement;
	*/
	//100 / (0.2819 * Math.pow(2, r99 * 0.16));
	/*var idx = Math.min(99, Math.max(0, Math.floor(r99)));
	let ratio = OUTPUT_LEVEL_TABLE[idx] * 1.27;
	if(ratio<1)ratio=1;
	duration = 0.099935203 / ratio;///2777.644516667;
	*/
	//console.log(r99, duration);
	let duration = 3 / Math.pow(2, 16 * r99 / 100 - 7);
	//duration=100/(0.2819*Math.pow(2,0.16*r99));
	return duration;
}
/*
Rate 0: ~10+ minutes (extremely slow)
Rate 20: ~43 seconds
Rate 50: ~0.15 seconds
Rate 74: ~0.0044 seconds (4.4 ms)
Rate 84: ~0.0046 seconds (4.6 ms)
Rate 99: ~0.006 seconds (6 ms) 

Rate Setting 	Approximate Time (Rising Segment)	Approximate Time (Falling Segment)
00	~90 seconds	~210 seconds (3.5 mins)
50	~1 - 2 seconds	~2 - 4 seconds
75	~0.1 seconds (100ms)	~0.2 seconds
99	Instantaneous (< 2ms)	Instantaneous (< 2ms)
Note: Falling segments generally take significantly longer than rising segments at the same rate setting
*/
console.log(0, testrate99Duration(0));
console.log(20, testrate99Duration(20));
console.log(50, testrate99Duration(50));
console.log(74, testrate99Duration(74));
console.log(84, testrate99Duration(84));
console.log(99, testrate99Duration(99));