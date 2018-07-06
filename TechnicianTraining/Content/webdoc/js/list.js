var pageCount = 0;//总页数
var articleCount = 0;//文章总数
var currentPages = 0;
var parentId = 0;//父id

layer.config({
    skin: 'my-skin'
});

$(document).ready(function () {
    GetNodeParentName();
});

function getArticleList(currentPage) {
    parentId = GetQueryString("nodeId");
    $.ajax({
        url: '/Article/GetArticleListByPId?' + Math.random(),
        type: 'ajax',
        data: { parentId: parentId, pageSize: 10, currentPage: currentPage },
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            articleCount = res.ArticleCount;
            pageCount = res.PageCount;
            currentPages = res.CurrentPage;

            var data = eval("(" + res.Data + ")");
            var html = GetArticleHtml(data, parentId);

            $("#list").empty();
            $("#list").append(html);

            $("#pagenum").empty();
            if (data.length > 0) {
                $("#pagenum").append(GetPageBar(currentPages));
            }
        }
    });
}

function GetArticleHtml(data, parentId)
{
    var html = "";
    html += "<ul>";
    for (var i = 0; i < data.length; i++)
    {
        var date = toDate(data[i].createDate);
        //console.log(date);

        var d = new Date(date);
        var createDate = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

        var artType = "";
        if (data[i].isVideo === 1) {
            artType = "Video_List";
        }
        else {
            artType = "article";
        }

        var isApc = "";
        if (data[i].isApc === 1) {
            isApc = "class=\"appC\"";
        }

        html += "<li class=\"" + artType + "\"><p><input type=\"checkbox\"><i hidden=\"hidden\">" + data[i].nodeId + "</i><i " + isApc + ">" + GetText(data[i].nodeName) + "</i></p><em><a class=\"Preview\" href=\"/Article/view?nodeId=" + data[i].nodeId + "&parentId=" + parentId + "\" target='_top'>预览</a><a class=\"Edit\" href=\"/Article/modify?nodeId=" + data[i].nodeId + "&parentId=" + parentId + "\" target='_top'>编辑</a><i>" + createDate + "</i></em></li>";
    }
    html += "</ul>";
    return html;
}

function GetPageBar(currentPage)
{
    var html = "";
    html += "<ul>";

    var pageCountHtml = "<li class=\"unavailable\"><p>" + currentPage + "/" + pageCount + "</p></li>";

    if (currentPage == 1) {
        html += "<li class=\"unavailable\"><p>首页</p></li>";
        html += "<li class=\"prev unavailable\"><p>上一页</p></li>";
        html += pageCountHtml;       
        if (currentPage == pageCount || pageCount == 1) {
            html += "<li class=\"next unavailable\"><p>下一页</p></li>";
        }
        else
        {
            html += "<li class=\"next\"><a href='javascript:void(0);' onclick='getArticleList(" + (currentPage + 1) + ")'><p>下一页</p></a></li>";
        }
    }
    else {
        html += "<li><a href='javascript:void(0);' onclick='getArticleList(1)'><p>首页</p></a></li>";
        html += "<li class=\"prev\"><a href='javascript:void(0);' onclick='getArticleList(" + (currentPage - 1) + ")'><p>上一页</p></a></li>";
        html += pageCountHtml;
    }  
   
    if (currentPage == pageCount) {
        html += "<li class=\"unavailable\"><p>末页</p></li>";
    }
    else {
        html += "<li><a href='javascript:void(0);' onclick='getArticleList(" + pageCount + ")'><p>末页</p></a></li>";
    }

    html += "</ul>";

    return html;
}

var DATE_REGEXP = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*");
function toDate(dateString) {
    if (DATE_REGEXP.test(dateString)) {
        var timestamp = dateString.replace(DATE_REGEXP, function ($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
            var date = new Date($year, $month, $day, $hour || "00", $minute || "00", $second || "00", $milliscond || "00");
            return date.getTime();
        });
        var date = new Date();
        date.setTime(timestamp);
        return date;
    }
    return null;
}

$(document).ready(function () {
    $("#checkAll").click(function () {
        var className = $(this).attr("class");
        var checked = false;
        if (className == "CheckAll") {
            $(this).removeClass("CheckAll").addClass("UnCheckAll");
        }
        if (className == "UnCheckAll") {
            $(this).removeClass("UnCheckAll").addClass("CheckAll");
            checked = true;
        }

        $("#list").each(function () {
            $(this).find('li').each(function () {
                $(this).find('input').each(function () {
                    $(this).prop("checked", checked);
                });
            });
        });
    });

    $("#empty").click(function () {
        if (articleCount > 0) {
            layer.confirm("您确定要清空当前节点所有内容吗？(共" + articleCount + "篇文章)", {
                btn: ['确定', '取消']//按钮
            },
            function (index) {
                DeleteArticles("DeleteArticleByParentId", parentId);
            });
        }
        else {
            layer.open({
                title: '友情提示',
                content: '当前节点下没有文章',
                btn: ['确定']
            });
        }
    });

    $("#deleteCheck").click(function () {
        var delIdStr = getArticleNodeId();
        if (delIdStr != "") {
            layer.confirm('您确定要删除选中文章吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                DeleteArticles("DeleteArticleByNodeId", delIdStr);
            });
        }
        else {
            layer.open({
                title: '友情提示',
                content: '请选择要删除的行',
                btn: ['确定']
            });
        }
    });

    $("#AppC").click(function () {
        var selIdStr = getArticleNodeId();
        if (selIdStr != "") {
            layer.confirm('您确定要标识或反向标识选中文章？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                DeleteArticles("IdentifyArticleByNodeId", selIdStr);
            });
        }
        else {
            layer.open({
                title: '友情提示',
                content: '请选择要标识的行',
                btn: ['确定']
            });
        }
    });
});

