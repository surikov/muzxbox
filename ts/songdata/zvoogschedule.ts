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
function drumRowsCount(song: ZvoogSchedule): number {
	let rr = 0;
	for (let tt = 0; tt < song.tracks.length; tt++) {
		rr = rr + song.tracks[tt].percussions.length;
	}
	return rr;
}
function topGridMarginTp(song: ZvoogSchedule, pitchLineThicknessInTaps: number): number {
	let drHH = drumRowsCount(song) * pitchLineThicknessInTaps;
	return topContentMargin + drHH + drumGridPadding;
}
function wholeHeightTp(song: ZvoogSchedule,ratioThickness: number): number {
	return topGridMarginTp(song,ratioThickness) + (octaveCount * 12) * ratioThickness + bottomGridMargin;
}
function coverProject(song: ZvoogSchedule){
	
}