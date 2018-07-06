var count = 1;
var uploadId = '';
var index = 0;
var blockCount = 0;

function Start(obj, type) {
    count = 1;
    index = 0;
    uploadId = '';
    Upload(obj, type);
}

function Upload(obj, type) {
    var files = obj.files;
    //console.log(files);
    if (files.length < 1) {
        obj.nextSibling.innerHTML = "";
        obj.nextSibling.nextSibling.innerHTML = "";//清空原来的文件地址
        return;
    }
    var file = files[0];

    //检查文件类型
    var imageType = ['jpg', 'png', 'gif', 'svg'];
    var videoType = ['mp4'];
    var allowType = imageType;
    if (type == "video")
    {
        allowType = videoType;
    }
    var fileExt = GetFileExt(file.name);
    if ($.inArray(fileExt, allowType) == -1) {
        SetRedText(obj, "非法的文件类型！");
        return;
    }

    var totalSize = file.size;//文件大小
    var blockSize = 1024 * 1024 * 1;//块大小2M

    //校验文件大小
    if (type == "video") {
        if (totalSize > blockSize * 200) {
            SetRedText(obj, "文件大小不能超过200M");
            return;
        }
    }
    else {
        if (totalSize > blockSize * 2) {
            SetRedText(obj, "文件大小不能超过2M");
            return;
        }
    }
    
    blockCount = Math.ceil(totalSize / blockSize);//总块数
    //console.log("文件大小：" + totalSize);
    //console.log("总块数：" + blockCount);

    //创建FormData对象
    var formData = new FormData();
    formData.append('fileName', file.name);//文件名
    formData.append('total', blockCount);//总块数
    formData.append('index', index);//当前上传的块下标
    formData.append('uploadId', uploadId);//上传编号
    formData.append('data', null);

    SetGreenText(obj, "上传中...1%");

    UploadPost(obj ,type ,file, formData, totalSize, blockCount, blockSize);
}

function UploadPost(obj, type, file, formData, totalSize, blockCount, blockSize) {
    try {
        var start = index * blockSize;
        var end = Math.min(totalSize, start + blockSize);
        //console.log(start + " - " + end + " - " + count);
        count++;
        var block = file.slice(start, end);
        formData.set('data', block);
        formData.set('index', index);
        formData.set('uploadId', uploadId);
       
        $.ajax({
            url: '/Article/Upload',
            type: 'post',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                //console.log(res);
                block = null;
                if (res.Code === 1) {
                    if (index === 0) {
                        uploadId = res.UploadID;
                    }
                    index++;
                    var percent = (index / blockCount * 100).toFixed(2) + '%';
                    //console.log(percent);
                    obj.nextSibling.innerHTML = "上传中..." + percent;
                    if (index < blockCount) {
                        UploadPost(obj, type, file, formData, totalSize, blockCount, blockSize);
                    }
                    else {
                        if (type === "image") {
                            obj.parentNode.getElementsByTagName("img").item(0).src = res.FileInfo.Url;
                        }
                        else {
                            obj.parentNode.getElementsByTagName("source").item(0).src = res.FileInfo.Url;
                        }
                        obj.nextSibling.nextSibling.innerHTML = res.FileInfo.uploadFileName;//存放上传时的文件名称
                        SetGreenText(obj, "上传成功");
                    }
                }
                else {
                    alert(res.Msg);
                }
            }
        });
    } catch (e) {
        alert(e);
    }
}

function SetRedText(obj,text)
{
    obj.nextSibling.innerHTML = text;
    obj.nextSibling.classList.remove("green");
    obj.nextSibling.classList.add("red");
}

function SetGreenText(obj, text) {
    obj.nextSibling.innerHTML = text;
    obj.nextSibling.classList.remove("red");
    obj.nextSibling.classList.add("green");  
}

function GetFileExt(filename) {
    var extStart = filename.lastIndexOf(".") + 1;
    return filename.substring(extStart, filename.length).toLowerCase();
}