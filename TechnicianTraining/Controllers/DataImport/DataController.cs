using Newtonsoft.Json;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using TechnicianTraining.Common;
using TechnicianTraining.Common.Controllers;
using TechnicianTraining.DAL;
using TechnicianTraining.Entity.DataImport.Common;
using TechnicianTraining.Entity.DataImport.Customer;
using TechnicianTraining.Entity.DataImport.Goods;
using TechnicianTraining.Entity.DataImport.Material;

namespace TechnicianTraining.DataImport.Controllers
{
    public class DataController : BaseController
    {
        #region 初始化
        public string customerUrl = string.Empty;
        public string goodsUrl = string.Empty;
        public string materialUrl = string.Empty;

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);

            try
            {
                string domain = ConfigurationManager.AppSettings["domain"].ToString();
                customerUrl = string.Format(ConfigurationManager.AppSettings["customerUrl"].ToString(), domain);
                goodsUrl = string.Format(ConfigurationManager.AppSettings["goodsUrl"].ToString(), domain);
                materialUrl = string.Format(ConfigurationManager.AppSettings["materialUrl"].ToString(), domain);
            }
            catch
            {
            }
        }
        #endregion

        #region 视图
        public ActionResult Index()
        {
            ViewData["userName"] = userName;

            return View();
        }

        public ActionResult Customer()
        {
            ViewData["userName"] = userName;

            return View();
        }

        public ActionResult Goods()
        {
            ViewData["userName"] = userName;

            return View();
        }

        public ActionResult Material()
        {
            ViewData["userName"] = userName;

            return View();
        }
        #endregion

        #region 导入客户数据
        /// <summary>
        /// 导入客户数据
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public JsonResult ImportCusData(string data)
        {
            string jsonStr = string.Empty;
            bool result = false;
            string retmsg = string.Empty;

            DataDAL biz = new DataDAL();

            RetMsg msg = biz.DataImport(customerUrl, data, SessionId);

            if (!msg.IsSysError)
            {
                ImportResponse<CustomerErrorDetail> response = DataJsonSerializer<ImportResponse<CustomerErrorDetail>>.JsonToEntity(msg.Message);
                if (response.Data.FalseCount == 0)
                {
                    result = true; //导入成功
                }
                else
                {
                    jsonStr = JsonConvert.SerializeObject(response.Data);
                }
            }
            else
            {
                retmsg = msg.Message;
            }

            return Json(new { Result = result, Msg = retmsg, Data = jsonStr }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 导入商品数据
        /// <summary>
        /// 导入商品数据
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public JsonResult ImportGoodsData(string data)
        {
            string jsonStr = string.Empty;
            bool result = false;
            string retmsg = string.Empty;

            DataDAL biz = new DataDAL();

            RetMsg msg = biz.DataImport(goodsUrl, data, SessionId);

            if (!msg.IsSysError)
            {
                ImportResponse<GoodsErrorDetail> response = DataJsonSerializer<ImportResponse<GoodsErrorDetail>>.JsonToEntity(msg.Message);
                if (response.Data.FalseCount == 0)
                {
                    result = true; //导入成功
                }
                else
                {
                    jsonStr = JsonConvert.SerializeObject(response.Data);
                }
            }
            else
            {
                retmsg = msg.Message;
            }

            return Json(new { Result = result, Msg = retmsg, Data = jsonStr }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 导入物料上架数据
        /// <summary>
        /// 导入物料上架数据
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public JsonResult ImportMaterialData(string data)
        {
            string jsonStr = string.Empty;
            bool result = false;
            string retmsg = string.Empty;

            DataDAL biz = new DataDAL();

            RetMsg msg = biz.DataImport(materialUrl, data, SessionId);

            if (!msg.IsSysError)
            {
                ImportResponse<MaterialErrorDetail> response = DataJsonSerializer<ImportResponse<MaterialErrorDetail>>.JsonToEntity(msg.Message);
                if (response.Data.FalseCount == 0)
                {
                    result = true; //导入成功
                }
                else
                {
                    jsonStr = JsonConvert.SerializeObject(response.Data);
                }
            }
            else
            {
                retmsg = msg.Message;
            }

            return Json(new { Result = result, Msg = retmsg, Data = jsonStr }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 上传客户Excel文件
        /// <summary>
        /// 上传客户Excel文件，返回数据
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UploadExcel(FormCollection formCtl)
        {
            try
            {
                HttpPostedFileBase file = Request.Files["dataFile"];//接收客户端传递过来的数据.
                if (file == null)
                {
                    return Json(new { Result = false, Msg = "请选择要上传的Excel文件" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    string errorMsg = string.Empty;
                    ISheet sheet = GetFileSheet(file, out errorMsg);

                    if (errorMsg != string.Empty)
                    {
                        return Json(new { Result = false, Msg = errorMsg }, JsonRequestBehavior.AllowGet);
                    }
                    
                    IRow headerRow = sheet.GetRow(1);//第一行为标题行
                    int rowCount = sheet.LastRowNum;

                    string value = string.Empty;
                    Customers cus = new Customers();
                    List<CustImpRecordList> customerList = new List<CustImpRecordList>();
                    for (int i = (sheet.FirstRowNum + 2); i <= rowCount; i++)
                    {
                        IRow row = sheet.GetRow(i);

                        CustImpRecordList customer = new CustImpRecordList();
                        if (row != null)
                        {
                            for (int j = 0; j < headerRow.Cells.Count; j++)
                            {
                                if (row.GetCell(j) != null)
                                {
                                    value = GetCellValue(row.GetCell(j)).Trim();
                                }
                                customer = GetCustomer(customer, value, j);
                                value = string.Empty;
                            }
                            customerList.Add(customer);
                        }
                    }
                    cus.custImpRecordList = customerList;
                    string jsonStr = JsonConvert.SerializeObject(cus);
                    return Json(new { Result = true, Msg = "导入成功", Data = jsonStr }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = false, Msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        private CustImpRecordList GetCustomer(CustImpRecordList customer, string value, int index)
        {
            int i = 0;
            if (index == i++)
            {
                customer.Name = value;
            }
            if (index == i++)
            {
                string sex = value;
                if (value == "男")
                {
                    sex = "1";
                }
                if (value == "女")
                {
                    sex = "0";
                }
                customer.Sex = sex;
            }
            if (index == i++)
            {
                customer.Mobile = value;
            }
            if (index == i++)
            {
                customer.PlateNumber = value.ToUpper();
            }
            if (index == i++)
            {
                customer.VinCode = value;
            }
            if (index == i++)
            {
                customer.Brand = value;
            }
            if (index == i++)
            {
                customer.Model = value;
            }
            if (index == i++)
            {
                customer.Series = value;
            }
            if (index == i++)
            {
                customer.CarYear = value;
            }
            if (index == i++)
            {
                customer.Manufacturer = value;
            }
            if (index == i++)
            {
                customer.SaleName = value;
            }

            return customer;
        }
        #endregion

        #region 上传商品Excel文件
        /// <summary>
        /// 上传商品Excel文件，返回数据
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UploadGoodsExcel(FormCollection formCtl)
        {
            try
            {
                HttpPostedFileBase file = Request.Files["dataFile"];//接收客户端传递过来的数据.
                if (file == null)
                {
                    return Json(new { Result = false, Msg = "请选择要上传的Excel文件" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    string errorMsg = string.Empty;
                    ISheet sheet = GetFileSheet(file, out errorMsg);
                    
                    if(errorMsg != string.Empty)
                    {
                        return Json(new { Result = false, Msg = errorMsg }, JsonRequestBehavior.AllowGet);
                    }

                    IRow headerRow = sheet.GetRow(1);//第一行为标题行
                    int rowCount = sheet.LastRowNum;

                    string value = string.Empty;
                    Goods cus = new Goods();
                    List<MaterilasImportList> materialList = new List<MaterilasImportList>();
                    for (int i = (sheet.FirstRowNum + 2); i <= rowCount; i++)
                    {
                        IRow row = sheet.GetRow(i);

                        MaterilasImportList material = new MaterilasImportList();
                        if (row != null)
                        {
                            for (int j = 0; j < headerRow.Cells.Count; j++)
                            {
                                if (row.GetCell(j) != null)
                                {
                                    value = GetCellValue(row.GetCell(j)).Trim();
                                }
                                material = GetGoodsData(material, value, j);
                                value = string.Empty;
                            }
                            materialList.Add(material);
                        }
                    }

                    //统计重复的门店号
                    var result = from t in materialList
                                 group t by t.AppItemID into g
                                 where g.Count() > 1
                                 select new { AppItemID = string.Join(",", g.Select(x => x.AppItemID).Distinct()) };
                    string repeat = string.Empty;
                    foreach (var item in result)
                    {
                        repeat += item.AppItemID + ",";
                    }
                    if (repeat != string.Empty)
                    {
                        repeat = "门店物料编号重复：" + repeat.TrimEnd(',');
                    }
                    cus.MaterilasImportList = materialList;
                    string jsonStr = JsonConvert.SerializeObject(cus);
                    return Json(new { Result = true, Msg = "上传成功", Error = repeat, Data = jsonStr }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = false, Msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        private MaterilasImportList GetGoodsData(MaterilasImportList material, string value, int index)
        {
            int i = 0;
            if (index == i++) //门店物料编号
            {
                material.AppItemID = value;
            }
            if (index == i++)
            {
                material.AppItemName = value;
            }
            if (index == i++) //物料名称
            {
                material.Brand = value;
            }

            if (index == i++) //主单位
            {
                material.MainUnitId = value;
            }
            if (index == i++) //辅单位
            {
                material.AuxiliaryUnit = value;
            }
            if (index == i++) //转换率
            {
                material.factor = value;
            }

            if (index == i++) //货品分类
            {
                material.AppItemType = value;
            }
            if (index == i++) //库存成本单价
            {
                material.CostPrice = value;
            }
            if (index == i++) //库存现有量
            {
                material.QtyOnhand = value;
            }

            if (index == i++) //是否代销
            {
                if (value == "是")
                {
                    material.SalesByProxy = "true";
                }
                else if (value == "否")
                {
                    material.SalesByProxy = "false";
                }
                else
                {
                    material.SalesByProxy = value;
                }
            }
            if (index == i++) //备注
            {
                material.Remark = value;
            }

            return material;
        }
        #endregion

        #region 上传物料上架Excel文件
        /// <summary>
        /// 上传物料上架Excel文件
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UploadMaterialExcel(FormCollection formCtl)
        {
            try
            {
                HttpPostedFileBase file = Request.Files["dataFile"];//接收客户端传递过来的数据.
                if (file == null)
                {
                    return Json(new { Result = false, Msg = "请选择要上传的Excel文件" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    string errorMsg = string.Empty;
                    ISheet sheet = GetFileSheet(file, out errorMsg);

                    if (errorMsg != string.Empty)
                    {
                        return Json(new { Result = false, Msg = errorMsg }, JsonRequestBehavior.AllowGet);
                    }

                    IRow headerRow = sheet.GetRow(1);//第一行为标题行
                    int rowCount = sheet.LastRowNum;

                    string value = string.Empty;
                    OnSaleEntity cus = new OnSaleEntity();
                    List<OnSaleList> salesList = new List<OnSaleList>();
                    for (int i = (sheet.FirstRowNum + 2); i <= rowCount; i++)
                    {
                        IRow row = sheet.GetRow(i);

                        OnSaleList sales = new OnSaleList();
                        if (row != null)
                        {
                            for (int j = 0; j < headerRow.Cells.Count; j++)
                            {
                                if (row.GetCell(j) != null)
                                {
                                    value = GetCellValue(row.GetCell(j)).Trim();
                                }
                                sales = GetSalesData(sales, value, j);
                                value = string.Empty;
                            }
                            salesList.Add(sales);
                        }
                    }
                    cus.OnSaleList = salesList;
                    string jsonStr = JsonConvert.SerializeObject(cus);
                    return Json(new { Result = true, Msg = "导入成功", Data = jsonStr }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = false, Msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        private OnSaleList GetSalesData(OnSaleList sales, string value, int index)
        {
            int i = 0;
            if (index == i++) //门店物料编号
            {
                sales.AppItemId = value;
            }
            if (index == i++) //上架名称
            {
                sales.OnSaleName = value;
            }
            if (index == i++) //上架单位
            {
                sales.OnSaleUnit = value;
            }
            if (index == i++) //上架类别
            {
                sales.OnSaleType = value;
            }
            if (index == i++) //上架价格
            {
                sales.OnSalePrice = value;
            }
            if (index == i++) //是否上架
            {
                if (value == "是")
                {
                    sales.IsOnSale = "true";
                }
                else if (value == "否")
                {
                    sales.IsOnSale = "false";
                }
                else
                {
                    sales.IsOnSale = value;
                }
            }
            if (index == i++) //备注
            {
                sales.Remark = value;
            }

            return sales;
        }
        #endregion

        #region 获取Excel中Sheet1内容
        private ISheet GetFileSheet(HttpPostedFileBase file, out string errorMsg)
        {
            ISheet sheet = null;
            errorMsg = string.Empty;

            string[] fileAry = file.FileName.Split('.');
            if (fileAry.Length >= 2)
            {
                Stream inputStream = file.InputStream;

                string ext = fileAry[fileAry.Length - 1].ToUpper();
                if (ext == "XLS")
                {
                    HSSFWorkbook hssfworkbook = new HSSFWorkbook(inputStream);
                    sheet = hssfworkbook.GetSheetAt(0);
                }
                else if (ext == "XLSX")
                {
                    XSSFWorkbook hssfworkbook = new XSSFWorkbook(inputStream);
                    sheet = hssfworkbook.GetSheetAt(0);
                }
                else
                {
                    errorMsg = "文件格式错误，只能为xls或xlsx后缀";
                }
            }
            else
            {
                errorMsg = "请选择要上传的Excel文件";
            }

            return sheet;
        }
        #endregion

        #region 根据Excel列类型获取列的值
        /// <summary>
        /// 根据Excel列类型获取列的值
        /// </summary>
        /// <param name="cell">Excel列</param>
        /// <returns></returns>
        private static string GetCellValue(ICell cell)
        {
            if (cell == null)
                return string.Empty;
            switch (cell.CellType)
            {
                case CellType.Blank:
                    return string.Empty;
                case CellType.Boolean:
                    return cell.BooleanCellValue.ToString();
                case CellType.Error:
                    return cell.ErrorCellValue.ToString();
                case CellType.Numeric:
                case CellType.Unknown:
                default:
                    return cell.ToString();//This is a trick to get the correct value of the cell. NumericCellValue will return a numeric value no matter the cell value is a date or a number
                case CellType.String:
                    return cell.StringCellValue;
                case CellType.Formula:
                    try
                    {
                        HSSFFormulaEvaluator e = new HSSFFormulaEvaluator(cell.Sheet.Workbook);
                        e.EvaluateInCell(cell);
                        return cell.ToString();
                    }
                    catch
                    {
                        return cell.NumericCellValue.ToString();
                    }
            }
        }
        #endregion
    }
}
