var errImage = "    <img src='/Content/images/ko-red.png' style='width:20px;height:22px;'>";

$("[rel=tooltip]").tooltip();
$(function() {
    $('.demo-cancel-click').click(function(){return false;});
});

//登录方法
$(document).ready(function () {
    $('#login_form').bind('submit', function () {
        var username = $.trim($("#userName").val());
        var password = $("#Password").val();

        if (username == "") {
            layer.alert("用户名不能为空");
            return false;
        }
        else if (password == "") {
            layer.alert("密码不能为空");
            return false;
        }
        else {                     
            $('#login').attr("disabled", "true");
            ajaxSubmit(this, function (data) {
                var result = data.Result;
                if (result == false) {
                    layer.alert(data.Msg);
                }
                else {
                    window.location.href = "/Data/Index";   
                }
                $('#login').removeAttr("disabled");
                return false;
            });
            return false;
        }
        return false;
    });
});

///导入步骤///

function initStep() {
    $(".steps").step({
        stepNames: ['文件上传', '数据检查', '数据导入', '导入完成'],
        initStep: 1
    })
}

function previousStep() {
    $(".steps").step("previous");
}

function nextStep() {
    $(".steps").step("next");
}

function gotoStep(step) {
    $(".steps").step("goto", step)
}

function judge(val) {
    var str = val.search("img");
    if (str == -1) {
        return true;
    }
    else {
        return false;
    }
}

function GetPageSetting() {
    return {
        lengthMenu: '显示 <select class="form-control input-xsmall"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="50">50</option><option value="100">100</option></select> 条记录',//左上角的分页大小显示。
        processing: "载入中......",//处理页面数据的时候的显示
        paginate: {//分页的样式文本内容。
            previous: "上一页",
            next: "下一页",
            first: "第一页",
            last: "最后一页"
        },
        zeroRecords: "没有找到符合条件的数据",//table tbody内容为空时，tbody的内容。
        //下面三者构成了总体的左下角的内容。
        info: "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
        infoEmpty: "0条记录",//筛选为空时左下角的显示。
        infoFiltered: ""//筛选之后的左下角筛选提示(另一个是分页信息显示，在上面的info中已经设置，所以可以不显示)，
    };
}

function GetNewPage(id) {
    var oTable = $("#" + id).dataTable();
    $('#redirect').keyup(function (e) {
        if (e.keyCode == 13) {
            var pageNo = $(this).val();
            var text = $("#" + id + "_info").text();
            var array = text.split(' ');
            var pageCount = parseInt(array[0].substring(2, array[0].length));
            if (!isPositiveNum(pageNo)) {
                layer.alert("页码无效，请检查！");
            }
            else if (pageNo > pageCount) {
                layer.alert("超出最大页码，请检查！");
            }
            else {
                if (pageNo && pageNo > 0) {
                    var redirectpage = pageNo - 1;
                } else {
                    var redirectpage = 0;
                }
                oTable.fnPageChange(redirectpage);
            }
        }
    });
}

function selectRow(id) {
    var table = $('#' + id).dataTable();
    $("#" + id + " tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#button').click(function () {
        table.row('.selected').remove().draw(false);
    });
}

