function initEQUI() {
	let volume = document.getElementById('volume') as any;
	let numval = document.getElementById('numval') as any;
	let bridge: EQBridge = new EQBridge(() => {
		numval.innerHTML = bridge.data;
		volume.value = bridge.data;
	});
	volume.addEventListener('change', (event) => {
		numval.innerHTML = volume.value;
		bridge.sendMessageToHost(volume.value);
	});
}
