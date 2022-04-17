class LayerSelector {
    muzXBox: MuzXBox;
    constructor(from: MuzXBox) {
        this.muzXBox = from;
    }
    upSongFx(fx: number): () => void {
        return () => {
            console.log('upSongFx', fx);
            this.muzXBox.currentSchedule.obverseTrackFilter = this.muzXBox.currentSchedule.tracks.length + fx;
            this.muzXBox.currentSchedule.filters[fx].obverseParameter = 0;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upSongFxParam(fx: number, param: number): () => void {
        return () => {
            console.log('upSongFxParam', fx, param);
            this.muzXBox.currentSchedule.obverseTrackFilter = this.muzXBox.currentSchedule.tracks.length + fx;
            this.muzXBox.currentSchedule.filters[fx].obverseParameter = param;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upTrack(trk: number): () => void {
        return () => {
            console.log('upTrack', trk);
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            if (this.muzXBox.currentSchedule.tracks.length) {
                this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = 0;
            }
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upTrackFx(trk: number, fx: number): () => void {
        return () => {
            console.log('upTrackFx', trk, fx);
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upTrackFxParam(trk: number, fx: number, param: number): () => void {
        return () => {
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
            this.muzXBox.currentSchedule.tracks[trk].filters[fx].obverseParameter = param;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
            console.log('upTrackFxParam', trk, fx, param);
        };
    }

    upVox(trk: number, vox: number): () => void {
        return () => {
            console.log('upVox', trk, vox);
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upVoxFx(trk: number, vox: number, fx: number): () => void {
        return () => {
            console.log('upVoxFx', trk, vox, fx);
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upVoxFxParam(trk: number, vox: number, fx: number, param: number): () => void {
        return () => {
            console.log('upVoxFxParam', trk, vox, fx, param);
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
            this.muzXBox.currentSchedule.tracks[trk].voices[vox].filters[fx].obverseParameter = fx;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upVoxProvider(trk: number, vox: number): () => void {
        return () => {
            console.log('upVoxProvider', trk, vox);
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
    upVoxProviderParam(trk: number, vox: number, param: number): () => void {
        return () => {
            console.log('upVoxProviderParam', trk, vox, param);
            this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
            this.muzXBox.currentSchedule.tracks[trk].voices[vox].performer.obverseParameter = 0;
            this.muzXBox.zrenderer.drawSchedule(this.muzXBox.currentSchedule);
            this.muzXBox.zMainMenu.fillFrom(this.muzXBox.currentSchedule);
        };
    }
}