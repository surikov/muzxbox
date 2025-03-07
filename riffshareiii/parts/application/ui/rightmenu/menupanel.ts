class RightMenuPanel {
	menuCloseButton: IconLabelButton;
	menuUpButton: IconLabelButton;
	//showState: boolean = true;
	lastWidth: number = 0;
	lastHeight: number = 0;

	backgroundRectangle: TileRectangle;
	listingShadow: TileRectangle;
	backgroundAnchor: TileAnchor;
	//layerCurrentTitle: TileText;

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

		globalCommandDispatcher.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
		globalCommandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
		globalCommandDispatcher.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
		globalCommandDispatcher.resetAnchor(this.menuPanelButtons, this.buttonsAnchor, LevelModes.overlay);
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
			globalCommandDispatcher.cfg().data.list = false;
			this.resizeMenu(this.lastWidth, this.lastHeight);
			this.resetAllAnchors();
		});
		this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			this.scrollY = 0;
			this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
		});

		//this.layerCurrentTitle = { x: 2.5, y: 0, text: '', css: 'currentTitleLabel' };




		this.backgroundAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//this.layerCurrentTitle
				//, 
				this.listingShadow
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
	setOpenState(state: boolean, it: MenuInfo, infos: MenuInfo[]) {
		/*for (let ii = 0; ii < infos.length; ii++) {
			infos[ii].opened = false;
			infos[ii].focused = false;
		}*/
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
					let so: RightMenuItem = new RightMenuItem(it, pad, () => {
						me.setOpenState(false, it, infos);
						me.rerenderMenuContent(so);

					}).initOpenedFolderItem();
					this.items.push(so);
					this.fillMenuItemChildren(pad + 0.5, children);
				} else {
					let si: RightMenuItem = new RightMenuItem(it, pad, () => {
						//console.log('test', it.text, it.onOpen);
						if (it.onFolderOpen) {
							it.onFolderOpen();
						}
						me.setOpenState(true, it, infos);
						me.rerenderMenuContent(si);

					}).initClosedFolderItem();
					this.items.push(si);
				}
			} else {
				if (it.dragMix) {
					this.items.push(new RightMenuItem(it, pad, () => { }, () => { }, (x: number, y: number) => {
						if (it.onDrag) {
							it.onDrag(x, y);
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}).initDraggableItem());
				} else {
					if (it.onSubClick) {
						//if (it.onClick) {
						let rightMenuItem = new RightMenuItem(it, pad, () => {
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
						this.items.push(rightMenuItem.initActionItem2());
						/*} else {
							let rightMenuItem = new RightMenuItem(it, pad, () => {
								//
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
							this.items.push(rightMenuItem.initDisabledItem2());
						}*/
					} else {
						if (it.onClick) {
							this.items.push(new RightMenuItem(it, pad, () => {
								if (it.onClick) {
									it.onClick();
								}
								me.setFocus(it, infos);
								me.resetAllAnchors();
							}).initActionItem());
						} else {
							this.items.push(new RightMenuItem(it, pad, () => {
								me.setFocus(it, infos);
								me.resetAllAnchors();
							}).initDisabledItem());
						}
					}


				}
			}
		}
	}
	readCurrentSongData(project: Zvoog_Project) {

		menuPointInsTracks.children = [];
		menuPointDrumTracks.children = [];
		menuPointFxTracks.children = [];
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let track = project.tracks[tt];
			let item: MenuInfo = {
				text: track.title
				, noLocalization: true
				, selectedState: track.performer.state
				, itemStates: [icon_sound_loud, icon_power, icon_flash]
				, onSubClick: () => {
					globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
						if (item.selectedState == 1) {
							track.performer.state = 1;
						} else {
							if (item.selectedState == 2) {
								track.performer.state = 2;
							} else {
								track.performer.state = 0;
							}
						}
					});
					globalCommandDispatcher.reConnectPluginsIfPlay();
				}
			};
			if (tt > 0) {
				item.onClick = () => {
					globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
						let track: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(tt, 1)[0];
						globalCommandDispatcher.cfg().data.tracks.splice(0, 0, track);
					});
					//globalCommandDispatcher.relaunchPlayer();
				};
			} else {
				item.onClick = () => {
					let info = globalCommandDispatcher.findPluginRegistrationByKind(track.performer.kind);
					if (info) {
						globalCommandDispatcher.promptPluginSequencerDialog(track, info);
						/*
						let url = info.ui;
						globalCommandDispatcher.promptPluginPointDialog(track.title, url, track.performer.data, (obj: any) => {
							globalCommandDispatcher.exe.commitProjectChanges(['tracks', tt, 'performer'], () => {
								track.performer.data = obj;
							});
							//globalCommandDispatcher.reStartPlayIfPlay();
							return true;
						}, LO(localDropInsTrack), () => {
							//console.log(localDropInsTrack);
							globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
								globalCommandDispatcher.cfg().data.tracks.splice(tt, 1);
							});
							globalCommandDispatcher.cancelPluginGUI();
						}, (newTitle: string) => {
							globalCommandDispatcher.exe.commitProjectChanges(['tracks', tt], () => {
								track.title = newTitle;
							});
							globalCommandDispatcher.cancelPluginGUI();
						});
						*/
					}
					//console.log('first',track);
				};
				item.highlight = icon_sliders;
			}
			menuPointInsTracks.children.push(item);
		}

		//menuPointPercussion.children = [];
		for (let tt = 0; tt < project.percussions.length; tt++) {
			let drum = project.percussions[tt];
			let item: MenuInfo = {
				text: drum.title
				, noLocalization: true
				, onSubClick: () => {
					/*item.selectedState = item.selectedState ? item.selectedState : 0;
					if (item.selectedState > 2) {
						item.selectedState = 0;
					}
					console.log(item.selectedState, drum);*/
					globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
						if (item.selectedState == 1) {
							drum.sampler.state = 1;
						} else {
							if (item.selectedState == 2) {
								drum.sampler.state = 2;
							} else {
								drum.sampler.state = 0;
							}
						}
					});
					globalCommandDispatcher.reConnectPluginsIfPlay();
				}
				, itemStates: [icon_sound_loud, icon_power, icon_flash]
				, selectedState: drum.sampler.state
			};
			if (tt > 0) {
				item.onClick = () => {
					globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
						let smpl: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions.splice(tt, 1)[0];
						globalCommandDispatcher.cfg().data.percussions.splice(0, 0, smpl);
					});
					//globalCommandDispatcher.relaunchPlayer();
				};
			} else {
				item.onClick = () => {
					let info = globalCommandDispatcher.findPluginRegistrationByKind(drum.sampler.kind);
					if (info) {
						//globalCommandDispatcher.promptPluginSamplerDialog(drum, info);
						globalCommandDispatcher.samplerPluginDialog.openDrumPluginDialogFrame(tt, drum, info);
						/*let url = info.ui;
						globalCommandDispatcher.promptPluginPointDialog(drum.title, url, drum.sampler.data, (obj: any) => {
							globalCommandDispatcher.exe.commitProjectChanges(['percussions', tt, 'sampler'], () => {
								drum.sampler.data = obj;
							});
							//globalCommandDispatcher.reStartPlayIfPlay();
							return true;
						}, LO(localDropSampleTrack), () => {
							//console.log(localDropSampleTrack);
							globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
								globalCommandDispatcher.cfg().data.percussions.splice(tt, 1);
							});
							globalCommandDispatcher.cancelPluginGUI();
						}, (newTitle: string) => {
							globalCommandDispatcher.exe.commitProjectChanges(['percussions', tt], () => {
								drum.title = newTitle;
							});
							globalCommandDispatcher.cancelPluginGUI();
						});*/
					}
					//console.log('first',track);
				};
				item.highlight = icon_sliders;
			}
			menuPointDrumTracks.children.push(item);
		}
		//menuPointAutomation.children = [];
		for (let ff = 0; ff < project.filters.length; ff++) {
			let filter = project.filters[ff];
			//if (filter.automation) {
			let item: MenuInfo = {
				text: filter.title
				, noLocalization: true
				, itemStates: [icon_equalizer, icon_power]
				, selectedState: filter.state
			};
			item.onSubClick = () => {
				//item.selectedState = item.selectedState ? item.selectedState : 0;
				//if (item.selectedState > 1) {
				//	item.selectedState = 0;
				//}
				//console.log(item.selectedState, filter);
				globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
					if (item.selectedState == 1) {
						filter.state = 1;
					} else {
						filter.state = 0;
					}
				});
				globalCommandDispatcher.reConnectPluginsIfPlay();
			};
			if (ff > 0) {
				item.onClick = () => {
					globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
						let fltr: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters.splice(ff, 1)[0];
						globalCommandDispatcher.cfg().data.filters.splice(0, 0, fltr);
					});
					//globalCommandDispatcher.relaunchPlayer();
				};
			} else {
				item.onClick = () => {
					let info = globalCommandDispatcher.findPluginRegistrationByKind(filter.kind);
					if (info) {
						globalCommandDispatcher.filterPluginDialog.openFilterPluginDialogFrame(ff, filter, info);
						/*let url = info.ui;
						globalCommandDispatcher.promptPluginPointDialog(filter.title, url, filter.data, (obj: any) => {
							globalCommandDispatcher.exe.commitProjectChanges(['filters', ff], () => {
								filter.data = obj;
							});
							//globalCommandDispatcher.reStartPlayIfPlay();
							return true;
						}, LO(localDropFilterTrack), () => {
							//console.log(localDropFilterTrack);
							globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
								globalCommandDispatcher.cfg().data.filters.splice(ff, 1);
							});
							globalCommandDispatcher.cancelPluginGUI();
						}, (newTitle: string) => {
							globalCommandDispatcher.exe.commitProjectChanges(['filters', ff], () => {
								filter.title = newTitle;
							});
							globalCommandDispatcher.cancelPluginGUI();
						});*/
					}
					//console.log('first',track);
				};
				item.highlight = icon_sliders;
			}
			menuPointFxTracks.children.push(item);
			//}
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

		this.menuCloseButton.resize(this.shiftX + this.itemsWidth - 1, viewHeight - 1, 1);
		this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);


		this.rerenderMenuContent(null);


		//globalCommandDispatcher.cfg().data.list=this.showState;
		//console.log('resizeMenu globalCommandDispatcher.globalCommandDispatcher.cfg().data.list', globalCommandDispatcher.cfg().data.list);
	}

}
