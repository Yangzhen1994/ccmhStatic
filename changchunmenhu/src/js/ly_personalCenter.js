/**
 * Created by liyang on 2018/12/26.
 *
 */
(function (win) {
    var tmp = { i: 0 }
    var added = false;
    window.isCertify = false
    //用于存储证件信息的数组 缓存为空时备用
    var certificationArr = []
    // 计算控件容量
    lhRequest.service({
        url: '/spacesize/getuserspace',
        method: 'get'
    }).then(function (msg) {
        if (msg.data.code == 200) {
            var usedspace = (msg.data.data.usedspace * 1).toFixed(2);
            var spacesize = (msg.data.data.spacesize * 1).toFixed(0);
            var usedspaceInt = (parseInt(usedspace) / (1024 * 1024)).toFixed(2)
            var spacesizeInt = (parseInt(spacesize) / (1024 * 1024)).toFixed(2)
            if (usedspaceInt*1 > spacesizeInt*1) {
                usedspace = spacesize;
                usedspaceInt = spacesizeInt
            }
            usedspaceInt = del00(usedspaceInt)
            spacesizeInt = del00(spacesizeInt)
            function del00(sizeStr) {
                sizeStr = sizeStr + "";
                var index = sizeStr.indexOf(".");
                var dou = sizeStr.substr(index + 1, 2)            //获取小数点后两位的值
                if (dou == "00") {                                //判断后两位是否为00，如果是则删除00
                    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
                } else {
                    return sizeStr
                }
            }
            $('#usedspace').html(usedspaceInt)
            $('#spacesize').html(spacesizeInt)
            var progressWidth = (usedspaceInt / spacesizeInt)
            $('.progress-bar').css('width', progressWidth * 100 + '%')
        }
    })
    // 获取目录数据
    win.init = function (cardType, page) {
        added = false
        lhRequest.service({
            /* url: '/directory/getdirectoryandcontent,*/
            url: '/directory/getdirectoryandcontent',
            method: 'get',
        }).then(function (msg) {
            var data = msg.data.data;
            $('#dirList').html('')
            $('#content').html('')
            var i = tmp['i'] || 0;
            tmp['i'] = i;
            if (i >= data.length) {
                tmp['i'] = 0;
            }
            var lie = lyComponents.createList().setOption({ rowClick: true })
            lie.onRow(function (i, rowData, data) {
                if (data[i].type === 0 || data[i].type === 2) {//todo 后台没有给默认图标，所以前端暂时写死
                    return lyComponents.createIconTitle(
                        'iconfont icon-zhanghaoshezhi'
                        , rowData.nnm)

                } else {
                    return lyComponents.createIconTitle(
                        rowData.icon || 'iconfont icon-zhanghaoshezhi'
                        , rowData.nnm)
                }
                /*  return lyComponents.createIconTitle(
                      rowData.icon || 'iconfont icon-zhanghaoshezhi'
                      , rowData.nnm)*/
            })
            lie.setData(data).appendTo($('#dirList')).onClick(function (i, type) {
                //点击滚动条返回顶部
                $('html , body').animate({ scrollTop: 0 }, 0);
                // 远中状态  非选中切换
                $('#content').html('')
                var dir = data[i]
                var contentDto = dir.contentDtoList
                // contentDto 合并nid nnm  目录id 和 目录名 以便对证照进行判断
                contentDto.forEach(function (item, index) {
                    item.nnm = dir.nnm
                })
                tmp['dirNid'] = dir.nid;
                tmp['dirType'] = dir.type;
                tmp['contenttype'] = dir.contenttype;
                tmp['nnm'] = dir.nnm;
                tmp['i'] = i;
                tmp['dir'] = dir;
                $('#title').html(dir.nnm)
                $('#titleIcon')[0].className = dir.icon || 'iconfont icon-zhanghaoshezhi'
                if (dir.type != 0 && dir.type != 2) {
                    $('#addRow').show()
                } else {
                    $('#addRow').hide()
                }
                setContent(contentDto, dir.type === 0 || dir.type === 2)

            }).setClickRow(tmp['i'])
            //2000 为了视觉舒服
            setTimeout(function () {
                if (!window.isCertify && cardType && page) {
                    $('#startCertification_' + cardType + '_' + page).trigger('click')
                }
            }, 1500)

            // setContent(data[tmp['i']||0].contentDtoList)// 显示内容
            // 切换按钮
        })
    }
    win.init()

    // 设置标签页
    function setContent(contentDto, def) {
        added = false
        win['def'] = def;
        // 空列表
        if (!contentDto || contentDto.length === 0) {
            //证照？
            // 展位费
            var img = $('<img src="../img/empty.png"/>')
                .css({
                    'margin': 'auto'
                })
            // img.src = "../img/empty.png";
            var p = $('<p>暂无相关数据……</p>').css({
                ' font-family': 'PingFangSC-Regular',
                'font-size': '20px',
                'color': '#92939D',
                'margin-top': '20px'
                // 'text-align': 'right',
            })
            var div = $('<div></div>').css({
                'text-align': 'center',
                'margin-top': '20px'
            }).append(img).append(p)
            $('#content').append(div)

            return
        } else {
            for (var i = 0; i < contentDto.length; i++) {
                contentDto[i]['def'] = def
                contentDto[i]['dirType'] = tmp['dirType']
                contentDto[i]['dirNid'] = tmp['dirNid']
            }
        }
        // 默认目录不出现删除按钮
        var btnList = []

        if (def) {
            btnList = [
                { icon: '../img/photo2.svg', type: 'update', ele: false, class: 'icon-bianji', color: '#8099E2' },
            ]
        } else {
            btnList = [
                { icon: '../img/photo1.svg', type: 'delete', ele: false, class: 'icon-shanchu', color: '#DF7784' },
                { icon: '../img/photo2.svg', type: 'update', ele: false, class: 'icon-bianji', color: '#8099E2' },
            ]
        }
        if (def && tmp['dirType'] == 2) {
            btnList = []
            //由于刷新数据时现没有返回识别信息 暂时使用缓存下来的识别信息
            // 如果是证件 则过滤掉信息只留图片 信息用于折叠展示
            certificationArr = contentDto.filter(function (item) {
                return (item.type !== 3 && item.type != 'label')
            })
            contentDto = contentDto.filter(function (item) {
                return item.type === 3 || item.type == 'label'
            })
            for (var i = 0; i < contentDto.length; i++) {
                if (contentDto[i]['dirType'] == 2 && contentDto[i]['type'] == 3) {
                    if (contentDto[i]['cardtype'] == 1 && contentDto[i]['content']) {
                        window.localStorage.setItem('uuidC_' + contentDto[i]['cardtype'] + '_' + contentDto[i]['page'], contentDto[i]['content'])
                        window.localStorage.setItem('nidC_' + contentDto[i]['cardtype'] + '_' + contentDto[i]['page'], contentDto[i]['nid'])
                        if (!added) {
                            var insertdata = {
                                'type': 'label',
                                'tag': '识别信息',
                                'content': "<div class='seeAll isclosed' cardType='" + contentDto[i]['cardtype'] + "' page='" + contentDto[i]['page'] + "'><span class='seetext'>查看信息</span><img class='detail_arrow' src='../img/index/whitepoint.png'></div>"
                            }
                            contentDto.splice(i + 1, 0, insertdata)
                            i += 1
                        }
                    }
                }
            }
        }
        lyComponents.createList().setOption({ rmMouseover: true }).setBtn(btnList).setData(contentDto).appendTo($('#content')).onClick(function (i, type) {
            var da = contentDto[i];
            if (type === 'update') {
                //autype:为认证类型。   1：手机认证；2：邮箱认证
                if (da.autype == 1) {

                } else if (da.autype == 2) {
                    if (da.status != 0) {
                        mailboxVerifier('binding', '', 1);
                    } else {
                        mailboxVerifier('identification', da.content, 2);
                    }

                } else {
                    $('#myModal').modal('show', {
                        code: 'update',
                        id: da.id,
                        content: da.content,
                        tag: da.tag,
                        remark: da.remark,
                        type: da.type,
                        cuid: da.cuid
                    })
                }
            } else if (type == 'delete') {
                lyTool.confirm('删除标签', '标签删除后将无法恢复', function () {
                    lhRequest.service({
                        url: '/content/modifycontent',
                        method: 'post',
                        data: {
                            code: 'delete',
                            id: da.id,
                            del: 'Y'
                        }
                    }).then(function (msg) {
                        if (msg.data.code == 200) {
                            lyTool.toast('删除成功')
                            win.init()
                        }
                    }).catch(function (error) {
                    })
                })
            }
            // condition:文本框是否禁用； val：认证文本框值； type： 1代表激活；2代表修改
            function mailboxVerifier(condition, val, type) {
                // 是否已认证
                if (da.status != 0) {// 未认证
                    mailboxActive(condition, val, '认证邮箱', '认证邮箱后可以更安全的使用数据账户系统', '', 1);
                } else {// 已认证
                    mailboxActive(condition, val, '认证邮箱', '认证邮箱后可以更安全的使用数据账户系统', '', 2);
                }
                // 邮箱认证
                function mailboxActive(condition, val, title, hint1, hint2, btnVal) {
                    var time;
                    lyTool.verification(title, hint1, hint2, function (mailboxVal) {
                        lhRequest.service({
                            url: '/desensitize/getcode?link=' + mailboxVal,
                            method: 'get'
                        }).then(function (msg) {
                            if (msg.data.code == 200) {
                                var num = 60;
                                time = setInterval(function () {
                                    num--;
                                    $('.acquire').html(num + 's').attr('disabled', 'disabled').css({ 'opacity': '.6' });
                                    if (num == 0) {
                                        clearInterval(time);
                                        $('.acquire').html('获取验证码').removeAttr('disabled').css({ 'opacity': '1' });
                                        state = true;
                                    }
                                }, 1000)
                                lyTool.toast("请查收验证码");
                            }
                        }).catch(function (error) {
                        })
                    }, function (codeVal) {
                        lhRequest.service({
                            url: '/desensitize/checkcode',
                            method: 'post',
                            data: {
                                code: codeVal,
                                id: da.id,
                                type: type
                            }
                        }).then(function (msg) {
                            if (msg.data.code == 200) {
                                lyTool.toast("验证成功");
                                if (btnVal == 2) {
                                    clearInterval(time);
                                    $('.acquire').html('获取验证码').removeAttr('disabled').css({ 'opacity': '1' });
                                    mailboxActive('binding', '', '输入新的认证邮箱', '认证邮箱后可以更安全的使用数据账户系统', '', 1);
                                    type = 1;
                                } else {
                                    window.location.reload();
                                }
                            }
                        }).catch(function (error) {

                        })
                    }, condition, val, btnVal)
                }
            }
        })
    }

    $('#zidingyi').click(function () {
        var da = tmp['dir'] || {}
        // 权限判断
        if (da.type == 0 || da.type == 2) {
            lyTool.toast('此目录不允许修改')
            return
        }
        $('#myModal').modal('show', {
            code: 'update',
            id: da.id,
            cuid: da.nid,
            // content: da.content,
            nnm: da.nnm,
            icon: da.icon,
            type: 0
        })
    })
    // 弹窗
    win.primary = function (data) {
        var type = data.type;
        var url = ''
        if (data['def']) {
            url = '/defaultcontent/modifycontent'
        } else {
            url = '/content/modifycontent'
        }

        switch (type) {
            case 'dir': {
                var farmData = {
                    code: data.code,
                    nnm: data.name,
                    icon: data.icon,
                    directoryuuid: data.cuid,
                    /*  nfid: data.nfid,*/
                    /*type:1*/
                }
                data.id && (farmData['id'] = data.id)
                lhRequest.service({
                    url: '/directory/modifydirectory',
                    method: 'post',
                    data: farmData
                }).then(function (msg) {
                    if (msg.data.code == 200) {
                        lyTool.toast('操作成功')
                        win.init()
                    }
                })
            }
                break;
            case 'text': {
                var farmData = {
                    code: data.code,
                    content: data.content,
                    tag: data.tag,
                    remark: data.remark,
                    type: 1,
                    nid: tmp['dirNid'],
                    cuid: data.cuid
                }
                data.id && (farmData['id'] = data.id)
                lhRequest.service({
                    url: url,
                    method: 'post',
                    data: farmData
                }).then(function (msg) {
                    if (msg.data.code == 200) {
                        lyTool.toast('操作成功')
                        win.init()
                    }
                })
            }
                break;
            case 'url': {
                var farmData = {
                    code: data.code,
                    content: data.content,
                    tag: data.tag,
                    remark: data.remark,
                    type: 2,
                    nid: tmp['dirNid'],
                    cuid: data.cuid
                }
                data.id && (farmData['id'] = data.id)
                lhRequest.service({
                    url: url,
                    method: 'post',
                    data: farmData
                }).then(function (msg) {
                    if (msg.data.code == 200) {
                        lyTool.toast('操作成功')
                        win.init()
                    }
                })
            }
                break;
            case 'img': {
                var farmData = {
                    code: data.code,
                    content: data.content,
                    tag: data.tag || '',
                    remark: data.remark || '',
                    type: 3,
                    nid: tmp['dirNid'],
                    cuid: data.cuid || '',
                    filename: data.filename || '',
                    uuid: data.uuid || '',
                    filesize: data.fileSize || ''
                }
                data.id && (farmData['id'] = data.id)
                lhRequest.service({
                    url: url,
                    method: 'post',
                    data: farmData
                }).then(function (msg) {
                    if (msg.data.code == 200) {
                        lyTool.toast('操作成功')
                        win.init()
                    }
                })
            }
                break;
            case 'doc': {
                var farmData = {
                    code: data.code,
                    content: data.content,
                    tag: data.tag,
                    remark: data.remark,
                    type: 4,
                    nid: tmp['dirNid'],
                    cuid: data.cuid,
                    filename: data.filename || '',
                    uuid: data.uuid || '',
                    filesize: data.fileSize || ''
                }
                data.id && (farmData['id'] = data.id)
                lhRequest.service({
                    url: url,
                    method: 'post',
                    data: farmData
                }).then(function (msg) {
                    if (msg.data.code == 200) {
                        lyTool.toast('操作成功')
                        win.init()
                    }
                })
            }
                break;
            default:
                break;
        }
    }

    // 弹出效果 取消弹出效果，直接显示
    /*$('#addRow').on('mouseover', function () {
        // $(this).eq(1).css('display','none')
        time && clearTimeout(time)
        $('#addRowList').addClass('csl').removeClass('income').css('visibility', 'visible')
        // $('#add').css('visibility', 'hidden')
    })*/
    var time = null;
    /*$('#addRow').on('mouseout', function () {
        time && clearTimeout(time)
        // 添加延迟
        time = setTimeout(function () {
            $('#addRowList').addClass('income').removeClass('csl').css('visibility', 'visible')

            setTimeout(function () {
                $('#addRowList').css('visibility', 'hidden')
                // $('#add').css('visibility', 'visible')
            }, 500)
            time = null
        }, 1000);
    })*/

    // 第三级（内容中存在下拉状态的信息）
    $(document).on('click', '.seeAll', function () {
        // 传入当前点击的
        thirdlyClick($(this))
    })

    // 点击执行的方法
    function thirdlyClick(_this) {
        if (_this.hasClass('isclosed')) {
            // 标识是否存在（是否为展开状态）
            _this.find('.seetext').text('收起信息');
            _this.find('img').attr('src', '../img/index/bluepoint.png');
            _this.removeClass('isclosed')
            // var data = JSON.parse(window.localStorage.getItem('orcData_' + _this.attr('cardtype') + ''))
            var data = certificationArr
            /*if (!data || data.length == 0) {
                data = certificationArr
            }*/
            _addDetail(data, _this)
        } else {
            _this.find('.seetext').text('查看信息');
            _this.find('img').attr('src', '../img/index/whitepoint.png');
            _this.addClass('isclosed')
            _removeDetail(_this)
        }

        function _addDetail(_data, _this) {
            var page = _this.attr('page')
            var items = {
                'biz_license_credit_code': '信用代码',
                'biz_license_scope': '经营范围',
                'biz_license_address': '注册地址',
                'biz_license_operating_period': '经营周期',
                'biz_license_start_time': '注册时间',
                'biz_license_company_type': '公司类型',
                'biz_license_company_name': '公司名称',
                'biz_license_owner_name': '法人姓名',
                'biz_license_reg_capital': '注册资金'
            }
            var _thirdlyBox = $('<div class="thirdlyBox"></div>');
            var _thirdlyMain = $('<div class="thirdlyMain"></div>');
            // 下拉查看更多模版
            if (!_data || _data.length == 0) {
                _thirdlyMain.append($('<div class="col-xs-12" style="padding-left: 15px background: #F8F8F8;">暂无数据</div>'));

            } else {
                _data.forEach(function (item) {
                    if (item.page != page) {
                        return
                    }
                    var div = $('<div class="cell"></div>')
                    var key = item['tag'] + ''
                    var initThirdly =
                        $('<div class="mainContent shallow">' + items[key] + ':</div>' +
                            '<div class="mainContent dark">' + item['content'] + '</div>')
                    div.append(initThirdly);
                    _thirdlyMain.append(div)
                })
            }
            _thirdlyBox.append(_thirdlyMain);
            // 将整理好的模版插入到对于的父级下
            _this.parents('.row').eq(0).append(_thirdlyBox);
        }
        function _removeDetail(_this) {
            _this.parents('.row').eq(0).find('.thirdlyBox').remove();
        }
    }
}(window))
