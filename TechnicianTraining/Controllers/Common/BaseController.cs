using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TechnicianTraining.Common.Controllers
{
    public class BaseController : Controller
    {
        public string userName = string.Empty;
        public string SessionId = string.Empty;  

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }
            var reurl = filterContext.HttpContext.Request.Url == null ? "#" : filterContext.HttpContext.Request.Url.PathAndQuery;
            string sessionId = Session["SessionId"] == null ? "" : Session["SessionId"].ToString();
            if (sessionId == string.Empty)
            {
                filterContext.Result = RedirectToAction("Index", "Login", new { ReturnUrl = reurl });
            }
            else
            {
                userName = Session["userName"].ToString();
                SessionId = Session["SessionId"].ToString();
            }
        }
    }
}
