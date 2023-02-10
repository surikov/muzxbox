console.log("MuzXbox v1.0.2");
declare let testSchedule: MZXBX_Schedule;
class MuzXbox {
	uiStarted: boolean = false;
	audioContext: AudioContext;
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
	startTest() {
		console.log('start test');//,testSchedule);
		/*let url='./sabvaebv/vvv.f';
		appendScriptURL(url);
		console.log(scriptExistsInDocument(url));
		console.log(scriptExistsInDocument('url'));
		*/
		let player: SchedulePlayer = new SchedulePlayer();
		player.setup(this.audioContext, testSchedule);
		waitForCondition(500, () => player.stateSetupDone, () => {
			console.log('loaded');
			let duration=0;
			for(let ii=0;ii<testSchedule.series.length;ii++){
				duration=duration+testSchedule.series[ii].duration;
			}
			player.start(0,0,duration);
		});
		//player.filters.push({ plugin: null, id: 'test111', kind: 'volume_filter_1_test' });
		//player.filters.push({ plugin: null, id: 'test22', kind: 'volume_filter_1_test' });
		//player.filters.push({ plugin: null, id: 'test333', kind: 'echo_filter_1_test' });
		//player.startSetupPlugins();
	}
}

