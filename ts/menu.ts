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
	level1style: CSSStyleDeclaration;
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
	currentLevel = 0;
	menuRoot: ZMenuFolder;
	constructor(from: MuzXBox) {
		this.muzXBox = from;
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
		//console.log('this.level1',this.level1);
		//(document.getElementById('menuPaneDiv1') as any).style
		//this.fillStaticMenu();
		this.menuRoot = {
			path: 'Menu'
			, icon: ''
			, folders: []
			, items: []
			, afterOpen: () => { }
		};
	}
	/*	fillStaticMenu() {
			this.menuRoot = {
				path: 'Menu'
				, icon: ''
				, folders: [
					{
						path: 'first-1', icon: ''
						, folders: [
							{
								path: 'second-1', icon: ''
								, folders: [
									{
										path: 'third-1', icon: ''
										, folders: [
											{
												path: 'forth-1', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'forth-2', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}, {
										path: 'third-2', icon: ''
										, folders: [
											{
												path: 'forth-3', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'forth-4', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}], items: [{ label: 'it3-3', autoclose: true, icon: '', action: () => { console.log('it3-3'); } }
										, { label: 'it3-4', autoclose: true, icon: '', action: () => { console.log('it3-4'); } }]
							}, {
								path: 'second-2', icon: ''
								, folders: [
									{
										path: 'third-3', icon: ''
										, folders: [
											{
												path: 'forth-5', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'forth-6', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}, {
										path: 'third-4', icon: ''
										, folders: [
											{
												path: 'forth-7', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'forth-8', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}], items: [{ label: 'it3-3', autoclose: true, icon: '', action: () => { console.log('it3-3'); } }
										, { label: 'it3-4', autoclose: true, icon: '', action: () => { console.log('it3-4'); } }]
							}], items: [{ label: 'it2-3', autoclose: true, icon: '', action: () => { console.log('it2-3'); } }
								, { label: 'it2-4', autoclose: true, icon: '', action: () => { console.log('it2-4'); } }]
					}, {
						path: 'f1-2', icon: ''
						, folders: [
							{
								path: 'f2-1', icon: ''
								, folders: [
									{
										path: 'f3-1', icon: ''
										, folders: [
											{
												path: 'f4-1', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'f4-2', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}, {
										path: 'f3-2', icon: ''
										, folders: [
											{
												path: 'f4-3', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'f4-4', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}], items: [{ label: 'it3-3', autoclose: true, icon: '', action: () => { console.log('it3-3'); } }
										, { label: 'it3-4', autoclose: true, icon: '', action: () => { console.log('it3-4'); } }]
							}, {
								path: 'f2-2', icon: ''
								, folders: [
									{
										path: 'f3-3', icon: ''
										, folders: [
											{
												path: 'f4-5', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'f4-6', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}, {
										path: 'f3-4', icon: ''
										, folders: [
											{
												path: 'f4-7', icon: ''
												, folders: [
												], items: [{ label: 'it5-3', autoclose: true, icon: '', action: () => { console.log('it5-3'); } }
													, { label: 'it5-4', autoclose: true, icon: '', action: () => { console.log('it5-4'); } }]
											}, {
												path: 'f4-8', icon: ''
												, folders: [
												], items: [{ label: 'it5-5', autoclose: true, icon: '', action: () => { console.log('it5-5'); } }
													, { label: 'it5-6', autoclose: true, icon: '', action: () => { console.log('it5-6'); } }]
											}], items: [{ label: 'it4-3', autoclose: true, icon: '', action: () => { console.log('it4-3'); } }
												, { label: 'it4-4', autoclose: true, icon: '', action: () => { console.log('it4-4'); } }]
									}], items: [{ label: 'it3-3', autoclose: true, icon: '', action: () => { console.log('it3-3'); } }
										, { label: 'it3-4', autoclose: true, icon: '', action: () => { console.log('it3-4'); } }]
							}], items: [{ label: 'it2-3', autoclose: true, icon: '', action: () => { console.log('it2-3'); } }
								, { label: 'it2-4', autoclose: true, icon: '', action: () => { console.log('it2-4'); } }]
					}], items: [{ label: 'it1-1', autoclose: true, icon: '', action: () => { console.log('it1-1'); } }
						, { label: 'it1-2', autoclose: true, icon: '', action: () => { console.log('it1-2'); } }]
			};
			console.log(this.menuRoot);
		}*/
	openNextLevel() {
		if (this.currentLevel == 0) {
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
		}
	}
	backPreLevel() {
		//console.log('backPreLevel',this.currentLevel);
		if (this.currentLevel == 1) {
			this.level1style.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 2) {
			//console.log('this.level2style.width',this.level2style.width);
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
		}
	}
	hideMenu() {
		this.level1style.width = '0cm';
		this.level2style.width = '0cm';
		this.level3style.width = '0cm';
		this.level4style.width = '0cm';
		this.level5style.width = '0cm';
		this.currentLevel = 0;
	}
	moveSelection(level: number, row: number) {
		var div: HTMLElement = this.menu1content;
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
	}
	createFolderClick(idx: number) {
		return () => {
			this.moveSelection(this.currentLevel, idx);
			this.currentLevel++;
			if (this.currentLevel == 2) { this.selection1level = idx; this.open_2_level(); }
			if (this.currentLevel == 3) { this.selection2level = idx; this.open_3_level(); }
			if (this.currentLevel == 4) { this.selection3level = idx; this.open_4_level(); }
			if (this.currentLevel == 5) { this.selection4level = idx; this.open_5_level(); }
			//if (this.currentLevel == 5) { this.selection1level = nn; }

		};
	}
	createActionClick(nn: number, item: ZMenuItem) {
		return () => {

			//if (this.currentLevel == 1) { this.selection1level = this.menuRoot.folders.length + nn; }
			if (this.currentLevel == 1) { this.selection1level = nn; }
			//if (this.currentLevel == 2) { this.selection2level = this.menuRoot.folders[this.selection1level].folders.length + nn; }
			if (this.currentLevel == 2) { this.selection2level = nn; }
			//if (this.currentLevel == 3) { this.selection3level = this.menuRoot.folders[this.selection1level].folders[this.selection2level].folders.length + nn; }
			if (this.currentLevel == 3) { this.selection3level = nn; }
			//if (this.currentLevel == 4) { this.selection4level = this.menuRoot.folders[this.selection1level].folders[this.selection2level].folders[this.selection2level].folders.length + nn; }
			if (this.currentLevel == 5) { this.selection5level = nn; }
			//console.log(nn, item.label);
			if (item.autoclose) {
				this.hideMenu();
			} else {
				this.moveSelection(this.currentLevel, nn);
			}
			item.action();
		};
	}
	reFillMenulevel(menuContent: HTMLElement, subRoot: ZMenuFolder, selectedLevel: number) {
		//console.log(subRoot);
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
	open_1_level() {
		//console.log('open_1_level');
		this.menu1textHead.innerText = this.menuRoot.path;
		this.level1style.width = '8cm';
		this.reFillMenulevel(this.menu1content, this.menuRoot
			, this.selection1level);
		/*while (this.menu1content.lastChild) { this.menu1content.removeChild(this.menu1content.lastChild); }
		for (var i = 0; i < this.menuRoot.folders.length; i++) {
			var folder: ZMenuFolder = this.menuRoot.folders[i];
			var div = document.createElement('div');
			div.classList.add('menuFolderRow');
			div.id = 'menuFolder1-' + i;
			div.onclick = this.createFolderClick(i);
			div.innerText = folder.label;
			this.menu1content.appendChild(div);
			if (this.selection1level == i) {
				div.dataset['rowSelection'] = 'yes';
			} else {
				div.dataset['rowSelection'] = 'no';
			}
		}
		for (var i = 0; i < this.menuRoot.items.length; i++) {
			var item: ZMenuItem = this.menuRoot.items[i];
			var div: HTMLDivElement = document.createElement('div');
			div.classList.add('menuActionRow');
			div.id = 'menuItem1-' + i;
			div.onclick = this.createActionClick(this.menuRoot.folders.length + i, item);
			div.innerText = item.label;
			this.menu1content.appendChild(div);
			if (this.selection1level == this.menuRoot.folders.length + i) {
				div.dataset['rowSelection'] = 'yes';
			} else {
				div.dataset['rowSelection'] = 'no';
			}
		}*/
	}
	open_2_level() {
		//console.log('open_2_level');
		var folderIdx1 = this.selection1level - this.menuRoot.items.length;
		this.menu2textHead.innerText = this.menuRoot.folders[folderIdx1].path;
		this.menuRoot.folders[folderIdx1].afterOpen();
		this.level2style.width = '7.5cm';
		this.reFillMenulevel(this.menu2content, this.menuRoot.folders[folderIdx1], this.selection2level);
	}
	open_3_level() {
		//console.log('open_3_level');
		var folderIdx1 = this.selection1level - this.menuRoot.items.length;
		var folderIdx2 = this.selection2level - this.menuRoot.folders[folderIdx1].items.length;
		this.menuRoot.folders[folderIdx1].folders[folderIdx2].afterOpen();
		this.menu3textHead.innerText = this.menuRoot.folders[folderIdx1].folders[folderIdx2].path;
		this.level3style.width = '7.0cm';
		this.reFillMenulevel(this.menu3content, this.menuRoot.folders[folderIdx1].folders[folderIdx2], this.selection3level);
	}
	open_4_level() {
		//console.log('open_4_level');
		var folderIdx1 = this.selection1level - this.menuRoot.items.length;
		var folderIdx2 = this.selection2level - this.menuRoot.folders[folderIdx1].items.length;
		var folderIdx3 = this.selection3level - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
		this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].afterOpen();
		this.menu4textHead.innerText = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].path;
		this.level4style.width = '6.5cm';
		this.reFillMenulevel(this.menu4content, this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3], this.selection4level);

	}
	open_5_level() {
		//console.log('open_5_level');
		var folderIdx1 = this.selection1level - this.menuRoot.items.length;
		var folderIdx2 = this.selection2level - this.menuRoot.folders[folderIdx1].items.length;
		var folderIdx3 = this.selection3level - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
		var folderIdx4 = this.selection4level - this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].items.length;
		this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].afterOpen();
		this.menu5textHead.innerText = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].path;
		this.level5style.width = '6.0cm';
		this.reFillMenulevel(this.menu5content, this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4], this.selection5level);

	}
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
			this.muzXBox.currentSchedule.obverse = this.muzXBox.currentSchedule.tracks.length + fx;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upSongFxParam(fx: number, param: number): () => void {
		return () => {
			console.log('upSongFxParam', fx, param);
			this.muzXBox.currentSchedule.filters[fx].obverse = param;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrack(trk: number): () => void {
		return () => {
			console.log('upTrack', trk);
			//var tracks: ZvoogTrack[] = this.muzXBox.currentSchedule.tracks.splice(trk, 1);
			//this.muzXBox.currentSchedule.tracks.push(tracks[0]);
			this.muzXBox.currentSchedule.obverse = trk;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrackFx(trk: number, fx: number): () => void {
		return () => {
			console.log('upTrackFx', trk, fx);
			this.muzXBox.currentSchedule.tracks[trk].obverse = fx;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrackFxParam(trk: number, fx: number, param: number): () => void {
		return () => {
			this.muzXBox.currentSchedule.tracks[trk].filters[fx].obverse = param;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
			console.log('upTrackFxParam', trk, fx, param);
		};
	}

	upVox(trk: number, vox: number): () => void {
		return () => {
			console.log('upVox', trk, vox);
			this.muzXBox.currentSchedule.tracks[trk].obverse = vox;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxFx(trk: number, vox: number, fx: number): () => void {
		return () => {
			console.log('upVoxFx', trk, vox, fx);
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].obverse = fx + 1;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxFxParam(trk: number, vox: number, fx: number, param: number): () => void {
		return () => {
			console.log('upVoxFxParam', trk, vox, fx, param);
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].filters[fx].obverse = fx;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxProvider(trk: number, vox: number): () => void {
		return () => {
			console.log('upVoxProvider', trk, vox);
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].obverse = 0;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxProviderParam(trk: number, vox: number, param: number): () => void {
		return () => {
			console.log('upVoxProviderParam', trk, vox, param);
			this.muzXBox.currentSchedule.tracks[trk].voices[vox].performer.obverse = 0;
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
		};
	}
}
