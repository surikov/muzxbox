class LayerSelector {
	muzXBox: MuzXBox;
	constructor(from: MuzXBox) {
		this.muzXBox = from;
	}

	upSongFx(fx: number): () => void {
		return () => {
			console.log('upSongFx', fx);
			//this.muzXBox.currentSchedule.obverseTrackFilter = this.muzXBox.currentSchedule.tracks.length + fx;
			//this.muzXBox.currentSchedule.filters[fx].obverseParameter = 0;
			this.selectSongFx(this.muzXBox.currentSchedule, fx);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upSongFxParam(fx: number, param: number): () => void {
		return () => {
			console.log('upSongFxParam', fx, param);
			//this.muzXBox.currentSchedule.obverseTrackFilter = this.muzXBox.currentSchedule.tracks.length + fx;
			//this.muzXBox.currentSchedule.filters[fx].obverseParameter = param;
			this.selectSongFxParam(this.muzXBox.currentSchedule, fx, param);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrack(trk: number): () => void {
		return () => {
			console.log('upTrack', trk);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//if (this.muzXBox.currentSchedule.tracks.length) {
			//	this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = 0;
			//}
			this.selectSongTrack(this.muzXBox.currentSchedule, trk)
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrackFx(trk: number, fx: number): () => void {
		return () => {
			console.log('upTrackFx', trk, fx);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
			this.selectSongTrackFx(this.muzXBox.currentSchedule, trk, fx);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upTrackFxParam(trk: number, fx: number, param: number): () => void {
		return () => {
			console.log('upTrackFxParam', trk, fx, param);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
			//this.muzXBox.currentSchedule.tracks[trk].filters[fx].obverseParameter = param;
			this.selectSongTrackFxParam(this.muzXBox.currentSchedule, trk, fx, param);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
			console.log('upTrackFxParam', trk, fx, param);
		};
	}

	upInstrument(trk: number, vox: number): () => void {
		return () => {
			console.log('upInstrument', trk, vox);
			this.selectSongTrackInstrument(this.muzXBox.currentSchedule, trk, vox)
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upDrum(trk: number, vox: number): () => void {
		return () => {
			console.log('upDrum', trk, vox);
			this.selectSongTrackDrum(this.muzXBox.currentSchedule, trk, vox)
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upInstrumentFx(trk: number, vox: number, fx: number): () => void {
		return () => {
			console.log('upInstrumentFx', trk, vox, fx);
			this.selectSongTrackInstrumentFx(this.muzXBox.currentSchedule, trk, vox, fx);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upDrumFx(trk: number, vox: number, fx: number): () => void {
		return () => {
			console.log('upDrumFx', trk, vox, fx);
			this.selectSongTrackDrumFx(this.muzXBox.currentSchedule, trk, vox, fx);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upInstrumentFxParam(trk: number, vox: number, fx: number, param: number): () => void {
		return () => {
			console.log('upInstrumentFxParam', trk, vox, fx, param);
			this.selectSongTrackInstrumentFxParam(this.muzXBox.currentSchedule, trk, vox, fx, param);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upDrumFxParam(trk: number, vox: number, fx: number, param: number): () => void {
		return () => {
			console.log('upDrumFxParam', trk, vox, fx, param);
			this.selectSongTrackDrumFxParam(this.muzXBox.currentSchedule, trk, vox, fx, param);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upInstrumentProvider(trk: number, vox: number): () => void {
		return () => {
			console.log('upInstrumentProvider', trk, vox);
			this.selectSongTrackInstrumentPerformer(this.muzXBox.currentSchedule, trk, vox);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upDrumProvider(trk: number, vox: number): () => void {
		return () => {
			console.log('upDrumProvider', trk, vox);
			this.selectSongTrackDrumPerformer(this.muzXBox.currentSchedule, trk, vox);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upInstrumentProviderParam(trk: number, vox: number, param: number): () => void {
		return () => {
			console.log('upVoxProviderParam', trk, vox, param);
			this.selectSongTrackInstrumentPerformerParam(this.muzXBox.currentSchedule, trk, vox, param);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upDrumProviderParam(trk: number, vox: number, param: number): () => void {
		return () => {
			console.log('upDrumProviderParam', trk, vox, param);
			this.selectSongTrackDrumPerformerParam(this.muzXBox.currentSchedule, trk, vox, param);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}

	clearLevelFocus(song: ZvoogSchedule) {
		for (let fx = 0; fx < song.filters.length; fx++) {
			let filter = song.filters[fx]
			filter.focus = false;
			for (let fxpr = 0; fxpr < filter.parameters.length; fxpr++) {
				filter.parameters[fxpr].focus = false;
			}
		}
		for (let tr = 0; tr < song.tracks.length; tr++) {
			let track = song.tracks[tr];
			track.focus = false;
			for (let fx = 0; fx < track.filters.length; fx++) {
				let filter = track.filters[fx]
				filter.focus = false;
				for (let fxpr = 0; fxpr < filter.parameters.length; fxpr++) {
					filter.parameters[fxpr].focus = false;
				}
			}
			for (let vc = 0; vc < track.instruments.length; vc++) {
				let voice = track.instruments[vc];
				voice.focus = false;
				voice.instrumentSetting.focus = false;
				for (let prpr = 0; prpr < voice.instrumentSetting.parameters.length; prpr++) {
					voice.instrumentSetting.parameters[prpr].focus = false;
				}
				for (let fx = 0; fx < voice.filters.length; fx++) {
					let filter = voice.filters[fx]
					filter.focus = false;
					for (let fxpr = 0; fxpr < filter.parameters.length; fxpr++) {
						filter.parameters[fxpr].focus = false;
					}
				}
			}
			for (let pp = 0; pp < track.percussions.length; pp++) {
				let voice = track.percussions[pp];
				voice.focus = false;
				voice.percussionSetting.focus = false;
				for (let prpr = 0; prpr < voice.percussionSetting.parameters.length; prpr++) {
					voice.percussionSetting.parameters[prpr].focus = false;
				}
				for (let fx = 0; fx < voice.filters.length; fx++) {
					let filter = voice.filters[fx]
					filter.focus = false;
					for (let fxpr = 0; fxpr < filter.parameters.length; fxpr++) {
						filter.parameters[fxpr].focus = false;
					}
				}
			}
		}
	}
	selectSongFx(song: ZvoogSchedule, fxNum: number) {
		this.clearLevelFocus(song);
		song.filters[fxNum].focus = true;
	}
	selectSongFxParam(song: ZvoogSchedule, fxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.filters[fxNum].focus = true;
		song.filters[fxNum].parameters[prNum].focus = true;
	}
	selectSongTrack(song: ZvoogSchedule, trNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
	}
	selectSongTrackFx(song: ZvoogSchedule, trNum: number, fxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].filters[fxNum].focus = true;
	}
	selectSongTrackFxParam(song: ZvoogSchedule, trNum: number, fxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].filters[fxNum].focus = true;
		song.tracks[trNum].filters[fxNum].parameters[prNum].focus = true;
	}
	selectSongTrackInstrument(song: ZvoogSchedule, trNum: number, voxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].instruments[voxNum].focus = true;
		//console.log('selectSongTrackVox',trNum,song.tracks[trNum].title,voxNum,song.tracks[trNum].voices[voxNum].title);
	}
	selectSongTrackDrum(song: ZvoogSchedule, trNum: number, voxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].percussions[voxNum].focus = true;
		//console.log('selectSongTrackVox',trNum,song.tracks[trNum].title,voxNum,song.tracks[trNum].voices[voxNum].title);
	}
	selectSongTrackInstrumentPerformer(song: ZvoogSchedule, trNum: number, voxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].instruments[voxNum].focus = true;
		song.tracks[trNum].instruments[voxNum].instrumentSetting.focus = true;
	}
	selectSongTrackDrumPerformer(song: ZvoogSchedule, trNum: number, voxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].percussions[voxNum].focus = true;
		song.tracks[trNum].percussions[voxNum].percussionSetting.focus = true;
	}
	selectSongTrackInstrumentPerformerParam(song: ZvoogSchedule, trNum: number, voxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].instruments[voxNum].focus = true;
		song.tracks[trNum].instruments[voxNum].instrumentSetting.focus = true;
		song.tracks[trNum].instruments[voxNum].instrumentSetting.parameters[prNum].focus = true;
	}
	selectSongTrackDrumPerformerParam(song: ZvoogSchedule, trNum: number, voxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].percussions[voxNum].focus = true;
		song.tracks[trNum].percussions[voxNum].percussionSetting.focus = true;
		song.tracks[trNum].percussions[voxNum].percussionSetting.parameters[prNum].focus = true;
	}
	selectSongTrackInstrumentFx(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].instruments[voxNum].focus = true;
		song.tracks[trNum].instruments[voxNum].filters[fxNum].focus = true;
	}
	selectSongTrackDrumFx(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].percussions[voxNum].focus = true;
		song.tracks[trNum].percussions[voxNum].filters[fxNum].focus = true;
	}
	selectSongTrackInstrumentFxParam(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].instruments[voxNum].focus = true;
		song.tracks[trNum].instruments[voxNum].filters[fxNum].focus = true;
		song.tracks[trNum].instruments[voxNum].filters[fxNum].parameters[prNum].focus = true;
	}
	selectSongTrackDrumFxParam(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].percussions[voxNum].focus = true;
		song.tracks[trNum].percussions[voxNum].filters[fxNum].focus = true;
		song.tracks[trNum].percussions[voxNum].filters[fxNum].parameters[prNum].focus = true;
	}

	almostFirstInSong(song: ZvoogSchedule) {
		for (let fx = 0; fx < song.filters.length; fx++) {
			if (song.filters[fx].focus) return;
		}
		for (let tr = 0; tr < song.tracks.length; tr++) {
			if (song.tracks[tr].focus) return;
		}
		if (song.tracks.length > 0) song.tracks[0].focus = true;
	}
	almostFirstInTrack(track: ZvoogTrack) {
		for (let fx = 0; fx < track.filters.length; fx++) {
			if (track.filters[fx].focus) return;
		}
		for (let vx = 0; vx < track.instruments.length; vx++) {
			if (track.instruments[vx].focus) return;
		}
		for (let vx = 0; vx < track.percussions.length; vx++) {
			if (track.percussions[vx].focus) return;
		}
		if (track.instruments.length > 0) {
			track.instruments[0].focus = true;
			return;
		}
		if (track.percussions.length > 0) {
			track.percussions[0].focus = true;
			return;
		}
	}
	
	
}