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
	let spot = document.querySelector(id);
	spot.classList.remove(cssSpotClassName(nn));
	spot.classList.remove(cssFocusClassName(nn));
	spot.classList.add(cssSpotClassName(nn));
}

function showSpotFocus(nn) {
	clearFocus();
	let id = '#drum' + nn;
	let spot = document.querySelector(id);
	spot.classList.remove(cssSpotClassName(nn));
	spot.classList.add(cssFocusClassName(nn));
	//let spot = document.querySelector('#drum' + num);
	spot.scrollIntoView();
	console.log('spot',spot);

function spotClicked(num) {
	console.log('spotClicked', num);
	showSpotFocus(num);
	
}

function showVolume(percents) {
	let rangeforvolume808 = document.querySelector("#rangeforvolume808");
	rangeforvolume808.value = percents / 10;
}

function setupVolumeRange() {
	let freqShiftrangeforvolume808 = document.querySelector("#rangeforvolume808");
	rangeforvolume808.addEventListener("change", (event) => {
		console.log('rangeforvolume808', rangeforvolume808.value);
	});
	let freqRatio = document.querySelector("#freqRatio");
	console.log(freqRatio);
	freqRatio.addEventListener("change", (event) => {
		console.log('freqRatio', freqRatio.value);
	});
}
showVolume(20);
setupVolumeRange();
//let listItemsUL = document.querySelector("#listItemsUL");
//console.log('listItlistItemsULems', listItemsUL);
//console.dir(listItemsUL);
//let drum2 = document.querySelector("#drum2");
//drum2.scrollIntoView();
showSpotFocus(9);