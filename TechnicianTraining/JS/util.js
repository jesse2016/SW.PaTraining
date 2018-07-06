var unitArr = new Array('个', '件', '包', '卡', '卷', '双', '只', '台',
                    '块', '套', '对', '小时', '张', '把', '捆', '支',
                    '条', '板', '根', '桶', '次', '毫升', '片',
                    '瓶', '盒', '箱', '米', '组', '车');

var goodsTypeArr = new Array('充值', '养护用品', '养护耗材', '工时', '易损件',
                             '次卡', '汽车用品', '油品', '维修件', '美容工具', 
                             '美容用品', '轮毂', '轮胎', '钣金/油漆', '非汽车用品');

//将form转为AJAX提交
function ajaxSubmit(frm, fn) {
    var dataPara = getFormJson(frm);
    $.ajax({
        url: frm.action,
        type: frm.method,
        data: dataPara,
        success: fn
    });
}

//将form中的值转换为键值对。
function getFormJson(frm) {
    var o = {};
    var a = $(frm).serializeArray();
    var taglist = "";
    $.each(a, function () {
        if (this.name == "tagList") {
            taglist = taglist + this.value + ",";
        }
        else {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        }
    });
    o["tagList"] = taglist;
    return o;
}

//转换方法
function EscapeChar(HaveSpecialval) {
    //转换半角单引号
    if (HaveSpecialval == null) {
        return '';
    }
    HaveSpecialval = HaveSpecialval.replace(/\'/g, "\\\'");
    HaveSpecialval = HaveSpecialval.replace(/"/g, "&quot;");

    //也可以使用&acute;
    //HaveSpecialval = HaveSpecialval.replace(/\'/g, "&acute;");

    return HaveSpecialval;
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

function isNoOrFloat(s) {
    var regu = "^([0-9])[0-9]*(\\.\\w*)?$";
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    }
    else {
        return false;
    }
}

//检验特殊字符
function checkSpecial(val) {
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

    if (regEn.test(val) || regCn.test(val)) {
        return false;
    }
    else {
        return true;
    }
}

//校验手机号
function isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

//校验车牌号
function isPlateNo(str) {
    var re = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    if (str.search(re) == -1) {
        return false;
    } else {
        return true;
    }
}

//校验单位
function contains(arr,obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

function CheckArray(arr, val) {
    if (!contains(arr, val) || val == null || val == "") {
        errorCount++;
        return val + errImage;
    }
    else {
        return val;
    }
}