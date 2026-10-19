class UIShowLib {
	pageSize = 25;
	currentPage = 0;
	storeName = 'curpagelist1';
	filterName = 'curfilter1';
	callbackID = '';
	filteredlistcleanmidifiles: string[];
	prefilter = '';
	constructor() {
		console.log('UIShowLib 1');
		this.init();
		let dt = localStorage.getItem(this.storeName);
		try {
			this.currentPage = parseInt('' + dt);
		} catch (xx) {
			console.log(xx);
		}
		let ff = localStorage.getItem(this.filterName);
		this.prefilter = ff ? ff : '';
		let filterval = document.getElementById('filterval') as any;
		if (filterval) {
			filterval.value = this.prefilter;
		}
		this.currentPage = this.currentPage ? this.currentPage : 0;
		this.filterData();
		this.setupSlider();
		this.refilllist();

	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		let msg: MZXBX_MessageToHost = {
			dialogID: this.callbackID
			, pluginData: null//parsedProject
			, done: false
			, screenWait: false
		}
		window.parent.postMessage(msg, '*');
	}
	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			//
		} else {
			this.callbackID = message.hostData;
			if (message.colors) {
				this.setupColors(message.colors);
			}
		}
	}
	setupColors(colors: {
		background: string// #101;
		, main: string//#9cf;
		, drag: string//#03f;
		, line: string//#ffc;
		, click: string// #c39;
	}) {
		//console.log('setipColors', colors.background, window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'));
		document.documentElement.style.setProperty('--background-color', colors.background);
		document.documentElement.style.setProperty('--main-color', colors.main);
		document.documentElement.style.setProperty('--drag-color', colors.drag);
		document.documentElement.style.setProperty('--line-color', colors.line);
		document.documentElement.style.setProperty('--click-color', colors.click);
	}
	sendImportedMusicData(parsedProject: Zvoog_Project | null) {
		console.log('sendImportedMusicData', parsedProject);
		if (parsedProject) {
			var oo: MZXBX_MessageToHost = {
				dialogID: this.callbackID
				, pluginData: parsedProject
				, done: true
				, screenWait: false
			};
			window.parent.postMessage(oo, '*');
		} else {
			//alert('No parsed data');
		}
	}
	startLoad(idx: number) {
		this.showFog();
		let urlstring = 'https://daw1024.com/clean_midi/' + this.filteredlistcleanmidifiles[idx].replace('\\', '/') + '.mid';
		//alert('' + idx + ': ' + urlstring);
		//console.log(urlstring);
		this.loadFromFileURL(urlstring, this.filteredlistcleanmidifiles[idx].replace('\\', ' - '));
	}
	loadFromFileURL(fileurl: string, filetitle: string) {

		console.log('loadFromFileURL', filetitle, fileurl);
		if (fileurl) {
			let xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open("GET", fileurl);
			xmlHttpRequest.responseType = "arraybuffer";
			let me = this;
			xmlHttpRequest.onload = (event) => {
				let arrayBuffer: ArrayBuffer = xmlHttpRequest.response as ArrayBuffer; // Note: not req.responseText
				if (arrayBuffer) {
					me.loadFromArray(arrayBuffer, filetitle);
				}
			};
			xmlHttpRequest.send(null);
		}
	}
	loadFromArray(arrayBuffer: ArrayBuffer, filetitle: string | null) {
		console.log('loadFromArray', arrayBuffer);
		let title: string = filetitle ? filetitle : '?';
		let mireader: MIDIReader = new MIDIReader(title, 123, arrayBuffer);
		//this.parsedProject = mireader.project;
		//console.log('loadFromArray', this.parsedProject);
		this.sendImportedMusicData(mireader.project);
	}
	showFog() {
		let pagefog = document.getElementById('pagefog') as any;
		if (pagefog) {
			pagefog.style.display = 'block';
		}
	}
	filterData() {
		let filter = '';
		let filterval = document.getElementById('filterval') as any;
		if (filterval) {
			filter = filterval.value.toLowerCase().trim();
		}
		if (filter) {
			this.filteredlistcleanmidifiles = unfilteredlistcleanmidifiles.filter(value => value.toLowerCase().indexOf(filter) > -1);
		} else {
			this.filteredlistcleanmidifiles = unfilteredlistcleanmidifiles;
		}
		this.prefilter = filter;
		localStorage.setItem(this.filterName, '' + this.prefilter);

		let position = document.getElementById('position') as any;
		if (position) {
			position.value = this.currentPage;
			position.min = 0;
			position.max = Math.floor(this.filteredlistcleanmidifiles.length / this.pageSize);
		}
	}
	setupSlider() {
		let position = document.getElementById('position') as any;
		if (position) {
			position.value = 2;
			position.min = 0;
			position.max = Math.floor(this.filteredlistcleanmidifiles.length / this.pageSize);

			position.addEventListener('change', (event) => {
				let num = parseInt(position.value);
				//console.log(num,position.value,position);
				this.currentPage = num;
				this.refilllist();
			});
		}
		
	}

	moveLeft() {
		if (this.currentPage > 0) {
			this.currentPage--;
		} else {
			this.currentPage = 0;
		}
		this.refilllist();
	}
	moveRight() {
		if (this.currentPage < Math.floor(this.filteredlistcleanmidifiles.length / this.pageSize)) {
			this.currentPage++;
		} else {
			this.currentPage = Math.floor(this.filteredlistcleanmidifiles.length / this.pageSize);
		}
		this.refilllist();
	}
	refilllist() {
		this.clearlist();
		this.filterData();
		if (this.currentPage * this.pageSize > this.filteredlistcleanmidifiles.length) {
			this.currentPage = Math.floor(this.filteredlistcleanmidifiles.length / this.pageSize);
		}
		for (let ii = this.currentPage * this.pageSize; ii < this.currentPage * this.pageSize + this.pageSize; ii++) {
			this.addListItem(ii);
		}
		let numval = document.getElementById('numval');
		if (numval) {
			//console.log(pagenum,numval);
			let nn = this.currentPage + 1.0;
			numval.innerHTML = '' + nn + '/' + (1 + Math.floor(this.filteredlistcleanmidifiles.length / this.pageSize));
		}
		let position = document.getElementById('position') as any;
		if (position) {
			if (position.value != this.currentPage) {
				position.value = this.currentPage;
			}
		}
		localStorage.setItem(this.storeName, '' + this.currentPage);
	}
	addListItem(idx: number) {
		if (this.filteredlistcleanmidifiles[idx]) {
			let listitems = document.getElementById('listitems');
			if (listitems) {
				/*const aa = document.createElement("a");
				aa.textContent = listcleanmidifiles[idx].replace('\\', ' - ');
				aa.href = 'load.php?id=' + listcleanmidifiles[idx];
				const li = document.createElement("li");
				li.appendChild(aa);
				listitems.appendChild(li);
				*/
				let li = document.createElement("li");
				li.innerText = this.filteredlistcleanmidifiles[idx].replace('\\', ' - ');
				li.onclick = () => {
					this.startLoad(idx);
				};
				listitems.appendChild(li);
			}
		}
	}
	clearlist() {
		let listitems = document.getElementById('listitems');
		if (listitems) {
			listitems.replaceChildren();
		}
	}
}
let uiShowLib = new UIShowLib();
