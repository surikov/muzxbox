"use strict";
class TimeSignatureEvent {
    constructor(numerator, denominator, midiclockspertick, notespermidiclock) {
        this.name = 'TimeSignatureEvent';
        this.type = 0x58;
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, this.type, [0x04], Utils.numberToBytes(numerator, 1), Utils.numberToBytes(Math.log2(denominator), 1), Utils.numberToBytes(midiclockspertick || 24, 1), Utils.numberToBytes(notespermidiclock || 8, 1));
    }
}
