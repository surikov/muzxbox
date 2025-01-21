//declare let pluginListKindUrlName: { group: string, kind: string, url: string, functionName: string }[];
//let importer = new MusicDataImporter();
type MenuInfo = {
	text: string;
	noLocalization?: boolean;
	focused?: boolean;
	opened?: boolean;
	children?: MenuInfo[];
	sid?: string;
	onClick?: () => void;
	onSubClick?: () => void;
	onOpen?: () => void;
	itemStates?: string[];
	selectedState?: number;
	dragMix?: boolean;
};
/*
let commandThemeSizeSmall = 'commandThemeSizeSmall';
let commandThemeSizeBig = 'commandThemeSizeBig';
let commandThemeSizeHuge = 'commandThemeSizeHuge';
let commandThemeColorRed = 'commandThemeColorRed';
let commandThemeColorGreen = 'commandThemeColorGreen';
let commandThemeColorBlue = 'commandThemeColorBlue';
let commandLocaleEN = 'commandLocaleEN';
let commandLocaleRU = 'commandLocaleRU';
let commandLocaleZH = 'commandLocaleZH';
let commandImportFromMIDI = 'commandImportFromMIDI';
let commandTracksFolder = 'commandTracksFolder';
*/
let menuItemsData: MenuInfo[] | null = null;



let menuPointActions: MenuInfo = {
	text: 'localMenuActionsFolder'
	, onOpen: () => {
		console.log('actions');
	}
};
let menuPointPerformers: MenuInfo = {
	text: 'localMenuPerformersFolder'
	, onOpen: () => {
		console.log('performers');
	}
};
let menuPointFilters: MenuInfo = {
	text: 'localMenuFiltersFolder'
	, onOpen: () => {
		console.log('filters');
	}
};
let menuPointSamplers: MenuInfo = {
	text: 'localMenuSamplersFolder'
	, onOpen: () => {
		console.log('samplers');
	}
};
/*
let menuPointUndo: MenuInfo = {
	text: 'localMenuUndoFolder'
	, onOpen: () => {
		console.log('show undo');
	}
};
*/



let menuPointTracks: MenuInfo = {
	text: localMenuTracksFolder
	, onOpen: () => {
		//globalCommandDispatcher.upTracksLayer();
	}
};
/*
let menuPointPercussion: MenuInfo = {
	text: localMenuPercussionFolder
	, onOpen: () => {
		//globalCommandDispatcher.upDrumsLayer();
	}
};

let menuPointAutomation: MenuInfo = {
	text: localMenuAutomationFolder
	, onOpen: () => {
		//globalCommandDispatcher.upAutoLayer();
	}
};
*/
/*
let menuPointFileImport: MenuInfo = {
	text: localMenuImportFolder
};

let menuPointMenuFile: MenuInfo = {
	text: localMenuFileFolder
	, children: [menuPointFileImport]
};

function fillMenuImportPlugins() {

	menuPointFileImport.children = [];
	for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
		if (MZXBX_currentPlugins()[ii].group == 'import') {
			let label: string = MZXBX_currentPlugins()[ii].label;
			//let id: string = MZXBX_currentPlugins()[ii].id;
			//let evaluate: string = MZXBX_currentPlugins()[ii].evaluate;
			let url: string = MZXBX_currentPlugins()[ii].url;

			menuPointFileImport.children.push({
				text: label, noLocalization: true, onClick: () => {
					globalCommandDispatcher.promptPluginGUI(label, url, (obj: any) => {
						//console.log('set project from', obj);

						globalCommandDispatcher.registerWorkProject(obj as Zvoog_Project);
						globalCommandDispatcher.resetProject();
						return true;
					});
				}
			});
		}
	}

}*/
function fillPluginsLists() {
	menuPointFilters.children = [];
	menuPointPerformers.children = [];
	menuPointSamplers.children = [];
	menuPointActions.children = [];
	//menuPointUndo.children = [];
	for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
		let label: string = MZXBX_currentPlugins()[ii].label;
		//let purpose: MZXBX_PluginPurpose = MZXBX_currentPlugins()[ii].purpose;
		let purpose: string = MZXBX_currentPlugins()[ii].purpose;
		let url: string = MZXBX_currentPlugins()[ii].ui;

		if (purpose == 'Action') {
			menuPointActions.children.push({
				text: label, noLocalization: true, onClick: () => {
					globalCommandDispatcher.promptProjectPluginGUI(label, url, (obj: Zvoog_Project) => {
						let project: Zvoog_Project = obj;
						//console.log(project);
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
					, text: label, noLocalization: true, onClick: () => {
						console.log(purpose, label);
					}
				});
			} else {
				if (purpose == 'Performer') {
					menuPointPerformers.children.push({
						dragMix: true
						, text: label, noLocalization: true, onClick: () => {
							globalCommandDispatcher.promptPointPluginGUI(label, url, (obj: any) => {
								console.log('performer callback', obj);
								return true;
							});
						}
					});
				} else {
					if (purpose == 'Filter') {
						menuPointFilters.children.push({
							dragMix: true
							, text: label, noLocalization: true, onClick: () => {
								console.log(purpose, label);
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
	//fillMenuImportPlugins();
	fillPluginsLists();
	if (menuItemsData) {
		return menuItemsData;
	} else {
		menuItemsData = [
			{
				text: localMenuPlayPause, onClick: () => {
					//console.log('start/stop');
					globalCommandDispatcher.toggleStartStop();
				}
			}
			, menuPointTracks
			//, menuPointPercussion
			//, menuPointAutomation

			, menuPointActions
			, menuPointFilters
			, menuPointPerformers
			, menuPointSamplers
			/*, {
				text: localMenuImportMIDI, onClick: () => {
					globalCommandDispatcher.promptImportFromMIDI();
				}
			}, {
				text: "GP35Import", onClick: () => {
					globalCommandDispatcher.promptTestImport();
				}
			}, {
				text: "Test iFrame GUI", onClick: () => {
					globalCommandDispatcher.promptPluginGUI('Plugin UI', './web/test/plugin.html', (obj: any) => { return false });
				}
			}*/

			, {
				text: localMenuItemSettings, children: [
					//menuPointMenuFile
					//, 
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
								text: '中文界面语言', onClick: () => {
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
			/*, {
				text: localMenuCommentsLayer, onClick: () => {
					globalCommandDispatcher.upCommentsLayer();
				}
			}*/
			//, menuPointAutomation

			//, menuPointUndo
			/*,{
				text: localMenuUndo, onClick: () => {
					//console.log('undo');
					globalCommandDispatcher.exe.undo(1);
				}
			},{
				text: localMenuRedo, onClick: () => {
					//console.log('redo');
					globalCommandDispatcher.exe.redo(1);
				}
			}*/
		];
		console.log('base menu', menuItemsData);
		return menuItemsData;
	}
}