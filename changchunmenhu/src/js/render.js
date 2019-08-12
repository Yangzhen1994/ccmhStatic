/**
 * @author yz
 * @date 2019/8/12
 * @Description:
 */
/**左侧菜单点击**/
$('.sidebar li').click(function () {
    var index = $(this).index()
    sideBarHandle($(this),index)
})
function sideBarHandle(jqobj,index) {
    $('.sidebar li').removeClass('is_active').each(function (index,item) {
        var oldSrcName= $(item).find('img').eq(0).attr('src').split('/').reverse()[0]
        if(oldSrcName.indexOf('sel')>-1){
            var newSrc = './img/'+oldSrcName.replace('_sel','')
            $(item).find('img').eq(0).attr('src',newSrc)
        }
    })
    jqobj.addClass('is_active')
    var oldSrcName= jqobj.find('img').eq(0).attr('src').split('/').reverse()[0]
    if(oldSrcName.indexOf('sel')<0){
        var newSrc = './img/'+oldSrcName.split('.')[0]+'_sel.png'
        jqobj.find('img').eq(0).attr('src',newSrc)
    }

    //todo 根据index 来获取不同内容
    //console.log(index)
    renderRightContent(index)
}
function renderRightContent(index) {
    $('#rightContent').html('')
    if(titleArrs[index]){
        var rightTitleHtml = '<img class="title_icon" src="./img/titIcon0'+(index+1)+'.png" alt=""/>'+titleArrs[index]+''
        $('#rightTitle').html(rightTitleHtml)
        renderNoTabsContent(index,titleArrs[index])
    }else{
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
        $('.tab_title_list').on('click','li',function (event) {

            $('.tab_title_list li').removeClass('is_active').each(function (index,item) {
                var oldSrcName= $(item).find('img').eq(0).attr('src').split('/').reverse()[0]
                if(oldSrcName.indexOf('sel')>-1){
                    var newSrc = './img/sjzs/'+oldSrcName.replace('_sel','')
                    $(item).find('img').eq(0).attr('src',newSrc)
                }
            })
            var oldSrcName= $(this).find('img').eq(0).attr('src').split('/').reverse()[0]
            if(oldSrcName.indexOf('sel')<0){
                var newSrc = './img/sjzs/'+oldSrcName.split('.')[0]+'_sel.png'
                $(this).find('img').eq(0).attr('src',newSrc)
            }
            $(this).addClass('is_active')
            renderTabsContent($(this).index(),$(this).text())
        })
        renderTabsContent(0,$('.tab_title_list>li').eq(0).text())
    }
    $('.sidebar').height($('.content').height() + 35 + 85)
}
// 生成非tabs页签下的内容（sjzs）
function renderNoTabsContent(index,type){

    if(index == 0 || type == '新闻列表'){
        //todo cmsload？
    }else{
        // 加载页面
        if(htmlData[index] && htmlData[index].length>0){
            var Data = { list: htmlData[index] };
            var templateHtml = ''
            if(index == 1){
                templateHtml = template('ztyy', Data);
            }else if(index == 2){
                templateHtml = template('jcpt', Data);
            }
            $('#rightContent').html(templateHtml)

        }

    }
    $('.sidebar').height($('.content').height() + 35 + 85)
}
// 生成tabs页签下的内容（sjzs）
function renderTabsContent(index,type) {

    $('#rightContent').html('')
    // 加载tabs页面
    if(sjzsData[index] && sjzsData[index].length>0){
        var Data = { list: sjzsData[index] };
        var templateHtml =  template('sjzs', Data) || '';
        $('#rightContent').html(templateHtml)
    }
    $('.sidebar').height($('.content').height() + 35 + 85)
}
// 生成日期
console.log(getDate())
$('.time_ara').html(getDate())
function getDate(){

    var myDate = new Date();
    var week = ['日','一','二','三','四','五','六'];
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

    var now = year + '年' + conver(month) + "月" + conver(date) + "日" + '  星期' + week[currentWeek] ;
    return now
}

//日期时间处理
function conver(s) {
    return s < 10 ? '0' + s : s;
}