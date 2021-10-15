console.log('MuzXBox v1.01');
class MuzXBox{
	zInputDeviceHandler:ZInputDeviceHandler;
	constructor() {
		console.log('start');
	}
	initAll() {
		console.log('initAll');
		let me=this;
		this.zInputDeviceHandler=new ZInputDeviceHandler();
		window.addEventListener("keydown", function (keyboardEvent:KeyboardEvent) {
			me.zInputDeviceHandler.processKeyboardEvent(keyboardEvent);
		});
	}
}
window['MuzXBox'] = new MuzXBox();
