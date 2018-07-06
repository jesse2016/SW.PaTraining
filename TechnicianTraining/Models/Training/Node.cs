using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Training.Models
{
    public class Node
    {
        /// <summary>
        /// 主键id
        /// </summary>
        [Key]
        public int nodeId { get; set; }

        /// <summary>
        /// 父节点ID
        /// </summary>
        public int parentId { get; set; }

        /// <summary>
        /// 节点名称
        /// </summary>
        public string nodeName { get; set; }

        /// <summary>
        /// 图片或视频地址
        /// </summary>
        public string url { get; set; }

        /// <summary>
        /// 是否是文章标题(1:是；0:否)
        /// </summary>
        public int isArticle { get; set; }

        /// <summary>
        /// 是否是视频文章(1:是；0:否)
        /// </summary>
        public int isVideo { get; set; }

        /// <summary>
        /// 是否在C端展示
        /// </summary>
        public int isApc { set; get; }

        /// <summary>
        /// 文章是否已发布(1:已发布；0:未发布)
        /// </summary>
        public int isUsable { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public string createPerson { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public DateTime createDate { get; set; }
    }
}