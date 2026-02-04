console.log('newMIDIx v1.0.1');
class MiniumMIDIx extends MZXBX_Plugin_UI {
	currentProject: Zvoog_Project;
	constructor() {
		super(false);
	}
	test() {
		console.log('test');
		
		
var tracks:Track[] = [];

tracks[0] = new  Track();
tracks[0].setTimeSignatureOnly(3, 4);
tracks[0].setTempo(100);

var notes;

// melody
tracks[1] = new  Track();
tracks[1].addEvent(new ProgramChangeEvent({instrument: 14-1}));

notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A4', 'C#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['B4', 'D5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['G#4', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A4', 'C#5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A4'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A4', 'C#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['B4', 'D5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['G#4', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A4', 'C#5'], duration: '2'});
tracks[1].addEvent(notes);
// note how the previous rest is handled: it became the wait
notes = new  NoteEvent({wait: '4', pitch:['E5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['D#5', 'F#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['D5', 'G#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'A5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['E5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['D#5', 'F#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['D5', 'G#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'A5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch:['C#5', 'E5'], duration: '2'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A4', 'C#5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['C#5', 'E5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['B4', 'D5'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['G#4', 'B4'], duration: '4'});
tracks[1].addEvent(notes);
notes = new  NoteEvent({pitch:['A4'], duration: '2'});
tracks[1].addEvent(notes);

// bass
tracks[2] = new  Track();
tracks[2].addEvent(new ProgramChangeEvent({instrument: 35-1}));

notes = new  NoteEvent({pitch:['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['E3'], duration: '2'});
tracks[2].addEvent(notes);
notes = new  NoteEvent({wait: '4', pitch: ['A3'], duration: '2'});
tracks[2].addEvent(notes);


var write = new  Writer(tracks);

console.log(write.dataUri());
	}
	onMessageFromHost(message: MZXBX_MessageToPlugin): void {
		this.currentProject = message.hostData;
		if (this.currentProject) {
			this.refreshInfo();
		}
	}
	refreshInfo() {
		let startMeasure = this.currentProject.selectedPart.startMeasure;
		let endMeasure = this.currentProject.selectedPart.endMeasure;
		if (startMeasure < 0) {
			startMeasure = 0;
			endMeasure = this.currentProject.timeline.length - 1;
		}
		let metrecount = this.currentProject.timeline[startMeasure].metre.count;
		let metrepart = this.currentProject.timeline[startMeasure].metre.part;
		let tempo = this.currentProject.timeline[startMeasure].tempo;
		let selfrom = document.getElementById('selfrom');
		if (selfrom) {
			(selfrom as any).value = startMeasure + 1;
		}
		let selto = document.getElementById('selto');
		if (selto) {
			(selto as any).value = endMeasure + 1;
		}
		let metreinput = document.getElementById('metreinput');
		if (metreinput) {
			(metreinput as any).value = '' + metrecount + '/' + metrepart;
		}
		let bpm = document.getElementById('bpm');
		if (bpm) {
			(bpm as any).value = tempo;
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
			this.setText('plugintitle', '更改选定措施');
			this.setText('sellabel', '选择');
			this.setText('splitlabel', '分离');
			this.setText('tempolabel', '音乐节奏');
			this.setText('metrelabel', '音乐节拍');
			this.setText('btndel', '删除');
			this.setText('btnclear', '清除');
			this.setText('btnadd', '添加');
			this.setText('btnpushaside', '推开');
			this.setText('btnmerge', '合并');
		} else {
			if (enruzhId == 'ru') {
				this.setText('plugintitle', 'Изменить такты');
				this.setText('sellabel', 'Выбрано');
				this.setText('splitlabel', 'Отделить');
				this.setText('tempolabel', 'Темп');
				this.setText('metrelabel', 'Метр');
				this.setText('btndel', 'Удалить');
				this.setText('btnclear', 'Очистить');

				this.setText('btnadd', 'Добавить');
				this.setText('btnpushaside', 'Отодвинуть');
				this.setText('btnmerge', 'Объединить');
			} else {
				this.setText('plugintitle', 'Change selected measures');
				this.setText('sellabel', 'Selection');
				this.setText('splitlabel', 'Split');
				this.setText('tempolabel', 'Tempo');
				this.setText('metrelabel', 'Metre');
				this.setText('btndel', 'Delete');
				this.setText('btnclear', 'Clrear');
				this.setText('btnadd', 'Add to end');
				this.setText('btnpushaside', 'Push aside');
				this.setText('btnmerge', 'Merge');
			}
		}

	}


}




