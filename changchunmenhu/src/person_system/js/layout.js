var whdef = 100 / 1440;// 表示1440的设计图,使用100PX的默认值
var wH = window.innerHeight;// 当前窗口的高度
var wW = window.innerWidth;// 当前窗口的宽度
var rem = wW * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
$('html').css('font-size', rem + "px");
$(window).resize(function ()// 绑定到窗口的这个事件中
{
    var whdef = 100 / 1440;// 表示1440的设计图,使用100PX的默认值
    var wH = window.innerHeight;// 当前窗口的高度
    var wW = window.innerWidth;// 当前窗口的宽度
    var rem = wW * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
    $('html').css('font-size', rem + "px");
    if(window.innerWidth>=450 && window.innerWidth<=960){
        $('#leftMenu').removeClass('col-sm-3').addClass('col-sm-4')
        $('#rightContent').removeClass('col-sm-9').addClass('col-sm-8')
    }else{
        $('#leftMenu').removeClass('col-sm-4').addClass('col-sm-3')
        $('#rightContent').removeClass('col-sm-8').addClass('col-sm-9')
    }
});