/* @grunt-build */
/* eslint-disable */

define(() => {
    const utils = {
        // 把数据按照层级进行过滤，并获取总层级数。
        filter: function (data) {
            // 设置初始长度为 0
            const hash = {
                length: 0
            };
            // key 为 层级，value 为包含这个层级所有数据的数组
            // 暂时只筛选三级数据
            data.filter(ele => ele.level === '#' || ele.level <= 3)
                .map(function (elem) {
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
    class NewSchedule {
        // 初始化参数，创建课表
        constructor(options) {
            this.getData(options);
        }
        // 获取数据
        getData(options) {
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
        init(data) {
            // 对数据进行筛选排列
            this.data = utils.filter(data);
        }
    }
    return NewSchedule;
})