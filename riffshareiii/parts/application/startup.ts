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
	window.addEventListener("beforeunload", () => {
		//console.log('save on beforeunload');
		saveProjectState();
	});
	window.addEventListener("blur", () => {
		//console.log('save on blur');
		saveProjectState();
	});
	window.addEventListener("visibilitychange", function () {
		if (document.hidden) {
			//console.log("save on tab is hidden");
			saveProjectState();
		}
	});
	try {
		let lastprojectdata = readLzObjectFromlocalStorage('lastprojectdata');
		if (lastprojectdata) {
			globalCommandDispatcher.registerWorkProject(lastprojectdata);
		}
		console.log('lastprojectdata', lastprojectdata);
		globalCommandDispatcher.clearUndo();
		globalCommandDispatcher.clearRedo();
		let undocommands = readRawObjectFromlocalStorage('undocommands');
		if (undocommands) {
			if (undocommands.length) {
				globalCommandDispatcher.undoQueue = undocommands;
				//console.log(undocommands);
			}
		}
		let redocommands = readRawObjectFromlocalStorage('redocommands');
		if (redocommands) {
			if (redocommands.length) {
				globalCommandDispatcher.redoQueue = redocommands;
			}
		}
	} catch (xx) {
		console.log(xx);

	}

	//ui.fillWholeUI();//testBigMixerData);//testEmptyMixerData);
	//testNumMathUtil();
	//console.log('done startApplication');
	/*setupZoomDialog();
	showDialog(icon_warningPlay, '', '', () => {
		initWebAudioFromUI();
	    
	});*/
	let themei = readRawTextFromlocalStorage('uicolortheme');
	if (themei) {
		globalCommandDispatcher.setThemeColor(themei);
	}
	let uilocale = readRawTextFromlocalStorage('uilocale');
	if (uilocale) {
		let uiratio = readRawTextFromlocalStorage('uiratio');
		if (uiratio) {
			let nratio = parseInt(uiratio);
			if (nratio >= 0.1) {
				globalCommandDispatcher.setThemeLocale(uilocale, nratio);
			}
		}
	}

	globalCommandDispatcher.resetProject();

}
function squashString(data: string): string {
	return data;
}
function resolveString(data: string): string | null {
	return data;
}
function saveProjectState() {
	//console.log('saveProjectState');
	//https://github.com/pieroxy/lz-string
	globalCommandDispatcher.exe.cutLongUndo();
	let txtdata = JSON.stringify(globalCommandDispatcher.cfg().data);
	try {

		//console.log('state size', txtdata.length);
		saveLzText2localStorage('lastprojectdata', txtdata);
		saveRawText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
		saveRawText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
	} catch (xx) {
		console.log(xx);
		globalCommandDispatcher.clearUndo();
		globalCommandDispatcher.clearRedo();
		try {
			saveLzText2localStorage('lastprojectdata', txtdata);
			saveRawText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
			saveRawText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
		} catch (nn) {
			console.log(nn);
			window.localStorage.clear();
			try {
				saveLzText2localStorage('lastprojectdata', txtdata);
				saveRawText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
				saveRawText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
			} catch (n22) {
				console.log(n22);
			}
		}
	}
	//console.log('done saveProjectState');
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