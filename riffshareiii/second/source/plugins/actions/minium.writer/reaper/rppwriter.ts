class RPPWriter {//https://github.com/ReaTeam/Doc/blob/master/State%20Chunk%20Definitions
  crlf = '\r\n';

  composeReaperProject(zvoogProject: Zvoog_Project): string {
    let body = '';

    //let guid=crypto.randomUUID();
    //console.log(guid);
    body = body + '<REAPER_PROJECT 0.1 "7.83/win64" ' + Date.now() + ' 0';
    body = body + this.crlf + `  <NOTES 0 2
  >
  RIPPLE 0 0
  GROUPOVERRIDE 0 0 0 0
  AUTOXFADE 129
  ENVATTACH 3
  POOLEDENVATTACH 0
  TCPUIFLAGS 0
  MIXERUIFLAGS 11 48 0
  ENVFADESZ10 40
  PEAKGAIN 1
  FEEDBACK 0
  PANLAW 1
  PROJOFFS 0 0 0
  MAXPROJLEN 0 0
  GRID 3199 8 1 8 1 0 0 0
  TIMEMODE 1 5 -1 30 0 0 -1 0
  VIDEO_CONFIG 0 0 65792
  PANMODE 3
  PANLAWFLAGS 3
  CURSOR 8.5
  ZOOM 100 0 0
  VZOOMEX 6 0
  USE_REC_CFG 0
  RECMODE 1
  SMPTESYNC 0 30 100 40 1000 300 0 0 1 0 0
  LOOP 1
  LOOPGRAN 0 4
  RECORD_PATH "Media" ""
  <RECORD_CFG
    ZXZhdxgAAQ==
  >
  <APPLYFX_CFG
  >
  RENDER_FILE ""
  RENDER_PATTERN ""
  RENDER_FMT 0 2 0
  RENDER_1X 0 0
  RENDER_RANGE 1 0 0 0 1000
  RENDER_RESAMPLE 3 0 1
  RENDER_ADDTOPROJ 0
  RENDER_STEMS 0
  RENDER_DITHER 0
  RENDER_TRIM 0.000001 0.000001 0 0
  TIMELOCKMODE 1
  TEMPOENVLOCKMODE 1
  ITEMMIX 1
  DEFPITCHMODE 589824 0
  TAKELANE 1
  SAMPLERATE 44100 0 0
  <RENDER_CFG
    ZXZhdxgAAQ==
  >
  LOCK 1
  <METRONOME 6 2
    VOL 0.25 0.125
    BEATLEN 4
    FREQ 1760 880 1
    SAMPLES "" "" "" ""
    SPLIGNORE 0 0
    SPLDEF 2 660 "" 0 ""
    SPLDEF 3 440 "" 0 ""
    PATTERN 0 169
    PATTERNSTR ABBB
    MULT 1
  >
  GLOBAL_AUTO -1
  TEMPO 120 4 4 0
  PLAYRATE 1 0 0.25 4
  SELECTION 0 0
  SELECTION2 0 0
  MASTERAUTOMODE 0
  MASTERTRACKHEIGHT 0 0
  MASTERPEAKCOL 16576
  MASTERMUTESOLO 0
  MASTERTRACKVIEW 0 0.6667 0.5 0.5 0 0 0 0 0 0 0 0 0 0 1
  MASTERHWOUT 0 0 1 0 0 0 0 -1
  MASTER_NCH 2 2
  MASTER_VOLUME 1 0 -1 -1 1
  MASTER_PANMODE 3
  MASTER_PANLAWFLAGS 3
  MASTER_FX 1
  MASTER_TRACKID {6FCA227D-6A90-41E7-83EA-45510A18B3B7}
  MASTER_SEL 0
  <MASTERPLAYSPEEDENV
    EGUID {EE6A31E0-E64D-9C58-44E2-D382C813B154}
    ACT 0 -1
    VIS 0 1 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 0 -1 -1
  >`;
    body = body + this.crlf + this.createTimeline(zvoogProject);
    body = body + this.crlf + `  RULERHEIGHT 86 86
  RULERLANE 1 4 "" 0 -1 0
  RULERLANE 2 8 "" 0 -1 0
  <PROJBAY
  >
  <TRACK {E8FAFD0F-FFE1-DB44-5CAE-8AC7DAC5992D}
    NAME testinsrtrynebt
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
    TRACKHEIGHT 120 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {E8FAFD0F-FFE1-DB44-5CAE-8AC7DAC5992D}
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
        80 1 2 3 4 5 6 7 8 128 10 11 12 13 19 15 440 5 0 2 84.5 0 1 30 39 100 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 64 64 64 64 "" 64 64 64 64 64 64 64 64 64 64 64 64 64
      >
      MULTIFXLINK 0
      FLOATPOS 0 0 0 0
      FXID {9215941B-69D3-42ED-8EA6-002B8A507461}
      WAK 0 0
    >
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 4
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {1D84EA37-7518-49C9-12C5-FCB48F17FFDD}
      IID 1
      NAME 01-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {4B3574FF-F14F-7D38-9484-F3538F84A12F}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {B198B953-C8B9-A3B1-4128-393FEC14D712}
        e 0 90 40 60
        E 360 e0 2e 42
        E 120 e0 22 4a
        E 120 e0 15 52
        E 120 e0 08 5a
        E 120 e0 6f 69
        E 120 e0 6f 69
        E 120 e0 18 70
        E 120 e0 77 74
        E 120 e0 55 79
        E 0 90 3d 60
        E 120 e0 6a 7c
        E 120 e0 7f 7f
        E 600 90 38 60
        E 120 80 3d 00
        e 720 80 40 00
        E 600 80 38 00
        E 240 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {4B571F06-0FF5-2A92-BB3E-AF2988C94DB3}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 0
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE 128 100 0 0 1
        CFGEDITVIEW -373.342898 0.104879 45 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL -252
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
    <ITEM
      POSITION 4
      SNAPOFFS 0
      LENGTH 4
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {EB47B7BC-A3F6-445E-B038-385E5434900B}
      IID 3
      NAME 01-testinsrtrynebt-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 1.5 3
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {612E7EE9-93E3-4CEE-BC61-EF72030B71FB}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {99E7E6FA-6F38-4BCB-8B01-BB522E5D5177}
        E 600 90 36 60
        E 240 90 51 60
        E 0 90 48 60
        E 480 80 36 00
        E 120 80 48 00
        e 1200 90 42 60
        e 240 80 42 00
        E 720 90 4b 60
        E 240 80 51 00
        E 0 80 4b 00
        E 0 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {B0ECF4E2-C222-4A65-BFBC-91A9FC2DFE5D}
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
    body = body + this.crlf + this.createDrumTrack(zvoogProject);
    body = body + this.crlf + this.createCommentTrack(zvoogProject.title);
    body = body + this.crlf + '>';
    return body;
  }
  createTimeline(zvoogProject: Zvoog_Project): string {
    let timeData = `  <TEMPOENVEX
    EGUID {` + crypto.randomUUID() + `}
    ACT 0 -1
    VIS 1 0 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 1 -1 -1`;
    let start = 0;
    for (let ii = 0; ii < zvoogProject.timeline.length; ii++) {
      let bar = zvoogProject.timeline[ii];
      let txtTempo = bar.tempo.toFixed(10);
      let txtStart = start.toFixed(12);
      timeData = timeData + this.crlf + '    PT ' + txtStart + ' ' + txtTempo + ' 1'
      let sDuration = MMUtil().set(bar.metre).duration(bar.tempo);
      start = start + sDuration;
    }
    timeData = timeData + this.crlf + '  >'
    return timeData;
  }
  createCommentTrack(projectTitle: string): string {
    let commentTrackGuid = crypto.randomUUID();
    let commentBody = `  <TRACK {` + commentTrackGuid + `}
    NAME DAW1024
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
    SEL 1
    REC 0 0 1 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {`+ commentTrackGuid + `}
    PERF 0
    MIDIOUT -1 -1
    MAINSEND 1 0
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 8
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 1
      IGUID {`+ crypto.randomUUID() + `}
      IID 6
      <NOTES`;
    commentBody = commentBody + this.crlf + '        |https://daw1024.com';
    commentBody = commentBody + this.crlf + '        |' + projectTitle.replace('\n', ' ').replace('\r', ' ').replace('\'', ' ').replace('"', ' ').replace('\t', ' ');
    commentBody = commentBody + this.crlf + `      >
      IMGRESOURCEFLAGS 8
      NOTESWND 0 43 499 440
    >
  >`;
    return commentBody;
  }
  /*
        E 0 90 26 60
        E 360 90 25 60
        E 360 80 26 00
        E 240 90 24 60
        E 240 80 25 00
        E 0 80 24 00
        E 240 90 24 60
        E 240 80 24 00
        E 240 90 24 60
        E 240 80 24 00
        E 240 90 24 60
        E 240 80 24 00
        E 240 90 24 60
  */
  createMIDIevent(pitch35_81: number, ticksFromPrevious: number, kindByte: string, volumeByte: string): string {
    let data: string = this.crlf + '        E';
    let pitchByte = '' + pitch35_81.toString(16);
    data = data + ' ' + ticksFromPrevious + ' ' + kindByte + ' ' + pitchByte + ' ' + volumeByte
    return data;
  }
  createDrumMeasures(project: Zvoog_Project): string {
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

    let drumItem = this.crlf + '';
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
      NAME Percissuin
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {`+ crypto.randomUUID() + `}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {`+ crypto.randomUUID() + `}`;
    drumItem = drumItem + this.createMIDIevent(35, 0, '90', '7f');
    drumItem = drumItem + this.createMIDIevent(35, 480, '80', '0');
    drumItem = drumItem + this.createMIDIevent(35, 0, '90', '7f');
    drumItem = drumItem + this.createMIDIevent(35, 480, '80', '0');
    drumItem = drumItem + this.createMIDIevent(38, 0, '90', '7f');
    drumItem = drumItem + this.createMIDIevent(38, 960, '80', '0');


    let current = MMUtil();
    for (let mm = 0; mm < drums.length; mm++) {
      let singleDrum = drums[mm];
      let delta = MMUtil().set(singleDrum.start).minus(current).metre();
      let midiSkip = Math.round(240 * (delta.count / delta.part) / (1 / 16));//1/16=240
      //console.log(singleDrum.drumNum, midiSkip, delta, singleDrum.start);
      let drumHex = singleDrum.drumNum.toString(16);
      drumItem = drumItem + this.crlf + '        e ' + midiSkip + ' 80 ' + drumHex + ' 0';
      drumItem = drumItem + this.crlf + '        e ' + midiSkip + ' 90 ' + drumHex + ' 7f';
      current.set(singleDrum.start);
    }


    //drumItem = drumItem + this.crlf + `        E 500 b0 7b 00`;

    drumItem = drumItem + this.crlf + `        CCINTERP 32
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
  createDrumTrack(project: Zvoog_Project) {

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
    drumBody = drumBody + this.createDrumMeasures(project);

    drumBody = drumBody + this.crlf + `  >`;



    return drumBody;
  }
}
