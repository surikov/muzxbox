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
  CURSOR 0.0
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
  >`;
    for (let rr = 0; rr < zvoogProject.tracks.length; rr++) {
      body = body + this.crlf + createTrackMeasures(this,rr, zvoogProject);
    }
    body = body + this.crlf + createDrumTrack(this,zvoogProject);
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
  /*createMIDIevent(pitch35_81: number, ticksFromPrevious: number, kindByte: string, volumeByte: string): string {
    let data: string = this.crlf + '        E';
    let pitchByte = '' + pitch35_81.toString(16);
    data = data + ' ' + ticksFromPrevious + ' ' + kindByte + ' ' + pitchByte + ' ' + volumeByte
    return data;
  }*/
  safeLabel(txt: string): string {
    return txt.replace(/[^A-Za-z0-9]/g, "_");
  }
  
  
}
