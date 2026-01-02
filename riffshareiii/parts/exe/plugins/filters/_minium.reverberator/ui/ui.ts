function initEchoUI() {
	let volume = document.getElementById('level') as any;
	let numval = document.getElementById('numval') as any;
	let bridge: EchoBridge = new EchoBridge(() => {
		numval.innerHTML = bridge.data;
		volume.value = bridge.data;
	});
	volume.addEventListener('change', (event) => {
		numval.innerHTML = volume.value;
		bridge.sendMessageToHost(volume.value);
	});
}
