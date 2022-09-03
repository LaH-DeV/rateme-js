const fs = require("fs");

const ignoreFiles = ["package.json"];
const distDirectory = "./dist";

const deleteFolderRecursive = (path) => {
	if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
		fs.readdirSync(path).forEach(function (file, index) {
			const curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			} else {
                if(!ignoreFiles.includes(file)) {
					fs.unlinkSync(curPath);
                }
			}
		});
		if(path !== distDirectory) {
			fs.rmdirSync(path);
		}
	}
};
deleteFolderRecursive(distDirectory);
deleteFolderRecursive("./.parcel-cache");

if (fs.existsSync("./client-test/client.js")) {
	fs.unlinkSync("./client-test/client.js");
}
console.log("Successfully cleaned working tree!");
