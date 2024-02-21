class LeftPanel {
	leftLayer: TileLayerDefinition;
	//leftPanelAnchor: TileAnchor;
	leftZoomAnchors: TileAnchor[] = [];
	//trackTitleLabel: TileText[];
	constructor() {

	}
	createLeftPanel(): TileLayerDefinition[] {
		let leftsidebar = (document.getElementById("leftsidebar") as any) as SVGElement;
		this.leftLayer = { g: leftsidebar, anchors: [], mode: LevelModes.left };
		/*this.leftPanelAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].minZoom
			, content: [
			    
			]
		};
		this.leftLayer.anchors.push(this.leftPanelAnchor);
		this.leftPanelAnchor.content.push(
			{ x: 0, y: 0, w: 100, h: 100, css: 'debug' }
		);*/
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {

			let zoomLeftLevelAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zz].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.leftZoomAnchors.push(zoomLeftLevelAnchor);
			this.leftLayer.anchors.push(zoomLeftLevelAnchor);


		}
		return [this.leftLayer];
	}
	/*fillLeftBarPanel(){
		console.log('fillLeftPanel');
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {

		}
	}*/
	reFillLeftPanel(data: MZXBX_Project) {
		console.log('reFillLeftPanel');
		let mixm: MixerDataMath = new MixerDataMath(data);
		for (let zz = 0; zz < this.leftZoomAnchors.length; zz++) {
			//this.leftZoomAnchors[zz].yy = mixm.gridTop();
			//this.leftZoomAnchors[zz].hh = mixm.gridHeight();
			this.leftZoomAnchors[zz].hh = mixm.mixerHeight();
			this.leftZoomAnchors[zz].content = [];
			for (let oo = 1; oo < mixm.octaveCount; oo++) {
				if (zz < 4) {
					let octavemark: TileRectangle = {
						x: 0
						, y: mixm.gridTop() + 12 * oo
						, w: 2 * zoomPrefixLevelsCSS[zz].minZoom
						, h: 2 * zoomPrefixLevelsCSS[zz].minZoom
						, css: 'octaveMark'
					};
					this.leftZoomAnchors[zz].content.push(octavemark);
					let nm: TileText = {
						x: 0
						, y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 2 * zoomPrefixLevelsCSS[zz].minZoom
						, text: '' + (mixm.octaveCount - oo + 0)
						, css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(nm);
					if (zz < 2) {
						let nm: TileText = {
							x: 0
							, y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * mixm.notePathHeight
							, text: '' + (mixm.octaveCount - oo + 0)
							, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
						};
						this.leftZoomAnchors[zz].content.push(nm);
						if (zz < 1) {
							let nm: TileText = {
								x: 0
								, y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * mixm.notePathHeight
								, text: '' + (mixm.octaveCount - oo + 0)
								, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
							};
							this.leftZoomAnchors[zz].content.push(nm);
							nm = {
								x: 0
								, y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * mixm.notePathHeight
								, text: '' + (mixm.octaveCount - oo + 0)
								, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
							};
							this.leftZoomAnchors[zz].content.push(nm);
						}
					}

				}
			}
			if (data.tracks.length > 0) {
				let trackLabel: TileText = {
					text: '' + data.tracks[0].title, x: 0, y: mixm.gridTop(), css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
				};
				this.leftZoomAnchors[zz].content.push(trackLabel);
			}
			if (zz < 4) {
				for (let ss = 0; ss < data.percussions.length; ss++) {
					let samplerLabel: TileText = {
						text: '' + data.percussions[ss].title
						, x: 0
						, y: mixm.samplerTop() + mixm.notePathHeight * ss + mixm.notePathHeight
						, css: 'samplerRowLabel'+ zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(samplerLabel);
				}
			}
		}
	}
}
