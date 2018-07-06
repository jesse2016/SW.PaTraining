layer.config({
    skin: 'my-skin'
});

//工具栏置顶（fixed to the top of the window）
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
loadingImg.size = "32px";//set circle size of loading
loadingImg.borderWidth = "2px";//set circle's border width of loading
loadingImg.borderColorStator = "rgba(0,0,0,.3)";//set stator color of loading
loadingImg.borderColorRotator = "#ff0";//set rotator color of loading
loadingImg.insert("popbox");//loading.insert("id");id是loading 插入的目标（必须是id）。目标默认是body，如果指定id则插入该id

function saveArticle()
{
    var data =
        {
            detailList: []
        };
    var isRight = true;

    $("#article_form").each(function () {
        $(this).find('fieldset').each(function () {
            var map = new Object();
            var val = "";
            var i = 1;
            $(this).find('i').each(function () {
                //console.log($(this).text() + ", " + i);
                if (i === 1) {
                    val = $(this).text();
                    map.Type = val; //类型
                }
                if (i === 2) {
                    val = $(this).text();
                    map.detailId = val; //id
                }
                i++;
            });
            if (map.detailId == undefined) {
                map.detailId = null;
            }
            $(this).find('.newContent').each(function () {
                var text = GetText($(this).html());
                if (text === "") {
                    //alert(GetErrorMessage(map.Type));
                    layer.open({
                        title: '友情提示',
                        content: GetErrorMessage(map.Type),
                        btn: ['确定']
                    });
                    isRight = false;
                    return false;
                }
                val = encodeURI($(this).html());
                map.Content = val;
            });
            $(this).find('input').each(function () {
                val = $(this).val();
                if (val != "") {
                    var fileName = getFileName(val);
                    map.sourceFileName = fileName;
                }
            });
            if (map.sourceFileName == undefined) {
                $(this).find('.process').each(function () {
                    map.sourceFileName = $(this).text();
                });
            }
            if (map.sourceFileName == undefined) {
                map.sourceFileName = "";
            }
            if (!isRight) {
                return false;
            }
            data.detailList.push(map);
        });
        //console.log(data);
    });

    if (isRight) {
        document.getElementById("popbox").style.left = "0";
        setTimeout(function () {
            document.getElementById("popbox").style.left = "-9999rem";
        }, 3000)

        PostData(data);
    }
}

function getFileName(o) {
    var pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
}

function GetErrorMessage(typeCode) {
    if (typeCode === "title") {
        return "主标题不能为空";
    }
    if (typeCode === "subtitle") {
        return "副标题不能为空";
    }
    if (typeCode === "content") {
        return "段落不能为空";
    }
    if (typeCode === "image") {
        return "请选择要上传的图片";
    }
    if (typeCode === "video") {
        return "请选择要上传的视频";
    }
}

function PostData(data) {
    var jsonString = JSON.stringify(data);
    //console.log(jsonString);
    var nodeId = GetQueryString("nodeId");
    if (nodeId === null || nodeId === "") {
        alert("参数错误，请重新打开页面");
        return;
    }
    $.ajax({
        url: "/Article/SaveArticle",
        data: { data: jsonString, deleteId: deleteId },
        type: 'post',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            layer.msg(res.Msg, { time: 500 }, function () {
                if (res.Result) {
                    window.location.href = "/Article/view?nodeId=" + nodeId + "&parentId=" + GetQueryString("parentId");
                }
            });
        }
    });
}

function loadArticle()
{
    var nodeId = GetQueryString("nodeId");
    if (nodeId === null || nodeId === "") {
        alert("参数错误，请重新打开页面");
        return;
    }
    $.ajax({
        url: "/Article/GetArticleByNodeId",
        data: { nodeId: nodeId },
        type: 'post',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            //console.log(res);
            if (res.Msg == "") {
                deleteId = "";
                var node = eval("(" + res.Node + ")");
                var detail = eval("(" + res.Detail + ")");
                //console.log(node);
                //console.log(detail);

                var html = GetArticleHtml(node, detail);
                $("#article_form").empty();
                $("#article_form").append(html);

                //工具栏功能绑定
                FunctionOfContentBox();

                //绑定追加功能
                FunBinding();
            }
            else {
                //alert(res.Msg);
                layer.open({
                    title: '友情提示',
                    content: res.Msg,
                    btn: ['确定']
                });
            }
        }
    });
}

