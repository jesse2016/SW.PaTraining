using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTrainingSystem.Entity.Training.View
{
    public class ViewArticle<T>
    {
        public List<T> detailList { set; get; }
    }
}