function DeleteArticles(funcName, data) {
    $.ajax({
        url: '/Article/' + funcName,
        type: 'ajax',
        data: { data: data },
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            layer.msg(res.Msg, { time: 500 });
            if (res.Result) {
                getArticleList(currentPages);
                window.parent.loadTree();
            }
        }
    });
}

function getArticleNodeId()
{
     var delIdStr = "";
     $("#list").each(function () {
        $(this).find('li').each(function () {
            var isChecked = false;
            $(this).find('input').each(function () {
                isChecked = $(this).is(':checked');
            });

            if (isChecked) {
                $(this).find('i:first').each(function () {
                    delIdStr += $(this).text() + "|";
                });
            }
        });
     });
     return delIdStr;
}

function AddNew()
{
    window.parent.location.href = "/Article/add?parentId=" + parentId;
}

$(document).ready(function () {
    getArticleList(1);
});

//移动文件
var warning01 = new WarningBox();
$(document).ready(function () {
    document.getElementById("MoveFile").onclick = function () {
        var delIdStr = getArticleNodeId();
        if (delIdStr == "") {
            layer.confirm('您当前未选择任何文章，是否要全部移动？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                showBox();
                layer.close(index);
            });
        }
        else {
            showBox();
        }
    }

    function showBox()
    {
        loadTree();
        //显示警示框
        warning01.show("nodeList");
        //选择节点绑定选中状态
        var target = document.getElementById("nodeListItem").getElementsByTagName("p");
        var num = target.length;
        for (i = 0; i < num; i++) {
            target.item(i).onclick = function () {
                for (o = 0; o < num; o++) {
                    document.getElementById("nodeListItem").getElementsByTagName("p").item(o).setAttribute("class", "");
                }
                this.setAttribute("class", "on");
            }
        }
    }

    document.getElementById("Cancel").onclick = function () {
        //显示警示框
        warning01.hide("nodeList");
    }
    document.getElementById("Confirm").onclick = function () {
        var targetElemets = document.getElementById('nodeListItem').getElementsByClassName("on");
        if (targetElemets.length > 0) {
            var targetNodeId = targetElemets[0].children[0].innerHTML;
            var parentId = GetQueryString("nodeId");
            var selIdStr = getArticleNodeId();

            ArticlesMove(targetNodeId, parentId, selIdStr);
        }
        else {
            layer.msg("请选择目标节点");
        }
    }
});

function ArticlesMove(targetNodeId, parentId, selIdStr)
{
    $.ajax({
        url: "/Article/MoveTo",
        data: { targetNodeId: targetNodeId, parentId: parentId, selIdStr: selIdStr },
        type: 'post',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            layer.msg(res.Msg, { time: 500 }, function () {
                if (res.Result) {
                    window.parent.loadTree();
                    getArticleList(currentPages);
                    //隐藏警示框
                    warning01.hide("nodeList");
                }
            });
        }
    });
}

function loadTree() {
    $.ajax({
        url: '/Home/LoadTree?' + Math.random(),
        type: 'ajax',
        dataType: 'json',
        async: false,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            var data = eval("(" + res.Data + ")");
            var html = GetNode(data);
            $("#nodeListItem").empty();
            $("#nodeListItem").append(html);
        }
    });
}

function GetNode(data) {
    var html = "<ul class=\"menu\">";
    for (var i = 0; i < data.length; i++) {
        html += "<li>";

        var node = "<p data-count=\"(" + data[i].nodeNo + ")\"><i hidden=\"hidden\">" + data[i].id + "</i><b>" + data[i].name + "</b></p>";
        var childNodeList = data[i].children;
        if (childNodeList != null) {
            if (data[i].level > 0) {
                html += node;
            }
            html += GetNode(childNodeList);
        }
        else {
            if (data[i].level > 0) {
                html += node;
            }
        }

        html += "</li>";
    }
    html += "</ul>";
    return html;
}

function GetNodeParentName() {
    var nodeId = GetQueryString("nodeId");
    $.ajax({
        url: '/Article/GetNodeName?' + Math.random(),
        data:{nodeId: nodeId},
        type: 'ajax',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            $("#parentName").text(res.Name);
        }
    });
}