function createTrackMeasures(writer: RPPWriter, trackNo: number, project: Zvoog_Project): string {
    let trackGUID = crypto.randomUUID();
    let track = project.tracks[trackNo];
    let midiProg = track.performer.hint1_128 - 1;

    let duration = MMUtil();
    let longS = 0;
    let evnts: { start: Zvoog_Metre, pitch: number, startStopSLide: 1 | 2 | 3 }[] = [];
    for (let ii = 0; ii < project.timeline.length; ii++) {
        let bar = project.timeline[ii];
        //for (let tt = 0; tt < project.tracks.length; tt++) {

        //let num = 0;
        //num = track.performer.hint1_128;
        let trackChords: Zvoog_Chord[] = track.measures[ii].chords;

        for (let dd = 0; dd < trackChords.length; dd++) {
            let singleChord = trackChords[dd];
            let chordDuration = singleChord.slides.reduce((accumulator, current) => accumulator.plus(current.duration), MMUtil());
            for (let ss = 0; ss < singleChord.pitches.length; ss++) {
                let singlePitch = singleChord.pitches[ss];
                evnts.push({ start: duration.plus(singleChord.skip).metre(), pitch: singlePitch, startStopSLide: 1 });
                if (singleChord.slides.length > 1 || (singleChord.slides[0].delta)) {
                    let slidePoint = MMUtil().set(duration).plus(singleChord.skip);
                    for (let ss = 0; ss < singleChord.slides.length; ss++) {
                        slidePoint = slidePoint.plus(singleChord.slides[ss].duration);
                        //evnts.push({ start: slidePoint.metre(), pitch: singleChord.slides[ss].delta, startStopSLide: 3 });
                    }
                }
                evnts.push({ start: duration.plus(MMUtil().set(singleChord.skip).plus(chordDuration)).metre(), pitch: singlePitch, startStopSLide: 2 });
            }
            //evnts.push({ start: duration.plus(skip).metre(), drumNum: num });
        }
        //}
        longS = longS + MMUtil().set(bar.metre).duration(bar.tempo);
        duration = duration.plus(bar.metre);
    }
    evnts.sort((a, b) => {
        let aa = Math.round(MMUtil().set(a.start).duration(100) * 1000);
        let bb = Math.round(MMUtil().set(b.start).duration(100) * 1000);

        if (a.startStopSLide == 1) aa = aa + 10;
        if (a.startStopSLide == 2) aa = aa + 1;
        if (a.startStopSLide == 3) aa = aa + 0;

        if (b.startStopSLide == 1) bb = bb + 10;
        if (b.startStopSLide == 2) bb = bb + 1;
        if (b.startStopSLide == 3) bb = bb + 0;
        return aa - bb;
    });
    console.log(writer.safeLabel(project.tracks[trackNo].title), evnts);

    let trackData = `  <TRACK {` + trackGUID + `}
    NAME `+ writer.safeLabel(project.tracks[trackNo].title) + `
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
    TRACKID {`+ trackGUID + `}
    PERF 0
    MIDIOUT -1 -1
    MAINSEND 1 0
    <FXCHAIN
      WNDRECT 212 99 1227 753
      SHOW 0
      LASTSEL 0
      DOCKED 0
      BYPASS 0 0 0
      <JS chmaha-inst/MajorGeneralMIDI.jsfx ""
        `+ midiProg + ` 1 2 3 4 5 6 7 8 128 10 11 12 13 19 15 440 5 0 2 84.5 0 1 30 39 100 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 64 64 64 64 "" 64 64 64 64 64 64 64 64 64 64 64 64 64
      >
      MULTIFXLINK 0
      FLOATPOS 0 0 0 0
      FXID {`+ trackGUID + `}
      WAK 0 0
    >
    <ITEM
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
      IID 3
      NAME ` + writer.safeLabel(project.tracks[trackNo].title) + `
      VOLPAN 1 0 1 -1
      SOFFS 0.000 0.000
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {`+ crypto.randomUUID() + `}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {`+ crypto.randomUUID() + `}`;
    let current = MMUtil();






    for (let ee = 0; ee < evnts.length; ee++) {
        let singlEv = evnts[ee];
        let delta = MMUtil().set(singlEv.start).minus(current).metre();
        let midiSkip = Math.round(240 * (delta.count / delta.part) / (1 / 16));//1/16=240
        let hex = singlEv.pitch.toString(16);
        if (singlEv.startStopSLide == 1) {
            trackData = trackData + writer.crlf + '        e ' + midiSkip + ' 90 ' + hex + ' 7f';
        } else {
            if (singlEv.startStopSLide == 2) {
                trackData = trackData + writer.crlf + '        e ' + midiSkip + ' 80 ' + hex + ' 0';
            } else {
                let sghift = Math.round(0x40-singlEv.pitch * 3).toString(16);
                trackData = trackData + writer.crlf + '        e ' + midiSkip + ' e0 0 ' + sghift ;
                trackData = trackData + writer.crlf + '        ENV 1 0 0';
            }
        }
        current.set(singlEv.start);
    }
    /*E 600 90 36 60
    E 240 90 51 60
    E 0 90 48 60
    E 480 80 36 00
    E 120 80 48 00
    e 1200 90 42 60
    e 240 80 42 00
    E 720 90 4b 60
    E 240 80 51 00
    E 0 80 4b 00
    E 0 b0 7b 00*/
    let wholeDuration = project.timeline.reduce((accumulator, current) => accumulator.plus(current.metre), MMUtil());

    let remains = wholeDuration.minus(current);
    let ticks = Math.round(240 * (remains.count / remains.part) / (1 / 16));
    ticks = ticks > 0 ? ticks : 0;
    trackData = trackData + writer.crlf + `        E ` + ticks + ` b0 7b 00`;
    //console.log(writer.safeLabel(project.tracks[trackNo].title), wholeDuration, remains,ticks);
    //console.log('wholeDuration', wholeDuration, remains);

    trackData = trackData + writer.crlf + `        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {`+ crypto.randomUUID() + `}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 2
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE 128 100 0 0 1
        CFGEDITVIEW -4786.468216 0.104879 45 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL -252
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
  >`;


    return trackData;
}