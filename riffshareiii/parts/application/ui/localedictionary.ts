let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
let localeFontRatio = 1;

let localMenuNewEmptyProject = 'localMenuNewEmptyProject';
let localMenuItemSettings = 'localMenuItemSettings';
//let localMenuTracksFolder = 'localMenuTracksFolder';
//let localMenuImportMIDI = 'localMenuImportMIDI';
let localMenuPercussionFolder = 'localMenuPercussionFolder';
//let localMenuImportFolder='localMenuImportFolder';
//let localMenuFileFolder='localMenuFileFolder';
let localMenuAutomationFolder = 'localMenuAutomationFolder';
//let localMenuCommentsLayer='localMenuCommentsLayer';
let localMenuPlay = 'localMenuPlay';
let localMenuPause = 'localMenuPause';

let localMenuUndo = 'localMenuUndo';
let localMenuRedo = 'localMenuRedo';
let localMenuClearUndoRedo = 'localMenuClearUndoRedo';

let localDropInsTrack = 'localDropInsTrack';
let localDropSampleTrack = 'localDropSampleTrack';
let localDropFilterTrack = 'localDropFilterTrack';
let localDropFilterPoint = 'localDropFilterPoint';

let localMenuActionsFolder = 'localMenuActionsFolder';
let localMenuPerformersFolder = 'localMenuPerformersFolder';
let localMenuFiltersFolder = 'localMenuFiltersFolder';
let localMenuSamplersFolder = 'localMenuSamplersFolder';
//let localMenuUndoFolder='localMenuUndoFolder';
let localMenuInsTracksFolder = 'localMenuInsTracksFolder';
let localMenuDrumTracksFolder = 'localMenuDrumTracksFolder';
let localMenuFxTracksFolder = 'localMenuFxTracksFolder';

//let localAddEmptyMeasures = 'localAddEmptyMeasures';
//let localRemoveSelectedMeasures = 'localRemoveSelectedMeasures';
//let localSplitFirstSelectedMeasure = 'localSplitFirstSelectedMeasure';
//let localMergeSelectedMeausres = 'localMergeSelectedMeausres';
//let localMoveAsideContentSelectedMeausres='localMoveAsideContentSelectedMeausres';
//let localMorphMeterSelectedMeausres = 'localMorphMeterSelectedMeausres';

