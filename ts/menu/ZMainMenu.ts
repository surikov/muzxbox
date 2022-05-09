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
	layerSelector: LayerSelector;
	currentLevel = 0;
	menuRoot: ZMenuFolder;
	panels: SingleMenuPanel[] = [];
	songFolder: ZMenuFolder = { path: "Current song", icon: "", folders: [], items: [], afterOpen: () => { } };
	constructor(from: MuzXBox) {
		this.muzXBox = from;
		this.layerSelector = new LayerSelector(from);
		this.panels.push(new SingleMenuPanel('menuPaneDiv1', 'menu1textHead', 'menu1content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv2', 'menu2textHead', 'menu2content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv3', 'menu3textHead', 'menu3content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv4', 'menu4textHead', 'menu4content'));
		this.panels.push(new SingleMenuPanel('menuPaneDiv5', 'menu5textHead', 'menu5content'));
		this.menuRoot = {
			path: 'Menu'
			, icon: ''
			, folders: []
			, items: []
			, afterOpen: () => { }
		};
		this.reBuildMenu();
	}
	openNextLevel() {
		this.open_nn_level(this.currentLevel);
		this.currentLevel++;
	}
	backPreLevel() {
		if (this.currentLevel - 1 >= 0 && this.currentLevel - 1 < this.panels.length) {
			this.panels[this.currentLevel - 1].off();
		}
		this.currentLevel--;
	}
	hideMenu() {
		for (let i = 0; i < this.panels.length; i++) {
			this.panels[i].off();
		}
		this.currentLevel = 0;
	}
	moveSelection(level: number, row: number) {
		this.panels[level - 1].moveSelection(row);
	}
	createFolderClick(idx: number) {
		return () => {
			this.moveSelection(this.currentLevel, idx);
			this.currentLevel++;
			this.panels[this.currentLevel - 2].selection = idx;
			this.open_nn_level(this.currentLevel - 1);
		};
	}
	createActionClick(nn: number, item: ZMenuItem) {
		return () => {
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
		let pageWidth: number = document.body.offsetWidth;
		let levelPad = 0.5;
		//let layMin = 6;
		let layMx = 12;
		let pgwi = pageWidth / this.muzXBox.zrenderer.tileLevel.tapSize;
		let layerDiWidth = layMx;//pgwi/3;
		if (layerDiWidth > pgwi) layerDiWidth = pgwi;

		//console.log(pgwi,pageWidth ,this.muzXBox.zrenderer.tileLevel.tapSize,layerDiWidth);
		//if (layerDiWidth < layMin) layerDiWidth = pgwi;
		//if (layerDiWidth >layMx) layerDiWidth = layMx;

		//let wi = '' + (6 + (4 - nn) * 0.5) + 'cm';
		let wi = '' + (layerDiWidth - (1 + nn) * levelPad) + 'cm';
		//console.log(pgwi,pageWidth ,this.muzXBox.zrenderer.tileLevel.tapSize,layerDiWidth,wi);
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
	reBuildMenu() {
		this.menuRoot.items.length = 0;
		this.menuRoot.folders.length = 0;
		this.menuRoot.items.push({
			label: 'import midi'
			, action: () => {
				var me: MuzXBox = window['MZXB'] as MuzXBox;
				if (me) {
					me.testFSmidi();
				}
			}
			, autoclose: true
			, icon: ''
		});
		this.menuRoot.items.push({
			label: 'play/stop'
			, action: () => {
				console.log('play/stop');
			}
			, autoclose: true
			, icon: ''
		});
		this.menuRoot.folders.push(this.songFolder);
		this.menuRoot.folders.push({
			path: "Rhythm patterns", icon: "", folders: [], items: [
				{
					label: 'plain 1/16', autoclose: true, icon: '', action: () => {
						let rr: ZvoogMeter[] = [
							{ count: 1, division: 16 }, { count: 1, division: 16 }
							, { count: 1, division: 16 }, { count: 1, division: 16 }
							, { count: 1, division: 16 }, { count: 1, division: 16 }
							, { count: 1, division: 16 }, { count: 1, division: 16 }

						];
						console.log('plain 1/16', rr);
						var me: MuzXBox = window['MZXB'] as MuzXBox;
						if (me) { me.setGrid(rr); }
					}
				}
				, {
					label: 'plain 1/8', autoclose: true, icon: '', action: () => {
						
						console.log('plain 1/8', default8rhytym);
						var me: MuzXBox = window['MZXB'] as MuzXBox;
						if (me) { me.setGrid(default8rhytym); }
					}
				}
				, {
					label: 'swing 1/8', autoclose: true, icon: '', action: () => {
						let rr: ZvoogMeter[] = [
							{ count: 5, division: 32 }, { count: 3, division: 32 }
							, { count: 5, division: 32 }, { count: 3, division: 32 }

						];
						console.log('swing 1/8', rr);
						var me: MuzXBox = window['MZXB'] as MuzXBox;
						if (me) { me.setGrid(rr); }
					}
				}
			], afterOpen: () => { }
		});
		this.menuRoot.folders.push({
			path: "Screen size", icon: "", folders: [], items: [
				{
					label: 'normal', autoclose: true, icon: '', action: () => {
						var me: MuzXBox = window['MZXB'] as MuzXBox;
						if (me) { me.setLayoutNormal(); }
					}
				}
				, {
					label: 'big', autoclose: true, icon: '', action: () => {
						var me: MuzXBox = window['MZXB'] as MuzXBox;
						if (me) { me.setLayoutBig(); }
					}
				}
			], afterOpen: () => { }
		});
	}

	fillFrom(prj: ZvoogSchedule) {
		this.songFolder.items.length = 0;
		this.songFolder.folders.length = 0;
		//this.menuRoot.items.push(this.muzXBox.itemImportMIDI);
		//var songFolder: ZMenuFolder = { path: "Current song", icon: "", folders: [], items: [], afterOpen: () => { } };
		this.songFolder.items.push({ label: "+track", icon: "", autoclose: false, action: () => { console.log('+track'); } });
		this.songFolder.items.push({ label: "+fx", icon: "", autoclose: false, action: () => { console.log('+fx'); } });
		for (var tt = 0; tt < prj.tracks.length; tt++) {
			var songtrack = prj.tracks[tt];
			var tr: ZMenuFolder = {
				path: 'track ' + songtrack.title, icon: "", folders: [], items: []
				, afterOpen: this.layerSelector.upTrack(tt)
			};
			this.songFolder.folders.push(tr);
			tr.items.push({ label: "-track", icon: "", autoclose: false, action: () => { console.log('-track'); } });
			tr.items.push({ label: "+tfx", icon: "", autoclose: false, action: () => { console.log('+tfx'); } });
			tr.items.push({ label: "+vox", icon: "", autoclose: false, action: () => { console.log('+vox'); } });
			for (var vv = 0; vv < songtrack.voices.length; vv++) {
				var songvox = songtrack.voices[vv];
				var vox: ZMenuFolder = {
					path: 'vox ' + songvox.title, icon: "", folders: [], items: []
					, afterOpen: this.layerSelector.upVox(tt, vv)
				};
				tr.folders.push(vox);
				vox.items.push({ label: "+vfx", icon: "", autoclose: false, action: () => { console.log('+vfx'); } });
				var source: ZMenuFolder = {
					path: 'src ' + songvox.performer.kind, icon: "", folders: [], items: []
					, afterOpen: this.layerSelector.upVoxProvider(tt, vv)
				};
				source.items.push({ label: "?src", icon: "", autoclose: false, action: () => { console.log('?src'); } });
				for (var kk = 0; kk < songvox.performer.parameters.length; kk++) {
					var par: ZMenuItem = {
						label: "par " + kk + " " + songvox.performer.parameters[kk].caption, icon: "", autoclose: false
						, action: this.layerSelector.upVoxProviderParam(tt, vv, kk)
					};
					source.items.push(par);
				}
				vox.folders.push(source);
				for (var ff = 0; ff < songvox.filters.length; ff++) {
					var filter: ZMenuFolder = {
						path: 'fx ' + songvox.filters[ff].kind, icon: "", folders: [], items: []
						, afterOpen: this.layerSelector.upVoxFx(tt, vv, ff)
					};
					vox.folders.push(filter);
					var voxfilter = songvox.filters[ff];
					filter.items.push({ label: "-vfx", icon: "", autoclose: false, action: () => { console.log('-vfx'); } });
					for (var kk = 0; kk < voxfilter.parameters.length; kk++) {
						var par: ZMenuItem = {
							label: "par " + kk + " " + voxfilter.parameters[kk].caption, icon: "", autoclose: false
							, action: this.layerSelector.upVoxFxParam(tt, vv, ff, kk)
						};
						filter.items.push(par);
					}
				}
			}
			for (var ff = 0; ff < songtrack.filters.length; ff++) {
				var filter: ZMenuFolder = {
					path: 'fx ' + songtrack.filters[ff].kind, icon: "", folders: [], items: []
					, afterOpen: this.layerSelector.upTrackFx(tt, ff)
				};
				tr.folders.push(filter);
				var trfilter = songtrack.filters[ff];
				filter.items.push({ label: "-fx", icon: "", autoclose: false, action: () => { console.log('-fx'); } });
				for (var kk = 0; kk < trfilter.parameters.length; kk++) {
					var par: ZMenuItem = {
						label: "par " + kk + " " + trfilter.parameters[kk].caption, icon: "", autoclose: false
						, action: this.layerSelector.upTrackFxParam(tt, ff, kk)
					};
					filter.items.push(par);
				}

			}
		}
		for (var ff = 0; ff < prj.filters.length; ff++) {
			var filter: ZMenuFolder = {
				path: 'fx ' + prj.filters[ff].kind, icon: "", folders: [], items: []
				, afterOpen: this.layerSelector.upSongFx(ff)
			};
			this.songFolder.folders.push(filter);
			var songfilter = prj.filters[ff];
			filter.items.push({ label: "-fx", icon: "", autoclose: false, action: () => { console.log('-fx'); } });
			for (var kk = 0; kk < songfilter.parameters.length; kk++) {
				var par: ZMenuItem = {
					label: "par " + kk + " " + songfilter.parameters[kk].caption, icon: "", autoclose: false
					, action: this.layerSelector.upSongFxParam(ff, kk)
				};
				filter.items.push(par);
			}
		}
		//this.menuRoot.folders.push(this.songFolder);
	}

}
