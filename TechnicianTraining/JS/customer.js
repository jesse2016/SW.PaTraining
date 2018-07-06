//初始化上传步骤
$(document).ready(function () {
    initStep();
});

//文件上传start
$(document).ready(function () {
    $("#preview").click(function () {
        var foptions = {
            url: "/Data/UploadExcel",
            dataType: "json",
            contentType: "application/json",
            beforeSubmit: CustomerUploadRequest,
            error: CustomerUploadError,
            success: CustomerUploadResponse,
            timeout: 30000
        };
        if ($("#dataFile").val() == "") {
            layer.alert("请选择Excel文件");
            return false;
        }
        else {
            $('#import_file_from').ajaxSubmit(foptions);
        }
    });
});

var cusId;
function CustomerUploadRequest(formData, jqForm, options) {
    $("#preview").attr('disabled', "true");
    cusId = layer.msg("数据正在上传，请稍候...", {
        icon: 16,
        shade: 0.7,
        time: false //取消自动关闭
    });
    return true;
}

function CustomerUploadError(data) {
    layer.alert(data);
}

var cusData;
function CustomerUploadResponse(responseText, statusText) {
    var result = responseText.Result;
    if (result == true) {
        var data = responseText.Data;
        cusData = data;
        var dataSet = cus_json_to_array(data);
        gotoStep(2);
        if (errorCount > 0) {
            var tableId = "preViewData";
            if ($('#' + tableId).hasClass('dataTable')) {
                var realTable = $('#' + tableId).DataTable();
                $('#' + tableId).dataTable().fnClearTable();
                for (var i = 0; i < dataSet.length; i++) {
                    realTable.row.add(dataSet[i]);
                }
                realTable.draw(false);
            }
            else {
                ShowCusUploadData(dataSet);
            }

            $("#rightDiv").addClass("hidden");
            $("#dataDiv").removeClass("hidden");

            if (responseText.Error != undefined && responseText.Error != "") {
                errorCount++;
                $("#errorTips").html(responseText.Error);
            }
            else {
                $("#errorTips").html("");
            }

            var errorTips = "以下数据格式错误，请检查！";
            $("#preErrorsTips").html(errorTips);

            var errors = "数据格式说明：<br/>" +
            "1、客户名称不能为空，且不能有空格、*号等特殊字符；<br/>" +
            "2、物料性别只能为‘男’或‘女’；<br/>" +
            "3、客户电话不能为空；<br/>" +
            "4、车牌号不能为空；<br/>" +
            "5、VIN不能为空,且必须为17位字符；<br/>";
            $("#preErrors").html(errors);
        }
        else {
            $("#dataDiv").addClass("hidden");
            $("#rightDiv").removeClass("hidden");
        }
    }
    else {
        layer.alert(responseText.Msg);
    }
    $("#errorDiv").addClass("hidden");
    $("#importDiv").addClass("hidden");
    $('#preview').removeAttr("disabled");
    layer.close(cusId);
}
/*文件上传-end*/

/*数据格式转换及校验-start*/
function cus_json_to_array(datas) {
    errorCount = 0;
    var dataAll = eval("(" + datas + ")");
    var data = dataAll.custImpRecordList;
    var arr = [];
    var k = 0;
    var isok = true;
    var result = true;
    var val = "";
    for (var i = 0; i < data.length; i++) {
        var j = 0;
        result = true;
        isok = true;

        var name = CheckSpecialChar(data[i].Name);
        isok = judge(name);
        if (isok == false) {
            result = false;
        }

        var sex = data[i].Sex;
        if (sex == "1") {
            sex = "男";
        }
        else if (sex == "0") {
            sex = "女";
        }
        else {
            sex = CheckPerson(sex);
        }      
        isok = judge(sex);
        if (isok == false) {
            result = false;
        }

        var mobile = CheckPhoneNo(data[i].Mobile);
        isok = judge(mobile);
        if (isok == false) {
            result = false;
        }

        var plateNo = CheckPlateNumber(data[i].PlateNumber);
        isok = judge(plateNo);
        if (isok == false) {
            result = false;
        }

        var vin = CheckVinCode(data[i].VinCode);
        isok = judge(vin);
        if (isok == false) {
            result = false;
        }

        if (result == false) {
            arr[k] = []; //js中二维数组必须进行重复的声明，否则会undefind

            arr[k][j++] = name;
            arr[k][j++] = sex;
            arr[k][j++] = mobile;
            arr[k][j++] = plateNo;
            arr[k][j++] = vin;

            arr[k][j++] = data[i].Brand;
            arr[k][j++] = data[i].Model;
            arr[k][j++] = data[i].Series;
            arr[k][j++] = data[i].CarYear;
            arr[k][j++] = data[i].Manufacturer;
            arr[k][j++] = data[i].SaleName;
        }

        if (result == true) {
            continue;
        }
        else {
            k++;
        }
    }
    return arr;
}

var errorCount = 0;
function GetErrorImage(val) {
    if (val == null || val == "") {
        errorCount++;
        return val + errImage;
    }
    else {
        return val;
    }
}

function CheckSpecialChar(val) {
    var reg = /\s/;
    if (!checkSpecial(val) || val == null || val == "" || reg.test(val)) {
        errorCount++;
        return val + errImage;
    }
    else {
        return val;
    }
}

