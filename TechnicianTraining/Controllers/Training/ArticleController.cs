using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using TechnicianTraining.Common;
using TechnicianTraining.DAL;
using TechnicianTraining.Training.Entity;
using TechnicianTraining.Training.Models;
using TechnicianTrainingSystem.Common;
using TechnicianTrainingSystem.Controllers.Common;
using TechnicianTrainingSystem.Entity.Training.view;
using TechnicianTrainingSystem.Entity.Training.View;

namespace TechnicianTraining.Training.Controllers
{
    public class ArticleController : TrainingController
    {
        private TtsDbContext db = new TtsDbContext();

        #region 视图

        public ActionResult list(string nodeId)
        {
            return View();
        }

        public ActionResult list_null()
        {
            return View();
        }

        public ActionResult add()
        {
            return View();
        }

        public ActionResult modify()
        {
            return View();
        }

        public ActionResult view()
        {
            return View();
        }

        public ActionResult article()
        {
            return View();
        }

        #endregion

        #region 根据父id查询文章列表
        public JsonResult GetArticleListByPId(string parentId, string pageSize, string currentPage)
        {
            string sql = Sql.GetArticlesCountByPId(parentId);
            int _articleCount = db.Database.SqlQuery<int>(sql).First();

            int _pageCount = 0;
            int _pageSize = int.Parse(pageSize);
            int _currentPage = int.Parse(currentPage);
            int _pageIndex = _currentPage - 1;
            int _parentId = int.Parse(parentId);

            _pageCount = _articleCount / _pageSize;
            if (_articleCount % _pageSize > 0)
            {
                _pageCount += 1;
            }

            if (_pageCount < _currentPage && _pageCount > 0)
            {
                _pageIndex = _pageCount - 1;
            }
            sql = Sql.GetArticlesByParentId(_pageSize, _pageIndex, _parentId);
            List<Node> nodeList = db.Database.SqlQuery<Node>(sql).ToList<Node>();
            string jsonstr = JsonConvert.SerializeObject(nodeList);

            return Json(new { ArticleCount = _articleCount, PageCount = _pageCount, CurrentPage = _pageIndex + 1, Data = jsonstr }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 根据节点id批量删除文章
        public JsonResult DeleteArticleByNodeId(string data)
        {
             bool result = false;
             string message = "";
             string[] nodeIdAty = data.TrimEnd('|').Split('|');
             using (TransactionScope scope = new TransactionScope())
             {
                 try
                 {
                     foreach (string nodeId in nodeIdAty)
                     {
                         Node dbNode = db.Nodes.Find(int.Parse(nodeId));

                         List<ArticleDetail> detailList = db.ArticleDetail.Where(p => p.nodeId == dbNode.nodeId).ToList();
                         foreach (ArticleDetail detail in detailList)
                         {
                             if (detail.detailType == "image" || detail.detailType == "video")
                             {
                                 Util.DeleteBlog(detail.detailContent);//删除文件
                             }
                             db.ArticleDetail.Remove(detail);
                             db.SaveChanges();
                         }

                         db.Nodes.Remove(dbNode);
                         db.SaveChanges();
                     }
                     scope.Complete();

                     result = true;
                     message = "删除成功";
                 }
                 catch (Exception ex)
                 {
                     message = ex.Message;
                 }
                 finally
                 {
                     scope.Dispose();
                 }
             }
             return Json(new { Result = result, Msg = message }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 根据节点父id批量删除文章
        public JsonResult DeleteArticleByParentId(string data)
        {
            bool result = false;
            string message = "";
            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    int parentId = int.Parse(data);
                    string sql = Sql.GetNodeIdById(parentId);
                    List<TreeNode> delNodeList = db.Database.SqlQuery<TreeNode>(sql).Where(p => p.nodeId != parentId).ToList<TreeNode>();

                    foreach (TreeNode tnode in delNodeList)
                    {
                        Node dbNode = db.Nodes.Find(tnode.nodeId);

                        List<ArticleDetail> detailList = db.ArticleDetail.Where(p => p.nodeId == dbNode.nodeId).ToList();
                        foreach (ArticleDetail detail in detailList)
                        {
                            if (detail.detailType == "image" || detail.detailType == "video")
                            {
                                Util.DeleteBlog(detail.detailContent);//删除文件
                            }
                            db.ArticleDetail.Remove(detail);
                            db.SaveChanges();
                        }

                        db.Nodes.Remove(dbNode);
                        db.SaveChanges();
                    }
                    scope.Complete();

                    result = true;
                    message = "删除成功";
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
                finally
                {
                    scope.Dispose();
                }
            }
            return Json(new { Result = result, Msg = message }, JsonRequestBehavior.AllowGet);
        }  
        #endregion

        #region 根据节点id批量删除文章
        public JsonResult IdentifyArticleByNodeId(string data)
        {
            bool result = false;
            string message = "";
            string[] nodeIdAty = data.TrimEnd('|').Split('|');
            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    foreach (string nodeId in nodeIdAty)
                    {
                        Node dbNode = db.Nodes.Find(int.Parse(nodeId));

                        if (dbNode.isApc == 0)
                        {
                            dbNode.isApc = 1;
                        }
                        else
                        {
                            dbNode.isApc = 0;
                        }

                        db.SaveChanges();
                    }
                    scope.Complete();

                    result = true;
                    message = "标识成功";
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
                finally
                {
                    scope.Dispose();
                }
            }
            return Json(new { Result = result, Msg = message }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 添加新文章
        [HttpPost]
        public JsonResult AddNewArticle()
        {
            bool result = false;
            string msg = "";
            int nodeId = 0;

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    string parentId = Request["parentId"];
                    string data = Request["data"];
                    int _parentId = int.Parse(parentId);
                    int _orders = 1;

                    ViewArticle<ViewArticleDetail> article = DataJsonSerializer<ViewArticle<ViewArticleDetail>>.JsonToEntity(data);
                    List<string> decodeList = new List<string>();
                    
                    var imageList = article.detailList.Where(p => p.Type == "image");
                    var videoList = article.detailList.Where(p => p.Type == "video");
                    foreach (ViewArticleDetail detail in article.detailList)
                    {
                        string detailType = detail.Type;
                        string detailContent = HttpUtility.UrlDecode(detail.Content);

                        //添加主标题
                        if (detailType == "title")
                        {
                            Node dbNode = new Node();

                            dbNode.parentId = _parentId;
                            dbNode.nodeName = detailContent;
                            if (imageList.Count() > 0)
                            {
                                dbNode.url = HttpUtility.UrlDecode(imageList.ToList()[0].Content);
                            }
                            else
                            {
                                dbNode.url = "";//默认图片
                            }
                            dbNode.isArticle = 1;
                            if (videoList.Count() > 0)
                            {
                                dbNode.isVideo = 1;
                            }
                            if (article.detailList.Count > 1)
                            {
                                dbNode.isUsable = 1;
                            }
                            else
                            {
                                dbNode.isUsable = 0;
                            }
                            dbNode.createPerson = t_userName;
                            dbNode.createDate = DateTime.Now;

                            db.Nodes.Add(dbNode);
                            db.SaveChanges();

                            nodeId = dbNode.nodeId; //数据库生成的Id
                        }
                        else
                        {
                            ArticleDetail details = new ArticleDetail();

                            details.nodeId = nodeId;
                            details.detailType = detailType;
                            details.detailContent = detailContent;
                            details.souceFileName = HttpUtility.UrlDecode(detail.sourceFileName);
                            details.orders = _orders;
                            details.lastUpdateDate = DateTime.Now;

                            db.ArticleDetail.Add(details);
                            db.SaveChanges();

                            _orders++;
                        }
                    }
                    scope.Complete();

                    result = true;
                    msg = "保存成功";
                }
                catch (Exception ex)
                {
                    msg = ex.Message;
                }
                finally
                {
                    scope.Dispose();
                }
            }

            return Json(new { Result = result, Msg = msg, nodeId = nodeId }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 修改文章
        [HttpPost]
        public JsonResult SaveArticle()
        {
            bool result = false;
            string msg = "";

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    string data = Request["data"];
                    string deleteId = Request["deleteId"];

                    int nodeId = 0;
                    int _orders = 1;

                    ViewArticle<ViewModifyArticle> article = DataJsonSerializer<ViewArticle<ViewModifyArticle>>.JsonToEntity(data);
                    List<string> decodeList = new List<string>();
                    
                    var imageList = article.detailList.Where(p => p.Type == "image");
                    var videoList = article.detailList.Where(p => p.Type == "video");
                    foreach (ViewModifyArticle detail in article.detailList)
                    {
                        string detailId = detail.detailId;
                        string detailType = detail.Type;
                        string detailContent = HttpUtility.UrlDecode(detail.Content);

                        //添加主标题
                        if (detailType == "title")
                        {
                            Node dbNode = db.Nodes.Find(int.Parse(detail.detailId));

                            nodeId = int.Parse(detailId);
                            dbNode.nodeName = detailContent;
                            if (imageList.Count() > 0)
                            {
                                dbNode.url = HttpUtility.UrlDecode(imageList.ToList()[0].Content);
                            }
                            else
                            {
                                dbNode.url = "";//默认图片
                            }
                            if (videoList.Count() > 0)
                            {
                                dbNode.isVideo = 1;
                            }
                            else
                            {
                                dbNode.isVideo = 0;
                            }
                            if (article.detailList.Count > 1)
                            {
                                dbNode.isUsable = 1;
                            }
                            else
                            {
                                dbNode.isUsable = 0;
                            }

                            db.SaveChanges();
                        }
                        else
                        {
                            if (detail.detailId == "")
                            {
                                ArticleDetail details = new ArticleDetail();

                                details.nodeId = nodeId;
                                details.detailType = detailType;
                                details.detailContent = detailContent;
                                details.souceFileName = HttpUtility.UrlDecode(detail.sourceFileName);
                                details.orders = _orders;
                                details.lastUpdateDate = DateTime.Now;

                                db.ArticleDetail.Add(details);
                            }
                            else
                            {
                                ArticleDetail details = db.ArticleDetail.Find(int.Parse(detail.detailId));

                                if ((details.detailType == "image" || details.detailType == "video") && details.detailContent != detailContent)
                                {
                                    Util.DeleteBlog(details.detailContent);//新文件与原文件不是同一文件，则删除旧文件
                                }

                                details.detailContent = detailContent;
                                details.souceFileName = HttpUtility.UrlDecode(detail.sourceFileName);
                                details.orders = _orders;
                                details.lastUpdateDate = DateTime.Now;
                            }
                            db.SaveChanges();

                            _orders++;
                        }
                    }

                    if (deleteId != "")
                    {
                        string[] delIdAry = deleteId.TrimEnd('|').Split('|');
                        foreach (string detailId in delIdAry)
                        {
                            ArticleDetail detail = db.ArticleDetail.Find(int.Parse(detailId));

                            if (detail.detailType == "image" || detail.detailType == "video")
                            {
                                Util.DeleteBlog(detail.detailContent);//删除文件
                            }

                            db.ArticleDetail.Remove(detail);
                            db.SaveChanges();
                        }
                    }

                    scope.Complete();

                    result = true;
                    msg = "保存成功";
                }
                catch (Exception ex)
                {
                    msg = ex.Message;
                }
                finally
                {
                    scope.Dispose();
                }
            }

            return Json(new { Result = result, Msg = msg }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 上传文件
        [HttpPost]
        public ActionResult Upload(string uploadId, int total, int index, string fileName)
        {
            string rootPath = Server.MapPath("~/") + "\\Upload";
            var helper = new UploadHelper(rootPath);
            var result = helper.Upload(uploadId, total, index, fileName, Request.Files[0]);

            if (result.FileInfo != null)
            {
                string filePath = Path.Combine(rootPath, result.FileInfo.FilePath);

                try
                {
                    //上传的指定文件服务器
                    Blob.BlobInitialize();
                    CloudBlobClient blobClient = Blob.blobClient;
                    string containerName = ConfigurationManager.AppSettings["AzureBlobStorageContainerName"];
                    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
                    CloudBlockBlob blockBlob = container.GetBlockBlobReference(result.FileInfo.uploadFileName);

                    using (var fileStream = System.IO.File.OpenRead(filePath))
                    {
                        blockBlob.UploadFromStream(fileStream);
                    }

                    result.FileInfo.Url = Util.GetBlobUrl(result.FileInfo.uploadFileName);
                }
                catch
                {
                }
                finally
                {
                    //删除原文件
                    System.IO.File.Delete(filePath);
                }
            }
            return Json(result);
        }

        
        #endregion

        #region 根据文章id查询文章
        public JsonResult GetArticleByNodeId(string nodeId)
        {
            string errMsg = "";
            Node node = null;
            List<ViewDetailEntity> detailList = null;

            int _nodeId = 0;
            if (int.TryParse(nodeId, out _nodeId))
            {
                try
                {
                    node = db.Nodes.Find(_nodeId);
                    if (node != null)
                    {
                        List<ArticleDetail> dataList = db.ArticleDetail.Where(p => p.nodeId == _nodeId).OrderBy(p => p.orders).ToList();

                        detailList = new List<ViewDetailEntity>();

                        foreach (ArticleDetail detail in dataList)
                        {
                            ViewDetailEntity entity = new ViewDetailEntity();

                            entity.detailId = detail.detailId;
                            entity.nodeId = detail.nodeId;
                            entity.detailType = detail.detailType;
                            entity.detailContent = detail.detailContent;
                            entity.souceFileName = detail.souceFileName;
                            if (entity.detailType == "image" || entity.detailType == "video")
                            {
                                entity.Url = Util.GetBlobUrl(entity.detailContent);
                            }

                            detailList.Add(entity);
                        }
                    }
                }
                catch (Exception ex)
                {
                    errMsg = ex.Message;
                }
            }

            return Json(new { Msg = errMsg, Node = JsonConvert.SerializeObject(node), Detail = JsonConvert.SerializeObject(detailList) }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 移动文章到新节点
        public JsonResult MoveTo()
        {
            bool result = false;
            string message = "";

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    string targetNodeId = Request["targetNodeId"];
                    string parentId = Request["parentId"];
                    string selIdStr = Request["selIdStr"];

                    if (selIdStr == "")
                    {
                        string sql = Sql.UpdateArticlePIdByPId(parentId,targetNodeId);
                        int count = db.Database.ExecuteSqlCommand(sql);
                        if (count > 0)
                        {
                            db.SaveChanges();
                        }
                    }
                    else
                    {
                        string nodeIdstr = selIdStr.TrimEnd('|').Replace('|',',');
                        string sql = Sql.UpdateArticlePIdByNodeId(nodeIdstr, targetNodeId);
                        int count = db.Database.ExecuteSqlCommand(sql);
                        if (count > 0)
                        {
                            db.SaveChanges();
                        }
                    }
                    scope.Complete();

                    result = true;
                    message = "移动成功";
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
                finally
                {
                    scope.Dispose();
                }
            }
            return Json(new { Result = result, Msg = message }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 查询父节点名称
        public JsonResult GetNodeName(string nodeId)
        {
            Node dbNode = db.Nodes.Find(int.Parse(nodeId));
            return Json(new { Name = dbNode.nodeName }, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
