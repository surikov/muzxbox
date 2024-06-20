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
					/*importer.runPluginGUIImport(url, evaluate, (loaded: any) => {
						let plugin: MZXBX_ImportMusicPlugin = loaded as MZXBX_ImportMusicPlugin;
						
						let url = plugin.GUIURL(() => {
							console.log('done plugin inport');
						});
						console.log('plugin', loaded, url);
						commandDispatcher.promptPluginGUI(label,url);
					});*/
				}
			});
		}
	}

}
function composeBaseMenu(): MenuInfo[] {
	fillMenuImportPlugins();
	if (menuItemsData) {
		return menuItemsData;
	} else {
		menuItemsData = [
			{
				text: localMenuPlayPause, onClick: () => {
					
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
					menuPointMenuFile
					, {
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
			
			
		];
		console.log('base menu', menuItemsData);
		return menuItemsData;
	}
}