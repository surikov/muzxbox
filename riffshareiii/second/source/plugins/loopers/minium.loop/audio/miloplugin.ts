console.log('Fader v1.0');
class MiniumLoopPlugin implements MZXBX_ActivePatternPlugin {
	launch(parameters: string, base: Zvoog_Project): Zvoog_Project {
		let tt: Zvoog_Project = {
			versionCode: '1'
			, title: ''
			, timeline: []
			, tracks: []
			, farorder: []
			, percussions: []
			, comments: []
			, filters: []
			, patterns: []
			, selectedPart: { startMeasure: -1, endMeasure: -1 }
			, position: { x: 0, y: 0, z: 0 }
			, list: false
			, menuPerformers: false
			, menuSamplers: false
			, menuFilters: false
			, menuActions: false
			, menuPlugins: false
			, menuClipboard: false
			, menuSettings: false
		};
		this.fillProject(base,tt);
		return tt;
	}
	fillProject(from: Zvoog_Project,to: Zvoog_Project){
console.log('fillProject');
	}
}
function newMiniumLoopPlugin(): MZXBX_ActivePatternPlugin {
	return new MiniumLoopPlugin();
}
