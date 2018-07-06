using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Mvc;
using TechnicianTraining.Entity.DataImport.Table;
using TechnicianTraining.Filters;

namespace TechnicianTraining.DataImport.Controllers
{
    public class CheckTyreController : Controller
    {

        #region void

        public ActionResult Index()
        {

            return View();
        }
        /// <summary>
        /// 调用返回TABLE html
        /// </summary>
        /// <param name="BatchNum"></param>
        /// <returns></returns>
        public string Gettablehtml(string BatchNum)
        {
            CheckTyreController config = new CheckTyreController();
            string html = config.GetTyreInfo(config.GetSession(BatchNum));

            return html;
        }


        public string GetTyreInfo(string result)
        {
            try
            {
                var model = JsonConvert.DeserializeObject<dynamic>(result);
                List<CheckTyre> list = new List<CheckTyre>();
                CheckTyre tyrecheck = new CheckTyre();
                list = tyrecheck.GetTyreCheck(model);
                StringBuilder html = new StringBuilder();
                html.Append(BuilderHtml(list));
                return html.ToString();
            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);

                return "";
            }
        }

        public string GetSession(string BatchNum)
        {
            CheckTyreFilter help = new CheckTyreFilter();
            string getresult = "";
            string resultpath = "http://swstoreapptest.chinacloudsites.cn/api/AccessInfo";
            JsonResult result = help.GetResponseResult<JsonResult>(resultpath, "", "GET");
            dynamic results = result.Data;
            if (result.Data != null)
            {
                resultpath = "http://swstoreapptest.chinacloudsites.cn/api/AccessToken?appInfos=" + results.appInfos;
                result = help.GetResponseResult<JsonResult>(resultpath, "", "GET");
                results = result.Data;
                if (result.Data != null)
                {
                    resultpath = "http://swstoreapptest.chinacloudsites.cn/api/VehicleDetection?batchNum=" + BatchNum;   //Account
                    Dictionary<string, string> dic = new Dictionary<string, string>();
                    dic.Add("Token", results.SessionId);
                    Dictionary<string, string> par = new Dictionary<string, string>();
                    help.Headers = dic;
                    help.Params = par;
                    results = help.GetResponseResult<JsonResult>(resultpath, null, "GET");
                    getresult = results.Data.ToString();
                }
            }
            return getresult;
        }
    #endregion

        #region Table

        public string BuilderHtml(List<CheckTyre> list)
        {

            StringBuilder html = new StringBuilder();
            html.Append("<meta name='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' />");
            html.Append(BuilderStyle());
            html.Append("<div id='divForm'>  ");
            for (int i = 0; i < list[0].vehicleanddetailsres.Count; i++)
            {
              
                html.Append("<div class='table' style='overflow:hidden;'>");
                html.Append(BuilderTitle(list[0].vehicleanddetailsres[i].FirstType));
                for (int j = 0; j < list[0].vehicleanddetailsres[i].VeDeDetailsList.Count; j++)
                {
                    html.Append(BuilderTitles(list[0].vehicleanddetailsres[i].VeDeDetailsList[j].SecondType));
                   
                    for (int k = 0; k < list[0].vehicleanddetailsres[i].VeDeDetailsList[j].ThirdDetailsList.Count; k++)
                    {
                        html.Append("<div style='overflow:hidden; width:100%; border-bottom:1px solid #ccc;'>");
                        html.Append(BuilderRow(list[0].vehicleanddetailsres[i].VeDeDetailsList[j].ThirdDetailsList[k].ThirdType, "table-cell"));
                        string remark = GetEnumDescription(list[0].vehicleanddetailsres[i].VeDeDetailsList[j].ThirdDetailsList[k].value);
                        string remarkname = list[0].vehicleanddetailsres[i].VeDeDetailsList[j].ThirdDetailsList[k].AbnormalLevelName.ToString();

                        ThirdDetailsListValue flag;
                        if (!Enum.TryParse<ThirdDetailsListValue>(remarkname, true, out flag))
                        {
                            remark = remarkname;
                        }
                        html.Append(BuilderRow(remark, "table-cellsecond"));
                        html.Append("</div>");
                    }
                    html.Append("<div style='clear:both'></div>");
                    
                }
                html.Append("</div>");
               
            }
            html.Append("</div>");
         
            return html.ToString();
        }

        public string BuilderTitle(string title)
        {
            var html = "";
            html += "<div style='text-align:center;background: #eee;padding:8px 0;'>";
            html += title;
            html += "</div>";
            return html;
        }
        public string BuilderTitles(string title)
        {
            var html = "";
            html += "<div style='border-bottom: 0.5px solid #ccc;text-align:left;padding:8px 8px;'>■";
            html += title;
            html += "</div>";
            return html;
        }

        public string BuilderStyle()
        {
            StringBuilder html = new StringBuilder();

            html.Append("<style>");
            html.Append("body{margin:0;} ");
            html.Append(".table{border:0px solid #ccc; width:100% ;margin:0 auto;margin-top:5%;}  ");
            html.Append(".table-cell{float:left;padding:8px 15px;color:#666;}  ");
            html.Append(".table-cellsecond{float:right;padding:8px 15px;text-align:right;color:#666;}  ");
            html.Append("</style>");
            return html.ToString();
        }

        public static string GetEnumDescription(Enum enumValue)
        {
            string value = enumValue.ToString();
            try
            {
                FieldInfo field = enumValue.GetType().GetField(value);
                object[] objs = field.GetCustomAttributes(typeof(DescriptionAttribute), false);    //获取描述属性
                if (objs.Length == 0)    //当描述属性没有时，直接返回名称
                    return value;
                DescriptionAttribute descriptionAttribute = (DescriptionAttribute)objs[0];
                return descriptionAttribute.Description;
            }
            catch
            {
                return value;
            }
        }
        public string BuilderRow(string rowname,string classname)
        {
            var html = "";
            html += "<div class='"+ classname + "'>";
            html +=  rowname.Equals(string.Empty) ? "/" : rowname;
            html += "</div>";
            return html;
        }

        #endregion

    }
}