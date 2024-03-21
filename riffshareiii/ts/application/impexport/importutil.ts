class MusicDataImporter {
	/*loadedObjects: { url: string, obj: any }[]=[];
	takeCachedInfo(url: string): ({ url: string, obj: any }) {
		for (let ii = 0; ii < this.loadedObjects.length; ii++) {
			if (this.loadedObjects[ii].url == url) {
				return this.loadedObjects[ii];
			}
		}
		MZXBX_appendScriptURL(url);
		let newObj = { url: url, obj: null, evaluate: '' };
		this.loadedObjects.push(newObj);
		return newObj;
	}

	runPluginGUIImport(url: string, functionName: string, onDone: (loaded: any) => void) {
		console.log('runPluginGUIImport', url);
		let info: { url: string, obj: any } = this.takeCachedInfo(url);
		MZXBX_waitForCondition(250, () => { return (window[functionName]); }, () => {
			if (!(info.obj)) {
				let exe = window[functionName];
				info.obj = exe();
			}
			onDone(info.obj);
		});
	}*/
}
