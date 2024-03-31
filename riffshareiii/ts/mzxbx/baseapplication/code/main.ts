console.log("MuzXbox v1.0.2");
declare let testSchedule: MZXBX_Schedule;
class MuzXbox {
	uiStarted: boolean = false;
	audioContext: AudioContext;
	player: SchedulePlayer;
	setupDone: boolean;
	currentDuration = 0;
	songslide: HTMLInputElement | null = null;
	constructor() {
		this.initAfterLoad();
	}
	initAfterLoad() {
		console.log("MuzXbox loaded");
	}
	initFromUI() {
		if (this.uiStarted) {
			console.log("skip initFromUI");
		} else {
			console.log("start initFromUI");
			this.initAudioContext();
			/*let filesinput: HTMLElement | null = document.getElementById('filesinput');
			if (filesinput) {
				let listener: (this: HTMLElement, event: HTMLElementEventMap['change']) => any = function (this: HTMLElement, ievent: HTMLElementEventMap['change']) {
					//console.log('event',event);
					var file = (ievent as any).target.files[0];
					//console.log(file);
					var fileReader = new FileReader();
					fileReader.onload = function (progressEvent: any) {
						//console.log('progressEvent',progressEvent);
						if (progressEvent != null) {
							var arrayBuffer = progressEvent.target.result;
							//console.log(arrayBuffer);
							var midiParser = new MidiParser(arrayBuffer);
							//testSchedule = midiParser.dump();
							//console.log('MZXBX_Schedule', testSchedule);
						}
					};
					fileReader.readAsArrayBuffer(file);
				};
				filesinput.addEventListener('change', listener, false);
			}*/
			//console.log('filesinput',filesinput);
			this.songslide = document.getElementById('songslide') as HTMLInputElement;
			if (this.songslide) {
				let me = this;
				this.updateSongSlider();
				this.songslide.onchange = function (changeEvent: Event) {
					if (me.songslide) {
						console.log('changeEvent', changeEvent, me.songslide.value);
						me.updatePosition(parseFloat(me.songslide.value));
					}
				};
			}
		}
	}
	updatePosition(pp:number){
		if (this.player) {
			if (this.player.onAir) {
				this.player.position=(pp*this.currentDuration)/100;

			}
		}
	}
	updateSongSlider() {

		let me = this;
		setTimeout(function () {
			//console.log('updateSongSlider');
			me.setSongSlider();
			me.updateSongSlider();
		}, 999);
	}
	setSongSlider() {
		if (this.player) {
			if (this.player.onAir) {
				if (this.songslide) {
					//console.log('setSongSlider', this.player.position,this.songslide);
					//console.dir(this.songslide);
					let newValue = Math.floor(100 * this.player.position / this.currentDuration);

					this.songslide.value = '' + newValue;
				}
			}
		}
	}
	initAudioContext() {
		let AudioContextFunc = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new AudioContextFunc();
		console.log(this.audioContext);
		if (this.audioContext.state == "running") {
			this.uiStarted = true;
		} else {
			console.log('AudioContext state is ', this.audioContext.state);
		}
	}
	resumeContext(audioContext: AudioContext) {
		try {
			if (audioContext.state == 'suspended') {
				console.log('audioContext.resume', audioContext);
				audioContext.resume();
			}
		} catch (e) {
			//don't care
		}
	}
	
}

