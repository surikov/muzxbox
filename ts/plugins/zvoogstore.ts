type ZvoogStoreListItem = {
	title: string
	, isFolder: boolean
};
type ZvoogStoreDoneEvent = {

};
interface ZvoogStore {
	list(onFinish: (items: ZvoogStoreListItem[]) => void): void;
	goFolder(title: string, onFinish: (error: string) => void): void;
	goUp(onFinish: (error: string) => void): void;
	readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void;

	createSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
	updateSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
	deleteSongData(title: string, onFinish: (error: string) => void): void;
	renameSongData(title: string, newTitle: string, onFinish: (error: string) => void): void;

	createFolder(title: string, onFinish: (error: string) => void): void;
	deleteFolder(title: string, onFinish: (error: string) => void): void;
	renameFolder(title: string, newTitle: string, onFinish: (error: string) => void): void;
}
