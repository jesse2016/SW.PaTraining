using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using TechnicianTraining.Common;
using TechnicianTraining.DAL;
using TechnicianTraining.Training.Entity;
using TechnicianTraining.Training.Models;
using TechnicianTrainingSystem.Controllers.Common;
using TechnicianTrainingSystem.Entity.Training.View;

namespace TechnicianTraining.Training.Controllers
{
    public class HomeController : TrainingController
    {
        private TtsDbContext db = new TtsDbContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult EditNode()
        {
            return View();
        }

        public ActionResult Tree()
        {
            return View("~/Views/Shared/_Tree_Layout.cshtml");
        }

        #region 加载左侧目录树
        public JsonResult LoadTree()
        {
            string sql = Sql.GetNodesByNodeId(1);
            List<TreeNode> nodeList = db.Database.SqlQuery<TreeNode>(sql).ToList<TreeNode>();           
            List<zTree> treeList = Util.GetJsonTreeData(nodeList, 0);

            string jsonstr = JsonConvert.SerializeObject(treeList);
            return Json(new { Data = jsonstr  }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 查询文章总数
        public JsonResult GetArticleCount()
        {
            string sql = Sql.GetArticlesCount();
            var articleNo = db.Database.SqlQuery<int>(sql).First();
            return Json(new { Num = articleNo }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 根据节点id查询文章总数
        public JsonResult GetArticleNoByNodeId(string nodeId)
        {
            string sql = Sql.GetArticlesCountByNodeId(nodeId);
            var articleNo = db.Database.SqlQuery<int>(sql).First();
            return Json(new { Num = articleNo }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 保存目录树
        /// <summary>
        /// 保存目录树
        /// </summary>
        /// <param name="data">当前目录结构</param>
        /// <param name="delNode">被删除的节点</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SaveTree()
        {
            string result = "";
            try
            {
                string data = Request["data"];
                string delNode = Request["delNode"];

                ViewArticle<ViewNode> nodes = DataJsonSerializer<ViewArticle<ViewNode>>.JsonToEntity(data);
                result = SaveAllNode(nodes.detailList, delNode);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return Json(new { Data = result }, JsonRequestBehavior.AllowGet);
        }

        private string SaveAllNode(List<ViewNode> nodeList, string delNode)
        {
            string result = "";

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    //保存已存在的节点
                    List<ViewNode> oldNode = nodeList.Where(p => p.IsNodeId.Equals(true)).Where(p => p.IsParentId.Equals(true)).ToList();
                    foreach (ViewNode node in oldNode)
                    {
                        Node dbNode = db.Nodes.Find(int.Parse(node.nodeId));

                        dbNode.nodeName = node.nodeName;
                    }
                    db.SaveChanges();

                    //保存从已有节点下新增的节点
                    List<ViewNode> newRootNode = nodeList.Where(p => p.IsNodeId.Equals(false)).Where(p => p.IsParentId.Equals(true)).ToList();
                    foreach (ViewNode node in newRootNode)
                    {
                        Node dbNode = new Node();

                        dbNode.parentId = int.Parse(node.parentId);
                        dbNode.nodeName = node.nodeName;
                        dbNode.url = "";
                        dbNode.isArticle = 0;
                        dbNode.isUsable = 1;
                        dbNode.createPerson = t_userName;
                        dbNode.createDate = DateTime.Now;

                        db.Nodes.Add(dbNode);
                        db.SaveChanges();

                        string parentId = node.nodeId;//当前节点的nodeId，也是下个节点的父Id(前端生成)
                        int nodeId = dbNode.nodeId; //数据库生成的Id

                        //循环查找一次添加多级的节点
                        saveChildNode(nodeList, nodeId, parentId);
                    }

                    //删除已删掉的节点
                    if (!string.IsNullOrWhiteSpace(delNode))
                    {
                        string[] delNodeAry = delNode.TrimEnd('|').Split('|');
                        List<int> delIdList = new List<int>();
                        foreach (string nodeId in delNodeAry)
                        {
                            delIdList.Add(int.Parse(nodeId));
                        }
                        delIdList.Sort();// 升序排序

                        List<int> deletedIdList = new List<int>();
                        foreach (int nodeId in delIdList)
                        {
                            if (!deletedIdList.Contains(nodeId))
                            {
                                string sql = Sql.GetNodeIdById(nodeId);
                                List<TreeNode> delNodeList = db.Database.SqlQuery<TreeNode>(sql).ToList<TreeNode>();

                                foreach (TreeNode tnode in delNodeList)
                                {
                                    Node dbNode = db.Nodes.Find(tnode.nodeId);
                                    db.Nodes.Remove(dbNode);
                                    db.SaveChanges();

                                    deletedIdList.Add(tnode.nodeId);
                                }
                            }
                        }
                    }

                    scope.Complete();

                    result = "保存成功";
                }
                catch (Exception ex)
                {
                    result = ex.Message;
                }
                finally
                {
                    scope.Dispose();
                }  
            }
            return result;
        }

        private void saveChildNode(List<ViewNode> nodeList, int nodeId, string parentId)
        {
            List<ViewNode> vnodeList = nodeList.Where(p => p.parentId == parentId).ToList();
            foreach(ViewNode vnode in vnodeList)
            {
                Node cnode = new Node();

                cnode.parentId = nodeId;
                cnode.nodeName = vnode.nodeName;
                cnode.url = "";
                cnode.isArticle = 0;
                cnode.isUsable = 1;
                cnode.createPerson = t_userName;
                cnode.createDate = DateTime.Now;

                db.Nodes.Add(cnode);
                db.SaveChanges();

                //继续寻找子节点
                saveChildNode(nodeList, cnode.nodeId, vnode.nodeId);
            }
        }
        #endregion
    }
}
