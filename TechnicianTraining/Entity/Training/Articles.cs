using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Training.Entity
{
    public class Articles
    {
        public string title { set; get; }

        public string createPerson { set; get; }

        public DateTime createDate { set; get; }

        public List<ArticleInfo> detailList { set; get; }
    }
}