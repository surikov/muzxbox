abstract class UIAction {
	abstract doAction: (blobParameters: string) => boolean;
	name: string;
}
class UILinkFilterToTarget implements UIAction {
	doAction(blobParameters: string) {
		return false;
	}
	name: string = 'UILinkFilterToTarget';
}
class UISeparateFilterFromTarget implements UIAction {
	doAction(blobParameters: string) {
		return false;
	}
	name: string = 'UISeparateFilterFromTarget';
}
class UILinkPerformerToTarget implements UIAction {
	doAction(blobParameters: string) {
		return false;
	}
	name: string = 'UILinkPerformerToTarget';
}
class UISeparatePerformerFromTarget implements UIAction {
	doAction(blobParameters: string) {
		return false;
	}
	name: string = 'UISeparatePerformerFromTarget';
}
class UILinkSamplerToTarget implements UIAction {
	doAction(blobParameters: string) {
		return false;
	}
	name: string = 'UILinkSamplerToTarget';
}
class UISeparateSamplerFromTarget implements UIAction {
	doAction(blobParameters: string) {
		return false;
	}
	name: string = 'UISeparateSamplerFromTarget';
}
class UnDoReDo {
	uiactions: UIAction[] = [
		new UILinkFilterToTarget()
		, new UISeparateFilterFromTarget()
		, new UILinkPerformerToTarget()
		, new UISeparatePerformerFromTarget()
		, new UILinkSamplerToTarget()
		, new UISeparateSamplerFromTarget()
	];
	doAction(actionID: string, data: string): boolean {
		for (let ii = 0; ii < this.uiactions.length; ii++) {
			if (this.uiactions[ii].name == actionID) {
				return this.uiactions[ii].doAction(data);
			}
		}
		return false;
	}
}
