type MenuInfo = {
    text: string;
    noLocalization?: boolean;
    focused?: boolean;
    opened?: boolean;
    children?: MenuInfo[];
    sid?: string;
    onClick?: () => void;
    onSubClick?: () => void;
    states?:string[];
    selection?:number;
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
};
let menuPointPercussion: MenuInfo = {
    text: localMenuPercussionFolder
};
function composeBaseMenu(): MenuInfo[] {
    if (menuItemsData) { return menuItemsData; } else {
        menuItemsData = [
            {
                text: localMenuImportMIDI, onClick: () => {
                    commandDispatcher.promptImportFromMIDI();
                }
            }, menuPointTracks
            , menuPointPercussion
            , {
                text: localMenuItemSettings, children: [
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
        ];
        return menuItemsData;
    }
}