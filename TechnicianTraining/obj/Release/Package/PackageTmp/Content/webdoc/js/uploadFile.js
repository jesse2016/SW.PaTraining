var count = 1;
var uploadId = '';
var index = 0;
var blockCount = 0;

function Start(obj) {
    count = 1;
    index = 0;
    uploadId = '';
    Upload(obj);
}

function Upload(obj) {
    var files = obj.files;
    if (files.length < 1) {
        return;
    }
    var file = files[0];
    var totalSize = file.size;//文件大小
    var blockSize = 1024 * 1024 * 2;//块大小2M
    blockCount = Math.ceil(totalSize / blockSize);//总块数
    console.log("文件大小：" + totalSize);
    console.log("总块数：" + blockCount);

    //创建FormData对象
    var formData = new FormData();
    formData.append('fileName', file.name);//文件名
    formData.append('total', blockCount);//总块数
    formData.append('index', index);//当前上传的块下标
    formData.append('uploadId', uploadId);//上传编号
    formData.append('data', null);

    UploadPost(obj ,file, formData, totalSize, blockCount, blockSize);
}

function UploadPost(obj, file, formData, totalSize, blockCount, blockSize) {
    try {
        var start = index * blockSize;
        var end = Math.min(totalSize, start + blockSize);
        console.log(start + " - " + end + " - " + count);
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
                    console.log(percent);
                    obj.nextSibling.innerHTML = percent;
                    if (index < blockCount) {
                        UploadPost(obj, file, formData, totalSize, blockCount, blockSize);
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