using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TechnicianTraining.Common.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/

        public ActionResult Index()
        {
            try
            {
                HttpException erroy = new HttpException();
                ViewData["ErrorInfo"] = erroy.GetHttpCode().ToString() + "：" + erroy.Message;
            }
            catch
            {
            }

            return View();
        }

    }
}