let localMenuNewPlugin = 'localMenuNewPlugin';
let localMenuClipboard = 'localMenuClipboard';

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
		/* }, {
			 id: localMenuTracksFolder, data: [
				 { locale: 'en', text: 'Tracks' }
				 , { locale: 'ru', text: 'Треки' }
				 , { locale: 'zh', text: '?' }]
		 }, {
			 id: localMenuImportMIDI, data: [
				 { locale: 'en', text: 'Import from MIDI-file' }
				 , { locale: 'ru', text: 'Импорт из файлв MIDI' }
				 , { locale: 'zh', text: '?' }]*/
	}
	, {
		id: localMenuPercussionFolder, data: [
			{ locale: 'en', text: 'Sampler' }
			, { locale: 'ru', text: 'Сэмплер' }
			, { locale: 'zh', text: '?' }]
	}
	//, { id: localAddEmptyMeasures, data: [{ locale: 'en', text: '+' }, { locale: 'ru', text: '+' }, { locale: 'zh', text: '?' }] }
	//, { id: localRemoveSelectedMeasures, data: [{ locale: 'en', text: 'x' }, { locale: 'ru', text: 'x' }, { locale: 'zh', text: '?' }] }
	//, { id: localSplitFirstSelectedMeasure, data: [{ locale: 'en', text: 'Split' }, { locale: 'ru', text: 'Разделить' }, { locale: 'zh', text: '?' }] }
	//, { id: localMergeSelectedMeausres, data: [{ locale: 'en', text: '>|<' }, { locale: 'ru', text: '>|<' }, { locale: 'zh', text: '?' }] }
	//, { id: localMoveAsideContentSelectedMeausres, data: [{ locale: 'en', text: '|>|' }, { locale: 'ru', text: '|>|' }, { locale: 'zh', text: '?' }] }
	//, { id: localMorphMeterSelectedMeausres, data: [{ locale: 'en', text: 'Morph' }, { locale: 'ru', text: 'Сменить' }, { locale: 'zh', text: '?' }] }

	, { id: localMenuNewEmptyProject, data: [{ locale: 'en', text: 'New empty project' }, { locale: 'ru', text: 'Новый проект' }, { locale: 'zh', text: 'тew' }] }
	
	/*, {
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
    }*/, {
		id: localMenuAutomationFolder, data: [
			{ locale: 'en', text: 'Automation' }
			, { locale: 'ru', text: 'Автоматизация' }
			, { locale: 'zh', text: '?' }]
	}, {
		id: localMenuPlay, data: [
			{ locale: 'en', text: 'Play' }
			, { locale: 'ru', text: 'Старт' }
			, { locale: 'zh', text: '?' }]
	}, {
		id: localMenuPause, data: [
			{ locale: 'en', text: 'Pause' }
			, { locale: 'ru', text: 'Стоп' }
			, { locale: 'zh', text: '?' }]
	}



	, {
		id: localMenuActionsFolder, data: [
			{ locale: 'en', text: 'Actions' }
			, { locale: 'ru', text: 'Действия' }
			, { locale: 'zh', text: '?' }]
	}, {
		id: localMenuNewPlugin, data: [
			{ locale: 'en', text: 'Add new item to the mixer' }
			, { locale: 'ru', text: 'Добавить дорожку' }
			, { locale: 'zh', text: '?' }]
	}, {
		/*    id: localMenuPerformersFolder, data: [
				{ locale: 'en', text: 'Add performer' }
				, { locale: 'ru', text: '+ Перформер' }
				, { locale: 'zh', text: '?' }]
		}, {
			id: localMenuFiltersFolder, data: [
				{ locale: 'en', text: 'Add filter' }
				, { locale: 'ru', text: '+ Фильтр' }
				, { locale: 'zh', text: '?' }]
		}, {
			id: localMenuSamplersFolder, data: [
				{ locale: 'en', text: 'Add sampler' }
				, { locale: 'ru', text: '+ Сэмплер' }
				, { locale: 'zh', text: '?' }]
		}, {*/
		id: localMenuInsTracksFolder, data: [
			{ locale: 'en', text: 'Performers' }
			, { locale: 'ru', text: 'Перформеры' }
			, { locale: 'zh', text: '?' }]
	}, {
		id: localMenuFxTracksFolder, data: [
			{ locale: 'en', text: 'Filters' }
			, { locale: 'ru', text: 'Фильтры' }
			, { locale: 'zh', text: '?' }]
	}, {
		id: localMenuDrumTracksFolder, data: [
			{ locale: 'en', text: 'Samplers' }
			, { locale: 'ru', text: 'Сэмплеры' }
			, { locale: 'zh', text: '?' }]
	}, {
		id: localMenuUndo, data: [
			{ locale: 'en', text: 'Undo' }
			, { locale: 'ru', text: 'Вернуть' }
			, { locale: 'zh', text: '?' }]
	}
	, {
		id: localMenuRedo, data: [
			{ locale: 'en', text: 'Redo' }
			, { locale: 'ru', text: 'Повторить' }
			, { locale: 'zh', text: '?' }]
	}
	, {
		id: localMenuClearUndoRedo, data: [
			{ locale: 'en', text: 'Clear Undo queue' }
			, { locale: 'ru', text: 'Очистить очередь действий' }
			, { locale: 'zh', text: '?' }]
	}
];
function setLocaleID(loname: string, ratio: number) {
	labelLocaleDictionary = loname;
	localeFontRatio = ratio;
	saveRawText2localStorage('uilocale', loname);
	saveRawText2localStorage('uiratio', '' + ratio);
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