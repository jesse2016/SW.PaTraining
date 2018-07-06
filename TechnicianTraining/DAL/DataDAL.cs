using TechnicianTraining.Entity.DataImport;
using TechnicianTraining.Entity.DataImport.Common;
using TechnicianTraining.Entity.DataImport.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TechnicianTraining.Common;

namespace TechnicianTraining.DAL
{
    public class DataDAL
    {
        /// <summary>
        /// 获取登录用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RetMsg GetUserInfo(string url, UserRequestEntity request)
        {
            RetMsg msg = new RetMsg();
            try
            {
                string postData = DataJsonSerializer<UserRequestEntity>.EntityToJson(request);
                string responseStr = HttpClient.RequestPost(url, postData);

                msg.IsSysError = false;
                msg.Message = responseStr;
            }
            catch (Exception ex)
            {
                msg.IsSysError = true;
                msg.Message = ex.Message;
            }
            return msg;
        }

        /// <summary>
        /// 调用数据导入接口
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RetMsg DataImport(string url, string json, string sessionId)
        {
            RetMsg msg = new RetMsg();
            try
            {
                string responseStr = HttpClient.RequestPost(url, json, sessionId);

                msg.IsSysError = false;
                msg.Message = responseStr;
            }
            catch (Exception ex)
            {
                msg.IsSysError = true;
                msg.Message = ex.Message;
            }
            return msg;
        }
    }
}