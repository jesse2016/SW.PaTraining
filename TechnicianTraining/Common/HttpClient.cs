using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace TechnicianTraining.Common
{
    public class HttpClient
    {
        //执行http调用
        public static string RequestPost(string url, string postData, string sessionId = "")
        {
            string response = string.Empty;
            StreamReader sr = null;
            HttpWebResponse wr = null;

            HttpWebRequest hp = null;
            try
            {
                hp = (HttpWebRequest)WebRequest.Create(url);

                hp.Timeout = 10 * 60 * 1000; //超时时间
                if (postData != null)
                {
                    byte[] data = Encoding.UTF8.GetBytes(postData);
                    hp.Method = "POST";
                    hp.ContentLength = data.Length;
                    hp.ContentType = "text/json";
                    if (sessionId != string.Empty)
                    {
                        hp.Headers.Add("SessionId", sessionId);
                    }

                    Stream ws = hp.GetRequestStream();

                    // 发送数据
                    ws.Write(data, 0, data.Length);
                    ws.Close();
                }

                wr = (HttpWebResponse)hp.GetResponse();
                sr = new StreamReader(wr.GetResponseStream(), Encoding.UTF8);

                response = sr.ReadToEnd();
                sr.Close();
                wr.Close();
            }
            catch (Exception exp)
            {
                throw exp;
            }

            return response;
        }
    }
}