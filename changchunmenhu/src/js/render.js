/**
 * @author yz
 * @date 2019/8/12
 * @Description:
 */
renderRightContent(0)
/**************************左侧菜单hover*********************/
$('.sidebar li').on('mouseenter', function () {
    var oldSrcName = $(this).find('img').eq(0).attr('src').split('/').reverse()[0]
    if (oldSrcName.indexOf('sel') < 0) {
        var newSrc = './img/' + oldSrcName.split('.')[0] + '_sel.png'
        $(this).find('img').eq(0).attr('src', newSrc)
    }
})
$('.sidebar li').on('mouseleave', function () {
    if ($(this).hasClass('is_active')) {
        return
    }
    var oldSrcName = $(this).find('img').eq(0).attr('src').split('/').reverse()[0]
    if (oldSrcName.indexOf('sel') > -1) {
        var newSrc = './img/' + oldSrcName.replace('_sel', '')
        $(this).find('img').eq(0).attr('src', newSrc)
    }
})
/**************************左侧菜单点击*********************/
$('.sidebar li').click(function () {
    var index = $(this).index()
    sideBarHandle($(this), index)
})

function sideBarHandle(jqobj, index) {
    $('.sidebar li').removeClass('is_active').each(function (_index, item) {
        var oldSrcName = $(item).find('img').eq(0).attr('src').split('/').reverse()[0]
        if (oldSrcName.indexOf('sel') > -1) {
            var newSrc = './img/' + oldSrcName.replace('_sel', '')
            $(item).find('img').eq(0).attr('src', newSrc)
        }
    })
    jqobj.addClass('is_active')
    var oldSrcName = jqobj.find('img').eq(0).attr('src').split('/').reverse()[0]
    if (oldSrcName.indexOf('sel') < 0) {
        var newSrc = './img/' + oldSrcName.split('.')[0] + '_sel.png'
        jqobj.find('img').eq(0).attr('src', newSrc)
    }

    //todo 根据index 来获取不同内容
    //console.log(index)
    renderRightContent(index)
}

function renderRightContent(index) {
    $('#rightContent').html('')
    if (titleArrs[index]) {
        var rightTitleHtml = '<img class="title_icon" src="./img/titIcon0' + (index + 1) + '.png" alt=""/>' + titleArrs[index] + ''
        $('#rightTitle').html(rightTitleHtml)
        renderNoTabsContent(index, titleArrs[index])
    } else {
        // tabs 渲染
        var tabsHtml = '<ul class="tab_title_list clearfix">\n' +
            '                    <li class="is_active"><img class="tab_icon" src="./img/sjzs/icon1_sel.png" alt="">数据服务</li>\n' +
            '                    <li><img class="tab_icon" src="./img/sjzs/icon2.png" alt="">数据治理</li>\n' +
            '                    <li><img class="tab_icon" src="./img/sjzs/icon3.png" alt="">资源目录</li>\n' +
            '                    <li><img class="tab_icon" src="./img/sjzs/icon4.png" alt="">数据通</li>\n' +
            '                    <li><img class="tab_icon" src="./img/sjzs/icon5.png" alt="">基础支撑服务</li>\n' +
            '                    <li><img class="tab_icon" src="./img/sjzs/icon6.png" alt="">数据湖</li>\n' +
            '                </ul>'
        $('#rightTitle').html(tabsHtml)
        $('.tab_title_list').on('click', 'li', function (event) {

            $('.tab_title_list li').removeClass('is_active').each(function (index, item) {
                var oldSrcName = $(item).find('img').eq(0).attr('src').split('/').reverse()[0]
                if (oldSrcName.indexOf('sel') > -1) {
                    var newSrc = './img/sjzs/' + oldSrcName.replace('_sel', '')
                    $(item).find('img').eq(0).attr('src', newSrc)
                }
            })
            var oldSrcName = $(this).find('img').eq(0).attr('src').split('/').reverse()[0]
            if (oldSrcName.indexOf('sel') < 0) {
                var newSrc = './img/sjzs/' + oldSrcName.split('.')[0] + '_sel.png'
                $(this).find('img').eq(0).attr('src', newSrc)
            }
            $(this).addClass('is_active')
            renderTabsContent($(this).index(), $(this).text())
        })
        renderTabsContent(0, $('.tab_title_list>li').eq(0).text())
    }
    $('.sidebar').height($('.content').height() + 35 + 85)
}

