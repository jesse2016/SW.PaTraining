//初始化上传步骤
$(document).ready(function () {
    initStep();
});

//文件上传start
$(document).ready(function () {
    $("#preview").click(function () {
        var foptions = {
            url: "/Data/UploadGoodsExcel",
            dataType: "json",
            contentType: "application/json",
            beforeSubmit: importFileRequest,
            error: importFileError,
            success: importFileResponse,
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

var msgId;
function importFileRequest(formData, jqForm, options) {
    $("#preview").attr('disabled', "true");
    msgId = layer.msg("数据正在上传，请稍候...", {
        icon: 16,
        shade: 0.7,
        time: false //取消自动关闭
    });
    return true;
}

function importFileError(data) {
    layer.alert(data);
}

var data;
function importFileResponse(responseText, statusText) {
    var result = responseText.Result;
    if (result == true) {
        errorCount = 0;
        data = responseText.Data;
        var dataSet = json_to_array(data);
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
                ShowUploadData(dataSet);
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

            var errors = "数据格式说明：<br/>"+
            "1、门店物料编号不能为空，且不能有空格、*号等特殊字符；<br/>"+
            "2、物料名称不能为空；<br/>"+
            "3、品牌不能为空；<br/>"+
            "4、主单位不能为空；<br/>"+
            "5、辅单位不能为空；<br/>"+
            "6、转换率必须>=1；<br/>"+
            "7、货品分类不能为空；<br/>"+
            "8、库存成本单价>=0或空，有库存必须有成本；<br/>"+
            "9、库存现有量必须>=0或空，如果库存现有量>0，则导入成功后将无法修改；<br/>"+
            "10、是否代销只能为‘是’或‘否’。<br/>";
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
    layer.close(msgId);
}
/*文件上传-END*/

//展示数据检查的错误数据-start
function ShowUploadData(dataSet) {
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
            { title: "门店物料编号", width: "10%" },
            { title: "物料名称", width: "10%" },
            { title: "品牌", width: "10%" },
            { title: "主单位", width: "10%" },
            { title: "辅单位", width: "10%" },
            { title: "转换率", width: "10%" },           
            { title: "商品分类", width: "10%" },       
            { title: "库存成本单价", width: "10%" },
            { title: "库存现有量", width: "10%" },
            { title: "是否代销", width: "10%" },
            { title: "备注", width: "10%" }
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
/*展示数据检查的错误数据-end*/

var onhandTip = false;

/*数据转换及数据校验-start*/
function json_to_array(datas) {
    onhandTip = false;
    errorCount = 0;
    var dataAll = eval("(" + datas + ")");
    var data = dataAll.MaterilasImportList;
    var arr = [];
    var k = 0;
    var isok = true;
    var result = true;
    for (var i = 0; i < data.length; i++) {       
        var j = 0;
        result = true;
        isok = true;

        var AppItemID = CheckSpecialChar(data[i].AppItemID);
        isok = judge(AppItemID);
        if (isok == false) {
            result = false;
        }

        var AppItemName = GetErrorImage(data[i].AppItemName);
        isok = judge(AppItemName);
        if (isok == false) {
            result = false;
        }

        var Brand = GetErrorImage(data[i].Brand);
        isok = judge(Brand);
        if (isok == false) {
            result = false;
        }

        var MainUnitId = CheckArray(unitArr, data[i].MainUnitId);
        isok = judge(MainUnitId);
        if (isok == false) {
            result = false;
        }

        var AuxiliaryUnit = CheckArray(unitArr, data[i].AuxiliaryUnit);
        isok = judge(AuxiliaryUnit);
        if (isok == false) {
            result = false;
        }

        var factor = GetIntValue(data[i].factor, 1);
        isok = judge(factor);
        if (isok == false) {
            result = false;
        }

        var AppItemType = CheckArray(goodsTypeArr, data[i].AppItemType);
        isok = judge(AppItemType);
        if (isok == false) {
            result = false;
        }

        var _costPrice = data[i].CostPrice;
        var Onhand = data[i].QtyOnhand;

        var CostPrice = "";
        var QtyOnhand = "";

        if ((_costPrice == "" && Onhand == "") || (_costPrice != "" && Onhand != "")) {
            CostPrice = GetOnHand(_costPrice, 0);
            isok = judge(CostPrice);
            if (isok == false) {
                result = false;
            }

            QtyOnhand = GetOnHand(Onhand, 0);
            isok = judge(QtyOnhand);
            if (isok == false) {
                result = false;
            }
        }
        else {
            CostPrice = GetErrorImage(_costPrice);
            QtyOnhand = GetErrorImage(Onhand);
            result = false;
        }

        //判断现有量是否有大于0的数据
        if (onhandTip == false) {
            if (isRealNum(Onhand)) {
                var _onhand = parseInt(Onhand);
                if (_onhand > 0) {
                    onhandTip = true;
                }
            }
        }

        var proxy = data[i].SalesByProxy;
        if (proxy == "true") {
            proxy = "是";
        }
        else if (proxy == "false") {
            proxy = "否";
        }
        else {
            proxy = GetProxy(proxy);
        }
        isok = judge(proxy);
        if (isok == false) {
            result = false;
        }

        if (result == false) {
            arr[k] = []; //js中二维数组必须进行重复的声明，否则会undefind

            arr[k][j++] = AppItemID;
            arr[k][j++] = AppItemName;
            arr[k][j++] = Brand;
            arr[k][j++] = MainUnitId;
            arr[k][j++] = AuxiliaryUnit;

            arr[k][j++] = factor;
            arr[k][j++] = AppItemType;
            arr[k][j++] = CostPrice;
            arr[k][j++] = QtyOnhand;
            arr[k][j++] = proxy;

            arr[k][j++] = data[i].Remark;
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

function GetProxy(val) {
    errorCount++;
    return val + errImage;
}

function GetIntValue(val, num) {
    if (!isRealNum(val)) {
        errorCount++;
        return val + errImage;
    }
    else {
        var factor = parseInt(val);
        if (factor < num) {
            errorCount++;
            return val + errImage;
        }
        else {
            return val;
        }
    }
}

function GetCostPrice(val, num) {
    if (val == null || val == "") {
        return val;
    }
    else if (!isNoOrFloat(val)) {
        errorCount++;
        return val + errImage;
    }
    else {
        var factor = parseFloat(val);
        if (factor < num) {
            errorCount++;
            return val + errImage;
        }
        else {
            return val;
        }
    }
}

function GetOnHand(val, num) {
    if (val == null || val == "")
    {
        return val;
    }
    else if (!isRealNum(val)) {
        errorCount++;
        return val + errImage;
    }
    else {
        var factor = parseInt(val);
        if (factor < num) {
            errorCount++;
            return val + errImage;
        }
        else {
            return val;
        }
    }
}

/*数据转换及数据校验-end*/

/*导入数据-start*/
$(document).ready(function () {
    $("#import").click(function () {
        if (data == undefined) {
            layer.alert("请先上传文件！");
        }
        else if (errorCount > 0) {
            layer.alert("不允许导入格式错误的数据，请检查！");
        }
        else {
            if (onhandTip == true) {
                layer.confirm('检测到部分物料包含库存现有量，库存数据一旦导入，物料将无法再次修改，是否继续？', {
                    btn: ['确定', '取消']//按钮
                    }, function (index) {
                        Import();
                    }
                );
            }
            else {
                Import();
            }
        }
    });
});

function Import()
{
    $('#import').attr("disabled", "true");
    msgId = layer.msg("数据正在导入，请稍候...", {
        icon: 16,
        shade: 0.7,
        time: false //取消自动关闭
    });
    $.ajax({
        url: '/Data/ImportGoodsData',
        type: 'POST',
        data: { data: data },
        dataType: 'json',
        success: function (data) {
            layer.close(msgId);
            if (data.Result == false) {
                if (data.Msg == null || data.Msg == "") {
                    gotoStep(4);

                    var dataAll = eval("(" + data.Data + ")");
                    var totalCount = dataAll.TotalCount;
                    var successCount = dataAll.SuccessCount;
                    var falseCount = dataAll.FalseCount;
                    var falseData = dataAll.FalseResult;

                    var dataSet = err_json_to_array(falseData);
                    $("#importDiv").addClass("hidden");
                    $("#rightDiv").addClass("hidden");

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
                    $("#importDiv").addClass("hidden");
                    $("#errorDiv").removeClass("hidden");
                }
                else {
                    layer.alert(data.Msg);
                }
            }
            else {
                $("#rightDiv").addClass("hidden");
                $("#importDiv").removeClass("hidden");
                gotoStep(4);
            }
            $('#import').removeAttr("disabled");
        }
    });
}
/*导入数据-end*/

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
        serverSide : false,
        data: dataSet,
        columns: [
            { title: "序号", width: "5%" },
            { title: "物料编码", width: "15%" },
            { title: "物料名称", width: "25%" },
            { title: "错误详情", width: "55%" }
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
        arr[i][j++] = data[i].AppItemID;
        arr[i][j++] = data[i].AppItemName;
        arr[i][j++] = data[i].ErrorMessage;
    }
    return arr;
}
/*展示接口返回的错误数据-end*/