using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Goods
{
    public class GoodsErrorDetail
    {
        /// <summary>
        /// 物料编码
        /// </summary>
        public string AppItemID { set; get; }

        /// <summary>
        /// AX物料ID
        /// </summary>
        public string AXItemID { set; get; }

        /// <summary>
        /// 物料名称
        /// </summary>
        public string AppItemName { set; get; }

        /// <summary>
        /// 是否成功
        /// </summary>
        public string IsSuccess { set; get; }

        /// <summary>
        /// 错误详情
        /// </summary>
        public string ErrorMessage { set; get; }
    }
}