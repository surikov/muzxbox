class RightMenuItem {

	kindAction: 1 = 1;
	kindDraggableCircle: 2 = 2;
	kindDraggableSquare: 3 = 3;
	kindDraggableTriangle: 4 = 4;
	kindPreview: 5 = 5;
	kindClosedFolder: 6 = 6;
	kindOpenedFolder: 7 = 7;
	kindAction2: 8 = 8;
	kindActionDisabled: 9 = 9;
	kind: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 = this.kindAction;
	action?: { (): void };
	action2?: { (): void };
	drag?: { (x: number, y: number): void };
	pad: number = 0;
	top: number;
	info: MenuInfo;

	constructor(info: MenuInfo, pad: number, tap?: () => void, tap2?: () => void, drag?: (x: number, y: number) => void) {
		this.info = info;
		this.pad = pad;
		this.action = tap;
		this.action2 = tap2;
		this.drag = drag;
		if (this.info.sid) {
			//
		} else {
			this.info.sid = 'random' + Math.random();
		}
	}
	initDisabledItem(): RightMenuItem {
		this.kind = this.kindActionDisabled;
		return this;
	}
	initActionItem(): RightMenuItem {
		this.kind = this.kindAction;
		return this;
	}
	initActionItem2(): RightMenuItem {
		this.kind = this.kindAction2;
		return this;
	}
	/*
	initDraggableItem(): RightMenuItem {
		this.kind = this.kindDraggable;
		return this;
	}*/
	initDraggableCircle(): RightMenuItem {
		this.kind = this.kindDraggableCircle;
		return this;
	}
	initDraggableSquare(): RightMenuItem {
		this.kind = this.kindDraggableSquare;
		return this;
	}
	initDraggableTriangle(): RightMenuItem {
		this.kind = this.kindDraggableTriangle;
		return this;
	}
	initOpenedFolderItem(): RightMenuItem {
		this.kind = this.kindOpenedFolder;
		return this;
	}
	initClosedFolderItem(): RightMenuItem {
		this.kind = this.kindClosedFolder;
		return this;
	}
	initPreviewItem(): RightMenuItem {
		this.kind = this.kindPreview;
		return this;
	}
	calculateHeight(): number {
		if (this.kind == this.kindPreview) {
			return 2;
		} else {
			return 1;
		}
	}
	buildTile(itemTop: number, itemWidth: number): TileItem {
		//rightMenuLightLabel
		//rightMenuLabel
		let label: string = '?';
		if (this.info.noLocalization) {
			label = this.info.text;
		} else {
			label = LO(this.info.text);
		}
		let labelCss: string = 'rightMenuLabel';
		if (this.info.lightTitle) {
			labelCss = 'rightMenuLightLabel';
		}
		this.top = itemTop;
		let anchor: TileAnchor = {
			xx: 0, yy: itemTop, ww: 111, hh: 111
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: []
		};
		if (this.info.focused) {
			//anchor.content.push({ x: itemWidth - 0.2, y: itemTop + 0.02, w: 0.2, h: this.calculateHeight() - 0.02, css: 'rightMenuFocusedDelimiter' });
		}
		anchor.content.push({ x: 0, y: itemTop + this.calculateHeight(), w: itemWidth, h: 0.02, css: 'rightMenuDelimiterLine' });
		let spot: TileRectangle = { x: this.pad, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
		let spot2: TileRectangle | null = null;
		if (this.kind == this.kindAction) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
		}
		if (this.kind == this.kindActionDisabled) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDisabledBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
		}
		if (this.kind == this.kindAction2) {
			let stateIicon = '?';
			let sel = this.info.selectedState ? this.info.selectedState : 0;
			if (this.info.itemStates) {
				if (this.info.itemStates.length > sel) {
					stateIicon = this.info.itemStates[sel];
				}
			}
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			if (this.info.highlight) {
				anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: this.info.highlight, css: 'rightMenuIconLabel' });
				anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
			} else {
				anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
			}
			anchor.content.push({ x: itemWidth - 1.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: itemWidth - 1.1 + 0.4, y: itemTop + 0.7, text: stateIicon, css: 'rightMenuIconLabel' });
			spot2 = { x: itemWidth - 1.2, y: itemTop, w: 1, h: 1, activation: this.action2, css: 'transparentSpot' };
		}
		if (this.kind == this.kindDraggableCircle) {
			spot.draggable = true;
			spot.activation = this.drag;
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
		}
		if (this.kind == this.kindDraggableSquare) {
			spot.draggable = true;
			spot.activation = this.drag;
			anchor.content.push({ x: 0.15 + this.pad, y: itemTop + 0.15, w: 0.7, h: 0.7, rx: 0.05, ry: 0.05, css: 'rightMenuItemDragBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
		}
		if (this.kind == this.kindDraggableTriangle) {
			spot.draggable = true;
			spot.activation = this.drag;
			//anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
			let sz = 0.45;
			let tri: TilePolygon = {
				x: 0.2 + this.pad
				, y: itemTop + 0.1
				, dots: [0, 0, sz * 2 * 0.8 * 0.9, sz * 0.9, 0, sz * 2 * 0.9]
				, css: 'rightMenuItemDragBG'
			};
			anchor.content.push(tri);
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
		}











		if (this.kind == this.kindOpenedFolder) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_movedown, css: 'rightMenuIconLabel' });
			anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
		}
		if (this.kind == this.kindClosedFolder) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_moveright, css: 'rightMenuIconLabel' });
			anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
		}
		if (this.kind == this.kindPreview) {
			spot.draggable = true;
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
			anchor.content.push({ x: itemWidth - 1 + 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemSubActionBG' });
			anchor.content.push({ x: itemWidth - 0.5, y: itemTop + 0.7, text: icon_play, css: 'rightMenuButtonLabel' });
			anchor.content.push({ x: itemWidth - 1, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' });
			anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55, text: label, css: 'rightMenuSubLabel' });
			anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55 + 0.55, text: label, css: 'rightMenuSubLabel' });
		}
		anchor.content.push(spot);
		if (spot2) {
			anchor.content.push(spot2);
		}
		return anchor;
	}
}
