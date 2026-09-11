class LeftPanel {
	leftLayer: TileLayerDefinition;
	leftZoomAnchors: TileAnchor[] = [];
	constructor() {

	}
	createLeftPanel(): TileLayerDefinition[] {
		let leftsidebar = (document.getElementById("leftsidebar") as any) as SVGElement;
		this.leftLayer = { g: leftsidebar, anchors: [], mode: LevelModes.left };
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
			let zoomLeftLevelAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[zz].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.leftZoomAnchors.push(zoomLeftLevelAnchor);
			this.leftLayer.anchors.push(zoomLeftLevelAnchor);
		}
		return [this.leftLayer];
	}
	reFillLeftPanel() {
		for (let zz = 0; zz < this.leftZoomAnchors.length; zz++) {
			this.leftZoomAnchors[zz].hh = globalCommandDispatcher.cfg().wholeHeight();
			this.leftZoomAnchors[zz].content = [];
			for (let oo = 0; oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
				if (zz < globalCommandDispatcher.cfg().zoomEditZoomIdxLess) {
					/*let olabel = 'x' + (globalCommandDispatcher.cfg().drawOctaveCount() - oo);
					let nm3: TileText = {
						x: 1
						, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom
						, text: olabel
						, css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(nm3);
*/
					let octaveNum = globalCommandDispatcher.cfg().drawOctaveCount() - oo;
					let labelCSS = 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix;
					let xx = 0;//0.25;
					let ph = globalCommandDispatcher.cfg().notePathHeight;
					let yy = globalCommandDispatcher.cfg().gridTop() + 12 * oo * ph;// + 1 * zoomPrefixLevelsCSS[zz].minZoom;
					this.leftZoomAnchors[zz].content.push({ x: xx, y: yy + 1 * ph, text: 'B' + octaveNum, css: labelCSS });
					this.leftZoomAnchors[zz].content.push({ x: xx, y: yy + 3 * ph, text: 'A' + octaveNum, css: labelCSS });
					this.leftZoomAnchors[zz].content.push({ x: xx, y: yy + 5 * ph, text: 'G' + octaveNum, css: labelCSS });
					this.leftZoomAnchors[zz].content.push({ x: xx, y: yy + 7 * ph, text: 'F' + octaveNum, css: labelCSS });
					this.leftZoomAnchors[zz].content.push({ x: xx, y: yy + 8 * ph, text: 'E' + octaveNum, css: labelCSS });
					this.leftZoomAnchors[zz].content.push({ x: xx, y: yy + 10 * ph, text: 'D' + octaveNum, css: labelCSS });
					this.leftZoomAnchors[zz].content.push({ x: xx, y: yy + 12 * ph, text: 'C' + octaveNum, css: labelCSS });

				}
				if (zz < 5 && zz >=globalCommandDispatcher.cfg().zoomEditZoomIdxLess) {
					let olabel = '' + (globalCommandDispatcher.cfg().drawOctaveCount() - oo);
					let nm3: TileText = {
						x: 1
						, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom
						, text: olabel
						, css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(nm3);
					/*if (zz < 2) {
						nm3.x = 0.5;
						let nm2: TileText = {
							x: 0.5
							, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * globalCommandDispatcher.cfg().notePathHeight
							, text: olabel
							, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
						};
						this.leftZoomAnchors[zz].content.push(nm2);
						if (zz < 1) {
							nm2.x = 0.25;
							nm3.x = 0.25;
							let nm: TileText = {
								x: 0.25
								, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * globalCommandDispatcher.cfg().notePathHeight
								, text: olabel
								, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
							};
							this.leftZoomAnchors[zz].content.push(nm);
							nm = {
								x: 0.25
								, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * globalCommandDispatcher.cfg().notePathHeight
								, text: olabel
								, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
							};
							this.leftZoomAnchors[zz].content.push(nm);
						}
					}*/
				}
			}
			let butsize = zoomPrefixLevelsCSS[zz].minZoom * 1.5;
			let titleButton: TileRectangle = {
				x: 0
				, y: globalCommandDispatcher.cfg().gridTop() - butsize + butsize * 0.2
				, w: butsize, h: butsize
				, rx: butsize / 2, ry: butsize / 2
				, css: 'timeMarkButtonCircle' + zoomPrefixLevelsCSS[zz].prefix
				, activation: (x, y) => {
					let old = globalCommandDispatcher.cfg().data.title;
					let newTitle = prompt('', old);
					if (newTitle) {
						if (newTitle == old) {

						} else {
							globalCommandDispatcher.exe.commitProjectChanges([], () => {
								globalCommandDispatcher.cfg().data.title = newTitle;
								globalCommandDispatcher.fullProjectCheckUp(globalCommandDispatcher.cfg().data);
							});
							globalCommandDispatcher.resetProject();
						}
					}
				}
			};
			this.leftZoomAnchors[zz].content.push(titleButton);
			let titleLabel: TileText = {
				x: butsize * 0.2
				, y: globalCommandDispatcher.cfg().gridTop()
				, text: globalCommandDispatcher.cfg().data.title
				, css: 'titleLabel' + zoomPrefixLevelsCSS[zz].prefix
			};
			this.leftZoomAnchors[zz].content.push(titleLabel);
			let soloOnly = false;
			for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++)
				if (globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 2) {
					soloOnly = true;
					break;
				}

			for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
				if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2) {
					soloOnly = true;
					break;
				}
			}
			if (zz < 5) {
				if (globalCommandDispatcher.cfg().data.tracks.length > 0) {
					let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
					let preCSS = 'firstTrackLabel';
					if ((soloOnly && globalCommandDispatcher.cfg().data.tracks[0].performer.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.tracks[0].performer.state == 1)) {
						preCSS = 'firstTrackMute';
					}
					let trackLabel: TileText = {
						x: 0
						, y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight()
						, text: globalCommandDispatcher.cfg().data.tracks[farorder[0]].title
						, css: preCSS + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(trackLabel);
					for (let farIdx = 1; farIdx < farorder.length; farIdx++) {
						let tr = farorder[farIdx];
						let preCSS = 'otherTrackLabel';
						if ((soloOnly && globalCommandDispatcher.cfg().data.tracks[tr].performer.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.tracks[tr].performer.state == 1)) {
							preCSS = 'otherTrackMute';
						}
						let trackLabel: TileText = {
							x: 0
							, y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight()
								- (1 + farIdx) * globalCommandDispatcher.cfg().notePathHeight
							, text: globalCommandDispatcher.cfg().data.tracks[tr].title
							, css: preCSS + zoomPrefixLevelsCSS[zz].prefix
						};
						this.leftZoomAnchors[zz].content.push(trackLabel);
					}
				}
			}
			if (zz < 5) {
				for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++) {
					let preCSS = 'samplerRowLabel';
					if ((soloOnly && globalCommandDispatcher.cfg().data.percussions[ss].sampler.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 1)) {
						preCSS = 'samplerMuteLabel';
					}
					let samplerLabel: TileText = {
						text: '' + globalCommandDispatcher.cfg().data.percussions[ss].title
						, x: 0
						, y: globalCommandDispatcher.cfg().samplerTop()
							+ globalCommandDispatcher.cfg().samplerDotHeight * (1 + ss)
							- globalCommandDispatcher.cfg().samplerDotHeight * 0.3
						, css: preCSS + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(samplerLabel);
				}
			}
			if (zz < 5) {
				for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
					let filter = globalCommandDispatcher.cfg().data.filters[ff];
					let preCSS = 'autoRowLabel';
					if (filter.state == 1) {
						preCSS = 'autoMuteLabel';
					}
					let autoLabel: TileText = {
						text: '' + filter.title
						, x: 0
						, y: globalCommandDispatcher.cfg().automationTop()
							+ (1 + ff) * globalCommandDispatcher.cfg().autoPointHeight
							- 0.3 * globalCommandDispatcher.cfg().autoPointHeight
						, css: preCSS + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(autoLabel);
				}
			}
		}
	}
}
