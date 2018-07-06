using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTrainingSystem.Entity.Training
{
    /// <summary>
    /// 文件上传结果
    /// </summary>
    public class UploadResult
    {
        /// <summary>
        /// 状态码 0失败 1成功
        /// </summary>
        public int Code { get; set; }
        /// <summary>
        /// 消息
        /// </summary>
        public string Msg { get; set; }
        /// <summary>
        /// 上传编号，唯一
        /// </summary>
        public string UploadID { get; set; }
        /// <summary>
        /// 文件保存信息
        /// </summary>
        public UploadFileInfo FileInfo { get; set; }

    }
}