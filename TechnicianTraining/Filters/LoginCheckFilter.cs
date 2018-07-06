using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TechnicianTraining.Filters
{
    public class LoginCheckFilter : ActionFilterAttribute  
    {
        //表示是否检查登录  
        public bool IsCheck { get; set; }
        //Action方法执行之前执行此方法  
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            if (IsCheck)
            {
                //校验用户是否已经登录  
                if (filterContext.HttpContext.Session["SessionId"] == null)
                {
                    //跳转到登陆页  
                    filterContext.HttpContext.Response.Redirect("/Home/Index");
                }
            }
        }  
    }
}