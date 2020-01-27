module.exports = {
	warn: (...msg) => {
		console.log('[WARNING]:');
		console.warn(...msg);
	},

	error: (...msg) => {
		console.log('[ERROR]:');
		console.error(...msg);
		console.trace();
	},

	message: msg => {
		console.log(`[MESSAGE]: ${msg}`);
	},

	info: msg => {
		console.log(`[INFO]: ${msg}`);
	},

	db: msg => {
		console.log(`[DATABASE]: ${msg}`);
	},

	clear: () => {
		console.clear();
	},
};
