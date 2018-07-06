using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Training.Entity
{
    public class ArticleInfo
    {
        /// <summary>
        /// 文章详细内容类型
        /// </summary>
        public string detailType { get; set; }

        /// <summary>
        /// 文章内容
        /// </summary>
        public string detailContent { get; set; }
    }
}