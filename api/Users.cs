using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using NotifySlackOfWebMeetingAdmin.Apis.Entities;
using NotifySlackOfWebMeetingAdmin.Apis.Queries;
using Microsoft.Azure.Documents.Linq;
using System.Linq;

namespace NotifySlackOfWebMeetingAdmin.Apis
{
    public static class Users
    {
        [FunctionName("GetUsers")]
        public static async Task<IActionResult> GetUsers(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Users")] HttpRequest req,
            [CosmosDB(
                databaseName: "notify-slack-of-web-meeting-db",
                collectionName: "Users",
                ConnectionStringSetting = "CosmosDbConnectionString")
            ]DocumentClient client,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            string message = string.Empty;

            try
            {
                log.LogInformation("GET Users");

                // クエリパラメータから検索条件パラメータを設定
                UsersQueryParameter queryParameter = new UsersQueryParameter()
                {
                    Ids = req.Query["ids"],
                    Name = req.Query["name"],
                    EmailAddress = req.Query["emailAddress"],
                    UserPrincipal = req.Query["userPrincipal"]
                };

                // ユーザー情報を取得
                message = JsonConvert.SerializeObject(await GetUsers(client, queryParameter, log));
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }

            return new OkObjectResult(message);
        }

        /// <summary>
        /// ユーザー情報一覧を取得する。
        /// </summary>
        internal static async Task<IEnumerable<User>> GetUsers(
                   DocumentClient client,
                   UsersQueryParameter queryParameter,
                   ILogger log
                   )
        {
            // Get a JSON document from the container.
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("notify-slack-of-web-meeting-db", "Users");
            IDocumentQuery<User> query = client.CreateDocumentQuery<User>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true, PopulateQueryMetrics = true })
                .Where(queryParameter.GetWhereExpression())
                .AsDocumentQuery();

            var documentItems = new List<User>();
            while (query.HasMoreResults)
            {
                foreach (var documentItem in await query.ExecuteNextAsync<User>())
                {
                    documentItems.Add(documentItem);
                }
            }
            return documentItems;
        }
    }
}
