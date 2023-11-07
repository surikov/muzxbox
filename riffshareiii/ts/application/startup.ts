console.log('startup v1.02');
function startApplication(){
    console.log('startApplication v1.6.01');
    let commands=new CommandDispatcher();
    let ui=new UIRenderer(commands);
    ui.createUI();
    ui.fillUI(testBigMixerData);//testEmptyMixerData);
    testNumMathUtil();
	//console.log('done startApplication');
}
function startLoadCSSfile(cssurl:string){
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssurl;
    link.media = 'all';
    head.appendChild(link);
}
