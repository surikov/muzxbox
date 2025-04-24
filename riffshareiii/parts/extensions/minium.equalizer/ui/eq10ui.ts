let band32 = document.getElementById('band32') as any;
let band64 = document.getElementById('band64') as any;
let band128 = document.getElementById('band128') as any;
let band256 = document.getElementById('band256') as any;
let band512 = document.getElementById('band512') as any;
let band1k = document.getElementById('band1k') as any;
let band2k = document.getElementById('band2k') as any;
let band4k = document.getElementById('band4k') as any;
let band8k = document.getElementById('band8k') as any;
let band16k = document.getElementById('band16k') as any;
let label32 = document.getElementById('label32') as any;
let label64 = document.getElementById('label64') as any;
let label128 = document.getElementById('label128') as any;
let label256 = document.getElementById('label256') as any;
let label512 = document.getElementById('label512') as any;
let label1k = document.getElementById('label1k') as any;
let label2k = document.getElementById('label2k') as any;
let label4k = document.getElementById('label4k') as any;
let label8k = document.getElementById('label8k') as any;
let label16k = document.getElementById('label16k') as any;
function initEQUI() {
	let bridge: EQBridge = new EQBridge(() => {
		updateStateUI(bridge);
	});
	band32.addEventListener('change', (event) => { bridge.eqstate[0] = 1 * band32.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band64.addEventListener('change', (event) => { bridge.eqstate[1] = 1 * band64.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band128.addEventListener('change', (event) => { bridge.eqstate[2] = 1 * band128.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band256.addEventListener('change', (event) => { bridge.eqstate[3] = 1 * band256.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band512.addEventListener('change', (event) => { bridge.eqstate[4] = 1 * band512.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band1k.addEventListener('change', (event) => { bridge.eqstate[5] = 1 * band1k.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band2k.addEventListener('change', (event) => { bridge.eqstate[6] = 1 * band2k.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band4k.addEventListener('change', (event) => { bridge.eqstate[7] = 1 * band4k.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band8k.addEventListener('change', (event) => { bridge.eqstate[8] = 1 * band8k.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
	band16k.addEventListener('change', (event) => { bridge.eqstate[9] = 1 * band16k.value; bridge.sendMessageToHost(JSON.stringify(bridge.eqstate)); updateStateUI(bridge); });
}
function updateStateUI(bridge: EQBridge) {
	label32.innerHTML = '' + bridge.eqstate[0];
	label64.innerHTML = '' + bridge.eqstate[1];
	label128.innerHTML = '' + bridge.eqstate[2];
	label256.innerHTML = '' + bridge.eqstate[3];
	label512.innerHTML = '' + bridge.eqstate[4];
	label1k.innerHTML = '' + bridge.eqstate[5];
	label2k.innerHTML = '' + bridge.eqstate[6];
	label4k.innerHTML = '' + bridge.eqstate[7];
	label8k.innerHTML = '' + bridge.eqstate[8];
	label16k.innerHTML = '' + bridge.eqstate[9];
	band32.value = bridge.eqstate[0];
	band64.value = bridge.eqstate[1];
	band128.value = bridge.eqstate[2];
	band256.value = bridge.eqstate[3];
	band512.value = bridge.eqstate[4];
	band1k.value = bridge.eqstate[5];
	band2k.value = bridge.eqstate[6];
	band4k.value = bridge.eqstate[7];
	band8k.value = bridge.eqstate[8];
	band16k.value = bridge.eqstate[9];
}
function parseState(bridge: EQBridge, parameters: string) {
	try {
		let arr = JSON.parse(parameters);
		for (let ii = 0; ii < 10; ii++) {
			bridge.eqstate[ii] = (arr[ii]) ? (1 * arr[ii]) : 0;
		}
	} catch (xx) {
		console.log(xx);
	}
}
