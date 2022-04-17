type ZvoogSchedule = {
	title: string
	, tracks: ZvoogTrack[]
	, filters: ZvoogFilterSetting[]
	, measures: ZvoogMeasure[]
	, harmony: ZvoogProgression
	, obverseTrackFilter?: number
	, rhythm?: ZvoogMeter[]
};
function scheduleDuration(song: ZvoogSchedule): number {
	var ss = 0;
	for (var i = 0; i < song.measures.length; i++) {
		ss = ss + meter2seconds(song.measures[i].tempo, song.measures[i].meter);
	}
	return ss;
}
