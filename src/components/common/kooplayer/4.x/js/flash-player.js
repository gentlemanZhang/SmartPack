/**
 * kooplayer播放器Flash版本
 */

define(function(require, exports, module) {
    var defaultRtmpOptions = {
        //url地址是否需要解密(如果是加密的话，必须为true)
        isEncrypt: "true",
        width: '100%',
        height: '100%',
        // plugin参数和width、height在一起会导致flash无法播放片头
        // plugin: 'true',
        //播放器报错后用户的留言地址
        errorBlankUrl: '//help.koolearn.com/zxzx/',
        //自动切换站点后视频仍然播放不流畅，用户的留言地址
        hostTestBlankUrl: '//help.koolearn.com/zxzx/',
        //用户唯一标识水印图片
        markImageUrl: '//study.koolearn.com/common/image/create',
        // 是否保存用户上一次的播放时间(只有rtmp视频时应用)
        localData: 'true',
        // 是否保存用户上一次的切换站点(只有rtmp视频时应用)
        hostData: 'false',
        // 是否显示评论功能(只有rtmp视频时应用)
        subtitleShow: 'false',
        // 语速切换功能显示(只有rtmp视频时应用)
        speedChangeShow: 'false',
    };

    var defaultHlsOptions = {
        width: '100%',
        height: '100%',
        //播放器报错后用户的留言地址
        errorBlankUrl: '//help.koolearn.com/zxzx/',
        //自动切换站点后视频仍然播放不流畅，用户的留言地址
        hostTestBlankUrl: '//help.koolearn.com/zxzx/',
        //用户唯一标识水印图片
        markImageUrl: '//study.koolearn.com/common/image/create',
    };

    var getPlayerId = (function() {
        var num = 123;
        return function() {
            num += 1;
            return num + '';
        }
    })();

    // 解析rtmp数据
    var resolveRtmpData = (function() {
        var plusData = 'playerData rtmpData dotData'.split(' ');
        return function(originData) {
            // originData.playerData.titles数组为空时，表示没有广告
            // 当没有广告但plugin设为true时，视频无法自动播放
            var noAD = (function() {
                if (!originData.playerData) return true;
                if (!originData.playerData.titles) return true;
                if (originData.playerData.titles.length == 0) return true;
                return false;
            })();
            noAD && (originData.plugin = 'false');
            var data = $.extend({}, defaultRtmpOptions, originData);
            var resultData = plusData.reduce(function(result, value) {
                result[value] = data[value];
                delete data[value];
                return result;
            }, {
                layId: getPlayerId(),
                options: data
            });

            return resultData;
        };
    })();

    // 解析hls数据
    var resolveHlsData = (function() {
        // adInfo是以前的值，表示开头广告，后来有了片尾广告，就换名了 2017-12-21 by ikuner
        var plusData = 'adInfo prerollInfo postrollInfo dotInfo mediaUrl token markImageUrl cdn cdnDefault sgmtCode ownStatistics'.split(' ');
        return function(originData) {
            var data = $.extend({}, defaultHlsOptions, originData);
            var playerData = plusData.reduce(function(result, value) {
                result[value] = data[value];
                delete data[value];
                return result;
            }, {});
            // 收集额外数据
            (function() {
                var KUID;
                var ua;
                var insideApp;
                if (!playerData.ownStatistics) return;
                // 添加身份标识
                KUID = $.cookie ? $.cookie('KUID') : null;
                if (KUID) {
                    playerData.ownStatistics.KUID = KUID;
                }
                // 添加app版本信息
                ua = navigator.userAgent.toLowerCase();
                // 匹配：koolearn; k/2.7.0; A2/12/34
                insideApp = ua.match(/(?:koolearn;\s)((?:[^\s]+\s)(?:.{1,2}\/\d+\/\d+))/i);
                if (insideApp) {
                    playerData.ownStatistics.appVersion = insideApp[1];
                }
            })();
            return {
                layId: getPlayerId(),
                options: data,
                playerData: playerData
            };
        }
    })();

    var createRtmpPlayer = function(wrapId, data) {
        var player = koo.player.create(
            wrapId,
            data.layId,
            undefined,
            data.playerData,
            data.rtmpData,
            data.options,
            data.dotData
        );
        return player.swfObj;
    };

    var createHlsPlayer = function(wrapId, data) {
        $(window).on('jg-hls-player-ready', function(e, layId) {
            console.log('layId', layId);
            if (layId == data.layId) {
                swfObj.setData(data.playerData);
            }
        });
        var player = koo.hlsplayer.create(
            wrapId,
            data.layId,
            data.options
        );
        var swfObj = player.swfObj;
        // var timer = setInterval( function() {
        //     if( swfObj && swfObj.setData ) {
        //         clearInterval( timer );
        //         swfObj.setData( data.playerData );
        //     }
        // }, 1000 );
        return swfObj;
    };

    var setGlobalMethod = function() {
        $.extend(window, {
            thisMovie: function(movieName) {
                if (navigator.appName.indexOf('Microsoft') != -1) {
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
            },
        });
    };

    var setSwfCallback = function(flashPlayer, data) {
        $.extend(window, {
            // 第一次播放掉用
            firstVideoPlay: function() {
                var canPlay = data.options && (data.options.autoPlay === 'true') && data.options.playFrom;
                canPlay && flashPlayer.fl_play(data.options.playFrom);
            },
        });
    };

    setGlobalMethod();

    function initChangeButton($wrap) {
        if (!window.sessionStorage) return;
        var changeButton = '<div class="g-kooplayer-change-h5-button"></div>';
        var $button = $(changeButton);
        $wrap.append($button);
        if (!localStorage.getItem('kooplayerWebUsed')) {
            setTimeout(function() {
                $button.addClass('hover');
                setTimeout(function() {
                    $button.removeClass('hover');
                }, 1000);
            }, 1000);
        }
        localStorage.setItem('kooplayerWebUsed', '1');
        $button.on('click', function() {
            window.sessionStorage && sessionStorage.setItem('kooplayerWebUseType', 'h5');
            location.reload();
        });
    }

    return {
        init: function(wrapId, data, canShowChangeButton) {
            if (typeof koo == 'undefined') {
                return;
            }

            var resolve = data.flashType == 'hls'
                ? resolveHlsData
                : resolveRtmpData;
            var create = data.flashType == 'hls'
                ? createHlsPlayer
                : createRtmpPlayer;

            data = resolve(data);

            var flashPlayer = create(wrapId, data);

            setSwfCallback(flashPlayer, data);

            if (canShowChangeButton) {
                initChangeButton($('#' + wrapId));
            }

            return flashPlayer;
        }
    };
});
