using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace TechnicianTrainingSystem.Common
{
    public class Blob
    {
        private static CloudStorageAccount _storageAccount = null;
        private static CloudBlobClient _blobClient = null;
        private static CloudBlobContainer _container_thumb = null;

        public static CloudBlobClient blobClient
        {
            get { return _blobClient; }
            set { _blobClient = value; }
        }
        public static void BlobInitialize()
        {
            string azureBlobStorageConnectionString = ConfigurationManager.AppSettings["AzureBlobStorage"];
            string azureBlobStorageContainerName = ConfigurationManager.AppSettings["AzureBlobStorageContainerName"];
            _storageAccount = CloudStorageAccount.Parse(azureBlobStorageConnectionString);
            _blobClient = _storageAccount.CreateCloudBlobClient();
            BlobContainerPermissions containerPermissions = new BlobContainerPermissions();
            containerPermissions.PublicAccess = BlobContainerPublicAccessType.Off; //BlobContainerPublicAccessType.Blob;
            _container_thumb = _blobClient.GetContainerReference(azureBlobStorageContainerName);
            _container_thumb.CreateIfNotExists();
            _container_thumb.SetPermissions(containerPermissions);
        }

        public static void BlobInitializeCredential()
        {
            string azureBlobStorageConnectionString = ConfigurationManager.AppSettings["AzureBlobStorage"];
            string azureBlobStorageContainerName = ConfigurationManager.AppSettings["AzureBlobStorageContainerName"];
            string accountKey = ConfigurationManager.AppSettings["AccountKey"];
            string accountName = ConfigurationManager.AppSettings["AccountName"];
            var credentials = new StorageCredentials(accountName, accountKey);
            var account = new CloudStorageAccount(credentials, true);
            _blobClient = account.CreateCloudBlobClient();
            _container_thumb = _blobClient.GetContainerReference("azureBlobStorageContainerName");

        }
    }
}