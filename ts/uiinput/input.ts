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
	bindEvents() {
		var lastLevelOfDetails = 1;
		this.muzXBox.zrenderer.tileLevel.afterZoomCallback = () => {
			var curLOD = this.muzXBox.zrenderer.levelOfDetails(this.muzXBox.zrenderer.tileLevel.translateZ);
			if (curLOD != lastLevelOfDetails) {
				lastLevelOfDetails = curLOD;
				new CannyDo().start(50, () => {
					console.log('run afterZoomCallback', lastLevelOfDetails);
				});
			}
		};
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
		//console.log('KeyX');
	}
	processKeyY() {
		//console.log('KeyY');
		//this.muzXBox.zMainMenu.openNextLevel();
	}
	processKeyA() {
		//console.log('KeyA');
		//this.muzXBox.zMainMenu.openNextLevel();
	}
	processKeyB() {
		//console.log('KeyB');
		//this.muzXBox.zMainMenu.backPreLevel();
	}
	processAnyPlus() {
		//console.log('+');
		if (this.muzXBox.zMainMenu.currentLevel) {
			//console.log('skip');
		} else {
			let zoom: number = this.muzXBox.zrenderer.tileLevel.translateZ - this.muzXBox.zrenderer.tileLevel.translateZ * 0.25;
			this.changeZoomTo(zoom);
		}
	}
	processAnyMinus() {
		//console.log('-');
		if (this.muzXBox.zMainMenu.currentLevel) {
			//console.log('skip');
		} else {
			let zoom: number = this.muzXBox.zrenderer.tileLevel.translateZ + this.muzXBox.zrenderer.tileLevel.translateZ * 0.25;
			this.changeZoomTo(zoom);
		}
	}
	processArrowLeft() {
		//console.log('left');
		if (this.muzXBox.zMainMenu.currentLevel) {
			//console.log('skip');
		} else {
			//let nn: number = this.muzXBox.zrenderer.tileLevel.translateX - this.muzXBox.zrenderer.tileLevel.translateZ * 25;
			//this.changePositionTo(nn, this.muzXBox.zrenderer.tileLevel.translateY);
			this.muzXBox.zrenderer.focusManager.spotLeft();
		}
	}
	processArrowRight() {
		//console.log('right');
		if (this.muzXBox.zMainMenu.currentLevel) {
			//console.log('skip');
		} else {
			//let nn: number = this.muzXBox.zrenderer.tileLevel.translateX + this.muzXBox.zrenderer.tileLevel.translateZ * 25;
			//this.changePositionTo(nn, this.muzXBox.zrenderer.tileLevel.translateY);
			this.muzXBox.zrenderer.focusManager.spotRight();
		}
	}
	processArrowUp() {
		//console.log('up');
		if (this.muzXBox.zMainMenu.currentLevel) {
			//console.log('skip');
		} else {
			//let nn: number = this.muzXBox.zrenderer.tileLevel.translateY - this.muzXBox.zrenderer.tileLevel.translateZ * 25;
			//this.changePositionTo(this.muzXBox.zrenderer.tileLevel.translateX, nn);
			this.muzXBox.zrenderer.focusManager.spotUp();
		}
	}
	processArrowDown() {
		//console.log('down');
		if (this.muzXBox.zMainMenu.currentLevel) {
			//console.log('skip');
		} else {
			//let nn: number = this.muzXBox.zrenderer.tileLevel.translateY + this.muzXBox.zrenderer.tileLevel.translateZ * 25;
			//this.changePositionTo(this.muzXBox.zrenderer.tileLevel.translateX, nn);
			this.muzXBox.zrenderer.focusManager.spotDown();
		}
	}

	changePositionTo(xx: number, yy: number) {
		//console.log(this.muzXBox.zrenderer.tileLevel.translateX, xx, this.muzXBox.zrenderer.tileLevel.translateY, yy);
		this.muzXBox.zrenderer.tileLevel.translateX = xx;
		this.muzXBox.zrenderer.tileLevel.translateY = yy;
		this.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		this.muzXBox.zrenderer.tileLevel.onMove(xx, yy);
		//this.slideToContentPosition();
		let a = this.muzXBox.zrenderer.tileLevel.calculateValidContentPosition();
		//console.log(a,this.translateX,this.translateY,this.translateZ);
		if (a.x != this.muzXBox.zrenderer.tileLevel.translateX || a.y != this.muzXBox.zrenderer.tileLevel.translateY || a.z != this.muzXBox.zrenderer.tileLevel.translateZ) {
			this.muzXBox.zrenderer.tileLevel.translateX = a.x;
			this.muzXBox.zrenderer.tileLevel.translateY = a.y;
		}
		this.muzXBox.zrenderer.tileLevel.allTilesOK = false;
	}
	changeZoomTo(zoom: number) {
		if (zoom < this.muzXBox.zrenderer.tileLevel.minZoom()) {
			zoom = this.muzXBox.zrenderer.tileLevel.minZoom();
		}
		if (zoom > this.muzXBox.zrenderer.tileLevel.maxZoom()) {
			zoom = this.muzXBox.zrenderer.tileLevel.maxZoom();
		}
		//console.log('zoom', this.muzXBox.zrenderer.tileLevel.translateZ, zoom);
		this.muzXBox.zrenderer.tileLevel.translateZ = zoom;
		this.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		this.muzXBox.zrenderer.tileLevel.adjustContentPosition();
		this.muzXBox.zrenderer.tileLevel.allTilesOK = false;
	}

}

