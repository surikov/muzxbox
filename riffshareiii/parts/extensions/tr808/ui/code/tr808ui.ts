console.log('UI 808');
type UI808Parameters = {
	volume: number
	, ratio: number
	, nn: number
};
class UI808 extends MZXBX_Plugin_UI {
	currentParameters: UI808Parameters = {
		volume: 100
		, ratio: 0
		, nn: 70
	};
	constructor(screenWait: boolean) {
		super(screenWait);
		setupVolumeRange()
	}
	onMessageFromHost(message: MZXBX_MessageToPlugin) {
		//console.log('message', message);
		if (message.hostData) {
			let props = JSON.parse(message.hostData) as UI808Parameters;

			this.currentParameters = {
				volume: props.volume
				, ratio: props.ratio
				, nn: props.nn
			};
		}
		showSpotFocus(this.currentParameters.nn);
		showVolumeFreq(this.currentParameters.volume, this.currentParameters.ratio);
	}
	sendProps() {
		this.updateHostData(JSON.stringify(this.currentParameters));
	}
	onLanguaga(enruzhId: string) {

	}
}
function showVolumeFreq(percents, ratio) {
	let rangeforvolume808 = document.querySelector("#rangeforvolume808") as any;
	if (rangeforvolume808) {
		rangeforvolume808.value = Math.round(percents / 10);
	}
	let freqRatio = document.querySelector("#freqRatio") as any;
	if (freqRatio) {
		freqRatio.value = Math.round(ratio);
	}
}
function setupVolumeRange() {
	//let freqShiftrangeforvolume808 = document.querySelector("#rangeforvolume808");
	let rangeforvolume808 = document.querySelector("#rangeforvolume808") as any;
	if (rangeforvolume808) {
		rangeforvolume808.addEventListener("change", (event) => {
			console.log('rangeforvolume808', rangeforvolume808.value);
			ui808.currentParameters.volume = 10 * rangeforvolume808.value;
			ui808.sendProps();
		});
	}
	let freqRatio = document.querySelector("#freqRatio") as any;
	//console.log(freqRatio);
	if (freqRatio) {
		freqRatio.addEventListener("change", (event) => {
			console.log('freqRatio', freqRatio.value);
			ui808.currentParameters.ratio = 1 * freqRatio.value;
			ui808.sendProps();
		});
		/*freqRatio.addEventListener("click", (event) => {
			console.log('click freqRatio', freqRatio.value);
		});*/
	}
}
function spotClicked(num) {
	console.log('spotClicked', num);
	showSpotFocus(num);
	ui808.currentParameters.nn = 1 * num;
	ui808.sendProps();
	/*let par: UI808Parameters = {
		volume: 100
		, ratio: 1
		, nn: 1 * num
	};
	ui808.updateHostData(JSON.stringify(par));
	*/
}
function showSpotFocus(nn) {
	clearFocus();
	let id = '#drum' + nn;
	let spot = document.querySelector(id);

	if (spot) {
		spot.classList.remove(cssSpotClassName(nn));
		spot.classList.add(cssFocusClassName(nn));
		//let spot = document.querySelector('#drum' + num);
		spot.scrollIntoView();
		/*console.log('spot', spot);
		let carouselItemsDiv = document.querySelector('#carouselItemsDiv');//scrollListLayoutDiv");
		console.log('carouselItemsDiv', carouselItemsDiv);
		let markers = document.querySelector(
			'#carouselItemsDiv::scroll-marker-group'
		);
		console.log('markers', markers);
		*/
		/*if (div) {
			div.scrollTo({ left: 3500, top: 0 });
		}*/

	}
	console.log('showSpotFocus', nn, spot);
}
function clearFocus() {
	for (let ii = 0; ii < 32; ii++) {
		resetSpotClass(ii);
	}
}
function cssFocusClassName(nn) {
	let cssName = 'kickFocus';
	if (nn > 7) cssName = 'snareFocus';
	if (nn > 11) cssName = 'clapFocus';
	if (nn > 15) cssName = 'hiFocus';
	if (nn > 19) cssName = 'hatFocus';
	if (nn > 23) cssName = 'cowbellFocus';
	if (nn > 27) cssName = 'tomFocus';
	return cssName;
}
function cssSpotClassName(nn) {
	let cssName = 'kickSpot';
	if (nn > 7) cssName = 'snareSpot';
	if (nn > 11) cssName = 'clapSpot';
	if (nn > 15) cssName = 'hiSpot';
	if (nn > 19) cssName = 'hatSpot';
	if (nn > 23) cssName = 'cowbellSpot';
	if (nn > 27) cssName = 'tomSpot';
	return cssName;
}
function resetSpotClass(nn) {
	let id = '#drum' + nn;
	let spot = document.querySelector(id) as any;
	spot.classList.remove(cssSpotClassName(nn));
	spot.classList.remove(cssFocusClassName(nn));
	spot.classList.add(cssSpotClassName(nn));
}
let ui808 = new UI808(false);
