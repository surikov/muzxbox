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
		//player.pitchRatio = 1 * it.value;
		//player.resetSource();
		player.resetPitch(1 * it.value);
	} else {
		warnInit();
	}
}
function onCompressorLevel(it) {
	if (player.mp3sourceNode) {
		console.log('compressor', it.value);
		player.reverberator.compressorWet.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
		player.reverberator.compressorDry.gain.setTargetAtTime(1 - 1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onCompressorThreshold(it) {
	if (player.mp3sourceNode) {
		console.log('threshold', it.value);
		player.reverberator.compressor.threshold.setValueAtTime(1 * it.value, 0);
	} else {
		warnInit();
	}
}
function onCompressorKnee(it) {
	if (player.mp3sourceNode) {
		console.log('knee', it.value);
		player.reverberator.compressor.knee.setValueAtTime(1 * it.value, 0);
	} else {
		warnInit();
	}
}
function onCompressorRatio(it) {
	if (player.mp3sourceNode) {
		console.log('compressor ratio', it.value);
		player.reverberator.compressor.ratio.setValueAtTime(1 * it.value, 0);
	} else {
		warnInit();
	}
}
function onCompressorAttack(it) {
	if (player.mp3sourceNode) {
		console.log('attack', it.value);
		player.reverberator.compressor.attack.setValueAtTime(1 * it.value, 0);
	} else {
		warnInit();
	}
}
function onCompressorRelease(it) {
	if (player.mp3sourceNode) {
		console.log('release', it.value);
		player.reverberator.compressor.release.setValueAtTime(1 * it.value, 0);
	} else {
		warnInit();
	}
}
function onReverberatorChange(it) {
	if (player.mp3sourceNode) {
		console.log('echo', it.value);
		player.reverberator.wet.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onFlangerLevel(it) {
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerDelay(it) {
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerDepth(it) {
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerFeedback(it) {
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onFlangerSpeed(it) {
	if (player.mp3sourceNode) {
		console.log('on', it.value);

	} else {
		warnInit();
	}
}
function onEq32(it) {
	if (player.mp3sourceNode) {
		console.log('b32', it.value);
		player.channelMaster.band32.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq64(it) {
	if (player.mp3sourceNode) {
		console.log('b64', it.value);
		player.channelMaster.band64.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq128(it) {
	if (player.mp3sourceNode) {
		console.log('b128', it.value);
		player.channelMaster.band128.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq256(it) {
	if (player.mp3sourceNode) {
		console.log('b256', it.value);
		player.channelMaster.band256.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq512(it) {
	if (player.mp3sourceNode) {
		console.log('b512', it.value);
		player.channelMaster.band512.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq1k(it) {
	if (player.mp3sourceNode) {
		console.log('b1k', it.value);
		player.channelMaster.band1k.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq2k(it) {
	if (player.mp3sourceNode) {
		console.log('b2k', it.value);
		player.channelMaster.band2k.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq4k(it) {
	if (player.mp3sourceNode) {
		console.log('b4k', it.value);
		player.channelMaster.band4k.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq8k(it) {
	if (player.mp3sourceNode) {
		console.log('b8k', it.value);
		player.channelMaster.band8k.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}
function onEq16k(it) {
	if (player.mp3sourceNode) {
		console.log('b16k', it.value);
		player.channelMaster.band16k.gain.setTargetAtTime(1 * it.value, 0, 0.0001);
	} else {
		warnInit();
	}
}

