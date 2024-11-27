let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
let localeFontRatio = 1;

let localMenuItemSettings = 'localMenuItemSettings';
let localMenuTracksFolder = 'localMenuTracksFolder';
//let localMenuImportMIDI = 'localMenuImportMIDI';
//let localMenuPercussionFolder='localMenuPercussionFolder';
//let localMenuImportFolder='localMenuImportFolder';
//let localMenuFileFolder='localMenuFileFolder';
//let localMenuAutomationFolder='localMenuAutomationFolder';
//let localMenuCommentsLayer='localMenuCommentsLayer';
let localMenuPlayPause='localMenuPlayPause';






let localMenuActionsFolder='localMenuActionsFolder';
let localMenuPerformersFolder='localMenuPerformersFolder';
let localMenuFiltersFolder='localMenuFiltersFolder';
let localMenuSamplersFolder='localMenuSamplersFolder';

let localeDictionary: { id: string, data: { locale: string, text: string }[] }[] = [
    {
        id: localNameLocal, data: [
            { locale: 'en', text: 'English' }
            , { locale: 'ru', text: 'Русский' }
            , { locale: 'zh', text: '中文' }]
    }, {
        id: localMenuItemSettings, data: [
            { locale: 'en', text: 'Settings' }
            , { locale: 'ru', text: 'Настройки' }
            , { locale: 'zh', text: '设置' }]
    }, {
        id: localMenuTracksFolder, data: [
            { locale: 'en', text: 'Tracks' }
            , { locale: 'ru', text: 'Треки' }
            , { locale: 'zh', text: '?' }]
   /* }, {
        id: localMenuImportMIDI, data: [
            { locale: 'en', text: 'Import from MIDI-file' }
            , { locale: 'ru', text: 'Импорт из файлв MIDI' }
            , { locale: 'zh', text: '?' }]*/
    }
    ,/* {
        id: localMenuPercussionFolder, data: [
            { locale: 'en', text: 'Sampler' }
            , { locale: 'ru', text: 'Сэмплер' }
            , { locale: 'zh', text: '?' }]
    }
	, {
        id: localMenuFileFolder, data: [
            { locale: 'en', text: 'File' }
            , { locale: 'ru', text: 'Файл' }
            , { locale: 'zh', text: '?' }]
    }, {
        id: localMenuImportFolder, data: [
            { locale: 'en', text: 'Import' }
            , { locale: 'ru', text: 'Импорт' }
            , { locale: 'zh', text: '?' }]
    }, {
        id: localMenuCommentsLayer, data: [
            { locale: 'en', text: 'Comments' }
            , { locale: 'ru', text: 'Комментарии' }
            , { locale: 'zh', text: '?' }]
    }, {
        id: localMenuAutomationFolder, data: [
            { locale: 'en', text: 'Automation' }
            , { locale: 'ru', text: 'Автоматизация' }
            , { locale: 'zh', text: '?' }]
    },*/ {
        id: localMenuPlayPause, data: [
            { locale: 'en', text: 'Play/Pause' }
            , { locale: 'ru', text: 'Старт/Стоп' }
            , { locale: 'zh', text: '?' }]
    }



    , {
        id: localMenuActionsFolder, data: [
            { locale: 'en', text: 'Actions' }
            , { locale: 'ru', text: 'Действия' }
            , { locale: 'zh', text: '?' }]
    }, {
        id: localMenuPerformersFolder, data: [
            { locale: 'en', text: 'Performers' }
            , { locale: 'ru', text: 'Перформеры' }
            , { locale: 'zh', text: '?' }]
    }, {
        id: localMenuFiltersFolder, data: [
            { locale: 'en', text: 'Filters' }
            , { locale: 'ru', text: 'Фильтры' }
            , { locale: 'zh', text: '?' }]
    }, {
        id: localMenuSamplersFolder, data: [
            { locale: 'en', text: 'Samplers' }
            , { locale: 'ru', text: 'Сэмплеры' }
            , { locale: 'zh', text: '?' }]
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