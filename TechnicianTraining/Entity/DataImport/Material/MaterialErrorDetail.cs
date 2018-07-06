using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Material
{
    public class MaterialErrorDetail
    {
        /// <summary>
        /// 物料编码
        /// </summary>
        public string AppItemId { set; get; }

        /// <summary>
        /// 物料名称
        /// </summary>
        public string OnSaleName { set; get; }

        /// <summary>
        /// 错误详情
        /// </summary>
        public string ErrorMessage { set; get; }
    }
}