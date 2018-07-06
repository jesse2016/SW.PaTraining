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
    public class ArticleDetailController : ApiController
    {
        private TtsDbContext db = new TtsDbContext();

        #region 根据节点id获取文章详细信息
        /// <summary>
        /// 根据节点id获取文章详细信息
        /// </summary>
        /// <param name="nodeId">节点id</param>
        /// <returns>文章详细内容</returns>
        public DataEntity<Articles> GetDatailByNodeId(int nodeId)
        {
            DataEntity<Articles> data = new DataEntity<Articles>();
            Articles art = new Articles();           

            try
            {
                List<ArticleDetail> detailList = db.ArticleDetail.Where(p => p.nodeId == nodeId).OrderBy(p => p.orders).ToList();
                if (detailList == null)
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }

                Node node = db.Nodes.Find(nodeId);

                List<ArticleInfo> infoList = new List<ArticleInfo>();

                foreach (ArticleDetail ad in detailList)
                {
                    ArticleInfo info = new ArticleInfo();

                    info.detailType = ad.detailType;

                    if (ad.detailType == "image" || ad.detailType == "video")
                    {
                        info.detailContent = Util.GetBlobUrl(ad.detailContent);
                    }
                    else
                    {
                        info.detailContent = ad.detailContent;
                    }

                    infoList.Add(info);
                }

                art.title = node.nodeName;
                art.createPerson = node.createPerson;
                art.createDate = node.createDate;
                art.detailList = infoList;

                data.StatusCode = 200;
                data.ErrorMsg = "";
                data.Data = art;
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
