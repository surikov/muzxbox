class WarningUI {
	warningRectangle: TileRectangle;
	warningAnchor: TileAnchor;
	warningGroup: SVGElement;
	warningLayer: TileLayerDefinition;
	warningIcon: TileText;

	warningInfo1: TileImage;
	warningInfo2: TileImage;
	warningInfo3: TileImage;
	warningInfo4: TileImage;

	warningTitle: TileText;
	warningDescription: TileText;
	warningSmallText: TileText;

	onCancel: null | (() => void);

	noWarning = true;

	cancelWarning() {
		//console.log('warning cancel', this.onCancel,(typeof this.onCancel));
		
		if(this.onCancel){
			//console.log('warning start onCancel');
			this.onCancel();
		} else {
			//console.log('warning skip onCancel');
			
		}
		this.hideWarning();
	};
	initDialogUI() {
		let me = this;
		this.warningIcon = { x: 0, y: 0, text: icon_warningPlay, css: 'warningIcon' };

		this.warningInfo1 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/mouse.png', css: 'warningInfoIcon' };
		this.warningInfo2 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/wheel.png', css: 'warningInfoIcon' };
		this.warningInfo3 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/hand.png', css: 'warningInfoIcon' };
		this.warningInfo4 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/trackpad.png', css: 'warningInfoIcon' };


		this.warningTitle = { x: 0, y: 0, text: 'Play', css: 'warningTitle' };
		this.warningDescription = { x: 0, y: 0, text: 'Controls:', css: 'warningDescription' };
		this.warningSmallText = { x: 0, y: 0, text: 'Use mouse or touchpad to move and zoom piano roll', css: 'warningSmallText' };
		this.warningGroup = (document.getElementById("warningDialogGroup") as any) as SVGElement;
		this.warningRectangle = {
			x: 0, y: 0, w: 1, h: 1, css: 'warningBG', activation: () => {
				globalCommandDispatcher.initAudioFromUI();
				me.cancelWarning();
				globalCommandDispatcher.setupAndStartPlay();
			}

			//this.cancel.bind(this) 
		};
		this.warningAnchor = {
			id: 'warningAnchor', xx: 0, yy: 0, ww: 1, hh: 1
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1
			, content: [this.warningRectangle, this.warningIcon
				, this.warningTitle
				, this.warningDescription
				, this.warningSmallText
				, this.warningInfo1, this.warningInfo2, this.warningInfo3, this.warningInfo4
			]
		};
		this.warningLayer = { g: this.warningGroup, anchors: [this.warningAnchor], mode: LevelModes.overlay };
	}
	resetDialogView(data: Zvoog_Project) {
		//console.log('resetDialogView');
		//this.resizeDialog();
	}
	resizeDialog(ww: number, hh: number, resetWarningAnchor: () => void) {
		//console.log('resizeDialog',ww,hh);
		this.warningRectangle.w = ww;
		this.warningRectangle.h = hh;
		this.warningAnchor.ww = ww;
		this.warningAnchor.hh = hh;
		this.warningIcon.x = ww / 2;
		this.warningIcon.y = hh / 3;
		this.warningTitle.x = ww / 2;
		this.warningTitle.y = hh / 3 + 1.5;
		this.warningDescription.x = ww / 2;
		this.warningDescription.y = hh / 3 + 2.5;

		this.warningSmallText.x = ww / 2;
		this.warningSmallText.y = hh / 3 + 2.5 + 0.5;

		//console.log('debugLayer',this.debugLayer);
		this.warningInfo1.x = ww / 2 - 3;
		this.warningInfo1.y = hh - 1.5;
		this.warningInfo2.x = ww / 2 - 1.5;
		this.warningInfo2.y = hh - 1.5;
		this.warningInfo3.x = ww / 2 + 0;
		this.warningInfo3.y = hh - 1.5;
		this.warningInfo4.x = ww / 2 + 1.5;
		this.warningInfo4.y = hh - 1.5;
		resetWarningAnchor();
	}
	allLayers(): TileLayerDefinition[] {
		return [this.warningLayer];
	}
	setIcon(icon:string){
		this.warningIcon.text=icon;
	}
	showWarning(title: string, msg: string, smallMsg: string, onCancel: null | (() => void)) {
		console.log('WarningUI show', title, msg);
		this.setIcon(icon_time);
		this.onCancel = onCancel;
		this.warningTitle.text = title;
		this.warningDescription.text = msg;
		this.warningSmallText.text = smallMsg;
		globalCommandDispatcher.renderer.tiler.resetAnchor(this.warningGroup, this.warningAnchor, LevelModes.overlay);
		(document.getElementById("warningDialogGroup") as any).style.visibility = "visible";
		this.noWarning = false;
	}
	hideWarning() {
		//console.log('WarningUI hide');
		(document.getElementById("warningDialogGroup") as any).style.visibility = "hidden";
		this.onCancel = null;
		this.noWarning = true;
	}
}
