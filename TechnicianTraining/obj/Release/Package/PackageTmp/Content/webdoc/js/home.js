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
        url: '/Home/GetArticleCount',
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
        url: '/Home/LoadTree',
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
       
        var childNodeList = data[i].children;
        if (childNodeList != null) {
            if (data[i].level > 0) {
                html += "<p data-count=\"(" + data[i].nodeNo + ")\"><b>" + data[i].name + "</b></p>";
            }
            html += GetNode(childNodeList);
        }
        else {
            if (data[i].level > 0) {
                var viewPage = null;
                if (data[i].nodeNo == 0) {
                    viewPage = "list_null";
                }
                else {
                    viewPage = "list";
                }
                html += "<p data-count=\"(" + data[i].nodeNo + ")\"><b><a href=\"/Article/"+ viewPage +"?nodeId=" + data[i].id + "\" target=\"right\" >" + data[i].name + "</a></b></p>";
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