type MenuInfo = {
	text: string;
	lightTitle?: boolean;
	noLocalization?: boolean;
	focused?: boolean;
	//opened?: boolean;
	children?: MenuInfo[];
	sid?: string;
	onClick?: () => void;
	onDrag?: (x: number, y: number) => void;
	onSubClick?: () => void;
	onFolderCloseOpen?: () => void;
	itemStates?: string[];
	selectedState?: number;
	//dragCircle?: boolean;
	//dragSquare?: boolean;
	//dragTriangle?: boolean;
	highlight?: string;
	menuTop?: number;
	url?: string;
	itemKind: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

let menuItemsData: MenuInfo[] | null = null;

let menuPointActions: MenuInfo = {
	text: localMenuActionsFolder
	, onFolderCloseOpen: () => {
		if (globalCommandDispatcher.cfg()) {
			if (menuPointActions.itemKind == kindClosedFolder) {
				globalCommandDispatcher.cfg().data.menuActions = true;
			} else {
				globalCommandDispatcher.cfg().data.menuActions = false;
			}
		}
	}
	, itemKind: kindClosedFolder
};
let menuPointStore: MenuInfo = {
	text: 'snippets'
	, onFolderCloseOpen: () => {
		if (globalCommandDispatcher.cfg()) {
			if (menuPointStore.itemKind == kindClosedFolder) {
				globalCommandDispatcher.cfg().data.menuClipboard = true;
			} else {
				globalCommandDispatcher.cfg().data.menuClipboard = false;
			}
		}
	}
	, itemKind: kindClosedFolder
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
	, onFolderCloseOpen: () => {
		if (globalCommandDispatcher.cfg()) {
			if (menuPointAddPlugin.itemKind == kindClosedFolder) {
				globalCommandDispatcher.cfg().data.menuPlugins = true;
			} else {
				globalCommandDispatcher.cfg().data.menuPlugins = false;
			}
		}
	}
	, itemKind: kindClosedFolder
};
let menuPointSettings: MenuInfo = {
	text: localMenuItemSettings, onFolderCloseOpen: () => {
		if (globalCommandDispatcher.cfg()) {
			if (menuPointSettings.itemKind == kindClosedFolder) {
				globalCommandDispatcher.cfg().data.menuSettings = true;
			} else {
				globalCommandDispatcher.cfg().data.menuSettings = false;
			}
		}
	}, children: [
		{
			text: localMenuNewEmptyProject, onClick: () => {
				globalCommandDispatcher.newEmptyProject();
			}, itemKind: kindAction
		}, {
			text: 'Size', children: [
				{
					text: 'Small', onClick: () => {
						startLoadCSSfile('theme/sizesmall.css');
						globalCommandDispatcher.changeTapSize(1);
					}, itemKind: kindAction
				}, {
					text: 'Big', onClick: () => {
						startLoadCSSfile('theme/sizebig.css');
						globalCommandDispatcher.changeTapSize(1.5);
					}
					, itemKind: kindAction
				}, {
					text: 'Huge', onClick: () => {
						startLoadCSSfile('theme/sizehuge.css');
						globalCommandDispatcher.changeTapSize(4);
					}
					, itemKind: kindAction
				}

			], itemKind: kindClosedFolder
		}, {
			text: 'Colors', children: [
				{
					text: 'Minium', onClick: () => {
						globalCommandDispatcher.setThemeColor('red1');//'theme/colordarkred.css');
					}, itemKind: kindAction
				}, {
					text: 'Greenstone', onClick: () => {
						globalCommandDispatcher.setThemeColor('green1');//'theme/colordarkgreen.css');
					}, itemKind: kindAction
				}, {
					text: 'Deep', onClick: () => {
						globalCommandDispatcher.setThemeColor('blue1');//'theme/colordarkblue.css');
					}, itemKind: kindAction
				}, {
					text: 'Neon', onClick: () => {
						globalCommandDispatcher.setThemeColor('neon1');
					}, itemKind: kindAction
				}
				, {
					text: 'Gjel', onClick: () => {
						globalCommandDispatcher.setThemeColor('light1');
					}, itemKind: kindAction
				}
				, {
					text: 'Vorot', onClick: () => {
						globalCommandDispatcher.setThemeColor('light2');
					}, itemKind: kindAction
				}
				, {
					text: 'Bereza', onClick: () => {
						globalCommandDispatcher.setThemeColor('light3');
					}, itemKind: kindAction
				}
			], itemKind: kindClosedFolder
		}, {
			text: 'Language', children: [
				{
					text: 'Russian', onClick: () => {
						globalCommandDispatcher.setThemeLocale('ru', 1);
					}, itemKind: kindAction
				}, {
					text: 'English', onClick: () => {
						globalCommandDispatcher.setThemeLocale('en', 1);
					}, itemKind: kindAction
				}, {
					text: 'kitaiskiy', onClick: () => {
						globalCommandDispatcher.setThemeLocale('zh', 1.5);
					}, itemKind: kindAction
				}
			], itemKind: kindClosedFolder
		}
		, {
			text: 'other', children: [{
				text: localMenuClearUndoRedo, onClick: () => {
					globalCommandDispatcher.clearUndo();
					globalCommandDispatcher.clearRedo();
				}, itemKind: kindAction
			}, {
				text: 'Plugindebug', onClick: () => {
					globalCommandDispatcher.promptPluginInfoDebug();
				}, itemKind: kindAction
			}
			], itemKind: kindClosedFolder
		}
	], itemKind: kindClosedFolder
};
/*
let menuPointInsTracks: MenuInfo = {
	text: localMenuInsTracksFolder
	, onFolderCloseOpen: () => {
		if (globalCommandDispatcher.cfg()) {
			if (menuPointInsTracks.itemKind == kindClosedFolder) {
				globalCommandDispatcher.cfg().data.menuPerformers = true;
			} else {
				globalCommandDispatcher.cfg().data.menuPerformers = false;
			}
		}
	}, itemKind: kindClosedFolder
};
let menuPointDrumTracks: MenuInfo = {
	text: localMenuDrumTracksFolder
	, onFolderCloseOpen: () => {
		if (globalCommandDispatcher.cfg()) {
			if (menuPointDrumTracks.itemKind == kindClosedFolder) {
				globalCommandDispatcher.cfg().data.menuSamplers = true;
			} else {
				globalCommandDispatcher.cfg().data.menuSamplers = false;
			}
		}
	}
	, itemKind: kindClosedFolder
};
let menuPointFxTracks: MenuInfo = {
	text: localMenuFxTracksFolder
	, onFolderCloseOpen: () => {
		if (globalCommandDispatcher.cfg()) {
			if (menuPointFxTracks.itemKind == kindClosedFolder) {
				globalCommandDispatcher.cfg().data.menuFilters = true;
			} else {
				globalCommandDispatcher.cfg().data.menuFilters = false;
			}
		}
	}
	, itemKind: kindClosedFolder
};
*/

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
	menuPointStore.children = [];
	menuPointStore.children.push({
		text: 'fragment 1'
		, noLocalization: true
		, onClick: () => {
			console.log('click');
		}
		, onSubClick: () => {
			console.log('subclick');
		}
		, url: 'url main 1'
		, itemKind: kindPreview
	});
	for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
		let label: string = MZXBX_currentPlugins()[ii].label;
		let purpose: string = MZXBX_currentPlugins()[ii].purpose;
		//console.log(ii,purpose,label);
		if (purpose == 'Action') {
			menuPointActions.children.push({
				text: label, noLocalization: true, onClick: () => {
					globalCommandDispatcher.actionPluginDialog.openActionPluginDialogFrame(MZXBX_currentPlugins()[ii]);
				}
				, itemKind: kindAction
			});
		} else {
			if (purpose == 'Sampler') {
				let dragStarted = false;
				let info: MenuInfo;
				info = {
					//dragTriangle: true
					//, 
					text: label

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
									globalCommandDispatcher.adjustTimelineContent();
								});
							} else {
								globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
							}
						} else {
							let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
							let ss = globalCommandDispatcher.renderer.menu.scrollY;
							let tt = info.menuTop ? info.menuTop : 0;
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
					, itemKind: kindDraggableTriangle
				};
				menuPointAddPlugin.children.push(info);
			} else {
				if (purpose == 'Performer') {
					let dragStarted = false;
					let info: MenuInfo;
					info = {
						//dragSquare: true
						//, 
						text: label
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
										globalCommandDispatcher.adjustTimelineContent();
									});
								} else {
									globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
								}
							} else {
								let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
								let ss = globalCommandDispatcher.renderer.menu.scrollY;
								let tt = info.menuTop ? info.menuTop : 0;
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
						, itemKind: kindDraggableSquare
					};
					menuPointAddPlugin.children.push(info);
				} else {
					if (purpose == 'Filter') {
						let dragStarted = false;
						let info: MenuInfo;
						info = {
							//dragCircle: true
							//,
							text: label
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
										globalCommandDispatcher.adjustTimelineContent();
									} else {
										globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
									}
								} else {
									let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
									let ss = globalCommandDispatcher.renderer.menu.scrollY;
									let tt = info.menuTop ? info.menuTop : 0;
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
							, itemKind: kindDraggableCircle
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
			//menuPointInsTracks
			//, menuPointDrumTracks
			//, menuPointFxTracks
			//, 
			menuPointActions
			, menuPointAddPlugin
			, menuPointStore
			, menuPointSettings
			/*, {
				text: localMenuNewPlugin, children: [

					menuPointFilters
					, menuPointPerformers
					, menuPointSamplers
				]
			}*/
			/*, {
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
							globalCommandDispatcher.promptMeterForSelectedBars()
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
			}*/
			/*
			, {
				text: localMenuItemSettings, children: [
					{
						text: localMenuNewEmptyProject, onClick: () => {
							globalCommandDispatcher.newEmptyProject();
						}
						, itemKind: kindAction
					}
					,
					{
						text: 'Size', children: [
							{
								text: 'Small', onClick: () => {
									startLoadCSSfile('theme/sizesmall.css');
									globalCommandDispatcher.changeTapSize(1);
								}
								, itemKind: kindAction
							}, {
								text: 'Big', onClick: () => {
									startLoadCSSfile('theme/sizebig.css');
									globalCommandDispatcher.changeTapSize(1.5);
								}
								, itemKind: kindAction
							}, {
								text: 'Huge', onClick: () => {
									startLoadCSSfile('theme/sizehuge.css');
									globalCommandDispatcher.changeTapSize(4);
								}
								, itemKind: kindAction
							}

						], itemKind: kindClosedFolder
					}, {
						text: 'Colors', children: [
							{
								text: 'Minium', onClick: () => {
									globalCommandDispatcher.setThemeColor('red1');//'theme/colordarkred.css');
								}
								, itemKind: kindAction
							}, {
								text: 'Greenstone', onClick: () => {
									globalCommandDispatcher.setThemeColor('green1');//'theme/colordarkgreen.css');
								}
								, itemKind: kindAction
							}, {
								text: 'Deep', onClick: () => {
									globalCommandDispatcher.setThemeColor('blue1');//'theme/colordarkblue.css');
								}
								, itemKind: kindAction
							}, {
								text: 'Neon', onClick: () => {
									globalCommandDispatcher.setThemeColor('neon1');
								}
								, itemKind: kindAction
							}
							, {
								text: 'Gjel', onClick: () => {
									globalCommandDispatcher.setThemeColor('light1');
								}
								, itemKind: kindAction
							}
							, {
								text: 'Vorot', onClick: () => {
									globalCommandDispatcher.setThemeColor('light2');
								}
								, itemKind: kindAction
							}
						], itemKind: kindClosedFolder
					}, {
						text: 'Language', children: [
							{
								text: 'Russian', onClick: () => {
									globalCommandDispatcher.setThemeLocale('ru', 1);
								}
								, itemKind: kindAction
							}, {
								text: 'English', onClick: () => {
									globalCommandDispatcher.setThemeLocale('en', 1);
								}
								, itemKind: kindAction
							}, {
								text: 'kitaiskiy', onClick: () => {
									globalCommandDispatcher.setThemeLocale('zh', 1.5);
								}
								, itemKind: kindAction
							}
						], itemKind: kindClosedFolder
					}
					, {
						text: 'other', children: [{
							text: localMenuClearUndoRedo, onClick: () => {
								globalCommandDispatcher.clearUndo();
								globalCommandDispatcher.clearRedo();
							}
							, itemKind: kindAction
						}, {
							text: 'Plugindebug', onClick: () => {
								globalCommandDispatcher.promptPluginInfoDebug();
							}
							, itemKind: kindAction
						}
						], itemKind: kindClosedFolder
					}
				], itemKind: kindClosedFolder
			}
*/
		];
		return menuItemsData;
	}
}