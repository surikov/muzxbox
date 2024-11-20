class ControlConnection {
	addAudioStreamLineFlow(zIndex: number, yy: number, toX: number, toY: number, anchor: TileAnchor) {
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
		new SpearConnection().addSpear(zIndex,
			left
			, yy
			, globalCommandDispatcher.cfg().pluginIconSize*1.5
			, toX
			, toY
			, anchor);
	}
}
