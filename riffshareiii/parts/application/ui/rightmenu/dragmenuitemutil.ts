class DragMenuItemUtil {
	dragStarted: boolean;
	dragItem: TileItem;
	info: MenuInfo
	onDone: (xx: number, yy: number) => void;
	onDrag: null | ((xx: number, yy: number) => void);
	onPluck: null | ((zz: number) => void) = null;
	constructor(dragItem: TileItem
		, info: MenuInfo
		, onDone: (xx: number, yy: number) => void
		, onDrag?: (xx: number, yy: number) => void
		, onPluck?: (zz: number) => void
	) {
		this.dragStarted = false;
		this.dragItem = dragItem;
		this.info = info;
		this.onDone = onDone;
		if (onPluck) {
			this.onPluck = onPluck;
		}
		if (onDrag) {
			this.onDrag = onDrag;
		}
	}
	doDrag(x: number, y: number) {
		let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
		let ss = globalCommandDispatcher.renderer.menu.scrollY;
		let tt = this.info.menuTop ? this.info.menuTop : 0;
		let yy = (tt + ss - 0.0) * zz;
		let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
		if (!this.dragStarted) {
			this.dragStarted = true;
			globalCommandDispatcher.hideRightMenu();
			if (this.onPluck) {
				this.onPluck(zz);
			}
			globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, this.dragItem);

		}
		globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
		if (x == 0 && y == 0) {
			this.dragStarted = false;
			let pos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
			this.onDone(pos.x, pos.y);
		} else {
			if (this.onDrag) {
				let tap = globalCommandDispatcher.renderer.tiler.tapPxSize();
				let point: TilePoint = globalCommandDispatcher.renderer.tiler.screen2view({
					x: globalCommandDispatcher.renderer.menu.dragItemX * tap
					, y: globalCommandDispatcher.renderer.menu.dragItemY * tap
				});
				let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
				let left = point.x - start;
				let top = point.y - globalCommandDispatcher.cfg().gridTop();
				this.onDrag(left, top);
			}
		}

	}
}