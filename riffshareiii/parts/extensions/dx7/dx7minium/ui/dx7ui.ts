class DX7UI{
	constructor(){
		this.renderLibList();
	}
	renderLibList() {
		let liblist = document.getElementById('liblist');
		console.log('liblist',liblist);
		if (liblist) {
			libDX7list.sort((a, b) => {
				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			});
			for (let ii = 0; ii < libDX7list.length; ii++) {

				let li = document.createElement('li');
				li.innerText = '' + ii + ': ' + libDX7list[ii].name;
				let pid = ii;
				li.onclick = () => {
					console.log(pid, libDX7list[pid].name);
					//selectedPreset
					let loader: DX7Loader = new DX7Loader();
					let selectedPreset:SynthPreset = loader.convertDX7data(libDX7list[pid]);
				};
				//console.log(ii, libDX7list[ii].name, li);
				liblist.appendChild(li);
			}
		}
	}
}
