function initFaderUI() {
	let volume = document.getElementById('volume') as any;
	let numval = document.getElementById('numval') as any;
	let bridge: FaderBridge = new FaderBridge(() => {
		console.log('data',bridge.data);
		numval.innerHTML = bridge.data;
		volume.value = 1*parseInt(bridge.data);
	});
	volume.addEventListener('change', (event) => {
		numval.innerHTML = volume.value;
		bridge.sendMessageToHost(''+volume.value);
	});
}
