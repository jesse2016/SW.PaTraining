using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Common
{
    public class RetMsg
    {
        /// <summary>
        /// 是否是代码异常
        /// </summary>
        public bool IsSysError { set; get; }

        /// <summary>
        /// 返回消息
        /// </summary>
        public string Message { set; get; }
    }
}