using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Training.Models
{
    public class ArticleDetail
    {
        /// <summary>
        /// 主键id
        /// </summary>
        [Key]
        public int detailId { get; set; }

        /// <summary>
        /// 节点ID
        /// </summary>
        public int nodeId { get; set; }

        /// <summary>
        /// 文章详细内容类型
        /// </summary>
        public string detailType { get; set; }

        /// <summary>
        /// 文章内容
        /// </summary>
        public string detailContent { get; set; }

        /// <summary>
        /// 图片/视频原文件名称
        /// </summary>
        public string souceFileName { set; get; }

        /// <summary>
        /// 顺序
        /// </summary>
        public int orders { get; set; }

        /// <summary>
        /// 最后更新日期
        /// </summary>
        public DateTime lastUpdateDate { get; set; }
    }
}