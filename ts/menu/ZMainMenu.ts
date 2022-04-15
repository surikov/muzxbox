type ZMenuItem = {
	label: string
	, action: () => void
	, autoclose: boolean
	, icon: string
};
type ZMenuFolder = {
	path: string
	, icon: string
	, folders: ZMenuFolder[]
	, items: ZMenuItem[]
	, afterOpen: () => void
};
class ZMainMenu {
	muzXBox: MuzXBox;
	/*level1style: CSSStyleDeclaration;
	level2style: CSSStyleDeclaration;
	level3style: CSSStyleDeclaration;
	level4style: CSSStyleDeclaration;
	level5style: CSSStyleDeclaration;
	selection1level: number = 0;
	selection2level: number = 0;
	selection3level: number = 0;
	selection4level: number = 0;
	selection5level: number = 0;
	menu1textHead: HTMLElement;
	menu2textHead: HTMLElement;
	menu3textHead: HTMLElement;
	menu4textHead: HTMLElement;
	menu5textHead: HTMLElement;
	menu1content: HTMLElement;
	menu2content: HTMLElement;
	menu3content: HTMLElement;
	menu4content: HTMLElement;
	menu5content: HTMLElement;
	*/
	currentLevel = 0;
	menuRoot: ZMenuFolder;
	panels: SingleMenuPanel[] = [];
	constructor(from: MuzXBox) {
		this.muzXBox = from;
		this.panels.push(new SingleMenuPanel('menuPaneDiv1', 'menu1textHead', 'menu1content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv2', 'menu2textHead', 'menu2content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv3', 'menu3textHead', 'menu3content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv4', 'menu4textHead', 'menu4content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv5', 'menu5textHead', 'menu5content'));
		/*
		var el: HTMLElement | null = document.getElementById('menuPaneDiv1');
		if (el) { this.level1style = el.style; }
		el = document.getElementById('menuPaneDiv2');
		if (el) { this.level2style = el.style; }
		el = document.getElementById('menuPaneDiv3');
		if (el) { this.level3style = el.style; }
		el = document.getElementById('menuPaneDiv4');
		if (el) { this.level4style = el.style; }
		el = document.getElementById('menuPaneDiv5');
		if (el) { this.level5style = el.style; }
		el = document.getElementById('menu1textHead');
		if (el) { this.menu1textHead = el; }
		el = document.getElementById('menu2textHead');
		if (el) { this.menu2textHead = el; }
		el = document.getElementById('menu3textHead');
		if (el) { this.menu3textHead = el; }
		el = document.getElementById('menu4textHead');
		if (el) { this.menu4textHead = el; }
		el = document.getElementById('menu5textHead');
		if (el) { this.menu5textHead = el; }
		el = document.getElementById('menu1content');
		if (el) { this.menu1content = el; }
		el = document.getElementById('menu2content');
		if (el) { this.menu2content = el; }
		el = document.getElementById('menu3content');
		if (el) { this.menu3content = el; }
		el = document.getElementById('menu4content');
		if (el) { this.menu4content = el; }
		el = document.getElementById('menu5content');
		if (el) { this.menu5content = el; }
		*/
		this.menuRoot = {
			path: 'Menu'
			, icon: ''
			, folders: []
			, items: []
			, afterOpen: () => { }
		};
	}
	openNextLevel() {
		//console.log('openNextLevel from', this.currentLevel);
		/*if (this.currentLevel == 0) {
			this.open_1_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 1) {
			this.open_2_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 2) {
			this.open_3_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 3) {
			this.open_4_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 4) {
			this.open_5_level();
			this.currentLevel++;
			return;
		}*/
		this.open_nn_level(this.currentLevel);
		this.currentLevel++;
	}
	backPreLevel() {
		if (this.currentLevel - 1 >= 0 && this.currentLevel - 1 < this.panels.length) {
			this.panels[this.currentLevel - 1].off();
		}
		this.currentLevel--;
		/*if (this.currentLevel == 1) {
			this.level1style.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 2) {
			this.level2style.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 3) {
			this.level3style.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 4) {
			this.level4style.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 5) {
			this.level5style.width = '0cm';
			this.currentLevel--;
			return;
		}*/
	}
	hideMenu() {
		//this.level1style.width = '0cm';
		//this.level2style.width = '0cm';
		//this.level3style.width = '0cm';
		//this.level4style.width = '0cm';
		//this.level5style.width = '0cm';
		for (let i = 0; i < this.panels.length; i++) {
			this.panels[i].off();
		}
		this.currentLevel = 0;
	}
	moveSelection(level: number, row: number) {
		this.panels[level - 1].moveSelection(row);
		/*var div: HTMLElement = this.menu1content;
		if (level == 2) { div = this.menu2content; }
		if (level == 3) { div = this.menu3content; }
		if (level == 4) { div = this.menu4content; }
		if (level == 5) { div = this.menu5content; }
		for (var i = 0; i < div.childNodes.length; i++) {
			var child: HTMLDivElement = div.childNodes[i] as HTMLDivElement;
			child.dataset['rowSelection'] = 'no';
		}
		var child: HTMLDivElement = div.childNodes[row] as HTMLDivElement;
		child.dataset['rowSelection'] = 'yes';
		*/
	}
	createFolderClick(idx: number) {
		return () => {
			//console.log('folder', idx, 'from', this.currentLevel);
			this.moveSelection(this.currentLevel, idx);
			this.currentLevel++;
			this.panels[this.currentLevel - 2].selection = idx;
			this.open_nn_level(this.currentLevel - 1);
			//if (this.currentLevel == 2) { this.panels[0].selection = idx; this.open_2_level(); }
			//if (this.currentLevel == 3) { this.panels[1].selection = idx; this.open_3_level(); }
			//if (this.currentLevel == 4) { this.panels[2].selection = idx; this.open_4_level(); }
			//if (this.currentLevel == 5) { this.panels[3].selection = idx; this.open_5_level(); }
		};
	}
	createActionClick(nn: number, item: ZMenuItem) {
		return () => {
			//if (this.currentLevel == 1) { this.selection1level = nn; }
			//if (this.currentLevel == 2) { this.selection2level = nn; }
			//if (this.currentLevel == 3) { this.selection3level = nn; }
			//if (this.currentLevel == 4) { this.selection4level = nn; }
			//if (this.currentLevel == 5) { this.selection5level = nn; }
			this.panels[this.currentLevel - 1].selection = nn;
			if (item.autoclose) {
				this.hideMenu();
			} else {
				this.moveSelection(this.currentLevel, nn);
			}
			item.action();
		};
	}
	reFillMenulevel(menuContent: HTMLElement, subRoot: ZMenuFolder, selectedLevel: number) {
		while (menuContent.lastChild) { menuContent.removeChild(menuContent.lastChild); }
		for (var i = 0; i < subRoot.items.length; i++) {
			var item: ZMenuItem = subRoot.items[i];
			var div: HTMLDivElement = document.createElement('div');
			div.classList.add('menuActionRow');
			div.id = 'menuItem1-' + i;
			div.onclick = this.createActionClick(i, item);
			div.innerText = item.label;
			menuContent.appendChild(div);
			if (selectedLevel == i) {
				div.dataset['rowSelection'] = 'yes';
			} else {
				div.dataset['rowSelection'] = 'no';
			}
		}
		for (var i = 0; i < subRoot.folders.length; i++) {
			var folder: ZMenuFolder = subRoot.folders[i];
			var div = document.createElement('div');
			div.classList.add('menuFolderRow');
			div.id = 'menuFolder1-' + i;
			div.onclick = this.createFolderClick(subRoot.items.length + i);
			div.innerText = folder.path;
			menuContent.appendChild(div);
			if (selectedLevel == subRoot.items.length + i) {
				div.dataset['rowSelection'] = 'yes';
			} else {
				div.dataset['rowSelection'] = 'no';
			}
		}

	}
	open_nn_level(nn: number) {
		let wi = '' + (6 + (4 - nn) * 0.5) + 'cm';
		this.panels[nn].levelStyle.width = wi;
		let subRoot: ZMenuFolder = this.menuRoot;
		let txt = this.menuRoot.path;
		let action: undefined | (() => void) = undefined;
		if (nn == 1) {
			var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
			action = this.menuRoot.folders[folderIdx1].afterOpen;
			txt = this.menuRoot.folders[folderIdx1].path;
			subRoot = this.menuRoot.folders[folderIdx1];
		}
		if (nn == 2) {
			var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
			var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
			action = this.menuRoot.folders[folderIdx1].folders[folderIdx2].afterOpen;
			txt = this.menuRoot.folders[folderIdx1].path;
			subRoot = this.menuRoot.folders[folderIdx1].folders[folderIdx2];
		}
		if (nn == 3) {
			var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
			var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
			var folderIdx3 = this.panels[2].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
			action = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].afterOpen;
			txt = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].path;
			subRoot = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3];
		}
		if (nn == 4) {
			var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
			var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
			var folderIdx3 = this.panels[2].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
			var folderIdx4 = this.panels[3].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].items.length;
			action = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].afterOpen;
			this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].path;
			subRoot = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4];
		}
		this.reFillMenulevel(this.panels[nn].menuContent, subRoot, this.panels[nn].selection);
		this.panels[nn].menuTextHead.innerText = txt;
		if (action) action();
	}
	/*open_1_level() {
		this.panels[0].menuTextHead.innerText = this.menuRoot.path;
		this.panels[0].levelStyle.width = '8cm';
		this.reFillMenulevel(this.panels[0].menuContent, this.menuRoot, this.panels[0].selection);
	}
	open_2_level() {
		var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
		this.panels[1].menuTextHead.innerText = this.menuRoot.folders[folderIdx1].path;
		this.menuRoot.folders[folderIdx1].afterOpen();
		this.panels[1].levelStyle.width = '7.5cm';
		this.reFillMenulevel(this.panels[1].menuContent, this.menuRoot.folders[folderIdx1], this.panels[1].selection);
	}
	open_3_level() {
		var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
		var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
		this.menuRoot.folders[folderIdx1].folders[folderIdx2].afterOpen();
		this.panels[2].menuTextHead.innerText = this.menuRoot.folders[folderIdx1].folders[folderIdx2].path;
		this.panels[2].levelStyle.width = '7.0cm';
		this.reFillMenulevel(this.panels[2].menuContent, this.menuRoot.folders[folderIdx1].folders[folderIdx2], this.panels[2].selection);
	}
	open_4_level() {
		var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
		var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
		var folderIdx3 = this.panels[2].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
		this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].afterOpen();
		this.panels[3].menuTextHead.innerText = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].path;
		this.panels[3].levelStyle.width = '6.5cm';
		this.reFillMenulevel(this.panels[3].menuContent, this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3], this.panels[3].selection);
	}
	open_5_level() {
		var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
		var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
		var folderIdx3 = this.panels[2].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
		var folderIdx4 = this.panels[3].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].items.length;
		this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].afterOpen();
		this.panels[4].menuTextHead.innerText = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].path;
		this.panels[4].levelStyle.width = '6.0cm';
		this.reFillMenulevel(this.panels[4].menuContent, this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4], this.panels[4].selection);
	}*/
	fillFrom(prj: ZvoogSchedule) {
		this.menuRoot.items.length = 0;
		this.menuRoot.folders.length = 0;
		this.menuRoot.items.push(this.muzXBox.itemImportMIDI);
		var songFolder: ZMenuFolder = { path: "Current song", icon: "", folders: [], items: [], afterOpen: () => { } };
		songFolder.items.push({ label: "+track", icon: "", autoclose: false, action: () => { console.log('+track'); } });
		songFolder.items.push({ label: "+fx", icon: "", autoclose: false, action: () => { console.log('+fx'); } });
		for (var tt = 0; tt < prj.tracks.length; tt++) {
			var songtrack = prj.tracks[tt];
			var tr: ZMenuFolder = { path: 'track ' + songtrack.title, icon: "", folders: [], items: [], afterOpen: this.upTrack(tt) };
			songFolder.folders.push(tr);
			tr.items.push({ label: "-track", icon: "", autoclose: false, action: () => { console.log('-track'); } });
			tr.items.push({ label: "+tfx", icon: "", autoclose: false, action: () => { console.log('+tfx'); } });
			tr.items.push({ label: "+vox", icon: "", autoclose: false, action: () => { console.log('+vox'); } });
			for (var vv = 0; vv < songtrack.voices.length; vv++) {
				var songvox = songtrack.voices[vv];
				var vox: ZMenuFolder = { path: 'vox ' + songvox.title, icon: "", folders: [], items: [], afterOpen: this.upVox(tt, vv) };
				tr.folders.push(vox);
				vox.items.push({ label: "+vfx", icon: "", autoclose: false, action: () => { console.log('+vfx'); } });
				var source: ZMenuFolder = { path: 'src ' + songvox.performer.kind, icon: "", folders: [], items: [], afterOpen: this.upVoxProvider(tt, vv) };
				source.items.push({ label: "?src", icon: "", autoclose: false, action: () => { console.log('?src'); } });
				for (var kk = 0; kk < songvox.performer.parameters.length; kk++) {
					var par: ZMenuItem = { label: "par " + kk + " " + songvox.performer.parameters[kk].caption, icon: "", autoclose: false, action: this.upVoxProviderParam(tt, vv, kk) };
					source.items.push(par);
				}
				vox.folders.push(source);
				for (var ff = 0; ff < songvox.filters.length; ff++) {
					var filter: ZMenuFolder = { path: 'fx ' + songvox.filters[ff].kind, icon: "", folders: [], items: [], afterOpen: this.upVoxFx(tt, vv, ff) };
					vox.folders.push(filter);
					var voxfilter = songvox.filters[ff];
					filter.items.push({ label: "-vfx", icon: "", autoclose: false, action: () => { console.log('-vfx'); } });
					for (var kk = 0; kk < voxfilter.parameters.length; kk++) {
						var par: ZMenuItem = { label: "par " + kk + " " + voxfilter.parameters[kk].caption, icon: "", autoclose: false, action: this.upVoxFxParam(tt, vv, ff, kk) };
						filter.items.push(par);
					}
				}
			}
			for (var ff = 0; ff < songtrack.filters.length; ff++) {
				var filter: ZMenuFolder = { path: 'fx ' + songtrack.filters[ff].kind, icon: "", folders: [], items: [], afterOpen: this.upTrackFx(tt, ff) };
				tr.folders.push(filter);
				var trfilter = songtrack.filters[ff];
				filter.items.push({ label: "-fx", icon: "", autoclose: false, action: () => { console.log('-fx'); } });
				for (var kk = 0; kk < trfilter.parameters.length; kk++) {
					var par: ZMenuItem = { label: "par " + kk + " " + trfilter.parameters[kk].caption, icon: "", autoclose: false, action: this.upTrackFxParam(tt, ff, kk) };
					filter.items.push(par);
				}

			}
		}
		for (var ff = 0; ff < prj.filters.length; ff++) {
			var filter: ZMenuFolder = { path: 'fx ' + prj.filters[ff].kind, icon: "", folders: [], items: [], afterOpen: this.upSongFx(ff) };
			songFolder.folders.push(filter);
			var songfilter = prj.filters[ff];
			filter.items.push({ label: "-fx", icon: "", autoclose: false, action: () => { console.log('-fx'); } });
			for (var kk = 0; kk < songfilter.parameters.length; kk++) {
				var par: ZMenuItem = { label: "par " + kk + " " + songfilter.parameters[kk].caption, icon: "", autoclose: false, action: this.upSongFxParam(ff, kk) };
				filter.items.push(par);
			}
		}
		this.menuRoot.folders.push(songFolder);
	}
	upSongFx(fx: number): () => void {
		return () => {
			console.log('upSongFx', fx);
			this.muzXBox.currentSchedule.obverseTrackFilter = this.muzXBox.currentSchedule.tracks.length + fx;
			this.muzXBox.currentSchedule.filters[fx].obverseParameter = 0;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upSongFxParam(fx: number, param: number): () => void {
		return () => {
			console.log('upSongFxParam', fx, param);
			this.muzXBox.currentSchedule.obverseTrackFilter = this.muzXBox.currentSchedule.tracks.length + fx;
			this.muzXBox.currentSchedule.filters[fx].obverseParameter = param;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrack(trk: number): () => void {
		return () => {
			console.log('upTrack', trk);
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			if (this.muzXBox.currentSchedule.tracks.length) {
				this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = 0;
			}
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrackFx(trk: number, fx: number): () => void {
		return () => {
			console.log('upTrackFx', trk, fx);
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrackFxParam(trk: number, fx: number, param: number): () => void {
		return () => {
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
			this.muzXBox.currentSchedule.tracks[trk].filters[fx].obverseParameter = param;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
			console.log('upTrackFxParam', trk, fx, param);
		};
	}

	upVox(trk: number, vox: number): () => void {
		return () => {
			console.log('upVox', trk, vox);
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxFx(trk: number, vox: number, fx: number): () => void {
		return () => {
			console.log('upVoxFx', trk, vox, fx);
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxFxParam(trk: number, vox: number, fx: number, param: number): () => void {
		return () => {
			console.log('upVoxFxParam', trk, vox, fx, param);
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].filters[fx].obverseParameter = fx;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxProvider(trk: number, vox: number): () => void {
		return () => {
			console.log('upVoxProvider', trk, vox);
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxProviderParam(trk: number, vox: number, param: number): () => void {
		return () => {
			console.log('upVoxProviderParam', trk, vox, param);
			this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].performer.obverseParameter = 0;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
}
