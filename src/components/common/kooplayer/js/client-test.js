/**
 * 客户端检测
 */

define(function(require, exports, module){
	var ua = navigator.userAgent.toLowerCase();

	var browser = {
		ie : /MSIE ([^;]+)/.test(ua)
	};
	
	var isPc = !/Android|iPhone|SymbianOS|Windows\s+Phone|iPad|iPod/i.test(ua);

	module.exports = {
		browser : browser,
		isPc : isPc
	};
});