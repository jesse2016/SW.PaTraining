using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Customer
{
    /// <summary>
    /// 客户信息实体
    /// </summary>
    public class CustImpRecordList
    {
        /// <summary>
        /// 客户名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 性别（0，女；1，男）
        /// </summary>
        public string Sex { get; set; }

        /// <summary>
        /// 客户电话
        /// </summary>
        public string Mobile { get; set; }

        /// <summary>
        /// 车牌号
        /// </summary>
        public string PlateNumber { get; set; }

        /// <summary>
        /// Vin
        /// </summary>
        public string VinCode { get; set; }

        /// <summary>
        /// 制造商
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// 品牌
        /// </summary>
        public string Brand { get; set; }

        /// <summary>
        /// 车系
        /// </summary>
        public string Series { get; set; }

        /// <summary>
        /// 类型
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// 买车年份
        /// </summary>
        public string CarYear { get; set; }

        /// <summary>
        /// 销售名称
        /// </summary>
        public string SaleName { get; set; }
    }
}