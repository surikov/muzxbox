type MenuInfo = {
	text: string;
	lightTitle?: boolean;
	noLocalization?: boolean;
	focused?: boolean;
	opened?: boolean;
	children?: MenuInfo[];
	sid?: string;
	onClick?: () => void;
	onDrag?: (x: number, y: number) => void;
	onSubClick?: () => void;
	onFolderOpen?: () => void;
	itemStates?: string[];
	selectedState?: number;
	dragCircle?: boolean;
	dragSquare?: boolean;
	dragTriangle?: boolean;
	highlight?: string;
	top?: number;
};

let menuItemsData: MenuInfo[] | null = null;

let menuPointActions: MenuInfo = {
	text: localMenuActionsFolder
	, onFolderOpen: () => {
		//console.log('actions');
	}
};
/*
let menuPointPerformers: MenuInfo = {
	text: localMenuPerformersFolder
	, onFolderOpen: () => {
		//console.log('performers');
	}
};*/
/*
let menuPointFilters: MenuInfo = {
	text: localMenuFiltersFolder
	, onFolderOpen: () => {
		//console.log('filters');
	}

};*/
/*
let menuPointSamplers: MenuInfo = {
	text: localMenuSamplersFolder
	, onFolderOpen: () => {
		//console.log('samplers');
	}
};*/
let menuPointAddPlugin: MenuInfo = {
	text: localMenuNewPlugin
	, onFolderOpen: () => {
		//console.log('samplers');
	}
};

let menuPointInsTracks: MenuInfo = {
	text: localMenuInsTracksFolder
	, onFolderOpen: () => {
		//console.log('samplers');
	}
};
let menuPointDrumTracks: MenuInfo = {
	text: localMenuDrumTracksFolder
	, onFolderOpen: () => {
		//console.log('samplers');
	}
};
let menuPointFxTracks: MenuInfo = {
	text: localMenuFxTracksFolder
	, onFolderOpen: () => {
		//console.log('samplers');
	}
};

/*
let menuPlayStop: MenuInfo = {
	text: localMenuPlay
	, onClick: () => {
		//console.log('start/stop');
		globalCommandDispatcher.toggleStartStop();
		menuItemsData = null;
	}
};*/
function fillPluginsLists() {
	//console.log('fillPluginsLists');
	//menuPointFilters.children = [];
	//menuPointPerformers.children = [];
	//menuPointSamplers.children = [];
	menuPointAddPlugin.children = [];
	menuPointActions.children = [];
	for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
		let label: string = MZXBX_currentPlugins()[ii].label;
		let purpose: string = MZXBX_currentPlugins()[ii].purpose;
		//console.log(ii,purpose,label);
		if (purpose == 'Action') {
			menuPointActions.children.push({
				text: label, noLocalization: true, onClick: () => {
					globalCommandDispatcher.actionPluginDialog.openActionPluginDialogFrame(MZXBX_currentPlugins()[ii]);
				}
			});
		} else {
			if (purpose == 'Sampler') {
				let dragStarted = false;
				let info: MenuInfo;
				info = {
					dragTriangle: true
					, text: label

					, noLocalization: true
					, onDrag: (x: number, y: number) => {
						if (dragStarted) {
							if (x == 0 && y == 0) {
								dragStarted = false;
								let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
								globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
									globalCommandDispatcher.cfg().data.percussions.push({
										sampler: {
											id: '' + Math.random()
											, kind: MZXBX_currentPlugins()[ii].kind
											, data: ''
											, outputs: ['']
											, iconPosition: newPos
											, state: 0
										}
										, measures: []
										, title: MZXBX_currentPlugins()[ii].label
									});
								});
							} else {
								globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
							}
						} else {
							let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
							let ss = globalCommandDispatcher.renderer.menu.scrollY;
							let tt = info.top ? info.top : 0;
							let yy = (tt + ss - 0.0) * zz;
							let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
							dragStarted = true;
							globalCommandDispatcher.hideRightMenu();
							let sz = 1;

							let tri: TilePolygon = {
								x: 0
								, y: 0
								, dots: [0, 0, sz * 2 * 0.8 * 0.9, sz * 0.9, 0, sz * 2 * 0.9]
								, css: 'rectangleDragItem'
							};
							globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, tri);
							/*globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, {
								x: 0, y: 0
								, w: sz, h: sz
								, rx: sz / 2, ry: sz / 2
								, css: 'rectangleDragItem'
							});*/

						}
					}
				};
				menuPointAddPlugin.children.push(info);
			} else {
				if (purpose == 'Performer') {
					let dragStarted = false;
					let info: MenuInfo;
					info = {
						dragSquare: true
						, text: label
						, noLocalization: true
						, onDrag: (x: number, y: number) => {
							if (dragStarted) {
								if (x == 0 && y == 0) {
									dragStarted = false;
									let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
									globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
										globalCommandDispatcher.cfg().data.tracks.push({
											performer: {
												id: '' + Math.random()
												, kind: MZXBX_currentPlugins()[ii].kind
												, data: ''
												, outputs: ['']
												, iconPosition: newPos
												, state: 0
											}
											, measures: []
											, title: MZXBX_currentPlugins()[ii].label
										});
									});
								} else {
									globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
								}
							} else {
								let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
								let ss = globalCommandDispatcher.renderer.menu.scrollY;
								let tt = info.top ? info.top : 0;
								let yy = (tt + ss - 0.0) * zz;
								let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
								dragStarted = true;
								globalCommandDispatcher.hideRightMenu();
								let sz = 1;
								globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, {
									x: 0, y: 0
									, w: sz, h: sz
									, rx: sz / 20, ry: sz / 20
									, css: 'rectangleDragItem'
								});
							}
						}
					};
					menuPointAddPlugin.children.push(info);
				} else {
					if (purpose == 'Filter') {
						let dragStarted = false;
						let info: MenuInfo;
						info = {
							dragCircle: true
							, text: label
							, noLocalization: true
							, onDrag: (x: number, y: number) => {
								if (dragStarted) {
									if (x == 0 && y == 0) {
										dragStarted = false;
										let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
										globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
											globalCommandDispatcher.cfg().data.filters.push({
												id: '' + Math.random()
												, kind: MZXBX_currentPlugins()[ii].kind
												, data: ''
												, outputs: ['']
												, automation: []
												, iconPosition: newPos
												, state: 0
												, title: MZXBX_currentPlugins()[ii].label
											});
										});
									} else {
										globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
									}
								} else {
									let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
									let ss = globalCommandDispatcher.renderer.menu.scrollY;
									let tt = info.top ? info.top : 0;
									let yy = (tt + ss - 0.0) * zz;
									let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
									dragStarted = true;
									globalCommandDispatcher.hideRightMenu();
									let sz = 1;
									globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, {
										x: 0, y: 0
										, w: sz, h: sz
										, rx: sz / 2, ry: sz / 2
										, css: 'rectangleDragItem'
									});
								}
							}
						};
						menuPointAddPlugin.children.push(info);
					} else {
						console.log('unknown plugin kind');
					}
				}
			}
		}
	}
}

