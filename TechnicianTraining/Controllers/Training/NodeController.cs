using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using TechnicianTraining.Common;
using TechnicianTraining.DAL;
using TechnicianTraining.Training.Entity;
using TechnicianTraining.Training.Models;
using TechnicianTrainingSystem.Entity.Training;

namespace TechnicianTraining.Training.Controllers
{
    public class NodeController : ApiController
    {
        private TtsDbContext db = new TtsDbContext();

        #region 根据父id获取节点列表
        /// <summary>
        /// 根据父id获取节点列表
        /// </summary>
        /// <param name="parentId">父id</param>
        /// <returns>节点列表</returns>
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [System.Web.Http.HttpGet]
        public DataEntity<List<NodeInfo>> GetNodeListByParentId(int parentId, int isApp = 2)
        {
            DataEntity<List<NodeInfo>> data = new DataEntity<List<NodeInfo>>();
            List<NodeInfo> infoList = new List<NodeInfo>();
            try
            {
                IQueryable<Node> nodeObj = db.Nodes.Where(p => p.parentId == parentId && p.isUsable == 1);
                if (isApp == 0 || isApp == 1)
                {
                    nodeObj = nodeObj.Where(p => p.isApc == isApp);
                }

                List<Node> nodeList = nodeObj.ToList();
                if (nodeList == null)
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }

                foreach (Node node in nodeList)
                {
                    NodeInfo info = new NodeInfo();

                    info.nodeId = node.nodeId;
                    info.nodeName = node.nodeName;
                    if (!string.IsNullOrWhiteSpace(node.url))
                    {
                        info.url = Util.GetBlobUrl(node.url);
                    }
                    else
                    {
                        info.url = "";
                    }

                    infoList.Add(info);
                }

                data.StatusCode = 200;
                data.ErrorMsg = "";
                data.Data = infoList;
            }
            catch (Exception ex)
            {
                data.StatusCode = 500;
                data.ErrorMsg = ex.Message;
                data.Data = null;
            }

            return data;
        }
        #endregion
    }
}
