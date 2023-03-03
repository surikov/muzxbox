"use strict";
class PublicWAFPerformerPlayer {
    setup(context) {
        return true;
    }
    send(when, volume, pitch, slides) {
    }
    cancel() {
    }
}
class PerformerPluginWAF {
    reset(context, parameters) {
        if (this.player) {
        }
        else {
            if (window['PublicDefaultBaseOscillatorPlayer']) {
            }
            else {
                window['DefaultPublicWAFPerformerPlayer'] = new PublicWAFPerformerPlayer();
                window['DefaultPublicWAFPerformerPlayer'].setup(context);
            }
            this.player = window['DefaultPublicWAFPerformerPlayer'];
        }
        return true;
    }
    schedule(when, volume, pitch, slides) {
        this.player.send(when, volume, pitch, slides);
    }
    output() {
        return this.out;
    }
    cancel() {
        this.player.cancel();
    }
}
function testPluginWAF() {
    return new PerformerPluginWAF();
}
//# sourceMappingURL=testwaf.js.map