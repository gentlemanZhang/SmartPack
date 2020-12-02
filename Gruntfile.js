module.exports = function( grunt ) {
	var pkg = grunt.file.readJSON('./package.json');
	require('./grunt-tools/main.js')(grunt, pkg);
};