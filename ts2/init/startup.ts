console.log('MuzXBox v1.03.001');

class MuzXBoxApplication {
	gridLayerGroup: SVGElement;

	auxiliaryLayerGroup: SVGElement;
	secondaryLayerGroup: SVGElement;

	leftLayerGroup: SVGElement;
	rightLayerGroup: SVGElement;
	topLayerGroup: SVGElement;
	bottomLayerGroup: SVGElement;

	leadingLayerGroup: SVGElement;
	debugLayerGroup: SVGElement;
	inputLayerGroup: SVGElement;

	constructor() {
		console.log('MuzXBoxApplication');
	}
	startup() {
		console.log('initAll');
		this.bindLayers();
	}
	bindLayers() {
		this.gridLayerGroup = (document.getElementById('gridLayerGroup') as any) as SVGElement;
		this.auxiliaryLayerGroup = (document.getElementById('auxiliaryLayerGroup') as any) as SVGElement;
		this.secondaryLayerGroup = (document.getElementById('secondaryLayerGroup') as any) as SVGElement;
		this.leftLayerGroup = (document.getElementById('leftLayerGroup') as any) as SVGElement;
		this.rightLayerGroup = (document.getElementById('rightLayerGroup') as any) as SVGElement;
		this.topLayerGroup = (document.getElementById('topLayerGroup') as any) as SVGElement;
		this.leadingLayerGroup = (document.getElementById('leadingLayerGroup') as any) as SVGElement;
		this.debugLayerGroup = (document.getElementById('debugLayerGroup') as any) as SVGElement;
		this.inputLayerGroup = (document.getElementById('inputLayerGroup') as any) as SVGElement;
	}

}
window['MZXBA'] = new MuzXBoxApplication();

