class FanPane {
	filterIcons: FilterIcon[];
	autoIcons: FilterIcon[];
	performerIcons: PerformerIcon[];
	samplerIcons: SamplerIcon[];
	//connectionspears: SpearConnection[];
	resetPlates(fanAnchors: TileAnchor[], spearsAnchors: TileAnchor[]): void {
		//console.log('FanPane.resetPlates', cfg, fanAnchors);
		this.filterIcons = [];
		this.autoIcons = [];
		this.performerIcons = [];
		this.samplerIcons = [];
		for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
			/*if (globalCommandDispatcher.cfg().data.filters[ff].automation) {
				this.autoIcons.push(new FilterIcon(globalCommandDispatcher.cfg().data.filters[ff].id));
			} else {
				this.filterIcons.push(new FilterIcon(globalCommandDispatcher.cfg().data.filters[ff].id));
			}*/
			this.filterIcons.push(new FilterIcon(globalCommandDispatcher.cfg().data.filters[ff].id));
		}
		for (let aa = 0; aa < globalCommandDispatcher.cfg().data.automations.length; aa++) {
			this.autoIcons.push(new FilterIcon(globalCommandDispatcher.cfg().data.automations[aa].output));
		}
		for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
			this.performerIcons.push(new PerformerIcon(globalCommandDispatcher.cfg().data.tracks[tt].performer.id));
		}
		for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++) {
			this.samplerIcons.push(new SamplerIcon(globalCommandDispatcher.cfg().data.percussions[tt].sampler.id));
		}

		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			this.buildPerformerIcons(fanAnchors[ii],spearsAnchors[ii], ii);
			this.buildFilterIcons(fanAnchors[ii],spearsAnchors[ii], ii);
			this.buildAutoIcons(fanAnchors[ii],spearsAnchors[ii], ii);
			this.buildSamplerIcons(fanAnchors[ii],spearsAnchors[ii], ii);
			this.buildOutIcon(fanAnchors[ii], ii);
			//this.connectPlugins(cfg, fanAnchors[ii], ii);
		}
		//this.buildAutoIcons();
		//this.buildFilterIcons();
		//this.buildOutIcon();
	}
	buildPerformerIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.performerIcons.length; ii++) {
			this.performerIcons[ii].buildPerformerSpot(ii,this.performerIcons.length,fanAnchor, spearsAnchor, zidx);
		}
	}
	buildSamplerIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.samplerIcons.length; ii++) {
			this.samplerIcons[ii].buildSamplerSpot(ii,fanAnchor, spearsAnchor, zidx);
		}
	}
	buildAutoIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.autoIcons.length; ii++) {
			this.autoIcons[ii].buildAutoSpot(ii,fanAnchor, spearsAnchor, zidx);
		}
	}
	buildFilterIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.filterIcons.length; ii++) {
			this.filterIcons[ii].buildFilterSpot(fanAnchor, spearsAnchor, zidx);
		}
	}
	buildOutIcon(fanAnchor: TileAnchor, zidx: number) {
		//let xx = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad;
		//let yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2 - globalCommandDispatcher.cfg().speakerIconSize / 2;

		let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad + globalCommandDispatcher.cfg().speakerIconSize / 2;
		let speakerY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2 - globalCommandDispatcher.cfg().speakerIconSize / 2;


		let rec: TileRectangle = {
			x: speakerX-globalCommandDispatcher.cfg().speakerIconSize / 2
			, y: speakerY-globalCommandDispatcher.cfg().speakerIconSize / 2
			, w: globalCommandDispatcher.cfg().speakerIconSize
			, h: globalCommandDispatcher.cfg().speakerIconSize
			, rx: globalCommandDispatcher.cfg().speakerIconSize / 2
			, ry: globalCommandDispatcher.cfg().speakerIconSize / 2
			, css: 'fanSpeakerIcon'
		};
		fanAnchor.content.push(rec);
		let icon: TileText = {
			x: speakerX //+ globalCommandDispatcher.cfg().speakerIconSize
			, y: speakerY //+ globalCommandDispatcher.cfg().speakerIconSize
			, text: icon_sound_loud, css: 'fanSpeakerIconLabel'
		};
		fanAnchor.content.push(icon);
		/*if (zidx < 5) {
			let txt: TileText = { text: 'Speaker', x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconHeight, css: 'fanSpeakerLabel' };
			fanAnchor.content.push(txt);
		}*/
	}

}
