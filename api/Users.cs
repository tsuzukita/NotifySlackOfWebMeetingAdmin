using System;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
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
using Newtonsoft.Json.Serialization;
using FluentValidation;

namespace NotifySlackOfWebMeetingAdmin.Apis
{
    public static class Users
    {
        /// <summary>
        /// ユーザーを登録する。
        /// </summary>
        /// <returns>登録したユーザー情報</returns>
        [FunctionName("AddUsers")]
        public static async Task<IActionResult> AddUsers(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Users")] HttpRequest req,
            [CosmosDB(
                databaseName: "notify-slack-of-web-meeting-db",
                collectionName: "Users",
                ConnectionStringSetting = "CosmosDbConnectionString")]IAsyncCollector<dynamic> documentsOut,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            string message = string.Empty;

            try
            {

                log.LogInformation("POST Users");

                // リクエストのBODYからパラメータ取得
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                // エンティティに設定
                User user = new User()
                {
                    Name = data?.name,
                    EmailAddress = data?.emailAddress,
                };

                // 入力値チェックを行う
                var validator = new UserValidator();
                validator.ValidateAndThrow(user);

                // ユーザーを登録
                message = await AddUser(documentsOut, user);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }

            return new OkObjectResult(message);
        }

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
                    EmailAddress = req.Query["emailAddress"]
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
        /// ユーザーを追加する
        /// </summary>
        /// <param name="documentsOut">CosmosDBのドキュメント</param>
        /// <param name="user">ユーザー情報</param>
        /// <returns></returns>
        internal static async Task<string> AddUser(
            IAsyncCollector<dynamic> documentsOut,
            User user)
        {
            string documentItem = JsonConvert.SerializeObject(user, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            await documentsOut.AddAsync(documentItem);
            return documentItem;
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
