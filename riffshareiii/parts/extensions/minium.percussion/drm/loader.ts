class PercussionWebAudioFontLoader {
	cached: PercussionCachedPreset[] = [];
	drumNamesArray: string[] = [];
	drumKeyArray: string[] = [];
	constructor() {
		//
	}
	startLoad(audioContext: AudioContext, filePath: string, variableName: string) {
		if (window[variableName]) {
			return;
		}
		for (var i = 0; i < this.cached.length; i++) {
			if (this.cached[i].variableName == variableName) {
				return;
			}
		}
		this.cached.push({
			filePath: filePath,
			variableName: variableName
		});
		var r: HTMLScriptElement = document.createElement('script');
		r.setAttribute("type", "text/javascript");
		r.setAttribute("src", filePath);
		document.getElementsByTagName("head")[0].appendChild(r);
		this.decodeAfterLoading(audioContext, variableName);
	};
	adjustPreset(audioContext: AudioContext, preset: PercussionWavePreset) {
		//console.log('adjustPreset',preset);
		for (var i = 0; i < preset.zones.length; i++) {
			this.adjustZone(audioContext, preset.zones[i]);
		}
	}
	adjustZone(audioContext: AudioContext, zone: PercussionWaveZone) {
		if (zone.buffer) {
			//
		} else {
			//zone.delay = 0;
			if (zone.sample) {
				var decoded = atob(zone.sample);
				zone.buffer = audioContext.createBuffer(1, decoded.length / 2, zone.sampleRate);
				var float32Array = zone.buffer.getChannelData(0);
				var b1,
					b2,
					n;
				for (var i = 0; i < decoded.length / 2; i++) {
					b1 = decoded.charCodeAt(i * 2);
					b2 = decoded.charCodeAt(i * 2 + 1);
					if (b1 < 0) {
						b1 = 256 + b1;
					}
					if (b2 < 0) {
						b2 = 256 + b2;
					}
					n = b2 * 256 + b1;
					if (n >= 65536 / 2) {
						n = n - 65536;
					}
					float32Array[i] = n / 65536.0;
				}
			} else {
				if (zone.file) {
					var datalen = zone.file.length;
					var arraybuffer = new ArrayBuffer(datalen);
					var view = new Uint8Array(arraybuffer);
					var decoded = atob(zone.file);
					var b;
					for (var i = 0; i < decoded.length; i++) {
						b = decoded.charCodeAt(i);
						view[i] = b;
					}
					audioContext.decodeAudioData(arraybuffer, function (audioBuffer) {
						zone.buffer = audioBuffer;
					});
				}
			}
			zone.loopStart = this.numValue(zone.loopStart, 0);
			zone.loopEnd = this.numValue(zone.loopEnd, 0);
			zone.coarseTune = this.numValue(zone.coarseTune, 0);
			zone.fineTune = this.numValue(zone.fineTune, 0);
			zone.originalPitch = this.numValue(zone.originalPitch, 6000);
			zone.sampleRate = this.numValue(zone.sampleRate, 44100);
			//zone.sustain = this.numValue(zone.originalPitch, 0);
		}
	};
	numValue(aValue: any, defValue: number): number {
		if (typeof aValue === "number") {
			return aValue;
		} else {
			return defValue;
		}
	};
	decodeAfterLoading(audioContext: AudioContext, variableName: string) {
		//console.log('decodeAfterLoading',variableName);
		var me = this;
		this.waitOrFinish(variableName, function () {
			me.adjustPreset(audioContext, (window[variableName] as any) as PercussionWavePreset);
		});
	};
	waitOrFinish(variableName: string, onFinish: () => void) {
		if (window[variableName]) {
			onFinish();
		} else {
			var me = this;
			setTimeout(function () {
				me.waitOrFinish(variableName, onFinish);
			}, 111);
		}
	};
	loaded(variableName: string): boolean {
		//console.log('loaded', variableName);
		if (!(window[variableName])) {
			return false;
		}
		var preset: PercussionWavePreset = (window[variableName] as any) as PercussionWavePreset;
		for (var i = 0; i < preset.zones.length; i++) {
			//console.log('zone', preset.zones[i].buffer);
			if (!(preset.zones[i].buffer)) {
				return false;
			}
		}
		return true;
	};
	progress(): number {
		//console.log('progress', this.cached.length);
		if (this.cached.length > 0) {
			for (var k = 0; k < this.cached.length; k++) {
				if (!this.loaded(this.cached[k].variableName)) {
					return k / this.cached.length;
				}
			}
			return 1;
		} else {
			return 1;
		}
	};
	waitLoad(onFinish: () => void) {
		//console.log('waitLoad');
		var me = this;
		if (this.progress() >= 0) {
			onFinish();
		} else {
			setTimeout(function () {
				me.waitLoad(onFinish);
			}, 333);
		}
	};
	/*
	drumTitles(): string[] {
		if (this.drumNamesArray.length == 0) {
			var drumNames: string[] = [];
			drumNames[35] = "Bass Drum 2";
			drumNames[36] = "Bass Drum 1";
			drumNames[37] = "Side Stick/Rimshot";
			drumNames[38] = "Snare Drum 1";
			drumNames[39] = "Hand Clap";
			drumNames[40] = "Snare Drum 2";
			drumNames[41] = "Low Tom 2";
			drumNames[42] = "Closed Hi-hat";
			drumNames[43] = "Low Tom 1";
			drumNames[44] = "Pedal Hi-hat";
			drumNames[45] = "Mid Tom 2";
			drumNames[46] = "Open Hi-hat";
			drumNames[47] = "Mid Tom 1";
			drumNames[48] = "High Tom 2";
			drumNames[49] = "Crash Cymbal 1";
			drumNames[50] = "High Tom 1";
			drumNames[51] = "Ride Cymbal 1";
			drumNames[52] = "Chinese Cymbal";
			drumNames[53] = "Ride Bell";
			drumNames[54] = "Tambourine";
			drumNames[55] = "Splash Cymbal";
			drumNames[56] = "Cowbell";
			drumNames[57] = "Crash Cymbal 2";
			drumNames[58] = "Vibra Slap";
			drumNames[59] = "Ride Cymbal 2";
			drumNames[60] = "High Bongo";
			drumNames[61] = "Low Bongo";
			drumNames[62] = "Mute High Conga";
			drumNames[63] = "Open High Conga";
			drumNames[64] = "Low Conga";
			drumNames[65] = "High Timbale";
			drumNames[66] = "Low Timbale";
			drumNames[67] = "High Agogo";
			drumNames[68] = "Low Agogo";
			drumNames[69] = "Cabasa";
			drumNames[70] = "Maracas";
			drumNames[71] = "Short Whistle";
			drumNames[72] = "Long Whistle";
			drumNames[73] = "Short Guiro";
			drumNames[74] = "Long Guiro";
			drumNames[75] = "Claves";
			drumNames[76] = "High Wood Block";
			drumNames[77] = "Low Wood Block";
			drumNames[78] = "Mute Cuica";
			drumNames[79] = "Open Cuica";
			drumNames[80] = "Mute Triangle";
			drumNames[81] = "Open Triangle";
			this.drumNamesArray = drumNames;
		}
		return this.drumNamesArray;
	};
	*/
	/*
	drumKeys(): string[] {
		if (this.drumKeyArray.length == 0) {
			this.drumKeyArray = [
				//'35_0_SBLive_sf2'
				'35_0_Chaos_sf2_file', '35_12_JCLive_sf2_file', '35_16_JCLive_sf2_file', '35_18_JCLive_sf2_file', '35_4_Chaos_sf2_file'
				, '36_0_SBLive_sf2', '36_12_JCLive_sf2_file', '36_16_JCLive_sf2_file', '36_18_JCLive_sf2_file', '36_4_Chaos_sf2_file'
				, '37_0_SBLive_sf2', '37_12_JCLive_sf2_file', '37_16_JCLive_sf2_file', '37_18_JCLive_sf2_file', '37_4_Chaos_sf2_file'
				, '38_16_JCLive_sf2_file', '38_0_SBLive_sf2', '38_12_JCLive_sf2_file', '38_18_JCLive_sf2_file', '38_4_Chaos_sf2_file'
				, '39_0_SBLive_sf2', '39_12_JCLive_sf2_file', '39_16_JCLive_sf2_file', '39_18_JCLive_sf2_file', '39_4_Chaos_sf2_file'
				, '40_18_JCLive_sf2_file', '40_0_SBLive_sf2', '40_12_JCLive_sf2_file', '40_16_JCLive_sf2_file', '40_4_Chaos_sf2_file'
				, '41_0_SBLive_sf2', '41_12_JCLive_sf2_file', '41_16_JCLive_sf2_file', '41_18_JCLive_sf2_file', '41_4_Chaos_sf2_file'
				, '42_0_SBLive_sf2', '42_12_JCLive_sf2_file', '42_16_JCLive_sf2_file', '42_18_JCLive_sf2_file', '42_4_Chaos_sf2_file'
				, '43_0_SBLive_sf2', '43_12_JCLive_sf2_file', '43_16_JCLive_sf2_file', '43_18_JCLive_sf2_file', '43_4_Chaos_sf2_file'
				, '44_0_SBLive_sf2', '44_12_JCLive_sf2_file', '44_16_JCLive_sf2_file', '44_18_JCLive_sf2_file', '44_4_Chaos_sf2_file'
				, '45_0_SBLive_sf2', '45_12_JCLive_sf2_file', '45_16_JCLive_sf2_file', '45_18_JCLive_sf2_file', '45_4_Chaos_sf2_file'
				, '46_0_SBLive_sf2', '46_12_JCLive_sf2_file', '46_16_JCLive_sf2_file', '46_18_JCLive_sf2_file', '46_4_Chaos_sf2_file'
				, '47_0_SBLive_sf2', '47_12_JCLive_sf2_file', '47_16_JCLive_sf2_file', '47_18_JCLive_sf2_file', '47_4_Chaos_sf2_file'
				, '48_0_SBLive_sf2', '48_12_JCLive_sf2_file', '48_16_JCLive_sf2_file', '48_18_JCLive_sf2_file', '48_4_Chaos_sf2_file'
				, '49_4_Chaos_sf2_file', '49_0_SBLive_sf2', '49_12_JCLive_sf2_file', '49_16_JCLive_sf2_file', '49_18_JCLive_sf2_file'
				, '50_0_SBLive_sf2', '50_12_JCLive_sf2_file', '50_16_JCLive_sf2_file', '50_18_JCLive_sf2_file', '50_4_Chaos_sf2_file'
				, '51_0_SBLive_sf2', '51_12_JCLive_sf2_file', '51_16_JCLive_sf2_file', '51_18_JCLive_sf2_file', '51_4_Chaos_sf2_file'
				, '52_0_SBLive_sf2', '52_12_JCLive_sf2_file', '52_16_JCLive_sf2_file', '52_18_JCLive_sf2_file', '52_4_Chaos_sf2_file'
				, '53_0_SBLive_sf2', '53_12_JCLive_sf2_file', '53_16_JCLive_sf2_file', '53_18_JCLive_sf2_file', '53_4_Chaos_sf2_file'
				, '54_0_SBLive_sf2', '54_12_JCLive_sf2_file', '54_16_JCLive_sf2_file', '54_18_JCLive_sf2_file', '54_4_Chaos_sf2_file'
				, '55_0_SBLive_sf2', '55_12_JCLive_sf2_file', '55_16_JCLive_sf2_file', '55_18_JCLive_sf2_file', '55_4_Chaos_sf2_file'
				, '56_0_SBLive_sf2', '56_12_JCLive_sf2_file', '56_16_JCLive_sf2_file', '56_18_JCLive_sf2_file', '56_4_Chaos_sf2_file'
				, '57_4_Chaos_sf2_file', '57_0_SBLive_sf2', '57_12_JCLive_sf2_file', '57_16_JCLive_sf2_file', '57_18_JCLive_sf2_file'
				, '58_0_SBLive_sf2', '58_12_JCLive_sf2_file', '58_16_JCLive_sf2_file', '58_18_JCLive_sf2_file', '58_4_Chaos_sf2_file'
				, '59_0_SBLive_sf2', '59_12_JCLive_sf2_file', '59_16_JCLive_sf2_file', '59_18_JCLive_sf2_file', '59_4_Chaos_sf2_file'
				, '60_0_SBLive_sf2', '60_12_JCLive_sf2_file', '60_16_JCLive_sf2_file', '60_18_JCLive_sf2_file', '60_4_Chaos_sf2_file'
				, '61_0_SBLive_sf2', '61_12_JCLive_sf2_file', '61_16_JCLive_sf2_file', '61_18_JCLive_sf2_file', '61_4_Chaos_sf2_file'
				, '62_0_SBLive_sf2', '62_12_JCLive_sf2_file', '62_16_JCLive_sf2_file', '62_18_JCLive_sf2_file', '62_4_Chaos_sf2_file'
				, '63_0_SBLive_sf2', '63_12_JCLive_sf2_file', '63_16_JCLive_sf2_file', '63_18_JCLive_sf2_file', '63_4_Chaos_sf2_file'
				, '64_0_SBLive_sf2', '64_12_JCLive_sf2_file', '64_16_JCLive_sf2_file', '64_18_JCLive_sf2_file', '64_4_Chaos_sf2_file'
				, '65_0_SBLive_sf2', '65_12_JCLive_sf2_file', '65_16_JCLive_sf2_file', '65_18_JCLive_sf2_file', '65_4_Chaos_sf2_file'
				, '66_0_SBLive_sf2', '66_12_JCLive_sf2_file', '66_16_JCLive_sf2_file', '66_18_JCLive_sf2_file', '66_4_Chaos_sf2_file'
				, '67_0_SBLive_sf2', '67_12_JCLive_sf2_file', '67_16_JCLive_sf2_file', '67_18_JCLive_sf2_file', '67_4_Chaos_sf2_file'
				, '68_0_SBLive_sf2', '68_12_JCLive_sf2_file', '68_16_JCLive_sf2_file', '68_18_JCLive_sf2_file', '68_4_Chaos_sf2_file'
				, '69_0_SBLive_sf2', '69_12_JCLive_sf2_file', '69_16_JCLive_sf2_file', '69_18_JCLive_sf2_file', '69_4_Chaos_sf2_file'
				, '70_0_SBLive_sf2', '70_12_JCLive_sf2_file', '70_16_JCLive_sf2_file', '70_18_JCLive_sf2_file', '70_4_Chaos_sf2_file'
				, '71_0_SBLive_sf2', '71_12_JCLive_sf2_file', '71_16_JCLive_sf2_file', '71_18_JCLive_sf2_file', '71_4_Chaos_sf2_file'
				, '72_0_SBLive_sf2', '72_12_JCLive_sf2_file', '72_16_JCLive_sf2_file', '72_18_JCLive_sf2_file', '72_4_Chaos_sf2_file'
				, '73_0_SBLive_sf2', '73_12_JCLive_sf2_file', '73_16_JCLive_sf2_file', '73_18_JCLive_sf2_file', '73_4_Chaos_sf2_file'
				, '74_0_SBLive_sf2', '74_12_JCLive_sf2_file', '74_16_JCLive_sf2_file', '74_18_JCLive_sf2_file', '74_4_Chaos_sf2_file'
				, '75_0_SBLive_sf2', '75_12_JCLive_sf2_file', '75_16_JCLive_sf2_file', '75_18_JCLive_sf2_file', '75_4_Chaos_sf2_file'
				, '76_0_SBLive_sf2', '76_12_JCLive_sf2_file', '76_16_JCLive_sf2_file', '76_18_JCLive_sf2_file', '76_4_Chaos_sf2_file'
				, '77_0_SBLive_sf2', '77_12_JCLive_sf2_file', '77_16_JCLive_sf2_file', '77_18_JCLive_sf2_file', '77_4_Chaos_sf2_file'
				, '78_0_SBLive_sf2', '78_12_JCLive_sf2_file'
				, '78_16_JCLive_sf2_file', '78_18_JCLive_sf2_file', '78_4_Chaos_sf2_file'
				, '79_0_SBLive_sf2', '79_12_JCLive_sf2_file', '79_16_JCLive_sf2_file', '79_18_JCLive_sf2_file', '79_4_Chaos_sf2_file'
				, '80_0_SBLive_sf2', '80_12_JCLive_sf2_file', '80_16_JCLive_sf2_file', '80_18_JCLive_sf2_file', '80_4_Chaos_sf2_file'
				, '81_0_SBLive_sf2', '81_12_JCLive_sf2_file', '81_16_JCLive_sf2_file', '81_18_JCLive_sf2_file', '81_4_Chaos_sf2_file'

			];
		}
		return this.drumKeyArray;
	};*/
	drumInfo(n: number): PercussionPresetInfo {
		var key = drumKeysArrayPercussionPaths[n];
		var p = 1 * parseInt(key.substring(0, 2));
		return {
			variable: '_drum_' + key,
			url: 'https://surikov.github.io/webaudiofontdata/sound/128' + key + '.js',
			pitch: p,
			title: allPercussionDrumTitles()[p]
		};
	};
	findDrum(midinu: number): number {//35-81
		for (var i = 0; i < drumKeysArrayPercussionPaths.length; i++) {
			if (midinu == 1 * parseInt(drumKeysArrayPercussionPaths[i].substring(0, 2))) {
				return i;
			}
		}
		return 0;
	}
}