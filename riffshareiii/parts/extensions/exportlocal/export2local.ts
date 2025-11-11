
console.log('Export local v1.0.1');
//let parsedProject: Zvoog_Project | null = null;
class LocalExportPlugin {
	callbackID = '';
	hostProject: Zvoog_Project | null = null;
	/*constructor() {
		//console.log('LocalExportPlugin create');
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage('', '*');
	}*/
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		let msg: MZXBX_MessageToHost = {
			dialogID: this.callbackID
			, pluginData: null
			, done: false
			, sceenWait: true
		};
		window.parent.postMessage(msg, '*');
	}

	receiveHostMessage(par) {
		//console.log('receiveHostMessage', par);
		//callbackID = par.data;
		/*try {
			//console.log('parse', par.data.data);
			this.parsedProject = JSON.parse(par.data.data);
			//console.log('result', oo);
			this.callbackID = par.data.dialogID;
			//console.log('dialogID', this.callbackID);
		} catch (xx) {
			console.log(xx);
		}*/
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			this.hostProject = message.hostData;
		} else {
			this.callbackID = message.hostData;
			this.setupColors(message.colors);
		}
		if (message.screenData) {
			let sz = 500;
			//console.log(message.screenData);
			//let canvas: HTMLCanvasElement = document.createElement('canvas');
			//canvas.height = canvasSize;
			//canvas.width = canvasSize;
			let canvas = document.getElementById("prvw") as HTMLCanvasElement;
			if (canvas) {
				let context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
				//var imageData: ImageData = context.createImageData(sz, sz);
				var imageData: ImageData = context.getImageData(0,0,sz,sz);
				imageData.data.set(message.screenData);
				//context.putImageData(imageData, 0, 0);

/*
				context.strokeStyle = '#ff0000';
				context.beginPath();
				context.arc(95, 50, 40, 0, 2 * Math.PI);
				context.stroke();

				console.log(imageData);
				console.dir(canvas);
				*/
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
		//console.log('setipColors', colors.background, window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'));
		document.documentElement.style.setProperty('--background-color', colors.background);
		document.documentElement.style.setProperty('--main-color', colors.main);
		document.documentElement.style.setProperty('--drag-color', colors.drag);
		document.documentElement.style.setProperty('--line-color', colors.line);
		document.documentElement.style.setProperty('--click-color', colors.click);
	}
	exportLocalfile(th) {
		//console.log('exportLocalfile', th);
		if (this.hostProject) {
			this.download(JSON.stringify(this.hostProject), 'export', 'application/json');
			let msg: MZXBX_MessageToHost = {
				dialogID: this.callbackID
				, pluginData: null
				, done: true
				, sceenWait: false
			};
			window.parent.postMessage(msg, '*');
		}
	}
	download(data: string, filename: string, type: string) {

		let file = new Blob([data], { type: type });
		let a: HTMLAnchorElement = document.createElement("a");
		let url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();

	}
}
