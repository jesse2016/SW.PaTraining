using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTrainingSystem.Entity.Training
{
    public class UploadFileInfo
    {
        /// <summary>
        /// 原文件名称
        /// </summary>
        public string sourceFileName { get; set; }

        /// <summary>
        /// 文件上传名称
        /// </summary>
        public string uploadFileName { get; set; }

        /// <summary>
        /// 文件访问地址
        /// </summary>
        public string Url { set; get; }

        /// <summary>
        /// 文件保存路径
        /// </summary>
        public string FilePath { get; set; }
        /// <summary>
        /// 文件MD5值
        /// </summary>
        public string MD5 { get; set; }
    }
}