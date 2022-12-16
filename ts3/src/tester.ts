class LibTester {
	startTest1(): void {
		console.log("startTest1");
		let a2: Surikov.MusicMetreMath = new Surikov.MusicMetreMath({ count: 1, part: 2 });
		let a4: Surikov.MusicMetreMath = new Surikov.MusicMetreMath({ count: 1, part: 4 });
		let a8: Surikov.MusicMetreMath = new Surikov.MusicMetreMath({ count: 1, part: 8 });
		let a72: Surikov.MusicMetreMath = new Surikov.MusicMetreMath({ count: 7, part: 2 });
		console.log(a2.equals(a72));
		console.log(a2.equals(a4.plus(a4)));
		console.log(a2.plus(a8));
		console.log(a2.minus(a8));
	}
}
