using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Customer
{
    public class CustomerErrorDetail
    {
        /// <summary>
        /// 手机号码
        /// </summary>
        public string Phone { set; get; }

        /// <summary>
        /// 错误详情
        /// </summary>
        public string ErrorMessage { set; get; }
    }
}