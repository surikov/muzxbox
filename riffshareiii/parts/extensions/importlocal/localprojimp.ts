class LocalProjectImport {
	id = '';
	parsedProject: Zvoog_Project | null = null;
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		let msg: MZXBX_MessageToHost = {
			dialogID: ''
			, pluginData: null
			, done: false
			, screenWait: false
		}
		window.parent.postMessage(msg, '*');
	}
	loadLocalFile(inputFile) {
		var file = inputFile.files[0];
		var fileReader = new FileReader();
		let me = this;
		fileReader.onload = function (progressEvent: any) {
			if (progressEvent != null) {
				console.log('loadLocalFile', progressEvent);
				me.parsedProject = JSON.parse(progressEvent.target.result);
			}
		}
		fileReader.readAsText(file);
	}
	sendLoadedData() {
		if (this.parsedProject) {
			var oo: MZXBX_MessageToHost = { dialogID: this.id, pluginData: this.parsedProject, screenWait: false, done: true };
			window.parent.postMessage(oo, '*');
		}
	}
	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.id) {
			//
		} else {
			this.id = message.hostData;
			this.setupLangColors(message);
		}
	}
	setupLangColors(message: MZXBX_MessageToPlugin) {
		/*colors: {
		background: string// #101;
		, main: string//#9cf;
		, drag: string//#03f;
		, line: string//#ffc;
		, click: string// #c39;
	}) {*/
		//console.log('setipColors', colors.background, window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'));
		document.documentElement.style.setProperty('--background-color', message.colors.background);
		document.documentElement.style.setProperty('--main-color', message.colors.main);
		document.documentElement.style.setProperty('--drag-color', message.colors.drag);
		document.documentElement.style.setProperty('--line-color', message.colors.line);
		document.documentElement.style.setProperty('--click-color', message.colors.click);
		if (message.langID == 'ru') {
			(document.getElementById('title') as any).innerHTML = 'Загрузить локальный проект';
		} else {
			if (message.langID == 'zh') {
				(document.getElementById('title') as any).innerHTML = '从本地存储导入项目';
			} else {
				(document.getElementById('title') as any).innerHTML = 'Import project from local storage';
			}
		}

	}
}
