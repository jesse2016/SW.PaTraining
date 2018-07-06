using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace TechnicianTraining.Filters
{
    public class CheckTyreFilter
    {


        public Dictionary<string, string> Params { get; set; }
        public Dictionary<string, string> Headers { get; set; }

        public CheckTyreFilter()
        {
            this.Params = new Dictionary<string, string>();
            this.Headers = new Dictionary<string, string>();
        }

        private string GetXFormParameter()
        {
            if (null == this.Params || this.Params.Count == 0)
                return "";
            StringBuilder queryString = new StringBuilder();
            foreach (KeyValuePair<string, string> param in this.Params)
                queryString.AppendFormat("{0}={1}&", param.Key, param.Value);
            return queryString.ToString().TrimEnd('&');
        }


        public T GetResponseResultV2<T>(string requestUrl, object jsonData)
        {

            WebRequest request = WebRequest.Create(requestUrl);
            request.ContentType = (jsonData == null) ? "application/x-www-form-urlencoded" : "application/json";
            request.Method = "POST";
            if (Headers != null && Headers.Count > 0)
            {
                foreach (KeyValuePair<string, string> header in Headers)
                    request.Headers.Add(header.Key, header.Value);
            }

            string parameters = null;
            parameters = null == jsonData ? this.GetXFormParameter() : JsonConvert.SerializeObject(jsonData);

            using (Stream requestStream = request.GetRequestStream())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(parameters);

                requestStream.Write(bytes, 0, bytes.Length);
                requestStream.Flush();

            }

            WebResponse response = request.GetResponse();
            string data = "";
            using (StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
            {
                data = sr.ReadToEnd();

            }
            response.Close();
            //   Log.Info("~~Response Data = " + data, this);
            return JsonConvert.DeserializeObject<T>(data);
        }


        public T GetResponseResult<T>(string requestUrl, object jsonData, string method = "POST")
        {
            WebRequest request = WebRequest.Create(requestUrl);
            request.ContentType = (jsonData == null) ? "application/x-www-form-urlencoded" : "application/json";
            request.Method = method;
            if (Headers != null && Headers.Count > 0)
            {
                foreach (KeyValuePair<string, string> header in Headers)
                    request.Headers.Add(header.Key, header.Value);
            }

            string parameters = null;
            parameters = null == jsonData ? this.GetXFormParameter() : JsonConvert.SerializeObject(jsonData);
            if ("POST".Equals(method))
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    byte[] bytes = Encoding.UTF8.GetBytes(parameters);

                    requestStream.Write(bytes, 0, bytes.Length);
                    requestStream.Flush();
                }
            }

            WebResponse response = request.GetResponse();
            string data = "";
            using (StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
            {
                data = sr.ReadToEnd();
            }
            response.Close();
            //         Log.Info("Request Data = " + data, this);
            return JsonConvert.DeserializeObject<T>(data);
        }


    }
}