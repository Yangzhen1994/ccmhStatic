/**
 * Created by liyang on 2018/12/26.
 * 工具类
 */
var lyTool = (function (tool, win, doc, $) {
    tool.search = function (div, string) {
        tool.tree(div, function (div) {
            var contents = div.innerHTML;
            if (contents && typeof contents === 'string') {
                var values = contents.split(string);
                if (div.className == 'a col-xs-3') {
                    div.innerHTML = values.join('<span style="color:#FFC361;">' + string + '</span>');
                }
            }
        })
    }
    /**
     * 遍历节点
     */
    tool.tree = function (div, callback) {
        var queue = [];// 任务队列
        queue.push(div);// 添加首个任务
        var currentNode = queue.shift();
        while (currentNode) {
            // 是否有子节点
            if (currentNode.children && currentNode.children.length > 0) {
                //添加任务
                var children = currentNode.children
                for (var i = 0; i < children.length; i++) {
                    queue.push(children[i])
                }
            } else {
                // console.table(currentNode)
                // // 插入合并数据
                // 跟节点输出
                callback(currentNode)
            }
            currentNode = queue.shift();
        }
    }


    return tool
}((lyTool || {}), window, document, $))


var lyTool = (function (tool, win, doc) {
    function _addNewStyle(newStyleList) {
        var styleElement = document.getElementById('styles_js');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        for (var i = 0; i < newStyleList.length; i++) {
            styleElement.appendChild(document.createTextNode(newStyleList[i]));
        }
    }

    var top = window.innerHeight * 0.25;
    _addNewStyle([
        '.btn:focus,.btn:active:focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn.active.focus {outline: none; box-shadow:none;}',
        '.btn-default:active, .btn-primary:active{background: transparent !important;border: transparent !important;outline: none;}',
        '.btn-default:hover, .btn-primary:hover{background: transparent !important;border: transparent !important; border-bottom-color: transparent !important;}',
        '.btn-primary, .btn-primary:hover{color: #FFA147;}',
        '.btn-default{color: #6E6D7A;}',
        '.btn-default, .btn-primary{background: transparent;border: transparent;}',
        '.modal-content{margin-top: ' + top + 'px;border-radius: 4px;border: 1px solid #E4E7ED;}',
        '.modal-header,.modal-footer {padding-left: 0px;padding-right: 0px;margin-left: 24px;margin-right: 24px;padding-top: 25px;}',
        '.modal-body {padding-left: 24px;padding-right: 24px;}',
        '.tool-content{border: transparent;}',
        '.tool-title{text-align: center;}',
        '.tool-btn{border-radius: 100px;font-size: 12px;padding: 5px 30px;}',
        '.tool-confirm{background-color: #FFA147;color:#FFFFFF}',
        '.tool-del{background-color: #FFFFFF;border: 1px solid #DCDFE6;color:#6E6D7A;margin-right: 10px}',
        '.tool-img{max-width: 100%;height: auto;}',
        // '.modal-footer{padding-top: 25px}',
        // '.modal-header{padding-top: 25px}'


        // qsq  2019/4/9
        '.verify-title{padding-top:38px;font-size:22px;font-family:PingFangSC-Regular;color:rgba(51,51,51,1);}',
        '.verify-hint{font-size:12px;font-family:PingFangSC-Regular;font-weight:400;color:rgba(146,147,157,1); text-align: center;height:50px;line-height: initial}',
        '.verify-main{display: flex;flex-direction:column;height:126px;padding:12px 48px}',
        '.verify-write > input{width:100%;border-radius:4px;border:1px solid rgba(228,231,237,1);height:38px;padding-left:4px;}',
        '.verify-code > input{width:58%;border-radius:4px;border:1px solid rgba(228,231,237,1);height:38px;padding-left:4px;}',
        '.verify-code > button{margin-left:12px;width:37%;background:rgba(72,132,237,0.1);border-radius:4px;border:1px solid rgba(72,108,216,0.5);height:38px;font-size:12px;color:rgba(72,108,216,1);}',
        '.verify-submit{padding : 12px 48px;margin:0;}',
        '.verify-submit > button{width: 100%;height:36px;text-align: center;border-radius:4px;border:1px solid rgba(228,231,237,1);background:rgba(72,108,216,1);font-size:12px;color:rgba(255,255,255,1);}',
        '.verify-error{font-size:12px;color:rgb(245, 108, 108);margin:0;height:26px;line-height: 26px;}'
    ]);


    /**
     * 确认框框
     * @param {string} title - 标题
     * @param {string} msg - 内容
     * @param {callback} callback - 点击确定
     * @param {callback} cancel - 点击取消
     */
    var _Confirm = function (title, msg, callback, cancel) {
        var id = 'confirm';
        var tmp;
        // 创建样式加载
        // var bk = $('<div></div>')
        // var modal = $('<div></div>')
        // var header = $('<div></div>')
        // var body = $('<div></div>')
        // var footer = $('<div></div>')

        if (!$('#' + id)[0]) {
            $('body').append((
                '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="true">'
                + '<div class="modal-dialog"style="width: 360px;">'
                + '<div class="modal-content"style="width: 360px !important;height: 123px;">'
                + '<div class="modal-header tool-content">'
                + '<h4 class="modal-title tool-title">' + msg + '</h4>'
                + '</div>'
                + '<div class="modal-footer tool-content tool-title">'
                + '<button type="button" class="btn  tool-btn tool-del" data-dismiss="modal">取消</button>'
                + '<button type="button" class="btn  tool-btn tool-confirm" >确定</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
            ))
        } else {
            $('#' + id).find('.modal-title').html(title)
        }
        $('#' + id).modal()


        $('#' + id).on('click', '.tool-confirm', function (e) {
            tmp = true;
            console.log('click')
            $('#' + id).modal('hide')
            callback && callback()
            callback = null
        })
        $('#' + id).on('hide.bs.modal', function (event) {
            if (!tmp) {
                console.log('清除')
            }
            // 清除监听
            $('#' + id).off('click', '.tool-confirm')
            $('#' + id).off('hide.bs.modal')
            cancel && cancel()
            cancel = null
        })
    }

    /**
     * 弹框提示
     * @param {string} str - 提示字符串
     * @param {callback} cancel - 点击取消
     * @param {callback} callback - 点击确定
     */
    tool.alert = function (title, callback, cancel) {
        var id = 'alert';
        var tmp;
        // 创建样式加载
        // var bk = $('<div></div>')
        // var modal = $('<div></div>')
        // var header = $('<div></div>')
        // var body = $('<div></div>')
        // var footer = $('<div></div>')

        if (!$('#' + id)[0]) {
            $('body').append((
                '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="true">'
                + '<div class="modal-dialog"style="width: 360px;">'
                + '<div class="modal-content"style="width: 360px !important;height: 132px;!important">'
                + '<div class="modal-header tool-content">'
                + '<h4 class="modal-title tool-title">' + title + '</h4>'
                + '</div>'
                + '<div class="modal-footer tool-content tool-title">'
                + '<button type="button" class="btn  tool-btn tool-del" data-dismiss="modal">取消</button>'
                + '<button type="button" class="btn  tool-btn tool-confirm" >确定</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
            ))
        } else {
            $('#' + id).find('.modal-title').html(title)
        }
        $('#' + id).modal()
        $('#' + id).on('click', '.tool-confirm', function (e) {
            tmp = true;
            $('#' + id).modal('hide')
            callback && callback()
            callback = null
        })
        $('#' + id).on('hide.bs.modal', function (event) {
            // 清除监听
            $('#' + id).off('click', '.tool-confirm')
            $('#' + id).off('hide.bs.modal')
            cancel && cancel()
            cancel = null
        })
    }

    tool.img = function (url) {
        var img = new Image()
        img.src = url;
        var id = 'img';
        if (!$('#' + id)[0]) {
            if (img.width > img.height) {   //qsq  
                $('body').append((
                    '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="true" style="display: flex;align-items: center;justify-content: center;">'
                    + '<div class="modal-dialog tool-conten" style="width:800px; height:600px; display: flex;align-items: center;justify-content: center;">'
                    + '<div class="tool-img-box" style="width:100%;display: flex;align-items: center;justify-content: center;">'
                    + '<img class="tool-img" src="' + url + '" style="width:100%;"/>'
                    + '</div>'
                    + '</div>'
                ))
            } else if (img.height > img.width) {
                $('body').append((
                    '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="true" style="display: flex;align-items: center;justify-content: center;">'
                    + '<div class="modal-dialog tool-conten" style="width:800px; height:600px; display: flex;align-items: center;justify-content: center;">'
                    + '<div class="tool-img-box" style="height:100%;display: flex;align-items: center;justify-content: center;">'
                    + '<img class="tool-img" src="' + url + '" style="height:100%;"/>'
                    + '</div>'
                    + '</div>'
                ))
            }
        } else {
            if (img.width > img.height) {
                $(".tool-img-box").css({ "width": "100%", "height": "" })
                $(".tool-img").css({ "width": "100%", "height": "" })
            } else if (img.height > img.width) {
                $(".tool-img-box").css({ "height": "100%", "width": "" })
                $(".tool-img").css({ "height": "100%", "width": "" })
            }
            $('#' + id).find('img').attr('src', url)
        }
        $('#' + id).modal()
    }
    /**
     * 自动消失弹窗
     * @param {string} title - 标题
     */
    tool.toast = function (title) {
        var _div = $('<div>' + title + '</div>').css({
            'position': 'fixed',
            'top': '25%',
            'width': '204px',
            'height': '48px',
            'line-height': '48px',
            'left': (window.innerWidth - 204) >> 1,
            'border-radius': '4px',
            'background-color': 'rgba(0, 0, 0,0.5)',
            'color': '#ffffff',
            'font-size': '14px',
            'font-weight': 'bold',
            'text-align': 'center',
            'z-index': 99999
        })
        $('body').append(_div)
        setTimeout(function () {
            _div && _div.remove()
        }, 2000);

    }
    /**
     * 弹框提示
     * @param {string} str - 提示字符串
     * @param {callback} callback - 点击确定
     */
    tool.alert1111 = function (title, callback) {
        var id = 'alert'
        // 查询是否是第一次显示
        if (!$('#' + id)[0]) {
            $('body').append((
                '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="true">'
                + ' <div class="modal-dialog">'
                + ' <div class="modal-content">'
                + ' <div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                + '<h4 class="modal-title">' + title + '</h4>'
                + '</div>'
                + '<div class="modal-footer">'
                + '<button type="button" class="btn btn-default" data-dismiss="modal">确定</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
            ))
        } else {
            $('#' + id).find('.modal-title').html(title)
            // $('#'+id).find('.modal-body').html(msg)a
        }
        $('#' + id).modal()
        $('#' + id).on('click', '.btn-default', function (e) {
            callback && callback()
            callback = null
        })
    }

    // _Confirm('lisfjs', '数量均分is减肥', function () {
    //     console.log('切到')
    // })
    /*
    * showloading simple
    * */
    tool.showloading = function (url) {
        var img = new Image()
        img.src = "../img/loading.gif"
        img.onload = function () {
            var _loadingDom = $('<div class="loading_container"><img  src=' + img.src + ' style="width:100%;"/></div>').css({
                'position': 'fixed',
                'top': '35%',
                'left': (window.innerWidth - img.width) >> 1,
                'z-index': 99999
            })
            $('body').append(_loadingDom)
        }
    }
    /*
        * showloading Bar
        * */
    tool.showloadingBar = function (percent) {
        var img = new Image()
        img.src = "../img/loading.gif"
        img.onload = function () {
            var _loadingDom = $('<div class="loading_container"><div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="60"aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only"></span> </div> </div></div>').css({
                'position': 'fixed',
                'top': '33%',
                'width': '204px',
                'height': '1px',
                'line-height': '1px',
                'left': (window.innerWidth - 204) >> 1,
                'border-radius': '4px',
                'color': '#ffffff',
                'font-size': '14px',
                'font-weight': 'bold',
                'text-align': 'center',
                'z-index': 99999,
                "background-color": "#e3e3e3",

            })
            $('body').append(_loadingDom)
            setTimeout(function () {
                $('.loading_container .progress-bar').css({
                    'width': percent + '%',
                })
            })

        }
    }
    tool.hideloading = function () {
        setTimeout(function () {
            $('.loading_container').each(function (index, item) {
                $(item).hide()
                $(item).remove()
            })
        }, 1500)

    }


    tool.verification = function (title, hint1, hint2, obtain, callback, condition, val, btnVal, cancel) {
        // 标题；说明1；说明2；获取验证码方法；成功的回调；需认证或绑定状态；文本值；按钮文本值；错误的回调
        var id = 'alert';
        if (!$('#' + id)[0]) {
            $('body').append((
                '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="true">'
                + '<div class="modal-dialog"style="width: 383px;">'
                + '<div class="modal-content"style="width: 383px !important;height: 372px!important">'
                + '<div class="modal-header tool-content">'
                + '<h4 class="modal-title tool-title verify-title">' + title + '</h4>'
                + '</div>'
                + '<div class="verify-hint">'
                + '<p style="padding-bottom:5px;">' + hint1 + '<p/>'
                + '<p>' + hint2 + '<p/>'
                + '</div>'
                + '<div class="verify-main">'
                + '<div class="verify-write">'
                + '<input class="mailboxVal" type="text" placeholder="请输入邮箱" value="' + (val || '') + '">'
                + '<p class="verify-error"></p>'
                + '</div>'
                + '<div class="verify-code">'
                + '<input class="codeVal" type="text" placeholder="请输入验证码">'
                + '<button type="button" class="acquire">获取验证码</button>'
                + '<p class="verify-error"></p>'
                + '</div>'
                + '</div>'
                + '<div class="modal-footer  tool-content tool-title verify-submit">'
                + '<button type="button" class="submit" >' + (btnVal == 1 ? '确认' : '修改已认证邮箱') + '</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
            ))
            conditionDisabled();
        } else {
            $('#' + id).find('.modal-title').html(title);
            $('.verify-error').text('');
            $('.mailboxVal').val(val);
            $('.codeVal').val('');
            $('.submit').text(btnVal == 1 ? '确认' : '修改已认证邮箱');
            conditionDisabled();
        }
        function conditionDisabled() {
            if (condition == 'identification') {// 已禁用的状态
                $('.mailboxVal').attr('disabled', 'disabled');
            } else if (condition == 'binding') {// 未禁用的状态
                $('.mailboxVal').removeAttr('disabled');
            }
        }
        $('#' + id).modal()
        $('#' + id).on('click', '.tool-confirm', function (e) {
            tmp = true;
            $('#' + id).modal('hide')
            callback && callback()
            callback = null
        })
        var ismailbox = false;
        var iscode = false;
        if (condition == 'binding') {
            $('.mailboxVal').blur(function () {
                var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                if (reg.test($(this).val())) {
                    ismailbox = true;
                    $(this).siblings('.verify-error').text('');
                } else {
                    ismailbox = false;
                    $(this).siblings('.verify-error').text('请输入正确的邮箱');
                }
            })
        } else {
            ismailbox = true;
        }
        // 获取验证码
        $(document).off('click', '.acquire');
        $(document).on('click', '.acquire', function () {
            if (ismailbox == false) {
                lyTool.toast('请输入正确的邮箱');
                return
            }
            obtain && obtain($('.mailboxVal').val());
        })
        $('.codeVal').blur(function () {
            var reg = /^[A-Za-z0-9]{4}$/
            if (reg.test($(this).val())) {
                iscode = true;
                $(this).siblings('.verify-error').text('');
            } else {
                iscode = false;
                $(this).siblings('.verify-error').text('请输入4位数的验证码');
            }
        })
        // 提交验证申请
        $('.submit').click(function () {
            if (ismailbox == false) {
                lyTool.toast('请输入正确的邮箱');
                return
            }
            if (iscode == false) {
                lyTool.toast('请输入正确的验证码');
                return
            }
            callback && callback($('.codeVal').val());
            // // 清除监听
            // if (btnVal != 2) {
            //     callback = null;
            //     $('#' + id).off('click', '.tool-confirm');
            //     $('#' + id).off('hide.bs.modal');
            //     $('#' + id).modal('hide');
            // }
        })
    }
    tool.confirm = _Confirm
    return tool
}((lyTool || {}), window, document))

// (function (name, definition) {
//     if (typeof define === 'function') {
//         // AMD环境或CMD环境
//         define(definition);
//     } else if (typeof module !== 'undefined' && module.exports) {
//         // 定义为普通Node模块
//         module.exports = definition();
//     } else {
//         // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
//         this[name] = definition(axios);
//     }
// })('lyTool', function () {

//     return lyTool
// })
