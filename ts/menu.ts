class ZMainMenu {
	muzXBox: MuzXBox;
	level1: CSSStyleDeclaration;
	level2: CSSStyleDeclaration;
	level3: CSSStyleDeclaration;
	level4: CSSStyleDeclaration;
	level5: CSSStyleDeclaration;
	currentLevel = 0;
	constructor(from: MuzXBox) {
		this.muzXBox = from;
		var el: HTMLElement | null = document.getElementById('menuPaneDiv1');
		if (el) {
			this.level1 = el.style;
		}
		el = document.getElementById('menuPaneDiv2');
		if (el) {
			this.level2 = el.style;
		}
		el = document.getElementById('menuPaneDiv3');
		if (el) {
			this.level3 = el.style;
		}
		el = document.getElementById('menuPaneDiv4');
		if (el) {
			this.level4 = el.style;
		}
		el = document.getElementById('menuPaneDiv5');
		if (el) {
			this.level5 = el.style;
		}
		//console.log('this.level1',this.level1);
		//(document.getElementById('menuPaneDiv1') as any).style
	}
	openNextLevel() {
		if (this.currentLevel == 0) {
			this.open_1_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 1) {
			this.open_2_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 2) {
			this.open_3_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 3) {
			this.open_4_level();
			this.currentLevel++;
			return;
		}
		if (this.currentLevel == 4) {
			this.open_5_level();
			this.currentLevel++;
			return;
		}
	}
	backPreLevel() {
		if (this.currentLevel == 1) {
			this.level1.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 2) {
			this.level2.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 3) {
			this.level3.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 4) {
			this.level4.width = '0cm';
			this.currentLevel--;
			return;
		}
		if (this.currentLevel == 5) {
			this.level5.width = '0cm';
			this.currentLevel--;
			return;
		}
	}
	hideMenu() {
		this.level1.width = '0cm';
		this.level2.width = '0cm';
		this.level3.width = '0cm';
		this.level4.width = '0cm';
		this.level5.width = '0cm';
	}
	open_1_level() {
		console.log('open_1_level');
		this.level1.width = '5cm';
	}
	open_2_level() {
		console.log('open_2_level');
		this.level2.width = '4.5cm';
	}
	open_3_level() {
		console.log('open_3_level');
		this.level3.width = '4.0cm';
	}
	open_4_level() {
		console.log('open_4_level');
		this.level4.width = '3.5cm';
	}
	open_5_level() {
		console.log('open_5_level');
		this.level5.width = '3.0cm';
	}
}
