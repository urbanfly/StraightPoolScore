using Raven.Client.Document;
using Raven.Client.Embedded;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace StraightPoolScore.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static DocumentStore Store { get; set; }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            var eStore = new EmbeddableDocumentStore
            {
                ConnectionStringName = "RavenDB",
            };
            eStore.Conventions.DefaultQueryingConsistency = ConsistencyOptions.AlwaysWaitForNonStaleResultsAsOfLastWrite;
            if (IsDebug)
            {
                eStore.UseEmbeddedHttpServer = true;
            }
            eStore.Initialize();
            Store = eStore;
        }

        public static string Environment
        {
            get
            {
                return ConfigurationManager.AppSettings["Environment"];
            }
        }

        public static bool IsDebug
        {
            get
            {
                return Environment == "Debug";
            }
        }
    }
}