function gobacklist()
{
    var nodeId = GetQueryString("parentId");
    window.location.href = "/Home/Index?nodeId=" + nodeId;
}

function gomodify() {
    var nodeId = GetQueryString("nodeId");
    var parentId = GetQueryString("parentId");
    window.location.href = "/Article/modify?nodeId=" + nodeId + "&parentId=" + parentId;
}

$(document).ready(function () {
    var nodeId = GetQueryString("nodeId");
    if (nodeId != undefined) {
        document.getElementById('article').src = "/Article/article?nodeId=" + nodeId;
    }
});