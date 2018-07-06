var pageCount = 0;//总页数
var articleCount = 0;//文章总数
var currentPages = 0;
var parentId = 0;//父id

function getArticleList(currentPage) {
    parentId = GetQueryString("nodeId");
    $.ajax({
        url: '/Article/GetArticleListByPId',
        type: 'ajax',
        data: { parentId: parentId, pageSize: 10, currentPage: currentPage },
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            articleCount = res.ArticleCount;
            pageCount = res.PageCount;
            currentPages = res.CurrentPage;
            //console.log(pageCount);

            var data = eval("(" + res.Data + ")");
            //console.log(data);

            var html = GetArticleHtml(data);
            $("#list").empty();
            $("#list").append(html);

            $("#pagenum").empty();
            if (data.length > 0) {
                $("#pagenum").append(GetPageBar(currentPages));
            }
        }
    });
}

function GetArticleHtml(data)
{
    var html = "";
    html += "<ul>";
    for (var i = 0; i < data.length; i++)
    {
        var date = toDate(data[i].createDate);
        //console.log(date);

        var d = new Date(date);
        var createDate = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

        html += "<li class=\"article\"><p><input type=\"checkbox\"><i hidden=\"hidden\">" + data[i].nodeId + "</i><i>" + data[i].nodeName + "</i><a class=\"Preview\" href=\"preview.html\">预览</a><a class=\"Edit\" href=\"edit.html\">编辑</a></p><em>" + createDate + "</em></li>";
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
        //console.log(className);
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
            //利用对话框返回的值 （true 或者 false） 
            if (confirm("您确定要当前节点所有内容吗？(共" + articleCount + "篇文章)")) {
                DeleteArticles("DeleteArticleByParentId", parentId);
            }
        }
        else {
            alert("当前节点下没有文章");
        }
    });

    $("#deleteCheck").click(function () {
        var delIdStr = getArticleNodeId();
        if (delIdStr != "") {
            //利用对话框返回的值 （true 或者 false） 
            if (confirm("您确定要删除选中文章吗？")) {
                DeleteArticles("DeleteArticleByNodeId", delIdStr);
            }
        }
        else {
            alert("请选择要删除的行");
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
            alert(res.Msg);
            if (res.Result) {
                getArticleList(currentPages);
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