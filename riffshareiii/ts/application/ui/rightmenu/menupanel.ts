class RightMenuPanel {
    menuCloseButton: IconLabelButton;
    menuUpButton: IconLabelButton;
    showState: boolean = false;
    lastWidth: number = 0;
    lastHeight: number = 0;

    backgroundRectangle: TileRectangle;
    listingShadow: TileRectangle;
    backgroundAnchor: TileAnchor;

    menuPanelBackground: SVGElement;
    menuPanelContent: SVGElement;
    menuPanelInteraction: SVGElement;
    menuPanelButtons: SVGElement;

    bgLayer: TileLayerDefinition;
    contentLayer: TileLayerDefinition;
    interLayer: TileLayerDefinition;
    buttonsLayer: TileLayerDefinition;

    interAnchor: TileAnchor;
    buttonsAnchor: TileAnchor;
    dragHandler: TileRectangle;

    contentAnchor: TileAnchor;
    //testContent: TileRectangle;
    items: RightMenuItem[] = [];

    scrollY: number = 0;
    shiftX: number = 0;
    lastZ: number = 1;

    itemsWidth: number = 0;
    //changeTapSIze: (ratio: number) => void;

    //resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void;
    //commands: CommandDispatcher;
    constructor() {
        //this.commands = commands;
    }
    resetAllAnchors() {

        commandDispatcher.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
        commandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
        commandDispatcher.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
        commandDispatcher.resetAnchor(this.menuPanelButtons, this.buttonsAnchor, LevelModes.overlay);
    }

    createMenu( //resetAnchor: (
       // parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void
        //, changeTapSIze: (ratio: number) => void
    ): TileLayerDefinition[] {
        //console.log('createMenu');

        //this.resetAnchor = resetAnchor;
        //this.changeTapSIze = changeTapSIze;

        this.menuPanelBackground = (document.getElementById("menuPanelBackground") as any) as SVGElement;
        this.menuPanelContent = (document.getElementById("menuPanelContent") as any) as SVGElement;
        this.menuPanelInteraction = (document.getElementById("menuPanelInteraction") as any) as SVGElement;
        this.menuPanelButtons = (document.getElementById("menuPanelButtons") as any) as SVGElement;

        this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };

        //this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'debug', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };
        this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'transparentScroll', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };

        this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.menuCloseButton = new IconLabelButton([icon_moveright], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
            console.log('menuCloseButton', nn);
            this.showState = false;
            this.resizeMenu(data,this.lastWidth, this.lastHeight);
            this.resetAllAnchors();
        });
        this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
            console.log('up', nn);
            this.scrollY = 0;
            this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        });
        /*this.menuUpButton = new ToolBarButton([icon_moveright], 1, 11, (nn: number) => {
            console.log('menuCloseButton', nn);
            this.showState = false;
            this.resizeMenu(this.lastWidth, this.lastHeight);
            this.resetAllAnchors();
        });*/
        this.backgroundAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111
            , showZoom: zoomPrefixLevelsCSS[0].zoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].zoom
            , content: [
                this.listingShadow
                , this.backgroundRectangle

            ], id: 'rightMenuBackgroundAnchor'
        };
        this.contentAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111
            , showZoom: zoomPrefixLevelsCSS[0].zoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].zoom
            , content: [
                //this.testContent
            ], id: 'rightMenuContentAnchor'
        };
        this.interAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0
            , showZoom: zoomPrefixLevelsCSS[0].zoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].zoom
            , content: [
                this.dragHandler
            ], id: 'rightMenuInteractionAnchor'
        };
        this.buttonsAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0
            , showZoom: zoomPrefixLevelsCSS[0].zoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].zoom
            , content: [
                this.menuCloseButton.anchor, this.menuUpButton.anchor
            ]
        };
        this.bgLayer = { g: this.menuPanelBackground, anchors: [this.backgroundAnchor], mode: LevelModes.overlay };
        this.contentLayer = { g: this.menuPanelContent, anchors: [this.contentAnchor], mode: LevelModes.overlay };
        this.interLayer = { g: this.menuPanelInteraction, anchors: [this.interAnchor], mode: LevelModes.overlay };
        this.buttonsLayer = { g: this.menuPanelButtons, anchors: [this.buttonsAnchor], mode: LevelModes.overlay };
        //console.log(this.buttonsLayer);
        return [this.bgLayer
            , this.interLayer
            , this.contentLayer
            , this.buttonsLayer
        ];
    }
    scrollListing(dx: number, dy: number) {
        //console.log('scrollListing', dx, dy,this.lastZ);
        let yy = this.scrollY + dy / this.lastZ;

        let itemsH = 0;//1 * this.items.length;
        for (let ii = 0; ii < this.items.length - 1; ii++) {
            itemsH = itemsH + this.items[ii].calculateHeight();
        }

        //if (yy < -0.5 + this.lastHeight - itemsH) yy = -0.5 + this.lastHeight - itemsH;

        if (yy < -itemsH) {
            yy = -itemsH;
        }
        if (yy > 0) {
            yy = 0;
        }

        this.scrollY = yy;
        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        commandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
    }
    randomString(nn: number) {
        let words: string[] = ['red', 'green', 'blue', 'purple', 'black', 'white', 'yellow', 'grey', 'orange', 'cyan', 'magenta', 'silver', 'olive'];
        let ss = words[Math.floor(Math.random() * (words.length - 1))];
        ss = ss[0].toUpperCase() + ss.substring(1);
        for (let ii = 1; ii < nn; ii++) {
            ss = ss + ' ' + words[Math.floor(Math.random() * (words.length - 1))];
        }
        return ss;
    }
    fillMenuItems(data: MZXBX_Project) {//viewWIdth: number, viewHeight: number) {
        this.items = [];
        /*
        for (let ii = 0; ii < 19; ii++) {
            let rr = this.randomString(3);
            let it: RightMenuItem = new RightMenuItem().initActionItem(0,rr, () => {
                console.log("tap " + ii);
            });
            this.items.push(it);
        }
        this.items[3].initDraggableItem(0);
        this.items[4].initPreviewItem(0);
        this.items[12].initPreviewItem(0);
        this.items[16].initPreviewItem(0);
        this.items[2].initClosedFolderItem(0,'closed');
        this.items[7].initOpenedFolderItem(0);
        for (let ii = 8; ii < this.items.length; ii++) {
            this.items[ii].pad=0.5;
        }
*/
        this.fillMenuItemChildren(data,0, testMenuData);
    }
    setFocus(it: MenuInfo, infos: MenuInfo[]) {
        for (let ii = 0; ii < infos.length; ii++) {
            infos[ii].focused = false;
        }
        it.focused = true;
    }
    setOpenState(state: boolean, it: MenuInfo, infos: MenuInfo[]) {
        for (let ii = 0; ii < infos.length; ii++) {
            infos[ii].opened = false;
            infos[ii].focused = false;
        }
        it.focused = true;
        it.opened = state;
    }
    fillMenuItemChildren(data: MZXBX_Project,pad: number, infos: MenuInfo[]): void {
        let me = this;
        for (let ii = 0; ii < infos.length; ii++) {
            let it = infos[ii];
            let focused = (it.focused) ? true : false;
            let opened = (it.opened) ? true : false;
            let children = it.children;
            if (children) {
                if (opened) {
                    this.items.push(new RightMenuItem(it).initOpenedFolderItem(pad, focused, it.text, () => {
                        console.log("close " + ii);
                        me.setOpenState(false, it, infos);
                        me.rerenderContent(data,null);
                    }));
                    this.fillMenuItemChildren(data,pad + 0.5, children);
                } else {
                    let si: RightMenuItem = new RightMenuItem(it);
                    let order = this.items.length;
                    this.items.push(si.initClosedFolderItem(pad, focused, it.text, () => {
                        console.log("open " + ii);
                        me.setOpenState(true, it, infos);
                        me.rerenderContent(data,si);
                    }));
                }
            } else {
                switch (it.sid) {
                    case commandThemeSizeSmall: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(1, 'theme/sizesmall.css');
                        }));
                        break;
                    }
                    case commandThemeSizeBig: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(1.5, 'theme/sizebig.css');
                        }));
                        break;
                    }
                    case commandThemeSizeHuge: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(4, 'theme/sizehuge.css');
                        }));
                        break;
                    }
                    case commandThemeColorRed: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor(data,'theme/colordarkred.css');
                        }));
                        break;
                    }
                    case commandThemeColorGreen: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor(data,'theme/colordarkgreen.css');
                        }));
                        break;
                    }
                    case commandThemeColorBlue: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor(data,'theme/colordarkblue.css');
                        }));
                        break;
                    }
                    case commandLocaleRU: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale(data,'ru',1);
                        }));
                        break;
                    }
                    case commandLocaleEN: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale(data,'en',1);
                        }));
                        break;
                    }
                    case commandLocaleZH: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale(data,'zh',1.5);
                        }));
                        break;
                    }
                    case commandImportFromMIDI: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            console.log('import');
                            commandDispatcher.promptImportFromMIDI();
                        }));
                        break;
                    }
                    default: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            console.log("tap " + ii);
                            me.setFocus(it, infos);
                            
                        }));
                        break;
                    }
                }


            }
        }
    }
    setThemeLocale(data: MZXBX_Project,loc: string,ratio:number) {
        console.log("setThemeLocale " + loc);
        setLocaleID(loc,ratio);
        if(loc=='zh'){
            startLoadCSSfile('theme/font2big.css');
        }else{
            startLoadCSSfile('theme/font1small.css');
        }
        this.resizeMenu(data,this.lastWidth, this.lastHeight);
        this.resetAllAnchors();
    }
    setThemeColor(data: MZXBX_Project,cssPath: string) {
        console.log("cssPath " + cssPath);
        startLoadCSSfile(cssPath);
        this.resizeMenu(data,this.lastWidth, this.lastHeight);
        this.resetAllAnchors();
    }
    setThemeSize(ratio: number, cssPath: string) {
        console.log("cssPath " + cssPath);
        startLoadCSSfile(cssPath);
        commandDispatcher.changeTapSize(ratio);
    }
    rerenderContent(data: MZXBX_Project,folder: RightMenuItem | null) {
        /*if (folder == null) {
            //
        } else {
            console.log('rerenderContent', folder.top, folder.info, this.scrollY);
        }*/
        this.contentAnchor.content = [];
        this.fillMenuItems(data);

        let position: number = 0;
        for (let ii = 0; ii < this.items.length; ii++) {
            if (folder) {
                if (folder.info == this.items[ii].info) {
                    //console.log('scroll', folder.top, 'to', position, ':', this.scrollY);
                    if (-position > this.scrollY) {
                        this.scrollY = -position + 0.5;
                        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
                    }
                }
            }
            let tile = this.items[ii].buildTile(position, this.itemsWidth);
            this.contentAnchor.content.push(tile);
            position = position + this.items[ii].calculateHeight();
        }

        commandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
        //this.scrollListing(0,this.scrollY);
    }
    resizeMenu(viewWidth: number, viewHeight: number) {
        //console.log('resizeMenu', viewWidth, viewHeight, this.showState);
        this.lastWidth = viewWidth;
        this.lastHeight = viewHeight;
        this.itemsWidth = viewWidth - 1;
        if (this.itemsWidth > 9) this.itemsWidth = 9;
        if (this.itemsWidth < 2) {
            this.itemsWidth = 2;
        }
        this.shiftX = viewWidth - this.itemsWidth;
        if (!this.showState) {
            this.shiftX = viewWidth + 1;
            //this.menuCloseButton.position = -11;
        } else {
            //this.menuCloseButton.position = 0;
        }

        let shn = 0.05;

        this.listingShadow.x = this.shiftX - shn;
        this.listingShadow.y = -shn;
        this.listingShadow.w = this.itemsWidth + shn + shn;
        this.listingShadow.h = viewHeight + shn + shn;

        this.backgroundRectangle.x = this.shiftX;
        this.backgroundRectangle.y = 0;
        this.backgroundRectangle.w = this.itemsWidth;
        this.backgroundRectangle.h = viewHeight;

        this.backgroundAnchor.xx = 0;
        this.backgroundAnchor.yy = 0;
        this.backgroundAnchor.ww = viewWidth;
        this.backgroundAnchor.hh = viewHeight;


        this.dragHandler.x = this.shiftX;
        this.dragHandler.y = 0;
        this.dragHandler.w = this.itemsWidth;
        this.dragHandler.h = viewHeight;


        this.interAnchor.xx = 0;
        this.interAnchor.yy = 0;
        this.interAnchor.ww = viewWidth;
        this.interAnchor.hh = viewHeight;

        this.buttonsAnchor.xx = 0;
        this.buttonsAnchor.yy = 0;
        this.buttonsAnchor.ww = viewWidth;
        this.buttonsAnchor.hh = viewHeight;

        this.contentAnchor.xx = 0;
        this.contentAnchor.yy = 0;
        this.contentAnchor.ww = viewWidth;
        this.contentAnchor.hh = viewHeight;

        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };

        this.menuCloseButton.resize(this.shiftX + this.itemsWidth - 1, viewHeight - 1, 1);
        this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);

        //console.log(this.dragHandler);
        this.rerenderContent(data,null);
    }

}