// 生成非tabs页签下的内容（sjzs）
function renderNoTabsContent(index, type) {

    if (index == 0 || type == '新闻列表' || type == '标准体系' || index == 4) {
        //todo cmsload？
        //$('#rightContent').html('21')
        if (index == 0) {
            var Data = {list: xwzxSwiperData};
            var templateHtml = template('xwzx', Data);
            $('#rightContent').html(templateHtml)
            var listHtml = '<div class="news_area fl"><div class="news_area_title">通知公告</div><div id="newsListWrap"></div></div>'
            $('#rightContent').html(templateHtml)
            $('#rightContent').append(listHtml)
            $('#newsListWrap').load('./baseComponents/news_list.html')
            $('#carouselImg').on('slid.bs.carousel', function (e) {
                console.log($('.item.active .carousel-caption').text())
                $('#carouselText').html($('.item.active .carousel-caption').text())
            })
            $("#carouselText").dotdotdot({
                // configuration goes here
            });
        } else if (index == 4) {
            var listHtml = '<div class="news_area news_area_bztx fl" style="margin-right: 0"><div id="newsListWrap"></div></div></div>'

            $('#rightContent').html(listHtml)
            $('#newsListWrap').load('./baseComponents/news_list1.html')
            /* $('#newsListWrap2').load('./baseComponents/news_list.html')*/
            /***分页***/
            var paginationHtml = '<div id="paginationBox" class="pagination_box"></div>'
            $('#rightContent').append(paginationHtml)
            laypage.render({
                elem: 'paginationBox'
                , count: 100
                , prev: '<img src="./img/page_prev.png" class="pagination_icon">'
                , next: '<img src="./img/page_next.png" class="pagination_icon">'
                , layout: ['count', 'prev', 'page', 'next', 'limit', '', 'skip']
                , theme: '#0090FF'
                , jump: function (obj) {
                    fetchNewsList(obj)
                }
            });
        }
    } else {
        // 加载页面
        if (htmlData[index] && htmlData[index].length > 0) {
            var Data = {list: htmlData[index]};
            var templateHtml = ''
            if (index == 1) {
                templateHtml = template('ztyy', Data);
            } else if (index == 2) {
                templateHtml = template('jcpt', Data);
            }
            $('#rightContent').html(templateHtml)

        }

    }
    $('.sidebar').height($('.content').height() + 35 + 85)
}

// 生成tabs页签下的内容（sjzs）
function renderTabsContent(index, type) {

    $('#rightContent').html('')
    // 加载tabs页面
    if (sjzsData[index] && sjzsData[index].length > 0) {
        var Data = {list: sjzsData[index]};
        var templateHtml = template('sjzs', Data) || '';
        $('#rightContent').html(templateHtml)
    }
    $('.sidebar').height($('.content').height() + 35 + 85)
}

/**************************左侧菜单伸缩*********************/
$('.collapse_icon').css('opacity', 1).on('click', function () {
    collapseSideBar($(this))
})

function collapseSideBar(jqobj) {
    if (jqobj.parent().hasClass('is_show')) {
        jqobj.css({
            'left': '60px',
            'transition-delay': '-.019s',
        })
        jqobj.parent().removeClass('is_show').addClass('is_hide')
        jqobj.find('img').attr('src', './img/展开.png')
        $('.sidebar .menu_list>li').each(function (index, item) {
            $(item).attr('title', $(item).find('.text_div').text())
        })
        $('.content').css('margin-left', '72px')
    } else {
        jqobj.parent().removeClass('is_hide').addClass('is_show')
        jqobj.find('img').attr('src', './img/收起.png')
        jqobj.css({
            'left': '140px',
            'transition-delay': '.01s',
        })
        $('.sidebar .menu_list>li').each(function (index, item) {
            $(item)[0].removeAttribute('title')
        })
        $('.content').css('margin-left', '152px')
    }

}

/**************************生成日期*********************/
console.log(getDate())
$('.time_ara').html(getDate())

function getDate() {

    var myDate = new Date();
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    //获取当前年
    var year = myDate.getFullYear();

    //获取当前月
    var month = myDate.getMonth() + 1;

    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();

    //获取周几
    var currentWeek = myDate.getDay()
    //获取当前时间

    var now = year + '年' + conver(month) + "月" + conver(date) + "日" + '  星期' + week[currentWeek];
    return now
}

//日期时间处理
function conver(s) {
    return s < 10 ? '0' + s : s;
}

// 拉取列表
function fetchNewsList(obj) {
    console.log(obj)
}