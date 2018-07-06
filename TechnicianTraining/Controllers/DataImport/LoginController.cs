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

namespace TechnicianTraining.DataImport.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        #region 用户登录
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="formCol"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Login(FormCollection formCol)
        {
            string loginUrl = string.Empty;
            try
            {
                string domain = ConfigurationManager.AppSettings["domain"].ToString();
                loginUrl = string.Format(ConfigurationManager.AppSettings["loginUrl"].ToString(), domain);

                string userName = formCol["userName"];
                string Password = formCol["Password"];

                bool result = false;
                string retmsg = string.Empty;

                userName = userName.Trim();
                if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(Password))
                {
                    UserRequestEntity user = new UserRequestEntity();

                    user.userCode = userName;
                    user.passWord = Password;
                    user.type = 1;
                    user.sysInfo = "web";

                    DataDAL biz = new DataDAL();

                    UserResponseEntity response = new UserResponseEntity();

                    RetMsg msg = biz.GetUserInfo(loginUrl ,user);

                    if (!msg.IsSysError)
                    {
                        response = DataJsonSerializer<UserResponseEntity>.JsonToEntity(msg.Message);
                        if (response.StatusCode == 200)
                        {
                            Session["userCode"] = response.Data.UserCode;
                            Session["userName"] = response.Data.UserName;
                            Session["SessionId"] = response.Data.SessionId;

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

        public ActionResult Logout()
        {
            Session["userCode"] = null;
            Session["userName"] = null;
            Session["SessionId"] = null;

            return RedirectToRoute(new { controller = "Login", action = "Index" });
        }
    }
}
