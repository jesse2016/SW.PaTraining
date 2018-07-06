using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTrainingSystem.Entity.Training
{
    public class DataEntity<T>
    {
        public int StatusCode { set; get; }

        public string ErrorMsg { set; get; }

        public T Data { set; get; }
    }
}