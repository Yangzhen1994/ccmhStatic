/**
 * Created by liyang on 2018/12/26.
 * 列表组件封装
 * @file
 * @author liyang
 * @version 1.0.0
 */


var lyComponents = (function (comp, win, doc, $) {
    /**
     * 基类
     */
    var View = function () {
    }

    View.prototype.appendTo = function (div) {
        div.append(this.view)
        return this
    }
    View.prototype.setIndex = function (i) {
        this.view.attr('i', i)
        return this
    }
    /**
     * 行组件
     */
    var Row = function () {

    }
    Row.prototype = new View()
    /**
     * 组件创建完成之后调用
     * @param {Ele} view - 创建的dom节点
     */
    Row.prototype.loadRow = function (view) {
        this.view = view;
        view.addClass('ly-row')
    }

    /**
     * icon-title组件
     */
    comp.createIconTitle = function (icon, title) {
        return new IconTitle(icon, title)
    }

    var IconTitle = function (icon, title) {
        var div = $('<div></div>').addClass('ly-row').css({
            'color': '#FFFFFF',
            'padding': '.3rem 1rem',
            'padding-right': '0px',
            'margin-top': '1rem',
            'margin-right': '-2rem',
            'border-bottom-left-radius': '.5rem',
            'border-top-left-radius': '.5rem',
            'font-size': '14px',
            'letter-spacing': '0.58px',
            'font-family': 'PingFangSC-Regular',
            'cursor': 'pointer',
            'overflow': 'hidden',
            'position': 'relative',
            // 'width': '168px',
        });
        var img = $(' <i></i>').css({
            'width': '1rem',
            'height': '1rem',
            'margin-left': '1rem'
        }).addClass(icon);
        // img.attr('src', icon)
        var title = $('<span>' + title + '</span>').css({
            'margin-left': '1.5rem',
            'line-height': '15px',
            'width': '86px',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'display': 'inline-block',
        })
        div.append(img)
        div.append(title)
        this.loadRow(div)
    }
    IconTitle.prototype = new Row()
    comp.IconTitle = IconTitle;
    IconTitle.prototype.click = function () {
        this.view.css({
            'background-color': '#FFFFFF',
            'color': '#ffa147'
        })
    }
    IconTitle.prototype.rmClick = function () {
        this.view.css({
            'background-color': 'transparent',
            'color': '#FFFFFF'
        })
    }
    /**
     * 创建一个列表
     * @param {Json} - 列表数据
     * @returns {List}
     */
    comp.createList = function (data) {
        return new List(data)
    }
    /**
     * 列表组件
     * @class
     * @param {Json} - 列表数据
     */
    var List = function (data) {

        // 创建列表
        this.view = $('<div></div>')

        // 创建内容承载
        this.content = $('<div></div>')


        this.view.append(this.content)
        if (data) this.setData(data)
    }
    List.prototype = new View()
    var listPrototype = List.prototype;
    //
    /**
     * 设置配置  是否需要相应鼠标事件
     * @param {Json} option - 配置
     */
    listPrototype.setOption = function (option) {
        this.rowClick = option.rowClick
        this.rmMouseover = option.rmMouseover
        return this
    }


    /**
     * 加载输入
     * @param {Json} - 列表数据
     */
    listPrototype.setData = function (data) {
        var len = data.length;
        this.btnViewLIst = []
        for (var i = 0; i < len; i++) {
            this.btnViewLIst.push(this.setRow(i, data[i], data).setIndex(i).appendTo(this.content))
        }
        // 监听鼠标事件 判断
        var self = this;
        this.clickIndex = 0;
        this.content.on('click', '.ly', function (e) {
            var target = $(this);
            self.click && self.click(target.attr('i'), target.attr('type'), target)
        })
        if (this.rowClick) {
            this.content.on('click', '.ly-row', function (e) {
                var target = $(this);
                var i = target.attr('i')
                self.btnViewLIst[self.clickIndex] && self.btnViewLIst[self.clickIndex].click && self.btnViewLIst[self.clickIndex].rmClick()
                i && self.btnViewLIst[i] && self.btnViewLIst[i].click && self.btnViewLIst[i].click()
                self.click && self.click.bind(self)(target.attr('i'), target.attr('type'))
                self.clickIndex = i
            })
            // self.btnViewLIst[0] && self.btnViewLIst[0].click && self.btnViewLIst[0].rmClick()


        }

        if (this.rmMouseover) {
            this.timeout = []
            this.content.on("mouseover", '.ly-row', function (e) {
                var target = $(this).css('background-color', 'rgb(245, 247, 249)');
                var i = target.attr('i')
                // 根据位置
                i && self.btnViewLIst[i] && self.btnViewLIst[i].show && self.btnViewLIst[i].show()
                if (self.timeout[i]) {
                    clearTimeout(self.timeout[i])
                    self.timeout[i] = null
                }
            })
            var yc = 100
            this.content.on("mouseout", '.ly-row', function (e) {
                var target = $(this);
                var i = target.attr('i')
                if (self.timeout[i]) return
                // 延迟
                self.timeout[i] = setTimeout(function (i) {
                    target.css('background-color', '#FFFFFF');
                    i && self.btnViewLIst[i] && self.btnViewLIst[i].show && self.btnViewLIst[i].hide()
                    self.timeout[i] = null;
                }, yc, i);
            })
        }

        return this
    }
    listPrototype.setClickRow = function (i) {
        this.btnViewLIst[i] && this.btnViewLIst[i].click && this.btnViewLIst[i].click()
        this.click && this.click.bind(this)(i)
        this.clickIndex = i
    }
    /**
     * 更新数据重写加载cell方法
     * @param {Number} i - 第几行
     * @param {Object} rowData - 当前行的数据
     * @param {Object} data - 整个列表的数据
     */
    listPrototype.setRow = function (i, rowData, data) {
        if (this.createRow) {
            return this.createRow(i, rowData, data)
        }

        var row = new Row(rowData.tag, rowData.content, rowData.remark, i, rowData)
        // 添加按钮到行
        var len = (this.btnLIst || []).length
        for (var i = 0; i < len; i++) {
            row.setBtn(this.btnLIst[i])
        }
        return row
    }
    /**
     * 传入功能按钮
     * @param {Json} btnLIst - 按钮列表 {icon: 标题图标，type:标题类型用于回传,ele:默认是否显示}
     */
    listPrototype.setBtn = function (btnLIst) {
        this.btnLIst = btnLIst;
        return this
    }

    /**
     * 更新数据重写加载cell方法
     * @callback onRow
     * @param {Number} i - 第几行
     * @param {Object} rowData - 当前行的数据
     * @param {Object} data - 整个列表的数据
     */
    /**
     * 触发生成行数
     * @param {onRow} callback - 触发
     */
    listPrototype.onRow = function (callback) {
        this.createRow = callback
    }


    /**
     * @callback onClick
     * @param {Number|String} - 列表行数
     * @param {String} - 按钮类型
     * @param {Ele} - 触发事件的元素
     */

    /**
     * 触发点击事件
     * @param {onClick} callback - 触发回调
     */
    listPrototype.onClick = function (callback) {
        this.click = callback;
        return this
    }

    /**
     * 列表行类
     * 两个标题信息
     * @constructor
     * @class
     * @param {String} title - 我是
     * @param {*} content
     * @param {*} doc
     */
    var _rowData;
    var Row = function (title, content, doc, i, rowData) {
        this.init(title, content, doc, i, rowData);
        _rowData = rowData;
    }
    comp.Row = Row;
    Row.prototype = new View()
    var RowPrototype = Row.prototype
    RowPrototype.init = function (title, content, doc, i, rowData) {
        this.i = i
        this.view = $('<div></div>').addClass('row ly-row ly-text').attr('i', i).attr('type', 'row').css({
            'background-color': '#FFF',
            'font-family': 'PingFangSC-Regular',
            'font-size': '12px',
            'color': '#666666',
            'line-height': '36px',
            'min-height': '36px',
            'border-radius': '4px'
        })
        $('<div>' + (title || '') + '</div>').appendTo(this.view)
            .addClass('col-xs-2')
            .css('pointer-events', 'noraml')
            .css('color', '#999999')
        if (rowData.type == 3) {
            var emptyDom = '<img class="_img" src="../img/empty.png" />'
            if (rowData.dirType == 2 && window['def']) {
                if (content) {
                    rowData.code = 'update'
                } else {
                    var _data = JSON.stringify(rowData)
                    var tip = rowData.tag ? "请上传" + rowData.tag + "图片" : "请上传图片"
                    emptyDom = '<label for="file" class="img_label">' +
                        '<div id="fileList1" class="fileLists">' +
                        '<p class="upload_tip">' + tip + '</p>' +
                        '<img class="zz zz1" src="../img/personal/yingyezhizhao.svg" alt="">' +
                        '</div>' +
                        '<input _data=' + _data + ' type="file" accept="image/*" name="content" id="file" class="file" upid="' + rowData.id + '" onchange="_uploadCertificate(this)" style="display: none">' +
                        '</label>'
                }

            }
            var _img = $(emptyDom)
                .on('click', function () {
                    if (rowData.dirType == 2 && window['def'] && !content) {
                        return
                    }
                    // 放大
                    if (window['def']) {
                        lhRequest.service({
                            url: '/defaultcontent/downloadfile',
                            method: 'get',
                            responseType: 'arraybuffer',
                            timeout: 10000,
                            params: {
                                uuid: content
                            }
                        }).then(function (msg) {
                            var base = new Base64().byteBufferToBase64(msg.data)
                            var baseURL = 'data:image/jpg;base64,' + base;
                            lyTool.img(baseURL)
                        })
                    } else {
                        lhRequest.service({
                            url: '/filehandle/downloadFile',
                            method: 'get',
                            responseType: 'arraybuffer',
                            timeout: 10000,
                            params: {
                                content: content,
                                isCompress: 'NO'
                            }
                        }).then(function (msg) {
                            var base = new Base64().byteBufferToBase64(msg.data)
                            var baseURL = 'data:image/jpg;base64,' + base;
                            lyTool.img(baseURL)
                        })
                    }
                })
            var $operateDom = ''
            var $fangdaDom = $('<div class="fangda"></div>').css({
                'border': '1px #E4E7ED solid',
                'margin': '12px 0px',
                'width': '180px',
                'height': '100px',
                'overflow': 'hidden',
                'position': 'relative',
                'border-radius': '4px',
                "display": "flex",
                "align-items": "center",
                "justify-content": "center",
            }).append(_img).append($('<i class ="icon-fangdachakan iconfont"></i>').css({
                'position': 'absolute',
                'right': '5px',
                'bottom': '5px',
                'font-size': '10px',
                'line-height': '10px',
                'pointer-events': 'normal'
            }))
            if (rowData.dirType == 2 && window['def'] && !content) {
                $fangdaDom = $('<div class="label_container"></div>').css({
                    'margin': '12px 0px',
                    'overflow': 'hidden',
                    'position': 'relative',
                    'border-radius': '4px',
                    "display": "flex"
                }).append(_img)
            } else if (rowData.dirType == 2 && window['def'] && content) {
                var _data = JSON.stringify(rowData)
                $operateDom = $('<div class="col-xs-12" style="padding: 0"><label class="col-xs-3" for="file' + rowData.id + '" id="reUpload"><img src="../img/reupload.svg" alt="">重新上传<input _data=' + _data + ' type="file" accept="image/*" name="content" id="file' + rowData.id + '" class="file" upid="' + rowData.id + '"  onchange="_uploadCertificate(this)" style="display: none"></label><span class="col-xs-2 startCertification" page="' + rowData.page + '" id="startCertification_' + rowData.cardtype + '_' + rowData.page + '"  onclick="_startCertification(this)"><img src="../img/shibie.svg" alt="">识别信息</span></div>')
            }

            var _div = $('<div></div>').addClass('col-xs-5').css({}).append($operateDom).append($fangdaDom).appendTo(this.view)


            // 下载缩略图
            if (rowData.def) {
                lhRequest.service({
                    url: '/defaultcontent/downloadfile',
                    method: 'get',
                    responseType: 'arraybuffer',
                    timeout: 10000,
                    params: {
                        id: rowData.id,
                        uuid: rowData.content,
                    }
                }).then(function (msg) {
                    var base = new Base64().byteBufferToBase64(msg.data)
                    _img.attr('src', 'data:image/jpg;base64,' + base).css({ 'cursor': 'pointer', 'width': '100%' })

                }).catch(function (err) {
                    console.log(err)
                })
            } else {
                lhRequest.service({
                    url: '/filehandle/downloadFile',
                    method: 'get',
                    responseType: 'arraybuffer',
                    timeout: 10000,
                    params: {
                        content: content,
                        isCompress: 'YES'
                    }
                }).then(function (msg) {
                    var base = new Base64().byteBufferToBase64(msg.data)
                    var url = 'data:image/jpg;base64,' + base
                    var newImg = new Image();
                    newImg.src = url;
                    setTimeout(function () {
                        if (newImg.height < 100 || newImg.width < 180) {
                            $("._img").css({ "width": "100%" });
                        } else {
                            $("._img").css({ "width": "", "height": "" });
                        }
                    }, 50)
                    _img.attr('src', url).css({ 'cursor': 'pointer' });
                })
            }

            // lhRequest.service({
            //     url: '/filehandle/downloadFile',
            //     method: 'get',
            //     responseType: 'arraybuffer',
            //     timeout: 10000,
            //     params: {
            //         content: content,
            //         isCompress: 'YES'
            //     }
            // }).then(function (msg) {
            //     var base = new Base64().byteBufferToBase64(msg.data)
            //     _img.attr('src', 'data:image/jpg;base64,' + base)
            // })

            // .attr()

        } else if (rowData.type == 4) {
            $('<div><i class="iconfont icon-zidingyimulu-tubiao" style="margin-right: 1rem"></i>   ' + (rowData.filename || '') + '</div>')
                .appendTo(this.view)
                .addClass('col-xs-5')
                .css('cursor', 'pointer')
                .on('click', function () {
                    if (rowData.def) {
                        lhRequest.service({
                            url: '/defaultcontent/downloadfile',
                            method: 'get',
                            responseType: 'arraybuffer',
                            params: {
                                id: rowData.id,
                            }
                        }).then(function (msg) {
                            var data = msg.data;
                            var url = window.URL.createObjectURL(new Blob([data]))
                            var link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = url
                            link.setAttribute('download', rowData.filename)
                            document.body.appendChild(link)
                            link.click()
                        })
                    } else {
                        lhRequest.service({
                            url: '/filehandle/downloadFile',
                            method: 'get',
                            responseType: 'arraybuffer',
                            params: {
                                content: content,
                            }
                        }).then(function (msg) {
                            var data = msg.data;
                            var url = window.URL.createObjectURL(new Blob([data]))
                            var link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = url
                            link.setAttribute('download', rowData.filename)
                            document.body.appendChild(link)
                            link.click()
                        })
                    }

                })
        } else if (rowData.type == 2) {
            $('<div><a style="text-decoration:underline;color: #0000CC" href="' + (content || '') + '" target="view_window">' + (content || '') + '</a></div>').appendTo(this.view).addClass('col-xs-5').css({ 'overflow': 'hidden' })
        } else {
            $('<div>' + (content || '') + '</div >').appendTo(this.view).addClass('col-xs-5').css({
                'pointer-events': 'normal',
                'overflow': 'hidden'
            })
        }
        $('<div>' + (doc || '') + '</div>').appendTo(this.view).addClass('col-xs-3').css({
            'pointer-events': 'normal',
            'color': '#BDC0C2',
            'letter-spacing': '0.5px'
        })
        this.btnView = $('<div></div>').appendTo(this.view).addClass('col-xs-2').css({
            'visibility': 'hidden',
            'text-align': 'right',
            'padding-right': '30px'
        })
        return this
    }


    // 添加按钮
    /**
     * 添加按钮
     * @param {}
     * @returns {String} -
     */
    RowPrototype.setBtn = function (data) {
        // 添加认证状态图标  qsq
        if (_rowData.autype == 2) {
            var iconColor = '#CFCFCF';
            if (_rowData.status != 0) {
                iconColor = '#CFCFCF';
            } else {
                iconColor = '#FBAA5D';
            }
            var iconData = { icon: '../img/weirenz.svg', type: 'identification', ele: false, class: 'icon-auth', color: iconColor }; //'#FBAA5D'
            $('<div></div>').appendTo(this.btnView).addClass('ly AUTH iconfont ' + iconData.class).attr('i', this.i).attr('type', iconData.type).css({
                'display': 'initial',
                'margin-right': '20px',
                'color': iconData.color,
            })
        }
        $('<div></div>').appendTo(this.btnView).addClass('ly iconfont ' + data.class).attr('i', this.i).attr('type', data.type).css({
            'display': 'initial',
            'margin-right': '20px',
            'color': data.color,
            'cursor': 'pointer',
        })
    }
    RowPrototype.show = function () {
        this.btnView.css('visibility', 'visible')
    }
    RowPrototype.hide = function () {
        this.btnView.css('visibility', 'hidden')
    }
    /*上传证件Beta ？ */
    window._uploadCertificate = function (obj) {
        $('.btn.btn-primary').addClass('disabled')
        var self = obj;
        var _data = JSON.parse($(self).attr('_data'))
        var fileSize = self.files[0].size;
        var fileType = self.files[0].type;
        var inputType = 'img';
        // 文件类型判断 // 文件大小判断
        var isMatch = _judgeTypeMatch(inputType, fileType, fileSize, self)
        if (!isMatch) {
            return
        }

        // 判断类型
        if (window['def']) {
            lhRequest.service({
                url: '/defaultcontent/savedefaultcontent',
                method: 'post',
                data: {
                    file: self.files[0],
                    filesize: self.files[0].size,
                    id: $(self).attr('upid') || ''
                    // name:this.files[0].name
                },
                onUploadProgress: function (progressEvent) {
                    if (progressEvent.lengthComputable) {
                        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                        _setProgress(progressEvent);
                    } else {
                        lyTool.showloading()
                    }
                }
            }).then(function (msg) {
                lyTool.hideloading()
                if (msg.data.code === 200) {
                    $(self).attr('typeFile', inputType);
                    $(self).attr('filename', msg.data.data.originalname);
                    $(self).attr('uuid', msg.data.data.uuid);
                    lyTool.toast('上传成功')
                    //把nid父级目录的业务id uuid文件上传后生成的文件名缓存
                    window.localStorage.setItem('nidC_' + _data['cardtype'] + '_' + _data['page'], _data.nid)
                    window.localStorage.setItem('uuidC_' + _data['cardtype'] + '_' + _data['page'], msg.data.data.uuid)
                    _data.type = 3
                    _data.cardtype = _data.cardtype || 1
                    //window.localStorage.setItem('cardType', _data.cardtype)
                    _data.remark = ''
                    _data.code = _data.code ? _data.code : 'update'
                    _data.filename = $(self).attr('filename');
                    _data.content = $(self).attr('uuid');
                    _data.nid = _data.nid ? _data.nid : '';
                    _data.id = _data.id ? _data.id : $(self).attr('upid');
                    //return
                    var farmData = {
                        code: _data.code ? _data.code : 'update',
                        content: _data.content,
                        tag: _data.tag || '',
                        remark: _data.remark || '',
                        type: 3,
                        nid: _data.nid,
                        cuid: _data.cuid || '',
                        filename: _data.filename || '',
                        uuid: _data.uuid || '',
                        id: _data.id || '',
                        cardtype: _data.cardtype
                    }
                    if (farmData.code == 'create') { farmData.id = '' }
                    _refreshView(farmData)
                } else {

                    lyTool.toast('文件上传失败')
                    $(self).val('')
                }
                $('.btn.btn-primary').removeClass('disabled')
                // win.init()
            }.bind(this)).catch(function (err) {
                $('.btn.btn-primary').removeClass('disabled')
                console.log(err)
                lyTool.hideloading()
                lyTool.toast('文件上传失败')
                $(self).val('')
            })
        }

        function _judgeTypeMatch(inputType, fileType, fileSize, dom) {
            if (inputType == "img" && fileType.indexOf('image') < 0) {
                lyTool.toast('请上传图片');
                $(dom).val('')
                return false
            } else if (inputType == "doc" && fileType.indexOf('image') > -1 || !fileType) {
                lyTool.toast('请上传文件');
                $(dom).val('')
                return false
            }
            if (fileSize && fileSize > MAX_SIZE_IMG && inputType == "img") {
                lyTool.toast('图片大小不得超过4MB');
                $(dom).val('')
                return false
            }
            if (fileSize && fileSize > MAX_SIZE_FILE && inputType == "doc") {
                lyTool.toast('文件大小不得超过4MB');
                $(dom).val('')
                return false
            }
            return true
        }

        function _setProgress(event) {
            var precent = (event.loaded / event.total) * 100;
            lyTool.showloadingBar(precent)
        }

        function _refreshView(data) {
            // 上传图片成功后
            lhRequest.service({
                url: '/credentialcontent/modifycontent',
                method: 'post',
                data: data
            }).then(function (msg) {
                if (msg.data.code == 200) {
                    lyTool.toast('操作成功')
                }
                window.isCertify = false
                win.init(data.cardtype, data.page)
            }).catch(function (err) {
                window.isCertify = false
                win.init(data.cardtype)
            })

            // win.init()
        }

    }
    /*识别*/
    window._startCertification = function (obj) {
        lyTool.showloading()
        var cardTtype = $(obj).attr('id').split('_')[1]
        var page = $(obj).attr('page')
        lhRequest.service({
            url: '/credentialcontent/ocr/recognizeIDCard',
            method: 'post',
            data: {
                nid: window.localStorage.getItem('nidC_' + cardTtype + '_' + page),
                uuid: window.localStorage.getItem('uuidC_' + cardTtype + '_' + page),
                cardtype: cardTtype,
                page: page
            }
        }).then(function (msg) {
            lyTool.hideloading()
            if (msg.data.code == 200) {

                //暂存到localStorage
                //window.localStorage.setItem('orcData_'+msg.data.data[0].cardtype+'',JSON.stringify(msg.data.data))
                lyTool.toast('识别成功')

            } else {
                lyTool.toast('识别未通过')
                // var cardType = window.localStorage.getItem('cardType')
                // window.localStorage.removeItem('orcData_'+cardType)
            }
            window.isCertify = true
            win.init()
        }).catch(function () {
            lyTool.hideloading()
        })
    }
    return comp
}(lyComponents || {}, window, document, $))
