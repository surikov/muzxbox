type ZvoogSchedule = {
	title: string
	, tracks: ZvoogTrack[]
	, filters: ZvoogFilterSetting[]
	, measures: ZvoogMeasure[]
	, harmony: ZvoogProgression
	//, obverseTrackFilter?: number
	, rhythm?: ZvoogMeter[]
};
function scheduleSecondsDuration(song: ZvoogSchedule): number {
	var ss = 0;
	for (var i = 0; i < song.measures.length; i++) {
		ss = ss + meter2seconds(song.measures[i].tempo, song.measures[i].meter);
	}
	return ss;
}
function gridWidthTp(song: ZvoogSchedule, ratioDuration: number): number {
	let songDuration = scheduleSecondsDuration(song);
	return songDuration * ratioDuration;
}
function wholeWidthTp(song: ZvoogSchedule, ratioDuration: number): number {
	let songDuration = scheduleSecondsDuration(song);
	return leftGridMargin + songDuration * ratioDuration + rightGridMargin;
}
function gridHeightTp(ratioThickness: number): number {
	return (octaveCount * 12) * ratioThickness;
}
function wholeHeightTp(ratioThickness: number): number {
	return topGridMargin + (octaveCount * 12) * ratioThickness + bottomGridMargin;
}
