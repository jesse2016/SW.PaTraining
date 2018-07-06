var getSelectText = function () {
    if (window.getSelection) {
        return unescape(window.getSelection().toString());
    }
    else if (document.getSelection) {
        return unescape(document.getSelection());
    }
    else if (document.selection) {
        return unescape(document.selection.createRange().text);
    }
    else {
        return "";
    }
}

var ContentBox = document.getElementById("newContent");
ContentBox.onmouseup = function () {
    var con = getSelectText();
    //setHeading
    document.getElementById("setHeading").onclick = function () {
        ContentBox.innerHTML = ContentBox.innerHTML.replace(con, set.heading(con));
    }
    //setColor
    var colorTarget = document.getElementById("setColor").getElementsByTagName("b");
    var colorCount = colorTarget.length;
    for (i = 0; i < colorCount; i++) {
        colorTarget.item(i).onclick = function () {
            var color = this.getAttribute("data-color");
            ContentBox.innerHTML = ContentBox.innerHTML.replace(con, set.color(con, color));
        }
    }
    //setBold
    document.getElementById("setBold").onclick = function () {
        ContentBox.innerHTML = ContentBox.innerHTML.replace(con, set._bold(con));
    }
    //WashStyle
    document.getElementById("washStyle").onclick = function () {
        WashStyle();
    }
}

var set = {
    heading: function (a) {

        if (a !== "") { return "<h2>" + a + "</h2>"; }
        else { console.log("-" + a + "-"); }
    },
    color: function (a, b) { return "<span style=\"color:" + b + "\">" + a + "</span>"; },
    _bold: function (a, b) { return "<b>" + a + "</b>"; }
}

//WashStyle
function WashStyle() {
    var content = ContentBox.innerHTML;
    valiHTML = ["br"];

    content = content.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(/\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "&nbsp;&nbsp;").replace(/<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(new RegExp("<(/?(?:" + valiHTML.join("|") + ")[^>]*)>", "gi"), "[$1]").replace(new RegExp('<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(/\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + valiHTML.join("|") + "|img|span)[^\\]]*)\\]", "gi"), "<$1>");

    if (navigator.userAgent.indexOf("Firefox") <= 0) {
        content = content.replace(/\r?\n/gi, "<br>");
    }

    ContentBox.innerHTML = content;
}

//toolBar
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
window.onscroll = function () {
    getScrollTop();
    console.log(getScrollTop());

    if (getScrollTop() > 100) {
        document.getElementById("toolBar").style.position = "fixed";
        document.getElementById("toolBar").style.top = "0";
    }
    else {
        document.getElementById("toolBar").style.position = "static";
        document.getElementById("toolBar").style.top = "auto";
    }
}

//loading
var loadingImg = new Loading();
loadingImg.background = "none",//set background-color of loading
loadingImg.size = "3rem";//set circle size of loading
loadingImg.borderWidth = "1px";//set circle's border width of loading
loadingImg.borderColorStator = "rgba(0,0,0,.3)";//set stator color of loading
loadingImg.borderColorRotator = "#a6ff4d";//set rotator color of loading
loadingImg.insert("popbox");//loading.insert("id");id是loading 插入的目标（必须是id）。目标默认是body，如果指定id则插入该id
document.getElementById("submit").onclick = function () {
    document.getElementById("popbox").style.left = "0";
    setTimeout(function () {
        document.getElementById("popbox").style.left = "-9999rem";
    }, 3000)
}