type ZUIModeValue = {
    mode: string
    , txt: string
    , id: string
}
class ZUserSetting {
    mode: string = "";
    texts: ZUIModeValue[] = [];
    constructor() {
        this.fillModeValues();
    }
    fillModeValues() {
        this.texts.push({ mode: 'ru', id: 'testText', txt: 'rutest' });
        this.texts.push({ mode: 'en', id: 'testText', txt: 'entest' });
    }
    selectMode(mode: string) {
        this.mode = mode;
    }
    txt(id: string): string {
        for (var i = 0; i < this.texts.length; i++) {
            if (this.texts[i].mode == this.mode && this.texts[i].id == id) {
                return this.texts[i].txt
            }
        }
        return this.mode + "?" + id;
    }
}
