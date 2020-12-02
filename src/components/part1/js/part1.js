/* @grunt-build */
/* eslint-disable */

define((require) => {
    const Swiper = require('swiper');
    var fullTpl = require('./tpl/full.tpl');
    var fullFun = _.template(fullTpl);
    var navTpl = require('./tpl/nav.tpl');
    var navFun = _.template(navTpl);
    var tiyanTpl = require('./tpl/tiyan.tpl');
    var tiyanFun = _.template(tiyanTpl);
    let url = location.href;
    let sceneStr = '';
    if(url.indexOf('scene')>0){
        sceneStr = url.split('scene=')[1];
        if(sceneStr.indexOf('&')>0){
            sceneStr = sceneStr.split('&')[0];
        }
        sceneStr = sceneStr + "_"
    }
    const app = {
        init() {
            this.tiyanCourse = []
            this.publicCourseArr = [];
            //this.courseAllPay();
            this.getCourse();
            this.swiper();
            this.toCourse();
            // this.clickFun();
            // this.quickPay();
        },
        //是否展示一键收取
        isShow() {
            $('.first_tiyan').find('.presentPrice').each((index, item) => {
                console.log(item);
                if (Number($(item).find('span').text()) > 0) {
                    $('.tiyan-btn').hide();
                    $(".to-course").addClass('center');
                }
            })
        },
        //一键尽收
        courseAllPay(id) {
            $.ajax({
                type: 'get',
                url: '//item.koolearn.com/settlement/toBuyPage0Price',
                dataType: 'jsonp',
                data: {
                    productId: id,
                    scene:sceneStr +'20kaoyan_gkkkb_pc_bm'
                },
                jsonp: 'callback',
                mode: 'abort'
            }).done(function(resp) {
                console.log(resp)
                if (resp.status == 0) {
                     alert("领取成功");
                    return false;
                } else {
                     alert("您已领过该产品,请到我的课堂查看");
                    return false;
                }
            });
        },
        // tabq切换,领取
        clickFun() {
            let _this = this;
            let tab_index = 0;
			if(url.indexOf('tab12')>0){
				tab_index = 0;
			}else if(url.indexOf('tab13')>0){
				tab_index = 1;
			}else if(url.indexOf('tab14')>0){
				tab_index = 2;
            }else if(url.indexOf('tab15')>0){
				tab_index = 3;
            }else if(url.indexOf('tab16')>0){
				tab_index = 4;
            }

            $('.course_nav').find('li').removeClass('active');
            $('.course_nav').find('li').eq(tab_index).addClass('active');
            $(".first_ul").hide();
            $(".first_ul").eq(tab_index).show();
            $('.course_nav').on('click', 'li', function(e) {
                let ind = $(e.currentTarget).index();
                $('.course_nav').find('li').removeClass('active');
                $(this).addClass('active');
                $(".first_ul").hide();
                $(".first_ul").eq(ind).show();
            });
            $('.first_tiyan').on('click', '.quickpay', function(e) {
                let price = Number($(this).parents('.s_course').find('.presentPrice').children('span').html());
                
                let id = $(this).data('id');
                console.log(id);
                if (!price) {
                    $.telLogin({
                        title: '快捷登录',
                        buttonValue: '提交',
                    }).done(function() {
                        _this.courseAllPay(id);
                    });
                } else {
                    $.telLogin({
                        title: '快捷登录',
                        buttonValue: '提交'
                    }).then(function() {
                        ///alert('可以快捷支付了')
                        QuickPay({
                            products: [id],
                            moreData: {
                                scene:sceneStr +'20kaoyan_gkkkb_pc_bm'
                            }
                        });
                    });
                }
            });
            $('.all_course').on('click', '.quickpay', function(e) {
                let price1 = Number($(this).parent('.s_course').find('.presentPrice').children('span').html());
                console.log(price1)
                    // e.cancelBubble = true;
                    // e.stopPropagation();
                    // //js阻止链接默认行为，没有停止冒泡
                    // e.preventDefault();
                let id = $(this).data('id');
                console.log(id);
                if (!price1) {
                    $.telLogin({
                        title: '快捷登录',
                        buttonValue: '提交',
                    }).done(function() {
                        _this.courseAllPay(id);
                    });
                } else {
                    $.telLogin({
                        title: '快捷登录',
                        buttonValue: '提交'
                    }).then(function() {
                        //alert('可以快捷支付了')
                        QuickPay({
                            products: [id],
                            moreData: {scene:sceneStr +'20kaoyan_gkkkb_pc_bm'}
                        });
                    });
                }
            });
            $('.tiyan-btn').click(function() {
                let $pay_id = $('.first_tiyan').find('.tiyan-pay');
                $.telLogin({
                    title: '快捷登录',
                    buttonValue: '提交',
                }).done(function() {
                    $pay_id.map((index, item) => {
                        console.log(index);
                        let id = $(item).data('id');
                        _this.courseAllPay(id);
                    })
                });
            });
        },
        // 快捷支付
        quickPay(id) {
            $.telLogin({
                title: '快捷登录',
                buttonValue: '提交'
            }).then(function() {
                //alert('可以快捷支付了')
                QuickPay({
                    products: [id],
                    moreData: {scene:sceneStr +'20kaoyan_gkkkb_pc_bm'}
                });
            });
        },
        //跳转我的课堂
        toCourse() {
            $(".to-course").on('click', function() {
                $.telLogin({
                    title: '快捷登录',
                    buttonValue: '提交'
                }).done(function() {
                    window.location.href = 'https://study.koolearn.com/my'
                })
            })
        },
        //轮播图初始化
        swiper: function swiper() {
            // new Swiper('.swiper-container', {
            //     loop: true,
            //     autoplay: $('.swiper-slide').length > 1 ? 5000 : false,
            //     pagination: $('.swiper-slide').length > 1 ? '.swiper-pagination' : false
            // });
           
            this.mSwiper = new Swiper.default('.banner-swiper', {
                loop: false,
                autoplay: $('.swiper-slide').length > 1 ? 5000 : false,
                pagination: $('.swiper-slide').length > 1 ? '.swiper-pagination' : false
            });
        },
        getCourse() {
            let _this = this;
            $.ajax({
                type: 'get',
                url: 'https://kebiao.koolearn.com/v1/entryclass/entryClass-by-enTimetableid/1',
            }).done(function(resp) {
                console.log(resp);

                if (resp.code == 0) {
                    let datas = resp.data.classifyList;
                    console.log(datas instanceof Array)
                    datas.map((item, index) => {
                            if (item.recommendTag == 1) {
                                _this.tiyanCourse.push(item);
                            } else {
                                _this.publicCourseArr.push(item)
                            }
                        })
                        //console.log(_this.tiyanCourse)
                   
                    $(".first_tiyan").html(tiyanFun({ lists:{
                        scene:sceneStr,
                        list:_this.tiyanCourse
                    }  }));
                    $(".course_nav").html(navFun({ list:_this.publicCourseArr}));
                    $(".all_course").html(fullFun({ lists: {
                        list:_this.publicCourseArr,
                        scene:sceneStr,
                    } }));
                    _this.isShow();
                    _this.clickFun();
                }
            });
        },

    };
    return {
        init() {
            $(() => {
                app.init();
            });
        }
    };
});