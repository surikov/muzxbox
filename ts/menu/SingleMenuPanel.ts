class SingleMenuPanel {
	levelStyle: CSSStyleDeclaration;
	menuTextHead: HTMLElement;
	menuContent: HTMLElement;
	selection: number = 0;
	constructor(menuPaneDivID: string, menuTextHeadID: string, menuContentID: string) {
		var el: HTMLElement | null = document.getElementById(menuPaneDivID);
		if (el) {
			this.levelStyle = el.style;
		}
		el = document.getElementById(menuTextHeadID);
		if (el) {
			this.menuTextHead = el;
		}
		el = document.getElementById(menuContentID);
		if (el) {
			this.menuContent = el;
		}
	}
	off() {
		this.levelStyle.width = '0cm';
	}
	moveSelection(row: number) {
		//var div: HTMLElement = this.menu1content;
		//if (level == 2) { div = this.menu2content; }
		//if (level == 3) { div = this.menu3content; }
		//if (level == 4) { div = this.menu4content; }
		//if (level == 5) { div = this.menu5content; }

		for (var i = 0; i < this.menuContent.childNodes.length; i++) {
			var child: HTMLDivElement = this.menuContent.childNodes[i] as HTMLDivElement;
			child.dataset['rowSelection'] = 'no';
		}
		var child: HTMLDivElement = this.menuContent.childNodes[row] as HTMLDivElement;
		child.dataset['rowSelection'] = 'yes';
	}
}
