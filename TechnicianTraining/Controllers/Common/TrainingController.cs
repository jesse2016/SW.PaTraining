using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TechnicianTrainingSystem.Controllers.Common
{
    public class TrainingController : Controller
    {
        public string t_userName = string.Empty;
        public string t_SessionId = string.Empty;

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }
            var reurl = filterContext.HttpContext.Request.Url == null ? "#" : filterContext.HttpContext.Request.Url.PathAndQuery;
            string sessionId = Session["t_SessionId"] == null ? "" : Session["t_SessionId"].ToString();
            if (sessionId == string.Empty)
            {
                filterContext.Result = RedirectToAction("login", "Account", new { ReturnUrl = reurl });
            }
            else
            {
                t_userName = Session["t_userName"].ToString();
                t_SessionId = Session["t_SessionId"].ToString();
                ViewData["t_userName"] = t_userName;
            }
        }
    }
}
