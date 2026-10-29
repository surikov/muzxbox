class RPPWriter {//https://github.com/ReaTeam/Doc/blob/master/State%20Chunk%20Definitions
  crlf = '\r\n';
  /*
  composeReaperProject222(zvoogProject: Zvoog_Project): string {
    let unixTimestamp = Math.floor(new Date().getTime() / 1000);
    let rpp = new TreeValue('REAPER_PROJECT', '', []).advance('_', ['0.1', '"7.46/linux-x86_64"', '' + unixTimestamp]);
    rpp.first('_SAMPLERATE').advance('_', ['48000', '0', '0']);
    rpp.first('_TIMEMODE').advance('_', ['0', '5', '0', '30', '0', '-1', '0', '0']);
    rpp.first('_MASTERMUTESOLO').advance('_', ['0']);
    rpp.first('_MASTERTRACKVIEW').advance('_', ['0', '0.5', '0.5', '0.5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1']);
    rpp.first('_MASTER_VOLUME').advance('_', ['1', '0', '-1', '-1', '1']);





    rpp.first('_RIPPLE').advance('_', ['0']);
    rpp.first('_GROUPOVERRIDE').advance('_', ['0', '0', '0']);
    rpp.first('RECORD_CFG');
    rpp.first('METRONOME').advance('_', ['6', '2']);
    rpp.first('METRONOME').first('_VOL').advance('_', ['0.25', '0.125']);
    rpp.first('METRONOME').first('_FREQ').advance('_', ['800', '1600', '1']);
    rpp.first('METRONOME').first('_BEATLEN').advance('_', ['4']);
    rpp.first('METRONOME').first('_SAMPLES').advance('_', ['""', '""']);
    rpp.first('METRONOME').first('_PATTERN').advance('_', ['2863311530', '2863311529']);
    return this.rpp2text('', rpp);
  }
  rpp2text(pad: string, tree: TreeValue): string {
    let crlf = '\r\n';
    let rpptxt = '';

    let rline = pad + '<' + tree.name;
    for (let ii = 0; ii < tree.content.length; ii++) {
      if (tree.content[ii].name == '_') {
        rline = rline + ' ' + tree.content[ii].value;
      }
    }
    rpptxt = rpptxt + rline;
    for (let kk = 0; kk < tree.content.length; kk++) {
      let subtree = tree.content[kk];
      if (subtree.name == '_') {
        //
      } else {
        if (subtree.name.startsWith('_')) {
          let subline = pad + '  ' + subtree.name.substring(1);
          for (let nn = 0; nn < subtree.content.length; nn++) {
            if (subtree.content[nn].name == '_') {
              subline = subline + ' ' + subtree.content[nn].value;
            }
          }
          rpptxt = rpptxt + crlf + subline;
        } else {
          rpptxt = rpptxt + crlf + this.rpp2text(pad + '  ', subtree);
        }
      }
    }
    rpptxt = rpptxt + crlf + pad + '>';
    return rpptxt;
  }*/
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
  >
  <TEMPOENVEX
    EGUID {845912B6-402A-2FA6-975F-2A7D1BC3460B}
    ACT 0 -1
    VIS 1 0 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 1 -1 -1
  >
  RULERHEIGHT 86 86
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
    >
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 2
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {`+ crypto.randomUUID() + `}
      IID 4
      NAME 02-rumstest-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {`+ crypto.randomUUID() + `}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {`+ crypto.randomUUID() + `}
        e 120 90 26 60
        E 240 90 19 60
        e 480 80 26 00
        E 0 90 33 60
        E 0 90 1e 60
        E 240 90 2e 60
        E 120 80 19 00
        E 240 80 33 00
        E 0 80 2e 00
        E 120 80 1e 00
        E 240 90 1e 60
        E 240 80 1e 00
        E 240 90 23 60
        E 240 80 23 00
        E 0 90 2f 60
        E 240 80 2f 00
        E 360 90 3e 60
        E 240 80 3e 00
        E 0 90 1d 60
        E 0 90 2d 60
        E 360 80 1d 00
        E 0 80 2d 00
        E 120 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {`+ crypto.randomUUID() + `}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 3
        EVTFILTER 0 -1 -1 -1 -1 0 1 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE -1 100 0 0 1
        CFGEDITVIEW 0 0.188451 61 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL -252
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
    <ITEM
      POSITION 2
      SNAPOFFS 0
      LENGTH 6
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {`+ crypto.randomUUID() + `}
      IID 2
      NAME 02-rumstest-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {`+ crypto.randomUUID() + `}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {`+ crypto.randomUUID() + `}
        E 0 90 1a 60
        E 120 90 1d 60
        E 120 80 1d 00
        E 120 90 23 60
        E 120 90 1d 60
        E 120 80 1a 00
        E 0 80 1d 00
        E 0 90 21 60
        E 120 80 21 00
        E 240 80 23 00
        E 360 90 35 60
        E 120 90 18 60
        E 120 80 18 00
        E 120 80 35 00
        E 360 90 39 60
        E 120 80 39 00
        e 0 90 40 60
        E 120 90 28 60
        E 120 80 28 00
        E 240 90 32 60
        E 120 80 32 00
        e 840 80 40 00
        E 240 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {`+ crypto.randomUUID() + `}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 1
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE -1 100 0 0 1
        CFGEDITVIEW 0 0.188451 61 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL 0
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
  >`;



    return drumBody;
  }
}
