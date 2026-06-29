# FM-Synthesis in the Browser. Part 1

Let's explore the possibilities of sound synthesis in browsers.
We'll explore the basics and, as a practical example, create a Yamaha DX7 synthesizer emulator.

![](https://habrastorage.org/webt/a7/68/17/a7681744d9a860fa26a004a3faf5d546.jpg)

***

## Web Audio API

Browsers allow you to call JavaScript objects to control and create sound.
Documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

The API provides components for creating and modifying audio signals. These components can be connected together, and their properties can be changed on a schedule.

## Hello World!

Let's look at a simple example, something like the standard "Hello World!" for programming languages.

<spoiler title="Example HTML page code with explanatory comments.">

```html
<html>
	<button onclick='start();'>beep</button> <!-- create a button-->
	<script>
		function start() {
			let audioContext = new AudioContext();//create the main object
			let when = audioContext.currentTime + 0.1;//start time
			let beep = audioContext.createOscillator();//beep object
			beep.frequency.value = 440;//frequency of note A
			beep.connect(audioContext.destination);//send sound to the output
			beep.start(when);//start sound
			beep.stop(when + 1);//stop sound after 1 second
		}
	</script>
</html>
```

</spoiler>

Open the page https://mzxbox.ru/fmsynth/beep.html in your browser and listen to the sound signal.

## Sound envelope

If you pluck a guitar string or press a piano key, you'll notice the difference between the natural sound and the computer-generated sound.
The key's sound increases in volume at the moment you press it and gradually fades over time.
In synthesizers, this effect is achieved by adjusting the ADSR envelope:

![](https://habrastorage.org/webt/0e/47/e1/0e47e1e78e8cdbaef2e1a620b79654d0.png)

More - https://en.wikipedia.org/wiki/ADSR

Let's expand on our previous example and add an envelope. Here's the component connection diagram:

![](https://habrastorage.org/webt/98/c3/43/98c343278cac4a2a3081922ee6581e5b.png)

<spoiler title="Example code with comments">

```html
<html>
	<button onclick='start();'>beep AHDSR</button>
	<script>
		function start() {
			let audioContext = new AudioContext();//create the main object
			let when = audioContext.currentTime + 0.1;//start time
			let beep = audioContext.createOscillator();//beep object
			let envelope = audioContext.createGain();//gain node to set envelope of sound

			beep.frequency.value = 440;//частота ноты Ля
			
			envelope.gain.setValueAtTime(0, when);//0 at begining
			envelope.gain.linearRampToValueAtTime(1, when + 0.05);//gradually increase to 1 in 0.5 sec
			envelope.gain.linearRampToValueAtTime(0.5, when + 0.2);//reduce to 0.5 in 0.2 s
			envelope.gain.setValueAtTime(0.5, when + 0.99);//setup last volume value
			envelope.gain.linearRampToValueAtTime(0, when + 1);//reduce to 0 at end

			envelope.connect(audioContext.destination);//send final sound to output
			beep.connect(envelope);//send beep sound to envelope cahnger
			
			beep.start(when);
			beep.stop(when + 1);
		}
	</script>
</html>
```

</spoiler>

Open the page https://mzxbox.ru/fmsynth/envelope.html in your browser - the sound will be smooth, louder at the beginning and quieter at the end.

## Modulation of sound signal

Audio modulation is the process of modifying a carrier signal using a modulator signal. More information can be found at: https://en.wikipedia.org/wiki/Modulation

Amplitude modulation is a type of modulation in which the variable parameter of the carrier signal is its amplitude.

Frequency modulation is a type of analog modulation in which the modulating signal controls the frequency of the carrier wave. Compared to amplitude modulation, the amplitude remains constant.

![](https://habrastorage.org/webt/1q/jx/jh/1qjxjhglliwwncxzmxfvkujz_hw.gif)

### Amplitude modulation

Sound from a modulator connected to the gain parameter of a node whose input is connected to a carrier:

![](https://habrastorage.org/webt/f7/f0/fe/f7f0fe13b8b812aedcaf60f4b1d250ca.png)

<spoiler title="Code example">

```html
<html>
	<button onclick='start();'>Amplitude modulation</button>
	<script>
		function start() {
			let audioContext = new AudioContext();
			let when = audioContext.currentTime + 0.1;
			
			let carrier = audioContext.createOscillator();
			let modulator = audioContext.createOscillator();
			let result = audioContext.createGain();
			let level = audioContext.createGain();
			
			carrier.frequency.value = 500;
			modulator.frequency.value = 4;
			level.gain.value = 0.5;//reduce to 0.5
			result.gain.value = 0.5;//shift to 0.5
			
			modulator.connect(level);
			level.connect(result.gain);
			carrier.connect(result);
			result.connect(audioContext.destination);
			
			carrier.start(when);
			modulator.start(when);

			carrier.stop(when + 2);
			modulator.stop(when + 2);
		}
	</script>
</html>
```

</spoiler>

The generator produces a sine wave signal [-1; +1], but the volume should change as [0; +1] - therefore, additional transformations are required.

Open the page to listen to the sound https://mzxbox.ru/fmsynth/amplitude.html 

### Frequency modulation

Connection mix:

![](https://habrastorage.org/webt/0a/ff/3c/0aff3c30837dca3c5fe08dc8a8e2a239.png)

<spoiler title="Code example">

```html
<html>
	<button onclick='start();'>frequency modulation</button>
	<script>
		function start() {
			let audioContext = new AudioContext();
			let when = audioContext.currentTime + 0.1;
			
			let carrier = audioContext.createOscillator();
			let modulator = audioContext.createOscillator();
			let level = audioContext.createGain();
			
			modulator.frequency.value = 4;
			level.gain.value = 200;
			carrier.frequency.value = 300;
			
			carrier.connect(audioContext.destination);
			level.connect(carrier.frequency);
			modulator.connect(level);

			carrier.start(when);
			modulator.start(when);

			carrier.stop(when + 2);
			modulator.stop(when + 2);
		}
	</script>
</html>
```

</spoiler>

Open the page to listen to the sound https://mzxbox.ru/fmsynth/frequency.html 

## Phase modulation

<img src="https://habrastorage.org/webt/85/6b/40/856b40eef6db0faf98805b6244beedf9.gif" />

Phase modulation shifts the phase of a signal, adding overtones and ultimately changing the timbre. For more information, see https://en.wikipedia.org/wiki/Phase_modulation

Connection mix:

![](https://habrastorage.org/webt/03/92/6e/03926ee8a938c2b202342a08b208b1df.png)

<spoiler title="Код примера">

```html
<html>
<button onclick='start();'>phase modulation</button>
<script>
	function start() {
		let audioContext = new AudioContext();
		let when = audioContext.currentTime + 0.1;
		let soundFrequency = 500;//frequency
		let maxmodulation = 4;

		let carrier = audioContext.createOscillator();
		let modulator = audioContext.createOscillator();
		let level = audioContext.createGain();
		let phaseDelay = audioContext.createDelay();

		carrier.frequency.value = soundFrequency;
		modulator.frequency.value = soundFrequency;
		level.gain.setValueAtTime(0, when);
		level.gain.linearRampToValueAtTime(maxmodulation / (2 * Math.PI * soundFrequency), when + 2);
		phaseDelay.delayTime.value = 0.5 / soundFrequency;//shift by wave size

		modulator.connect(level);
		level.connect(phaseDelay.delayTime);
		carrier.connect(phaseDelay);
		phaseDelay.connect(audioContext.destination);

		modulator.start(when);
		carrier.start(when);

		modulator.stop(when + 2);
		carrier.stop(when + 2);
	}
</script>

</html>
```

</spoiler>

Open the page to listen to the sound https://mzxbox.ru/fmsynth/phase.html 

### AudioWorklet

The Web Audio API provides ready-made components for working with audio. Additionally, there's an AudioWorkletProcessor component that allows you to write your own digital signal processing (DSP) code.

More - https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor

<spoiler title="Here is the phase modulation code from the previous example, but using AudioWorkletProcessor.">

```html
<html>
<button onclick='start();'>phase worklet</button>
<script>
	let phaseWorkletSource = `
		class PhaseSineAudioWorkletProcessor extends AudioWorkletProcessor {
			phase = 0;
			cntr = 0;
			constructor() {
				super();
			}
			static get parameterDescriptors() {
				return [
					{ name: "carrierFrequency", automationRate: "a-rate" }
					, { name: "modulationLevel", automationRate: "a-rate" }
				];
			}
			readSample(inputs, xx) {
				let inputSumm = 0;
				for (let ii = 0; ii < inputs.length; ii++) {
					let singleInput = inputs[ii];
					let channelCount = singleInput.length;
					if (channelCount) {
						let channelSumm = 0;
						for (let ch = 0; ch < singleInput.length; ch++) {
							let singleChannel = singleInput[ch];
							channelSumm = channelSumm + singleChannel[xx];
						}
						inputSumm = inputSumm + channelSumm / channelCount;
					}
				}
				return inputSumm;
			}
			writeSample(outputs, xx, value) {
				for (let oo = 0; oo < outputs.length; oo++) {
					let singleOutput = outputs[oo];
					for (let ch = 0; ch < singleOutput.length; ch++) {
						let singleChannel = singleOutput[ch];
						singleChannel[xx] = value;
					}
				}
			}
			process(inputs, outputs, parameters) {
				let outSampleCount = outputs[0][0].length;
				let frequency = parameters["carrierFrequency"][0];
				let modulationLevel = parameters["modulationLevel"][0];
				let incrementBySample = Math.PI * 2 * frequency / sampleRate;

				for (let xx = 0; xx < outSampleCount; xx++) {
					let inputSumm = this.readSample(inputs, xx);
					let resultValue = Math.sin(this.phase + modulationLevel * inputSumm);
					this.writeSample(outputs, xx, resultValue);
					this.phase = this.phase + incrementBySample;
					if (this.phase >= Math.PI * 2) {
						this.phase = this.phase - Math.PI * 2;
					}
				}
				return true;
			}
		}
		registerProcessor("sinePhaseModuleID", PhaseSineAudioWorkletProcessor);
		`;
	function loadAudioWorkletCode(audioworkletcode, audioContext, onDone) {
		let blob = new Blob([audioworkletcode], { type: 'application/javascript' });
		let reader = new FileReader();
		reader.onloadend = function () {
			let blobURL = reader.result;
			audioContext.audioWorklet.addModule(blobURL)
				.then((vv) => {
					onDone();
				});
		}
		reader.readAsDataURL(blob);
	}
	function start() {
		let audioContext = new AudioContext();
		loadAudioWorkletCode(phaseWorkletSource, audioContext, () => {
			playSound(audioContext);
		});
	}
	function playSound(audioContext) {
		let when = audioContext.currentTime + 0.1;
		let soundFrequency = 500;
		let maxmodulation = 4;

		let carrier = new AudioWorkletNode(audioContext, 'sinePhaseModuleID');
		let modulatorBeep = audioContext.createOscillator();
		let volume = audioContext.createGain();

		volume.gain.value = 0;

		let descriptors = carrier.parameters;
		let carrierFrequency = descriptors.get('carrierFrequency');
		let modulationLevel = descriptors.get('modulationLevel');

		carrierFrequency.value = soundFrequency;
		modulatorBeep.frequency.value = soundFrequency;
		modulationLevel.setValueAtTime(0, when);
		modulationLevel.linearRampToValueAtTime(maxmodulation, when + 2);

		volume.connect(audioContext.destination);
		carrier.connect(volume);
		modulatorBeep.connect(carrier);

		modulatorBeep.start(when);
		volume.gain.setValueAtTime(1, when);
		volume.gain.setValueAtTime(0, when + 2);
	}
</script>

</html>
```

</spoiler>

Open the page to listen to the sound https://mzxbox.ru/fmsynth/phaseworklet.html 

As you can see, the result sounds the same as in the previous example, but the code has become much larger.

This approach only makes sense if you need to recompile your C++ VST plugin code to WebAssembly (https://wikipedia.org/wiki/WebAssembly) to run it in a browser.

## Practice of use

After reading this, you may be wondering, “Why use FM synthesis in a browser?”

Answer: "Of course, to create music synthesizers!"

Desktop DAWs (Ableton Live, FL Studio, etc.) support plugin APIs (see https://wikipedia.org/wiki/Virtual_Studio_Technology). Anyone can write their own electronic instrument that will work in any DAW or sequencer.

In modern music, the importance of plugins is so great that beginners ask not "Which editor should I use for XXX music?", but "Which plugin should I buy for XXX music?"

The situation is much worse online. Even [Bandlab](https://blog.bandlab.com/30-million-of-you-on-bandlab/) (30 million users) lacks an API for expanding its studio's capabilities with third-party plugins.

I'm currently working on an online sequencer that implements its own plugin API. It's still a long way off from release, but you can try it out now.

### Emulation of Yamaha DX7
The Yamaha DX7 is a digital synthesizer released by Yamaha in 1983. It was very popular in the 1980s and, largely due to its low cost and compact size, became one of the best-selling models in synthesizer history - https://wikipedia.org/wiki/Yamaha_DX7

The Yamaha DX7 synthesizer uses phase modulation to synthesize instruments. Over the years, thousands of presets have been created for it, ranging from guitars to traditional and futuristic instruments.

You can see the plugin in action here:

https://rutube.ru/video/69cec43733da30418e9d56bd5225303c/

<oembed>https://rutube.ru/video/69cec43733da30418e9d56bd5225303c/</oembed>

Due of using of the Web Audio API, the plugin code is much more compact in compare to existing VST implementations.

The text is too long, so code analysis and sound synthesis in DX7 will be discussed in the second part of the article.

Original - https://habr.com/ru/articles/1052640/
