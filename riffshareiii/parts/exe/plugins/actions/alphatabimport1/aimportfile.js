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
var AlphaTabErrorType;
(function (AlphaTabErrorType) {
    AlphaTabErrorType[AlphaTabErrorType["General"] = 0] = "General";
    AlphaTabErrorType[AlphaTabErrorType["Format"] = 1] = "Format";
    AlphaTabErrorType[AlphaTabErrorType["AlphaTex"] = 2] = "AlphaTex";
})(AlphaTabErrorType || (AlphaTabErrorType = {}));
class AlphaTabError extends Error {
    constructor(type, message = '', inner) {
        super(message ?? '');
        this.type = type;
        Object.setPrototypeOf(this, AlphaTabError.prototype);
    }
}
class FormatError extends AlphaTabError {
    constructor(message) {
        super(AlphaTabErrorType.Format, message);
        Object.setPrototypeOf(this, FormatError.prototype);
    }
}
var FontFileFormat;
(function (FontFileFormat) {
    FontFileFormat[FontFileFormat["EmbeddedOpenType"] = 0] = "EmbeddedOpenType";
    FontFileFormat[FontFileFormat["Woff"] = 1] = "Woff";
    FontFileFormat[FontFileFormat["Woff2"] = 2] = "Woff2";
    FontFileFormat[FontFileFormat["OpenType"] = 3] = "OpenType";
    FontFileFormat[FontFileFormat["TrueType"] = 4] = "TrueType";
    FontFileFormat[FontFileFormat["Svg"] = 5] = "Svg";
})(FontFileFormat || (FontFileFormat = {}));
class CoreSettings {
    constructor() {
        this.scriptFile = null;
        this.fontDirectory = null;
        this.smuflFontSources = null;
        this.file = null;
        this.tex = false;
        this.tracks = null;
        this.enableLazyLoading = true;
        this.engine = 'default';
        this.logLevel = LogLevel.Info;
        this.useWorkers = true;
        this.includeNoteBounds = false;
        this.scriptFile = '';
        this.fontDirectory = '';
    }
    static buildDefaultSmuflFontSources(fontDirectory) {
        const map = new Map();
        const prefix = fontDirectory ?? '';
        map.set(FontFileFormat.Woff2, `${prefix}Bravura.woff2`);
        map.set(FontFileFormat.Woff, `${prefix}Bravura.woff`);
        map.set(FontFileFormat.OpenType, `${prefix}Bravura.otf`);
        return map;
    }
}
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (LogLevel = {}));
class ImporterSettings {
    constructor() {
        this.encoding = 'utf-8';
        this.mergePartGroupsInMusicXml = false;
        this.beatTextAsLyrics = false;
    }
}
class Settings {
    constructor() {
        this.core = new CoreSettings();
        this.notation = new NotationSettings();
        this.importer = new ImporterSettings();
    }
    setSongBookModeSettings() {
        this.notation.notationMode = NotationMode.SongBook;
        this.notation.smallGraceTabNotes = false;
        this.notation.fingeringMode = FingeringMode.SingleNoteEffectBand;
        this.notation.extendBendArrowsOnTiedNotes = false;
        this.notation.elements.set(NotationElement.ParenthesisOnTiedBends, false);
        this.notation.elements.set(NotationElement.TabNotesOnTiedBends, false);
        this.notation.elements.set(NotationElement.ZerosOnDiveWhammys, true);
    }
    static get songBook() {
        const settings = new Settings();
        settings.setSongBookModeSettings();
        return settings;
    }
    handleBackwardsCompatibility() {
    }
}
class ConsoleLogger {
    static format(category, msg) {
        return `[AlphaTab][${category}] ${msg}`;
    }
    debug(category, msg, ...details) {
        console.debug(ConsoleLogger.format(category, msg), ...details);
    }
    warning(category, msg, ...details) {
        console.warn(ConsoleLogger.format(category, msg), ...details);
    }
    info(category, msg, ...details) {
        console.info(ConsoleLogger.format(category, msg), ...details);
    }
    error(category, msg, ...details) {
        console.error(ConsoleLogger.format(category, msg), ...details);
    }
}
ConsoleLogger.logLevel = LogLevel.Info;
class Logger {
    static shouldLog(level) {
        return Logger.logLevel !== LogLevel.None && level >= Logger.logLevel;
    }
    static debug(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Debug)) {
            Logger.log.debug(category, msg, ...details);
        }
    }
    static warning(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Warning)) {
            Logger.log.warning(category, msg, ...details);
        }
    }
    static info(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Info)) {
            Logger.log.info(category, msg, ...details);
        }
    }
    static error(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Error)) {
            Logger.log.error(category, msg, ...details);
        }
    }
}
Logger.logLevel = LogLevel.Info;
Logger.log = new ConsoleLogger();
var TabRhythmMode;
(function (TabRhythmMode) {
    TabRhythmMode[TabRhythmMode["Hidden"] = 0] = "Hidden";
    TabRhythmMode[TabRhythmMode["ShowWithBeams"] = 1] = "ShowWithBeams";
    TabRhythmMode[TabRhythmMode["ShowWithBars"] = 2] = "ShowWithBars";
    TabRhythmMode[TabRhythmMode["Automatic"] = 3] = "Automatic";
})(TabRhythmMode || (TabRhythmMode = {}));
var FingeringMode;
(function (FingeringMode) {
    FingeringMode[FingeringMode["ScoreDefault"] = 0] = "ScoreDefault";
    FingeringMode[FingeringMode["ScoreForcePiano"] = 1] = "ScoreForcePiano";
    FingeringMode[FingeringMode["SingleNoteEffectBand"] = 2] = "SingleNoteEffectBand";
    FingeringMode[FingeringMode["SingleNoteEffectBandForcePiano"] = 3] = "SingleNoteEffectBandForcePiano";
})(FingeringMode || (FingeringMode = {}));
var NotationMode;
(function (NotationMode) {
    NotationMode[NotationMode["GuitarPro"] = 0] = "GuitarPro";
    NotationMode[NotationMode["SongBook"] = 1] = "SongBook";
})(NotationMode || (NotationMode = {}));
var NotationElement;
(function (NotationElement) {
    NotationElement[NotationElement["ScoreTitle"] = 0] = "ScoreTitle";
    NotationElement[NotationElement["ScoreSubTitle"] = 1] = "ScoreSubTitle";
    NotationElement[NotationElement["ScoreArtist"] = 2] = "ScoreArtist";
    NotationElement[NotationElement["ScoreAlbum"] = 3] = "ScoreAlbum";
    NotationElement[NotationElement["ScoreWords"] = 4] = "ScoreWords";
    NotationElement[NotationElement["ScoreMusic"] = 5] = "ScoreMusic";
    NotationElement[NotationElement["ScoreWordsAndMusic"] = 6] = "ScoreWordsAndMusic";
    NotationElement[NotationElement["ScoreCopyright"] = 7] = "ScoreCopyright";
    NotationElement[NotationElement["GuitarTuning"] = 8] = "GuitarTuning";
    NotationElement[NotationElement["TrackNames"] = 9] = "TrackNames";
    NotationElement[NotationElement["ChordDiagrams"] = 10] = "ChordDiagrams";
    NotationElement[NotationElement["ParenthesisOnTiedBends"] = 11] = "ParenthesisOnTiedBends";
    NotationElement[NotationElement["TabNotesOnTiedBends"] = 12] = "TabNotesOnTiedBends";
    NotationElement[NotationElement["ZerosOnDiveWhammys"] = 13] = "ZerosOnDiveWhammys";
    NotationElement[NotationElement["EffectAlternateEndings"] = 14] = "EffectAlternateEndings";
    NotationElement[NotationElement["EffectCapo"] = 15] = "EffectCapo";
    NotationElement[NotationElement["EffectChordNames"] = 16] = "EffectChordNames";
    NotationElement[NotationElement["EffectCrescendo"] = 17] = "EffectCrescendo";
    NotationElement[NotationElement["EffectDynamics"] = 18] = "EffectDynamics";
    NotationElement[NotationElement["EffectFadeIn"] = 19] = "EffectFadeIn";
    NotationElement[NotationElement["EffectFermata"] = 20] = "EffectFermata";
    NotationElement[NotationElement["EffectFingering"] = 21] = "EffectFingering";
    NotationElement[NotationElement["EffectHarmonics"] = 22] = "EffectHarmonics";
    NotationElement[NotationElement["EffectLetRing"] = 23] = "EffectLetRing";
    NotationElement[NotationElement["EffectLyrics"] = 24] = "EffectLyrics";
    NotationElement[NotationElement["EffectMarker"] = 25] = "EffectMarker";
    NotationElement[NotationElement["EffectOttavia"] = 26] = "EffectOttavia";
    NotationElement[NotationElement["EffectPalmMute"] = 27] = "EffectPalmMute";
    NotationElement[NotationElement["EffectPickSlide"] = 28] = "EffectPickSlide";
    NotationElement[NotationElement["EffectPickStroke"] = 29] = "EffectPickStroke";
    NotationElement[NotationElement["EffectSlightBeatVibrato"] = 30] = "EffectSlightBeatVibrato";
    NotationElement[NotationElement["EffectSlightNoteVibrato"] = 31] = "EffectSlightNoteVibrato";
    NotationElement[NotationElement["EffectTap"] = 32] = "EffectTap";
    NotationElement[NotationElement["EffectTempo"] = 33] = "EffectTempo";
    NotationElement[NotationElement["EffectText"] = 34] = "EffectText";
    NotationElement[NotationElement["EffectTrill"] = 35] = "EffectTrill";
    NotationElement[NotationElement["EffectTripletFeel"] = 36] = "EffectTripletFeel";
    NotationElement[NotationElement["EffectWhammyBar"] = 37] = "EffectWhammyBar";
    NotationElement[NotationElement["EffectWideBeatVibrato"] = 38] = "EffectWideBeatVibrato";
    NotationElement[NotationElement["EffectWideNoteVibrato"] = 39] = "EffectWideNoteVibrato";
    NotationElement[NotationElement["EffectLeftHandTap"] = 40] = "EffectLeftHandTap";
    NotationElement[NotationElement["EffectFreeTime"] = 41] = "EffectFreeTime";
    NotationElement[NotationElement["EffectSustainPedal"] = 42] = "EffectSustainPedal";
    NotationElement[NotationElement["EffectGolpe"] = 43] = "EffectGolpe";
    NotationElement[NotationElement["EffectWahPedal"] = 44] = "EffectWahPedal";
    NotationElement[NotationElement["EffectBeatBarre"] = 45] = "EffectBeatBarre";
    NotationElement[NotationElement["EffectNoteOrnament"] = 46] = "EffectNoteOrnament";
    NotationElement[NotationElement["EffectRasgueado"] = 47] = "EffectRasgueado";
    NotationElement[NotationElement["EffectDirections"] = 48] = "EffectDirections";
    NotationElement[NotationElement["EffectBeatTimer"] = 49] = "EffectBeatTimer";
})(NotationElement || (NotationElement = {}));
class NotationSettings {
    constructor() {
        this.notationMode = NotationMode.GuitarPro;
        this.fingeringMode = FingeringMode.ScoreDefault;
        this.elements = new Map();
        this.rhythmMode = TabRhythmMode.Automatic;
        this.rhythmHeight = 15;
        this.transpositionPitches = [];
        this.displayTranspositionPitches = [];
        this.smallGraceTabNotes = true;
        this.extendBendArrowsOnTiedNotes = true;
        this.extendLineEffectsToBeatEnd = false;
        this.slurHeight = 5.0;
    }
    isNotationElementVisible(element) {
        if (this.elements.has(element)) {
            return this.elements.get(element);
        }
        if (NotationSettings.defaultElements.has(element)) {
            return NotationSettings.defaultElements.get(element);
        }
        return true;
    }
}
NotationSettings.defaultElements = new Map([
    [NotationElement.ZerosOnDiveWhammys, false]
]);
class EndOfReaderError extends AlphaTabError {
    constructor() {
        super(AlphaTabErrorType.Format, 'Unexpected end of data within reader');
        Object.setPrototypeOf(this, EndOfReaderError.prototype);
    }
}
class IOHelper {
    static readInt32BE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        const ch3 = input.readByte();
        const ch4 = input.readByte();
        return (ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4;
    }
    static readFloat32BE(readable) {
        const bits = new Uint8Array(4);
        readable.read(bits, 0, bits.length);
        bits.reverse();
        return TypeConversions.bytesToFloat32LE(bits);
    }
    static readFloat64BE(readable) {
        const bits = new Uint8Array(8);
        readable.read(bits, 0, bits.length);
        bits.reverse();
        return TypeConversions.bytesToFloat64LE(bits);
    }
    static readInt32LE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        const ch3 = input.readByte();
        const ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readInt64LE(input) {
        const b = new Uint8Array(8);
        input.read(b, 0, b.length);
        return TypeConversions.bytesToInt64LE(b);
    }
    static readUInt32LE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        const ch3 = input.readByte();
        const ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static decodeUInt32LE(data, index) {
        const ch1 = data[index];
        const ch2 = data[index + 1];
        const ch3 = data[index + 2];
        const ch4 = data[index + 3];
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readUInt16LE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        return TypeConversions.int32ToUint16((ch2 << 8) | ch1);
    }
    static readInt16LE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch2 << 8) | ch1);
    }
    static readUInt32BE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        const ch3 = input.readByte();
        const ch4 = input.readByte();
        return TypeConversions.int32ToUint32((ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4);
    }
    static readUInt16BE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readInt16BE(input) {
        const ch1 = input.readByte();
        const ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readByteArray(input, length) {
        const v = new Uint8Array(length);
        input.read(v, 0, length);
        return v;
    }
    static read8BitChars(input, length) {
        const b = new Uint8Array(length);
        input.read(b, 0, b.length);
        return IOHelper.toString(b, 'utf-8');
    }
    static read8BitString(input) {
        let s = '';
        let c = input.readByte();
        while (c !== 0) {
            s += String.fromCharCode(c);
            c = input.readByte();
        }
        return s;
    }
    static read8BitStringLength(input, length) {
        let s = '';
        let z = -1;
        for (let i = 0; i < length; i++) {
            const c = input.readByte();
            if (c === 0 && z === -1) {
                z = i;
            }
            s += String.fromCharCode(c);
        }
        const t = s;
        if (z >= 0) {
            return t.substr(0, z);
        }
        return t;
    }
    static readSInt8(input) {
        const v = input.readByte();
        return ((v & 255) >> 7) * -256 + (v & 255);
    }
    static readInt24(input, index) {
        let i = input[index] | (input[index + 1] << 8) | (input[index + 2] << 16);
        if ((i & 0x800000) === 0x800000) {
            i = i | (0xff << 24);
        }
        return i;
    }
    static readInt16(input, index) {
        return TypeConversions.int32ToInt16(input[index] | (input[index + 1] << 8));
    }
    static toString(data, encoding) {
        const detectedEncoding = IOHelper.detectEncoding(data);
        if (detectedEncoding) {
            encoding = detectedEncoding;
        }
        if (!encoding) {
            encoding = 'utf-8';
        }
        const decoder = new TextDecoder(encoding);
        return decoder.decode(data.buffer);
    }
    static detectEncoding(data) {
        if (data.length > 2 && data[0] === 0xfe && data[1] === 0xff) {
            return 'utf-16be';
        }
        if (data.length > 2 && data[0] === 0xff && data[1] === 0xfe) {
            return 'utf-16le';
        }
        if (data.length > 4 && data[0] === 0x00 && data[1] === 0x00 && data[2] === 0xfe && data[3] === 0xff) {
            return 'utf-32be';
        }
        if (data.length > 4 && data[0] === 0xff && data[1] === 0xfe && data[2] === 0x00 && data[3] === 0x00) {
            return 'utf-32le';
        }
        return null;
    }
    static stringToBytes(str) {
        const decoder = new TextEncoder();
        return decoder.encode(str);
    }
    static writeInt32BE(o, v) {
        o.writeByte((v >> 24) & 0xff);
        o.writeByte((v >> 16) & 0xff);
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 0) & 0xff);
    }
    static writeInt32LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 16) & 0xff);
        o.writeByte((v >> 24) & 0xff);
    }
    static writeUInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
    }
    static writeInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
    }
    static writeInt16BE(o, v) {
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 0) & 0xff);
    }
    static writeFloat32BE(o, v) {
        const b = TypeConversions.float32BEToBytes(v);
        o.write(b, 0, b.length);
    }
    static *iterateCodepoints(input) {
        let i = 0;
        while (i < input.length) {
            let c = input.charCodeAt(i);
            if (IOHelper.isLeadingSurrogate(c) && i + 1 < input.length) {
                i++;
                c = (c - 0xd800) * 0x400 + (input.charCodeAt(i) - 0xdc00) + 0x10000;
            }
            i++;
            yield c;
        }
    }
    static isLeadingSurrogate(charCode) {
        return charCode >= 0xd800 && charCode <= 0xdbff;
    }
    static isTrailingSurrogate(charCode) {
        return charCode >= 0xdc00 && charCode <= 0xdfff;
    }
}
class TypeConversions {
    static float64ToBytes(v) {
        TypeConversions._dataView.setFloat64(0, v, true);
        return TypeConversions._conversionByteArray;
    }
    static bytesToInt64LE(bytes) {
        TypeConversions._conversionByteArray.set(bytes, 0);
        const int64 = TypeConversions._dataView.getBigInt64(0, true);
        if (int64 <= Number.MAX_SAFE_INTEGER && int64 >= Number.MIN_SAFE_INTEGER) {
            return Number(int64);
        }
        return Number.MAX_SAFE_INTEGER;
    }
    static bytesToFloat64LE(bytes) {
        TypeConversions._conversionByteArray.set(bytes, 0);
        return TypeConversions._dataView.getFloat64(0, true);
    }
    static bytesToFloat32LE(bytes) {
        TypeConversions._conversionByteArray.set(bytes, 0);
        return TypeConversions._dataView.getFloat32(0, true);
    }
    static float32BEToBytes(v) {
        TypeConversions._dataView.setFloat32(0, v, false);
        return TypeConversions._conversionByteArray.slice(0, 4);
    }
    static uint16ToInt16(v) {
        TypeConversions._dataView.setUint16(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int16ToUint32(v) {
        TypeConversions._dataView.setInt16(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static int32ToUint16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint16(0, true);
    }
    static int32ToInt16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int32ToUint32(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static uint8ToInt8(v) {
        TypeConversions._dataView.setUint8(0, v);
        return TypeConversions._dataView.getInt8(0);
    }
}
TypeConversions._conversionBuffer = new ArrayBuffer(8);
TypeConversions._conversionByteArray = new Uint8Array(TypeConversions._conversionBuffer);
TypeConversions._dataView = new DataView(TypeConversions._conversionBuffer);
class ByteBuffer {
    constructor() {
        this.length = 0;
        this.position = 0;
    }
    get bytesWritten() {
        return this.position;
    }
    getBuffer() {
        return this._buffer;
    }
    static empty() {
        return ByteBuffer.withCapacity(0);
    }
    static withCapacity(capacity) {
        const buffer = new ByteBuffer();
        buffer._buffer = new Uint8Array(capacity);
        return buffer;
    }
    static fromBuffer(data) {
        const buffer = new ByteBuffer();
        buffer._buffer = data;
        buffer.length = data.length;
        return buffer;
    }
    static fromString(contents) {
        const byteArray = IOHelper.stringToBytes(contents);
        return ByteBuffer.fromBuffer(byteArray);
    }
    reset() {
        this.position = 0;
    }
    skip(offset) {
        this.position += offset;
    }
    readByte() {
        const n = this.length - this.position;
        if (n <= 0) {
            return -1;
        }
        return this._buffer[this.position++];
    }
    read(buffer, offset, count) {
        let n = this.length - this.position;
        if (n > count) {
            n = count;
        }
        if (n <= 0) {
            return 0;
        }
        buffer.set(this._buffer.subarray(this.position, this.position + n), offset);
        this.position += n;
        return n;
    }
    writeByte(value) {
        const i = this.position + 1;
        this.ensureCapacity(i);
        this._buffer[this.position] = value & 0xff;
        if (i > this.length) {
            this.length = i;
        }
        this.position = i;
    }
    write(buffer, offset, count) {
        const i = this.position + count;
        this.ensureCapacity(i);
        const count1 = Math.min(count, buffer.length - offset);
        this._buffer.set(buffer.subarray(offset, offset + count1), this.position);
        if (i > this.length) {
            this.length = i;
        }
        this.position = i;
    }
    ensureCapacity(value) {
        if (value > this._buffer.length) {
            let newCapacity = value;
            if (newCapacity < 256) {
                newCapacity = 256;
            }
            if (newCapacity < this._buffer.length * 2) {
                newCapacity = this._buffer.length * 2;
            }
            const newBuffer = new Uint8Array(newCapacity);
            if (this.length > 0) {
                newBuffer.set(this._buffer.subarray(0, 0 + this.length), 0);
            }
            this._buffer = newBuffer;
        }
    }
    readAll() {
        return this.toArray();
    }
    toArray() {
        const copy = new Uint8Array(this.length);
        copy.set(this._buffer.subarray(0, 0 + this.length), 0);
        return copy;
    }
    copyTo(destination) {
        destination.write(this._buffer, 0, this.length);
    }
}
class BitReader {
    constructor(source) {
        this._currentByte = 0;
        this._position = BitReader.ByteSize;
        this._source = source;
    }
    readByte() {
        return this.readBits(8);
    }
    readBytes(count) {
        const bytes = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            bytes[i] = this.readByte() & 0xff;
        }
        return bytes;
    }
    readBits(count) {
        let bits = 0;
        let i = count - 1;
        while (i >= 0) {
            bits = bits | (this.readBit() << i);
            i--;
        }
        return bits;
    }
    readBitsReversed(count) {
        let bits = 0;
        for (let i = 0; i < count; i++) {
            bits = bits | (this.readBit() << i);
        }
        return bits;
    }
    readBit() {
        if (this._position >= 8) {
            this._currentByte = this._source.readByte();
            if (this._currentByte === -1) {
                throw new EndOfReaderError();
            }
            this._position = 0;
        }
        const value = (this._currentByte >> (BitReader.ByteSize - this._position - 1)) & 0x01;
        this._position++;
        return value;
    }
    readAll() {
        const all = ByteBuffer.empty();
        try {
            while (true) {
                all.writeByte(this.readByte() & 0xff);
            }
        }
        catch (e) {
            if (!(e instanceof EndOfReaderError)) {
                throw e;
            }
        }
        return all.toArray();
    }
}
BitReader.ByteSize = 8;
class SynthConstants {
}
SynthConstants.DefaultChannelCount = 16 + 1;
SynthConstants.MetronomeChannel = SynthConstants.DefaultChannelCount - 1;
SynthConstants.MetronomeKey = 33;
SynthConstants.AudioChannels = 2;
SynthConstants.MinVolume = 0;
SynthConstants.MinProgram = 0;
SynthConstants.MaxProgram = 127;
SynthConstants.MinPlaybackSpeed = 0.125;
SynthConstants.MaxPlaybackSpeed = 8;
SynthConstants.PercussionChannel = 9;
SynthConstants.PercussionBank = 128;
SynthConstants.MaxPitchWheel = 0x4000;
SynthConstants.MaxPitchWheel20 = 0x100000000;
SynthConstants.DefaultPitchWheel = SynthConstants.MaxPitchWheel / 2;
SynthConstants.MicroBufferCount = 32;
SynthConstants.MicroBufferSize = 64;
var ScoreSubElement;
(function (ScoreSubElement) {
    ScoreSubElement[ScoreSubElement["Title"] = 0] = "Title";
    ScoreSubElement[ScoreSubElement["SubTitle"] = 1] = "SubTitle";
    ScoreSubElement[ScoreSubElement["Artist"] = 2] = "Artist";
    ScoreSubElement[ScoreSubElement["Album"] = 3] = "Album";
    ScoreSubElement[ScoreSubElement["Words"] = 4] = "Words";
    ScoreSubElement[ScoreSubElement["Music"] = 5] = "Music";
    ScoreSubElement[ScoreSubElement["WordsAndMusic"] = 6] = "WordsAndMusic";
    ScoreSubElement[ScoreSubElement["Transcriber"] = 7] = "Transcriber";
    ScoreSubElement[ScoreSubElement["Copyright"] = 8] = "Copyright";
    ScoreSubElement[ScoreSubElement["CopyrightSecondLine"] = 9] = "CopyrightSecondLine";
    ScoreSubElement[ScoreSubElement["ChordDiagramList"] = 10] = "ChordDiagramList";
})(ScoreSubElement || (ScoreSubElement = {}));
class HeaderFooterStyle {
    constructor(template = '', isVisible = undefined) {
        this.template = template;
        this.isVisible = isVisible;
    }
    buildText(score) {
        let anyPlaceholderFilled = false;
        let anyPlaceholder = false;
        const replaced = this.template.replace(HeaderFooterStyle.PlaceholderPattern, (_match, variable) => {
            anyPlaceholder = true;
            let value = '';
            switch (variable) {
                case 'TITLE':
                    value = score.title;
                    break;
                case 'SUBTITLE':
                    value = score.subTitle;
                    break;
                case 'ARTIST':
                    value = score.artist;
                    break;
                case 'ALBUM':
                    value = score.album;
                    break;
                case 'WORDS':
                case 'WORDSMUSIC':
                    value = score.words;
                    break;
                case 'MUSIC':
                    value = score.music;
                    break;
                case 'TABBER':
                    value = score.tab;
                    break;
                case 'COPYRIGHT':
                    value = score.copyright;
                    break;
                default:
                    value = '';
                    break;
            }
            if (value) {
                anyPlaceholderFilled = true;
            }
            return value;
        });
        if (anyPlaceholder && !anyPlaceholderFilled) {
            return '';
        }
        return replaced;
    }
}
HeaderFooterStyle.PlaceholderPattern = /%([^%]+)%/g;
class ScoreStyle {
    constructor() {
        this.headerAndFooter = new Map();
    }
}
class Score {
    constructor() {
        this._currentRepeatGroup = null;
        this._openedRepeatGroups = [];
        this._properlyOpenedRepeatGroups = 0;
        this.album = '';
        this.artist = '';
        this.copyright = '';
        this.instructions = '';
        this.music = '';
        this.notices = '';
        this.subTitle = '';
        this.title = '';
        this.words = '';
        this.tab = '';
        this.tempo = 120;
        this.tempoLabel = '';
        this.masterBars = [];
        this.tracks = [];
        this.defaultSystemsLayout = 3;
        this.systemsLayout = [];
    }
    static resetIds() {
        Bar.resetIds();
        Beat.resetIds();
        Voice.resetIds();
        Note.resetIds();
    }
    rebuildRepeatGroups() {
        this._currentRepeatGroup = null;
        this._openedRepeatGroups = [];
        this._properlyOpenedRepeatGroups = 0;
        for (const bar of this.masterBars) {
            this.addMasterBarToRepeatGroups(bar);
        }
    }
    addMasterBar(bar) {
        bar.score = this;
        bar.index = this.masterBars.length;
        if (this.masterBars.length !== 0) {
            bar.previousMasterBar = this.masterBars[this.masterBars.length - 1];
            bar.previousMasterBar.nextMasterBar = bar;
            bar.start =
                bar.previousMasterBar.start +
                    (bar.previousMasterBar.isAnacrusis ? 0 : bar.previousMasterBar.calculateDuration());
        }
        this.addMasterBarToRepeatGroups(bar);
        this.masterBars.push(bar);
    }
    addMasterBarToRepeatGroups(bar) {
        if (bar.isRepeatStart) {
            if (this._currentRepeatGroup?.isClosed) {
                this._openedRepeatGroups.pop();
                this._properlyOpenedRepeatGroups--;
            }
            this._currentRepeatGroup = new RepeatGroup();
            this._openedRepeatGroups.push(this._currentRepeatGroup);
            this._properlyOpenedRepeatGroups++;
        }
        else if (!this._currentRepeatGroup) {
            this._currentRepeatGroup = new RepeatGroup();
            this._openedRepeatGroups.push(this._currentRepeatGroup);
        }
        this._currentRepeatGroup.addMasterBar(bar);
        if (bar.isRepeatEnd) {
            if (this._properlyOpenedRepeatGroups > 1) {
                this._openedRepeatGroups.pop();
                this._properlyOpenedRepeatGroups--;
                this._currentRepeatGroup =
                    this._openedRepeatGroups.length > 0
                        ? this._openedRepeatGroups[this._openedRepeatGroups.length - 1]
                        : null;
            }
        }
    }
    addTrack(track) {
        track.score = this;
        track.index = this.tracks.length;
        this.tracks.push(track);
    }
    finish(settings) {
        const sharedDataBag = new Map();
        for (let i = 0, j = this.tracks.length; i < j; i++) {
            this.tracks[i].finish(settings, sharedDataBag);
        }
    }
    applyFlatSyncPoints(syncPoints) {
        for (const b of this.masterBars) {
            b.syncPoints = undefined;
        }
        for (const syncPoint of syncPoints) {
            const automation = new Automation();
            automation.ratioPosition = Math.min(1, Math.max(0, syncPoint.barPosition));
            automation.type = AutomationType.SyncPoint;
            automation.syncPointValue = new SyncPointData();
            automation.syncPointValue.millisecondOffset = syncPoint.millisecondOffset;
            automation.syncPointValue.barOccurence = syncPoint.barOccurence;
            if (syncPoint.barIndex < this.masterBars.length) {
                this.masterBars[syncPoint.barIndex].addSyncPoint(automation);
            }
        }
        for (const b of this.masterBars) {
            if (b.syncPoints) {
                b.syncPoints.sort((a, b) => {
                    const occurence = a.syncPointValue.barOccurence - b.syncPointValue.barOccurence;
                    if (occurence !== 0) {
                        return occurence;
                    }
                    return a.ratioPosition - b.ratioPosition;
                });
            }
        }
    }
    exportFlatSyncPoints() {
        const syncPoints = [];
        for (const masterBar of this.masterBars) {
            const masterBarSyncPoints = masterBar.syncPoints;
            if (masterBarSyncPoints) {
                for (const syncPoint of masterBarSyncPoints) {
                    syncPoints.push({
                        barIndex: masterBar.index,
                        barOccurence: syncPoint.syncPointValue.barOccurence,
                        barPosition: syncPoint.ratioPosition,
                        millisecondOffset: syncPoint.syncPointValue.millisecondOffset
                    });
                }
            }
        }
        return syncPoints;
    }
}
var PickStroke;
(function (PickStroke) {
    PickStroke[PickStroke["None"] = 0] = "None";
    PickStroke[PickStroke["Up"] = 1] = "Up";
    PickStroke[PickStroke["Down"] = 2] = "Down";
})(PickStroke || (PickStroke = {}));
class RepeatGroup {
    constructor() {
        this.masterBars = [];
        this.opening = null;
        this.closings = [];
        this.isClosed = false;
    }
    get openings() {
        const opening = this.opening;
        return opening ? [opening] : [];
    }
    get isOpened() {
        return this.opening?.isRepeatStart === true;
    }
    addMasterBar(masterBar) {
        if (this.opening === null) {
            this.opening = masterBar;
        }
        this.masterBars.push(masterBar);
        masterBar.repeatGroup = this;
        if (masterBar.isRepeatEnd) {
            this.closings.push(masterBar);
            this.isClosed = true;
        }
    }
}
class MasterBar {
    constructor() {
        this.alternateEndings = 0;
        this.nextMasterBar = null;
        this.previousMasterBar = null;
        this.index = 0;
        this.isDoubleBar = false;
        this.isRepeatStart = false;
        this.repeatCount = 0;
        this.timeSignatureNumerator = 4;
        this.timeSignatureDenominator = 4;
        this.timeSignatureCommon = false;
        this.isFreeTime = false;
        this.tripletFeel = TripletFeel.NoTripletFeel;
        this.section = null;
        this.tempoAutomations = [];
        this.fermata = null;
        this.start = 0;
        this.isAnacrusis = false;
        this.displayScale = 1;
        this.displayWidth = -1;
        this.directions = null;
    }
    get hasChanges() {
        if (this.index === 0) {
            return false;
        }
        const hasChangesToPrevious = this.timeSignatureCommon !== this.previousMasterBar.timeSignatureCommon ||
            this.timeSignatureNumerator !== this.previousMasterBar.timeSignatureNumerator ||
            this.timeSignatureDenominator !== this.previousMasterBar.timeSignatureDenominator ||
            this.tripletFeel !== this.previousMasterBar.tripletFeel;
        if (hasChangesToPrevious) {
            return true;
        }
        return (this.alternateEndings !== 0 ||
            this.isRepeatStart ||
            this.isRepeatEnd ||
            this.isFreeTime ||
            this.isSectionStart ||
            this.tempoAutomations.length > 0 ||
            (this.syncPoints && this.syncPoints.length > 0) ||
            (this.fermata !== null && this.fermata.size > 0) ||
            (this.directions !== null && this.directions.size > 0) ||
            this.isAnacrusis);
    }
    get keySignature() {
        return this.score.tracks[0].staves[0].bars[this.index].keySignature;
    }
    set keySignature(value) {
        this.score.tracks[0].staves[0].bars[this.index].keySignature = value;
    }
    get keySignatureType() {
        return this.score.tracks[0].staves[0].bars[this.index].keySignatureType;
    }
    set keySignatureType(value) {
        this.score.tracks[0].staves[0].bars[this.index].keySignatureType = value;
    }
    get isRepeatEnd() {
        return this.repeatCount > 0;
    }
    get isSectionStart() {
        return !!this.section;
    }
    get tempoAutomation() {
        return this.tempoAutomations.length > 0 ? this.tempoAutomations[0] : null;
    }
    calculateDuration(respectAnacrusis = true) {
        if (this.isAnacrusis && respectAnacrusis) {
            let duration = 0;
            for (const track of this.score.tracks) {
                for (const staff of track.staves) {
                    const barDuration = this.index < staff.bars.length ? staff.bars[this.index].calculateDuration() : 0;
                    if (barDuration > duration) {
                        duration = barDuration;
                    }
                }
            }
            return duration;
        }
        return this.timeSignatureNumerator * MidiUtils.valueToTicks(this.timeSignatureDenominator);
    }
    addFermata(offset, fermata) {
        let fermataMap = this.fermata;
        if (fermataMap === null) {
            fermataMap = new Map();
            this.fermata = fermataMap;
        }
        fermataMap.set(offset, fermata);
    }
    addDirection(direction) {
        if (this.directions == null) {
            this.directions = new Set();
        }
        this.directions.add(direction);
    }
    getFermata(beat) {
        const fermataMap = this.fermata;
        if (fermataMap === null) {
            return null;
        }
        if (fermataMap.has(beat.playbackStart)) {
            return fermataMap.get(beat.playbackStart);
        }
        if (beat.index === 0 && fermataMap.has(0)) {
            return fermataMap.get(0);
        }
        return null;
    }
    addSyncPoint(syncPoint) {
        if (!this.syncPoints) {
            this.syncPoints = [];
        }
        this.syncPoints.push(syncPoint);
    }
}
MasterBar.MaxAlternateEndings = 8;
var KeySignature;
(function (KeySignature) {
    KeySignature[KeySignature["Cb"] = -7] = "Cb";
    KeySignature[KeySignature["Gb"] = -6] = "Gb";
    KeySignature[KeySignature["Db"] = -5] = "Db";
    KeySignature[KeySignature["Ab"] = -4] = "Ab";
    KeySignature[KeySignature["Eb"] = -3] = "Eb";
    KeySignature[KeySignature["Bb"] = -2] = "Bb";
    KeySignature[KeySignature["F"] = -1] = "F";
    KeySignature[KeySignature["C"] = 0] = "C";
    KeySignature[KeySignature["G"] = 1] = "G";
    KeySignature[KeySignature["D"] = 2] = "D";
    KeySignature[KeySignature["A"] = 3] = "A";
    KeySignature[KeySignature["E"] = 4] = "E";
    KeySignature[KeySignature["B"] = 5] = "B";
    KeySignature[KeySignature["FSharp"] = 6] = "FSharp";
    KeySignature[KeySignature["CSharp"] = 7] = "CSharp";
})(KeySignature || (KeySignature = {}));
var KeySignatureType;
(function (KeySignatureType) {
    KeySignatureType[KeySignatureType["Major"] = 0] = "Major";
    KeySignatureType[KeySignatureType["Minor"] = 1] = "Minor";
})(KeySignatureType || (KeySignatureType = {}));
var TripletFeel;
(function (TripletFeel) {
    TripletFeel[TripletFeel["NoTripletFeel"] = 0] = "NoTripletFeel";
    TripletFeel[TripletFeel["Triplet16th"] = 1] = "Triplet16th";
    TripletFeel[TripletFeel["Triplet8th"] = 2] = "Triplet8th";
    TripletFeel[TripletFeel["Dotted16th"] = 3] = "Dotted16th";
    TripletFeel[TripletFeel["Dotted8th"] = 4] = "Dotted8th";
    TripletFeel[TripletFeel["Scottish16th"] = 5] = "Scottish16th";
    TripletFeel[TripletFeel["Scottish8th"] = 6] = "Scottish8th";
})(TripletFeel || (TripletFeel = {}));
class Section {
    constructor() {
        this.marker = '';
        this.text = '';
    }
}
var AutomationType;
(function (AutomationType) {
    AutomationType[AutomationType["Tempo"] = 0] = "Tempo";
    AutomationType[AutomationType["Volume"] = 1] = "Volume";
    AutomationType[AutomationType["Instrument"] = 2] = "Instrument";
    AutomationType[AutomationType["Balance"] = 3] = "Balance";
    AutomationType[AutomationType["SyncPoint"] = 4] = "SyncPoint";
    AutomationType[AutomationType["Bank"] = 4] = "Bank";
})(AutomationType || (AutomationType = {}));
class SyncPointData {
    constructor() {
        this.barOccurence = 0;
        this.millisecondOffset = 0;
    }
}
class Automation {
    constructor() {
        this.isLinear = false;
        this.type = AutomationType.Tempo;
        this.value = 0;
        this.ratioPosition = 0;
        this.text = '';
    }
    static buildTempoAutomation(isLinear, ratioPosition, value, reference) {
        if (reference < 1 || reference > 5) {
            reference = 2;
        }
        const references = new Float32Array([1, 0.5, 1.0, 1.5, 2.0, 3.0]);
        const automation = new Automation();
        automation.type = AutomationType.Tempo;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value * references[reference];
        return automation;
    }
    static buildInstrumentAutomation(isLinear, ratioPosition, value) {
        const automation = new Automation();
        automation.type = AutomationType.Instrument;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value;
        return automation;
    }
}
var FermataType;
(function (FermataType) {
    FermataType[FermataType["Short"] = 0] = "Short";
    FermataType[FermataType["Medium"] = 1] = "Medium";
    FermataType[FermataType["Long"] = 2] = "Long";
})(FermataType || (FermataType = {}));
class Fermata {
    constructor() {
        this.type = FermataType.Short;
        this.length = 0;
    }
}
var Direction;
(function (Direction) {
    Direction[Direction["TargetFine"] = 0] = "TargetFine";
    Direction[Direction["TargetSegno"] = 1] = "TargetSegno";
    Direction[Direction["TargetSegnoSegno"] = 2] = "TargetSegnoSegno";
    Direction[Direction["TargetCoda"] = 3] = "TargetCoda";
    Direction[Direction["TargetDoubleCoda"] = 4] = "TargetDoubleCoda";
    Direction[Direction["JumpDaCapo"] = 5] = "JumpDaCapo";
    Direction[Direction["JumpDaCapoAlCoda"] = 6] = "JumpDaCapoAlCoda";
    Direction[Direction["JumpDaCapoAlDoubleCoda"] = 7] = "JumpDaCapoAlDoubleCoda";
    Direction[Direction["JumpDaCapoAlFine"] = 8] = "JumpDaCapoAlFine";
    Direction[Direction["JumpDalSegno"] = 9] = "JumpDalSegno";
    Direction[Direction["JumpDalSegnoAlCoda"] = 10] = "JumpDalSegnoAlCoda";
    Direction[Direction["JumpDalSegnoAlDoubleCoda"] = 11] = "JumpDalSegnoAlDoubleCoda";
    Direction[Direction["JumpDalSegnoAlFine"] = 12] = "JumpDalSegnoAlFine";
    Direction[Direction["JumpDalSegnoSegno"] = 13] = "JumpDalSegnoSegno";
    Direction[Direction["JumpDalSegnoSegnoAlCoda"] = 14] = "JumpDalSegnoSegnoAlCoda";
    Direction[Direction["JumpDalSegnoSegnoAlDoubleCoda"] = 15] = "JumpDalSegnoSegnoAlDoubleCoda";
    Direction[Direction["JumpDalSegnoSegnoAlFine"] = 16] = "JumpDalSegnoSegnoAlFine";
    Direction[Direction["JumpDaCoda"] = 17] = "JumpDaCoda";
    Direction[Direction["JumpDaDoubleCoda"] = 18] = "JumpDaDoubleCoda";
})(Direction || (Direction = {}));
var Duration;
(function (Duration) {
    Duration[Duration["QuadrupleWhole"] = -4] = "QuadrupleWhole";
    Duration[Duration["DoubleWhole"] = -2] = "DoubleWhole";
    Duration[Duration["Whole"] = 1] = "Whole";
    Duration[Duration["Half"] = 2] = "Half";
    Duration[Duration["Quarter"] = 4] = "Quarter";
    Duration[Duration["Eighth"] = 8] = "Eighth";
    Duration[Duration["Sixteenth"] = 16] = "Sixteenth";
    Duration[Duration["ThirtySecond"] = 32] = "ThirtySecond";
    Duration[Duration["SixtyFourth"] = 64] = "SixtyFourth";
    Duration[Duration["OneHundredTwentyEighth"] = 128] = "OneHundredTwentyEighth";
    Duration[Duration["TwoHundredFiftySixth"] = 256] = "TwoHundredFiftySixth";
})(Duration || (Duration = {}));
var DynamicValue;
(function (DynamicValue) {
    DynamicValue[DynamicValue["PPP"] = 0] = "PPP";
    DynamicValue[DynamicValue["PP"] = 1] = "PP";
    DynamicValue[DynamicValue["P"] = 2] = "P";
    DynamicValue[DynamicValue["MP"] = 3] = "MP";
    DynamicValue[DynamicValue["MF"] = 4] = "MF";
    DynamicValue[DynamicValue["F"] = 5] = "F";
    DynamicValue[DynamicValue["FF"] = 6] = "FF";
    DynamicValue[DynamicValue["FFF"] = 7] = "FFF";
    DynamicValue[DynamicValue["PPPP"] = 8] = "PPPP";
    DynamicValue[DynamicValue["PPPPP"] = 9] = "PPPPP";
    DynamicValue[DynamicValue["PPPPPP"] = 10] = "PPPPPP";
    DynamicValue[DynamicValue["FFFF"] = 11] = "FFFF";
    DynamicValue[DynamicValue["FFFFF"] = 12] = "FFFFF";
    DynamicValue[DynamicValue["FFFFFF"] = 13] = "FFFFFF";
    DynamicValue[DynamicValue["SF"] = 14] = "SF";
    DynamicValue[DynamicValue["SFP"] = 15] = "SFP";
    DynamicValue[DynamicValue["SFPP"] = 16] = "SFPP";
    DynamicValue[DynamicValue["FP"] = 17] = "FP";
    DynamicValue[DynamicValue["RF"] = 18] = "RF";
    DynamicValue[DynamicValue["RFZ"] = 19] = "RFZ";
    DynamicValue[DynamicValue["SFZ"] = 20] = "SFZ";
    DynamicValue[DynamicValue["SFFZ"] = 21] = "SFFZ";
    DynamicValue[DynamicValue["FZ"] = 22] = "FZ";
    DynamicValue[DynamicValue["N"] = 23] = "N";
    DynamicValue[DynamicValue["PF"] = 24] = "PF";
    DynamicValue[DynamicValue["SFZP"] = 25] = "SFZP";
})(DynamicValue || (DynamicValue = {}));
var BeatBeamingMode;
(function (BeatBeamingMode) {
    BeatBeamingMode[BeatBeamingMode["Auto"] = 0] = "Auto";
    BeatBeamingMode[BeatBeamingMode["ForceSplitToNext"] = 1] = "ForceSplitToNext";
    BeatBeamingMode[BeatBeamingMode["ForceMergeWithNext"] = 2] = "ForceMergeWithNext";
    BeatBeamingMode[BeatBeamingMode["ForceSplitOnSecondaryToNext"] = 3] = "ForceSplitOnSecondaryToNext";
})(BeatBeamingMode || (BeatBeamingMode = {}));
var BeatSubElement;
(function (BeatSubElement) {
    BeatSubElement[BeatSubElement["Effects"] = 0] = "Effects";
    BeatSubElement[BeatSubElement["StandardNotationStem"] = 1] = "StandardNotationStem";
    BeatSubElement[BeatSubElement["StandardNotationFlags"] = 2] = "StandardNotationFlags";
    BeatSubElement[BeatSubElement["StandardNotationBeams"] = 3] = "StandardNotationBeams";
    BeatSubElement[BeatSubElement["StandardNotationTuplet"] = 4] = "StandardNotationTuplet";
    BeatSubElement[BeatSubElement["StandardNotationEffects"] = 5] = "StandardNotationEffects";
    BeatSubElement[BeatSubElement["StandardNotationRests"] = 6] = "StandardNotationRests";
    BeatSubElement[BeatSubElement["GuitarTabStem"] = 7] = "GuitarTabStem";
    BeatSubElement[BeatSubElement["GuitarTabFlags"] = 8] = "GuitarTabFlags";
    BeatSubElement[BeatSubElement["GuitarTabBeams"] = 9] = "GuitarTabBeams";
    BeatSubElement[BeatSubElement["GuitarTabTuplet"] = 10] = "GuitarTabTuplet";
    BeatSubElement[BeatSubElement["GuitarTabEffects"] = 11] = "GuitarTabEffects";
    BeatSubElement[BeatSubElement["GuitarTabRests"] = 12] = "GuitarTabRests";
    BeatSubElement[BeatSubElement["SlashStem"] = 13] = "SlashStem";
    BeatSubElement[BeatSubElement["SlashFlags"] = 14] = "SlashFlags";
    BeatSubElement[BeatSubElement["SlashBeams"] = 15] = "SlashBeams";
    BeatSubElement[BeatSubElement["SlashTuplet"] = 16] = "SlashTuplet";
    BeatSubElement[BeatSubElement["SlashRests"] = 17] = "SlashRests";
    BeatSubElement[BeatSubElement["SlashEffects"] = 18] = "SlashEffects";
    BeatSubElement[BeatSubElement["NumberedDuration"] = 19] = "NumberedDuration";
    BeatSubElement[BeatSubElement["NumberedEffects"] = 20] = "NumberedEffects";
    BeatSubElement[BeatSubElement["NumberedRests"] = 21] = "NumberedRests";
    BeatSubElement[BeatSubElement["NumberedTuplet"] = 22] = "NumberedTuplet";
})(BeatSubElement || (BeatSubElement = {}));
class BeatStyle {
}
;
class Beat {
    constructor() {
        this.id = Beat._globalBeatId++;
        this.index = 0;
        this.previousBeat = null;
        this.nextBeat = null;
        this.notes = [];
        this.noteStringLookup = new Map();
        this.noteValueLookup = new Map();
        this.isEmpty = false;
        this.whammyStyle = BendStyle.Default;
        this.ottava = Ottavia.Regular;
        this.fermata = null;
        this.isLegatoOrigin = false;
        this.minNote = null;
        this.maxNote = null;
        this.maxStringNote = null;
        this.minStringNote = null;
        this.duration = Duration.Quarter;
        this.isLetRing = false;
        this.isPalmMute = false;
        this.automations = [];
        this.dots = 0;
        this.fade = FadeType.None;
        this.lyrics = null;
        this.pop = false;
        this.slap = false;
        this.tap = false;
        this.text = null;
        this.slashed = false;
        this.deadSlapped = false;
        this.brushType = BrushType.None;
        this.brushDuration = 0;
        this.tupletDenominator = -1;
        this.tupletNumerator = -1;
        this.tupletGroup = null;
        this.isContinuedWhammy = false;
        this.whammyBarType = WhammyType.None;
        this.whammyBarPoints = null;
        this.maxWhammyPoint = null;
        this.minWhammyPoint = null;
        this.vibrato = VibratoType.None;
        this.chordId = null;
        this.graceType = GraceType.None;
        this.graceGroup = null;
        this.graceIndex = -1;
        this.pickStroke = PickStroke.None;
        this.tremoloSpeed = null;
        this.crescendo = CrescendoType.None;
        this.displayStart = 0;
        this.playbackStart = 0;
        this.displayDuration = 0;
        this.playbackDuration = 0;
        this.golpe = GolpeType.None;
        this.dynamics = DynamicValue.F;
        this.invertBeamDirection = false;
        this.isEffectSlurOrigin = false;
        this.effectSlurOrigin = null;
        this.effectSlurDestination = null;
        this.beamingMode = BeatBeamingMode.Auto;
        this.wahPedal = WahPedal.None;
        this.barreFret = -1;
        this.barreShape = BarreShape.None;
        this.rasgueado = Rasgueado.None;
        this.showTimer = false;
        this.timer = null;
    }
    static resetIds() {
        Beat._globalBeatId = 0;
    }
    get isLastOfVoice() {
        return this.index === this.voice.beats.length - 1;
    }
    get isLegatoDestination() {
        return !!this.previousBeat && this.previousBeat.isLegatoOrigin;
    }
    get isRest() {
        return this.isEmpty || (!this.deadSlapped && this.notes.length === 0);
    }
    get isFullBarRest() {
        return this.isRest && this.voice.beats.length === 1 && this.duration === Duration.Whole;
    }
    get fadeIn() {
        return this.fade === FadeType.FadeIn;
    }
    set fadeIn(value) {
        this.fade = value ? FadeType.FadeIn : FadeType.None;
    }
    get hasRasgueado() {
        return this.rasgueado !== Rasgueado.None;
    }
    get hasTuplet() {
        return (!(this.tupletDenominator === -1 && this.tupletNumerator === -1) &&
            !(this.tupletDenominator === 1 && this.tupletNumerator === 1));
    }
    get hasWhammyBar() {
        return this.whammyBarPoints !== null && this.whammyBarType !== WhammyType.None;
    }
    get hasChord() {
        return !!this.chordId;
    }
    get chord() {
        return this.chordId ? this.voice.bar.staff.getChord(this.chordId) : null;
    }
    get isTremolo() {
        return !!this.tremoloSpeed;
    }
    get displayEnd() {
        return this.displayStart + this.displayDuration;
    }
    get absoluteDisplayStart() {
        return this.voice.bar.masterBar.start + this.displayStart;
    }
    get absolutePlaybackStart() {
        return this.voice.bar.masterBar.start + this.playbackStart;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    get isBarre() {
        return this.barreShape !== BarreShape.None && this.barreFret >= 0;
    }
    addWhammyBarPoint(point) {
        let points = this.whammyBarPoints;
        if (points === null) {
            points = [];
            this.whammyBarPoints = points;
        }
        points.push(point);
        if (!this.maxWhammyPoint || point.value > this.maxWhammyPoint.value) {
            this.maxWhammyPoint = point;
        }
        if (!this.minWhammyPoint || point.value < this.minWhammyPoint.value) {
            this.minWhammyPoint = point;
        }
        if (this.whammyBarType === WhammyType.None) {
            this.whammyBarType = WhammyType.Custom;
        }
    }
    removeWhammyBarPoint(index) {
        const points = this.whammyBarPoints;
        if (points === null || index < 0 || index >= points.length) {
            return;
        }
        points.splice(index, 1);
        const point = points[index];
        if (point === this.maxWhammyPoint) {
            this.maxWhammyPoint = null;
            for (const currentPoint of points) {
                if (!this.maxWhammyPoint || currentPoint.value > this.maxWhammyPoint.value) {
                    this.maxWhammyPoint = currentPoint;
                }
            }
        }
        if (point === this.minWhammyPoint) {
            this.minWhammyPoint = null;
            for (const currentPoint of points) {
                if (!this.minWhammyPoint || currentPoint.value < this.minWhammyPoint.value) {
                    this.minWhammyPoint = currentPoint;
                }
            }
        }
    }
    addNote(note) {
        note.beat = this;
        note.index = this.notes.length;
        this.notes.push(note);
        if (note.isStringed) {
            this.noteStringLookup.set(note.string, note);
        }
    }
    removeNote(note) {
        const index = this.notes.indexOf(note);
        if (index >= 0) {
            this.notes.splice(index, 1);
            if (note.isStringed) {
                this.noteStringLookup.delete(note.string);
            }
        }
    }
    getAutomation(type) {
        for (let i = 0, j = this.automations.length; i < j; i++) {
            const automation = this.automations[i];
            if (automation.type === type) {
                return automation;
            }
        }
        return null;
    }
    getNoteOnString(noteString) {
        if (this.noteStringLookup.has(noteString)) {
            return this.noteStringLookup.get(noteString);
        }
        return null;
    }
    calculateDuration() {
        if (this.overrideDisplayDuration !== undefined) {
            return this.overrideDisplayDuration;
        }
        if (this.isFullBarRest) {
            return this.voice.bar.masterBar.calculateDuration();
        }
        let ticks = MidiUtils.toTicks(this.duration);
        if (this.dots === 2) {
            ticks = MidiUtils.applyDot(ticks, true);
        }
        else if (this.dots === 1) {
            ticks = MidiUtils.applyDot(ticks, false);
        }
        if (this.tupletDenominator > 0 && this.tupletNumerator >= 0) {
            ticks = MidiUtils.applyTuplet(ticks, this.tupletNumerator, this.tupletDenominator);
        }
        return ticks;
    }
    updateDurations() {
        const ticks = this.calculateDuration();
        this.playbackDuration = ticks;
        switch (this.graceType) {
            case GraceType.BeforeBeat:
            case GraceType.OnBeat:
                switch (this.duration) {
                    case Duration.Sixteenth:
                        this.playbackDuration = MidiUtils.toTicks(Duration.SixtyFourth);
                        break;
                    case Duration.ThirtySecond:
                        this.playbackDuration = MidiUtils.toTicks(Duration.OneHundredTwentyEighth);
                        break;
                    default:
                        this.playbackDuration = MidiUtils.toTicks(Duration.ThirtySecond);
                        break;
                }
                this.displayDuration = 0;
                break;
            case GraceType.BendGrace:
                this.playbackDuration /= 2;
                this.displayDuration = 0;
                break;
            default:
                this.displayDuration = ticks;
                const previous = this.previousBeat;
                if (previous && previous.graceType === GraceType.BendGrace) {
                    this.playbackDuration = previous.playbackDuration;
                }
                break;
        }
    }
    finishTuplet() {
        const previousBeat = this.previousBeat;
        let currentTupletGroup = previousBeat ? previousBeat.tupletGroup : null;
        if (this.hasTuplet || (this.graceType !== GraceType.None && currentTupletGroup)) {
            if (!previousBeat || !currentTupletGroup || !currentTupletGroup.check(this)) {
                currentTupletGroup = new TupletGroup(this.voice);
                currentTupletGroup.check(this);
            }
            this.tupletGroup = currentTupletGroup;
        }
        const barDuration = this.voice.bar.masterBar.calculateDuration(false);
        const validBeatAutomations = [];
        for (const automation of this.automations) {
            if (automation.ratioPosition === 0) {
                automation.ratioPosition = this.playbackStart / barDuration;
            }
            if (automation.type !== AutomationType.Tempo) {
                validBeatAutomations.push(automation);
            }
        }
        this.automations = validBeatAutomations;
    }
    finish(settings, sharedDataBag = null) {
        if (this.getAutomation(AutomationType.Instrument) === null &&
            this.index === 0 &&
            this.voice.index === 0 &&
            this.voice.bar.index === 0 &&
            this.voice.bar.staff.index === 0) {
            this.automations.push(Automation.buildInstrumentAutomation(false, 0, this.voice.bar.staff.track.playbackInfo.program));
        }
        switch (this.graceType) {
            case GraceType.OnBeat:
            case GraceType.BeforeBeat:
                const numberOfGraceBeats = this.graceGroup.beats.length;
                if (numberOfGraceBeats === 1) {
                    this.duration = Duration.Eighth;
                }
                else if (numberOfGraceBeats === 2) {
                    this.duration = Duration.Sixteenth;
                }
                else {
                    this.duration = Duration.ThirtySecond;
                }
                break;
        }
        if (this.brushType === BrushType.None) {
            this.brushDuration = 0;
        }
        const displayMode = !settings ? NotationMode.GuitarPro : settings.notation.notationMode;
        let isGradual = this.text === 'grad' || this.text === 'grad.';
        if (isGradual && displayMode === NotationMode.SongBook) {
            this.text = '';
        }
        let needCopyBeatForBend = false;
        this.minNote = null;
        this.maxNote = null;
        this.minStringNote = null;
        this.maxStringNote = null;
        let visibleNotes = 0;
        let isEffectSlurBeat = false;
        for (let i = 0, j = this.notes.length; i < j; i++) {
            const note = this.notes[i];
            note.dynamics = this.dynamics;
            note.finish(settings, sharedDataBag);
            if (note.isLetRing) {
                this.isLetRing = true;
            }
            if (note.isPalmMute) {
                this.isPalmMute = true;
            }
            if (displayMode === NotationMode.SongBook && note.hasBend && this.graceType !== GraceType.BendGrace) {
                if (!note.isTieOrigin) {
                    switch (note.bendType) {
                        case BendType.Bend:
                        case BendType.PrebendRelease:
                        case BendType.PrebendBend:
                            needCopyBeatForBend = true;
                            break;
                    }
                }
                if (isGradual || note.bendStyle === BendStyle.Gradual) {
                    isGradual = true;
                    note.bendStyle = BendStyle.Gradual;
                    needCopyBeatForBend = false;
                }
                else {
                    note.bendStyle = BendStyle.Fast;
                }
            }
            if (note.isVisible) {
                visibleNotes++;
                if (!this.minNote || note.realValue < this.minNote.realValue) {
                    this.minNote = note;
                }
                if (!this.maxNote || note.realValue > this.maxNote.realValue) {
                    this.maxNote = note;
                }
                if (!this.minStringNote || note.string < this.minStringNote.string) {
                    this.minStringNote = note;
                }
                if (!this.maxStringNote || note.string > this.maxStringNote.string) {
                    this.maxStringNote = note;
                }
                if (note.hasEffectSlur) {
                    isEffectSlurBeat = true;
                }
            }
        }
        if (isEffectSlurBeat) {
            if (this.effectSlurOrigin) {
                this.effectSlurOrigin.effectSlurDestination = this.nextBeat;
                if (this.effectSlurOrigin.effectSlurDestination) {
                    this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                }
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = this.nextBeat;
                if (this.effectSlurDestination) {
                    this.effectSlurDestination.effectSlurOrigin = this;
                }
            }
        }
        if (this.notes.length > 0 && visibleNotes === 0) {
            this.isEmpty = true;
        }
        if (!this.isRest && (!this.isLetRing || !this.isPalmMute)) {
            let currentBeat = this.previousBeat;
            while (currentBeat && currentBeat.isRest) {
                if (!this.isLetRing) {
                    currentBeat.isLetRing = false;
                }
                if (!this.isPalmMute) {
                    currentBeat.isPalmMute = false;
                }
                currentBeat = currentBeat.previousBeat;
            }
        }
        else if (this.isRest &&
            this.previousBeat &&
            settings &&
            settings.notation.notationMode === NotationMode.GuitarPro) {
            if (this.previousBeat.isLetRing) {
                this.isLetRing = true;
            }
            if (this.previousBeat.isPalmMute) {
                this.isPalmMute = true;
            }
        }
        const points = this.whammyBarPoints;
        const hasWhammy = points !== null && points.length > 0;
        if (hasWhammy) {
            const isContinuedWhammy = !!this.previousBeat && this.previousBeat.hasWhammyBar;
            this.isContinuedWhammy = isContinuedWhammy;
        }
        else {
            this.whammyBarType = WhammyType.None;
        }
        if (hasWhammy && this.whammyBarType === WhammyType.Custom) {
            if (displayMode === NotationMode.SongBook) {
                this.whammyStyle = isGradual ? BendStyle.Gradual : BendStyle.Fast;
            }
            if (points.length === 4) {
                const origin = points[0];
                const middle1 = points[1];
                const middle2 = points[2];
                const destination = points[3];
                if (middle1.value === middle2.value) {
                    if ((origin.value < middle1.value && middle1.value < destination.value) ||
                        (origin.value > middle1.value && middle1.value > destination.value)) {
                        if (origin.value !== 0 && !this.isContinuedWhammy) {
                            this.whammyBarType = WhammyType.PrediveDive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Dive;
                        }
                        points.splice(2, 1);
                        points.splice(1, 1);
                    }
                    else if ((origin.value > middle1.value && middle1.value < destination.value) ||
                        (origin.value < middle1.value && middle1.value > destination.value)) {
                        this.whammyBarType = WhammyType.Dip;
                        if (middle1.offset === middle2.offset || displayMode === NotationMode.SongBook) {
                            points.splice(2, 1);
                        }
                    }
                    else if (origin.value === middle1.value && middle1.value === destination.value) {
                        if (origin.value !== 0 && !this.isContinuedWhammy) {
                            this.whammyBarType = WhammyType.Predive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Hold;
                        }
                        points.splice(2, 1);
                        points.splice(1, 1);
                    }
                }
            }
            else if (points.length === 2) {
                const origin = points[0];
                const destination = points[1];
                if (origin.value < destination.value || origin.value > destination.value) {
                    if (origin.value !== 0 && !this.isContinuedWhammy) {
                        this.whammyBarType = WhammyType.PrediveDive;
                    }
                    else {
                        this.whammyBarType = WhammyType.Dive;
                    }
                }
                else if (origin.value === destination.value) {
                    if (origin.value !== 0 && !this.isContinuedWhammy) {
                        this.whammyBarType = WhammyType.Predive;
                    }
                    else {
                        this.whammyBarType = WhammyType.Hold;
                    }
                }
            }
        }
        this.updateDurations();
    }
    isBefore(beat) {
        return (this.voice.bar.index < beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index < beat.index));
    }
    isAfter(beat) {
        return (this.voice.bar.index > beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index > beat.index));
    }
    hasNoteOnString(noteString) {
        return this.noteStringLookup.has(noteString);
    }
    getNoteWithRealValue(noteRealValue) {
        if (this.noteValueLookup.has(noteRealValue)) {
            return this.noteValueLookup.get(noteRealValue);
        }
        return null;
    }
    chain(sharedDataBag = null) {
        for (const n of this.notes) {
            this.noteValueLookup.set(n.realValue, n);
            n.chain(sharedDataBag);
        }
    }
}
Beat._globalBeatId = 0;
var VoiceSubElement;
(function (VoiceSubElement) {
    VoiceSubElement[VoiceSubElement["Glyphs"] = 0] = "Glyphs";
})(VoiceSubElement || (VoiceSubElement = {}));
class VoiceStyle {
}
;
class Voice {
    constructor() {
        this._isEmpty = true;
        this._isRestOnly = true;
        this.id = Voice._globalVoiceId++;
        this.index = 0;
        this.beats = [];
    }
    static resetIds() {
        Voice._globalVoiceId = 0;
    }
    get isEmpty() {
        return this._isEmpty;
    }
    forceNonEmpty() {
        this._isEmpty = false;
    }
    get isRestOnly() {
        return this._isRestOnly;
    }
    insertBeat(after, newBeat) {
        newBeat.nextBeat = after.nextBeat;
        if (newBeat.nextBeat) {
            newBeat.nextBeat.previousBeat = newBeat;
        }
        newBeat.previousBeat = after;
        newBeat.voice = this;
        after.nextBeat = newBeat;
        this.beats.splice(after.index + 1, 0, newBeat);
    }
    addBeat(beat) {
        beat.voice = this;
        beat.index = this.beats.length;
        this.beats.push(beat);
        if (!beat.isEmpty) {
            this._isEmpty = false;
        }
        if (!beat.isRest) {
            this._isRestOnly = false;
        }
    }
    chain(beat, sharedDataBag = null) {
        if (!this.bar) {
            return;
        }
        if (beat.index < this.beats.length - 1) {
            beat.nextBeat = this.beats[beat.index + 1];
            beat.nextBeat.previousBeat = beat;
        }
        else if (beat.isLastOfVoice && beat.voice.bar.nextBar) {
            const nextVoice = this.bar.nextBar.voices[this.index];
            if (nextVoice.beats.length > 0) {
                beat.nextBeat = nextVoice.beats[0];
                beat.nextBeat.previousBeat = beat;
            }
            else {
                beat.nextBeat.previousBeat = beat;
            }
        }
        beat.chain(sharedDataBag);
    }
    addGraceBeat(beat) {
        if (this.beats.length === 0) {
            this.addBeat(beat);
            return;
        }
        const lastBeat = this.beats[this.beats.length - 1];
        this.beats.splice(this.beats.length - 1, 1);
        this.addBeat(beat);
        this.addBeat(lastBeat);
        this._isEmpty = false;
        this._isRestOnly = false;
    }
    getBeatAtPlaybackStart(playbackStart) {
        if (this._beatLookup.has(playbackStart)) {
            return this._beatLookup.get(playbackStart);
        }
        return null;
    }
    finish(settings, sharedDataBag = null) {
        this._isEmpty = true;
        this._isRestOnly = true;
        this._beatLookup = new Map();
        let currentGraceGroup = null;
        for (let index = 0; index < this.beats.length; index++) {
            const beat = this.beats[index];
            beat.index = index;
            this.chain(beat, sharedDataBag);
            if (beat.graceType === GraceType.None) {
                beat.graceGroup = currentGraceGroup;
                if (currentGraceGroup) {
                    currentGraceGroup.isComplete = true;
                }
                currentGraceGroup = null;
            }
            else {
                if (!currentGraceGroup) {
                    currentGraceGroup = new GraceGroup();
                }
                currentGraceGroup.addBeat(beat);
            }
            if (!beat.isEmpty) {
                this._isEmpty = false;
            }
            if (!beat.isRest) {
                this._isRestOnly = false;
            }
        }
        let currentDisplayTick = 0;
        let currentPlaybackTick = 0;
        for (let i = 0; i < this.beats.length; i++) {
            const beat = this.beats[i];
            beat.index = i;
            beat.finish(settings, sharedDataBag);
            if (beat.graceType === GraceType.None) {
                if (beat.graceGroup) {
                    const firstGraceBeat = beat.graceGroup.beats[0];
                    const lastGraceBeat = beat.graceGroup.beats[beat.graceGroup.beats.length - 1];
                    if (firstGraceBeat.graceType !== GraceType.BendGrace) {
                        const stolenDuration = lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration - firstGraceBeat.playbackStart;
                        switch (firstGraceBeat.graceType) {
                            case GraceType.BeforeBeat:
                                if (firstGraceBeat.previousBeat) {
                                    firstGraceBeat.previousBeat.playbackDuration -= stolenDuration;
                                    if (firstGraceBeat.previousBeat.voice === this) {
                                        currentPlaybackTick =
                                            firstGraceBeat.previousBeat.playbackStart +
                                                firstGraceBeat.previousBeat.playbackDuration;
                                    }
                                    else {
                                        currentPlaybackTick = -stolenDuration;
                                    }
                                }
                                else {
                                    currentPlaybackTick = -stolenDuration;
                                }
                                for (const graceBeat of beat.graceGroup.beats) {
                                    this._beatLookup.delete(graceBeat.playbackStart);
                                    graceBeat.playbackStart = currentPlaybackTick;
                                    this._beatLookup.set(graceBeat.playbackStart, beat);
                                    currentPlaybackTick += graceBeat.playbackDuration;
                                }
                                break;
                            case GraceType.OnBeat:
                                beat.playbackDuration -= stolenDuration;
                                if (lastGraceBeat.voice === this) {
                                    currentPlaybackTick = lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration;
                                }
                                else {
                                    currentPlaybackTick = -stolenDuration;
                                }
                                break;
                        }
                    }
                }
                beat.displayStart = currentDisplayTick;
                beat.playbackStart = currentPlaybackTick;
                this._beatLookup.set(beat.playbackStart, beat);
            }
            else {
                beat.displayStart = currentDisplayTick;
                beat.playbackStart = currentPlaybackTick;
            }
            if (beat.fermata) {
                this.bar.masterBar.addFermata(beat.playbackStart, beat.fermata);
            }
            else {
                beat.fermata = this.bar.masterBar.getFermata(beat);
            }
            beat.finishTuplet();
            if (beat.graceGroup) {
                beat.graceGroup.finish();
            }
            currentDisplayTick += beat.displayDuration;
            currentPlaybackTick += beat.playbackDuration;
        }
    }
    calculateDuration() {
        if (this.isEmpty || this.beats.length === 0) {
            return 0;
        }
        const lastBeat = this.beats[this.beats.length - 1];
        const firstBeat = this.beats[0];
        return lastBeat.playbackStart + lastBeat.playbackDuration - firstBeat.playbackStart;
    }
}
Voice._globalVoiceId = 0;
class NoteIdBag {
    constructor() {
        this.tieDestinationNoteId = -1;
        this.tieOriginNoteId = -1;
        this.slurDestinationNoteId = -1;
        this.slurOriginNoteId = -1;
        this.hammerPullDestinationNoteId = -1;
        this.hammerPullOriginNoteId = -1;
        this.slideTargetNoteId = -1;
        this.slideOriginNoteId = -1;
    }
}
var NoteSubElement;
(function (NoteSubElement) {
    NoteSubElement[NoteSubElement["Effects"] = 0] = "Effects";
    NoteSubElement[NoteSubElement["StandardNotationNoteHead"] = 1] = "StandardNotationNoteHead";
    NoteSubElement[NoteSubElement["StandardNotationAccidentals"] = 2] = "StandardNotationAccidentals";
    NoteSubElement[NoteSubElement["StandardNotationEffects"] = 3] = "StandardNotationEffects";
    NoteSubElement[NoteSubElement["GuitarTabFretNumber"] = 4] = "GuitarTabFretNumber";
    NoteSubElement[NoteSubElement["GuitarTabEffects"] = 5] = "GuitarTabEffects";
    NoteSubElement[NoteSubElement["SlashNoteHead"] = 6] = "SlashNoteHead";
    NoteSubElement[NoteSubElement["SlashEffects"] = 7] = "SlashEffects";
    NoteSubElement[NoteSubElement["NumberedNumber"] = 8] = "NumberedNumber";
    NoteSubElement[NoteSubElement["NumberedAccidentals"] = 9] = "NumberedAccidentals";
    NoteSubElement[NoteSubElement["NumberedEffects"] = 10] = "NumberedEffects";
})(NoteSubElement || (NoteSubElement = {}));
class NoteStyle {
}
class Note {
    constructor() {
        this.id = Note.GlobalNoteId++;
        this.index = 0;
        this.accentuated = AccentuationType.None;
        this.bendType = BendType.None;
        this.bendStyle = BendStyle.Default;
        this.bendOrigin = null;
        this.isContinuedBend = false;
        this.bendPoints = null;
        this.maxBendPoint = null;
        this.fret = -1;
        this.string = -1;
        this.showStringNumber = false;
        this.octave = -1;
        this.tone = -1;
        this.percussionArticulation = -1;
        this.isVisible = true;
        this.isLeftHandTapped = false;
        this.isHammerPullOrigin = false;
        this.hammerPullOrigin = null;
        this.hammerPullDestination = null;
        this.isSlurDestination = false;
        this.slurOrigin = null;
        this.slurDestination = null;
        this.harmonicType = HarmonicType.None;
        this.harmonicValue = 0;
        this.isGhost = false;
        this.isLetRing = false;
        this.letRingDestination = null;
        this.isPalmMute = false;
        this.palmMuteDestination = null;
        this.isDead = false;
        this.isStaccato = false;
        this.slideInType = SlideInType.None;
        this.slideOutType = SlideOutType.None;
        this.slideTarget = null;
        this.slideOrigin = null;
        this.vibrato = VibratoType.None;
        this.tieOrigin = null;
        this.tieDestination = null;
        this.isTieDestination = false;
        this.leftHandFinger = Fingers.Unknown;
        this.rightHandFinger = Fingers.Unknown;
        this.trillValue = -1;
        this.trillSpeed = Duration.ThirtySecond;
        this.durationPercent = 1;
        this.accidentalMode = NoteAccidentalMode.Default;
        this.dynamics = DynamicValue.F;
        this.isEffectSlurOrigin = false;
        this.hasEffectSlur = false;
        this.effectSlurOrigin = null;
        this.effectSlurDestination = null;
        this.ornament = NoteOrnament.None;
        this._noteIdBag = null;
    }
    static resetIds() {
        Note.GlobalNoteId = 0;
    }
    get hasBend() {
        return this.bendPoints !== null && this.bendType !== BendType.None;
    }
    get isStringed() {
        return this.string >= 0;
    }
    get isPiano() {
        return !this.isStringed && this.octave >= 0 && this.tone >= 0;
    }
    get isPercussion() {
        return !this.isStringed && this.percussionArticulation >= 0;
    }
    get element() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[0] : -1;
    }
    get variation() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[1] : -1;
    }
    get isHammerPullDestination() {
        return !!this.hammerPullOrigin;
    }
    get isSlurOrigin() {
        return !!this.slurDestination;
    }
    get isHarmonic() {
        return this.harmonicType !== HarmonicType.None;
    }
    get isTieOrigin() {
        return this.tieDestination !== null;
    }
    get isFingering() {
        return this.leftHandFinger !== Fingers.Unknown || this.rightHandFinger !== Fingers.Unknown;
    }
    get trillFret() {
        return this.trillValue - this.stringTuning;
    }
    get isTrill() {
        return this.trillValue >= 0;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    get stringTuning() {
        return this.beat.voice.bar.staff.capo + Note.getStringTuning(this.beat.voice.bar.staff, this.string);
    }
    static getStringTuning(staff, noteString) {
        if (staff.tuning.length > 0) {
            return staff.tuning[staff.tuning.length - (noteString - 1) - 1];
        }
        return 0;
    }
    get realValue() {
        return this.calculateRealValue(true, true);
    }
    get realValueWithoutHarmonic() {
        return this.calculateRealValue(true, false);
    }
    calculateRealValue(applyTranspositionPitch, applyHarmonic) {
        const transpositionPitch = applyTranspositionPitch ? this.beat.voice.bar.staff.transpositionPitch : 0;
        if (applyHarmonic) {
            let realValue = this.calculateRealValue(applyTranspositionPitch, false);
            if (this.isStringed) {
                if (this.harmonicType === HarmonicType.Natural) {
                    realValue = this.harmonicPitch + this.stringTuning - transpositionPitch;
                }
                else {
                    realValue += this.harmonicPitch;
                }
            }
            return realValue;
        }
        if (this.isPercussion) {
            return this.percussionArticulation;
        }
        if (this.isStringed) {
            return this.fret + this.stringTuning - transpositionPitch;
        }
        if (this.isPiano) {
            return this.octave * 12 + this.tone - transpositionPitch;
        }
        return 0;
    }
    get harmonicPitch() {
        if (this.harmonicType === HarmonicType.None || !this.isStringed) {
            return 0;
        }
        const value = this.harmonicValue;
        if (ModelUtils.isAlmostEqualTo(value, 2.4)) {
            return 36;
        }
        if (ModelUtils.isAlmostEqualTo(value, 2.7)) {
            return 34;
        }
        if (value < 3) {
            return 0;
        }
        if (value <= 3.5) {
            return 31;
        }
        if (value <= 4) {
            return 28;
        }
        if (value <= 5) {
            return 24;
        }
        if (value <= 6) {
            return 34;
        }
        if (value <= 7) {
            return 19;
        }
        if (value <= 8.5) {
            return 36;
        }
        if (value <= 9) {
            return 28;
        }
        if (value <= 10) {
            return 34;
        }
        if (value <= 11) {
            return 0;
        }
        if (value <= 12) {
            return 12;
        }
        if (value < 14) {
            return 0;
        }
        if (value <= 15) {
            return 34;
        }
        if (value <= 16) {
            return 28;
        }
        if (value <= 17) {
            return 36;
        }
        if (value <= 18) {
            return 0;
        }
        if (value <= 19) {
            return 19;
        }
        if (value <= 21) {
            return 0;
        }
        if (value <= 22) {
            return 36;
        }
        if (value <= 24) {
            return 24;
        }
        return 0;
    }
    get initialBendValue() {
        if (this.hasBend) {
            return Math.floor(this.bendPoints[0].value / 2);
        }
        if (this.bendOrigin) {
            return Math.floor(this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value / 2);
        }
        if (this.isTieDestination && this.tieOrigin.bendOrigin) {
            return Math.floor(this.tieOrigin.bendOrigin.bendPoints[this.tieOrigin.bendOrigin.bendPoints.length - 1].value / 2);
        }
        if (this.beat.hasWhammyBar) {
            return Math.floor(this.beat.whammyBarPoints[0].value / 2);
        }
        if (this.beat.isContinuedWhammy) {
            return Math.floor(this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value / 2);
        }
        return 0;
    }
    get displayValue() {
        return this.displayValueWithoutBend + this.initialBendValue;
    }
    get displayValueWithoutBend() {
        let noteValue = this.realValue;
        if (this.harmonicType !== HarmonicType.Natural && this.harmonicType !== HarmonicType.None) {
            noteValue -= this.harmonicPitch;
        }
        switch (this.beat.ottava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        switch (this.beat.voice.bar.clefOttava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        return noteValue - this.beat.voice.bar.staff.displayTranspositionPitch;
    }
    get hasQuarterToneOffset() {
        if (this.hasBend) {
            return this.bendPoints[0].value % 2 !== 0;
        }
        if (this.bendOrigin) {
            return this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value % 2 !== 0;
        }
        if (this.beat.hasWhammyBar) {
            return this.beat.whammyBarPoints[0].value % 2 !== 0;
        }
        if (this.beat.isContinuedWhammy) {
            return (this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value %
                2 !==
                0);
        }
        return false;
    }
    addBendPoint(point) {
        let points = this.bendPoints;
        if (points === null) {
            points = [];
            this.bendPoints = points;
        }
        points.push(point);
        if (!this.maxBendPoint || point.value > this.maxBendPoint.value) {
            this.maxBendPoint = point;
        }
        if (this.bendType === BendType.None) {
            this.bendType = BendType.Custom;
        }
    }
    finish(settings, sharedDataBag = null) {
        const nextNoteOnLine = new Lazy(() => Note.nextNoteOnSameLine(this));
        const isSongBook = settings && settings.notation.notationMode === NotationMode.SongBook;
        if (this.isTieDestination) {
            this.chain(sharedDataBag);
            if (isSongBook && this.tieOrigin && this.tieOrigin.isLetRing) {
                this.isLetRing = true;
            }
        }
        if (this.isLetRing) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isLetRing) {
                this.letRingDestination = this;
            }
            else {
                this.letRingDestination = nextNoteOnLine.value;
            }
            if (isSongBook && this.isTieDestination && !this.tieOrigin.hasBend) {
                this.isVisible = false;
            }
        }
        if (this.isPalmMute) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isPalmMute) {
                this.palmMuteDestination = this;
            }
            else {
                this.palmMuteDestination = nextNoteOnLine.value;
            }
        }
        if (this.isHammerPullOrigin) {
            const hammerPullDestination = Note.findHammerPullDestination(this);
            if (!hammerPullDestination) {
                this.isHammerPullOrigin = false;
            }
            else {
                this.hammerPullDestination = hammerPullDestination;
                hammerPullDestination.hammerPullOrigin = this;
            }
        }
        switch (this.slideOutType) {
            case SlideOutType.Shift:
            case SlideOutType.Legato:
                if (!this.slideTarget) {
                    this.slideTarget = nextNoteOnLine.value;
                }
                if (!this.slideTarget) {
                    this.slideOutType = SlideOutType.None;
                }
                else {
                    this.slideTarget.slideOrigin = this;
                }
                break;
        }
        let effectSlurDestination = null;
        if (this.isHammerPullOrigin && this.hammerPullDestination) {
            effectSlurDestination = this.hammerPullDestination;
        }
        else if (this.slideOutType === SlideOutType.Legato && this.slideTarget) {
            effectSlurDestination = this.slideTarget;
        }
        if (effectSlurDestination) {
            this.hasEffectSlur = true;
            if (this.effectSlurOrigin && this.beat.pickStroke === PickStroke.None) {
                this.effectSlurOrigin.effectSlurDestination = effectSlurDestination;
                this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = effectSlurDestination;
                this.effectSlurDestination.effectSlurOrigin = this;
            }
        }
        const points = this.bendPoints;
        const hasBend = points != null && points.length > 0;
        if (hasBend) {
            const isContinuedBend = this.isTieDestination && this.tieOrigin.hasBend;
            this.isContinuedBend = isContinuedBend;
        }
        else {
            this.bendType = BendType.None;
        }
        if (hasBend && this.bendType === BendType.Custom) {
            if (points.length === 4) {
                const origin = points[0];
                const middle1 = points[1];
                const middle2 = points[2];
                const destination = points[3];
                if (middle1.value === middle2.value) {
                    if (destination.value > origin.value) {
                        if (middle1.value > destination.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (!this.isContinuedBend && origin.value > 0) {
                            this.bendType = BendType.PrebendBend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Bend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                    else if (destination.value < origin.value) {
                        if (this.isContinuedBend) {
                            this.bendType = BendType.Release;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.PrebendRelease;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                    else {
                        if (middle1.value > origin.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (origin.value > 0 && !this.isContinuedBend) {
                            this.bendType = BendType.Prebend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Hold;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                }
                else {
                    Logger.warning('Model', 'Unsupported bend type detected, fallback to custom', null);
                }
            }
            else if (points.length === 2) {
                const origin = points[0];
                const destination = points[1];
                if (destination.value > origin.value) {
                    if (!this.isContinuedBend && origin.value > 0) {
                        this.bendType = BendType.PrebendBend;
                    }
                    else {
                        this.bendType = BendType.Bend;
                    }
                }
                else if (destination.value < origin.value) {
                    if (this.isContinuedBend) {
                        this.bendType = BendType.Release;
                    }
                    else {
                        this.bendType = BendType.PrebendRelease;
                    }
                }
                else {
                    if (origin.value > 0 && !this.isContinuedBend) {
                        this.bendType = BendType.Prebend;
                    }
                    else {
                        this.bendType = BendType.Hold;
                    }
                }
            }
        }
        if (this.initialBendValue > 0) {
            this.accidentalMode = NoteAccidentalMode.Default;
        }
    }
    static nextNoteOnSameLine(note) {
        let nextBeat = note.beat.nextBeat;
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            const noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findHammerPullDestination(note) {
        let nextBeat = note.beat.nextBeat;
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            let noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            for (let str = note.string; str > 0; str--) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    break;
                }
            }
            for (let str = note.string; str <= note.beat.voice.bar.staff.tuning.length; str++) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    break;
                }
            }
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findTieOrigin(note) {
        let previousBeat = note.beat.previousBeat;
        while (previousBeat &&
            previousBeat.voice.bar.index >= note.beat.voice.bar.index - Note.MaxOffsetForSameLineSearch) {
            if (note.isStringed) {
                const noteOnString = previousBeat.getNoteOnString(note.string);
                if (noteOnString) {
                    return noteOnString;
                }
            }
            else {
                if (note.octave === -1 && note.tone === -1) {
                    if (note.index < previousBeat.notes.length) {
                        return previousBeat.notes[note.index];
                    }
                }
                else {
                    const noteWithValue = previousBeat.getNoteWithRealValue(note.realValue);
                    if (noteWithValue) {
                        return noteWithValue;
                    }
                }
            }
            previousBeat = previousBeat.previousBeat;
        }
        return null;
    }
    chain(sharedDataBag = null) {
        if (sharedDataBag === null) {
            return;
        }
        if (this._noteIdBag !== null) {
            let noteIdLookup;
            if (sharedDataBag.has(Note.NoteIdLookupKey)) {
                noteIdLookup = sharedDataBag.get(Note.NoteIdLookupKey);
            }
            else {
                noteIdLookup = new Map();
                sharedDataBag.set(Note.NoteIdLookupKey, noteIdLookup);
            }
            if (this._noteIdBag.hammerPullDestinationNoteId !== -1 ||
                this._noteIdBag.tieDestinationNoteId !== -1 ||
                this._noteIdBag.slurDestinationNoteId !== -1 ||
                this._noteIdBag.slideTargetNoteId !== -1) {
                noteIdLookup.set(this.id, this);
            }
            if (this._noteIdBag.hammerPullOriginNoteId !== -1) {
                this.hammerPullOrigin = noteIdLookup.get(this._noteIdBag.hammerPullOriginNoteId);
                this.hammerPullOrigin.hammerPullDestination = this;
            }
            if (this._noteIdBag.tieOriginNoteId !== -1) {
                this.tieOrigin = noteIdLookup.get(this._noteIdBag.tieOriginNoteId);
                this.tieOrigin.tieDestination = this;
            }
            if (this._noteIdBag.slurOriginNoteId !== -1) {
                this.slurOrigin = noteIdLookup.get(this._noteIdBag.slurOriginNoteId);
                this.slurOrigin.slurDestination = this;
            }
            if (this._noteIdBag.slideOriginNoteId !== -1) {
                this.slideOrigin = noteIdLookup.get(this._noteIdBag.slideOriginNoteId);
                this.slideOrigin.slideTarget = this;
            }
            this._noteIdBag = null;
        }
        else {
            if (!this.isTieDestination && this.tieOrigin === null) {
                return;
            }
            const tieOrigin = this.tieOrigin ?? Note.findTieOrigin(this);
            if (!tieOrigin) {
                this.isTieDestination = false;
            }
            else {
                tieOrigin.tieDestination = this;
                this.tieOrigin = tieOrigin;
                this.fret = tieOrigin.fret;
                this.octave = tieOrigin.octave;
                this.tone = tieOrigin.tone;
                if (tieOrigin.hasBend) {
                    this.bendOrigin = this.tieOrigin;
                }
            }
        }
    }
    toJson(o) {
        if (this.tieDestination !== null) {
            o.set('tiedestinationnoteid', this.tieDestination.id);
        }
        if (this.tieOrigin !== null) {
            o.set('tieoriginnoteid', this.tieOrigin.id);
        }
        if (this.slurDestination !== null) {
            o.set('slurdestinationnoteid', this.slurDestination.id);
        }
        if (this.slurOrigin !== null) {
            o.set('sluroriginnoteid', this.slurOrigin.id);
        }
        if (this.hammerPullOrigin !== null) {
            o.set('hammerpulloriginnoteid', this.hammerPullOrigin.id);
        }
        if (this.hammerPullDestination !== null) {
            o.set('hammerpulldestinationnoteid', this.hammerPullDestination.id);
        }
        if (this.slideTarget !== null) {
            o.set('slidetargetnoteid', this.slideTarget.id);
        }
        if (this.slideOrigin !== null) {
            o.set('slideoriginnoteid', this.slideOrigin.id);
        }
    }
    setProperty(property, v) {
        switch (property) {
            case 'tiedestinationnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.tieDestinationNoteId = v;
                return true;
            case 'tieoriginnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.tieOriginNoteId = v;
                return true;
            case 'slurdestinationnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slurDestinationNoteId = v;
                return true;
            case 'sluroriginnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slurOriginNoteId = v;
                return true;
            case 'hammerpulloriginnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.hammerPullOriginNoteId = v;
                return true;
            case 'hammerpulldestinationnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.hammerPullDestinationNoteId = v;
                return true;
            case 'slidetargetnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slideTargetNoteId = v;
                return true;
            case 'slideoriginnoteid':
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slideOriginNoteId = v;
                return true;
        }
        return false;
    }
}
Note.GlobalNoteId = 0;
Note.MaxOffsetForSameLineSearch = 3;
Note.NoteIdLookupKey = 'NoteIdLookup';
var BendStyle;
(function (BendStyle) {
    BendStyle[BendStyle["Default"] = 0] = "Default";
    BendStyle[BendStyle["Gradual"] = 1] = "Gradual";
    BendStyle[BendStyle["Fast"] = 2] = "Fast";
})(BendStyle || (BendStyle = {}));
var AccentuationType;
(function (AccentuationType) {
    AccentuationType[AccentuationType["None"] = 0] = "None";
    AccentuationType[AccentuationType["Normal"] = 1] = "Normal";
    AccentuationType[AccentuationType["Heavy"] = 2] = "Heavy";
    AccentuationType[AccentuationType["Tenuto"] = 3] = "Tenuto";
})(AccentuationType || (AccentuationType = {}));
var Ottavia;
(function (Ottavia) {
    Ottavia[Ottavia["_15ma"] = 0] = "_15ma";
    Ottavia[Ottavia["_8va"] = 1] = "_8va";
    Ottavia[Ottavia["Regular"] = 2] = "Regular";
    Ottavia[Ottavia["_8vb"] = 3] = "_8vb";
    Ottavia[Ottavia["_15mb"] = 4] = "_15mb";
})(Ottavia || (Ottavia = {}));
var BendType;
(function (BendType) {
    BendType[BendType["None"] = 0] = "None";
    BendType[BendType["Custom"] = 1] = "Custom";
    BendType[BendType["Bend"] = 2] = "Bend";
    BendType[BendType["Release"] = 3] = "Release";
    BendType[BendType["BendRelease"] = 4] = "BendRelease";
    BendType[BendType["Hold"] = 5] = "Hold";
    BendType[BendType["Prebend"] = 6] = "Prebend";
    BendType[BendType["PrebendBend"] = 7] = "PrebendBend";
    BendType[BendType["PrebendRelease"] = 8] = "PrebendRelease";
})(BendType || (BendType = {}));
class BendPoint {
    constructor(offset = 0, value = 0) {
        this.offset = offset;
        this.value = value;
    }
}
BendPoint.MaxPosition = 60;
BendPoint.MaxValue = 12;
var HarmonicType;
(function (HarmonicType) {
    HarmonicType[HarmonicType["None"] = 0] = "None";
    HarmonicType[HarmonicType["Natural"] = 1] = "Natural";
    HarmonicType[HarmonicType["Artificial"] = 2] = "Artificial";
    HarmonicType[HarmonicType["Pinch"] = 3] = "Pinch";
    HarmonicType[HarmonicType["Tap"] = 4] = "Tap";
    HarmonicType[HarmonicType["Semi"] = 5] = "Semi";
    HarmonicType[HarmonicType["Feedback"] = 6] = "Feedback";
})(HarmonicType || (HarmonicType = {}));
var SlideInType;
(function (SlideInType) {
    SlideInType[SlideInType["None"] = 0] = "None";
    SlideInType[SlideInType["IntoFromBelow"] = 1] = "IntoFromBelow";
    SlideInType[SlideInType["IntoFromAbove"] = 2] = "IntoFromAbove";
})(SlideInType || (SlideInType = {}));
var SlideOutType;
(function (SlideOutType) {
    SlideOutType[SlideOutType["None"] = 0] = "None";
    SlideOutType[SlideOutType["Shift"] = 1] = "Shift";
    SlideOutType[SlideOutType["Legato"] = 2] = "Legato";
    SlideOutType[SlideOutType["OutUp"] = 3] = "OutUp";
    SlideOutType[SlideOutType["OutDown"] = 4] = "OutDown";
    SlideOutType[SlideOutType["PickSlideDown"] = 5] = "PickSlideDown";
    SlideOutType[SlideOutType["PickSlideUp"] = 6] = "PickSlideUp";
})(SlideOutType || (SlideOutType = {}));
var VibratoType;
(function (VibratoType) {
    VibratoType[VibratoType["None"] = 0] = "None";
    VibratoType[VibratoType["Slight"] = 1] = "Slight";
    VibratoType[VibratoType["Wide"] = 2] = "Wide";
})(VibratoType || (VibratoType = {}));
var Fingers;
(function (Fingers) {
    Fingers[Fingers["Unknown"] = -2] = "Unknown";
    Fingers[Fingers["NoOrDead"] = -1] = "NoOrDead";
    Fingers[Fingers["Thumb"] = 0] = "Thumb";
    Fingers[Fingers["IndexFinger"] = 1] = "IndexFinger";
    Fingers[Fingers["MiddleFinger"] = 2] = "MiddleFinger";
    Fingers[Fingers["AnnularFinger"] = 3] = "AnnularFinger";
    Fingers[Fingers["LittleFinger"] = 4] = "LittleFinger";
})(Fingers || (Fingers = {}));
var NoteAccidentalMode;
(function (NoteAccidentalMode) {
    NoteAccidentalMode[NoteAccidentalMode["Default"] = 0] = "Default";
    NoteAccidentalMode[NoteAccidentalMode["ForceNone"] = 1] = "ForceNone";
    NoteAccidentalMode[NoteAccidentalMode["ForceNatural"] = 2] = "ForceNatural";
    NoteAccidentalMode[NoteAccidentalMode["ForceSharp"] = 3] = "ForceSharp";
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleSharp"] = 4] = "ForceDoubleSharp";
    NoteAccidentalMode[NoteAccidentalMode["ForceFlat"] = 5] = "ForceFlat";
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleFlat"] = 6] = "ForceDoubleFlat";
})(NoteAccidentalMode || (NoteAccidentalMode = {}));
var NoteOrnament;
(function (NoteOrnament) {
    NoteOrnament[NoteOrnament["None"] = 0] = "None";
    NoteOrnament[NoteOrnament["InvertedTurn"] = 1] = "InvertedTurn";
    NoteOrnament[NoteOrnament["Turn"] = 2] = "Turn";
    NoteOrnament[NoteOrnament["UpperMordent"] = 3] = "UpperMordent";
    NoteOrnament[NoteOrnament["LowerMordent"] = 4] = "LowerMordent";
})(NoteOrnament || (NoteOrnament = {}));
class Staff {
    constructor() {
        this.index = 0;
        this.bars = [];
        this.chords = null;
        this.capo = 0;
        this.transpositionPitch = 0;
        this.displayTranspositionPitch = 0;
        this.stringTuning = new Tuning('', [], false);
        this.showSlash = false;
        this.showNumbered = false;
        this.showTablature = true;
        this.showStandardNotation = true;
        this.isPercussion = false;
        this.standardNotationLineCount = Staff.DefaultStandardNotationLineCount;
        this._filledVoices = new Set([0]);
    }
    get tuning() {
        return this.stringTuning.tunings;
    }
    get tuningName() {
        return this.stringTuning.name;
    }
    get isStringed() {
        return this.stringTuning.tunings.length > 0;
    }
    get filledVoices() {
        return this._filledVoices;
    }
    finish(settings, sharedDataBag = null) {
        if (this.isPercussion) {
            this.stringTuning.tunings = [];
            this.showTablature = false;
        }
        this.stringTuning.finish();
        for (let i = 0, j = this.bars.length; i < j; i++) {
            this.bars[i].finish(settings, sharedDataBag);
            for (const v of this.bars[i].filledVoices) {
                this._filledVoices.add(v);
            }
        }
    }
    addChord(chordId, chord) {
        chord.staff = this;
        let chordMap = this.chords;
        if (chordMap === null) {
            chordMap = new Map();
            this.chords = chordMap;
        }
        chordMap.set(chordId, chord);
    }
    hasChord(chordId) {
        return this.chords?.has(chordId) ?? false;
    }
    getChord(chordId) {
        return this.chords?.get(chordId) ?? null;
    }
    addBar(bar) {
        const bars = this.bars;
        bar.staff = this;
        bar.index = bars.length;
        if (bars.length > 0) {
            bar.previousBar = bars[bars.length - 1];
            bar.previousBar.nextBar = bar;
        }
        bars.push(bar);
    }
}
Staff.DefaultStandardNotationLineCount = 5;
var TrackSubElement;
(function (TrackSubElement) {
    TrackSubElement[TrackSubElement["TrackName"] = 0] = "TrackName";
    TrackSubElement[TrackSubElement["BracesAndBrackets"] = 1] = "BracesAndBrackets";
    TrackSubElement[TrackSubElement["SystemSeparator"] = 2] = "SystemSeparator";
    TrackSubElement[TrackSubElement["StringTuning"] = 3] = "StringTuning";
})(TrackSubElement || (TrackSubElement = {}));
class Track {
    constructor() {
        this.index = 0;
        this.staves = [];
        this.playbackInfo = new PlaybackInformation();
        this.color = new Color(200, 0, 0, 255);
        this.name = '';
        this.isVisibleOnMultiTrack = true;
        this.shortName = '';
        this.defaultSystemsLayout = 3;
        this.systemsLayout = [];
        this.percussionArticulations = [];
    }
    get isPercussion() {
        return this.staves.some(s => s.isPercussion);
    }
    addLineBreaks(index) {
        if (!this.lineBreaks) {
            this.lineBreaks = new Set();
        }
        this.lineBreaks.add(index);
    }
    ensureStaveCount(staveCount) {
        while (this.staves.length < staveCount) {
            this.addStaff(new Staff());
        }
    }
    addStaff(staff) {
        staff.index = this.staves.length;
        staff.track = this;
        this.staves.push(staff);
    }
    finish(settings, sharedDataBag = null) {
        if (!this.shortName) {
            this.shortName = this.name;
            if (this.shortName.length > Track.ShortNameMaxLength) {
                this.shortName = this.shortName.substr(0, Track.ShortNameMaxLength);
            }
        }
        for (const s of this.staves) {
            s.finish(settings, sharedDataBag);
            if (s.isPercussion) {
                this.playbackInfo.program = 0;
            }
        }
    }
    applyLyrics(lyrics) {
        for (const lyric of lyrics) {
            lyric.finish();
        }
        const staff = this.staves[0];
        for (let li = 0; li < lyrics.length; li++) {
            const lyric = lyrics[li];
            if (lyric.startBar >= 0 && lyric.startBar < staff.bars.length) {
                let beat = staff.bars[lyric.startBar].voices[0].beats[0];
                for (let ci = 0; ci < lyric.chunks.length && beat; ci++) {
                    while (beat && (beat.isEmpty || beat.isRest)) {
                        beat = beat.nextBeat;
                    }
                    if (beat) {
                        if (!beat.lyrics) {
                            beat.lyrics = new Array(lyrics.length);
                            beat.lyrics.fill('');
                        }
                        beat.lyrics[li] = lyric.chunks[ci];
                        beat = beat.nextBeat;
                    }
                }
            }
        }
    }
}
Track.ShortNameMaxLength = 10;
var SustainPedalMarkerType;
(function (SustainPedalMarkerType) {
    SustainPedalMarkerType[SustainPedalMarkerType["Down"] = 0] = "Down";
    SustainPedalMarkerType[SustainPedalMarkerType["Hold"] = 1] = "Hold";
    SustainPedalMarkerType[SustainPedalMarkerType["Up"] = 2] = "Up";
})(SustainPedalMarkerType || (SustainPedalMarkerType = {}));
class SustainPedalMarker {
    constructor() {
        this.ratioPosition = 0;
        this.pedalType = SustainPedalMarkerType.Down;
        this.nextPedalMarker = null;
        this.previousPedalMarker = null;
    }
}
var BarSubElement;
(function (BarSubElement) {
    BarSubElement[BarSubElement["StandardNotationRepeats"] = 0] = "StandardNotationRepeats";
    BarSubElement[BarSubElement["GuitarTabsRepeats"] = 1] = "GuitarTabsRepeats";
    BarSubElement[BarSubElement["SlashRepeats"] = 2] = "SlashRepeats";
    BarSubElement[BarSubElement["NumberedRepeats"] = 3] = "NumberedRepeats";
    BarSubElement[BarSubElement["StandardNotationBarNumber"] = 4] = "StandardNotationBarNumber";
    BarSubElement[BarSubElement["GuitarTabsBarNumber"] = 5] = "GuitarTabsBarNumber";
    BarSubElement[BarSubElement["SlashBarNumber"] = 6] = "SlashBarNumber";
    BarSubElement[BarSubElement["NumberedBarNumber"] = 7] = "NumberedBarNumber";
    BarSubElement[BarSubElement["StandardNotationBarLines"] = 8] = "StandardNotationBarLines";
    BarSubElement[BarSubElement["GuitarTabsBarLines"] = 9] = "GuitarTabsBarLines";
    BarSubElement[BarSubElement["SlashBarLines"] = 10] = "SlashBarLines";
    BarSubElement[BarSubElement["NumberedBarLines"] = 11] = "NumberedBarLines";
    BarSubElement[BarSubElement["StandardNotationClef"] = 12] = "StandardNotationClef";
    BarSubElement[BarSubElement["GuitarTabsClef"] = 13] = "GuitarTabsClef";
    BarSubElement[BarSubElement["StandardNotationKeySignature"] = 14] = "StandardNotationKeySignature";
    BarSubElement[BarSubElement["NumberedKeySignature"] = 15] = "NumberedKeySignature";
    BarSubElement[BarSubElement["StandardNotationTimeSignature"] = 16] = "StandardNotationTimeSignature";
    BarSubElement[BarSubElement["GuitarTabsTimeSignature"] = 17] = "GuitarTabsTimeSignature";
    BarSubElement[BarSubElement["SlashTimeSignature"] = 18] = "SlashTimeSignature";
    BarSubElement[BarSubElement["NumberedTimeSignature"] = 19] = "NumberedTimeSignature";
    BarSubElement[BarSubElement["StandardNotationStaffLine"] = 20] = "StandardNotationStaffLine";
    BarSubElement[BarSubElement["GuitarTabsStaffLine"] = 21] = "GuitarTabsStaffLine";
    BarSubElement[BarSubElement["SlashStaffLine"] = 22] = "SlashStaffLine";
    BarSubElement[BarSubElement["NumberedStaffLine"] = 23] = "NumberedStaffLine";
})(BarSubElement || (BarSubElement = {}));
var BarLineStyle;
(function (BarLineStyle) {
    BarLineStyle[BarLineStyle["Automatic"] = 0] = "Automatic";
    BarLineStyle[BarLineStyle["Dashed"] = 1] = "Dashed";
    BarLineStyle[BarLineStyle["Dotted"] = 2] = "Dotted";
    BarLineStyle[BarLineStyle["Heavy"] = 3] = "Heavy";
    BarLineStyle[BarLineStyle["HeavyHeavy"] = 4] = "HeavyHeavy";
    BarLineStyle[BarLineStyle["HeavyLight"] = 5] = "HeavyLight";
    BarLineStyle[BarLineStyle["LightHeavy"] = 6] = "LightHeavy";
    BarLineStyle[BarLineStyle["LightLight"] = 7] = "LightLight";
    BarLineStyle[BarLineStyle["None"] = 8] = "None";
    BarLineStyle[BarLineStyle["Regular"] = 9] = "Regular";
    BarLineStyle[BarLineStyle["Short"] = 10] = "Short";
    BarLineStyle[BarLineStyle["Tick"] = 11] = "Tick";
})(BarLineStyle || (BarLineStyle = {}));
class Bar {
    constructor() {
        this.id = Bar._globalBarId++;
        this.index = 0;
        this.nextBar = null;
        this.previousBar = null;
        this.clef = Clef.G2;
        this.clefOttava = Ottavia.Regular;
        this.voices = [];
        this.simileMark = SimileMark.None;
        this._filledVoices = new Set([0]);
        this.displayScale = 1;
        this.displayWidth = -1;
        this.sustainPedals = [];
        this._isEmpty = true;
        this._isRestOnly = true;
        this.barLineLeft = BarLineStyle.Automatic;
        this.barLineRight = BarLineStyle.Automatic;
        this.keySignature = KeySignature.C;
        this.keySignatureType = KeySignatureType.Major;
    }
    static resetIds() {
        Bar._globalBarId = 0;
    }
    get isMultiVoice() {
        return this._filledVoices.size > 1;
    }
    get filledVoices() {
        return this._filledVoices;
    }
    get masterBar() {
        return this.staff.track.score.masterBars[this.index];
    }
    get isEmpty() {
        return this._isEmpty;
    }
    get hasChanges() {
        if (this.index === 0) {
            return true;
        }
        const hasChangesToPrevious = this.keySignature !== this.previousBar.keySignature ||
            this.keySignatureType !== this.previousBar.keySignatureType ||
            this.clef !== this.previousBar.clef ||
            this.clefOttava !== this.previousBar.clefOttava;
        if (hasChangesToPrevious) {
            return true;
        }
        return (this.simileMark !== SimileMark.None ||
            this.sustainPedals.length > 0 ||
            this.barLineLeft !== BarLineStyle.Automatic ||
            this.barLineRight !== BarLineStyle.Automatic);
    }
    get isRestOnly() {
        return this._isRestOnly;
    }
    getActualBarLineLeft(isFirstOfSystem) {
        return Bar.actualBarLine(this, false, isFirstOfSystem);
    }
    getActualBarLineRight() {
        return Bar.actualBarLine(this, true, false);
    }
    static automaticToActualType(masterBar, isRight, firstOfSystem) {
        let actualLineType;
        if (isRight) {
            if (masterBar.isRepeatEnd) {
                actualLineType = BarLineStyle.LightHeavy;
            }
            else if (!masterBar.nextMasterBar) {
                actualLineType = BarLineStyle.LightHeavy;
            }
            else if (masterBar.isFreeTime) {
                actualLineType = BarLineStyle.Dashed;
            }
            else if (masterBar.isDoubleBar) {
                actualLineType = BarLineStyle.LightLight;
            }
            else {
                actualLineType = BarLineStyle.Regular;
            }
        }
        else {
            if (masterBar.isRepeatStart) {
                actualLineType = BarLineStyle.HeavyLight;
            }
            else if (firstOfSystem) {
                actualLineType = BarLineStyle.Regular;
            }
            else {
                actualLineType = BarLineStyle.None;
            }
        }
        return actualLineType;
    }
    static actualBarLine(bar, isRight, firstOfSystem) {
        const masterBar = bar.masterBar;
        const requestedLineType = isRight ? bar.barLineRight : bar.barLineLeft;
        let actualLineType;
        if (requestedLineType === BarLineStyle.Automatic) {
            actualLineType = Bar.automaticToActualType(masterBar, isRight, firstOfSystem);
        }
        else {
            actualLineType = requestedLineType;
        }
        return actualLineType;
    }
    addVoice(voice) {
        voice.bar = this;
        voice.index = this.voices.length;
        this.voices.push(voice);
    }
    finish(settings, sharedDataBag = null) {
        this._filledVoices.clear();
        this._filledVoices.add(0);
        this._isEmpty = true;
        this._isRestOnly = true;
        for (let i = 0, j = this.voices.length; i < j; i++) {
            const voice = this.voices[i];
            voice.finish(settings, sharedDataBag);
            if (!voice.isEmpty) {
                this._isEmpty = false;
                this._filledVoices.add(i);
            }
            if (!voice.isRestOnly) {
                this._isRestOnly = false;
            }
        }
        const sustainPedals = this.sustainPedals;
        if (sustainPedals.length > 0) {
            let previousMarker = null;
            this.sustainPedals = [];
            if (this.previousBar && this.previousBar.sustainPedals.length > 0) {
                previousMarker = this.previousBar.sustainPedals[this.previousBar.sustainPedals.length - 1];
            }
            const isDown = previousMarker !== null && previousMarker.pedalType !== SustainPedalMarkerType.Up;
            for (const marker of sustainPedals) {
                if (previousMarker && previousMarker.pedalType !== SustainPedalMarkerType.Up) {
                    if (previousMarker.bar === this && marker.ratioPosition <= previousMarker.ratioPosition) {
                        continue;
                    }
                    previousMarker.nextPedalMarker = marker;
                    marker.previousPedalMarker = previousMarker;
                }
                if (isDown && marker.pedalType === SustainPedalMarkerType.Down) {
                    marker.pedalType = SustainPedalMarkerType.Hold;
                }
                marker.bar = this;
                this.sustainPedals.push(marker);
                previousMarker = marker;
            }
        }
        else if (this.previousBar && this.previousBar.sustainPedals.length > 0) {
            const lastMarker = this.previousBar.sustainPedals[this.previousBar.sustainPedals.length - 1];
            if (lastMarker.pedalType !== SustainPedalMarkerType.Up) {
                const holdMarker = new SustainPedalMarker();
                holdMarker.ratioPosition = 0;
                holdMarker.bar = this;
                holdMarker.pedalType = SustainPedalMarkerType.Hold;
                this.sustainPedals.push(holdMarker);
                lastMarker.nextPedalMarker = holdMarker;
                holdMarker.previousPedalMarker = lastMarker;
            }
        }
    }
    calculateDuration() {
        let duration = 0;
        for (const voice of this.voices) {
            const voiceDuration = voice.calculateDuration();
            if (voiceDuration > duration) {
                duration = voiceDuration;
            }
        }
        return duration;
    }
}
Bar._globalBarId = 0;
var Clef;
(function (Clef) {
    Clef[Clef["Neutral"] = 0] = "Neutral";
    Clef[Clef["C3"] = 1] = "C3";
    Clef[Clef["C4"] = 2] = "C4";
    Clef[Clef["F4"] = 3] = "F4";
    Clef[Clef["G2"] = 4] = "G2";
})(Clef || (Clef = {}));
class Chord {
    constructor() {
        this.name = '';
        this.firstFret = 1;
        this.strings = [];
        this.barreFrets = [];
        this.showName = true;
        this.showDiagram = true;
        this.showFingering = true;
    }
    get uniqueId() {
        const properties = [
            this.name,
            this.firstFret.toString(),
            this.strings.join(','),
            this.barreFrets.join(','),
            this.showDiagram.toString(),
            this.showFingering.toString(),
            this.showName.toString()
        ];
        return properties.join('|');
    }
}
class Tuning {
    constructor(name = '', tuning = null, isStandard = false) {
        this.isStandard = isStandard;
        this.name = name;
        this.tunings = tuning ?? [];
    }
    static getTextForTuning(tuning, includeOctave) {
        const parts = Tuning.getTextPartsForTuning(tuning);
        return includeOctave ? parts.join('') : parts[0];
    }
    static getTextPartsForTuning(tuning, octaveShift = -1) {
        const octave = (tuning / 12) | 0;
        const note = tuning % 12;
        const notes = Tuning.noteNames;
        return [notes[note], (octave + octaveShift).toString()];
    }
    static getDefaultTuningFor(stringCount) {
        if (Tuning._defaultTunings.has(stringCount)) {
            return Tuning._defaultTunings.get(stringCount);
        }
        return null;
    }
    static getPresetsFor(stringCount) {
        switch (stringCount) {
            case 7:
                return Tuning._sevenStrings;
            case 6:
                return Tuning._sixStrings;
            case 5:
                return Tuning._fiveStrings;
            case 4:
                return Tuning._fourStrings;
        }
        return [];
    }
    static initialize() {
        Tuning._defaultTunings.set(7, new Tuning('Guitar 7 strings', [64, 59, 55, 50, 45, 40, 35], true));
        Tuning._sevenStrings.push(Tuning._defaultTunings.get(7));
        Tuning._defaultTunings.set(6, new Tuning('Guitar Standard Tuning', [64, 59, 55, 50, 45, 40], true));
        Tuning._sixStrings.push(Tuning._defaultTunings.get(6));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down ½ step', [63, 58, 54, 49, 44, 39], false));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down 1 step', [62, 57, 53, 48, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down 2 step', [60, 55, 51, 46, 41, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped D Tuning', [64, 59, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped D Tuning variant', [64, 57, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Double Dropped D Tuning', [62, 59, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped E Tuning', [66, 61, 57, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped C Tuning', [62, 57, 53, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open C Tuning', [64, 60, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Cm Tuning', [63, 60, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open C6 Tuning', [64, 57, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Cmaj7 Tuning', [64, 59, 55, 52, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D Tuning', [62, 57, 54, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Dm Tuning', [62, 57, 53, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D5 Tuning', [62, 57, 50, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D6 Tuning', [62, 59, 54, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Dsus4 Tuning', [62, 57, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open E Tuning', [64, 59, 56, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Em Tuning', [64, 59, 55, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Esus11 Tuning', [64, 59, 55, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open F Tuning', [65, 60, 53, 48, 45, 41], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open G Tuning', [62, 59, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Gm Tuning', [62, 58, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open G6 Tuning', [64, 59, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Gsus4 Tuning', [62, 60, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open A Tuning', [64, 61, 57, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Am Tuning', [64, 60, 57, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Nashville Tuning', [64, 59, 67, 62, 57, 52], false));
        Tuning._sixStrings.push(new Tuning('Bass 6 Strings Tuning', [48, 43, 38, 33, 28, 23], false));
        Tuning._sixStrings.push(new Tuning('Lute or Vihuela Tuning', [64, 59, 54, 50, 45, 40], false));
        Tuning._defaultTunings.set(5, new Tuning('Bass 5 Strings Tuning', [43, 38, 33, 28, 23], true));
        Tuning._fiveStrings.push(Tuning._defaultTunings.get(5));
        Tuning._fiveStrings.push(new Tuning('Banjo Dropped C Tuning', [62, 59, 55, 48, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo Open D Tuning', [62, 57, 54, 50, 69], false));
        Tuning._fiveStrings.push(new Tuning('Banjo Open G Tuning', [62, 59, 55, 50, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo G Minor Tuning', [62, 58, 55, 50, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo G Modal Tuning', [62, 57, 55, 50, 67], false));
        Tuning._defaultTunings.set(4, new Tuning('Bass Standard Tuning', [43, 38, 33, 28], true));
        Tuning._fourStrings.push(Tuning._defaultTunings.get(4));
        Tuning._fourStrings.push(new Tuning('Bass Tune down ½ step', [42, 37, 32, 27], false));
        Tuning._fourStrings.push(new Tuning('Bass Tune down 1 step', [41, 36, 31, 26], false));
        Tuning._fourStrings.push(new Tuning('Bass Tune down 2 step', [39, 34, 29, 24], false));
        Tuning._fourStrings.push(new Tuning('Bass Dropped D Tuning', [43, 38, 33, 26], false));
        Tuning._fourStrings.push(new Tuning('Ukulele C Tuning', [45, 40, 36, 43], false));
        Tuning._fourStrings.push(new Tuning('Ukulele G Tuning', [52, 47, 43, 38], false));
        Tuning._fourStrings.push(new Tuning('Mandolin Standard Tuning', [64, 57, 50, 43], false));
        Tuning._fourStrings.push(new Tuning('Mandolin or Violin Tuning', [76, 69, 62, 55], false));
        Tuning._fourStrings.push(new Tuning('Viola Tuning', [69, 62, 55, 48], false));
        Tuning._fourStrings.push(new Tuning('Cello Tuning', [57, 50, 43, 36], false));
    }
    static findTuning(strings) {
        const tunings = Tuning.getPresetsFor(strings.length);
        for (let t = 0, tc = tunings.length; t < tc; t++) {
            const tuning = tunings[t];
            let equals = true;
            for (let i = 0, j = strings.length; i < j; i++) {
                if (strings[i] !== tuning.tunings[i]) {
                    equals = false;
                    break;
                }
            }
            if (equals) {
                return tuning;
            }
        }
        return null;
    }
    finish() {
        const knownTuning = Tuning.findTuning(this.tunings);
        if (knownTuning) {
            if (this.name.length === 0) {
                this.name = knownTuning.name;
            }
            this.isStandard = knownTuning.isStandard;
        }
    }
}
Tuning._sevenStrings = [];
Tuning._sixStrings = [];
Tuning._fiveStrings = [];
Tuning._fourStrings = [];
Tuning._defaultTunings = new Map();
Tuning.noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
Tuning.initialize();
class TuningParseResult {
    constructor() {
        this.note = null;
        this.tone = new TuningParseResultTone();
        this.octave = 0;
    }
    get realValue() {
        return this.octave * 12 + this.tone.noteValue;
    }
}
class TuningParseResultTone {
    constructor(noteValue = 0, accidentalMode = NoteAccidentalMode.Default) {
        this.noteValue = noteValue;
        this.accidentalMode = accidentalMode;
    }
}
class ModelUtils {
    static getIndex(duration) {
        const index = 0;
        const value = duration;
        if (value < 0) {
            return index;
        }
        return Math.log2(duration) | 0;
    }
    static keySignatureIsFlat(ks) {
        return ks < 0;
    }
    static keySignatureIsNatural(ks) {
        return ks === 0;
    }
    static keySignatureIsSharp(ks) {
        return ks > 0;
    }
    static applyPitchOffsets(settings, score) {
        for (let i = 0; i < score.tracks.length; i++) {
            if (i < settings.notation.displayTranspositionPitches.length) {
                for (const staff of score.tracks[i].staves) {
                    staff.displayTranspositionPitch = -settings.notation.displayTranspositionPitches[i];
                }
            }
            if (i < settings.notation.transpositionPitches.length) {
                for (const staff of score.tracks[i].staves) {
                    staff.transpositionPitch = -settings.notation.transpositionPitches[i];
                }
            }
        }
    }
    static isTuning(name) {
        return !!ModelUtils.parseTuning(name);
    }
    static parseTuning(name) {
        let note = '';
        let octave = '';
        for (let i = 0; i < name.length; i++) {
            const c = name.charCodeAt(i);
            if (c >= 0x30 && c <= 0x39) {
                if (!note) {
                    return null;
                }
                octave += String.fromCharCode(c);
            }
            else if (ModelUtils.TuningLetters.has(c)) {
                note += String.fromCharCode(c);
            }
            else {
                return null;
            }
        }
        if (!octave || !note) {
            return null;
        }
        const result = new TuningParseResult();
        result.octave = Number.parseInt(octave, 10) + 1;
        result.note = note.toLowerCase();
        result.tone = ModelUtils.getToneForText(result.note);
        if (result.tone.noteValue < 0) {
            result.octave--;
            result.tone.noteValue += 12;
        }
        return result;
    }
    static getTuningForText(str) {
        const result = ModelUtils.parseTuning(str);
        if (!result) {
            return -1;
        }
        return result.realValue;
    }
    static getToneForText(note) {
        const noteName = note.substring(0, 1);
        const accidental = note.substring(1);
        let noteValue;
        let noteAccidenalMode;
        switch (noteName.toLowerCase()) {
            case 'c':
                noteValue = 0;
                break;
            case 'd':
                noteValue = 2;
                break;
            case 'e':
                noteValue = 4;
                break;
            case 'f':
                noteValue = 5;
                break;
            case 'g':
                noteValue = 7;
                break;
            case 'a':
                noteValue = 9;
                break;
            case 'b':
                noteValue = 11;
                break;
            default:
                noteValue = 0;
                break;
        }
        noteAccidenalMode = ModelUtils.parseAccidentalMode(accidental);
        switch (noteAccidenalMode) {
            case NoteAccidentalMode.Default:
                break;
            case NoteAccidentalMode.ForceNone:
                break;
            case NoteAccidentalMode.ForceNatural:
                break;
            case NoteAccidentalMode.ForceSharp:
                noteValue++;
                break;
            case NoteAccidentalMode.ForceDoubleSharp:
                noteValue += 2;
                break;
            case NoteAccidentalMode.ForceFlat:
                noteValue--;
                break;
            case NoteAccidentalMode.ForceDoubleFlat:
                noteValue -= 2;
                break;
        }
        return new TuningParseResultTone(noteValue, noteAccidenalMode);
    }
    static parseAccidentalMode(data) {
        const key = data.toLowerCase();
        if (ModelUtils.accidentalModeMapping.has(key)) {
            return ModelUtils.accidentalModeMapping.get(key);
        }
        return NoteAccidentalMode.Default;
    }
    static newGuid() {
        return `${Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)}-${Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)}-${Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)}-${Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)}-${Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)}${Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)}${Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)}`;
    }
    static isAlmostEqualTo(a, b) {
        return Math.abs(a - b) < 0.00001;
    }
    static toHexString(n, digits = 0) {
        let s = '';
        const hexChars = '0123456789ABCDEF';
        do {
            s = String.fromCharCode(hexChars.charCodeAt(n & 15)) + s;
            n = n >> 4;
        } while (n > 0);
        while (s.length < digits) {
            s = `0${s}`;
        }
        return s;
    }
    static getAlternateEndingsList(bitflag) {
        const endings = [];
        for (let i = 0; i < MasterBar.MaxAlternateEndings; i++) {
            if ((bitflag & (0x01 << i)) !== 0) {
                endings.push(i);
            }
        }
        return endings;
    }
    static deltaFretToHarmonicValue(deltaFret) {
        switch (deltaFret) {
            case 2:
                return 2.4;
            case 3:
                return 3.2;
            case 4:
            case 5:
            case 7:
            case 9:
            case 12:
            case 16:
            case 17:
            case 19:
            case 24:
                return deltaFret;
            case 8:
                return 8.2;
            case 10:
                return 9.6;
            case 14:
            case 15:
                return 14.7;
            case 21:
            case 22:
                return 21.7;
            default:
                return 12;
        }
    }
    static clamp(value, min, max) {
        if (value <= min) {
            return min;
        }
        if (value >= max) {
            return max;
        }
        return value;
    }
    static buildMultiBarRestInfo(tracks, startIndex, endIndexInclusive) {
        if (!tracks) {
            return null;
        }
        const lookup = new Map();
        const score = tracks[0].score;
        let currentIndex = startIndex;
        let tempo = score.tempo;
        while (currentIndex <= endIndexInclusive) {
            const currentGroupStartIndex = currentIndex;
            let currentGroup = null;
            while (currentIndex <= endIndexInclusive) {
                const masterBar = score.masterBars[currentIndex];
                let hasTempoChange = false;
                for (const a of masterBar.tempoAutomations) {
                    if (a.value !== tempo) {
                        hasTempoChange = true;
                    }
                    tempo = a.value;
                }
                if (masterBar.alternateEndings ||
                    (masterBar.isRepeatStart && masterBar.index !== currentGroupStartIndex) ||
                    masterBar.isFreeTime ||
                    masterBar.isAnacrusis ||
                    masterBar.section !== null ||
                    (masterBar.index !== currentGroupStartIndex && hasTempoChange) ||
                    (masterBar.fermata !== null && masterBar.fermata.size > 0) ||
                    (masterBar.directions !== null && masterBar.directions.size > 0)) {
                    break;
                }
                if (currentGroupStartIndex > startIndex &&
                    masterBar.previousMasterBar &&
                    (masterBar.timeSignatureCommon !== masterBar.previousMasterBar.timeSignatureCommon ||
                        masterBar.timeSignatureNumerator !== masterBar.previousMasterBar.timeSignatureNumerator ||
                        masterBar.timeSignatureDenominator !== masterBar.previousMasterBar.timeSignatureDenominator ||
                        masterBar.tripletFeel !== masterBar.previousMasterBar.tripletFeel)) {
                    break;
                }
                let areAllBarsSuitable = true;
                for (const t of tracks) {
                    for (const s of t.staves) {
                        const bar = s.bars[masterBar.index];
                        if (!bar.isRestOnly) {
                            areAllBarsSuitable = false;
                            break;
                        }
                        if (bar.index > 0 &&
                            (bar.keySignature !== bar.previousBar.keySignature ||
                                bar.keySignatureType !== bar.previousBar.keySignatureType)) {
                            areAllBarsSuitable = false;
                            break;
                        }
                    }
                    if (!areAllBarsSuitable) {
                        break;
                    }
                }
                if (!areAllBarsSuitable) {
                    break;
                }
                currentIndex++;
                if (masterBar.index > currentGroupStartIndex) {
                    if (currentGroup === null) {
                        currentGroup = [masterBar.index];
                    }
                    else {
                        currentGroup.push(masterBar.index);
                    }
                }
                if (masterBar.isRepeatEnd) {
                    break;
                }
            }
            if (currentGroup) {
                lookup.set(currentGroupStartIndex, currentGroup);
            }
            else {
                currentIndex++;
            }
        }
        return lookup;
    }
    static consolidate(score) {
        if (score.masterBars.length === 0) {
            const master = new MasterBar();
            score.addMasterBar(master);
            const tempoAutomation = new Automation();
            tempoAutomation.isLinear = false;
            tempoAutomation.type = AutomationType.Tempo;
            tempoAutomation.value = score.tempo;
            master.tempoAutomations.push(tempoAutomation);
            const bar = new Bar();
            score.tracks[0].staves[0].addBar(bar);
            const v = new Voice();
            bar.addVoice(v);
            const emptyBeat = new Beat();
            emptyBeat.isEmpty = true;
            v.addBeat(emptyBeat);
            return;
        }
        const usedChannels = new Set([SynthConstants.PercussionChannel]);
        for (const track of score.tracks) {
            if (track.staves.length === 1 && track.staves[0].isPercussion) {
                track.playbackInfo.primaryChannel = SynthConstants.PercussionChannel;
                track.playbackInfo.secondaryChannel = SynthConstants.PercussionChannel;
            }
            else {
                if (track.playbackInfo.primaryChannel !== SynthConstants.PercussionChannel) {
                    while (usedChannels.has(track.playbackInfo.primaryChannel)) {
                        track.playbackInfo.primaryChannel++;
                    }
                }
                usedChannels.add(track.playbackInfo.primaryChannel);
                if (track.playbackInfo.secondaryChannel !== SynthConstants.PercussionChannel) {
                    while (usedChannels.has(track.playbackInfo.secondaryChannel)) {
                        track.playbackInfo.secondaryChannel++;
                    }
                }
                usedChannels.add(track.playbackInfo.secondaryChannel);
            }
            for (const staff of track.staves) {
                for (const b of staff.bars) {
                    for (const v of b.voices) {
                        if (v.isEmpty && v.beats.length === 0) {
                            const emptyBeat = new Beat();
                            emptyBeat.isEmpty = true;
                            v.addBeat(emptyBeat);
                        }
                    }
                }
                const voiceCount = staff.bars.length === 0 ? 1 : staff.bars[0].voices.length;
                while (staff.bars.length < score.masterBars.length) {
                    const bar = new Bar();
                    staff.addBar(bar);
                    const previousBar = bar.previousBar;
                    if (previousBar) {
                        bar.clef = previousBar.clef;
                        bar.clefOttava = previousBar.clefOttava;
                        bar.keySignature = bar.previousBar.keySignature;
                        bar.keySignatureType = bar.previousBar.keySignatureType;
                    }
                    for (let i = 0; i < voiceCount; i++) {
                        const v = new Voice();
                        bar.addVoice(v);
                        const emptyBeat = new Beat();
                        emptyBeat.isEmpty = true;
                        v.addBeat(emptyBeat);
                    }
                }
            }
        }
    }
    static trimEmptyBarsAtEnd(score) {
        while (score.masterBars.length > 1) {
            const barIndex = score.masterBars.length - 1;
            const masterBar = score.masterBars[barIndex];
            if (masterBar.hasChanges) {
                return;
            }
            for (const track of score.tracks) {
                for (const staff of track.staves) {
                    if (barIndex < staff.bars.length) {
                        const bar = staff.bars[barIndex];
                        if (!bar.isEmpty || bar.hasChanges) {
                            return;
                        }
                    }
                }
            }
            for (const track of score.tracks) {
                for (const staff of track.staves) {
                    if (barIndex < staff.bars.length) {
                        const bar = staff.bars[barIndex];
                        staff.bars.pop();
                        bar.previousBar.nextBar = null;
                    }
                }
            }
            score.masterBars.pop();
            masterBar.previousMasterBar.nextMasterBar = null;
        }
    }
    static flooredDivision(a, b) {
        return a - b * Math.floor(a / b);
    }
    static translateKeyTransposeTable(texts) {
        const keySignatures = [];
        for (const transpose of texts) {
            const transposeValues = [];
            keySignatures.push(transposeValues);
            for (const keySignatureText of transpose) {
                const keySignature = (Number.parseInt(keySignatureText.charAt(0), 10) *
                    (keySignatureText.charAt(1) === 'b' ? -1 : 1));
                transposeValues.push(keySignature);
            }
        }
        return keySignatures;
    }
    static transposeKey(keySignature, transpose) {
        if (transpose === 0) {
            return keySignature;
        }
        if (transpose < 0) {
            const lookup = ModelUtils.keyTransposeTable[-transpose];
            const keySignatureIndex = lookup.indexOf(keySignature);
            if (keySignatureIndex === -1) {
                return keySignature;
            }
            return (keySignatureIndex - 7);
        }
        else {
            return ModelUtils.keyTransposeTable[transpose][keySignature + 7];
        }
    }
}
ModelUtils.TuningLetters = new Set([
    0x43, 0x44, 0x45, 0x46, 0x47, 0x41, 0x42, 0x63,
    0x64, 0x65, 0x66, 0x67, 0x61, 0x62, 0x23
]);
ModelUtils.accidentalModeMapping = new Map([
    ['default', NoteAccidentalMode.Default],
    ['d', NoteAccidentalMode.Default],
    ['forcenone', NoteAccidentalMode.ForceNone],
    ['-', NoteAccidentalMode.ForceNone],
    ['forcenatural', NoteAccidentalMode.ForceNatural],
    ['n', NoteAccidentalMode.ForceNatural],
    ['forcesharp', NoteAccidentalMode.ForceSharp],
    ['#', NoteAccidentalMode.ForceSharp],
    ['forcedoublesharp', NoteAccidentalMode.ForceDoubleSharp],
    ['##', NoteAccidentalMode.ForceDoubleSharp],
    ['x', NoteAccidentalMode.ForceDoubleSharp],
    ['forceflat', NoteAccidentalMode.ForceFlat],
    ['b', NoteAccidentalMode.ForceFlat],
    ['forcedoubleflat', NoteAccidentalMode.ForceDoubleFlat],
    ['bb', NoteAccidentalMode.ForceDoubleFlat]
]);
ModelUtils.displayTranspositionPitches = new Map([
    [24, -12],
    [25, -12],
    [26, -12],
    [27, -12],
    [28, -12],
    [29, -12],
    [30, -12],
    [31, -12],
    [32, -12],
    [33, -12],
    [34, -12],
    [35, -12],
    [36, -12],
    [37, -12],
    [38, -12],
    [39, -12],
    [43, -12]
]);
ModelUtils.keyTransposeTable = ModelUtils.translateKeyTransposeTable([
    ['7b', '6b', '5b', '4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#', '6#', '7#'],
    ['2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#', '6#', '7#', '4b', '3b', '2b', '1b', '0#'],
    ['3#', '4#', '7b', '6b', '5b', '4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#'],
    ['4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#', '6#', '7#', '4b', '3b', '2b'],
    ['1#', '2#', '3#', '4#', '7b', '6b', '5b', '4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#'],
    ['6b', '5b', '4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#', '6#', '7#', '4b'],
    ['1b', '0#', '1#', '2#', '3#', '4#', '7b', '6#', '7#', '4b', '3b', '2b', '1b', '0#', '1#'],
    ['4#', '7b', '6b', '5b', '4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#', '6#'],
    ['3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#', '6#', '7#', '4b', '3b', '2b', '1b'],
    ['2#', '3#', '4#', '7b', '6b', '5b', '4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#'],
    ['5b', '4b', '3b', '2b', '1b', '0#', '1#', '2#', '3#', '4#', '5#', '6#', '7#', '4b', '3b'],
    ['0#', '1#', '2#', '3#', '4#', '7b', '6b', '6#', '4b', '3b', '2b', '1b', '0#', '1#', '2#']
]);
ModelUtils.KeySignatureLookup = [
    [true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, false, true, true, true, true, true, true],
    [false, true, true, true, true, false, true, true, true, true, true, true],
    [false, true, true, true, true, false, false, false, true, true, true, true],
    [false, false, false, true, true, false, false, false, true, true, true, true],
    [false, false, false, true, true, false, false, false, false, false, true, true],
    [false, false, false, false, false, false, false, false, false, false, true, true],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, true, true, false, false, false, false, false],
    [true, true, false, false, false, true, true, false, false, false, false, false],
    [true, true, false, false, false, true, true, true, true, false, false, false],
    [true, true, true, true, false, true, true, true, true, false, false, false],
    [true, true, true, true, false, true, true, true, true, true, true, false],
    [true, true, true, true, true, true, true, true, true, true, true, false],
    [true, true, true, true, true, true, true, true, true, true, true, true]
];
ModelUtils.AccidentalNotes = [
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    false
];
class GraceGroup {
    constructor() {
        this.beats = [];
        this.id = 'empty';
        this.isComplete = false;
    }
    addBeat(beat) {
        beat.graceIndex = this.beats.length;
        beat.graceGroup = this;
        this.beats.push(beat);
    }
    finish() {
        if (this.beats.length > 0) {
            this.id = `${this.beats[0].absoluteDisplayStart}_${this.beats[0].voice.index}`;
        }
    }
}
var GraceType;
(function (GraceType) {
    GraceType[GraceType["None"] = 0] = "None";
    GraceType[GraceType["OnBeat"] = 1] = "OnBeat";
    GraceType[GraceType["BeforeBeat"] = 2] = "BeforeBeat";
    GraceType[GraceType["BendGrace"] = 3] = "BendGrace";
})(GraceType || (GraceType = {}));
var CrescendoType;
(function (CrescendoType) {
    CrescendoType[CrescendoType["None"] = 0] = "None";
    CrescendoType[CrescendoType["Crescendo"] = 1] = "Crescendo";
    CrescendoType[CrescendoType["Decrescendo"] = 2] = "Decrescendo";
})(CrescendoType || (CrescendoType = {}));
var FadeType;
(function (FadeType) {
    FadeType[FadeType["None"] = 0] = "None";
    FadeType[FadeType["FadeIn"] = 1] = "FadeIn";
    FadeType[FadeType["FadeOut"] = 2] = "FadeOut";
    FadeType[FadeType["VolumeSwell"] = 3] = "VolumeSwell";
})(FadeType || (FadeType = {}));
var Rasgueado;
(function (Rasgueado) {
    Rasgueado[Rasgueado["None"] = 0] = "None";
    Rasgueado[Rasgueado["Ii"] = 1] = "Ii";
    Rasgueado[Rasgueado["Mi"] = 2] = "Mi";
    Rasgueado[Rasgueado["MiiTriplet"] = 3] = "MiiTriplet";
    Rasgueado[Rasgueado["MiiAnapaest"] = 4] = "MiiAnapaest";
    Rasgueado[Rasgueado["PmpTriplet"] = 5] = "PmpTriplet";
    Rasgueado[Rasgueado["PmpAnapaest"] = 6] = "PmpAnapaest";
    Rasgueado[Rasgueado["PeiTriplet"] = 7] = "PeiTriplet";
    Rasgueado[Rasgueado["PeiAnapaest"] = 8] = "PeiAnapaest";
    Rasgueado[Rasgueado["PaiTriplet"] = 9] = "PaiTriplet";
    Rasgueado[Rasgueado["PaiAnapaest"] = 10] = "PaiAnapaest";
    Rasgueado[Rasgueado["AmiTriplet"] = 11] = "AmiTriplet";
    Rasgueado[Rasgueado["AmiAnapaest"] = 12] = "AmiAnapaest";
    Rasgueado[Rasgueado["Ppp"] = 13] = "Ppp";
    Rasgueado[Rasgueado["Amii"] = 14] = "Amii";
    Rasgueado[Rasgueado["Amip"] = 15] = "Amip";
    Rasgueado[Rasgueado["Eami"] = 16] = "Eami";
    Rasgueado[Rasgueado["Eamii"] = 17] = "Eamii";
    Rasgueado[Rasgueado["Peami"] = 18] = "Peami";
})(Rasgueado || (Rasgueado = {}));
var BrushType;
(function (BrushType) {
    BrushType[BrushType["None"] = 0] = "None";
    BrushType[BrushType["BrushUp"] = 1] = "BrushUp";
    BrushType[BrushType["BrushDown"] = 2] = "BrushDown";
    BrushType[BrushType["ArpeggioUp"] = 3] = "ArpeggioUp";
    BrushType[BrushType["ArpeggioDown"] = 4] = "ArpeggioDown";
})(BrushType || (BrushType = {}));
class TupletGroup {
    constructor(voice) {
        this._isEqualLengthTuplet = true;
        this.totalDuration = 0;
        this.beats = [];
        this.isFull = false;
        this.voice = voice;
    }
    check(beat) {
        if (this.beats.length === 0) {
            this.beats.push(beat);
            this.totalDuration += beat.playbackDuration;
            return true;
        }
        if (beat.graceType !== GraceType.None) {
            return true;
        }
        if (beat.voice !== this.voice ||
            this.isFull ||
            beat.tupletNumerator !== this.beats[0].tupletNumerator ||
            beat.tupletDenominator !== this.beats[0].tupletDenominator) {
            return false;
        }
        if (beat.playbackDuration !== this.beats[0].playbackDuration) {
            this._isEqualLengthTuplet = false;
        }
        this.beats.push(beat);
        this.totalDuration += beat.playbackDuration;
        if (this._isEqualLengthTuplet) {
            if (this.beats.length === this.beats[0].tupletNumerator) {
                this.isFull = true;
            }
        }
        else {
            const factor = (this.beats[0].tupletNumerator / this.beats[0].tupletDenominator) | 0;
            for (const potentialMatch of TupletGroup.AllTicks) {
                if (this.totalDuration === potentialMatch * factor) {
                    this.isFull = true;
                    break;
                }
            }
        }
        return true;
    }
}
TupletGroup.HalfTicks = 1920;
TupletGroup.QuarterTicks = 960;
TupletGroup.EighthTicks = 480;
TupletGroup.SixteenthTicks = 240;
TupletGroup.ThirtySecondTicks = 120;
TupletGroup.SixtyFourthTicks = 60;
TupletGroup.OneHundredTwentyEighthTicks = 30;
TupletGroup.TwoHundredFiftySixthTicks = 15;
TupletGroup.AllTicks = [
    TupletGroup.HalfTicks,
    TupletGroup.QuarterTicks,
    TupletGroup.EighthTicks,
    TupletGroup.SixteenthTicks,
    TupletGroup.ThirtySecondTicks,
    TupletGroup.SixtyFourthTicks,
    TupletGroup.OneHundredTwentyEighthTicks,
    TupletGroup.TwoHundredFiftySixthTicks
];
var WhammyType;
(function (WhammyType) {
    WhammyType[WhammyType["None"] = 0] = "None";
    WhammyType[WhammyType["Custom"] = 1] = "Custom";
    WhammyType[WhammyType["Dive"] = 2] = "Dive";
    WhammyType[WhammyType["Dip"] = 3] = "Dip";
    WhammyType[WhammyType["Hold"] = 4] = "Hold";
    WhammyType[WhammyType["Predive"] = 5] = "Predive";
    WhammyType[WhammyType["PrediveDive"] = 6] = "PrediveDive";
})(WhammyType || (WhammyType = {}));
var GolpeType;
(function (GolpeType) {
    GolpeType[GolpeType["None"] = 0] = "None";
    GolpeType[GolpeType["Thumb"] = 1] = "Thumb";
    GolpeType[GolpeType["Finger"] = 2] = "Finger";
})(GolpeType || (GolpeType = {}));
var WahPedal;
(function (WahPedal) {
    WahPedal[WahPedal["None"] = 0] = "None";
    WahPedal[WahPedal["Open"] = 1] = "Open";
    WahPedal[WahPedal["Closed"] = 2] = "Closed";
})(WahPedal || (WahPedal = {}));
var BarreShape;
(function (BarreShape) {
    BarreShape[BarreShape["None"] = 0] = "None";
    BarreShape[BarreShape["Full"] = 1] = "Full";
    BarreShape[BarreShape["Half"] = 2] = "Half";
})(BarreShape || (BarreShape = {}));
var LyricsState;
(function (LyricsState) {
    LyricsState[LyricsState["IgnoreSpaces"] = 0] = "IgnoreSpaces";
    LyricsState[LyricsState["Begin"] = 1] = "Begin";
    LyricsState[LyricsState["Text"] = 2] = "Text";
    LyricsState[LyricsState["Comment"] = 3] = "Comment";
    LyricsState[LyricsState["Dash"] = 4] = "Dash";
})(LyricsState || (LyricsState = {}));
class Lyrics {
    constructor() {
        this.startBar = 0;
        this.text = '';
    }
    finish(skipEmptyEntries = false) {
        this.chunks = [];
        this.parse(this.text, 0, this.chunks, skipEmptyEntries);
    }
    parse(str, p, _chunks, skipEmptyEntries) {
        if (!str) {
            return;
        }
        let state = LyricsState.Begin;
        let next = LyricsState.Begin;
        let skipSpace = false;
        let start = 0;
        while (p < str.length) {
            const c = str.charCodeAt(p);
            switch (state) {
                case LyricsState.IgnoreSpaces:
                    switch (c) {
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeTab:
                            break;
                        case Lyrics.CharCodeSpace:
                            if (!skipSpace) {
                                state = next;
                                continue;
                            }
                            break;
                        default:
                            skipSpace = false;
                            state = next;
                            continue;
                    }
                    break;
                case LyricsState.Begin:
                    switch (c) {
                        case Lyrics.CharCodeBrackedOpen:
                            state = LyricsState.Comment;
                            break;
                        default:
                            start = p;
                            state = LyricsState.Text;
                            continue;
                    }
                    break;
                case LyricsState.Comment:
                    switch (c) {
                        case Lyrics.CharCodeBrackedClose:
                            state = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Text:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            state = LyricsState.Dash;
                            break;
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeSpace:
                            const txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Dash:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            break;
                        default:
                            const txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            skipSpace = true;
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            continue;
                    }
                    break;
            }
            p += 1;
        }
        if (state === LyricsState.Text) {
            if (p !== start) {
                this.addChunk(str.substr(start, p - start), skipEmptyEntries);
            }
        }
    }
    addChunk(txt, skipEmptyEntries) {
        txt = this.prepareChunk(txt);
        if (!skipEmptyEntries || (txt.length > 0 && txt !== '-')) {
            this.chunks.push(txt);
        }
    }
    prepareChunk(txt) {
        const chunk = txt.split('+').join(' ');
        let endLength = chunk.length;
        while (endLength > 0 && chunk.charAt(endLength - 1) === '_') {
            endLength--;
        }
        return endLength !== chunk.length ? chunk.substr(0, endLength) : chunk;
    }
}
Lyrics.CharCodeLF = 10;
Lyrics.CharCodeTab = 9;
Lyrics.CharCodeCR = 13;
Lyrics.CharCodeSpace = 32;
Lyrics.CharCodeBrackedClose = 93;
Lyrics.CharCodeBrackedOpen = 91;
Lyrics.CharCodeDash = 45;
var SimileMark;
(function (SimileMark) {
    SimileMark[SimileMark["None"] = 0] = "None";
    SimileMark[SimileMark["Simple"] = 1] = "Simple";
    SimileMark[SimileMark["FirstOfDouble"] = 2] = "FirstOfDouble";
    SimileMark[SimileMark["SecondOfDouble"] = 3] = "SecondOfDouble";
})(SimileMark || (SimileMark = {}));
class Color {
    constructor(r, g, b, a = 0xff) {
        this.raw = 0;
        this.raw = ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
        this.updateRgba();
    }
    updateRgba() {
        if (this.a === 0xff) {
            this.rgba = `#${ModelUtils.toHexString(this.r, 2)}${ModelUtils.toHexString(this.g, 2)}${ModelUtils.toHexString(this.b, 2)}`;
        }
        else {
            this.rgba = `rgba(${this.r},${this.g},${this.b},${this.a / 255.0})`;
        }
    }
    get a() {
        return (this.raw >> 24) & 0xff;
    }
    get r() {
        return (this.raw >> 16) & 0xff;
    }
    get g() {
        return (this.raw >> 8) & 0xff;
    }
    get b() {
        return this.raw & 0xff;
    }
    static random(opacity = 100) {
        return new Color((Math.random() * 255) | 0, (Math.random() * 255) | 0, (Math.random() * 255) | 0, opacity);
    }
    static fromJson(v) {
        if (v instanceof Color) {
            return v;
        }
        switch (typeof v) {
            case 'number': {
                const c = new Color(0, 0, 0, 0);
                c.raw = v;
                c.updateRgba();
                return c;
            }
            case 'string': {
                const json = v;
                if (json.startsWith('#')) {
                    if (json.length === 4) {
                        return new Color(Number.parseInt(json[1], 16) * 17, Number.parseInt(json[2], 16) * 17, Number.parseInt(json[3], 16) * 17);
                    }
                    if (json.length === 5) {
                        return new Color(Number.parseInt(json[1], 16) * 17, Number.parseInt(json[2], 16) * 17, Number.parseInt(json[3], 16) * 17, Number.parseInt(json[4], 16) * 17);
                    }
                    if (json.length === 7) {
                        return new Color(Number.parseInt(json.substring(1, 3), 16), Number.parseInt(json.substring(3, 5), 16), Number.parseInt(json.substring(5, 7), 16));
                    }
                    if (json.length === 9) {
                        return new Color(Number.parseInt(json.substring(1, 3), 16), Number.parseInt(json.substring(3, 5), 16), Number.parseInt(json.substring(5, 7), 16), Number.parseInt(json.substring(7, 9), 16));
                    }
                }
                else if (json.startsWith('rgba') || json.startsWith('rgb')) {
                    const start = json.indexOf('(');
                    const end = json.lastIndexOf(')');
                    if (start === -1 || end === -1) {
                        throw new FormatError('No values specified for rgb/rgba function');
                    }
                    const numbers = json.substring(start + 1, end).split(',');
                    if (numbers.length === 3) {
                        return new Color(Number.parseInt(numbers[0], 10), Number.parseInt(numbers[1], 10), Number.parseInt(numbers[2], 10));
                    }
                    if (numbers.length === 4) {
                        return new Color(Number.parseInt(numbers[0], 10), Number.parseInt(numbers[1], 10), Number.parseInt(numbers[2], 10), Number.parseFloat(numbers[3]) * 255);
                    }
                }
                return null;
            }
        }
        throw new FormatError('Unsupported format for color');
    }
    static toJson(obj) {
        return obj === null ? null : obj.raw;
    }
}
Color.BlackRgb = '#000000';
class PlaybackInformation {
    constructor() {
        this.volume = 15;
        this.balance = 8;
        this.port = 1;
        this.program = 0;
        this.bank = 0;
        this.primaryChannel = 0;
        this.secondaryChannel = 0;
        this.isMute = false;
        this.isSolo = false;
    }
}
var TechniqueSymbolPlacement;
(function (TechniqueSymbolPlacement) {
    TechniqueSymbolPlacement[TechniqueSymbolPlacement["Above"] = 0] = "Above";
    TechniqueSymbolPlacement[TechniqueSymbolPlacement["Inside"] = 1] = "Inside";
    TechniqueSymbolPlacement[TechniqueSymbolPlacement["Below"] = 2] = "Below";
    TechniqueSymbolPlacement[TechniqueSymbolPlacement["Outside"] = 3] = "Outside";
})(TechniqueSymbolPlacement || (TechniqueSymbolPlacement = {}));
class InstrumentArticulation {
    constructor(elementType = '', staffLine = 0, outputMidiNumber = 0) {
        this.elementType = elementType;
        this.outputMidiNumber = outputMidiNumber;
        this.staffLine = staffLine;
    }
}
class BackingTrack {
}
class PercussionMapper {
    static articulationFromElementVariation(element, variation) {
        if (element < PercussionMapper.gp6ElementAndVariationToArticulation.length) {
            if (variation >= PercussionMapper.gp6ElementAndVariationToArticulation.length) {
                variation = 0;
            }
            return PercussionMapper.gp6ElementAndVariationToArticulation[element][variation];
        }
        return 38;
    }
    static getArticulationName(n) {
        const articulation = PercussionMapper.getArticulation(n);
        let input = n.percussionArticulation;
        if (articulation) {
            input = articulation.outputMidiNumber;
        }
        for (const [name, value] of PercussionMapper.instrumentArticulationNames) {
            if (value === input) {
                return name;
            }
        }
        return 'unknown';
    }
    static getArticulation(n) {
        const articulationIndex = n.percussionArticulation;
        if (articulationIndex < 0) {
            return null;
        }
        const trackArticulations = n.beat.voice.bar.staff.track.percussionArticulations;
        if (articulationIndex < trackArticulations.length) {
            return trackArticulations[articulationIndex];
        }
        return PercussionMapper.getArticulationByInputMidiNumber(articulationIndex);
    }
    static getElementAndVariation(n) {
        const articulation = PercussionMapper.getArticulation(n);
        if (!articulation) {
            return [-1, -1];
        }
        for (let element = 0; element < PercussionMapper.gp6ElementAndVariationToArticulation.length; element++) {
            const variations = PercussionMapper.gp6ElementAndVariationToArticulation[element];
            for (let variation = 0; variation < variations.length; variation++) {
                const gp6Articulation = PercussionMapper.getArticulationByInputMidiNumber(variations[variation]);
                if (gp6Articulation?.outputMidiNumber === articulation.outputMidiNumber) {
                    return [element, variation];
                }
            }
        }
        return [-1, -1];
    }
    static getArticulationByInputMidiNumber(inputMidiNumber) {
        if (PercussionMapper.instrumentArticulations.has(inputMidiNumber)) {
            return PercussionMapper.instrumentArticulations.get(inputMidiNumber);
        }
        return null;
    }
}
PercussionMapper.gp6ElementAndVariationToArticulation = [
    [35, 35, 35],
    [38, 91, 37],
    [99, 100, 99],
    [56, 100, 56],
    [102, 103, 102],
    [43, 43, 43],
    [45, 45, 45],
    [47, 47, 47],
    [48, 48, 48],
    [50, 50, 50],
    [42, 92, 46],
    [44, 44, 44],
    [57, 98, 57],
    [49, 97, 49],
    [55, 95, 55],
    [51, 93, 127],
    [52, 96, 52]
];
PercussionMapper.instrumentArticulations = new Map([
    [
        38,
        new InstrumentArticulation('snare', 3, 38)
    ],
    [
        37,
        new InstrumentArticulation('snare', 3, 37)
    ],
    [
        91,
        new InstrumentArticulation('snare', 3, 38)
    ],
    [
        42,
        new InstrumentArticulation('hiHat', -1, 42)
    ],
    [
        92,
        new InstrumentArticulation('hiHat', -1, 46)
    ],
    [
        46,
        new InstrumentArticulation('hiHat', -1, 46)
    ],
    [
        44,
        new InstrumentArticulation('hiHat', 9, 44)
    ],
    [
        35,
        new InstrumentArticulation('kickDrum', 8, 35)
    ],
    [
        36,
        new InstrumentArticulation('kickDrum', 7, 36)
    ],
    [
        50,
        new InstrumentArticulation('tom', 1, 50)
    ],
    [
        48,
        new InstrumentArticulation('tom', 2, 48)
    ],
    [
        47,
        new InstrumentArticulation('tom', 4, 47)
    ],
    [
        45,
        new InstrumentArticulation('tom', 5, 45)
    ],
    [
        43,
        new InstrumentArticulation('tom', 6, 43)
    ],
    [
        93,
        new InstrumentArticulation('ride', 0, 51)
    ],
    [
        51,
        new InstrumentArticulation('ride', 0, 51)
    ],
    [
        53,
        new InstrumentArticulation('ride', 0, 53)
    ],
    [
        94,
        new InstrumentArticulation('ride', 0, 51)
    ],
    [
        55,
        new InstrumentArticulation('splash', -2, 55)
    ],
    [
        95,
        new InstrumentArticulation('splash', -2, 55)
    ],
    [
        52,
        new InstrumentArticulation('china', -3, 52)
    ],
    [
        96,
        new InstrumentArticulation('china', -3, 52)
    ],
    [
        49,
        new InstrumentArticulation('crash', -2, 49)
    ],
    [
        97,
        new InstrumentArticulation('crash', -2, 49)
    ],
    [
        57,
        new InstrumentArticulation('crash', -1, 57)
    ],
    [
        98,
        new InstrumentArticulation('crash', -1, 57)
    ],
    [
        99,
        new InstrumentArticulation('cowbell', 1, 56)
    ],
    [
        100,
        new InstrumentArticulation('cowbell', 1, 56)
    ],
    [
        56,
        new InstrumentArticulation('cowbell', 0, 56)
    ],
    [
        101,
        new InstrumentArticulation('cowbell', 0, 56)
    ],
    [
        102,
        new InstrumentArticulation('cowbell', -1, 56)
    ],
    [
        103,
        new InstrumentArticulation('cowbell', -1, 56)
    ],
    [
        77,
        new InstrumentArticulation('woodblock', -9, 77)
    ],
    [
        76,
        new InstrumentArticulation('woodblock', -10, 76)
    ],
    [
        60,
        new InstrumentArticulation('bongo', -4, 60)
    ],
    [
        104,
        new InstrumentArticulation('bongo', -5, 60)
    ],
    [
        105,
        new InstrumentArticulation('bongo', -6, 60)
    ],
    [
        61,
        new InstrumentArticulation('bongo', -7, 61)
    ],
    [
        106,
        new InstrumentArticulation('bongo', -8, 61)
    ],
    [
        107,
        new InstrumentArticulation('bongo', -16, 61)
    ],
    [
        66,
        new InstrumentArticulation('timbale', 10, 66)
    ],
    [
        65,
        new InstrumentArticulation('timbale', 9, 65)
    ],
    [
        68,
        new InstrumentArticulation('agogo', 12, 68)
    ],
    [
        67,
        new InstrumentArticulation('agogo', 11, 67)
    ],
    [
        64,
        new InstrumentArticulation('conga', 17, 64)
    ],
    [
        108,
        new InstrumentArticulation('conga', 16, 64)
    ],
    [
        109,
        new InstrumentArticulation('conga', 15, 64)
    ],
    [
        63,
        new InstrumentArticulation('conga', 14, 63)
    ],
    [
        110,
        new InstrumentArticulation('conga', 13, 63)
    ],
    [
        62,
        new InstrumentArticulation('conga', 19, 62)
    ],
    [
        72,
        new InstrumentArticulation('whistle', -11, 72)
    ],
    [
        71,
        new InstrumentArticulation('whistle', -17, 71)
    ],
    [
        73,
        new InstrumentArticulation('guiro', 38, 73)
    ],
    [
        74,
        new InstrumentArticulation('guiro', 37, 74)
    ],
    [
        86,
        new InstrumentArticulation('surdo', 36, 86)
    ],
    [
        87,
        new InstrumentArticulation('surdo', 35, 87)
    ],
    [
        54,
        new InstrumentArticulation('tambourine', 3, 54)
    ],
    [
        111,
        new InstrumentArticulation('tambourine', 2, 54)
    ],
    [
        112,
        new InstrumentArticulation('tambourine', 1, 54)
    ],
    [
        113,
        new InstrumentArticulation('tambourine', -7, 54)
    ],
    [
        79,
        new InstrumentArticulation('cuica', 30, 79)
    ],
    [
        78,
        new InstrumentArticulation('cuica', 29, 78)
    ],
    [
        58,
        new InstrumentArticulation('vibraslap', 28, 58)
    ],
    [
        81,
        new InstrumentArticulation('triangle', 27, 81)
    ],
    [
        80,
        new InstrumentArticulation('triangle', 26, 80)
    ],
    [
        114,
        new InstrumentArticulation('grancassa', 25, 43)
    ],
    [
        115,
        new InstrumentArticulation('piatti', 18, 49)
    ],
    [
        116,
        new InstrumentArticulation('piatti', 24, 49)
    ],
    [
        69,
        new InstrumentArticulation('cabasa', 23, 69)
    ],
    [
        117,
        new InstrumentArticulation('cabasa', 22, 69)
    ],
    [
        85,
        new InstrumentArticulation('castanets', 21, 85)
    ],
    [
        75,
        new InstrumentArticulation('claves', 20, 75)
    ],
    [
        70,
        new InstrumentArticulation('maraca', -12, 70)
    ],
    [
        118,
        new InstrumentArticulation('maraca', -13, 70)
    ],
    [
        119,
        new InstrumentArticulation('maraca', -14, 70)
    ],
    [
        120,
        new InstrumentArticulation('maraca', -15, 70)
    ],
    [
        82,
        new InstrumentArticulation('shaker', -23, 54)
    ],
    [
        122,
        new InstrumentArticulation('shaker', -24, 54)
    ],
    [
        84,
        new InstrumentArticulation('bellTree', -18, 53)
    ],
    [
        123,
        new InstrumentArticulation('bellTree', -19, 53)
    ],
    [
        83,
        new InstrumentArticulation('jingleBell', -20, 53)
    ],
    [
        124,
        new InstrumentArticulation('unpitched', -21, 62)
    ],
    [
        125,
        new InstrumentArticulation('unpitched', -22, 62)
    ],
    [
        39,
        new InstrumentArticulation('handClap', 3, 39)
    ],
    [
        40,
        new InstrumentArticulation('snare', 3, 40)
    ],
    [
        31,
        new InstrumentArticulation('snare', 3, 40)
    ],
    [
        41,
        new InstrumentArticulation('tom', 5, 41)
    ],
    [
        59,
        new InstrumentArticulation('ride', 2, 59)
    ],
    [
        126,
        new InstrumentArticulation('ride', 2, 59)
    ],
    [
        127,
        new InstrumentArticulation('ride', 2, 59)
    ],
    [
        29,
        new InstrumentArticulation('ride', 2, 59)
    ],
    [
        30,
        new InstrumentArticulation('crash', -3, 49)
    ],
    [
        33,
        new InstrumentArticulation('snare', 3, 37)
    ],
    [
        34,
        new InstrumentArticulation('snare', 3, 38)
    ]
]);
PercussionMapper.instrumentArticulationNames = new Map([
    ['Ride (choke)', 29],
    ['Cymbal (hit)', 30],
    ['Snare (side stick)', 31],
    ['Snare (side stick) 2', 33],
    ['Snare (hit)', 34],
    ['Kick (hit)', 35],
    ['Kick (hit) 2', 36],
    ['Snare (side stick) 3', 37],
    ['Snare (hit) 2', 38],
    ['Hand Clap (hit)', 39],
    ['Snare (hit) 3', 40],
    ['Low Floor Tom (hit)', 41],
    ['Hi-Hat (closed)', 42],
    ['Very Low Tom (hit)', 43],
    ['Pedal Hi-Hat (hit)', 44],
    ['Low Tom (hit)', 45],
    ['Hi-Hat (open)', 46],
    ['Mid Tom (hit)', 47],
    ['High Tom (hit)', 48],
    ['Crash high (hit)', 49],
    ['High Floor Tom (hit)', 50],
    ['Ride (middle)', 51],
    ['China (hit)', 52],
    ['Ride (bell)', 53],
    ['Tambourine (hit)', 54],
    ['Splash (hit)', 55],
    ['Cowbell medium (hit)', 56],
    ['Crash medium (hit)', 57],
    ['Vibraslap (hit)', 58],
    ['Ride (edge)', 59],
    ['Hand (hit)', 60],
    ['Hand (hit)', 61],
    ['Bongo high (hit)', 60],
    ['Bongo low (hit)', 61],
    ['Conga high (mute)', 62],
    ['Conga high (hit)', 63],
    ['Conga low (hit)', 64],
    ['Timbale high (hit)', 65],
    ['Timbale low (hit)', 66],
    ['Agogo high (hit)', 67],
    ['Agogo tow (hit)', 68],
    ['Cabasa (hit)', 69],
    ['Left Maraca (hit)', 70],
    ['Whistle high (hit)', 71],
    ['Whistle low (hit)', 72],
    ['Guiro (hit)', 73],
    ['Guiro (scrap-return)', 74],
    ['Claves (hit)', 75],
    ['Woodblock high (hit)', 76],
    ['Woodblock low (hit)', 77],
    ['Cuica (mute)', 78],
    ['Cuica (open)', 79],
    ['Triangle (rnute)', 80],
    ['Triangle (hit)', 81],
    ['Shaker (hit)', 82],
    ['Tinkle Bell (hat)', 83],
    ['Jingle Bell (hit)', 83],
    ['Bell Tree (hit)', 84],
    ['Castanets (hit)', 85],
    ['Surdo (hit)', 86],
    ['Surdo (mute)', 87],
    ['Snare (rim shot)', 91],
    ['Hi-Hat (half)', 92],
    ['Ride (edge) 2', 93],
    ['Ride (choke) 2', 94],
    ['Splash (choke)', 95],
    ['China (choke)', 96],
    ['Crash high (choke)', 97],
    ['Crash medium (choke)', 98],
    ['Cowbell low (hit)', 99],
    ['Cowbell low (tip)', 100],
    ['Cowbell medium (tip)', 101],
    ['Cowbell high (hit)', 102],
    ['Cowbell high (tip)', 103],
    ['Hand (mute)', 104],
    ['Hand (slap)', 105],
    ['Hand (mute) 2', 106],
    ['Hand (slap) 2', 107],
    ['Conga low (slap)', 108],
    ['Conga low (mute)', 109],
    ['Conga high (slap)', 110],
    ['Tambourine (return)', 111],
    ['Tambourine (roll)', 112],
    ['Tambourine (hand)', 113],
    ['Grancassa (hit)', 114],
    ['Piatti (hat)', 115],
    ['Piatti (hand)', 116],
    ['Cabasa (return)', 117],
    ['Left Maraca (return)', 118],
    ['Right Maraca (hit)', 119],
    ['Right Maraca (return)', 120],
    ['Shaker (return)', 122],
    ['Bell Tee (return)', 123],
    ['Golpe (thumb)', 124],
    ['Golpe (finger)', 125],
    ['Ride (middle) 2', 126],
    ['Ride (bell) 2', 127]
]);
class MidiUtils {
    static ticksToMillis(ticks, tempo) {
        return (ticks * (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    static millisToTicks(millis, tempo) {
        return (millis / (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    static toTicks(duration) {
        return MidiUtils.valueToTicks(duration);
    }
    static valueToTicks(duration) {
        let denomninator = duration;
        if (denomninator < 0) {
            denomninator = 1 / -denomninator;
        }
        return (MidiUtils.QuarterTime * (4.0 / denomninator)) | 0;
    }
    static applyDot(ticks, doubleDotted) {
        if (doubleDotted) {
            return ticks + ((ticks / 4) | 0) * 3;
        }
        return ticks + ((ticks / 2) | 0);
    }
    static applyTuplet(ticks, numerator, denominator) {
        return ((ticks * denominator) / numerator) | 0;
    }
    static removeTuplet(ticks, numerator, denominator) {
        return ((ticks * numerator) / denominator) | 0;
    }
    static dynamicToVelocity(dynamicValue, adjustment = 0) {
        let velocity = 1;
        switch (dynamicValue) {
            case DynamicValue.PPP:
                velocity = MidiUtils.MinVelocity + 0 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.PP:
                velocity = MidiUtils.MinVelocity + 1 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.P:
                velocity = MidiUtils.MinVelocity + 2 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.MP:
                velocity = MidiUtils.MinVelocity + 3 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.MF:
                velocity = MidiUtils.MinVelocity + 4 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.F:
                velocity = MidiUtils.MinVelocity + 5 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.FF:
                velocity = MidiUtils.MinVelocity + 6 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.FFF:
                velocity = MidiUtils.MinVelocity + 7 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.PPPP:
                velocity = 10;
                break;
            case DynamicValue.PPPPP:
                velocity = 5;
                break;
            case DynamicValue.PPPPPP:
                velocity = 3;
                break;
            case DynamicValue.FFFF:
                velocity = MidiUtils.MinVelocity + 8 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.FFFFF:
                velocity = MidiUtils.MinVelocity + 9 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.FFFFFF:
                velocity = MidiUtils.MinVelocity + 10 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.SF:
            case DynamicValue.SFP:
            case DynamicValue.SFZP:
            case DynamicValue.SFPP:
            case DynamicValue.SFZ:
            case DynamicValue.FZ:
                velocity = MidiUtils.MinVelocity + 6 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.FP:
                velocity = MidiUtils.MinVelocity + 5 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.RF:
            case DynamicValue.RFZ:
            case DynamicValue.SFFZ:
                velocity = MidiUtils.MinVelocity + 5 * MidiUtils.VelocityIncrement;
                break;
            case DynamicValue.N:
                velocity = 1;
                break;
            case DynamicValue.PF:
                velocity = MidiUtils.MinVelocity + ((4.5 * MidiUtils.VelocityIncrement) | 0);
                break;
        }
        velocity += adjustment * MidiUtils.VelocityIncrement;
        return Math.min(Math.max(velocity, 1), 127);
    }
}
MidiUtils.QuarterTime = 960;
MidiUtils.MinVelocity = 15;
MidiUtils.VelocityIncrement = 16;
class GeneralMidi {
    static getValue(name) {
        if (!GeneralMidi._values) {
            GeneralMidi._values = new Map();
        }
        name = name.toLowerCase().replace(' ', '');
        return GeneralMidi._values.has(name) ? GeneralMidi._values.get(name) : 0;
    }
    static getName(input) {
        for (const [name, program] of GeneralMidi._values) {
            if (program === input) {
                return name;
            }
        }
        return input.toString();
    }
    static isPiano(program) {
        return program <= 7 || (program >= 16 && program <= 23);
    }
    static isGuitar(program) {
        return (program >= 24 && program <= 39) || program === 105 || program === 43;
    }
    static isBass(program) {
        return program >= 32 && program <= 39;
    }
    static bankToLsbMsb(bank) {
        const lsb = bank & 0x7f;
        const msb = (bank >> 7) & 0x7f;
        return [lsb, msb];
    }
}
GeneralMidi._values = new Map([
    ['acousticgrandpiano', 0],
    ['brightacousticpiano', 1],
    ['electricgrandpiano', 2],
    ['honkytonkpiano', 3],
    ['electricpiano1', 4],
    ['electricpiano2', 5],
    ['harpsichord', 6],
    ['clavinet', 7],
    ['celesta', 8],
    ['glockenspiel', 9],
    ['musicbox', 10],
    ['vibraphone', 11],
    ['marimba', 12],
    ['xylophone', 13],
    ['tubularbells', 14],
    ['dulcimer', 15],
    ['drawbarorgan', 16],
    ['percussiveorgan', 17],
    ['rockorgan', 18],
    ['churchorgan', 19],
    ['reedorgan', 20],
    ['accordion', 21],
    ['harmonica', 22],
    ['tangoaccordion', 23],
    ['acousticguitarnylon', 24],
    ['acousticguitarsteel', 25],
    ['electricguitarjazz', 26],
    ['electricguitarclean', 27],
    ['electricguitarmuted', 28],
    ['overdrivenguitar', 29],
    ['distortionguitar', 30],
    ['guitarharmonics', 31],
    ['acousticbass', 32],
    ['electricbassfinger', 33],
    ['electricbasspick', 34],
    ['fretlessbass', 35],
    ['slapbass1', 36],
    ['slapbass2', 37],
    ['synthbass1', 38],
    ['synthbass2', 39],
    ['violin', 40],
    ['viola', 41],
    ['cello', 42],
    ['contrabass', 43],
    ['tremolostrings', 44],
    ['pizzicatostrings', 45],
    ['orchestralharp', 46],
    ['timpani', 47],
    ['stringensemble1', 48],
    ['stringensemble2', 49],
    ['synthstrings1', 50],
    ['synthstrings2', 51],
    ['choiraahs', 52],
    ['voiceoohs', 53],
    ['synthvoice', 54],
    ['orchestrahit', 55],
    ['trumpet', 56],
    ['trombone', 57],
    ['tuba', 58],
    ['mutedtrumpet', 59],
    ['frenchhorn', 60],
    ['brasssection', 61],
    ['synthbrass1', 62],
    ['synthbrass2', 63],
    ['sopranosax', 64],
    ['altosax', 65],
    ['tenorsax', 66],
    ['baritonesax', 67],
    ['oboe', 68],
    ['englishhorn', 69],
    ['bassoon', 70],
    ['clarinet', 71],
    ['piccolo', 72],
    ['flute', 73],
    ['recorder', 74],
    ['panflute', 75],
    ['blownbottle', 76],
    ['shakuhachi', 77],
    ['whistle', 78],
    ['ocarina', 79],
    ['lead1square', 80],
    ['lead2sawtooth', 81],
    ['lead3calliope', 82],
    ['lead4chiff', 83],
    ['lead5charang', 84],
    ['lead6voice', 85],
    ['lead7fifths', 86],
    ['lead8bassandlead', 87],
    ['pad1newage', 88],
    ['pad2warm', 89],
    ['pad3polysynth', 90],
    ['pad4choir', 91],
    ['pad5bowed', 92],
    ['pad6metallic', 93],
    ['pad7halo', 94],
    ['pad8sweep', 95],
    ['fx1rain', 96],
    ['fx2soundtrack', 97],
    ['fx3crystal', 98],
    ['fx4atmosphere', 99],
    ['fx5brightness', 100],
    ['fx6goblins', 101],
    ['fx7echoes', 102],
    ['fx8scifi', 103],
    ['sitar', 104],
    ['banjo', 105],
    ['shamisen', 106],
    ['koto', 107],
    ['kalimba', 108],
    ['bagpipe', 109],
    ['fiddle', 110],
    ['shanai', 111],
    ['tinklebell', 112],
    ['agogo', 113],
    ['steeldrums', 114],
    ['woodblock', 115],
    ['taikodrum', 116],
    ['melodictom', 117],
    ['synthdrum', 118],
    ['reversecymbal', 119],
    ['guitarfretnoise', 120],
    ['breathnoise', 121],
    ['seashore', 122],
    ['birdtweet', 123],
    ['telephonering', 124],
    ['helicopter', 125],
    ['applause', 126],
    ['gunshot', 127]
]);
class ScoreImporter {
    init(data, settings) {
        this.data = data;
        this.settings = settings;
        Score.resetIds();
    }
}
class UnsupportedFormatError extends AlphaTabError {
    constructor(message = null, inner) {
        super(AlphaTabErrorType.Format, message ?? 'Unsupported format', inner);
        Object.setPrototypeOf(this, UnsupportedFormatError.prototype);
    }
}
class GpxFile {
    constructor() {
        this.fileName = '';
        this.fileSize = 0;
        this.data = null;
    }
}
class GpxFileSystem {
    constructor() {
        this.files = [];
        this.files = [];
        this.fileFilter = _ => {
            return true;
        };
    }
    load(s) {
        const src = new BitReader(s);
        this.readBlock(src);
    }
    readHeader(src) {
        return this.getString(src.readBytes(4), 0, 4);
    }
    decompress(src, skipHeader = false) {
        const uncompressed = ByteBuffer.empty();
        let buffer;
        const expectedLength = this.getInteger(src.readBytes(4), 0);
        try {
            while (uncompressed.length < expectedLength) {
                const flag = src.readBits(1);
                if (flag === 1) {
                    const wordSize = src.readBits(4);
                    const offset = src.readBitsReversed(wordSize);
                    const size = src.readBitsReversed(wordSize);
                    const sourcePosition = uncompressed.length - offset;
                    const toRead = Math.min(offset, size);
                    buffer = uncompressed.getBuffer();
                    uncompressed.write(buffer, sourcePosition, toRead);
                }
                else {
                    const size = src.readBitsReversed(2);
                    for (let i = 0; i < size; i++) {
                        uncompressed.writeByte(src.readByte());
                    }
                }
            }
        }
        catch (e) {
            if (!(e instanceof EndOfReaderError)) {
                throw e;
            }
        }
        buffer = uncompressed.getBuffer();
        const resultOffset = skipHeader ? 4 : 0;
        const resultSize = uncompressed.length - resultOffset;
        const result = new Uint8Array(resultSize);
        const count = resultSize;
        result.set(buffer.subarray(resultOffset, resultOffset + count), 0);
        return result;
    }
    readBlock(data) {
        const header = this.readHeader(data);
        if (header === 'BCFZ') {
            this.readUncompressedBlock(this.decompress(data, true));
        }
        else if (header === 'BCFS') {
            this.readUncompressedBlock(data.readAll());
        }
        else {
            throw new UnsupportedFormatError('Unsupported format');
        }
    }
    readUncompressedBlock(data) {
        const sectorSize = 0x1000;
        let offset = sectorSize;
        while (offset + 3 < data.length) {
            const entryType = this.getInteger(data, offset);
            if (entryType === 2) {
                const file = new GpxFile();
                file.fileName = this.getString(data, offset + 0x04, 127);
                file.fileSize = this.getInteger(data, offset + 0x8c);
                const storeFile = !this.fileFilter || this.fileFilter(file.fileName);
                if (storeFile) {
                    this.files.push(file);
                }
                const dataPointerOffset = offset + 0x94;
                let sector = 0;
                let sectorCount = 0;
                const fileData = storeFile ? ByteBuffer.withCapacity(file.fileSize) : null;
                while (true) {
                    sector = this.getInteger(data, dataPointerOffset + 4 * sectorCount++);
                    if (sector !== 0) {
                        offset = sector * sectorSize;
                        if (storeFile) {
                            fileData.write(data, offset, sectorSize);
                        }
                    }
                    else {
                        break;
                    }
                }
                if (storeFile) {
                    file.data = new Uint8Array(Math.min(file.fileSize, fileData.length));
                    const raw = fileData.toArray();
                    file.data.set(raw.subarray(0, 0 + file.data.length), 0);
                }
            }
            offset += sectorSize;
        }
    }
    getString(data, offset, length) {
        let buf = '';
        for (let i = 0; i < length; i++) {
            const code = data[offset + i] & 0xff;
            if (code === 0) {
                break;
            }
            buf += String.fromCharCode(code);
        }
        return buf;
    }
    getInteger(data, offset) {
        return (data[offset + 3] << 24) | (data[offset + 2] << 16) | (data[offset + 1] << 8) | data[offset];
    }
}
GpxFileSystem.HeaderBcFs = 'BCFS';
GpxFileSystem.HeaderBcFz = 'BCFZ';
class GpifRhythm {
    constructor() {
        this.id = '';
        this.dots = 0;
        this.tupletDenominator = -1;
        this.tupletNumerator = -1;
        this.value = Duration.Quarter;
    }
}
class GpifSound {
    constructor() {
        this.name = '';
        this.path = '';
        this.role = '';
        this.program = 0;
        this.bank = 0;
    }
    get uniqueId() {
        return `${this.path};${this.name};${this.role}`;
    }
}
class GpifParser {
    constructor() {
        this._hasAnacrusis = false;
        this._skipApplyLyrics = false;
        this._backingTrackPadding = 0;
        this._doubleBars = new Set();
        this._keySignatures = new Map();
        this._transposeKeySignaturePerTrack = new Map();
    }
    parseXml(xml, settings) {
        this._masterTrackAutomations = new Map();
        this._automationsPerTrackIdAndBarIndex = new Map();
        this._sustainPedalsPerTrackIdAndBarIndex = new Map();
        this._tracksMapping = [];
        this._tracksById = new Map();
        this._masterBars = [];
        this._barsOfMasterBar = [];
        this._voicesOfBar = new Map();
        this._barsById = new Map();
        this._voiceById = new Map();
        this._beatsOfVoice = new Map();
        this._beatById = new Map();
        this._rhythmOfBeat = new Map();
        this._rhythmById = new Map();
        this._notesOfBeat = new Map();
        this._noteById = new Map();
        this._tappedNotes = new Map();
        this._lyricsByTrack = new Map();
        this._soundsByTrack = new Map();
        this._skipApplyLyrics = false;
        const dom = new XmlDocument();
        try {
            dom.parse(xml);
        }
        catch (e) {
            throw new UnsupportedFormatError('Could not parse XML', e);
        }
        this.parseDom(dom);
        this.buildModel();
        ModelUtils.consolidate(this.score);
        this.score.finish(settings);
        if (!this._skipApplyLyrics && this._lyricsByTrack.size > 0) {
            for (const [t, lyrics] of this._lyricsByTrack) {
                const track = this._tracksById.get(t);
                track.applyLyrics(lyrics);
            }
        }
    }
    parseDom(dom) {
        const root = dom.firstElement;
        if (!root) {
            return;
        }
        if (root.localName === 'GPIF') {
            this.score = new Score();
            for (const n of root.childElements()) {
                switch (n.localName) {
                    case 'Score':
                        this.parseScoreNode(n);
                        break;
                    case 'MasterTrack':
                        this.parseMasterTrackNode(n);
                        break;
                    case 'BackingTrack':
                        this.parseBackingTrackNode(n);
                        break;
                    case 'Tracks':
                        this.parseTracksNode(n);
                        break;
                    case 'MasterBars':
                        this.parseMasterBarsNode(n);
                        break;
                    case 'Bars':
                        this.parseBars(n);
                        break;
                    case 'Voices':
                        this.parseVoices(n);
                        break;
                    case 'Beats':
                        this.parseBeats(n);
                        break;
                    case 'Notes':
                        this.parseNotes(n);
                        break;
                    case 'Rhythms':
                        this.parseRhythms(n);
                        break;
                    case 'Assets':
                        this.parseAssets(n);
                        break;
                }
            }
        }
        else {
            throw new UnsupportedFormatError('Root node of XML was not GPIF');
        }
    }
    parseAssets(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'Asset':
                    if (c.getAttribute('id') === this._backingTrackAssetId) {
                        this.parseBackingTrackAsset(c);
                    }
                    break;
            }
        }
    }
    parseBackingTrackAsset(element) {
        let embeddedFilePath = '';
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'EmbeddedFilePath':
                    embeddedFilePath = c.innerText;
                    break;
            }
        }
        const loadAsset = this.loadAsset;
        if (loadAsset) {
            const assetData = loadAsset(embeddedFilePath);
            if (assetData) {
                this.score.backingTrack.rawAudioFile = assetData;
            }
            else {
                this.score.backingTrack = undefined;
            }
        }
    }
    parseScoreNode(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'Title':
                    this.score.title = c.innerText;
                    break;
                case 'SubTitle':
                    this.score.subTitle = c.innerText;
                    break;
                case 'Artist':
                    this.score.artist = c.innerText;
                    break;
                case 'Album':
                    this.score.album = c.innerText;
                    break;
                case 'Words':
                    this.score.words = c.innerText;
                    break;
                case 'Music':
                    this.score.music = c.innerText;
                    break;
                case 'WordsAndMusic':
                    const wordsAndMusic = c.innerText;
                    if (wordsAndMusic !== '') {
                        if (wordsAndMusic && !this.score.words) {
                            this.score.words = wordsAndMusic;
                        }
                        if (wordsAndMusic && !this.score.music) {
                            this.score.music = wordsAndMusic;
                        }
                    }
                    break;
                case 'Copyright':
                    this.score.copyright = c.innerText;
                    break;
                case 'Tabber':
                    this.score.tab = c.innerText;
                    break;
                case 'Instructions':
                    this.score.instructions = c.innerText;
                    break;
                case 'Notices':
                    this.score.notices = c.innerText;
                    break;
                case 'ScoreSystemsDefaultLayout':
                    this.score.defaultSystemsLayout = GpifParser.parseIntSafe(c.innerText, 4);
                    break;
                case 'ScoreSystemsLayout':
                    this.score.systemsLayout = GpifParser.splitSafe(c.innerText).map(i => GpifParser.parseIntSafe(i, 4));
                    break;
            }
        }
    }
    static parseIntSafe(text, fallback) {
        if (!text) {
            return fallback;
        }
        const i = Number.parseInt(text, 10);
        if (!Number.isNaN(i)) {
            return i;
        }
        return fallback;
    }
    static parseFloatSafe(text, fallback) {
        if (!text) {
            return fallback;
        }
        const i = Number.parseFloat(text);
        if (!Number.isNaN(i)) {
            return i;
        }
        return fallback;
    }
    static splitSafe(text, separator = ' ') {
        if (!text) {
            return [];
        }
        return text
            .split(separator)
            .map(t => t.trim())
            .filter(t => t.length > 0);
    }
    parseBackingTrackNode(node) {
        const backingTrack = new BackingTrack();
        let enabled = false;
        let source = '';
        let assetId = '';
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Enabled':
                    enabled = c.innerText === 'true';
                    break;
                case 'Source':
                    source = c.innerText;
                    break;
                case 'AssetId':
                    assetId = c.innerText;
                    break;
                case 'FramePadding':
                    this._backingTrackPadding =
                        (GpifParser.parseIntSafe(c.innerText, 0) / GpifParser.SampleRate) * 1000;
                    break;
            }
        }
        if (enabled && source === 'Local') {
            this.score.backingTrack = backingTrack;
            this._backingTrackAssetId = assetId;
        }
    }
    parseMasterTrackNode(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Automations':
                    this.parseAutomations(c, this._masterTrackAutomations, null, null);
                    break;
                case 'Tracks':
                    this._tracksMapping = GpifParser.splitSafe(c.innerText);
                    break;
                case 'Anacrusis':
                    this._hasAnacrusis = true;
                    break;
            }
        }
    }
    parseAutomations(node, automations, sounds, sustainPedals) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Automation':
                    this.parseAutomation(c, automations, sounds, sustainPedals);
                    break;
            }
        }
    }
    parseAutomation(node, automations, sounds, sustainPedals) {
        let type = null;
        let isLinear = false;
        let barIndex = -1;
        let ratioPosition = 0;
        let numberValue = 0;
        let textValue = null;
        let reference = 0;
        let text = null;
        let syncPointValue = undefined;
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Type':
                    type = c.innerText;
                    break;
                case 'Linear':
                    isLinear = c.innerText.toLowerCase() === 'true';
                    break;
                case 'Bar':
                    barIndex = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'Position':
                    ratioPosition = GpifParser.parseFloatSafe(c.innerText, 0);
                    break;
                case 'Value':
                    if (c.firstElement && c.firstElement.nodeType === XmlNodeType.CDATA) {
                        textValue = c.innerText;
                    }
                    else if (c.firstElement &&
                        c.firstElement.nodeType === XmlNodeType.Element &&
                        type === 'SyncPoint') {
                        syncPointValue = new SyncPointData();
                        for (const vc of c.childElements()) {
                            switch (vc.localName) {
                                case 'BarIndex':
                                    barIndex = GpifParser.parseIntSafe(vc.innerText, 0);
                                    break;
                                case 'BarOccurrence':
                                    syncPointValue.barOccurence = GpifParser.parseIntSafe(vc.innerText, 0);
                                    break;
                                case 'FrameOffset':
                                    const frameOffset = GpifParser.parseFloatSafe(vc.innerText, 0);
                                    syncPointValue.millisecondOffset = (frameOffset / GpifParser.SampleRate) * 1000;
                                    break;
                            }
                        }
                    }
                    else {
                        const parts = GpifParser.splitSafe(c.innerText);
                        if (parts.length === 1) {
                            numberValue = GpifParser.parseFloatSafe(parts[0], 0);
                            reference = 1;
                        }
                        else {
                            numberValue = GpifParser.parseFloatSafe(parts[0], 0);
                            reference = GpifParser.parseIntSafe(parts[1], 0);
                        }
                    }
                    break;
                case 'Text':
                    text = c.innerText;
                    break;
            }
        }
        if (!type) {
            return;
        }
        const newAutomations = [];
        switch (type) {
            case 'Tempo':
                newAutomations.push(Automation.buildTempoAutomation(isLinear, ratioPosition, numberValue, reference));
                break;
            case 'SyncPoint':
                const syncPoint = new Automation();
                syncPoint.type = AutomationType.SyncPoint;
                syncPoint.isLinear = isLinear;
                syncPoint.ratioPosition = ratioPosition;
                syncPoint.syncPointValue = syncPointValue;
                newAutomations.push(syncPoint);
                break;
            case 'Sound':
                if (textValue && sounds && sounds.has(textValue)) {
                    const bankChange = new Automation();
                    bankChange.type = AutomationType.Bank;
                    bankChange.ratioPosition = ratioPosition;
                    bankChange.value = sounds.get(textValue).bank;
                    newAutomations.push(bankChange);
                    const programChange = Automation.buildInstrumentAutomation(isLinear, ratioPosition, sounds.get(textValue).program);
                    newAutomations.push(programChange);
                }
                break;
            case 'SustainPedal':
                if (sustainPedals) {
                    let v;
                    if (sustainPedals.has(barIndex)) {
                        v = sustainPedals.get(barIndex);
                    }
                    else {
                        v = [];
                        sustainPedals.set(barIndex, v);
                    }
                    const sustain = new SustainPedalMarker();
                    sustain.ratioPosition = ratioPosition;
                    switch (reference) {
                        case 1:
                            sustain.pedalType = SustainPedalMarkerType.Down;
                            break;
                        case 3:
                            sustain.pedalType = SustainPedalMarkerType.Up;
                            break;
                    }
                    v.push(sustain);
                }
                break;
        }
        if (newAutomations.length) {
            if (text) {
                for (const a of newAutomations) {
                    a.text = text;
                }
            }
            if (barIndex >= 0) {
                if (!automations.has(barIndex)) {
                    automations.set(barIndex, []);
                }
                for (const a of newAutomations) {
                    automations.get(barIndex).push(a);
                }
            }
        }
    }
    parseTracksNode(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Track':
                    this.parseTrack(c);
                    break;
            }
        }
    }
    parseTrack(node) {
        this._articulationByName = new Map();
        const track = new Track();
        track.ensureStaveCount(1);
        const staff = track.staves[0];
        staff.showStandardNotation = true;
        const trackId = node.getAttribute('id');
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Name':
                    track.name = c.innerText;
                    break;
                case 'Color':
                    const parts = GpifParser.splitSafe(c.innerText);
                    if (parts.length >= 3) {
                        const r = GpifParser.parseIntSafe(parts[0], 0);
                        const g = GpifParser.parseIntSafe(parts[1], 0);
                        const b = GpifParser.parseIntSafe(parts[2], 0);
                        track.color = new Color(r, g, b, 0xff);
                    }
                    break;
                case 'Instrument':
                    const instrumentName = c.getAttribute('ref');
                    if (instrumentName.endsWith('-gs') || instrumentName.endsWith('GrandStaff')) {
                        track.ensureStaveCount(2);
                        track.staves[1].showStandardNotation = true;
                    }
                    break;
                case 'InstrumentSet':
                    this.parseInstrumentSet(track, c);
                    break;
                case 'NotationPatch':
                    this.parseNotationPatch(track, c);
                    break;
                case 'ShortName':
                    track.shortName = c.innerText;
                    break;
                case 'SystemsDefautLayout':
                    track.defaultSystemsLayout = GpifParser.parseIntSafe(c.innerText, 4);
                    break;
                case 'SystemsLayout':
                    track.systemsLayout = GpifParser.splitSafe(c.innerText).map(i => GpifParser.parseIntSafe(i, 4));
                    break;
                case 'Lyrics':
                    this.parseLyrics(trackId, c);
                    break;
                case 'Properties':
                    this.parseTrackProperties(track, c);
                    break;
                case 'GeneralMidi':
                case 'MidiConnection':
                case 'MIDISettings':
                    this.parseGeneralMidi(track, c);
                    break;
                case 'Sounds':
                    this.parseSounds(trackId, track, c);
                    break;
                case 'PlaybackState':
                    const state = c.innerText;
                    track.playbackInfo.isSolo = state === 'Solo';
                    track.playbackInfo.isMute = state === 'Mute';
                    break;
                case 'PartSounding':
                    this.parsePartSounding(trackId, track, c);
                    break;
                case 'Staves':
                    this.parseStaves(track, c);
                    break;
                case 'Transpose':
                    this.parseTranspose(trackId, track, c);
                    break;
                case 'RSE':
                    this.parseRSE(track, c);
                    break;
                case 'Automations':
                    this.parseTrackAutomations(trackId, c);
                    break;
            }
        }
        this._tracksById.set(trackId, track);
    }
    parseTrackAutomations(trackId, c) {
        const trackAutomations = new Map();
        this._automationsPerTrackIdAndBarIndex.set(trackId, trackAutomations);
        const sustainPedals = new Map();
        this._sustainPedalsPerTrackIdAndBarIndex.set(trackId, sustainPedals);
        this.parseAutomations(c, trackAutomations, this._soundsByTrack.get(trackId), sustainPedals);
    }
    parseNotationPatch(track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'LineCount':
                    const lineCount = GpifParser.parseIntSafe(c.innerText, 5);
                    for (const staff of track.staves) {
                        staff.standardNotationLineCount = lineCount;
                    }
                    break;
                case 'Elements':
                    this.parseElements(track, c);
                    break;
            }
        }
    }
    parseInstrumentSet(track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Type':
                    if (c.innerText === 'drumKit') {
                        for (const staff of track.staves) {
                            staff.isPercussion = true;
                        }
                    }
                    break;
                case 'Elements':
                    this.parseElements(track, c);
                    break;
                case 'LineCount':
                    const lineCount = GpifParser.parseIntSafe(c.innerText, 5);
                    for (const staff of track.staves) {
                        staff.standardNotationLineCount = lineCount;
                    }
                    break;
            }
        }
    }
    parseElements(track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Element':
                    this.parseElement(track, c);
                    break;
            }
        }
    }
    parseElement(track, node) {
        const type = node.findChildElement('Type')?.innerText ?? '';
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Name':
                case 'Articulations':
                    this.parseArticulations(track, c, type);
                    break;
            }
        }
    }
    parseArticulations(track, node, elementType) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Articulation':
                    this.parseArticulation(track, c, elementType);
                    break;
            }
        }
    }
    parseArticulation(track, node, elementType) {
        const articulation = new InstrumentArticulation();
        articulation.outputMidiNumber = -1;
        articulation.elementType = elementType;
        let name = '';
        for (const c of node.childElements()) {
            const txt = c.innerText;
            switch (c.localName) {
                case 'Name':
                    name = c.innerText;
                    break;
                case 'OutputMidiNumber':
                    articulation.outputMidiNumber = GpifParser.parseIntSafe(txt, 0);
                    break;
                case 'TechniqueSymbol':
                    break;
                case 'TechniquePlacement':
                    switch (txt) {
                        case 'outside':
                            articulation.techniqueSymbolPlacement = TechniqueSymbolPlacement.Outside;
                            break;
                        case 'inside':
                            articulation.techniqueSymbolPlacement = TechniqueSymbolPlacement.Inside;
                            break;
                        case 'above':
                            articulation.techniqueSymbolPlacement = TechniqueSymbolPlacement.Above;
                            break;
                        case 'below':
                            articulation.techniqueSymbolPlacement = TechniqueSymbolPlacement.Below;
                            break;
                    }
                    break;
                case 'Noteheads':
                    break;
                case 'StaffLine':
                    articulation.staffLine = GpifParser.parseIntSafe(txt, 0);
                    break;
            }
        }
        if (articulation.outputMidiNumber !== -1) {
            track.percussionArticulations.push(articulation);
            if (name.length > 0) {
                this._articulationByName.set(name, articulation);
            }
        }
        else if (name.length > 0 && this._articulationByName.has(name)) {
            this._articulationByName.get(name).staffLine = articulation.staffLine;
        }
    }
    parseTechniqueSymbol(txt) {
    }
    parseNoteHead(txt) {
    }
    parseStaves(track, node) {
        let staffIndex = 0;
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Staff':
                    track.ensureStaveCount(staffIndex + 1);
                    const staff = track.staves[staffIndex];
                    this.parseStaff(staff, c);
                    staffIndex++;
                    break;
            }
        }
    }
    parseStaff(staff, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Properties':
                    this.parseStaffProperties(staff, c);
                    break;
            }
        }
    }
    parseStaffProperties(staff, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Property':
                    this.parseStaffProperty(staff, c);
                    break;
            }
        }
    }
    parseStaffProperty(staff, node) {
        const propertyName = node.getAttribute('name');
        switch (propertyName) {
            case 'Tuning':
                for (const c of node.childElements()) {
                    switch (c.localName) {
                        case 'Pitches':
                            const tuningParts = GpifParser.splitSafe(node.findChildElement('Pitches')?.innerText);
                            const tuning = new Array(tuningParts.length);
                            for (let i = 0; i < tuning.length; i++) {
                                tuning[tuning.length - 1 - i] = GpifParser.parseIntSafe(tuningParts[i], 0);
                            }
                            staff.stringTuning.tunings = tuning;
                            break;
                        case 'Label':
                            staff.stringTuning.name = c.innerText;
                            break;
                    }
                }
                if (!staff.isPercussion) {
                    staff.showTablature = true;
                }
                break;
            case 'DiagramCollection':
            case 'ChordCollection':
                this.parseDiagramCollectionForStaff(staff, node);
                break;
            case 'CapoFret':
                const capo = GpifParser.parseIntSafe(node.findChildElement('Fret')?.innerText, 0);
                staff.capo = capo;
                break;
        }
    }
    parseLyrics(trackId, node) {
        const tracks = [];
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Line':
                    tracks.push(this.parseLyricsLine(c));
                    break;
            }
        }
        this._lyricsByTrack.set(trackId, tracks);
    }
    parseLyricsLine(node) {
        const lyrics = new Lyrics();
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Offset':
                    lyrics.startBar = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'Text':
                    lyrics.text = c.innerText;
                    break;
            }
        }
        return lyrics;
    }
    parseDiagramCollectionForTrack(track, node) {
        const items = node.findChildElement('Items');
        if (items) {
            for (const c of items.childElements()) {
                switch (c.localName) {
                    case 'Item':
                        this.parseDiagramItemForTrack(track, c);
                        break;
                }
            }
        }
    }
    parseDiagramCollectionForStaff(staff, node) {
        const items = node.findChildElement('Items');
        if (items) {
            for (const c of items.childElements()) {
                switch (c.localName) {
                    case 'Item':
                        this.parseDiagramItemForStaff(staff, c);
                        break;
                }
            }
        }
    }
    parseDiagramItemForTrack(track, node) {
        const chord = new Chord();
        const chordId = node.getAttribute('id');
        for (const staff of track.staves) {
            staff.addChord(chordId, chord);
        }
        this.parseDiagramItemForChord(chord, node);
    }
    parseDiagramItemForStaff(staff, node) {
        const chord = new Chord();
        const chordId = node.getAttribute('id');
        staff.addChord(chordId, chord);
        this.parseDiagramItemForChord(chord, node);
    }
    parseDiagramItemForChord(chord, node) {
        chord.name = node.getAttribute('name');
        const diagram = node.findChildElement('Diagram');
        if (!diagram) {
            chord.showDiagram = false;
            chord.showFingering = false;
            return;
        }
        const stringCount = GpifParser.parseIntSafe(diagram.getAttribute('stringCount'), 6);
        const baseFret = GpifParser.parseIntSafe(diagram.getAttribute('baseFret'), 0);
        chord.firstFret = baseFret + 1;
        for (let i = 0; i < stringCount; i++) {
            chord.strings.push(-1);
        }
        for (const c of diagram.childElements()) {
            switch (c.localName) {
                case 'Fret':
                    const guitarString = GpifParser.parseIntSafe(c.getAttribute('string'), 0);
                    chord.strings[stringCount - guitarString - 1] =
                        baseFret + GpifParser.parseIntSafe(c.getAttribute('fret'), 0);
                    break;
                case 'Fingering':
                    const existingFingers = new Map();
                    for (const p of c.childElements()) {
                        switch (p.localName) {
                            case 'Position':
                                let finger = Fingers.Unknown;
                                const fret = baseFret + GpifParser.parseIntSafe(p.getAttribute('fret'), 0);
                                switch (p.getAttribute('finger')) {
                                    case 'Index':
                                        finger = Fingers.IndexFinger;
                                        break;
                                    case 'Middle':
                                        finger = Fingers.MiddleFinger;
                                        break;
                                    case 'Rank':
                                        finger = Fingers.AnnularFinger;
                                        break;
                                    case 'Pinky':
                                        finger = Fingers.LittleFinger;
                                        break;
                                    case 'Thumb':
                                        finger = Fingers.Thumb;
                                        break;
                                    case 'None':
                                        break;
                                }
                                if (finger !== Fingers.Unknown) {
                                    if (existingFingers.has(finger)) {
                                        chord.barreFrets.push(fret);
                                    }
                                    else {
                                        existingFingers.set(finger, true);
                                    }
                                }
                                break;
                        }
                    }
                    break;
                case 'Property':
                    switch (c.getAttribute('name')) {
                        case 'ShowName':
                            chord.showName = c.getAttribute('value') === 'true';
                            break;
                        case 'ShowDiagram':
                            chord.showDiagram = c.getAttribute('value') === 'true';
                            break;
                        case 'ShowFingering':
                            chord.showFingering = c.getAttribute('value') === 'true';
                            break;
                    }
                    break;
            }
        }
    }
    parseTrackProperties(track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Property':
                    this.parseTrackProperty(track, c);
                    break;
            }
        }
    }
    parseTrackProperty(track, node) {
        const propertyName = node.getAttribute('name');
        switch (propertyName) {
            case 'Tuning':
                const tuningParts = GpifParser.splitSafe(node.findChildElement('Pitches')?.innerText);
                const tuning = new Array(tuningParts.length);
                for (let i = 0; i < tuning.length; i++) {
                    tuning[tuning.length - 1 - i] = GpifParser.parseIntSafe(tuningParts[i], 0);
                }
                for (const staff of track.staves) {
                    staff.stringTuning.tunings = tuning;
                    staff.showStandardNotation = true;
                    staff.showTablature = true;
                }
                break;
            case 'DiagramCollection':
            case 'ChordCollection':
                this.parseDiagramCollectionForTrack(track, node);
                break;
            case 'CapoFret':
                const capo = GpifParser.parseIntSafe(node.findChildElement('Fret')?.innerText, 0);
                for (const staff of track.staves) {
                    staff.capo = capo;
                }
                break;
        }
    }
    parseGeneralMidi(track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Program':
                    track.playbackInfo.program = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'Port':
                    track.playbackInfo.port = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'PrimaryChannel':
                    track.playbackInfo.primaryChannel = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'SecondaryChannel':
                    track.playbackInfo.secondaryChannel = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
            }
        }
        const isPercussion = node.getAttribute('table') === 'Percussion';
        if (isPercussion) {
            for (const staff of track.staves) {
                staff.isPercussion = true;
            }
        }
    }
    parseSounds(trackId, track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Sound':
                    this.parseSound(trackId, track, c);
                    break;
            }
        }
    }
    parseSound(trackId, track, node) {
        const sound = new GpifSound();
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Name':
                    sound.name = c.innerText;
                    break;
                case 'Path':
                    sound.path = c.innerText;
                    break;
                case 'Role':
                    sound.role = c.innerText;
                    break;
                case 'MIDI':
                    this.parseSoundMidi(sound, c);
                    break;
            }
        }
        if (!this._soundsByTrack.has(trackId)) {
            this._soundsByTrack.set(trackId, new Map());
            track.playbackInfo.program = sound.program;
            track.playbackInfo.bank = sound.bank;
        }
        this._soundsByTrack.get(trackId).set(sound.uniqueId, sound);
    }
    parseSoundMidi(sound, node) {
        let bankMsb = 0;
        let bankLsb = 0;
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Program':
                    sound.program = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'MSB':
                    bankMsb = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'LSB':
                    bankLsb = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
            }
        }
        sound.bank = ((bankMsb & 0x7f) << 7) | bankLsb;
    }
    parsePartSounding(trackId, track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'TranspositionPitch':
                    for (const staff of track.staves) {
                        staff.displayTranspositionPitch = GpifParser.parseIntSafe(c.innerText, 0);
                    }
                    break;
                case 'NominalKey':
                    const transposeIndex = Math.max(0, Tuning.noteNames.indexOf(c.innerText));
                    this._transposeKeySignaturePerTrack.set(trackId, transposeIndex);
                    break;
            }
        }
    }
    parseTranspose(trackId, track, node) {
        let octave = 0;
        let chromatic = 0;
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Chromatic':
                    chromatic = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'Octave':
                    octave = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
            }
        }
        const pitch = octave * 12 + chromatic;
        for (const staff of track.staves) {
            staff.displayTranspositionPitch = pitch;
        }
        const transposeIndex = ModelUtils.flooredDivision(pitch, 12);
        this._transposeKeySignaturePerTrack.set(trackId, transposeIndex);
    }
    parseRSE(track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'ChannelStrip':
                    this.parseChannelStrip(track, c);
                    break;
            }
        }
    }
    parseChannelStrip(track, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Parameters':
                    this.parseChannelStripParameters(track, c);
                    break;
            }
        }
    }
    parseChannelStripParameters(track, node) {
        if (node.firstChild && node.firstChild.value) {
            const parameters = GpifParser.splitSafe(node.firstChild.value);
            if (parameters.length >= 12) {
                track.playbackInfo.balance = Math.floor(GpifParser.parseFloatSafe(parameters[11], 0.5) * 16);
                track.playbackInfo.volume = Math.floor(GpifParser.parseFloatSafe(parameters[12], 0.9) * 16);
            }
        }
    }
    parseMasterBarsNode(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'MasterBar':
                    this.parseMasterBar(c);
                    break;
            }
        }
    }
    parseMasterBar(node) {
        const masterBar = new MasterBar();
        if (this._masterBars.length === 0 && this._hasAnacrusis) {
            masterBar.isAnacrusis = true;
        }
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Time':
                    const timeParts = c.innerText.split('/');
                    masterBar.timeSignatureNumerator = GpifParser.parseIntSafe(timeParts[0], 4);
                    masterBar.timeSignatureDenominator = GpifParser.parseIntSafe(timeParts[1], 4);
                    break;
                case 'FreeTime':
                    masterBar.isFreeTime = true;
                    break;
                case 'DoubleBar':
                    masterBar.isDoubleBar = true;
                    this._doubleBars.add(masterBar);
                    break;
                case 'Section':
                    masterBar.section = new Section();
                    masterBar.section.marker = c.findChildElement('Letter')?.innerText ?? '';
                    masterBar.section.text = c.findChildElement('Text')?.innerText ?? '';
                    break;
                case 'Repeat':
                    if (c.getAttribute('start').toLowerCase() === 'true') {
                        masterBar.isRepeatStart = true;
                    }
                    if (c.getAttribute('end').toLowerCase() === 'true' && c.getAttribute('count')) {
                        masterBar.repeatCount = GpifParser.parseIntSafe(c.getAttribute('count'), 1);
                    }
                    break;
                case 'AlternateEndings':
                    const alternateEndings = GpifParser.splitSafe(c.innerText);
                    let i = 0;
                    for (let k = 0; k < alternateEndings.length; k++) {
                        i = i | (1 << (-1 + GpifParser.parseIntSafe(alternateEndings[k], 0)));
                    }
                    masterBar.alternateEndings = i;
                    break;
                case 'Bars':
                    this._barsOfMasterBar.push(GpifParser.splitSafe(c.innerText));
                    break;
                case 'TripletFeel':
                    switch (c.innerText) {
                        case 'NoTripletFeel':
                            masterBar.tripletFeel = TripletFeel.NoTripletFeel;
                            break;
                        case 'Triplet8th':
                            masterBar.tripletFeel = TripletFeel.Triplet8th;
                            break;
                        case 'Triplet16th':
                            masterBar.tripletFeel = TripletFeel.Triplet16th;
                            break;
                        case 'Dotted8th':
                            masterBar.tripletFeel = TripletFeel.Dotted8th;
                            break;
                        case 'Dotted16th':
                            masterBar.tripletFeel = TripletFeel.Dotted16th;
                            break;
                        case 'Scottish8th':
                            masterBar.tripletFeel = TripletFeel.Scottish8th;
                            break;
                        case 'Scottish16th':
                            masterBar.tripletFeel = TripletFeel.Scottish16th;
                            break;
                    }
                    break;
                case 'Key':
                    const keySignature = GpifParser.parseIntSafe(c.findChildElement('AccidentalCount')?.innerText, 0);
                    const mode = c.findChildElement('Mode');
                    let keySignatureType = KeySignatureType.Major;
                    if (mode) {
                        switch (mode.innerText.toLowerCase()) {
                            case 'major':
                                keySignatureType = KeySignatureType.Major;
                                break;
                            case 'minor':
                                keySignatureType = KeySignatureType.Minor;
                                break;
                        }
                    }
                    this._keySignatures.set(this._masterBars.length, [keySignature, keySignatureType]);
                    break;
                case 'Fermatas':
                    this.parseFermatas(masterBar, c);
                    break;
                case 'XProperties':
                    this.parseMasterBarXProperties(masterBar, c);
                    break;
                case 'Directions':
                    this.parseDirections(masterBar, c);
                    break;
            }
        }
        this._masterBars.push(masterBar);
    }
    parseDirections(masterBar, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Target':
                    switch (c.innerText) {
                        case 'Coda':
                            masterBar.addDirection(Direction.TargetCoda);
                            break;
                        case 'DoubleCoda':
                            masterBar.addDirection(Direction.TargetDoubleCoda);
                            break;
                        case 'Segno':
                            masterBar.addDirection(Direction.TargetSegno);
                            break;
                        case 'SegnoSegno':
                            masterBar.addDirection(Direction.TargetSegnoSegno);
                            break;
                        case 'Fine':
                            masterBar.addDirection(Direction.TargetFine);
                            break;
                    }
                    break;
                case 'Jump':
                    switch (c.innerText) {
                        case 'DaCapo':
                            masterBar.addDirection(Direction.JumpDaCapo);
                            break;
                        case 'DaCapoAlCoda':
                            masterBar.addDirection(Direction.JumpDaCapoAlCoda);
                            break;
                        case 'DaCapoAlDoubleCoda':
                            masterBar.addDirection(Direction.JumpDaCapoAlDoubleCoda);
                            break;
                        case 'DaCapoAlFine':
                            masterBar.addDirection(Direction.JumpDaCapoAlFine);
                            break;
                        case 'DaSegno':
                            masterBar.addDirection(Direction.JumpDalSegno);
                            break;
                        case 'DaSegnoAlCoda':
                            masterBar.addDirection(Direction.JumpDalSegnoAlCoda);
                            break;
                        case 'DaSegnoAlDoubleCoda':
                            masterBar.addDirection(Direction.JumpDalSegnoAlDoubleCoda);
                            break;
                        case 'DaSegnoAlFine':
                            masterBar.addDirection(Direction.JumpDalSegnoAlFine);
                            break;
                        case 'DaSegnoSegno':
                            masterBar.addDirection(Direction.JumpDalSegnoSegno);
                            break;
                        case 'DaSegnoSegnoAlCoda':
                            masterBar.addDirection(Direction.JumpDalSegnoSegnoAlCoda);
                            break;
                        case 'DaSegnoSegnoAlDoubleCoda':
                            masterBar.addDirection(Direction.JumpDalSegnoSegnoAlDoubleCoda);
                            break;
                        case 'DaSegnoSegnoAlFine':
                            masterBar.addDirection(Direction.JumpDalSegnoSegnoAlFine);
                            break;
                        case 'DaCoda':
                            masterBar.addDirection(Direction.JumpDaCoda);
                            break;
                        case 'DaDoubleCoda':
                            masterBar.addDirection(Direction.JumpDaDoubleCoda);
                            break;
                    }
                    break;
            }
        }
    }
    parseFermatas(masterBar, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Fermata':
                    this.parseFermata(masterBar, c);
                    break;
            }
        }
    }
    parseFermata(masterBar, node) {
        let offset = 0;
        const fermata = new Fermata();
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Type':
                    switch (c.innerText) {
                        case 'Short':
                            fermata.type = FermataType.Short;
                            break;
                        case 'Medium':
                            fermata.type = FermataType.Medium;
                            break;
                        case 'Long':
                            fermata.type = FermataType.Long;
                            break;
                    }
                    break;
                case 'Length':
                    fermata.length = GpifParser.parseFloatSafe(c.innerText, 0);
                    break;
                case 'Offset':
                    const parts = c.innerText.split('/');
                    if (parts.length === 2) {
                        const numerator = GpifParser.parseIntSafe(parts[0], 4);
                        const denominator = GpifParser.parseIntSafe(parts[1], 4);
                        offset = ((numerator / denominator) * MidiUtils.QuarterTime) | 0;
                    }
                    break;
            }
        }
        masterBar.addFermata(offset, fermata);
    }
    parseBars(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Bar':
                    this.parseBar(c);
                    break;
            }
        }
    }
    parseBar(node) {
        const bar = new Bar();
        const barId = node.getAttribute('id');
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Voices':
                    this._voicesOfBar.set(barId, GpifParser.splitSafe(c.innerText));
                    break;
                case 'Clef':
                    switch (c.innerText) {
                        case 'Neutral':
                            bar.clef = Clef.Neutral;
                            break;
                        case 'G2':
                            bar.clef = Clef.G2;
                            break;
                        case 'F4':
                            bar.clef = Clef.F4;
                            break;
                        case 'C4':
                            bar.clef = Clef.C4;
                            break;
                        case 'C3':
                            bar.clef = Clef.C3;
                            break;
                    }
                    break;
                case 'Ottavia':
                    switch (c.innerText) {
                        case '8va':
                            bar.clefOttava = Ottavia._8va;
                            break;
                        case '15ma':
                            bar.clefOttava = Ottavia._15ma;
                            break;
                        case '8vb':
                            bar.clefOttava = Ottavia._8vb;
                            break;
                        case '15mb':
                            bar.clefOttava = Ottavia._15mb;
                            break;
                    }
                    break;
                case 'SimileMark':
                    switch (c.innerText) {
                        case 'Simple':
                            bar.simileMark = SimileMark.Simple;
                            break;
                        case 'FirstOfDouble':
                            bar.simileMark = SimileMark.FirstOfDouble;
                            break;
                        case 'SecondOfDouble':
                            bar.simileMark = SimileMark.SecondOfDouble;
                            break;
                    }
                    break;
                case 'XProperties':
                    this.parseBarXProperties(c, bar);
                    break;
            }
        }
        this._barsById.set(barId, bar);
    }
    parseVoices(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Voice':
                    this.parseVoice(c);
                    break;
            }
        }
    }
    parseVoice(node) {
        const voice = new Voice();
        const voiceId = node.getAttribute('id');
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Beats':
                    this._beatsOfVoice.set(voiceId, GpifParser.splitSafe(c.innerText));
                    break;
            }
        }
        this._voiceById.set(voiceId, voice);
    }
    parseBeats(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Beat':
                    this.parseBeat(c);
                    break;
            }
        }
    }
    parseBeat(node) {
        const beat = new Beat();
        const beatId = node.getAttribute('id');
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Notes':
                    this._notesOfBeat.set(beatId, GpifParser.splitSafe(c.innerText));
                    break;
                case 'Rhythm':
                    this._rhythmOfBeat.set(beatId, c.getAttribute('ref'));
                    break;
                case 'Fadding':
                    switch (c.innerText) {
                        case 'FadeIn':
                            beat.fade = FadeType.FadeIn;
                            break;
                        case 'FadeOut':
                            beat.fade = FadeType.FadeOut;
                            break;
                        case 'VolumeSwell':
                            beat.fade = FadeType.VolumeSwell;
                            break;
                    }
                    break;
                case 'Tremolo':
                    switch (c.innerText) {
                        case '1/2':
                            beat.tremoloSpeed = Duration.Eighth;
                            break;
                        case '1/4':
                            beat.tremoloSpeed = Duration.Sixteenth;
                            break;
                        case '1/8':
                            beat.tremoloSpeed = Duration.ThirtySecond;
                            break;
                    }
                    break;
                case 'Chord':
                    beat.chordId = c.innerText;
                    break;
                case 'Hairpin':
                    switch (c.innerText) {
                        case 'Crescendo':
                            beat.crescendo = CrescendoType.Crescendo;
                            break;
                        case 'Decrescendo':
                            beat.crescendo = CrescendoType.Decrescendo;
                            break;
                    }
                    break;
                case 'Arpeggio':
                    if (c.innerText === 'Up') {
                        beat.brushType = BrushType.ArpeggioUp;
                    }
                    else {
                        beat.brushType = BrushType.ArpeggioDown;
                    }
                    break;
                case 'Properties':
                    this.parseBeatProperties(c, beat);
                    break;
                case 'XProperties':
                    this.parseBeatXProperties(c, beat);
                    break;
                case 'FreeText':
                    beat.text = c.innerText;
                    break;
                case 'TransposedPitchStemOrientation':
                    switch (c.innerText) {
                        case 'Upward':
                            break;
                        case 'Downward':
                            break;
                    }
                    break;
                case 'Dynamic':
                    switch (c.innerText) {
                        case 'PPP':
                            beat.dynamics = DynamicValue.PPP;
                            break;
                        case 'PP':
                            beat.dynamics = DynamicValue.PP;
                            break;
                        case 'P':
                            beat.dynamics = DynamicValue.P;
                            break;
                        case 'MP':
                            beat.dynamics = DynamicValue.MP;
                            break;
                        case 'MF':
                            beat.dynamics = DynamicValue.MF;
                            break;
                        case 'F':
                            beat.dynamics = DynamicValue.F;
                            break;
                        case 'FF':
                            beat.dynamics = DynamicValue.FF;
                            break;
                        case 'FFF':
                            beat.dynamics = DynamicValue.FFF;
                            break;
                    }
                    break;
                case 'GraceNotes':
                    switch (c.innerText) {
                        case 'OnBeat':
                            beat.graceType = GraceType.OnBeat;
                            break;
                        case 'BeforeBeat':
                            beat.graceType = GraceType.BeforeBeat;
                            break;
                    }
                    break;
                case 'Legato':
                    if (c.getAttribute('origin') === 'true') {
                        beat.isLegatoOrigin = true;
                    }
                    break;
                case 'Whammy':
                    const whammyOrigin = new BendPoint(0, 0);
                    whammyOrigin.value = this.toBendValue(GpifParser.parseFloatSafe(c.getAttribute('originValue'), 0));
                    whammyOrigin.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.getAttribute('originOffset'), 0));
                    beat.addWhammyBarPoint(whammyOrigin);
                    const whammyMiddle1 = new BendPoint(0, 0);
                    whammyMiddle1.value = this.toBendValue(GpifParser.parseFloatSafe(c.getAttribute('middleValue'), 0));
                    whammyMiddle1.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.getAttribute('middleOffset1'), 0));
                    beat.addWhammyBarPoint(whammyMiddle1);
                    const whammyMiddle2 = new BendPoint(0, 0);
                    whammyMiddle2.value = this.toBendValue(GpifParser.parseFloatSafe(c.getAttribute('middleValue'), 0));
                    whammyMiddle2.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.getAttribute('middleOffset2'), 0));
                    beat.addWhammyBarPoint(whammyMiddle2);
                    const whammyDestination = new BendPoint(0, 0);
                    whammyDestination.value = this.toBendValue(GpifParser.parseFloatSafe(c.getAttribute('destinationValue'), 0));
                    whammyDestination.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.getAttribute('destinationOffset'), 0));
                    beat.addWhammyBarPoint(whammyDestination);
                    break;
                case 'Ottavia':
                    switch (c.innerText) {
                        case '8va':
                            beat.ottava = Ottavia._8va;
                            break;
                        case '8vb':
                            beat.ottava = Ottavia._8vb;
                            break;
                        case '15ma':
                            beat.ottava = Ottavia._15ma;
                            break;
                        case '15mb':
                            beat.ottava = Ottavia._15mb;
                            break;
                    }
                    break;
                case 'Lyrics':
                    beat.lyrics = this.parseBeatLyrics(c);
                    this._skipApplyLyrics = true;
                    break;
                case 'Slashed':
                    beat.slashed = true;
                    break;
                case 'DeadSlapped':
                    beat.deadSlapped = true;
                    break;
                case 'Golpe':
                    switch (c.innerText) {
                        case 'Finger':
                            beat.golpe = GolpeType.Finger;
                            break;
                        case 'Thumb':
                            beat.golpe = GolpeType.Thumb;
                            break;
                    }
                    break;
                case 'Wah':
                    switch (c.innerText) {
                        case 'Open':
                            beat.wahPedal = WahPedal.Open;
                            break;
                        case 'Closed':
                            beat.wahPedal = WahPedal.Closed;
                            break;
                    }
                    break;
                case 'UserTransposedPitchStemOrientation':
                    switch (c.innerText) {
                        case 'Downward':
                            break;
                        case 'Upward':
                            break;
                    }
                    break;
                case 'Timer':
                    beat.showTimer = true;
                    beat.timer = GpifParser.parseIntSafe(c.innerText, -1);
                    if (beat.timer < 0) {
                        beat.timer = null;
                    }
                    break;
            }
        }
        this._beatById.set(beatId, beat);
    }
    parseBeatLyrics(node) {
        const lines = [];
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Line':
                    lines.push(c.innerText);
                    break;
            }
        }
        return lines;
    }
    parseBeatXProperties(node, beat) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'XProperty':
                    const id = c.getAttribute('id');
                    let value = 0;
                    switch (id) {
                        case '1124204546':
                            value = GpifParser.parseIntSafe(c.findChildElement('Int')?.innerText, 0);
                            switch (value) {
                                case 1:
                                    beat.beamingMode = BeatBeamingMode.ForceMergeWithNext;
                                    break;
                                case 2:
                                    beat.beamingMode = BeatBeamingMode.ForceSplitToNext;
                                    break;
                            }
                            break;
                        case '1124204552':
                            value = GpifParser.parseIntSafe(c.findChildElement('Int')?.innerText, 0);
                            switch (value) {
                                case 1:
                                    if (beat.beamingMode !== BeatBeamingMode.ForceSplitToNext) {
                                        beat.beamingMode = BeatBeamingMode.ForceSplitOnSecondaryToNext;
                                    }
                                    break;
                            }
                            break;
                        case '1124204545':
                            value = GpifParser.parseIntSafe(c.findChildElement('Int')?.innerText, 0);
                            beat.invertBeamDirection = value === 1;
                            break;
                        case '687935489':
                            value = GpifParser.parseIntSafe(c.findChildElement('Int')?.innerText, 0);
                            beat.brushDuration = value;
                            break;
                    }
                    break;
            }
        }
    }
    parseBarXProperties(node, bar) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'XProperty':
                    const id = c.getAttribute('id');
                    switch (id) {
                        case '1124139520':
                            const childNode = c.findChildElement('Double') ?? c.findChildElement('Float');
                            bar.displayScale = GpifParser.parseFloatSafe(childNode?.innerText, 1);
                            break;
                    }
                    break;
            }
        }
    }
    parseMasterBarXProperties(masterBar, node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'XProperty':
                    const id = c.getAttribute('id');
                    switch (id) {
                        case '1124073984':
                            masterBar.displayScale = GpifParser.parseFloatSafe(c.findChildElement('Double')?.innerText, 1);
                            break;
                    }
                    break;
            }
        }
    }
    parseBeatProperties(node, beat) {
        let isWhammy = false;
        let whammyOrigin = null;
        let whammyMiddleValue = null;
        let whammyMiddleOffset1 = null;
        let whammyMiddleOffset2 = null;
        let whammyDestination = null;
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Property':
                    const name = c.getAttribute('name');
                    switch (name) {
                        case 'Brush':
                            if (c.findChildElement('Direction')?.innerText === 'Up') {
                                beat.brushType = BrushType.BrushUp;
                            }
                            else {
                                beat.brushType = BrushType.BrushDown;
                            }
                            break;
                        case 'PickStroke':
                            if (c.findChildElement('Direction')?.innerText === 'Up') {
                                beat.pickStroke = PickStroke.Up;
                            }
                            else {
                                beat.pickStroke = PickStroke.Down;
                            }
                            break;
                        case 'Slapped':
                            if (c.findChildElement('Enable')) {
                                beat.slap = true;
                            }
                            break;
                        case 'Popped':
                            if (c.findChildElement('Enable')) {
                                beat.pop = true;
                            }
                            break;
                        case 'VibratoWTremBar':
                            switch (c.findChildElement('Strength')?.innerText) {
                                case 'Wide':
                                    beat.vibrato = VibratoType.Wide;
                                    break;
                                case 'Slight':
                                    beat.vibrato = VibratoType.Slight;
                                    break;
                            }
                            break;
                        case 'WhammyBar':
                            isWhammy = true;
                            break;
                        case 'WhammyBarExtend':
                            break;
                        case 'WhammyBarOriginValue':
                            if (!whammyOrigin) {
                                whammyOrigin = new BendPoint(0, 0);
                            }
                            whammyOrigin.value = this.toBendValue(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'WhammyBarOriginOffset':
                            if (!whammyOrigin) {
                                whammyOrigin = new BendPoint(0, 0);
                            }
                            whammyOrigin.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'WhammyBarMiddleValue':
                            whammyMiddleValue = this.toBendValue(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'WhammyBarMiddleOffset1':
                            whammyMiddleOffset1 = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'WhammyBarMiddleOffset2':
                            whammyMiddleOffset2 = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'WhammyBarDestinationValue':
                            if (!whammyDestination) {
                                whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
                            }
                            whammyDestination.value = this.toBendValue(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'WhammyBarDestinationOffset':
                            if (!whammyDestination) {
                                whammyDestination = new BendPoint(0, 0);
                            }
                            whammyDestination.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'BarreFret':
                            beat.barreFret = GpifParser.parseIntSafe(c.findChildElement('Fret')?.innerText, 0);
                            break;
                        case 'BarreString':
                            switch (c.findChildElement('String')?.innerText) {
                                case '0':
                                    beat.barreShape = BarreShape.Full;
                                    break;
                                case '1':
                                    beat.barreShape = BarreShape.Half;
                                    break;
                            }
                            break;
                        case 'Rasgueado':
                            switch (c.findChildElement('Rasgueado')?.innerText) {
                                case 'ii_1':
                                    beat.rasgueado = Rasgueado.Ii;
                                    break;
                                case 'mi_1':
                                    beat.rasgueado = Rasgueado.Mi;
                                    break;
                                case 'mii_1':
                                    beat.rasgueado = Rasgueado.MiiTriplet;
                                    break;
                                case 'mii_2':
                                    beat.rasgueado = Rasgueado.MiiAnapaest;
                                    break;
                                case 'pmp_1':
                                    beat.rasgueado = Rasgueado.PmpTriplet;
                                    break;
                                case 'pmp_2':
                                    beat.rasgueado = Rasgueado.PmpAnapaest;
                                    break;
                                case 'pei_1':
                                    beat.rasgueado = Rasgueado.PeiTriplet;
                                    break;
                                case 'pei_2':
                                    beat.rasgueado = Rasgueado.PeiAnapaest;
                                    break;
                                case 'pai_1':
                                    beat.rasgueado = Rasgueado.PaiTriplet;
                                    break;
                                case 'pai_2':
                                    beat.rasgueado = Rasgueado.PaiAnapaest;
                                    break;
                                case 'ami_1':
                                    beat.rasgueado = Rasgueado.AmiTriplet;
                                    break;
                                case 'ami_2':
                                    beat.rasgueado = Rasgueado.AmiAnapaest;
                                    break;
                                case 'ppp_1':
                                    beat.rasgueado = Rasgueado.Ppp;
                                    break;
                                case 'amii_1':
                                    beat.rasgueado = Rasgueado.Amii;
                                    break;
                                case 'amip_1':
                                    beat.rasgueado = Rasgueado.Amip;
                                    break;
                                case 'eami_1':
                                    beat.rasgueado = Rasgueado.Eami;
                                    break;
                                case 'eamii_1':
                                    beat.rasgueado = Rasgueado.Eamii;
                                    break;
                                case 'peami_1':
                                    beat.rasgueado = Rasgueado.Peami;
                                    break;
                            }
                            break;
                    }
                    break;
            }
        }
        if (isWhammy) {
            if (!whammyOrigin) {
                whammyOrigin = new BendPoint(0, 0);
            }
            if (!whammyDestination) {
                whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
            }
            beat.addWhammyBarPoint(whammyOrigin);
            if (whammyMiddleOffset1 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset1, whammyMiddleValue));
            }
            if (whammyMiddleOffset2 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset2, whammyMiddleValue));
            }
            if (!whammyMiddleOffset1 && !whammyMiddleOffset2 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, whammyMiddleValue));
            }
            beat.addWhammyBarPoint(whammyDestination);
        }
    }
    parseNotes(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Note':
                    this.parseNote(c);
                    break;
            }
        }
    }
    parseNote(node) {
        const note = new Note();
        const noteId = node.getAttribute('id');
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Properties':
                    this.parseNoteProperties(c, note, noteId);
                    break;
                case 'AntiAccent':
                    if (c.innerText.toLowerCase() === 'normal') {
                        note.isGhost = true;
                    }
                    break;
                case 'LetRing':
                    note.isLetRing = true;
                    break;
                case 'Trill':
                    note.trillValue = GpifParser.parseIntSafe(c.innerText, -1);
                    note.trillSpeed = Duration.Sixteenth;
                    break;
                case 'Accent':
                    const accentFlags = GpifParser.parseIntSafe(c.innerText, 0);
                    if ((accentFlags & 0x01) !== 0) {
                        note.isStaccato = true;
                    }
                    if ((accentFlags & 0x04) !== 0) {
                        note.accentuated = AccentuationType.Heavy;
                    }
                    if ((accentFlags & 0x08) !== 0) {
                        note.accentuated = AccentuationType.Normal;
                    }
                    if ((accentFlags & 0x10) !== 0) {
                        note.accentuated = AccentuationType.Tenuto;
                    }
                    break;
                case 'Tie':
                    if (c.getAttribute('destination').toLowerCase() === 'true') {
                        note.isTieDestination = true;
                    }
                    break;
                case 'Vibrato':
                    switch (c.innerText) {
                        case 'Slight':
                            note.vibrato = VibratoType.Slight;
                            break;
                        case 'Wide':
                            note.vibrato = VibratoType.Wide;
                            break;
                    }
                    break;
                case 'LeftFingering':
                    switch (c.innerText) {
                        case 'P':
                            note.leftHandFinger = Fingers.Thumb;
                            break;
                        case 'I':
                            note.leftHandFinger = Fingers.IndexFinger;
                            break;
                        case 'M':
                            note.leftHandFinger = Fingers.MiddleFinger;
                            break;
                        case 'A':
                            note.leftHandFinger = Fingers.AnnularFinger;
                            break;
                        case 'C':
                            note.leftHandFinger = Fingers.LittleFinger;
                            break;
                    }
                    break;
                case 'RightFingering':
                    switch (c.innerText) {
                        case 'P':
                            note.rightHandFinger = Fingers.Thumb;
                            break;
                        case 'I':
                            note.rightHandFinger = Fingers.IndexFinger;
                            break;
                        case 'M':
                            note.rightHandFinger = Fingers.MiddleFinger;
                            break;
                        case 'A':
                            note.rightHandFinger = Fingers.AnnularFinger;
                            break;
                        case 'C':
                            note.rightHandFinger = Fingers.LittleFinger;
                            break;
                    }
                    break;
                case 'InstrumentArticulation':
                    note.percussionArticulation = GpifParser.parseIntSafe(c.innerText, 0);
                    break;
                case 'Ornament':
                    switch (c.innerText) {
                        case 'Turn':
                            note.ornament = NoteOrnament.Turn;
                            break;
                        case 'InvertedTurn':
                            note.ornament = NoteOrnament.InvertedTurn;
                            break;
                        case 'UpperMordent':
                            note.ornament = NoteOrnament.UpperMordent;
                            break;
                        case 'LowerMordent':
                            note.ornament = NoteOrnament.LowerMordent;
                            break;
                    }
                    break;
            }
        }
        this._noteById.set(noteId, note);
    }
    parseNoteProperties(node, note, noteId) {
        let isBended = false;
        let bendOrigin = null;
        let bendMiddleValue = null;
        let bendMiddleOffset1 = null;
        let bendMiddleOffset2 = null;
        let bendDestination = null;
        let element = -1;
        let variation = -1;
        let hasTransposedPitch = false;
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Property':
                    const name = c.getAttribute('name');
                    switch (name) {
                        case 'ShowStringNumber':
                            if (c.findChildElement('Enable')) {
                                note.showStringNumber = true;
                            }
                            break;
                        case 'String':
                            note.string = GpifParser.parseIntSafe(c.findChildElement('String')?.innerText, 0) + 1;
                            break;
                        case 'Fret':
                            note.fret = GpifParser.parseIntSafe(c.findChildElement('Fret')?.innerText, 0);
                            break;
                        case 'Element':
                            element = GpifParser.parseIntSafe(c.findChildElement('Element')?.innerText, 0);
                            break;
                        case 'Variation':
                            variation = GpifParser.parseIntSafe(c.findChildElement('Variation')?.innerText, 0);
                            break;
                        case 'Tapped':
                            this._tappedNotes.set(noteId, true);
                            break;
                        case 'HarmonicType':
                            const htype = c.findChildElement('HType');
                            if (htype) {
                                switch (htype.innerText) {
                                    case 'NoHarmonic':
                                        note.harmonicType = HarmonicType.None;
                                        break;
                                    case 'Natural':
                                        note.harmonicType = HarmonicType.Natural;
                                        break;
                                    case 'Artificial':
                                        note.harmonicType = HarmonicType.Artificial;
                                        break;
                                    case 'Pinch':
                                        note.harmonicType = HarmonicType.Pinch;
                                        break;
                                    case 'Tap':
                                        note.harmonicType = HarmonicType.Tap;
                                        break;
                                    case 'Semi':
                                        note.harmonicType = HarmonicType.Semi;
                                        break;
                                    case 'Feedback':
                                        note.harmonicType = HarmonicType.Feedback;
                                        break;
                                }
                            }
                            break;
                        case 'HarmonicFret':
                            const hfret = c.findChildElement('HFret');
                            if (hfret) {
                                note.harmonicValue = GpifParser.parseFloatSafe(hfret.innerText, 0);
                            }
                            break;
                        case 'Muted':
                            if (c.findChildElement('Enable')) {
                                note.isDead = true;
                            }
                            break;
                        case 'PalmMuted':
                            if (c.findChildElement('Enable')) {
                                note.isPalmMute = true;
                            }
                            break;
                        case 'Octave':
                            note.octave = GpifParser.parseIntSafe(c.findChildElement('Number')?.innerText, 0);
                            if (note.tone === -1) {
                                note.tone = 0;
                            }
                            break;
                        case 'Tone':
                            note.tone = GpifParser.parseIntSafe(c.findChildElement('Step')?.innerText, 0);
                            break;
                        case 'ConcertPitch':
                            if (!hasTransposedPitch) {
                                this.parseConcertPitch(c, note);
                            }
                            break;
                        case 'TransposedPitch':
                            note.accidentalMode = NoteAccidentalMode.Default;
                            this.parseConcertPitch(c, note);
                            hasTransposedPitch = true;
                            break;
                        case 'Bended':
                            isBended = true;
                            break;
                        case 'BendOriginValue':
                            if (!bendOrigin) {
                                bendOrigin = new BendPoint(0, 0);
                            }
                            bendOrigin.value = this.toBendValue(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'BendOriginOffset':
                            if (!bendOrigin) {
                                bendOrigin = new BendPoint(0, 0);
                            }
                            bendOrigin.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'BendMiddleValue':
                            bendMiddleValue = this.toBendValue(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'BendMiddleOffset1':
                            bendMiddleOffset1 = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'BendMiddleOffset2':
                            bendMiddleOffset2 = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'BendDestinationValue':
                            if (!bendDestination) {
                                bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
                            }
                            bendDestination.value = this.toBendValue(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'BendDestinationOffset':
                            if (!bendDestination) {
                                bendDestination = new BendPoint(0, 0);
                            }
                            bendDestination.offset = this.toBendOffset(GpifParser.parseFloatSafe(c.findChildElement('Float')?.innerText, 0));
                            break;
                        case 'HopoOrigin':
                            if (c.findChildElement('Enable')) {
                                note.isHammerPullOrigin = true;
                            }
                            break;
                        case 'HopoDestination':
                            break;
                        case 'LeftHandTapped':
                            note.isLeftHandTapped = true;
                            break;
                        case 'Slide':
                            const slideFlags = GpifParser.parseIntSafe(c.findChildElement('Flags')?.innerText, 0);
                            if ((slideFlags & 1) !== 0) {
                                note.slideOutType = SlideOutType.Shift;
                            }
                            else if ((slideFlags & 2) !== 0) {
                                note.slideOutType = SlideOutType.Legato;
                            }
                            else if ((slideFlags & 4) !== 0) {
                                note.slideOutType = SlideOutType.OutDown;
                            }
                            else if ((slideFlags & 8) !== 0) {
                                note.slideOutType = SlideOutType.OutUp;
                            }
                            if ((slideFlags & 16) !== 0) {
                                note.slideInType = SlideInType.IntoFromBelow;
                            }
                            else if ((slideFlags & 32) !== 0) {
                                note.slideInType = SlideInType.IntoFromAbove;
                            }
                            if ((slideFlags & 64) !== 0) {
                                note.slideOutType = SlideOutType.PickSlideDown;
                            }
                            else if ((slideFlags & 128) !== 0) {
                                note.slideOutType = SlideOutType.PickSlideUp;
                            }
                            break;
                    }
                    break;
            }
        }
        if (isBended) {
            if (!bendOrigin) {
                bendOrigin = new BendPoint(0, 0);
            }
            if (!bendDestination) {
                bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
            }
            note.addBendPoint(bendOrigin);
            if (bendMiddleOffset1 && bendMiddleValue) {
                note.addBendPoint(new BendPoint(bendMiddleOffset1, bendMiddleValue));
            }
            if (bendMiddleOffset2 && bendMiddleValue) {
                note.addBendPoint(new BendPoint(bendMiddleOffset2, bendMiddleValue));
            }
            if (!bendMiddleOffset1 && !bendMiddleOffset2 && bendMiddleValue) {
                note.addBendPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, bendMiddleValue));
            }
            note.addBendPoint(bendDestination);
        }
        if (element !== -1 && variation !== -1) {
            note.percussionArticulation = PercussionMapper.articulationFromElementVariation(element, variation);
        }
    }
    parseConcertPitch(node, note) {
        const pitch = node.findChildElement('Pitch');
        if (pitch) {
            for (const c of pitch.childElements()) {
                switch (c.localName) {
                    case 'Accidental':
                        switch (c.innerText) {
                            case 'x':
                                note.accidentalMode = NoteAccidentalMode.ForceDoubleSharp;
                                break;
                            case '#':
                                note.accidentalMode = NoteAccidentalMode.ForceSharp;
                                break;
                            case 'b':
                                note.accidentalMode = NoteAccidentalMode.ForceFlat;
                                break;
                            case 'bb':
                                note.accidentalMode = NoteAccidentalMode.ForceDoubleFlat;
                                break;
                        }
                        break;
                }
            }
        }
    }
    toBendValue(gpxValue) {
        return (gpxValue * GpifParser.BendPointValueFactor) | 0;
    }
    toBendOffset(gpxOffset) {
        return gpxOffset * GpifParser.BendPointPositionFactor;
    }
    parseRhythms(node) {
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'Rhythm':
                    this.parseRhythm(c);
                    break;
            }
        }
    }
    parseRhythm(node) {
        const rhythm = new GpifRhythm();
        const rhythmId = node.getAttribute('id');
        rhythm.id = rhythmId;
        for (const c of node.childElements()) {
            switch (c.localName) {
                case 'NoteValue':
                    switch (c.innerText) {
                        case 'Long':
                            rhythm.value = Duration.QuadrupleWhole;
                            break;
                        case 'DoubleWhole':
                            rhythm.value = Duration.DoubleWhole;
                            break;
                        case 'Whole':
                            rhythm.value = Duration.Whole;
                            break;
                        case 'Half':
                            rhythm.value = Duration.Half;
                            break;
                        case 'Quarter':
                            rhythm.value = Duration.Quarter;
                            break;
                        case 'Eighth':
                            rhythm.value = Duration.Eighth;
                            break;
                        case '16th':
                            rhythm.value = Duration.Sixteenth;
                            break;
                        case '32nd':
                            rhythm.value = Duration.ThirtySecond;
                            break;
                        case '64th':
                            rhythm.value = Duration.SixtyFourth;
                            break;
                        case '128th':
                            rhythm.value = Duration.OneHundredTwentyEighth;
                            break;
                        case '256th':
                            rhythm.value = Duration.TwoHundredFiftySixth;
                            break;
                    }
                    break;
                case 'PrimaryTuplet':
                    rhythm.tupletNumerator = GpifParser.parseIntSafe(c.getAttribute('num'), -1);
                    rhythm.tupletDenominator = GpifParser.parseIntSafe(c.getAttribute('den'), -1);
                    break;
                case 'AugmentationDot':
                    rhythm.dots = GpifParser.parseIntSafe(c.getAttribute('count'), 0);
                    break;
            }
        }
        this._rhythmById.set(rhythmId, rhythm);
    }
    buildModel() {
        for (let i = 0, j = this._masterBars.length; i < j; i++) {
            const masterBar = this._masterBars[i];
            this.score.addMasterBar(masterBar);
        }
        const lastMasterBar = this._masterBars[this._masterBars.length - 1];
        if (this._doubleBars.has(lastMasterBar)) {
            this._doubleBars.delete(lastMasterBar);
            lastMasterBar.isDoubleBar = false;
        }
        const trackIndexToTrackId = [];
        for (const trackId of this._tracksMapping) {
            if (!trackId) {
                continue;
            }
            const track = this._tracksById.get(trackId);
            this.score.addTrack(track);
            trackIndexToTrackId.push(trackId);
        }
        let keySignature;
        for (const barIds of this._barsOfMasterBar) {
            let staffIndex = 0;
            let trackIndex = 0;
            keySignature = [KeySignature.C, KeySignatureType.Major];
            if (this._transposeKeySignaturePerTrack.has(trackIndexToTrackId[0])) {
                keySignature = [
                    ModelUtils.transposeKey(keySignature[0], this._transposeKeySignaturePerTrack.get(trackIndexToTrackId[0])),
                    keySignature[1]
                ];
            }
            for (let barIndex = 0; barIndex < barIds.length && trackIndex < this.score.tracks.length; barIndex++) {
                const barId = barIds[barIndex];
                if (barId !== GpifParser.InvalidId) {
                    const bar = this._barsById.get(barId);
                    const track = this.score.tracks[trackIndex];
                    const staff = track.staves[staffIndex];
                    staff.addBar(bar);
                    const masterBarIndex = staff.bars.length - 1;
                    if (this._keySignatures.has(masterBarIndex)) {
                        keySignature = this._keySignatures.get(masterBarIndex);
                        if (this._transposeKeySignaturePerTrack.has(trackIndexToTrackId[trackIndex])) {
                            keySignature = [
                                ModelUtils.transposeKey(keySignature[0], this._transposeKeySignaturePerTrack.get(trackIndexToTrackId[trackIndex])),
                                keySignature[1]
                            ];
                        }
                    }
                    bar.keySignature = keySignature[0];
                    bar.keySignatureType = keySignature[1];
                    if (this._doubleBars.has(bar.masterBar)) {
                        bar.barLineRight = BarLineStyle.LightLight;
                    }
                    if (this._voicesOfBar.has(barId)) {
                        for (const voiceId of this._voicesOfBar.get(barId)) {
                            if (voiceId !== GpifParser.InvalidId) {
                                const voice = this._voiceById.get(voiceId);
                                bar.addVoice(voice);
                                if (this._beatsOfVoice.has(voiceId)) {
                                    for (const beatId of this._beatsOfVoice.get(voiceId)) {
                                        if (beatId !== GpifParser.InvalidId) {
                                            const beat = BeatCloner.clone(this._beatById.get(beatId));
                                            voice.addBeat(beat);
                                            const rhythmId = this._rhythmOfBeat.get(beatId);
                                            const rhythm = this._rhythmById.get(rhythmId);
                                            beat.duration = rhythm.value;
                                            beat.dots = rhythm.dots;
                                            beat.tupletNumerator = rhythm.tupletNumerator;
                                            beat.tupletDenominator = rhythm.tupletDenominator;
                                            if (this._notesOfBeat.has(beatId)) {
                                                for (const noteId of this._notesOfBeat.get(beatId)) {
                                                    if (noteId !== GpifParser.InvalidId) {
                                                        const note = NoteCloner.clone(this._noteById.get(noteId));
                                                        if (staff.isPercussion) {
                                                            note.fret = -1;
                                                            note.string = -1;
                                                        }
                                                        else {
                                                            note.percussionArticulation = -1;
                                                        }
                                                        beat.addNote(note);
                                                        if (this._tappedNotes.has(noteId)) {
                                                            beat.tap = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                const voice = new Voice();
                                bar.addVoice(voice);
                                const beat = new Beat();
                                beat.isEmpty = true;
                                beat.duration = Duration.Quarter;
                                voice.addBeat(beat);
                            }
                        }
                    }
                    if (staffIndex === track.staves.length - 1) {
                        trackIndex++;
                        staffIndex = 0;
                    }
                    else {
                        staffIndex++;
                    }
                    keySignature = [KeySignature.C, KeySignatureType.Major];
                    if (trackIndex < trackIndexToTrackId.length &&
                        this._transposeKeySignaturePerTrack.has(trackIndexToTrackId[trackIndex])) {
                        keySignature = [
                            ModelUtils.transposeKey(keySignature[0], this._transposeKeySignaturePerTrack.get(trackIndexToTrackId[trackIndex])),
                            keySignature[1]
                        ];
                    }
                }
                else {
                    trackIndex++;
                }
            }
        }
        for (const trackId of this._tracksMapping) {
            if (!trackId) {
                continue;
            }
            const track = this._tracksById.get(trackId);
            let hasPercussion = false;
            for (const staff of track.staves) {
                if (staff.isPercussion) {
                    hasPercussion = true;
                    break;
                }
            }
            if (!hasPercussion) {
                track.percussionArticulations = [];
            }
            if (this._automationsPerTrackIdAndBarIndex.has(trackId)) {
                const trackAutomations = this._automationsPerTrackIdAndBarIndex.get(trackId);
                for (const [barNumber, automations] of trackAutomations) {
                    if (track.staves.length > 0 && barNumber < track.staves[0].bars.length) {
                        const bar = track.staves[0].bars[barNumber];
                        if (bar.voices.length > 0 && bar.voices[0].beats.length > 0) {
                            const beat = bar.voices[0].beats[0];
                            for (const a of automations) {
                                const skip = a.type === AutomationType.Bank && a.value === 0 && bar.index === 0;
                                if (!skip) {
                                    beat.automations.push(a);
                                }
                            }
                        }
                    }
                }
            }
            if (this._sustainPedalsPerTrackIdAndBarIndex.has(trackId)) {
                const sustainPedals = this._sustainPedalsPerTrackIdAndBarIndex.get(trackId);
                for (const [barNumber, markers] of sustainPedals) {
                    if (track.staves.length > 0 && barNumber < track.staves[0].bars.length) {
                        const bar = track.staves[0].bars[barNumber];
                        bar.sustainPedals = markers;
                    }
                }
            }
        }
        for (const [barNumber, automations] of this._masterTrackAutomations) {
            const masterBar = this.score.masterBars[barNumber];
            for (let i = 0, j = automations.length; i < j; i++) {
                const automation = automations[i];
                switch (automation.type) {
                    case AutomationType.Tempo:
                        if (barNumber === 0) {
                            this.score.tempo = automation.value | 0;
                            if (automation.text) {
                                this.score.tempoLabel = automation.text;
                            }
                        }
                        masterBar.tempoAutomations.push(automation);
                        break;
                    case AutomationType.SyncPoint:
                        automation.syncPointValue.millisecondOffset -= this._backingTrackPadding;
                        masterBar.addSyncPoint(automation);
                        break;
                }
            }
        }
    }
}
GpifParser.InvalidId = '-1';
GpifParser.BendPointPositionFactor = BendPoint.MaxPosition / 100.0;
GpifParser.BendPointValueFactor = 1 / 25.0;
GpifParser.SampleRate = 44100;
var DataType;
(function (DataType) {
    DataType[DataType["Boolean"] = 0] = "Boolean";
    DataType[DataType["Integer"] = 1] = "Integer";
    DataType[DataType["Float"] = 2] = "Float";
    DataType[DataType["String"] = 3] = "String";
    DataType[DataType["Point"] = 4] = "Point";
    DataType[DataType["Size"] = 5] = "Size";
    DataType[DataType["Rectangle"] = 6] = "Rectangle";
    DataType[DataType["Color"] = 7] = "Color";
})(DataType || (DataType = {}));
class BinaryStylesheet {
    constructor(data) {
        this._types = new Map();
        this.raw = new Map();
        if (data) {
            this.read(data);
        }
    }
    read(data) {
        const readable = ByteBuffer.fromBuffer(data);
        const entryCount = IOHelper.readInt32BE(readable);
        for (let i = 0; i < entryCount; i++) {
            const key = GpBinaryHelpers.gpReadString(readable, readable.readByte(), 'utf-8');
            const type = readable.readByte();
            this._types.set(key, type);
            switch (type) {
                case DataType.Boolean:
                    const flag = readable.readByte() === 1;
                    this.addValue(key, flag);
                    break;
                case DataType.Integer:
                    const ivalue = IOHelper.readInt32BE(readable);
                    this.addValue(key, ivalue);
                    break;
                case DataType.Float:
                    const fvalue = IOHelper.readFloat32BE(readable);
                    this.addValue(key, fvalue);
                    break;
                case DataType.String:
                    const s = GpBinaryHelpers.gpReadString(readable, IOHelper.readInt16BE(readable), 'utf-8');
                    this.addValue(key, s);
                    break;
                case DataType.Point:
                    const x = IOHelper.readInt32BE(readable);
                    const y = IOHelper.readInt32BE(readable);
                    this.addValue(key, new BendPoint(x, y));
                    break;
                case DataType.Size:
                    const width = IOHelper.readInt32BE(readable);
                    const height = IOHelper.readInt32BE(readable);
                    this.addValue(key, new BendPoint(width, height));
                    break;
                case DataType.Rectangle:
                    break;
                case DataType.Color:
                    const color = GpBinaryHelpers.gpReadColor(readable, true);
                    this.addValue(key, color);
                    break;
            }
        }
    }
    apply(score) {
    }
    addValue(key, value, type) {
        this.raw.set(key, value);
        if (type !== undefined) {
            this._types.set(key, type);
        }
    }
    writeTo(writer) {
        IOHelper.writeInt32BE(writer, this.raw.size);
        for (const [k, v] of this.raw) {
            const dataType = this.getDataType(k, v);
            GpBinaryHelpers.gpWriteString(writer, k);
            writer.writeByte(dataType);
            switch (dataType) {
                case DataType.Boolean:
                    writer.writeByte(v ? 1 : 0);
                    break;
                case DataType.Integer:
                    IOHelper.writeInt32BE(writer, v);
                    break;
                case DataType.Float:
                    IOHelper.writeFloat32BE(writer, v);
                    break;
                case DataType.String:
                    const encoded = IOHelper.stringToBytes(v);
                    IOHelper.writeInt16BE(writer, encoded.length);
                    writer.write(encoded, 0, encoded.length);
                    break;
                case DataType.Point:
                    IOHelper.writeInt32BE(writer, v.offset);
                    IOHelper.writeInt32BE(writer, v.value);
                    break;
                case DataType.Size:
                    IOHelper.writeInt32BE(writer, v.offset);
                    IOHelper.writeInt32BE(writer, v.value);
                    break;
                case DataType.Rectangle:
                    break;
                case DataType.Color:
                    writer.writeByte(v.r);
                    writer.writeByte(v.g);
                    writer.writeByte(v.b);
                    writer.writeByte(v.a);
                    break;
            }
        }
    }
    getDataType(key, value) {
        if (this._types.has(key)) {
            return this._types.get(key);
        }
        const type = typeof value;
        switch (typeof value) {
            case 'string':
                return DataType.String;
            case 'number':
                const withoutFraction = value | 0;
                return value === withoutFraction ? DataType.Integer : DataType.Float;
            case 'object':
                if (value instanceof BendPoint) {
                    return DataType.Point;
                }
                if (value instanceof Color) {
                    return DataType.Color;
                }
                break;
        }
        throw new AlphaTabError(AlphaTabErrorType.General, `Unknown value type in BinaryStylesheet: ${type}`);
    }
    static addHeaderAndFooter(binaryStylesheet, style, prefix, name) {
        binaryStylesheet.addValue(`${prefix}${name}`, style.template, DataType.String);
        if (style.isVisible !== undefined) {
            binaryStylesheet.addValue(`${prefix}draw${name}`, style.isVisible, DataType.Boolean);
        }
    }
}
class Lazy {
    constructor(factory) {
        this._value = undefined;
        this._factory = factory;
    }
    get value() {
        if (this._value === undefined) {
            this._value = this._factory();
        }
        return this._value;
    }
}
var XmlNodeType;
(function (XmlNodeType) {
    XmlNodeType[XmlNodeType["None"] = 0] = "None";
    XmlNodeType[XmlNodeType["Element"] = 1] = "Element";
    XmlNodeType[XmlNodeType["Text"] = 2] = "Text";
    XmlNodeType[XmlNodeType["CDATA"] = 3] = "CDATA";
    XmlNodeType[XmlNodeType["Document"] = 4] = "Document";
    XmlNodeType[XmlNodeType["DocumentType"] = 5] = "DocumentType";
    XmlNodeType[XmlNodeType["Comment"] = 6] = "Comment";
})(XmlNodeType || (XmlNodeType = {}));
class XmlNode {
    constructor() {
        this.nodeType = XmlNodeType.None;
        this.localName = null;
        this.value = null;
        this.childNodes = [];
        this.attributes = new Map();
        this.firstChild = null;
        this.firstElement = null;
    }
    *childElements() {
        for (const c of this.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                yield c;
            }
        }
    }
    addChild(node) {
        this.childNodes.push(node);
        this.firstChild = node;
        if (node.nodeType === XmlNodeType.Element || node.nodeType === XmlNodeType.CDATA) {
            this.firstElement = node;
        }
    }
    getAttribute(name, defaultValue = '') {
        if (this.attributes.has(name)) {
            return this.attributes.get(name);
        }
        return defaultValue;
    }
    getElementsByTagName(name, recursive = false) {
        const tags = [];
        this.searchElementsByTagName(this.childNodes, tags, name, recursive);
        return tags;
    }
    searchElementsByTagName(all, result, name, recursive = false) {
        for (const c of all) {
            if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
                result.push(c);
            }
            if (recursive) {
                this.searchElementsByTagName(c.childNodes, result, name, true);
            }
        }
    }
    findChildElement(name) {
        for (const c of this.childNodes) {
            if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
                return c;
            }
        }
        return null;
    }
    addElement(name) {
        const newNode = new XmlNode();
        newNode.nodeType = XmlNodeType.Element;
        newNode.localName = name;
        this.addChild(newNode);
        return newNode;
    }
    get innerText() {
        if (this.nodeType === XmlNodeType.Element || this.nodeType === XmlNodeType.Document) {
            if (this.firstElement && this.firstElement.nodeType === XmlNodeType.CDATA) {
                return this.firstElement.innerText;
            }
            let txt = '';
            for (const c of this.childNodes) {
                txt += c.innerText?.toString();
            }
            const s = txt;
            return s.trim();
        }
        return this.value ?? '';
    }
    set innerText(value) {
        const textNode = new XmlNode();
        textNode.nodeType = XmlNodeType.Text;
        textNode.value = value;
        this.childNodes = [textNode];
    }
    setCData(s) {
        const textNode = new XmlNode();
        textNode.nodeType = XmlNodeType.CDATA;
        textNode.value = s;
        this.childNodes = [textNode];
    }
}
class XmlDocument extends XmlNode {
    constructor() {
        super();
        this.nodeType = XmlNodeType.Document;
    }
    parse(xml) {
        XmlParser.parse(xml, 0, this);
    }
    toString() {
        return this.toFormattedString();
    }
    toFormattedString(indention = '', xmlHeader = false) {
        return XmlWriter.write(this, indention, xmlHeader);
    }
}
class XmlError extends AlphaTabError {
    constructor(message, xml, pos) {
        super(AlphaTabErrorType.Format, message);
        this.pos = 0;
        this.xml = xml;
        this.pos = pos;
        Object.setPrototypeOf(this, XmlError.prototype);
    }
}
var XmlState;
(function (XmlState) {
    XmlState[XmlState["IgnoreSpaces"] = 0] = "IgnoreSpaces";
    XmlState[XmlState["Begin"] = 1] = "Begin";
    XmlState[XmlState["BeginNode"] = 2] = "BeginNode";
    XmlState[XmlState["TagName"] = 3] = "TagName";
    XmlState[XmlState["Body"] = 4] = "Body";
    XmlState[XmlState["AttribName"] = 5] = "AttribName";
    XmlState[XmlState["Equals"] = 6] = "Equals";
    XmlState[XmlState["AttvalBegin"] = 7] = "AttvalBegin";
    XmlState[XmlState["AttribVal"] = 8] = "AttribVal";
    XmlState[XmlState["Childs"] = 9] = "Childs";
    XmlState[XmlState["Close"] = 10] = "Close";
    XmlState[XmlState["WaitEnd"] = 11] = "WaitEnd";
    XmlState[XmlState["WaitEndRet"] = 12] = "WaitEndRet";
    XmlState[XmlState["Pcdata"] = 13] = "Pcdata";
    XmlState[XmlState["Header"] = 14] = "Header";
    XmlState[XmlState["Comment"] = 15] = "Comment";
    XmlState[XmlState["Doctype"] = 16] = "Doctype";
    XmlState[XmlState["Cdata"] = 17] = "Cdata";
    XmlState[XmlState["Escape"] = 18] = "Escape";
})(XmlState || (XmlState = {}));
class XmlParser {
    static parse(str, p, parent) {
        let c = str.charCodeAt(p);
        let state = XmlState.Begin;
        let next = XmlState.Begin;
        let start = 0;
        let buf = '';
        let escapeNext = XmlState.Begin;
        let xml = null;
        let aname = null;
        let nbrackets = 0;
        let attrValQuote = 0;
        while (p < str.length) {
            c = str.charCodeAt(p);
            switch (state) {
                case XmlState.IgnoreSpaces:
                    switch (c) {
                        case XmlParser.CharCodeLF:
                        case XmlParser.CharCodeCR:
                        case XmlParser.CharCodeTab:
                        case XmlParser.CharCodeSpace:
                            break;
                        default:
                            state = next;
                            continue;
                    }
                    break;
                case XmlState.Begin:
                    switch (c) {
                        case XmlParser.CharCodeLowerThan:
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.BeginNode;
                            break;
                        default:
                            start = p;
                            state = XmlState.Pcdata;
                            continue;
                    }
                    break;
                case XmlState.Pcdata:
                    if (c === XmlParser.CharCodeLowerThan) {
                        buf += str.substr(start, p - start);
                        const child = new XmlNode();
                        child.nodeType = XmlNodeType.Text;
                        child.value = buf;
                        buf = '';
                        parent.addChild(child);
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.BeginNode;
                    }
                    else if (c === XmlParser.CharCodeAmp) {
                        buf += str.substr(start, p - start);
                        state = XmlState.Escape;
                        escapeNext = XmlState.Pcdata;
                        start = p + 1;
                    }
                    break;
                case XmlState.Cdata:
                    if (c === XmlParser.CharCodeBrackedClose &&
                        str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedClose &&
                        str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan) {
                        const child = new XmlNode();
                        child.nodeType = XmlNodeType.CDATA;
                        child.value = str.substr(start, p - start);
                        parent.addChild(child);
                        p += 2;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.BeginNode:
                    switch (c) {
                        case XmlParser.CharCodeExclamation:
                            if (str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedOpen) {
                                p += 2;
                                if (str.substr(p, 6).toUpperCase() !== 'CDATA[') {
                                    throw new XmlError('Expected <![CDATA[', str, p);
                                }
                                p += 5;
                                state = XmlState.Cdata;
                                start = p + 1;
                            }
                            else if (str.charCodeAt(p + 1) === XmlParser.CharCodeUpperD ||
                                str.charCodeAt(p + 1) === XmlParser.CharCodeLowerD) {
                                if (str.substr(p + 2, 6).toUpperCase() !== 'OCTYPE') {
                                    throw new XmlError('Expected <!DOCTYPE', str, p);
                                }
                                p += 8;
                                state = XmlState.Doctype;
                                start = p + 1;
                            }
                            else if (str.charCodeAt(p + 1) !== XmlParser.CharCodeMinus ||
                                str.charCodeAt(p + 2) !== XmlParser.CharCodeMinus) {
                                throw new XmlError('Expected <!--', str, p);
                            }
                            else {
                                p += 2;
                                state = XmlState.Comment;
                                start = p + 1;
                            }
                            break;
                        case XmlParser.CharCodeQuestion:
                            state = XmlState.Header;
                            start = p;
                            break;
                        case XmlParser.CharCodeSlash:
                            if (!parent) {
                                throw new XmlError('Expected node name', str, p);
                            }
                            start = p + 1;
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.Close;
                            break;
                        default:
                            state = XmlState.TagName;
                            start = p;
                            continue;
                    }
                    break;
                case XmlState.TagName:
                    if (!XmlParser.isValidChar(c)) {
                        if (p === start) {
                            throw new XmlError('Expected node name', str, p);
                        }
                        xml = new XmlNode();
                        xml.nodeType = XmlNodeType.Element;
                        xml.localName = str.substr(start, p - start);
                        parent.addChild(xml);
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.Body;
                        continue;
                    }
                    break;
                case XmlState.Body:
                    switch (c) {
                        case XmlParser.CharCodeSlash:
                            state = XmlState.WaitEnd;
                            break;
                        case XmlParser.CharCodeGreaterThan:
                            state = XmlState.Childs;
                            break;
                        default:
                            state = XmlState.AttribName;
                            start = p;
                            continue;
                    }
                    break;
                case XmlState.AttribName:
                    if (!XmlParser.isValidChar(c)) {
                        if (start === p) {
                            throw new XmlError('Expected attribute name', str, p);
                        }
                        const tmp = str.substr(start, p - start);
                        aname = tmp;
                        if (xml.attributes.has(aname)) {
                            throw new XmlError(`Duplicate attribute [${aname}]`, str, p);
                        }
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.Equals;
                        continue;
                    }
                    break;
                case XmlState.Equals:
                    switch (c) {
                        case XmlParser.CharCodeEquals:
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.AttvalBegin;
                            break;
                        default:
                            throw new XmlError('Expected =', str, p);
                    }
                    break;
                case XmlState.AttvalBegin:
                    switch (c) {
                        case XmlParser.CharCodeDoubleQuote:
                        case XmlParser.CharCodeSingleQuote:
                            buf = '';
                            state = XmlState.AttribVal;
                            start = p + 1;
                            attrValQuote = c;
                            break;
                    }
                    break;
                case XmlState.AttribVal:
                    switch (c) {
                        case XmlParser.CharCodeAmp:
                            buf += str.substr(start, p - start);
                            state = XmlState.Escape;
                            escapeNext = XmlState.AttribVal;
                            start = p + 1;
                            break;
                        default:
                            if (c === attrValQuote) {
                                buf += str.substr(start, p - start);
                                const value = buf;
                                buf = '';
                                xml.attributes.set(aname, value);
                                state = XmlState.IgnoreSpaces;
                                next = XmlState.Body;
                            }
                            break;
                    }
                    break;
                case XmlState.Childs:
                    p = XmlParser.parse(str, p, xml);
                    start = p;
                    state = XmlState.Begin;
                    break;
                case XmlState.WaitEnd:
                    switch (c) {
                        case XmlParser.CharCodeGreaterThan:
                            state = XmlState.Begin;
                            break;
                        default:
                            throw new XmlError('Expected >', str, p);
                    }
                    break;
                case XmlState.WaitEndRet:
                    switch (c) {
                        case XmlParser.CharCodeGreaterThan:
                            return p;
                        default:
                            throw new XmlError('Expected >', str, p);
                    }
                case XmlState.Close:
                    if (!XmlParser.isValidChar(c)) {
                        if (start === p) {
                            throw new XmlError('Expected node name', str, p);
                        }
                        const v = str.substr(start, p - start);
                        if (v !== parent.localName) {
                            throw new XmlError(`Expected </${parent.localName}>`, str, p);
                        }
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.WaitEndRet;
                        continue;
                    }
                    break;
                case XmlState.Comment:
                    if (c === XmlParser.CharCodeMinus &&
                        str.charCodeAt(p + 1) === XmlParser.CharCodeMinus &&
                        str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan) {
                        p += 2;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Doctype:
                    if (c === XmlParser.CharCodeBrackedOpen) {
                        nbrackets++;
                    }
                    else if (c === XmlParser.CharCodeBrackedClose) {
                        nbrackets--;
                    }
                    else if (c === XmlParser.CharCodeGreaterThan && nbrackets === 0) {
                        const node = new XmlNode();
                        node.nodeType = XmlNodeType.DocumentType;
                        node.value = str.substr(start, p - start);
                        parent.addChild(node);
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Header:
                    if (c === XmlParser.CharCodeQuestion && str.charCodeAt(p + 1) === XmlParser.CharCodeGreaterThan) {
                        p++;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Escape:
                    if (c === XmlParser.CharCodeSemi) {
                        const s = str.substr(start, p - start);
                        if (s.charCodeAt(0) === XmlParser.CharCodeSharp) {
                            const code = s.charCodeAt(1) === XmlParser.CharCodeLowerX
                                ? Number.parseInt(`0${s.substr(1, s.length - 1)}`, 10)
                                : Number.parseInt(s.substr(1, s.length - 1), 10);
                            buf += String.fromCharCode(code);
                        }
                        else if (XmlParser.Escapes.has(s)) {
                            buf += XmlParser.Escapes.get(s);
                        }
                        else {
                            buf += `&${s};`?.toString();
                        }
                        start = p + 1;
                        state = escapeNext;
                    }
                    else if (!XmlParser.isValidChar(c) && c !== XmlParser.CharCodeSharp) {
                        buf += '&';
                        buf += str.substr(start, p - start);
                        p--;
                        start = p + 1;
                        state = escapeNext;
                    }
                    break;
            }
            p++;
        }
        if (state === XmlState.Begin) {
            start = p;
            state = XmlState.Pcdata;
        }
        if (state === XmlState.Pcdata) {
            if (p !== start) {
                buf += str.substr(start, p - start);
                const node = new XmlNode();
                node.nodeType = XmlNodeType.Text;
                node.value = buf;
                parent.addChild(node);
            }
            return p;
        }
        if (state === XmlState.Escape && escapeNext === XmlState.Pcdata) {
            buf += '&';
            buf += str.substr(start, p - start);
            const node = new XmlNode();
            node.nodeType = XmlNodeType.Text;
            node.value = buf;
            parent.addChild(node);
            return p;
        }
        throw new XmlError('Unexpected end', str, p);
    }
    static isValidChar(c) {
        return ((c >= XmlParser.CharCodeLowerA && c <= XmlParser.CharCodeLowerZ) ||
            (c >= XmlParser.CharCodeUpperA && c <= XmlParser.CharCodeUpperZ) ||
            (c >= XmlParser.CharCode0 && c <= XmlParser.CharCode9) ||
            c === XmlParser.CharCodeColon ||
            c === XmlParser.CharCodeDot ||
            c === XmlParser.CharCodeUnderscore ||
            c === XmlParser.CharCodeMinus);
    }
}
XmlParser.CharCodeLF = 10;
XmlParser.CharCodeTab = 9;
XmlParser.CharCodeCR = 13;
XmlParser.CharCodeSpace = 32;
XmlParser.CharCodeLowerThan = 60;
XmlParser.CharCodeAmp = 38;
XmlParser.CharCodeBrackedClose = 93;
XmlParser.CharCodeBrackedOpen = 91;
XmlParser.CharCodeGreaterThan = 62;
XmlParser.CharCodeExclamation = 33;
XmlParser.CharCodeUpperD = 68;
XmlParser.CharCodeLowerD = 100;
XmlParser.CharCodeMinus = 45;
XmlParser.CharCodeQuestion = 63;
XmlParser.CharCodeSlash = 47;
XmlParser.CharCodeEquals = 61;
XmlParser.CharCodeDoubleQuote = 34;
XmlParser.CharCodeSingleQuote = 39;
XmlParser.CharCodeSharp = 35;
XmlParser.CharCodeLowerX = 120;
XmlParser.CharCodeLowerA = 97;
XmlParser.CharCodeLowerZ = 122;
XmlParser.CharCodeUpperA = 65;
XmlParser.CharCodeUpperZ = 90;
XmlParser.CharCode0 = 48;
XmlParser.CharCode9 = 57;
XmlParser.CharCodeColon = 58;
XmlParser.CharCodeDot = 46;
XmlParser.CharCodeUnderscore = 95;
XmlParser.CharCodeSemi = 59;
XmlParser.Escapes = new Map([
    ['lt', '<'],
    ['gt', '>'],
    ['amp', '&'],
    ['quot', '"'],
    ['apos', "'"]
]);
class XmlWriter {
    constructor(indention, xmlHeader) {
        this._result = [];
        this._indention = indention;
        this._xmlHeader = xmlHeader;
        this._currentIndention = '';
        this._isStartOfLine = true;
    }
    writeNode(xml) {
        switch (xml.nodeType) {
            case XmlNodeType.None:
                break;
            case XmlNodeType.Element:
                if (this._result.length > 0) {
                    this.writeLine();
                }
                this.write(`<${xml.localName}`);
                for (const [name, value] of xml.attributes) {
                    this.write(` ${name}="`);
                    this.writeAttributeValue(value);
                    this.write('"');
                }
                if (xml.childNodes.length === 0) {
                    this.write('/>');
                }
                else {
                    this.write('>');
                    if (xml.childNodes.length === 1 && !xml.firstElement) {
                        this.writeNode(xml.childNodes[0]);
                    }
                    else {
                        this.indent();
                        for (const child of xml.childNodes) {
                            if (child.nodeType === XmlNodeType.Element || child.nodeType === XmlNodeType.Comment) {
                                this.writeNode(child);
                            }
                        }
                        this.unindend();
                        this.writeLine();
                    }
                    this.write(`</${xml.localName}>`);
                }
                break;
            case XmlNodeType.Text:
                if (xml.value) {
                    this.write(xml.value);
                }
                break;
            case XmlNodeType.CDATA:
                if (xml.value !== null) {
                    this.write(`<![CDATA[${xml.value}]]>`);
                }
                break;
            case XmlNodeType.Document:
                if (this._xmlHeader) {
                    this.write('<?xml version="1.0" encoding="utf-8"?>');
                }
                for (const child of xml.childNodes) {
                    this.writeNode(child);
                }
                break;
            case XmlNodeType.DocumentType:
                this.write(`<!DOCTYPE ${xml.value}>`);
                break;
            case XmlNodeType.Comment:
                this.write(`<!-- ${xml.value} -->`);
                break;
        }
    }
    unindend() {
        this._currentIndention = this._currentIndention.substr(0, this._currentIndention.length - this._indention.length);
    }
    indent() {
        this._currentIndention += this._indention;
    }
    writeAttributeValue(value) {
        for (let i = 0; i < value.length; i++) {
            const c = value.charAt(i);
            switch (c) {
                case '<':
                    this._result.push('&lt;');
                    break;
                case '>':
                    this._result.push('&gt;');
                    break;
                case '&':
                    this._result.push('&amp;');
                    break;
                case "'":
                    this._result.push('&apos;');
                    break;
                case '"':
                    this._result.push('&quot;');
                    break;
                default:
                    this._result.push(c);
                    break;
            }
        }
    }
    static write(xml, indention, xmlHeader) {
        const writer = new XmlWriter(indention, xmlHeader);
        writer.writeNode(xml);
        return writer.toString();
    }
    write(s) {
        if (this._isStartOfLine) {
            this._result.push(this._currentIndention);
        }
        this._result.push(s);
        this._isStartOfLine = false;
    }
    writeLine(s = null) {
        if (s) {
            this.write(s);
        }
        if (this._indention.length > 0 && !this._isStartOfLine) {
            this._result.push('\n');
            this._isStartOfLine = true;
        }
    }
    toString() {
        return this._result.join('').trimRight();
    }
}
class BeatCloner {
    static clone(original) {
        const clone = new Beat();
        clone.index = original.index;
        clone.notes = [];
        for (const i of original.notes) {
            clone.addNote(NoteCloner.clone(i));
        }
        clone.isEmpty = original.isEmpty;
        clone.whammyStyle = original.whammyStyle;
        clone.ottava = original.ottava;
        clone.isLegatoOrigin = original.isLegatoOrigin;
        clone.duration = original.duration;
        clone.isLetRing = original.isLetRing;
        clone.isPalmMute = original.isPalmMute;
        clone.automations = [];
        for (const i of original.automations) {
            clone.automations.push(AutomationCloner.clone(i));
        }
        clone.dots = original.dots;
        clone.fade = original.fade;
        clone.lyrics = original.lyrics ? original.lyrics.slice() : null;
        clone.pop = original.pop;
        clone.slap = original.slap;
        clone.tap = original.tap;
        clone.text = original.text;
        clone.slashed = original.slashed;
        clone.deadSlapped = original.deadSlapped;
        clone.brushType = original.brushType;
        clone.brushDuration = original.brushDuration;
        clone.tupletDenominator = original.tupletDenominator;
        clone.tupletNumerator = original.tupletNumerator;
        clone.isContinuedWhammy = original.isContinuedWhammy;
        clone.whammyBarType = original.whammyBarType;
        if (original.whammyBarPoints) {
            clone.whammyBarPoints = [];
            for (const i of original.whammyBarPoints) {
                clone.addWhammyBarPoint(BendPointCloner.clone(i));
            }
        }
        clone.vibrato = original.vibrato;
        clone.chordId = original.chordId;
        clone.graceType = original.graceType;
        clone.pickStroke = original.pickStroke;
        clone.tremoloSpeed = original.tremoloSpeed;
        clone.crescendo = original.crescendo;
        clone.displayStart = original.displayStart;
        clone.playbackStart = original.playbackStart;
        clone.displayDuration = original.displayDuration;
        clone.playbackDuration = original.playbackDuration;
        clone.overrideDisplayDuration = original.overrideDisplayDuration;
        clone.golpe = original.golpe;
        clone.dynamics = original.dynamics;
        clone.invertBeamDirection = original.invertBeamDirection;
        clone.isEffectSlurOrigin = original.isEffectSlurOrigin;
        clone.beamingMode = original.beamingMode;
        clone.wahPedal = original.wahPedal;
        clone.barreFret = original.barreFret;
        clone.barreShape = original.barreShape;
        clone.rasgueado = original.rasgueado;
        clone.showTimer = original.showTimer;
        clone.timer = original.timer;
        return clone;
    }
}
class NoteCloner {
    static clone(original) {
        const clone = new Note();
        clone.index = original.index;
        clone.accentuated = original.accentuated;
        clone.bendType = original.bendType;
        clone.bendStyle = original.bendStyle;
        clone.isContinuedBend = original.isContinuedBend;
        if (original.bendPoints) {
            clone.bendPoints = [];
            for (const i of original.bendPoints) {
                clone.addBendPoint(BendPointCloner.clone(i));
            }
        }
        clone.fret = original.fret;
        clone.string = original.string;
        clone.showStringNumber = original.showStringNumber;
        clone.octave = original.octave;
        clone.tone = original.tone;
        clone.percussionArticulation = original.percussionArticulation;
        clone.isVisible = original.isVisible;
        clone.isLeftHandTapped = original.isLeftHandTapped;
        clone.isHammerPullOrigin = original.isHammerPullOrigin;
        clone.isSlurDestination = original.isSlurDestination;
        clone.harmonicType = original.harmonicType;
        clone.harmonicValue = original.harmonicValue;
        clone.isGhost = original.isGhost;
        clone.isLetRing = original.isLetRing;
        clone.isPalmMute = original.isPalmMute;
        clone.isDead = original.isDead;
        clone.isStaccato = original.isStaccato;
        clone.slideInType = original.slideInType;
        clone.slideOutType = original.slideOutType;
        clone.vibrato = original.vibrato;
        clone.isTieDestination = original.isTieDestination;
        clone.leftHandFinger = original.leftHandFinger;
        clone.rightHandFinger = original.rightHandFinger;
        clone.trillValue = original.trillValue;
        clone.trillSpeed = original.trillSpeed;
        clone.durationPercent = original.durationPercent;
        clone.accidentalMode = original.accidentalMode;
        clone.dynamics = original.dynamics;
        clone.ornament = original.ornament;
        return clone;
    }
}
class BendPointCloner {
    static clone(original) {
        const clone = new BendPoint();
        clone.offset = original.offset;
        clone.value = original.value;
        return clone;
    }
}
class AutomationCloner {
    static clone(original) {
        const clone = new Automation();
        clone.isLinear = original.isLinear;
        clone.type = original.type;
        clone.value = original.value;
        clone.syncPointValue = original.syncPointValue ? SyncPointDataCloner.clone(original.syncPointValue) : undefined;
        clone.ratioPosition = original.ratioPosition;
        clone.text = original.text;
        return clone;
    }
}
class SyncPointDataCloner {
    static clone(original) {
        const clone = new SyncPointData();
        clone.barOccurence = original.barOccurence;
        clone.millisecondOffset = original.millisecondOffset;
        return clone;
    }
}
class Adler32 {
    constructor() {
        this.value = 1;
        this.reset();
    }
    reset() {
        this.value = 1;
    }
    update(data, offset, count) {
        let s1 = this.value & 0xffff;
        let s2 = this.value >> 16;
        while (count > 0) {
            let n = 3800;
            if (n > count) {
                n = count;
            }
            count -= n;
            while (--n >= 0) {
                s1 = s1 + (data[offset++] & 0xff);
                s2 = s2 + s1;
            }
            s1 %= Adler32.Base;
            s2 %= Adler32.Base;
        }
        this.value = (s2 << 16) | s1;
    }
}
Adler32.Base = 65521;
class Crc32 {
    constructor() {
        this._checkValue = Crc32.CrcInit;
        this.reset();
    }
    static buildCrc32Lookup() {
        const poly = 0xedb88320;
        const lookup = new Uint32Array(256);
        for (let i = 0; i < lookup.length; i++) {
            let crc = i;
            for (let bit = 0; bit < 8; bit++) {
                crc = (crc & 1) === 1 ? (crc >>> 1) ^ poly : crc >>> 1;
            }
            lookup[i] = crc;
        }
        return lookup;
    }
    get value() {
        return ~this._checkValue;
    }
    update(data, offset, count) {
        for (let i = 0; i < count; i++) {
            this._checkValue =
                Crc32.Crc32Lookup[(this._checkValue ^ data[offset + i]) & 0xff] ^ (this._checkValue >>> 8);
        }
    }
    reset() {
        this._checkValue = Crc32.CrcInit;
    }
}
Crc32.Crc32Lookup = Crc32.buildCrc32Lookup();
Crc32.CrcInit = 0xffffffff;
class Deflater {
    constructor() {
        this._state = 0;
        this._pending = new PendingBuffer(DeflaterConstants.PENDING_BUF_SIZE);
        this._engine = new DeflaterEngine(this._pending);
        this.reset();
    }
    get inputCrc() {
        return this._engine.inputCrc.value;
    }
    get isNeedingInput() {
        return this._engine.needsInput();
    }
    get isFinished() {
        return this._state === Deflater.FinishedState && this._pending.isFlushed;
    }
    reset() {
        this._state = Deflater.BusyState;
        this._pending.reset();
        this._engine.reset();
    }
    setInput(input, offset, count) {
        this._engine.setInput(input, offset, count);
    }
    deflate(output, offset, length) {
        const origLength = length;
        while (true) {
            const count = this._pending.flush(output, offset, length);
            offset += count;
            length -= count;
            if (length === 0 || this._state === Deflater.FinishedState) {
                break;
            }
            if (!this._engine.deflate((this._state & Deflater.IsFlushing) !== 0, (this._state & Deflater.IsFinishing) !== 0)) {
                switch (this._state) {
                    case Deflater.BusyState:
                        return origLength - length;
                    case Deflater.FlushingState:
                        let neededbits = 8 + (-this._pending.bitCount & 7);
                        while (neededbits > 0) {
                            this._pending.writeBits(2, 10);
                            neededbits -= 10;
                        }
                        this._state = Deflater.BusyState;
                        break;
                    case Deflater.FinishingState:
                        this._pending.alignToByte();
                        this._state = Deflater.FinishedState;
                        break;
                }
            }
        }
        return origLength - length;
    }
    finish() {
        this._state |= Deflater.IsFlushing | Deflater.IsFinishing;
    }
}
Deflater.IsFlushing = 0x04;
Deflater.IsFinishing = 0x08;
Deflater.BusyState = 0x10;
Deflater.FlushingState = 0x14;
Deflater.FinishingState = 0x1c;
Deflater.FinishedState = 0x1e;
class DeflaterConstants {
}
DeflaterConstants.MAX_WBITS = 15;
DeflaterConstants.WSIZE = 1 << DeflaterConstants.MAX_WBITS;
DeflaterConstants.WMASK = DeflaterConstants.WSIZE - 1;
DeflaterConstants.MIN_MATCH = 3;
DeflaterConstants.MAX_MATCH = 258;
DeflaterConstants.DEFAULT_MEM_LEVEL = 8;
DeflaterConstants.PENDING_BUF_SIZE = 1 << (DeflaterConstants.DEFAULT_MEM_LEVEL + 8);
DeflaterConstants.HASH_BITS = DeflaterConstants.DEFAULT_MEM_LEVEL + 7;
DeflaterConstants.HASH_SIZE = 1 << DeflaterConstants.HASH_BITS;
DeflaterConstants.HASH_SHIFT = (DeflaterConstants.HASH_BITS + DeflaterConstants.MIN_MATCH - 1) / DeflaterConstants.MIN_MATCH;
DeflaterConstants.HASH_MASK = DeflaterConstants.HASH_SIZE - 1;
DeflaterConstants.MIN_LOOKAHEAD = DeflaterConstants.MAX_MATCH + DeflaterConstants.MIN_MATCH + 1;
DeflaterConstants.MAX_DIST = DeflaterConstants.WSIZE - DeflaterConstants.MIN_LOOKAHEAD;
class DeflaterEngine {
    constructor(pending) {
        this.maxChain = 128;
        this.niceLength = 128;
        this.goodLength = 8;
        this.insertHashIndex = 0;
        this.lookahead = 0;
        this.inputBuf = null;
        this.inputOff = 0;
        this.inputEnd = 0;
        this.prevAvailable = false;
        this.matchStart = 0;
        this.matchLen = 0;
        this.pending = pending;
        this.huffman = new DeflaterHuffman(pending);
        this.inputCrc = new Crc32();
        this.window = new Uint8Array(2 * DeflaterConstants.WSIZE);
        this.head = new Int16Array(DeflaterConstants.HASH_SIZE);
        this.prev = new Int16Array(DeflaterConstants.WSIZE);
        this.blockStart = 1;
        this.strstart = 1;
    }
    reset() {
        this.huffman.reset();
        this.inputCrc.reset();
        this.blockStart = 1;
        this.strstart = 1;
        this.lookahead = 0;
        this.prevAvailable = false;
        this.matchLen = DeflaterConstants.MIN_MATCH - 1;
        for (let i = 0; i < DeflaterConstants.HASH_SIZE; i++) {
            this.head[i] = 0;
        }
        for (let i = 0; i < DeflaterConstants.WSIZE; i++) {
            this.prev[i] = 0;
        }
    }
    updateHash() {
        this.insertHashIndex =
            (this.window[this.strstart] << DeflaterConstants.HASH_SHIFT) ^ this.window[this.strstart + 1];
    }
    needsInput() {
        return this.inputEnd === this.inputOff;
    }
    setInput(buffer, offset, count) {
        const end = offset + count;
        this.inputBuf = buffer;
        this.inputOff = offset;
        this.inputEnd = end;
    }
    deflate(flush, finish) {
        let progress;
        do {
            this.fillWindow();
            const canFlush = flush && this.inputOff === this.inputEnd;
            progress = this.deflateSlow(canFlush, finish);
        } while (this.pending.isFlushed && progress);
        return progress;
    }
    deflateSlow(flush, finish) {
        if (this.lookahead < DeflaterConstants.MIN_LOOKAHEAD && !flush) {
            return false;
        }
        while (this.lookahead >= DeflaterConstants.MIN_LOOKAHEAD || flush) {
            if (this.lookahead === 0) {
                if (this.prevAvailable) {
                    this.huffman.tallyLit(this.window[this.strstart - 1] & 0xff);
                }
                this.prevAvailable = false;
                this.huffman.flushBlock(this.window, this.blockStart, this.strstart - this.blockStart, finish);
                this.blockStart = this.strstart;
                return false;
            }
            if (this.strstart >= 2 * DeflaterConstants.WSIZE - DeflaterConstants.MIN_LOOKAHEAD) {
                this.slideWindow();
            }
            const prevMatch = this.matchStart;
            let prevLen = this.matchLen;
            if (this.lookahead >= DeflaterConstants.MIN_MATCH) {
                const hashHead = this.insertString();
                if (hashHead !== 0 &&
                    this.strstart - hashHead <= DeflaterConstants.MAX_DIST &&
                    this.findLongestMatch(hashHead)) {
                    if (this.matchLen === DeflaterConstants.MIN_MATCH &&
                        this.strstart - this.matchStart > DeflaterEngine.TooFar) {
                        this.matchLen = DeflaterConstants.MIN_MATCH - 1;
                    }
                }
            }
            if (prevLen >= DeflaterConstants.MIN_MATCH && this.matchLen <= prevLen) {
                this.huffman.tallyDist(this.strstart - 1 - prevMatch, prevLen);
                prevLen -= 2;
                do {
                    this.strstart++;
                    this.lookahead--;
                    if (this.lookahead >= DeflaterConstants.MIN_MATCH) {
                        this.insertString();
                    }
                } while (--prevLen > 0);
                this.strstart++;
                this.lookahead--;
                this.prevAvailable = false;
                this.matchLen = DeflaterConstants.MIN_MATCH - 1;
            }
            else {
                if (this.prevAvailable) {
                    this.huffman.tallyLit(this.window[this.strstart - 1] & 0xff);
                }
                this.prevAvailable = true;
                this.strstart++;
                this.lookahead--;
            }
            if (this.huffman.isFull()) {
                let len = this.strstart - this.blockStart;
                if (this.prevAvailable) {
                    len--;
                }
                const lastBlock = finish && this.lookahead === 0 && !this.prevAvailable;
                this.huffman.flushBlock(this.window, this.blockStart, len, lastBlock);
                this.blockStart += len;
                return !lastBlock;
            }
        }
        return true;
    }
    findLongestMatch(curMatch) {
        let match;
        let scan = this.strstart;
        const scanMax = scan + Math.min(DeflaterConstants.MAX_MATCH, this.lookahead) - 1;
        const limit = Math.max(scan - DeflaterConstants.MAX_DIST, 0);
        const window = this.window;
        const prev = this.prev;
        let chainLength = this.maxChain;
        const niceLength = Math.min(this.niceLength, this.lookahead);
        this.matchLen = Math.max(this.matchLen, DeflaterConstants.MIN_MATCH - 1);
        if (scan + this.matchLen > scanMax) {
            return false;
        }
        let scan_end1 = window[scan + this.matchLen - 1];
        let scan_end = window[scan + this.matchLen];
        if (this.matchLen >= this.goodLength) {
            chainLength >>= 2;
        }
        do {
            match = curMatch;
            scan = this.strstart;
            if (window[match + this.matchLen] !== scan_end ||
                window[match + this.matchLen - 1] !== scan_end1 ||
                window[match] !== window[scan] ||
                window[++match] !== window[++scan]) {
                continue;
            }
            switch ((scanMax - scan) % 8) {
                case 1:
                    if (window[++scan] === window[++match]) {
                        break;
                    }
                    break;
                case 2:
                    if (window[++scan] === window[++match] && window[++scan] === window[++match]) {
                        break;
                    }
                    break;
                case 3:
                    if (window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match]) {
                        break;
                    }
                    break;
                case 4:
                    if (window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match]) {
                        break;
                    }
                    break;
                case 5:
                    if (window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match]) {
                        break;
                    }
                    break;
                case 6:
                    if (window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match]) {
                        break;
                    }
                    break;
                case 7:
                    if (window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match] &&
                        window[++scan] === window[++match]) {
                        break;
                    }
                    break;
            }
            if (window[scan] === window[match]) {
                do {
                    if (scan === scanMax) {
                        ++scan;
                        ++match;
                        break;
                    }
                } while (window[++scan] === window[++match] &&
                    window[++scan] === window[++match] &&
                    window[++scan] === window[++match] &&
                    window[++scan] === window[++match] &&
                    window[++scan] === window[++match] &&
                    window[++scan] === window[++match] &&
                    window[++scan] === window[++match] &&
                    window[++scan] === window[++match]);
            }
            if (scan - this.strstart > this.matchLen) {
                this.matchStart = curMatch;
                this.matchLen = scan - this.strstart;
                if (this.matchLen >= niceLength) {
                    break;
                }
                scan_end1 = window[scan - 1];
                scan_end = window[scan];
            }
            curMatch = prev[curMatch & DeflaterConstants.WMASK] & 0xffff;
        } while (curMatch > limit && 0 !== --chainLength);
        return this.matchLen >= DeflaterConstants.MIN_MATCH;
    }
    insertString() {
        const hash = ((this.insertHashIndex << DeflaterConstants.HASH_SHIFT) ^
            this.window[this.strstart + (DeflaterConstants.MIN_MATCH - 1)]) &
            DeflaterConstants.HASH_MASK;
        const match = this.head[hash];
        this.prev[this.strstart & DeflaterConstants.WMASK] = match;
        this.head[hash] = this.strstart;
        this.insertHashIndex = hash;
        return match & 0xffff;
    }
    fillWindow() {
        if (this.strstart >= DeflaterConstants.WSIZE + DeflaterConstants.MAX_DIST) {
            this.slideWindow();
        }
        if (this.lookahead < DeflaterConstants.MIN_LOOKAHEAD && this.inputOff < this.inputEnd) {
            let more = 2 * DeflaterConstants.WSIZE - this.lookahead - this.strstart;
            if (more > this.inputEnd - this.inputOff) {
                more = this.inputEnd - this.inputOff;
            }
            this.window.set(this.inputBuf.subarray(this.inputOff, this.inputOff + more), this.strstart + this.lookahead);
            this.inputCrc.update(this.inputBuf, this.inputOff, more);
            this.inputOff += more;
            this.lookahead += more;
        }
        if (this.lookahead >= DeflaterConstants.MIN_MATCH) {
            this.updateHash();
        }
    }
    slideWindow() {
        this.window.set(this.window.subarray(DeflaterConstants.WSIZE, DeflaterConstants.WSIZE + DeflaterConstants.WSIZE), 0);
        this.matchStart -= DeflaterConstants.WSIZE;
        this.strstart -= DeflaterConstants.WSIZE;
        this.blockStart -= DeflaterConstants.WSIZE;
        for (let i = 0; i < DeflaterConstants.HASH_SIZE; ++i) {
            const m = this.head[i] & 0xffff;
            this.head[i] = m >= DeflaterConstants.WSIZE ? m - DeflaterConstants.WSIZE : 0;
        }
        for (let i = 0; i < DeflaterConstants.WSIZE; i++) {
            const m = this.prev[i] & 0xffff;
            this.prev[i] = m >= DeflaterConstants.WSIZE ? m - DeflaterConstants.WSIZE : 0;
        }
    }
}
DeflaterEngine.TooFar = 4096;
class Tree {
    constructor(dh, elems, minCodes, maxLength) {
        this.length = null;
        this.numCodes = 0;
        this.codes = null;
        this.huffman = dh;
        this.minNumCodes = minCodes;
        this.maxLength = maxLength;
        this.freqs = new Int16Array(elems);
        this.bitLengthCounts = new Int32Array(maxLength);
    }
    reset() {
        for (let i = 0; i < this.freqs.length; i++) {
            this.freqs[i] = 0;
        }
        this.codes = null;
        this.length = null;
    }
    buildTree() {
        const numSymbols = this.freqs.length;
        const heap = new Int32Array(numSymbols);
        let heapLen = 0;
        let maxCode = 0;
        for (let n = 0; n < numSymbols; n++) {
            const freq = this.freqs[n];
            if (freq !== 0) {
                let pos = heapLen++;
                while (true) {
                    if (pos > 0) {
                        const ppos = Math.floor((pos - 1) / 2);
                        if (this.freqs[heap[ppos]] > freq) {
                            heap[pos] = heap[ppos];
                            pos = ppos;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
                heap[pos] = n;
                maxCode = n;
            }
        }
        while (heapLen < 2) {
            const node = maxCode < 2 ? ++maxCode : 0;
            heap[heapLen++] = node;
        }
        this.numCodes = Math.max(maxCode + 1, this.minNumCodes);
        const numLeafs = heapLen;
        const childs = new Int32Array(4 * heapLen - 2);
        const values = new Int32Array(2 * heapLen - 1);
        let numNodes = numLeafs;
        for (let i = 0; i < heapLen; i++) {
            const node = heap[i];
            childs[2 * i] = node;
            childs[2 * i + 1] = -1;
            values[i] = this.freqs[node] << 8;
            heap[i] = i;
        }
        do {
            const first = heap[0];
            let last = heap[--heapLen];
            let ppos = 0;
            let path = 1;
            while (path < heapLen) {
                if (path + 1 < heapLen && values[heap[path]] > values[heap[path + 1]]) {
                    path++;
                }
                heap[ppos] = heap[path];
                ppos = path;
                path = path * 2 + 1;
            }
            let lastVal = values[last];
            while (true) {
                path = ppos;
                if (ppos > 0) {
                    ppos = Math.floor((path - 1) / 2);
                    if (values[heap[ppos]] > lastVal) {
                        heap[path] = heap[ppos];
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            heap[path] = last;
            const second = heap[0];
            last = numNodes++;
            childs[2 * last] = first;
            childs[2 * last + 1] = second;
            const mindepth = Math.min(values[first] & 0xff, values[second] & 0xff);
            lastVal = values[first] + values[second] - mindepth + 1;
            values[last] = lastVal;
            ppos = 0;
            path = 1;
            while (path < heapLen) {
                if (path + 1 < heapLen && values[heap[path]] > values[heap[path + 1]]) {
                    path++;
                }
                heap[ppos] = heap[path];
                ppos = path;
                path = ppos * 2 + 1;
            }
            while (true) {
                path = ppos;
                if (path > 0) {
                    ppos = Math.floor((path - 1) / 2);
                    if (values[heap[ppos]] > lastVal) {
                        heap[path] = heap[ppos];
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            heap[path] = last;
        } while (heapLen > 1);
        this.buildLength(childs);
    }
    buildLength(childs) {
        this.length = new Uint8Array(this.freqs.length);
        const numNodes = Math.floor(childs.length / 2);
        const numLeafs = Math.floor((numNodes + 1) / 2);
        let overflow = 0;
        for (let i = 0; i < this.maxLength; i++) {
            this.bitLengthCounts[i] = 0;
        }
        const lengths = new Int32Array(numNodes);
        lengths[numNodes - 1] = 0;
        for (let i = numNodes - 1; i >= 0; i--) {
            if (childs[2 * i + 1] !== -1) {
                let bitLength = lengths[i] + 1;
                if (bitLength > this.maxLength) {
                    bitLength = this.maxLength;
                    overflow++;
                }
                lengths[childs[2 * i]] = bitLength;
                lengths[childs[2 * i + 1]] = bitLength;
            }
            else {
                const bitLength = lengths[i];
                this.bitLengthCounts[bitLength - 1]++;
                this.length[childs[2 * i]] = lengths[i];
            }
        }
        if (overflow === 0) {
            return;
        }
        let incrBitLen = this.maxLength - 1;
        do {
            while (this.bitLengthCounts[--incrBitLen] === 0) { }
            do {
                this.bitLengthCounts[incrBitLen]--;
                this.bitLengthCounts[++incrBitLen]++;
                overflow -= 1 << (this.maxLength - 1 - incrBitLen);
            } while (overflow > 0 && incrBitLen < this.maxLength - 1);
        } while (overflow > 0);
        this.bitLengthCounts[this.maxLength - 1] += overflow;
        this.bitLengthCounts[this.maxLength - 2] -= overflow;
        let nodePtr = 2 * numLeafs;
        for (let bits = this.maxLength; bits !== 0; bits--) {
            let n = this.bitLengthCounts[bits - 1];
            while (n > 0) {
                const childPtr = 2 * childs[nodePtr++];
                if (childs[childPtr + 1] === -1) {
                    this.length[childs[childPtr]] = bits;
                    n--;
                }
            }
        }
    }
    getEncodedLength() {
        let len = 0;
        for (let i = 0; i < this.freqs.length; i++) {
            len += this.freqs[i] * this.length[i];
        }
        return len;
    }
    calcBLFreq(blTree) {
        let max_count;
        let min_count;
        let count;
        let curlen = -1;
        let i = 0;
        while (i < this.numCodes) {
            count = 1;
            const nextlen = this.length[i];
            if (nextlen === 0) {
                max_count = 138;
                min_count = 3;
            }
            else {
                max_count = 6;
                min_count = 3;
                if (curlen !== nextlen) {
                    blTree.freqs[nextlen]++;
                    count = 0;
                }
            }
            curlen = nextlen;
            i++;
            while (i < this.numCodes && curlen === this.length[i]) {
                i++;
                if (++count >= max_count) {
                    break;
                }
            }
            if (count < min_count) {
                blTree.freqs[curlen] += count;
            }
            else if (curlen !== 0) {
                blTree.freqs[Tree.Repeat3To6]++;
            }
            else if (count <= 10) {
                blTree.freqs[Tree.Repeat3To10]++;
            }
            else {
                blTree.freqs[Tree.Repeat11To138]++;
            }
        }
    }
    setStaticCodes(staticCodes, staticLengths) {
        this.codes = staticCodes;
        this.length = staticLengths;
    }
    buildCodes() {
        const nextCode = new Int32Array(this.maxLength);
        let code = 0;
        this.codes = new Int16Array(this.freqs.length);
        for (let bits = 0; bits < this.maxLength; bits++) {
            nextCode[bits] = code;
            code += this.bitLengthCounts[bits] << (15 - bits);
        }
        for (let i = 0; i < this.numCodes; i++) {
            const bits = this.length[i];
            if (bits > 0) {
                this.codes[i] = DeflaterHuffman.bitReverse(nextCode[bits - 1]);
                nextCode[bits - 1] += 1 << (16 - bits);
            }
        }
    }
    writeTree(blTree) {
        let maxCount;
        let minCount;
        let count;
        let curlen = -1;
        let i = 0;
        while (i < this.numCodes) {
            count = 1;
            const nextlen = this.length[i];
            if (nextlen === 0) {
                maxCount = 138;
                minCount = 3;
            }
            else {
                maxCount = 6;
                minCount = 3;
                if (curlen !== nextlen) {
                    blTree.writeSymbol(nextlen);
                    count = 0;
                }
            }
            curlen = nextlen;
            i++;
            while (i < this.numCodes && curlen === this.length[i]) {
                i++;
                if (++count >= maxCount) {
                    break;
                }
            }
            if (count < minCount) {
                while (count-- > 0) {
                    blTree.writeSymbol(curlen);
                }
            }
            else if (curlen !== 0) {
                blTree.writeSymbol(Tree.Repeat3To6);
                this.huffman.pending.writeBits(count - 3, 2);
            }
            else if (count <= 10) {
                blTree.writeSymbol(Tree.Repeat3To10);
                this.huffman.pending.writeBits(count - 3, 3);
            }
            else {
                blTree.writeSymbol(Tree.Repeat11To138);
                this.huffman.pending.writeBits(count - 11, 7);
            }
        }
    }
    writeSymbol(code) {
        this.huffman.pending.writeBits(this.codes[code] & 0xffff, this.length[code]);
    }
}
Tree.Repeat3To6 = 16;
Tree.Repeat3To10 = 17;
Tree.Repeat11To138 = 18;
class DeflaterHuffman {
    constructor(pending) {
        this.last_lit = 0;
        this.extra_bits = 0;
        this.pending = pending;
        this.literalTree = new Tree(this, DeflaterHuffman.LITERAL_NUM, 257, 15);
        this.distTree = new Tree(this, DeflaterHuffman.DIST_NUM, 1, 15);
        this.blTree = new Tree(this, DeflaterHuffman.BITLEN_NUM, 4, 7);
        this.d_buf = new Int16Array(DeflaterHuffman.BUFSIZE);
        this.l_buf = new Uint8Array(DeflaterHuffman.BUFSIZE);
    }
    static staticInit() {
        let i = 0;
        while (i < 144) {
            DeflaterHuffman.staticLCodes[i] = DeflaterHuffman.bitReverse((0x030 + i) << 8);
            DeflaterHuffman.staticLLength[i++] = 8;
        }
        while (i < 256) {
            DeflaterHuffman.staticLCodes[i] = DeflaterHuffman.bitReverse((0x190 - 144 + i) << 7);
            DeflaterHuffman.staticLLength[i++] = 9;
        }
        while (i < 280) {
            DeflaterHuffman.staticLCodes[i] = DeflaterHuffman.bitReverse((0x000 - 256 + i) << 9);
            DeflaterHuffman.staticLLength[i++] = 7;
        }
        while (i < DeflaterHuffman.LITERAL_NUM) {
            DeflaterHuffman.staticLCodes[i] = DeflaterHuffman.bitReverse((0x0c0 - 280 + i) << 8);
            DeflaterHuffman.staticLLength[i++] = 8;
        }
        for (i = 0; i < DeflaterHuffman.DIST_NUM; i++) {
            DeflaterHuffman.staticDCodes[i] = DeflaterHuffman.bitReverse(i << 11);
            DeflaterHuffman.staticDLength[i] = 5;
        }
    }
    static bitReverse(toReverse) {
        return ((DeflaterHuffman.bit4Reverse[toReverse & 0xf] << 12) |
            (DeflaterHuffman.bit4Reverse[(toReverse >> 4) & 0xf] << 8) |
            (DeflaterHuffman.bit4Reverse[(toReverse >> 8) & 0xf] << 4) |
            DeflaterHuffman.bit4Reverse[toReverse >> 12]);
    }
    isFull() {
        return this.last_lit >= DeflaterHuffman.BUFSIZE;
    }
    reset() {
        this.last_lit = 0;
        this.extra_bits = 0;
        this.literalTree.reset();
        this.distTree.reset();
        this.blTree.reset();
    }
    flushStoredBlock(stored, storedOffset, storedLength, lastBlock) {
        this.pending.writeBits((DeflaterHuffman.STORED_BLOCK << 1) + (lastBlock ? 1 : 0), 3);
        this.pending.alignToByte();
        this.pending.writeShort(storedLength);
        this.pending.writeShort(~storedLength);
        this.pending.writeBlock(stored, storedOffset, storedLength);
        this.reset();
    }
    flushBlock(stored, storedOffset, storedLength, lastBlock) {
        this.literalTree.freqs[DeflaterHuffman.EOF_SYMBOL]++;
        this.literalTree.buildTree();
        this.distTree.buildTree();
        this.literalTree.calcBLFreq(this.blTree);
        this.distTree.calcBLFreq(this.blTree);
        this.blTree.buildTree();
        let blTreeCodes = 4;
        for (let i = 18; i > blTreeCodes; i--) {
            if (this.blTree.length[DeflaterHuffman.BL_ORDER[i]] > 0) {
                blTreeCodes = i + 1;
            }
        }
        let opt_len = 14 +
            blTreeCodes * 3 +
            this.blTree.getEncodedLength() +
            this.literalTree.getEncodedLength() +
            this.distTree.getEncodedLength() +
            this.extra_bits;
        let static_len = this.extra_bits;
        for (let i = 0; i < DeflaterHuffman.LITERAL_NUM; i++) {
            static_len += this.literalTree.freqs[i] * DeflaterHuffman.staticLLength[i];
        }
        for (let i = 0; i < DeflaterHuffman.DIST_NUM; i++) {
            static_len += this.distTree.freqs[i] * DeflaterHuffman.staticDLength[i];
        }
        if (opt_len >= static_len) {
            opt_len = static_len;
        }
        if (storedOffset >= 0 && storedLength + 4 < opt_len >> 3) {
            this.flushStoredBlock(stored, storedOffset, storedLength, lastBlock);
        }
        else if (opt_len === static_len) {
            this.pending.writeBits((DeflaterHuffman.STATIC_TREES << 1) + (lastBlock ? 1 : 0), 3);
            this.literalTree.setStaticCodes(DeflaterHuffman.staticLCodes, DeflaterHuffman.staticLLength);
            this.distTree.setStaticCodes(DeflaterHuffman.staticDCodes, DeflaterHuffman.staticDLength);
            this.compressBlock();
            this.reset();
        }
        else {
            this.pending.writeBits((DeflaterHuffman.DYN_TREES << 1) + (lastBlock ? 1 : 0), 3);
            this.sendAllTrees(blTreeCodes);
            this.compressBlock();
            this.reset();
        }
    }
    sendAllTrees(blTreeCodes) {
        this.blTree.buildCodes();
        this.literalTree.buildCodes();
        this.distTree.buildCodes();
        this.pending.writeBits(this.literalTree.numCodes - 257, 5);
        this.pending.writeBits(this.distTree.numCodes - 1, 5);
        this.pending.writeBits(blTreeCodes - 4, 4);
        for (let rank = 0; rank < blTreeCodes; rank++) {
            this.pending.writeBits(this.blTree.length[DeflaterHuffman.BL_ORDER[rank]], 3);
        }
        this.literalTree.writeTree(this.blTree);
        this.distTree.writeTree(this.blTree);
    }
    compressBlock() {
        for (let i = 0; i < this.last_lit; i++) {
            const litlen = this.l_buf[i] & 0xff;
            let dist = this.d_buf[i];
            if (dist-- !== 0) {
                const lc = DeflaterHuffman.Lcode(litlen);
                this.literalTree.writeSymbol(lc);
                let bits = Math.floor((lc - 261) / 4);
                if (bits > 0 && bits <= 5) {
                    this.pending.writeBits(litlen & ((1 << bits) - 1), bits);
                }
                const dc = DeflaterHuffman.Dcode(dist);
                this.distTree.writeSymbol(dc);
                bits = Math.floor(dc / 2) - 1;
                if (bits > 0) {
                    this.pending.writeBits(dist & ((1 << bits) - 1), bits);
                }
            }
            else {
                this.literalTree.writeSymbol(litlen);
            }
        }
        this.literalTree.writeSymbol(DeflaterHuffman.EOF_SYMBOL);
    }
    tallyDist(distance, length) {
        this.d_buf[this.last_lit] = distance;
        this.l_buf[this.last_lit++] = length - 3;
        const lc = DeflaterHuffman.Lcode(length - 3);
        this.literalTree.freqs[lc]++;
        if (lc >= 265 && lc < 285) {
            this.extra_bits += Math.floor((lc - 261) / 4);
        }
        const dc = DeflaterHuffman.Dcode(distance - 1);
        this.distTree.freqs[dc]++;
        if (dc >= 4) {
            this.extra_bits += Math.floor(dc / 2) - 1;
        }
        return this.isFull();
    }
    tallyLit(literal) {
        this.d_buf[this.last_lit] = 0;
        this.l_buf[this.last_lit++] = literal;
        this.literalTree.freqs[literal]++;
        return this.isFull();
    }
    static Lcode(length) {
        if (length === 255) {
            return 285;
        }
        let code = 257;
        while (length >= 8) {
            code += 4;
            length = length >> 1;
        }
        return code + length;
    }
    static Dcode(distance) {
        let code = 0;
        while (distance >= 4) {
            code += 2;
            distance = distance >> 1;
        }
        return code + distance;
    }
}
DeflaterHuffman.BUFSIZE = 1 << (DeflaterConstants.DEFAULT_MEM_LEVEL + 6);
DeflaterHuffman.LITERAL_NUM = 286;
DeflaterHuffman.STORED_BLOCK = 0;
DeflaterHuffman.STATIC_TREES = 1;
DeflaterHuffman.DYN_TREES = 2;
DeflaterHuffman.DIST_NUM = 30;
DeflaterHuffman.staticLCodes = new Int16Array(DeflaterHuffman.LITERAL_NUM);
DeflaterHuffman.staticLLength = new Uint8Array(DeflaterHuffman.LITERAL_NUM);
DeflaterHuffman.staticDCodes = new Int16Array(DeflaterHuffman.DIST_NUM);
DeflaterHuffman.staticDLength = new Uint8Array(DeflaterHuffman.DIST_NUM);
DeflaterHuffman.BL_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
DeflaterHuffman.bit4Reverse = new Uint8Array([
    0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15
]);
DeflaterHuffman.BITLEN_NUM = 19;
DeflaterHuffman.EOF_SYMBOL = 256;
DeflaterHuffman.staticInit();
class Huffman {
}
class Found extends Huffman {
    constructor(n) {
        super();
        this.n = n;
    }
}
class NeedBit extends Huffman {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
}
class NeedBits extends Huffman {
    constructor(n, table) {
        super();
        this.n = n;
        this.table = table;
    }
}
class HuffTools {
    static make(lengths, pos, nlengths, maxbits) {
        const counts = [];
        const tmp = [];
        if (maxbits > 32) {
            throw new FormatError('Invalid huffman');
        }
        for (let i = 0; i < maxbits; i++) {
            counts.push(0);
            tmp.push(0);
        }
        for (let i = 0; i < nlengths; i++) {
            const p = lengths[i + pos];
            if (p >= maxbits) {
                throw new FormatError('Invalid huffman');
            }
            counts[p]++;
        }
        let code = 0;
        for (let i = 1; i < maxbits - 1; i++) {
            code = (code + counts[i]) << 1;
            tmp[i] = code;
        }
        const bits = new Map();
        for (let i = 0; i < nlengths; i++) {
            const l = lengths[i + pos];
            if (l !== 0) {
                const n = tmp[l - 1];
                tmp[l - 1] = n + 1;
                bits.set((n << 5) | l, i);
            }
        }
        return HuffTools.treeCompress(new NeedBit(HuffTools.treeMake(bits, maxbits, 0, 1), HuffTools.treeMake(bits, maxbits, 1, 1)));
    }
    static treeMake(bits, maxbits, v, len) {
        if (len > maxbits) {
            throw new FormatError('Invalid huffman');
        }
        const idx = (v << 5) | len;
        if (bits.has(idx)) {
            return new Found(bits.get(idx));
        }
        v = v << 1;
        len += 1;
        return new NeedBit(HuffTools.treeMake(bits, maxbits, v, len), HuffTools.treeMake(bits, maxbits, v | 1, len));
    }
    static treeCompress(t) {
        const d = HuffTools.treeDepth(t);
        if (d === 0) {
            return t;
        }
        if (d === 1) {
            if (t instanceof NeedBit) {
                return new NeedBit(HuffTools.treeCompress(t.left), HuffTools.treeCompress(t.right));
            }
            throw new FormatError('assert');
        }
        const size = 1 << d;
        const table = [];
        for (let i = 0; i < size; i++) {
            table.push(new Found(-1));
        }
        HuffTools.treeWalk(table, 0, 0, d, t);
        return new NeedBits(d, table);
    }
    static treeWalk(table, p, cd, d, t) {
        if (t instanceof NeedBit) {
            if (d > 0) {
                HuffTools.treeWalk(table, p, cd + 1, d - 1, t.left);
                HuffTools.treeWalk(table, p | (1 << cd), cd + 1, d - 1, t.right);
            }
            else {
                table[p] = HuffTools.treeCompress(t);
            }
        }
        else {
            table[p] = HuffTools.treeCompress(t);
        }
    }
    static treeDepth(t) {
        if (t instanceof Found) {
            return 0;
        }
        if (t instanceof NeedBits) {
            throw new FormatError('assert');
        }
        if (t instanceof NeedBit) {
            const da = HuffTools.treeDepth(t.left);
            const db = HuffTools.treeDepth(t.right);
            return 1 + (da < db ? da : db);
        }
        return 0;
    }
}
var InflateState;
(function (InflateState) {
    InflateState[InflateState["Head"] = 0] = "Head";
    InflateState[InflateState["Block"] = 1] = "Block";
    InflateState[InflateState["CData"] = 2] = "CData";
    InflateState[InflateState["Flat"] = 3] = "Flat";
    InflateState[InflateState["Crc"] = 4] = "Crc";
    InflateState[InflateState["Dist"] = 5] = "Dist";
    InflateState[InflateState["DistOne"] = 6] = "DistOne";
    InflateState[InflateState["Done"] = 7] = "Done";
})(InflateState || (InflateState = {}));
class InflateWindow {
    constructor() {
        this.buffer = new Uint8Array(InflateWindow.BufferSize);
        this.pos = 0;
    }
    slide() {
        const b = new Uint8Array(InflateWindow.BufferSize);
        this.pos -= InflateWindow.Size;
        b.set(this.buffer.subarray(InflateWindow.Size, InflateWindow.Size + this.pos), 0);
        this.buffer = b;
    }
    addBytes(b, p, len) {
        if (this.pos + len > InflateWindow.BufferSize) {
            this.slide();
        }
        this.buffer.set(b.subarray(p, p + len), this.pos);
        this.pos += len;
    }
    addByte(c) {
        if (this.pos === InflateWindow.BufferSize) {
            this.slide();
        }
        this.buffer[this.pos] = c;
        this.pos++;
    }
    getLastChar() {
        return this.buffer[this.pos - 1];
    }
    available() {
        return this.pos;
    }
}
InflateWindow.Size = 1 << 15;
InflateWindow.BufferSize = 1 << 16;
class Inflate {
    constructor(readable) {
        this._nbits = 0;
        this._bits = 0;
        this._state = InflateState.Block;
        this._isFinal = false;
        this._huffman = Inflate._fixedHuffman;
        this._huffdist = null;
        this._len = 0;
        this._dist = 0;
        this._needed = 0;
        this._output = null;
        this._outpos = 0;
        this._lengths = [];
        this._window = new InflateWindow();
        this._input = readable;
        for (let i = 0; i < 19; i++) {
            this._lengths.push(-1);
        }
    }
    static buildFixedHuffman() {
        const a = [];
        for (let n = 0; n < 288; n++) {
            a.push(n <= 143 ? 8 : n <= 255 ? 9 : n <= 279 ? 7 : 8);
        }
        return HuffTools.make(a, 0, 288, 10);
    }
    readBytes(b, pos, len) {
        this._needed = len;
        this._outpos = pos;
        this._output = b;
        if (len > 0) {
            while (this.inflateLoop()) {
            }
        }
        return len - this._needed;
    }
    inflateLoop() {
        switch (this._state) {
            case InflateState.Head:
                const cmf = this._input.readByte();
                const cm = cmf & 15;
                if (cm !== 8) {
                    throw new FormatError('Invalid data');
                }
                const flg = this._input.readByte();
                const fdict = (flg & 32) !== 0;
                if (((cmf << 8) + flg) % 31 !== 0) {
                    throw new FormatError('Invalid data');
                }
                if (fdict) {
                    throw new FormatError('Unsupported dictionary');
                }
                this._state = InflateState.Block;
                return true;
            case InflateState.Crc:
                this._state = InflateState.Done;
                return true;
            case InflateState.Done:
                return false;
            case InflateState.Block:
                this._isFinal = this.getBit();
                switch (this.getBits(2)) {
                    case 0:
                        this._len = IOHelper.readUInt16LE(this._input);
                        const nlen = IOHelper.readUInt16LE(this._input);
                        if (nlen !== 0xffff - this._len) {
                            throw new FormatError('Invalid data');
                        }
                        this._state = InflateState.Flat;
                        const r = this.inflateLoop();
                        this.resetBits();
                        return r;
                    case 1:
                        this._huffman = Inflate._fixedHuffman;
                        this._huffdist = null;
                        this._state = InflateState.CData;
                        return true;
                    case 2:
                        const hlit = this.getBits(5) + 257;
                        const hdist = this.getBits(5) + 1;
                        const hclen = this.getBits(4) + 4;
                        for (let i = 0; i < hclen; i++) {
                            this._lengths[Inflate.CodeLengthsPos[i]] = this.getBits(3);
                        }
                        for (let i = hclen; i < 19; i++) {
                            this._lengths[Inflate.CodeLengthsPos[i]] = 0;
                        }
                        this._huffman = HuffTools.make(this._lengths, 0, 19, 8);
                        const xlengths = [];
                        for (let i = 0; i < hlit + hdist; i++) {
                            xlengths.push(0);
                        }
                        this.inflateLengths(xlengths, hlit + hdist);
                        this._huffdist = HuffTools.make(xlengths, hlit, hdist, 16);
                        this._huffman = HuffTools.make(xlengths, 0, hlit, 16);
                        this._state = InflateState.CData;
                        return true;
                    default:
                        throw new FormatError('Invalid data');
                }
            case InflateState.Flat: {
                const rlen = this._len < this._needed ? this._len : this._needed;
                const bytes = IOHelper.readByteArray(this._input, rlen);
                this._len -= rlen;
                this.addBytes(bytes, 0, rlen);
                if (this._len === 0) {
                    this._state = this._isFinal ? InflateState.Crc : InflateState.Block;
                }
                return this._needed > 0;
            }
            case InflateState.DistOne: {
                const rlen = this._len < this._needed ? this._len : this._needed;
                this.addDistOne(rlen);
                this._len -= rlen;
                if (this._len === 0) {
                    this._state = InflateState.CData;
                }
                return this._needed > 0;
            }
            case InflateState.Dist:
                while (this._len > 0 && this._needed > 0) {
                    const rdist = this._len < this._dist ? this._len : this._dist;
                    const rlen = this._needed < rdist ? this._needed : rdist;
                    this.addDist(this._dist, rlen);
                    this._len -= rlen;
                }
                if (this._len === 0) {
                    this._state = InflateState.CData;
                }
                return this._needed > 0;
            case InflateState.CData:
                let n = this.applyHuffman(this._huffman);
                if (n < 256) {
                    this.addByte(n);
                    return this._needed > 0;
                }
                if (n === 256) {
                    this._state = this._isFinal ? InflateState.Crc : InflateState.Block;
                    return true;
                }
                n = (n - 257) & 0xff;
                let extraBits = Inflate.LenExtraBitsTbl[n];
                if (extraBits === -1) {
                    throw new FormatError('Invalid data');
                }
                this._len = Inflate.LenBaseValTbl[n] + this.getBits(extraBits);
                const huffdist = this._huffdist;
                const distCode = !huffdist ? this.getRevBits(5) : this.applyHuffman(huffdist);
                extraBits = Inflate.DistExtraBitsTbl[distCode];
                if (extraBits === -1) {
                    throw new FormatError('Invalid data');
                }
                this._dist = Inflate.DistBaseValTbl[distCode] + this.getBits(extraBits);
                if (this._dist > this._window.available()) {
                    throw new FormatError('Invalid data');
                }
                this._state = this._dist === 1 ? InflateState.DistOne : InflateState.Dist;
                return true;
        }
        return false;
    }
    addDistOne(n) {
        const c = this._window.getLastChar();
        for (let i = 0; i < n; i++) {
            this.addByte(c);
        }
    }
    addByte(b) {
        this._window.addByte(b);
        this._output[this._outpos] = b;
        this._needed--;
        this._outpos++;
    }
    addDist(d, len) {
        this.addBytes(this._window.buffer, this._window.pos - d, len);
    }
    getBit() {
        if (this._nbits === 0) {
            this._nbits = 8;
            this._bits = this._input.readByte();
        }
        const b = (this._bits & 1) === 1;
        this._nbits--;
        this._bits = this._bits >> 1;
        return b;
    }
    getBits(n) {
        while (this._nbits < n) {
            this._bits = this._bits | (this._input.readByte() << this._nbits);
            this._nbits += 8;
        }
        const b = this._bits & ((1 << n) - 1);
        this._nbits -= n;
        this._bits = this._bits >> n;
        return b;
    }
    getRevBits(n) {
        return n === 0 ? 0 : this.getBit() ? (1 << (n - 1)) | this.getRevBits(n - 1) : this.getRevBits(n - 1);
    }
    resetBits() {
        this._bits = 0;
        this._nbits = 0;
    }
    addBytes(b, p, len) {
        this._window.addBytes(b, p, len);
        this._output.set(b.subarray(p, p + len), this._outpos);
        this._needed -= len;
        this._outpos += len;
    }
    inflateLengths(a, max) {
        let i = 0;
        let prev = 0;
        while (i < max) {
            const n = this.applyHuffman(this._huffman);
            switch (n) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    prev = n;
                    a[i] = n;
                    i++;
                    break;
                case 16:
                    const end = i + 3 + this.getBits(2);
                    if (end > max) {
                        throw new FormatError('Invalid data');
                    }
                    while (i < end) {
                        a[i] = prev;
                        i++;
                    }
                    break;
                case 17:
                    i += 3 + this.getBits(3);
                    if (i > max) {
                        throw new FormatError('Invalid data');
                    }
                    break;
                case 18:
                    i += 11 + this.getBits(7);
                    if (i > max) {
                        throw new FormatError('Invalid data');
                    }
                    break;
                default: {
                    throw new FormatError('Invalid data');
                }
            }
        }
    }
    applyHuffman(h) {
        if (h instanceof Found) {
            return h.n;
        }
        if (h instanceof NeedBit) {
            return this.applyHuffman(this.getBit() ? h.right : h.left);
        }
        if (h instanceof NeedBits) {
            return this.applyHuffman(h.table[this.getBits(h.n)]);
        }
        throw new FormatError('Invalid data');
    }
}
Inflate.LenExtraBitsTbl = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, -1, -1
];
Inflate.LenBaseValTbl = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227,
    258
];
Inflate.DistExtraBitsTbl = [
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, -1, -1
];
Inflate.DistBaseValTbl = [
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097,
    6145, 8193, 12289, 16385, 24577
];
Inflate.CodeLengthsPos = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
Inflate._fixedHuffman = Inflate.buildFixedHuffman();
class PendingBuffer {
    constructor(bufferSize) {
        this._start = 0;
        this._end = 0;
        this._bits = 0;
        this.bitCount = 0;
        this._buffer = new Uint8Array(bufferSize);
    }
    get isFlushed() {
        return this._end === 0;
    }
    reset() {
        this._start = 0;
        this._end = 0;
        this.bitCount = 0;
    }
    writeShortMSB(s) {
        this._buffer[this._end++] = (s >> 8) & 0xff;
        this._buffer[this._end++] = s & 0xff;
    }
    writeShort(value) {
        this._buffer[this._end++] = value;
        this._buffer[this._end++] = value >> 8;
    }
    writeBlock(block, offset, length) {
        this._buffer.set(block.subarray(offset, offset + length), this._end);
        this._end += length;
    }
    flush(output, offset, length) {
        if (this.bitCount >= 8) {
            this._buffer[this._end++] = this._bits & 0xff;
            this._bits >>= 8;
            this.bitCount -= 8;
        }
        if (length > this._end - this._start) {
            length = this._end - this._start;
            output.set(this._buffer.subarray(this._start, this._start + length), offset);
            this._start = 0;
            this._end = 0;
        }
        else {
            output.set(this._buffer.subarray(this._start, this._start + length), offset);
            this._start += length;
        }
        return length;
    }
    writeBits(b, count) {
        this._bits |= b << this.bitCount;
        this.bitCount += count;
        if (this.bitCount >= 16) {
            this._buffer[this._end++] = this._bits & 0xff;
            this._buffer[this._end++] = (this._bits >> 8) & 0xff;
            this._bits >>= 16;
            this.bitCount -= 16;
        }
    }
    alignToByte() {
        if (this.bitCount > 0) {
            this._buffer[this._end++] = this._bits & 0xff;
            if (this.bitCount > 8) {
                this._buffer[this._end++] = (this._bits >> 8) & 0xff;
            }
        }
        this._bits = 0;
        this.bitCount = 0;
    }
}
class ZipEntry {
    constructor(fullName, data) {
        this.fullName = fullName;
        const i = fullName.lastIndexOf('/');
        this.fileName = i === -1 || i === fullName.length - 1 ? this.fullName : fullName.substr(i + 1);
        this.data = data;
    }
}
ZipEntry.OptionalDataDescriptorSignature = 0x08074b50;
ZipEntry.CompressionMethodDeflate = 8;
ZipEntry.LocalFileHeaderSignature = 0x04034b50;
ZipEntry.CentralFileHeaderSignature = 0x02014b50;
ZipEntry.EndOfCentralDirSignature = 0x06054b50;
class ZipReader {
    constructor(readable) {
        this._readable = readable;
    }
    read() {
        const entries = [];
        while (true) {
            const e = this.readEntry();
            if (!e) {
                break;
            }
            entries.push(e);
        }
        return entries;
    }
    readEntry() {
        const readable = this._readable;
        const h = IOHelper.readInt32LE(readable);
        if (h !== ZipEntry.LocalFileHeaderSignature) {
            return null;
        }
        IOHelper.readUInt16LE(readable);
        const flags = IOHelper.readUInt16LE(readable);
        const compressionMethod = IOHelper.readUInt16LE(readable);
        const compressed = compressionMethod !== 0;
        if (compressed && compressionMethod !== ZipEntry.CompressionMethodDeflate) {
            return null;
        }
        IOHelper.readInt16LE(this._readable);
        IOHelper.readInt16LE(this._readable);
        IOHelper.readInt32LE(readable);
        IOHelper.readInt32LE(readable);
        const uncompressedSize = IOHelper.readInt32LE(readable);
        const fileNameLength = IOHelper.readInt16LE(readable);
        const extraFieldLength = IOHelper.readInt16LE(readable);
        const fname = IOHelper.toString(IOHelper.readByteArray(readable, fileNameLength), 'utf-8');
        readable.skip(extraFieldLength);
        let data;
        if (compressed) {
            const target = ByteBuffer.empty();
            const z = new Inflate(this._readable);
            const buffer = new Uint8Array(65536);
            while (true) {
                const bytes = z.readBytes(buffer, 0, buffer.length);
                target.write(buffer, 0, bytes);
                if (bytes < buffer.length) {
                    break;
                }
            }
            data = target.toArray();
        }
        else {
            data = IOHelper.readByteArray(this._readable, uncompressedSize);
        }
        if ((flags & 8) !== 0) {
            const crc32 = IOHelper.readInt32LE(this._readable);
            if (crc32 === ZipEntry.OptionalDataDescriptorSignature) {
                IOHelper.readInt32LE(this._readable);
            }
            IOHelper.readInt32LE(this._readable);
            IOHelper.readInt32LE(this._readable);
        }
        return new ZipEntry(fname, data);
    }
}
class ZipCentralDirectoryHeader {
    constructor(entry, crc32, localHeaderOffset, compressionMode, compressedSize) {
        this.entry = entry;
        this.crc32 = crc32;
        this.localHeaderOffset = localHeaderOffset;
        this.compressionMode = compressionMode;
        this.compressedSize = compressedSize;
    }
}
class ZipWriter {
    constructor(data) {
        this._centralDirectoryHeaders = [];
        this._deflater = new Deflater();
        this._data = data;
    }
    writeEntry(entry) {
        const compressionMode = ZipEntry.CompressionMethodDeflate;
        const compressedData = ByteBuffer.empty();
        const crc32 = this.compress(compressedData, entry.data, compressionMode);
        const compressedDataArray = compressedData.toArray();
        const directoryHeader = new ZipCentralDirectoryHeader(entry, crc32, this._data.bytesWritten, compressionMode, compressedData.length);
        this._centralDirectoryHeaders.push(directoryHeader);
        IOHelper.writeInt32LE(this._data, ZipEntry.LocalFileHeaderSignature);
        IOHelper.writeUInt16LE(this._data, 10);
        IOHelper.writeUInt16LE(this._data, 0x0800);
        IOHelper.writeUInt16LE(this._data, compressionMode);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt32LE(this._data, crc32);
        IOHelper.writeInt32LE(this._data, compressedDataArray.length);
        IOHelper.writeInt32LE(this._data, entry.data.length);
        IOHelper.writeInt16LE(this._data, entry.fullName.length);
        IOHelper.writeInt16LE(this._data, 0);
        const fileNameBuffer = IOHelper.stringToBytes(entry.fullName);
        this._data.write(fileNameBuffer, 0, fileNameBuffer.length);
        this._data.write(compressedDataArray, 0, compressedDataArray.length);
    }
    compress(output, data, compressionMode) {
        if (compressionMode !== ZipEntry.CompressionMethodDeflate) {
            const crc = new Crc32();
            crc.update(data, 0, data.length);
            output.write(data, 0, data.length);
            return crc.value;
        }
        const buffer = new Uint8Array(512);
        this._deflater.reset();
        this._deflater.setInput(data, 0, data.length);
        while (!this._deflater.isNeedingInput) {
            const len = this._deflater.deflate(buffer, 0, buffer.length);
            if (len <= 0) {
                break;
            }
            output.write(buffer, 0, len);
        }
        this._deflater.finish();
        while (!this._deflater.isFinished) {
            const len = this._deflater.deflate(buffer, 0, buffer.length);
            if (len <= 0) {
                break;
            }
            output.write(buffer, 0, len);
        }
        return this._deflater.inputCrc;
    }
    end() {
        const startOfCentralDirectory = this._data.bytesWritten;
        for (const header of this._centralDirectoryHeaders) {
            this.writeCentralDirectoryHeader(header);
        }
        const endOfCentralDirectory = this._data.bytesWritten;
        this.writeEndOfCentralDirectoryRecord(startOfCentralDirectory, endOfCentralDirectory);
    }
    writeEndOfCentralDirectoryRecord(startOfCentralDirectory, endOfCentralDirectory) {
        IOHelper.writeInt32LE(this._data, ZipEntry.EndOfCentralDirSignature);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt16LE(this._data, this._centralDirectoryHeaders.length);
        IOHelper.writeInt16LE(this._data, this._centralDirectoryHeaders.length);
        IOHelper.writeInt32LE(this._data, endOfCentralDirectory - startOfCentralDirectory);
        IOHelper.writeInt32LE(this._data, startOfCentralDirectory);
        IOHelper.writeInt16LE(this._data, 0);
    }
    writeCentralDirectoryHeader(header) {
        IOHelper.writeInt32LE(this._data, ZipEntry.CentralFileHeaderSignature);
        IOHelper.writeUInt16LE(this._data, 10);
        IOHelper.writeUInt16LE(this._data, 10);
        IOHelper.writeUInt16LE(this._data, 0x0800);
        IOHelper.writeUInt16LE(this._data, header.compressionMode);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt32LE(this._data, header.crc32);
        IOHelper.writeInt32LE(this._data, header.compressedSize);
        IOHelper.writeInt32LE(this._data, header.entry.data.length);
        IOHelper.writeInt16LE(this._data, header.entry.fullName.length);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt16LE(this._data, 0);
        IOHelper.writeInt32LE(this._data, 0);
        IOHelper.writeInt32LE(this._data, header.localHeaderOffset);
        const fileNameBuffer = IOHelper.stringToBytes(header.entry.fullName);
        this._data.write(fileNameBuffer, 0, fileNameBuffer.length);
    }
}
class Gp3To5Importer extends ScoreImporter {
    constructor() {
        super();
        this._versionNumber = 0;
        this._globalTripletFeel = TripletFeel.NoTripletFeel;
        this._lyricsTrack = 0;
        this._lyrics = [];
        this._barCount = 0;
        this._trackCount = 0;
        this._playbackInfos = [];
        this._doubleBars = new Set();
        this._clefsPerTrack = new Map();
        this._keySignatures = new Map();
        this._beatTextChunksByTrack = new Map();
        this._directionLookup = new Map();
    }
    get name() {
        return 'Guitar Pro 3-5';
    }
    readScore() {
        this._directionLookup.clear();
        this.readVersion();
        this._score = new Score();
        this.readScoreInformation();
        if (this._versionNumber < 500) {
            this._globalTripletFeel = GpBinaryHelpers.gpReadBool(this.data)
                ? TripletFeel.Triplet8th
                : TripletFeel.NoTripletFeel;
        }
        if (this._versionNumber >= 400) {
            this.readLyrics();
        }
        if (this._versionNumber >= 510) {
            this.data.skip(19);
        }
        if (this._versionNumber >= 500) {
            this.readPageSetup();
            this._score.tempoLabel = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        this._score.tempo = IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadBool(this.data);
        }
        IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 400) {
            this.data.readByte();
        }
        this.readPlaybackInfos();
        if (this._versionNumber >= 500) {
            this.readDirection(Direction.TargetCoda);
            this.readDirection(Direction.TargetDoubleCoda);
            this.readDirection(Direction.TargetSegno);
            this.readDirection(Direction.TargetSegnoSegno);
            this.readDirection(Direction.TargetFine);
            this.readDirection(Direction.JumpDaCapo);
            this.readDirection(Direction.JumpDaCapoAlCoda);
            this.readDirection(Direction.JumpDaCapoAlDoubleCoda);
            this.readDirection(Direction.JumpDaCapoAlFine);
            this.readDirection(Direction.JumpDalSegno);
            this.readDirection(Direction.JumpDalSegnoAlCoda);
            this.readDirection(Direction.JumpDalSegnoAlDoubleCoda);
            this.readDirection(Direction.JumpDalSegnoAlFine);
            this.readDirection(Direction.JumpDalSegnoSegno);
            this.readDirection(Direction.JumpDalSegnoSegnoAlCoda);
            this.readDirection(Direction.JumpDalSegnoSegnoAlDoubleCoda);
            this.readDirection(Direction.JumpDalSegnoSegnoAlFine);
            this.readDirection(Direction.JumpDaCoda);
            this.readDirection(Direction.JumpDaDoubleCoda);
            this.data.skip(4);
        }
        this._barCount = IOHelper.readInt32LE(this.data);
        this._trackCount = IOHelper.readInt32LE(this.data);
        this.readMasterBars();
        this.readTracks();
        this.readBars();
        if (this._score.masterBars.length > 0) {
            const automation = Automation.buildTempoAutomation(false, 0, this._score.tempo, 2);
            automation.text = this._score.tempoLabel;
            this._score.masterBars[0].tempoAutomations.push(automation);
        }
        ModelUtils.consolidate(this._score);
        this._score.finish(this.settings);
        if (this._lyrics && this._lyricsTrack >= 0) {
            this._score.tracks[this._lyricsTrack].applyLyrics(this._lyrics);
        }
        return this._score;
    }
    readDirection(direction) {
        let directionIndex = IOHelper.readInt16LE(this.data);
        if (directionIndex === -1) {
            return;
        }
        directionIndex--;
        let directionsList;
        if (this._directionLookup.has(directionIndex)) {
            directionsList = this._directionLookup.get(directionIndex);
        }
        else {
            directionsList = [];
            this._directionLookup.set(directionIndex, directionsList);
        }
        directionsList.push(direction);
    }
    readVersion() {
        let version = GpBinaryHelpers.gpReadStringByteLength(this.data, 30, this.settings.importer.encoding);
        if (!version.startsWith(Gp3To5Importer.VersionString)) {
            throw new UnsupportedFormatError('Unsupported format');
        }
        version = version.substr(Gp3To5Importer.VersionString.length + 1);
        const dot = version.indexOf(String.fromCharCode(46));
        this._versionNumber = 100 * Number.parseInt(version.substr(0, dot), 10) + Number.parseInt(version.substr(dot + 1), 10);
        Logger.debug(this.name, `Guitar Pro version ${version} detected`);
    }
    readScoreInformation() {
        this._score.title = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.subTitle = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.artist = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.album = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.words = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.music =
            this._versionNumber >= 500
                ? GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)
                : this._score.words;
        this._score.copyright = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.tab = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.instructions = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        const noticeLines = IOHelper.readInt32LE(this.data);
        let notice = '';
        for (let i = 0; i < noticeLines; i++) {
            if (i > 0) {
                notice += '\r\n';
            }
            notice += GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)?.toString();
        }
        this._score.notices = notice;
    }
    readLyrics() {
        this._lyrics = [];
        this._lyricsTrack = IOHelper.readInt32LE(this.data) - 1;
        for (let i = 0; i < 5; i++) {
            const lyrics = new Lyrics();
            lyrics.startBar = IOHelper.readInt32LE(this.data) - 1;
            lyrics.text = GpBinaryHelpers.gpReadStringInt(this.data, this.settings.importer.encoding);
            this._lyrics.push(lyrics);
        }
    }
    readPageSetup() {
        this.data.skip(30);
        for (let i = 0; i < 10; i++) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
    }
    readPageSetupOriginal() {
        this.data.skip(28);
        const flags = IOHelper.readInt16LE(this.data);
        GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
    }
    readPlaybackInfos() {
        this._playbackInfos = [];
        let channel = 0;
        for (let i = 0; i < 64; i++) {
            const info = new PlaybackInformation();
            info.primaryChannel = channel++;
            info.secondaryChannel = channel++;
            info.program = IOHelper.readInt32LE(this.data);
            info.volume = this.data.readByte();
            info.balance = this.data.readByte();
            this.data.skip(6);
            this._playbackInfos.push(info);
        }
    }
    readMasterBars() {
        for (let i = 0; i < this._barCount; i++) {
            this.readMasterBar();
        }
    }
    readMasterBar() {
        let previousMasterBar = null;
        if (this._score.masterBars.length > 0) {
            previousMasterBar = this._score.masterBars[this._score.masterBars.length - 1];
        }
        const newMasterBar = new MasterBar();
        const flags = this.data.readByte();
        if ((flags & 0x01) !== 0) {
            newMasterBar.timeSignatureNumerator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureNumerator = previousMasterBar.timeSignatureNumerator;
        }
        if ((flags & 0x02) !== 0) {
            newMasterBar.timeSignatureDenominator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureDenominator = previousMasterBar.timeSignatureDenominator;
        }
        newMasterBar.isRepeatStart = (flags & 0x04) !== 0;
        if ((flags & 0x08) !== 0) {
            newMasterBar.repeatCount = this.data.readByte() + (this._versionNumber >= 500 ? 0 : 1);
        }
        if ((flags & 0x10) !== 0 && this._versionNumber < 500) {
            let currentMasterBar = previousMasterBar;
            let existentAlternatives = 0;
            while (currentMasterBar) {
                if (currentMasterBar.isRepeatEnd && currentMasterBar !== previousMasterBar) {
                    break;
                }
                if (currentMasterBar.isRepeatStart) {
                    break;
                }
                existentAlternatives = existentAlternatives | currentMasterBar.alternateEndings;
                currentMasterBar = currentMasterBar.previousMasterBar;
            }
            let repeatAlternative = 0;
            const repeatMask = this.data.readByte();
            for (let i = 0; i < 8; i++) {
                const repeating = 1 << i;
                if (repeatMask > i && (existentAlternatives & repeating) === 0) {
                    repeatAlternative = repeatAlternative | repeating;
                }
            }
            newMasterBar.alternateEndings = repeatAlternative;
        }
        if ((flags & 0x20) !== 0) {
            const section = new Section();
            section.text = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            section.marker = '';
            GpBinaryHelpers.gpReadColor(this.data, false);
            newMasterBar.section = section;
        }
        if ((flags & 0x40) !== 0) {
            this._keySignatures.set(this._score.masterBars.length, [
                IOHelper.readSInt8(this.data),
                this.data.readByte()
            ]);
        }
        if (this._versionNumber >= 500 && (flags & 0x03) !== 0) {
            this.data.skip(4);
        }
        if (this._versionNumber >= 500) {
            newMasterBar.alternateEndings = this.data.readByte();
        }
        if (this._versionNumber >= 500) {
            const tripletFeel = this.data.readByte();
            switch (tripletFeel) {
                case 1:
                    newMasterBar.tripletFeel = TripletFeel.Triplet8th;
                    break;
                case 2:
                    newMasterBar.tripletFeel = TripletFeel.Triplet16th;
                    break;
            }
            this.data.readByte();
        }
        else {
            newMasterBar.tripletFeel = this._globalTripletFeel;
        }
        const isDoubleBar = (flags & 0x80) !== 0;
        newMasterBar.isDoubleBar = isDoubleBar;
        const barIndexForDirection = this._score.masterBars.length;
        if (this._directionLookup.has(barIndexForDirection)) {
            for (const direction of this._directionLookup.get(barIndexForDirection)) {
                newMasterBar.addDirection(direction);
            }
        }
        this._score.addMasterBar(newMasterBar);
        if (isDoubleBar) {
            this._doubleBars.add(newMasterBar.index);
        }
    }
    readTracks() {
        for (let i = 0; i < this._trackCount; i++) {
            this.readTrack();
        }
    }
    readTrack() {
        const newTrack = new Track();
        newTrack.ensureStaveCount(1);
        this._score.addTrack(newTrack);
        const mainStaff = newTrack.staves[0];
        const flags = this.data.readByte();
        newTrack.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 40, this.settings.importer.encoding);
        if ((flags & 0x01) !== 0) {
            mainStaff.isPercussion = true;
        }
        if (this._versionNumber >= 500) {
            newTrack.isVisibleOnMultiTrack = (flags & 0x08) !== 0;
        }
        const stringCount = IOHelper.readInt32LE(this.data);
        const tuning = [];
        for (let i = 0; i < 7; i++) {
            const stringTuning = IOHelper.readInt32LE(this.data);
            if (stringCount > i) {
                tuning.push(stringTuning);
            }
        }
        mainStaff.stringTuning.tunings = tuning;
        const port = IOHelper.readInt32LE(this.data);
        const index = IOHelper.readInt32LE(this.data) - 1;
        const effectChannel = IOHelper.readInt32LE(this.data) - 1;
        this.data.skip(4);
        if (index >= 0 && index < this._playbackInfos.length) {
            const info = this._playbackInfos[index];
            info.port = port;
            info.isSolo = (flags & 0x10) !== 0;
            info.isMute = (flags & 0x20) !== 0;
            info.secondaryChannel = effectChannel;
            if (GeneralMidi.isGuitar(info.program)) {
                mainStaff.displayTranspositionPitch = -12;
            }
            newTrack.playbackInfo = info;
        }
        mainStaff.capo = IOHelper.readInt32LE(this.data);
        newTrack.color = GpBinaryHelpers.gpReadColor(this.data, false);
        if (this._versionNumber >= 500) {
            const staffFlags = this.data.readByte();
            mainStaff.showTablature = (staffFlags & 0x01) !== 0;
            mainStaff.showStandardNotation = (staffFlags & 0x02) !== 0;
            const showChordDiagramListOnTopOfScore = (staffFlags & 0x64) !== 0;
            this.data.readByte();
            this.data.readByte();
            newTrack.playbackInfo.bank = this.data.readByte();
            this.data.readByte();
            const clefMode = IOHelper.readInt32LE(this.data);
            if (clefMode === 12) {
                this._clefsPerTrack.set(index, Clef.F4);
            }
            else {
                this._clefsPerTrack.set(index, Clef.G2);
            }
            IOHelper.readInt32LE(this.data);
            IOHelper.readInt32LE(this.data);
            this.data.skip(10);
            this.data.readByte();
            this.data.readByte();
            this.readRseBank();
            if (this._versionNumber >= 510) {
                this.data.skip(4);
                GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
                GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            }
        }
        else {
            if (GeneralMidi.isBass(newTrack.playbackInfo.program)) {
                this._clefsPerTrack.set(index, Clef.F4);
            }
            else {
                this._clefsPerTrack.set(index, Clef.G2);
            }
        }
    }
    readBars() {
        for (let i = 0; i < this._barCount; i++) {
            for (let t = 0; t < this._trackCount; t++) {
                this.readBar(this._score.tracks[t]);
            }
        }
    }
    readBar(track) {
        const newBar = new Bar();
        const mainStaff = track.staves[0];
        if (mainStaff.isPercussion) {
            newBar.clef = Clef.Neutral;
        }
        else if (this._clefsPerTrack.has(track.index)) {
            newBar.clef = this._clefsPerTrack.get(track.index);
        }
        mainStaff.addBar(newBar);
        if (this._keySignatures.has(newBar.index)) {
            const newKeySignature = this._keySignatures.get(newBar.index);
            newBar.keySignature = newKeySignature[0];
            newBar.keySignatureType = newKeySignature[1];
        }
        else if (newBar.index > 0) {
            newBar.keySignature = newBar.previousBar.keySignature;
            newBar.keySignatureType = newBar.previousBar.keySignatureType;
        }
        if (this._doubleBars.has(newBar.index)) {
            newBar.barLineRight = BarLineStyle.LightLight;
        }
        let voiceCount = 1;
        if (this._versionNumber >= 500) {
            this.data.readByte();
            voiceCount = 2;
        }
        for (let v = 0; v < voiceCount; v++) {
            this.readVoice(track, newBar);
        }
    }
    readVoice(track, bar) {
        const beatCount = IOHelper.readInt32LE(this.data);
        if (beatCount === 0) {
            return;
        }
        const newVoice = new Voice();
        bar.addVoice(newVoice);
        for (let i = 0; i < beatCount; i++) {
            this.readBeat(track, bar, newVoice);
        }
    }
    readBeat(track, bar, voice) {
        const newBeat = new Beat();
        const flags = this.data.readByte();
        if ((flags & 0x01) !== 0) {
            newBeat.dots = 1;
        }
        if ((flags & 0x40) !== 0) {
            const type = this.data.readByte();
            newBeat.isEmpty = (type & 0x02) === 0;
        }
        voice.addBeat(newBeat);
        const duration = IOHelper.readSInt8(this.data);
        switch (duration) {
            case -2:
                newBeat.duration = Duration.Whole;
                break;
            case -1:
                newBeat.duration = Duration.Half;
                break;
            case 0:
                newBeat.duration = Duration.Quarter;
                break;
            case 1:
                newBeat.duration = Duration.Eighth;
                break;
            case 2:
                newBeat.duration = Duration.Sixteenth;
                break;
            case 3:
                newBeat.duration = Duration.ThirtySecond;
                break;
            case 4:
                newBeat.duration = Duration.SixtyFourth;
                break;
            default:
                newBeat.duration = Duration.Quarter;
                break;
        }
        if ((flags & 0x20) !== 0) {
            newBeat.tupletNumerator = IOHelper.readInt32LE(this.data);
            switch (newBeat.tupletNumerator) {
                case 1:
                    newBeat.tupletDenominator = 1;
                    break;
                case 3:
                    newBeat.tupletDenominator = 2;
                    break;
                case 5:
                case 6:
                case 7:
                    newBeat.tupletDenominator = 4;
                    break;
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    newBeat.tupletDenominator = 8;
                    break;
                case 2:
                case 4:
                case 8:
                    break;
                default:
                    newBeat.tupletNumerator = 1;
                    newBeat.tupletDenominator = 1;
                    break;
            }
        }
        if ((flags & 0x02) !== 0) {
            this.readChord(newBeat);
        }
        const beatTextAsLyrics = this.settings.importer.beatTextAsLyrics && track.index !== this._lyricsTrack;
        if ((flags & 0x04) !== 0) {
            const text = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
            if (beatTextAsLyrics) {
                const lyrics = new Lyrics();
                lyrics.text = text.trim();
                lyrics.finish(true);
                const beatLyrics = [];
                for (let i = lyrics.chunks.length - 1; i >= 0; i--) {
                    beatLyrics.push(lyrics.chunks[i]);
                }
                this._beatTextChunksByTrack.set(track.index, beatLyrics);
            }
            else {
                newBeat.text = text;
            }
        }
        let allNoteHarmonicType = HarmonicType.None;
        if ((flags & 0x08) !== 0) {
            allNoteHarmonicType = this.readBeatEffects(newBeat);
        }
        if ((flags & 0x10) !== 0) {
            this.readMixTableChange(newBeat);
        }
        const stringFlags = this.data.readByte();
        for (let i = 6; i >= 0; i--) {
            if ((stringFlags & (1 << i)) !== 0 && 6 - i < bar.staff.tuning.length) {
                const note = this.readNote(track, bar, voice, newBeat, 6 - i);
                if (allNoteHarmonicType !== HarmonicType.None) {
                    note.harmonicType = allNoteHarmonicType;
                    if (note.harmonicType === HarmonicType.Natural) {
                        note.harmonicValue = ModelUtils.deltaFretToHarmonicValue(note.fret);
                    }
                }
            }
        }
        if (this._versionNumber >= 500) {
            const flags2 = IOHelper.readInt16LE(this.data);
            if ((flags2 & 0x01) !== 0) {
                if (newBeat.index > 0) {
                    voice.beats[newBeat.index - 1].beamingMode = BeatBeamingMode.ForceSplitToNext;
                }
            }
            if ((flags2 & 0x02) !== 0) {
            }
            if ((flags2 & 0x04) !== 0) {
                if (newBeat.index > 0) {
                    voice.beats[newBeat.index - 1].beamingMode = BeatBeamingMode.ForceMergeWithNext;
                }
            }
            if ((flags2 & 0x08) !== 0) {
            }
            if ((flags2 & 0x10) !== 0) {
                newBeat.ottava = Ottavia._8va;
            }
            if ((flags2 & 0x20) !== 0) {
                newBeat.ottava = Ottavia._8vb;
            }
            if ((flags2 & 0x40) !== 0) {
                newBeat.ottava = Ottavia._15ma;
            }
            if ((flags2 & 0x100) !== 0) {
                newBeat.ottava = Ottavia._15mb;
            }
            if ((flags2 & 0x800) !== 0) {
                const breakSecondaryBeams = this.data.readByte() !== 0;
                if (newBeat.index > 0 && breakSecondaryBeams) {
                    voice.beats[newBeat.index - 1].beamingMode = BeatBeamingMode.ForceSplitOnSecondaryToNext;
                }
            }
        }
        if (beatTextAsLyrics &&
            !newBeat.isRest &&
            this._beatTextChunksByTrack.has(track.index) &&
            this._beatTextChunksByTrack.get(track.index).length > 0) {
            newBeat.lyrics = [this._beatTextChunksByTrack.get(track.index).pop()];
        }
    }
    readChord(beat) {
        const chord = new Chord();
        const chordId = ModelUtils.newGuid();
        if (this._versionNumber >= 500) {
            this.data.skip(17);
            chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
            this.data.skip(4);
            chord.firstFret = IOHelper.readInt32LE(this.data);
            for (let i = 0; i < 7; i++) {
                const fret = IOHelper.readInt32LE(this.data);
                if (i < beat.voice.bar.staff.tuning.length) {
                    chord.strings.push(fret);
                }
            }
            const numberOfBarres = this.data.readByte();
            const barreFrets = new Uint8Array(5);
            this.data.read(barreFrets, 0, barreFrets.length);
            for (let i = 0; i < numberOfBarres; i++) {
                chord.barreFrets.push(barreFrets[i]);
            }
            this.data.skip(26);
        }
        else {
            if (this.data.readByte() !== 0) {
                if (this._versionNumber >= 400) {
                    this.data.skip(16);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
                    this.data.skip(4);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 7; i++) {
                        const fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    const numberOfBarres = this.data.readByte();
                    const barreFrets = new Uint8Array(5);
                    this.data.read(barreFrets, 0, barreFrets.length);
                    for (let i = 0; i < numberOfBarres; i++) {
                        chord.barreFrets.push(barreFrets[i]);
                    }
                    this.data.skip(26);
                }
                else {
                    this.data.skip(25);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 34, this.settings.importer.encoding);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 6; i++) {
                        const fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    this.data.skip(36);
                }
            }
            else {
                const strings = this._versionNumber >= 406 ? 7 : 6;
                chord.name = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
                chord.firstFret = IOHelper.readInt32LE(this.data);
                if (chord.firstFret > 0) {
                    for (let i = 0; i < strings; i++) {
                        const fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                }
            }
        }
        if (chord.name) {
            beat.chordId = chordId;
            beat.voice.bar.staff.addChord(beat.chordId, chord);
        }
    }
    readBeatEffects(beat) {
        const flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        if ((flags & 0x10) !== 0) {
            beat.fade = FadeType.FadeIn;
        }
        if ((this._versionNumber < 400 && (flags & 0x01) !== 0) || (flags & 0x02) !== 0) {
            beat.vibrato = VibratoType.Slight;
        }
        if ((flags2 & 0x01) !== 0) {
            beat.rasgueado = Rasgueado.Ii;
        }
        if ((flags & 0x20) !== 0 && this._versionNumber >= 400) {
            const slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
        }
        else if ((flags & 0x20) !== 0) {
            const slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
            this.data.skip(4);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloBarEffect(beat);
        }
        if ((flags & 0x40) !== 0) {
            let strokeUp = 0;
            let strokeDown = 0;
            if (this._versionNumber < 500) {
                strokeDown = this.data.readByte();
                strokeUp = this.data.readByte();
            }
            else {
                strokeUp = this.data.readByte();
                strokeDown = this.data.readByte();
            }
            if (strokeUp > 0) {
                beat.brushType = BrushType.BrushUp;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeUp);
            }
            else if (strokeDown > 0) {
                beat.brushType = BrushType.BrushDown;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeDown);
            }
        }
        if ((flags2 & 0x02) !== 0) {
            switch (IOHelper.readSInt8(this.data)) {
                case 0:
                    beat.pickStroke = PickStroke.None;
                    break;
                case 1:
                    beat.pickStroke = PickStroke.Up;
                    break;
                case 2:
                    beat.pickStroke = PickStroke.Down;
                    break;
            }
        }
        if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                return HarmonicType.Natural;
            }
            if ((flags & 0x08) !== 0) {
                return HarmonicType.Artificial;
            }
        }
        return HarmonicType.None;
    }
    readTremoloBarEffect(beat) {
        this.data.readByte();
        IOHelper.readInt32LE(this.data);
        const pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                const point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data);
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0;
                GpBinaryHelpers.gpReadBool(this.data);
                beat.addWhammyBarPoint(point);
            }
        }
    }
    static toStrokeValue(value) {
        switch (value) {
            case 1:
                return 30;
            case 2:
                return 30;
            case 3:
                return 60;
            case 4:
                return 120;
            case 5:
                return 240;
            case 6:
                return 480;
            default:
                return 0;
        }
    }
    readRseBank() {
        this.data.skip(4);
        this.data.skip(4);
        this.data.skip(4);
        this.data.skip(4);
    }
    readMixTableChange(beat) {
        const tableChange = new MixTableChange();
        tableChange.instrument = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            this.readRseBank();
        }
        tableChange.volume = IOHelper.readSInt8(this.data);
        tableChange.balance = IOHelper.readSInt8(this.data);
        const chorus = IOHelper.readSInt8(this.data);
        const reverb = IOHelper.readSInt8(this.data);
        const phaser = IOHelper.readSInt8(this.data);
        const tremolo = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            tableChange.tempoName = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        tableChange.tempo = IOHelper.readInt32LE(this.data);
        if (tableChange.volume >= 0) {
            this.data.readByte();
        }
        if (tableChange.balance >= 0) {
            this.data.readByte();
        }
        if (chorus >= 0) {
            this.data.readByte();
        }
        if (reverb >= 0) {
            this.data.readByte();
        }
        if (phaser >= 0) {
            this.data.readByte();
        }
        if (tremolo >= 0) {
            this.data.readByte();
        }
        if (tableChange.tempo >= 0) {
            tableChange.duration = IOHelper.readSInt8(this.data);
            if (this._versionNumber >= 510) {
                this.data.readByte();
            }
        }
        if (this._versionNumber >= 400) {
            this.data.readByte();
        }
        if (this._versionNumber >= 500) {
            const wahType = IOHelper.readSInt8(this.data);
            if (wahType >= 100) {
                beat.wahPedal = WahPedal.Closed;
            }
            else if (wahType >= 0) {
                beat.wahPedal = WahPedal.Open;
            }
        }
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        if (tableChange.volume >= 0) {
            const volumeAutomation = new Automation();
            volumeAutomation.isLinear = true;
            volumeAutomation.type = AutomationType.Volume;
            volumeAutomation.value = tableChange.volume;
            beat.automations.push(volumeAutomation);
        }
        if (tableChange.balance >= 0) {
            const balanceAutomation = new Automation();
            balanceAutomation.isLinear = true;
            balanceAutomation.type = AutomationType.Balance;
            balanceAutomation.value = tableChange.balance;
            beat.automations.push(balanceAutomation);
        }
        if (tableChange.instrument >= 0) {
            const instrumentAutomation = new Automation();
            instrumentAutomation.isLinear = true;
            instrumentAutomation.type = AutomationType.Instrument;
            instrumentAutomation.value = tableChange.instrument;
            beat.automations.push(instrumentAutomation);
        }
        if (tableChange.tempo >= 0) {
            const tempoAutomation = new Automation();
            tempoAutomation.isLinear = true;
            tempoAutomation.type = AutomationType.Tempo;
            tempoAutomation.value = tableChange.tempo;
            beat.automations.push(tempoAutomation);
            if (!beat.voice.bar.masterBar.tempoAutomations.some(a => a.ratioPosition === tempoAutomation.ratioPosition && a.value === tempoAutomation.value)) {
                beat.voice.bar.masterBar.tempoAutomations.push(tempoAutomation);
            }
        }
    }
    readNote(track, bar, voice, beat, stringIndex) {
        const newNote = new Note();
        newNote.string = bar.staff.tuning.length - stringIndex;
        const flags = this.data.readByte();
        if ((flags & 0x02) !== 0) {
            newNote.accentuated = AccentuationType.Heavy;
        }
        else if ((flags & 0x40) !== 0) {
            newNote.accentuated = AccentuationType.Normal;
        }
        newNote.isGhost = (flags & 0x04) !== 0;
        if ((flags & 0x20) !== 0) {
            const noteType = this.data.readByte();
            if (noteType === 3) {
                newNote.isDead = true;
            }
            else if (noteType === 2) {
                newNote.isTieDestination = true;
            }
        }
        if ((flags & 0x01) !== 0 && this._versionNumber < 500) {
            this.data.readByte();
            this.data.readByte();
        }
        if ((flags & 0x10) !== 0) {
            const dynamicNumber = IOHelper.readSInt8(this.data);
            newNote.dynamics = this.toDynamicValue(dynamicNumber);
            beat.dynamics = newNote.dynamics;
        }
        if ((flags & 0x20) !== 0) {
            newNote.fret = IOHelper.readSInt8(this.data);
        }
        if ((flags & 0x80) !== 0) {
            newNote.leftHandFinger = IOHelper.readSInt8(this.data);
            newNote.rightHandFinger = IOHelper.readSInt8(this.data);
        }
        let swapAccidentals = false;
        if (this._versionNumber >= 500) {
            if ((flags & 0x01) !== 0) {
                newNote.durationPercent = IOHelper.readFloat64BE(this.data);
            }
            const flags2 = this.data.readByte();
            swapAccidentals = (flags2 & 0x02) !== 0;
        }
        beat.addNote(newNote);
        if ((flags & 0x08) !== 0) {
            this.readNoteEffects(track, voice, beat, newNote);
        }
        if (bar.staff.isPercussion) {
            newNote.percussionArticulation = newNote.fret;
            newNote.string = -1;
            newNote.fret = -1;
        }
        if (swapAccidentals) {
        }
        return newNote;
    }
    toDynamicValue(value) {
        switch (value) {
            case 1:
                return DynamicValue.PPP;
            case 2:
                return DynamicValue.PP;
            case 3:
                return DynamicValue.P;
            case 4:
                return DynamicValue.MP;
            case 5:
                return DynamicValue.MF;
            case 6:
                return DynamicValue.F;
            case 7:
                return DynamicValue.FF;
            case 8:
                return DynamicValue.FFF;
            default:
                return DynamicValue.F;
        }
    }
    readNoteEffects(_track, voice, beat, note) {
        const flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        if ((flags & 0x01) !== 0) {
            this.readBend(note);
        }
        if ((flags & 0x10) !== 0) {
            this.readGrace(voice, note);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloPicking(beat);
        }
        if ((flags2 & 0x08) !== 0) {
            this.readSlide(note);
        }
        else if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
        }
        if ((flags2 & 0x10) !== 0) {
            this.readArtificialHarmonic(note);
        }
        if ((flags2 & 0x20) !== 0) {
            this.readTrill(note);
        }
        note.isLetRing = (flags & 0x08) !== 0;
        note.isHammerPullOrigin = (flags & 0x02) !== 0;
        if ((flags2 & 0x40) !== 0) {
            note.vibrato = VibratoType.Slight;
        }
        note.isPalmMute = (flags2 & 0x02) !== 0;
        note.isStaccato = (flags2 & 0x01) !== 0;
    }
    readBend(note) {
        this.data.readByte();
        IOHelper.readInt32LE(this.data);
        const pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                const point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data);
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0;
                GpBinaryHelpers.gpReadBool(this.data);
                note.addBendPoint(point);
            }
        }
    }
    readGrace(voice, note) {
        const graceBeat = new Beat();
        const graceNote = new Note();
        graceNote.string = note.string;
        graceNote.fret = IOHelper.readSInt8(this.data);
        graceBeat.duration = Duration.ThirtySecond;
        graceBeat.dynamics = this.toDynamicValue(IOHelper.readSInt8(this.data));
        const transition = IOHelper.readSInt8(this.data);
        switch (transition) {
            case 0:
                break;
            case 1:
                graceNote.slideOutType = SlideOutType.Legato;
                graceNote.slideTarget = note;
                break;
            case 2:
                break;
            case 3:
                graceNote.isHammerPullOrigin = true;
                break;
        }
        graceNote.dynamics = graceBeat.dynamics;
        this.data.skip(1);
        if (this._versionNumber < 500) {
            graceBeat.graceType = GraceType.BeforeBeat;
        }
        else {
            const flags = this.data.readByte();
            graceNote.isDead = (flags & 0x01) !== 0;
            graceBeat.graceType = (flags & 0x02) !== 0 ? GraceType.OnBeat : GraceType.BeforeBeat;
        }
        voice.addGraceBeat(graceBeat);
        graceBeat.addNote(graceNote);
    }
    readTremoloPicking(beat) {
        const speed = this.data.readByte();
        switch (speed) {
            case 1:
                beat.tremoloSpeed = Duration.Eighth;
                break;
            case 2:
                beat.tremoloSpeed = Duration.Sixteenth;
                break;
            case 3:
                beat.tremoloSpeed = Duration.ThirtySecond;
                break;
        }
    }
    readSlide(note) {
        if (this._versionNumber >= 500) {
            const type = IOHelper.readSInt8(this.data);
            if ((type & 1) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
            else if ((type & 2) !== 0) {
                note.slideOutType = SlideOutType.Legato;
            }
            else if ((type & 4) !== 0) {
                note.slideOutType = SlideOutType.OutDown;
            }
            else if ((type & 8) !== 0) {
                note.slideOutType = SlideOutType.OutUp;
            }
            if ((type & 16) !== 0) {
                note.slideInType = SlideInType.IntoFromBelow;
            }
            else if ((type & 32) !== 0) {
                note.slideInType = SlideInType.IntoFromAbove;
            }
        }
        else {
            const type = IOHelper.readSInt8(this.data);
            switch (type) {
                case 1:
                    note.slideOutType = SlideOutType.Shift;
                    break;
                case 2:
                    note.slideOutType = SlideOutType.Legato;
                    break;
                case 3:
                    note.slideOutType = SlideOutType.OutDown;
                    break;
                case 4:
                    note.slideOutType = SlideOutType.OutUp;
                    break;
                case -1:
                    note.slideInType = SlideInType.IntoFromBelow;
                    break;
                case -2:
                    note.slideInType = SlideInType.IntoFromAbove;
                    break;
            }
        }
    }
    readArtificialHarmonic(note) {
        const type = this.data.readByte();
        if (this._versionNumber >= 500) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    note.harmonicValue = ModelUtils.deltaFretToHarmonicValue(note.fret);
                    break;
                case 2:
                    this.data.readByte();
                    this.data.readByte();
                    this.data.readByte();
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    note.harmonicValue = ModelUtils.deltaFretToHarmonicValue(this.data.readByte());
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    note.harmonicValue = 12;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    note.harmonicValue = 12;
                    break;
            }
        }
        else if (this._versionNumber >= 400) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    break;
                case 15:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 17:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 22:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
            }
        }
    }
    readTrill(note) {
        note.trillValue = this.data.readByte() + note.stringTuning;
        switch (this.data.readByte()) {
            case 1:
                note.trillSpeed = Duration.Sixteenth;
                break;
            case 2:
                note.trillSpeed = Duration.ThirtySecond;
                break;
            case 3:
                note.trillSpeed = Duration.SixtyFourth;
                break;
        }
    }
}
Gp3To5Importer.VersionString = 'FICHIER GUITAR PRO ';
Gp3To5Importer.BendStep = 25;
class GpBinaryHelpers {
    static gpReadColor(data, readAlpha = false) {
        const r = data.readByte();
        const g = data.readByte();
        const b = data.readByte();
        let a = 255;
        if (readAlpha) {
            a = data.readByte();
        }
        else {
            data.skip(1);
        }
        return new Color(r, g, b, a);
    }
    static gpReadBool(data) {
        return data.readByte() !== 0;
    }
    static gpReadStringIntUnused(data, encoding) {
        data.skip(4);
        return GpBinaryHelpers.gpReadString(data, data.readByte(), encoding);
    }
    static gpReadStringInt(data, encoding) {
        return GpBinaryHelpers.gpReadString(data, IOHelper.readInt32LE(data), encoding);
    }
    static gpReadStringIntByte(data, encoding) {
        const length = IOHelper.readInt32LE(data) - 1;
        data.readByte();
        return GpBinaryHelpers.gpReadString(data, length, encoding);
    }
    static gpReadString(data, length, encoding) {
        const b = new Uint8Array(length);
        data.read(b, 0, b.length);
        return IOHelper.toString(b, encoding);
    }
    static gpWriteString(data, s) {
        const encoded = IOHelper.stringToBytes(s);
        data.writeByte(s.length);
        data.write(encoded, 0, encoded.length);
    }
    static gpReadStringByteLength(data, length, encoding) {
        const stringLength = data.readByte();
        const s = GpBinaryHelpers.gpReadString(data, stringLength, encoding);
        if (stringLength < length) {
            data.skip(length - stringLength);
        }
        return s;
    }
}
class MixTableChange {
    constructor() {
        this.volume = -1;
        this.balance = -1;
        this.instrument = -1;
        this.tempoName = '';
        this.tempo = -1;
        this.duration = -1;
    }
}
class GpxImporter extends ScoreImporter {
    get name() {
        return 'Guitar Pro 6';
    }
    readScore() {
        Logger.debug(this.name, 'Loading GPX filesystem');
        const fileSystem = new GpxFileSystem();
        fileSystem.fileFilter = s => {
            return (s.endsWith('score.gpif') ||
                s.endsWith('BinaryStylesheet') ||
                s.endsWith('PartConfiguration') ||
                s.endsWith('LayoutConfiguration'));
        };
        fileSystem.load(this.data);
        Logger.debug(this.name, 'GPX filesystem loaded');
        let xml = null;
        let binaryStylesheetData = null;
        let partConfigurationData = null;
        let layoutConfigurationData = null;
        for (const entry of fileSystem.files) {
            switch (entry.fileName) {
                case 'score.gpif':
                    xml = IOHelper.toString(entry.data, this.settings.importer.encoding);
                    break;
                case 'BinaryStylesheet':
                    binaryStylesheetData = entry.data;
                    break;
                case 'PartConfiguration':
                    partConfigurationData = entry.data;
                    break;
                case 'LayoutConfiguration':
                    layoutConfigurationData = entry.data;
                    break;
            }
        }
        if (!xml) {
            throw new UnsupportedFormatError('No score.gpif found in GPX');
        }
        Logger.debug(this.name, 'Start Parsing score.gpif');
        const gpifParser = new GpifParser();
        gpifParser.parseXml(xml, this.settings);
        Logger.debug(this.name, 'score.gpif parsed');
        const score = gpifParser.score;
        return score;
    }
}
class Gp7To8Importer extends ScoreImporter {
    get name() {
        return 'Guitar Pro 7-8';
    }
    readScore() {
        Logger.debug(this.name, 'Loading ZIP entries');
        const fileSystem = new ZipReader(this.data);
        let entries;
        try {
            entries = fileSystem.read();
        }
        catch (e) {
            throw new UnsupportedFormatError('No Zip archive', e);
        }
        Logger.debug(this.name, 'Zip entries loaded');
        let xml = null;
        let binaryStylesheetData = null;
        let partConfigurationData = null;
        let layoutConfigurationData = null;
        const entryLookup = new Map();
        for (const entry of entries) {
            entryLookup.set(entry.fullName, entry);
            switch (entry.fileName) {
                case 'score.gpif':
                    xml = IOHelper.toString(entry.data, this.settings.importer.encoding);
                    break;
                case 'BinaryStylesheet':
                    binaryStylesheetData = entry.data;
                    break;
                case 'PartConfiguration':
                    partConfigurationData = entry.data;
                    break;
                case 'LayoutConfiguration':
                    layoutConfigurationData = entry.data;
                    break;
            }
        }
        if (!xml) {
            throw new UnsupportedFormatError('No score.gpif found in zip archive');
        }
        Logger.debug(this.name, 'Start Parsing score.gpif');
        const gpifParser = new GpifParser();
        gpifParser.loadAsset = (fileName) => {
            if (entryLookup.has(fileName)) {
                return entryLookup.get(fileName).data;
            }
            ;
            return undefined;
        };
        gpifParser.parseXml(xml, this.settings);
        Logger.debug(this.name, 'score.gpif parsed');
        const score = gpifParser.score;
        if (binaryStylesheetData) {
            Logger.debug(this.name, 'Start Parsing BinaryStylesheet');
            const stylesheet = new BinaryStylesheet(binaryStylesheetData);
            stylesheet.apply(score);
            Logger.debug(this.name, 'BinaryStylesheet parsed');
        }
        return score;
    }
}
class StaffContext {
    constructor() {
        this.currentDynamics = DynamicValue.F;
        this.slideOrigins = new Map();
        this.transpose = 0;
        this.isExplicitlyBeamed = false;
        this.tieStarts = new Set();
        this.tieStartIds = new Map();
        this.slideOrigins = new Map();
        this.slurStarts = new Map();
    }
}
class InstrumentArticulationWithPlaybackInfo extends InstrumentArticulation {
    constructor() {
        super(...arguments);
        this.outputMidiChannel = -1;
        this.outputMidiProgram = -1;
        this.outputMidiBank = -1;
        this.outputVolume = -1;
        this.outputBalance = -1;
    }
}
class TrackInfo {
    constructor(track) {
        this.instrumentArticulations = new Map();
        this._instrumentIdToArticulationIndex = new Map();
        this._lyricsLine = 0;
        this._lyricsLines = new Map();
        this.track = track;
    }
    getLyricLine(number) {
        if (this._lyricsLines.has(number)) {
            return this._lyricsLines.get(number);
        }
        const line = this._lyricsLine;
        this._lyricsLines.set(number, line);
        this._lyricsLine++;
        return line;
    }
    getOrCreateArticulation(instrumentId, note) {
        const noteValue = note.octave * 12 + note.tone;
        const lookup = `${instrumentId}_${noteValue}`;
        if (this._instrumentIdToArticulationIndex.has(lookup)) {
            return this._instrumentIdToArticulationIndex.get(lookup);
        }
        let articulation;
        if (this.instrumentArticulations.has(instrumentId)) {
            articulation = this.instrumentArticulations.get(instrumentId);
        }
        else {
            articulation = TrackInfo.defaultNoteArticulation;
        }
        const index = this.track.percussionArticulations.length;
        const bar = note.beat.voice.bar;
        const actualSteps = note.beat.voice.bar.staff.standardNotationLineCount * 2 - 1;
        const fiveLineSteps = 5 * 2 - 1;
        const stepDifference = fiveLineSteps - actualSteps;
        const newArticulation = new InstrumentArticulation(articulation.elementType, 0, articulation.outputMidiNumber);
        this._instrumentIdToArticulationIndex.set(lookup, index);
        this.track.percussionArticulations.push(newArticulation);
        return index;
    }
}
TrackInfo.defaultNoteArticulation = new InstrumentArticulation();
class MusicXmlImporter extends ScoreImporter {
    constructor() {
        super(...arguments);
        this._idToTrackInfo = new Map();
        this._indexToTrackInfo = new Map();
        this._staffToContext = new Map();
        this._divisionsPerQuarterNote = 1;
        this._currentDynamics = DynamicValue.F;
        this._musicalPosition = 0;
        this._lastBeat = null;
        this._nextMasterBarRepeatEnding = 0;
        this._nextBeatAutomations = null;
        this._nextBeatChord = null;
        this._nextBeatCrescendo = null;
        this._nextBeatLetRing = false;
        this._nextBeatPalmMute = false;
        this._nextBeatOttavia = null;
        this._nextBeatText = null;
        this._simileMarkAllStaves = null;
        this._simileMarkPerStaff = null;
        this._isBeatSlash = false;
        this._keyAllStaves = null;
        this._currentTrillStep = -1;
    }
    get name() {
        return 'MusicXML';
    }
    readScore() {
        const xml = this.extractMusicXml();
        const dom = new XmlDocument();
        try {
            dom.parse(xml);
        }
        catch (e) {
            throw new UnsupportedFormatError('Unsupported format', e);
        }
        this._score = new Score();
        this._score.tempo = 120;
        this.parseDom(dom);
        ModelUtils.consolidate(this._score);
        this._score.finish(this.settings);
        this._score.rebuildRepeatGroups();
        return this._score;
    }
    extractMusicXml() {
        const zip = new ZipReader(this.data);
        let entries;
        try {
            entries = zip.read();
        }
        catch {
            entries = [];
        }
        if (entries.length === 0) {
            this.data.reset();
            return IOHelper.toString(this.data.readAll(), this.settings.importer.encoding);
        }
        const container = entries.find(e => e.fullName === 'META-INF/container.xml');
        if (!container) {
            throw new UnsupportedFormatError('No compressed MusicXML');
        }
        const containerDom = new XmlDocument();
        try {
            containerDom.parse(IOHelper.toString(container.data, this.settings.importer.encoding));
        }
        catch (e) {
            throw new UnsupportedFormatError('Malformed container.xml, could not parse as XML', e);
        }
        const root = containerDom.firstElement;
        if (!root || root.localName !== 'container') {
            throw new UnsupportedFormatError("Malformed container.xml, root element not 'container'");
        }
        const rootFiles = root.findChildElement('rootfiles');
        if (!rootFiles) {
            throw new UnsupportedFormatError("Malformed container.xml, 'container/rootfiles' not found");
        }
        let uncompressedFileFullPath = '';
        for (const c of rootFiles.childElements()) {
            if (c.localName === 'rootfile') {
                uncompressedFileFullPath = c.getAttribute('full-path');
                break;
            }
        }
        if (!uncompressedFileFullPath) {
            throw new UnsupportedFormatError('Unsupported compressed MusicXML, missing rootfile');
        }
        const file = entries.find(e => e.fullName === uncompressedFileFullPath);
        if (!file) {
            throw new UnsupportedFormatError(`Malformed container.xml, '${uncompressedFileFullPath}' not contained in zip`);
        }
        return IOHelper.toString(file.data, this.settings.importer.encoding);
    }
    parseDom(dom) {
        const root = dom.firstElement;
        if (!root) {
            throw new UnsupportedFormatError('Unsupported format');
        }
        switch (root.localName) {
            case 'score-partwise':
                this.parsePartwise(root);
                break;
            case 'score-timewise':
                this.parseTimewise(root);
                break;
            default:
                throw new UnsupportedFormatError('Unsupported format');
        }
    }
    parsePartwise(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'credit':
                    this.parseCredit(c);
                    break;
                case 'identification':
                    this.parseIdentification(c);
                    break;
                case 'movement-title':
                    this.parseMovementTitle(c);
                    break;
                case 'part':
                    this.parsePartwisePart(c);
                    break;
                case 'part-list':
                    this.parsePartList(c);
                    break;
                case 'work':
                    this.parseWork(c);
                    break;
            }
        }
    }
    parseTimewise(element) {
        let index = 0;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'credit':
                    this.parseCredit(c);
                    break;
                case 'identification':
                    this.parseIdentification(c);
                    break;
                case 'movement-title':
                    this.parseMovementTitle(c);
                    break;
                case 'part-list':
                    this.parsePartList(c);
                    break;
                case 'work':
                    this.parseWork(c);
                    break;
                case 'measure':
                    this.parseTimewiseMeasure(c, index);
                    index++;
                    break;
            }
        }
    }
    parseCredit(element) {
        if (element.getAttribute('page', '1') !== '1') {
            return;
        }
        const creditTypes = [];
        let firstWords = null;
        let fullText = '';
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'credit-type':
                    creditTypes.push(c.innerText);
                    break;
                case 'credit-words':
                    if (firstWords === null) {
                        firstWords = c;
                    }
                    fullText += c.innerText;
                    break;
            }
        }
        if (creditTypes.length > 0) {
            for (const type of creditTypes) {
                switch (type) {
                    case 'title':
                        this._score.title = MusicXmlImporter.sanitizeDisplay(fullText);
                        break;
                    case 'subtitle':
                        this._score.subTitle = MusicXmlImporter.sanitizeDisplay(fullText);
                        break;
                    case 'composer':
                        this._score.artist = MusicXmlImporter.sanitizeDisplay(fullText);
                        break;
                    case 'arranger':
                        this._score.artist = MusicXmlImporter.sanitizeDisplay(fullText);
                        break;
                    case 'lyricist':
                        this._score.words = MusicXmlImporter.sanitizeDisplay(fullText);
                        break;
                    case 'rights':
                        this._score.copyright = MusicXmlImporter.sanitizeDisplay(fullText);
                        break;
                    case 'part name':
                        break;
                }
            }
        }
        else if (firstWords) {
            const justify = firstWords.getAttribute('font-size', '0');
            const valign = firstWords.getAttribute('font-size', 'top');
            const halign = firstWords.getAttribute('halign', 'left');
            if (valign === 'top') {
                if (fullText.includes('copyright') ||
                    fullText.includes('Copyright') ||
                    fullText.includes('©') ||
                    fullText.includes('(c)') ||
                    fullText.includes('(C)')) {
                    this._score.copyright = MusicXmlImporter.sanitizeDisplay(fullText);
                    return;
                }
                if (halign === 'center' || justify === 'center') {
                    if (this._score.title.length === 0) {
                        this._score.title = MusicXmlImporter.sanitizeDisplay(fullText);
                        return;
                    }
                    if (this._score.subTitle.length === 0) {
                        this._score.subTitle = MusicXmlImporter.sanitizeDisplay(fullText);
                        return;
                    }
                    if (this._score.album.length === 0) {
                        this._score.album = MusicXmlImporter.sanitizeDisplay(fullText);
                        return;
                    }
                }
                else if (halign === 'right' || justify === 'right') {
                    if (this._score.music.length === 0) {
                        this._score.music = MusicXmlImporter.sanitizeDisplay(fullText);
                        return;
                    }
                }
                if (this._score.artist.length === 0) {
                    this._score.artist = MusicXmlImporter.sanitizeDisplay(fullText);
                    return;
                }
                if (this._score.words.length === 0) {
                    this._score.words = MusicXmlImporter.sanitizeDisplay(fullText);
                    return;
                }
            }
        }
    }
    static sanitizeDisplay(text) {
        return text.replaceAll('\r', '').replaceAll('\n', ' ').replaceAll('\t', '\xA0\xA0').replaceAll(' ', '\xA0');
    }
    parseIdentification(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'creator':
                    if (c.attributes.has('type')) {
                        switch (c.attributes.get('type')) {
                            case 'composer':
                                this._score.artist = MusicXmlImporter.sanitizeDisplay(c.innerText);
                                break;
                            case 'lyricist':
                                this._score.words = MusicXmlImporter.sanitizeDisplay(c.innerText);
                                break;
                            case 'arranger':
                                this._score.music = MusicXmlImporter.sanitizeDisplay(c.innerText);
                                break;
                        }
                    }
                    else {
                        this._score.artist = MusicXmlImporter.sanitizeDisplay(c.innerText);
                    }
                    break;
                case 'rights':
                    if (this._score.copyright.length > 0) {
                        this._score.copyright += ', ';
                    }
                    this._score.copyright += c.innerText;
                    if (c.attributes.has('type')) {
                        this._score.copyright += ` (${c.attributes.get('type')})`;
                    }
                    break;
                case 'encoding':
                    this.parseEncoding(c);
                    break;
            }
        }
    }
    parseEncoding(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'encoder':
                    if (this._score.tab.length > 0) {
                        this._score.tab += ', ';
                    }
                    this._score.tab += c.innerText;
                    if (c.attributes.has('type')) {
                        this._score.tab += ` (${c.attributes.get('type')})`;
                    }
                    break;
                case 'encoding-description':
                    this._score.notices += MusicXmlImporter.sanitizeDisplay(c.innerText);
                    break;
            }
        }
    }
    parseMovementTitle(element) {
        if (this._score.title.length === 0) {
            this._score.title = MusicXmlImporter.sanitizeDisplay(element.innerText);
        }
        else {
            this._score.subTitle = MusicXmlImporter.sanitizeDisplay(element.innerText);
        }
    }
    parsePartList(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'score-part':
                    this.parseScorePart(c);
                    break;
            }
        }
    }
    parseScorePart(element) {
        const track = new Track();
        track.ensureStaveCount(1);
        this._score.addTrack(track);
        const id = element.attributes.get('id');
        const trackInfo = new TrackInfo(track);
        this._idToTrackInfo.set(id, trackInfo);
        this._indexToTrackInfo.set(track.index, trackInfo);
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'part-name':
                    track.name = MusicXmlImporter.sanitizeDisplay(c.innerText);
                    break;
                case 'part-name-display':
                    track.name = this.parsePartDisplayAsText(c);
                    break;
                case 'part-abbreviation':
                    track.shortName = MusicXmlImporter.sanitizeDisplay(c.innerText);
                    break;
                case 'part-abbreviation-display':
                    track.shortName = this.parsePartDisplayAsText(c);
                    break;
                case 'score-instrument':
                    this.parseScoreInstrument(c, trackInfo);
                    break;
                case 'midi-device':
                    if (c.attributes.has('port')) {
                        track.playbackInfo.port = Number.parseInt(c.attributes.get('port'), 10);
                    }
                    break;
                case 'midi-instrument':
                    this.parseScorePartMidiInstrument(c, trackInfo);
                    break;
            }
        }
        if (trackInfo.firstArticulation) {
            if (trackInfo.firstArticulation.outputMidiProgram >= 0) {
                track.playbackInfo.program = trackInfo.firstArticulation.outputMidiProgram;
            }
            if (trackInfo.firstArticulation.outputMidiBank >= 0) {
                track.playbackInfo.bank = trackInfo.firstArticulation.outputMidiBank;
            }
            if (trackInfo.firstArticulation.outputBalance >= 0) {
                track.playbackInfo.balance = trackInfo.firstArticulation.outputBalance;
            }
            if (trackInfo.firstArticulation.outputVolume >= 0) {
                track.playbackInfo.volume = trackInfo.firstArticulation.outputVolume;
            }
            if (trackInfo.firstArticulation.outputMidiChannel >= 0) {
                track.playbackInfo.primaryChannel = trackInfo.firstArticulation.outputMidiChannel;
                track.playbackInfo.secondaryChannel = trackInfo.firstArticulation.outputMidiChannel;
            }
        }
    }
    parseScoreInstrument(element, trackInfo) {
        const articulation = new InstrumentArticulationWithPlaybackInfo();
        if (!trackInfo.firstArticulation) {
            trackInfo.firstArticulation = articulation;
        }
        trackInfo.instrumentArticulations.set(element.getAttribute('id', ''), articulation);
    }
    parseScorePartMidiInstrument(element, trackInfo) {
        const id = element.getAttribute('id', '');
        if (!trackInfo.instrumentArticulations.has(id)) {
            return;
        }
        const articulation = trackInfo.instrumentArticulations.get(id);
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'midi-channel':
                    articulation.outputMidiChannel = Number.parseInt(c.innerText, 10) - 1;
                    break;
                case 'midi-bank':
                    articulation.outputMidiBank = Number.parseInt(c.innerText, 10) - 1;
                    break;
                case 'midi-program':
                    articulation.outputMidiProgram = Number.parseInt(c.innerText, 10) - 1;
                    break;
                case 'midi-unpitched':
                    articulation.outputMidiNumber = Number.parseInt(c.innerText, 10) - 1;
                    break;
                case 'volume':
                    articulation.outputVolume = MusicXmlImporter.interpolatePercent(Number.parseFloat(c.innerText));
                    break;
                case 'pan':
                    articulation.outputBalance = MusicXmlImporter.interpolatePan(Number.parseFloat(c.innerText));
                    break;
            }
        }
    }
    static interpolatePercent(value) {
        return MusicXmlImporter.interpolate(0, 100, 0, 16, value) | 0;
    }
    static interpolatePan(value) {
        return MusicXmlImporter.interpolate(-90, 90, 0, 16, value) | 0;
    }
    static interpolate(inputStart, inputEnd, outputStart, outputEnd, value) {
        const t = (value - inputStart) / (inputEnd - inputStart);
        return outputStart + (outputEnd - outputStart) * t;
    }
    parsePartDisplayAsText(element) {
        let text = '';
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'display-text':
                    text += c.innerText;
                    break;
                case 'accidental-text':
                    switch (c.innerText) {
                        case 'sharp':
                            text += '♯';
                            break;
                        case 'natural':
                            text += '♮';
                            break;
                        case 'flat':
                            text += '♭';
                            break;
                        case 'double-sharp':
                            text += '𝄪';
                            break;
                        case 'sharp-sharp':
                            text += '♯♯';
                            break;
                        case 'flat-flat':
                            text += '𝄫';
                            break;
                        case 'natural-sharp':
                            text += '♮♯';
                            break;
                        case 'natural-flat':
                            text += '♮♭';
                            break;
                        case 'sharp-down':
                            text += '𝄱';
                            break;
                        case 'sharp-up':
                            text += '𝄰';
                            break;
                        case 'natural-down':
                            text += '𝄯';
                            break;
                        case 'natural-up':
                            text += '𝄮';
                            break;
                        case 'flat-down':
                            text += '𝄭';
                            break;
                        case 'flat-up':
                            text += '𝄬';
                            break;
                        case 'arrow-down':
                            text += '↓';
                            break;
                        case 'arrow-up':
                            text += '↑';
                            break;
                        case 'triple-sharp':
                            text += '♯𝄪';
                            break;
                        case 'triple-flat':
                            text += '𝄬𝄬𝄬';
                            break;
                        case 'sharp-1':
                            text += '♯¹';
                            break;
                        case 'sharp-2':
                            text += '♯²';
                            break;
                        case 'sharp-3':
                            text += '♯³';
                            break;
                        case 'sharp-4':
                            text += '♯⁴';
                            break;
                        case 'sharp-5':
                            text += '♯⁵';
                            break;
                        case 'flat-1':
                            text += '♭¹';
                            break;
                        case 'flat-2':
                            text += '♭²';
                            break;
                        case 'flat-3':
                            text += '♭³';
                            break;
                        case 'flat-4':
                            text += '♭⁴';
                            break;
                        case 'flat-5':
                            text += '♭⁵';
                            break;
                    }
                    break;
            }
        }
        return MusicXmlImporter.sanitizeDisplay(text);
    }
    parseWork(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'work-title':
                    this._score.title = MusicXmlImporter.sanitizeDisplay(c.innerText);
                    break;
            }
        }
    }
    parsePartwisePart(element) {
        const id = element.attributes.get('id');
        if (!id || !this._idToTrackInfo.has(id)) {
            return;
        }
        const track = this._idToTrackInfo.get(id).track;
        let index = 0;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'measure':
                    this.parsePartwiseMeasure(c, track, index);
                    index++;
                    break;
            }
        }
    }
    parsePartwiseMeasure(element, track, index) {
        const masterBar = this.getOrCreateMasterBar(element, index);
        this.parsePartMeasure(element, masterBar, track);
    }
    parseTimewiseMeasure(element, index) {
        const masterBar = this.getOrCreateMasterBar(element, index);
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'part':
                    this.parseTimewisePart(c, masterBar);
                    break;
            }
        }
    }
    getOrCreateMasterBar(element, index) {
        const implicit = element.attributes.get('implicit') === 'yes';
        while (this._score.masterBars.length <= index) {
            const newMasterBar = new MasterBar();
            if (implicit) {
                newMasterBar.isAnacrusis = true;
            }
            this._score.addMasterBar(newMasterBar);
            if (newMasterBar.index > 0) {
                newMasterBar.timeSignatureDenominator = newMasterBar.previousMasterBar.timeSignatureDenominator;
                newMasterBar.timeSignatureNumerator = newMasterBar.previousMasterBar.timeSignatureNumerator;
                newMasterBar.tripletFeel = newMasterBar.previousMasterBar.tripletFeel;
            }
        }
        const masterBar = this._score.masterBars[index];
        return masterBar;
    }
    parseTimewisePart(element, masterBar) {
        const id = element.attributes.get('id');
        if (!id || !this._idToTrackInfo.has(id)) {
            return;
        }
        const track = this._idToTrackInfo.get(id).track;
        this.parsePartMeasure(element, masterBar, track);
    }
    parsePartMeasure(element, masterBar, track) {
        this._musicalPosition = 0;
        this._lastBeat = null;
        masterBar.alternateEndings = this._nextMasterBarRepeatEnding;
        const barLines = [];
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'note':
                    this.parseNote(c, masterBar, track);
                    break;
                case 'backup':
                    this.parseBackup(c);
                    break;
                case 'forward':
                    this.parseForward(c);
                    break;
                case 'direction':
                    this.parseDirection(c, masterBar, track);
                    break;
                case 'attributes':
                    this.parseAttributes(c, masterBar, track);
                    break;
                case 'harmony':
                    this.parseHarmony(c, track);
                    break;
                case 'print':
                    this.parsePrint(c, masterBar, track);
                    break;
                case 'sound':
                    this.parseSound(c, masterBar, track);
                    break;
                case 'barline':
                    barLines.push(c);
                    break;
            }
        }
        for (const barLine of barLines) {
            this.parseBarLine(barLine, masterBar, track);
        }
        this.applySimileMarks(masterBar, track);
        const staff = this.getOrCreateStaff(track, 0);
        this.getOrCreateBar(staff, masterBar);
        this._keyAllStaves = null;
    }
    parsePrint(element, masterBar, track) {
        if (element.getAttribute('new-system', 'no') === 'yes') {
            track.addLineBreaks(masterBar.index);
        }
        else if (element.getAttribute('new-page', 'no') === 'yes') {
            track.addLineBreaks(masterBar.index);
        }
    }
    applySimileMarks(masterBar, track) {
        if (this._simileMarkAllStaves !== null) {
            for (const s of track.staves) {
                const bar = this.getOrCreateBar(s, masterBar);
                bar.simileMark = this._simileMarkAllStaves;
                if (bar.simileMark !== SimileMark.None) {
                    this.clearBar(bar);
                }
            }
            if (this._simileMarkAllStaves === SimileMark.FirstOfDouble) {
                this._simileMarkAllStaves = SimileMark.SecondOfDouble;
            }
            else {
                this._simileMarkAllStaves = null;
            }
        }
        if (this._simileMarkPerStaff !== null) {
            const keys = Array.from(this._simileMarkPerStaff.keys());
            for (const i of keys) {
                const s = this.getOrCreateStaff(track, i);
                const bar = this.getOrCreateBar(s, masterBar);
                bar.simileMark = this._simileMarkPerStaff.get(i);
                if (bar.simileMark !== SimileMark.None) {
                    this.clearBar(bar);
                }
                if (bar.simileMark === SimileMark.FirstOfDouble) {
                    this._simileMarkPerStaff.set(i, SimileMark.SecondOfDouble);
                }
                else {
                    this._simileMarkPerStaff.delete(i);
                }
            }
            if (this._simileMarkPerStaff.size === 0) {
                this._simileMarkPerStaff = null;
            }
        }
    }
    clearBar(bar) {
        for (const v of bar.voices) {
            const emptyBeat = new Beat();
            emptyBeat.isEmpty = true;
            v.addBeat(emptyBeat);
        }
    }
    parseBarLine(element, masterBar, track) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'bar-style':
                    this.parseBarStyle(c, masterBar, track, element.getAttribute('location', 'right'));
                    break;
                case 'ending':
                    this.parseEnding(c, masterBar);
                    break;
                case 'repeat':
                    this.parseRepeat(c, masterBar);
                    break;
            }
        }
    }
    parseRepeat(element, masterBar) {
        const direction = element.getAttribute('direction');
        let times = Number.parseInt(element.getAttribute('times'), 10);
        if (times < 0 || Number.isNaN(times)) {
            times = 2;
        }
        if (direction === 'backward') {
            masterBar.repeatCount = times;
        }
        else if (direction === 'forward') {
            masterBar.isRepeatStart = true;
        }
    }
    parseEnding(element, masterBar) {
        const numbers = element
            .getAttribute('number')
            .split(',')
            .map(v => Number.parseInt(v, 10));
        let flags = 0;
        for (const num of numbers) {
            flags = flags | ((0x01 << (num - 1)) & 0xff);
        }
        masterBar.alternateEndings = flags;
        switch (element.getAttribute('type', '')) {
            case 'start':
                this._nextMasterBarRepeatEnding = this._nextMasterBarRepeatEnding | flags;
                break;
            case 'stop':
            case 'discontinue':
                this._nextMasterBarRepeatEnding = this._nextMasterBarRepeatEnding & ~flags;
                break;
            case 'continue':
                break;
        }
    }
    parseBarStyle(element, masterBar, track, location) {
        let style = BarLineStyle.Automatic;
        switch (element.innerText) {
            case 'dashed':
                style = BarLineStyle.Dashed;
                break;
            case 'dotted':
                style = BarLineStyle.Dotted;
                break;
            case 'heavy':
                style = BarLineStyle.Heavy;
                break;
            case 'heavy-heavy':
                style = BarLineStyle.HeavyHeavy;
                break;
            case 'heavy-light':
                style = BarLineStyle.HeavyLight;
                break;
            case 'light-heavy':
                style = BarLineStyle.LightHeavy;
                break;
            case 'light-light':
                style = BarLineStyle.LightLight;
                break;
            case 'none':
                style = BarLineStyle.None;
                break;
            case 'regular':
                style = BarLineStyle.Regular;
                break;
            case 'short':
                style = BarLineStyle.Short;
                break;
            case 'tick':
                style = BarLineStyle.Tick;
                break;
        }
        for (const s of track.staves) {
            const bar = this.getOrCreateBar(s, masterBar);
            switch (location) {
                case 'left':
                    bar.barLineLeft = style;
                    break;
                case 'right':
                    bar.barLineRight = style;
                    break;
            }
        }
    }
    parseSound(element, masterBar, _track) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'midi-instrument':
                    this.parseSoundMidiInstrument(c, masterBar);
                    break;
                case 'swing':
                    this.parseSwing(c, masterBar);
                    break;
                case 'offset':
                    break;
            }
        }
        if (element.attributes.has('coda')) {
            masterBar.addDirection(Direction.TargetCoda);
        }
        if (element.attributes.has('tocoda')) {
            masterBar.addDirection(Direction.JumpDaCoda);
        }
        if (element.attributes.has('dacapo')) {
            masterBar.addDirection(Direction.JumpDaCapo);
        }
        if (element.attributes.has('dalsegno')) {
            masterBar.addDirection(Direction.JumpDalSegno);
        }
        if (element.attributes.has('fine')) {
            masterBar.addDirection(Direction.TargetFine);
        }
        if (element.attributes.has('segno')) {
            masterBar.addDirection(Direction.TargetSegno);
        }
        if (element.attributes.has('pan')) {
            if (!this._nextBeatAutomations) {
                this._nextBeatAutomations = [];
            }
            const automation = new Automation();
            automation.type = AutomationType.Balance;
            automation.value = MusicXmlImporter.interpolatePan(Number.parseFloat(element.attributes.get('pan')));
            this._nextBeatAutomations.push(automation);
        }
        if (element.attributes.has('tempo')) {
            if (!this._nextBeatAutomations) {
                this._nextBeatAutomations = [];
            }
            const automation = new Automation();
            automation.type = AutomationType.Tempo;
            automation.value = MusicXmlImporter.interpolatePercent(Number.parseFloat(element.attributes.get('tempo')));
            this._nextBeatAutomations.push(automation);
        }
    }
    parseSwing(element, masterBar) {
        let first = 0;
        let second = 0;
        let swingType = null;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'straight':
                    masterBar.tripletFeel = TripletFeel.NoTripletFeel;
                    return;
                case 'first':
                    first = Number.parseInt(c.innerText, 10);
                    break;
                case 'second':
                    second = Number.parseInt(c.innerText, 10);
                    break;
                case 'swing-type':
                    swingType = this.parseBeatDuration(c);
                    break;
            }
        }
        if (!swingType) {
            swingType = Duration.Eighth;
        }
        if (swingType === Duration.Eighth) {
            if (first === 2 && second === 1) {
                masterBar.tripletFeel = TripletFeel.Triplet8th;
            }
            else if (first === 3 && second === 1) {
                masterBar.tripletFeel = TripletFeel.Dotted8th;
            }
            else if (first === 1 && second === 3) {
                masterBar.tripletFeel = TripletFeel.Scottish8th;
            }
        }
        else if (swingType === Duration.Sixteenth) {
            if (first === 2 && second === 1) {
                masterBar.tripletFeel = TripletFeel.Triplet16th;
            }
            else if (first === 3 && second === 1) {
                masterBar.tripletFeel = TripletFeel.Dotted16th;
            }
            else if (first === 1 && second === 3) {
                masterBar.tripletFeel = TripletFeel.Scottish16th;
            }
        }
    }
    parseSoundMidiInstrument(element, _masterBar) {
        let automation;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'midi-bank':
                    if (!this._nextBeatAutomations) {
                        this._nextBeatAutomations = [];
                    }
                    automation = new Automation();
                    automation.type = AutomationType.Bank;
                    automation.value = Number.parseInt(c.innerText, 10) - 1;
                    this._nextBeatAutomations.push(automation);
                    break;
                case 'midi-program':
                    if (!this._nextBeatAutomations) {
                        this._nextBeatAutomations = [];
                    }
                    automation = new Automation();
                    automation.type = AutomationType.Instrument;
                    automation.value = Number.parseInt(c.innerText, 10) - 1;
                    this._nextBeatAutomations.push(automation);
                    break;
                case 'volume':
                    if (!this._nextBeatAutomations) {
                        this._nextBeatAutomations = [];
                    }
                    automation = new Automation();
                    automation.type = AutomationType.Volume;
                    automation.value = MusicXmlImporter.interpolatePercent(Number.parseFloat(c.innerText));
                    this._nextBeatAutomations.push(automation);
                    break;
                case 'pan':
                    if (!this._nextBeatAutomations) {
                        this._nextBeatAutomations = [];
                    }
                    automation = new Automation();
                    automation.type = AutomationType.Balance;
                    automation.value = MusicXmlImporter.interpolatePan(Number.parseFloat(c.innerText));
                    this._nextBeatAutomations.push(automation);
                    break;
            }
        }
    }
    parseHarmony(element, _track) {
        const chord = new Chord();
        let degreeParenthesis = false;
        let degree = '';
        for (const childNode of element.childElements()) {
            switch (childNode.localName) {
                case 'root':
                    chord.name = this.parseHarmonyRoot(childNode);
                    break;
                case 'kind':
                    chord.name = chord.name + this.parseHarmonyKind(childNode);
                    if (childNode.getAttribute('parentheses-degrees', 'no') === 'yes') {
                        degreeParenthesis = true;
                    }
                    break;
                case 'frame':
                    this.parseHarmonyFrame(childNode, chord);
                    break;
                case 'degree':
                    degree += this.parseDegree(childNode);
                    break;
            }
        }
        if (degree) {
            chord.name += degreeParenthesis ? `(${degree})` : degree;
        }
        if (this._nextBeatChord === null) {
            this._nextBeatChord = chord;
        }
    }
    parseDegree(element) {
        let value = '';
        let alter = '';
        let type = '';
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'degree-value':
                    value = c.innerText;
                    break;
                case 'degree-alter':
                    switch (c.innerText) {
                        case '-1':
                            alter = '♭';
                            break;
                        case '1':
                            alter = '♯';
                            break;
                    }
                    break;
                case 'degree-type':
                    type += c.getAttribute('text', '');
                    break;
            }
        }
        return `${type}${alter}${value}`;
    }
    parseHarmonyRoot(element) {
        let rootStep = '';
        let rootAlter = '';
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'root-step':
                    rootStep = c.innerText;
                    break;
                case 'root-alter':
                    switch (Number.parseFloat(c.innerText)) {
                        case -2:
                            rootAlter = 'bb';
                            break;
                        case -1:
                            rootAlter = 'b';
                            break;
                        case 0:
                            rootAlter = '';
                            break;
                        case 1:
                            rootAlter = '#';
                            break;
                        case 2:
                            rootAlter = '##';
                            break;
                    }
                    break;
            }
        }
        return rootStep + rootAlter;
    }
    parseHarmonyKind(xmlNode) {
        const kindText = xmlNode.getAttribute('text');
        let resultKind = '';
        if (kindText) {
            resultKind = kindText;
        }
        else {
            const kindContent = xmlNode.innerText;
            switch (kindContent) {
                case 'major':
                    resultKind = '';
                    break;
                case 'minor':
                    resultKind = 'm';
                    break;
                case 'augmented':
                    resultKind = '+';
                    break;
                case 'diminished':
                    resultKind = '\u25CB';
                    break;
                case 'dominant':
                    resultKind = '7';
                    break;
                case 'major-seventh':
                    resultKind = '7M';
                    break;
                case 'minor-seventh':
                    resultKind = 'm7';
                    break;
                case 'diminished-seventh':
                    resultKind = '\u25CB7';
                    break;
                case 'augmented-seventh':
                    resultKind = '+7';
                    break;
                case 'half-diminished':
                    resultKind = '\u2349';
                    break;
                case 'major-minor':
                    resultKind = 'mMaj';
                    break;
                case 'major-sixth':
                    resultKind = 'maj6';
                    break;
                case 'minor-sixth':
                    resultKind = 'm6';
                    break;
                case 'dominant-ninth':
                    resultKind = '9';
                    break;
                case 'major-ninth':
                    resultKind = 'maj9';
                    break;
                case 'minor-ninth':
                    resultKind = 'm9';
                    break;
                case 'dominant-11th':
                    resultKind = '11';
                    break;
                case 'major-11th':
                    resultKind = 'maj11';
                    break;
                case 'minor-11th':
                    resultKind = 'm11';
                    break;
                case 'dominant-13th':
                    resultKind = '13';
                    break;
                case 'major-13th':
                    resultKind = 'maj13';
                    break;
                case 'minor-13th':
                    resultKind = 'm13';
                    break;
                case 'suspended-second':
                    resultKind = 'sus2';
                    break;
                case 'suspended-fourth':
                    resultKind = 'sus4';
                    break;
                case 'Neapolitan':
                    resultKind = '♭II';
                    break;
                case 'Italian':
                    resultKind = 'It⁺⁶';
                    break;
                case 'French':
                    resultKind = 'Fr⁺⁶';
                    break;
                case 'German':
                    resultKind = 'Fr⁺⁶';
                    break;
                default:
                    resultKind = kindContent;
                    break;
            }
        }
        return resultKind;
    }
    parseHarmonyFrame(xmlNode, chord) {
        for (const frameChild of xmlNode.childElements()) {
            switch (frameChild.localName) {
                case 'frame-strings':
                    const stringsCount = Number.parseInt(frameChild.innerText, 10);
                    chord.strings = new Array(stringsCount);
                    for (let i = 0; i < stringsCount; i++) {
                        chord.strings[i] = -1;
                    }
                    break;
                case 'first-fret':
                    chord.firstFret = Number.parseInt(frameChild.innerText, 10);
                    break;
                case 'frame-note':
                    let stringNo = null;
                    let fretNo = null;
                    for (const noteChild of frameChild.childElements()) {
                        switch (noteChild.localName) {
                            case 'string':
                                stringNo = Number.parseInt(noteChild.innerText, 10);
                                break;
                            case 'fret':
                                fretNo = Number.parseInt(noteChild.innerText, 10);
                                if (stringNo && fretNo >= 0) {
                                    chord.strings[stringNo - 1] = fretNo;
                                }
                                break;
                            case 'barre':
                                if (stringNo && fretNo && noteChild.getAttribute('type') === 'start') {
                                    chord.barreFrets.push(fretNo);
                                }
                                break;
                        }
                    }
                    break;
            }
        }
    }
    parseAttributes(element, masterBar, track) {
        let staffIndex;
        let staff;
        let bar;
        if (this._lastBeat == null) {
            for (const c of element.childElements()) {
                switch (c.localName) {
                    case 'divisions':
                        this._divisionsPerQuarterNote = Number.parseFloat(c.innerText);
                        break;
                    case 'key':
                        this.parseKey(c, masterBar, track);
                        break;
                    case 'time':
                        this.parseTime(c, masterBar);
                        break;
                    case 'staves':
                        track.ensureStaveCount(Number.parseInt(c.innerText, 10));
                        break;
                    case 'clef':
                        staffIndex = Number.parseInt(c.getAttribute('number', '1'), 10) - 1;
                        staff = this.getOrCreateStaff(track, staffIndex);
                        bar = this.getOrCreateBar(staff, masterBar);
                        this.parseClef(c, bar);
                        break;
                    case 'staff-details':
                        staffIndex = Number.parseInt(c.getAttribute('number', '1'), 10) - 1;
                        staff = this.getOrCreateStaff(track, staffIndex);
                        this.parseStaffDetails(c, staff);
                        break;
                    case 'transpose':
                        this.parseTranspose(c, track);
                        break;
                    case 'measure-style':
                        this.parseMeasureStyle(c, track, false);
                        break;
                }
            }
        }
        else {
            for (const c of element.childElements()) {
                switch (c.localName) {
                    case 'divisions':
                        this._divisionsPerQuarterNote = Number.parseFloat(c.innerText);
                        break;
                    case 'measure-style':
                        this.parseMeasureStyle(c, track, true);
                        break;
                }
            }
        }
    }
    parseMeasureStyle(element, _track, midBar) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'measure-repeat':
                    if (!midBar) {
                        let simileMark = null;
                        switch (c.getAttribute('type')) {
                            case 'start':
                                switch (Number.parseInt(c.getAttribute('slashes', '1'), 10)) {
                                    case 1:
                                        simileMark = SimileMark.Simple;
                                        break;
                                    case 2:
                                        simileMark = SimileMark.FirstOfDouble;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 'stop':
                                simileMark = null;
                                break;
                        }
                        if (element.attributes.has('number')) {
                            this._simileMarkPerStaff = this._simileMarkPerStaff ?? new Map();
                            const staff = Number.parseInt(element.attributes.get('number'), 10) - 1;
                            if (simileMark == null) {
                                this._simileMarkPerStaff.delete(staff);
                            }
                            else {
                                this._simileMarkPerStaff.set(staff, simileMark);
                            }
                        }
                        else {
                            this._simileMarkAllStaves = simileMark;
                        }
                    }
                    break;
                case 'slash':
                    switch (c.getAttribute('type')) {
                        case 'start':
                            this._isBeatSlash = true;
                            break;
                        case 'stop':
                            this._isBeatSlash = false;
                            break;
                    }
                    break;
            }
        }
    }
    parseTranspose(element, track) {
        let semitones = 0;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'chromatic':
                    semitones += Number.parseFloat(c.innerText);
                    break;
                case 'octave-change':
                    semitones += Number.parseFloat(c.innerText) * 12;
                    break;
            }
        }
        if (element.attributes.has('number')) {
            const staff = this.getOrCreateStaff(track, Number.parseInt(element.attributes.get('number'), 10) - 1);
            this.getStaffContext(staff).transpose = semitones;
            staff.displayTranspositionPitch = semitones;
        }
        else {
            for (const staff of track.staves) {
                this.getStaffContext(staff).transpose = semitones;
                staff.displayTranspositionPitch = semitones;
            }
        }
    }
    parseStaffDetails(element, staff) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'staff-lines':
                    staff.standardNotationLineCount = Number.parseInt(c.innerText, 10);
                    break;
                case 'staff-tuning':
                    this.parseStaffTuning(c, staff);
                    break;
                case 'capo':
                    staff.capo = Number.parseInt(c.innerText, 10);
                    break;
            }
        }
    }
    parseStaffTuning(element, staff) {
        if (staff.stringTuning.tunings.length === 0) {
            staff.showTablature = true;
            staff.showStandardNotation = false;
            staff.stringTuning.tunings = new Array(staff.standardNotationLineCount).fill(0);
        }
        const line = Number.parseInt(element.getAttribute('line'), 10);
        let tuningStep = 'C';
        let tuningOctave = '';
        let tuningAlter = 0;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'tuning-step':
                    tuningStep = c.innerText;
                    break;
                case 'tuning-alter':
                    tuningAlter = Number.parseFloat(c.innerText);
                    break;
                case 'tuning-octave':
                    tuningOctave = c.innerText;
                    break;
            }
        }
        const tuning = ModelUtils.getTuningForText(tuningStep + tuningOctave) + tuningAlter;
        staff.tuning[staff.tuning.length - line] = tuning;
    }
    parseClef(element, bar) {
        let sign = 's';
        let line = 0;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'sign':
                    sign = c.innerText.toLowerCase();
                    break;
                case 'line':
                    line = Number.parseInt(c.innerText, 10);
                    break;
                case 'clef-octave-change':
                    switch (Number.parseInt(c.innerText, 10)) {
                        case -2:
                            bar.clefOttava = Ottavia._15mb;
                            break;
                        case -1:
                            bar.clefOttava = Ottavia._8vb;
                            break;
                        case 1:
                            bar.clefOttava = Ottavia._8va;
                            break;
                        case 2:
                            bar.clefOttava = Ottavia._15mb;
                            break;
                    }
                    break;
            }
        }
        switch (sign) {
            case 'g':
                bar.clef = Clef.G2;
                break;
            case 'f':
                bar.clef = Clef.F4;
                break;
            case 'c':
                if (line === 3) {
                    bar.clef = Clef.C3;
                }
                else {
                    bar.clef = Clef.C4;
                }
                break;
            case 'percussion':
                bar.clef = Clef.Neutral;
                bar.staff.isPercussion = true;
                break;
            case 'tab':
                bar.clef = Clef.G2;
                bar.staff.showTablature = true;
                break;
            default:
                bar.clef = Clef.G2;
                break;
        }
    }
    parseTime(element, masterBar) {
        let beatsParsed = false;
        let beatTypeParsed = false;
        for (const c of element.childElements()) {
            const v = c.innerText;
            switch (c.localName) {
                case 'beats':
                    if (!beatsParsed) {
                        if (v.indexOf('+') === -1) {
                            masterBar.timeSignatureNumerator = Number.parseInt(v, 10);
                        }
                        else {
                            masterBar.timeSignatureNumerator = v
                                .split('+')
                                .map(v => Number.parseInt(v, 10))
                                .reduce((sum, v) => v + sum, 0);
                        }
                        beatsParsed = true;
                    }
                    break;
                case 'beat-type':
                    if (!beatTypeParsed) {
                        if (v.indexOf('+') === -1) {
                            masterBar.timeSignatureDenominator = Number.parseInt(v, 10);
                        }
                        else {
                            masterBar.timeSignatureDenominator = v
                                .split('+')
                                .map(v => Number.parseInt(v, 10))
                                .reduce((sum, v) => v + sum, 0);
                        }
                        beatTypeParsed = true;
                    }
                    break;
            }
        }
        switch (element.getAttribute('symbol', '')) {
            case 'common':
            case 'cut':
                masterBar.timeSignatureCommon = true;
                break;
        }
    }
    parseKey(element, masterBar, track) {
        let fifths = -KeySignature.C;
        let mode = '';
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'fifths':
                    fifths = Number.parseInt(c.innerText, 10);
                    break;
                case 'mode':
                    mode = c.innerText;
                    break;
            }
        }
        let keySignature;
        if (-7 <= fifths && fifths <= 7) {
            keySignature = fifths;
        }
        else {
            keySignature = KeySignature.C;
        }
        let keySignatureType;
        if (mode === 'minor') {
            keySignatureType = KeySignatureType.Minor;
        }
        else {
            keySignatureType = KeySignatureType.Major;
        }
        if (element.attributes.has('number')) {
            const staff = this.getOrCreateStaff(track, Number.parseInt(element.attributes.get('number'), 10) - 1);
            const bar = this.getOrCreateBar(staff, masterBar);
            bar.keySignature = keySignature;
            bar.keySignatureType = keySignatureType;
        }
        else {
            this._keyAllStaves = [keySignature, keySignatureType];
            for (const s of track.staves) {
                if (s.bars.length > masterBar.index) {
                    s.bars[masterBar.index].keySignature = keySignature;
                    s.bars[masterBar.index].keySignatureType = keySignatureType;
                }
            }
        }
    }
    parseDirection(element, masterBar, track) {
        const directionTypes = [];
        let offset = null;
        let staffIndex = -1;
        let tempo = -1;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'direction-type':
                    const type = c.firstElement;
                    if (type) {
                        directionTypes.push(type);
                    }
                    break;
                case 'offset':
                    offset = Number.parseFloat(c.innerText);
                    break;
                case 'voice':
                    break;
                case 'staff':
                    staffIndex = Number.parseInt(c.innerText, 10) - 1;
                    break;
                case 'sound':
                    if (c.attributes.has('tempo')) {
                        tempo = Number.parseFloat(c.attributes.get('tempo'));
                    }
                    break;
            }
        }
        let staff = null;
        if (staffIndex >= 0) {
            staff = this.getOrCreateStaff(track, staffIndex);
        }
        else if (this._lastBeat !== null) {
            staff = this._lastBeat.voice.bar.staff;
        }
        else {
            staff = this.getOrCreateStaff(track, 0);
        }
        const bar = staff ? this.getOrCreateBar(staff, masterBar) : null;
        const getRatioPosition = () => {
            let timelyPosition = this._musicalPosition;
            if (offset !== null) {
                timelyPosition += offset;
            }
            const totalDuration = masterBar.calculateDuration(false);
            return timelyPosition / totalDuration;
        };
        if (tempo > 0) {
            const tempoAutomation = new Automation();
            tempoAutomation.type = AutomationType.Tempo;
            tempoAutomation.value = tempo;
            tempoAutomation.ratioPosition = getRatioPosition();
            if (!this.hasSameTempo(masterBar, tempoAutomation)) {
                masterBar.tempoAutomations.push(tempoAutomation);
                if (masterBar.index === 0) {
                    masterBar.score.tempo = tempoAutomation.value;
                }
            }
        }
        let previousWords = '';
        for (const direction of directionTypes) {
            switch (direction.localName) {
                case 'rehearsal':
                    masterBar.section = new Section();
                    masterBar.section.marker = direction.innerText;
                    break;
                case 'segno':
                    masterBar.addDirection(Direction.TargetSegno);
                    break;
                case 'coda':
                    masterBar.addDirection(Direction.TargetCoda);
                    break;
                case 'words':
                    previousWords = direction.innerText;
                    break;
                case 'wedge':
                    switch (direction.getAttribute('type')) {
                        case 'crescendo':
                            this._nextBeatCrescendo = CrescendoType.Crescendo;
                            break;
                        case 'diminuendo':
                            this._nextBeatCrescendo = CrescendoType.Decrescendo;
                            break;
                        case 'stop':
                            this._nextBeatCrescendo = null;
                            break;
                    }
                    break;
                case 'dynamics':
                    const newDynamics = this.parseDynamics(direction);
                    if (newDynamics !== null) {
                        this._currentDynamics = newDynamics;
                    }
                    break;
                case 'dashes':
                    const type = direction.getAttribute('type', 'start');
                    switch (previousWords) {
                        case 'LetRing':
                            this._nextBeatLetRing = type === 'start' || type === 'continue';
                            break;
                        case 'P.M.':
                            this._nextBeatPalmMute = type === 'start' || type === 'continue';
                            break;
                    }
                    previousWords = '';
                    break;
                case 'pedal':
                    const pedal = this.parsePedal(direction);
                    if (pedal && bar) {
                        pedal.ratioPosition = getRatioPosition();
                        const canHaveUp = bar.sustainPedals.length > 0 &&
                            bar.sustainPedals[bar.sustainPedals.length - 1].pedalType !== SustainPedalMarkerType.Up;
                        if (pedal.pedalType !== SustainPedalMarkerType.Up || canHaveUp) {
                            bar.sustainPedals.push(pedal);
                        }
                    }
                    break;
                case 'metronome':
                    this.parseMetronome(direction, masterBar, getRatioPosition());
                    break;
                case 'octave-shift':
                    this._nextBeatOttavia = this.parseOctaveShift(direction);
                    break;
            }
        }
        if (previousWords) {
            this._nextBeatText = previousWords;
        }
    }
    parseOctaveShift(element) {
        const type = element.getAttribute('type');
        const size = Number.parseInt(element.getAttribute('size', '8'), 10);
        switch (size) {
            case 15:
                switch (type) {
                    case 'up':
                        return Ottavia._15mb;
                    case 'down':
                        return Ottavia._15ma;
                    case 'stop':
                        return Ottavia.Regular;
                    case 'continue':
                        return this._nextBeatOttavia;
                }
                break;
            case 8:
                switch (type) {
                    case 'up':
                        return Ottavia._8vb;
                    case 'down':
                        return Ottavia._8va;
                    case 'stop':
                        return Ottavia.Regular;
                    case 'continue':
                        return this._nextBeatOttavia;
                }
                break;
        }
        return null;
    }
    parseMetronome(element, masterBar, ratioPosition) {
        let unit = null;
        let perMinute = -1;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'beat-unit':
                    unit = this.parseBeatDuration(c);
                    break;
                case 'per-minute':
                    perMinute = Number.parseFloat(c.innerText);
                    break;
            }
        }
        if (unit !== null && perMinute > 0) {
            const tempoAutomation = new Automation();
            tempoAutomation.type = AutomationType.Tempo;
            tempoAutomation.value = (perMinute * (unit / 4)) | 0;
            tempoAutomation.ratioPosition = ratioPosition;
            if (!this.hasSameTempo(masterBar, tempoAutomation)) {
                masterBar.tempoAutomations.push(tempoAutomation);
                if (masterBar.index === 0) {
                    masterBar.score.tempo = tempoAutomation.value;
                }
            }
        }
    }
    hasSameTempo(masterBar, tempoAutomation) {
        for (const existing of masterBar.tempoAutomations) {
            if (tempoAutomation.ratioPosition === existing.ratioPosition && tempoAutomation.value === existing.value) {
                return true;
            }
        }
        return false;
    }
    parsePedal(element) {
        const marker = new SustainPedalMarker();
        switch (element.getAttribute('type')) {
            case 'start':
                marker.pedalType = SustainPedalMarkerType.Down;
                break;
            case 'stop':
                marker.pedalType = SustainPedalMarkerType.Up;
                break;
            case 'continue':
                marker.pedalType = SustainPedalMarkerType.Hold;
                break;
            default:
                return null;
        }
        return marker;
    }
    parseDynamics(element) {
        for (const c of element.childElements()) {
            const dynamicString = c.localName.toUpperCase();
            switch (dynamicString) {
                case 'PPP':
                case 'PP':
                case 'P':
                case 'MP':
                case 'MF':
                case 'F':
                case 'FF':
                case 'FFF':
                case 'PPPP':
                case 'PPPPP':
                case 'PPPPPP':
                case 'FFFF':
                case 'FFFFF':
                case 'FFFFFF':
                case 'SF':
                case 'SFP':
                case 'SFPP':
                case 'FP':
                case 'RF':
                case 'RFZ':
                case 'SFZ':
                case 'SFFZ':
                case 'FZ':
                case 'N':
                case 'PF':
                case 'SFZP':
                    return DynamicValue[dynamicString];
            }
        }
        return null;
    }
    parseForward(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'duration':
                    this._musicalPosition += this.musicXmlDivisionsToAlphaTabTicks(Number.parseFloat(c.innerText));
                    break;
            }
        }
    }
    parseBackup(element) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'duration':
                    const beat = this._lastBeat;
                    if (beat) {
                        let musicalPosition = this._musicalPosition;
                        musicalPosition -= this.musicXmlDivisionsToAlphaTabTicks(Number.parseFloat(c.innerText));
                        if (musicalPosition < 0) {
                            musicalPosition = 0;
                        }
                        this._musicalPosition = musicalPosition;
                    }
                    break;
            }
        }
    }
    getOrCreateStaff(track, staffIndex) {
        while (track.staves.length <= staffIndex) {
            const staff = new Staff();
            track.addStaff(staff);
            if (this._score.masterBars.length > 0) {
                this.getOrCreateBar(staff, this._score.masterBars[this._score.masterBars.length - 1]);
            }
        }
        return track.staves[staffIndex];
    }
    getOrCreateBar(staff, masterBar) {
        const voiceCount = staff.bars.length === 0 ? 1 : staff.bars[0].voices.length;
        while (staff.bars.length <= masterBar.index) {
            const newBar = new Bar();
            staff.addBar(newBar);
            if (newBar.previousBar) {
                newBar.clef = newBar.previousBar.clef;
                newBar.clefOttava = newBar.previousBar.clefOttava;
                newBar.keySignature = newBar.previousBar.keySignature;
                newBar.keySignatureType = newBar.previousBar.keySignatureType;
            }
            if (this._keyAllStaves != null) {
                newBar.keySignature = this._keyAllStaves[0];
                newBar.keySignatureType = this._keyAllStaves[1];
            }
            for (let i = 0; i < voiceCount; i++) {
                const voice = new Voice();
                newBar.addVoice(voice);
            }
        }
        return staff.bars[masterBar.index];
    }
    getOrCreateVoice(bar, voiceIndex) {
        let voicesCreated = false;
        while (bar.voices.length <= voiceIndex) {
            bar.addVoice(new Voice());
            voicesCreated = true;
        }
        if (voicesCreated) {
            for (const b of bar.staff.bars) {
                while (b.voices.length <= voiceIndex) {
                    b.addVoice(new Voice());
                }
            }
        }
        return bar.voices[voiceIndex];
    }
    parseNote(element, masterBar, track) {
        let beat = null;
        let graceType = GraceType.None;
        let graceDurationInDivisions = 0;
        let beamMode = null;
        let isChord = false;
        let staffIndex = 0;
        let voiceIndex = 0;
        let durationInTicks = -1;
        let beatDuration = null;
        let dots = 0;
        let tupletNumerator = -1;
        let tupletDenominator = -1;
        let note = null;
        let isPitched = false;
        let instrumentId = null;
        const noteIsVisible = element.getAttribute('print-object', 'yes') !== 'no';
        const ensureBeat = () => {
            if (beat !== null) {
                return;
            }
            if (isChord && !this._lastBeat) {
                Logger.warning('MusicXML', 'Malformed MusicXML, <chord /> cannot be set on the first note of a measure');
                isChord = false;
            }
            if (isChord && !note) {
                Logger.warning('MusicXML', 'Cannot mix <chord /> and <rest />');
                isChord = false;
            }
            const staff = this.getOrCreateStaff(track, staffIndex);
            if (isChord) {
                beat = this._lastBeat;
                beat.addNote(note);
                return;
            }
            const bar = this.getOrCreateBar(staff, masterBar);
            const voice = this.getOrCreateVoice(bar, voiceIndex);
            const actualMusicalPosition = voice.beats.length === 0 ? 0 : voice.beats[voice.beats.length - 1].displayEnd;
            let gap = this._musicalPosition - actualMusicalPosition;
            if (gap > 0) {
                if (this._lastBeat &&
                    this._lastBeat.beamingMode === BeatBeamingMode.ForceMergeWithNext &&
                    this._lastBeat.voice.bar.staff.index !== staffIndex &&
                    voice.beats.length > 0 &&
                    voice.beats[voice.beats.length - 1].beamingMode === BeatBeamingMode.ForceMergeWithNext) {
                    const preferredDuration = voice.beats[voice.beats.length - 1].duration;
                    while (gap > 0) {
                        const restGap = this.createRestForGap(gap, preferredDuration);
                        if (restGap !== null) {
                            this.insertBeatToVoice(restGap, voice);
                            gap -= restGap.playbackDuration;
                        }
                        else {
                            break;
                        }
                    }
                }
                if (gap > 0) {
                    const placeholder = new Beat();
                    placeholder.dynamics = this._currentDynamics;
                    placeholder.isEmpty = true;
                    placeholder.duration = Duration.TwoHundredFiftySixth;
                    placeholder.overrideDisplayDuration = gap;
                    placeholder.updateDurations();
                    this.insertBeatToVoice(placeholder, voice);
                }
            }
            else if (gap < 0) {
                Logger.error('MusicXML', 'Unsupported forward/backup detected. Cannot fill new beats into already filled area of voice');
            }
            if (durationInTicks < 0 && beatDuration !== null) {
                durationInTicks = MidiUtils.toTicks(beatDuration);
                if (dots > 0) {
                    durationInTicks = MidiUtils.applyDot(durationInTicks, dots === 2);
                }
            }
            const newBeat = new Beat();
            beat = newBeat;
            if (beamMode === null) {
                newBeat.beamingMode = this.getStaffContext(staff).isExplicitlyBeamed
                    ? BeatBeamingMode.ForceSplitToNext
                    : BeatBeamingMode.Auto;
            }
            else {
                newBeat.beamingMode = beamMode;
                this.getStaffContext(staff).isExplicitlyBeamed = true;
            }
            newBeat.isEmpty = false;
            newBeat.dynamics = this._currentDynamics;
            if (this._isBeatSlash) {
                newBeat.slashed = true;
            }
            const automations = this._nextBeatAutomations;
            this._nextBeatAutomations = null;
            if (automations !== null) {
                for (const automation of automations) {
                    newBeat.automations.push(automation);
                }
            }
            const chord = this._nextBeatChord;
            this._nextBeatChord = null;
            if (chord !== null) {
                newBeat.chordId = chord.uniqueId;
                if (!voice.bar.staff.hasChord(chord.uniqueId)) {
                    voice.bar.staff.addChord(newBeat.chordId, chord);
                }
            }
            const crescendo = this._nextBeatCrescendo;
            if (crescendo !== null) {
                newBeat.crescendo = crescendo;
            }
            const ottavia = this._nextBeatOttavia;
            if (ottavia !== null) {
                newBeat.ottava = ottavia;
            }
            newBeat.isLetRing = this._nextBeatLetRing;
            newBeat.isPalmMute = this._nextBeatPalmMute;
            if (this._nextBeatText) {
                newBeat.text = this._nextBeatText;
                this._nextBeatText = null;
            }
            if (note !== null) {
                newBeat.addNote(note);
            }
            this.insertBeatToVoice(newBeat, voice);
            if (note !== null) {
                note.isVisible = noteIsVisible;
                const trackInfo = this._indexToTrackInfo.get(track.index);
                if (instrumentId !== null) {
                    note.percussionArticulation = trackInfo.getOrCreateArticulation(instrumentId, note);
                }
                else if (!isPitched) {
                    note.percussionArticulation = trackInfo.getOrCreateArticulation('', note);
                }
            }
            if (graceType !== GraceType.None) {
                newBeat.graceType = graceType;
                this.applyBeatDurationFromTicks(newBeat, graceDurationInDivisions, null, false);
            }
            else {
                newBeat.tupletNumerator = tupletNumerator;
                newBeat.tupletDenominator = tupletDenominator;
                newBeat.dots = dots;
                this.applyBeatDurationFromTicks(newBeat, durationInTicks, beatDuration, true);
            }
            this._musicalPosition = newBeat.displayEnd;
            this._lastBeat = newBeat;
        };
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'grace':
                    const makeTime = Number.parseFloat(c.getAttribute('make-time', '-1'));
                    if (makeTime >= 0) {
                        graceDurationInDivisions = this.musicXmlDivisionsToAlphaTabTicks(makeTime);
                        graceType = GraceType.BeforeBeat;
                    }
                    else {
                        graceType = GraceType.OnBeat;
                    }
                    if (c.getAttribute('slash') === 'yes') {
                        graceType = GraceType.BeforeBeat;
                    }
                    break;
                case 'chord':
                    isChord = true;
                    break;
                case 'cue':
                    return;
                case 'pitch':
                    note = this.parsePitch(c);
                    isPitched = true;
                    break;
                case 'unpitched':
                    note = this.parseUnpitched(c, track);
                    break;
                case 'rest':
                    note = null;
                    if (beatDuration === null) {
                        beatDuration = Duration.Whole;
                    }
                    break;
                case 'duration':
                    durationInTicks = this.parseDuration(c);
                    break;
                case 'instrument':
                    instrumentId = c.getAttribute('id', '');
                    break;
                case 'voice':
                    voiceIndex = Number.parseInt(c.innerText, 10);
                    if (Number.isNaN(voiceIndex)) {
                        Logger.warning('MusicXML', 'Voices need to be specified as numbers');
                        voiceIndex = 0;
                    }
                    else {
                        voiceIndex = voiceIndex - 1;
                    }
                    break;
                case 'type':
                    beatDuration = this.parseBeatDuration(c);
                    break;
                case 'dot':
                    dots++;
                    break;
                case 'accidental':
                    if (note === null) {
                        Logger.warning('MusicXML', 'Malformed MusicXML, missing pitch or unpitched for note');
                    }
                    else {
                        this.parseAccidental(c, note);
                    }
                    break;
                case 'time-modification':
                    for (const tmc of c.childElements()) {
                        switch (tmc.localName) {
                            case 'actual-notes':
                                tupletNumerator = Number.parseInt(tmc.innerText, 10);
                                break;
                            case 'normal-notes':
                                tupletDenominator = Number.parseInt(tmc.innerText, 10);
                                break;
                        }
                    }
                    break;
                case 'stem':
                    break;
                case 'notehead':
                    if (note === null) {
                        Logger.warning('MusicXML', 'Malformed MusicXML, missing pitch or unpitched for note');
                    }
                    else {
                    }
                    break;
                case 'staff':
                    staffIndex = Number.parseInt(c.innerText, 10) - 1;
                    break;
                case 'beam':
                    if (c.getAttribute('number', '1') === '1') {
                        switch (c.innerText) {
                            case 'begin':
                                beamMode = BeatBeamingMode.ForceMergeWithNext;
                                break;
                            case 'continue':
                                beamMode = BeatBeamingMode.ForceMergeWithNext;
                                break;
                            case 'end':
                                beamMode = BeatBeamingMode.ForceSplitToNext;
                                break;
                        }
                    }
                    break;
                case 'notations':
                    ensureBeat();
                    this.parseNotations(c, note, beat);
                    break;
                case 'lyric':
                    ensureBeat();
                    this.parseLyric(c, beat, track);
                    break;
                case 'play':
                    this.parsePlay(c, note);
                    break;
            }
        }
        if (isPitched) {
            const staff = this.getOrCreateStaff(track, staffIndex);
            const transpose = this.getStaffContext(staff).transpose;
            if (transpose !== 0) {
                const value = note.octave * 12 + note.tone + transpose;
                note.octave = (value / 12) | 0;
                note.tone = value - note.octave * 12;
            }
        }
        ensureBeat();
    }
    parsePlay(element, note) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'mute':
                    if (note && c.innerText === 'palm') {
                        note.isPalmMute = true;
                    }
                    break;
                case 'semi-pitched':
                    break;
            }
        }
    }
    createRestForGap(gap, preferredDuration) {
        let preferredDurationTicks = MidiUtils.toTicks(preferredDuration);
        while (preferredDurationTicks > gap) {
            if (preferredDuration === Duration.TwoHundredFiftySixth) {
                return null;
            }
            preferredDuration = (preferredDuration * 2);
            preferredDurationTicks = MidiUtils.toTicks(preferredDuration);
        }
        const placeholder = new Beat();
        placeholder.dynamics = this._currentDynamics;
        placeholder.isEmpty = false;
        placeholder.duration = preferredDuration;
        placeholder.overrideDisplayDuration = preferredDurationTicks;
        placeholder.updateDurations();
        return placeholder;
    }
    insertBeatToVoice(newBeat, voice) {
        if (voice.beats.length > 0) {
            const lastBeat = voice.beats[voice.beats.length - 1];
            lastBeat.nextBeat = newBeat;
            newBeat.previousBeat = lastBeat;
            let previousNonGraceBeat = lastBeat;
            while (previousNonGraceBeat !== null) {
                if (previousNonGraceBeat.graceType === GraceType.None) {
                    break;
                }
                if (previousNonGraceBeat.index > 0) {
                    previousNonGraceBeat = previousNonGraceBeat.previousBeat;
                }
                else {
                    previousNonGraceBeat = null;
                }
            }
            if (previousNonGraceBeat !== null) {
                newBeat.displayStart = previousNonGraceBeat.displayEnd;
            }
        }
        voice.addBeat(newBeat);
    }
    musicXmlDivisionsToAlphaTabTicks(divisions) {
        return (divisions * MidiUtils.QuarterTime) / this._divisionsPerQuarterNote;
    }
    parseBeatDuration(element) {
        switch (element.innerText) {
            case '1024th':
                return Duration.TwoHundredFiftySixth;
            case '512th':
                return Duration.TwoHundredFiftySixth;
            case '256th':
                return Duration.TwoHundredFiftySixth;
            case '128th':
                return Duration.OneHundredTwentyEighth;
            case '64th':
                return Duration.SixtyFourth;
            case '32nd':
                return Duration.ThirtySecond;
            case '16th':
                return Duration.Sixteenth;
            case 'eighth':
                return Duration.Eighth;
            case 'quarter':
                return Duration.Quarter;
            case 'half':
                return Duration.Half;
            case 'whole':
                return Duration.Whole;
            case 'breve':
                return Duration.DoubleWhole;
            case 'long':
                return Duration.QuadrupleWhole;
        }
        return null;
    }
    applyBeatDurationFromTicks(newBeat, ticks, beatDuration, applyDisplayDuration) {
        if (!beatDuration) {
            for (let i = 0; i < MusicXmlImporter.allDurations.length; i++) {
                const dt = MusicXmlImporter.allDurationTicks[i];
                if (ticks >= dt) {
                    beatDuration = MusicXmlImporter.allDurations[i];
                }
                else {
                    break;
                }
            }
        }
        newBeat.duration = beatDuration ?? Duration.Sixteenth;
        if (applyDisplayDuration) {
            newBeat.overrideDisplayDuration = ticks;
        }
        newBeat.updateDurations();
    }
    parseLyric(element, beat, track) {
        const info = this._indexToTrackInfo.get(track.index);
        const index = info.getLyricLine(element.getAttribute('number', ''));
        if (beat.lyrics === null) {
            beat.lyrics = [];
        }
        while (beat.lyrics.length <= index) {
            beat.lyrics.push('');
        }
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'text':
                    if (beat.lyrics[index]) {
                        beat.lyrics[index] += ` ${c.innerText}`;
                    }
                    else {
                        beat.lyrics[index] = c.innerText;
                    }
                    break;
                case 'elision':
                    beat.lyrics[index] += c.innerText;
                    break;
            }
        }
    }
    parseNotations(element, note, beat) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'tied':
                    if (note) {
                        this.parseTied(c, note, beat.voice.bar.staff);
                    }
                    break;
                case 'slur':
                    if (note) {
                        this.parseSlur(c, note);
                    }
                    break;
                case 'glissando':
                    if (note) {
                        this.parseGlissando(c, note);
                    }
                    break;
                case 'slide':
                    if (note) {
                        this.parseSlide(c, note);
                    }
                    break;
                case 'ornaments':
                    if (note) {
                        this.parseOrnaments(c, note);
                    }
                    break;
                case 'technical':
                    this.parseTechnical(c, note, beat);
                    break;
                case 'articulations':
                    if (note) {
                        this.parseArticulations(c, note);
                    }
                    break;
                case 'dynamics':
                    const dynamics = this.parseDynamics(c);
                    if (dynamics !== null) {
                        beat.dynamics = dynamics;
                        this._currentDynamics = dynamics;
                    }
                    break;
                case 'fermata':
                    this.parseFermata(c, beat);
                    break;
                case 'arpeggiate':
                    this.parseArpeggiate(c, beat);
                    break;
            }
        }
    }
    getStaffContext(staff) {
        if (!this._staffToContext.has(staff)) {
            const context = new StaffContext();
            this._staffToContext.set(staff, context);
            return context;
        }
        return this._staffToContext.get(staff);
    }
    parseGlissando(element, note) {
        const type = element.getAttribute('type');
        const number = element.getAttribute('number', '1');
        const context = this.getStaffContext(note.beat.voice.bar.staff);
        switch (type) {
            case 'start':
                context.slideOrigins.set(number, note);
                break;
            case 'stop':
                if (context.slideOrigins.has(number)) {
                    const origin = context.slideOrigins.get(number);
                    origin.slideTarget = note;
                    note.slideOrigin = origin;
                    origin.slideOutType = SlideOutType.Shift;
                }
                break;
        }
    }
    parseSlur(element, note) {
        const slurNumber = element.getAttribute('number', '1');
        const context = this.getStaffContext(note.beat.voice.bar.staff);
        switch (element.getAttribute('type')) {
            case 'start':
                context.slurStarts.set(slurNumber, note);
                break;
            case 'stop':
                if (context.slurStarts.has(slurNumber)) {
                    note.isSlurDestination = true;
                    const slurStart = context.slurStarts.get(slurNumber);
                    slurStart.slurDestination = note;
                    note.slurOrigin = slurStart;
                    context.slurStarts.delete(slurNumber);
                }
                break;
        }
    }
    parseArpeggiate(element, beat) {
        const direction = element.getAttribute('direction', 'down');
        switch (direction) {
            case 'down':
                beat.brushType = BrushType.ArpeggioDown;
                break;
            case 'up':
                beat.brushType = BrushType.ArpeggioUp;
                break;
        }
    }
    parseFermata(element, beat) {
        let fermata;
        switch (element.innerText) {
            case 'normal':
                fermata = FermataType.Medium;
                break;
            case 'angled':
                fermata = FermataType.Short;
                break;
            case 'square':
                fermata = FermataType.Long;
                break;
            default:
                fermata = FermataType.Medium;
                break;
        }
        beat.fermata = new Fermata();
        beat.fermata.type = fermata;
    }
    parseArticulations(element, note) {
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'accent':
                    note.accentuated = AccentuationType.Normal;
                    break;
                case 'strong-accent':
                    note.accentuated = AccentuationType.Heavy;
                    break;
                case 'staccato':
                    note.isStaccato = true;
                    break;
                case 'tenuto':
                    note.accentuated = AccentuationType.Tenuto;
                    break;
            }
        }
    }
    parseTechnical(element, note, beat) {
        const bends = [];
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'up-bow':
                    beat.pickStroke = PickStroke.Up;
                    break;
                case 'down-bow':
                    beat.pickStroke = PickStroke.Down;
                    break;
                case 'harmonic':
                    break;
                case 'fingering':
                    if (note) {
                        note.leftHandFinger = this.parseFingering(c);
                    }
                    break;
                case 'pluck':
                    if (note) {
                        note.rightHandFinger = this.parseFingering(c);
                    }
                    break;
                case 'fret':
                    if (note) {
                        note.fret = Number.parseInt(c.innerText, 10);
                    }
                    break;
                case 'string':
                    if (note) {
                        note.string = beat.voice.bar.staff.tuning.length - Number.parseInt(c.innerText, 10) + 1;
                    }
                    break;
                case 'hammer-on':
                case 'pull-off':
                    if (note) {
                        note.isHammerPullOrigin = true;
                    }
                    break;
                case 'bend':
                    bends.push(c);
                    break;
                case 'tap':
                    beat.tap = true;
                    break;
                case 'smear':
                    if (note) {
                        note.vibrato = VibratoType.Slight;
                    }
                    break;
                case 'golpe':
                    switch (c.getAttribute('placement', 'above')) {
                        case 'above':
                            beat.golpe = GolpeType.Finger;
                            break;
                        case 'below':
                            beat.golpe = GolpeType.Thumb;
                            break;
                    }
                    break;
            }
        }
        if (note && bends.length > 0) {
            this.parseBends(bends, note);
        }
    }
    parseBends(elements, note) {
        const baseOffset = BendPoint.MaxPosition / elements.length;
        let currentValue = 0;
        let currentOffset = 0;
        let isFirstBend = true;
        for (const bend of elements) {
            const bendAlterElement = bend.findChildElement('bend-alter');
            if (bendAlterElement) {
                const absValue = Math.round(Math.abs(Number.parseFloat(bendAlterElement.innerText)) * 2);
                if (bend.findChildElement('pre-bend')) {
                    if (isFirstBend) {
                        currentValue += absValue;
                        note.addBendPoint(new BendPoint(currentOffset, currentValue));
                        currentOffset += baseOffset;
                        note.addBendPoint(new BendPoint(currentOffset, currentValue));
                        isFirstBend = false;
                    }
                    else {
                        currentOffset += baseOffset;
                    }
                }
                else if (bend.findChildElement('release')) {
                    if (isFirstBend) {
                        currentValue += absValue;
                    }
                    note.addBendPoint(new BendPoint(currentOffset, currentValue));
                    currentOffset += baseOffset;
                    currentValue -= absValue;
                    note.addBendPoint(new BendPoint(currentOffset, currentValue));
                    isFirstBend = false;
                }
                else {
                    note.addBendPoint(new BendPoint(currentOffset, currentValue));
                    currentValue += absValue;
                    currentOffset += baseOffset;
                    note.addBendPoint(new BendPoint(currentOffset, currentValue));
                    isFirstBend = false;
                }
            }
        }
    }
    parseFingering(c) {
        switch (c.innerText) {
            case '0':
                return Fingers.NoOrDead;
            case '1':
            case 'p':
            case 't':
                return Fingers.Thumb;
            case '2':
            case 'i':
                return Fingers.IndexFinger;
            case '3':
            case 'm':
                return Fingers.MiddleFinger;
            case '4':
            case 'a':
                return Fingers.AnnularFinger;
            case '5':
            case 'c':
                return Fingers.LittleFinger;
        }
        return Fingers.Unknown;
    }
    parseOrnaments(element, note) {
        let currentTrillStep = -1;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'trill-mark':
                    currentTrillStep = Number.parseInt(c.getAttribute('trill-step', '2'), 10);
                    if (note.isStringed) {
                        note.trillValue = note.stringTuning + currentTrillStep;
                    }
                    else if (!note.isPercussion) {
                        note.trillValue = note.calculateRealValue(false, false) + currentTrillStep;
                    }
                    break;
                case 'turn':
                    note.ornament = NoteOrnament.Turn;
                    break;
                case 'inverted-turn':
                    note.ornament = NoteOrnament.InvertedTurn;
                    break;
                case 'wavy-line':
                    if (currentTrillStep > 0) {
                        if (c.getAttribute('type') === 'start') {
                            this._currentTrillStep = currentTrillStep;
                        }
                    }
                    else if (this._currentTrillStep > 0) {
                        if (c.getAttribute('type') === 'stop') {
                            this._currentTrillStep = -1;
                        }
                        else if (note.isStringed) {
                            note.trillValue = note.stringTuning + this._currentTrillStep;
                        }
                        else if (!note.isPercussion) {
                            note.trillValue = note.calculateRealValue(false, false) + this._currentTrillStep;
                        }
                    }
                    else {
                        note.vibrato = VibratoType.Slight;
                    }
                    break;
                case 'mordent':
                    note.ornament = NoteOrnament.LowerMordent;
                    break;
                case 'inverted-mordent':
                    note.ornament = NoteOrnament.UpperMordent;
                    break;
                case 'tremolo':
                    switch (c.innerText) {
                        case '1':
                            note.beat.tremoloSpeed = Duration.Eighth;
                            break;
                        case '2':
                            note.beat.tremoloSpeed = Duration.Sixteenth;
                            break;
                        case '3':
                            note.beat.tremoloSpeed = Duration.ThirtySecond;
                            break;
                    }
                    break;
            }
        }
    }
    parseSlide(element, note) {
        const type = element.getAttribute('type');
        const number = element.getAttribute('number', '1');
        const context = this.getStaffContext(note.beat.voice.bar.staff);
        switch (type) {
            case 'start':
                context.slideOrigins.set(number, note);
                break;
            case 'stop':
                if (context.slideOrigins.has(number)) {
                    const origin = context.slideOrigins.get(number);
                    origin.slideTarget = note;
                    note.slideOrigin = origin;
                    origin.slideOutType = SlideOutType.Shift;
                }
                break;
        }
    }
    parseTied(element, note, staff) {
        const type = element.getAttribute('type');
        const number = element.getAttribute('number', '');
        const context = this.getStaffContext(staff);
        if (type === 'start') {
            if (number) {
                if (context.tieStartIds.has(number)) {
                    const unclosed = context.tieStartIds.get(number);
                    context.tieStarts.delete(unclosed);
                }
                context.tieStartIds.set(number, note);
            }
            context.tieStarts.add(note);
        }
        else if (type === 'stop' && !note.isTieDestination) {
            let tieOrigin = null;
            if (number) {
                if (!context.tieStartIds.has(number)) {
                    return;
                }
                tieOrigin = context.tieStartIds.get(number);
                context.tieStartIds.delete(number);
                context.tieStarts.delete(note);
            }
            else {
                const realValue = this.calculatePitchedNoteValue(note);
                for (const t of context.tieStarts) {
                    if (this.calculatePitchedNoteValue(t) === realValue) {
                        tieOrigin = t;
                        context.tieStarts.delete(tieOrigin);
                        break;
                    }
                }
            }
            if (!tieOrigin) {
                return;
            }
            note.isTieDestination = true;
            note.tieOrigin = tieOrigin;
        }
    }
    parseAccidental(element, note) {
        switch (element.innerText) {
            case 'sharp':
                note.accidentalMode = NoteAccidentalMode.ForceSharp;
                break;
            case 'natural':
                note.accidentalMode = NoteAccidentalMode.ForceNatural;
                break;
            case 'flat':
                note.accidentalMode = NoteAccidentalMode.ForceFlat;
                break;
            case 'double-sharp':
                note.accidentalMode = NoteAccidentalMode.ForceDoubleSharp;
                break;
            case 'flat-flat':
                note.accidentalMode = NoteAccidentalMode.ForceDoubleFlat;
                break;
        }
    }
    calculatePitchedNoteValue(note) {
        return note.octave * 12 + note.tone;
    }
    parseDuration(element) {
        return this.musicXmlDivisionsToAlphaTabTicks(Number.parseFloat(element.innerText));
    }
    parseUnpitched(element, _track) {
        let step = '';
        let octave = 0;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'display-step':
                    step = c.innerText;
                    break;
                case 'display-octave':
                    octave = Number.parseInt(c.innerText, 10) + 1;
                    break;
            }
        }
        const note = new Note();
        if (step === '') {
            note.octave = 0;
            note.tone = 0;
        }
        else {
            const value = octave * 12 + ModelUtils.getToneForText(step).noteValue;
            note.octave = (value / 12) | 0;
            note.tone = value - note.octave * 12;
        }
        return note;
    }
    parsePitch(element) {
        let step = '';
        let semitones = 0;
        let octave = 0;
        for (const c of element.childElements()) {
            switch (c.localName) {
                case 'step':
                    step = c.innerText;
                    break;
                case 'alter':
                    semitones = Number.parseFloat(c.innerText);
                    if (Number.isNaN(semitones)) {
                        semitones = 0;
                    }
                    break;
                case 'octave':
                    octave = Number.parseInt(c.innerText, 10) + 1;
                    break;
            }
        }
        semitones = semitones | 0;
        const value = octave * 12 + ModelUtils.getToneForText(step).noteValue + semitones;
        const note = new Note();
        note.octave = (value / 12) | 0;
        note.tone = value - note.octave * 12;
        return note;
    }
}
MusicXmlImporter.allDurations = [
    Duration.TwoHundredFiftySixth,
    Duration.OneHundredTwentyEighth,
    Duration.SixtyFourth,
    Duration.ThirtySecond,
    Duration.Sixteenth,
    Duration.Eighth,
    Duration.Quarter,
    Duration.Half,
    Duration.Whole,
    Duration.DoubleWhole,
    Duration.QuadrupleWhole
];
MusicXmlImporter.allDurationTicks = MusicXmlImporter.allDurations.map(d => MidiUtils.toTicks(d));
let pluckDiff = 23;
class MidiParser {
    constructor(arrayBuffer) {
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
        var pi = { basePitch: first, startMs: when, avgMs: -1, trackidx: trackIdx, channelidx: channel, baseDuration: -1, closed: false, bendPoints: [] };
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
        console.log('fillEventsTimeMs');
        let tickResolutionAt0 = this.midiheader.get0TickResolution();
        this.addResolutionPoint(-1, -1, tickResolutionAt0, 120, null);
        var format = this.midiheader.getFormat();
        console.log('format', format, 'tracks', this.midiheader.trackCount, this.parsedTracks.length);
        if (format == 1) {
            console.log('multi track');
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
                        this.addResolutionPoint(-1, playTime, tickResolution, cuevnt.tempo ? cuevnt.tempo : 12, cuevnt);
                    }
                }
                cuevnt = this.nextByAllTracksEvent();
            }
        }
        else {
            console.log('single track');
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
                            this.addResolutionPoint(-1, playTime, tickResolution, trevnt.tempo ? trevnt.tempo : 12, trevnt);
                        }
                    }
                }
            }
        }
    }
    parseNotes() {
        console.log('parseNotes');
        this.fillEventsTimeMs();
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
                                    singleParsedTrack.programChannel.push({
                                        program: evnt.param1 ? evnt.param1 : 0,
                                        channel: evnt.midiChannel ? evnt.midiChannel : 0
                                    });
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
                                                    console.log('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
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
                            track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0,
                            count: this.midiheader.meterCount, division: this.midiheader.meterDivision
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
        this.programChannel = [];
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
        console.log('MIDIFileHeader', (this.datas.getUint16(12) & 0x8000), this.datas.getUint16(12));
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
    constructor(filename, arrayBuffer) {
        let parser = new MidiParser(arrayBuffer);
        console.log(parser);
        let converter = new EventsConverter(parser);
        let project = converter.convertEvents(filename);
        console.log(project);
        parsedProject = project;
    }
}
class EventsConverter {
    constructor(parser) {
        this.parser = parser;
    }
    convertEvents(name) {
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
        let lastMs = allNotes[allNotes.length - 1].startMs;
        let barCount = 1 + Math.ceil(0.5 * lastMs / 1000);
        for (let ii = 0; ii < barCount; ii++) {
            project.timeline.push({
                tempo: 120,
                metre: {
                    count: 4,
                    part: 4
                }
            });
        }
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
        this.addComments(project);
        this.arrangeIcons(project);
        return project;
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
            if (allPercussions[ii].midiPitch < 35 || allPercussions[ii].midiPitch > 81) {
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
            let midiProgram = 0;
            for (let kk = 0; kk < parsedMIDItrack.programChannel.length; kk++) {
                if (parsedMIDItrack.programChannel[kk].channel == allTracks[ii].midiChan) {
                    midiProgram = parsedMIDItrack.programChannel[kk].program;
                }
            }
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
                    iconPosition: { x: (ii + 7) * wwCell, y: ii * hhCell * 0.8 },
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
    addComments(project) {
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
        this.addLyricsPoints(project.comments[0], { count: 0, part: 4 }, 'import from .mid');
    }
    addLyricsPoints(bar, skip, txt) {
        let cnt = bar.points.length;
        bar.points[cnt] = {
            skip: skip,
            text: txt,
            row: cnt
        };
    }
    findMeasureSkipByTime(time, measures) {
        let curTime = 0;
        let mm = MMUtil();
        for (let ii = 0; ii < measures.length; ii++) {
            let cumea = measures[ii];
            let measureDurationS = mm.set(cumea.metre).duration(cumea.tempo);
            if (curTime + measureDurationS > time) {
                let delta = time - curTime;
                if (delta < 0) {
                    delta = 0;
                }
                return { idx: ii, skip: mm.calculate(delta, cumea.tempo).strip(8) };
            }
            curTime = curTime + measureDurationS;
        }
        return null;
    }
    findVolumeDrum(midi) {
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
                let insidx = this.takeProTrackNo(allTracks, note.trackidx, note.channelidx, null);
                let instrack = tracks[insidx];
                let noteStartMs = note.startMs - barStart;
                let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).metre();
                let chord = this.takeChord(instrack.measures[ii], when);
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
                let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).metre();
                pertrack.measures[ii].skips.push(when);
                return;
            }
            barStart = barStart + durationMs;
        }
    }
    takeProTrackNo(allTracks, midiTrack, midiChannel, trackVolumePoints) {
        for (let ii = 0; ii < allTracks.length; ii++) {
            let it = allTracks[ii];
            if (it.midiTrack == midiTrack && it.midiChan == midiChannel) {
                return ii;
            }
        }
        let title = '';
        if (trackVolumePoints) {
            allTracks.push({ midiTrack: midiTrack, midiChan: midiChannel, title: title, trackVolumePoints: trackVolumePoints });
        }
        else {
            allTracks.push({ midiTrack: midiTrack, midiChan: midiChannel, title: title, trackVolumePoints: [] });
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
console.log('Alpha Tab Import *.mid v1.0.1');
let parsedProject = null;
class AlphaTabImportMusicPlugin {
    constructor() {
        this.callbackID = '';
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage({
            dialogID: this.callbackID,
            pluginData: parsedProject,
            done: false
        }, '*');
    }
    sendImportedMusicData() {
        console.log('sendImportedMusicData', parsedProject);
        if (parsedProject) {
            var oo = {
                dialogID: this.callbackID,
                pluginData: parsedProject,
                done: true
            };
            window.parent.postMessage(oo, '*');
        }
        else {
            alert('No parsed data');
        }
    }
    receiveHostMessage(par) {
        let message = par.data;
        if (this.callbackID) {
        }
        else {
            this.callbackID = message.hostData;
        }
    }
    loadMusicfile(inputFile) {
        let loader = new FileLoaderAlpha(inputFile);
        console.log('loadMusicfile', inputFile);
    }
}
class FileLoaderAlpha {
    constructor(inputFile) {
        this.inames = new ChordPitchPerformerUtil();
        var file = inputFile.files[0];
        var fileReader = new FileReader();
        let me = this;
        fileReader.onload = function (progressEvent) {
            if (progressEvent != null) {
                let title = file.name;
                let dat = '' + file.lastModifiedDate;
                try {
                    let last = file.lastModifiedDate;
                    dat = '' + last.getFullYear();
                    if (last.getMonth() < 10) {
                        dat = dat + '-' + last.getMonth();
                    }
                    else {
                        dat = dat + '-0' + last.getMonth();
                    }
                    if (last.getDate() < 10) {
                        dat = dat + '-' + last.getDate();
                    }
                    else {
                        dat = dat + '-0' + last.getDate();
                    }
                }
                catch (xx) {
                    console.log(xx);
                }
                let comment = ', ' + file.size / 1000 + 'kb, ' + dat;
                var arrayBuffer = progressEvent.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                let data = ByteBuffer.fromBuffer(uint8Array);
                let settings = new Settings();
                let path = inputFile.value;
                path = path.toLowerCase().trim();
                if (path.endsWith('.gp3') || path.endsWith('.gp4') || path.endsWith('.gp5')) {
                    let gp35 = new Gp3To5Importer();
                    settings.importer.encoding = 'windows-1251';
                    gp35.init(data, settings);
                    let score = gp35.readScore();
                    me.convertProject(score);
                }
                else {
                    if (path.endsWith('.gpx')) {
                        let gpx = new GpxImporter();
                        settings.importer.encoding = 'windows-1251';
                        gpx.init(data, settings);
                        let score = gpx.readScore();
                        me.convertProject(score);
                    }
                    else {
                        if (path.endsWith('.gp')) {
                            let gp78 = new Gp7To8Importer();
                            settings.importer.encoding = 'windows-1251';
                            gp78.init(data, settings);
                            let score = gp78.readScore();
                            me.convertProject(score);
                        }
                        else {
                            if (path.endsWith('.mxl') || path.endsWith('.musicxml')) {
                                let mxl = new MusicXmlImporter();
                                settings.importer.encoding = 'windows-1251';
                                mxl.init(data, settings);
                                let score = mxl.readScore();
                                me.convertProject(score);
                            }
                            else {
                                if (path.endsWith('.mid')) {
                                    let mireader = new MIDIReader(title, arrayBuffer);
                                }
                                else {
                                    console.log('wrong path', path);
                                }
                            }
                        }
                    }
                }
            }
        };
        fileReader.readAsArrayBuffer(file);
    }
    convertProject(score) {
        console.log(score);
        let project = {
            versionCode: '1',
            title: score.title,
            timeline: [],
            tracks: [],
            percussions: [],
            comments: [],
            filters: [],
            selectedPart: { startMeasure: -1, endMeasure: -1 },
            position: { x: 0, y: 0, z: 30 },
            list: false,
            menuPerformers: false, menuSamplers: false, menuFilters: false, menuActions: false, menuPlugins: false, menuClipboard: false, menuSettings: false
        };
        let tempo = 120;
        for (let bb = 0; bb < score.masterBars.length; bb++) {
            let maBar = score.masterBars[bb];
            if (maBar.tempoAutomation) {
                if (maBar.tempoAutomation.value > 0) {
                    tempo = maBar.tempoAutomation.value;
                }
            }
            let measure = {
                tempo: tempo,
                metre: {
                    count: maBar.timeSignatureNumerator,
                    part: maBar.timeSignatureDenominator
                }
            };
            project.timeline.push(measure);
        }
        let echoOutID = 'reverberation' + Math.random();
        let compresID = 'compression' + Math.random();
        for (let tt = 0; tt < score.tracks.length; tt++) {
            let scoreTrack = score.tracks[tt];
            let pp = false;
            for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
                if (scoreTrack.staves[ss].isPercussion) {
                    pp = true;
                }
            }
            if (pp) {
                this.addScoreDrumsTracks(project, scoreTrack, compresID);
            }
            else {
                this.addScoreInsTrack(project, scoreTrack, compresID);
            }
        }
        let filterEcho = {
            id: echoOutID, title: 'Echo',
            kind: 'miniumecho1', data: '22', outputs: [''],
            iconPosition: {
                x: 77 + project.tracks.length * 30,
                y: project.tracks.length * 8 + 2
            },
            automation: [], state: 0
        };
        let filterCompression = {
            id: compresID,
            title: 'Compressor',
            kind: 'miniumdcompressor1',
            data: '33',
            outputs: [echoOutID],
            iconPosition: {
                x: 88 + project.tracks.length * 30,
                y: project.tracks.length * 8 + 2
            },
            automation: [], state: 0
        };
        project.filters.push(filterEcho);
        project.filters.push(filterCompression);
        this.addLyrics(project, score);
        this.addRepeats(project, score);
        this.arrangeTracks(project);
        this.arrangeDrums(project);
        this.arrangeFilters(project);
        parsedProject = project;
        console.log(parsedProject);
    }
    addRepeats(project, score) {
        let startLoop = -1;
        let altStart = -1;
        let projIdx = 0;
        for (let ii = 0; ii < score.masterBars.length; ii++) {
            let scorebar = score.masterBars[ii];
            if (scorebar.isRepeatStart) {
                startLoop = ii;
                altStart = -1;
            }
            if (scorebar.alternateEndings) {
                altStart = ii;
            }
            if (scorebar.isRepeatEnd) {
                if (startLoop > -1) {
                    let diff = projIdx - ii;
                    projIdx = projIdx + this.cloneAndRepeat(project, startLoop + diff, altStart < 0 ? -1 : altStart + diff, ii + diff, scorebar.repeatCount);
                    startLoop = -1;
                    altStart = -1;
                }
            }
            projIdx++;
        }
    }
    cloneAndRepeat(project, start, altEnd, end, count) {
        console.log('repeat', start, altEnd, end, count);
        let insertPoint = end + 1;
        for (let cc = 0; cc < count - 1; cc++) {
            for (let mm = start; mm <= end; mm++) {
                if ((cc == count - 2) && (altEnd > -1) && (mm >= altEnd)) {
                }
                else {
                    this.cloneOneMeasure(project, mm, insertPoint);
                    insertPoint++;
                }
            }
        }
        return insertPoint - 1 - end;
    }
    cloneOneMeasure(project, from, to) {
        let clone = project.timeline[from];
        let oo = JSON.parse(JSON.stringify(clone));
        project.timeline.splice(to, 0, oo);
        for (let ii = 0; ii < project.tracks.length; ii++) {
            let clone = project.tracks[ii].measures[from];
            let oo = JSON.parse(JSON.stringify(clone));
            project.tracks[ii].measures.splice(to, 0, oo);
        }
        for (let ii = 0; ii < project.percussions.length; ii++) {
            let clone = project.percussions[ii].measures[from];
            let oo = JSON.parse(JSON.stringify(clone));
            project.percussions[ii].measures.splice(to, 0, oo);
        }
        for (let ii = 0; ii < project.filters.length; ii++) {
            let clone = project.filters[ii].automation[from];
            if (clone) {
                let oo = JSON.parse(JSON.stringify(clone));
                project.filters[ii].automation.splice(to, 0, oo);
            }
        }
        let clone2 = project.comments[from];
        let oo2 = JSON.parse(JSON.stringify(clone2));
        project.comments.splice(to, 0, oo2);
    }
    addLyrics(project, score) {
        for (let ii = 0; ii < project.timeline.length; ii++) {
            project.comments.push({ points: [] });
        }
        let firstBar = project.comments[0];
        this.addHeaderText(score.album, 'Album', firstBar);
        this.addHeaderText(score.artist, 'Artist', firstBar);
        this.addHeaderText(score.copyright, 'Copyright', firstBar);
        this.addHeaderText(score.instructions, 'Instructions', firstBar);
        this.addHeaderText(score.music, 'Music', firstBar);
        this.addHeaderText(score.notices, 'Notices', firstBar);
        this.addHeaderText(score.subTitle, 'Subtitle', firstBar);
        this.addHeaderText(score.tab, 'Tab', firstBar);
        this.addHeaderText(score.tempoLabel, 'Tempo', firstBar);
        this.addHeaderText(score.words, 'words', firstBar);
        for (let mm = 0; mm < score.masterBars.length; mm++) {
            let mbar = score.masterBars[mm];
            if (mbar.section) {
                this.addBarText(mbar.section.text, project, mm);
            }
        }
        for (let tt = 0; tt < score.tracks.length; tt++) {
            let cutrack = score.tracks[tt];
            for (let ss = 0; ss < cutrack.staves.length; ss++) {
                let custaff = cutrack.staves[ss];
                for (let bb = 0; bb < custaff.bars.length; bb++) {
                    let bar = custaff.bars[bb];
                    for (let vv = 0; vv < bar.voices.length; vv++) {
                        let vox = bar.voices[vv];
                        for (let rr = 0; rr < vox.beats.length; rr++) {
                            let beat = vox.beats[rr];
                            if (beat.text) {
                                this.addBarText(beat.text, project, bb);
                            }
                            if (beat.lyrics) {
                                if (beat.lyrics.length) {
                                    for (let ll = 0; ll < beat.lyrics.length; ll++) {
                                        this.addBarText(beat.lyrics[ll], project, bb);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    addBarText(text, project, barIdx) {
        let bar = project.comments[barIdx];
        if (text) {
            let row = bar.points.length;
            bar.points.push({ skip: { count: 0, part: 1 }, text: text, row: row });
        }
    }
    addHeaderText(text, label, firstBar) {
        if (text) {
            let row = firstBar.points.length;
            firstBar.points.push({ skip: { count: 0, part: 1 }, text: label + ': ' + text, row: row });
        }
    }
    arrangeTracks(project) {
        for (let ii = 0; ii < project.tracks.length; ii++) {
            project.tracks[ii].performer.iconPosition.x = (project.tracks.length - ii - 1) * 9;
            project.tracks[ii].performer.iconPosition.y = ii * 6;
        }
    }
    arrangeDrums(project) {
        for (let kk = 0; kk < project.percussions.length; kk++) {
            let ss = project.percussions[project.percussions.length - 1 - kk];
            ss.sampler.iconPosition.x = (project.percussions.length - 1 - kk) * 7 + (1 + project.tracks.length) * 9;
            ss.sampler.iconPosition.y = 8 * 12 + project.percussions.length * 2 - (1 + kk) * 7;
        }
    }
    arrangeFilters(project) {
        for (let ii = 0; ii < project.filters.length - 2; ii++) {
            project.filters[ii].iconPosition.x = ii * 7 + (1 + project.tracks.length) * 9 + (1 + project.percussions.length) * 7;
            project.filters[ii].iconPosition.y = ii * 7;
        }
        let cmp = project.filters[project.filters.length - 1];
        let eq = project.filters[project.filters.length - 2];
        cmp.iconPosition.x = project.filters.length * 7 + (1 + project.tracks.length) * 9 + (1 + project.percussions.length) * 7;
        cmp.iconPosition.y = 6 * 12;
        eq.iconPosition.x = cmp.iconPosition.x + 10;
        eq.iconPosition.y = 5 * 12;
    }
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
    addScoreInsTrack(project, scoreTrack, targetId) {
        let strummode = 0;
        if (scoreTrack.playbackInfo.program == 24
            || scoreTrack.playbackInfo.program == 25
            || scoreTrack.playbackInfo.program == 26
            || scoreTrack.playbackInfo.program == 27
            || scoreTrack.playbackInfo.program == 28
            || scoreTrack.playbackInfo.program == 29
            || scoreTrack.playbackInfo.program == 30) {
            strummode = 4;
        }
        let idxRatio = this.findVolumeInstrument(scoreTrack.playbackInfo.program);
        let iidx = idxRatio.idx;
        let imode = this.findModeInstrument(scoreTrack.playbackInfo.program);
        let volume = 1;
        let ivolume = Math.round(volume * 100) * idxRatio.ratio;
        let util = new ChordPitchPerformerUtil();
        let midiTitle = this.inames.tonechordinslist()[scoreTrack.playbackInfo.program];
        let mzxbxTrack = {
            title: scoreTrack.name + ': ' + midiTitle,
            measures: [],
            performer: {
                id: 'track' + scoreTrack.playbackInfo.program + Math.random(),
                data: '' + ivolume + '/' + iidx + '/' + strummode,
                kind: 'miniumpitchchord1',
                outputs: [targetId],
                iconPosition: { x: 0, y: 0 },
                state: 0
            }
        };
        let palmMuteTrack = {
            title: 'P.M.' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program],
            measures: [],
            performer: {
                id: 'track' + (scoreTrack.playbackInfo.program + Math.random()),
                data: '' + ivolume + '/' + iidx + '/0',
                kind: 'miniumpitchchord1',
                outputs: [targetId],
                iconPosition: { x: 0, y: 0 },
                state: 0
            }
        };
        let upTrack = {
            title: '^' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program],
            measures: [],
            performer: {
                id: 'track' + (scoreTrack.playbackInfo.program + Math.random()),
                data: '' + ivolume + '/' + iidx + '/2',
                kind: 'miniumpitchchord1',
                outputs: [targetId],
                iconPosition: { x: 0, y: 0 },
                state: 0
            }
        };
        let downTrack = {
            title: 'v' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program],
            measures: [],
            performer: {
                id: 'track' + (scoreTrack.playbackInfo.program + Math.random()),
                data: '' + ivolume + '/' + iidx + '/1',
                kind: 'miniumpitchchord1',
                outputs: [targetId],
                iconPosition: { x: 0, y: 0 },
                state: 0
            }
        };
        if (scoreTrack.playbackInfo.program == 29
            || scoreTrack.playbackInfo.program == 30) {
            mzxbxTrack.performer.data = '30/341';
            palmMuteTrack.performer.data = '29/323';
        }
        let pmFlag = false;
        let upFlag = false;
        let downFlag = false;
        project.tracks.push(mzxbxTrack);
        for (let mm = 0; mm < project.timeline.length; mm++) {
            let mzxbxMeasure = { chords: [] };
            let pmMeasure = { chords: [] };
            let upMeasure = { chords: [] };
            let downMeasure = { chords: [] };
            mzxbxTrack.measures.push(mzxbxMeasure);
            palmMuteTrack.measures.push(pmMeasure);
            upTrack.measures.push(upMeasure);
            downTrack.measures.push(downMeasure);
            for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
                let staff = scoreTrack.staves[ss];
                let tuning = staff.stringTuning.tunings;
                let bar = staff.bars[mm];
                for (let vv = 0; vv < bar.voices.length; vv++) {
                    let voice = bar.voices[vv];
                    let start = MMUtil();
                    for (let bb = 0; bb < voice.beats.length; bb++) {
                        let beat = voice.beats[bb];
                        if (beat.automations.length > 0) {
                        }
                        let beatDuration = this.beatDuration(beat);
                        let noteDuration = MMUtil().set(beatDuration).metre();
                        for (let nn = 0; nn < beat.notes.length; nn++) {
                            let note = beat.notes[nn];
                            if (note.isTieDestination) {
                            }
                            else {
                                if (note.slideOrigin) {
                                }
                                else {
                                    let pitch = this.stringFret2pitch(note.string, note.fret, tuning, note.octave, note.tone);
                                    if (note.tieDestination) {
                                        let tiedNote = note.tieDestination;
                                        while (tiedNote) {
                                            noteDuration = MMUtil().set(this.beatDuration(tiedNote.beat)).plus(noteDuration).metre();
                                            tiedNote = tiedNote.tieDestination;
                                        }
                                    }
                                    let slides = [{ duration: noteDuration, delta: 0 }];
                                    if (note.slideTarget) {
                                        let targetpitch = this.stringFret2pitch(note.slideTarget.string, note.slideTarget.fret, tuning, note.slideTarget.octave, note.slideTarget.tone);
                                        let targetDuration = this.beatDuration(note.slideTarget.beat).metre();
                                        slides = [{ duration: noteDuration, delta: targetpitch - pitch },
                                            { duration: targetDuration, delta: targetpitch - pitch }];
                                    }
                                    if (note.bendType) {
                                        if (note.bendPoints) {
                                            slides = [];
                                            let len = 0;
                                            let preOffset = 0;
                                            for (let bp = 0; bp < note.bendPoints.length; bp++) {
                                                let offset = note.bendPoints[bp].offset / 60;
                                                let value = note.bendPoints[bp].value / 4;
                                                len = offset - preOffset;
                                                preOffset = offset;
                                                slides.push({
                                                    duration: {
                                                        count: Math.round(1024 * noteDuration.count * len),
                                                        part: 1024 * noteDuration.part
                                                    },
                                                    delta: value
                                                });
                                            }
                                        }
                                    }
                                    if (note.isPalmMute) {
                                        let pmChord = this.takeChord(start, pmMeasure);
                                        pmChord.slides = slides;
                                        pmChord.pitches.push(pitch);
                                        pmFlag = true;
                                    }
                                    else {
                                        if (beat.brushType == 1) {
                                            let upchord = this.takeChord(start, upMeasure);
                                            upchord.slides = slides;
                                            upchord.pitches.push(pitch);
                                            upFlag = true;
                                        }
                                        else {
                                            if (beat.brushType == 2) {
                                                let downchord = this.takeChord(start, downMeasure);
                                                downchord.slides = slides;
                                                downchord.pitches.push(pitch);
                                                downFlag = true;
                                            }
                                            else {
                                                let chord = this.takeChord(start, mzxbxMeasure);
                                                chord.slides = slides;
                                                chord.pitches.push(pitch);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        start = start.plus(beatDuration);
                    }
                }
            }
        }
        if (pmFlag) {
            project.tracks.push(palmMuteTrack);
        }
        if (upFlag) {
            project.tracks.push(upTrack);
        }
        if (downFlag) {
            project.tracks.push(downTrack);
        }
    }
    beatDuration(beat) {
        let duration = MMUtil().set({ count: 1, part: beat.duration });
        if (beat.dots > 0) {
            duration = duration.plus({ count: duration.count, part: 2 * beat.duration });
        }
        if (beat.dots > 1) {
            duration = duration.plus({ count: duration.count, part: 4 * beat.duration });
        }
        if (beat.dots > 2) {
            duration = duration.plus({ count: duration.count, part: 8 * beat.duration });
        }
        if (beat.dots > 3) {
            duration = duration.plus({ count: duration.count, part: 16 * beat.duration });
        }
        if (beat.tupletDenominator > 0 && beat.tupletNumerator > 0) {
            duration.count = Math.round((beat.tupletDenominator / beat.tupletNumerator) * 1024 * (duration.count / duration.part));
            duration.part = 1024;
        }
        return duration.simplyfy();
    }
    stringFret2pitch(stringNum, fretNum, tuning, octave, tone) {
        if (stringNum > 0 && stringNum <= tuning.length) {
            return tuning[tuning.length - stringNum] + fretNum;
        }
        return 12 * octave + tone;
    }
    takeChord(start, measure) {
        let startBeat = MMUtil().set(start).strip(32);
        for (let cc = 0; cc < measure.chords.length; cc++) {
            if (startBeat.equals(measure.chords[cc].skip)) {
                return measure.chords[cc];
            }
        }
        let newChord = { pitches: [], slides: [], skip: { count: start.count, part: start.part } };
        measure.chords.push(newChord);
        return newChord;
    }
    addScoreDrumsTracks(project, scoreTrack, targetId) {
        console.log(scoreTrack);
        let trackDrums = [];
        for (let mm = 0; mm < project.timeline.length; mm++) {
            for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
                let staff = scoreTrack.staves[ss];
                let bar = staff.bars[mm];
                for (let vv = 0; vv < bar.voices.length; vv++) {
                    let voice = bar.voices[vv];
                    let start = MMUtil();
                    for (let bb = 0; bb < voice.beats.length; bb++) {
                        let beat = voice.beats[bb];
                        let currentDuration = this.beatDuration(beat);
                        for (let nn = 0; nn < beat.notes.length; nn++) {
                            let note = beat.notes[nn];
                            let drum = note.percussionArticulation;
                            if (drum > 34) {
                            }
                            else {
                                if (scoreTrack.percussionArticulations) {
                                    if (scoreTrack.percussionArticulations.length) {
                                        if (scoreTrack.percussionArticulations.length > drum && drum > -1) {
                                            let info = scoreTrack.percussionArticulations[drum];
                                            drum = info.outputMidiNumber;
                                        }
                                    }
                                }
                            }
                            let track = this.takeDrumTrack(scoreTrack.name, trackDrums, drum, targetId);
                            let measure = this.takeDrumMeasure(track, mm);
                            measure.skips.push(start.strip(32));
                        }
                        start = start.plus(currentDuration);
                    }
                }
            }
        }
        for (let mm = 0; mm < project.timeline.length; mm++) {
            for (let tt = 0; tt < trackDrums.length; tt++) {
                if (trackDrums[tt]) {
                    this.takeDrumMeasure(trackDrums[tt], mm);
                }
            }
        }
        for (let tt = 0; tt < trackDrums.length; tt++) {
            if (trackDrums[tt]) {
                project.percussions.push(trackDrums[tt]);
            }
        }
    }
    takeDrumMeasure(trackDrum, barNum) {
        if (trackDrum.measures[barNum]) {
        }
        else {
            let measure = {
                skips: []
            };
            trackDrum.measures[barNum] = measure;
        }
        return trackDrum.measures[barNum];
    }
    takeDrumTrack(title, trackDrums, drumNum, targetId) {
        if (trackDrums[drumNum]) {
        }
        else {
            let idx = firstDrumKeysArrayPercussionPaths(drumNum);
            let track = {
                title: title,
                measures: [],
                sampler: {
                    id: 'drum' + (drumNum + Math.random()),
                    data: '100/' + idx,
                    kind: 'miniumdrums1',
                    outputs: [targetId],
                    iconPosition: { x: 0, y: 0 },
                    state: 0
                }
            };
            if (idx) {
            }
            else {
                track.sampler.outputs = [];
            }
            trackDrums[drumNum] = track;
        }
        trackDrums[drumNum].title = title + ': ' + allPercussionDrumTitles()[drumNum];
        return trackDrums[drumNum];
    }
}
//# sourceMappingURL=aimportfile.js.map