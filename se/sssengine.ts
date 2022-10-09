console.log('SSSEngine v1.01.001');

class SSSEngine {
	constructor() {
		console.log('constructor SSSEngine');
	}
	init(){
		console.log('init');
	}
}
window['sssengine'] = new SSSEngine();

