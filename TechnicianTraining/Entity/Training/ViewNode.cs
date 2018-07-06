using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Training.Entity
{
    public class ViewNode
    {
        /// <summary>
        /// 节点ID
        /// </summary>
        public string nodeId { get; set; }

        /// <summary>
        /// 父节点ID
        /// </summary>
        public string parentId { get; set; }

        /// <summary>
        /// 节点名称
        /// </summary>
        public string nodeName { get; set; }

        /// <summary>
        /// 是否有nodeId
        /// </summary>
        public bool IsNodeId { set; get; }

        /// <summary>
        /// 是否有父Id
        /// </summary>
        public bool IsParentId { set; get; }
    }
}