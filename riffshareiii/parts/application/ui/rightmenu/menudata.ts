type MenuInfo = {
	text: string;
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
	dragMix?: boolean;
	highlight?: string;
};

let menuItemsData: MenuInfo[] | null = null;

let menuPointActions: MenuInfo = {
	text: localMenuActionsFolder
	, onFolderOpen: () => {
		//console.log('actions');
	}
};
let menuPointPerformers: MenuInfo = {
	text: localMenuPerformersFolder
	, onFolderOpen: () => {
		//console.log('performers');
	}
};
let menuPointFilters: MenuInfo = {
	text: localMenuFiltersFolder
	, onFolderOpen: () => {
		//console.log('filters');
	}
};
let menuPointSamplers: MenuInfo = {
	text: localMenuSamplersFolder
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

let menuPlayStop: MenuInfo = {
	text: localMenuPlay
	, onClick: () => {
		//console.log('start/stop');
		globalCommandDispatcher.toggleStartStop();
		menuItemsData = null;
	}
};
function fillPluginsLists() {
	menuPointFilters.children = [];
	menuPointPerformers.children = [];
	menuPointSamplers.children = [];
	menuPointActions.children = [];
	for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
		let label: string = MZXBX_currentPlugins()[ii].label;
		let purpose: string = MZXBX_currentPlugins()[ii].purpose;
		let url: string = MZXBX_currentPlugins()[ii].ui;
		if (purpose == 'Action') {
			menuPointActions.children.push({
				text: label, noLocalization: true, onClick: () => {
					globalCommandDispatcher.promptActionPluginDialog(label, url, (obj: Zvoog_Project) => {
						let project: Zvoog_Project = obj;
						globalCommandDispatcher.registerWorkProject(project);
						globalCommandDispatcher.resetProject();
						return true;
					});
				}
			});
		} else {
			if (purpose == 'Sampler') {
				menuPointSamplers.children.push({
					dragMix: true
					, text: label, noLocalization: true, onDrag: (x: number, y: number) => {
						console.log(purpose, label, x, y);
					}
				});
			} else {
				if (purpose == 'Performer') {
					menuPointPerformers.children.push({
						dragMix: true
						, text: label, noLocalization: true, onDrag: (x: number, y: number) => {
							console.log(purpose, label, x, y);
						}
					});
				} else {
					if (purpose == 'Filter') {
						menuPointFilters.children.push({
							dragMix: true
							, text: label, noLocalization: true, onDrag: (x: number, y: number) => {
								console.log(purpose, label, x, y);
							}
						});
					} else {
						console.log('unknown plugin kind');
					}
				}
			}
		}
	}
}
function composeBaseMenu(): MenuInfo[] {
	menuPlayStop.text = localMenuPlay;
	if (globalCommandDispatcher.player) {
		if (
			(globalCommandDispatcher.player.playState().play)
			|| (globalCommandDispatcher.player.playState().loading)
		) {
			menuPlayStop.text = localMenuPause;
		}
	}
	if (menuItemsData) {
		return menuItemsData;
	} else {
		fillPluginsLists();
		menuItemsData = [
			menuPlayStop
			, menuPointInsTracks
			, menuPointDrumTracks
			, menuPointFxTracks
			, menuPointActions
			, menuPointFilters
			, menuPointPerformers
			, menuPointSamplers
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
						text: 'Locale', children: [
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
							}]
					}, {
						text: 'Colors', children: [
							{
								text: 'Red', onClick: () => {
									globalCommandDispatcher.setThemeColor('theme/colordarkred.css');
								}
							}, {
								text: 'Green', onClick: () => {
									globalCommandDispatcher.setThemeColor('theme/colordarkgreen.css');
								}
							}, {
								text: 'Blue', onClick: () => {
									globalCommandDispatcher.setThemeColor('theme/colordarkblue.css');
								}
							}
						]
					}
					, {
						text: localMenuClearUndoRedo, onClick: () => {
							globalCommandDispatcher.cfg().data.undo = [];
							globalCommandDispatcher.cfg().data.redo = [];
						}
					}
				]
			}
		];
		return menuItemsData;
	}
}