type ZvoogStoreListItem = {
	title: string
	, isFolder: boolean
};
interface ZvoogStore {
	getList(): ZvoogStoreListItem[];
	goFolder(item: ZvoogStoreListItem): boolean;
	goUp(): boolean;
	readSongData(item: ZvoogStoreListItem): ZvoogSchedule;
	writeSongData(schedule: ZvoogSchedule): boolean;
}
