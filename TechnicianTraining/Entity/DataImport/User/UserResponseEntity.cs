using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.User
{
    /// <summary>
    /// 登录请求返回的消息实体
    /// </summary>
    public class UserResponseEntity
    {
        /// <summary>
        /// 状态码
        /// </summary>
        public int StatusCode { set; get; }

        /// <summary>
        /// 错误消息
        /// </summary>
        public string ErrorMsg { set; get; }

        /// <summary>
        /// 错误内容
        /// </summary>
        public Data Data { set; get; }
    }
}