/**
 * 视频播放
 *
 */
define(function(require, exports, module) {
    var client = require('./client-test.js'),
        flashPlayer = require('./flash-player.js');

    var TYPE_PLAYER_UNSUPPORTED = -1,
        TYPE_PLAYER_PC = 0,
        TYPE_PLAYER_MOBILE = 1;

    var players = [];

    var defaults = {
        width: 600,
        height: 400
    };

    function init(wrapId, opt) {
        var options = $.extend({}, defaults, opt);
        var currPlayer;
        if (client.isPc) {
            var flashInst = flashPlayer.init(wrapId, options);

            currPlayer = new Player('pcPlayer' + options.layId, TYPE_PLAYER_PC, flashInst);
            players.push(currPlayer);
            return currPlayer;
        }
        currPlayer = $('#' + wrapId).kJplay(opt);
        players.push(currPlayer);
        return currPlayer;
    }

    /**
     * 播放器对象构造
     */
    function Player(id, type, obj) {
        this.pcPlayerId = id;
        this.playType = type;
        this.playerObj = obj;
    }

    $.each({
            pause: 'fl_pause',
            play: 'fl_play',
            dotData: 'fl_dotData',
            addHostData: 'fl_addHostData',
            addSpeedData: 'fl_addSpeedData',
            playHead: 'fl_play_head',
            volume: 'fl_volume',
            mute: 'fl_mute',
            clearMedia: 'fl_clearMedia',
            info: 'fl_info',
            nomalScreen: 'fl_nomalScreen',
            getTotalTime: 'fl_getTotalTime',
            getCurrTime: 'fl_getCurrTime',
            timeFunReg: 'fl_timeFunReg',
            delTimeFunReg: 'fl_delTimeFunReg',
            delAllTimeFunReg: "fl_delAllTimeFunReg",
            endFunReg: 'fl_endFunReg',
            delEndFunReg: 'fl_delEndFunReg',
            delAllEndFunReg: 'fl_delAllEndFunReg'
        },
        function(key, val) {
            Player.prototype[key] = function() {
                //arguments = Array.prototype.slice.call(arguments).concat(new Array(10));

                var fn = client.isPc ? this.playerObj[val] : this.playerObj["_" + key];
                // console.log($.isFunction(fn));
                if ($.isFunction(fn) || typeof fn === 'function' ) {
                    // console.log( typeof fn );
                    return fn.apply(this.playerObj, arguments)
                }
            };
        });

    //    Player.prototype = {
    //        //暂停
    //        pause: function () {
    //            this.playerObj.fl_pause();
    //        },
    //        //播放
    //        play: function () {
    //            this.playerObj.fl_play();
    //        },
    //        //向flash注入打点数据
    //        dotData: function (data) {
    //            this.playerObj.fl_dotData(data);
    //        },
    //        //向flash注入站点切换数据
    //        addHostData: function (data) {
    //            this.playerObj.fl_addHostData(data);
    //        },
    //        //向flash注入语速数据
    //        addSpeedData: function (data) {
    //            this.playerObj.fl_addSpeedData(data);
    //        },
    //        /**
    //         * 拖拽视频进度条来控制视频播放,跳转
    //         * @param {number} 视频进度条拖拽的百分比0到100
    //         */
    //        playHead: function (r) {
    //            this.playerObj.fl_play_head(r);
    //        },
    //        /**
    //         * 设置音量
    //         * @param {number} 音量调节大小0到1
    //         */
    //        volume: function (r) {
    //            this.playerObj.fl_volume(r);
    //        },
    //        /**
    //         * 设置静音
    //         * @param {boolean} 静音控制 true为静音 false为恢复
    //         */
    //        mute: function (r) {
    //            this.playerObj.fl_mute(r);
    //        },
    //        //重新设置资源
    //        clearMedia: function () {
    //            this.playerObj.fl_clearMedia();
    //        },
    //        /**
    //         * 设置用户登录信息
    //         * @param {object} 将用户登录用到的参数传递给flash
    //            {
    //                aid：用户aid
    //                sid：用户sid
    //                time：当前时间
    //                key：登录用到的key值
    //            }
    //         */
    //        info: function (r) {
    //            this.playerObj.fl_info(r);
    //        },
    //        //退出全屏
    //        nomalScreen: function () {
    //            this.playerObj.fl_nomalScreen();
    //        },
    //        //获取总时长
    //        getTotalTime: function () {
    //            return this.playerObj.fl_getTotalTime();
    //        },
    //        //获取当前播放时间
    //        getCurrTime: function () {
    //            return this.playerObj.fl_getCurrTime();
    //        },
    //        /**
    //         * 注册时间事件
    //         * @param {number} time 事件触发时间点
    //         * @param {string} fun 事件回调函数，必须在window下
    //         * @param {string} val 事件回调函数执行时传回的参数，ps：参数有两个，第一个是layid，第二个才是这个
    //         */
    //        timeFunReg: function (time, fun, val) {
    //            this.playerObj.fl_timeFunReg(time, fun, val);
    //        },
    //        /**
    //         * 删除注册时间事件
    //         * @param {number} time 事件触发时间点
    //         * @param {string} fun 事件回调函数，必须在window下
    //         */
    //        delTimeFunReg: function (time, fun) {
    //            this.playerObj.fl_delTimeFunReg(time, fun);
    //        },
    //        /**
    //         * 删除全部注册时间事件
    //         */
    //        delAllTimeFunReg: function () {
    //            this.playerObj.fl_delAllTimeFunReg();
    //        },
    //        /**
    //         * 注册视频结束事件
    //         * @param {string} fun 事件回调函数，必须在window下
    //         * @param {string} val 事件回调函数执行时传回的参数，ps：参数有两个，第一个是layid，第二个才是这个
    //         */
    //        endFunReg: function (fun, val) {
    //            this.playerObj.fl_endFunReg(fun, val);
    //        },
    //        /**
    //         * 删除注册视频结束事件
    //         * @param {string} fun 事件回调函数，必须在window下
    //         */
    //        delEndFunReg: function (fun) {
    //            this.playerObj.fl_delEndFunReg(fun);
    //        },
    //        /**
    //         * 删除全部注册视频结束事件
    //         */
    //        delAllEndFunReg: function () {
    //            this.playerObj.fl_delAllEndFunReg();
    //        }
    //    }

    module.exports = {
        init: init,
        players: players
    };
});
