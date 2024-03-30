function MZXBX_appendScriptURL(url: string): boolean {
    let scripts: HTMLCollectionOf<HTMLScriptElement> = document.getElementsByTagName("script");
    for (let ii = 0; ii < scripts.length; ii++) {
        let script: HTMLScriptElement | null = scripts.item(ii);
        if (script) {
            if (url == (script as any).lockedLoaderURL) {
                return false;
            }
        }
    }
    var scriptElement: HTMLScriptElement = document.createElement('script');
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("src", url);
    (scriptElement as any).lockedLoaderURL = url;
    let head: HTMLHeadElement = document.getElementsByTagName("head")[0];
    head.appendChild(scriptElement);
    return true;
}

function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void {
    if (window['decodedArrayBuffer']) {
        //
    } else {
        window['decodedArrayBuffer'] = [];
    }
    let waves: MZXBX_CachedWave[] = window['decodedArrayBuffer'];
    for (let ii = 0; ii < waves.length; ii++) {
        if (waves[ii].path == path) {
            if (waves[ii].buffer) {
                //console.log('found', waves[ii]);
                if (!(waves[ii].line100)) {
                    waves[ii].line100 = MZXBX_FillLinesOfBuffer(waves[ii].buffer);
                }
                onDone(waves[ii]);
                //return;
            } else {
                if (waves[ii].canceled) {
                    console.log('cancel', waves[ii]);

                } else {
                    //console.log('wait', waves[ii]);
                    setTimeout(() => {
                        //MZXBX_loadCachedBuffer(audioContext, path, onDone);
                    }, 999);
                }
            }
            return;
        }
    }
    let wave: MZXBX_CachedWave = {
        path: path, buffer: null
    };
    //console.log('start load', wave);
    window['decodedArrayBuffer'].push(wave);
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open("GET", path);
    let xonload = function () {
        audioContext.decodeAudioData(xhr.response, function (decodedData: AudioBuffer) {
            //console.log(decodedData);
            let waves: MZXBX_CachedWave[] = window['decodedArrayBuffer'];
            for (let ii = 0; ii < waves.length; ii++) {
                if (waves[ii].path == path) {
                    waves[ii].buffer = decodedData;
                    //waves[ii].waiting=false;
                    if (!(waves[ii].line100)) {
                        waves[ii].line100 = MZXBX_FillLinesOfBuffer(waves[ii].buffer);
                    }
                    onDone(waves[ii]);
                    return;
                }
            }
            //console.log('not cached', path);
        }, function (err: DOMException) {
            console.log(err);
            wave.canceled = true;
        });
    };
    xhr.onload = xonload;
    xhr.onerror = () => {
        wave.canceled = true;
        console.log('error', wave);
    };
    xhr.send();
}
function MZXBX_FillLinesOfBuffer(buffer: null | AudioBuffer): number[] {
    let dots: number[] = [];
    if (buffer) {
        let data: Float32Array = buffer.getChannelData(0);
        let step = Math.round(data.length / 100);
        for (let ii = 0; ii < data.length; ii = ii + step) {
            let mx = 0;
            for (let kk = 0; kk < step; kk++) {
                if (Math.abs(data[ii + kk]) > mx) mx = Math.abs(data[ii + kk]);//sum = sum + Math.abs(data[ii + kk]);
            }
            dots.push(mx);
        }
    }
    return dots;
}