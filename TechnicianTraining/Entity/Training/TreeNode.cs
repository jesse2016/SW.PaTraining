﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Training.Entity
{
    public class TreeNode
    {
        /// <summary>
        /// 节点ID
        /// </summary>
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
        /// 节点层级
        /// </summary>
        public int level { set; get; }

        /// <summary>
        /// 子节点数
        /// </summary>
        public int nodeNo { set; get; }
    }
}