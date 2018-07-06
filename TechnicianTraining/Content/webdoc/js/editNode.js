var delNodeId = "";

layer.config({
    skin: 'my-skin'
});

function Branches()
{
    var tag_minus = document.getElementById("catalog").getElementsByClassName("minus");	
    var tag_add = document.getElementById("catalog").getElementsByClassName("add");
    var tag_fold = document.getElementById("catalog").getElementsByClassName("fold");
    var tag_spread = document.getElementById("catalog").getElementsByClassName("spread");
    var tag_minus_items = tag_minus.length;
    var tag_add_items = tag_add.length;
    var tag_fold_items = tag_fold.length;
    var tag_spread_items = tag_spread.length;
    for (i = 0; i < tag_spread_items; i++) {
        tag_spread.item(i).onclick = function () {
            if (this.parentNode.parentNode.getElementsByTagName("ul")) {
                var ul = this.parentNode.parentNode.getElementsByTagName("ul");
                var ul_item = ul.length;
                for (o = 0; o < ul_item; o++) {
                    ul.item(o).setAttribute("class", "on");
                }
                this.setAttribute("class", "fold");
                Branches();
            }
        }
    }
    for (i = 0; i < tag_fold_items; i++) {
        tag_fold.item(i).onclick = function () {
            if (this.parentNode.parentNode.getElementsByTagName("ul")) {
                var ul = this.parentNode.parentNode.getElementsByTagName("ul");
                var ul_item = ul.length;
                for (o = 0; o < ul_item; o++) {
                    ul.item(o).setAttribute("class", "off");
                }
                this.setAttribute("class", "spread");
                Branches();
            }
        }
    }
    for(i=0;i<tag_minus_items;i++)
    {
        tag_minus.item(i).onclick = function()
        {
            var itemUL = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("ul")[0];
            var len = itemUL.getElementsByTagName("li").length;
            if (len == 1) {
                var nodeVal = this.parentNode.getElementsByTagName("i").item(0).innerHTML;
                var arr = nodeVal.split('|');
                if (isRealNum(arr[0])) {
                    var count = getArticleNo(arr[0]);
                    if (count > 0) {
                        var itemNode = this.parentNode.parentNode.parentNode.parentNode;
                        layer.confirm("该节点下有["+ count +"]篇文章，确认删除该节点？", {
                            btn: ['确定', '取消']//按钮
                        }, function (index) {
                            delNodeId += arr[0] + "|";
                            itemNode.removeChild(itemUL);//删除UL(及下面的LI)标签

                            layer.close(index);
                        });
                    }
                    else {
                        delNodeId += arr[0] + "|";
                        this.parentNode.parentNode.parentNode.parentNode.removeChild(itemUL);//删除UL(及下面的LI)标签
                    }
                }
                else {
                    this.parentNode.parentNode.parentNode.parentNode.removeChild(itemUL);//删除UL(及下面的LI)标签
                }
            }
            else {
                var rootNodeName = this.parentNode.getElementsByTagName("b").item(0).innerHTML;
                var rootNodeVal = this.parentNode.getElementsByTagName("i").item(0).innerHTML;

                var arr = rootNodeVal.split('|');
                var data =
                {
                    detailList: []
                };

                var map = new Object();

                map.nodeId = arr[0];
                map.parentId = arr[1];
                map.nodeName = rootNodeName;
                map.IsNodeId = true;
                map.IsParentId = true;

                data.detailList.push(map);

                var itemUL = this.parentNode.parentNode.getElementsByTagName("ul").item(0);
                var itemNode = this.parentNode.parentNode;

                var count = getArticleNo(arr[0]);
                if (count === -1)
                {
                    layer.msg("网络错误，请稍后再试！");
                    return;
                }
                else if (count > 0) {
                    layer.confirm("该节点下有[" + count + "]篇文章，确认删除该节点？", {
                        btn: ['确定', '取消']//按钮
                    }, function (index) {
                        
                        if (itemUL != undefined) {
                            data = getChildNodeData(itemUL, data);
                        }
                        for (var i = 0; i < data.detailList.length; i++) {
                            var nodeId = data.detailList[i].nodeId;
                            if (isRealNum(nodeId)) {
                                delNodeId += nodeId + "|";
                            }
                        }
                        //console.log(delNodeId);

                        itemNode.parentNode.removeChild(itemNode);//删除LI标签

                        layer.close(index);
                    });
                }
                else {
                    if (itemUL != undefined) {
                        data = getChildNodeData(itemUL, data);
                    }
                    for (var i = 0; i < data.detailList.length; i++) {
                        var nodeId = data.detailList[i].nodeId;
                        if (isRealNum(nodeId)) {
                            delNodeId += nodeId + "|";
                        }
                    }
                    //console.log(delNodeId);

                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);//删除LI标签
                }
            }
        }
    }
    for(i=0;i<tag_add_items;i++)
    {
        tag_add.item(i).onclick = function()
        {	
            var nodeType = this.parentNode.parentNode.nodeName;
            if(this.parentNode.parentNode.getElementsByTagName("ul").length > 0)
            {
                var nodeVal = "";
                if (nodeType == "LI") {
                    nodeVal = this.parentNode.getElementsByTagName("i").item(0).innerHTML;
                }
                if (nodeType == "DT") {
                    nodeVal = this.parentNode.parentNode.getElementsByTagName("i").item(0).innerHTML;
                }

                var arr = nodeVal.split('|');
                var id = getRandom(8);//生成8位随机字符，作为临时id

                var li = document.createElement("li");
                li.innerHTML = "<p><b data-count=\"(0)\" contenteditable=\"true\">新建节点</b><i hidden=\"hidden\">" + id + "|" + arr[0] + "</i><i class=\"fold\"></i><i class=\"minus\"></i><i class=\"add\"></i></p>";
                this.parentNode.parentNode.getElementsByTagName("ul").item(0).appendChild(li);
            }
            else
            {
                var nodeVal = this.parentNode.getElementsByTagName("i").item(0).innerHTML;

                var arr = nodeVal.split('|');
                var id = getRandom(8);//生成8位随机字符，作为临时id

                var ul = document.createElement("ul");
                ul.innerHTML = "<li><p><b data-count=\"(0)\" contenteditable=\"true\">新建节点</b><i hidden=\"hidden\">" + id + "|" + arr[0] + "</i><i class=\"fold\"></i><i class=\"minus\"></i><i class=\"add\"></i></p></li>";
                this.parentNode.parentNode.appendChild(ul);
            }
            Branches() ;
        }
    }
}

