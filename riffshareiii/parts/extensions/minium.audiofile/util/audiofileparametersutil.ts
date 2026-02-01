class AudioFileParametersUrility {
    parse(parameters: string): { ratio: number, volume: number, url: string } {
        let result: { ratio: number, volume: number, url: string } = { ratio: 0, volume: 100, url: '' };
        try {
            let split = parameters.split(',');
            result.ratio = parseInt(split[0]);
            result.volume = parseInt(split[1]);
            result.url = split[2];
        } catch (xx) {
            console.log(xx);
        }
        if (result.ratio >= -100 && result.ratio <= 100) {
            //
        } else {
            result.ratio = 0;
        }
        if (result.volume >= 0 && result.ratio <= 100) {
            //
        } else {
            result.volume = 100;
        }
        result.url = (result.url) ? result.url : '';
        return result;
    }
    dump(ratio: number, volume: number, url: string): string {
        return '' + ratio + ',' + volume + ',' + url;
    }
	bufferName(ratio: number, url: string): string {
		return ratio + ',' + url;
	}
	startLoadFile(url: string, ratio: number,onDone:()=>void) {
		let xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", url, true);
		xmlHttpRequest.responseType = "arraybuffer";
		xmlHttpRequest.onload = (event) => {
			const arrayBuffer = xmlHttpRequest.response; // Note: not req.responseText
			if (arrayBuffer) {
				this.startDecodeBuffer(arrayBuffer, url, ratio,onDone);
			}
		};
		xmlHttpRequest.onerror = (proevent) => {
			console.log('onerror', proevent);
			console.log('xmlHttpRequest', xmlHttpRequest);
			//alert('Error ' + proevent);
		};
		try {
			xmlHttpRequest.send(null);
		} catch (xx) {
			console.log(xx);
			//alert('Error ' + xx);
		}
	}
	startDecodeBuffer(arrayBuffer: ArrayBuffer, path: string, ratio: number,onDone:()=>void) {
		let audioContext = new AudioContext();
		let me = this;
		audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
			window[new AudioFileParametersUrility().bufferName(ratio, path)] = audioBuffer;
			me.startTransposeAudioBuffer(path, ratio,onDone);
		});
	}
	startTransposeAudioBuffer(path: string, ratio: number,onDone:()=>void) {
		ratio = ratio ? ratio : 0;
		if (ratio) {
			let audioBuffer: AudioBuffer = window[new AudioFileParametersUrility().bufferName(ratio, path)];
			let data = new Float32Array(audioBuffer.length);
			audioBuffer.copyFromChannel(data, 0);
			let sampleRate = audioBuffer.sampleRate;
			let pitchShift = 0;
			if (ratio < 0) {
				pitchShift = 1 + ratio / 100 * 0.5;
			} else {
				pitchShift = 1 + ratio / 100 * 1;
			}
			let newData = resamplePitchShiftFloat32Array(pitchShift, data.length, 1024, 10, sampleRate, data);
			for (let ii = 0; ii < audioBuffer.numberOfChannels; ii++) {
				audioBuffer.copyToChannel(newData, ii);
			}
		} else {
			//
		}
		onDone();
	}
}
