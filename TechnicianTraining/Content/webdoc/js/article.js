function loadArticle() {
    var nodeId = GetQueryString("nodeId");
    if (nodeId === null || nodeId === "") {
        alert("参数错误，请重新打开页面");
        return;
    }
    $.ajax({
        url: "/Article/GetArticleByNodeId",
        data: { nodeId: nodeId },
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            if (res.Msg == "") {
                var node = eval("(" + res.Node + ")");
                var detail = eval("(" + res.Detail + ")");
                //console.log(node);
                //console.log(detail);

                var html = GetArticleHtml(node, detail);
                $("#previewBox").empty();
                $("#previewBox").append(html);
            }
            else {
                alert(res.Msg);
            }
        }
    });
}

function GetArticleHtml(node, detail) {
    var content = "";

    if (node != null) {
        var date = toDate(node.createDate);
        var d = new Date(date);
        var createDate = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

        content += "<h2 class=\"heading\"><span>" + node.nodeName + "</span><i>编辑：" + node.createPerson + "</i><i>" + createDate + "</i></h2><hr>";
    }

    content += "<div class=\"contentBox\">";

    for (var i = 0; i < detail.length; i++) {
        var type = detail[i].detailType;
        if (type == "subtitle") {
            content += "<div style='text-align:center;'>" + detail[i].detailContent + "</div>";
        }

        if (type == "content") {
            content += "<div>" + detail[i].detailContent + "</div>";
        }

        if (type == "image") {
            content += "<img src=\"" + detail[i].Url + "\" />";
        }

        if (type == "video") {
            content += "<video src=\"" + detail[i].Url + "\" controls=\"controls\">您的浏览器不支持 video 标签。</video>";
        }
    }

    content += "</div>";

    return content;
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
    loadArticle();
});