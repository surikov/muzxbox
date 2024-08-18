class RightMenuPanel {
	menuCloseButton: IconLabelButton;
	menuUpButton: IconLabelButton;
	showState: boolean = true;
	lastWidth: number = 0;
	lastHeight: number = 0;

	backgroundRectangle: TileRectangle;
	listingShadow: TileRectangle;
	backgroundAnchor: TileAnchor;
	layerCurrentTitle: TileText;

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

	constructor() {
		//this.commands = commands;
	}
	resetAllAnchors() {

		commandDispatcher.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
		commandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
		commandDispatcher.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
		commandDispatcher.resetAnchor(this.menuPanelButtons, this.buttonsAnchor, LevelModes.overlay);
	}

	createMenu(): TileLayerDefinition[] {

		this.menuPanelBackground = (document.getElementById("menuPanelBackground") as any) as SVGElement;
		this.menuPanelContent = (document.getElementById("menuPanelContent") as any) as SVGElement;
		this.menuPanelInteraction = (document.getElementById("menuPanelInteraction") as any) as SVGElement;
		this.menuPanelButtons = (document.getElementById("menuPanelButtons") as any) as SVGElement;

		this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };

		this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'transparentScroll', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };

		this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
		this.menuCloseButton = new IconLabelButton([icon_moveright], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			this.showState = false;
			this.resizeMenu(this.lastWidth, this.lastHeight);
			this.resetAllAnchors();
		});
		this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			this.scrollY = 0;
			this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
		});
		this.layerCurrentTitle = { x: 2.5, y: 0, text:LO(localMenuTracksFolder),css: 'currentTitleLabel' };

		this.backgroundAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				this.layerCurrentTitle
				,this.listingShadow
				, this.backgroundRectangle
				 
			], id: 'rightMenuBackgroundAnchor'
		};
		this.contentAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//this.testContent
			], id: 'rightMenuContentAnchor'
		};
		this.interAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				this.dragHandler
			], id: 'rightMenuInteractionAnchor'
		};
		this.buttonsAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				this.menuCloseButton.anchor, this.menuUpButton.anchor
			]
		};
		this.bgLayer = { g: this.menuPanelBackground, anchors: [this.backgroundAnchor], mode: LevelModes.overlay };
		this.contentLayer = { g: this.menuPanelContent, anchors: [this.contentAnchor], mode: LevelModes.overlay };
		this.interLayer = { g: this.menuPanelInteraction, anchors: [this.interAnchor], mode: LevelModes.overlay };
		this.buttonsLayer = { g: this.menuPanelButtons, anchors: [this.buttonsAnchor], mode: LevelModes.overlay };

		return [this.bgLayer
			, this.interLayer
			, this.contentLayer
			, this.buttonsLayer
		];
	}
	scrollListing(dx: number, dy: number) {

		let yy = this.scrollY + dy / this.lastZ;

		let itemsH = 0;//1 * this.items.length;
		for (let ii = 0; ii < this.items.length - 1; ii++) {
			itemsH = itemsH + this.items[ii].calculateHeight();
		}

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

	fillMenuItems() {
		this.items = [];

		this.fillMenuItemChildren(0, composeBaseMenu());
	}
	setFocus(it: MenuInfo, infos: MenuInfo[]) {
		for (let ii = 0; ii < infos.length; ii++) {
			infos[ii].focused = false;
		}
		it.focused = true;
		this.rerenderMenuContent(null);

	}
	setOpenState(state: boolean, it: MenuInfo, infos: MenuInfo[]) {
		for (let ii = 0; ii < infos.length; ii++) {
			infos[ii].opened = false;
			infos[ii].focused = false;
		}
		it.focused = true;
		it.opened = state;
	}

	fillMenuItemChildren(pad: number, infos: MenuInfo[]): void {

		let me = this;
		for (let ii = 0; ii < infos.length; ii++) {
			let it = infos[ii];
			//let focused = (it.focused) ? true : false;
			let opened = (it.opened) ? true : false;
			let children = it.children;
			let itemLabel = '';
			if (it.noLocalization) {
				itemLabel = it.text;
			} else {
				itemLabel = LO(it.text);
			}
			if (children) {
				if (opened) {
					this.items.push(new RightMenuItem(it, pad).initOpenedFolderItem());
					this.fillMenuItemChildren(pad + 0.5, children);
				} else {
					let si: RightMenuItem = new RightMenuItem(it, pad, () => {
						//console.log('test', it.text, it.onOpen);
						if (it.onOpen) {
							it.onOpen();
						}
						me.setOpenState(true, it, infos);
						me.rerenderMenuContent(si);

					}).initClosedFolderItem();
					this.items.push(si);

				}
			} else {
				if (it.onSubClick) {
					let rightMenuItem = new RightMenuItem(it, pad, () => {
						if (it.onClick) {
							it.onClick();
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}, () => {
						if (it.itemStates) {
							let sel = it.selection ? it.selection : 0;
							if (it.itemStates.length - 1 > sel) {
								sel++;
							} else {
								sel = 0;
							}
							it.selection = sel;
						}
						if (it.onSubClick) {
							it.onSubClick();
						}

						me.rerenderMenuContent(rightMenuItem);
					});
					this.items.push(rightMenuItem.initActionItem2());
				} else {
					this.items.push(new RightMenuItem(it, pad, () => {
						if (it.onClick) {
							it.onClick();
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}).initActionItem());
				}


			}
		}
	}
	readCurrentSongData(project: Zvoog_Project) {

		menuPointTracks.children = [];
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let track = project.tracks[tt];
			let item: MenuInfo = {
				text: track.title
				, noLocalization: true
				, onClick: () => {

					commandDispatcher.moveTrackTop(tt);
				}
				, onSubClick: () => {

					let state = item.selection ? item.selection : 0;
					commandDispatcher.setTrackSoloState(state);
				}
				, itemStates: [icon_sound_low, icon_hide, icon_sound_loud]
				, selection: 0
			};

			menuPointTracks.children.push(item);
		}
		menuPointPercussion.children = [];
		for (let tt = 0; tt < project.percussions.length; tt++) {
			let drum = project.percussions[tt];
			let item: MenuInfo = {
				text: drum.title
				, noLocalization: true
				, onClick: () => {

					commandDispatcher.moveDrumTop(tt);
				}
				, onSubClick: () => {

					let state = item.selection ? item.selection : 0;
					commandDispatcher.setDrumSoloState(state);
				}
				, itemStates: [icon_sound_low, icon_hide, icon_sound_loud]
				, selection: 0
			};
			menuPointPercussion.children.push(item);
			//console.log('menu drum',item);
			//if(menuItemsData)menuItemsData.push(item);
			//menuPointPercussion.children.push(item);
		}
		menuPointAutomation.children = [];
		for (let ff = 0; ff < project.filters.length; ff++) {
			let filter = project.filters[ff];
			if (filter.automation) {
				let item: MenuInfo = {
					text: filter.automation.title
					, noLocalization: true
					, onClick: () => {

						commandDispatcher.moveAutomationTop(ff);
					}
					, onSubClick: () => {

						//let state = item.selection ? item.selection : 0;
						//commandDispatcher.setDrumSoloState(state);
					}
					, itemStates: [icon_sound_low, icon_hide, icon_sound_loud]
					, selection: 0
				};
				menuPointAutomation.children.push(item);
			}
		}

	}
	rerenderMenuContent(folder: RightMenuItem | null) {

		this.contentAnchor.content = [];
		this.fillMenuItems();

		let position: number = 0;
		for (let ii = 0; ii < this.items.length; ii++) {
			if (folder) {
				if (folder.info == this.items[ii].info) {

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

	}
	resizeMenu(viewWidth: number, viewHeight: number) {

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

		} else {
			//
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


		this.rerenderMenuContent(null);
	}

}
