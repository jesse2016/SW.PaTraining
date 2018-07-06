using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.DAL
{
    public class Sql
    {
        /// <summary>
        /// 根据节点id递归查询子节点
        /// </summary>
        /// <param name="nodeId"></param>
        /// <returns></returns>
        public static string GetNodesByNodeId(int nodeId)
        {
            string sql = @"with cte_child(nodeId, parentId, nodeName,isArticle,level) 
                            as 
                            ( 
                                select nodeId, parentId, nodeName, isArticle,0 as level
                                from Nodes n
                                where nodeId = {0}
                                union all 
                                select a.nodeId, a.parentId, a.nodeName, a.isArticle, b.level+1
                                from Nodes a 
                                inner join  
                                cte_child b 
                                on a.parentId=b.nodeId 
                            ) 
                            select cc.nodeId,cc.nodeName, cc.parentId, cc.isArticle, cc.level, Isnull(c.nodeNo, 0) nodeNo
                            from cte_child cc
                            left join
                            (select c.nodeId,c.nodeName, c.parentId, c.level,COUNT(*) nodeNo 
                             from cte_child c inner join Nodes n 
                             on c.nodeId = n.parentId and n.isArticle = 1
                             group by c.nodeId,c.nodeName, c.parentId, c.level) c
                            on cc.nodeId = c.nodeId
                            where cc.isArticle = 0";
            return string.Format(sql, nodeId);
        }

        /// <summary>
        /// 查询文章总数
        /// </summary>
        /// <returns></returns>
        public static string GetArticlesCount()
        {
            return "select count(*) from Nodes n where n.isArticle = 1";
        }

        /// <summary>
        /// 根据节点id递归查询子节点
        /// </summary>
        /// <param name="nodeId"></param>
        /// <returns></returns>
        public static string GetNodeIdById(int nodeId)
        {
            string sql = @"with cte_child(nodeId, parentId, nodeName,isArticle,level) 
                            as 
                            ( 
                                select nodeId, parentId, nodeName, isArticle,0 as level
                                from Nodes n
                                where nodeId = {0}
                                union all 
                                select a.nodeId, a.parentId, a.nodeName, a.isArticle, b.level+1
                                from Nodes a 
                                inner join  
                                cte_child b 
                                on a.parentId=b.nodeId 
                            ) 
                            select cc.nodeId,cc.nodeName, cc.parentId, cc.isArticle, cc.level
                            from cte_child cc";
            return string.Format(sql, nodeId);
        }

        /// <summary>
        /// 根据父id查询文章总数
        /// </summary>
        /// <param name="parentId">父id</param>
        /// <returns></returns>
        public static string GetArticlesCountByPId(string parentId)
        {
            string sql = @"select count(n.nodeId)
                            from Nodes n 
                            where n.parentId = {0} 
                            and n.isArticle = 1";
            return string.Format(sql, parentId);
        }

        /// <summary>
        /// 将文章全部移动到新节点下
        /// </summary>
        /// <param name="parentId">父id</param>
        /// <returns></returns>
        public static string UpdateArticlePIdByPId(string parentId, string targetId)
        {
            string sql = "update Nodes set parentId = {1} where parentId = {0} and isArticle = 1";
            return string.Format(sql, parentId, targetId);
        }

        /// <summary>
        /// 将文章移动到新节点下
        /// </summary>
        /// <param name="parentId">父id</param>
        /// <returns></returns>
        public static string UpdateArticlePIdByNodeId(string nodeIdstr, string targetId)
        {
            string sql = "update Nodes set parentId = {1} where nodeId in ({0})";
            return string.Format(sql, nodeIdstr, targetId);
        }

        /// <summary>
        /// 根据父id分页查询文章列表
        /// </summary>
        /// <param name="pageSize">分页大小</param>
        /// <param name="pageIndex">当前页数-1</param>
        /// <param name="parentId">父id</param>
        /// <returns></returns>
        public static string GetArticlesByParentId(int pageSize, int pageIndex ,int parentId)
        {
            string sql = @"select top {0} * 
                            from Nodes n 
                            where n.parentId = {2} 
                            and n.isArticle = 1 
                            and n.nodeId not in (select top ({0}*{1}) t.nodeId 
                                                 from Nodes t 
                                                 where t.parentId = {2} 
                                                 and t.isArticle = 1)";
            return string.Format(sql, pageSize, pageIndex, parentId);
        }

        /// <summary>
        /// 根据父id查询文章总数
        /// </summary>
        /// <param name="parentId">父id</param>
        /// <returns></returns>
        public static string GetArticlesCountByNodeId(string nodeId)
        {
            string sql = @"with cte_child(nodeId,isArticle) 
                            as 
                            ( 
                                select nodeId, isArticle
                                from Nodes n
                                where nodeId = {0}
                                union all 
                                select a.nodeId, a.isArticle
                                from Nodes a 
                                inner join  
                                cte_child b 
                                on a.parentId=b.nodeId 
                            ) 
                            select count(c.nodeId)
                            from cte_child c
                            where c.isArticle = 1";
            return string.Format(sql, nodeId);
        }
    }
}