using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.User
{
    /// <summary>
    /// 接口返回的用户信息
    /// </summary>
    public class Data
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public int Id { set; get; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserCode { set; get; }

        /// <summary>
        /// 用户姓名
        /// </summary>
        public string UserName { set; get; }

        /// <summary>
        /// 门店编码
        /// </summary>
        public string StoreCode { set; get; }

        /// <summary>
        /// 门店名称
        /// </summary>
        public string StoreName { set; get; }

        /// <summary>
        /// 手机号
        /// </summary>
        public string Mobile { set; get; }

        /// <summary>
        /// 是否为一般纳税人
        /// </summary>
        public bool IsGeneralTaxpayer { set; get; }

        /// <summary>
        /// 用户缓存对应的SessionId
        /// </summary>
        public string SessionId { set; get; }
    }
}