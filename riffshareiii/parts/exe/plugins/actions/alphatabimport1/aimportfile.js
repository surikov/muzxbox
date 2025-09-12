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
}
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
console.log('Alpha Tab Import *.mid v1.0.1');
class AlphaTabImportMusicPlugin {
    constructor() {
        this.callbackID = '';
        this.parsedProject = null;
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage({
            dialogID: this.callbackID,
            pluginData: this.parsedProject,
            done: false
        }, '*');
    }
    sendImportedMusicData() {
        console.log('sendImportedMusicData', this.parsedProject);
        if (this.parsedProject) {
            var oo = {
                dialogID: this.callbackID,
                pluginData: this.parsedProject,
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
    }
}
class FileLoaderAlpha {
    constructor(inputFile) {
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
                    let scoreImporter = new Gp3To5Importer();
                    settings.importer.encoding = 'windows-1251';
                    scoreImporter.init(data, settings);
                    let score = scoreImporter.readScore();
                    console.log(score);
                }
                else {
                    console.log('wrong path', path);
                }
            }
        };
        fileReader.readAsArrayBuffer(file);
    }
}
console.log('test');
//# sourceMappingURL=aimportfile.js.map