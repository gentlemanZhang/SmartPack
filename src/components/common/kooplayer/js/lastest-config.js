/**
 * 最新配置信息
 */

define( function( require, exports, module ) {
	function bneibu() {
		var base = seajs.data.base;
		var importBase = seajs.data.importBase;
		return base != importBase;
	}
	var url = bneibu() ? 'http://static.neibu.koolearn.com/kooplayer/Jplayer.swf' : 'http://static.koolearn.com/kooplayer_new/Jplayer.swf'
	return {
		swfPath : url
	};
} );