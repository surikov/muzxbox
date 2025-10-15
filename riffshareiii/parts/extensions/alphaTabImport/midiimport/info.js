var fs = require('fs');
let folder = 'D:\\projects\\muzxbox\\test\\music\\';
console.log('start', folder);

function readOneFile(path,name) {
	/*fs.readFileSync(path+name, 'utf-8', function (error, content) {
		//console.log('name', name);
		if (error) {
			console.log('error', name,error);
		} else {
			console.log('content', name,content.length);
		}
	});*/
	let buff=fs.readFileSync(path+name);
	console.log('buff', name,buff.length);
}

function readFiles(path) {
	fs.readdir(path, function (error, filenames) {
		console.log('error', error);
		for (ii = 0; ii < filenames.length; ii++) {
			let filename = filenames[ii];
			if (filename.toLowerCase().trim().endsWith('mid')) {
				//console.log(ii, filename);
				readOneFile(path , filename);
			}
			//

		}

	});
}
readFiles(folder);