class ToolBarButton {
    //anchor: TileAnchor;
    //bg: TileRectangle;
    //spot: TileRectangle;
    //label: TileText;
    stick: number;
    position: number;
    //labels: string[];
    //action: (selection: number) => void;
    //selection: number = 0;
    iconLabelButton: IconLabelButton;
    constructor(labels: string[], stick: number, position: number, action: (nn: number) => void) {
        this.iconLabelButton = new IconLabelButton(labels, 'toolBarButtonCircle', 'toolBarButtonLabel', action);
        //this.labels = labels;
        this.stick = stick;
        this.position = position;
        /*this.action = action;
        //this.labelText = labelText;
        this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'toolBarButtonCircle' };
        this.spot = {
            x: 0, y: 0, w: 1, h: 1, css: 'transparentSpot', activation: (x: number, y: number) => {
                this.selection++;
                if (this.selection > this.labels.length - 1) {
                    this.selection = 0;
                }
                this.label.text = this.labels[this.selection];
                this.action(this.selection);
            }
        };
        this.label = {
            x: 0, y: 0, text: this.labels[this.selection]//this.labelText
            , css: 'toolBarButtonLabel'
            //,css:'step fi-arrows-compress size-14'
        }
        this.anchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.bg
                , this.label
                , this.spot
            ]
        };*/
    }
    resize(viewWIdth: number, viewHeight: number) {
        let x0 = viewWIdth / 2 - 0.5 + this.position;
        if (this.stick > 0) {
            x0 = viewWIdth - 1 - this.position;
        } else {
            if (this.stick < 0) {
                x0 = 0 + this.position;
            }
        }
        /*this.bg.x = x0 + 0.1;
        this.bg.y = viewHeight - 0.9;
        this.bg.w = 0.8;
        this.bg.h = 0.8;
        this.label.x = x0 + 0.5;
        this.label.y = viewHeight - 0.31;
        this.spot.x = x0;
        this.spot.y = viewHeight - 1;
        */
        this.iconLabelButton.resize(x0, viewHeight - 1, 1);
    }
    //icon(labelText:string){
    //this.labelText = labelText;
    //	this.label.text=labelText;
    //}
}

