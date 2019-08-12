var storage={
    set(key,value){
        sessionStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
        return JSON.parse(sessionStorage.getItem(key))
    },
    remove(key){
        sessionStorage.removeItem(key)
    }
};
// export default storage;
/*****rem*****/
rem()
function rem() {
    var psd_width = 1366,
        win_width = document.documentElement.clientWidth,
        viewport = document.querySelector('meta[name="viewport"]'),
        dpr = window.devicePixelRatio || 1,
        scale = 1 / dpr,
        rem;
//console.log(win_width,document.documentElement.clientWidth)
//$(viewport).remove();
//$("head").append('<meta name="format-detection" content="telephone=no, email=no"/><meta name="viewport" content="width=1,user-scalable=no,target-densitydpi=device-dpi">');
    var style = document.createElement('style');
    rem = win_width / psd_width * 100;
    style.innerHTML = "html{font-size:" + rem + "px!important;}";
    document.querySelector("head").appendChild(style);
}

