console.log('UI 808');
type UI808Parameters = {
	volume: number
	, ratio: number
	, nn: number
};
class UI808 extends MZXBX_Plugin_UI {
	onMessageFromHost(message: MZXBX_MessageToPlugin) {
		//console.log('message', message);
		if (message.hostData) {
			let props = JSON.parse(message.hostData) as UI808Parameters;
			showSpotFocus(props.nn);
		}
	}
	onLanguaga(enruzhId: string) {

	}
}


function spotClicked(num) {
	//console.log('spotClicked', num);
	showSpotFocus(num);
	let par: UI808Parameters = {
		volume: 100
		, ratio: 1
		, nn: 1 * num
	};
	ui808.updateHostData(JSON.stringify(par));
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
	//console.log('showSpotFocus', nn, spot);
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
