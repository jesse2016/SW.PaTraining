using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Goods
{
    public class MaterilasImportList
    {
        /// <summary>
        /// 门店物料编号
        /// </summary>
        public string AppItemID { get; set; }

        /// <summary>
        /// 品牌
        /// </summary>
        public string Brand { get; set; }

        /// <summary>
        /// 主单位
        /// </summary>
        public string MainUnitId { get; set; }

        /// <summary>
        /// 辅单位
        /// </summary>
        public string AuxiliaryUnit { get; set; }

        /// <summary>
        /// 转换率
        /// </summary>
        public string factor { get; set; }

        /// <summary>
        /// 是否代销
        /// </summary>
        public string SalesByProxy { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 货品分类
        /// </summary>
        public string AppItemType { get; set; }

        /// <summary>
        /// 物料名称
        /// </summary>
        public string AppItemName { get; set; }

        /// <summary>
        /// 价格
        /// </summary>
        public string CostPrice { get; set; }

        /// <summary>
        /// 库存现有量
        /// </summary>
        public string QtyOnhand { get; set; }
    }
}