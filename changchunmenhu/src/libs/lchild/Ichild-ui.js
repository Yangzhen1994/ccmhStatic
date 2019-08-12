/**
 * Ichild-ui.jscss框架交互组件库
 * 1、框架交互Ichild-ui.js库，包括：dialog、messager、popwin、scrollbar、sha1
 * update 20180411.0915 统一格式，补充使用方法
 */
//[FView]对话框----------------------------------------------------------------------sien
;
(function(name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
        // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;

    if (hasDefine) {
        // AMD环境或CMD环境
        define(definition);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition();
    }
})('dialog', function() {
    var description = "this is a dialog component";
    var builder = function(options, callBack) {

        this.__how2useit = function() {
            var msgobj = new dialog({ type: 'success', title: _title, discription: args, showTitle: shTitle, bottons: ['确定'] }, function(ret) {
                if (callback) {
                    callback();
                }
            });
            msgobj.show();
        };
        this.defaultDailog = {
            width: 380, //宽度
            height: 'auto', //高度
            padding: '10px 16px', //padding
            showTitle: true, //显示标题
            title: '提示!', //提醒信息
            discription: '这是弹窗的描述!', //描述
            borderRadius: '4px', //圆角
            bottons: ['取消', '确定'], //按钮信息
            maskBg: 'rgba(0,0,0,0.6)', //遮罩层背景色
            dailogBg: '#fff', //弹出框的背景色
            type: 'primary', //类型 defalut primary   success  danger  warning
            zIndex: '10000011', //层级
            hideScroll: false, //是否关闭滚动条
            isBtnHasBgColor: true, //确定  取消按钮是否有背景色
            showBoxShadow: false, //弹窗是否显示boxshadow
            animateStyle: 'fadeInNoTransform', //进入的效果
            isInput: false, //是否显示输入框
            inputPlaceholder: '填写相关内容', //文本输入提示框
        };

        this.opt = $.extend(this.defaultDailog, options || {});

        // 设置btn是否有颜色
        this.btn_className = this.opt.isBtnHasBgColor ? '' : 'no_bg';

        // 点击的索引
        this.btnIndex = '';

        this._isScroll = function() {
            if (this.opt.hideScroll) {
                $('body,html').css({
                    overflow: 'hidden',
                });
            }
        };

        this._colseScroll = function() {
            $('body,html').css({
                overflow: 'auto',
            });
        };

        this._overflowBtn = function() {
            // bottons超过两个提示
            if (this.opt.bottons.length > 2) {
                console.log('dialog.js-->按钮的最多显示上限不超过2个');
            }
        };

        this._isBoxShadow = function() {
            // 是否显示boxshadow
            if (!this.opt.showBoxShadow) {
                _this.dailog_div.addClass('no_boxShadow');
            };
        };

        this._btnIndex = function(name) {
            //获取点击的索引
            var btnName = name || '';
            for (var i = 0; i < this.opt.bottons.length; i++) {
                if (btnName === this.opt.bottons[i]) {
                    btnIndex = i;
                }
            }
        };

        this.show = function() {
            _this = this;
            if ($('.cpt_mask_dailog').length) {
                return;
            };
            _this.dailog_mask = $("<div class='" + _this.opt.animateStyle + " animated cpt_mask_dailog " + _this.opt.type + "'></div>").css({
                'background': _this.opt.maskBg,
                'z-index': _this.opt.zIndex,
            }).appendTo($('body'));

            _this._isScroll();
            // 判断按钮是否超出两个
            _this._overflowBtn();

            _this.dailog_div = $("<div class='div_dailog'></div>").css({
                'width': _this.opt.width,
                'height': _this.opt.height,
                'background': _this.opt.dailogBg,
                '-moz-border-radius': _this.opt.borderRadius,
                '-webkit-border-radius': _this.opt.borderRadius,
                'border-radius': _this.opt.borderRadius,
                'padding': _this.opt.padding,
            }).appendTo(_this.dailog_mask);

            if (_this.opt.showTitle) {
                _this.title_dailog = $("<div class='title_dailog'></div>").html(_this.opt.title).appendTo(_this.dailog_div);
            }

            if (!_this.opt.isInput) {
                _this.discription_dailog = $("<div class='discription_dailog'></div>").html(_this.opt.discription).appendTo(_this.dailog_div);
            } else {
                _this.discription_dailog = $("<div class='discription_dailog'></div>").css({
                    'text-indent': 0,
                }).appendTo(_this.dailog_div);
                var txt = _this.opt.inputPlaceholder;
                _this.input_dailog = $("<input type='text' class='dailog_input' placeholder=" + txt + ">").val(txt).appendTo(_this.discription_dailog);
            }

            _this.dailog_divOperation = $("<div class='dailog_divOperation'></div>").appendTo(_this.dailog_div);

            if (!(_this.opt.bottons.length === 2)) {
                _this.firstBtn = $("<span class='btn_span " + _this.btn_className + "'></span>").html(_this.opt.bottons[0]).attr({ 'data-name': _this.opt.bottons[0] }).appendTo(_this.dailog_divOperation);
            } else {

                if (_this.opt.bottons[0] == "取消") {
                    _this.btn_className = "no_bg";
                } else {
                    _this.btn_className = "";
                }
                _this.firstBtn = $("<span class='btn_span " + _this.btn_className + "'></span>").html(_this.opt.bottons[0]).attr({ 'data-name': _this.opt.bottons[0] }).appendTo(_this.dailog_divOperation);

                _this.btn_className = "";
                _this.secondBtn = $("<span class='btn_span " + _this.btn_className + "'></span>").html(_this.opt.bottons[1]).attr({ 'data-name': _this.opt.bottons[1] }).appendTo(_this.dailog_divOperation);
            }

            //是否显示boxshadow
            _this._isBoxShadow();

            //关闭点击和触摸的默认事件
            _this.dailog_mask.on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            _this.dailog_mask.on('touchmove', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            // 点击的回调
            _this.dailog_divOperation.children().on('click', function(e) {
                var name = $(this).attr('data-name');
                //获取点击的索引
                _this._btnIndex(name);

                var inputstatus = _this.input_dailog ? 1 : 0;
                var inputvalue = inputstatus ? _this.input_dailog.val() : '';

                // 设置返回值
                var ret = {
                    index: btnIndex,
                    input: {
                        status: inputstatus,
                        value: inputvalue,
                    }
                };

                _this._colseScroll();

                //未写回调函数则不会有效果
                if (typeof(callBack) === 'function') {
                    //执行回调函数
                    callBack(ret);
                }
                _this.dailog_mask.remove();
            });


        };
    };
    return builder;
});

//[FView]消息提示(iziToast)----------------------------------------------------------------------sien
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.iziToast = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function(root) {
    'use strict';
    //
    // Variables
    //
    var PLUGIN_NAME = 'iziToast';
    var iziToast = {};
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test
    var isMobile = (/Mobi/.test(navigator.userAgent)) ? true : false;
    var mobileWidth = 568;
    var config = {};

    // Default settings
    var defaults = {
        class: '',
        title: '',
        message: '',
        color: '', // blue, red, green, yellow
        icon: '',
        iconText: '',
        iconColor: '',
        image: '../../icons/imsg.png',
        imageWidth: 40,
        layout: 1,
        balloon: false,
        close: true,
        rtl: false,
        position: 'bottomRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
        target: '',
        timeout: 5000,
        duration: 3000,
        pauseOnHover: true,
        resetOnHover: false,
        progressBar: true,
        progressBarColor: '',
        animateInside: true,
        buttons: {},
        transitionIn: 'fadeInUp', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight, flipInX
        transitionOut: 'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        transitionInMobile: 'fadeInUp',
        transitionOutMobile: 'fadeOutDown',
        onOpen: function() {},
        onClose: function() {}
    };

    //
    // Methods
    //


    /**
     * Polyfill for remove() method
     */
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function(collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            if (collection) {
                for (var i = 0, len = collection.length; i < len; i++) {
                    callback.call(scope, collection[i], i, collection);
                }
            }
        }
    };

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function(defaults, options) {
        var extended = {};
        forEach(defaults, function(value, prop) {
            extended[prop] = defaults[prop];
        });
        forEach(options, function(value, prop) {
            extended[prop] = options[prop];
        });
        return extended;
    };

    /**
     * Get the closest matching element up the DOM tree
     * @param {Element} elem Starting element
     * @param {String} selector Selector to match against (class, ID, or data attribute)
     * @return {Boolean|Element} Returns false if not match found
     */
    var getClosest = function(elem, selector) {
        var firstChar = selector.charAt(0);
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    return elem;
                }
            } else if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            } else if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
                    return elem;
                }
            }
        }
        return false;
    };

    function __how2useit() {
        var toastconf = {
            title: '',
            message: args,
            color: "green",
            //icon: "ico-check",
            //image: '../../za/default/imgs/check.png', 
            position: 'topCenter',
            transitionIn: 'fadeInDown',
            onOpen: function() {

            },
            onClose: function() {
                if (callback) {
                    callback();
                }
            }
        };
        iziToast.show(toastconf);
    }

    /**
     * animationEnd 
     * @private
     */
    function whichAnimationEvent() {
        var t,
            el = document.createElement("fakeelement");

        var animations = {
            "animation": "animationend",
            "OAnimation": "oAnimationEnd",
            "MozAnimation": "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        };
        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }
    }
    var animationEvent = whichAnimationEvent();

    /**
     * Create a fragment DOM elements
     * @private
     */
    function createFragElem(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }

    /**
     * Do the calculation to move the progress bar
     * @private
     */
    function moveProgress(toast, settings, callback) {

        var isPaused = false;
        var isReseted = false;
        var isClosed = false;
        var timerTimeout = null;
        var elem = toast.querySelector("." + PLUGIN_NAME + "-progressbar div");
        var progressBar = {
            hideEta: null,
            maxHideTime: null,
            currentTime: new Date().getTime(),
            updateProgress: function() {
                isPaused = toast.classList.contains(PLUGIN_NAME + '-paused') ? true : false;
                isReseted = toast.classList.contains(PLUGIN_NAME + '-reseted') ? true : false;
                isClosed = toast.classList.contains(PLUGIN_NAME + '-closed') ? true : false;

                //console.log(new Date().getTime());

                if (isReseted) {
                    console.log('ok');
                    clearTimeout(timerTimeout);
                    elem.style.width = '100%';
                    moveProgress(toast, settings, callback);
                    toast.classList.remove(PLUGIN_NAME + '-reseted');
                }
                if (isClosed) {
                    clearTimeout(timerTimeout);
                    console.log('closed1');
                    toast.classList.remove(PLUGIN_NAME + '-closed');
                }

                if (!isPaused && !isReseted && !isClosed) {
                    progressBar.currentTime = progressBar.currentTime + 10;
                    var percentage = ((progressBar.hideEta - (progressBar.currentTime)) / progressBar.maxHideTime) * 100;
                    elem.style.width = percentage + '%';

                    if (Math.round(percentage) < 0 || typeof toast != 'object') {
                        clearTimeout(timerTimeout);
                        callback.apply();
                        console.log('closed2');
                    }
                }

            }
        };
        if (settings.timeout > 0) {
            progressBar.maxHideTime = parseFloat(settings.timeout);
            progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
            timerTimeout = setInterval(progressBar.updateProgress, 10);
        }

    }

    /**
     * Destroy the current initialization.
     * @public
     */
    iziToast.destroy = function() {

        forEach(document.querySelectorAll('.' + PLUGIN_NAME + '-wrapper'), function(element, index) {
            element.remove();
        });

        forEach(document.querySelectorAll('.' + PLUGIN_NAME), function(element, index) {
            element.remove();
        });

        // Remove event listeners
        document.removeEventListener(PLUGIN_NAME + '-open', {}, false);
        document.removeEventListener(PLUGIN_NAME + '-close', {}, false);

        // Reset variables
        config = {};
    };

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    iziToast.settings = function(options) {

        // feature test
        if (!supports) return;

        // Destroy any existing initializations
        iziToast.destroy();

        config = options;
        defaults = extend(defaults, options || {});
    };

    /**
     * Info theme
     * @public
     * @param {Object} options User settings
     */
    iziToast.info = function(options) {

        var theme = {
            color: "blue",
            icon: "ico-info"
        };

        var settings = extend(config, options || {});
        settings = extend(theme, settings || {});

        this.show(settings);
    };

    /**
     * Success theme
     * @public
     * @param {Object} options User settings
     */
    iziToast.success = function(options) {

        var theme = {
            color: "green",
            icon: "ico-check"
        };

        var settings = extend(config, options || {});
        settings = extend(theme, settings || {});

        this.show(settings);
    };

    /**
     * Warning theme
     * @public
     * @param {Object} options User settings
     */
    iziToast.warning = function(options) {

        var theme = {
            color: "yellow",
            icon: "ico-warning"
        };

        var settings = extend(config, options || {});
        settings = extend(theme, settings || {});

        this.show(settings);
    };

    /**
     * Error theme
     * @public
     * @param {Object} options User settings
     */
    iziToast.error = function(options) {

        var theme = {
            color: "red",
            icon: "ico-error"
        };

        var settings = extend(config, options || {});
        settings = extend(theme, settings || {});

        this.show(settings);
    };

    /**
     * Close the specific Toast
     * @public
     * @param {Object} options User settings
     */
    iziToast.hide = function(options, $toast) {

        var settings = extend(defaults, options || {});

        if (typeof $toast != 'object') {
            $toast = document.querySelector($toast);
        }
        $toast.classList.add(PLUGIN_NAME + '-closed');

        if (settings.transitionIn || settings.transitionInMobile) {
            $toast.classList.remove(settings.transitionIn, settings.transitionInMobile);
        }
        if (settings.transitionOut || settings.transitionOutMobile) {

            if (isMobile || window.innerWidth <= mobileWidth) {
                if (settings.transitionOutMobile.length > 0)
                    $toast.classList.add(settings.transitionOutMobile);
            } else {
                if (settings.transitionOut.length > 0)
                    $toast.classList.add(settings.transitionOut);
            }
            var H = $toast.parentNode.offsetHeight;
            $toast.parentNode.style.height = H + 'px';
            $toast.style.pointerEvents = 'none';
            if (isMobile || window.innerWidth <= mobileWidth) {

            } else {
                $toast.parentNode.style.transitionDelay = '0.2s';
            }

            setTimeout(function() {
                $toast.parentNode.style.height = '0px';
                window.setTimeout(function() {
                    $toast.parentNode.remove();
                }, 1000);
            }, 200);

        } else {
            $toast.parentNode.remove();
        }

        if (settings.class) {
            try {
                var event;
                if (window.CustomEvent) {
                    event = new CustomEvent('iziToast-close', { detail: { class: settings.class } });
                } else {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent('iziToast-close', true, true, { class: settings.class });
                }
                document.dispatchEvent(event);
            } catch (ex) {
                console.warn(ex);
            }
        }

        if (typeof settings.onClose !== "undefined")
            settings.onClose.apply();
    };

    /**
     * Create and show the Toast
     * @public
     * @param {Object} options User settings
     */
    iziToast.show = function(options) {

        var that = this;

        // Merge user options with defaults
        var settings = extend(config, options || {});
        settings = extend(defaults, settings);

        var $toastCapsule = document.createElement("div");
        $toastCapsule.classList.add(PLUGIN_NAME + "-capsule");

        var $toast = document.createElement("div");
        $toast.classList.add(PLUGIN_NAME);

        if (isMobile || window.innerWidth <= mobileWidth) {
            if (settings.transitionInMobile.length > 0)
                $toast.classList.add(settings.transitionInMobile);
        } else {
            if (settings.transitionIn.length > 0)
                $toast.classList.add(settings.transitionIn);
        }

        if (settings.rtl) {
            $toast.classList.add(PLUGIN_NAME + '-rtl');
        }

        if (settings.color.length > 0) { //#, rgb, rgba, hsl

            if (settings.color.substring(0, 1) == "#" || settings.color.substring(0, 3) == "rgb" || settings.color.substring(0, 3) == "hsl") {
                $toast.style.background = settings.color;
            } else {
                $toast.classList.add(PLUGIN_NAME + '-color-' + settings.color);
            }
        }

        if (settings.class) {
            $toast.classList.add(settings.class);
        }

        if (settings.image) {
            var $cover = document.createElement("div");
            $cover.classList.add(PLUGIN_NAME + '-cover');
            $cover.style.width = settings.imageWidth + "px";
            $cover.style.height = settings.imageWidth + "px";
            $cover.style.backgroundImage = 'url(' + settings.image + ')';
            $toast.appendChild($cover);
        }

        var $buttonClose;
        if (settings.close) {
            $buttonClose = document.createElement("button");
            $buttonClose.classList.add(PLUGIN_NAME + '-close');
            $toast.appendChild($buttonClose);
        } else {
            if (settings.rtl) {
                $toast.style.paddingLeft = "30px";
            } else {
                $toast.style.paddingRight = "30px";
            }
        }

        if (settings.progressBar) {

            var $progressBar = document.createElement("div");
            $progressBar.classList.add(PLUGIN_NAME + '-progressbar');

            var $progressBarDiv = document.createElement("div");
            $progressBarDiv.style.background = settings.progressBarColor;

            $progressBar.appendChild($progressBarDiv);
            $toast.appendChild($progressBar);

            setTimeout(function() {
                moveProgress($toast, settings, function() {
                    that.hide(settings, $toast);
                });
            }, 300);
        } else if (settings.progressBar === false && settings.timeout > 0) {
            setTimeout(function() {
                that.hide(settings, $toast);
            }, settings.duration);
        }


        var $toastBody = document.createElement("div");
        $toastBody.classList.add(PLUGIN_NAME + '-body');

        if (settings.image) {
            if (settings.rtl) {
                $toastBody.style.marginRight = (settings.imageWidth + 10) + 'px';
            } else {
                $toastBody.style.marginLeft = (settings.imageWidth + 10) + 'px';
            }
        }

        /*
        if (settings.icon) {
            var $icon = document.createElement("i");
            $icon.setAttribute("class", PLUGIN_NAME + '-icon ' + settings.icon);

            if (settings.iconText) {
                $icon.appendChild(document.createTextNode(settings.iconText));
            }

            if (settings.rtl) {
                $toastBody.style.paddingRight = '33px';
            } else {
                $toastBody.style.paddingLeft = '33px';
            }

            if (settings.iconColor) {
                $icon.style.color = settings.iconColor;
            }
            $toastBody.appendChild($icon);
        }
        */

        var $strong = document.createElement("strong");
        $strong.appendChild(document.createTextNode(settings.title));

        var $p = document.createElement("p");
        $p.appendChild(document.createTextNode(settings.message));


        if (settings.layout > 1) {
            $p.style.width = "100%";
            $toast.classList.add(PLUGIN_NAME + "-layout" + settings.layout);
        }

        if (settings.balloon) {
            $toast.classList.add(PLUGIN_NAME + "-balloon");
        }

        $toastBody.appendChild($strong);
        $toastBody.appendChild($p);

        var $buttons;
        if (settings.buttons.length > 0) {

            $buttons = document.createElement("div");
            $buttons.classList.add(PLUGIN_NAME + '-buttons');

            $p.style.marginRight = '15px';

            var i = 0;
            forEach(settings.buttons, function(value, index) {
                $buttons.appendChild(createFragElem(value[0]));

                var $btns = $buttons.childNodes;

                $btns[i].addEventListener('click', function(event) {
                    event.preventDefault();
                    var ts = value[1];
                    return new ts(that, $toast);
                });

                i++;
            });

            $toastBody.appendChild($buttons);
        }

        $toast.appendChild($toastBody);
        $toastCapsule.style.visibility = 'hidden';
        $toastCapsule.style.height = '0px';
        $toastCapsule.appendChild($toast);

        setTimeout(function() {
            var H = $toast.offsetHeight;
            var style = $toast.currentStyle || window.getComputedStyle($toast);
            var marginTop = style.marginTop;
            marginTop = marginTop.split("px");
            marginTop = parseInt(marginTop[0]);
            var marginBottom = style.marginBottom;
            marginBottom = marginBottom.split("px");
            marginBottom = parseInt(marginBottom[0]);

            $toastCapsule.style.visibility = '';
            $toastCapsule.style.height = (H + marginBottom + marginTop) + 'px';
            setTimeout(function() {
                $toastCapsule.style.height = 'auto';
            }, 1000);
        }, 100);

        var position = settings.position,
            $wrapper;



        if (settings.target) {

            $wrapper = document.querySelector(settings.target);
            $wrapper.classList.add(PLUGIN_NAME + '-target');
            $wrapper.appendChild($toastCapsule);

        } else {
            if (isMobile || window.innerWidth <= mobileWidth) {
                if (settings.position == "bottomLeft" || settings.position == "bottomRight" || settings.position == "bottomCenter") {
                    position = PLUGIN_NAME + '-wrapper-bottomCenter';
                } else if (settings.position == "topLeft" || settings.position == "topRight" || settings.position == "topCenter") {
                    position = PLUGIN_NAME + '-wrapper-topCenter';
                } else {
                    position = PLUGIN_NAME + '-wrapper-center';
                }
            } else {
                position = PLUGIN_NAME + '-wrapper-' + position;
            }
            $wrapper = document.querySelector('.' + PLUGIN_NAME + '-wrapper.' + position);

            if (!$wrapper) {
                $wrapper = document.createElement("div");
                $wrapper.classList.add(PLUGIN_NAME + '-wrapper');
                $wrapper.classList.add(position);
                document.body.appendChild($wrapper);
            }
            if (settings.position == "topLeft" || settings.position == "topCenter" || settings.position == "topRight") {
                $wrapper.insertBefore($toastCapsule, $wrapper.firstChild);
            } else {
                $wrapper.appendChild($toastCapsule);
            }
        }

        settings.onOpen.apply();

        try {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent('iziToast-open', { detail: { class: settings.class } });
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent('iziToast-open', true, true, { class: settings.class });
            }
            document.dispatchEvent(event);
        } catch (ex) {
            console.warn(ex);
        }

        if (settings.animateInside) {
            $toast.classList.add(PLUGIN_NAME + '-animateInside');

            var timeAnimation1 = 200;
            var timeAnimation2 = 100;
            var timeAnimation3 = 300;
            if (settings.transitionIn == "bounceInLeft") {
                timeAnimation1 = 400;
                timeAnimation2 = 200;
                timeAnimation3 = 400;
            }

            window.setTimeout(function() {
                $strong.classList.add('slideIn');
            }, timeAnimation1);

            window.setTimeout(function() {
                $p.classList.add('slideIn');
            }, timeAnimation2);

            if (settings.icon) {
                window.setTimeout(function() {
                    $icon.classList.add('revealIn');
                }, timeAnimation3);
            }

            if (settings.buttons.length > 0 && $buttons) {
                var counter = 150;
                forEach($buttons.childNodes, function(element, index) {

                    window.setTimeout(function() {
                        element.classList.add('revealIn');
                    }, counter);
                    counter = counter + counter;
                });
            }
        }

        if ($buttonClose) {
            $buttonClose.addEventListener('click', function(event) {
                var button = event.target;
                that.hide(settings, $toast);
            });
        }

        if (settings.pauseOnHover) {

            $toast.addEventListener('mouseenter', function(event) {
                this.classList.add(PLUGIN_NAME + '-paused');
            });
            $toast.addEventListener('mouseleave', function(event) {
                this.classList.remove(PLUGIN_NAME + '-paused');
            });
        }
        if (settings.resetOnHover) {

            $toast.addEventListener('mouseenter', function(event) {
                this.classList.add(PLUGIN_NAME + '-reseted');
            });
            $toast.addEventListener('mouseleave', function(event) {
                this.classList.remove(PLUGIN_NAME + '-reseted');
            });
        }
    };

    return iziToast;
});

