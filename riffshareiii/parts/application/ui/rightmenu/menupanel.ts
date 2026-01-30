class RightMenuPanel {
	//menuCloseButton: IconLabelButton;
	//menuRedoButton: IconLabelButton;
	//menuUndoButton: IconLabelButton;
	//menuPlayButton: IconLabelButton;

	menuUpButton: IconLabelButton;
	menuToggleButton: IconLabelButton;
	//showState: boolean = true;
	lastWidth: number = 0;
	lastHeight: number = 0;

	backgroundRectangle: TileRectangle;
	listingShadow: TileRectangle;
	backgroundAnchor: TileAnchor;
	//layerCurrentTitle: TileText;

	//rectangleDragItem: TileRectangle;
	dragItemX = 0;
	dragItemY = 0;
	dragAnchor: TileAnchor;
	//dragElement: HTMLElement | null = null;

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






	showDragMenuItem(dx: number, dy: number, dragContent: TileItem) {
		this.dragAnchor.content = [dragContent];
		let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
		this.dragItemX = dx / zz;
		this.dragItemY = dy / zz;
		this.dragAnchor.translation = { x: this.dragItemX, y: this.dragItemY };
		this.dragAnchor.css = 'dragDropMixerItem';
		globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
	}
	moveDragMenuItem(dx: number, dy: number) {
		let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
		this.dragItemX = this.dragItemX + dx / zz;
		this.dragItemY = this.dragItemY + dy / zz;
		this.dragAnchor.translation = { x: this.dragItemX, y: this.dragItemY };
		this.dragAnchor.css = 'dragDropMixerItem';
		globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
	}
	hideDragMenuItem(): TilePoint {
		let tap = globalCommandDispatcher.renderer.tiler.tapPxSize();
		let point: TilePoint = globalCommandDispatcher.renderer.tiler.screen2view({
			x: this.dragItemX * tap
			, y: this.dragItemY * tap
		});

		//let zz=globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
		let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let left = point.x - start;
		let top = point.y - globalCommandDispatcher.cfg().gridTop();
		//console.log('hideDragMenuItem',point,start,zz ,left,this.dragItemY);
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

		this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
		//this.menuCloseButton = new IconLabelButton([icon_moveright], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
		//	globalCommandDispatcher.hideRightMenu();
		//});
		/*
		this.menuRedoButton = new IconLabelButton([icon_redo], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			globalCommandDispatcher.exe.redo(1);
		});
		this.menuUndoButton = new IconLabelButton([icon_undo], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			globalCommandDispatcher.exe.undo(1);
		});
		this.menuPlayButton = new IconLabelButton([icon_play, icon_pause], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			globalCommandDispatcher.toggleStartStop();
		});
*/




		this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			this.scrollY = 0;
			this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
		});
		this.menuToggleButton = new IconLabelButton([''], 'menuButtonCircle', 'menuButtonLabel', (nn: number) => {
			console.log('locick');
			if (globalCommandDispatcher.cfg().data.list) {
				globalCommandDispatcher.hideRightMenu();
			} else {
				globalCommandDispatcher.showRightMenu();
			}
		});


		//this.layerCurrentTitle = { x: 2.5, y: 0, text: '', css: 'currentTitleLabel' };




		this.backgroundAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//this.layerCurrentTitle
				//, 
 this.menuToggleButton.anchor
				,
				this.listingShadow
				, this.backgroundRectangle

			], id: 'rightMenuBackgroundAnchor'
		};
		this.contentAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//this.testContent
			], id: 'rightMenuContentAnchor'
		};
		this.dragAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: []//this.rectangleDragItem]
			, css: 'noDragDropMixerItem'
		};
		this.interAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				this.dragHandler
				, this.dragAnchor
			]
		};
		this.buttonsAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//this.menuCloseButton.anchor, 
				this.menuUpButton.anchor
				//, this.menuToggleButton.anchor
				//, this.menuRedoButton.anchor
				//, this.menuUndoButton.anchor
				//, this.menuPlayButton.anchor
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
	/*
	setOpenState(state: boolean, it: MenuInfo, infos: MenuInfo[]) {
		/for (let ii = 0; ii < infos.length; ii++) {
			infos[ii].opened = false;
			infos[ii].focused = false;
		}/
		it.focused = true;
		it.opened = state;
	}
*/
	fillMenuItemChildren(pad: number, infos: MenuInfo[]): void {
		//console.log('fillMenuItemChildren',infos);
		if (globalCommandDispatcher.cfg()) {
			/*if (globalCommandDispatcher.cfg().data.menuPerformers) {
				menuPointInsTracks.itemKind = kindOpenedFolder;
			} else {
				menuPointInsTracks.itemKind = kindClosedFolder;
			}
			if (globalCommandDispatcher.cfg().data.menuSamplers) {
				menuPointDrumTracks.itemKind = kindOpenedFolder;
			} else {
				menuPointDrumTracks.itemKind = kindClosedFolder;
			}
			if (globalCommandDispatcher.cfg().data.menuFilters) {
				menuPointFxTracks.itemKind = kindOpenedFolder;
			} else {
				menuPointFxTracks.itemKind = kindClosedFolder;
			}*/
			if (globalCommandDispatcher.cfg().data.menuPlugins) {
				menuPointAddPlugin.itemKind = kindOpenedFolder;
			} else {
				menuPointAddPlugin.itemKind = kindClosedFolder;
			}
			/*if (globalCommandDispatcher.cfg().data.menuClipboard) {
				menuPointStore.itemKind = kindOpenedFolder;
			} else {
				menuPointStore.itemKind = kindClosedFolder;
			}*/
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

			//let focused = (it.focused) ? true : false;
			//let opened = (it.opened) ? true : false;
			let children = it.children;
			let itemLabel = '';
			if (it.noLocalization) {
				itemLabel = it.text;
			} else {
				itemLabel = LO(it.text);
			}

			switch (it.itemKind) {
				case kindOpenedFolder: {
					//if (opened) {
					let so: RightMenuItem = new RightMenuItem(kindOpenedFolder, it, pad, () => {
						//me.setOpenState(false, it, infos);
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
					/*} else {
						let si: RightMenuItem = new RightMenuItem(kindClosedFolder, it, pad, () => {
							//console.log('test', it.text, it.onOpen);
							if (it.onFolderOpen) {
								it.onFolderOpen();
							}
							me.setOpenState(true, it, infos);
							me.rerenderMenuContent(si);

						});
						this.items.push(si);
						it.top = this.items.length - 1;
					}*/
					break;
				}
				case kindClosedFolder: {
					/*if (opened) {
						let so: RightMenuItem = new RightMenuItem(kindOpenedFolder, it, pad, () => {
							me.setOpenState(false, it, infos);
							me.rerenderMenuContent(so);

						});
						this.items.push(so);
						it.top = this.items.length - 1;
						if (children) {
							this.fillMenuItemChildren(pad + 0.5, children);
						}
					} else {*/
					let si: RightMenuItem = new RightMenuItem(kindClosedFolder, it, pad, () => {
						//console.log('test', it.text, it.onOpen);
						if (it.onFolderCloseOpen) {
							it.onFolderCloseOpen();
						}
						//me.setOpenState(true, it, infos);
						it.focused = true;
						it.itemKind = kindOpenedFolder;
						me.rerenderMenuContent(si);

					});
					this.items.push(si);
					it.menuTop = this.items.length - 1;
					//}
					break;
				}
				case kindDraggableCircle: {
					this.items.push(new RightMenuItem(kindDraggableCircle, it, pad, () => { }, () => { }, (x: number, y: number) => {
						if (it.onDrag) {
							it.onDrag(x, y);
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}));
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindDraggableSquare: {
					this.items.push(new RightMenuItem(kindDraggableSquare, it, pad, () => { }, () => { }, (x: number, y: number) => {
						if (it.onDrag) {
							it.onDrag(x, y);
						}
						me.setFocus(it, infos);
						me.resetAllAnchors();
					}));
					it.menuTop = this.items.length - 1;
					break;
				}
				case kindDraggableTriangle: {
					this.items.push(new RightMenuItem(kindDraggableTriangle, it, pad, () => { }, () => { }, (x: number, y: number) => {
						if (it.onDrag) {
							it.onDrag(x, y);
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
			/*
						//if (children) {//folder
						if (it.itemKind == kindOpenedFolder || it.itemKind == kindClosedFolder) {
							if (opened) {
								let so: RightMenuItem = new RightMenuItem(kindOpenedFolder, it, pad, () => {
									me.setOpenState(false, it, infos);
									me.rerenderMenuContent(so);
			
								});
								this.items.push(so);
								it.top = this.items.length - 1;
								if (children) {
									this.fillMenuItemChildren(pad + 0.5, children);
								}
							} else {
								let si: RightMenuItem = new RightMenuItem(kindClosedFolder, it, pad, () => {
									//console.log('test', it.text, it.onOpen);
									if (it.onFolderOpen) {
										it.onFolderOpen();
									}
									me.setOpenState(true, it, infos);
									me.rerenderMenuContent(si);
			
								});
								this.items.push(si);
								it.top = this.items.length - 1;
							}
						} else {
							//if (it.dragCircle) {
							if (it.itemKind == kindDraggableCircle) {
								this.items.push(new RightMenuItem(kindDraggableCircle, it, pad, () => { }, () => { }, (x: number, y: number) => {
									if (it.onDrag) {
										it.onDrag(x, y);
									}
									me.setFocus(it, infos);
									me.resetAllAnchors();
								}));
								it.top = this.items.length - 1;
							} else {
								//if (it.dragSquare) {
								if (it.itemKind == kindDraggableSquare) {
									this.items.push(new RightMenuItem(kindDraggableSquare, it, pad, () => { }, () => { }, (x: number, y: number) => {
										if (it.onDrag) {
											it.onDrag(x, y);
										}
										me.setFocus(it, infos);
										me.resetAllAnchors();
									}));
									it.top = this.items.length - 1;
								} else {
									//if (it.dragTriangle) {
									if (it.itemKind == kindDraggableTriangle) {
										this.items.push(new RightMenuItem(kindDraggableTriangle, it, pad, () => { }, () => { }, (x: number, y: number) => {
											if (it.onDrag) {
												it.onDrag(x, y);
											}
											me.setFocus(it, infos);
											me.resetAllAnchors();
										}));
										it.top = this.items.length - 1;
									} else {
										//if (it.onSubClick) {
										//if (it.url) {
										if (it.itemKind == kindPreview) {
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
											it.top = this.items.length - 1;
										} else {
											//if (it.onClick) {
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
											it.top = this.items.length - 1;
										}
										//} else {
										//if (it.onClick) {
										if (it.itemKind == kindAction) {
											this.items.push(new RightMenuItem(kindAction, it, pad, () => {
												if (it.onClick) {
													it.onClick();
												}
												me.setFocus(it, infos);
												me.resetAllAnchors();
											}));
											it.top = this.items.length - 1;
										} else {
											if (it.itemKind == kindActionDisabled) {
												this.items.push(new RightMenuItem(kindActionDisabled, it, pad, () => {
													me.setFocus(it, infos);
													me.resetAllAnchors();
												}));
												it.top = this.items.length - 1;
											}
										}
										//}
			
									}
								}
							}
						}*/
		}
	}
	readCurrentSongData(project: Zvoog_Project) {
		let solo = false;
		for (let tt = 0; tt < project.tracks.length; tt++) if (project.tracks[tt].performer.state == 2) solo = true;
		for (let tt = 0; tt < project.percussions.length; tt++) if (project.percussions[tt].sampler.state == 2) solo = true;
		/*menuPointInsTracks.children = [];
		menuPointDrumTracks.children = [];
		menuPointFxTracks.children = [];
		let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
		for (let farIdx = 0; farIdx < farorder.length; farIdx++) {
			let tt = farorder[farIdx];
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
				, itemKind: kindAction2
			};
			if (track.performer.state == 1 || (solo && track.performer.state != 2)) item.lightTitle = true;
			if (farIdx > 0) {
				item.onClick = () => {
					globalCommandDispatcher.exe.commitProjectChanges(['farorder'], () => {
						//let track: Zvoog_MusicTrack = globalCommandDispatcher.cfg().data.tracks.splice(tt, 1)[0];
						//globalCommandDispatcher.cfg().data.tracks.splice(0, 0, track);
						let nn = farorder.splice(farIdx, 1)[0];
						farorder.splice(0, 0, nn);
						globalCommandDispatcher.cfg().data.farorder = farorder;
						//console.log(globalCommandDispatcher.cfg().data.farorder);
					});
				};
			} else {
				item.onClick = () => {
					let info = globalCommandDispatcher.findPluginRegistrationByKind(track.performer.kind);
					if (info) {
						globalCommandDispatcher.sequencerPluginDialog.openSequencerPluginDialogFrame(farIdx, tt, track, info);
					} else {
						globalCommandDispatcher.sequencerPluginDialog.openEmptySequencerPluginDialogFrame(tt, track);
					}
				};
				item.highlight = icon_sliders;
			}
			menuPointInsTracks.children.push(item);
		}*/
		/*
		for (let tt = 0; tt < project.percussions.length; tt++) {
			let drum = project.percussions[tt];
			let item: MenuInfo = {
				text: drum.title
				, noLocalization: true
				, onSubClick: () => {
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
				, itemKind: kindAction2
			};
			if (drum.sampler.state == 1 || (solo && drum.sampler.state != 2)) item.lightTitle = true;
			if (tt > 0) {
				item.onClick = () => {
					globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
						let smpl: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions.splice(tt, 1)[0];
						globalCommandDispatcher.cfg().data.percussions.splice(0, 0, smpl);
					});
				};
			} else {
				item.onClick = () => {
					let info = globalCommandDispatcher.findPluginRegistrationByKind(drum.sampler.kind);
					if (info) {
						globalCommandDispatcher.samplerPluginDialog.openDrumPluginDialogFrame(tt, drum, info);
					} else {
						globalCommandDispatcher.samplerPluginDialog.openEmptyDrumPluginDialogFrame(tt, drum);
					}
				};
				item.highlight = icon_sliders;
			}
			menuPointDrumTracks.children.push(item);
		}*/


		/*
				//menuPointAutomation.children = [];
				for (let ff = 0; ff < project.filters.length; ff++) {
					let filter: Zvoog_FilterTarget = project.filters[ff];
					let item: MenuInfo = {
						text: filter.title
						, noLocalization: true
						, itemStates: [icon_equalizer, icon_power]
						, selectedState: filter.state
						, itemKind: kindAction
					};
					item.onSubClick = () => {
						globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
							if (item.selectedState == 1) {
								filter.state = 1;
							} else {
								filter.state = 0;
							}
						});
						globalCommandDispatcher.reConnectPluginsIfPlay();
					};
					if (filter.state) {
						item.lightTitle = true;
					}
					if (ff > 0) {
						item.onClick = () => {
							globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
								let fltr: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters.splice(ff, 1)[0];
								globalCommandDispatcher.cfg().data.filters.splice(0, 0, fltr);
							});
						};
					} else {
						item.onClick = () => {
							let info = globalCommandDispatcher.findPluginRegistrationByKind(filter.kind);
							if (info) {
								globalCommandDispatcher.filterPluginDialog.openFilterPluginDialogFrame(ff, filter, info);
							} else {
								globalCommandDispatcher.filterPluginDialog.openEmptyFilterPluginDialogFrame(ff, filter);
							}
						};
						item.highlight = icon_sliders;
					}
					menuPointFxTracks.children.push(item);
				}*/

	}
	rerenderMenuContent(folder: RightMenuItem | null) {
		//console.log('rerenderMenuContent',folder);
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

		//this.menuCloseButton.resize(this.shiftX + this.itemsWidth - 1, viewHeight - 1, 1);
		//this.menuRedoButton.resize(this.shiftX + this.itemsWidth - 2, viewHeight - 1, 1);
		//this.menuUndoButton.resize(this.shiftX + this.itemsWidth - 3, viewHeight - 1, 1);
		//this.menuPlayButton.resize(this.shiftX + this.itemsWidth - 4, viewHeight - 1, 1);

		this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);
		let msz=1.75;
		if (globalCommandDispatcher.cfg().data.list) {
			this.menuToggleButton.resize(this.shiftX - msz/2, viewHeight / 2 - msz/2, msz);
		} else {
			this.menuToggleButton.resize(this.shiftX - msz, viewHeight / 2 - msz/2, msz);
		}
		this.rerenderMenuContent(null);


		//globalCommandDispatcher.cfg().data.list=this.showState;
		//console.log('resizeMenu globalCommandDispatcher.globalCommandDispatcher.cfg().data.list', globalCommandDispatcher.cfg().data.list);
	}

}
