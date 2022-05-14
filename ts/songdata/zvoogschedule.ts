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
function viewWidthTp(song: ZvoogSchedule, ratioDuration: number): number {
	let songDuration = scheduleSecondsDuration(song);
	return leftGridMargin + songDuration * ratioDuration + rightGridMargin;
}
function gridHeightTp(ratioThickness: number): number {
	return (ocataveCount * 12) * ratioThickness;
}
function viewHeightTp(ratioThickness: number): number {
	return topGridMargin + (ocataveCount * 12) * ratioThickness + bottomGridMargin;
}
