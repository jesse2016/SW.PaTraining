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
        document.getElementById("popbox").style.left = "0";
        setTimeout(function () {
            document.getElementById("popbox").style.left = "-9999rem";
        }, 3000)

        AddNewArticle();
    });
});

function GetArticleData() {
    var data = [];
    $("#article_form").each(function () {
        $(this).find('fieldset').each(function () {
            $(this).find('.newContent').each(function () {
                data.push(encodeURI($(this).html()));
            });

            $(this).find('input:first').each(function () {
                data.push(encodeURI($(this).val()));
            });
        });
    });

    return data;
}

function GetFormData() {
    var i = 0;
    var formData = new FormData();
    $("#article_form").each(function () {
        $(this).find('input').each(function () {
            i++;
            formData.append("file" + i, $(this).get(0).files[0]);
        });
    });
    return formData;
}

function AddNewArticle()
{
    var formData = GetFormData();
    console.log(formData);
   
    $.ajax({
        url: "/Article/UploadFiles",              //提交路径到后台 controllers文件下 file控件 ,UploadFile
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        async: false,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            console.log(res);
        }
    });

    var data = GetArticleData();
    var jsonString = JSON.stringify(data);
    console.log(jsonString);

    $.ajax({
        url: "/Article/AddNewArticle",
        data: { data: jsonString },
        dataType: 'json',
        async: true,
        timeout: 10000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus + "：" + errorThrown);
        },
        success: function (res) {
            alert(res.Msg);
        }
    });
    
}

//绑定追加功能
FunBinding();