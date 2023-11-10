type MenuInfo = {
    text: string;
    focused?: boolean;
    opened?: boolean;
    children?: MenuInfo[];
    sid?: string;
};
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
let testMenuData: MenuInfo[] = [
    { text: 'test import' ,sid:commandImportFromMIDI}
    ,{ text: 'One' }
    , {
        text: 'Two', children: [{ text: 'One' }
            , { text: 'Two' }
            , { text: 'Orange', focused: true }
            , { text: 'Blue' }
            , { text: 'Green' }
            , {
            text: 'Brown', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , {
                text: 'Blue', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , {
                    text: 'Brown', children: [{ text: 'One' }
                        , { text: 'Two' }
                        , {
                        text: 'Orange', children: [{ text: 'One' }
                            , { text: 'Two' }
                            , { text: 'Orange' }
                            , { text: 'Blue' }
                            , { text: 'Green' }
                            , {
                            text: 'Brown', children: [{ text: 'One' }
                                , { text: 'Two' }
                                , { text: 'Orange' }
                                , { text: 'Blue' }
                                , { text: 'Green' }
                                , { text: 'Brown' }
                                , { text: 'eleven' }]
                        }
                            , {
                            text: 'eleven', children: [{ text: 'One' }
                                , { text: 'Two' }
                                , { text: 'Orange' }
                                , { text: 'Blue' }
                                , { text: 'Green' }
                                , { text: 'Brown' }
                                , { text: 'eleven' }]
                        }]
                    }
                        , { text: 'Blue' }
                        , { text: 'Green' }
                        , { text: 'Brown' }
                        , { text: 'eleven' }]
                }
                    , {
                    text: 'eleven', children: [{ text: 'One' }
                        , { text: 'Two' }
                        , { text: 'Orange' }
                        , { text: 'Blue' }
                        , { text: 'Green' }
                        , { text: 'Brown' }
                        , { text: 'eleven' }]
                }]
            }
                , { text: 'Green' }
                , { text: 'Brown' }
                , { text: 'eleven' }]
        }
            , {
            text: 'eleven', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , { text: 'Blue' }
                , { text: 'Green' }
                , { text: 'Brown' }
                , { text: 'eleven' }]
        }]
    }
    , { text: 'Orange' }
    , { text: 'Blue' }
    , {
        text: 'Green', focused: true, children: [{ text: 'One' }
            , { text: 'Two' }
            , { text: 'Orange' }
            , { text: 'Blue' }
            , { text: 'Green' }
            , { text: 'Brown' }
            , { text: 'eleven' }]
    }
    , {
        text: 'Brown', children: [{ text: 'One' }
            , { text: 'Two' }
            , {
            text: 'Orange', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , { text: 'Blue' }
                , { text: 'Green' }
                , {
                text: 'Brown', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }
                , {
                text: 'eleven', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }]
        }
            , {
            text: 'Blue', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , { text: 'Blue' }
                , { text: 'Green' }
                , {
                text: 'Brown', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }
                , {
                text: 'eleven', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }]
        }
            , { text: 'Green' }
            , { text: 'Brown' }
            , { text: 'eleven' }]
    }
    , { text: 'eleven' }
    , {
        text: localMenuItemSettings, children: [
            {
                text: 'Size', children: [
                    { text: 'Small', sid: commandThemeSizeSmall }
                    , { text: 'Big', sid: commandThemeSizeBig }
                    , { text: 'Huge', sid: commandThemeSizeHuge }
                ]
            }
            , {
                text: 'Locale', children: [{ text: 'Russian', sid: commandLocaleRU }
                    , { text: 'English', sid: commandLocaleEN }
                    , { text: '中文界面语言', sid: commandLocaleZH }]
            }
            , {
                text: 'Colors', children: [
                    { text: 'Red', sid: commandThemeColorRed }
                    , { text: 'Green', sid: commandThemeColorGreen }
                    , { text: 'Blue', sid: commandThemeColorBlue }
                ]
            }
        ]
    }
];
