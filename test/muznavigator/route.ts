let player = new FxPlayer();

function startLoadMP3(it) {
	console.log('startLoadMP3', it);
	let file: File = it.files[0];
	player.load(file);
}
function warnInit() {
	alert('Загрузите .mp3/.wav перед изменением звука');
}
function onPitchChange(it) {
	if (player.mp3sourceNode) {
		console.log('onPitchChange', it.value);
		player.pitchRatio = 1 * it.value;
		player.resetSource();
	} else {
		warnInit();
	}
}
function onCodmpressorLevel(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onCompressorThreshold(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onCompressorKnee(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onCompressorRatio(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onCompressorAttack(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onCompressorRelease(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onReverberatorChange(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerLevel(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerDelay(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerDepth(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerFeedback(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerSpeed(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq32(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq64(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq128(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq256(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq512(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq1k(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq2k(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq4k(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq8k(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq16k(it){
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}

