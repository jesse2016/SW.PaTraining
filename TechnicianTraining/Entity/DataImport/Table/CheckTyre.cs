using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace TechnicianTraining.Entity.DataImport.Table
{
    public class CheckTyre
    {

        #region Class
        /// <summary>
        /// CheckAbout
        /// </summary>
        public CheckAbout checkabout { get; set; }
        /// <summary>
        /// VehicleAndDetailsRes
        /// </summary>
        public List<VehicleAndDetailsRes> vehicleanddetailsres { get; set; }

        public class CheckAbout
        {
            /// <summary>
            /// Id
            /// </summary>
            public int Id { get; set; }
            /// <summary>
            /// MD920180404173700819
            /// </summary>
            public string OrderNum { get; set; }
            /// <summary>
            /// 3b841d40-230e-4bd3-adbf-212ff5b47dd3
            /// </summary>
            public string OrderGuid { get; set; }
            /// <summary>
            /// 门店9
            /// </summary>
            public string Checker { get; set; }
            /// <summary>
            /// 2018-04-04 17:37:00
            /// </summary>
            public DateTime CreateTime { get; set; }
            /// <summary>
            /// 13036327429
            /// </summary>
            public string Mibile { get; set; }
            /// <summary>
            /// mcc2222
            /// </summary>
            public string Name { get; set; }
            /// <summary>
            /// PlateNumber
            /// </summary>
            public string PlateNumber { get; set; }
            /// <summary>
            /// MD92320180404173700837
            /// </summary>
            public string BatchNum { get; set; }
        }

        public class ThirdDetailsList
        {
            /// <summary>
            /// 左后
            /// </summary>
            public string ThirdType { get; set; }


            /// <summary>
            /// AbnormalLevelName
            /// </summary>
            public string AbnormalLevelName { get; set; }
            /// <summary>
            /// 
            /// </summary>
            public string Remark { get; set; }

            private ThirdDetailsListValue _value;

            public ThirdDetailsListValue value
            {
                get { return _value; }
                set { _value = value; }
            }

        }



        public class VeDeDetailsList
        {
            /// <summary>
            /// ThirdDetailsList
            /// </summary>
            public List<ThirdDetailsList> ThirdDetailsList { get; set; }
            /// <summary>
            /// 倒车灯
            /// </summary>
            public string SecondType { get; set; }
        }

        public class VehicleAndDetailsRes
        {
            /// <summary>
            /// 灯光检测
            /// </summary>
            public string FirstType { get; set; }
            /// <summary>
            /// VeDeDetailsList
            /// </summary>
            public List<VeDeDetailsList> VeDeDetailsList { get; set; }
        }

        #endregion

        #region model
        public List<CheckTyre> GetTyreCheck(dynamic model)
        {
            try
            {
                List<CheckTyre> list = new List<CheckTyre>();
                if (model != null)
                {
                    CheckTyre checktyremodel = new CheckTyre();
                    if (model.CheckAbout != null)
                    {
                        dynamic headermodel = model.CheckAbout;
                        CheckAbout aboutmodel = new CheckAbout();
                        aboutmodel.Id = headermodel.Id;
                        aboutmodel.OrderNum = headermodel.OrderNum;
                        aboutmodel.OrderGuid = headermodel.OrderGuid;
                        aboutmodel.Checker = headermodel.Checker;
                        aboutmodel.CreateTime = headermodel.CreateTime;
                        aboutmodel.Mibile = headermodel.Mibile;
                        aboutmodel.Name = headermodel.Name;
                        aboutmodel.PlateNumber = headermodel.PlateNumber;
                        aboutmodel.BatchNum = headermodel.BatchNum;

                        checktyremodel.checkabout = aboutmodel;
                    }
                    if (model.VehicleAndDetailsRes != null && model.VehicleAndDetailsRes.Count > 0)
                    {
                        dynamic vehimodel = model.VehicleAndDetailsRes;
                        List<VehicleAndDetailsRes> reslist = new List<VehicleAndDetailsRes>();
                        for (int i = 0; i < vehimodel.Count; i++)
                        {
                            VehicleAndDetailsRes resmodel = new VehicleAndDetailsRes();
                            resmodel.FirstType = vehimodel[i].FirstType;

                            List<VeDeDetailsList> detaillist = new List<VeDeDetailsList>();
                            for (int j = 0; j < vehimodel[i].VeDeDetailsList.Count; j++)
                            {
                                VeDeDetailsList detailmodel = new VeDeDetailsList();
                                detailmodel.SecondType = vehimodel[i].VeDeDetailsList[j].SecondType;
                                List<ThirdDetailsList> Thirdlist = new List<ThirdDetailsList>();
                                dynamic Thirdmdynamic = vehimodel[i].VeDeDetailsList[j].ThirdDetailsList;
                                for (int k = 0; k < Thirdmdynamic.Count; k++)
                                {
                                    ThirdDetailsList Thirdmodel = new ThirdDetailsList();
                                    Thirdmodel.ThirdType = Thirdmdynamic[k].ThirdType;
                                    ThirdDetailsListValue flag;
                                    if (Enum.TryParse<ThirdDetailsListValue>(Thirdmdynamic[k].Value.ToString(), true, out flag))
                                    {
                                        Thirdmodel.value = (ThirdDetailsListValue)Enum.Parse(typeof(ThirdDetailsListValue), Thirdmdynamic[k].Value.ToString());
                                    }
                                    Thirdmodel.AbnormalLevelName = Thirdmdynamic[k].Value.ToString();
                                    Thirdmodel.Remark = Thirdmdynamic[k].Remark.ToString();
                                    Thirdlist.Add(Thirdmodel);
                                }
                                detailmodel.ThirdDetailsList = Thirdlist;
                                detaillist.Add(detailmodel);
                            }
                            resmodel.VeDeDetailsList = detaillist;
                            reslist.Add(resmodel);
                        }
                        checktyremodel.vehicleanddetailsres = reslist;
                        list.Add(checktyremodel);
                    }
                }
                return list;
            }
            catch (Exception ex)
            {
                string remark = ex.Message;
                return null;
            }
        }
    }

    #endregion

        #region enum
    public enum ThirdDetailsListValue
    {
        /// <summary>
        /// 类型1
        /// </summary> 
        [Description("未见异常")]
        TypeOne = 0,

        /// <summary>
        /// 类型2
        /// </summary> 
        [Description("留意观察")]
        TypeTwo = 1,

        /// <summary>
        /// 类型3 
        /// </summary> 
        [Description("立即检修")]
        Typethree = 2
        #endregion

    }



}