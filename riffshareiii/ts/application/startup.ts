console.log('startup v1.02');
declare function createSchedulePlayer(callback: (start: number, position: number, end: number) => void): MZXBX_Player;
declare function createTileLevel(): TileLevelBase;
function startApplication() {
    console.log('startApplication v1.6.01');
    //let commands = new CommandDispatcher();
    let ui = new UIRenderer();
    ui.createUI();
    globalCommandDispatcher.registerWorkProject(_mzxbxProjectForTesting2);
    globalCommandDispatcher.resetProject();
    //ui.fillWholeUI();//testBigMixerData);//testEmptyMixerData);
    //testNumMathUtil();
    //console.log('done startApplication');
    /*setupZoomDialog();
    showDialog(icon_warningPlay, '', '', () => {
        initWebAudioFromUI();
        
    });*/
}
function initWebAudioFromUI() {
    console.log('initWebAudioFromUI');
    globalCommandDispatcher.initAudioFromUI();
}
function startLoadCSSfile(cssurl: string) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssurl;
    link.media = 'all';
    head.appendChild(link);
}
/*
function setupZoomDialog() {
    let dialogdiv = document.getElementById('warningDialog');
    if (dialogdiv) {
        dialogdiv.addEventListener(
            "wheel",
            function touchHandler(e) {
                if (e.ctrlKey) {
                    e.preventDefault();
                }
            }, { passive: false });
    }

}
function setZoom100() {
    try {
        //
        var scale = 'scale(1)';
        (document as any).body.style.zoom = 1.0;
        (document as any).body.style.webkitTransform = scale;    // Chrome, Opera, Safari
        (document as any).body.style.msTransform = scale;       // IE 9
        (document as any).body.style.transform = scale;     // General
        (document as any).body.style.zoom = '100%';
    } catch (xx) {
        console.log(xx);
    }
}
function showDialog(icon: string, title: string, text: string, cancel: null | (() => void)) {
    let dialogdiv = document.getElementById('warningDialog');
    if (dialogdiv) {
        //console.log('setup');
        let icondiv = document.getElementById('warningIcon');
        if (icondiv) {
            icondiv.innerHTML = icon;
        }
        let titlediv = document.getElementById('warningTitle');
        if (titlediv) {
            titlediv.innerHTML = title;
        }
        let textdiv = document.getElementById('warningText');
        if (textdiv) {
            textdiv.innerHTML = text;
        }
        dialogdiv.style.display = 'flex';
        dialogdiv.onclick = () => {
            //console.log('click', (document as any).body.style.zoom, (document as any).body.style);
            //console.log('zoom',(document as any).body.style.zoom);
            
            setZoom100();
            let dialogdiv = document.getElementById('warningDialog');
            if (dialogdiv) {
                dialogdiv.style.display = 'none';
            }
            if (cancel) {
                cancel();
            }
            
        };
    }
}
*/