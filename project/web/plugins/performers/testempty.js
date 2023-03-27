"use strict";
class EmptyPerformer {
    launch(context, parameters) {
        if (this.out) {
        }
        else {
            this.out = context.createGain();
        }
    }
    busy() {
        return null;
    }
    schedule(when, pitch, slides) {
    }
    output() {
        return this.out;
    }
    cancel() {
    }
}
function testCreateEmpty() {
    return new EmptyPerformer();
}
//# sourceMappingURL=testempty.js.map