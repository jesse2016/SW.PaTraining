var delNodeId = "";

function Branches()
{
    var tag_minus = document.getElementById("catalog").getElementsByClassName("minus");	
    var tag_add = document.getElementById("catalog").getElementsByClassName("add");
    var tag_minus_items = tag_minus.length;
    var tag_add_items = tag_add.length;
    //console.log(tag_minus_items)
    for(i=0;i<tag_minus_items;i++)
    {
        tag_minus.item(i).onclick = function()
        {
            //console.log(this.parentNode.parentNode)
            
            var itemUL = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("ul")[0];
            var len = itemUL.getElementsByTagName("li").length;
            if (len == 1) {
                console.log(itemUL)
                var nodeVal = this.parentNode.getElementsByTagName("i").item(0).innerHTML;
                console.log(nodeVal);

                var arr = nodeVal.split('|');
                if (isRealNum(arr[0])) {
                    delNodeId += arr[0] + "|";
                    console.log(delNodeId);
                }

                this.parentNode.parentNode.parentNode.parentNode.removeChild(itemUL);//删除UL(及下面的LI)标签
            }
            else {
                console.log(this.parentNode.parentNode)

                var rootNodeName = this.parentNode.getElementsByTagName("b").item(0).innerHTML;
                var rootNodeVal = this.parentNode.getElementsByTagName("i").item(0).innerHTML;

                var arr = rootNodeVal.split('|');
                var nodeStr = arr[0] + "," + arr[1] + "," + rootNodeName + "|";

                var itemUL = this.parentNode.parentNode.getElementsByTagName("ul").item(0);
                if (itemUL != undefined) {
                    nodeStr += getChildNodeData(itemUL);
                }
                nodeStr = nodeStr.substring(0, nodeStr.length - 1);
                console.log(nodeStr)

                var nodeAry = nodeStr.split('|');
                for (var i = 0; i < nodeAry.length; i++)
                {
                    var childAry = nodeAry[i].split(',');
                    if (isRealNum(childAry[0])) {
                        delNodeId += childAry[0] + "|";
                    }
                }
                console.log(delNodeId);

                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);//删除LI标签
            }
        }
    }
    for(i=0;i<tag_add_items;i++)
    {
        tag_add.item(i).onclick = function()
        {	
            //console.log(this.parentNode.parentNode.getElementsByTagName("ul").length > 0);
            var nodeType = this.parentNode.parentNode.nodeName;
            //console.log(nodeType);
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
                //console.log("1：" + id + " | " + arr[0] );
                var li = document.createElement("li");
                li.innerHTML = "<p><b data-count=\"(0)\" contenteditable=\"true\">新建节点</b><i hidden=\"hidden\">" + id + "|" + arr[0] + "</i><i class=\"minus\"></i><i class=\"add\"></i></p>";
                this.parentNode.parentNode.getElementsByTagName("ul").item(0).appendChild(li);
            }
            else
            {
                var nodeVal = this.parentNode.getElementsByTagName("i").item(0).innerHTML;

                var arr = nodeVal.split('|');
                var id = getRandom(8);//生成8位随机字符，作为临时id
                //console.log("2：" + id + " | " + arr[0]);
                var ul = document.createElement("ul");
                ul.innerHTML = "<li><p><b data-count=\"(0)\" contenteditable=\"true\">新建节点</b><i hidden=\"hidden\">" + id + "|" + arr[0] + "</i><i class=\"minus\"></i><i class=\"add\"></i></p></li>";
                this.parentNode.parentNode.appendChild(ul);
            }
            Branches() ;
        }
    }
}

//校验是否是数字
function isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (val === "" || val == null) {
        return false;
    }
    if (!isNaN(val)) {
        return true;
    } else {
        return false;
    }
}

function getRandom(n) {
    var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var s = "";
    for (var i = 0; i < n; i++) {
        var rand = Math.floor(Math.random() * str.length);
        s += str.charAt(rand);
    }
    return s;
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

function saveNodes()
{
    var data = getNodeData();
    $.ajax({
        url: '/Home/SaveTree',
        type: 'ajax',
        data: { data: data, delNode: delNodeId },
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            alert(res.Data);
            if (res.Data == "保存成功") {
                window.parent.loadTree();
                loadTreeNode();
            }
        }
    });
}

function getNodeData()
{
    var itemDT = document.getElementById("catalog").getElementsByTagName("dl").item(0).getElementsByTagName("dt").item(0);
    var rootNodeName = itemDT.getElementsByTagName("b").item(0).innerHTML;
    var rootNodeVal = itemDT.getElementsByTagName("i").item(0).innerHTML;

    var arr = rootNodeVal.split('|');
    var nodeStr = arr[0] + "," + arr[1] + "," + rootNodeName + "|";

    var itemUL = itemDT.getElementsByTagName("ul").item(0);
    if (itemUL != undefined)
    {
        nodeStr += getChildNodeData(itemUL);
    }
    nodeStr = nodeStr.substring(0, nodeStr.length - 1);
    console.log(nodeStr);

    return nodeStr;
}

function getChildNodeData(itemUL)
{
    //console.log(itemUL);
    var nodeStr = "";
    var itemLI = itemUL.getElementsByTagName("li")[0];
    do {
        //console.log(itemLI);

        var nodeName = itemLI.getElementsByTagName("b").item(0).innerHTML;
        var nodeVal = itemLI.getElementsByTagName("i").item(0).innerHTML;
        var arr = nodeVal.split('|');

        nodeStr += arr[0] + "," + arr[1] + "," + nodeName + "|";
        var nodeUL = itemLI.getElementsByTagName("ul").item(0);
        if (nodeUL != undefined)
        {
            nodeStr += getChildNodeData(nodeUL);
        }
        itemLI = itemLI.nextElementSibling;
    } while (itemLI != undefined);
    return nodeStr;
}

function loadTree() {
    $.ajax({
        url: '/Home/LoadTree',
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
            delNodeId = "";
            $("#catalog").html("");
            $("#catalog").append(html);
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
            html += "<p><b data-count=\"(" + data[i].nodeNo + ")\" contenteditable=\"true\">" + data[i].name + "</b><i hidden=\"hidden\">" + data[i].id + "|" + data[i].pId + "</i><i class=\"minus\"></i><i class=\"add\"></i></p>";
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
    Branches();
}