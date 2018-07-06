using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.User
{
    /// <summary>
    /// 登录请求的用户实体
    /// </summary>
    public class UserRequestEntity
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string userCode { set; get; }

        /// <summary>
        /// 密码
        /// </summary>
        public string passWord { set; get; }

        /// <summary>
        /// 类型（1：批量导入，2：技师培训）
        /// </summary>
        public int type { set; get; } 

        /// <summary>
        /// 浏览器信息
        /// </summary>
        public string sysInfo { set; get; }
    }
}