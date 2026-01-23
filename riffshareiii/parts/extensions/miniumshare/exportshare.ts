
console.log('Share v1.0.1');

class ShareExportPlugin {
	callbackID = '';
	hostProject: Zvoog_Project | null = null;
	previewArrayBuffer: ArrayBuffer | null = null;
	bgPar = '#333';
	txtPar = '#ccc';
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		let msg: MZXBX_MessageToHost = {
			dialogID: this.callbackID
			, pluginData: null
			, done: false
			, screenWait: true
		};
		window.parent.postMessage(msg, '*');
	}
	fogClick() {
		console.log('start publish');
		//let url = 'http://127.0.0.1:8080/';
		let url = 'https://mzxbox.ru/minium/';
		if (this.hostProject) {
			this.sendRequest('', url + 'tmpproject.php?bg=' + encodeURIComponent(this.bgPar)
				+ '&txt=' + encodeURIComponent(this.txtPar)
				+ '&title=' + this.hostProject.title
					.replace("\"", " ")
					.replace("'", " ")
					.replace("<", " ")
					.replace(">", " ")
					.replace("&", " ")
					.replace("\n", " ")
					.replace("\r", " ")
					.replace("\t", " ")
					.replace("  ", " ")
					.replace("  ", " ")
					.replace("  ", " ")
					.replace("  ", " ")
					.replace("  ", " ")
				, 'POST', JSON.stringify(this.hostProject)
				, (info: string) => {
					console.log('error', info);
				}
				, (xmlHttpRequest: XMLHttpRequest, vProgressEven: ProgressEvent) => {
					console.log('request', xmlHttpRequest);
					if (xmlHttpRequest.status == 200) {
						let key = xmlHttpRequest.responseText;
						if (this.previewArrayBuffer) {
							this.sendRequest('', url + 'tmppreview.php?key=' + key, 'POST', this.previewArrayBuffer
								, (info: string) => {
									console.log('error', info);
								}
								, (xmlHttpRequest: XMLHttpRequest, vProgressEven: ProgressEvent) => {
									console.log('request', xmlHttpRequest);
									if (xmlHttpRequest.status == 200) {
										let link = url + 'tmp/' + key + '.html';
										console.log();
										window.open(link);
									}
								});
						}
					}
				});
		}
	}
	sendRequest(token: string, url: string, method: string, jsonOrArrayBuffer: string | ArrayBuffer
		, onError: (info: string) => void
		, onDone: (xmlHttpRequest: XMLHttpRequest, vProgressEven: ProgressEvent) => void
	) {
		console.log('sendRequest', url, jsonOrArrayBuffer);
		let xmlHttpRequest = new XMLHttpRequest();
		try {
			xmlHttpRequest.open(method, url, false);
			xmlHttpRequest.onload = function (vProgressEvent) {
				onDone(xmlHttpRequest, vProgressEvent);
			};
			xmlHttpRequest.onerror = function (vProgressEvent) {
				console.log('onerror', vProgressEvent);
				onError('request error');
			};
			if (token) {
				xmlHttpRequest.setRequestHeader("Authorization", 'OAuth ' + token);
			}
			if (jsonOrArrayBuffer) {
				xmlHttpRequest.send(jsonOrArrayBuffer);
			} else {
				xmlHttpRequest.send();
			}

		} catch (xx) {
			console.log('sendRequest', xx, xmlHttpRequest)
			onError('Can\'t send request');
		}
	}
	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			this.hostProject = message.hostData;
			let h1 = document.getElementById("labeltxt");
			(h1 as any).innerHTML = message.hostData.title;
		} else {
			this.callbackID = message.hostData;
			this.setupColors(message.colors);
		}
		if (message.screenData) {
			let sz = 500;
			let canvas = document.getElementById("prvw") as HTMLCanvasElement;
			if (canvas) {
				let context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
				var imageData: ImageData = context.getImageData(0, 0, sz, sz);
				imageData.data.set(message.screenData);
				context.putImageData(imageData, 0, 0);
				canvas.toBlob((blob) => {
					console.log('blob', blob);
					if (blob) {
						let pro = blob.arrayBuffer();
						pro.catch((reason) => {
							console.log('reason', reason);
						});
						pro.then((arrayBuffer) => {
							console.log('arrayBuffer', arrayBuffer);
							this.previewArrayBuffer = arrayBuffer;
						});
					}
				}, 'image/png');
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
		this.bgPar = colors.background;
		this.txtPar = colors.main;
	}
}
