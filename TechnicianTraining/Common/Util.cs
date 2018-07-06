using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using TechnicianTraining.Training.Entity;
using TechnicianTrainingSystem.Common;

namespace TechnicianTraining.Common
{
    public class Util
    {
        #region 封装成ztree类
        /// <summary>
        /// 封装成ztree类
        /// </summary>
        /// <param name="listAll">全部数据list</param>
        /// <param name="parentid">根节点的id</param>
        /// <returns></returns>
        public static List<zTree> GetJsonTreeData(List<TreeNode> listAll, int parentid)
        {
            List<zTree> listTree = new List<zTree>();

            IEnumerable<TreeNode> list = listAll.Where(p => p.parentId == parentid);//使用linq查询，必须重复查询数据库，数据量小时适用
            if (list.Count() > 0)
            {
                zTree ztree = null;

                foreach (TreeNode item in list)
                {
                    ztree = new zTree();
                    ztree.id = item.nodeId;
                    ztree.pId = item.parentId;
                    ztree.name = item.nodeName;
                    ztree.level = item.level;
                    ztree.nodeNo = item.nodeNo;
                    List<zTree> listChildren = GetJsonTreeData(listAll, item.nodeId);
                    if (listChildren.Count > 0)
                    {
                        ztree.isParent = true;
                        ztree.children = listChildren;
                    }
                    else
                    {
                        ztree.isParent = false;
                        ztree.children = null;
                    }

                    listTree.Add(ztree);
                }
            }

            return listTree;
        }
        #endregion

        #region 获取文件URL地址
        public static string GetBlobUrl(string fileName)
        {
            string ip = GetIP();
            string containerName = ConfigurationManager.AppSettings["AzureBlobStorageContainerName"];
            string domain = ConfigurationManager.AppSettings["AzureBlobStorageDomain"];
            Blob.BlobInitializeCredential();
            CloudBlobClient blobClient = Blob.blobClient;
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            var blob = container.GetBlockBlobReference(fileName);

            var sas = blob.GetSharedAccessSignature(new SharedAccessBlobPolicy()
            {
                Permissions = SharedAccessBlobPermissions.Read,
                SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(30),

            }, null, null, null, new IPAddressOrRange(ip)
            );

            return domain + "/" + containerName + "/" + fileName + sas;
        }
        #endregion

        #region 获取web客户端ip
        private static string GetIP()
        {
            string ip = string.Empty;
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.ServerVariables["HTTP_VIA"]))
                ip = Convert.ToString(System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"]);
            if (string.IsNullOrEmpty(ip))
                ip = Convert.ToString(System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]);
            if (ip == "::1")
            {
                ip = "127.0.0.1";
            }
            return ip;
        }
        #endregion

        #region 删除文件
        public static void DeleteBlog(string FileName)
        {
            try
            {
                Blob.BlobInitialize();
                CloudBlobClient blobClient = Blob.blobClient;
                string containerName = ConfigurationManager.AppSettings["AzureBlobStorageContainerName"];
                CloudBlobContainer container = blobClient.GetContainerReference(containerName);

                CloudBlockBlob blockBlob = container.GetBlockBlobReference(FileName);
                blockBlob.Delete();
            }
            catch
            {
            }
        }
        #endregion
    }
}