//[FView]虚拟滚动条----------------------------------------------------------------------sien
;
(function(name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
        // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;

    if (hasDefine) {
        // AMD环境或CMD环境
        define(definition);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition();
    }
})('ScrollBar', function() {
    var ScrollBar = function(opts) {
        var init = function(opts) {
            this.version = "v1.170620.17";
            this._initConf(opts);
            this._initDoms();
            this._initStates();
            this._initEvents();
            this._launch(opts);
        };
        init.prototype = {
            __how2useit: function() {
                var htmltxt = '<div class="inner-slbar" id="inner-slbar-id"><div class="slbar-cont" id="slbar-cont-id"></div></div>';
                var scrollobj = new ScrollBar({
                    wrapId: 'inner-slbar-id', //容器id
                    dir: 'v', //滚动方向
                    autoFix: true //是否锁定页面滚动事件
                });
            },
            // utils
            _id: function(id) {
                return document.getElementById(id);
            },
            _class: function(searchClass, node, tag) {
                var classElements = [],
                    els, elsLen, pattern;
                if (node === null) node = document.body;
                if (tag === null) tag = '*';
                if (node.getElementsByClassName) {
                    return node.getElementsByClassName(searchClass);
                }
                if (node.querySelectorAll) {
                    return node.querySelectorAll('.' + searchClass);
                }
                els = node.getElementsByTagName(tag);
                elsLen = els.length;
                pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
                for (i = 0, j = 0; i < elsLen; i++) {
                    if (pattern.test(els[i].className)) {
                        classElements[j] = els[i];
                        j++;
                    }
                }
                return classElements;
            },
            _extend: function(o, t) {
                o = o || {};
                for (var sName in t) {
                    o[sName] = t[sName];
                }
                return o;
            },
            _getMousePos: function(e) {
                if (e.pageX || e.pageY) {
                    return {
                        x: e.pageX,
                        y: e.pageY
                    };
                }
                if (document.documentElement && document.documentElement.scrollTop) {
                    return {
                        x: e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
                        y: e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
                    };
                } else if (document.body) {
                    return {
                        x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
                        y: e.clientY + document.body.scrollTop - document.body.clientTop
                    };
                }
            },
            // init
            _initConf: function(opts) {
                this.conf = this._extend({
                    wrapId: 'scroll_w',
                    dir: 'auto',
                    autoFix: false
                }, opts);
            },
            _initDoms: function() {
                var that = this,
                    c = this.conf,
                    wrap, scroller,
                    v_scrollBar, v_sHandle, v_sHandleBd,
                    h_scrollBar, h_sHandle, h_sHandleBd;

                wrap = typeof c.wrapId === 'string' ? this._id(c.wrapId) : c.wrapId;
                wrap.style.position = 'relative';
                scroller = wrap.getElementsByTagName('div')[0];
                //cp.add 170620 修复滑轮滚动失效bug
                // scroller.style.overflow = 'hidden';
                //注：需要计算内容高度指定给容器第一个子容器

                if (c.dir === 'auto' || c.dir === 'v') {
                    v_scrollBar = document.createElement('div');
                    v_scrollBar.className = 'scrollbar scrollbar_v';
                    v_scrollBar.innerHTML = '\
                        <div class="scrollbar_path"></div>\
                        <div class="scrollbar_handle">\
                            <div class="scrollbar_handle_head"></div>\
                            <div class="scrollbar_handle_body"></div>\
                            <div class="scrollbar_handle_foot"></div>\
                        </div>';
                    v_sHandle = this._class('scrollbar_handle', v_scrollBar, 'div')[0];
                    v_sHandleBd = this._class('scrollbar_handle_body', v_scrollBar, 'div')[0];
                    v_scrollBar.style.display = 'none';
                    wrap.appendChild(v_scrollBar);
                }
                if (c.dir === 'auto' || c.dir === 'h') {
                    h_scrollBar = document.createElement('div');
                    h_scrollBar.className = 'scrollbar scrollbar_h';
                    h_scrollBar.innerHTML = '\
                        <div class="scrollbar_path"></div>\
                        <div class="scrollbar_handle">\
                            <div class="scrollbar_handle_head"></div>\
                            <div class="scrollbar_handle_foot"></div>\
                            <div class="scrollbar_handle_body"></div>\
                        </div>';
                    h_sHandle = this._class('scrollbar_handle', h_scrollBar, 'div')[0];
                    h_sHandleBd = this._class('scrollbar_handle_body', h_scrollBar, 'div')[0];
                    h_scrollBar.style.display = 'none';
                    wrap.appendChild(h_scrollBar);
                }
                this.doms = {
                    wrap: wrap,
                    scroller: scroller,
                    v_scrollBar: v_scrollBar,
                    v_sHandle: v_sHandle,
                    v_sHandleBd: v_sHandleBd,
                    h_scrollBar: h_scrollBar,
                    h_sHandle: h_sHandle,
                    h_sHandleBd: h_sHandleBd
                };
            },
            _initStates: function() {
                var that = this,
                    c = this.conf,
                    d = this.doms;

                this.states = {
                    v_total: null,
                    v_client: null,
                    v_cur: null,
                    v_barSize: null,
                    v_bar_cur: null,
                    h_total: null,
                    h_client: null,
                    h_cur: null,
                    h_barSize: null,
                    h_bar_cur: null,
                    mouseX: null,
                    mouseY: null
                };
                this._refreshStates();
            },
            _initEvents: function() {
                var that = this,
                    c = this.conf,
                    d = this.doms,
                    s = this.states,
                    mouseStartX, mouseStartY,
                    mouseCurX, mouseCurY,
                    barStartX, barStartY,
                    dragging = false,
                    isVBar = false,
                    touchInitPosX, touchInitPosY;

                if (d.v_sHandle) {
                    d.v_sHandle.onmouseover = function(e) {
                        this.className += ' scrollbar_on';
                    };
                    d.v_sHandle.onmouseout = function(e) {
                        this.className = 'scrollbar_handle';
                    };
                    d.v_sHandle.onmousedown = function(e) {
                        isVBar = true;
                        onDown.call(this, e);
                    };
                }
                if (d.h_sHandle) {
                    d.h_sHandle.onmouseover = function(e) {
                        this.className += ' scrollbar_on';
                    };
                    d.h_sHandle.onmouseout = function(e) {
                        this.className = 'scrollbar_handle';
                    };
                    d.h_sHandle.onmousedown = function(e) {
                        isVBar = false;
                        onDown.call(this, e);
                    };
                }

                if ('ontouchstart' in window) {
                    d.scroller.ontouchstart = onTouchStart;
                    d.scroller.ontouchmove = onTouchMove;
                    d.scroller.ontouchend = onTouchEnd;
                }

                if ('onmousewheel' in d.scroller) {
                    d.scroller.onmousewheel = onMouseWheel;
                } else {
                    d.scroller.addEventListener('DOMMouseScroll', onMouseWheel, false);
                }

                function _prevent(e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                }

                function onMouseWheel(e) {
                    var e = e || window.event,
                        delta = 0,
                        deltaX = 0,
                        deltaY = 0,
                        toPosY, toPosX;

                    if (dragging) return;

                    // Old school scrollwheel delta
                    if (e.wheelDelta) {
                        delta = e.wheelDelta / 120;
                    }
                    if (e.detail) {
                        delta = -e.detail / 3;
                    }

                    // New school multidimensional scroll (touchpads) deltas
                    deltaY = delta;

                    // Gecko
                    if (e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS) {
                        deltaY = 0;
                        deltaX = -1 * delta;
                    }

                    // Webkit
                    if (e.wheelDeltaY !== undefined) {
                        deltaY = e.wheelDeltaY / 120;
                    }
                    if (e.wheelDeltaX !== undefined) {
                        deltaX = -1 * e.wheelDeltaX / 120;
                    }

                    that.refresh();
                    if (c.dir === 'auto' || c.dir === 'v') {
                        if (delta < 0) {
                            if (s.v_bar_cur === s.v_client - s.v_barSize) return;
                        } else {
                            if (s.v_bar_cur === 0) return;
                        }
                        _prevent(e);
                        toPosY = s.v_bar_cur - delta * (s.v_client - s.v_barSize) / 10;
                        d.v_sHandle.style.top = toPosY + 'px';
                        s.v_bar_cur = toPosY;
                        that.scrollTo(toPosY / (s.v_client - s.v_barSize), true);
                    } else if (c.dir === 'h') {
                        if (delta < 0) {
                            if (s.h_bar_cur === s.h_client - s.h_barSize) return;
                        } else {
                            if (s.h_bar_cur === 0) return;
                        }
                        _prevent(e);
                        toPosX = s.h_bar_cur - delta * (s.h_client - s.h_barSize) / 10;
                        d.h_sHandle.style.left = toPosX + 'px';
                        s.h_bar_cur = toPosX;
                        that.scrollTo(toPosX / (s.h_client - s.h_barSize), false);
                    }

                }

                function onDown(e) {
                    var e = e || window.event,
                        mousePos = that._getMousePos(e),
                        dragEle;

                    if (isVBar) {
                        dragEle = d.v_sHandle;
                        mouseStartY = mousePos.y;
                        barStartY = s.v_bar_cur;
                        d.v_sHandle.style.cursor = "move";
                    } else {
                        dragEle = d.h_sHandle;
                        mouseStartX = mousePos.x;
                        barStartX = s.h_bar_cur;
                        d.h_sHandle.style.cursor = "move";
                    }

                    if (dragEle.setCapture) {
                        dragEle.onlosecapture = onUp;
                        dragEle.setCapture();
                        e.cancelBubble = true;
                    } else {
                        if (window.captureEvents) {
                            e.stopPropagation();
                            window.onblur = onUp;
                            e.preventDefault();
                        }
                    }
                    dragging = true;
                    document.onmousemove = onMove;
                    document.onmouseup = onUp;
                }

                function onMove(e) {
                    var e = e || window.event,
                        mousePos = that._getMousePos(e),
                        toPosX, toPosY;
                    if (isVBar) {
                        mouseCurY = mousePos.y;
                        toPosY = barStartY + mouseCurY - mouseStartY;
                        if (toPosY < 0) {
                            toPosY = 0;
                        } else if (toPosY > s.v_client - s.v_barSize) {
                            toPosY = s.v_client - s.v_barSize;
                        }
                        d.v_sHandle.style.top = toPosY + 'px';
                        s.v_bar_cur = toPosY;
                        that.scrollTo(toPosY / (s.v_client - s.v_barSize), isVBar);
                    } else {
                        mouseCurX = mousePos.x;
                        toPosX = barStartX + mouseCurX - mouseStartX;
                        if (toPosX < 0) {
                            toPosX = 0;
                        } else if (toPosX > s.h_client - s.h_barSize) {
                            toPosX = s.h_client - s.h_barSize;
                        }
                        d.h_sHandle.style.left = toPosX + 'px';
                        s.h_bar_cur = toPosX;
                        that.scrollTo(toPosX / (s.h_client - s.h_barSize), isVBar);
                    }

                }

                function onUp(e) {
                    dragging = false;
                    if (isVBar) {
                        dragEle = d.v_sHandle;
                    } else {
                        dragEle = d.h_sHandle;
                    }
                    if (dragEle.releaseCapture) {
                        dragEle.onlosecapture = null;
                        dragEle.releaseCapture();
                    }
                    if (window.releaseEvents) {
                        window.onblur = null;
                    }
                    mouseStartX = mouseStartY = null;
                    document.onmousemove = null;
                    document.onmouseup = null;
                }

                function onTouchStart(e) {
                    // document.querySelector('#cl').innerHTML += ' start';
                    if (e.touches.length !== 1) { return; }

                    touchInitPosX = e.touches[0].pageX;
                    touchInitPosY = e.touches[0].pageY;
                }

                function onTouchMove(e) {
                    var barStartX, barStartY, toPosX, toPosY,
                        cX, cY, dX, dY;
                    if (e.touches.length !== 1) { return; }

                    cX = e.touches[0].pageX;
                    cY = e.touches[0].pageY;
                    dX = cX - touchInitPosX;
                    dY = cY - touchInitPosY;
                    _prevent(e);

                    if (c.dir === 'auto' || c.dir === 'v') {
                        barStartY = s.v_bar_cur;
                        toPosY = barStartY - (dY / 10);
                        if (toPosY < 0) {
                            toPosY = 0;
                        } else if (toPosY > s.v_client - s.v_barSize) {
                            toPosY = s.v_client - s.v_barSize;
                        }
                        d.v_sHandle.style.top = toPosY + 'px';
                        s.v_bar_cur = toPosY;
                        that.scrollTo(toPosY / (s.v_client - s.v_barSize), true);
                    }
                    if (c.dir === 'auto' || c.dir === 'h') {
                        barStartX = s.h_bar_cur;
                        toPosX = barStartX - (dX / 10);
                        if (toPosX < 0) {
                            toPosX = 0;
                        } else if (toPosX > s.h_client - s.h_barSize) {
                            toPosX = s.h_client - s.h_barSize;
                        }
                        d.h_sHandle.style.left = toPosY + 'px';
                        s.h_bar_cur = toPosX;
                        that.scrollTo(toPosX / (s.h_client - s.h_barSize), false);
                    }
                }

                function onTouchEnd(e) {
                    touchInitPosX = touchInitPosY = null;
                }
            },
            _launch: function() {
                var that = this,
                    c = this.conf,
                    d = this.doms,
                    s = this.states;

                this.refresh();
                if (c.autoFix) {
                    setInterval(function() {
                        that.refresh();
                    }, 100);
                }
            },
            _refreshStates: function() {
                var that = this,
                    c = this.conf,
                    d = this.doms,
                    s = this.states;

                s.v_total = d.scroller.scrollHeight;
                s.v_client = d.scroller.clientHeight;
                s.v_cur = d.scroller.scrollTop;
                s.h_total = d.scroller.scrollWidth;
                s.h_client = d.scroller.clientWidth;
                s.h_cur = d.scroller.scrollLeft;
            },
            scrollTo: function(posPercent, isVBar) {
                var that = this,
                    c = this.conf,
                    d = this.doms,
                    s = this.states;
                if (isVBar) {
                    d.scroller.scrollTop = posPercent * (s.v_total - s.v_client);
                } else {
                    d.scroller.scrollLeft = posPercent * (s.h_total - s.h_client);
                }
                this.refresh();
            },
            refresh: function() {
                var that = this,
                    c = this.conf,
                    d = this.doms,
                    s = this.states;

                this._refreshStates();

                // 总长或总宽为0, 通常原因为dom不可见, 不需要刷新
                if (s.v_total === 0 || s.h_total === 0) { return };

                //判断浏览器类型
                function uaBrowser() {
                    var useragent = navigator.userAgent || navigator.vendor || window.opera;
                    var edge = window.navigator.userAgent.indexOf('Edge') > -1;
                    // regex below thanks to http://detectmobilebrowsers.com/
                    var mobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(useragent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(useragent.substr(0, 4)));
                    return {
                        edge: edge,
                        mobile: mobile,
                    }

                }

                if (c.dir === 'auto' || c.dir === 'v') {
                    //cp.add 170620 计算滚动容器宽度，隐藏原生滚动条
                    if (d.wrap.clientWidth) {
                        var contw = d.wrap.clientWidth;
                        if (contw > 0) {
                            var widthPixels = uaBrowser().mobile ? 0 : (uaBrowser().edge ? 12 : 10);
                            d.scroller.style.width = (contw + widthPixels) + "px";
                        }
                    }

                    s.v_barSize = s.v_client * s.v_client / s.v_total;
                    s.v_bar_cur = (s.v_client - s.v_barSize) * s.v_cur / (s.v_total - s.v_client);
                    d.v_scrollBar.style.height = s.v_client + 'px';
                    d.v_sHandle.style.height = s.v_client * s.v_client / s.v_total + 'px';
                    d.v_sHandleBd.style.height = s.v_client * s.v_client / s.v_total - 4 + 'px';
                    d.v_sHandle.style.top = s.v_bar_cur + 'px';
                    if (s.v_client < s.v_total) {
                        d.v_scrollBar.style.display = 'block';
                    } else {
                        d.v_scrollBar.style.display = 'none';
                    }
                }
                if (c.dir === 'auto' || c.dir === 'h') {
                    s.h_barSize = s.h_client * s.h_client / s.h_total;
                    s.h_bar_cur = (s.h_client - s.h_barSize) * s.h_cur / (s.h_total - s.h_client);
                    d.h_scrollBar.style.width = s.h_client + 'px';
                    d.h_sHandle.style.width = s.h_client * s.h_client / s.h_total + 'px';
                    d.h_sHandleBd.style.width = s.h_client * s.h_client / s.h_total - 4 + 'px';
                    d.h_sHandle.style.left = s.h_bar_cur + 'px';
                    if (s.h_client < s.h_total) {
                        d.h_scrollBar.style.display = 'block';
                    } else {
                        d.h_scrollBar.style.display = 'none';
                    }
                }
            }
        };
        return init;
    }();

    return ScrollBar;
});

