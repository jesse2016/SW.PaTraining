using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Training.Entity
{
    public class NodeInfo
    {
        public int nodeId { get; set; }

        /// <summary>
        /// 节点名称
        /// </summary>
        public string nodeName { get; set; }

        /// <summary>
        /// 图片或视频地址
        /// </summary>
        public string url { get; set; }
    }
}