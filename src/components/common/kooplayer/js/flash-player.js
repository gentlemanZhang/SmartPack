/**
 * kooplayer播放器Flash版本
 */

define(function(require, exports, module) {
	var client = require('./client-test.js');
	var modal = {
		init: function(wrapId, r) {
			var _this = modal;
			/*window.koo.player.lastest || {
				swfPath: 'http://static.neibu.koolearn.com/kooplayer/Jplayer.swf'
			};*/
			_this.addCallBacks(r);

			return _this.create(wrapId, _this.rebuildData(r));
		},
		create: function(wrapId, optionData) {
			koo.player.create(wrapId, layId, koo.player.lastest.swfPath, optionData);

			return thisMovie("pcplayer" + optionData.layId);
		},
		//添加几个全局方法，供Flash播放器调用
		addCallBacks: function(r) {
			$.extend(window, {
				playerReady: function() {
					dotData();
					addHostData();
					addSpeedData();
					thisMovie("pcplayer" + layId).fl_play(r.playFrom);
				},
				dotData: function() {
					thisMovie("pcplayer" + layId).fl_dotData(dadianData);
				},
				addHostData: function() {
					var table = eval(zhandianData);
					thisMovie("pcplayer" + layId).fl_addHostData(zhandianData);
				},
				addSpeedData: function() {
					thisMovie("pcplayer" + layId).fl_addSpeedData(yusuData);
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
			$.extend(window, {
				layId: r.layId,
				dadianData: r.dadianData,
				yusuData: r.serverResponse.playerData.speed,
				zhandianData: r.serverResponse.playerData.site,
				preamblePath: r.serverResponse.playerData.pcTitles,
				preambleBackPath: r.serverResponse.playerData.bakTitles
			});

			var resultData = {
				layId: r.layId, //flash调用js时用到的唯一id

				//用户验证用的,如果视频地址是加密的，需要传参验证
				aid: parseInt(r.serverResponse.videoData.aid), //购课用户的唯一标识
				sid: r.serverResponse.videoData.sid, //用户唯一标识
				time: parseInt(r.serverResponse.videoData.time), //当前时间
				key: r.serverResponse.videoData.key, //密钥

				//视频配置
				videoType: r.videoType, //视频类型rtmp 还是http
				volume: r.volume, //设置默认音量
				url: r.serverResponse.videoData.rtmpUrl, //视频播放地址
				autoPlay: r.autoPlay, //视频自动播放
				isEncrypt: r.isEncrypt, //url地址是否需要解密(如果是加密的话，必须为true)
				playfromTime: r.playfromTime, //设置播放时间
				muted: r.muted, //静音控制

				//控制条和视频区域参数
				controlBarAutoHide: r.controlBarAutoHide, //控制条是否自动隐藏
				controlBarAutoHideTime: r.controlBarAutoHideTime, //控制条自动隐藏的时间
				controlBarType: r.controlBarType, //控制条类型
				controlBarHeight: r.controlBarHeight, //控制条高度
				videoWidth: r.videoWidth, //视频区域宽度
				videoHeight: r.videoHeight, //视频区域高度
				width: r.width,
				height: r.height,

				//广告配置
				pluginTime: r.pluginTime, //片头默认时间（如果是视频则取视频的时间，如果是图片取这个时间）
				pluginContentUrl: r.serverResponse.playerData.pcTitles, //片头地址（视频或是图片）
				pluginBlankUrl: r.serverResponse.playerData.linkPath || "http://www.koolearn.com/", //片头点击后的跳转地址
				pluginAutoPlay: r.pluginAutoPlay, //广告是否自动播放
				pluginBackImage: r.serverResponse.playerData.bakTitles, //片头备用图片
				plugin: r.plugin || "true",
                pluginWidth: r.pluginWidth || "640",
                pluginHeight: r.pluginHeight || "360",
				//播放器跳转地址配置
				errorBlankUrl: r.errorBlankUrl, //播放器报错后用户的留言地址
				hostTestBlankUrl: r.hostTestBlankUrl, //自动切换站点后视频仍然播放不流畅，用户的留言地址
				markImageUrl: r.markImageUrl, //用户唯一标识水印图片
				//播放器高级配置
				localData: r.localData, //是否保存用户上一次的播放时间(只有rtmp视频时应用)
				hostData: r.hostData, //是否保存用户上一次的切换站点(只有rtmp视频时应用)
				subtitleShow: r.subtitleShow, //是否显示评论功能(只有rtmp视频时应用)
				hostChangeShow: r.hostChangeShow, //站点切换功能显示（只有rtmp视频时应用）

				speedChangeShow: r.speedChangeShow, //语速切换功能显示(只有rtmp视频时应用)
				hideTeacherUrl: r.serverResponse.videoData.hTUrl || '',

				dotAuto: r.dotAuto //打点开关
			};

			return resultData;
		}
	};

	module.exports = {
		init: modal.init
	};
});
