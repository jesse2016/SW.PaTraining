//工具栏功能绑定
FunctionOfContentBox();

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

$(document).ready(function () {
    $("#submit").click(function () {
        AddNewArticle();
    });
});

layer.config({
    skin: 'my-skin'
});

function AddNewArticle() {
    var data =
        {
            detailList: []
        };
    var isRight = true;

    $("#article_form").each(function () {
        $(this).find('fieldset').each(function () {
            var map = new Object();
            var val = "";
            $(this).find('i:first').each(function () {
                val = $(this).html();
                map.Type = val; //类型
            });
            $(this).find('.newContent').each(function () {
                var text = GetText($(this).html());
                if (text === "")
                {
                    //alert(GetErrorMessage(val));
                    layer.open({
                        title: '友情提示',
                        content: GetErrorMessage(val),
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
                var fileName = getFileName(val);
                map.sourceFileName = fileName;
            });
            if (map.sourceFileName == undefined)
            {
                map.sourceFileName = "";
            }
            if (!isRight)
            {
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

function GetErrorMessage(typeCode)
{
    if (typeCode === "title")
    {
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

function PostData(data)
{
    var jsonString = JSON.stringify(data);
    var parentId = GetQueryString("parentId");
    if (parentId === null || parentId === "")
    {
        layer.msg("参数错误，请重新打开页面");
        return;
    }
    $.ajax({
        url: "/Article/AddNewArticle",
        data: { parentId: parentId, data: jsonString },
        type: 'post',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            layer.msg(res.Msg,{ time: 500 }, function () {
                if (res.Result) {
                    window.location.href = "/Article/view?nodeId=" + res.nodeId + "&parentId=" + parentId;
                }
            });
        }
    });
}

//绑定追加功能
FunBinding();

function goback() {
    var nodeId = GetQueryString("parentId");
    window.location.href = "/Home/Index?nodeId=" + nodeId;
}