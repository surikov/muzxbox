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
	states?: string[];
	selection?: number;
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




let menuPointTracks: MenuInfo = {
	text: localMenuTracksFolder
	, onOpen: () => {
		commandDispatcher.upTracksLayer();
	}
};

let menuPointPercussion: MenuInfo = {
	text: localMenuPercussionFolder
	, onOpen: () => {
		commandDispatcher.upDrumsLayer();
	}
};

let menuPointAutomation: MenuInfo = {
	text: localMenuAutomationFolder
	, onOpen: () => {
		commandDispatcher.upAutoLayer();
	}
};
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
					commandDispatcher.promptPluginGUI(label, url, (obj: any) => {
						//console.log('set project from', obj);

						commandDispatcher.registerWorkProject(obj as Zvoog_Project);
						commandDispatcher.resetProject();
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
	for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
		let label: string = MZXBX_currentPlugins()[ii].label;
		let kind: MZXBX_PluginKind = MZXBX_currentPlugins()[ii].kind;
		let url: string = MZXBX_currentPlugins()[ii].url;

		if (kind == MZXBX_PluginKind.Action) {
			menuPointActions.children.push({
				text: label, noLocalization: true, onClick: () => {
					commandDispatcher.promptProjectPluginGUI(label, url, (obj: any) => {
						let project:Zvoog_Project=JSON.parse(obj);
						//console.log(project);
						commandDispatcher.registerWorkProject(project);
						commandDispatcher.resetProject();
						return true;
					});
				}
			});
		} else {
			if (kind == MZXBX_PluginKind.Sampler) {
				menuPointSamplers.children.push({
					text: label, noLocalization: true, onClick: () => {
						console.log(kind, label);
					}
				});
			} else {
				if (kind == MZXBX_PluginKind.Performer) {
					menuPointPerformers.children.push({
						text: label, noLocalization: true, onClick: () => {
							commandDispatcher.promptPointPluginGUI(label, url, (obj: any) => {
								console.log('performer callback',obj);
								return true;
							});
						}
					});
				} else {
					if (kind == MZXBX_PluginKind.Filter) {
						menuPointFilters.children.push({
							text: label, noLocalization: true, onClick: () => {
								console.log(kind, label);
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
console.log('start/stop');
commandDispatcher.toggleStartStop();
				}
			}
			/*, {
				text: localMenuImportMIDI, onClick: () => {
					commandDispatcher.promptImportFromMIDI();
				}
			}, {
				text: "GP35Import", onClick: () => {
					commandDispatcher.promptTestImport();
				}
			}, {
				text: "Test iFrame GUI", onClick: () => {
					commandDispatcher.promptPluginGUI('Plugin UI', './web/test/plugin.html', (obj: any) => { return false });
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
									commandDispatcher.changeTapSize(1);
								}
							}, {
								text: 'Big', onClick: () => {
									startLoadCSSfile('theme/sizebig.css');
									commandDispatcher.changeTapSize(1.5);
								}
							}, {
								text: 'Huge', onClick: () => {
									startLoadCSSfile('theme/sizehuge.css');
									commandDispatcher.changeTapSize(4);
								}
							}
						]
					}, {
						text: 'Locale', children: [
							{
								text: 'Russian', onClick: () => {
									commandDispatcher.setThemeLocale('ru', 1);
								}
							}, {
								text: 'English', onClick: () => {
									commandDispatcher.setThemeLocale('en', 1);
								}
							}, {
								text: '中文界面语言', onClick: () => {
									commandDispatcher.setThemeLocale('zh', 1.5);
								}
							}]
					}, {
						text: 'Colors', children: [
							{
								text: 'Red', onClick: () => {
									commandDispatcher.setThemeColor('theme/colordarkred.css');
								}
							}, {
								text: 'Green', onClick: () => {
									commandDispatcher.setThemeColor('theme/colordarkgreen.css');
								}
							}, {
								text: 'Blue', onClick: () => {
									commandDispatcher.setThemeColor('theme/colordarkblue.css');
								}
							}
						]
					}
				]
			}
			, {
				text: localMenuCommentsLayer, onClick: () => {
					commandDispatcher.upCommentsLayer();
				}
			}
			, menuPointAutomation
			, menuPointTracks
			, menuPointPercussion

			, menuPointActions
			, menuPointFilters
			, menuPointPerformers
			, menuPointSamplers

		];
		console.log('base menu', menuItemsData);
		return menuItemsData;
	}
}