let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
let localeFontRatio = 1;

let localMenuNewEmptyProject = 'localMenuNewEmptyProject';
let localMenuItemSettings = 'localMenuItemSettings';
let localMenuPercussionFolder = 'localMenuPercussionFolder';
let localMenuAutomationFolder = 'localMenuAutomationFolder';
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
let localMenuInsTracksFolder = 'localMenuInsTracksFolder';
let localMenuDrumTracksFolder = 'localMenuDrumTracksFolder';
let localMenuFxTracksFolder = 'localMenuFxTracksFolder';
let localMenuNewPlugin = 'localMenuNewPlugin';
let localMenuClipboard = 'localMenuClipboard';
let localMenuFullscreen = 'localMenuFullscreen';
let localMenuCopySelection = 'localMenuCopySelection';
let localMenuColors = 'localMenuColors';
let localMenuSize = 'localMenuSize';
let localMenuNormalFont = 'localMenuNormalFont';
let localMenuBigFont = 'localMenuBigFont';
let localMenuHugeFont = 'localMenuHugeFont';
let localMenuOther = 'localMenuOther';
let localMenuDebugPlugin = 'localMenuDebugPlugin';

let localeDictionary: { id: string, data: { locale: string, text: string }[] }[] = [
	{ id: localNameLocal, data: [{ locale: 'en', text: 'English' }, { locale: 'ru', text: 'Русский' }, { locale: 'zh', text: '中文' }] }
	, { id: localMenuItemSettings, data: [{ locale: 'en', text: 'Settings' }, { locale: 'ru', text: 'Настройки' }, { locale: 'zh', text: '设置' }] }
	, { id: localMenuPercussionFolder, data: [{ locale: 'en', text: 'Sampler' }, { locale: 'ru', text: 'Сэмплер' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuNewEmptyProject, data: [{ locale: 'en', text: 'New empty project' }, { locale: 'ru', text: 'Новый проект' }, { locale: 'zh', text: '新建项目' }] }
	, { id: localMenuAutomationFolder, data: [{ locale: 'en', text: 'Automation' }, { locale: 'ru', text: 'Автоматизация' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuPlay, data: [{ locale: 'en', text: 'Play' }, { locale: 'ru', text: 'Старт' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuPause, data: [{ locale: 'en', text: 'Pause' }, { locale: 'ru', text: 'Стоп' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuActionsFolder, data: [{ locale: 'en', text: 'Actions' }, { locale: 'ru', text: 'Действия' }, { locale: 'zh', text: '服务' }] }
	, { id: localMenuNewPlugin, data: [{ locale: 'en', text: 'Add new item to the mixer' }, { locale: 'ru', text: 'Добавить дорожку' }, { locale: 'zh', text: '添加新曲目' }] }
	, { id: localMenuInsTracksFolder, data: [{ locale: 'en', text: 'Performers' }, { locale: 'ru', text: 'Перформеры' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuFxTracksFolder, data: [{ locale: 'en', text: 'Filters' }, { locale: 'ru', text: 'Фильтры' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuDrumTracksFolder, data: [{ locale: 'en', text: 'Samplers' }, { locale: 'ru', text: 'Сэмплеры' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuUndo, data: [{ locale: 'en', text: 'Undo' }, { locale: 'ru', text: 'Вернуть' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuRedo, data: [{ locale: 'en', text: 'Redo' }, { locale: 'ru', text: 'Повторить' }, { locale: 'zh', text: '?' }] }
	, { id: localMenuClearUndoRedo, data: [{ locale: 'en', text: 'Clear Undo/Redo history' }, { locale: 'ru', text: 'Очистить историю действий' }, { locale: 'zh', text: '清除历史记录' }] }
	, { id: localMenuFullscreen, data: [{ locale: 'en', text: 'Full Screen' }, { locale: 'ru', text: 'На весь экран' }, { locale: 'zh', text: '切换到全屏' }] }
	, { id: localMenuClipboard, data: [{ locale: 'en', text: 'Clipboard' }, { locale: 'ru', text: 'Буфер обмена' }, { locale: 'zh', text: '剪贴板' }] }
	, { id: localMenuCopySelection, data: [{ locale: 'en', text: 'Copy selected bars' }, { locale: 'ru', text: 'Скопировать выделенное' }, { locale: 'zh', text: '复制所选' }] }
	, { id: localMenuColors, data: [{ locale: 'en', text: 'Theme colors' }, { locale: 'ru', text: 'Цветовая тема' }, { locale: 'zh', text: '主题颜色' }] }
	, { id: localMenuSize, data: [{ locale: 'en', text: 'Font size' }, { locale: 'ru', text: 'Размер шрифта' }, { locale: 'zh', text: '字体大小' }] }
	, { id: localMenuNormalFont, data: [{ locale: 'en', text: 'Normall font' }, { locale: 'ru', text: 'Обычный шрифт' }, { locale: 'zh', text: '常规字体' }] }
	, { id: localMenuBigFont, data: [{ locale: 'en', text: 'Big font' }, { locale: 'ru', text: 'Большой шрифт' }, { locale: 'zh', text: '大字体' }] }
	, { id: localMenuHugeFont, data: [{ locale: 'en', text: 'Huge font' }, { locale: 'ru', text: 'Огромный шрифт' }, { locale: 'zh', text: '超大字体' }] }
	, { id: localMenuOther, data: [{ locale: 'en', text: 'Other options' }, { locale: 'ru', text: 'Дополнительно' }, { locale: 'zh', text: '其他选项' }] }
	, { id: localMenuDebugPlugin, data: [{ locale: 'en', text: 'Open plugin' }, { locale: 'ru', text: 'Загрузить плагин' }, { locale: 'zh', text: '加载插件' }] }
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