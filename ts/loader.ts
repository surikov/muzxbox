class MuzLoader{
	createTestProject(): MuzXBoxProject {
		let p: MuzXBoxProject = {
			tracks: [
				{
					patterns: [//drums
						{ pattern: 0, skip: { count: 0, division: 4 }, duration: { count: 1, division: 4 } }
						, { pattern: 1, skip: { count: 6, division: 4 }, duration: { count: 1, division: 4 } }
						, { pattern: 0, skip: { count: 0, division: 4 }, duration: { count: 1, division: 4 } }
						, { pattern: 2, skip: { count: 6, division: 4 }, duration: { count: 1, division: 4 } }
					]
				}, {
					patterns: [//bass
						{ pattern: 3, skip: { count: 0, division: 4 }, duration: { count: 4, division: 4 } }
					]
				}, {
					patterns: [//lead
						{ pattern: 4, skip: { count: 1, division: 4 }, duration: { count: 1, division: 4 } }
					]
				}, {
					patterns: [//pad
						{ pattern: 15, skip: { count: 4, division: 4 }, duration: { count: 2, division: 4 } }
						, { pattern: 10, skip: { count: 6, division: 4 }, duration: { count: 2, division: 4 } }
					]
				}
			]
			, title: 'test123'
			, tempo: 100			
			, duration: { count: 16, division: 4 }
		};
		return p;
	}
}
