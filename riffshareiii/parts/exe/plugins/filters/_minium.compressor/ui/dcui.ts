function initCompressorUI() {
	let level = document.getElementById('level') as any;
	let numval = document.getElementById('numval') as any;
	let bridge: CompressorBridge = new CompressorBridge(() => {
		numval.innerHTML = bridge.data;
		level.value = bridge.data;
	});
	level.addEventListener('change', (event) => {
		numval.innerHTML = level.value;
		bridge.sendMessageToHost(level.value);
	});
}