function composeBaseMenu(): MenuInfo[] {
	/*menuPlayStop.text = localMenuPlay;
	if (globalCommandDispatcher.player) {
		if (
			(globalCommandDispatcher.player.playState().play)
			|| (globalCommandDispatcher.player.playState().loading)
		) {
			menuPlayStop.text = localMenuPause;
		}
	}*/
	if (menuItemsData) {
		return menuItemsData;
	} else {
		fillPluginsLists();
		menuItemsData = [
			//menuPlayStop
			menuPointInsTracks
			, menuPointDrumTracks
			, menuPointFxTracks
			, menuPointActions
			, menuPointAddPlugin
			/*, {
				text: localMenuNewPlugin, children: [

					menuPointFilters
					, menuPointPerformers
					, menuPointSamplers
				]
			}*/
			, {
				text: 'Selection', children: [
					{
						text: 'Delete bars', onClick: () => {
							globalCommandDispatcher.dropSelectedBars();
						}
					}, {
						text: 'Insert bars', onClick: () => {
							globalCommandDispatcher.insertAfterSelectedBars();
						}

					}, {
						text: 'Change tempo', onClick: () => {
							globalCommandDispatcher.promptTempoForSelectedBars()
						}
					}, {
						text: 'Change meter', onClick: () => {
							//
						}
					}, {
						text: 'Recalculate meter', onClick: () => {
							//
						}
					}, {
						text: 'Copy visibled items', onClick: () => {
							//
						}
					}, {
						text: 'Cut visibled items', onClick: () => {
							//
						}
					}, {
						text: 'Paste', onClick: () => {
							//
						}
					}, {

						text: 'Align to 32th', onClick: () => {
							//
						}
					}
				]
			}
			, {
				text: localMenuItemSettings, children: [
					{
						text: 'Size', children: [
							{
								text: 'Small', onClick: () => {
									startLoadCSSfile('theme/sizesmall.css');
									globalCommandDispatcher.changeTapSize(1);
								}
							}, {
								text: 'Big', onClick: () => {
									startLoadCSSfile('theme/sizebig.css');
									globalCommandDispatcher.changeTapSize(1.5);
								}
							}, {
								text: 'Huge', onClick: () => {
									startLoadCSSfile('theme/sizehuge.css');
									globalCommandDispatcher.changeTapSize(4);
								}
							}
						]
					}, {
						text: 'Colors', children: [
							{
								text: 'Minium', onClick: () => {
									globalCommandDispatcher.setThemeColor('red1');//'theme/colordarkred.css');
								}
							}, {
								text: 'Greenstone', onClick: () => {
									globalCommandDispatcher.setThemeColor('green1');//'theme/colordarkgreen.css');
								}
							}, {
								text: 'Deep', onClick: () => {
									globalCommandDispatcher.setThemeColor('blue1');//'theme/colordarkblue.css');
								}
							}, {
								text: 'Neon', onClick: () => {
									globalCommandDispatcher.setThemeColor('neon1');
								}
							}
							, {
								text: 'Gjel', onClick: () => {
									globalCommandDispatcher.setThemeColor('light1');
								}
							}
							, {
								text: 'Vorot', onClick: () => {
									globalCommandDispatcher.setThemeColor('light2');
								}
							}
						]
					}, {
						text: 'Language', children: [
							{
								text: 'Russian', onClick: () => {
									globalCommandDispatcher.setThemeLocale('ru', 1);
								}
							}, {
								text: 'English', onClick: () => {
									globalCommandDispatcher.setThemeLocale('en', 1);
								}
							}, {
								text: 'kitaiskiy', onClick: () => {
									globalCommandDispatcher.setThemeLocale('zh', 1.5);
								}
							}
						]
					}
					, {
						text: 'other', children: [{
							text: localMenuClearUndoRedo, onClick: () => {
								globalCommandDispatcher.clearUndo();
								globalCommandDispatcher.clearRedo();
							}
						}, {
							text: 'Plugindebug', onClick: () => {
								globalCommandDispatcher.promptPluginInfoDebug();
							}
						}]
					}
				]
			}

		];
		return menuItemsData;
	}
}