const fs = require('fs');
try {
	let files = fs.readdirSync('./');
	files.forEach(file => {
    loadSingleFile(file);
  });
} catch (err) {
	console.error(err);
}

function loadSingleFile(name) {
	console.log(name);
}