function CheckPerson(val) {
    errorCount++;
    return val + errImage;
}

function CheckPhoneNo(val) {
    if (!isPoneAvailable(val)) {
        errorCount++;
        return val + errImage;
    }
    else {
        return val;
    }
}

function CheckPlateNumber(val) {
    if (!isPlateNo(val)) {
        errorCount++;
        return val + errImage;
    }
    else {
        return val;
    }
}

function CheckVinCode(val) {
    if (val == null || val == "" || val.length != 17) {
        errorCount++;
        return val + errImage;
    }
    else {
        return val;
    }
}

/*数据格式转换及校验-end*/

/*展示格式检查错误数据-start*/
function ShowCusUploadData(dataSet) {
    var tableId = "preViewData";
    $('#' + tableId).dataTable({
        searching: false,//隐藏搜索框
        //scrollX: true,
        //scrollCollapse: true,
        //scrollY: "500px",
        bRetrieve: true,
        fnDestroy: true,
        data: dataSet,
        columns: [
            { "title": "客户名称" },
            { "title": "客户性别" },
            { "title": "客户电话" },
            { "title": "车牌号" },
            { "title": "Vin" },
            { "title": "品牌" },
            { "title": "车型" },
            { "title": "车系" },
            { "title": "年份" },
            { "title": "供应商" },
            { "title": "销售名称" }
        ],
        language: GetPageSetting(),
        fnDrawCallback: function () {
            GetNewPage(tableId);
        },
        dom: '<"left"f>r<"right"<"#light"l><"Blight"B>>tip',
        buttons: {
            buttons: [
                { extend: 'colvis', className: 'excelButton', text: '当前显示列' },
                {
                    extend: 'excel', className: 'excelButton', text: '导出数据',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    }
                }
            ]
        }
    });
    selectRow(tableId);
}
/*展示格式检查错误数据-end*/

/*数据导入-start*/
$(document).ready(function () {
    $("#import").click(function () {
        if (errorCount > 0) {
            layer.alert("不允许导入格式错误的数据，请检查！");
        }
        else if (cusData == undefined) {
            layer.alert("请先上传文件！");
        }
        else {
            $('#import').attr("disabled", "true");
            id = layer.msg("数据正在导入，请稍候...", {
                icon: 16,
                shade: 0.7,
                time: false //取消自动关闭
            });
            $.ajax({
                url: '/Data/ImportCusData',
                type: 'POST',
                data: { data: cusData },
                dataType: 'json',
                success: function (data) {
                    layer.close(id);
                    if (data.Msg == null || data.Msg == "") {
                        gotoStep(4);
                        if (data.Data != "") {
                            $("#errorDiv").removeClass("hidden");

                            var dataAll = eval("(" + data.Data + ")");
                            var totalCount = dataAll.TotalCount;
                            var successCount = dataAll.SuccessCount;
                            var falseCount = dataAll.FalseCount;
                            var falseData = dataAll.FalseResult;

                            var dataSet = err_json_to_array(falseData);

                            var errors = "本次导入总条数：" + totalCount + "条，成功：" + successCount + "条，失败：" + falseCount + "条，失败数据如下。";
                            $("#showErrors").text(errors);

                            var tableId = "preErrorData";
                            if ($('#' + tableId).hasClass('dataTable')) {
                                var realTable = $('#' + tableId).DataTable();
                                $('#' + tableId).dataTable().fnClearTable();
                                for (var i = 0; i < dataSet.length; i++) {
                                    realTable.row.add(dataSet[i]);
                                }
                                realTable.draw(false);
                            }
                            else {
                                ShowErrorData(dataSet);
                            }
                        }
                        else {
                            $("#errorDiv").addClass("hidden");
                            $("#importDiv").removeClass("hidden");
                        }
                    }
                    else {
                        layer.alert(data.Msg);
                    }
                    $("#dataDiv").addClass("hidden");
                    $("#rightDiv").addClass("hidden");
                    $('#import').removeAttr("disabled");
                }
            });
        }
    });
});
/*数据导入-end*/

/*展示接口返回的错误数据-start*/
function ShowErrorData(dataSet) {
    var tableId = "preErrorData";
    $('#' + tableId).dataTable({
        searching: false,//隐藏搜索框
        //scrollX: true,
        //scrollCollapse: true,
        //scrollY: "500px",
        bRetrieve: true,
        fnDestroy: true,
        data: dataSet,
        columns: [
            { title: "序号", width: "10%" },
            { title: "客户电话", width: "20%" },
            { title: "错误详情", width: "70%" }
        ],
        language: GetPageSetting(),
        fnDrawCallback: function () {
            GetNewPage(tableId);
        },
        dom: '<"left"f>r<"right"<"#light"l><"Blight"B>>tip',
        buttons: {
            buttons: [
                { extend: 'colvis', className: 'excelButton', text: '当前显示列' },
                {
                    extend: 'excel', className: 'excelButton', text: '导出数据',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                }
            ]
        }
    });
    selectRow(tableId);
}

function err_json_to_array(data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        arr[i] = []; //js中二维数组必须进行重复的声明，否则会undefind
        var j = 0;

        arr[i][j++] = i + 1;
        arr[i][j++] = data[i].Phone;
        arr[i][j++] = data[i].ErrorMessage;
    }
    return arr;
}
/*展示接口返回的错误数据-end*/