function GetArticleHtml(node, detail)
{
    var content = "";

    if (node != null)
    {
        content += "<fieldset class=\"container\">";
        content += "<i hidden=\"hidden\">title</i>";
        content += "<i hidden=\"hidden\">" + node.nodeId + "</i>";
        content += "<legend>";
        content += "	<b class=\"Heading\"><i>主标题</i></b>";
        content += "	<em></em>";
        content += "</legend>";
        content += "<h2 class=\"newContent\" contenteditable=\"true\">" + node.nodeName + "</h2>";
        content += "<hr>";
        content += "<ul class=\"tool\">";
        content += "	<li><p class=\"Heading\"><i>追加副标题</i></p></li>";
        content += "	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
        content += "	<li><p class=\"Images\"><i>追加图片</i></p></li>";
        content += "	<li><p class=\"Video\"><i>追加视频</i></p></li>";
        content += "</ul>";
        content += "</fieldset>";
    }

    for (var i = 0; i < detail.length; i++)
    {
        var type = detail[i].detailType;
        if (type == "subtitle")
        {
            content += "<fieldset class=\"container\">";
            content += "<i hidden=\"hidden\">subtitle</i>";
            content += "<i hidden=\"hidden\">" + detail[i].detailId + "</i>";
            content += "<legend>";
            content += "	<b class=\"Heading\"><i>副标题</i></b>";
            content += "	<em><q class=\"Delete\"><i>删除</i></q></em>";
            content += "	<em><span class=\"MoveUp\"><i>上移</i></span></em>";
            content += "	<em><span class=\"MoveDown\"><i>下移&nbsp;&nbsp;</i></span></em>";
            content += "</legend>";
            content += "<h2 class=\"newContent\" contenteditable=\"true\">" + detail[i].detailContent + "</h2>";
            content += "<hr>";
            content += "<ul class=\"tool\">";
            content += "	<li><p class=\"Heading\"><i>追加副标题</i></p></li>";
            content += "	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
            content += "	<li><p class=\"Images\"><i>追加图片</i></p></li>";
            content += "	<li><p class=\"Video\"><i>追加视频</i></p></li>";
            content += "</ul>";
            content += "</fieldset>";
        }

        if (type == "content") {
            content += "<fieldset class=\"container\">";
            content += "<i hidden=\"hidden\">content</i>";
            content += "<i hidden=\"hidden\">" + detail[i].detailId + "</i>";
            content += "<legend>";
            content += "	<b class=\"Paragraph\"><i>段落</i></b>";
            content += "    <em><q class=\"Delete\"><i>删除</i></q></em>";
            content += "	<em><span class=\"MoveUp\"><i>上移</i></span></em>";
            content += "	<em><span class=\"MoveDown\"><i>下移&nbsp;&nbsp;</i></span></em>";
            content += "</legend>";
            content += "<div class=\"newContent\" contenteditable=\"true\">" + detail[i].detailContent + "</div>";
            content += "<hr>";
            content += "<ul class=\"tool\">";
            content += "	<li><p class=\"Heading\"><i>追加副标题</i></p></li>";
            content += "	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
            content += "	<li><p class=\"Images\"><i>追加图片</i></p></li>";
            content += "	<li><p class=\"Video\"><i>追加视频</i></p></li>";
            content += "</ul>";
            content += "</fieldset>";
        }

        if (type == "image") {
            content += "<fieldset class=\"container\">";
            content += "<i hidden=\"hidden\">image</i>";
            content += "<i hidden=\"hidden\">" + detail[i].detailId + "</i>";
            content += "<legend>";
            content += "    <b class=\"Images\"><i>图片</i></b><em><q class=\"Delete\"><i>删除</i></q></em>";
            content += "	<em><span class=\"MoveUp\"><i>上移</i></span></em>";
            content += "	<em><span class=\"MoveDown\"><i>下移&nbsp;&nbsp;</i></span></em>";
            content += "</legend>";
            content += "<span class=\"explain\">说明：图片大小不超过2MB，支持格式：jpg、png、gif、svg。</span>";
            content += "<div class=\"imgBox\">";
            content += "	<img src=\"" + detail[i].Url + "\" />";
            content += "	<input type=\"file\" onchange=\"Start(this,'image')\"><span class='process'>" + detail[i].souceFileName + "</span><i class=\"newContent\" hidden=\"hidden\">" + detail[i].detailContent + "</i>";
            content += "</div>";
            content += "<hr>";
            content += "<ul class=\"tool\">";
            content += "	<li><p class=\"Heading\"><i>追加副标题</i></p></li>";
            content += "	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
            content += "	<li><p class=\"Images\"><i>追加图片</i></p></li>";
            content += "	<li><p class=\"Video\"><i>追加视频</i></p></li>";
            content += "</ul>";
            content += "</fieldset>";
        }

        if (type == "video") {
            content += "<fieldset class=\"container\">";
            content += "<i hidden=\"hidden\">video</i>";
            content += "<i hidden=\"hidden\">" + detail[i].detailId + "</i>";
            content += "<legend>";
            content += "<b class=\"Video\">视频</b><em><q class=\"Delete\"><i>删除</i></q></em>";
            content += "	<em><span class=\"MoveUp\"><i>上移</i></span></em>";
            content += "	<em><span class=\"MoveDown\"><i>下移&nbsp;&nbsp;</i></span></em>";
            content += "</legend>";
            content += "<span class=\"explain\">说明：视频大小不超过200MB，支持格式：MP4。</span>";
            content += "<div class=\"videoBox\">";
            content += "	<video controls width=\"100%\">";
            content += "		<source src=\"" + detail[i].Url + "\" type=\"video/mp4\" />";
            content += "		Your browser does not support the video tag.";
            content += "</video>";
            content += "<input type=\"file\" onchange=\"Start(this,'video')\"><span class='process'>" + detail[i].souceFileName + "</span><i class=\"newContent\" hidden=\"hidden\">" + detail[i].detailContent + "</i>";
            content += "</div>";
            content += "<hr>";
            content += "<ul class=\"tool\">";
            content += "	<li><p class=\"Heading\"><i>追加副标题</i></p></li>";
            content += "	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
            content += "	<li><p class=\"Images\"><i>追加图片</i></p></li>";
            content += "	<li><p class=\"Video\"><i>追加视频</i></p></li>";
            content += "</ul>";
            content += "</fieldset>";
        }
    }

    content += "<div id=\"content\"></div>";
    content += "<div class=\"btnBox fixedBottom\">";
    content += "<div class=\"btnBoxIn\">";
    content += "<a id=\"submit\" class=\"btnType_capsule btnType_L btnLooks_solid\" onclick='saveArticle();' href=\"javascript:void(0);\">保存</a>&nbsp;&nbsp;";
    content += "<a class=\"btnType_capsule btnType_L btnLooks_hollow\" onclick='goback()' href=\"javascript:void(0);\">返回</a>";
    content += "</div>";
    content += "</div>";
   
    return content;
}

$(document).ready(function () {
    loadArticle();
});

function goback() {
    var nodeId = GetQueryString("parentId");
    window.location.href = "/Home/Index?nodeId=" + nodeId;
}