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

	upVox(trk: number, vox: number): () => void {
		return () => {
			console.log('upVox', trk, vox);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			this.selectSongTrackVox(this.muzXBox.currentSchedule, trk, vox)
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxFx(trk: number, vox: number, fx: number): () => void {
		return () => {
			console.log('upVoxFx', trk, vox, fx);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			//this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
			this.selectSongTrackVoxFx(this.muzXBox.currentSchedule, trk, vox, fx);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxFxParam(trk: number, vox: number, fx: number, param: number): () => void {
		return () => {
			console.log('upVoxFxParam', trk, vox, fx, param);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			//this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
			//this.muzXBox.currentSchedule.tracks[trk].voices[vox].filters[fx].obverseParameter = fx;
			this.selectSongTrackVoxFxParam(this.muzXBox.currentSchedule, trk, vox, fx, param);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxProvider(trk: number, vox: number): () => void {
		return () => {
			console.log('upVoxProvider', trk, vox);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			//this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
			this.selectSongTrackVoxPerformer(this.muzXBox.currentSchedule, trk, vox);
			this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
			this.muzXBox.zMainMenu.fillSongMenuFrom(this.muzXBox.currentSchedule);
		};
	}
	upVoxProviderParam(trk: number, vox: number, param: number): () => void {
		return () => {
			console.log('upVoxProviderParam', trk, vox, param);
			//this.muzXBox.currentSchedule.obverseTrackFilter = trk;
			//this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
			//this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
			//this.muzXBox.currentSchedule.tracks[trk].voices[vox].performer.obverseParameter = 0;
			this.selectSongTrackVoxPerformerParam(this.muzXBox.currentSchedule, trk, vox, param);
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
			for (let vc = 0; vc < track.voices.length; vc++) {
				let voice = track.voices[vc];
				voice.focus = false;
				voice.performer.focus = false;
				for (let prpr = 0; prpr < voice.performer.parameters.length; prpr++) {
					voice.performer.parameters[prpr].focus = false;
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
	selectSongTrackVox(song: ZvoogSchedule, trNum: number, voxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].voices[voxNum].focus = true;
		//console.log('selectSongTrackVox',trNum,song.tracks[trNum].title,voxNum,song.tracks[trNum].voices[voxNum].title);
	}
	selectSongTrackVoxPerformer(song: ZvoogSchedule, trNum: number, voxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].voices[voxNum].focus = true;
		song.tracks[trNum].voices[voxNum].performer.focus = true;
	}
	selectSongTrackVoxPerformerParam(song: ZvoogSchedule, trNum: number, voxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].voices[voxNum].focus = true;
		song.tracks[trNum].voices[voxNum].performer.focus = true;
		song.tracks[trNum].voices[voxNum].performer.parameters[prNum].focus = true;
	}
	selectSongTrackVoxFx(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].voices[voxNum].focus = true;
		song.tracks[trNum].voices[voxNum].filters[fxNum].focus = true;
	}
	selectSongTrackVoxFxParam(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number, prNum: number) {
		this.clearLevelFocus(song);
		song.tracks[trNum].focus = true;
		song.tracks[trNum].voices[voxNum].focus = true;
		song.tracks[trNum].voices[voxNum].filters[fxNum].focus = true;
		song.tracks[trNum].voices[voxNum].filters[fxNum].parameters[prNum].focus = true;
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
		for (let vx = 0; vx < track.voices.length; vx++) {
			if (track.voices[vx].focus) return;
		}
		if (track.voices.length > 0) track.voices[0].focus = true;
	}
	
	
}