//loading
var loadingImg = new Loading();
loadingImg.background          = "none",//set background-color of loading
loadingImg.size                = "32px";//set circle size of loading
loadingImg.borderWidth         = "2px";//set circle's border width of loading
loadingImg.borderColorStator   = "rgba(0,0,0,.3)";//set stator color of loading
loadingImg.borderColorRotator  = "#ff0";//set rotator color of loading
loadingImg.insert("popbox");//loading.insert("id");id是loading 插入的目标（必须是id）。目标默认是body，如果指定id则插入该id
document.getElementById("submit").onclick = function()
{
    document.getElementById("popbox").style.left = "0";
    setTimeout(function(){
        document.getElementById("popbox").style.left = "-9999rem";	
    }, 3000)
    
    saveNodes();
}

function getArticleNo(nodeId) {
    var num = -1;
    $.ajax({
        url: '/Home/GetArticleNoByNodeId',
        type: 'ajax',
        data: { nodeId: nodeId },
        dataType: 'json',
        async: false,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            num = res.Num;
        }
    });
    return num;
}

function saveNodes()
{
    var data = getNodeData();
    $.ajax({
        url: '/Home/SaveTree',
        type: 'ajax',
        data: { data: JSON.stringify(data), delNode: delNodeId },
        type: 'post',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            layer.msg(res.Data);
            if (res.Data == "保存成功") {
                window.parent.loadTree();
                loadTreeNode();
            }
        }
    });
}

