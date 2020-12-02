// pc端使用的播放器初始化逻辑
define(function() {
    function initChangeButton($wrap) {
        var changeButton = '<div class="g-kooplayer-change-flash-button"></div>';
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
            sessionStorage.setItem('kooplayerWebUseType', 'flash');
            location.reload();
        });
    }

    return {
        init: function(wrapId, data) {
            // 对于h5的hls播放器，需要加一下hadoopPlugin参数，
            (function() {
                var host;
                try {
                    host = seajs.data.base;
                } catch (e) {
                    host = 'https://static.koocdn.com/';
                }
                data.hadoopPlugin = host + 'common/kooplayer-collect/2.x/kooplayer-collect.js';
            })();
            console.log(data);
            var args = $.extend(
                {
                    container: '#' + wrapId,
                    sgmtCode: [],
                    cdn: []
                    // ,mediaUrl: 'http://www.streambox.fr/playlists/test_001/stream.m3u8'
                },
                data,
                {
                    mediaUrl: data.mediaUrlH5
                }
            );
            var player = new kooplayer(args);
            initChangeButton($('#' + wrapId));
            return player;
        }
    }
});