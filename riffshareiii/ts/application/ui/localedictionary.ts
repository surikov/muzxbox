let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
let localeFontRatio = 1;

let localMenuItemSettings = 'localMenuItemSettings';

let localeDictionary: { id: string, data: { locale: string, text: string }[] }[] = [
    {
        id: localNameLocal, data: [
            { locale: 'en', text: 'English' }
            , { locale: 'ru', text: 'Русский' }
            , { locale: 'zh', text: '汉语口语' }]
    }, {
        id: localMenuItemSettings, data: [
            { locale: 'en', text: 'Settings' }
            , { locale: 'ru', text: 'Настройки' }
            , { locale: 'zh', text: '设置' }]
    }
];
function setLocaleID(loname: string, ratio: number) {
    labelLocaleDictionary = loname;
    localeFontRatio = ratio;
}
function LO(id: string): string {
    for (let ii = 0; ii < localeDictionary.length; ii++) {
        let row = localeDictionary[ii];
        if (id == row.id) {
            for (let kk = 0; kk < row.data.length; kk++) {
                if (row.data[kk].locale == labelLocaleDictionary) {
                    return row.data[kk].text;
                }
            }
            return labelLocaleDictionary + '?' + id;
        }
    }
    return labelLocaleDictionary + ':' + id;
}