function getNodeData()
{
    var data =
        {
            detailList: []
        };
    var itemDT = document.getElementById("catalog").getElementsByTagName("dl").item(0).getElementsByTagName("dt").item(0);
    var rootNodeName = itemDT.getElementsByTagName("b").item(0).innerHTML;
    var rootNodeVal = itemDT.getElementsByTagName("i").item(0).innerHTML;

    var arr = rootNodeVal.split('|');
    var map = new Object();

    map.nodeId = arr[0];
    map.parentId = arr[1];
    map.nodeName = rootNodeName;
    map.IsNodeId = true;
    map.IsParentId = true;

    data.detailList.push(map);

    var itemUL = itemDT.getElementsByTagName("ul").item(0);
    if (itemUL != undefined)
    {
        data = getChildNodeData(itemUL, data);
    }

    return data;
}

function getChildNodeData(itemUL, data)
{
    var itemLI = itemUL.getElementsByTagName("li")[0];
    if (itemLI === undefined)
    {
        return data;
    }
    do {
        var nodeName = itemLI.getElementsByTagName("b").item(0).innerHTML;
        var nodeVal = itemLI.getElementsByTagName("i").item(0).innerHTML;
        var arr = nodeVal.split('|');

        var map = new Object();

        map.nodeId = arr[0];
        map.parentId = arr[1];
        map.nodeName = nodeName;
        if (isRealNum(arr[0])) {
            map.IsNodeId = true;
        }
        else {
            map.IsNodeId = false;
        }
        if (isRealNum(arr[1])) {
            map.IsParentId = true;
        }
        else {
            map.IsParentId = false;
        }

        data.detailList.push(map);

        var nodeUL = itemLI.getElementsByTagName("ul").item(0);
        if (nodeUL != undefined)
        {
            data = getChildNodeData(nodeUL, data);
        }
        itemLI = itemLI.nextElementSibling;
    } while (itemLI != undefined);
    return data;
}

function loadTree() {
    $.ajax({
        url: '/Home/LoadTree?' + Math.random(),
        type: 'ajax',
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //layer.msg(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            var data = eval("(" + res.Data + ")");
            var html = GetNode(data);
            delNodeId = "";
            $("#catalog").html("");
            $("#catalog").append(html);
            Branches();
        }
    });
}

function GetNode(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].level == 0) {
            html += "<dl>";
            html += "<dt>";
        }
        else {
            if (i == 0) {
                html += "<ul>";
            }
            html += "<li>";
        }

        if (data[i].level == 0) {
            html += "<p><b data-count=\"(" + data[i].nodeNo + ")\">" + data[i].name + "</b><i hidden=\"hidden\">" + data[i].id + "|" + data[i].pId + "</i><i class=\"add\"></i></p>";
        }
        else {
            html += "<p><b data-count=\"(" + data[i].nodeNo + ")\" contenteditable=\"true\">" + data[i].name + "</b><i hidden=\"hidden\">" + data[i].id + "|" + data[i].pId + "</i><i class=\"fold\"></i><i class=\"minus\"></i><i class=\"add\"></i></p>";
        }

        var childNodeList = data[i].children;
        if (childNodeList != null) {
            html += GetNode(childNodeList);
        }

        if (data[i].level == 0) {
            html += "</dt>";
            html += "</dl>";
        }
        else {
            html += "</li>";
            if (i == data.length - 1) {
                html += "</ul>";
            }
        }
    }
    return html;
}

$(document).ready(function () {
    loadTreeNode();
});

function loadTreeNode()
{
    loadTree();
}

window.onbeforeunload = function (e) {
    var ischanged = false;
    var data = getNodeData();
    var map = data.detailList;
    for (var i = 0; i < map.length; i++)
    {
        if (!map[i].IsNodeId || !map[i].IsParentId)
        {
            ischanged = true;
            break;
        }
    }
    if (delNodeId != "")
    {
        ischanged = true;
    }
    //console.log(ischanged);
    if (ischanged)
    {
        return "您的数据还未保存，确定要离开吗？"
    }
}