# FM-синтез звука в браузере. Часть 1.

Рассмотрим возможности браузеров по синтезу звука.
Разберём основы и в качестве практического применения сделаем эмулятор синтезатора Yamaha DX7.

![yamahadx7.jpg](https://mzxbox.ru/fmsynth/yamahadx7.jpg)

## Web Audio API

Браузеры позволяют вызывать из JavaScript объекты для управления и создания звука.
Документация на русском: https://developer.mozilla.org/ru/docs/Web/API/Web_Audio_API

API предоставляет компоненты для создания и изменения аудио-сигнала. Причём сами компоненты можно соединять между собой, а их свойства менять по расписанию.

## Hello World!

Рассмотрим простейший пример, нечто вроде стандартного "Hello World!" для языков программирования
Код примера страницы HTML с поясняющими комментариями:

```html
<html>
	<button onclick='start();'>beep</button> <!-- создаём на странице кнопку-->
	<script>
		function start() {
			let audioContext = new AudioContext();//создаём главный объект
			let when = audioContext.currentTime + 0.1;//время через 0.1с
			let beep = audioContext.createOscillator();//осциллятор это объект который делает "Пи-и-и-и"
			beep.frequency.value = 440;//частота ноты Ля
			beep.connect(audioContext.destination);//направляем звук в аудиовыход
			beep.start(when);//запускаем звук в указанное время
			beep.stop(when + 1);//останавливаем через 1 секунду
		}
	</script>
</html>
```

Запускаем в браузере https://mzxbox.ru/fmsynth/beep.html и наслаждаемся бибиканием.

## Огибающая звука

Если дёрнуть струну гитары или нажать клавишу пианино, можно заметить что естественный звук отличается от компьютерного.
Клавиша звучит громче в момент нажатия и постепенно угасает со временем.
В синтезеторах этот эффект достигается регулированием ADSR-огибающей:

![adsr](https://mzxbox.ru/fmsynth/ADSR.png)

Описание https://ru.wikipedia.org/wiki/ADSR-огибающая

Расширим наш прошлый пример и добавим огибающую. Схема соединения компонентов:

![envelope](https://mzxbox.ru/fmsynth/envelope.png)

Код примера с комментариями:

```html
<html>
	<button onclick='start();'>beep AHDSR</button>
	<script>
		function start() {
			let audioContext = new AudioContext();//создаём главный объект
			let when = audioContext.currentTime + 0.1;//играть через 0.1с после нажатия кнопки
			let beep = audioContext.createOscillator();//осциллятор это объект который делает "Пи-и-и-и"
			let envelope = audioContext.createGain();//объект Gain это громкость

			beep.frequency.value = 440;//частота ноты Ля
			
			envelope.gain.setValueAtTime(0, when);//в начале звучания громкость 0
			envelope.gain.linearRampToValueAtTime(1, when + 0.05);//постепенно увеличить до 1 за 0.5с
			envelope.gain.linearRampToValueAtTime(0.5, when + 0.2);//понизить до 0.5 за 0.2с
			envelope.gain.setValueAtTime(0.5, when + 0.99);//это нужно для правильно расчёта последнего значения
			envelope.gain.linearRampToValueAtTime(0, when + 1);//в конце звука понизить до 0

			envelope.connect(audioContext.destination);//"громкость" направляем в аудиовыход
			beep.connect(envelope);//осциллятор направляем в "громкость"
			
			beep.start(when);
			beep.stop(when + 1);
		}
	</script>
</html>
```

Запускаем в браузере https://mzxbox.ru/fmsynth/envelope.html - звук без резких скачков, более громкий в начале и тихий в конце.

## Модуляция звука

В модуляции звука сигнал-носитель (carrier) изменяется с помощью сигнала-изменятеля (modulator). Подробнее - https://ru.wikipedia.org/wiki/Модуляция

Амплитудная модуляция - вид модуляции, при которой изменяемым параметром несущего сигнала является его амплитуда.

Частотная модуляция - вид аналоговой модуляции, при которой модулирующий сигнал управляет частотой несущего колебания. По сравнению с амплитудной модуляцией здесь амплитуда остаётся постоянной.

![Amfm3.gif](https://mzxbox.ru/fmsynth/Amfm3.gif)

### Амплитуданя модуляция

Звук из модулятора направляется в свойство gain (громкость) узля Gain, на вход которого подключен носитель:

![amplitude](https://mzxbox.ru/fmsynth/amplitude.png)

Код примера:

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
			level.gain.value = 0.5;//уменьшить амплитуду в 2 раза
			result.gain.value = 0.5;//сместить волну на 0.5
			
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
Осциллятор выдаёт синусоиду [-1; +1], а в конечном результате у нас громкость должны меняться как [0; +1] - поэтому нужны дополнительные преобразования.

Прослушать в браузере https://mzxbox.ru/fmsynth/amplitude.html 

### Частотная модуляция

Схема соединения узлов:

![frequency](https://mzxbox.ru/fmsynth/frequency.png)

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
прослушать в браузере https://mzxbox.ru/fmsynth/frequency.html 

## Фазовая модуляция

Фазовая модуляция сдвигает фазу сигнала, что добавляет в него обертоны и в результате меняет тембр. Подробнее - https://ru.wikipedia.org/wiki/Фазовая_модуляция

Схема соединения компонентов:

![phase](https://mzxbox.ru/fmsynth/phase.png)

Код примера:

```html
<html>
<button onclick='start();'>phase modulation</button>
<script>
	function start() {
		let audioContext = new AudioContext();
		let when = audioContext.currentTime + 0.1;
		let soundFrequency = 500;//частота носителя
		let maxmodulation = 4;

		let carrier = audioContext.createOscillator();
		let modulator = audioContext.createOscillator();
		let level = audioContext.createGain();
		let phaseDelay = audioContext.createDelay();

		carrier.frequency.value = soundFrequency;
		modulator.frequency.value = soundFrequency;
		level.gain.setValueAtTime(0, when);
		level.gain.linearRampToValueAtTime(maxmodulation / (2 * Math.PI * soundFrequency), when + 2);
		phaseDelay.delayTime.value = 0.5 / soundFrequency;//сдвиг пропорционально длине волны

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

Прослушать в браузере https://mzxbox.ru/fmsynth/phase.html 

### AudioWorklet

Web Audio API предоставляет готовые компоненты для работы со звуком. Дополнительно есть компонент AudioWorkletProcessor, он позволяет писать собственный код DSP.

Подробнее - https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor

Вот код фазовой модуляции из предидущего примера, но уже через AudioWorkletProcessor:

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
Прослушать в браузере https://mzxbox.ru/fmsynth/phaseworklet.html 

Можно заметить что результат  по звучанию ничем не отличается, но кода получилась огромное полотенце.

Такой подход имеет смысл использовать только если нужно перекомпилировать C++ код плагина VST в WebAssembly для запуска его в браузере.

## Практическое применение

После прочитанного может возникнуть вопрос: "А зачем использовать FM-синтез в браузере?"

Ответ: "Чтоб делать музыкальные синтезаторы, конечно же!"

В десктопных DAW (Ableton Live, FL Studio и т.п.) есть поддержка API для плагинов. Любой может написать свой собственный электронный инструмент который будет работать в любой DAW или секвенсоре.

В современной музыке значение плагинов настолько велико, что новички спрашивают не "Какой редактор использовать для музыки в стиле ХХХ?", а "Какой плагин мне купить для музыки в стиле ХХХ?"

В онлайне всё значительно хуже. Даже [Bandlab](https://blog.bandlab.com/30-million-of-you-on-bandlab/) (30 млн пользователей) не имеет API для расширения своей студии сторонними плагинами.

Сейчас я работаю над онлайн-секвенсором который реализует собственный API для плагинов. Релиз ещё не близко, но попробовать можно уже сейчас.

### Эмуляция Yamaha DX7

Yamaha DX7 — цифровой синтезатор, выпущенный фирмой Yamaha в 1983 году. Был очень популярен в 1980-е годы, и, преимущественно из-за низкой стоимости и компактности, стал одной из наиболее продаваемых моделей за всю историю существования синтезаторов - https://ru.wikipedia.org/wiki/Yamaha_DX7

Посмотреть работу плагина можно здесь:

https://rutube.ru/video/69cec43733da30418e9d56bd5225303c/

Благодаря использованию Web Audio API код плагина получился значительно компактней имеющихся VST-реализаций.

Текст получается слишком большой, поэтому разбора кода и синтеза звука в DX7 будет рассмотрен во второй части статьи.



