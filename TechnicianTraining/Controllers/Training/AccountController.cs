using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TechnicianTraining.Common;
using TechnicianTraining.DAL;
using TechnicianTraining.Entity.DataImport.Common;
using TechnicianTraining.Entity.DataImport.User;

namespace TechnicianTraining.Training.Controllers
{
    public class AccountController : Controller
    {
        public ActionResult login()
        {
            return View();
        }

        public ActionResult logout()
        {
            return View();
        }

        #region 用户登录
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public JsonResult UserLogin(string userName, string Password)
        {
            string loginUrl = string.Empty;
            try
            {
                string domain = ConfigurationManager.AppSettings["domain"].ToString();
                loginUrl = string.Format(ConfigurationManager.AppSettings["loginUrl"].ToString(), domain);

                bool result = false;
                string retmsg = string.Empty;

                userName = userName.Trim();
                if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(Password))
                {
                    UserRequestEntity user = new UserRequestEntity();

                    user.userCode = userName;
                    user.passWord = Password;
                    user.type = 2;
                    user.sysInfo = "web";

                    DataDAL biz = new DataDAL();

                    UserResponseEntity response = new UserResponseEntity();

                    RetMsg msg = biz.GetUserInfo(loginUrl, user);

                    if (!msg.IsSysError)
                    {
                        response = DataJsonSerializer<UserResponseEntity>.JsonToEntity(msg.Message);
                        if (response.StatusCode == 200)
                        {
                            Session["t_userCode"] = response.Data.UserCode;
                            Session["t_userName"] = response.Data.UserName;
                            Session["t_SessionId"] = response.Data.SessionId;

                            result = true; //sessionId不为空，用户登录成功
                        }
                        else
                        {
                            retmsg = response.ErrorMsg;
                        }
                    }
                    else
                    {
                        retmsg = msg.Message;
                    }
                }
                else
                {
                    retmsg = "用户名和密码不能为空";
                }

                return Json(new { Result = result, Msg = retmsg }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = false, Msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        public ActionResult UserLogout()
        {
            Session["t_userCode"] = null;
            Session["t_userName"] = null;
            Session["t_SessionId"] = null;

            return RedirectToRoute(new { controller = "Account", action = "login" });
        }
    }
}
