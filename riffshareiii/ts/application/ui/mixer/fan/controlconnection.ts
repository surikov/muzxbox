class ControlConnection {
	addAudioStreamLineFlow(secondary: boolean, zIndex: number, yy: number, toX: number, toY: number, anchor: TileAnchor) {
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
		new SpearConnection().addSpear(secondary, zIndex
			, left
			, yy
			//, globalCommandDispatcher.cfg().pluginIconSize * 2
			, globalCommandDispatcher.cfg().fanPluginIconSize(zIndex)
			, toX
			, toY
			, anchor);
		if (!secondary) {
			let buttn: TileRectangle = {
				x: left - 1
				, y: yy - 1
				, w: 2
				, h: 2
				, rx: 1
				, ry: 1
				, css: 'fanConnectionButton'
			};
			anchor.content.push(buttn);
		}
	}
}
