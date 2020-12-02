/* @grunt-build */
define(function(require, exports, module){
    var kooplayer = require('./js/kooplayer.js');
    $.kooplayer = kooplayer;
    return kooplayer;
});
