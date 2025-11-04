"use strict";
function firstDrumKeysArrayPercussionPaths(midi) {
    let pre = '' + midi;
    for (let nn = 0; nn < drumKeysArrayPercussionPaths.length; nn++) {
        if (drumKeysArrayPercussionPaths[nn].startsWith(pre)) {
            return nn;
        }
    }
    console.log('firstDrumKeysArrayPercussionPaths no', midi);
    return 0;
}
function allPercussionDrumTitles() {
    var drumNames = [];
    drumNames[35] = "Bass Drum 2";
    drumNames[36] = "Bass Drum 1";
    drumNames[37] = "Side Stick/Rimshot";
    drumNames[38] = "Snare Drum 1";
    drumNames[39] = "Hand Clap";
    drumNames[40] = "Snare Drum 2";
    drumNames[41] = "Low Tom 2";
    drumNames[42] = "Closed Hi-hat";
    drumNames[43] = "Low Tom 1";
    drumNames[44] = "Pedal Hi-hat";
    drumNames[45] = "Mid Tom 2";
    drumNames[46] = "Open Hi-hat";
    drumNames[47] = "Mid Tom 1";
    drumNames[48] = "High Tom 2";
    drumNames[49] = "Crash Cymbal 1";
    drumNames[50] = "High Tom 1";
    drumNames[51] = "Ride Cymbal 1";
    drumNames[52] = "Chinese Cymbal";
    drumNames[53] = "Ride Bell";
    drumNames[54] = "Tambourine";
    drumNames[55] = "Splash Cymbal";
    drumNames[56] = "Cowbell";
    drumNames[57] = "Crash Cymbal 2";
    drumNames[58] = "Vibra Slap";
    drumNames[59] = "Ride Cymbal 2";
    drumNames[60] = "High Bongo";
    drumNames[61] = "Low Bongo";
    drumNames[62] = "Mute High Conga";
    drumNames[63] = "Open High Conga";
    drumNames[64] = "Low Conga";
    drumNames[65] = "High Timbale";
    drumNames[66] = "Low Timbale";
    drumNames[67] = "High Agogo";
    drumNames[68] = "Low Agogo";
    drumNames[69] = "Cabasa";
    drumNames[70] = "Maracas";
    drumNames[71] = "Short Whistle";
    drumNames[72] = "Long Whistle";
    drumNames[73] = "Short Guiro";
    drumNames[74] = "Long Guiro";
    drumNames[75] = "Claves";
    drumNames[76] = "High Wood Block";
    drumNames[77] = "Low Wood Block";
    drumNames[78] = "Mute Cuica";
    drumNames[79] = "Open Cuica";
    drumNames[80] = "Mute Triangle";
    drumNames[81] = "Open Triangle";
    return drumNames;
}
;
let drumKeysArrayPercussionPaths = [
    '35_0_Chaos_sf2_file', '35_12_JCLive_sf2_file', '35_16_JCLive_sf2_file', '35_18_JCLive_sf2_file', '35_4_Chaos_sf2_file',
    '36_0_SBLive_sf2', '36_12_JCLive_sf2_file', '36_16_JCLive_sf2_file', '36_18_JCLive_sf2_file', '36_4_Chaos_sf2_file',
    '37_0_SBLive_sf2', '37_12_JCLive_sf2_file', '37_16_JCLive_sf2_file', '37_18_JCLive_sf2_file', '37_4_Chaos_sf2_file',
    '38_16_JCLive_sf2_file', '38_0_SBLive_sf2', '38_12_JCLive_sf2_file', '38_18_JCLive_sf2_file', '38_4_Chaos_sf2_file',
    '39_0_SBLive_sf2', '39_12_JCLive_sf2_file', '39_16_JCLive_sf2_file', '39_18_JCLive_sf2_file', '39_4_Chaos_sf2_file',
    '40_18_JCLive_sf2_file', '40_0_SBLive_sf2', '40_12_JCLive_sf2_file', '40_16_JCLive_sf2_file', '40_4_Chaos_sf2_file',
    '41_0_SBLive_sf2', '41_12_JCLive_sf2_file', '41_16_JCLive_sf2_file', '41_18_JCLive_sf2_file', '41_4_Chaos_sf2_file',
    '42_0_SBLive_sf2', '42_12_JCLive_sf2_file', '42_16_JCLive_sf2_file', '42_18_JCLive_sf2_file', '42_4_Chaos_sf2_file',
    '43_0_SBLive_sf2', '43_12_JCLive_sf2_file', '43_16_JCLive_sf2_file', '43_18_JCLive_sf2_file', '43_4_Chaos_sf2_file',
    '44_0_SBLive_sf2', '44_12_JCLive_sf2_file', '44_16_JCLive_sf2_file', '44_18_JCLive_sf2_file', '44_4_Chaos_sf2_file',
    '45_0_SBLive_sf2', '45_12_JCLive_sf2_file', '45_16_JCLive_sf2_file', '45_18_JCLive_sf2_file', '45_4_Chaos_sf2_file',
    '46_0_SBLive_sf2', '46_12_JCLive_sf2_file', '46_16_JCLive_sf2_file', '46_18_JCLive_sf2_file', '46_4_Chaos_sf2_file',
    '47_0_SBLive_sf2', '47_12_JCLive_sf2_file', '47_16_JCLive_sf2_file', '47_18_JCLive_sf2_file', '47_4_Chaos_sf2_file',
    '48_0_SBLive_sf2', '48_12_JCLive_sf2_file', '48_16_JCLive_sf2_file', '48_18_JCLive_sf2_file', '48_4_Chaos_sf2_file',
    '49_4_Chaos_sf2_file', '49_0_SBLive_sf2', '49_12_JCLive_sf2_file', '49_16_JCLive_sf2_file', '49_18_JCLive_sf2_file',
    '50_0_SBLive_sf2', '50_12_JCLive_sf2_file', '50_16_JCLive_sf2_file', '50_18_JCLive_sf2_file', '50_4_Chaos_sf2_file',
    '51_0_SBLive_sf2', '51_12_JCLive_sf2_file', '51_16_JCLive_sf2_file', '51_18_JCLive_sf2_file', '51_4_Chaos_sf2_file',
    '52_0_SBLive_sf2', '52_12_JCLive_sf2_file', '52_16_JCLive_sf2_file', '52_18_JCLive_sf2_file', '52_4_Chaos_sf2_file',
    '53_0_SBLive_sf2', '53_12_JCLive_sf2_file', '53_16_JCLive_sf2_file', '53_18_JCLive_sf2_file', '53_4_Chaos_sf2_file',
    '54_0_SBLive_sf2', '54_12_JCLive_sf2_file', '54_16_JCLive_sf2_file', '54_18_JCLive_sf2_file', '54_4_Chaos_sf2_file',
    '55_0_SBLive_sf2', '55_12_JCLive_sf2_file', '55_16_JCLive_sf2_file', '55_18_JCLive_sf2_file', '55_4_Chaos_sf2_file',
    '56_0_SBLive_sf2', '56_12_JCLive_sf2_file', '56_16_JCLive_sf2_file', '56_18_JCLive_sf2_file', '56_4_Chaos_sf2_file',
    '57_4_Chaos_sf2_file', '57_0_SBLive_sf2', '57_12_JCLive_sf2_file', '57_16_JCLive_sf2_file', '57_18_JCLive_sf2_file',
    '58_0_SBLive_sf2', '58_12_JCLive_sf2_file', '58_16_JCLive_sf2_file', '58_18_JCLive_sf2_file', '58_4_Chaos_sf2_file',
    '59_0_SBLive_sf2', '59_12_JCLive_sf2_file', '59_16_JCLive_sf2_file', '59_18_JCLive_sf2_file', '59_4_Chaos_sf2_file',
    '60_0_SBLive_sf2', '60_12_JCLive_sf2_file', '60_16_JCLive_sf2_file', '60_18_JCLive_sf2_file', '60_4_Chaos_sf2_file',
    '61_0_SBLive_sf2', '61_12_JCLive_sf2_file', '61_16_JCLive_sf2_file', '61_18_JCLive_sf2_file', '61_4_Chaos_sf2_file',
    '62_0_SBLive_sf2', '62_12_JCLive_sf2_file', '62_16_JCLive_sf2_file', '62_18_JCLive_sf2_file', '62_4_Chaos_sf2_file',
    '63_0_SBLive_sf2', '63_12_JCLive_sf2_file', '63_16_JCLive_sf2_file', '63_18_JCLive_sf2_file', '63_4_Chaos_sf2_file',
    '64_0_SBLive_sf2', '64_12_JCLive_sf2_file', '64_16_JCLive_sf2_file', '64_18_JCLive_sf2_file', '64_4_Chaos_sf2_file',
    '65_0_SBLive_sf2', '65_12_JCLive_sf2_file', '65_16_JCLive_sf2_file', '65_18_JCLive_sf2_file', '65_4_Chaos_sf2_file',
    '66_0_SBLive_sf2', '66_12_JCLive_sf2_file', '66_16_JCLive_sf2_file', '66_18_JCLive_sf2_file', '66_4_Chaos_sf2_file',
    '67_0_SBLive_sf2', '67_12_JCLive_sf2_file', '67_16_JCLive_sf2_file', '67_18_JCLive_sf2_file', '67_4_Chaos_sf2_file',
    '68_0_SBLive_sf2', '68_12_JCLive_sf2_file', '68_16_JCLive_sf2_file', '68_18_JCLive_sf2_file', '68_4_Chaos_sf2_file',
    '69_0_SBLive_sf2', '69_12_JCLive_sf2_file', '69_16_JCLive_sf2_file', '69_18_JCLive_sf2_file', '69_4_Chaos_sf2_file',
    '70_0_SBLive_sf2', '70_12_JCLive_sf2_file', '70_16_JCLive_sf2_file', '70_18_JCLive_sf2_file', '70_4_Chaos_sf2_file',
    '71_0_SBLive_sf2', '71_12_JCLive_sf2_file', '71_16_JCLive_sf2_file', '71_18_JCLive_sf2_file', '71_4_Chaos_sf2_file',
    '72_0_SBLive_sf2', '72_12_JCLive_sf2_file', '72_16_JCLive_sf2_file', '72_18_JCLive_sf2_file', '72_4_Chaos_sf2_file',
    '73_0_SBLive_sf2', '73_12_JCLive_sf2_file', '73_16_JCLive_sf2_file', '73_18_JCLive_sf2_file', '73_4_Chaos_sf2_file',
    '74_0_SBLive_sf2', '74_12_JCLive_sf2_file', '74_16_JCLive_sf2_file', '74_18_JCLive_sf2_file', '74_4_Chaos_sf2_file',
    '75_0_SBLive_sf2', '75_12_JCLive_sf2_file', '75_16_JCLive_sf2_file', '75_18_JCLive_sf2_file', '75_4_Chaos_sf2_file',
    '76_0_SBLive_sf2', '76_12_JCLive_sf2_file', '76_16_JCLive_sf2_file', '76_18_JCLive_sf2_file', '76_4_Chaos_sf2_file',
    '77_0_SBLive_sf2', '77_12_JCLive_sf2_file', '77_16_JCLive_sf2_file', '77_18_JCLive_sf2_file', '77_4_Chaos_sf2_file',
    '78_0_SBLive_sf2', '78_12_JCLive_sf2_file',
    '78_16_JCLive_sf2_file', '78_18_JCLive_sf2_file', '78_4_Chaos_sf2_file',
    '79_0_SBLive_sf2', '79_12_JCLive_sf2_file', '79_16_JCLive_sf2_file', '79_18_JCLive_sf2_file', '79_4_Chaos_sf2_file',
    '80_0_SBLive_sf2', '80_12_JCLive_sf2_file', '80_16_JCLive_sf2_file', '80_18_JCLive_sf2_file', '80_4_Chaos_sf2_file',
    '81_0_SBLive_sf2', '81_12_JCLive_sf2_file', '81_16_JCLive_sf2_file', '81_18_JCLive_sf2_file', '81_4_Chaos_sf2_file'
];
class ChordPitchPerformerUtil {
    checkParameters(parameters) {
        let checked = { loudness: 0.99, idx: 0, mode: 0 };
        try {
            let split = parameters.split('/');
            checked.loudness = parseInt(split[0]);
            checked.idx = parseInt(split[1]);
            let mode = parseInt(split[2]);
            if (mode == 0)
                checked.mode = 0;
            if (mode == 1)
                checked.mode = 1;
            if (mode == 2)
                checked.mode = 2;
            if (mode == 3)
                checked.mode = 3;
            if (mode == 4)
                checked.mode = 4;
        }
        catch (xx) {
            console.log(xx);
        }
        if (!(checked.loudness >= 0 && checked.loudness <= 150)) {
            checked.loudness = 100;
        }
        if (!(checked.idx >= 0 && checked.idx <= this.tonechordinstrumentKeys().length)) {
            checked.idx = 0;
        }
        return checked;
    }
    dumpParameters(loudness, idx, mode) {
        return loudness + '/' + idx + '/' + mode;
    }
    tonechordinslist() {
        var insNames = [];
        insNames[0] = "Acoustic Grand Piano: Piano";
        insNames[1] = "Bright Acoustic Piano: Piano";
        insNames[2] = "Electric Grand Piano: Piano";
        insNames[3] = "Honky-tonk Piano: Piano";
        insNames[4] = "Electric Piano 1: Piano";
        insNames[5] = "Electric Piano 2: Piano";
        insNames[6] = "Harpsichord: Piano";
        insNames[7] = "Clavinet: Piano";
        insNames[8] = "Celesta: Chromatic Percussion";
        insNames[9] = "Glockenspiel: Chromatic Percussion";
        insNames[10] = "Music Box: Chromatic Percussion";
        insNames[11] = "Vibraphone: Chromatic Percussion";
        insNames[12] = "Marimba: Chromatic Percussion";
        insNames[13] = "Xylophone: Chromatic Percussion";
        insNames[14] = "Tubular Bells: Chromatic Percussion";
        insNames[15] = "Dulcimer: Chromatic Percussion";
        insNames[16] = "Drawbar Organ: Organ";
        insNames[17] = "Percussive Organ: Organ";
        insNames[18] = "Rock Organ: Organ";
        insNames[19] = "Church Organ: Organ";
        insNames[20] = "Reed Organ: Organ";
        insNames[21] = "Accordion: Organ";
        insNames[22] = "Harmonica: Organ";
        insNames[23] = "Tango Accordion: Organ";
        insNames[24] = "Acoustic Guitar (nylon): Guitar";
        insNames[25] = "Acoustic Guitar (steel): Guitar";
        insNames[26] = "Electric Guitar (jazz): Guitar";
        insNames[27] = "Electric Guitar (clean): Guitar";
        insNames[28] = "Electric Guitar (muted): Guitar";
        insNames[29] = "Overdriven Guitar: Guitar";
        insNames[30] = "Distortion Guitar: Guitar";
        insNames[31] = "Guitar Harmonics: Guitar";
        insNames[32] = "Acoustic Bass: Bass";
        insNames[33] = "Electric Bass (finger): Bass";
        insNames[34] = "Electric Bass (pick): Bass";
        insNames[35] = "Fretless Bass: Bass";
        insNames[36] = "Slap Bass 1: Bass";
        insNames[37] = "Slap Bass 2: Bass";
        insNames[38] = "Synth Bass 1: Bass";
        insNames[39] = "Synth Bass 2: Bass";
        insNames[40] = "Violin: Strings";
        insNames[41] = "Viola: Strings";
        insNames[42] = "Cello: Strings";
        insNames[43] = "Contrabass: Strings";
        insNames[44] = "Tremolo Strings: Strings";
        insNames[45] = "Pizzicato Strings: Strings";
        insNames[46] = "Orchestral Harp: Strings";
        insNames[47] = "Timpani: Strings";
        insNames[48] = "String Ensemble 1: Ensemble";
        insNames[49] = "String Ensemble 2: Ensemble";
        insNames[50] = "Synth Strings 1: Ensemble";
        insNames[51] = "Synth Strings 2: Ensemble";
        insNames[52] = "Choir Aahs: Ensemble";
        insNames[53] = "Voice Oohs: Ensemble";
        insNames[54] = "Synth Choir: Ensemble";
        insNames[55] = "Orchestra Hit: Ensemble";
        insNames[56] = "Trumpet: Brass";
        insNames[57] = "Trombone: Brass";
        insNames[58] = "Tuba: Brass";
        insNames[59] = "Muted Trumpet: Brass";
        insNames[60] = "French Horn: Brass";
        insNames[61] = "Brass Section: Brass";
        insNames[62] = "Synth Brass 1: Brass";
        insNames[63] = "Synth Brass 2: Brass";
        insNames[64] = "Soprano Sax: Reed";
        insNames[65] = "Alto Sax: Reed";
        insNames[66] = "Tenor Sax: Reed";
        insNames[67] = "Baritone Sax: Reed";
        insNames[68] = "Oboe: Reed";
        insNames[69] = "English Horn: Reed";
        insNames[70] = "Bassoon: Reed";
        insNames[71] = "Clarinet: Reed";
        insNames[72] = "Piccolo: Pipe";
        insNames[73] = "Flute: Pipe";
        insNames[74] = "Recorder: Pipe";
        insNames[75] = "Pan Flute: Pipe";
        insNames[76] = "Blown bottle: Pipe";
        insNames[77] = "Shakuhachi: Pipe";
        insNames[78] = "Whistle: Pipe";
        insNames[79] = "Ocarina: Pipe";
        insNames[80] = "Lead 1 (square): Synth Lead";
        insNames[81] = "Lead 2 (sawtooth): Synth Lead";
        insNames[82] = "Lead 3 (calliope): Synth Lead";
        insNames[83] = "Lead 4 (chiff): Synth Lead";
        insNames[84] = "Lead 5 (charang): Synth Lead";
        insNames[85] = "Lead 6 (voice): Synth Lead";
        insNames[86] = "Lead 7 (fifths): Synth Lead";
        insNames[87] = "Lead 8 (bass + lead): Synth Lead";
        insNames[88] = "Pad 1 (new age): Synth Pad";
        insNames[89] = "Pad 2 (warm): Synth Pad";
        insNames[90] = "Pad 3 (polysynth): Synth Pad";
        insNames[91] = "Pad 4 (choir): Synth Pad";
        insNames[92] = "Pad 5 (bowed): Synth Pad";
        insNames[93] = "Pad 6 (metallic): Synth Pad";
        insNames[94] = "Pad 7 (halo): Synth Pad";
        insNames[95] = "Pad 8 (sweep): Synth Pad";
        insNames[96] = "FX 1 (rain): Synth Effects";
        insNames[97] = "FX 2 (soundtrack): Synth Effects";
        insNames[98] = "FX 3 (crystal): Synth Effects";
        insNames[99] = "FX 4 (atmosphere): Synth Effects";
        insNames[100] = "FX 5 (brightness): Synth Effects";
        insNames[101] = "FX 6 (goblins): Synth Effects";
        insNames[102] = "FX 7 (echoes): Synth Effects";
        insNames[103] = "FX 8 (sci-fi): Synth Effects";
        insNames[104] = "Sitar: Ethnic";
        insNames[105] = "Banjo: Ethnic";
        insNames[106] = "Shamisen: Ethnic";
        insNames[107] = "Koto: Ethnic";
        insNames[108] = "Kalimba: Ethnic";
        insNames[109] = "Bagpipe: Ethnic";
        insNames[110] = "Fiddle: Ethnic";
        insNames[111] = "Shanai: Ethnic";
        insNames[112] = "Tinkle Bell: Percussive";
        insNames[113] = "Agogo: Percussive";
        insNames[114] = "Steel Drums: Percussive";
        insNames[115] = "Woodblock: Percussive";
        insNames[116] = "Taiko Drum: Percussive";
        insNames[117] = "Melodic Tom: Percussive";
        insNames[118] = "Synth Drum: Percussive";
        insNames[119] = "Reverse Cymbal: Percussive";
        insNames[120] = "Guitar Fret Noise: Sound effects";
        insNames[121] = "Breath Noise: Sound effects";
        insNames[122] = "Seashore: Sound effects";
        insNames[123] = "Bird Tweet: Sound effects";
        insNames[124] = "Telephone Ring: Sound effects";
        insNames[125] = "Helicopter: Sound effects";
        insNames[126] = "Applause: Sound effects";
        insNames[127] = "Gunshot: Sound effects";
        return insNames;
    }
    ;
    tonechordinstrumentKeys() {
        return [
            "0000_Chaos_sf2_file", "0000_JCLive_sf2_file", "0000_Aspirin_sf2_file", "0000_FluidR3_GM_sf2_file", "0000_GeneralUserGS_sf2_file", "0000_SBLive_sf2", "0000_SoundBlasterOld_sf2", "0001_FluidR3_GM_sf2_file", "0001_GeneralUserGS_sf2_file", "0002_GeneralUserGS_sf2_file", "0003_GeneralUserGS_sf2_file",
            "0010_GeneralUserGS_sf2_file", "0010_Aspirin_sf2_file", "0010_Chaos_sf2_file", "0010_FluidR3_GM_sf2_file", "0010_JCLive_sf2_file", "0010_SBLive_sf2", "0010_SoundBlasterOld_sf2", "0011_Aspirin_sf2_file", "0011_FluidR3_GM_sf2_file", "0011_GeneralUserGS_sf2_file", "0012_GeneralUserGS_sf2_file",
            "0020_GeneralUserGS_sf2_file", "0020_Aspirin_sf2_file", "0020_Chaos_sf2_file", "0020_FluidR3_GM_sf2_file", "0020_JCLive_sf2_file", "0020_SBLive_sf2", "0020_SoundBlasterOld_sf2", "0021_Aspirin_sf2_file", "0021_GeneralUserGS_sf2_file", "0022_Aspirin_sf2_file",
            "0030_Chaos_sf2_file", "0030_Aspirin_sf2_file", "0030_FluidR3_GM_sf2_file", "0030_GeneralUserGS_sf2_file", "0030_JCLive_sf2_file", "0030_SBLive_sf2", "0030_SoundBlasterOld_sf2", "0031_Aspirin_sf2_file", "0031_FluidR3_GM_sf2_file", "0031_GeneralUserGS_sf2_file", "0031_SoundBlasterOld_sf2",
            "0040_GeneralUserGS_sf2_file", "0040_Aspirin_sf2_file", "0040_Chaos_sf2_file", "0040_FluidR3_GM_sf2_file", "0040_JCLive_sf2_file", "0040_SBLive_sf2", "0040_SoundBlasterOld_sf2", "0041_FluidR3_GM_sf2_file", "0041_GeneralUserGS_sf2_file", "0041_SoundBlasterOld_sf2", "0042_GeneralUserGS_sf2_file", "0043_GeneralUserGS_sf2_file", "0044_GeneralUserGS_sf2_file", "0045_GeneralUserGS_sf2_file", "0046_GeneralUserGS_sf2_file",
            "0050_Aspirin_sf2_file", "0050_GeneralUserGS_sf2_file", "0050_Chaos_sf2_file", "0050_FluidR3_GM_sf2_file", "0050_JCLive_sf2_file", "0050_SBLive_sf2", "0050_SoundBlasterOld_sf2", "0051_FluidR3_GM_sf2_file", "0051_GeneralUserGS_sf2_file", "0052_GeneralUserGS_sf2_file", "0053_GeneralUserGS_sf2_file", "0054_GeneralUserGS_sf2_file",
            "0060_GeneralUserGS_sf2_file", "0060_Aspirin_sf2_file", "0060_Chaos_sf2_file", "0060_FluidR3_GM_sf2_file", "0060_JCLive_sf2_file", "0060_SBLive_sf2", "0060_SoundBlasterOld_sf2", "0061_Aspirin_sf2_file", "0061_GeneralUserGS_sf2_file", "0061_SoundBlasterOld_sf2", "0062_GeneralUserGS_sf2_file",
            "0070_GeneralUserGS_sf2_file", "0070_Aspirin_sf2_file", "0070_Chaos_sf2_file", "0070_FluidR3_GM_sf2_file", "0070_JCLive_sf2_file", "0070_SBLive_sf2", "0070_SoundBlasterOld_sf2", "0071_GeneralUserGS_sf2_file",
            "0080_GeneralUserGS_sf2_file", "0080_Aspirin_sf2_file", "0080_Chaos_sf2_file", "0080_FluidR3_GM_sf2_file", "0080_JCLive_sf2_file", "0080_SBLive_sf2", "0080_SoundBlasterOld_sf2", "0081_FluidR3_GM_sf2_file", "0081_GeneralUserGS_sf2_file", "0081_SoundBlasterOld_sf2",
            "0090_GeneralUserGS_sf2_file", "0090_Aspirin_sf2_file", "0090_Chaos_sf2_file", "0090_FluidR3_GM_sf2_file", "0090_JCLive_sf2_file", "0090_SBLive_sf2", "0090_SoundBlasterOld_sf2", "0091_SoundBlasterOld_sf2",
            "0100_GeneralUserGS_sf2_file", "0100_Aspirin_sf2_file", "0100_Chaos_sf2_file", "0100_FluidR3_GM_sf2_file", "0100_JCLive_sf2_file", "0100_SBLive_sf2", "0100_SoundBlasterOld_sf2", "0101_GeneralUserGS_sf2_file", "0101_SoundBlasterOld_sf2",
            "0110_GeneralUserGS_sf2_file", "0110_Aspirin_sf2_file", "0110_Chaos_sf2_file", "0110_FluidR3_GM_sf2_file", "0110_JCLive_sf2_file", "0110_SBLive_sf2", "0110_SoundBlasterOld_sf2", "0111_FluidR3_GM_sf2_file",
            "0120_GeneralUserGS_sf2_file", "0120_Aspirin_sf2_file", "0120_Chaos_sf2_file", "0120_FluidR3_GM_sf2_file", "0120_JCLive_sf2_file", "0120_SBLive_sf2", "0120_SoundBlasterOld_sf2", "0121_FluidR3_GM_sf2_file", "0121_GeneralUserGS_sf2_file",
            "0130_GeneralUserGS_sf2_file", "0130_Aspirin_sf2_file", "0130_Chaos_sf2_file", "0130_FluidR3_GM_sf2_file", "0130_JCLive_sf2_file", "0130_SBLive_sf2", "0130_SoundBlasterOld_sf2", "0131_FluidR3_GM_sf2_file",
            "0140_GeneralUserGS_sf2_file", "0140_Aspirin_sf2_file", "0140_Chaos_sf2_file", "0140_FluidR3_GM_sf2_file", "0140_JCLive_sf2_file", "0140_SBLive_sf2", "0140_SoundBlasterOld_sf2", "0141_FluidR3_GM_sf2_file", "0141_GeneralUserGS_sf2_file", "0142_GeneralUserGS_sf2_file", "0143_GeneralUserGS_sf2_file",
            "0150_GeneralUserGS_sf2_file", "0150_Aspirin_sf2_file", "0150_Chaos_sf2_file", "0150_FluidR3_GM_sf2_file", "0150_JCLive_sf2_file", "0150_SBLive_sf2", "0150_SoundBlasterOld_sf2", "0151_FluidR3_GM_sf2_file",
            "0160_JCLive_sf2_file", "0160_Aspirin_sf2_file", "0160_Chaos_sf2_file", "0160_FluidR3_GM_sf2_file", "0160_GeneralUserGS_sf2_file", "0160_SBLive_sf2", "0160_SoundBlasterOld_sf2", "0161_Aspirin_sf2_file", "0161_FluidR3_GM_sf2_file", "0161_SoundBlasterOld_sf2",
            "0170_Aspirin_sf2_file", "0170_GeneralUserGS_sf2_file", "0170_Chaos_sf2_file", "0170_FluidR3_GM_sf2_file", "0170_JCLive_sf2_file", "0170_SBLive_sf2", "0170_SoundBlasterOld_sf2", "0171_FluidR3_GM_sf2_file", "0171_GeneralUserGS_sf2_file", "0172_FluidR3_GM_sf2_file",
            "0180_GeneralUserGS_sf2_file", "0180_Aspirin_sf2_file", "0180_Chaos_sf2_file", "0180_FluidR3_GM_sf2_file", "0180_JCLive_sf2_file", "0180_SBLive_sf2", "0180_SoundBlasterOld_sf2", "0181_Aspirin_sf2_file", "0181_GeneralUserGS_sf2_file", "0181_SoundBlasterOld_sf2",
            "0190_JCLive_sf2_file", "0190_Aspirin_sf2_file", "0190_Chaos_sf2_file", "0190_FluidR3_GM_sf2_file", "0190_GeneralUserGS_sf2_file", "0190_SBLive_sf2", "0190_SoundBlasterOld_sf2", "0191_Aspirin_sf2_file", "0191_GeneralUserGS_sf2_file", "0191_SoundBlasterOld_sf2",
            "0200_GeneralUserGS_sf2_file", "0200_Aspirin_sf2_file", "0200_Chaos_sf2_file", "0200_FluidR3_GM_sf2_file", "0200_JCLive_sf2_file", "0200_SBLive_sf2", "0200_SoundBlasterOld_sf2", "0201_Aspirin_sf2_file", "0201_FluidR3_GM_sf2_file", "0201_GeneralUserGS_sf2_file", "0201_SoundBlasterOld_sf2",
            "0210_GeneralUserGS_sf2_file", "0210_Aspirin_sf2_file", "0210_Chaos_sf2_file", "0210_FluidR3_GM_sf2_file", "0210_JCLive_sf2_file", "0210_SBLive_sf2", "0210_SoundBlasterOld_sf2", "0211_Aspirin_sf2_file", "0211_FluidR3_GM_sf2_file", "0211_GeneralUserGS_sf2_file", "0211_SoundBlasterOld_sf2", "0212_GeneralUserGS_sf2_file",
            "0220_GeneralUserGS_sf2_file", "0220_Aspirin_sf2_file", "0220_Chaos_sf2_file", "0220_FluidR3_GM_sf2_file", "0220_JCLive_sf2_file", "0220_SBLive_sf2", "0220_SoundBlasterOld_sf2", "0221_FluidR3_GM_sf2_file",
            "0230_FluidR3_GM_sf2_file", "0230_GeneralUserGS_sf2_file", "0230_Aspirin_sf2_file", "0230_Chaos_sf2_file", "0230_JCLive_sf2_file", "0230_SBLive_sf2", "0230_SoundBlasterOld_sf2", "0231_FluidR3_GM_sf2_file", "0231_GeneralUserGS_sf2_file", "0231_JCLive_sf2_file", "0231_SoundBlasterOld_sf2", "0232_FluidR3_GM_sf2_file", "0233_FluidR3_GM_sf2_file",
            "0240_Aspirin_sf2_file", "0240_GeneralUserGS_sf2_file", "0240_Chaos_sf2_file", "0240_FluidR3_GM_sf2_file", "0240_JCLive_sf2_file", "0240_LK_Godin_Nylon_SF2_file", "0240_SBLive_sf2", "0240_SoundBlasterOld_sf2", "0241_GeneralUserGS_sf2_file", "0241_JCLive_sf2_file", "0242_JCLive_sf2_file", "0243_JCLive_sf2_file",
            "0250_Aspirin_sf2_file", "0250_GeneralUserGS_sf2_file", "0253_Acoustic_Guitar_sf2_file", "0250_Chaos_sf2_file", "0250_FluidR3_GM_sf2_file", "0250_JCLive_sf2_file", "0250_LK_AcousticSteel_SF2_file", "0250_SBLive_sf2", "0250_SoundBlasterOld_sf2", "0251_Acoustic_Guitar_sf2_file", "0251_GeneralUserGS_sf2_file", "0252_Acoustic_Guitar_sf2_file", "0252_GeneralUserGS_sf2_file", "0253_Acoustic_Guitar_sf2_file", "0253_GeneralUserGS_sf2_file", "0254_Acoustic_Guitar_sf2_file", "0254_GeneralUserGS_sf2_file", "0255_GeneralUserGS_sf2_file",
            "0260_GeneralUserGS_sf2_file", "0260_Aspirin_sf2_file", "0260_Chaos_sf2_file", "0260_FluidR3_GM_sf2_file", "0260_JCLive_sf2_file", "0260_SBLive_sf2", "0260_SoundBlasterOld_sf2", "0260_Stratocaster_sf2_file", "0261_GeneralUserGS_sf2_file", "0261_SoundBlasterOld_sf2", "0261_Stratocaster_sf2_file", "0262_Stratocaster_sf2_file",
            "0270_FluidR3_GM_sf2_file", "0270_Aspirin_sf2_file", "0270_GeneralUserGS_sf2_file", "0270_JCLive_sf2_file", "0270_Stratocaster_sf2_file", "0270_Chaos_sf2_file", "0270_Gibson_Les_Paul_sf2_file", "0270_SBAWE32_sf2_file", "0270_SBLive_sf2", "0270_SoundBlasterOld_sf2", "0271_GeneralUserGS_sf2_file", "0271_Stratocaster_sf2_file", "0272_Stratocaster_sf2_file",
            "0280_GeneralUserGS_sf2_file", "0280_Aspirin_sf2_file", "0280_Chaos_sf2_file", "0280_FluidR3_GM_sf2_file", "0280_JCLive_sf2_file", "0280_LesPaul_sf2", "0280_LesPaul_sf2_file", "0280_SBAWE32_sf2_file", "0280_SBLive_sf2", "0280_SoundBlasterOld_sf2", "0281_Aspirin_sf2_file", "0281_FluidR3_GM_sf2_file", "0281_GeneralUserGS_sf2_file", "0282_FluidR3_GM_sf2_file", "0282_GeneralUserGS_sf2_file", "0283_GeneralUserGS_sf2_file",
            "0290_GeneralUserGS_sf2_file", "0292_Aspirin_sf2_file", "0290_SBAWE32_sf2_file", "0290_Aspirin_sf2_file", "0290_Chaos_sf2_file", "0290_FluidR3_GM_sf2_file", "0290_JCLive_sf2_file", "0290_LesPaul_sf2", "0290_LesPaul_sf2_file", "0290_SBLive_sf2", "0290_SoundBlasterOld_sf2", "0291_Aspirin_sf2_file", "0291_LesPaul_sf2", "0291_LesPaul_sf2_file", "0291_SBAWE32_sf2_file", "0291_SoundBlasterOld_sf2", "0292_LesPaul_sf2", "0292_LesPaul_sf2_file",
            "0300_LesPaul_sf2_file", "0300_FluidR3_GM_sf2_file", "0300_SBAWE32_sf2_file", "0300_Chaos_sf2_file", "0300_SBLive_sf2", "0300_Aspirin_sf2_file", "0300_GeneralUserGS_sf2_file", "0300_JCLive_sf2_file", "0300_LesPaul_sf2", "0300_SoundBlasterOld_sf2", "0301_Aspirin_sf2_file", "0301_FluidR3_GM_sf2_file", "0301_GeneralUserGS_sf2_file", "0301_JCLive_sf2_file", "0301_LesPaul_sf2", "0301_LesPaul_sf2_file", "0302_Aspirin_sf2_file", "0302_GeneralUserGS_sf2_file", "0302_JCLive_sf2_file", "0303_Aspirin_sf2_file", "0304_Aspirin_sf2_file",
            "0310_SBAWE32_sf2_file", "0310_LesPaul_sf2_file", "0310_JCLive_sf2_file", "0310_Aspirin_sf2_file", "0310_Chaos_sf2_file", "0310_FluidR3_GM_sf2_file", "0310_GeneralUserGS_sf2_file", "0310_LesPaul_sf2", "0310_SBLive_sf2", "0310_SoundBlasterOld_sf2", "0311_FluidR3_GM_sf2_file", "0311_GeneralUserGS_sf2_file",
            "0320_Aspirin_sf2_file", "0320_GeneralUserGS_sf2_file", "0320_Chaos_sf2_file", "0320_FluidR3_GM_sf2_file", "0320_JCLive_sf2_file", "0320_SBLive_sf2", "0320_SoundBlasterOld_sf2", "0321_GeneralUserGS_sf2_file", "0322_GeneralUserGS_sf2_file",
            "0330_JCLive_sf2_file", "0330_Chaos_sf2_file", "0330_Aspirin_sf2_file", "0330_FluidR3_GM_sf2_file", "0330_GeneralUserGS_sf2_file", "0330_SBLive_sf2", "0330_SoundBlasterOld_sf2", "0331_GeneralUserGS_sf2_file", "0332_GeneralUserGS_sf2_file",
            "0340_Aspirin_sf2_file", "0340_GeneralUserGS_sf2_file", "0340_Chaos_sf2_file", "0340_FluidR3_GM_sf2_file", "0340_JCLive_sf2_file", "0340_SBLive_sf2", "0340_SoundBlasterOld_sf2", "0341_Aspirin_sf2_file", "0341_GeneralUserGS_sf2_file",
            "0350_Aspirin_sf2_file", "0350_GeneralUserGS_sf2_file", "0350_Chaos_sf2_file", "0350_FluidR3_GM_sf2_file", "0350_JCLive_sf2_file", "0350_SBLive_sf2", "0350_SoundBlasterOld_sf2", "0351_GeneralUserGS_sf2_file",
            "0360_Aspirin_sf2_file", "0360_GeneralUserGS_sf2_file", "0360_Chaos_sf2_file", "0360_FluidR3_GM_sf2_file", "0360_JCLive_sf2_file", "0360_SBLive_sf2", "0360_SoundBlasterOld_sf2", "0361_GeneralUserGS_sf2_file",
            "0370_Aspirin_sf2_file", "0370_GeneralUserGS_sf2_file", "0370_Chaos_sf2_file", "0370_FluidR3_GM_sf2_file", "0370_JCLive_sf2_file", "0370_SBLive_sf2", "0370_SoundBlasterOld_sf2", "0371_GeneralUserGS_sf2_file", "0372_GeneralUserGS_sf2_file",
            "0384_GeneralUserGS_sf2_file", "0380_GeneralUserGS_sf2_file", "0380_Aspirin_sf2_file", "0385_GeneralUserGS_sf2_file", "0380_Chaos_sf2_file", "0380_FluidR3_GM_sf2_file", "0380_JCLive_sf2_file", "0380_SBLive_sf2", "0380_SoundBlasterOld_sf2", "0381_FluidR3_GM_sf2_file", "0381_GeneralUserGS_sf2_file", "0382_FluidR3_GM_sf2_file", "0382_GeneralUserGS_sf2_file", "0383_GeneralUserGS_sf2_file", "0386_GeneralUserGS_sf2_file", "0387_GeneralUserGS_sf2_file",
            "0390_Aspirin_sf2_file", "0390_GeneralUserGS_sf2_file", "0390_Chaos_sf2_file", "0390_FluidR3_GM_sf2_file", "0390_JCLive_sf2_file", "0390_SBLive_sf2", "0390_SoundBlasterOld_sf2", "0391_FluidR3_GM_sf2_file", "0391_GeneralUserGS_sf2_file", "0391_SoundBlasterOld_sf2", "0392_FluidR3_GM_sf2_file", "0392_GeneralUserGS_sf2_file", "0393_GeneralUserGS_sf2_file",
            "0400_JCLive_sf2_file", "0400_GeneralUserGS_sf2_file", "0400_Aspirin_sf2_file", "0400_Chaos_sf2_file", "0400_FluidR3_GM_sf2_file", "0400_SBLive_sf2", "0400_SoundBlasterOld_sf2", "0401_Aspirin_sf2_file", "0401_FluidR3_GM_sf2_file", "0401_GeneralUserGS_sf2_file", "0402_GeneralUserGS_sf2_file",
            "0410_GeneralUserGS_sf2_file", "0410_Aspirin_sf2_file", "0410_Chaos_sf2_file", "0410_FluidR3_GM_sf2_file", "0410_JCLive_sf2_file", "0410_SBLive_sf2", "0410_SoundBlasterOld_sf2", "0411_FluidR3_GM_sf2_file",
            "0420_GeneralUserGS_sf2_file", "0420_Aspirin_sf2_file", "0420_Chaos_sf2_file", "0420_FluidR3_GM_sf2_file", "0420_JCLive_sf2_file", "0420_SBLive_sf2", "0420_SoundBlasterOld_sf2", "0421_FluidR3_GM_sf2_file", "0421_GeneralUserGS_sf2_file",
            "0430_GeneralUserGS_sf2_file", "0430_Aspirin_sf2_file", "0430_Chaos_sf2_file", "0430_FluidR3_GM_sf2_file", "0430_JCLive_sf2_file", "0430_SBLive_sf2", "0430_SoundBlasterOld_sf2", "0431_FluidR3_GM_sf2_file",
            "0440_GeneralUserGS_sf2_file", "0440_Aspirin_sf2_file", "0440_Chaos_sf2_file", "0440_FluidR3_GM_sf2_file", "0440_JCLive_sf2_file", "0440_SBLive_sf2", "0440_SoundBlasterOld_sf2", "0441_GeneralUserGS_sf2_file", "0442_GeneralUserGS_sf2_file",
            "0450_GeneralUserGS_sf2_file", "0450_Aspirin_sf2_file", "0450_Chaos_sf2_file", "0450_FluidR3_GM_sf2_file", "0450_JCLive_sf2_file", "0450_SBLive_sf2", "0450_SoundBlasterOld_sf2", "0451_FluidR3_GM_sf2_file",
            "0460_GeneralUserGS_sf2_file", "0460_Aspirin_sf2_file", "0460_Chaos_sf2_file", "0460_FluidR3_GM_sf2_file", "0460_JCLive_sf2_file", "0460_SBLive_sf2", "0460_SoundBlasterOld_sf2", "0461_FluidR3_GM_sf2_file",
            "0470_GeneralUserGS_sf2_file", "0470_Aspirin_sf2_file", "0470_Chaos_sf2_file", "0470_FluidR3_GM_sf2_file", "0470_JCLive_sf2_file", "0470_SBLive_sf2", "0470_SoundBlasterOld_sf2", "0471_FluidR3_GM_sf2_file", "0471_GeneralUserGS_sf2_file",
            "0480_GeneralUserGS_sf2_file", "0480_Aspirin_sf2_file", "0480_Chaos_sf2_file", "0480_FluidR3_GM_sf2_file", "0480_JCLive_sf2_file", "0480_SBLive_sf2", "0480_SoundBlasterOld_sf2", "04810_GeneralUserGS_sf2_file", "04811_GeneralUserGS_sf2_file", "04812_GeneralUserGS_sf2_file", "04813_GeneralUserGS_sf2_file", "04814_GeneralUserGS_sf2_file", "04815_GeneralUserGS_sf2_file", "04816_GeneralUserGS_sf2_file", "04817_GeneralUserGS_sf2_file", "0481_Aspirin_sf2_file", "0481_FluidR3_GM_sf2_file", "0481_GeneralUserGS_sf2_file", "0482_Aspirin_sf2_file", "0482_GeneralUserGS_sf2_file", "0483_GeneralUserGS_sf2_file", "0484_GeneralUserGS_sf2_file", "0485_GeneralUserGS_sf2_file", "0486_GeneralUserGS_sf2_file", "0487_GeneralUserGS_sf2_file", "0488_GeneralUserGS_sf2_file", "0489_GeneralUserGS_sf2_file",
            "0490_Chaos_sf2_file", "0490_GeneralUserGS_sf2_file", "0490_Aspirin_sf2_file", "0490_FluidR3_GM_sf2_file", "0490_JCLive_sf2_file", "0490_SBLive_sf2", "0490_SoundBlasterOld_sf2", "0491_GeneralUserGS_sf2_file", "0492_GeneralUserGS_sf2_file",
            "0501_FluidR3_GM_sf2_file", "0500_Aspirin_sf2_file", "0500_Chaos_sf2_file", "0500_FluidR3_GM_sf2_file", "0500_GeneralUserGS_sf2_file", "0500_JCLive_sf2_file", "0500_SBLive_sf2", "0500_SoundBlasterOld_sf2", "0501_GeneralUserGS_sf2_file", "0502_FluidR3_GM_sf2_file", "0502_GeneralUserGS_sf2_file", "0503_FluidR3_GM_sf2_file", "0504_FluidR3_GM_sf2_file", "0505_FluidR3_GM_sf2_file",
            "0510_Aspirin_sf2_file", "0510_SBLive_sf2", "0510_GeneralUserGS_sf2_file", "0510_Chaos_sf2_file", "0510_FluidR3_GM_sf2_file", "0510_JCLive_sf2_file", "0510_SoundBlasterOld_sf2", "0511_GeneralUserGS_sf2_file", "0511_SoundBlasterOld_sf2",
            "0520_JCLive_sf2_file", "0520_GeneralUserGS_sf2_file", "0520_Aspirin_sf2_file", "0520_Chaos_sf2_file", "0520_FluidR3_GM_sf2_file", "0520_SBLive_sf2", "0520_Soul_Ahhs_sf2_file", "0520_SoundBlasterOld_sf2", "0521_FluidR3_GM_sf2_file", "0521_Soul_Ahhs_sf2_file", "0521_SoundBlasterOld_sf2", "0522_Soul_Ahhs_sf2_file",
            "0530_GeneralUserGS_sf2_file", "0530_Aspirin_sf2_file", "0530_Chaos_sf2_file", "0530_FluidR3_GM_sf2_file", "0530_JCLive_sf2_file", "0530_SBLive_sf2", "0530_Soul_Ahhs_sf2_file", "0530_SoundBlasterOld_sf2", "0531_FluidR3_GM_sf2_file", "0531_GeneralUserGS_sf2_file", "0531_JCLive_sf2_file", "0531_SoundBlasterOld_sf2",
            "0540_JCLive_sf2_file", "0540_GeneralUserGS_sf2_file", "0540_Aspirin_sf2_file", "0540_Chaos_sf2_file", "0540_FluidR3_GM_sf2_file", "0540_SBLive_sf2", "0540_SoundBlasterOld_sf2", "0541_FluidR3_GM_sf2_file",
            "0550_GeneralUserGS_sf2_file", "0550_Aspirin_sf2_file", "0550_Chaos_sf2_file", "0550_FluidR3_GM_sf2_file", "0550_JCLive_sf2_file", "0550_SBLive_sf2", "0550_SoundBlasterOld_sf2", "0551_Aspirin_sf2_file", "0551_FluidR3_GM_sf2_file",
            "0560_Aspirin_sf2_file", "0560_GeneralUserGS_sf2_file", "0560_Chaos_sf2_file", "0560_FluidR3_GM_sf2_file", "0560_JCLive_sf2_file", "0560_SBLive_sf2", "0560_SoundBlasterOld_sf2",
            "0570_GeneralUserGS_sf2_file", "0570_Aspirin_sf2_file", "0570_Chaos_sf2_file", "0570_FluidR3_GM_sf2_file", "0570_JCLive_sf2_file", "0570_SBLive_sf2", "0570_SoundBlasterOld_sf2", "0571_GeneralUserGS_sf2_file",
            "0580_GeneralUserGS_sf2_file", "0580_Aspirin_sf2_file", "0580_Chaos_sf2_file", "0580_FluidR3_GM_sf2_file", "0580_JCLive_sf2_file", "0580_SBLive_sf2", "0580_SoundBlasterOld_sf2", "0581_GeneralUserGS_sf2_file",
            "0590_GeneralUserGS_sf2_file", "0590_Aspirin_sf2_file", "0590_Chaos_sf2_file", "0590_FluidR3_GM_sf2_file", "0590_JCLive_sf2_file", "0590_SBLive_sf2", "0590_SoundBlasterOld_sf2", "0591_GeneralUserGS_sf2_file",
            "0600_GeneralUserGS_sf2_file", "0600_Aspirin_sf2_file", "0600_Chaos_sf2_file", "0600_FluidR3_GM_sf2_file", "0600_JCLive_sf2_file", "0600_SBLive_sf2", "0600_SoundBlasterOld_sf2", "0601_FluidR3_GM_sf2_file", "0601_GeneralUserGS_sf2_file", "0602_GeneralUserGS_sf2_file", "0603_GeneralUserGS_sf2_file",
            "0610_GeneralUserGS_sf2_file", "0610_Aspirin_sf2_file", "0610_Chaos_sf2_file", "0610_FluidR3_GM_sf2_file", "0610_JCLive_sf2_file", "0610_SBLive_sf2", "0610_SoundBlasterOld_sf2", "0611_GeneralUserGS_sf2_file", "0612_GeneralUserGS_sf2_file", "0613_GeneralUserGS_sf2_file", "0614_GeneralUserGS_sf2_file", "0615_GeneralUserGS_sf2_file",
            "0620_FluidR3_GM_sf2_file", "0620_Aspirin_sf2_file", "0620_GeneralUserGS_sf2_file", "0620_Chaos_sf2_file", "0620_JCLive_sf2_file", "0620_SBLive_sf2", "0620_SoundBlasterOld_sf2", "0621_Aspirin_sf2_file", "0621_FluidR3_GM_sf2_file", "0621_GeneralUserGS_sf2_file", "0622_FluidR3_GM_sf2_file", "0622_GeneralUserGS_sf2_file",
            "0630_Aspirin_sf2_file", "0630_GeneralUserGS_sf2_file", "0630_Chaos_sf2_file", "0630_FluidR3_GM_sf2_file", "0630_JCLive_sf2_file", "0630_SBLive_sf2", "0630_SoundBlasterOld_sf2", "0631_Aspirin_sf2_file", "0631_FluidR3_GM_sf2_file", "0631_GeneralUserGS_sf2_file", "0632_FluidR3_GM_sf2_file", "0633_FluidR3_GM_sf2_file",
            "0640_GeneralUserGS_sf2_file", "0640_Aspirin_sf2_file", "0640_Chaos_sf2_file", "0640_FluidR3_GM_sf2_file", "0640_JCLive_sf2_file", "0640_SBLive_sf2", "0640_SoundBlasterOld_sf2", "0641_FluidR3_GM_sf2_file",
            "0650_GeneralUserGS_sf2_file", "0650_Aspirin_sf2_file", "0650_Chaos_sf2_file", "0650_FluidR3_GM_sf2_file", "0650_JCLive_sf2_file", "0650_SBLive_sf2", "0650_SoundBlasterOld_sf2", "0651_Aspirin_sf2_file", "0651_FluidR3_GM_sf2_file",
            "0660_GeneralUserGS_sf2_file", "0660_Aspirin_sf2_file", "0660_Chaos_sf2_file", "0660_FluidR3_GM_sf2_file", "0660_JCLive_sf2_file", "0660_SBLive_sf2", "0660_SoundBlasterOld_sf2", "0661_FluidR3_GM_sf2_file", "0661_GeneralUserGS_sf2_file",
            "0670_GeneralUserGS_sf2_file", "0670_Aspirin_sf2_file", "0670_Chaos_sf2_file", "0670_FluidR3_GM_sf2_file", "0670_JCLive_sf2_file", "0670_SBLive_sf2", "0670_SoundBlasterOld_sf2", "0671_FluidR3_GM_sf2_file",
            "0680_GeneralUserGS_sf2_file", "0680_Aspirin_sf2_file", "0680_Chaos_sf2_file", "0680_FluidR3_GM_sf2_file", "0680_JCLive_sf2_file", "0680_SBLive_sf2", "0680_SoundBlasterOld_sf2", "0681_FluidR3_GM_sf2_file",
            "0690_GeneralUserGS_sf2_file", "0690_Aspirin_sf2_file", "0690_Chaos_sf2_file", "0690_FluidR3_GM_sf2_file", "0690_JCLive_sf2_file", "0690_SBLive_sf2", "0690_SoundBlasterOld_sf2", "0691_FluidR3_GM_sf2_file",
            "0700_GeneralUserGS_sf2_file", "0700_Aspirin_sf2_file", "0700_Chaos_sf2_file", "0700_FluidR3_GM_sf2_file", "0700_JCLive_sf2_file", "0700_SBLive_sf2", "0700_SoundBlasterOld_sf2", "0701_FluidR3_GM_sf2_file", "0701_GeneralUserGS_sf2_file",
            "0710_GeneralUserGS_sf2_file", "0710_Aspirin_sf2_file", "0710_Chaos_sf2_file", "0710_FluidR3_GM_sf2_file", "0710_JCLive_sf2_file", "0710_SBLive_sf2", "0710_SoundBlasterOld_sf2", "0711_FluidR3_GM_sf2_file",
            "0720_GeneralUserGS_sf2_file", "0720_Aspirin_sf2_file", "0720_Chaos_sf2_file", "0720_FluidR3_GM_sf2_file", "0720_JCLive_sf2_file", "0720_SBLive_sf2", "0720_SoundBlasterOld_sf2", "0721_FluidR3_GM_sf2_file", "0721_SoundBlasterOld_sf2",
            "0730_GeneralUserGS_sf2_file", "0730_Aspirin_sf2_file", "0730_Chaos_sf2_file", "0730_FluidR3_GM_sf2_file", "0730_JCLive_sf2_file", "0730_SBLive_sf2", "0730_SoundBlasterOld_sf2", "0731_Aspirin_sf2_file", "0731_FluidR3_GM_sf2_file", "0731_SoundBlasterOld_sf2",
            "0740_GeneralUserGS_sf2_file", "0740_Aspirin_sf2_file", "0740_Chaos_sf2_file", "0740_FluidR3_GM_sf2_file", "0740_JCLive_sf2_file", "0740_SBLive_sf2", "0740_SoundBlasterOld_sf2", "0741_GeneralUserGS_sf2_file",
            "0750_GeneralUserGS_sf2_file", "0750_Aspirin_sf2_file", "0750_Chaos_sf2_file", "0750_FluidR3_GM_sf2_file", "0750_JCLive_sf2_file", "0750_SBLive_sf2", "0750_SoundBlasterOld_sf2", "0751_Aspirin_sf2_file", "0751_FluidR3_GM_sf2_file", "0751_GeneralUserGS_sf2_file", "0751_SoundBlasterOld_sf2",
            "0760_GeneralUserGS_sf2_file", "0760_Aspirin_sf2_file", "0760_Chaos_sf2_file", "0760_FluidR3_GM_sf2_file", "0760_JCLive_sf2_file", "0760_SBLive_sf2", "0760_SoundBlasterOld_sf2", "0761_FluidR3_GM_sf2_file", "0761_GeneralUserGS_sf2_file", "0761_SoundBlasterOld_sf2", "0762_GeneralUserGS_sf2_file",
            "0770_GeneralUserGS_sf2_file", "0770_Aspirin_sf2_file", "0770_Chaos_sf2_file", "0770_FluidR3_GM_sf2_file", "0770_JCLive_sf2_file", "0770_SBLive_sf2", "0770_SoundBlasterOld_sf2", "0771_FluidR3_GM_sf2_file", "0771_GeneralUserGS_sf2_file", "0772_GeneralUserGS_sf2_file",
            "0780_SBLive_sf2", "0780_GeneralUserGS_sf2_file", "0780_Aspirin_sf2_file", "0780_Chaos_sf2_file", "0780_FluidR3_GM_sf2_file", "0780_JCLive_sf2_file", "0780_SoundBlasterOld_sf2", "0781_GeneralUserGS_sf2_file",
            "0790_GeneralUserGS_sf2_file", "0790_Aspirin_sf2_file", "0790_Chaos_sf2_file", "0790_FluidR3_GM_sf2_file", "0790_JCLive_sf2_file", "0790_SBLive_sf2", "0790_SoundBlasterOld_sf2", "0791_GeneralUserGS_sf2_file",
            "0800_Chaos_sf2_file", "0800_GeneralUserGS_sf2_file", "0800_Aspirin_sf2_file", "0800_FluidR3_GM_sf2_file", "0800_JCLive_sf2_file", "0800_SBLive_sf2", "0800_SoundBlasterOld_sf2", "0801_FluidR3_GM_sf2_file", "0801_GeneralUserGS_sf2_file",
            "0810_Chaos_sf2_file", "0810_Aspirin_sf2_file", "0810_FluidR3_GM_sf2_file", "0810_GeneralUserGS_sf2_file", "0810_JCLive_sf2_file", "0810_SBLive_sf2", "0810_SoundBlasterOld_sf2", "0811_Aspirin_sf2_file", "0811_GeneralUserGS_sf2_file", "0811_SoundBlasterOld_sf2",
            "0820_GeneralUserGS_sf2_file", "0820_Aspirin_sf2_file", "0820_Chaos_sf2_file", "0820_FluidR3_GM_sf2_file", "0820_JCLive_sf2_file", "0820_SBLive_sf2", "0820_SoundBlasterOld_sf2", "0821_FluidR3_GM_sf2_file", "0821_GeneralUserGS_sf2_file", "0821_SoundBlasterOld_sf2", "0822_GeneralUserGS_sf2_file", "0823_GeneralUserGS_sf2_file",
            "0830_GeneralUserGS_sf2_file", "0830_Aspirin_sf2_file", "0830_Chaos_sf2_file", "0830_FluidR3_GM_sf2_file", "0830_JCLive_sf2_file", "0830_SBLive_sf2", "0830_SoundBlasterOld_sf2", "0831_FluidR3_GM_sf2_file", "0831_GeneralUserGS_sf2_file", "0831_SoundBlasterOld_sf2",
            "0840_GeneralUserGS_sf2_file", "0840_Aspirin_sf2_file", "0840_Chaos_sf2_file", "0840_FluidR3_GM_sf2_file", "0840_JCLive_sf2_file", "0840_SBLive_sf2", "0840_SoundBlasterOld_sf2", "0841_Aspirin_sf2_file", "0841_Chaos_sf2_file", "0841_FluidR3_GM_sf2_file", "0841_GeneralUserGS_sf2_file", "0841_JCLive_sf2_file", "0841_SoundBlasterOld_sf2", "0842_FluidR3_GM_sf2_file",
            "0850_Aspirin_sf2_file", "0850_GeneralUserGS_sf2_file", "0850_Chaos_sf2_file", "0850_FluidR3_GM_sf2_file", "0850_JCLive_sf2_file", "0850_SBLive_sf2", "0850_SoundBlasterOld_sf2", "0851_FluidR3_GM_sf2_file", "0851_GeneralUserGS_sf2_file", "0851_JCLive_sf2_file", "0851_SoundBlasterOld_sf2",
            "0860_GeneralUserGS_sf2_file", "0860_Aspirin_sf2_file", "0860_Chaos_sf2_file", "0860_FluidR3_GM_sf2_file", "0860_JCLive_sf2_file", "0860_SBLive_sf2", "0860_SoundBlasterOld_sf2", "0861_Aspirin_sf2_file", "0861_FluidR3_GM_sf2_file", "0861_SoundBlasterOld_sf2",
            "0870_GeneralUserGS_sf2_file", "0870_Aspirin_sf2_file", "0870_Chaos_sf2_file", "0870_FluidR3_GM_sf2_file", "0870_JCLive_sf2_file", "0870_SBLive_sf2", "0870_SoundBlasterOld_sf2", "0871_GeneralUserGS_sf2_file", "0872_GeneralUserGS_sf2_file", "0873_GeneralUserGS_sf2_file",
            "0880_GeneralUserGS_sf2_file", "0880_Aspirin_sf2_file", "0880_Chaos_sf2_file", "0880_FluidR3_GM_sf2_file", "0880_JCLive_sf2_file", "0880_SBLive_sf2", "0880_SoundBlasterOld_sf2", "0881_Aspirin_sf2_file", "0881_FluidR3_GM_sf2_file", "0881_GeneralUserGS_sf2_file", "0881_SoundBlasterOld_sf2", "0882_Aspirin_sf2_file", "0882_FluidR3_GM_sf2_file", "0882_GeneralUserGS_sf2_file", "0883_GeneralUserGS_sf2_file", "0884_GeneralUserGS_sf2_file", "0885_GeneralUserGS_sf2_file", "0886_GeneralUserGS_sf2_file", "0887_GeneralUserGS_sf2_file", "0888_GeneralUserGS_sf2_file", "0889_GeneralUserGS_sf2_file",
            "0890_Aspirin_sf2_file", "0890_GeneralUserGS_sf2_file", "0890_Chaos_sf2_file", "0890_FluidR3_GM_sf2_file", "0890_JCLive_sf2_file", "0890_SBLive_sf2", "0890_SoundBlasterOld_sf2", "0891_Aspirin_sf2_file", "0891_FluidR3_GM_sf2_file", "0891_GeneralUserGS_sf2_file",
            "0900_GeneralUserGS_sf2_file", "0900_Aspirin_sf2_file", "0900_Chaos_sf2_file", "0900_FluidR3_GM_sf2_file", "0900_JCLive_sf2_file", "0900_SBLive_sf2", "0900_SoundBlasterOld_sf2", "0901_Aspirin_sf2_file", "0901_FluidR3_GM_sf2_file", "0901_GeneralUserGS_sf2_file", "0901_SoundBlasterOld_sf2",
            "0910_GeneralUserGS_sf2_file", "0910_Aspirin_sf2_file", "0910_Chaos_sf2_file", "0910_FluidR3_GM_sf2_file", "0910_JCLive_sf2_file", "0910_SBLive_sf2", "0910_SoundBlasterOld_sf2", "0911_Aspirin_sf2_file", "0911_GeneralUserGS_sf2_file", "0911_JCLive_sf2_file", "0911_SoundBlasterOld_sf2",
            "0920_GeneralUserGS_sf2_file", "0920_Aspirin_sf2_file", "0920_Chaos_sf2_file", "0920_FluidR3_GM_sf2_file", "0920_JCLive_sf2_file", "0920_SBLive_sf2", "0920_SoundBlasterOld_sf2", "0921_Aspirin_sf2_file", "0921_GeneralUserGS_sf2_file", "0921_SoundBlasterOld_sf2",
            "0930_GeneralUserGS_sf2_file", "0930_Aspirin_sf2_file", "0930_Chaos_sf2_file", "0930_FluidR3_GM_sf2_file", "0930_JCLive_sf2_file", "0930_SBLive_sf2", "0930_SoundBlasterOld_sf2", "0931_Aspirin_sf2_file", "0931_FluidR3_GM_sf2_file", "0931_GeneralUserGS_sf2_file", "0931_SoundBlasterOld_sf2",
            "0941_Aspirin_sf2_file", "0940_GeneralUserGS_sf2_file", "0940_Aspirin_sf2_file", "0940_Chaos_sf2_file", "0940_FluidR3_GM_sf2_file", "0940_JCLive_sf2_file", "0940_SBLive_sf2", "0940_SoundBlasterOld_sf2", "0941_FluidR3_GM_sf2_file", "0941_GeneralUserGS_sf2_file", "0941_JCLive_sf2_file",
            "0950_GeneralUserGS_sf2_file", "0950_Aspirin_sf2_file", "0950_Chaos_sf2_file", "0950_FluidR3_GM_sf2_file", "0950_JCLive_sf2_file", "0950_SBLive_sf2", "0950_SoundBlasterOld_sf2", "0951_FluidR3_GM_sf2_file", "0951_GeneralUserGS_sf2_file",
            "0960_GeneralUserGS_sf2_file", "0960_Aspirin_sf2_file", "0960_Chaos_sf2_file", "0960_FluidR3_GM_sf2_file", "0960_JCLive_sf2_file", "0960_SBLive_sf2", "0960_SoundBlasterOld_sf2", "0961_Aspirin_sf2_file", "0961_FluidR3_GM_sf2_file", "0961_GeneralUserGS_sf2_file", "0961_SoundBlasterOld_sf2", "0962_GeneralUserGS_sf2_file",
            "0970_GeneralUserGS_sf2_file", "0970_Aspirin_sf2_file", "0970_Chaos_sf2_file", "0970_FluidR3_GM_sf2_file", "0970_JCLive_sf2_file", "0970_SBLive_sf2", "0970_SoundBlasterOld_sf2", "0971_FluidR3_GM_sf2_file", "0971_GeneralUserGS_sf2_file", "0971_SoundBlasterOld_sf2",
            "0980_Aspirin_sf2_file", "0980_GeneralUserGS_sf2_file", "0980_Chaos_sf2_file", "0980_FluidR3_GM_sf2_file", "0980_JCLive_sf2_file", "0980_SBLive_sf2", "0980_SoundBlasterOld_sf2", "0981_Aspirin_sf2_file", "0981_FluidR3_GM_sf2_file", "0981_GeneralUserGS_sf2_file", "0981_SoundBlasterOld_sf2", "0982_GeneralUserGS_sf2_file", "0983_GeneralUserGS_sf2_file", "0984_GeneralUserGS_sf2_file",
            "0990_GeneralUserGS_sf2_file", "0990_Aspirin_sf2_file", "0990_Chaos_sf2_file", "0990_FluidR3_GM_sf2_file", "0990_JCLive_sf2_file", "0990_SBLive_sf2", "0990_SoundBlasterOld_sf2", "0991_Aspirin_sf2_file", "0991_FluidR3_GM_sf2_file", "0991_GeneralUserGS_sf2_file", "0991_JCLive_sf2_file", "0991_SoundBlasterOld_sf2", "0992_FluidR3_GM_sf2_file", "0992_JCLive_sf2_file", "0993_JCLive_sf2_file", "0994_JCLive_sf2_file",
            "1000_GeneralUserGS_sf2_file", "1000_Aspirin_sf2_file", "1000_Chaos_sf2_file", "1000_FluidR3_GM_sf2_file", "1000_JCLive_sf2_file", "1000_SBLive_sf2", "1000_SoundBlasterOld_sf2", "1001_Aspirin_sf2_file", "1001_FluidR3_GM_sf2_file", "1001_GeneralUserGS_sf2_file", "1001_JCLive_sf2_file", "1001_SoundBlasterOld_sf2", "1002_Aspirin_sf2_file", "1002_FluidR3_GM_sf2_file", "1002_GeneralUserGS_sf2_file",
            "1010_Aspirin_sf2_file", "1010_GeneralUserGS_sf2_file", "1010_Chaos_sf2_file", "1010_FluidR3_GM_sf2_file", "1010_JCLive_sf2_file", "1010_SBLive_sf2", "1010_SoundBlasterOld_sf2", "1011_Aspirin_sf2_file", "1011_FluidR3_GM_sf2_file", "1011_JCLive_sf2_file", "1012_Aspirin_sf2_file",
            "1021_Aspirin_sf2_file", "1020_GeneralUserGS_sf2_file", "1020_Aspirin_sf2_file", "1020_Chaos_sf2_file", "1020_FluidR3_GM_sf2_file", "1020_JCLive_sf2_file", "1020_SBLive_sf2", "1020_SoundBlasterOld_sf2", "1021_FluidR3_GM_sf2_file", "1021_GeneralUserGS_sf2_file", "1021_JCLive_sf2_file", "1021_SoundBlasterOld_sf2", "1022_GeneralUserGS_sf2_file",
            "1030_GeneralUserGS_sf2_file", "1030_Aspirin_sf2_file", "1030_Chaos_sf2_file", "1030_FluidR3_GM_sf2_file", "1030_JCLive_sf2_file", "1030_SBLive_sf2", "1030_SoundBlasterOld_sf2", "1031_Aspirin_sf2_file", "1031_FluidR3_GM_sf2_file", "1031_GeneralUserGS_sf2_file", "1031_SoundBlasterOld_sf2", "1032_FluidR3_GM_sf2_file",
            "1040_GeneralUserGS_sf2_file", "1040_Aspirin_sf2_file", "1040_Chaos_sf2_file", "1040_FluidR3_GM_sf2_file", "1040_JCLive_sf2_file", "1040_SBLive_sf2", "1040_SoundBlasterOld_sf2", "1041_FluidR3_GM_sf2_file", "1041_GeneralUserGS_sf2_file",
            "1050_GeneralUserGS_sf2_file", "1050_Aspirin_sf2_file", "1050_Chaos_sf2_file", "1050_FluidR3_GM_sf2_file", "1050_JCLive_sf2_file", "1050_SBLive_sf2", "1050_SoundBlasterOld_sf2", "1051_GeneralUserGS_sf2_file",
            "1060_GeneralUserGS_sf2_file", "1060_Aspirin_sf2_file", "1060_Chaos_sf2_file", "1060_FluidR3_GM_sf2_file", "1060_JCLive_sf2_file", "1060_SBLive_sf2", "1060_SoundBlasterOld_sf2", "1061_FluidR3_GM_sf2_file", "1061_GeneralUserGS_sf2_file", "1061_SoundBlasterOld_sf2",
            "1070_GeneralUserGS_sf2_file", "1070_Aspirin_sf2_file", "1070_Chaos_sf2_file", "1070_FluidR3_GM_sf2_file", "1070_JCLive_sf2_file", "1070_SBLive_sf2", "1070_SoundBlasterOld_sf2", "1071_FluidR3_GM_sf2_file", "1071_GeneralUserGS_sf2_file", "1072_GeneralUserGS_sf2_file", "1073_GeneralUserGS_sf2_file",
            "1080_GeneralUserGS_sf2_file", "1080_Aspirin_sf2_file", "1080_Chaos_sf2_file", "1080_FluidR3_GM_sf2_file", "1080_JCLive_sf2_file", "1080_SBLive_sf2", "1080_SoundBlasterOld_sf2", "1081_SoundBlasterOld_sf2",
            "1090_GeneralUserGS_sf2_file", "1090_Aspirin_sf2_file", "1090_Chaos_sf2_file", "1090_FluidR3_GM_sf2_file", "1090_JCLive_sf2_file", "1090_SBLive_sf2", "1090_SoundBlasterOld_sf2", "1091_SoundBlasterOld_sf2",
            "1100_GeneralUserGS_sf2_file", "1100_Aspirin_sf2_file", "1100_Chaos_sf2_file", "1100_FluidR3_GM_sf2_file", "1100_JCLive_sf2_file", "1100_SBLive_sf2", "1100_SoundBlasterOld_sf2", "1101_Aspirin_sf2_file", "1101_FluidR3_GM_sf2_file", "1101_GeneralUserGS_sf2_file", "1102_GeneralUserGS_sf2_file",
            "1110_GeneralUserGS_sf2_file", "1110_Aspirin_sf2_file", "1110_Chaos_sf2_file", "1110_FluidR3_GM_sf2_file", "1110_JCLive_sf2_file", "1110_SBLive_sf2", "1110_SoundBlasterOld_sf2",
            "1120_GeneralUserGS_sf2_file", "1120_Aspirin_sf2_file", "1120_Chaos_sf2_file", "1120_FluidR3_GM_sf2_file", "1120_JCLive_sf2_file", "1120_SBLive_sf2", "1120_SoundBlasterOld_sf2", "1121_SoundBlasterOld_sf2",
            "1130_GeneralUserGS_sf2_file", "1130_Aspirin_sf2_file", "1130_Chaos_sf2_file", "1130_FluidR3_GM_sf2_file", "1130_JCLive_sf2_file", "1130_SBLive_sf2", "1130_SoundBlasterOld_sf2", "1131_FluidR3_GM_sf2_file", "1131_SoundBlasterOld_sf2",
            "1140_GeneralUserGS_sf2_file", "1140_Aspirin_sf2_file", "1140_Chaos_sf2_file", "1140_FluidR3_GM_sf2_file", "1140_JCLive_sf2_file", "1140_SBLive_sf2", "1140_SoundBlasterOld_sf2", "1141_FluidR3_GM_sf2_file",
            "1150_GeneralUserGS_sf2_file", "1150_Aspirin_sf2_file", "1150_Chaos_sf2_file", "1150_FluidR3_GM_sf2_file", "1150_JCLive_sf2_file", "1150_SBLive_sf2", "1150_SoundBlasterOld_sf2", "1151_FluidR3_GM_sf2_file", "1151_GeneralUserGS_sf2_file", "1152_FluidR3_GM_sf2_file", "1152_GeneralUserGS_sf2_file",
            "1160_GeneralUserGS_sf2_file", "1160_Aspirin_sf2_file", "1160_Chaos_sf2_file", "1160_FluidR3_GM_sf2_file", "1160_JCLive_sf2_file", "1160_SBLive_sf2", "1160_SoundBlasterOld_sf2", "1161_FluidR3_GM_sf2_file", "1161_GeneralUserGS_sf2_file", "1161_SoundBlasterOld_sf2", "1162_FluidR3_GM_sf2_file", "1162_GeneralUserGS_sf2_file", "1163_FluidR3_GM_sf2_file",
            "1170_GeneralUserGS_sf2_file", "1170_Aspirin_sf2_file", "1170_Chaos_sf2_file", "1170_FluidR3_GM_sf2_file", "1170_JCLive_sf2_file", "1170_SBLive_sf2", "1170_SoundBlasterOld_sf2", "1171_FluidR3_GM_sf2_file", "1171_GeneralUserGS_sf2_file", "1172_FluidR3_GM_sf2_file", "1173_FluidR3_GM_sf2_file",
            "1180_GeneralUserGS_sf2_file", "1180_Aspirin_sf2_file", "1180_Chaos_sf2_file", "1180_FluidR3_GM_sf2_file", "1180_JCLive_sf2_file", "1180_SBLive_sf2", "1180_SoundBlasterOld_sf2", "1181_FluidR3_GM_sf2_file", "1181_GeneralUserGS_sf2_file", "1181_SoundBlasterOld_sf2",
            "1190_GeneralUserGS_sf2_file", "1190_Aspirin_sf2_file", "1190_Chaos_sf2_file", "1190_FluidR3_GM_sf2_file", "1190_JCLive_sf2_file", "1190_SBLive_sf2", "1190_SoundBlasterOld_sf2", "1191_GeneralUserGS_sf2_file", "1192_GeneralUserGS_sf2_file", "1193_GeneralUserGS_sf2_file", "1194_GeneralUserGS_sf2_file",
            "1200_GeneralUserGS_sf2_file", "1200_Aspirin_sf2_file", "1200_Chaos_sf2_file", "1200_FluidR3_GM_sf2_file", "1200_JCLive_sf2_file", "1200_SBLive_sf2", "1200_SoundBlasterOld_sf2", "1201_Aspirin_sf2_file", "1201_GeneralUserGS_sf2_file", "1202_GeneralUserGS_sf2_file",
            "1210_GeneralUserGS_sf2_file", "1210_Aspirin_sf2_file", "1210_Chaos_sf2_file", "1210_FluidR3_GM_sf2_file", "1210_JCLive_sf2_file", "1210_SBLive_sf2", "1210_SoundBlasterOld_sf2", "1211_Aspirin_sf2_file", "1211_GeneralUserGS_sf2_file", "1212_GeneralUserGS_sf2_file",
            "1220_FluidR3_GM_sf2_file", "1220_Aspirin_sf2_file", "1220_Chaos_sf2_file", "1220_GeneralUserGS_sf2_file", "1220_JCLive_sf2_file", "1220_SBLive_sf2", "1220_SoundBlasterOld_sf2", "1221_Aspirin_sf2_file", "1221_GeneralUserGS_sf2_file", "1221_JCLive_sf2_file", "1222_Aspirin_sf2_file", "1222_GeneralUserGS_sf2_file", "1223_Aspirin_sf2_file", "1223_GeneralUserGS_sf2_file", "1224_Aspirin_sf2_file", "1224_GeneralUserGS_sf2_file", "1225_GeneralUserGS_sf2_file", "1226_GeneralUserGS_sf2_file",
            "1230_Aspirin_sf2_file", "1230_GeneralUserGS_sf2_file", "1230_Chaos_sf2_file", "1230_FluidR3_GM_sf2_file", "1230_JCLive_sf2_file", "1230_SBLive_sf2", "1230_SoundBlasterOld_sf2", "1231_Aspirin_sf2_file", "1231_GeneralUserGS_sf2_file", "1232_Aspirin_sf2_file", "1232_GeneralUserGS_sf2_file", "1233_GeneralUserGS_sf2_file", "1234_GeneralUserGS_sf2_file",
            "1240_GeneralUserGS_sf2_file", "1240_Aspirin_sf2_file", "1240_Chaos_sf2_file", "1240_FluidR3_GM_sf2_file", "1240_JCLive_sf2_file", "1240_SBLive_sf2", "1240_SoundBlasterOld_sf2", "1241_Aspirin_sf2_file", "1241_GeneralUserGS_sf2_file", "1242_Aspirin_sf2_file", "1242_GeneralUserGS_sf2_file", "1243_Aspirin_sf2_file", "1243_GeneralUserGS_sf2_file", "1244_Aspirin_sf2_file", "1244_GeneralUserGS_sf2_file",
            "1250_GeneralUserGS_sf2_file", "1250_Aspirin_sf2_file", "1250_Chaos_sf2_file", "1250_FluidR3_GM_sf2_file", "1250_JCLive_sf2_file", "1250_SBLive_sf2", "1250_SoundBlasterOld_sf2", "1251_Aspirin_sf2_file", "1251_FluidR3_GM_sf2_file", "1251_GeneralUserGS_sf2_file", "1252_Aspirin_sf2_file", "1252_FluidR3_GM_sf2_file", "1252_GeneralUserGS_sf2_file", "1253_Aspirin_sf2_file", "1253_GeneralUserGS_sf2_file", "1254_Aspirin_sf2_file", "1254_GeneralUserGS_sf2_file", "1255_Aspirin_sf2_file", "1255_GeneralUserGS_sf2_file", "1256_Aspirin_sf2_file", "1256_GeneralUserGS_sf2_file", "1257_Aspirin_sf2_file", "1257_GeneralUserGS_sf2_file", "1258_Aspirin_sf2_file", "1258_GeneralUserGS_sf2_file", "1259_GeneralUserGS_sf2_file",
            "1260_Aspirin_sf2_file", "1260_GeneralUserGS_sf2_file", "1260_Chaos_sf2_file", "1260_FluidR3_GM_sf2_file", "1260_JCLive_sf2_file", "1260_SBLive_sf2", "1260_SoundBlasterOld_sf2", "1261_Aspirin_sf2_file", "1261_GeneralUserGS_sf2_file", "1262_Aspirin_sf2_file", "1262_GeneralUserGS_sf2_file", "1263_Aspirin_sf2_file", "1263_GeneralUserGS_sf2_file", "1264_Aspirin_sf2_file", "1264_GeneralUserGS_sf2_file", "1265_Aspirin_sf2_file", "1265_GeneralUserGS_sf2_file",
            "1270_GeneralUserGS_sf2_file", "1270_Aspirin_sf2_file", "1270_Chaos_sf2_file", "1270_FluidR3_GM_sf2_file", "1270_JCLive_sf2_file", "1270_SBLive_sf2", "1270_SoundBlasterOld_sf2", "1271_Aspirin_sf2_file", "1271_GeneralUserGS_sf2_file", "1272_Aspirin_sf2_file", "1272_GeneralUserGS_sf2_file", "1273_GeneralUserGS_sf2_file", "1274_GeneralUserGS_sf2_file"
        ];
    }
    ;
}
let pluckDiff = 23;
class MidiParser {
    constructor(arrayBuffer) {
        this.alignedMIDIevents = [];
        this.instrumentNamesArray = [];
        this.drumNamesArray = [];
        this.EVENT_META = 0xff;
        this.EVENT_SYSEX = 0xf0;
        this.EVENT_DIVSYSEX = 0xf7;
        this.EVENT_MIDI = 0x8;
        this.EVENT_META_SEQUENCE_NUMBER = 0x00;
        this.EVENT_META_TEXT = 0x01;
        this.EVENT_META_COPYRIGHT_NOTICE = 0x02;
        this.EVENT_META_TRACK_NAME = 0x03;
        this.EVENT_META_INSTRUMENT_NAME = 0x04;
        this.EVENT_META_LYRICS = 0x05;
        this.EVENT_META_MARKER = 0x06;
        this.EVENT_META_CUE_POINT = 0x07;
        this.EVENT_META_MIDI_CHANNEL_PREFIX = 0x20;
        this.EVENT_META_END_OF_TRACK = 0x2f;
        this.EVENT_META_SET_TEMPO = 0x51;
        this.EVENT_META_SMTPE_OFFSET = 0x54;
        this.EVENT_META_TIME_SIGNATURE = 0x58;
        this.EVENT_META_KEY_SIGNATURE = 0x59;
        this.EVENT_META_SEQUENCER_SPECIFIC = 0x7f;
        this.EVENT_MIDI_NOTE_OFF = 0x8;
        this.EVENT_MIDI_NOTE_ON = 0x9;
        this.EVENT_MIDI_NOTE_AFTERTOUCH = 0xa;
        this.EVENT_MIDI_CONTROLLER = 0xb;
        this.EVENT_MIDI_PROGRAM_CHANGE = 0xc;
        this.EVENT_MIDI_CHANNEL_AFTERTOUCH = 0xd;
        this.EVENT_MIDI_PITCH_BEND = 0xe;
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        this.programChannel = [];
        this.controller_BankSelectMSB = 0x00;
        this.controller_ModulationWheel = 0x01;
        this.controller_coarseDataEntrySlider = 0x06;
        this.controller_coarseVolume = 0x07;
        this.controller_ballance = 0x08;
        this.controller_pan = 0x0A;
        this.controller_expression = 0x0B;
        this.controller_BankSelectLSBGS = 0x20;
        this.controller_fineDataEntrySlider = 0x26;
        this.controller_ReverbLevel = 0x5B;
        this.controller_HoldPedal1 = 0x40;
        this.controller_TremoloDepth = 0x5C;
        this.controller_ChorusLevel = 0x5D;
        this.controller_NRPNParameterLSB = 0x62;
        this.controller_NRPNParameterMSB = 0x63;
        this.controller_fineRPN = 0x64;
        this.controller_coarseRPN = 0x65;
        this.controller_ResetAllControllers = 0x79;
        this.midiheader = new MIDIFileHeader(arrayBuffer);
        this.parseTracks(arrayBuffer);
    }
    parseTracks(arrayBuffer) {
        var curIndex = this.midiheader.HEADER_LENGTH;
        var trackCount = this.midiheader.trackCount;
        this.parsedTracks = [];
        for (var i = 0; i < trackCount; i++) {
            var track = new MIDIFileTrack(arrayBuffer, curIndex);
            this.parsedTracks.push(track);
            curIndex = curIndex + track.trackLength + 8;
        }
        for (var i = 0; i < this.parsedTracks.length; i++) {
            this.parseTrackEvents(this.parsedTracks[i]);
        }
        this.parseNotes();
        this.simplifyAllBendPaths();
    }
    toText(arr) {
        let txt = '';
        try {
            let win1251decoder = new TextDecoder("windows-1251");
            let bytes = new Uint8Array(arr);
            let txt1251 = win1251decoder.decode(bytes);
            txt = txt1251;
        }
        catch (xx) {
            console.log(xx);
            var rr = '';
            for (var ii = 0; ii < arr.length; ii++) {
                rr = rr + String.fromCharCode(arr[ii]);
            }
            txt = rr;
        }
        txt = txt.replace("\\n", " ");
        txt = txt.replace("\\r", " ");
        txt = txt.replace("\\t", " ");
        txt = txt.replace("\n", " ");
        txt = txt.replace("\r", " ");
        txt = txt.replace("\t", " ");
        txt = txt.replace("\\", " ");
        txt = txt.replace("/", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        return txt;
    }
    findOpenedNoteBefore(firstPitch, when, track, channel) {
        for (var i = 0; i < track.trackNotes.length; i++) {
            let trNote = track.trackNotes[track.trackNotes.length - i - 1];
            if (trNote.startMs < when && trNote.channelidx == channel) {
                if (!(trNote.closed)) {
                    if (trNote.basePitch == firstPitch) {
                        return trNote;
                    }
                }
            }
        }
        return null;
    }
    findLastNoteBefore(when, track, channel) {
        for (var i = 0; i < track.trackNotes.length; i++) {
            let trNote = track.trackNotes[track.trackNotes.length - i - 1];
            if (trNote.startMs < when && trNote.channelidx == channel) {
                return trNote;
            }
        }
        return null;
    }
    takeOpenedNote(first, when, trackIdx, track, channel) {
        for (var i = 0; i < track.trackNotes.length; i++) {
            let trNote = track.trackNotes[i];
            if (trNote.startMs == when && trNote.channelidx == channel) {
                if (!(trNote.closed)) {
                    if (trNote.basePitch == first) {
                        return trNote;
                    }
                }
            }
        }
        var pi = {
            basePitch: first, startMs: when, avgMs: -1,
            trackidx: trackIdx,
            channelidx: channel,
            baseDuration: -1,
            closed: false,
            bendPoints: []
        };
        track.trackNotes.push(pi);
        return pi;
    }
    distanceToPoint(line, point) {
        var m = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
        var b = line.p1.y - (m * line.p1.x);
        var d = [];
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
        d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
        d.sort(function (a, b) {
            return (a - b);
        });
        return d[0];
    }
    ;
    douglasPeucker(points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }
        var returnPoints = [];
        var line = { p1: points[0], p2: points[points.length - 1] };
        var maxDistance = 0;
        var maxDistanceIndex = 0;
        var p;
        for (var i = 1; i <= points.length - 2; i++) {
            var distance = this.distanceToPoint(line, points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }
        if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
        }
        else {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = [points[0]];
        }
        return returnPoints;
    }
    ;
    simplifyAllBendPaths() {
        let msMinPointDuration = 25;
        for (var t = 0; t < this.parsedTracks.length; t++) {
            var track = this.parsedTracks[t];
            for (var nn = 0; nn < track.trackNotes.length; nn++) {
                var note = track.trackNotes[nn];
                if (note.bendPoints.length > 0) {
                    let simplifiedPath = [];
                    let cuPointDuration = 0;
                    let lastPitchDelta = 0;
                    for (let pp = 0; pp < note.bendPoints.length; pp++) {
                        let cuPoint = note.bendPoints[pp];
                        lastPitchDelta = cuPoint.basePitchDelta;
                        cuPointDuration = cuPointDuration + cuPoint.pointDuration;
                        if (cuPointDuration > msMinPointDuration) {
                            simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastPitchDelta });
                            cuPointDuration = 0;
                        }
                        else {
                            if (simplifiedPath.length > 0) {
                                let prePoint = simplifiedPath[simplifiedPath.length - 1];
                                prePoint.basePitchDelta = lastPitchDelta;
                            }
                        }
                    }
                    simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastPitchDelta });
                    note.bendPoints = simplifiedPath;
                }
                else {
                    if (note.baseDuration > 7654) {
                        note.baseDuration = 4321;
                    }
                }
            }
        }
    }
    nextByAllTracksEvent() {
        let minDeltaEvent = null;
        let trackWithSmallestDelta = null;
        let minDeltaTrackIdx = -1;
        for (let tt = 0; tt < this.parsedTracks.length; tt++) {
            var atrack = this.parsedTracks[tt];
            if (atrack.currentEvent) {
                if (trackWithSmallestDelta) {
                    if (trackWithSmallestDelta.currentEvent) {
                        if (trackWithSmallestDelta.currentEvent.delta > atrack.currentEvent.delta) {
                            trackWithSmallestDelta = atrack;
                            minDeltaEvent = trackWithSmallestDelta.currentEvent;
                            minDeltaTrackIdx = tt;
                        }
                    }
                }
                else {
                    trackWithSmallestDelta = atrack;
                    minDeltaEvent = trackWithSmallestDelta.currentEvent;
                    minDeltaTrackIdx = tt;
                }
            }
        }
        if (trackWithSmallestDelta) {
            if (minDeltaEvent) {
                for (let tt = 0; tt < this.parsedTracks.length; tt++) {
                    var atrack = this.parsedTracks[tt];
                    if (tt == minDeltaTrackIdx) {
                        atrack.moveNextCuEvent();
                    }
                    else {
                        if (atrack.currentEvent) {
                            atrack.currentEvent.delta = atrack.currentEvent.delta - minDeltaEvent?.delta;
                        }
                    }
                }
            }
        }
        return minDeltaEvent;
    }
    addResolutionPoint(trackIdx, playTimeTicks, tickResolution, tempo, vnt) {
        let reChange = {
            track: trackIdx,
            ms: playTimeTicks,
            newresolution: tickResolution,
            bpm: tempo,
            evnt: vnt
        };
        this.midiheader.changesResolutionTempo.push(reChange);
        this.midiheader.changesResolutionTempo.sort((a, b) => { return a.ms - b.ms; });
    }
    fillEventsTimeMs() {
        let tickResolutionAt0 = this.midiheader.get0TickResolution();
        this.addResolutionPoint(-1, -1, tickResolutionAt0, 120, null);
        var format = this.midiheader.getFormat();
        if (format == 1) {
            let playTime = 0;
            let tickResolution = this.midiheader.getCalculatedTickResolution(0);
            for (let tt = 0; tt < this.parsedTracks.length; tt++) {
                this.parsedTracks[tt].moveNextCuEvent();
            }
            let cuevnt = this.nextByAllTracksEvent();
            while (cuevnt) {
                if (cuevnt.delta) {
                    playTime = playTime + (cuevnt.delta * tickResolution) / 1000;
                }
                cuevnt.playTimeMs = playTime;
                if (cuevnt.basetype === this.EVENT_META) {
                    if (cuevnt.subtype === this.EVENT_META_SET_TEMPO) {
                        tickResolution = this.midiheader.getCalculatedTickResolution(cuevnt.tempo ? cuevnt.tempo : 0);
                        this.addResolutionPoint(-1, playTime, tickResolution, cuevnt.tempoBPM ? cuevnt.tempoBPM : 12, cuevnt);
                    }
                }
                cuevnt = this.nextByAllTracksEvent();
            }
        }
        else {
            let playTime = 0;
            let tickResolution = this.midiheader.getCalculatedTickResolution(0);
            for (let t = 0; t < this.parsedTracks.length; t++) {
                var track = this.parsedTracks[t];
                if (format == 2) {
                }
                else {
                    playTime = 0;
                }
                for (let e = 0; e < track.trackevents.length; e++) {
                    let trevnt = track.trackevents[e];
                    playTime = playTime + trevnt.delta * tickResolution / 1000;
                    trevnt.playTimeMs = playTime;
                    if (trevnt.basetype === this.EVENT_META) {
                        if (trevnt.subtype === this.EVENT_META_SET_TEMPO) {
                            tickResolution = this.midiheader.getCalculatedTickResolution(trevnt.tempo ? trevnt.tempo : 0);
                            this.addResolutionPoint(-1, playTime, tickResolution, trevnt.tempoBPM ? trevnt.tempoBPM : 12, trevnt);
                        }
                    }
                }
            }
        }
    }
    alignEventsTime() {
        let maxDelta = 23;
        let starts = [];
        for (let tt = 0; tt < this.parsedTracks.length; tt++) {
            var singleParsedTrack = this.parsedTracks[tt];
            for (var ee = 0; ee < singleParsedTrack.trackevents.length; ee++) {
                var evnt = singleParsedTrack.trackevents[ee];
                if (evnt.basetype == this.EVENT_MIDI) {
                    if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                        starts.push(evnt);
                    }
                }
            }
        }
        starts.sort((a, b) => { return a.playTimeMs - b.playTimeMs; });
        if (starts.length) {
            let evnt = starts[0];
            this.alignedMIDIevents.push({ startMs: evnt.playTimeMs, avg: 0, events: [evnt] });
            for (let ee = 1; ee < starts.length; ee++) {
                let evnt = starts[ee];
                let last = this.alignedMIDIevents[this.alignedMIDIevents.length - 1];
                let pretime = last.events[last.events.length - 1].playTimeMs;
                if (evnt.playTimeMs < pretime + maxDelta) {
                    last.events.push(evnt);
                }
                else {
                    this.alignedMIDIevents.push({ startMs: evnt.playTimeMs, avg: 0, events: [evnt] });
                }
            }
            for (let ii = 0; ii < this.alignedMIDIevents.length; ii++) {
                let smm = 0;
                for (ee = 0; ee < this.alignedMIDIevents[ii].events.length; ee++) {
                    smm = smm + this.alignedMIDIevents[ii].events[ee].playTimeMs;
                }
                this.alignedMIDIevents[ii].avg = Math.round(smm / this.alignedMIDIevents[ii].events.length);
            }
            for (let ii = 0; ii < this.alignedMIDIevents.length; ii++) {
                for (ee = 0; ee < this.alignedMIDIevents[ii].events.length; ee++) {
                    this.alignedMIDIevents[ii].events[ee].playTimeMs = this.alignedMIDIevents[ii].avg;
                }
            }
        }
    }
    parseNotes() {
        this.fillEventsTimeMs();
        this.alignEventsTime();
        var expectedState = 1;
        var expectedPitchBendRangeChannel = null;
        var pitchBendValuesRange = Array(16).fill(2);
        for (let t = 0; t < this.parsedTracks.length; t++) {
            var singleParsedTrack = this.parsedTracks[t];
            for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
                if (Math.floor(e / 1000) == e / 1000) {
                }
                var preState = expectedState;
                var evnt = singleParsedTrack.trackevents[e];
                if (evnt.basetype == this.EVENT_MIDI) {
                    evnt.param1 = evnt.param1 ? evnt.param1 : 0;
                    if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                        if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                            var pitch = evnt.param1 ? evnt.param1 : 0;
                            var when = 0;
                            if (evnt.playTimeMs)
                                when = evnt.playTimeMs;
                            let trno = this.takeOpenedNote(pitch, when, t, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                            trno.volume = evnt.param2;
                            trno.openEvent = evnt;
                        }
                    }
                    else {
                        if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
                            if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                var pitch = evnt.param1 ? evnt.param1 : 0;
                                var when = 0;
                                if (evnt.playTimeMs)
                                    when = evnt.playTimeMs;
                                var openedNoteBefore = this.findOpenedNoteBefore(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                if (openedNoteBefore) {
                                    openedNoteBefore.baseDuration = when - openedNoteBefore.startMs;
                                    openedNoteBefore.closed = true;
                                    openedNoteBefore.closeEvent = evnt;
                                }
                            }
                        }
                        else {
                            if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
                                if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                    let pair = {
                                        midiProgram: evnt.param1 ? evnt.param1 : 0,
                                        midiChannel: evnt.midiChannel ? evnt.midiChannel : 0
                                    };
                                    let xsts = this.programChannel.find((it) => it.midiChannel == pair.midiChannel);
                                    if (xsts) {
                                        xsts.midiProgram = pair.midiProgram;
                                    }
                                    else {
                                        this.programChannel.push(pair);
                                    }
                                }
                            }
                            else {
                                if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
                                    var eventWhen = evnt.playTimeMs ? evnt.playTimeMs : 0;
                                    var note = this.findLastNoteBefore(eventWhen, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                    if (note) {
                                        let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                        let pp2 = evnt.param2 ? evnt.param2 : 0;
                                        var delta = (pp2 - 64.0) / 64.0 * pitchBendValuesRange[idx];
                                        var allPointsDuration = 0;
                                        for (var k = 0; k < note.bendPoints.length; k++) {
                                            allPointsDuration = allPointsDuration + note.bendPoints[k].pointDuration;
                                        }
                                        var point = {
                                            pointDuration: eventWhen - note.startMs - allPointsDuration,
                                            basePitchDelta: delta
                                        };
                                        if (!(note.closed)) {
                                            note.bendPoints.push(point);
                                        }
                                        else {
                                        }
                                    }
                                }
                                else {
                                    if (evnt.subtype == this.EVENT_MIDI_CONTROLLER) {
                                        if (evnt.param1 == this.controller_coarseVolume) {
                                            var v = evnt.param2 ? evnt.param2 / 127 : 0;
                                            let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
                                            singleParsedTrack.trackVolumePoints.push(point);
                                        }
                                        else {
                                            if ((expectedState == 1 && evnt.param1 == this.controller_coarseRPN && evnt.param2 == 0x00) ||
                                                (expectedState == 2 && evnt.param1 == this.controller_fineRPN && evnt.param2 == 0x00) ||
                                                (expectedState == 3 && evnt.param1 == this.controller_coarseDataEntrySlider) ||
                                                (expectedState == 4 && evnt.param1 == this.controller_fineDataEntrySlider)) {
                                                if (expectedState > 1 && evnt.midiChannel != expectedPitchBendRangeChannel) {
                                                }
                                                expectedPitchBendRangeChannel = evnt.midiChannel;
                                                let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                                if (expectedState == 3) {
                                                    pitchBendValuesRange[idx] = evnt.param2;
                                                }
                                                if (expectedState == 4) {
                                                    let pp = evnt.param2 ? evnt.param2 : 0;
                                                    pitchBendValuesRange[idx] = pitchBendValuesRange[idx] + pp / 100;
                                                }
                                                expectedState++;
                                                if (expectedState == 5) {
                                                    expectedState = 1;
                                                }
                                            }
                                            else {
                                                if (evnt.param1 == this.controller_BankSelectMSB
                                                    || evnt.param1 == this.controller_ModulationWheel
                                                    || evnt.param1 == this.controller_ReverbLevel
                                                    || evnt.param1 == this.controller_TremoloDepth
                                                    || evnt.param1 == this.controller_ChorusLevel
                                                    || evnt.param1 == this.controller_NRPNParameterLSB
                                                    || evnt.param1 == this.controller_NRPNParameterMSB
                                                    || evnt.param1 == this.controller_fineRPN
                                                    || evnt.param1 == this.controller_coarseRPN
                                                    || evnt.param1 == this.controller_coarseDataEntrySlider
                                                    || evnt.param1 == this.controller_ballance
                                                    || evnt.param1 == this.controller_pan
                                                    || evnt.param1 == this.controller_expression
                                                    || evnt.param1 == this.controller_BankSelectLSBGS
                                                    || evnt.param1 == this.controller_HoldPedal1
                                                    || evnt.param1 == this.controller_ResetAllControllers
                                                    || (evnt.param1 >= 32 && evnt.param1 <= 63)
                                                    || (evnt.param1 >= 70 && evnt.param1 <= 79)) {
                                                }
                                                else {
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (evnt.subtype == this.EVENT_META_TEXT) {
                        this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_MARKER) {
                        this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
                        this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'Copyright: ' + (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
                        singleParsedTrack.trackTitle = evnt.text ? evnt.text : '';
                    }
                    if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
                        singleParsedTrack.instrumentName = evnt.text ? evnt.text : '';
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_CUE_POINT) {
                        this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'CUE: ' + (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {
                        var majSharpCircleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
                        var majFlatCircleOfFifths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
                        var minSharpCircleOfFifths = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#'];
                        var minFlatCircleOfFifths = ['Am', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];
                        var key = evnt.key ? evnt.key : 0;
                        if (key > 127)
                            key = key - 256;
                        this.midiheader.keyFlatSharp = key;
                        this.midiheader.keyMajMin = evnt.scale ? evnt.scale : 0;
                        var signature = 'C';
                        if (this.midiheader.keyFlatSharp >= 0) {
                            if (this.midiheader.keyMajMin < 1) {
                                signature = majSharpCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
                            }
                            else {
                                signature = minSharpCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
                            }
                        }
                        else {
                            if (this.midiheader.keyMajMin < 1) {
                                signature = majFlatCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
                            }
                            else {
                                signature = minFlatCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
                            }
                        }
                        this.midiheader.signsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
                    }
                    if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
                        this.midiheader.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
                    }
                    if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
                        this.midiheader.meterCount = evnt.param1 ? evnt.param1 : 4;
                        var dvsn = evnt.param2 ? evnt.param2 : 2;
                        if (dvsn == 1)
                            this.midiheader.meterDivision = 2;
                        else if (dvsn == 2)
                            this.midiheader.meterDivision = 4;
                        else if (dvsn == 3)
                            this.midiheader.meterDivision = 8;
                        else if (dvsn == 4)
                            this.midiheader.meterDivision = 16;
                        else if (dvsn == 5)
                            this.midiheader.meterDivision = 32;
                        else if (dvsn == 0)
                            this.midiheader.meterDivision = 1;
                        this.midiheader.metersList.push({
                            track: t,
                            ms: evnt.playTimeMs ? evnt.playTimeMs : 0,
                            count: this.midiheader.meterCount,
                            division: this.midiheader.meterDivision,
                            evnt: evnt
                        });
                    }
                }
                if (preState == expectedState) {
                    if (preState >= 2 && preState <= 3) {
                    }
                    if (preState == 4) {
                        expectedState = 1;
                    }
                }
            }
        }
    }
    nextEvent(stream) {
        var index = stream.offset();
        var delta = stream.readVarInt();
        var eventTypeByte = stream.readUint8();
        var event = { offset: index, delta: delta, eventTypeByte: eventTypeByte, playTimeMs: 0 };
        if (0xf0 === (eventTypeByte & 0xf0)) {
            if (eventTypeByte === this.EVENT_META) {
                event.basetype = this.EVENT_META;
                event.subtype = stream.readUint8();
                event.length = stream.readVarInt();
                switch (event.subtype) {
                    case this.EVENT_META_SEQUENCE_NUMBER:
                        event.msb = stream.readUint8();
                        event.lsb = stream.readUint8();
                        console.log('EVENT_META_SEQUENCE_NUMBER', event);
                        return event;
                    case this.EVENT_META_TEXT:
                    case this.EVENT_META_COPYRIGHT_NOTICE:
                    case this.EVENT_META_TRACK_NAME:
                    case this.EVENT_META_INSTRUMENT_NAME:
                    case this.EVENT_META_LYRICS:
                    case this.EVENT_META_MARKER:
                    case this.EVENT_META_CUE_POINT:
                        event.data = stream.readBytes(event.length);
                        event.text = this.toText(event.data ? event.data : []);
                        return event;
                    case this.EVENT_META_MIDI_CHANNEL_PREFIX:
                        event.prefix = stream.readUint8();
                        return event;
                    case this.EVENT_META_END_OF_TRACK:
                        return event;
                    case this.EVENT_META_SET_TEMPO:
                        event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
                        event.tempoBPM = 60000000 / event.tempo;
                        return event;
                    case this.EVENT_META_SMTPE_OFFSET:
                        event.hour = stream.readUint8();
                        event.minutes = stream.readUint8();
                        event.seconds = stream.readUint8();
                        event.frames = stream.readUint8();
                        event.subframes = stream.readUint8();
                        return event;
                    case this.EVENT_META_KEY_SIGNATURE:
                        event.key = stream.readUint8();
                        event.scale = stream.readUint8();
                        return event;
                    case this.EVENT_META_TIME_SIGNATURE:
                        event.data = stream.readBytes(event.length);
                        event.param1 = event.data[0];
                        event.param2 = event.data[1];
                        event.param3 = event.data[2];
                        event.param4 = event.data[3];
                        return event;
                    case this.EVENT_META_SEQUENCER_SPECIFIC:
                        event.data = stream.readBytes(event.length);
                        return event;
                    default:
                        event.data = stream.readBytes(event.length);
                        return event;
                }
            }
            else {
                if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
                    event.basetype = eventTypeByte;
                    event.length = stream.readVarInt();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
                else {
                    event.basetype = eventTypeByte;
                    event.badsubtype = stream.readVarInt();
                    event.length = stream.readUint8();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
            }
        }
        else {
            if (0 === (eventTypeByte & 0x80)) {
                if (!this.midiEventType) {
                    throw new Error('no pre event' + stream.offset());
                }
                this.midiEventParam1 = eventTypeByte;
            }
            else {
                this.midiEventType = eventTypeByte >> 4;
                this.midiEventChannel = eventTypeByte & 0x0f;
                this.midiEventParam1 = stream.readUint8();
            }
            event.basetype = this.EVENT_MIDI;
            event.subtype = this.midiEventType;
            event.midiChannel = this.midiEventChannel;
            event.param1 = this.midiEventParam1;
            switch (this.midiEventType) {
                case this.EVENT_MIDI_NOTE_OFF:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_NOTE_ON:
                    event.param2 = stream.readUint8();
                    if (!event.param2) {
                        event.subtype = this.EVENT_MIDI_NOTE_OFF;
                        event.param2 = -1;
                    }
                    return event;
                case this.EVENT_MIDI_NOTE_AFTERTOUCH:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_CONTROLLER:
                    event.param2 = stream.readUint8();
                    if (event.param1 == 7) {
                    }
                    return event;
                case this.EVENT_MIDI_PROGRAM_CHANGE:
                    return event;
                case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
                    return event;
                case this.EVENT_MIDI_PITCH_BEND:
                    event.param2 = stream.readUint8();
                    return event;
                default:
                    console.log('unknown note', event);
                    return event;
            }
        }
    }
    parseTrackEvents(track) {
        var stream = new DataViewStream(track.trackContent);
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        while (!stream.end()) {
            var e = this.nextEvent(stream);
            track.trackevents.push(e);
        }
    }
}
class MIDIFileTrack {
    constructor(buffer, start) {
        this.currentEventIdx = -1;
        this.currentEvent = null;
        this.HDR_LENGTH = 8;
        this.trackNotes = [];
        this.datas = new DataView(buffer, start, this.HDR_LENGTH);
        this.trackLength = this.datas.getUint32(4);
        this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
        this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
        this.trackevents = [];
        this.trackVolumePoints = [];
    }
    moveNextCuEvent() {
        if (this.currentEventIdx < this.trackevents.length - 2) {
            this.currentEventIdx++;
            this.currentEvent = this.trackevents[this.currentEventIdx];
        }
        else {
            this.currentEvent = null;
        }
    }
}
class MIDIFileHeader {
    constructor(buffer) {
        this.HEADER_LENGTH = 14;
        this.tempoBPM = 120;
        this.changesResolutionTempo = [];
        this.metersList = [];
        this.lyricsList = [];
        this.signsList = [];
        this.meterCount = 4;
        this.meterDivision = 4;
        this.keyFlatSharp = 0;
        this.keyMajMin = 0;
        this.lastNonZeroQuarter = 0;
        this.getFormat = function () {
            const format = this.datas.getUint16(8);
            if (0 == format || 1 == format || 2 == format) {
            }
            else {
                console.log('wrong format', format);
            }
            return format;
        };
        this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
        this.format = this.datas.getUint16(8);
        this.trackCount = this.datas.getUint16(10);
    }
    getCalculatedTickResolution(tempo) {
        this.lastNonZeroQuarter = tempo;
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    get0TickResolution() {
        var tempo = 0;
        if (this.lastNonZeroQuarter) {
            tempo = this.lastNonZeroQuarter;
        }
        else {
            tempo = 60000000 / this.tempoBPM;
        }
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    getTicksPerBeat() {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord;
    }
    getTicksPerFrame() {
        const divisionWord = this.datas.getUint16(12);
        return divisionWord & 0x00ff;
    }
    getSMPTEFrames() {
        const divisionWord = this.datas.getUint16(12);
        let smpteFrames;
        smpteFrames = divisionWord & 0x7f00;
        if (smpteFrames == 29) {
            return 29.97;
        }
        else {
            return smpteFrames;
        }
    }
}
class DataViewStream {
    constructor(dv) {
        this.position = 0;
        this.buffer = dv;
    }
    readUint8() {
        var n = this.buffer.getUint8(this.position);
        this.position++;
        return n;
    }
    readUint16() {
        var v = this.buffer.getUint16(this.position);
        this.position = this.position + 2;
        return v;
    }
    readVarInt() {
        var v = 0;
        var i = 0;
        var b;
        while (i < 4) {
            b = this.readUint8();
            if (b & 0x80) {
                v = v + (b & 0x7f);
                v = v << 7;
            }
            else {
                return v + b;
            }
            i++;
        }
        throw new Error('readVarInt ' + i);
    }
    readBytes(length) {
        var bytes = [];
        for (var i = 0; i < length; i++) {
            bytes.push(this.readUint8());
        }
        return bytes;
    }
    offset() {
        return this.buffer.byteOffset + this.position;
    }
    end() {
        return this.position == this.buffer.byteLength;
    }
}
class MIDIReader {
    constructor(filename, filesize, arrayBuffer) {
        this.parser = new MidiParser(arrayBuffer);
        let converter = new EventsConverter(this.parser);
        this.project = converter.convertEvents(filename, filesize);
        this.info = converter.midiFileInfo;
    }
}
class EventsConverter {
    constructor(parser) {
        this.midiFileInfo = {
            fileName: '',
            fileSize: 0,
            duration: 0,
            noteCount: 0,
            drumCount: 0,
            tracks: [],
            drums: [],
            avgTempoCategory04: 0,
            baseDrumCategory03: 0,
            baseDrumPerBar: 0,
            bars: [],
            barCount: 0,
            bassTrackNum: -1,
            bassAvg: -1,
            durationCategory04: 0,
            guitarChordDuration: 0,
            guitarChordCategory03: 0,
            bassLine: '',
            bassTone50: 0,
            overDriveRatio01: 0,
            proCategories: [],
            meters: []
        };
        this.parser = parser;
    }
    convertEvents(name, filesize) {
        this.midiFileInfo.fileName = name;
        this.midiFileInfo.fileSize = filesize;
        let project = {
            title: name,
            timeline: [],
            tracks: [],
            percussions: [],
            filters: [],
            comments: [],
            selectedPart: {
                startMeasure: -1,
                endMeasure: -1
            },
            farorder: [],
            versionCode: '1',
            list: false,
            position: { x: 0, y: 0, z: 30 },
            menuPerformers: false,
            menuSamplers: false,
            menuFilters: false,
            menuActions: false,
            menuPlugins: false,
            menuClipboard: false,
            menuSettings: false
        };
        let allNotes = [];
        let allTracks = [];
        let allPercussions = [];
        this.collectNotes(allNotes, allTracks, allPercussions);
        this.fillTimeline(project, allNotes);
        let echoOutID = 'reverberation';
        let compresID = 'compression';
        let filterEcho = {
            id: echoOutID,
            title: echoOutID,
            kind: 'miniumecho1',
            data: '22',
            outputs: [''],
            iconPosition: { x: 0, y: 0 },
            automation: [], state: 0
        };
        let filterCompression = {
            id: compresID,
            title: compresID,
            kind: 'miniumdcompressor1',
            data: '33',
            outputs: [echoOutID],
            iconPosition: { x: 0, y: 0 },
            automation: [], state: 0
        };
        project.filters.push(filterEcho);
        project.filters.push(filterCompression);
        this.addInsTrack(project, allTracks, compresID);
        this.addPercussionTrack(project, allPercussions, compresID);
        for (let ii = 0; ii < allNotes.length; ii++) {
            let it = allNotes[ii];
            if (it.channelidx == 9) {
                this.addDrumkNote(project.percussions, project.timeline, allPercussions, it);
            }
            else {
                this.addTrackNote(project.tracks, project.timeline, allTracks, it);
            }
        }
        this.addMIDIComments(project);
        this.arrangeIcons(project);
        for (let ii = 0; ii < project.timeline.length; ii++) {
            let bar = project.timeline[ii];
            bar.tempo = 1 * Math.round(bar.tempo / 1);
        }
        this.fillInfoMIDI(project, allNotes, allTracks);
        return project;
    }
    findProgramForChannel(chanIdx) {
        let program = -1;
        for (let ii = 0; ii < this.parser.programChannel.length; ii++) {
            if (this.parser.programChannel[ii].midiChannel == chanIdx) {
                return this.parser.programChannel[ii].midiProgram;
            }
        }
        return program;
    }
    fillInfoMIDI(project, allNotes, allTracks) {
        let insList = [];
        for (let ii = 0; ii < allNotes.length; ii++) {
            let anote = allNotes[ii];
            if (anote.channelidx != 9) {
                let prog = this.findProgramForChannel(anote.channelidx);
                if (insList.indexOf(prog) < 0) {
                    insList.push(prog);
                }
            }
        }
        for (let kk = 0; kk < insList.length; kk++) {
            let program = insList[kk];
            let progNotes = allNotes.filter((it) => this.findProgramForChannel(it.channelidx) == program);
            let starts = [];
            for (let cc = 0; cc < progNotes.length; cc++) {
                let pnote = progNotes[cc];
                let xsts = starts.find((it) => it.startMs == pnote.startMs);
                if (xsts) {
                    if (!xsts.tones.find((it) => it == pnote.basePitch % 12)) {
                        xsts.tones.push(pnote.basePitch % 12);
                    }
                }
                else {
                    starts.push({
                        startMs: pnote.startMs,
                        baseDuration: pnote.baseDuration,
                        tones: [pnote.basePitch % 12],
                        basePitch: pnote.basePitch
                    });
                }
            }
            let chords = starts.filter((it) => it.tones.length > 2);
            let choDur = chords.reduce((last, it) => last + it.baseDuration, 0);
            let singles = starts.filter((it) => it.tones.length < 3);
            let snglDur = singles.reduce((last, it) => last + it.baseDuration, 0);
            let tones = [];
            let sipitches = [];
            for (let ss = 0; ss < starts.length; ss++) {
                let pitch = Math.round(starts[ss].basePitch);
                let tone = pitch % 12;
                let foundedTone = tones.find((it) => it.tone == tone);
                if (foundedTone) {
                    let foundedPitch = foundedTone.pitches.find((it) => it.pitch == pitch);
                    if (foundedPitch) {
                        foundedPitch.count++;
                        foundedTone.toneCount++;
                    }
                    else {
                        foundedTone.pitches.push({ pitch: pitch, count: 1 });
                    }
                }
                else {
                    tones.push({
                        pitches: [{
                                pitch: pitch,
                                count: 1
                            }],
                        tone: tone,
                        toneCount: 1
                    });
                }
                let found = sipitches.find((it) => it.pitch == pitch);
                if (found) {
                    found.count++;
                }
                else {
                    found = { pitch: pitch, count: 1, ratio: 0 };
                    sipitches.push(found);
                }
            }
            let pitchCount = sipitches.reduce((last, it) => last + it.count, 0);
            this.midiFileInfo.tracks.push({
                program: program,
                ratio: 0,
                title: new ChordPitchPerformerUtil().tonechordinslist()[program],
                singlCount: singles.length,
                chordCount: chords.length,
                singleDuration: Math.round(snglDur),
                chordDuration: Math.round(choDur),
                tones: tones.sort((a, b) => b.toneCount - a.toneCount),
                pitches: sipitches.map((it) => { it.ratio = it.count / pitchCount; return it; }).sort((a, b) => b.count - a.count)
            });
        }
        this.midiFileInfo.tracks.map((it) => it.ratio = Math.round(100 * (it.chordDuration + it.singleDuration) / this.midiFileInfo.duration));
        let drumList = [];
        for (let ii = 0; ii < allNotes.length; ii++) {
            let anote = allNotes[ii];
            if (anote.channelidx == 9) {
                if (drumList.indexOf(anote.basePitch) < 0) {
                    drumList.push(anote.basePitch);
                }
            }
        }
        this.midiFileInfo.barCount = project.timeline.length;
        for (let ii = 0; ii < drumList.length; ii++) {
            let pitch = drumList[ii];
            let dritem = {
                pitch: pitch,
                count: allNotes
                    .filter((it) => it.channelidx == 9 && it.basePitch == pitch)
                    .reduce((last, it) => last + 1, 0),
                title: allPercussionDrumTitles()[pitch],
                ratio: 0,
                baravg: 0
            };
            this.midiFileInfo.drums.push(dritem);
            this.midiFileInfo.drumCount = this.midiFileInfo.drumCount + dritem.count;
        }
        for (let ii = 0; ii < this.midiFileInfo.drums.length; ii++) {
            this.midiFileInfo.drums[ii].ratio = Math.round(100 * this.midiFileInfo.drums[ii].count / this.midiFileInfo.drumCount);
            this.midiFileInfo.drums[ii].baravg = Math.round(this.midiFileInfo.drums[ii].count / this.midiFileInfo.barCount);
        }
        for (let ii = 0; ii < project.timeline.length; ii++) {
            let bar = project.timeline[ii];
            if (bar) {
                let descr = {
                    idx: ii,
                    meter: '' + bar.metre.count + '/' + bar.metre.part,
                    bpm: bar.tempo,
                    count: 1
                };
                let xsts = this.midiFileInfo.bars.find((it) => it.meter == descr.meter && it.bpm == descr.bpm);
                if (xsts) {
                    xsts.count = 1 + (xsts.count ? xsts.count : 1);
                }
                else {
                    this.midiFileInfo.bars.push(descr);
                }
            }
        }
        this.midiFileInfo.bars.sort((a, b) => b.count - a.count);
        this.midiFileInfo.tracks.sort((a, b) => b.ratio - a.ratio);
        this.midiFileInfo.drums.sort((a, b) => b.count - a.count);
        for (let tt = 0; tt < this.midiFileInfo.tracks.length; tt++) {
            let cat = Math.floor(this.midiFileInfo.tracks[tt].program / 8);
            if (!this.midiFileInfo.proCategories.find((it) => cat == it.cat)) {
                let ratio = this.midiFileInfo.tracks[tt].ratio;
                if (ratio > 49) {
                    ratio = 2;
                }
                else {
                    if (ratio > 9) {
                        ratio = 1;
                    }
                    else {
                        ratio = 0;
                    }
                }
                let title = '' + this.midiFileInfo.tracks[tt].program;
                let path = new ChordPitchPerformerUtil().tonechordinslist()[this.midiFileInfo.tracks[tt].program];
                if (path) {
                    let parts = path.split(':');
                    title = path.split(':')[1].trim();
                }
                else {
                }
                this.midiFileInfo.proCategories.push({ cat: cat, title: title, ratio: ratio });
            }
        }
        let basedrums = this.midiFileInfo.drums.filter((it) => it.pitch == 35 || it.pitch == 36 || it.pitch == 38 || it.pitch == 40);
        let avgdrum = 0;
        if (basedrums.length) {
            avgdrum = basedrums.reduce((last, it) => last + it.count, 0) / this.midiFileInfo.barCount;
        }
        let bassTrack = null;
        let bassTrackNo = -1;
        let curAvg = 0;
        for (let ii = 0; ii < this.midiFileInfo.tracks.length; ii++) {
            let track = this.midiFileInfo.tracks[ii];
            if ((track.program < 96 || (track.program > 103 && track.program < 120))
                && track.singleDuration + track.chordDuration > this.midiFileInfo.duration / 10) {
                let halfsize = Math.ceil(track.pitches.length / 3);
                let sm = 0;
                for (let kk = 0; kk < halfsize; kk++) {
                    sm = sm + track.pitches[kk].pitch;
                }
                let avgPitch = Math.round(sm / halfsize);
                if (avgPitch < 48) {
                    if (avgPitch > 0 && (bassTrack)) {
                        if (avgPitch < curAvg && track.singlCount > bassTrack.singlCount * 0.7) {
                            curAvg = avgPitch;
                            bassTrack = track;
                            bassTrackNo = ii;
                        }
                    }
                    else {
                        bassTrack = track;
                        curAvg = avgPitch;
                        bassTrackNo = ii;
                    }
                }
            }
            if (track.program == 29 || track.program == 30) {
                let rr = (track.singleDuration + track.chordDuration) / this.midiFileInfo.duration;
                if (rr > this.midiFileInfo.overDriveRatio01) {
                    this.midiFileInfo.overDriveRatio01 = rr;
                }
            }
        }
        if (bassTrack) {
            let piSum = 0;
            let allbasspitchescount = bassTrack.tones.reduce((last, it) => last + it.toneCount, 0);
            this.midiFileInfo.bassTone50 = 0;
            piSum = piSum + bassTrack.tones[0].toneCount;
            for (let ii = 1; ii < bassTrack.tones.length; ii++) {
                piSum = piSum + bassTrack.tones[ii].toneCount;
                if (piSum < allbasspitchescount / 1.5) {
                    this.midiFileInfo.bassTone50 = ii;
                }
            }
            this.midiFileInfo.bassTrackNum = bassTrackNo;
            this.midiFileInfo.bassAvg = curAvg;
            this.midiFileInfo.bassTone50++;
        }
        if (this.midiFileInfo.duration < 1 * 60 * 1000)
            this.midiFileInfo.durationCategory04 = 0;
        else if (this.midiFileInfo.duration < 2.5 * 60 * 1000)
            this.midiFileInfo.durationCategory04 = 1;
        else if (this.midiFileInfo.duration < 4 * 60 * 1000)
            this.midiFileInfo.durationCategory04 = 2;
        else if (this.midiFileInfo.duration < 6 * 60 * 1000)
            this.midiFileInfo.durationCategory04 = 3;
        else
            this.midiFileInfo.durationCategory04 = 4;
        let bpm = 0;
        for (let ii = 0; ii < project.timeline.length; ii++) {
            bpm = bpm + project.timeline[ii].tempo;
        }
        let avgbpm = bpm / project.timeline.length;
        if (avgbpm < 80)
            this.midiFileInfo.avgTempoCategory04 = 0;
        else if (avgbpm < 110)
            this.midiFileInfo.avgTempoCategory04 = 1;
        else if (avgbpm < 140)
            this.midiFileInfo.avgTempoCategory04 = 2;
        else if (avgbpm < 200)
            this.midiFileInfo.avgTempoCategory04 = 3;
        else
            this.midiFileInfo.avgTempoCategory04 = 4;
        for (let ii = 0; ii < project.timeline.length; ii++) {
            let bar = project.timeline[ii];
            let label = '' + bar.metre.count + '/' + bar.metre.part;
            let xsts = this.midiFileInfo.meters.find((it) => it.label == label);
            if (xsts) {
                xsts.count++;
            }
            else {
                this.midiFileInfo.meters.push({ label: label, count: 1 });
            }
        }
        this.midiFileInfo.meters.map((it) => it.count = Math.round(100 * it.count / project.timeline.length));
        this.midiFileInfo.meters.sort((a, b) => b.count - a.count);
        let maxTrackChordDuration = 0;
        for (let ii = 0; ii < this.midiFileInfo.tracks.length; ii++) {
            let track = this.midiFileInfo.tracks[ii];
            if (track.program >= 24 && track.program <= 30 && track.chordDuration > 5 * 1000) {
                if (maxTrackChordDuration < track.chordDuration) {
                    maxTrackChordDuration = track.chordDuration;
                }
            }
        }
        this.midiFileInfo.guitarChordDuration = maxTrackChordDuration / this.midiFileInfo.duration;
        if (this.midiFileInfo.guitarChordDuration < 0.1)
            this.midiFileInfo.guitarChordCategory03 = 0;
        else if (this.midiFileInfo.guitarChordDuration < 0.3)
            this.midiFileInfo.guitarChordCategory03 = 1;
        else if (this.midiFileInfo.guitarChordDuration < 0.5)
            this.midiFileInfo.guitarChordCategory03 = 2;
        else
            this.midiFileInfo.guitarChordCategory03 = 3;
        if (basedrums.length) {
            this.midiFileInfo.baseDrumPerBar = Math.round(basedrums.reduce((last, it) => last + it.count, 0) / this.midiFileInfo.barCount);
            if (this.midiFileInfo.baseDrumPerBar < 2)
                this.midiFileInfo.baseDrumCategory03 = 1;
            else if (this.midiFileInfo.baseDrumPerBar < 6)
                this.midiFileInfo.baseDrumCategory03 = 2;
            else
                this.midiFileInfo.baseDrumCategory03 = 3;
        }
    }
    findMIDITempoBefore(ms) {
        for (var ii = this.parser.midiheader.changesResolutionTempo.length - 1; ii >= 0; ii--) {
            if (this.parser.midiheader.changesResolutionTempo[ii].ms <= ms + 123) {
                return this.parser.midiheader.changesResolutionTempo[ii].bpm;
            }
        }
        return 120;
    }
    findMIDIMeterBefore(ms) {
        for (var ii = this.parser.midiheader.metersList.length - 1; ii >= 0; ii--) {
            if (this.parser.midiheader.metersList[ii].ms <= ms + 123) {
                return {
                    count: this.parser.midiheader.metersList[ii].count,
                    part: this.parser.midiheader.metersList[ii].division
                };
            }
        }
        return { count: 4, part: 4 };
    }
    findNearestPoint(ms) {
        let timeMs = -1;
        for (let aa = 0; aa < this.parser.alignedMIDIevents.length; aa++) {
            let avg = this.parser.alignedMIDIevents[aa].avg;
            if ((timeMs < 0 || Math.abs(avg - ms) < Math.abs(timeMs - ms))
                && Math.abs(avg - ms) < 123) {
                timeMs = avg;
            }
        }
        if (timeMs < 0) {
            return ms;
        }
        else {
            return timeMs;
        }
    }
    fillTimeline(project, allNotes) {
        let lastMs = allNotes[allNotes.length - 1].startMs + 1000;
        this.midiFileInfo.duration = lastMs;
        let wholeDurationMs = 0;
        while (wholeDurationMs < lastMs) {
            let tempo = this.findMIDITempoBefore(wholeDurationMs);
            let meter = MMUtil().set(this.findMIDIMeterBefore(wholeDurationMs));
            if (meter.less({ count: 1, part: 4 })) {
                meter.count = 1;
                meter.part = 4;
            }
            let barDurationMs = meter.duration(tempo) * 1000;
            let nextBar = { tempo: tempo, metre: meter.metre() };
            project.timeline.push(nextBar);
            if (barDurationMs < 100)
                barDurationMs = 100;
            let nearestDurationMs = this.findNearestPoint(wholeDurationMs + barDurationMs);
            let nearestBarMs = nearestDurationMs - wholeDurationMs;
            if (nearestBarMs < 99)
                nearestBarMs = 99;
            nextBar.tempo = tempo * barDurationMs / nearestBarMs;
            wholeDurationMs = wholeDurationMs + nearestBarMs;
        }
    }
    addPercussionTrack(project, allPercussions, compresID) {
        let filterPitch = [];
        let wwCell = 9;
        let hhCell = 2;
        for (let ii = 0; ii < allPercussions.length; ii++) {
            let left = 9 * (ii + 11 + project.tracks.length);
            let top = (8 * 12 + 2 * project.percussions.length) + ii * hhCell - allPercussions.length * hhCell;
            let volDrum = this.findVolumeDrum(allPercussions[ii].midiPitch);
            let parsedMIDItrack = this.parser.parsedTracks[allPercussions[ii].midiTrack];
            let drumData = '' + Math.round(volDrum.ratio * 100) + '/' + volDrum.idx;
            let insOut = [compresID];
            let perTrackTitle = '' + parsedMIDItrack.trackTitle + ': ' + allPercussionDrumTitles()[allPercussions[ii].midiPitch];
            if (this.hasVolumeAutomation(parsedMIDItrack.trackVolumePoints)) {
                let filterID = '';
                for (let ff = 0; ff < filterPitch.length; ff++) {
                    if (filterPitch[ff].track == allPercussions[ii].midiTrack) {
                        filterID = filterPitch[ff].id;
                        break;
                    }
                }
                if (filterID) {
                    insOut = [filterID];
                }
                else {
                    filterID = 'drumfader' + Math.random();
                    let filterVolume = {
                        id: filterID,
                        title: 'Fader for ' + perTrackTitle,
                        kind: 'miniumfader1',
                        data: '' + (100 * volDrum.ratio),
                        outputs: [compresID],
                        iconPosition: { x: left + 7 * wwCell, y: top },
                        automation: [],
                        state: 0
                    };
                    insOut = [filterID];
                    project.filters.push(filterVolume);
                    for (let mm = 0; mm < project.timeline.length; mm++) {
                        filterVolume.automation.push({ changes: [] });
                    }
                    for (let vv = 0; vv < parsedMIDItrack.trackVolumePoints.length; vv++) {
                        let gain = parsedMIDItrack.trackVolumePoints[vv];
                        let vol = '' + Math.round(gain.value * 100 * volDrum.ratio) + '%';
                        let pnt = this.findMeasureSkipByTime(gain.ms / 1000, project.timeline);
                        if (pnt) {
                            pnt.skip = MMUtil().set(pnt.skip).strip(16);
                            for (let aa = 0; aa < filterVolume.automation[pnt.idx].changes.length; aa++) {
                                let volumeskip = filterVolume.automation[pnt.idx].changes[aa].skip;
                                if (MMUtil().set(volumeskip).equals(pnt.skip)) {
                                    filterVolume.automation[pnt.idx].changes.splice(aa, 1);
                                    break;
                                }
                            }
                            filterVolume.automation[pnt.idx].changes.push({ skip: pnt.skip, stateBlob: vol });
                        }
                    }
                    filterPitch.push({
                        track: allPercussions[ii].midiTrack,
                        pitch: allPercussions[ii].midiPitch,
                        id: filterID
                    });
                }
            }
            else {
                if (parsedMIDItrack.trackVolumePoints.length) {
                    let lastVolume = parsedMIDItrack.trackVolumePoints[parsedMIDItrack.trackVolumePoints.length - 1].value;
                    drumData = '' + Math.round(100 * volDrum.ratio * lastVolume) + '/' + volDrum.idx;
                }
                else {
                    drumData = '' + Math.round(volDrum.ratio * 100) + '/' + volDrum.idx;
                }
            }
            if (allPercussions[ii].midiPitch < 27 || allPercussions[ii].midiPitch > 87) {
                insOut = [];
            }
            let pp = {
                title: '' + perTrackTitle,
                measures: [],
                sampler: {
                    id: 'drum' + (ii + Math.random()),
                    data: drumData,
                    kind: 'miniumdrums1',
                    outputs: insOut,
                    iconPosition: { x: left, y: top },
                    state: 0
                }
            };
            for (let mm = 0; mm < project.timeline.length; mm++) {
                pp.measures.push({ skips: [] });
            }
            project.percussions.push(pp);
        }
    }
    hasVolumeAutomation(trackVolumePoints) {
        if (trackVolumePoints.length) {
            if (trackVolumePoints[trackVolumePoints.length - 1].ms > 987) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    addInsTrack(project, allTracks, compresID) {
        let wwCell = 9;
        let hhCell = 7;
        for (let ii = 0; ii < project.tracks.length; ii++) {
            let track = project.tracks[ii];
            track.performer.iconPosition.x = ii * wwCell;
            track.performer.iconPosition.y = ii * hhCell;
        }
        for (let ii = 0; ii < allTracks.length; ii++) {
            let parsedMIDItrack = this.parser.parsedTracks[allTracks[ii].midiTrack];
            let midiProgram = allTracks[ii].midiProgram;
            let idxRatio = this.findVolumeInstrument(midiProgram);
            let iidx = idxRatio.idx;
            let intitle = '' + parsedMIDItrack.trackTitle + ': ' + new ChordPitchPerformerUtil().tonechordinslist()[midiProgram];
            let imode = this.findModeInstrument(midiProgram);
            let insData = '100/' + iidx + '/' + imode;
            let insOut = [compresID];
            if (this.hasVolumeAutomation(parsedMIDItrack.trackVolumePoints)) {
                let filterID = 'fader' + Math.random();
                let filterVolume = {
                    id: filterID,
                    title: 'Fader for  ' + intitle,
                    kind: 'miniumfader1',
                    data: '' + (100 * idxRatio.ratio),
                    outputs: [compresID],
                    iconPosition: { x: (ii + 7) * wwCell * 1.1, y: ii * hhCell * 0.8 },
                    automation: [],
                    state: 0
                };
                insOut = [filterID];
                project.filters.push(filterVolume);
                for (let mm = 0; mm < project.timeline.length; mm++) {
                    filterVolume.automation.push({ changes: [] });
                }
                for (let vv = 0; vv < parsedMIDItrack.trackVolumePoints.length; vv++) {
                    let gain = parsedMIDItrack.trackVolumePoints[vv];
                    let vol = '' + Math.round(gain.value * 100 * idxRatio.ratio) + '%';
                    let pnt = this.findMeasureSkipByTime(gain.ms / 1000, project.timeline);
                    if (pnt) {
                        pnt.skip = MMUtil().set(pnt.skip).strip(16);
                        for (let aa = 0; aa < filterVolume.automation[pnt.idx].changes.length; aa++) {
                            let volumeskip = filterVolume.automation[pnt.idx].changes[aa].skip;
                            if (MMUtil().set(volumeskip).equals(pnt.skip)) {
                                filterVolume.automation[pnt.idx].changes.splice(aa, 1);
                                break;
                            }
                        }
                        filterVolume.automation[pnt.idx].changes.push({ skip: pnt.skip, stateBlob: vol });
                    }
                }
            }
            else {
                if (parsedMIDItrack.trackVolumePoints.length) {
                    let lastVolume = parsedMIDItrack.trackVolumePoints[parsedMIDItrack.trackVolumePoints.length - 1].value;
                    insData = '' + Math.round(100 * idxRatio.ratio * lastVolume) + '/' + iidx + '/' + imode;
                }
                else {
                    insData = '' + Math.round(idxRatio.ratio * 100) + '/' + iidx + '/' + imode;
                }
            }
            if (midiProgram < 0 || midiProgram > 127) {
                insOut = [];
            }
            let tt = {
                title: '' + intitle,
                measures: [],
                performer: {
                    id: 'track' + (ii + Math.random()),
                    data: insData,
                    kind: 'miniumpitchchord1',
                    outputs: insOut,
                    iconPosition: { x: ii * wwCell, y: ii * hhCell },
                    state: 0
                }
            };
            for (let mm = 0; mm < project.timeline.length; mm++) {
                tt.measures.push({ chords: [] });
            }
            project.tracks.push(tt);
        }
    }
    findModeInstrument(program) {
        if (program == 24)
            return 4;
        if (program == 25)
            return 4;
        if (program == 26)
            return 4;
        if (program == 27)
            return 4;
        if (program == 29)
            return 1;
        if (program == 30)
            return 1;
        return 0;
    }
    ;
    arrangeIcons(project) {
        let tracksWidth = 9 * (8 + project.tracks.length);
        let perWidth = 9 * (8 + project.percussions.length);
        project.filters[0].iconPosition.x = 7 * 7 + tracksWidth + perWidth;
        project.filters[0].iconPosition.y = 1 * 9 + 66;
        project.filters[1].iconPosition.x = 3 * 7 + tracksWidth + perWidth;
        project.filters[1].iconPosition.y = 2 * 9 + 11;
    }
    collectNotes(allNotes, allTracks, allPercussions) {
        for (let ii = 0; ii < this.parser.parsedTracks.length; ii++) {
            let parsedtrack = this.parser.parsedTracks[ii];
            for (let nn = 0; nn < parsedtrack.trackNotes.length; nn++) {
                allNotes.push(parsedtrack.trackNotes[nn]);
                if (parsedtrack.trackNotes[nn].channelidx == 9) {
                    this.takeProSamplerNo(allPercussions, ii, parsedtrack.trackNotes[nn].basePitch, parsedtrack.trackVolumePoints);
                }
                else {
                    this.takeProTrackNo(allTracks, ii, parsedtrack.trackNotes[nn].channelidx, parsedtrack.trackVolumePoints);
                }
            }
        }
        allNotes.sort((a, b) => { return a.startMs - b.startMs; });
    }
    addMIDIComments(project) {
        for (let ii = 0; ii < project.timeline.length; ii++) {
            project.comments.push({ points: [] });
        }
        for (let ii = 0; ii < this.parser.midiheader.lyricsList.length; ii++) {
            let textpoint = this.parser.midiheader.lyricsList[ii];
            let pnt = this.findMeasureSkipByTime(textpoint.ms / 1000, project.timeline);
            if (pnt) {
                this.addLyricsPoints(project.comments[pnt.idx], { count: pnt.skip.count, part: pnt.skip.part }, textpoint.txt);
            }
        }
    }
    addLyricsPoints(bar, skip, txt) {
        let cnt = bar.points.length;
        bar.points[cnt] = {
            skip: skip,
            text: txt,
            row: cnt
        };
    }
    findMeasureSkipByTime(timeFromStart, measures) {
        let curMeasureStartS = 0;
        let mm = MMUtil();
        for (let ii = 0; ii < measures.length; ii++) {
            let curMeasure = measures[ii];
            let measureDurationS = mm.set(curMeasure.metre).duration(curMeasure.tempo);
            if (curMeasureStartS + measureDurationS > timeFromStart + 0.001) {
                let delta = timeFromStart - curMeasureStartS;
                if (delta < 0) {
                    delta = 0;
                }
                return {
                    idx: ii,
                    skip: mm.calculate(delta, curMeasure.tempo).floor(8)
                };
            }
            curMeasureStartS = curMeasureStartS + measureDurationS;
        }
        return null;
    }
    findVolumeDrum(midipitch) {
        let midi = midipitch;
        if (midipitch == 27)
            midi = 78;
        if (midipitch == 28)
            midi = 79;
        if (midipitch == 29)
            midi = 80;
        if (midipitch == 30)
            midi = 81;
        if (midipitch == 31)
            midi = 60;
        if (midipitch == 32)
            midi = 63;
        if (midipitch == 33)
            midi = 70;
        if (midipitch == 34)
            midi = 56;
        if (midipitch == 82)
            midi = 73;
        if (midipitch == 83)
            midi = 53;
        if (midipitch == 84)
            midi = 67;
        if (midipitch == 85)
            midi = 37;
        if (midipitch == 86)
            midi = 70;
        if (midipitch == 87)
            midi = 63;
        let re = { idx: 0, ratio: 1 };
        let pre = '' + midi;
        for (let nn = 0; nn < drumKeysArrayPercussionPaths.length; nn++) {
            if (drumKeysArrayPercussionPaths[nn].startsWith(pre)) {
                re.idx = nn;
                break;
            }
        }
        return re;
    }
    ;
    findVolumeInstrument(program) {
        let re = { idx: 0, ratio: 0.7 };
        let instrs = new ChordPitchPerformerUtil().tonechordinstrumentKeys();
        for (var i = 0; i < instrs.length; i++) {
            if (program == 1 * parseInt(instrs[i].substring(0, 3))) {
                re.idx = i;
                break;
            }
        }
        if (program == 16)
            re.ratio = 0.4;
        if (program == 19)
            re.ratio = 0.4;
        if (program == 27)
            re.ratio = 0.95;
        if (program == 32)
            re.ratio = 0.95;
        if (program == 33)
            re.ratio = 0.95;
        if (program == 34)
            re.ratio = 0.95;
        if (program == 35)
            re.ratio = 0.95;
        if (program == 36)
            re.ratio = 0.95;
        if (program == 37)
            re.ratio = 0.95;
        if (program == 38)
            re.ratio = 0.95;
        if (program == 39)
            re.ratio = 0.95;
        if (program == 48)
            re.ratio = 0.4;
        if (program == 49)
            re.ratio = 0.4;
        if (program == 50)
            re.ratio = 0.5;
        if (program == 51)
            re.ratio = 0.4;
        if (program == 65)
            re.ratio = 0.99;
        if (program == 80)
            re.ratio = 0.3;
        if (program == 89)
            re.ratio = 0.4;
        return re;
    }
    ;
    takeChord(bar, when) {
        for (let cc = 0; cc < bar.chords.length; cc++) {
            let chord = bar.chords[cc];
            if (MMUtil().set(chord.skip).equals(when)) {
                return chord;
            }
        }
        let chord = {
            skip: when,
            pitches: [],
            slides: []
        };
        bar.chords.push(chord);
        return chord;
    }
    addTrackNote(tracks, timeline, allTracks, note) {
        let barStart = 0;
        for (let ii = 0; ii < timeline.length; ii++) {
            let measure = timeline[ii];
            let durationMs = 1000 * MMUtil().set(measure.metre).duration(measure.tempo);
            if (note.startMs >= barStart && note.startMs < barStart + durationMs) {
                let zvootraidx = this.takeProTrackNo(allTracks, note.trackidx, note.channelidx, null);
                let zvooginstrack = tracks[zvootraidx];
                let noteStartMs = note.startMs - barStart;
                let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).strip(32).metre();
                let chord = this.takeChord(zvooginstrack.measures[ii], when);
                chord.pitches.push(note.basePitch);
                if (chord.slides.length == 0 || chord.slides.length == 1) {
                    if (note.bendPoints.length) {
                        chord.slides = [];
                        let bendDurationMs = 0;
                        for (var v = 0; v < note.bendPoints.length; v++) {
                            var midipoint = note.bendPoints[v];
                            let pieceduration = MMUtil().set(measure.metre).calculate(midipoint.pointDuration / 1000, measure.tempo).metre();
                            let slide = { duration: pieceduration, delta: midipoint.basePitchDelta };
                            chord.slides.push(slide);
                            bendDurationMs = bendDurationMs + midipoint.pointDuration;
                        }
                        let remains = note.baseDuration - bendDurationMs;
                        if (remains > 0) {
                            chord.slides.push({
                                duration: MMUtil().set(measure.metre).calculate(remains / 1000, measure.tempo).metre(),
                                delta: chord.slides[chord.slides.length - 1].delta
                            });
                        }
                    }
                    else {
                        let duration = MMUtil().set(measure.metre).calculate(note.baseDuration / 1000, measure.tempo);
                        if (duration.less({ count: 1, part: 16 })) {
                            duration.set({ count: 1, part: 16 });
                        }
                        if (duration.more({ count: 4, part: 1 })) {
                            duration.set({ count: 4, part: 1 });
                        }
                        chord.slides = [{ duration: duration.metre(), delta: 0 }];
                    }
                }
                return;
            }
            barStart = barStart + durationMs;
        }
    }
    addDrumkNote(percussions, timeline, allPercussions, note) {
        let barStart = 0;
        for (let ii = 0; ii < timeline.length; ii++) {
            let measure = timeline[ii];
            let durationMs = 1000 * MMUtil().set(measure.metre).duration(measure.tempo);
            if (note.startMs >= barStart && note.startMs < barStart + durationMs) {
                let peridx = this.takeProSamplerNo(allPercussions, note.trackidx, note.basePitch, null);
                let pertrack = percussions[peridx];
                let noteStartMs = note.startMs - barStart;
                let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).strip(32).metre();
                pertrack.measures[ii].skips.push(when);
                return;
            }
            barStart = barStart + durationMs;
        }
    }
    takeProTrackNo(allTracks, midiTrack, midiChannel, trackVolumePoints) {
        let midiProgram = this.findProgramForChannel(midiChannel);
        for (let ii = 0; ii < allTracks.length; ii++) {
            let it = allTracks[ii];
            if (it.midiTrack == midiTrack && it.midiProgram == midiProgram) {
                return ii;
            }
        }
        if (trackVolumePoints) {
            allTracks.push({ midiTrack: midiTrack, midiProgram: midiProgram, midiTitle: '' + midiProgram, trackVolumePoints: trackVolumePoints });
        }
        else {
            allTracks.push({ midiTrack: midiTrack, midiProgram: midiProgram, midiTitle: '' + midiProgram, trackVolumePoints: [] });
        }
        return allTracks.length - 1;
    }
    takeProSamplerNo(allPercussions, midiTrack, midiPitch, trackVolumePoints) {
        for (let ii = 0; ii < allPercussions.length; ii++) {
            let it = allPercussions[ii];
            if (it.midiTrack == midiTrack && it.midiPitch == midiPitch) {
                return ii;
            }
        }
        let title = '';
        if (trackVolumePoints) {
            allPercussions.push({ midiTrack: midiTrack, midiPitch: midiPitch, title: title, trackVolumePoints: trackVolumePoints });
        }
        else {
            allPercussions.push({ midiTrack: midiTrack, midiPitch: midiPitch, title: title, trackVolumePoints: [] });
        }
        return allPercussions.length - 1;
    }
}
class MZXBX_MetreMathUtil {
    set(from) {
        this.count = from.count;
        this.part = from.part;
        return this;
    }
    calculate(duration, tempo) {
        this.part = 1024.0;
        let tempPart = new MZXBX_MetreMathUtil().set({ count: 1, part: this.part }).duration(tempo);
        this.count = Math.round(duration / tempPart);
        return this.simplyfy();
    }
    metre() {
        return { count: this.count, part: this.part };
    }
    simplyfy() {
        let cc = this.count;
        let pp = this.part;
        if (cc > 0 && pp > 0) {
            while (cc % 2 == 0 && pp % 2 == 0) {
                cc = cc / 2;
                pp = pp / 2;
            }
        }
        return new MZXBX_MetreMathUtil().set({ count: cc, part: pp });
    }
    strip(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.round(cc / rr);
        pp = toPart;
        let r = new MZXBX_MetreMathUtil().set({ count: cc, part: pp }).simplyfy();
        return r;
    }
    floor(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.floor(cc / rr);
        pp = toPart;
        let r = new MZXBX_MetreMathUtil().set({ count: cc, part: pp }).simplyfy();
        return r;
    }
    equals(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe == countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    less(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe < countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    more(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe > countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    plus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe + countTo, part: metre.part * this.part };
        return new MZXBX_MetreMathUtil().set(rr).simplyfy();
    }
    minus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe - countTo, part: metre.part * this.part };
        return new MZXBX_MetreMathUtil().set(rr).simplyfy();
    }
    duration(tempo) {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * this.count) / this.part;
        return meterSeconds;
    }
    width(tempo, ratio) {
        return this.duration(tempo) * ratio;
    }
}
function MMUtil() {
    return new MZXBX_MetreMathUtil().set({ count: 0, part: 1 });
}
var fs = require('fs');
let folder = process.cwd();
console.log('start', folder);
function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
}
function sstr(txt) {
    let retxt = txt;
    retxt = retxt.replaceAll('\t', ' ');
    retxt = retxt.replaceAll('\n', ' ');
    retxt = retxt.replaceAll('\r', ' ');
    retxt = retxt.replaceAll('\\', '/');
    retxt = retxt.replaceAll('\"', '\'');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    retxt = retxt.replaceAll('  ', ' ');
    return '"' + retxt.trim() + '"';
}
function readOneFile(num, path, name) {
    let buff = fs.readFileSync(path + '/' + name);
    let arrayBuffer = toArrayBuffer(buff);
    try {
        let mifi = new MIDIReader(name, arrayBuffer.byteLength, arrayBuffer);
        let fname = name.trim();
        let parts = fname.split('\.');
        let oname = parts[0];
        let sqlLine = 'insert into parsedfile (filename,filepath,filesize,songduration,avgtempo,drums,chords,bass,overdrive) values (';
        sqlLine = sqlLine + sstr(oname);
        sqlLine = sqlLine + ',' + sstr('');
        sqlLine = sqlLine + ',' + (buff.length < 25 ? 0 : buff.length < 90 ? 1 : 2);
        sqlLine = sqlLine + ',' + mifi.info.durationCategory04;
        sqlLine = sqlLine + ',' + mifi.info.avgTempoCategory04;
        sqlLine = sqlLine + ',' + mifi.info.baseDrumCategory03;
        sqlLine = sqlLine + ',' + mifi.info.guitarChordCategory03;
        sqlLine = sqlLine + ',' + mifi.info.bassTone50;
        sqlLine = sqlLine + ',' + Math.round(100 * mifi.info.overDriveRatio01);
        sqlLine = sqlLine + ');';
        console.log(sqlLine);
        sqlLine = 'delete from tempid;';
        console.log(sqlLine);
        sqlLine = 'insert into tempid (lastfileid) values (last_insert_rowid());';
        console.log(sqlLine);
        for (let mm = 0; mm < mifi.project.comments.length; mm++) {
            let comeasure = mifi.project.comments[mm];
            for (let pp = 0; pp < comeasure.points.length; pp++) {
                let txt = sstr(comeasure.points[pp].text);
                if (txt == '""') {
                }
                else {
                    sqlLine = 'insert into parsecomments (fileid,txt) select lastfileid as fileid, ' + txt + ' as txt from tempid;';
                    console.log(sqlLine);
                }
            }
        }
        for (let nn = 0; nn < mifi.info.proCategories.length; nn++) {
            sqlLine = 'insert into parsedinstruments (fileid,inscat,inscount) select lastfileid as fileid'
                + ', ' + mifi.info.proCategories[nn].cat + ' as inscat'
                + ', ' + mifi.info.proCategories[nn].ratio + ' as inscount'
                + ' from tempid;';
            console.log(sqlLine);
        }
    }
    catch (xx) {
        console.log('/*');
        console.log(path, name);
        console.log(xx);
        console.log('*/');
    }
}
function readFiles(path) {
    fs.readdir(path, function (error, filenames) {
        console.log('error', error);
        console.log('count', filenames.length);
        for (let ii = 0; ii < filenames.length; ii++) {
            let filename = filenames[ii];
            if (filename.toLowerCase().trim().endsWith('mid')) {
                readOneFile(ii, path, filename);
            }
        }
    });
}
readFiles(folder);
//# sourceMappingURL=gofolder.js.map