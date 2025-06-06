//console.log('startup v1.02');
declare function createSchedulePlayer(callback: (start: number, position: number, end: number) => void): MZXBX_Player;
declare function createTileLevel(): TileLevelBase;
function startApplication() {
	console.log('startApplication v1.6.11');
	//let commands = new CommandDispatcher();
	globalCommandDispatcher.registerWorkProject(___newEmptyProject);
	let ui = new UIRenderer();
	ui.createUI();
	//window.addEventListener("unload", saveProjectState);
	window.addEventListener("beforeunload", saveProjectState);
	
	try {
		let lastprojectdata = readObjectFromlocalStorage('lastprojectdata');
		if (lastprojectdata) {
			globalCommandDispatcher.registerWorkProject(lastprojectdata);
		}
		globalCommandDispatcher.clearUndo();
		globalCommandDispatcher.clearRedo();
		let undocommands = readObjectFromlocalStorage('undocommands');
		if (undocommands) {
			if (undocommands.length) {
				globalCommandDispatcher.undoQueue = undocommands;
			}
		}
		let redocommands = readObjectFromlocalStorage('redocommands');
		if (redocommands) {
			if (redocommands.length) {
				globalCommandDispatcher.redoQueue = redocommands;
			}
		}
	} catch (xx) {
		console.log(xx);

	}
	globalCommandDispatcher.resetProject();
	//ui.fillWholeUI();//testBigMixerData);//testEmptyMixerData);
	//testNumMathUtil();
	//console.log('done startApplication');
	/*setupZoomDialog();
	showDialog(icon_warningPlay, '', '', () => {
		initWebAudioFromUI();
	    
	});*/
	let themei = readTextFromlocalStorage('uicolortheme');
	if (themei) {
		globalCommandDispatcher.setThemeColor(themei);
	}
}
function squashString(data: string): string {
	return data;
}
function resolveString(data: string): string | null {
	return data;
}
function saveProjectState() {
	console.log('saveProjectState');
	//https://github.com/pieroxy/lz-string
	globalCommandDispatcher.exe.cutLongUndo();
	let txtdata = JSON.stringify(globalCommandDispatcher.cfg().data);
	try {

		console.log('state size', txtdata.length);
		saveText2localStorage('lastprojectdata', txtdata);
		saveText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
		saveText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
	} catch (xx) {
		console.log(xx);
		globalCommandDispatcher.clearUndo();
		globalCommandDispatcher.clearRedo();
		try {
			saveText2localStorage('lastprojectdata', txtdata);
			saveText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
			saveText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
		} catch (nn) {
			console.log(nn);
			window.localStorage.clear();
			try {
				saveText2localStorage('lastprojectdata', txtdata);
				saveText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
				saveText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
			} catch (n22) {
				console.log(n22);
			}
		}
	}
	console.log('done saveProjectState');
}
function initWebAudioFromUI() {
	console.log('initWebAudioFromUI');
	globalCommandDispatcher.initAudioFromUI();
}
function startLoadCSSfile(cssurl: string) {
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = cssurl;
	link.media = 'all';
	head.appendChild(link);
}
/*
function setupZoomDialog() {
	let dialogdiv = document.getElementById('warningDialog');
	if (dialogdiv) {
		dialogdiv.addEventListener(
			"wheel",
			function touchHandler(e) {
				if (e.ctrlKey) {
					e.preventDefault();
				}
			}, { passive: false });
	}

}
function setZoom100() {
	try {
		//
		var scale = 'scale(1)';
		(document as any).body.style.zoom = 1.0;
		(document as any).body.style.webkitTransform = scale;    // Chrome, Opera, Safari
		(document as any).body.style.msTransform = scale;       // IE 9
		(document as any).body.style.transform = scale;     // General
		(document as any).body.style.zoom = '100%';
	} catch (xx) {
		console.log(xx);
	}
}
function showDialog(icon: string, title: string, text: string, cancel: null | (() => void)) {
	let dialogdiv = document.getElementById('warningDialog');
	if (dialogdiv) {
		//console.log('setup');
		let icondiv = document.getElementById('warningIcon');
		if (icondiv) {
			icondiv.innerHTML = icon;
		}
		let titlediv = document.getElementById('warningTitle');
		if (titlediv) {
			titlediv.innerHTML = title;
		}
		let textdiv = document.getElementById('warningText');
		if (textdiv) {
			textdiv.innerHTML = text;
		}
		dialogdiv.style.display = 'flex';
		dialogdiv.onclick = () => {
			//console.log('click', (document as any).body.style.zoom, (document as any).body.style);
			//console.log('zoom',(document as any).body.style.zoom);
		    
			setZoom100();
			let dialogdiv = document.getElementById('warningDialog');
			if (dialogdiv) {
				dialogdiv.style.display = 'none';
			}
			if (cancel) {
				cancel();
			}
		    
		};
	}
}
*/