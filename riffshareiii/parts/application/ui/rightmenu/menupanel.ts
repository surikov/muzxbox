class RightMenuPanel {
	menuUpButton: IconLabelButton;
	menuToggleButton: IconLabelButton;
	
	lastWidth: number = 0;
	lastHeight: number = 0;

	backgroundRectangle: TileRectangle;
	listingShadow: TileRectangle;
	backgroundAnchor: TileAnchor;
	
	dragItemX = 0;
	dragItemY = 0;
	dragAnchor: TileAnchor;

	//dropFocusAnchor: TileAnchor;
	
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

	//dropFocusHandler: TileRectangle;

	contentAnchor: TileAnchor;
	
	items: RightMenuItem[] = [];

	scrollY: number = 0;
	shiftX: number = 0;
	lastZ: number = 1;

	itemsWidth: number = 0;

	constructor() {
		//
	}
	resetAllAnchors() {

		globalCommandDispatcher.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
		globalCommandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
		globalCommandDispatcher.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
		globalCommandDispatcher.resetAnchor(this.menuPanelButtons, this.buttonsAnchor, LevelModes.overlay);
	}






	showDragMenuItem(dx: number, dy: number, dragContent: TileItem) {
		this.dragAnchor.content = [dragContent];
		let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
		this.dragItemX = dx / zz;
		this.dragItemY = dy / zz;
		this.dragAnchor.translation = { x: this.dragItemX, y: this.dragItemY };
		this.dragAnchor.css = 'dragDropMixerItem';
		globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
	}
	moveDragMenuItem(dx: number, dy: number): TilePoint {
		let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
		this.dragItemX = this.dragItemX + dx / zz;
		this.dragItemY = this.dragItemY + dy / zz;
		this.dragAnchor.translation = { x: this.dragItemX, y: this.dragItemY };
		this.dragAnchor.css = 'dragDropMixerItem';
		globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
		return { x: dx, y: dy };
	}
	hideDragMenuItem(): TilePoint {
		let tap = globalCommandDispatcher.renderer.tiler.tapPxSize();
		let point: TilePoint = globalCommandDispatcher.renderer.tiler.screen2view({
			x: this.dragItemX * tap
			, y: this.dragItemY * tap
		});

		let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let left = point.x - start;
		let top = point.y - globalCommandDispatcher.cfg().gridTop();
		
		this.dragAnchor.css = 'noDragDropMixerItem';
		globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
		return { x: left, y: top };
	}





	createMenu(): TileLayerDefinition[] {

		this.menuPanelBackground = (document.getElementById("menuPanelBackground") as any) as SVGElement;
		this.menuPanelContent = (document.getElementById("menuPanelContent") as any) as SVGElement;
		this.menuPanelInteraction = (document.getElementById("menuPanelInteraction") as any) as SVGElement;
		this.menuPanelButtons = (document.getElementById("menuPanelButtons") as any) as SVGElement;

		this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };

		//this.rectangleDragItem = { x: 0, y: 0, w: 1, h: 1, rx: 0.25, ry: 0.25, css: 'rectangleDragItem' };

		this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'transparentScroll', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };

		//this.dropFocusHandler={ x: 1, y: 1, w: 5, h: 5, css: 'debug', id: 'rightMenudropFocusHandler', draggable: false};

		
		
		this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
		
		this.menuUpButton = new IconLabelButton(false, [icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			this.scrollY = 0;
			this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
		});
		this.menuToggleButton = new IconLabelButton(true, ['']
			
			, 'menuTogglerFill'
			, 'menuButtonLabel', (nn: number) => {
				
				if (globalCommandDispatcher.cfg().data.list) {
					globalCommandDispatcher.hideRightMenu();
				} else {
					globalCommandDispatcher.showRightMenu();
				}
			});





		this.backgroundAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				
				this.listingShadow
				, this.menuToggleButton.anchor
				, this.backgroundRectangle

			], id: 'rightMenuBackgroundAnchor'
		};
		this.contentAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//
			], id: 'rightMenuContentAnchor'
		};
		this.dragAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: []
			, css: 'noDragDropMixerItem'
		};
		this.interAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//this.dropFocusHandler
				this.dragHandler
				, this.dragAnchor
			]
		};
		this.buttonsAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				 
				this.menuUpButton.anchor
				
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

		let itemsH = 0;
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
		globalCommandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
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
	
	fillMenuItemChildren(pad: number, infos: MenuInfo[]): void {
		
		if (globalCommandDispatcher.cfg()) {
			
			if (globalCommandDispatcher.cfg().data.menuPlugins) {
				menuPointAddPlugin.itemKind = kindOpenedFolder;
			} else {
				menuPointAddPlugin.itemKind = kindClosedFolder;
			}
			
			if (globalCommandDispatcher.cfg().data.menuActions) {
				menuPointActions.itemKind = kindOpenedFolder;
			} else {
				menuPointActions.itemKind = kindClosedFolder;
			}
			if (globalCommandDispatcher.cfg().data.menuSettings) {
				menuPointSettings.itemKind = kindOpenedFolder;
			} else {
				menuPointSettings.itemKind = kindClosedFolder;
			}
			if (globalCommandDispatcher.cfg().data.menuClipboard) {
				menuPointClipboard.itemKind = kindOpenedFolder;
			} else {
				menuPointClipboard.itemKind = kindClosedFolder;
			}
		}
		let me = this;
		for (let ii = 0; ii < infos.length; ii++) {
			let it = infos[ii];

			let children = it.children;
			let itemLabel = '';
			if (it.noLocalization) {
				itemLabel = it.text;
			} else {
				itemLabel = LO(it.text);
			}

			switch (it.itemKind) {
				case kindOpenedFolder: {
					
					let so: RightMenuItem = new RightMenuItem(kindOpenedFolder, it, pad, () => {
						
						if (it.onFolderCloseOpen) {
							it.onFolderCloseOpen();
						}
						it.focused = true;
						it.itemKind = kindClosedFolder;
						me.rerenderMenuContent(so);

					});
					this.items.push(so);
					it.menuTop = this.items.length - 1;
					if (children) {
						this.fillMenuItemChildren(pad + 0.5, children);
					}
					
					break;
				}
				case kindClosedFolder: {
					
					let si: RightMenuItem = new RightMenuItem(kindClosedFolder, it, pad, () => {
						
						if (it.onFolderCloseOpen) {
							it.onFolderCloseOpen();
						}
						
						it.focused = true;
						it.itemKind = kindOpenedFolder;
						me.rerenderMenuContent(si);

					});
					this.items.push(si);
					it.menuTop = this.items.length - 1;
					
					break;
				}
				case kindDraggableCircle: {
					this.items.push(new RightMenuItem(kindDraggableCircle, it, pad, () => { }, () => { }, (x: number, y: number) => {
						if (it.onMenuItemDrag) {
							it.onMenuItemDrag(x, y);
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}));
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindDraggableSquare: {
					this.items.push(new RightMenuItem(kindDraggableSquare, it, pad, () => { }, () => { }, (x: number, y: number) => {
						if (it.onMenuItemDrag) {
							it.onMenuItemDrag(x, y);
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}));
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindDraggableTriangle: {
					this.items.push(new RightMenuItem(kindDraggableTriangle, it, pad, () => { }, () => { }, (x: number, y: number) => {
						if (it.onMenuItemDrag) {
							it.onMenuItemDrag(x, y);
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}));
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindPreview: {
					let rightMenuItem = new RightMenuItem(kindPreview, it, pad, () => {
						if (it.onClick) {
							it.onClick();
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}, () => {
						if (it.itemStates) {
							let sel = it.selectedState ? it.selectedState : 0;
							if (it.itemStates.length - 1 > sel) {
								sel++;
							} else {
								sel = 0;
							}
							it.selectedState = sel;
						}
						if (it.onSubClick) {
							it.onSubClick();
						}
						me.rerenderMenuContent(rightMenuItem);
					});
					this.items.push(rightMenuItem);
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindAction2: {
					let rightMenuItem = new RightMenuItem(kindAction2, it, pad, () => {
						if (it.onClick) {
							it.onClick();
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}, () => {
						if (it.itemStates) {
							let sel = it.selectedState ? it.selectedState : 0;
							if (it.itemStates.length - 1 > sel) {
								sel++;
							} else {
								sel = 0;
							}
							it.selectedState = sel;
						}
						if (it.onSubClick) {
							it.onSubClick();
						}
						me.rerenderMenuContent(rightMenuItem);
					});
					this.items.push(rightMenuItem);
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindAction: {
					this.items.push(new RightMenuItem(kindAction, it, pad, () => {
						if (it.onClick) {
							it.onClick();
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}));
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindActionDisabled: {
					this.items.push(new RightMenuItem(kindActionDisabled, it, pad, () => {
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}));
					it.menuTop = this.items.length - 1;
					break;
				}
			}
			
		}
	}
	readCurrentSongData767676(project: Zvoog_Project) {
		//let solo = false;
		//for (let tt = 0; tt < project.tracks.length; tt++) if (project.tracks[tt].performer.state == 2) solo = true;
		//for (let tt = 0; tt < project.percussions.length; tt++) if (project.percussions[tt].sampler.state == 2) solo = true;
		

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

		globalCommandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);

	}
	resizeMenu(viewWidth: number, viewHeight: number) {

		this.lastWidth = viewWidth;
		this.lastHeight = viewHeight;
		this.itemsWidth = viewWidth - 1;
		if (this.itemsWidth > 14) this.itemsWidth = 14;
		if (this.itemsWidth < 2) {
			this.itemsWidth = 2;
		}
		this.shiftX = viewWidth - this.itemsWidth;
		if (!globalCommandDispatcher.cfg().data.list) {
			this.shiftX = viewWidth + 1;

		} else {
			//
		}

		let shn = 0.1;

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

		this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);
		let msz = 1.75;
		if (globalCommandDispatcher.cfg().data.list) {
			
			this.menuToggleButton.resize(this.shiftX - msz / 2, viewHeight - 2 * msz, msz);
		} else {
			
			this.menuToggleButton.resize(this.shiftX - msz, viewHeight - 2 * msz, msz);
		}
		this.rerenderMenuContent(null);
}

}
