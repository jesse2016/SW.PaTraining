function setClass() {
    //选择节点绑定选中状态
    var target = document.getElementById("menu").getElementsByTagName("p");
    var num = target.length;
    for (i = 0; i < num; i++) {
        target.item(i).onclick = function () {
            for (o = 0; o < num; o++) {
                document.getElementById("menu").getElementsByTagName("p").item(o).setAttribute("class", "");
            }
            this.setAttribute("class", "on");
        }
    }
}

//loading
var loadingImg = new Loading();
loadingImg.background = "none",//set background-color of loading
loadingImg.size = "32px";//set circle size of loading
loadingImg.borderWidth = "2px";//set circle's border width of loading
loadingImg.borderColorStator = "rgba(0,0,0,.3)";//set stator color of loading
loadingImg.borderColorRotator = "#ff0";//set rotator color of loading
loadingImg.insert("popbox");//loading.insert("id");id是loading 插入的目标（必须是id）。目标默认是body，如果指定id则插入该id

function GetArticleNo() {
    $.ajax({
        url: '/Home/GetArticleCount?' + Math.random(),
        type: 'ajax',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            var html = "文章总数(" + res.Num + ")";
            $("#articleNo").text(html);
        }
    });
}

function loadTree() {
    $.ajax({
        url: '/Home/LoadTree?'+Math.random(),
        type: 'ajax',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            var data = eval("(" + res.Data + ")");
            var html = GetNode(data);
            $("#menu").empty();
            $("#menu").append(html);
            setClass();
        }
    });
}

function GetNode(data)
{
    var html = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].level > 1) {
            html += "<ul>";
        }
        if (data[i].level > 0) {
            html += "<li>";
        }
       
        var viewPage = null;
        if (data[i].nodeNo == 0) {
            viewPage = "list_null";
        }
        else {
            viewPage = "list";
        }
        var item = "<a href=\"/Article/" + viewPage + "?nodeId=" + data[i].id + "\" target=\"right\" ><p data-count=\"(" + data[i].nodeNo + ")\"><b>" + data[i].name + "</b><i class=\"fold\"></i></p></a>";

        var childNodeList = data[i].children;
        if (childNodeList != null) {
            if (data[i].level > 0) {               
                html += item;
            }
            html += GetNode(childNodeList);
        }
        else {
            if (data[i].level > 0) {
                html += item;
            }
        }

        if (data[i].level > 0) {
            html += "</li>";
        }
        if (data[i].level > 1) {
            html += "</ul>";
        }
    }
    return html;
}

$(document).ready(function () {
    GetArticleNo();
});

$(document).ready(function () {
    loadTree();
});

$(document).ready(function () {
    var nodeId = GetQueryString("nodeId");
    if (nodeId != undefined) {
        document.getElementById('lright').src = "/Article/list?nodeId=" + nodeId;
    }
    else {
        document.getElementById('lright').src = "/Home/EditNode";
    }
});