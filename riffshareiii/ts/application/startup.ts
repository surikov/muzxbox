console.log('startup v1.01');
function startApplication(){
    console.log('startApplication v1.6.01');
    let ui=new UIRenderer();
    ui.createUI();
    ui.fillUI(testEmptyMixerData);
    testNumMathUtil();
	//console.log('done startApplication');
}
