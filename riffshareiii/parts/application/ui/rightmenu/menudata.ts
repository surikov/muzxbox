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
/*
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
*/
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
let copyToClipboard: MenuInfo = {
	text: 'copy vis', onClick: () => {
		globalCommandDispatcher.copySelectionToClipboard()
	}, itemKind: kindAction
};
let menuPointClipboard: MenuInfo = {
	text: localMenuClipboard
	, onFolderCloseOpen: () => {
		if (menuPointClipboard.itemKind == kindClosedFolder) {
			globalCommandDispatcher.cfg().data.menuClipboard = true;
		} else {
			globalCommandDispatcher.cfg().data.menuClipboard = false;
		}
	}
	, itemKind: kindClosedFolder
	, children: [copyToClipboard]
};
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
		/*{
			text: localMenuNewEmptyProject, onClick: () => {
				globalCommandDispatcher.newEmptyProject();
			}, itemKind: kindAction
		}, */{
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
function findNearestFilterByKind(idx: number, kind: string): Zvoog_FilterTarget {
	let nearest = 987654;
	if (globalCommandDispatcher.cfg().data.filters[idx].kind == kind) {
		nearest = idx;
	}
	for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
		if (globalCommandDispatcher.cfg().data.filters[ii].kind == kind) {
			if (Math.abs(nearest - ii) < nearest) {
				nearest = ii;
			}
		}
	}

	return globalCommandDispatcher.cfg().data.filters[nearest];

}
function fillClipboardList() {
	//console.log('fillClipboardList', globalCommandDispatcher.clipboard);
	menuPointClipboard.children = [copyToClipboard];
	if (globalCommandDispatcher.clipboardData) {
		let noSolo = true;
		for (let ii = 0; ii < globalCommandDispatcher.clipboardData.tracks.length; ii++) {
			let track = globalCommandDispatcher.clipboardData.tracks[ii];
			if (track.performer.state == 2) {
				noSolo = false;
				break;
			}
		}
		for (let ii = 0; ii < globalCommandDispatcher.clipboardData.percussions.length; ii++) {
			let percussion = globalCommandDispatcher.clipboardData.percussions[ii];
			if (percussion.sampler.state == 2) {
				noSolo = false;
				break;
			}
		}

		let mm: Zvoog_MetreMathType = MMUtil();
		let pasteWidth = 0;
		for (let ii = 0; ii < globalCommandDispatcher.clipboardData.timeline.length; ii++) {
			let timebar = globalCommandDispatcher.clipboardData.timeline[ii];
			if (!(timebar)) {
				timebar = { tempo: 120, metre: { count: 4, part: 4 } }
			}
			pasteWidth = pasteWidth + mm.set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
		}


		for (let ii = 0; ii < globalCommandDispatcher.clipboardData.tracks.length; ii++) {
			let track = globalCommandDispatcher.clipboardData.tracks[ii];
			if ((track.performer.state == 0 && noSolo) || track.performer.state == 2) {
				let empty = true;
				for (let kk = 0; kk < track.measures.length; kk++) {
					if (track.measures[kk].chords.length > 0) {
						empty = false;
						break;
					}
				}
				if (!empty) {
					let info: MenuInfo = { text: track.title, noLocalization: true, itemKind: kindDraggableSquare };
					let tri: TileRectangle = { x: 0, y: 0, w: 11, h: 1, css: 'pasteDragItem' };
					let dragger: DragMenuItemUtil = new DragMenuItemUtil(tri, info, (xx: number, yy: number) => {
						let startX = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
						let mm: Zvoog_MetreMathType = MMUtil();
						let barIdx: number = globalCommandDispatcher.cfg().data.timeline.length - 1;
						let ww = 0;
						for (let jj = 0; jj < globalCommandDispatcher.cfg().data.timeline.length; jj++) {
							let timebar = globalCommandDispatcher.cfg().data.timeline[jj];
							ww = ww + mm.set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
							if (xx + startX < ww) {
								barIdx = jj;
								break;
							}
						}
						//console.log('dnd percussion', barIdx, yy);
						let nearIdx = globalCommandDispatcher.cfg().data.farorder[0];
						let to = globalCommandDispatcher.cfg().data.tracks[nearIdx].measures;
						globalCommandDispatcher.exe.commitProjectChanges(['tracks', nearIdx], () => {
							if (globalCommandDispatcher.clipboardData) {

								for (let pp = 0; pp < globalCommandDispatcher.clipboardData.timeline.length; pp++) {
									let from = track.measures[pp];
									for (let tt = 0; tt < from.chords.length; tt++) {
										if (from.chords[tt]) {
											let fromChord = JSON.parse(JSON.stringify(from.chords[tt]));
											to[barIdx].chords.push(fromChord);
										}
									}
								}
							}
							globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
						});
					}, (zz: number) => {
						tri.h = 12 * globalCommandDispatcher.cfg().notePathHeight * globalCommandDispatcher.cfg().octaveDrawCount / zz;
						tri.w = pasteWidth / zz;
					});
					info.onDrag = dragger.doDrag.bind(dragger);
					menuPointClipboard.children.push(info);
				}
			}
		}
		for (let ii = 0; ii < globalCommandDispatcher.clipboardData.percussions.length; ii++) {
			let percussion = globalCommandDispatcher.clipboardData.percussions[ii];
			if ((percussion.sampler.state == 0 && noSolo) || percussion.sampler.state == 2) {
				let empty = true;
				for (let kk = 0; kk < percussion.measures.length; kk++) {
					if (percussion.measures[kk].skips.length > 0) {
						empty = false;
						break;
					}
				}
				if (!empty) {
					let info: MenuInfo = { text: percussion.title, noLocalization: true, itemKind: kindDraggableTriangle };
					let tri: TileRectangle = { x: 0, y: 0, w: 11, h: 1, css: 'pasteDragItem' };
					let dragger: DragMenuItemUtil = new DragMenuItemUtil(tri, info, (xx: number, yy: number) => {
						let startX = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
						let mm: Zvoog_MetreMathType = MMUtil();
						let barIdx: number = globalCommandDispatcher.cfg().data.timeline.length - 1;
						let ww = 0;
						for (let jj = 0; jj < globalCommandDispatcher.cfg().data.timeline.length; jj++) {
							let timebar = globalCommandDispatcher.cfg().data.timeline[jj];
							ww = ww + mm.set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
							if (xx + startX < ww) {
								barIdx = jj;
								break;
							}
						}
						let startY = Math.round((yy - globalCommandDispatcher.cfg().padGrid2Sampler - globalCommandDispatcher.cfg().gridHeight()) / globalCommandDispatcher.cfg().samplerDotHeight);
						if (startY < 0) {
							startY = 0;
						}
						if (startY > globalCommandDispatcher.cfg().data.percussions.length - 1) {
							startY = globalCommandDispatcher.cfg().data.percussions.length - 1;
						}
						let to = globalCommandDispatcher.cfg().data.percussions[startY].measures;
						globalCommandDispatcher.exe.commitProjectChanges(['percussions', startY], () => {
							if (globalCommandDispatcher.clipboardData) {

								for (let pp = 0; pp < globalCommandDispatcher.clipboardData.timeline.length; pp++) {
									let from = percussion.measures[pp];
									for (let tt = 0; tt < from.skips.length; tt++) {
										if (from.skips[tt]) {
											let fromIt = JSON.parse(JSON.stringify(from.skips[tt]));
											to[barIdx].skips.push(fromIt);
										}
									}
								}
							}
							globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
						});
					}, (zz: number) => {
						tri.h = globalCommandDispatcher.cfg().samplerDotHeight / zz;
						tri.w = pasteWidth / zz;
					});
					info.onDrag = dragger.doDrag.bind(dragger);
					menuPointClipboard.children.push(info);
					/*menuPointClipboard.children.push({
						text: percussion.title
						, noLocalization: true
						, onDrag: () => {
							console.log('onDrag', percussion.title);
						}
						, itemKind: kindDraggableTriangle
					});*/
				}
			}
		}
		for (let ii = 0; ii < globalCommandDispatcher.clipboardData.filters.length; ii++) {
			let filter = globalCommandDispatcher.clipboardData.filters[ii];
			if (filter.state == 0) {
				let empty = true;
				for (let kk = 0; kk < filter.automation.length; kk++) {
					if (filter.automation[kk].changes.length > 0) {
						empty = false;
						break;
					}
				}
				if (!empty) {
					let info: MenuInfo = { text: filter.title, noLocalization: true, itemKind: kindDraggableCircle };
					let tri: TileRectangle = { x: 0, y: 0, w: 11, h: 1, css: 'pasteDragItem' };
					let dragger: DragMenuItemUtil = new DragMenuItemUtil(tri, info, (xx: number, yy: number) => {








						let startX = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
						let mm: Zvoog_MetreMathType = MMUtil();
						let barIdx: number = globalCommandDispatcher.cfg().data.timeline.length - 1;
						let ww = 0;
						for (let jj = 0; jj < globalCommandDispatcher.cfg().data.timeline.length; jj++) {
							let timebar = globalCommandDispatcher.cfg().data.timeline[jj];
							ww = ww + mm.set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
							if (xx + startX < ww) {
								barIdx = jj;
								break;
							}
						}
						let startY = Math.round((yy
							- globalCommandDispatcher.cfg().padGrid2Sampler
							- globalCommandDispatcher.cfg().gridHeight()
							- globalCommandDispatcher.cfg().padSampler2Automation
							- globalCommandDispatcher.cfg().data.percussions.length * globalCommandDispatcher.cfg().samplerDotHeight

						) / globalCommandDispatcher.cfg().autoPointHeight);
						if (startY < 0) {
							startY = 0;
						}
						if (startY > globalCommandDispatcher.cfg().data.filters.length - 1) {
							startY = globalCommandDispatcher.cfg().data.filters.length - 1;
						}
						//let pasteTo = globalCommandDispatcher.cfg().data.filters[startY];
						let pasteTo = findNearestFilterByKind(startY, filter.kind);
						//console.log(filter,pasteTo);
						if (pasteTo.kind == filter.kind) {
							let to = pasteTo.automation;
							globalCommandDispatcher.exe.commitProjectChanges(['filters', startY], () => {
								if (globalCommandDispatcher.clipboardData) {
									for (let pp = 0; pp < globalCommandDispatcher.clipboardData.timeline.length; pp++) {
										let from = filter.automation[pp];
										for (let tt = 0; tt < from.changes.length; tt++) {
											if (from.changes[tt]) {
												let fromIt = JSON.parse(JSON.stringify(from.changes[tt]));
												to[barIdx].changes.push(fromIt);
											}
										}
									}
								}
								globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
							});

						}






					}, (zz: number) => {
						tri.h = globalCommandDispatcher.cfg().autoPointHeight / zz;
						tri.w = pasteWidth / zz;
					});
					info.onDrag = dragger.doDrag.bind(dragger);
					menuPointClipboard.children.push(info);
				}
			}
		}
	}
}
class DragMenuItemUtil {
	dragStarted: boolean;
	dragItem: TileItem;
	info: MenuInfo
	onDone: (xx: number, yy: number) => void;
	onPluck: null | ((zz: number) => void) = null;
	constructor(dragItem: TileItem, info: MenuInfo, onDone: (xx: number, yy: number) => void, onPluck?: (zz: number) => void) {
		this.dragStarted = false;
		this.dragItem = dragItem;
		this.info = info;
		this.onDone = onDone;
		//console.log(this);
		if (onPluck) {
			this.onPluck = onPluck;
		}
	}
	doDrag(x: number, y: number) {
		if (!this.dragStarted) {
			//console.log(this);
			let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
			let ss = globalCommandDispatcher.renderer.menu.scrollY;
			let tt = this.info.menuTop ? this.info.menuTop : 0;
			let yy = (tt + ss - 0.0) * zz;
			let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
			this.dragStarted = true;
			globalCommandDispatcher.hideRightMenu();
			if (this.onPluck) {
				this.onPluck(zz);
			}
			globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, this.dragItem);
		}
		globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
		if (x == 0 && y == 0) {
			let pos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
			//let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
			//let dx = globalCommandDispatcher.renderer.menu.dragItemX * zz;
			//let dy = globalCommandDispatcher.renderer.menu.dragItemY * zz;
			this.onDone(pos.x, pos.y);
			//console.log(globalCommandDispatcher.renderer.menu.dragItemX,globalCommandDispatcher.renderer.menu.dragItemY);
		}
	}
}
function fillPluginsLists() {
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
				, itemKind: kindAction
			});
		} else {
			if (purpose == 'Sampler') {
				let info: MenuInfo = { text: label, noLocalization: true, itemKind: kindDraggableTriangle };
				let tri: TilePolygon = { x: 0, y: 0, dots: [0, 0, 2 * 0.8 * 0.9, 0.9, 0, 2 * 0.9], css: 'rectangleDragItem' };
				let dragger: DragMenuItemUtil = new DragMenuItemUtil(tri, info, (xx: number, yy: number) => {
					//let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
					globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
						globalCommandDispatcher.cfg().data.percussions.push({
							sampler: {
								id: '' + Math.random()
								, kind: MZXBX_currentPlugins()[ii].kind
								, data: ''
								, outputs: ['']
								, iconPosition: { x: xx, y: yy }
								, state: 0
							}
							, measures: []
							, title: MZXBX_currentPlugins()[ii].label
						});
						globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
					});
				});
				info.onDrag = dragger.doDrag.bind(dragger);
				menuPointAddPlugin.children.push(info);
				/*let dragStarted = false;
				let info: MenuInfo;
				info = {
					text: label
					, noLocalization: true
					, onDrag: (x: number, y: number) => {
						if (!dragStarted) {
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
						}
						globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
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
								globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
							});
						}
					}
					, itemKind: kindDraggableTriangle
				};
				menuPointAddPlugin.children.push(info);*/
			} else {
				if (purpose == 'Performer') {

					let info: MenuInfo = { text: label, noLocalization: true, itemKind: kindDraggableSquare };
					let square: TileRectangle = {
						x: 0, y: 0
						, w: 1, h: 1
						, rx: 1 / 20, ry: 1 / 20
						, css: 'rectangleDragItem'
					};
					let dragger: DragMenuItemUtil = new DragMenuItemUtil(square, info, (xx: number, yy: number) => {
						//let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
						globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
							globalCommandDispatcher.cfg().data.tracks.push({
								performer: {
									id: '' + Math.random()
									, kind: MZXBX_currentPlugins()[ii].kind
									, data: ''
									, outputs: ['']
									, iconPosition: { x: xx, y: yy }
									, state: 0
								}
								, measures: []
								, title: MZXBX_currentPlugins()[ii].label
							});
							globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
						});
					});
					info.onDrag = dragger.doDrag.bind(dragger);
					menuPointAddPlugin.children.push(info);
					/*
										let dragStarted = false;
										let info: MenuInfo;
										info = {
											text: label
											, noLocalization: true
											, onDrag: (x: number, y: number) => {
												if (!dragStarted) {
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
												globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
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
														globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
													});
												}
											}
											, itemKind: kindDraggableSquare
										};
										menuPointAddPlugin.children.push(info);*/
				} else {
					if (purpose == 'Filter') {
						let info: MenuInfo = { text: label, noLocalization: true, itemKind: kindDraggableCircle };
						let circle: TileRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 1 / 2, ry: 1 / 2, css: 'rectangleDragItem' };
						let dragger: DragMenuItemUtil = new DragMenuItemUtil(circle, info, (xx: number, yy: number) => {
							//let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
							globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
								globalCommandDispatcher.cfg().data.filters.push({
									id: '' + Math.random()
									, kind: MZXBX_currentPlugins()[ii].kind
									, data: ''
									, outputs: ['']
									, automation: []
									, iconPosition: { x: xx, y: yy }
									, state: 0
									, title: MZXBX_currentPlugins()[ii].label
								});
								globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
							});
						});
						info.onDrag = dragger.doDrag.bind(dragger);
						menuPointAddPlugin.children.push(info);
						/*let dragStarted = false;
						let info: MenuInfo;
						info = {
							text: label
							, noLocalization: true
							, onDrag: (x: number, y: number) => {
								if (!dragStarted) {
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
								globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
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
										globalCommandDispatcher.adjustTimelineContent(globalCommandDispatcher.cfg().data);
									});
								}
							}
							, itemKind: kindDraggableCircle
						};
						menuPointAddPlugin.children.push(info);*/
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
	fillClipboardList();
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
			{
				text: 'fullscrn', onClick: () => {
					globalCommandDispatcher.tryFullScreen();
				}, itemKind: kindAction
			},
			{
				text: localMenuNewEmptyProject, onClick: () => {
					globalCommandDispatcher.newEmptyProject();
				}, itemKind: kindAction
			},
			menuPointActions
			, menuPointAddPlugin
			//, menuPointStore
			, menuPointClipboard
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