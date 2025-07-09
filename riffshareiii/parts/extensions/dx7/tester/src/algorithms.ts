type ConnectionSchemeDX7 = {
	outputMix: number[]
	, modulationMatrix: (number[])[]
};
let matrixAlgorithmsDX7: ConnectionSchemeDX7[] = [
	//stacking
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], [5]] },    //1
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4], [5], []] },    //2
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [5]] },    //3
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [3]] },    //4
	{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [5]] },     //5 e.piano 1
	{ outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [4]] },     //6
	//branch
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], [5]] },   //7
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [3], [5], []] },   //8
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4], [], [5], []] },   //9
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [2], [4, 5], [], []] },   //10
	{ outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], [5]] },   //11
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4, 5], [], [], []] },  //12
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], [5]] },  //13
	{ outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], [5]] },   //14
	{ outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4, 5], [], []] },   //15
	{ outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], [5]] }, //16 bass 1
	{ outputMix: [0], modulationMatrix: [[1, 2, 4], [1], [3], [], [5], []] }, //17
	{ outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [4], [5], []] }, //18
	//rooting/tower combi
	{ outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], [5]] },    //19
	{ outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [2], [4, 5], [], []] },   //20
	{ outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [2], [5], [5], []] },    //21
	{ outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], [5]] },    //22
	{ outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], [5]] },     //23 vibe 1
	{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], [5]] },     //24
	{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], [5]] },      //25
	//branch/tower combi
	{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], [5]] },    //26
	{ outputMix: [0, 1, 3], modulationMatrix: [[], [2], [2], [4, 5], [], []] },    //27
	{ outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [4], []] },     //28
	{ outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], [5]] },      //29
	{ outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [4], []] },      //30
	{ outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], [5]] },       //31
	{ outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], [5]] }         //32 e.organ 1
];