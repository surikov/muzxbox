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
	reFillLeftPanel() {
		//console.log('reFillLeftPanel');
		//let mixm: MixerDataMath = new MixerDataMath(data);
		for (let zz = 0; zz < this.leftZoomAnchors.length; zz++) {
			//this.leftZoomAnchors[zz].yy = globalCommandDispatcher.cfg().gridTop();
			//this.leftZoomAnchors[zz].hh = globalCommandDispatcher.cfg().gridHeight();
			this.leftZoomAnchors[zz].hh = globalCommandDispatcher.cfg().wholeHeight();
			this.leftZoomAnchors[zz].content = [];
			for (let oo = 1; oo < globalCommandDispatcher.cfg().octaveCount; oo++) {
				if (zz < 4) {
					/*
					let octavemark: TileRectangle = {
						x: 0
						, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo
						, w: 2 * zoomPrefixLevelsCSS[zz].minZoom
						, h: 0.5 * zoomPrefixLevelsCSS[zz].minZoom
						, css: 'octaveMark'
					};
					this.leftZoomAnchors[zz].content.push(octavemark);
					*/
					let nm3: TileText = {
						x: 1
						, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom
						, text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0)
						, css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(nm3);
					if (zz < 2) {
						nm3.x = 0.5;
						let nm2: TileText = {
							x: 0.5
							, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * globalCommandDispatcher.cfg().notePathHeight
							, text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0)
							, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
						};
						this.leftZoomAnchors[zz].content.push(nm2);
						if (zz < 1) {
							nm2.x = 0.25;
							nm3.x = 0.25;
							let nm: TileText = {
								x: 0.25
								, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * globalCommandDispatcher.cfg().notePathHeight
								, text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0)
								, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
							};
							this.leftZoomAnchors[zz].content.push(nm);
							nm = {
								x: 0.25
								, y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * globalCommandDispatcher.cfg().notePathHeight
								, text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0)
								, css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
							};
							this.leftZoomAnchors[zz].content.push(nm);
							//octavemark.w=4 * zoomPrefixLevelsCSS[zz].minZoom;
						}
					}

				}
			}
		
			if (zz < 4) {
				for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++) {
					let samplerLabel: TileText = {
						text: '' + globalCommandDispatcher.cfg().data.percussions[ss].title
						, x: 0
						, y: globalCommandDispatcher.cfg().samplerTop()
							+ globalCommandDispatcher.cfg().samplerDotHeight * (1 + ss)
							- globalCommandDispatcher.cfg().samplerDotHeight * 0.3
						, css: 'samplerRowLabel' + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(samplerLabel);
					//console.log('samplerLabel', samplerLabel);
				}
			}
			if (zz < 4) {
				//let yy = 0;
				for (let ff = 0; ff < globalCommandDispatcher.cfg().data.automations.length; ff++) {
					let automation = globalCommandDispatcher.cfg().data.automations[ff];
					//if (filter.automation) {
					let autoLabel: TileText = {
						text: '' + automation.title
						, x: 0
						, y: globalCommandDispatcher.cfg().automationTop()
							+ (1 + ff) * globalCommandDispatcher.cfg().autoPointHeight
							- 0.3 * globalCommandDispatcher.cfg().autoPointHeight
						, css: 'autoRowLabel' + zoomPrefixLevelsCSS[zz].prefix
					};
					this.leftZoomAnchors[zz].content.push(autoLabel);
					//console.log('autoLabel', autoLabel);
					//yy++;
					//}
					//console.log(ff, autoLabel);
				}
			}
		}
	}
}
