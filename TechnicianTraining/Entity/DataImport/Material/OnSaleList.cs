using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Material
{
    public class OnSaleList
    {
        /// <summary>
        /// 门店物料编号
        /// </summary>
        public string AppItemId { get; set; }

        /// <summary>
        /// 上架单位
        /// </summary>
        public string OnSaleUnit { get; set; }

        /// <summary>
        /// 备注、描述
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 上架类别
        /// </summary>
        public string OnSaleType { get; set; }

        /// <summary>
        /// 上架名称
        /// </summary>
        public string OnSaleName { get; set; }

        /// <summary>
        /// 上架价格
        /// </summary>
        public string OnSalePrice { get; set; }

        /// <summary>
        /// 是否上架
        /// </summary>
        public string IsOnSale { get; set; }
    }
}