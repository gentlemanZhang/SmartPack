/**
 * kooplayer播放器Flash版本
 */

define(function(require, exports, module) {
	var client = require('./client-test.js');
	var modal = {
		init: function(wrapId, r) {
			if (typeof koo == 'undefined') {
				return;
			}

			var data = this.rebuildData(r);

			this.addCallBacks(data);

			return this.create(wrapId, data);
		},
		create: function( wrapId, data ) {
			var player = koo.player.create(
				wrapId,
				data.layId,
				koo.player.lastest.swfPath,
				data.playerData,
				data.rtmpData,
				data.options,
				data.dotData
			);
            return player.swfObj;
		},
		//添加几个全局方法，供Flash播放器调用
		addCallBacks: function(r) {
			$.extend(window, {
				//playerReady 准备播放时掉用

				// 第一次播放掉用
				firstVideoPlay: function() {
					thisMovie("pcplayer" + r.layId).fl_play(r.options && r.options.playFrom);
				},
				thisMovie: function(movieName) {
					if (navigator.appName.indexOf("Microsoft") != -1) {
						return window[movieName];
					} else {
						return document[movieName];
					}
				},
				flashSetCollectionsData: function(val) {
					//埋点：播放器-发生错误   proError方法中
					if (window.videoSetCollectionsData) {
						window.videoSetCollectionsData(val);
					}
				}
			});
		},
		//修改传入数据格式，改成Flash播放器使用的格式
		rebuildData: function(r) {
			var resultData = {};
			r.layId && (resultData.layId = r.layId);
			r.playerData && (resultData.playerData = r.playerData);
			r.rtmpData && (resultData.rtmpData = r.rtmpData);
			r.dotData && (resultData.dotData = r.dotData);
			delete r.layId;
			delete r.playerData;
			delete r.rtmpData;
			delete r.dotData;
			resultData.options = r;

			return resultData;
		}
	};

	module.exports = {
		init: function(wrapId, r) {
			return modal.init(wrapId, r)
		}
	};
});
