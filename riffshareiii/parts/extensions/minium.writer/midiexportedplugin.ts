console.log('newMIDIx v1.0.1');
class MiniumMIDIx extends MZXBX_Plugin_UI {
	currentProject: Zvoog_Project;
	constructor() {
		super(true);
	}
	startExportJSON() {
		this.exportLocalfile();
	}
	exportLocalfile() {
		//console.log('exportLocalfile', th);
		if (this.currentProject) {
			this.download(JSON.stringify(this.currentProject), 'minium', 'application/json');
		}
	}
	download(data: string, filename: string, type: string) {

		let file = new Blob([data], { type: type });
		let a: HTMLAnchorElement = document.createElement("a");
		let url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();

	}
	exportImage() {
		console.log('exportImage');
		let canvas = document.getElementById("prvw") as HTMLCanvasElement;
		if (canvas) {
			let dataURl: string = canvas.toDataURL('image/png');
			canvas.toBlob((blob: Blob | null) => {
				console.log('blob', blob);
				if (blob) {
					let pro: Promise<ArrayBuffer> = blob.arrayBuffer();
					pro.catch((reason: any) => {
						console.log('reason', reason);
					});
					pro.then((arrayBuffer: ArrayBuffer) => {
						console.log('arrayBuffer', arrayBuffer);
					});
				}
			}, 'image/png');

			let a: HTMLAnchorElement = document.createElement("a");
			a.href = dataURl;
			a.download = "minium";
			document.body.appendChild(a);
			a.click();
		}

	}
	startExportMIDI() {
		console.log('startExportMIDI', this.currentProject);
		let tracks: Track[] = [];
		let track0 = new Track();
		track0.addEvent(new TrackNameEvent({ text: 'Drums' }));

		track0.addInstrumentName('Drums');
		tracks[0] = track0;
		track0.setTimeSignatureOnly(4, 4);
		track0.setTempo(120);
		let drumEvents: { start: number, pitch: number, on: boolean }[] = [];
		let drumdur = 0.5;
		for (let ii = 0; ii < this.currentProject.percussions.length; ii++) {
			let barstart = 0;
			let perctrack: Zvoog_PercussionTrack = this.currentProject.percussions[ii];
			for (let mm = 0; mm < this.currentProject.timeline.length; mm++) {
				let bar = this.currentProject.timeline[mm];
				let drumeasure = perctrack.measures[mm];
				for (let dd = 0; dd < drumeasure.skips.length; dd++) {
					let sk = drumeasure.skips[dd];
					let pi = perctrack.sampler.hint35_81;
					if (pi < 35 || pi > 81) pi = 81;
					drumEvents.push({ pitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo), on: true });
					drumEvents.push({ pitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo) + drumdur, on: false });
				}
				barstart = barstart + MMUtil().set(bar.metre).duration(bar.tempo);
			}
		}
		drumEvents.sort(function (a, b) {
			return a.start - b.start;
		});
		let preStart = 0;
		let tickRatio = 128 * 2;//HEADER_CHUNK_DIVISION * bar duration in seconds
		for (var ii = 0; ii < drumEvents.length; ii++) {
			var wait = drumEvents[ii].start - preStart;
			if (drumEvents[ii].on) {
				let on: NoteOnEventOnOff2 = new NoteOnEventOnOff2(9, Math.round(wait * tickRatio), drumEvents[ii].pitch, 98, true);
				track0.addEvent(on);
			} else {
				let off: NoteOnEventOnOff2 = new NoteOnEventOnOff2(9, Math.round(wait * tickRatio), drumEvents[ii].pitch, 0, false);
				track0.addEvent(off);
			}
			preStart = preStart + wait;
		}
		for (let tt = 0; tt < this.currentProject.tracks.length && tt < 15; tt++) {
			let channn = tt;
			if (channn > 8) channn = tt + 1;
			let trckEvents: { start: number, chordpitch: number, on: boolean }[] = [];
			let barstart = 0;
			let protrack = this.currentProject.tracks[tt];
			let newmitrack = new Track();
			newmitrack.setTimeSignatureOnly(4, 4);
			newmitrack.setTempo(120);
			tracks.push(newmitrack);
			let mins = protrack.performer.hint1_128;
			if (mins > 0 && mins < 129) {
				mins = mins - 1;
			} else {
				mins = 0;
			}
			newmitrack.addEvent(new ProgramChangeEvent({ instrument: mins, channel: channn }));
			newmitrack.addInstrumentName(protrack.title);
			newmitrack.addEvent(new TrackNameEvent({ text: protrack.title }));
			for (let mm = 0; mm < this.currentProject.timeline.length; mm++) {
				let bar = this.currentProject.timeline[mm];
				let inmeasure = protrack.measures[mm];
				for (let cc = 0; cc < inmeasure.chords.length; cc++) {
					let chord = inmeasure.chords[cc];
					let sk = chord.skip;
					let chorddur = 0;
					for (let sl = 0; sl < chord.slides.length; sl++) {
						chorddur = chorddur + MMUtil().set(chord.slides[sl].duration).duration(bar.tempo);
					}
					for (let nn = 0; nn < chord.pitches.length; nn++) {
						let pi = chord.pitches[nn];
						trckEvents.push({ chordpitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo), on: true });
						trckEvents.push({ chordpitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo) + chorddur, on: false });
					}
				}
				barstart = barstart + MMUtil().set(bar.metre).duration(bar.tempo);
			}
			trckEvents.sort(function (a, b) {
				return a.start - b.start;
			});
			let preStart = 0;
			for (var ii = 0; ii < trckEvents.length; ii++) {
				var wait = trckEvents[ii].start - preStart;
				if (trckEvents[ii].on) {
					let on: NoteOnEventOnOff2 = new NoteOnEventOnOff2(channn, Math.round(wait * tickRatio), trckEvents[ii].chordpitch, 97, true);
					newmitrack.addEvent(on);
				} else {
					let off: NoteOnEventOnOff2 = new NoteOnEventOnOff2(channn, Math.round(wait * tickRatio), trckEvents[ii].chordpitch, 0, false);
					newmitrack.addEvent(off);
				}
				preStart = preStart + wait;
			}
		}
		var write = new Writer(tracks);
		/*
		let uint8Array:Uint8Array=write.buildFile();
		let bufferSource:BufferSource=uint8Array.buffer;
		//console.log(write.dataUri());
		let data:BlobPart[]=[bufferSource];
		let file = new Blob(data, { type: "audio/midi" });
		*/
		let a: HTMLAnchorElement = document.createElement("a");
		//let url = URL.createObjectURL(file);
		//a.href = url;
		a.href = write.dataUri();
		a.download = "export.mid";
		document.body.appendChild(a);
		a.click();
	}
	onMessageFromHost(message: MZXBX_MessageToPlugin): void {
		this.currentProject = message.hostData;
		console.log('onMessageFromHost',message);
		if (message.screenData) {
			let sz = 500;
			let canvas = document.getElementById("prvw") as HTMLCanvasElement;
			if (canvas) {
				let context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
				var imageData: ImageData = context.getImageData(0, 0, sz, sz);
				imageData.data.set(message.screenData);
				context.putImageData(imageData, 0, 0);
			}
		}
	}
	setText(id: string, txt: string) {
		let oo = document.getElementById(id);
		if (oo) {
			oo.innerHTML = txt;
		}
	}
	onLanguaga(enruzhId: string): void {
		if (enruzhId == 'zh') {
			this.setText('plugintitle', 'Export');
			this.setText('btnsendmidi', 'MIDI');
			this.setText('btnsendjson', 'JSON');
		} else {
			if (enruzhId == 'ru') {
				this.setText('plugintitle', 'Экспорт');
				this.setText('btnsendmidi', 'MIDI');
				this.setText('btnsendjson', 'JSON');
			} else {
				this.setText('plugintitle', 'Export');
				this.setText('btnsendmidi', 'MIDI');
				this.setText('btnsendjson', 'JSON');
			}
		}

	}


}




