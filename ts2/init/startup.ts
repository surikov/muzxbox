console.log('MuzXBox v1.03.001');

class MuzXBoxApplication {
	constructor(){
		console.log('MuzXBoxApplication');
	}
	initAll(){
		console.log('initAll');
		this.bindLayers();
	}
	bindLayers(){

	}
	
}
window['MZXBA'] = new MuzXBoxApplication();

