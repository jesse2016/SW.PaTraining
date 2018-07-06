using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTrainingSystem.Entity.Training.view
{
    public class ViewModifyArticle
    {
        public string detailId { set; get; }

        public string Type { set; get; }

        public string Content { set; get; }

        public string uploadFileName { set; get; }

        public string sourceFileName { set; get; }
    }
}