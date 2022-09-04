const fs = require("fs");

fs.copyFile("./src/lib/index.rateme.scss", "./dist/lib/styles/index.rateme.min.scss", (err) => {
	if (err) throw err;
	console.log("index.rateme.scss was copied to dist folder.");
});
