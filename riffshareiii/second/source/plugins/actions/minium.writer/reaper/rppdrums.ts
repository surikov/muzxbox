function createDrumMeasures(writer: RPPWriter, project: Zvoog_Project): string {
    let duration = MMUtil();
    let longS = 0;
    let drums: { start: Zvoog_Metre, drumNum: number }[] = [];
    for (let ii = 0; ii < project.timeline.length; ii++) {
        let bar = project.timeline[ii];

        for (let tt = 0; tt < project.percussions.length; tt++) {
            let drumTrack = project.percussions[tt];
            let num = 0;
            num = drumTrack.sampler.hint35_81;
            let drumSkips = drumTrack.measures[ii].skips;
            for (let dd = 0; dd < drumSkips.length; dd++) {
                let skip = drumSkips[dd];
                drums.push({ start: duration.plus(skip).metre(), drumNum: num });
            }
        }


        longS = longS + MMUtil().set(bar.metre).duration(bar.tempo);
        duration = duration.plus(bar.metre);
    }
    drums.sort((a, b) => {
        return MMUtil().set(a.start).duration(100) - MMUtil().set(b.start).duration(100);
    });
    // console.log(drums);

    let drumItem = writer.crlf + '';
    drumItem = drumItem + `    <ITEM
      POSITION 0.0
      SNAPOFFS 0
      LENGTH `+ longS.toFixed(10) + `
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {`+ crypto.randomUUID() + `}
      IID 4
      NAME Drums
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {`+ crypto.randomUUID() + `}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {`+ crypto.randomUUID() + `}`;
    /*
drumItem = drumItem + this.createMIDIevent(35, 0, '90', '7f');
drumItem = drumItem + this.createMIDIevent(35, 480, '80', '0');
drumItem = drumItem + this.createMIDIevent(35, 0, '90', '7f');
drumItem = drumItem + this.createMIDIevent(35, 480, '80', '0');
drumItem = drumItem + this.createMIDIevent(38, 0, '90', '7f');
drumItem = drumItem + this.createMIDIevent(38, 960, '80', '0');
*/

    //let wholeDuration = MMUtil();

    let current = MMUtil();
    for (let mm = 0; mm < drums.length; mm++) {
        let singleDrum = drums[mm];
        let delta = MMUtil().set(singleDrum.start).minus(current).metre();
        let midiSkip = Math.round(120 * (delta.count / delta.part) / (1 / 16));//1/16=240
        //console.log(singleDrum.drumNum, midiSkip, delta, singleDrum.start);
        let drumHex = singleDrum.drumNum.toString(16);
        drumItem = drumItem + writer.crlf + '        e ' + midiSkip + ' 80 ' + drumHex + ' 0';
        drumItem = drumItem + writer.crlf + '        e ' + midiSkip + ' 90 ' + drumHex + ' 7f';
        current.set(singleDrum.start);
        // wholeDuration = wholeDuration.plus(project.timeline[mm].metre);
    }
    let wholeDuration = project.timeline.reduce((accumulator, current) => accumulator.plus(current.metre), MMUtil());
    let remains = wholeDuration.minus(current);
    let ticks = Math.round(240 * (remains.count / remains.part) / (1 / 16));
    ticks = ticks > 0 ? ticks : 0;
    drumItem = drumItem + writer.crlf + `        E ` + ticks + ` b0 7b 00`;
    //console.log('wholeDuration', wholeDuration, remains);
    drumItem = drumItem + writer.crlf + `        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {`+ crypto.randomUUID() + `}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 3
        EVTFILTER 0 -1 -1 -1 -1 0 1 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE -1 100 0 0 1
        CFGEDITVIEW 0 0.188451 61 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL -252
        CFGEDIT 1 1 0 1 0 8 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >`;
    return drumItem;
}
function createDrumTrack(writer: RPPWriter, project: Zvoog_Project) {

    let drumTrackGuid = crypto.randomUUID();
    let drumBody = `  <TRACK {` + drumTrackGuid + `}
    NAME Drums
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0 0
    FIXEDLANES 9 0 0 0 0
    LANEREC -1 -1 -1 0
    SEL 0
    REC 0 0 1 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {` + drumTrackGuid + `}
    PERF 0
    MIDIOUT -1 -1
    MAINSEND 1 0
    <FXCHAIN
      WNDRECT 243 219 1227 753
      SHOW 0
      LASTSEL 0
      DOCKED 0
      BYPASS 0 0 0
      <JS chmaha-inst/MajorGeneralMIDI.jsfx ""
        128 1 2 3 4 5 6 7 8 128 10 11 12 13 14 15 440 5 0 2 84.5 0 1 30 39 100 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 64 64 64 64 "" 64 64 64 64 64 64 64 64 64 64 64 64 64
      >
      MULTIFXLINK 0
      FLOATPOS 0 0 0 0
      FXID {`+ crypto.randomUUID() + `}
      WAK 0 0
    >`;
    /*
        drumBody = drumBody + this.createDrumMeasure('a', 0, 1);
        drumBody = drumBody + this.createDrumMeasure('b', 1, 1.5);
        drumBody = drumBody + this.createDrumMeasure('c', 2.5, 1.256);
        drumBody = drumBody + this.createDrumMeasure('d', 3.756, 4);
        */
    drumBody = drumBody + createDrumMeasures(writer, project);

    drumBody = drumBody + writer.crlf + `  >`;



    return drumBody;
}