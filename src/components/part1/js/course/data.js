'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* @grunt-build */
/* eslint-disable */

define(function () {
    var utils = {
        // 把数据按照层级进行过滤，并获取总层级数。
        filter: function filter(data) {
            // 设置初始长度为 0
            var hash = {
                length: 0
            };
            // key 为 层级，value 为包含这个层级所有数据的数组
            // 暂时只筛选三级数据
            data.filter(function (ele) {
                return ele.level === '#' || ele.level <= 3;
            }).map(function (elem) {
                if (hash[elem.level]) {
                    hash[elem.level].push(elem);
                } else {
                    hash.length++;
                    hash[elem.level] = [elem];
                }
                return true;
            });
            return hash;
        }
    };

    var NewSchedule = (function () {
        // 初始化参数，创建课表

        function NewSchedule(options) {
            _classCallCheck(this, NewSchedule);

            this.getData(options);
        }
        // 获取数据

        _createClass(NewSchedule, [{
            key: 'getData',
            value: function getData(options) {
                // 数据直接嵌入页面
                if (options.data) {
                    this.init(options.data);
                } else if (options.url) {
                    // 接口获取数据
                    $.ajax({
                        url: options.url,
                        type: 'GET',
                        dataType: 'jsonp'
                    }).success(function (res) {
                        if (!res.status) {
                            this.init(res.data);
                        }
                    });
                }
            }
            // 初始化整理数据，调用创建

        }, {
            key: 'init',
            value: function init(data) {
                // 对数据进行筛选排列
                this.data = utils.filter(data);
            }
        }]);

        return NewSchedule;
    })();

    return NewSchedule;
});
//# sourceMappingURL=data.js.map
