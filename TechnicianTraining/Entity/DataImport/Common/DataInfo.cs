using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Common
{
    public class DataInfo<T>
    {
        /// <summary>
        /// 总条数
        /// </summary>
        public int TotalCount { set; get; }

        /// <summary>
        /// 错误条数
        /// </summary>
        public int FalseCount { set; get; }

        /// <summary>
        /// 成功条数
        /// </summary>
        public string SuccessCount { set; get; }

        /// <summary>
        /// 报错详细
        /// </summary>
        public List<T> FalseResult { set; get; }
    }
}