//[FView]弹窗----------------------------------------------------------------------sien
;
(function(name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
        // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;

    if (hasDefine) {
        // AMD环境或CMD环境
        define(['../../js/ScrollBar.js'], definition);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition(require('../../js/ScrollBar.js'));
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition(ScrollBar);
    }
})('popwin', function(scrollbar) {
    var description = "this is a popwin component";
    var builder = function(options, callBack) {
        this.__how2useit = function() {
            var msgobj = new popwin({ width: "80%", height: "500px", frurl: _url, title: _title, showTitle: shTitle });
            msgobj.show();
        };
        this.defaultPopwin = {
            width: 280, //宽度
            height: 'auto', //高度
            padding: '10px 16px', //padding
            showTitle: true, //显示标题
            title: '提示!', //提醒信息
            discription: '这是弹窗的描述!', //描述
            borderRadius: '4px', //圆角
            maskBg: 'rgba(0,0,0,0.6)', //遮罩层背景色
            popwinBg: '#fff', //弹出框的背景色
            zIndex: '10000011', //层级
            frurl: "", //iframe 地址
            hideScroll: false, //是否关闭滚动条
            showBoxShadow: false, //弹窗是否显示boxshadow
            animateStyle: 'fadeInNoTransform', //进入的效果
            contentHtml: "" //弹窗内容
        };

        this.opt = $.extend(this.defaultPopwin, options || {});

        this._isScroll = function() {
            if (this.opt.hideScroll) {
                $('body,html').css({
                    overflow: 'hidden',
                });
            }
        };

        this._colseScroll = function() {
            $('body,html').css({
                overflow: 'auto',
            });
        };

        this._isBoxShadow = function() {
            // 是否显示boxshadow
            if (!this.opt.showBoxShadow) {
                _this.popwin_div.addClass('no_boxShadow');
            };
        };

        this.show = function() {
            _this = this;
            if ($('.cpt_mask_popwin').length) {
                return;
            };
            _this.popwin_mask = $("<div class='" + _this.opt.animateStyle + " animated cpt_mask_popwin'></div>").css({
                'background': _this.opt.maskBg,
                'z-index': _this.opt.zIndex,
            }).appendTo($('body'));

            _this._isScroll();

            _this.popwin_div = $("<div class='div_popwin'></div>").css({
                'width': _this.opt.width,
                'height': _this.opt.height,
                'background': _this.opt.popwinBg,
                '-moz-border-radius': _this.opt.borderRadius,
                '-webkit-border-radius': _this.opt.borderRadius,
                'border-radius': _this.opt.borderRadius,
                'padding': _this.opt.padding,
            }).appendTo(_this.popwin_mask);

            _this.title_popwin = $("<div class='title_popwin'></div>").css({
                'width': '100%',
                'border-bottom': '0'
            }).appendTo(_this.popwin_div);

            if (_this.opt.showTitle) {
                _this.title_txt = $("<div class='title_txt'></div>").html(_this.opt.title).appendTo(_this.title_popwin);
            }
            _this.title_close = $("<div class='title_close'><img class='icon_close' src='../../icons/pw-close.png'></div>").appendTo(_this.title_popwin);

            if (!_this.contentHtml) {
                _this.contentHtml = '<div class="popwin-slbar" id="popwin-slbar-id">' +
                    '<div class="popwin-cont" id="popwin-cont-id">' +
                    '<iframe id="popwin-fr" src="' + _this.opt.frurl + '" name="popwin-fr" class="popwin-fr-c" onload="popwinFrLoaded()" scrolling="no" marginheight="0" marginwidth="0"></iframe>' +
                    '</div>' +
                    '</div>';
            }
            _this.popwin_divOperation = $("<div class='popwin_divOperation'></div>").html(_this.contentHtml).appendTo(_this.popwin_div);

            //是否显示boxshadow
            _this._isBoxShadow();

            //关闭事件
            _this.title_close.on('click', function(e) {
                _this._colseScroll();
                _this.popwin_mask.remove();
            });

            // 点击的回调
            _this.popwin_divOperation.children().on('click', function(e) {
                _this._colseScroll();

                //未写回调函数则不会有效果
                if (typeof(callBack) === 'function') {
                    //执行回调函数
                    callBack(ret);
                }
                _this.popwin_mask.remove();
            });

            _this.hscrollobj = new scrollbar({
                wrapId: 'popwin-slbar-id',
                dir: 'v',
                autoFix: true
            });

        };
    };
    return builder;
});

