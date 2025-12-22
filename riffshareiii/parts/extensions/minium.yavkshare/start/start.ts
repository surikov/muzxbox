
console.log('Share YAVK start v1.0.1');
//let parsedProject: Zvoog_Project | null = null;
class YAVKSharePlugin {
	callbackID = '';
	hostProject: Zvoog_Project | null = null;
	constructor() {
		this.setupMessaging();
	}
	setupMessaging() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		let msg: MZXBX_MessageToHost = {
			dialogID: this.callbackID
			, pluginData: null
			, done: false
			, screenWait: true
		};
		window.parent.postMessage(msg, '*');
	}

	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			//this.hostProject = message.hostData;
		} else {
			this.callbackID = message.hostData;
			this.setupColors(message.colors);
			this.selupLanguage(message.langID);
			//localStorage.setItem('yavkmsgid', this.callbackID);
		}
		if (message.screenData) {
			let sz = 500;
			let canvas = document.getElementById("prvw") as HTMLCanvasElement;
			if (canvas) {
				let context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
				var imageData: ImageData = context.getImageData(0, 0, sz, sz);
				imageData.data.set(message.screenData);
				context.putImageData(imageData, 0, 0);
				let lz = new LZUtil();
				let json = JSON.stringify(message.screenData);
				let data = lz.compressToUTF16(json);
				localStorage.setItem('yavkpreview', data);
			}
		}
	}
	selupLanguage(langID: string) {
		if (langID == 'ru') {
			(document.getElementById("butonStart") as any).textContent = 'Отправить';
		} else {
			if (langID == 'zh') {
				(document.getElementById("butonStart") as any).textContent = '分享';
			} else {
				(document.getElementById("butonStart") as any).textContent = 'Share';
			}
		}
	}
	setupColors(colors: {
		background: string// #101;
		, main: string//#9cf;
		, drag: string//#03f;
		, line: string//#ffc;
		, click: string// #c39;
	}) {
		document.documentElement.style.setProperty('--background-color', colors.background);
		document.documentElement.style.setProperty('--main-color', colors.main);
		document.documentElement.style.setProperty('--drag-color', colors.drag);
		document.documentElement.style.setProperty('--line-color', colors.line);
		document.documentElement.style.setProperty('--click-color', colors.click);
	}
	requestYaToken() {
		let redirect_uri = 'https://mzxbox.ru/minium/vkread.html';
		let client_id = 'ad8bb18784e44c64a2098ad6a342e576';
		let suggest_hostname = 'mzxbox.ru';
		let retpath = 'https://oauth.yandex.ru/authorize' +
			'?client_id=' + client_id +
			'&response_type=token' +
			'&redirect_uri=' + encodeURI(redirect_uri) +
			'&suggest_hostname=' + suggest_hostname;
		window.location.href = retpath;
	}
	startYAVKshare() {
		console.log('startYAVKshare');
		this.requestYaToken();
	}
}
