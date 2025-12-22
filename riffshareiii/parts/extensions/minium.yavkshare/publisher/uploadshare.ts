console.log('upload');
let dt = datekey();
let ya_file_name = 'MiniumStudio-' + dt + '.json';
let ya_picture_name = 'MiniumStudio-' + dt + '.png';
let ya_access_token = check_ya_token();
let projecttextdata = '';
let previewArrayBuffer: ArrayBuffer;
function dumpResultMessage(txt: string) {
	console.log('error', txt);

}

function check_ya_token() {
	if (window.location.hash) {
		let hash = window.location.hash.substring(1);
		if (hash) {
			let pars = hash.split('&');
			for (let ii = 0; ii < pars.length; ii++) {
				let namval = pars[ii].split('=');
				if (namval[0]) {
					if (namval[1]) {
						if (namval[0] == 'access_token') {
							let ya_access_token = namval[1];
							return ya_access_token;
						}
					}
				}

			}
		}
	}
	return '';
}

function textcell2(num: number) {
	if (num < 10) {
		return '0' + num;
	} else {
		return '' + num;
	}
}

function datekey() {
	let dd = new Date();
	return dd.getFullYear() + '.' + textcell2(dd.getMonth()) + '.' + textcell2(dd.getDay()) +
		'_' + textcell2(dd.getHours()) + '-' + textcell2(dd.getMinutes()) + '-' + textcell2(dd.getSeconds())
}

function sendRequest(token, url, method, jsonOrArrayBuffer, onError, onDone) {
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

function readYaUploadURL(ya_access_token, filename, onError, onDone) {
	console.log('readYaUploadURL', ya_access_token, filename);
	sendRequest(ya_access_token, 'https://cloud-api.yandex.net/v1/disk/resources/upload?path=app:/' + filename, 'GET', '', onError, (xmlHttpRequest, vProgressEvent) => {
		try {
			let json = JSON.parse(xmlHttpRequest.responseText);
			let ya_upload_url = json['href'];
			let ya_operation_id = json['operation_id'];
			onDone(ya_upload_url, ya_operation_id);
		} catch (xx) {
			console.log('parse', xx)
			onError('Can\'t parse response ' + xmlHttpRequest.responseText);
		}
	});
}

function uploadYaFileData(ya_upload_url, jsonOrArrayBuffer, onError, onDone) {
	console.log('uploadYaFileData', ya_upload_url);
	sendRequest('', ya_upload_url, 'PUT', jsonOrArrayBuffer, onError, (xmlHttpRequest, vProgressEvent) => {
		onDone();
	});
}

function dumpYaOperationState(ya_operation_id, ya_access_token, onError, onDone) {
	console.log('dumpYaOperationState', ya_operation_id);
	sendRequest(ya_access_token, 'https://cloud-api.yandex.net/v1/disk/operations/' + ya_operation_id, 'GET', '', onError, (xmlHttpRequest, vProgressEvent) => {
		try {
			let json = JSON.parse(xmlHttpRequest.responseText);
			let status = json['status'];
			if (status == 'success') {
				onDone();
			} else {
				onError(xmlHttpRequest.responseText);
			}
		} catch (xx) {
			console.log('parse', xx)
			onError('Can\'t parse response ' + xmlHttpRequest.responseText);
		}
	});
}

function getYaLink(ya_file_name, ya_access_token, onError, onDone) {
	console.log('getYaLink', ya_file_name);
	sendRequest(ya_access_token, 'https://cloud-api.yandex.net/v1/disk/resources/download?path=app:/' + ya_file_name, 'GET', '', onError, (xmlHttpRequest, vProgressEvent) => {
		try {
			let json = JSON.parse(xmlHttpRequest.responseText);
			let downurl = json['href'];
			onDone(downurl);
		} catch (xx) {
			onError('Can\'t parse response ' + xmlHttpRequest.responseText);
		}
	});
}



function getLinkUpload(ya_file_name, jsonOrArrayBuffer, ya_access_token, onError, onDone) {
	readYaUploadURL(ya_access_token, ya_file_name, onError, (href, operation_id) => {
		uploadYaFileData(href, jsonOrArrayBuffer, onError, () => {
			dumpYaOperationState(operation_id, ya_access_token, onError, () => {
				getYaLink(ya_file_name, ya_access_token, onError, (linkDownload) => {
					onDone(linkDownload);
				});
			});
		});
	});
}

function startUpload() {
	/*
				let arrayBuffer = new ArrayBuffer(3);
				var bufView = new Uint8Array(arrayBuffer);
				bufView[0] = 1;
				bufView[1] = 2;
				bufView[2] = 3;
				console.log('arrayBuffer', arrayBuffer);
	
				let dt = datekey();
				let ya_file_name = 'MiniumStudio-' + dt + '.json';
				let ya_picture_name = 'MiniumStudio-' + dt + '.png';
				let textdata = JSON.stringify(miprodata);
				let ya_access_token = check_ya_token();
				console.log('startUpload', ya_access_token);
				*/
	if (ya_access_token) {
		getLinkUpload(ya_file_name, projecttextdata, ya_access_token, dumpResultMessage, (link) => {
			console.log('project download link', link);
			getLinkUpload(ya_picture_name, previewArrayBuffer, ya_access_token, dumpResultMessage, (link) => {
				console.log('image download link', link);
			});
		});
	} else {
		dumpResultMessage('empty token');
	}
}
function startYAVKipload() {
	console.log(startYAVKipload);
	let lz = new LZUtil();
	let txt: string | null = localStorage.getItem('yavkpreview');
	if (txt) {
		let json = lz.decompressFromUTF16(txt);
		if (json) {
			let screenData: number[] = JSON.parse(json) as number[];
			let sz = 500;
			let canvas = document.getElementById("prvw") as HTMLCanvasElement;
			if (canvas) {
				let context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
				var imageData: ImageData = context.getImageData(0, 0, sz, sz);
				imageData.data.set(screenData);
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
							previewArrayBuffer = arrayBuffer;
							let txt: string | null = localStorage.getItem('lastprojectdata');
							let json = lz.decompressFromUTF16(txt);
							if (json) {
								projecttextdata = json;
							}
						});
					}
				}, 'image/png');
			}
		}
	}

}