/**
 * 更新popwin iframe高度
 */
function popwinFrLoaded() {
    var popbh = $("#popwin-slbar-id").height();
    $("#popwin-cont-id").height(popbh);

    //计算内容页面高度
    var popdoch = $("#popwin-fr").contents().find("body").height();

    var pmaxH = Math.max(popbh, popdoch);
    $("#popwin-fr").height(pmaxH);
};

//[FView]SHA1加密----------------------------------------------------------------------sien
/**
 * @author sien
 * @description 导出加密模块
 */
;
(function(name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
        // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;

    if (hasDefine) {
        // AMD环境或CMD环境
        define(definition);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition();
    }
})('AWSha', function() {
    function AWSha1() {
        // 加密
        this.encode = function(str) {
            return hex_sha1(utf16to8(str));
        };

        this.__how2useit = function() {
            var encodePwd = AWSha.encode(upwd);
        };

        // ////////////////////////////////////////////////////////////////////////////////////////////
        // 内部方法
        // Configurable variables.
        // You may need to tweak these to be compatible with the server-side,
        // but the defaults work in most cases.

        // hex output format. 0 - lowercase; 1 - uppercase
        var hexcase = 0;
        // base-64 pad character. "=" for strict RFC compliance
        var b64pad = "";
        // bits per input character. 8 - ASCII; 16 - Unicode
        var chrsz = 8;
        // UTF16到UTF8转码
        utf16to8 = function(str) {
                var out, i, len, c;
                out = "";
                len = str.length;
                for (i = 0; i < len; i++) {
                    c = str.charCodeAt(i);
                    if ((c >= 0x0001) && (c <= 0x007F)) {
                        out += str.charAt(i);
                    } else if (c > 0x07FF) {
                        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    } else {
                        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    }
                }
                return out;
            }
            // These are the functions you'll usually want to call They take string arguments
            // and return either hex or base-64 encoded strings
        hex_sha1 = function(s) {
            return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
        }
        b64_sha1 = function(s) {
            return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
        }
        str_sha1 = function(s) {
            return binb2str(core_sha1(str2binb(s), s.length * chrsz));
        }
        hex_hmac_sha1 = function(key, data) {
            return binb2hex(core_hmac_sha1(key, data));
        }
        b64_hmac_sha1 = function(key, data) {
            return binb2b64(core_hmac_sha1(key, data));
        }
        str_hmac_sha1 = function(key, data) {
                return binb2str(core_hmac_sha1(key, data));
            }
            // Calculate the SHA-1 of an array of big-endian words, and a bit length
        core_sha1 = function(x, len) {
                // append padding
                x[len >> 5] |= 0x80 << (24 - len % 32);
                x[((len + 64 >> 9) << 4) + 15] = len;

                var w = Array(80);
                var a = 1732584193;
                var b = -271733879;
                var c = -1732584194;
                var d = 271733878;
                var e = -1009589776;

                for (var i = 0; i < x.length; i += 16) {
                    var olda = a;
                    var oldb = b;
                    var oldc = c;
                    var oldd = d;
                    var olde = e;

                    for (var j = 0; j < 80; j++) {
                        if (j < 16) {
                            w[j] = x[i + j];
                        } else {
                            w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                        }
                        var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                        e = d;
                        d = c;
                        c = rol(b, 30);
                        b = a;
                        a = t;
                    }

                    a = safe_add(a, olda);
                    b = safe_add(b, oldb);
                    c = safe_add(c, oldc);
                    d = safe_add(d, oldd);
                    e = safe_add(e, olde);
                }
                return Array(a, b, c, d, e);
            }
            // Perform the appropriate triplet combination function for the current iteration
        sha1_ft = function(t, b, c, d) {
                if (t < 20) {
                    return (b & c) | ((~b) & d);
                }
                if (t < 40) {
                    return b ^ c ^ d;
                }
                if (t < 60) {
                    return (b & c) | (b & d) | (c & d);
                }
                return b ^ c ^ d;
            }
            // Determine the appropriate additive constant for the current iteration
        sha1_kt = function(t) {
                return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
            }
            // Calculate the HMAC-SHA1 of a key and some data
        core_hmac_sha1 = function(key, data) {
                var bkey = str2binb(key);
                if (bkey.length > 16) {
                    bkey = core_sha1(bkey, key.length * chrsz);
                }

                var ipad = Array(16),
                    opad = Array(16);
                for (var i = 0; i < 16; i++) {
                    ipad[i] = bkey[i] ^ 0x36363636;
                    opad[i] = bkey[i] ^ 0x5C5C5C5C;
                }

                var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
                return core_sha1(opad.concat(hash), 512 + 160);
            }
            // Add integers, wrapping at 2^32.
            // This uses 16-bit operations internally to work around bugs in some JS interpreters.
        safe_add = function(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }
            // Bitwise rotate a 32-bit number to the left.
        rol = function(num, cnt) {
                return (num << cnt) | (num >>> (32 - cnt));
            }
            // Convert an 8-bit or 16-bit string to an array of big-endian words In 8-bit function,
            // characters >255 have their hi-byte silently ignored.
        str2binb = function(str) {
                var bin = Array();
                var mask = (1 << chrsz) - 1;
                for (var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                }
                return bin;
            }
            // Convert an array of big-endian words to a string
        binb2str = function(bin) {
                var str = "";
                var mask = (1 << chrsz) - 1;
                for (var i = 0; i < bin.length * 32; i += chrsz) {
                    str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
                }
                return str;
            }
            // Convert an array of big-endian words to a hex string.
        binb2hex = function(binarray) {
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for (var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                }
                return str;
            }
            // Convert an array of big-endian words to a base-64 string
        binb2b64 = function(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) {
                        str += b64pad;
                    } else {
                        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                    }
                }
            }
            return str;
        }
    };
    var sha1 = new AWSha1();
    return sha1;
});