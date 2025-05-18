class AudioFileParametersUrility {
    parse(parameters: string): { ratio: number, volume: number, url: string } {
        let result: { ratio: number, volume: number, url: string } = { ratio: 0, volume: 100, url: '' };
        try {
            let split = parameters.split(',');
            result.ratio = parseInt(split[0]);
            result.volume = parseInt(split[1]);
            result.url = split[2];
        } catch (xx) {
            console.log(xx);
        }
        if (result.ratio >= -100 && result.ratio <= 100) {
            //
        } else {
            result.ratio = 0;
        }
        if (result.volume >= 0 && result.ratio <= 100) {
            //
        } else {
            result.volume = 100;
        }
        result.url = (result.url) ? result.url : '';
        return result;
    }
    dump(ratio: number, volume: number, url: string): string {
        return '' + ratio + ',' + volume + ',' + url;
    }
}
