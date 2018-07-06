using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Common
{
    public class ImportResponse<T>
    {
        /// <summary>
        /// 状态码
        /// </summary>
        public int StatusCode { set; get; }

        /// <summary>
        /// 错误消息
        /// </summary>
        public string ErrorMsg { set; get; }

        /// <summary>
        /// 报错详细
        /// </summary>
        public DataInfo<T> Data { set; get; }
    }
}