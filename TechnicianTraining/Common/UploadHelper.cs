using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using TechnicianTrainingSystem.Entity.Training;

namespace TechnicianTraining.Common
{
    public class UploadHelper
    {
        /// <summary>
        /// 块文件存储根路径
        /// </summary>
        private string BlockRootPath { get; set; }

        /// <summary>
        /// 文件存储根路径
        /// </summary>
        public string FileRootPath { get; set; }

        /// <summary>
        /// 完整文件存放路径
        /// </summary>
        public string filePathName = "files";

        private UploadHelper()
        {
        }

        public UploadHelper(string fileRootPath)
        {
            if (string.IsNullOrWhiteSpace(fileRootPath))
                throw new ArgumentNullException("fileRootPath", "fileRootPath is null");

            FileRootPath = fileRootPath;
            BlockRootPath = fileRootPath + "/blocktmp/";
        }

        /// <summary>
        /// 分块上传
        /// </summary>
        public UploadResult Upload(string uploadId, int blockCount, int currIndex, string fileName, HttpPostedFileBase file)
        {
            try
            {
                if (file == null)
                    return new UploadResult { Msg = "请选择文件~" };
                if (blockCount < 1)
                    return new UploadResult { Msg = "块数量不能小于1~" };
                if (currIndex < 0)
                    return new UploadResult { Msg = "块数量小于0~" };
                if (string.IsNullOrWhiteSpace(uploadId) && currIndex > 1)
                    return new UploadResult { Msg = "上传编号为空~" };

                var result = new UploadResult { Code = 1, Msg = "上传成功~" };

                //首次上传需创建上传编号
                if (string.IsNullOrWhiteSpace(uploadId) || uploadId.Equals("undefind"))
                    uploadId = GenerateUploadId();

                result.UploadID = uploadId;

                #region ==块处理==

                //块文件名称
                var blockName = "{uploadId}_{" + currIndex + "}.block";
                //块文件目录路径
                var blockPath = Path.Combine(BlockRootPath, uploadId);
                //块文件目录对象
                DirectoryInfo blockDirectoryInfo = Directory.Exists(blockPath) ? new DirectoryInfo(blockPath) : Directory.CreateDirectory(blockPath);
                //块文件完整路径
                var blockFullPath = Path.Combine(blockPath, blockName);
                if (File.Exists(blockFullPath))
                {
                    //块已上传，不做失败处理
                    return new UploadResult { Code = 1, Msg = "该文件块已上传~" };
                }

                file.SaveAs(blockFullPath);

                #endregion

                #region ==块合并处理==

                //判断块文件是否已将上传完，上传完合并文件
                if (blockDirectoryInfo.GetFiles().Count().Equals(blockCount))
                {
                    Random random = new Random();
                    int number = random.Next(10000, 100000);
                    string uploadFileName = GetFileName(fileName) + "_" + number + "." + GetExtension(fileName);
                    var filePath = Path.Combine(FileRootPath, filePathName);
                    if (!Directory.Exists(filePath))
                    {
                        Directory.CreateDirectory(filePath);
                    }
                    //完整文件存储路径
                    var fileFullPath = Path.Combine(filePath, uploadFileName);
                    using (var fs = new FileStream(fileFullPath, FileMode.Create))
                    {
                        for (var i = 0; i < blockCount; i++)
                        {
                            var path = Path.Combine(blockPath, "{uploadId}_{"+ i +"}.block");
                            var bytes = File.ReadAllBytes(path);
                            fs.Write(bytes, 0, bytes.Length);
                        }
                        Directory.Delete(blockPath, true);

                        result.FileInfo = new UploadFileInfo
                        {
                            sourceFileName = fileName,
                            uploadFileName = uploadFileName,
                            FilePath = Path.Combine(filePathName, uploadFileName)
                        };
                    }
                }

                return result;
                #endregion
            }
            catch (Exception ex)
            {
                return new UploadResult { Msg = ex.Message };
            }
        }

        /// <summary>
        /// 生成上传唯一编号
        /// </summary>
        /// <returns></returns>
        public string GenerateUploadId()
        {
            var guid = Guid.NewGuid().ToString();
            return guid.Replace("-", "");
        }

        public string GetFileName(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName) || fileName.IndexOf(".") < 0)
            {
                return string.Empty;
            }
            var arr = fileName.Split('.');
            return arr[0];
        }

        /// <summary>
        /// 获取文件扩展名
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public string GetExtension(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName) || fileName.IndexOf(".") < 0)
            {
                return string.Empty;
            }
            var arr = fileName.Split('.');
            return arr[arr.Length - 1];
        }
    }
}