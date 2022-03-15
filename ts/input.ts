console.log('MuzXBox v1.01');
class ZInputDeviceHandler {
	muzXBox: MuzXBox;
	constructor(from: MuzXBox) {
		let me = this;
		this.muzXBox = from;
		window.addEventListener("keydown", function (keyboardEvent: KeyboardEvent) {
			me.processKeyboardEvent(keyboardEvent);
		});
	}
	processKeyboardEvent(keyboardEvent: KeyboardEvent) {
		//console.log(keyboardEvent.code);
		//e.preventDefault();
		switch (keyboardEvent.code) {
			case 'KeyX':
				keyboardEvent.preventDefault();
				this.processKeyX();
				break;
			case 'KeyY':
				keyboardEvent.preventDefault();
				this.processKeyY();
				break;
			case 'KeyA':
				keyboardEvent.preventDefault();
				this.processKeyA();
				break;
			case 'KeyB':
				keyboardEvent.preventDefault();
				this.processKeyB();
				break;
			case 'ArrowLeft':
				keyboardEvent.preventDefault();
				this.processArrowLeft();
				break;
			case 'ArrowRight':
				keyboardEvent.preventDefault();
				this.processArrowRight();
				break;
			case 'ArrowUp':
				keyboardEvent.preventDefault();
				this.processArrowUp();
				break;
			case 'ArrowDown':
				keyboardEvent.preventDefault();
				this.processArrowDown();
				break;
			default:
				switch (keyboardEvent.key) {
					case '+':
						keyboardEvent.preventDefault();
						this.processAnyPlus();
						break;
					case '-':
						keyboardEvent.preventDefault();
						this.processAnyMinus();
						break;
					default:
					//
				}
		}
	}
	processKeyX() {
		console.log('KeyX');
	}
	processKeyY() {
		console.log('KeyY');
		this.muzXBox.zMainMenu.openNextLevel();
	}
	processKeyA() {
		console.log('KeyA');
		this.muzXBox.zMainMenu.openNextLevel();
	}
	processKeyB() {
		console.log('KeyB');
		this.muzXBox.zMainMenu.backPreLevel();
	}
	processAnyPlus() {
		console.log('+');
	}
	processAnyMinus() {
		console.log('-');
	}
	processArrowLeft() {
		console.log('left');
	}
	processArrowRight() {
		console.log('right');
	}
	processArrowUp() {
		console.log('up');
	}
	processArrowDown() {
		console.log('down');
	}

	
}

